import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Crown, Shield, Trash2, Edit2, Settings, Calendar, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AccountSettings = () => {
  const { user, signOut } = useAuth();
  const { subscription, getCurrentPlan, hasActivePlan, refetch } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      setProfile(data || {});
      setDisplayName(data?.display_name || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          display_name: displayName,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
      
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      // Aqui você implementaria a lógica de cancelamento via Stripe
      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de cancelamento foi processada. O plano será cancelado ao final do período de cobrança.",
      });
      
      // Atualizar estado da assinatura
      refetch();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível processar o cancelamento.",
        variant: "destructive",
      });
    }
  };

  const currentPlan = getCurrentPlan();
  const subscriptionEndDate = subscription?.expires_at ? new Date(subscription.expires_at) : null;

  const getPlanBadgeVariant = (planId: string) => {
    switch (planId) {
      case 'dorameira': return 'default';
      case 'basico': return 'secondary';
      default: return 'outline';
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'dorameira': return <Crown className="h-4 w-4" />;
      case 'basico': return <Shield className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Configurações da Conta</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais e plano de assinatura</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Perfil
              </CardTitle>
              <CardDescription>
                Suas informações pessoais e dados da conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="text-lg">
                    {displayName ? displayName[0]?.toUpperCase() : user.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{displayName || 'Usuário'}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    value={user.email || ''}
                    disabled
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="displayName">Nome de exibição</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Seu nome"
                    />
                    {!isEditing ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={handleUpdateProfile}
                          disabled={loading}
                        >
                          Salvar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsEditing(false);
                            setDisplayName(profile?.display_name || '');
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Gerenciamento do Plano
              </CardTitle>
              <CardDescription>
                Visualize e gerencie sua assinatura atual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentPlan ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getPlanIcon(currentPlan.id)}
                      <span className="font-medium">{currentPlan.name}</span>
                    </div>
                    <Badge variant={getPlanBadgeVariant(currentPlan.id)}>
                      Ativo
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {currentPlan.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Preço:</span>
                      <span className="font-medium">R$ {currentPlan.price_brl.toFixed(2)}/mês</span>
                    </div>
                    
                    {subscriptionEndDate && (
                      <div className="flex justify-between text-sm">
                        <span>Próxima cobrança:</span>
                        <span className="font-medium">
                          {subscriptionEndDate.toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}

                    {currentPlan.max_chats_per_day && (
                      <div className="flex justify-between text-sm">
                        <span>Limite de chats:</span>
                        <span className="font-medium">
                          {currentPlan.max_chats_per_day === -1 ? 'Ilimitado' : `${currentPlan.max_chats_per_day}/dia`}
                        </span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Recursos inclusos:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {currentPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {hasActivePlan() && currentPlan.id !== 'free' && (
                    <>
                      <Separator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="w-full text-destructive border-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cancelar Plano
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tem certeza que deseja cancelar?</AlertDialogTitle>
                            <AlertDialogDescription className="space-y-3">
                              <p>
                                Você está prestes a cancelar seu plano <strong>{currentPlan.name}</strong>.
                              </p>
                              <p>
                                ⚠️ <strong>Você tem certeza disso?</strong> Você perderá todos os benefícios do seu plano assim que o período de assinatura acabar.
                              </p>
                              <p>
                                Seu plano continuará ativo até{' '}
                                <strong>
                                  {subscriptionEndDate?.toLocaleDateString('pt-BR')}
                                </strong>{' '}
                                e após essa data você não terá mais acesso aos recursos premium.
                              </p>
                              <div className="bg-muted p-3 rounded-lg">
                                <p className="text-sm font-medium mb-1">O que você vai perder:</p>
                                <ul className="text-sm space-y-1">
                                  {currentPlan.features.map((feature, index) => (
                                    <li key={index}>• {feature}</li>
                                  ))}
                                </ul>
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Manter meu plano</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleCancelSubscription}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Sim, cancelar plano
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">
                    Você está no plano gratuito
                  </p>
                  <Button onClick={() => navigate('/subscription')}>
                    Fazer upgrade
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Ações da Conta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/subscription')}
                className="flex-1"
              >
                <Crown className="h-4 w-4 mr-2" />
                Gerenciar Planos
              </Button>
              <Button
                variant="destructive"
                onClick={signOut}
                className="flex-1"
              >
                Sair da conta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountSettings;