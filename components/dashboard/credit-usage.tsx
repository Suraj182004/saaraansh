'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { getPlanLimit, getPlanUsage } from "@/utils/plan-utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Zap, Sparkles, ChevronRight } from "lucide-react";

export default function CreditUsage() {
  const [planData, setPlanData] = useState<{
    plan: string;
    creditsUsed: number;
    subscriptionStatus: string;
  }>({
    plan: 'free',
    creditsUsed: 0,
    subscriptionStatus: 'inactive'
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchUserPlan() {
      try {
        const response = await fetch('/api/user/plan');
        if (response.ok) {
          const data = await response.json();
          setPlanData({
            plan: data.plan || 'free',
            creditsUsed: data.creditsUsed || 0,
            subscriptionStatus: data.subscriptionStatus || 'inactive'
          });
        }
      } catch (error) {
        console.error('Error fetching user plan:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUserPlan();
  }, []);
  
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 overflow-hidden border border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle>Loading plan information...</CardTitle>
          </CardHeader>
        </Card>
      </motion.div>
    );
  }
  
  // Safely get the plan limit
  let planLimit = 10; // Default for free plan
  if (planData.plan === 'basic') planLimit = 50;
  if (planData.plan === 'pro') planLimit = 1000; // "Unlimited"
  
  // Calculate usage percentage - max 100%
  const usagePercentage = Math.min(100, (planData.creditsUsed / planLimit) * 100);
  const creditsLeft = planLimit - planData.creditsUsed;
  const isUnlimited = planData.plan === 'pro';
  
  // Determine color based on plan
  const getPlanColors = () => {
    switch(planData.plan) {
      case 'pro':
        return {
          icon: <Crown className="h-5 w-5 text-purple-500" />,
          gradient: "from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/30",
          progressColor: "bg-gradient-to-r from-purple-500 to-indigo-500",
          badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
        };
      case 'basic':
        return {
          icon: <Zap className="h-5 w-5 text-blue-500" />,
          gradient: "from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/30",
          progressColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
          badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        };
      default:
        return {
          icon: <Sparkles className="h-5 w-5 text-gray-500" />,
          gradient: "from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-950",
          progressColor: "bg-gradient-to-r from-gray-500 to-slate-500",
          badgeColor: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        };
    }
  };
  
  const planColors = getPlanColors();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`w-full bg-gradient-to-r ${planColors.gradient} overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm`}>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <motion.div 
              className="flex items-center gap-2"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {planColors.icon}
              <span className="flex items-center">
                <span className="capitalize font-bold">
                  {planData.plan} Plan
                </span>
              </span>
            </motion.div>
            {planData.subscriptionStatus === 'active' && (
              <motion.span 
                className={`text-sm px-3 py-1 rounded-full ${planColors.badgeColor} flex items-center gap-1`}
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Active
              </motion.span>
            )}
          </CardTitle>
          <CardDescription className="mt-2">
            {isUnlimited 
              ? "You have unlimited PDF summaries this month." 
              : `You have used ${planData.creditsUsed} out of ${planLimit} summaries this month.`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-between text-sm font-medium">
              <span>Used: <span className="font-bold">{planData.creditsUsed}</span></span>
              <span>Limit: <span className="font-bold">{isUnlimited ? 'Unlimited' : planLimit}</span></span>
            </div>
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full ${planColors.progressColor} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${usagePercentage}%` }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              />
            </div>
            {!isUnlimited && (
              <motion.p 
                className="text-sm text-right mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <span className="font-bold">{creditsLeft}</span> summaries remaining
              </motion.p>
            )}
          </motion.div>
        </CardContent>
        <CardFooter>
          <motion.div
            className="w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {planData.plan === 'free' ? (
              <Button asChild className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700">
                <Link href="/#pricing" className="flex items-center justify-center">
                  Upgrade Your Plan <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild className="w-full">
                <Link href="/account" className="flex items-center justify-center">
                  Manage Subscription <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            )}
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}