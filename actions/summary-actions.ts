'use server';

import { db, pdfSummaries, users } from "@/lib/db";
import { eq, and, desc } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";

export interface SummaryData {
    id: string;
    summaryText: string;
    fileName: string | null;
    originalFileUrl: string;
    createdAt: Date | null;
}

// Helper function to ensure user exists in the database
async function ensureUserExists(userId: string): Promise<boolean> {
    // Check if user exists in the database
    const userExists = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
    
    if (userExists.length > 0) {
        return true; // User already exists
    }
    
    // User doesn't exist, create them
    try {
        // Get user details from Clerk
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
        
        // Create the user
        await db.insert(users).values({
            id: userId,
            email: primaryEmail,
            plan: 'free',
            creditsUsed: 0,
            creditsLimit: 10,
            nextResetDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        });
        
        console.log(`Created new user in database with ID: ${userId}`);
        return true;
    } catch (error) {
        console.error("Failed to create user in database:", error);
        return false;
    }
}

export async function getSummaryById(id: string): Promise<SummaryData | null> {
    const authData = await auth();
    const userId = authData.userId;

    if (!userId) {
        console.error("Attempted to fetch summary without authentication.");
        return null;
    }

    if (!id) {
        console.error("Summary ID is missing.");
        return null;
    }

    // Ensure the user exists in our database
    const userExists = await ensureUserExists(userId);
    if (!userExists) {
        console.error("Failed to ensure user exists in database");
        return null;
    }

    try {
        console.log(`Fetching summary with ID: ${id} for user: ${userId}`);
        const results = await db.select({
            id: pdfSummaries.id,
            summaryText: pdfSummaries.summaryText,
            fileName: pdfSummaries.fileName,
            originalFileUrl: pdfSummaries.originalFileUrl,
            createdAt: pdfSummaries.createdAt
        })
        .from(pdfSummaries)
        .where(
            and(
                eq(pdfSummaries.id, id),
                eq(pdfSummaries.userId, userId)
            )
        )
        .limit(1);

        if (results.length === 0) {
            console.warn(`Summary not found for ID: ${id} and user: ${userId}`);
            return null;
        }

        console.log(`Summary found for ID: ${id}`);
        return results[0];

    } catch (error) {
        console.error(`Error fetching summary with ID: ${id}`, error);
        return null; // Return null on error
    }
}

export async function getAllUserSummaries(): Promise<SummaryData[]> {
    const authData = await auth();
    const userId = authData.userId;

    if (!userId) {
        console.error("Attempted to fetch summaries without authentication.");
        return []; // Return empty array if not authenticated
    }

    // Ensure the user exists in our database
    const userExists = await ensureUserExists(userId);
    if (!userExists) {
        console.error("Failed to ensure user exists in database");
        return [];
    }

    try {
        console.log(`Fetching all summaries for user: ${userId}`);
        const results = await db.select({
            id: pdfSummaries.id,
            summaryText: pdfSummaries.summaryText,
            fileName: pdfSummaries.fileName,
            originalFileUrl: pdfSummaries.originalFileUrl,
            createdAt: pdfSummaries.createdAt
        })
        .from(pdfSummaries)
        .where(eq(pdfSummaries.userId, userId))
        .orderBy(desc(pdfSummaries.createdAt)); // Most recent first

        console.log(`Found ${results.length} summaries for user: ${userId}`);
        return results;

    } catch (error) {
        console.error(`Error fetching summaries for user: ${userId}`, error);
        return []; // Return empty array on error
    }
} 