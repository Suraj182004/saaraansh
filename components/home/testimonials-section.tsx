"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
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

// Testimonial data
const testimonials = [
  {
    quote: "This tool has completely transformed my research process. What used to take me hours now takes minutes, and the summaries capture all the important details.",
    author: "Dr. Sarah Chen",
    position: "Research Scientist",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    quote: "As a student juggling multiple courses, this PDF summarizer has been a lifesaver. I can quickly grasp complex readings and focus on understanding rather than just getting through material.",
    author: "Michael Johnson",
    position: "Graduate Student",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    gradient: "from-violet-500 to-purple-600"
  },
  {
    quote: "The accuracy of these summaries is impressive. I've used other AI tools before, but this one consistently delivers clear, concise summaries that capture the essence of our business documents.",
    author: "Emma Rodriguez",
    position: "Business Analyst",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    gradient: "from-rose-500 to-pink-600"
  }
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-indigo-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-100/60 to-purple-100/60 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-blue-100/60 to-indigo-100/60 blur-3xl"></div>
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
            What our <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">users say</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied users who save time and increase productivity
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Featured testimonial */}
          <div className="relative mb-12">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 100 }}
                animate={{ 
                  opacity: index === activeIndex ? 1 : 0,
                  x: index === activeIndex ? 0 : 100,
                  zIndex: index === activeIndex ? 10 : 0,
                  position: index === activeIndex ? 'relative' : 'absolute'
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="bg-white rounded-2xl shadow-xl p-8 lg:p-10"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Quote className="h-6 w-6 text-white" />
                </div>
                
                <div className="mb-8">
                  <p className="text-xl text-gray-700 italic leading-relaxed">"{testimonial.quote}"</p>
                </div>
                
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4 border-2 border-indigo-100">
                    <Image src={testimonial.image} alt={testimonial.author} width={48} height={48} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.position}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Testimonial navigation dots */}
          <div className="flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-indigo-600 w-8' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className={`w-10 h-10 rounded-full mb-4 bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white`}>
                <Quote className="h-5 w-5" />
              </div>
              <blockquote className="text-gray-700 mb-6">
                "{testimonial.quote.substring(0, 120)}..."
              </blockquote>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                  <Image src={testimonial.image} alt={testimonial.author} width={40} height={40} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-500 text-sm">{testimonial.position}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 