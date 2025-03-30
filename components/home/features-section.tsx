"use client";

import { motion } from "framer-motion";
import { Brain, Lock, Zap, Sparkles, Rocket, Clock } from "lucide-react";

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

// Features data
const features = [
  {
    title: "AI-Powered Summaries",
    description: "Our advanced AI extracts key points from any PDF document, creating concise and accurate summaries.",
    icon: Brain,
    color: "from-rose-500 to-pink-600"
  },
  {
    title: "Private & Secure",
    description: "Your documents are encrypted and processed securely. We never share your data with third parties.",
    icon: Lock,
    color: "from-blue-500 to-indigo-600"
  },
  {
    title: "Lightning Fast",
    description: "Get your summaries in seconds, not minutes. Perfect for when you're in a hurry.",
    icon: Zap,
    color: "from-amber-500 to-orange-600"
  },
  {
    title: "Custom Summary Length",
    description: "Choose between brief overviews or detailed summaries based on your specific needs.",
    icon: Sparkles,
    color: "from-purple-500 to-violet-600"
  },
  {
    title: "Export Options",
    description: "Download your summaries in multiple formats or share them directly with collaborators.",
    icon: Rocket,
    color: "from-emerald-500 to-teal-600"
  },
  {
    title: "Time Saving",
    description: "Reduce hours of reading to minutes. Focus on understanding rather than skimming.",
    icon: Clock,
    color: "from-cyan-500 to-sky-600"
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-60"></div>
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
            Powerful features to <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">boost productivity</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI-powered tools are designed to help you extract the most important information from any document in record time.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className={`w-12 h-12 mb-4 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-white`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 