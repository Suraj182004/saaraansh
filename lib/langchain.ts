import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function fetchAndExtractPdfText(fileUrl: string) {
    console.log(`Fetching PDF from URL: ${fileUrl}`);
    
    try {
        // Add additional headers for authentication if needed
        const headers = new Headers();
        
        const response = await fetch(fileUrl, {
            headers,
            cache: 'no-store', // Avoid caching issues
        });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch PDF: HTTP ${response.status} - ${response.statusText}`);
        }
        
        const blob = await response.blob();
        console.log(`PDF fetched. Size: ${(blob.size / 1024).toFixed(2)} KB, Type: ${blob.type}`);
        
        // Check if the blob is empty or invalid
        if (blob.size === 0) {
            throw new Error("Received empty PDF file");
        }
        
        const arrayBuffer = await blob.arrayBuffer();
        
        // Use PDFLoader with more verbose options
        console.log("Creating PDFLoader instance...");
        const loader = new PDFLoader(new Blob([arrayBuffer], { type: 'application/pdf' }), {
            // Optional: add options like splitPages: true if needed
        });
        
        console.log("Loading PDF content...");
        const docs = await loader.load();
        console.log(`PDF loaded. Extracted ${docs.length} page(s) of content.`);
        
        // Check if any text was extracted
        if (docs.length === 0) {
            throw new Error("No pages found in PDF");
        }
        
        // Map and join the page contents, with additional logging
        const extractedText = docs.map((doc) => doc.pageContent).join('\n');
        console.log(`Total characters extracted: ${extractedText.length}`);
        
        // If text is empty or just whitespace, throw an error
        if (extractedText.trim().length === 0) {
            throw new Error(
                "The PDF appears to contain no extractable text. It might be an image-only PDF, " +
                "scanned document without OCR, or protected content."
            );
        }
        
        return extractedText;
        
    } catch (error) {
        console.error("Error extracting text from PDF:", error);
        throw error; // Rethrow to be handled by the calling code
    }
}