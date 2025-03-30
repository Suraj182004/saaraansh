import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getUserCredits } from '@/lib/credits';

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated
    const authData = await auth();
    const userId = authData?.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in and try again.' },
        { status: 401 }
      );
    }
    
    // Get user information from database
    const user = await getUserCredits(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Make sure user has a customerId
    if (!user.customerId) {
      return NextResponse.json(
        { error: 'No subscription found for this user' },
        { status: 400 }
      );
    }

    // Ensure stripe is initialized before using it
    if (!stripe) {
      throw new Error('Stripe is not initialized. This function can only be called server-side.');
    }
    
    // Create a billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: user.customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || req.headers.get('origin')}/dashboard`,
    });
    
    // Return the URL to redirect to
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 