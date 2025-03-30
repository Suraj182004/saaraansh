import Link from "next/link";
import { Github, Twitter, Linkedin, Facebook, FileText, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NavLink from "./nav-link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Branding */}
          <div className="col-span-1 md:col-span-1">
            <NavLink href="/" className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-600 hover:rotate-12 transform transition duration-200 ease-in-out" />
              <span className="text-gray-900 dark:text-white text-xl font-extrabold">Saaraansh</span>
            </NavLink>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              Save hours of reading time. Transform lengthy PDFs into clear, accurate summaries in seconds.
            </p>
          </div>

          {/* Product Links */}
          <div className="col-span-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <NavLink href="/#features" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Features
                </NavLink>
              </li>
              <li>
                <NavLink href="/#pricing" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Pricing
                </NavLink>
              </li>
              <li>
                <NavLink href="/upload" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Upload PDF
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="col-span-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <NavLink href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Privacy Policy
                </NavLink>
              </li>
              <li>
                <NavLink href="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  Terms of Service
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Stay Updated</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and features.
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
              />
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-8">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} Saaraansh. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 