import Link from "next/link";
import { Github, Twitter, Linkedin, Facebook, FileText, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand and Description */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <FileText className="h-6 w-6 text-indigo-600" />
              <span className="font-bold text-xl text-gray-900">Saaraansh</span>
            </Link>
            <p className="text-gray-600 max-w-md mb-4">
              Transform lengthy PDFs into concise, actionable summaries with our advanced AI technology. Save time and increase productivity.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 mt-6">
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2 text-indigo-500" />
                <a href="mailto:contact@saaraansh.com" className="hover:text-indigo-600 transition-colors">
                  contact@saaraansh.com
                </a>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2 text-indigo-500" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
            
            {/* Social Icons */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="bg-gray-100 p-2 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-100 p-2 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-100 p-2 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-100 p-2 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-sm uppercase tracking-wider">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/features" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-sm uppercase tracking-wider">Stay Updated</h3>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="space-y-2">
              <div className="flex items-center">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {currentYear} Saaraansh. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 