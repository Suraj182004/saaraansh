'use server';
import { summarizeText } from "@/lib/gemini";
import { db, pdfSummaries, users } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { hasAvailableCredits, incrementCreditsUsed, ensureUserExists } from "@/lib/credits";
import { eq } from "drizzle-orm";
import { fetchAndExtractPdfText } from "@/lib/langchain";

interface UploadResponse {
    url: string;
    name: string;
    size: number;
    key: string;
    serverData: null;
}

interface SummaryResult {
    success: boolean;
    error?: string;
    data: {
        id?: string;
        summary?: string;
        originalText?: string;
        fileName?: string;
        url?: string;
    } | null;
}

export async function generatePdfSummary(uploadResponse: UploadResponse | UploadResponse[]): Promise<SummaryResult> {
    try {
        // Get the user ID from auth
        const authData = await auth();
        const userId = authData.userId;

        if (!userId) {
            return {
                success: false,
                error: "User not authenticated",
                data: null
            };
        }

        // Ensure user exists in our database
        const userExists = await ensureUserExists(userId);
        
        if (!userExists) {
            return {
                success: false,
                error: "Failed to create user in the database",
                data: null
            };
        }

        // Check if user has available credits
        const hasCredits = await hasAvailableCredits(userId);
        
        if (!hasCredits) {
            return { 
                success: false, 
                error: "You've reached your monthly limit of summaries. Please upgrade your plan for more.",
                data: null
            };
        }

        if (!uploadResponse) {
            return {
                success: false,
                error: "No PDF was uploaded",
                data: null
            };
        }

        // Handle both array and single object response
        const uploadData = Array.isArray(uploadResponse) 
            ? (uploadResponse.length > 0 ? uploadResponse[0] : null) 
            : uploadResponse;
        
        if (!uploadData || !uploadData.url) {
            return {
                success: false,
                error: "Invalid upload response format",
                data: null
            };
        }

        const pdfUrl = uploadData.url;
        const fileName = uploadData.name || 'document.pdf';

        if (!pdfUrl) {
            return {
                success: false,
                error: "No PDF URL found",
                data: null
            };
        }

        // Step 1: Extract text from PDF using Langchain
        console.log("Extracting text from PDF:", pdfUrl);
        const pdfText = await fetchAndExtractPdfText(pdfUrl);

        if (!pdfText || pdfText.trim().length === 0) {
            console.error("Extracted text is empty");
            return {
                success: false,
                error: "Could not extract text from PDF",
                data: {
                    fileName,
                    url: pdfUrl
                }
            };
        }

        // Step 2: Generate summary using Gemini AI
        console.log("Generating summary using Gemini");
        let summary = "";
        try {
            summary = await summarizeText(pdfText);
        } catch (error) {
            console.error("Error generating summary with Gemini:", error);
            return {
                success: false,
                error: "Failed to generate summary with AI",
                data: {
                    fileName,
                    url: pdfUrl
                }
            };
        }

        if (!summary || summary.trim().length === 0) {
            console.error("Generated summary is empty");
            return {
                success: false,
                error: "Failed to generate summary",
                data: {
                    fileName,
                    url: pdfUrl
                }
            };
        }

        // Step 3: Save summary to database
        console.log("Inserting summary into database");
        const insertResult = await db.insert(pdfSummaries).values({
            userId: userId,
            originalFileUrl: pdfUrl,
            summaryText: summary,
            fileName: fileName,
        }).returning({ insertedId: pdfSummaries.id });
        
        const dbId = insertResult[0]?.insertedId;
        
        // Increment the user's credits used
        await incrementCreditsUsed(userId);

        // Step 4: Return success with data
        return {
            success: true,
            data: {
                id: dbId,
                summary: summary,
                fileName: fileName,
                url: pdfUrl
            }
        };
    } catch (error) {
        console.error("Error generating PDF summary:", error);
        return {
            success: false,
            error: "Error generating PDF summary",
            data: null
        };
    }
}