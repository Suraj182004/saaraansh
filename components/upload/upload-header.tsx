"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function UploadHeader() {
  return (
    <div className="flex flex-col items-center justify-center text-center mb-12">
      <motion.div 
        className="mb-4 flex items-center justify-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 text-indigo-600 dark:text-indigo-400 rounded-full px-4 py-1.5 text-sm font-medium flex items-center shadow-sm border border-indigo-100 dark:border-indigo-900/50">
          <Sparkles className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
          AI-Powered PDF Summarizer
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-4"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
          Transform Your PDFs Into Summaries
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-lg">
          Upload your PDF and our AI will generate a concise, accurate summary within seconds.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6 flex flex-wrap gap-4 justify-center"
      >
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-2">
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">1</span>
          </div>
          <span>Upload PDF</span>
        </div>
        
        <div className="w-4 h-[2px] bg-gray-200 dark:bg-gray-700 self-center hidden sm:block"></div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-2">
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">2</span>
          </div>
          <span>AI Processing</span>
        </div>
        
        <div className="w-4 h-[2px] bg-gray-200 dark:bg-gray-700 self-center hidden sm:block"></div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-2">
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">3</span>
          </div>
          <span>Get Summary</span>
        </div>
      </motion.div>
    </div>
  );
}