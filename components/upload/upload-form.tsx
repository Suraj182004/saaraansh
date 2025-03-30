'use client';
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import UploadFormInput from "./upload-form-input";
import { Button } from "../ui/button";
import { generatePdfSummary } from "@/actions/upload-actions";
import { Input } from "../ui/input";
import { Loader2, FileText, CheckCircle2, XCircle } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";

export default function UploadForm() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingStage, setProcessingStage] = useState<'idle' | 'uploading' | 'extracting' | 'summarizing' | 'saving' | 'complete' | 'error'>('idle');
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize UploadThing
  const { startUpload, isUploading: isUploadThingUploading } = useUploadThing("pdfUploader", {
    onClientUploadComplete: async (res) => {
      if (res && res.length > 0) {
        setProcessingStage('extracting');
        try {
          // Use the uploaded file data from UploadThing
          const fileData = res[0];
          console.log("File uploaded successfully:", fileData);
          
          // Access properties safely
          const uploadUrl = 'fileUrl' in fileData ? fileData.fileUrl : 
                           'url' in fileData ? (fileData as any).url : '';
          const uploadName = 'fileName' in fileData ? fileData.fileName : 
                           'name' in fileData ? (fileData as any).name : 'document.pdf';
          
          // Generate summary using the uploaded file data
          setProcessingStage('summarizing');
          const summaryResult = await generatePdfSummary({
            url: uploadUrl,
            name: uploadName,
            size: fileData.size,
            key: fileData.key,
            serverData: null
          });
          
          if (!summaryResult.success) {
            throw new Error(summaryResult.error || "Failed to generate summary");
          }
          
          // Summary saved in database
          setProcessingStage('saving');
          setProcessingStage('complete');
          
          toast.success("PDF summarized successfully!");
          setTimeout(() => {
            router.push(`/summary/${summaryResult.data?.id}`);
          }, 1000);
        } catch (error) {
          console.error("Error processing PDF:", error);
          setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
          setProcessingStage('error');
          setIsUploading(false);
        }
      }
    },
    onUploadError: (error) => {
      setErrorMessage(`Error uploading file: ${error.message}`);
      setProcessingStage('error');
      setIsUploading(false);
    },
    onUploadBegin: () => {
      setProcessingStage('uploading');
      setUploadProgress(10);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setErrorMessage("Please select a PDF file");
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage(null);
      setProcessingStage('uploading');

      // Update progress based on processing stage
      const updateProgress = () => {
        switch (processingStage) {
          case 'uploading': 
            setUploadProgress(25);
            break;
          case 'extracting':
            setUploadProgress(50);
            break;
          case 'summarizing':
            setUploadProgress(75);
            break;
          case 'saving':
            setUploadProgress(90);
            break;
          case 'complete':
            setUploadProgress(100);
            break;
        }
      };
      
      // Set up an interval to update the progress
      progressIntervalRef.current = setInterval(updateProgress, 500);
      
      // Use UploadThing to upload the file
      await startUpload([selectedFile]);
      
      // The rest of the process is handled in the onClientUploadComplete callback
      
    } catch (error) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      console.error("Error processing PDF:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
      setProcessingStage('idle');
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setErrorMessage(null);
    setProcessingStage('idle');
  };

  // Render different status messages based on processing stage
  const renderStatusMessage = () => {
    switch (processingStage) {
      case 'uploading':
        return "Uploading your PDF...";
      case 'extracting':
        return "Extracting text from PDF...";
      case 'summarizing':
        return "Generating AI summary...";
      case 'saving':
        return "Saving your summary...";
      case 'complete':
        return "Summary complete!";
      case 'error':
        return "Error processing PDF";
      default:
        return "Ready to upload";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-300">
              Upload PDF
            </label>
            {selectedFile && (
              <span className="text-sm text-gray-500">
                Selected: {selectedFile.name}
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload your PDF document to generate an AI-powered summary (Max 8MB)
          </p>
          
          <div className="flex items-center gap-1.5 mt-2">
            <Input 
              id="file" 
              type="file" 
              name="file" 
              accept="application/pdf"
              required 
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
              disabled={isUploading}
            />
          </div>
        </div>
        
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-center gap-2">
            <XCircle className="h-5 w-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        
        {isUploading && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                {processingStage !== 'error' && processingStage !== 'complete' && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {processingStage === 'complete' && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
                {processingStage === 'error' && (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span>{renderStatusMessage()}</span>
              </div>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  processingStage === 'error' 
                    ? 'bg-red-500' 
                    : processingStage === 'complete'
                    ? 'bg-green-500'
                    : 'bg-indigo-500'
                }`}
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
        
        <Button 
          type="submit" 
          disabled={isUploading || !selectedFile}
          className="w-full bg-indigo-600 hover:bg-indigo-700 font-medium"
        >
          {isUploading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generate Summary
            </span>
          )}
        </Button>
        
        <div className="text-xs text-center text-gray-500">
          Make sure your PDF contains searchable text for optimal results
        </div>
      </form>
    </div>
  );
} 