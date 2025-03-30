'use client';

import { ArrowLeft, ArrowRight, Target } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DemoSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const slides = [
        {
            title: "1️⃣ Upload your PDF",
            description: "Easily drag & drop or select any PDF document you want to summarize",
            emoji: "📄",
            color: "from-blue-100 to-indigo-200"
        },
        {
            title: "2️⃣ AI Processing",
            description: "Our advanced AI reads and analyzes your document in seconds",
            emoji: "🤖",
            color: "from-purple-100 to-fuchsia-200"
        },
        {
            title: "3️⃣ Get your summary",
            description: "Receive a concise, well-structured summary of the key points",
            emoji: "✨",
            color: "from-amber-100 to-orange-200"
        },
        {
            title: "4️⃣ Save & Share",
            description: "Save your summaries to your account and share them easily",
            emoji: "💾",
            color: "from-emerald-100 to-teal-200"
        }
    ];
    
    const goToNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };
    
    const goToPrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };
    
    return (
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h3 className="text-2xl sm:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">
                        See how Saaraansh works ✨
                    </h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Transform any PDF into a concise, easy-to-read summary in just a few seconds
                    </p>
                </motion.div>
                
                {/* Demo Slider */}
                <div className="max-w-5xl mx-auto mb-16 relative">
                    <motion.div 
                        className="rounded-2xl overflow-hidden shadow-xl"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        {/* Slide Content */}
                        <div className={`aspect-[16/9] bg-gradient-to-br ${slides[currentSlide].color} p-8 flex items-center justify-center`}>
                            <motion.div 
                                key={currentSlide}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                className="w-full max-w-3xl mx-auto"
                            >
                                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                    {/* Text Content */}
                                    <div className="text-center md:text-left">
                                        <span className="text-8xl mb-6 block">
                                            {slides[currentSlide].emoji}
                                        </span>
                                        <h4 className="text-2xl font-bold text-gray-800 mb-3">
                                            {slides[currentSlide].title}
                                        </h4>
                                        <p className="text-gray-700">
                                            {slides[currentSlide].description}
                                        </p>
                                    </div>
                                    
                                    {/* Skeleton UI */}
                                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 min-h-[300px] w-full md:w-[60%]">
                                        {currentSlide === 0 && (
                                            <div className="flex flex-col h-full justify-center items-center">
                                                <div className="w-20 h-20 mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                                </div>
                                                <div className="text-center">
                                                    <h5 className="font-medium mb-2">Upload your PDF</h5>
                                                    <p className="text-sm text-gray-500">Drag and drop or click to select</p>
                                                    <div className="mt-4 border border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center bg-gray-50">
                                                        <span className="text-sm text-gray-400">example.pdf</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {currentSlide === 1 && (
                                            <div className="flex flex-col h-full justify-center space-y-4">
                                                <div className="h-2.5 bg-purple-200 rounded-full w-3/4 animate-pulse"></div>
                                                <div className="h-2.5 bg-purple-200 rounded-full animate-pulse"></div>
                                                <div className="h-2.5 bg-purple-200 rounded-full w-5/6 animate-pulse"></div>
                                                <div className="h-2.5 bg-purple-200 rounded-full w-3/4 animate-pulse"></div>
                                                <div className="h-2.5 bg-purple-200 rounded-full animate-pulse"></div>
                                                <div className="h-2.5 bg-purple-200 rounded-full w-2/3 animate-pulse"></div>
                                                <div className="flex justify-center mt-6">
                                                    <div className="w-12 h-12 rounded-full border-4 border-t-purple-500 border-purple-200 animate-spin"></div>
                                                </div>
                                                <p className="text-center text-sm text-purple-600 font-medium">Analyzing document...</p>
                                            </div>
                                        )}
                                        
                                        {currentSlide === 2 && (
                                            <div className="flex flex-col h-full justify-start space-y-3">
                                                <div className="bg-amber-100 px-3 py-1 text-amber-800 text-xs font-medium rounded-full w-fit">Summary</div>
                                                <h5 className="font-bold">Main Document Points:</h5>
                                                <ul className="space-y-2 text-sm">
                                                    <li className="flex items-start">
                                                        <span className="mr-2">•</span>
                                                        <span>The document covers key principles of modern web development with focus on performance.</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="mr-2">•</span>
                                                        <span>Several case studies demonstrate successful implementation in enterprise environments.</span>
                                                    </li>
                                                    <li className="flex items-start">
                                                        <span className="mr-2">•</span>
                                                        <span>Authors recommend a phased approach to adoption for existing projects.</span>
                                                    </li>
                                                </ul>
                                                <h5 className="font-bold mt-2">Conclusion:</h5>
                                                <p className="text-sm">The approach offers significant performance benefits when implemented correctly.</p>
                                            </div>
                                        )}
                                        
                                        {currentSlide === 3 && (
                                            <div className="flex flex-col h-full justify-start">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h5 className="font-bold">Web Dev Summary</h5>
                                                    <div className="flex space-x-2">
                                                        <span className="bg-emerald-100 text-emerald-800 text-xs py-1 px-2 rounded">Share</span>
                                                        <span className="bg-emerald-100 text-emerald-800 text-xs py-1 px-2 rounded">Export</span>
                                                    </div>
                                                </div>
                                                <div className="border-t border-gray-200 pt-3">
                                                    <div className="flex space-x-2 mb-3">
                                                        <div className="rounded-full w-8 h-8 bg-emerald-200 flex items-center justify-center text-xs">PDF</div>
                                                        <div>
                                                            <p className="text-sm font-medium">web-dev-best-practices.pdf</p>
                                                            <p className="text-xs text-gray-500">Summarized 2 minutes ago</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <div className="h-2 bg-gray-200 rounded-full w-full"></div>
                                                        <div className="h-2 bg-gray-200 rounded-full w-5/6"></div>
                                                        <div className="h-2 bg-gray-200 rounded-full w-4/5"></div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex space-x-2">
                                                    <div className="px-2 py-1 bg-gray-100 rounded text-xs">Web Development</div>
                                                    <div className="px-2 py-1 bg-gray-100 rounded text-xs">Performance</div>
                                                    <div className="px-2 py-1 bg-gray-100 rounded text-xs">Best Practices</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                    
                    {/* Navigation Arrows */}
                    <div className="flex justify-between absolute top-1/2 -translate-y-1/2 left-4 right-4">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="rounded-full bg-white/80 backdrop-blur-sm shadow-md border-0 hover:bg-white/90"
                            onClick={goToPrevSlide}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="rounded-full bg-white/80 backdrop-blur-sm shadow-md border-0 hover:bg-white/90"
                            onClick={goToNextSlide}
                        >
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </div>
                    
                    {/* Slide Indicators */}
                    <div className="flex justify-center mt-6 space-x-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${
                                    currentSlide === index ? "bg-indigo-500 w-8" : "bg-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Quick Overview Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto"
                >
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">What Our Users Create</h2>
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-full">
                                <Target className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-gray-700 text-lg">
                                    🎯 Comprehensive summaries that capture the essence of complex documents, saving hours of reading time while retaining all key information.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
} 