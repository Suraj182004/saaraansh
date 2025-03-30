"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CTASection() {
    const router = useRouter();
    
    return (
        <section className="py-20 lg:py-32 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-50"></div>
            
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-0 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-violet-200/30 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl"></div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <div className="mb-6 inline-flex mx-auto px-4 py-1.5 bg-white rounded-full shadow-sm">
                        <div className="flex items-center space-x-2 text-sm font-medium text-indigo-600">
                            <Sparkles className="h-4 w-4" />
                            <span>Start creating summaries in seconds</span>
                        </div>
                    </div>
                    
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                        Ready to save hours on <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">document reading</span>?
                    </h2>
                    
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                        Join thousands of students, researchers, and professionals who use our AI to extract insights from PDFs quickly.
                    </p>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <Button 
                            size="lg"
                            className="rounded-full px-8 py-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-200 hover:shadow-xl transition-all"
                            onClick={() => router.push('/dashboard')}
                        >
                            Get Started Free
                        </Button>
                        
                        <p className="mt-4 text-sm text-gray-500">
                            No credit card required • 10 free summaries
                        </p>
                    </motion.div>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.7 }}
                    className="mt-16 max-w-lg mx-auto"
                >
                    <div className="bg-white rounded-lg p-2 shadow-xl">
                        <div className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-violet-50 rounded flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-indigo-400 mr-2"></div>
                                <span className="text-sm text-gray-600 font-medium">Customer Testimonial</span>
                            </div>
                            <div className="text-xs text-gray-500">Just now</div>
                        </div>
                        <div className="p-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-violet-400 rounded-full flex items-center justify-center text-white font-medium">
                                    JD
                                </div>
                                <div>
                                    <p className="text-gray-700">
                                        "This tool has completely transformed how I approach research papers. What used to take me hours now takes minutes. Absolutely worth it!"
                                    </p>
                                    <p className="mt-2 text-sm font-medium text-gray-900">- John Doe, PhD Student</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
} 