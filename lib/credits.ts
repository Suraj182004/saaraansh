import { db, users } from '@/lib/db';
import { eq, and, gt, lt, sql } from 'drizzle-orm';
import { getPlanLimit, PLANS } from './stripe';
import { addMonths } from 'date-fns';
import { currentUser } from '@clerk/nextjs/server';

/**
 * Check if a user has available credits
 */
export async function hasAvailableCredits(userId: string): Promise<boolean> {
  const userCredits = await getUserCredits(userId);
  
  if (!userCredits) {
    return false;
  }
  
  // If user is on the Pro plan, they always have credits
  if (userCredits.plan === 'pro') {
    return true;
  }
  
  // Check if user has reached their plan limit
  const planLimit = PLANS[userCredits.plan as keyof typeof PLANS]?.credits || PLANS.free.credits;
  return (userCredits.creditsUsed ?? 0) < planLimit;
}

/**
 * Get a user's credits information
 */
export async function getUserCredits(userId: string) {
  if (!userId) return null;
  
  // Check if user exists in the database using Drizzle syntax
  const userResults = await db
    .select({
      id: users.id,
      plan: users.plan,
      creditsUsed: users.creditsUsed,
      nextResetDate: users.nextResetDate,
      customerId: users.customerId,
      subscriptionId: users.subscriptionId,
      subscriptionStatus: users.subscriptionStatus
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  
  return userResults.length > 0 ? userResults[0] : null;
}

/**
 * Ensure user exists in the database, create if they don't
 */
export async function ensureUserExists(userId: string): Promise<boolean> {
  if (!userId) return false;
  
  try {
    // Check if user exists
    const userCredits = await getUserCredits(userId);
    
    // If user already exists, return true
    if (userCredits) return true;
    
    // User doesn't exist, get details from Clerk and create them
    const user = await currentUser();
    
    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      console.error("User or email not available from Clerk");
      return false;
    }
    
    // Get primary email address
    const primaryEmail = user.emailAddresses[0].emailAddress;
    
    if (!primaryEmail) {
      console.error("Primary email address not found");
      return false;
    }
    
    console.log(`Creating user with email: ${primaryEmail}`);
    
    // Create a new user record
    await db.insert(users).values({
      id: userId,
      email: primaryEmail,
      plan: 'free',
      creditsUsed: 0,
      creditsLimit: 10,
      nextResetDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    });
    
    return true;
  } catch (error) {
    console.error("Error ensuring user exists:", error);
    return false;
  }
}

/**
 * Increment a user's credits used
 */
export async function incrementCreditsUsed(userId: string): Promise<void> {
  // First check if we need to reset the credits
  await checkAndResetCredits(userId);
  
  // Now increment the credits used
  await db
    .update(users)
    .set({
      creditsUsed: sql`${users.creditsUsed} + 1`,
      updatedAt: new Date()
    })
    .where(eq(users.id, userId));
}

/**
 * Check if the credits need to be reset and do so if necessary
 */
export async function checkAndResetCredits(userId: string): Promise<void> {
  const userResults = await db
    .select({
      nextResetDate: users.nextResetDate,
      plan: users.plan
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  
  if (userResults.length === 0) return;
  
  const user = userResults[0];
  const now = new Date();
  const resetDate = user.nextResetDate ? new Date(user.nextResetDate) : null;
  
  // If the reset date has passed or doesn't exist, reset credits
  if (!resetDate || resetDate < now) {
    await db
      .update(users)
      .set({
        creditsUsed: 0,
        lastResetDate: now,
        nextResetDate: addMonths(now, 1), // Reset to 0 and set next reset date to 1 month from now
        updatedAt: now
      })
      .where(eq(users.id, userId));
  }
}

/**
 * Update a user's subscription plan
 */
export async function updateUserPlan(
  userId: string, 
  plan: keyof typeof PLANS, 
  stripeData?: { 
    customerId?: string; 
    subscriptionId?: string;
  }
) {
  const now = new Date();
  
  await db
    .update(users)
    .set({
      plan,
      creditsUsed: 0, // Reset credits when changing plans
      creditsLimit: PLANS[plan].credits,
      lastResetDate: now,
      nextResetDate: addMonths(now, 1),
      // Only update Stripe data if provided
      ...(stripeData?.customerId && { customerId: stripeData.customerId }),
      ...(stripeData?.subscriptionId && { subscriptionId: stripeData.subscriptionId }),
      updatedAt: now
    })
    .where(eq(users.id, userId));
} 