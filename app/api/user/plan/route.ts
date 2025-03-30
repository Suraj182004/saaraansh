import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserCredits, updateUserPlan } from "@/lib/credits";
import { db, users } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET() {
  const authData = await auth();
  const userId = authData.userId;
  
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  try {
    // First check if user exists
    let userCredits = await getUserCredits(userId);
    
    // If user doesn't exist in our database yet, create them
    if (!userCredits) {
      // Get user details from Clerk
      const user = await currentUser();
      
      if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
        return NextResponse.json(
          { error: "User or email not available from Clerk" },
          { status: 400 }
        );
      }
      
      // Get primary email address
      const primaryEmail = user.emailAddresses[0].emailAddress;
      
      if (!primaryEmail) {
        return NextResponse.json(
          { error: "Primary email address not found" },
          { status: 400 }
        );
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
      
      // Fetch the newly created user
      userCredits = await getUserCredits(userId);
      
      if (!userCredits) {
        return NextResponse.json(
          { error: "Failed to create user" },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json({
      plan: userCredits.plan || 'free',
      creditsUsed: userCredits.creditsUsed || 0,
      subscriptionStatus: userCredits.subscriptionStatus || 'inactive'
    });
  } catch (error) {
    console.error("Error fetching user plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Manual endpoint to update user plan (for testing)
export async function PATCH(request: Request) {
  const authData = await auth();
  const userId = authData.userId;
  
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  try {
    const { plan } = await request.json();
    
    if (!plan || !['free', 'basic', 'pro'].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan. Must be one of: free, basic, pro" },
        { status: 400 }
      );
    }
    
    console.log(`Manually updating user ${userId} to plan: ${plan}`);
    
    // Update the user's plan
    await updateUserPlan(userId, plan as any);
    
    // Get the updated user info
    const userCredits = await getUserCredits(userId);
    
    if (!userCredits) {
      return NextResponse.json(
        { error: "User not found after update" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      plan: userCredits.plan || 'free',
      creditsUsed: userCredits.creditsUsed || 0,
      subscriptionStatus: userCredits.subscriptionStatus || 'inactive',
      message: `Plan updated to ${plan} successfully`
    });
  } catch (error) {
    console.error("Error updating user plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 