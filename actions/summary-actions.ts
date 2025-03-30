'use server';

import { auth } from "@clerk/nextjs/server";
import { db, pdfSummaries, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type SummaryData = {
    id: string;
    userId: string;
    fileName: string | null;
    fileUrl: string;
    summaryText: string;
    createdAt: Date | null;
    originalFileUrl?: string;
}

export async function getAllUserSummaries(): Promise<SummaryData[]> {
    try {
        const authData = await auth();
        const userId = authData.userId;
        
        if (!userId) {
            throw new Error("Authentication required");
        }

        const userSummaries = await db
            .select({
                id: pdfSummaries.id,
                userId: pdfSummaries.userId,
                fileName: pdfSummaries.fileName,
                fileUrl: pdfSummaries.originalFileUrl,
                summaryText: pdfSummaries.summaryText,
                createdAt: pdfSummaries.createdAt,
                originalFileUrl: pdfSummaries.originalFileUrl
            })
            .from(pdfSummaries)
            .where(eq(pdfSummaries.userId, userId))
            .orderBy(pdfSummaries.createdAt);

        return userSummaries;
    } catch (error) {
        console.error("Error fetching summaries:", error);
        throw new Error("Failed to fetch summaries");
    }
}

export async function getSummaryById(summaryId: string): Promise<SummaryData | null> {
    try {
        const authData = await auth();
        const userId = authData.userId;
        
        if (!userId) {
            throw new Error("Authentication required");
        }

        const summary = await db
            .select({
                id: pdfSummaries.id,
                userId: pdfSummaries.userId,
                fileName: pdfSummaries.fileName,
                fileUrl: pdfSummaries.originalFileUrl,
                summaryText: pdfSummaries.summaryText,
                createdAt: pdfSummaries.createdAt,
                originalFileUrl: pdfSummaries.originalFileUrl
            })
            .from(pdfSummaries)
            .where(eq(pdfSummaries.id, summaryId))
            .limit(1);

        if (summary.length === 0) {
            return null;
        }

        // Check if the summary belongs to the current user
        if (summary[0].userId !== userId) {
            throw new Error("Unauthorized access to summary");
        }

        return summary[0];
    } catch (error) {
        console.error("Error fetching summary:", error);
        throw new Error("Failed to fetch summary");
    }
} 