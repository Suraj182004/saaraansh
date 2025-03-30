import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, createOrRetrieveCustomer, PLANS } from '@/lib/stripe';
import { getUserCredits, ensureUserExists } from '@/lib/credits';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    // Get the plan ID from the request body
    const { planId } = await req.json();
    
    // Check if user is authenticated
    const authData = await auth();
    const userId = authData?.userId;
    
    if (!userId) {
      const authHeaders = req.headers.get('authorization') || 'No authorization header';
      console.error(`Unauthorized access attempt to checkout API. Session details: ${JSON.stringify({
        headers: authHeaders.substring(0, 20) + '...',
        url: req.url,
        method: req.method,
      })}`);
      
      return NextResponse.json(
        { error: 'Unauthorized. Please log in and try again.' },
        { status: 401 }
      );
    }
    
    // Validate plan ID
    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }
    
    // Map planId to Stripe price ID
    const priceId = planId === 'basic' 
      ? process.env.STRIPE_BASIC_PRICE_ID 
      : planId === 'pro' 
        ? process.env.STRIPE_PRO_PRICE_ID 
        : null;
        
    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }
    
    console.log(`Processing checkout for user ${userId} with plan ${planId}`);
    
    // Ensure user exists in our database
    const userExists = await ensureUserExists(userId);
    if (!userExists) {
      console.error(`Failed to create user with ID ${userId} in the database`);
      return NextResponse.json(
        { error: 'Failed to create user in the database' },
        { status: 500 }
      );
    }
    
    // Get user information from database
    const user = await getUserCredits(userId);
    if (!user) {
      console.error(`User with ID ${userId} not found despite ensureUserExists`);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get user email directly from Clerk
    const clerkUser = await currentUser();
    if (!clerkUser || !clerkUser.emailAddresses || clerkUser.emailAddresses.length === 0) {
      console.error(`Could not retrieve email for user ${userId}`);
      return NextResponse.json(
        { error: 'User email not available' },
        { status: 400 }
      );
    }
    
    const email = clerkUser.emailAddresses[0].emailAddress;
    const fullName = clerkUser.firstName && clerkUser.lastName 
      ? `${clerkUser.firstName} ${clerkUser.lastName}` 
      : clerkUser.firstName || 'User';
    
    // If user doesn't have a customer ID, create one or retrieve existing
    let customerId = user.customerId;
    
    if (!customerId) {
      console.log(`Creating new Stripe customer for user ${userId} (${email})`);
      try {
        const customer = await createOrRetrieveCustomer(email, fullName);
        customerId = customer.id;
        
        // Update the user with the new customer ID
        await db
          .update(users)
          .set({ 
            customerId: customerId,
            updatedAt: new Date()
          })
          .where(eq(users.id, userId));
          
        console.log(`Updated user ${userId} with Stripe customer ID: ${customerId}`);
      } catch (error) {
        console.error(`Failed to create Stripe customer for ${email}:`, error);
        return NextResponse.json(
          { error: 'Failed to create Stripe customer' },
          { status: 500 }
        );
      }
    }
    
    // Create the checkout session
    const { url, sessionId } = await createCheckoutSession({
      priceId,
      customerId: customerId || undefined,
      email: email, // Fallback in case customerId is still undefined
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL || req.headers.get('origin')}/dashboard?checkout=success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || req.headers.get('origin')}/dashboard?checkout=cancelled`,
    });
    
    if (!url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }
    
    console.log(`Checkout session created for user ${userId} with sessionId ${sessionId}`);
    return NextResponse.json({ url, sessionId });
  } catch (error) {
    console.error('Error in checkout API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 