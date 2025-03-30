'use client';

import BgGradient from "@/components/common/bg-gradient";
import UploadHeader from "@/components/upload/upload-header";
import UploadForm from "@/components/upload/upload-form";
import { FileText, ArrowRight, CopyCheck, Database } from "lucide-react";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <section className="min-h-screen px-4 sm:px-6 py-12 sm:py-20">
      <BgGradient />
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-10 text-center">
        <UploadHeader />
        
        {/* Process Flow Diagram */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-100 shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-6 text-gray-800">How It Works</h2>
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex flex-col items-center p-3 min-w-[120px]">
              <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-sm font-medium">Upload PDF</p>
            </div>
            
            <ArrowRight className="w-5 h-5 text-gray-400 hidden md:block" />
            
            <div className="flex flex-col items-center p-3 min-w-[120px]">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-600">
                  <path d="M21 12c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9"></path>
                  <path d="M9 17l-2-2 2-2"></path>
                  <path d="M13 17l2-2-2-2"></path>
                  <path d="M11 9v6"></path>
                </svg>
              </div>
              <p className="text-sm font-medium">Extract Text</p>
            </div>
            
            <ArrowRight className="w-5 h-5 text-gray-400 hidden md:block" />
            
            <div className="flex flex-col items-center p-3 min-w-[120px]">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-600">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"></path>
                  <path d="M9.4 15.4a1 1 0 1 0 1.2 1.6c2.2-1.6 4.4-3.2 6.2-5"></path>
                  <path d="M15 8.5 11 13l-2-1.5"></path>
                  <path d="M11 6 7.5 9.5 6 8.5"></path>
                </svg>
              </div>
              <p className="text-sm font-medium">Generate Summary</p>
            </div>
            
            <ArrowRight className="w-5 h-5 text-gray-400 hidden md:block" />
            
            <div className="flex flex-col items-center p-3 min-w-[120px]">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium">Save Result</p>
            </div>
          </div>
        </motion.div>

        <UploadForm />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-gray-500 max-w-lg text-center mt-4"
        >
          <p>For best results, ensure your PDF contains searchable text and is under 10MB in size.</p>
          <p className="mt-1">We process your document using AI to generate accurate summaries.</p>
        </motion.div>
      </div>
    </section>
  );
}