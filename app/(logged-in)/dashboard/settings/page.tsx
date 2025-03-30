'use client';

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UserPlanInfo {
  plan: string;
  creditsUsed: number;
  subscriptionStatus: string;
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [userPlan, setUserPlan] = useState<UserPlanInfo | null>(null);
  const router = useRouter();
  
  // Fetch user's current plan
  useEffect(() => {
    fetchUserPlan();
  }, []);
  
  const fetchUserPlan = async () => {
    try {
      const response = await fetch('/api/user/plan');
      if (response.ok) {
        const data = await response.json();
        setUserPlan(data);
      }
    } catch (error) {
      console.error('Error fetching user plan:', error);
      toast.error('Failed to load your subscription information');
    }
  };
  
  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      
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
      setIsLoading(false);
    }
  };
  
  // Helper function to format plan name
  const formatPlanName = (plan: string) => {
    if (!plan) return 'Unknown';
    
    const planMap: Record<string, string> = {
      'free': 'Free',
      'basic': 'Basic ($9/month)',
      'pro': 'Pro ($19/month)',
    };
    
    return planMap[plan] || plan;
  };
  
  // Helper function to format subscription status
  const formatStatus = (status: string) => {
    if (!status) return 'Unknown';
    
    const statusMap: Record<string, string> = {
      'active': 'Active',
      'inactive': 'Inactive',
      'canceled': 'Canceled',
      'past_due': 'Past Due',
      'unpaid': 'Unpaid',
    };
    
    return statusMap[status] || status;
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Subscription</h2>
        
        {userPlan ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Current Plan</p>
                <p className="font-medium">{formatPlanName(userPlan.plan)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    userPlan.subscriptionStatus === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></span>
                  {formatStatus(userPlan.subscriptionStatus)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Credits Used</p>
                <p className="font-medium">{userPlan.creditsUsed} / {userPlan.plan === 'pro' ? 'Unlimited' : userPlan.plan === 'basic' ? '50' : '10'}</p>
              </div>
            </div>
            
            {userPlan.subscriptionStatus === 'active' && userPlan.plan !== 'free' && (
              <div className="mt-6">
                <Button 
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                  variant="outline"
                  className="transition-all"
                >
                  {isLoading ? 'Loading...' : 'Manage Subscription'}
                </Button>
                <p className="mt-2 text-sm text-gray-500">
                  You'll be redirected to the Stripe Customer Portal to manage your subscription.
                </p>
              </div>
            )}
            
            {userPlan.plan === 'free' && (
              <div className="mt-6">
                <Button 
                  onClick={() => router.push('/#pricing')}
                  variant="default"
                  className="transition-all"
                >
                  Upgrade Plan
                </Button>
                <p className="mt-2 text-sm text-gray-500">
                  Upgrade to get more features and credits.
                </p>
              </div>
            )}
            
            {userPlan.subscriptionStatus !== 'active' && userPlan.plan !== 'free' && (
              <div className="mt-6">
                <Button 
                  onClick={() => router.push('/#pricing')}
                  variant="default"
                  className="transition-all"
                >
                  Reactivate Subscription
                </Button>
                <p className="mt-2 text-sm text-gray-500">
                  Your subscription is no longer active. Reactivate to continue accessing premium features.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="animate-pulse h-6 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="animate-pulse h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
          </div>
        )}
      </div>
      
      {/* Add more settings sections as needed */}
    </div>
  );
} 