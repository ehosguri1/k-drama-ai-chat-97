-- Fix function search path security issue
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;