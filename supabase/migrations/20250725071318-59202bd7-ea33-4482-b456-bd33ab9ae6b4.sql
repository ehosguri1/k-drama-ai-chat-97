-- Phase 1: Critical Database Security Fixes

-- Add foreign key constraint for subscriptions.plan_id
ALTER TABLE public.subscriptions 
ADD CONSTRAINT fk_subscriptions_plan_id 
FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id);

-- Add unique constraint to prevent multiple active subscriptions per user
CREATE UNIQUE INDEX idx_unique_active_subscription 
ON public.subscriptions (user_id) 
WHERE status = 'active';

-- Add check constraints for data validation
ALTER TABLE public.chat_messages 
ADD CONSTRAINT chk_message_length 
CHECK (length(message) <= 1000 AND length(message) > 0);

ALTER TABLE public.subscriptions 
ADD CONSTRAINT chk_valid_status 
CHECK (status IN ('active', 'inactive', 'cancelled', 'expired'));

ALTER TABLE public.profiles 
ADD CONSTRAINT chk_display_name_length 
CHECK (display_name IS NULL OR (length(display_name) <= 50 AND length(display_name) > 0));

-- Add performance and security indexes
CREATE INDEX idx_chat_messages_user_created 
ON public.chat_messages (user_id, created_at DESC);

CREATE INDEX idx_subscriptions_user_status 
ON public.subscriptions (user_id, status);

CREATE INDEX idx_profiles_user_id 
ON public.profiles (user_id);

-- Add audit trigger for subscription changes
CREATE OR REPLACE FUNCTION public.audit_subscription_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log subscription status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.chat_messages (user_id, idol_id, sender, message)
    VALUES (
      NEW.user_id, 
      'system', 
      'system', 
      'Subscription status changed from ' || COALESCE(OLD.status, 'null') || ' to ' || NEW.status
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER subscription_audit_trigger
  AFTER UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_subscription_changes();

-- Add rate limiting table for message throttling
CREATE TABLE public.user_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  action_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on rate limits table
ALTER TABLE public.user_rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policy for rate limits (users can only see their own)
CREATE POLICY "Users can view their own rate limits" 
ON public.user_rate_limits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can manage rate limits" 
ON public.user_rate_limits 
FOR ALL 
USING (true);

-- Add index for rate limiting lookups
CREATE INDEX idx_rate_limits_user_action_window 
ON public.user_rate_limits (user_id, action_type, window_start DESC);

-- Add function to check rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id UUID,
  p_action_type TEXT,
  p_max_actions INTEGER DEFAULT 100,
  p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
  window_start_time TIMESTAMP WITH TIME ZONE;
BEGIN
  window_start_time := now() - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Clean up old rate limit records
  DELETE FROM public.user_rate_limits 
  WHERE window_start < window_start_time;
  
  -- Count actions in current window
  SELECT COALESCE(SUM(action_count), 0) INTO current_count
  FROM public.user_rate_limits
  WHERE user_id = p_user_id 
    AND action_type = p_action_type 
    AND window_start >= window_start_time;
  
  -- Check if under limit
  IF current_count < p_max_actions THEN
    -- Insert or update rate limit record
    INSERT INTO public.user_rate_limits (user_id, action_type, action_count, window_start)
    VALUES (p_user_id, p_action_type, 1, now())
    ON CONFLICT (user_id, action_type) 
    DO UPDATE SET 
      action_count = user_rate_limits.action_count + 1,
      window_start = CASE 
        WHEN user_rate_limits.window_start < window_start_time 
        THEN now() 
        ELSE user_rate_limits.window_start 
      END;
    
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;