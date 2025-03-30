"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const faqs = [
    {
        question: "How does the PDF summarizer work?",
        answer: "Our AI-powered PDF summarizer uses advanced natural language processing to analyze your document, identify key information, and generate a concise summary. The technology extracts the most important points while maintaining context and meaning."
    },
    {
        question: "Is my data secure?",
        answer: "Absolutely. We prioritize your privacy and security. Your documents are encrypted during transit and processing. We do not store your documents after processing is complete, and we never share your information with third parties."
    },
    {
        question: "How accurate are the summaries?",
        answer: "Our AI technology delivers highly accurate summaries by identifying the most important information in your documents. While no automatic summarization is perfect, our system has been trained on millions of documents to ensure quality results."
    },
    {
        question: "What types of documents can I summarize?",
        answer: "Our tool works with any PDF document, including research papers, business reports, legal documents, books, articles, and more. The AI adapts to different writing styles and document structures."
    },
    {
        question: "How many documents can I summarize?",
        answer: "Free users can summarize up to 10 documents per month. Our Basic plan allows for 50 documents monthly, and our Pro plan offers unlimited summaries. Check our pricing page for more details."
    },
    {
        question: "Can I customize the length of the summary?",
        answer: "Yes, our Pro and Basic plans allow you to adjust the level of detail in your summaries. You can choose between brief overviews or more comprehensive summaries based on your specific needs."
    }
];

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-indigo-50 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-70 -mb-32 -ml-32"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-70 -mt-32 -mr-32"></div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Frequently Asked <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">Questions</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Find answers to common questions about our AI PDF summarizer
                    </p>
                </motion.div>

                <motion.div 
                    className="max-w-3xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {faqs.map((faq, index) => (
                        <motion.div 
                            key={index}
                            variants={itemVariants}
                            className="mb-4"
                        >
                            <div 
                                className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
                                    openIndex === index ? 'ring-2 ring-indigo-200' : ''
                                }`}
                            >
                                <button
                                    className="flex justify-between items-center w-full p-6 text-left"
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                                    <motion.div
                                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`ml-2 rounded-full p-1 ${
                                            openIndex === index ? 'bg-indigo-100' : 'bg-gray-100'
                                        }`}
                                    >
                                        <ChevronDown 
                                            className={`h-5 w-5 transition-colors ${
                                                openIndex === index ? 'text-indigo-600' : 'text-gray-500'
                                            }`} 
                                        />
                                    </motion.div>
                                </button>
                                
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ 
                                        height: openIndex === index ? 'auto' : 0,
                                        opacity: openIndex === index ? 1 : 0
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-6 pt-0 text-gray-600">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
} 