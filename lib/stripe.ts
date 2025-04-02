import Stripe from 'stripe';

// Initialize Stripe only on the server side
let stripe: Stripe | null = null;

// Only initialize Stripe on the server side
if (typeof window === 'undefined' && process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia', // Updated to the latest API version
  });
}

// Plans configuration - this can be safely accessed on both client and server
export const PLANS = {
  free: {
    name: 'Free',
    credits: 10,
    stripe_price_id: null,
  },
  basic: {
    name: 'Basic',
    credits: 50,
    stripe_price_id: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID,
  },
  pro: {
    name: 'Pro',
    credits: 1000, // Using a high number for "unlimited"
    stripe_price_id: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  }
};

// Function to get the credit limit for a specific plan
export function getPlanLimit(planName: keyof typeof PLANS): number {
  return PLANS[planName]?.credits || PLANS.free.credits;
}

// Make sure we export Stripe instance safely
export { stripe };

// Function to create a checkout session (server-side only)
export async function createCheckoutSession({
  priceId,
  customerId,
  email,
  successUrl,
  cancelUrl,
}: {
  priceId: string;
  customerId?: string;
  email?: string;
  successUrl: string;
  cancelUrl: string;
}) {
  if (!stripe) {
    throw new Error('Stripe is not initialized. This function can only be called server-side.');
  }

  try {
    // Create a new Checkout Session
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${successUrl}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${cancelUrl}?checkout=cancelled`,
      customer: customerId,
      customer_email: !customerId ? email : undefined,
    });

    return { url: session.url, sessionId: session.id };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Function to retrieve customer information (server-side only)
export async function getCustomer(customerId: string) {
  if (!stripe) {
    throw new Error('Stripe is not initialized. This function can only be called server-side.');
  }

  try {
    return await stripe.customers.retrieve(customerId);
  } catch (error) {
    console.error('Error retrieving customer:', error);
    throw error;
  }
}

// Function to retrieve subscription information (server-side only)
export async function getSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe is not initialized. This function can only be called server-side.');
  }

  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    throw error;
  }
}

// Function to create or get a customer (server-side only)
export async function createOrRetrieveCustomer(email: string, name?: string) {
  if (!stripe) {
    throw new Error('Stripe is not initialized. This function can only be called server-side.');
  }

  // Check if customer already exists
  const customers = await stripe.customers.list({ email });
  
  if (customers.data.length > 0) {
    // Return existing customer
    return customers.data[0];
  }
  
  // Create new customer
  return stripe.customers.create({
    email,
    name,
  });
}

// Function to cancel a subscription (server-side only)
export async function cancelSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe is not initialized. This function can only be called server-side.');
  }

  try {
    return await stripe.subscriptions.cancel(subscriptionId);
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
} 