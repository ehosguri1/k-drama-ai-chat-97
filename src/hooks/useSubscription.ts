import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Subscription {
  id: string;
  plan_id: string;
  status: string;
  expires_at: string | null;
  created_at: string;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    fetchSubscription();
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        return;
      }

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
    if (planId) return subscription.plan_id === planId;
    return subscription.plan_id !== 'free';
  };

  const isPremium = () => {
    return hasActivePlan('basic') || hasActivePlan('dorameira');
  };

  return {
    subscription,
    loading,
    hasActivePlan,
    isPremium,
    createSubscription,
    refetch: fetchSubscription
  };
};