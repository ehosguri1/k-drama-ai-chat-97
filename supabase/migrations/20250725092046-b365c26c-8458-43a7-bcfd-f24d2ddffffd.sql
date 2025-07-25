-- Criar contas de teste e configurar Joon Park

-- Inserir contas de teste com senhas hash (elas precisarão fazer login através do sistema normal de auth)
-- Primeiro, vamos criar os planos se ainda não existem
INSERT INTO public.subscription_plans (id, name, description, price_brl, features, max_chats_per_day, is_active)
VALUES 
  ('free', 'Gratuito', 'Acesso básico ao chat', 0.00, ARRAY['Chat básico com Joon Park', 'Histórico limitado'], 5, true),
  ('basic', 'Básico', 'Acesso intermediário', 29.90, ARRAY['Chat com múltiplos idols', 'Histórico completo', 'Respostas mais rápidas'], 50, true),
  ('dorameira', 'Dorameira', 'Acesso premium completo', 89.90, ARRAY['Chat ilimitado', 'Todos os idols', 'Prioridade máxima', 'Recursos exclusivos'], NULL, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_brl = EXCLUDED.price_brl,
  features = EXCLUDED.features,
  max_chats_per_day = EXCLUDED.max_chats_per_day,
  is_active = EXCLUDED.is_active;

-- Inserir dados do Joon Park como idol disponível para plano gratuito
-- Vamos criar uma tabela de idols se não existir
CREATE TABLE IF NOT EXISTS public.idols (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  available_plans TEXT[] DEFAULT ARRAY['free', 'basic', 'dorameira'],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS na tabela idols
ALTER TABLE public.idols ENABLE ROW LEVEL SECURITY;

-- Política para permitir que todos vejam idols ativos
CREATE POLICY "Anyone can view active idols" ON public.idols
  FOR SELECT
  USING (is_active = true);

-- Inserir Joon Park como idol de teste
INSERT INTO public.idols (id, name, description, avatar_url, available_plans)
VALUES (
  'joon-park', 
  'Joon Park', 
  'Modelo de testes do IdolChat - disponível para todos os planos', 
  '/lovable-uploads/d30e8196-63c9-4740-b890-49c2ef32c14d.png',
  ARRAY['free', 'basic', 'dorameira']
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  avatar_url = EXCLUDED.avatar_url,
  available_plans = EXCLUDED.available_plans;

-- Trigger para atualizar updated_at nos idols
CREATE TRIGGER update_idols_updated_at
  BEFORE UPDATE ON public.idols
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();