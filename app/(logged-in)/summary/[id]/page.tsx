'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getSummaryById, type SummaryData } from "@/actions/summary-actions"; // Import the action
import { format } from 'date-fns'; // For formatting the date
import Link from 'next/link';
import { ChevronLeft, Download, ExternalLink, Clock, Printer, Share2, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SummaryPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            setError(null);
            setSummaryData(null); // Reset previous data

            getSummaryById(id) // Call the server action
                .then(data => {
                    if (data) {
                        setSummaryData(data);
                    } else {
                        setError("Summary not found or you don't have permission to view it.");
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch summary:", err);
                    setError("Failed to load summary data.");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [id]);

    const formattedDate = summaryData?.createdAt 
        ? format(new Date(summaryData.createdAt), 'PPPp') 
        : 'N/A';

    // Function to handle "download as text" functionality
    const downloadAsTxt = () => {
        if (!summaryData) return;
        
        const element = document.createElement('a');
        const file = new Blob([summaryData.summaryText], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${summaryData.fileName || 'summary'}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast.success("Summary downloaded as text file");
    };

    // Function to print the summary
    const handlePrint = () => {
        if (printRef.current) {
            const printContent = printRef.current.innerHTML;
            const originalContent = document.body.innerHTML;
            
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>${summaryData?.fileName || 'Summary'}</title>
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
                                h1 { font-size: 24px; margin-bottom: 4px; }
                                h2 { font-size: 20px; margin-top: 20px; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #eee; }
                                p { margin-bottom: 16px; }
                                .metadata { color: #666; font-size: 14px; margin-bottom: 20px; }
                                .bullet { margin-left: 20px; margin-bottom: 8px; position: relative; }
                                .bullet:before { content: '•'; position: absolute; left: -16px; }
                                @media print { body { font-size: 12pt; } }
                            </style>
                        </head>
                        <body>
                            <h1>${summaryData?.fileName || 'Summary'}</h1>
                            <div class="metadata">Generated on ${formattedDate}</div>
                            ${printContent}
                        </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.print();
            } else {
                toast.error("Unable to open print window. Please check your popup settings.");
            }
        }
    };

    // Function to copy the summary to clipboard
    const copyToClipboard = () => {
        if (!summaryData) return;
        
        navigator.clipboard.writeText(summaryData.summaryText)
            .then(() => {
                setIsCopied(true);
                toast.success("Summary copied to clipboard");
                setTimeout(() => setIsCopied(false), 2000);
            })
            .catch(() => {
                toast.error("Failed to copy to clipboard");
            });
    };

    // Function to share the summary
    const shareSummary = () => {
        if (navigator.share && summaryData) {
            navigator.share({
                title: summaryData.fileName || 'PDF Summary',
                text: `Check out this PDF summary: ${summaryData.fileName}`,
                url: window.location.href,
            })
            .then(() => toast.success("Shared successfully"))
            .catch((error) => {
                console.error('Error sharing:', error);
                toast.error("Error sharing content");
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            copyToClipboard();
            toast.success("Link copied to clipboard. You can now share it manually.");
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="container mx-auto py-6 md:py-10 px-4">
            <div className="mb-6 flex items-center justify-between">
                <Link href="/dashboard" className="group inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Back to dashboard</span>
                </Link>
                
                {!isLoading && summaryData && (
                    <div className="flex gap-2">
                        <Button 
                            onClick={handlePrint} 
                            variant="outline" 
                            size="sm" 
                            className="hidden sm:flex items-center gap-1 text-sm"
                        >
                            <Printer className="w-4 h-4" />
                            Print
                        </Button>
                        
                        <Button 
                            onClick={downloadAsTxt} 
                            variant="outline" 
                            size="sm" 
                            className="hidden sm:flex items-center gap-1 text-sm"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </Button>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1 text-sm">
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={shareSummary}>
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share link
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={copyToClipboard}>
                                    {isCopied ? (
                                        <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                                    ) : (
                                        <Copy className="w-4 h-4 mr-2" />
                                    )}
                                    Copy text
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>
            
            <motion.div
                initial="hidden"
                animate="visible"
                variants={cardVariants}
            >
                <Card className="shadow-lg border-opacity-50 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
                    <CardHeader className="border-b pb-6">
                        {isLoading ? (
                            <>
                                <Skeleton className="h-8 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-1/4 mt-1" />
                            </>
                        ) : error ? (
                            <CardTitle className="text-red-600">Error</CardTitle>
                        ) : summaryData ? (
                            <>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                    <div>
                                        <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50">
                                            {summaryData.fileName || 'Untitled Document'}
                                        </CardTitle>
                                        <CardDescription className="text-sm mt-2 flex items-center text-gray-500 dark:text-gray-400">
                                            <Clock className="w-3.5 h-3.5 mr-1.5 inline" />
                                            Generated on {formattedDate}
                                        </CardDescription>
                                    </div>
                                    
                                    <div className="mt-4 sm:mt-0">
                                        <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                                            asChild
                                        >
                                            <a 
                                                href={summaryData.originalFileUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                View Original PDF
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                                
                                <div className="mt-4 sm:hidden flex gap-2">
                                    <Button 
                                        onClick={downloadAsTxt} 
                                        variant="outline" 
                                        size="sm" 
                                        className="flex-1 flex items-center justify-center gap-1.5 text-sm"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </Button>
                                    <Button 
                                        onClick={copyToClipboard} 
                                        variant="outline" 
                                        size="sm" 
                                        className="flex-1 flex items-center justify-center gap-1.5 text-sm"
                                    >
                                        {isCopied ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                        Copy
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <CardTitle>Summary</CardTitle>
                        )}
                    </CardHeader>
                    
                    <CardContent className="pt-6 pb-8">
                        {isLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        ) : error ? (
                            <div className="py-16 text-center">
                                <p className="text-red-500 mb-6 text-lg">{error}</p>
                                <Button 
                                    onClick={() => router.push('/dashboard')}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    Go to Dashboard
                                </Button>
                            </div>
                        ) : summaryData ? (
                            <div ref={printRef} className="whitespace-pre-line text-md prose dark:prose-invert max-w-none">
                                {summaryData.summaryText.split('\n').map((line, index) => {
                                    // Check if the line is a section header (starts with # or ##)
                                    if (line.trim().startsWith('# ') || line.trim().startsWith('## ')) {
                                        // Extract the heading text without the markdown syntax
                                        const headingText = line.replace(/^#+ /, '');
                                        
                                        // Preserve emojis in headings if they exist
                                        return (
                                            <h2 key={index} className="text-xl md:text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100 border-b pb-2 border-gray-200 dark:border-gray-800 break-words">
                                                {headingText}
                                            </h2>
                                        );
                                    }
                                    // Special case for conclusion without emoji - add the emoji
                                    else if (line.trim() === 'CONCLUSION' || line.trim() === '## CONCLUSION') {
                                        return (
                                            <h2 key={index} className="text-xl md:text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100 border-b pb-2 border-gray-200 dark:border-gray-800 break-words">
                                                🔑 Conclusion
                                            </h2>
                                        );
                                    }
                                    // Check if line starts with a bullet point
                                    else if (line.trim().startsWith('•')) {
                                        return (
                                            <div key={index} className="pl-5 mb-3 relative break-words">
                                                <span className="text-indigo-600 dark:text-indigo-400 absolute left-0">{line.trim().substring(0, 1)}</span>
                                                <span>{line.trim().substring(1)}</span>
                                            </div>
                                        );
                                    }
                                    // Otherwise render as normal paragraph
                                    else if (line.trim()) {
                                        return <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 break-words">{line}</p>;
                                    }
                                    return null; // Skip empty lines
                                })}
                            </div>
                        ) : (
                            <p>No summary data available.</p>
                        )}
                    </CardContent>
                    
                    {!isLoading && !error && summaryData && (
                        <CardFooter className="border-t pt-6 pb-6 flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                                Summary ID: {id.substring(0, 8)}...
                            </p>
                            <div className="flex gap-2 items-center">
                                <Button 
                                    onClick={handlePrint} 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <Printer className="w-4 h-4" />
                                </Button>
                                <Button 
                                    onClick={downloadAsTxt} 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <Download className="w-4 h-4" />
                                </Button>
                                <Button 
                                    onClick={copyToClipboard} 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    {isCopied ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </Button>
                                <Button 
                                    onClick={shareSummary}
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardFooter>
                    )}
                </Card>
            </motion.div>
        </div>
    );
} 