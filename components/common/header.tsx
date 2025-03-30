'use client';

import { FileText, Menu, X, LayoutDashboard, Upload, LogIn } from "lucide-react";
import NavLink from "./nav-link";
import { SignedIn, SignedOut, UserButton, useAuth, useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";

function PlanBadge({ plan, credits }: { plan: string, credits?: number }) {
  // Determine the variant based on plan
  let variant = "secondary";
  let textColor = "text-gray-800 dark:text-gray-200";
  
  if (plan === "pro") {
    variant = "destructive";
    textColor = "text-white";
  }
  else if (plan === "basic") {
    variant = "default";
    textColor = "text-white";
  }
  
  return (
    <div className="flex gap-2 items-center">
      <Badge variant={variant as any} className={`capitalize font-medium px-2.5 py-1 ${textColor}`}>
        {plan === 'pro' ? 'Pro Plan' : plan === 'basic' ? 'Basic Plan' : 'Free Plan'}
      </Badge>
    </div>
  );
}

export default function Header() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [userPlan, setUserPlan] = useState<string>('free');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Fetch user plan data when component mounts
  useEffect(() => {
    if (!isSignedIn || !user) {
      setIsLoading(false);
      return;
    }
    
    async function fetchUserPlan() {
      try {
        const response = await fetch('/api/user/plan');
        if (response.ok) {
          const data = await response.json();
          setUserPlan(data.plan || 'free');
        }
      } catch (error) {
        console.error('Error fetching user plan:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUserPlan();
  }, [isSignedIn, user]);
  
  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-800' 
        : 'bg-white dark:bg-gray-950'
    }`}>
      <nav className="container flex justify-between items-center py-4 lg:px-8 px-4 mx-auto">
        <div className="flex lg:flex-1">
          <NavLink href="/" className="flex items-center gap-1 lg:gap-2 shrink-0">
            <FileText className="w-6 h-6 lg:w-7 lg:h-7 text-indigo-600
              hover:rotate-12 transform transition duration-200 ease-in-out" />
            <span className="text-gray-900 dark:text-white text-lg lg:text-xl font-extrabold">Saaraansh</span>
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex lg:justify-center gap-6 lg:gap-12 lg:items-center">
          <NavLink href="/#pricing" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">Pricing</NavLink>
          <SignedIn>
            <NavLink href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium">Dashboard</NavLink>
          </SignedIn>
        </div>

        <div className="hidden md:flex lg:flex-1 justify-end items-center gap-4">
          <ThemeToggle />

          <SignedIn>
            <div className="flex gap-3 items-center">
              <Button asChild variant="outline" className="gap-1 shadow-sm border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-700 dark:text-gray-300">
                <NavLink href="/upload">
                  <Upload className="w-4 h-4 mr-1" />
                  Upload PDF
                </NavLink>
              </Button>
              {!isLoading && <PlanBadge plan={userPlan} />}
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: 36,
                      height: 36
                    }
                  }
                }}
              />
            </div>
          </SignedIn>
        
          <SignedOut>
            <div className="flex gap-3 items-center">
              <Button asChild variant="outline" className="gap-1 shadow-sm border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
                <NavLink href="/sign-in">
                  <LogIn className="w-4 h-4 mr-1" />
                  Sign In
                </NavLink>
              </Button>
              <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <NavLink href="/sign-up">Sign Up</NavLink>
              </Button>
            </div>
          </SignedOut>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="px-4 py-3 space-y-4">
              <NavLink 
                href="/#pricing" 
                className="block py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </NavLink>
              
              <SignedIn>
                <NavLink 
                  href="/dashboard" 
                  className="flex items-center gap-2 py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </NavLink>
                
                <NavLink 
                  href="/upload" 
                  className="flex items-center gap-2 py-2 px-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Upload className="w-4 h-4" />
                  Upload PDF
                </NavLink>
                
                {!isLoading && (
                  <div className="py-2 px-3">
                    <PlanBadge plan={userPlan} />
                  </div>
                )}
                
                <div className="pt-2 px-3 flex items-center">
                  <UserButton afterSignOutUrl="/" />
                  <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">Your Account</span>
                </div>
              </SignedIn>
              
              <SignedOut>
                <div className="pt-2 space-y-3">
                  <Button 
                    asChild 
                    variant="outline" 
                    className="w-full justify-center text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <NavLink href="/sign-in">Sign In</NavLink>
                  </Button>
                  
                  <Button 
                    asChild 
                    className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <NavLink href="/sign-up">Sign Up</NavLink>
                  </Button>
                </div>
              </SignedOut>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
