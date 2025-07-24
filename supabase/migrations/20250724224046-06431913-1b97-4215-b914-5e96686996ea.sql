-- Create subscription plans table for better data management
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_brl DECIMAL(10,2) NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  max_chats_per_day INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default plans
INSERT INTO public.subscription_plans (id, name, description, price_brl, features, max_chats_per_day) VALUES
('basico', 'Básico', 'Plano básico para começar', 19.90, 
 ARRAY['Acesso a 1 idol', 'Chat limitado', 'Suporte básico'], 10),
('dorameira', 'Dorameira', 'Plano premium completo', 39.90, 
 ARRAY['Acesso ilimitado a todos os idols', 'Conversas ilimitadas', 'Suporte prioritário', 'Novos personagens primeiro'], -1)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_brl = EXCLUDED.price_brl,
  features = EXCLUDED.features,
  max_chats_per_day = EXCLUDED.max_chats_per_day,
  updated_at = now();

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read plans (public information)
CREATE POLICY "Anyone can view subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (is_active = true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update user_subscriptions table to reference the new plans table
ALTER TABLE public.user_subscriptions 
ADD CONSTRAINT fk_user_subscriptions_plan_id 
FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id);