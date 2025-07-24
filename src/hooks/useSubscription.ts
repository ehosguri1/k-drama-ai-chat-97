import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price_brl: number;
  features: string[];
  max_chats_per_day: number | null;
  is_active: boolean;
}

interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('is_active', true)
          .order('price_brl', { ascending: true });

        if (error) throw error;
        setPlans(data || []);
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    fetchSubscription();
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSubscription = async (planId: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan_id: planId,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      setSubscription(data);
      return { data, error: null };
    } catch (error) {
      console.error('Error creating subscription:', error);
      return { data: null, error };
    }
  };

  const hasActivePlan = (planId?: string) => {
    if (!subscription || subscription.status !== 'active') return false;
    
    // Check if subscription is still valid
    if (subscription.expires_at) {
      const expiryDate = new Date(subscription.expires_at);
      if (expiryDate < new Date()) return false;
    }
    
    if (planId) return subscription.plan_id === planId;
    return subscription.plan_id !== 'free';
  };

  const isPremium = () => {
    return hasActivePlan('basico') || hasActivePlan('dorameira');
  };

  const hasAccess = (feature: string) => {
    if (!subscription) return false;
    
    const currentPlan = plans.find(plan => plan.id === subscription.plan_id);
    if (!currentPlan) return false;
    
    return currentPlan.features.includes(feature) || isPremium();
  };

  const getCurrentPlan = () => {
    if (!subscription) return null;
    return plans.find(plan => plan.id === subscription.plan_id) || null;
  };

  return {
    subscription,
    plans,
    loading,
    hasActivePlan,
    isPremium,
    hasAccess,
    getCurrentPlan,
    createSubscription,
    refetch: fetchSubscription
  };
};