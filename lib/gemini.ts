import { GoogleGenerativeAI } from "@google/generative-ai";

// Check API key at startup time
if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Try different model names if one fails
const MODEL_NAMES = ["gemini-2.0-flash", "gemini-pro", "gemini-1.0-pro"];

export async function summarizeText(text: string): Promise<string> {
    if (!text || text.trim().length === 0) {
        console.warn("Attempted to summarize empty or whitespace-only text.");
        return ""; // Return empty string for empty input
    }
    
    // Log the initial API key for debugging (partially hidden)
    const apiKey = process.env.GOOGLE_API_KEY || "";
    const maskedKey = apiKey.substring(0, 4) + "..." + apiKey.substring(apiKey.length - 4);
    console.log(`Attempting to use Gemini API with key: ${maskedKey}`);
    
    // Create a more explicit prompt that doesn't allow the model to "talk back"
    const prompt = `SYSTEM: You are a PDF summarization system. You will be given text extracted from a PDF document. Your task is to create a comprehensive summary of this text. Do not ask questions or engage in dialogue. Only output the summary itself.

TEXT TO SUMMARIZE:
${text}

OUTPUT ONLY A SUMMARY OF THE ABOVE TEXT USING PLAIN TEXT FORMAT (NOT MARKDOWN):

SUMMARY

MAIN POINTS:
• [First main point]
• [Second main point]
• [Additional main points as needed]

KEY FINDINGS:
• [First key finding]
• [Second key finding]
• [Additional key findings as needed]

IMPORTANT DETAILS:
• [First important detail]
• [Second important detail]
• [Additional important details as needed]

The summary should be detailed but concise, highlighting only the most important information from the document.`;

    // Try each model name in sequence until one works
    let lastError = null;
    
    for (const modelName of MODEL_NAMES) {
        try {
            console.log(`Attempting with model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            
            console.log("Sending request to Gemini API...");
            const result = await model.generateContent(prompt);
            console.log("Received response from Gemini API");
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error(`Error with model ${modelName}:`, error);
            lastError = error;
            // Continue to the next model name
        }
    }
    
    // If we get here, all model attempts failed
    console.error("=== ALL GEMINI MODEL ATTEMPTS FAILED ===");
    console.error(lastError);
    
    // Extract more helpful error message
    let errorMessage = "Failed to generate summary after trying multiple Gemini models.";
    
    if (lastError instanceof Error) {
        errorMessage = `Gemini API Error: ${lastError.message}`;
        console.error("Last error name:", lastError.name);
        console.error("Last error message:", lastError.message);
    }
    
    // Return specific error for the client
    return `Error: ${errorMessage}`;
} 