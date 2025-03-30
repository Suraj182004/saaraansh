'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SummaryData, getAllUserSummaries } from "@/actions/summary-actions";
import Link from 'next/link';
import { format } from 'date-fns';
import { FileText, PlusCircle, RefreshCw, Clock, Calendar, ExternalLink, Search, Filter } from 'lucide-react';
import CreditUsage from '@/components/dashboard/credit-usage';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
    const [summaries, setSummaries] = useState<SummaryData[]>([]);
    const [filteredSummaries, setFilteredSummaries] = useState<SummaryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    const fetchSummaries = async () => {
        try {
            setIsLoading(true);
            const data = await getAllUserSummaries();
            setSummaries(data);
            setFilteredSummaries(data);
        } catch (err) {
            console.error("Failed to fetch summaries:", err);
            setError("Failed to load your summaries. Please try again later.");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchSummaries();
    }, []);

    useEffect(() => {
        // Filter summaries based on search query
        if (searchQuery.trim() === '') {
            setFilteredSummaries(summaries);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = summaries.filter(summary => 
                (summary.fileName || '').toLowerCase().includes(query) || 
                summary.summaryText.toLowerCase().includes(query)
            );
            setFilteredSummaries(filtered);
        }
    }, [searchQuery, summaries]);

    useEffect(() => {
        // Sort summaries
        const sorted = [...filteredSummaries];
        if (sortBy === 'newest') {
            sorted.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
            });
        } else if (sortBy === 'oldest') {
            sorted.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateA - dateB;
            });
        } else if (sortBy === 'name') {
            sorted.sort((a, b) => (a.fileName || '').localeCompare(b.fileName || ''));
        }
        setFilteredSummaries(sorted);
    }, [sortBy, summaries, searchQuery]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchSummaries();
    };

    // Helper function to truncate text
    const truncateText = (text: string, maxLength: number = 200) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="container py-8 md:py-12 px-4 md:px-6">
            <motion.div 
                className="flex flex-col space-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Your Summaries</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {!isLoading && !error && `${filteredSummaries.length} ${filteredSummaries.length === 1 ? 'summary' : 'summaries'} available`}
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex gap-3 w-full sm:w-auto"
                    >
                        <Button 
                            onClick={handleRefresh}
                            variant="outline"
                            disabled={isLoading || isRefreshing}
                            className="sm:w-auto w-1/2 flex items-center gap-1.5"
                        >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">Refresh</span>
                        </Button>
                        <Link href="/upload" className="sm:w-auto w-1/2">
                            <Button className="w-full sm:w-auto flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
                                <PlusCircle className="w-4 h-4" />
                                <span className="hidden sm:inline">Upload New</span>
                                <span className="sm:hidden">Upload</span>
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Credit Usage Component */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-6"
                >
                    <CreditUsage />
                </motion.div>

                {/* Search and Filter */}
                {!isLoading && !error && summaries.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search summaries..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-400" />
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest first</SelectItem>
                                    <SelectItem value="oldest">Oldest first</SelectItem>
                                    <SelectItem value="name">Name</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </motion.div>
                )}

                {isLoading ? (
                    <motion.div 
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {[1, 2, 3].map((i) => (
                            <motion.div 
                                key={i}
                                variants={item}
                                className="flex flex-col"
                            >
                                <Card className="flex flex-col h-full bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <Skeleton className="h-6 w-2/3 mb-2" />
                                        <Skeleton className="h-4 w-1/3" />
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Skeleton className="h-10 w-full" />
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : error ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center py-16 text-center"
                    >
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-6 rounded-lg mb-6 max-w-md">
                            <p className="mb-4">{error}</p>
                        </div>
                        <Button 
                            onClick={() => window.location.reload()} 
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            Try Again
                        </Button>
                    </motion.div>
                ) : summaries.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 p-10 rounded-xl mb-8 max-w-md shadow-sm">
                            <FileText className="h-16 w-16 text-indigo-500 dark:text-indigo-400 mx-auto mb-6" />
                            <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">You haven't created any summaries yet</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">Upload a PDF file to get started with AI-powered summaries</p>
                        </div>
                        <Link href="/upload">
                            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 px-6 shadow-md">
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Upload Your First PDF
                            </Button>
                        </Link>
                    </motion.div>
                ) : filteredSummaries.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center py-16 text-center"
                    >
                        <div className="bg-amber-50 text-amber-800 p-6 rounded-lg mb-6 max-w-md">
                            <p className="mb-4">No summaries match your search criteria.</p>
                        </div>
                        <Button 
                            onClick={() => setSearchQuery('')} 
                            variant="outline"
                        >
                            Clear Search
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredSummaries.map((summary) => (
                            <motion.div
                                key={summary.id}
                                variants={item}
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card 
                                    className="flex flex-col h-full group bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-200 hover:border-indigo-200 dark:hover:border-indigo-800"
                                >
                                    <CardHeader className="pb-4">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg font-bold line-clamp-1 text-gray-900 dark:text-gray-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors break-words overflow-hidden text-ellipsis max-w-full">
                                                    {summary.fileName || 'Untitled Document'}
                                                </CardTitle>
                                                <div className="flex flex-wrap gap-2 items-center">
                                                    <Badge variant="outline" className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {summary.createdAt 
                                                            ? format(new Date(summary.createdAt), 'MMM d, yyyy')
                                                            : 'Date unavailable'}
                                                    </Badge>
                                                </div>
                                            </div>
                                            {summary.originalFileUrl && (
                                                <a 
                                                    href={summary.originalFileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors p-1 rounded-full hover:bg-gray-100"
                                                    title="View original PDF"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-grow pb-2">
                                        <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-5 break-words overflow-hidden">
                                            {truncateText(summary.summaryText)}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-2">
                                        <Link href={`/summary/${summary.id}`} className="w-full">
                                            <Button 
                                                variant="default" 
                                                className="w-full group-hover:bg-gradient-to-r from-indigo-600 to-violet-600 group-hover:text-white transition-colors"
                                            >
                                                View Full Summary
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}