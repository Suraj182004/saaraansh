import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { updateUserPlan } from '@/lib/credits';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

// Disable Next.js body parsing for webhooks
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to get the raw request body
async function getBody(req: Request): Promise<string> {
  const reader = req.body?.getReader();
  if (!reader) return '';
  
  const chunks: Uint8Array[] = [];
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  
  const concatenated = new Uint8Array(
    chunks.reduce((acc, chunk) => acc + chunk.length, 0)
  );
  
  let offset = 0;
  for (const chunk of chunks) {
    concatenated.set(chunk, offset);
    offset += chunk.length;
  }
  
  return new TextDecoder().decode(concatenated);
}

export async function POST(req: NextRequest) {
  try {
    console.log('Stripe webhook received');
    const body = await getBody(req);
    const signature = req.headers.get('stripe-signature') as string;
    
    if (!signature || !body) {
      console.error('Missing stripe-signature or body');
      return NextResponse.json(
        { error: 'Missing stripe-signature or body' },
        { status: 400 }
      );
    }
    
    // Verify Stripe webhook signature
    let event: Stripe.Event;
    try {
      if (!stripe) {
        throw new Error('Stripe is not initialized. This function can only be called server-side.');
      }
      
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
      console.log(`Verified webhook event: ${event.type}`);
    } catch (err) {
      const error = err as Error;
      console.error(`Webhook signature verification failed: ${error.message}`);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${error.message}` },
        { status: 400 }
      );
    }
    
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`Processing checkout.session.completed for session ${session.id}`);
        
        // Extract customer ID and subscription ID
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        
        if (!customerId) {
          console.error('No customer ID in the session object');
          break;
        }
        
        // Try to find user by customer ID first
        let userResults = await db
          .select({
            id: users.id,
            email: users.email
          })
          .from(users)
          .where(eq(users.customerId, customerId))
          .limit(1);
        
        // If no user found by customer ID, try to find by email
        if (userResults.length === 0 && session.customer_details?.email) {
          console.log(`No user found with customer ID ${customerId}, trying email lookup`);
          userResults = await db
            .select({
              id: users.id,
              email: users.email
            })
            .from(users)
            .where(eq(users.email, session.customer_details.email))
            .limit(1);
            
          // If user found by email, update their customer ID
          if (userResults.length > 0) {
            await db
              .update(users)
              .set({ customerId: customerId })
              .where(eq(users.id, userResults[0].id));
          }
        }
        
        if (userResults.length === 0) {
          console.error(`No user found for checkout session ${session.id}, customer: ${customerId}, email: ${session.customer_details?.email}`);
          break;
        }
        
        console.log(`Found user: ${userResults[0].id} (${userResults[0].email})`);
        
        // Get subscription details to determine plan
        if (!subscriptionId) {
          console.error('No subscription ID in the session object');
          break;
        }
        
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;
        
        // Determine which plan based on price ID
        let planName: 'basic' | 'pro' = 'basic';
        if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
          planName = 'pro';
        }
        
        console.log(`Updating user ${userResults[0].id} to plan: ${planName}`);
        
        // Update user's plan
        await updateUserPlan(userResults[0].id, planName, {
          customerId,
          subscriptionId,
        });
        
        console.log(`User ${userResults[0].id} updated to ${planName} plan successfully`);
        
        // Update subscription status
        await db
          .update(users)
          .set({
            subscriptionStatus: 'active',
            updatedAt: new Date()
          })
          .where(eq(users.id, userResults[0].id));
          
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Processing customer.subscription.updated for subscription ${subscription.id}`);
        
        // Find user with this subscription ID
        const userResults = await db
          .select({
            id: users.id,
            email: users.email
          })
          .from(users)
          .where(eq(users.subscriptionId, subscription.id))
          .limit(1);
        
        if (userResults.length === 0) {
          console.error(`No user found with subscription ID: ${subscription.id}`);
          break;
        }
        
        console.log(`Found user: ${userResults[0].id} (${userResults[0].email})`);
        
        // Get the price ID and determine the plan
        const priceId = subscription.items.data[0].price.id;
        
        let planName: 'basic' | 'pro' = 'basic';
        if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
          planName = 'pro';
        }
        
        // Update the user's plan
        await updateUserPlan(userResults[0].id, planName);
        
        // Update subscription status
        await db
          .update(users)
          .set({
            subscriptionStatus: subscription.status,
            updatedAt: new Date()
          })
          .where(eq(users.id, userResults[0].id));
          
        console.log(`User ${userResults[0].id} updated to ${planName} plan with status ${subscription.status}`);
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Processing customer.subscription.deleted for subscription ${subscription.id}`);
        
        // Find user with this subscription ID
        const userResults = await db
          .select({
            id: users.id,
            email: users.email
          })
          .from(users)
          .where(eq(users.subscriptionId, subscription.id))
          .limit(1);
        
        if (userResults.length === 0) {
          console.error(`No user found with subscription ID: ${subscription.id}`);
          break;
        }
        
        console.log(`Found user: ${userResults[0].id} (${userResults[0].email})`);
        
        // Downgrade to free plan
        await updateUserPlan(userResults[0].id, 'free');
        
        // Update subscription status
        await db
          .update(users)
          .set({
            subscriptionStatus: 'canceled',
            updatedAt: new Date()
          })
          .where(eq(users.id, userResults[0].id));
          
        console.log(`User ${userResults[0].id} downgraded to free plan`);
        break;
      }
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 