import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, UserPlus } from "lucide-react";

const TestAccounts = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createTestAccount = async (email: string, password: string, plan: string, displayName: string) => {
    try {
      setLoading(true);
      
      // First create the user account
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

      if (authError) throw authError;

      if (authData.user) {
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
        }

        toast({
          title: "Conta de teste criada!",
          description: `Conta ${email} criada com plano ${plan}`,
        });
      }
    } catch (error: any) {
      console.error('Error creating test account:', error);
      toast({
        title: "Erro",
        description: `Erro ao criar conta: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTestAccounts = async () => {
    await createTestAccount('testeDoramas@teste.com', 'TesteDoramas123!', 'dorameira', 'Teste Dorameira');
    await createTestAccount('testeBasico@teste.com', 'TesteBasico123!', 'basic', 'Teste Básico');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Criar Contas de Teste
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p><strong>Conta Dorameira:</strong> testeDoramas@teste.com</p>
            <p>Senha: TesteDoramas123!</p>
            <br />
            <p><strong>Conta Básica:</strong> testeBasico@teste.com</p>
            <p>Senha: TesteBasico123!</p>
          </div>
          
          <Button 
            onClick={createTestAccounts}
            disabled={loading}
            className="w-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar Contas de Teste
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestAccounts;