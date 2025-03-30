"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HeroSection() {
    const router = useRouter();
    
    return (
        <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-10 -right-10 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-100/70 to-indigo-200/40 blur-3xl"></div>
                <div className="absolute top-1/3 -left-10 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-blue-100/70 to-sky-200/40 blur-2xl"></div>
                <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-gradient-to-br from-indigo-100/50 to-purple-100/30 blur-2xl"></div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">Summarize</span> any PDF in seconds
                        </h1>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                            AI-powered PDF summaries that save you time and help you extract the key insights from any document.
                        </p>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row justify-center gap-4"
                    >
                        <Button
                            size="lg"
                            className="rounded-full px-8 py-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-200 hover:shadow-xl transition-all"
                            onClick={() => router.push('/dashboard')}
                        >
                            Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        
                        <Button
                            variant="outline"
                            size="lg"
                            className="rounded-full px-8 py-6 text-indigo-600 border-indigo-200 hover:bg-indigo-50 transition-all"
                            asChild
                        >
                            <Link href="#pricing">See Pricing</Link>
                        </Button>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-8 text-sm text-gray-500"
                    >
                        <p>✨ No credit card required • 10 free summaries per month</p>
                    </motion.div>
                </div>
                
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="mt-16 max-w-5xl mx-auto relative"
                >
                    <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl shadow-2xl shadow-indigo-100/50 overflow-hidden border border-gray-100">
                        <div className="p-4 bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center space-x-2">
                            <div className="flex space-x-1.5">
                                <div className="w-3 h-3 rounded-full bg-white/30"></div>
                                <div className="w-3 h-3 rounded-full bg-white/30"></div>
                                <div className="w-3 h-3 rounded-full bg-white/30"></div>
                            </div>
                            <div className="text-white/80 text-sm">Saaraansh Summary</div>
                        </div>
                        
                        <div className="p-8 space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">AI</div>
                                <div>
                                    <h3 className="font-semibold text-lg">Research Paper Summary</h3>
                                    <p className="text-sm text-gray-500">Processed in 3.2 seconds</p>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Points:</h4>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start">
                                            <span className="mr-2 text-indigo-500">•</span>
                                            <span>This study examined the effects of AI-assisted learning on student performance across 12 universities.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2 text-indigo-500">•</span>
                                            <span>Results showed a 32% improvement in comprehension when AI tools were integrated with traditional teaching methods.</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mr-2 text-indigo-500">•</span>
                                            <span>The paper recommends a hybrid approach that balances AI assistance with human guidance.</span>
                                        </li>
                                    </ul>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Conclusion:</h4>
                                    <p className="text-sm text-gray-600">
                                        The research demonstrates that AI-enhanced learning environments can significantly improve educational outcomes when properly implemented with appropriate human oversight and guidance.
                                    </p>
                                </div>
                            </div>
                </div>
                </div>
           
                    {/* Decorative elements */}
                    <div className="absolute -bottom-6 -right-12 w-24 h-24 bg-indigo-100 rounded-full blur-2xl opacity-70"></div>
                    <div className="absolute -top-6 -left-12 w-24 h-24 bg-purple-100 rounded-full blur-2xl opacity-70"></div>
                </motion.div>
            </div>
        </section>
    );
}
