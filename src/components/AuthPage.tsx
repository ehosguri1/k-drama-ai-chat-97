import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Crown, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthPageProps {
  mode: 'login' | 'register';
}

const AuthPage = ({ mode }: AuthPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              display_name: name
            }
          }
        });

        if (error) throw error;

        if (data.user && !data.user.email_confirmed_at) {
          toast({
            title: "Cadastro realizado!",
            description: "Verifique seu email para confirmar a conta.",
          });
        } else {
          toast({
            title: "Bem-vinda!",
            description: "Sua conta foi criada com sucesso.",
          });
          navigate('/dashboard');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Login realizado!",
          description: "Bem-vinda de volta!",
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      let errorMessage = "Erro inesperado. Tente novamente.";
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = "Email ou senha incorretos.";
      } else if (error.message.includes('User already registered')) {
        errorMessage = "Este email já está cadastrado. Tente fazer login.";
      } else if (error.message.includes('Password should be at least')) {
        errorMessage = "A senha deve ter pelo menos 6 caracteres.";
      } else if (error.message.includes('Invalid email')) {
        errorMessage = "Email inválido.";
      }

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="absolute top-4 left-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-kpop-purple" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              IdolChat
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            {mode === 'register' ? 'Criar Conta' : 'Entrar'}
          </h1>
          <p className="text-muted-foreground">
            {mode === 'register' 
              ? 'Junte-se a milhares de fãs!' 
              : 'Bem-vinda de volta!'
            }
          </p>
        </div>

        <Card className="bg-gradient-card border-border/20 shadow-elegant">
          <CardHeader>
            <CardTitle>
              {mode === 'register' ? 'Cadastre-se' : 'Faça login'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {mode === 'login' && (
                <div className="text-right">
                  <Button 
                    type="button" 
                    variant="link" 
                    size="sm"
                    className="px-0"
                    disabled={loading}
                  >
                    Esqueceu a senha?
                  </Button>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'register' ? 'Criar Conta' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">ou</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {mode === 'register' ? 'Já tem uma conta?' : 'Não tem uma conta?'}
                </p>
                <Button 
                  type="button"
                  variant="link" 
                  onClick={() => navigate(mode === 'register' ? '/login' : '/register')}
                  disabled={loading}
                >
                  {mode === 'register' ? 'Fazer login' : 'Cadastre-se gratuitamente'}
                </Button>
              </div>
            </div>

            {mode === 'register' && (
              <div className="mt-4 text-center text-xs text-muted-foreground">
                Ao criar uma conta, você concorda com nossos{' '}
                <Button variant="link" size="sm" className="px-0 h-auto text-xs">
                  Termos de Uso
                </Button>{' '}
                e{' '}
                <Button variant="link" size="sm" className="px-0 h-auto text-xs">
                  Política de Privacidade
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;