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
    const prompt = `SYSTEM: You are Saaraansh, an advanced PDF summarization expert. You transform complex documents into beautiful, well-structured summaries. Your summaries are comprehensive and detailed, highlighting all important information. Don't hesitate to create a lengthy summary if the document is complex or information-rich.

TEXT TO SUMMARIZE:
${text}

GENERATE A COMPREHENSIVE, WELL-FORMATTED SUMMARY WITH THE FOLLOWING STRUCTURE:

# EXECUTIVE SUMMARY
[A concise 3-5 sentence overview of the entire document that captures its essence and main purpose]

## 📌 KEY HIGHLIGHTS
• [First key highlight with detailed explanation]
• [Second key highlight with context and significance]
• [Third key highlight with implications]
• [Add as many key highlights as needed to fully represent the document's important points]

## 🔍 MAIN CONCEPTS & TERMINOLOGY
• [First main concept with thorough explanation and examples if present]
• [Second main concept with detailed breakdown]
• [Include any specialized terminology with definitions]
• [Continue with all important concepts from the document]

## 📊 DETAILED FINDINGS & EVIDENCE
• [First important finding with all supporting evidence, data points, and context]
• [Second important finding with comprehensive analysis]
• [Include numerical data, statistics, or research outcomes if present]
• [Continue with all significant findings, arranged by themes or categories if appropriate]

## 📝 METHODOLOGIES & APPROACHES
• [Research methods, frameworks, or approaches used, if applicable]
• [Detailed explanation of processes or procedures mentioned]
• [Limitations or constraints acknowledged in the document]

## 💡 INSIGHTS & IMPLICATIONS
• [First major insight with full explanation of its significance]
• [Second major insight with detailed discussion of implications]
• [Practical applications or recommendations mentioned]
• [Include any future directions or suggested next steps]
• [Expand on how these insights connect to broader contexts]

## 📚 REFERENCES & KEY SOURCES
• [Important references, citations, or sources mentioned in the document]
• [Key authorities or experts cited]
• [Related works that are significantly discussed]

## 🔑 CONCLUSION
[A thoughtful 4-6 sentence conclusion that thoroughly captures the essence and significance of the document, its contributions to the field, and its potential impact]

Format the summary to be visually appealing with clear section headings and structured bullet points. Use detailed yet clear language that fully preserves the meaning, nuance, and complexity of the original text. If certain sections aren't relevant to this particular document, you may omit them, but provide thorough coverage of all applicable sections.`;

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