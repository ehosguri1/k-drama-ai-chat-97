import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, UserPlus, ArrowLeft, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const TestAccountsPage = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const createTestAccount = async (email: string, password: string, plan: string, displayName: string) => {
    try {
      console.log(`Creating test account: ${email}`);
      
      // Create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            display_name: displayName
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }

      if (authData.user) {
        console.log(`User created with ID: ${authData.user.id}`);
        
        // Wait a moment for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create subscription for the test account
        const { error: subError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: authData.user.id,
            plan_id: plan,
            status: 'active',
            expires_at: '2099-12-31T23:59:59.000Z'
          });

        if (subError) {
          console.error('Subscription error:', subError);
          // Don't throw here, the account was created successfully
          toast({
            title: "Conta criada parcialmente",
            description: `Conta ${email} criada, mas erro na assinatura: ${subError.message}`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Conta de teste criada!",
            description: `Conta ${email} criada com plano ${plan}`,
          });
        }
      }
    } catch (error: any) {
      console.error('Error creating test account:', error);
      toast({
        title: "Erro",
        description: `Erro ao criar conta ${email}: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const createAllTestAccounts = async () => {
    setLoading(true);
    
    try {
      await createTestAccount('testeDoramas@teste.com', 'TesteDoramas123!', 'dorameira', 'Teste Dorameira');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait between requests
      await createTestAccount('testeBasico@teste.com', 'TesteBasico123!', 'basic', 'Teste Básico');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
              IdolChat - Contas de Teste
            </span>
          </div>
          
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
        </div>

        <Card className="bg-gradient-card border-border/20 shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Criar Contas de Teste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="p-4 bg-card/50 rounded-lg border border-border/20">
                  <h3 className="font-semibold text-kpop-purple mb-2">Conta Dorameira (Premium)</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    <strong>Email:</strong> testeDoramas@teste.com
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Senha:</strong> TesteDoramas123!
                  </p>
                </div>
                
                <div className="p-4 bg-card/50 rounded-lg border border-border/20">
                  <h3 className="font-semibold text-kpop-purple mb-2">Conta Básica</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    <strong>Email:</strong> testeBasico@teste.com
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Senha:</strong> TesteBasico123!
                  </p>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <p className="font-semibold text-amber-600 dark:text-amber-400 mb-2">⚠️ Importante:</p>
                <ul className="space-y-1 text-xs">
                  <li>• As contas são criadas com assinaturas válidas até 2099</li>
                  <li>• Use apenas para testes e desenvolvimento</li>
                  <li>• As contas podem ser recriadas se necessário</li>
                  <li>• O Joon Park está disponível gratuitamente para todos</li>
                </ul>
              </div>
              
              <Button 
                onClick={createAllTestAccounts}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar Ambas as Contas de Teste
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestAccountsPage;