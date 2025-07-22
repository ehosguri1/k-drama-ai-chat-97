import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthPageProps {
  mode: 'login' | 'register';
}

const AuthPage = ({ mode }: AuthPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular login/registro - redirecionaria para área do usuário
    console.log(mode === 'login' ? 'Login attempt' : 'Register attempt', { email, password, name });
    
    // Simular sucesso e redirecionar para área do usuário
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao início
          </Link>
          
          <Link to="/" className="flex items-center justify-center gap-2 mb-4 hover:opacity-80 transition-opacity">
            <Crown className="h-8 w-8 text-kpop-purple" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              IdolChat
            </span>
          </Link>
          
          <h1 className="text-3xl font-bold mb-2">
            {mode === 'login' ? 'Bem-vinda de volta!' : 'Criar sua conta'}
          </h1>
          
          <p className="text-muted-foreground">
            {mode === 'login' 
              ? 'Entre na sua conta para conversar com seus ídolos' 
              : 'Junte-se a milhares de fãs apaixonadas'
            }
          </p>
        </div>

        {/* Form Card */}
        <Card className="bg-gradient-card border-kpop-purple/20 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-xl">
              {mode === 'login' ? 'Entrar na conta' : 'Criar conta gratuita'}
            </CardTitle>
            <CardDescription>
              {mode === 'login' 
                ? 'Digite suas credenciais para acessar' 
                : 'Preencha os dados abaixo para começar'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nome completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-background/50"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={mode === 'login' ? 'Sua senha' : 'Crie uma senha segura'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>

              {mode === 'login' && (
                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>
              )}

              <Button type="submit" variant="kpop" className="w-full">
                {mode === 'login' ? 'Entrar' : 'Criar conta'}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-sm text-muted-foreground">ou</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* Switch Mode */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {mode === 'login' ? 'Ainda não tem conta?' : 'Já tem uma conta?'}
              </p>
              <Link 
                to={mode === 'login' ? '/register' : '/login'} 
                className="text-primary hover:underline font-medium"
              >
                {mode === 'login' ? 'Criar conta gratuita' : 'Fazer login'}
              </Link>
            </div>

            {mode === 'register' && (
              <div className="mt-6 p-4 bg-kpop-purple/10 rounded-lg border border-kpop-purple/20">
                <p className="text-xs text-muted-foreground text-center">
                  Ao criar uma conta, você concorda com nossos{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    Termos de Uso
                  </Link>{' '}
                  e{' '}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Política de Privacidade
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;