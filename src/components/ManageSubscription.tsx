import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Crown, Calendar, CreditCard, Shield, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";

const ManageSubscription = () => {
  const { user } = useAuth();
  const { subscription, loading } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleCancelSubscription = () => {
    toast({
      title: "Cancelamento solicitado",
      description: "Sua assinatura será cancelada no próximo ciclo de cobrança.",
    });
  };

  const handleReactivateSubscription = () => {
    toast({
      title: "Assinatura reativada",
      description: "Sua assinatura continuará ativa normalmente.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <Crown className="h-12 w-12 text-kpop-purple mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Carregando informações da assinatura...</p>
        </div>
      </div>
    );
  }

  const subscriptionStatus = {
    isActive: subscription?.status === 'active',
    plan: subscription?.plan_id === 'basic' ? 'Básico' : subscription?.plan_id === 'dorameira' ? 'Dorameira' : 'Gratuito',
    nextBilling: subscription?.expires_at ? new Date(subscription.expires_at).toLocaleDateString('pt-BR') : 'N/A',
    amount: subscription?.plan_id === 'basic' ? 'R$ 9,90' : subscription?.plan_id === 'dorameira' ? 'R$ 19,90' : 'Gratuito',
    cancelRequested: false
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-kpop-purple" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Gerenciar Assinatura
            </span>
          </div>
          
          <h1 className="text-4xl font-bold mb-2">
            Sua Assinatura Premium
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Gerencie seus dados de cobrança e assinatura
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Current Plan Status */}
        <Card className="mb-8 bg-gradient-card border-kpop-purple/20 shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="h-8 w-8 text-kpop-gold" />
                <div>
                  <CardTitle className="text-2xl">Plano {subscriptionStatus.plan}</CardTitle>
                  <CardDescription className="text-lg">
                    Acesso completo a todos os recursos
                  </CardDescription>
                </div>
              </div>
              
              <Badge className={`${
                subscriptionStatus.isActive && !subscriptionStatus.cancelRequested
                  ? 'bg-green-500/20 text-green-500 border-green-500/30'
                  : subscriptionStatus.cancelRequested
                  ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                  : 'bg-red-500/20 text-red-500 border-red-500/30'
              }`}>
                {subscriptionStatus.isActive && !subscriptionStatus.cancelRequested
                  ? '✅ Ativo'
                  : subscriptionStatus.cancelRequested
                  ? '⏳ Cancelamento Pendente'
                  : '❌ Cancelado'
                }
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <CreditCard className="h-8 w-8 text-kpop-purple mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Valor Mensal</p>
                <p className="text-2xl font-bold">{subscriptionStatus.amount}</p>
              </div>
              
              <div className="text-center">
                <Calendar className="h-8 w-8 text-kpop-purple mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {subscriptionStatus.cancelRequested ? 'Acesso até' : 'Próxima cobrança'}
                </p>
                <p className="text-lg font-semibold">
                  {new Date(subscriptionStatus.nextBilling).toLocaleDateString('pt-BR')}
                </p>
              </div>
              
              <div className="text-center">
                <Shield className="h-8 w-8 text-kpop-purple mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Status da conta</p>
                <p className="text-lg font-semibold text-green-500">Protegida</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warning if cancellation is pending */}
        {subscriptionStatus.cancelRequested && (
          <Card className="mb-8 bg-yellow-500/10 border-yellow-500/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-yellow-600 mb-2">
                    Cancelamento Solicitado
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Seu plano será cancelado e você perderá acesso ao chat premium ao final do seu ciclo atual 
                    em {new Date(subscriptionStatus.nextBilling).toLocaleDateString('pt-BR')}.
                  </p>
                  <Button onClick={handleReactivateSubscription} variant="kpop" size="sm">
                    Reativar Assinatura
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription Benefits */}
        <Card className="mb-8 bg-gradient-card border-kpop-purple/20 shadow-card">
          <CardHeader>
            <CardTitle>Benefícios da sua assinatura</CardTitle>
            <CardDescription>
              Tudo que você tem acesso com o plano Premium
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Conversas ilimitadas com todos os ídolos",
                "Respostas instantâneas da IA",
                "Acesso a novos personagens primeiro",
                "Conversas privadas e seguras",
                "Atendimento prioritário",
                "Sem anúncios ou interrupções",
                "Backup automático das conversas",
                "Recursos exclusivos em desenvolvimento"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Billing Information */}
        <Card className="mb-8 bg-gradient-card border-kpop-purple/20 shadow-card">
          <CardHeader>
            <CardTitle>Informações de cobrança</CardTitle>
            <CardDescription>
              Gerencie seus dados de pagamento
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-background/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">**** **** **** 1234</p>
                    <p className="text-sm text-muted-foreground">Visa • Expira 12/26</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Atualizar
                </Button>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-background/50 rounded-lg">
                  <div>
                    <p className="font-medium">Email de cobrança</p>
                    <p className="text-sm text-muted-foreground">{user?.email || 'N/A'}</p>
                  </div>
                <Button variant="outline" size="sm">
                  Alterar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Statistics */}
        <Card className="mb-8 bg-gradient-card border-kpop-purple/20 shadow-card">
          <CardHeader>
            <CardTitle>Uso da plataforma</CardTitle>
            <CardDescription>
              Suas estatísticas dos últimos 30 dias
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <p className="text-2xl font-bold text-kpop-purple">1,247</p>
                <p className="text-sm text-muted-foreground">Mensagens enviadas</p>
              </div>
              
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <p className="text-2xl font-bold text-kpop-purple">28</p>
                <p className="text-sm text-muted-foreground">Dias ativos</p>
              </div>
              
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <p className="text-2xl font-bold text-kpop-purple">3</p>
                <p className="text-sm text-muted-foreground">Ídolos favoritos</p>
              </div>
              
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <p className="text-2xl font-bold text-kpop-purple">42h</p>
                <p className="text-sm text-muted-foreground">Tempo total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cancel Subscription */}
        {subscriptionStatus.isActive && !subscriptionStatus.cancelRequested && (
          <Card className="bg-gradient-card border-red-500/20 shadow-card">
            <CardHeader>
              <CardTitle className="text-red-500">Cancelar assinatura</CardTitle>
              <CardDescription>
                Você pode cancelar sua assinatura a qualquer momento
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Ao cancelar, você manterá acesso aos recursos premium até o final do período pago atual.
                Após isso, sua conta será convertida para o plano gratuito.
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    Cancelar assinatura
                  </Button>
                </AlertDialogTrigger>
                
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza que deseja cancelar?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Seu plano será cancelado e você perderá acesso ao chat premium ao final do seu ciclo atual 
                      em {new Date(subscriptionStatus.nextBilling).toLocaleDateString('pt-BR')}.
                      
                      <br /><br />
                      
                      Você pode reativar sua assinatura a qualquer momento antes desta data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  
                  <AlertDialogFooter>
                    <AlertDialogCancel>Manter assinatura</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancelSubscription} className="bg-red-500 hover:bg-red-600">
                      Sim, cancelar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ManageSubscription;