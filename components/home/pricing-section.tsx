'use client';

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 }
    }
};

interface UserPlanInfo {
    plan: string;
    creditsUsed: number;
    subscriptionStatus: string;
}

export default function PricingSection() {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [manageLoading, setManageLoading] = useState(false);
    const [userPlan, setUserPlan] = useState<UserPlanInfo | null>(null);
    const router = useRouter();
    const { isSignedIn } = useAuth();
    
    // Fetch user's current plan if signed in
    useEffect(() => {
        if (isSignedIn) {
            fetchUserPlan();
        }
    }, [isSignedIn]);
    
    const fetchUserPlan = async () => {
        try {
            const response = await fetch('/api/user/plan');
            if (response.ok) {
                const data = await response.json();
                setUserPlan(data);
            }
        } catch (error) {
            console.error('Error fetching user plan:', error);
        }
    };
    
    const handleManageSubscription = async () => {
        try {
            setManageLoading(true);
            
            const response = await fetch('/api/stripe/customer-portal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to open customer portal');
            }
            
            const { url } = await response.json();
            window.location.href = url;
        } catch (error) {
            console.error('Error opening customer portal:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to open subscription management portal');
        } finally {
            setManageLoading(false);
        }
    };

    const handleSubscribe = async (planId: string) => {
        try {
            // For all plans, redirect to sign-in if not logged in
            if (!isSignedIn) {
                router.push(`/sign-in?redirect=/dashboard&plan=${planId}`);
                return;
            }

            // For free plan, just redirect to dashboard
            if (planId === 'free') {
                router.push('/dashboard');
                return;
            }

            // User is signed in and selected a paid plan, proceed with subscription
            setIsLoading(planId);

            // Try checkout with retry logic
            let attempts = 0;
            const maxAttempts = 3;
            let success = false;
            let lastError = null;

            while (attempts < maxAttempts && !success) {
                try {
                    attempts++;
                    
                    const response = await fetch('/api/stripe/checkout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ planId }),
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        
                        // If user session expired during the process
                        if (response.status === 401) {
                            // Redirect to sign-in with plan info
                            router.push(`/sign-in?redirect=/dashboard&plan=${planId}`);
                            return;
                        }
                        
                        throw new Error(data.error || 'Failed to create checkout session');
                    }

                    const data = await response.json();
                    
                    // Redirect to Stripe Checkout
                    window.location.href = data.url;
                    success = true;
                } catch (error) {
                    console.error(`Attempt ${attempts} failed:`, error);
                    lastError = error;
                    
                    // Only wait if we're going to retry
                    if (attempts < maxAttempts) {
                        // Exponential backoff: wait longer between each retry
                        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
                    }
                }
            }

            if (!success) {
                throw lastError || new Error('Failed to create checkout session after multiple attempts');
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to start subscription process. Please try again.');
        } finally {
            setIsLoading(null);
        }
    };
    
    // Helper to check if user is subscribed to a specific plan
    const isSubscribedTo = (planId: string) => {
        return isSignedIn && userPlan?.plan === planId && userPlan?.subscriptionStatus === 'active';
    };
    
    // Helper to get button text based on subscription status
    const getButtonText = (planId: string, isLoading: boolean) => {
        if (isLoading) return 'Loading...';
        
        if (!isSignedIn) return 'Sign in to Subscribe';
        
        if (isSubscribedTo(planId)) return 'Current Plan';
        
        if (userPlan?.plan && userPlan?.plan !== 'free' && userPlan?.subscriptionStatus === 'active') {
            return 'Change Plan';
        }
        
        return 'Subscribe';
    };

    return (
        <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-indigo-50 relative overflow-hidden" id="pricing">
            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-50 rounded-full blur-3xl opacity-70 -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-indigo-50 rounded-full blur-3xl opacity-70 -mb-20 -ml-20"></div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Simple, transparent <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">pricing</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Choose the plan that's right for you
                    </p>
                </motion.div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
                >
                    {/* Free Plan */}
                    <motion.div 
                        variants={itemVariants}
                        className={`border ${isSubscribedTo('free') ? 'border-green-500 border-2' : 'border-gray-200'} rounded-xl p-8 bg-white shadow-md hover:shadow-lg transition-all duration-300 flex flex-col`}
                        whileHover={{ y: -5, transition: { duration: 0.3 } }}
                    >
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 -m-8 mb-6 p-8 pt-6 rounded-t-xl">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Free</h3>
                            <p className="text-gray-600 mb-6">Perfect for trying out the service</p>
                            <div className="mb-0">
                                <p className="text-5xl font-bold text-gray-900">
                                    $0
                                </p>
                                <p className="text-gray-500 mt-1">Forever free</p>
                            </div>
                        </div>
                        
                        {isSubscribedTo('free') && (
                            <div className="mb-4 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full w-fit">
                                Current Plan
                            </div>
                        )}
                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-center">
                                <span className="flex-shrink-0 rounded-full p-1 bg-gray-50">
                                    <Check className="h-4 w-4 text-green-500" />
                                </span>
                                <span className="ml-3 text-gray-700">10 PDF summaries per month</span>
                            </li>
                            <li className="flex items-center">
                                <span className="flex-shrink-0 rounded-full p-1 bg-gray-50">
                                    <Check className="h-4 w-4 text-green-500" />
                                </span>
                                <span className="ml-3 text-gray-700">Standard processing speed</span>
                            </li>
                            <li className="flex items-center">
                                <span className="flex-shrink-0 rounded-full p-1 bg-gray-50">
                                    <Check className="h-4 w-4 text-green-500" />
                                </span>
                                <span className="ml-3 text-gray-700">Community support</span>
                            </li>
                        </ul>
                        <Button 
                            onClick={() => handleSubscribe('free')}
                            disabled={isLoading !== null || isSubscribedTo('free')}
                            className="w-full mt-auto rounded-lg py-6 font-semibold"
                            variant={isSubscribedTo('free') ? "secondary" : "outline"}
                            size="lg">
                            {isSubscribedTo('free') ? 'Current Plan' : isSignedIn ? 'Access Dashboard' : 'Get Started'}
                        </Button>
                    </motion.div>

                    {/* Basic Plan */}
                    <motion.div 
                        variants={itemVariants}
                        className={`border ${isSubscribedTo('basic') ? 'border-green-500 border-2' : 'border-gray-200'} rounded-xl p-8 bg-white shadow-md hover:shadow-lg transition-all duration-300 flex flex-col`}
                        whileHover={{ y: -5, transition: { duration: 0.3 } }}
                    >
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 -m-8 mb-6 p-8 pt-6 rounded-t-xl">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Basic</h3>
                            <p className="text-gray-600 mb-6">Perfect for occasional use</p>
                            <div className="mb-0">
                                <p className="text-5xl font-bold text-gray-900">
                                    $9
                                </p>
                                <p className="text-gray-500 mt-1">USD /month</p>
                            </div>
                        </div>
                        
                        {isSubscribedTo('basic') && (
                            <div className="mb-4 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full w-fit">
                                Current Plan
                            </div>
                        )}
                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-center">
                                <span className="flex-shrink-0 rounded-full p-1 bg-blue-50">
                                    <Check className="h-4 w-4 text-blue-500" />
                                </span>
                                <span className="ml-3 text-gray-700">50 PDF summaries per month</span>
                            </li>
                            <li className="flex items-center">
                                <span className="flex-shrink-0 rounded-full p-1 bg-blue-50">
                                    <Check className="h-4 w-4 text-blue-500" />
                                </span>
                                <span className="ml-3 text-gray-700">Standard processing speed</span>
                            </li>
                            <li className="flex items-center">
                                <span className="flex-shrink-0 rounded-full p-1 bg-blue-50">
                                    <Check className="h-4 w-4 text-blue-500" />
                                </span>
                                <span className="ml-3 text-gray-700">Email support</span>
                            </li>
                        </ul>
                        {isSubscribedTo('basic') ? (
                            <Button 
                                onClick={handleManageSubscription}
                                disabled={manageLoading}
                                className="w-full mt-auto rounded-lg py-6 font-semibold"
                                variant="secondary"
                                size="lg">
                                {manageLoading ? 'Loading...' : 'Manage Subscription'}
                            </Button>
                        ) : (
                            <Button 
                                onClick={() => handleSubscribe('basic')}
                                disabled={isLoading === 'basic'}
                                className="w-full mt-auto rounded-lg py-6 font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0"
                                size="lg">
                                {getButtonText('basic', isLoading === 'basic')}
                            </Button>
                        )}
                    </motion.div>

                    {/* Pro Plan */}
                    <motion.div 
                        variants={itemVariants}
                        className={`${isSubscribedTo('pro') ? 'border-green-500' : 'border-rose-500'} border-2 rounded-xl p-8 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col relative z-10`}
                        whileHover={{ y: -5, transition: { duration: 0.3 } }}
                    >
                        <div className="absolute -top-5 right-5 z-20">
                            <span className={`px-4 py-2 ${isSubscribedTo('pro') ? 'bg-green-500' : 'bg-gradient-to-r from-rose-500 to-pink-600'} text-white text-sm font-semibold rounded-full shadow-md`}>
                                {isSubscribedTo('pro') ? 'Your Plan' : 'Most Popular'}
                            </span>
                        </div>
                        
                        <div className="bg-gradient-to-r from-rose-50 to-pink-100 -m-8 mb-6 p-8 pt-6 rounded-t-xl">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Pro</h3>
                            <p className="text-gray-600 mb-6">For professionals and teams</p>
                            <div className="mb-0">
                                <p className="text-5xl font-bold text-gray-900">
                                    $19
                                </p>
                                <p className="text-gray-500 mt-1">USD /month</p>
                            </div>
                        </div>
                        
                        {isSubscribedTo('pro') && (
                            <div className="mb-4 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full w-fit">
                                Current Plan
                            </div>
                        )}
                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-center">
                                <span className="flex-shrink-0 rounded-full p-1 bg-rose-50">
                                    <Check className="h-4 w-4 text-rose-500" />
                                </span>
                                <span className="ml-3 text-gray-700">Unlimited PDF summaries</span>
                            </li>
                            <li className="flex items-center">
                                <span className="flex-shrink-0 rounded-full p-1 bg-rose-50">
                                    <Check className="h-4 w-4 text-rose-500" />
                                </span>
                                <span className="ml-3 text-gray-700">Priority processing</span>
                            </li>
                            <li className="flex items-center">
                                <span className="flex-shrink-0 rounded-full p-1 bg-rose-50">
                                    <Check className="h-4 w-4 text-rose-500" />
                                </span>
                                <span className="ml-3 text-gray-700">24/7 priority support</span>
                            </li>
                            <li className="flex items-center">
                                <span className="flex-shrink-0 rounded-full p-1 bg-rose-50">
                                    <Check className="h-4 w-4 text-rose-500" />
                                </span>
                                <span className="ml-3 text-gray-700">Markdown Export</span>
                            </li>
                        </ul>
                        {isSubscribedTo('pro') ? (
                            <Button 
                                onClick={handleManageSubscription}
                                disabled={manageLoading}
                                className="w-full mt-auto rounded-lg py-6 font-semibold"
                                variant="secondary"
                                size="lg">
                                {manageLoading ? 'Loading...' : 'Manage Subscription'}
                            </Button>
                        ) : (
                            <Button 
                                onClick={() => handleSubscribe('pro')}
                                disabled={isLoading === 'pro'}
                                className={`w-full mt-auto bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-lg py-6 font-semibold border-0`}
                                size="lg">
                                {getButtonText('pro', isLoading === 'pro')}
                            </Button>
                        )}
                    </motion.div>
                </motion.div>
                
                {isSignedIn && userPlan && userPlan.subscriptionStatus === 'active' && userPlan.plan !== 'free' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="mt-12 text-center"
                    >
                        <p className="text-gray-600 mb-4">
                            Need to manage your subscription? Visit your account settings.
                        </p>
                        <Button 
                            onClick={handleManageSubscription}
                            disabled={manageLoading}
                            variant="outline" 
                            className="px-6 py-2">
                            {manageLoading ? 'Loading...' : 'Manage Subscription'}
                        </Button>
                    </motion.div>
                )}
            </div>
        </section>
    );
} 