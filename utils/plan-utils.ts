import { PLANS } from "@/lib/stripe";

export type PlanType = keyof typeof PLANS;

/**
 * Get the credits limit for a given plan
 */
export function getPlanLimit(plan: PlanType = 'free'): number {
  return PLANS[plan]?.credits || PLANS.free.credits;
}

/**
 * Calculate remaining credits for a user
 */
export function getRemainingCredits(plan: PlanType, creditsUsed: number): number {
  const limit = getPlanLimit(plan);
  
  // If it's a pro plan with "unlimited" credits, return a high number
  if (plan === 'pro') {
    return Infinity;
  }
  
  return Math.max(0, limit - creditsUsed);
}

/**
 * Format the remaining credits display
 */
export function formatCredits(remaining: number): string {
  if (remaining === Infinity) {
    return "Unlimited";
  }
  
  return `${remaining} left`;
}

/**
 * Get the plan usage as a percentage
 */
export function getPlanUsage(plan: PlanType, creditsUsed: number): number {
  if (plan === 'pro') {
    // For pro plan, show usage based on what would be a basic plan limit
    const basicLimit = PLANS.basic.credits;
    return Math.min(100, (creditsUsed / basicLimit) * 100);
  }
  
  const limit = getPlanLimit(plan);
  return Math.min(100, (creditsUsed / limit) * 100);
} 