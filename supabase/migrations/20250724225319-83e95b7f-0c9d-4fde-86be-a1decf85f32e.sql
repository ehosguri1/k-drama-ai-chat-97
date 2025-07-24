-- Phase 1: Database Security Enhancements

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
CHECK (LENGTH(message) <= 1000 AND LENGTH(message) > 0);

ALTER TABLE public.subscriptions 
ADD CONSTRAINT chk_valid_status 
CHECK (status IN ('active', 'expired', 'cancelled', 'pending'));

ALTER TABLE public.profiles 
ADD CONSTRAINT chk_display_name_length 
CHECK (display_name IS NULL OR (LENGTH(display_name) <= 50 AND LENGTH(display_name) > 0));

-- Add performance and security indexes
CREATE INDEX idx_chat_messages_user_created 
ON public.chat_messages (user_id, created_at DESC);

CREATE INDEX idx_subscriptions_user_status 
ON public.subscriptions (user_id, status);

CREATE INDEX idx_subscriptions_expires_at 
ON public.subscriptions (expires_at) 
WHERE expires_at IS NOT NULL;