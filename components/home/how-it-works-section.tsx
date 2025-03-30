'use client';

import { motion } from "framer-motion";
import { Upload, FileText, FileOutput } from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.6,
      type: "spring",
      stiffness: 50
    }
  }
};

// Step data
const steps = [
  {
    title: "Upload your PDF",
    description: "Simply drag and drop your PDF document or select it from your files.",
    icon: Upload,
    gradient: "from-blue-500 to-indigo-600",
    lightGradient: "from-blue-50 to-indigo-100"
  },
  {
    title: "AI Processing",
    description: "Our advanced AI reads and analyzes your document, identifying key information.",
    icon: FileText,
    gradient: "from-violet-500 to-purple-600",
    lightGradient: "from-violet-50 to-purple-100"
  },
  {
    title: "Get your summary",
    description: "Receive a concise, well-structured summary highlighting the most important points.",
    icon: FileOutput,
    gradient: "from-rose-500 to-pink-600",
    lightGradient: "from-rose-50 to-pink-100"
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] -top-64 -right-64 rounded-full bg-blue-50 blur-3xl opacity-50"></div>
        <div className="absolute w-[600px] h-[600px] -bottom-64 -left-64 rounded-full bg-purple-50 blur-3xl opacity-50"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How it <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">works</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get your summary in three simple steps - it's that easy!
          </p>
        </motion.div>

        <motion.div 
          className="flex flex-col lg:flex-row gap-8 justify-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="flex-1 relative"
            >
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[calc(50%+3rem)] right-0 h-0.5 bg-gradient-to-r from-gray-200 to-gray-100"></div>
              )}
              
              <div className="relative lg:text-center">
                {/* Step number */}
                <div className="absolute top-16 -left-4 lg:left-1/2 lg:-translate-x-24 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center font-bold text-indigo-600">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className={`w-20 h-20 rounded-2xl mx-auto bg-gradient-to-br ${step.lightGradient} p-1 mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  <div className={`w-full h-full rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white shadow-inner`}>
                    <step.icon className="h-8 w-8" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">{step.title}</h3>
                <p className="text-gray-600 max-w-sm mx-auto">{step.description}</p>
                
                {/* Mobile step number */}
                <div className="lg:hidden absolute top-0 left-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                  {index + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 