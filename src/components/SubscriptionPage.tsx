import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, X, ArrowLeft, MessageCircle, Heart, Sparkles, Shield, Zap, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

const SubscriptionPage = () => {
  const plans = [
    {
      id: "free",
      name: "Gratuito",
      price: "R$ 0",
      period: "sempre",
      description: "Experimente o IdolChat",
      badge: null,
      color: "muted",
      features: [
        { text: "3 mensagens por dia", included: true },
        { text: "1 personagem disponível", included: true },
        { text: "IA básica", included: true },
        { text: "Histórico limitado", included: true },
        { text: "Acesso a todos os ídolos", included: false },
        { text: "Conversas ilimitadas", included: false },
        { text: "IA premium", included: false },
        { text: "Recursos exclusivos", included: false },
      ]
    },
    {
      id: "basic",
      name: "Básico",
      price: "R$ 19,90",
      period: "por mês",
      description: "Para fãs iniciantes",
      badge: null,
      color: "secondary",
      features: [
        { text: "50 mensagens por dia", included: true },
        { text: "5 personagens disponíveis", included: true },
        { text: "IA avançada", included: true },
        { text: "Histórico de conversas", included: true },
        { text: "Personalização básica", included: true },
        { text: "Acesso a todos os ídolos", included: false },
        { text: "Conversas ilimitadas", included: false },
        { text: "Recursos exclusivos", included: false },
      ]
    },
    {
      id: "fan",
      name: "Fã",
      price: "R$ 24,90",
      period: "por mês",
      description: "Para verdadeiros fãs",
      badge: "🔥 Popular",
      color: "accent",
      features: [
        { text: "200 mensagens por dia", included: true },
        { text: "15 personagens disponíveis", included: true },
        { text: "IA premium", included: true },
        { text: "Histórico ilimitado", included: true },
        { text: "Personalização de chat", included: true },
        { text: "Notificações personalizadas", included: true },
        { text: "Conversas ilimitadas", included: false },
        { text: "Acesso antecipado", included: false },
      ]
    },
    {
      id: "dorameira",
      name: "Dorameira",
      price: "R$ 39,90",
      period: "por mês",
      description: "Experiência completa",
      badge: "👑 Premium",
      color: "primary",
      features: [
        { text: "Conversas ilimitadas", included: true },
        { text: "Acesso a todos os ídolos", included: true },
        { text: "IA de alta qualidade", included: true },
        { text: "Recursos exclusivos", included: true },
        { text: "Acesso antecipado", included: true },
        { text: "Chat em tempo real", included: true },
        { text: "Personalização avançada", included: true },
        { text: "Modo offline", included: true },
      ]
    }
  ];

  const comparisonFeatures = [
    "Mensagens por dia",
    "Personagens disponíveis", 
    "Qualidade da IA",
    "Histórico de conversas",
    "Personalização",
    "Notificações",
    "Acesso antecipado",
    "Recursos exclusivos"
  ];

  const getFeatureValue = (planId: string, featureIndex: number) => {
    const values = {
      free: ["3", "1", "Básica", "Limitado", "❌", "❌", "❌", "❌"],
      basic: ["50", "5", "Avançada", "✅", "Básica", "❌", "❌", "❌"],
      fan: ["200", "15", "Premium", "✅", "✅", "✅", "❌", "❌"],
      dorameira: ["Ilimitadas", "Todos", "Alta qualidade", "✅", "✅", "✅", "✅", "✅"]
    };
    return values[planId as keyof typeof values][featureIndex];
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <ThemeToggle />
        </div>
        
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center gap-2 mb-4 hover:opacity-80 transition-opacity">
            <Crown className="h-8 w-8 text-kpop-purple" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              IdolChat
            </span>
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Escolha seu plano ideal 💜
          </h1>
          
          <p className="text-xl text-foreground max-w-2xl mx-auto">
            Encontre o plano perfeito para conversar com seus ídolos favoritos.
          </p>
        </div>
      </header>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                plan.id === 'dorameira' 
                  ? 'bg-gradient-primary text-white border-0 shadow-glow' 
                  : 'bg-gradient-card border-border/20 shadow-card'
              }`}
            >
              {plan.badge && (
                <div className="absolute top-4 right-4">
                  <Badge className={`${
                    plan.id === 'dorameira' 
                      ? 'bg-kpop-gold/20 text-kpop-gold border-kpop-gold/30' 
                      : 'bg-kpop-purple/20 text-kpop-purple border-kpop-purple/30'
                  } text-xs`}>
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className={`text-2xl font-bold ${
                  plan.id === 'dorameira' ? 'text-white' : 'text-foreground'
                }`}>
                  {plan.name}
                </CardTitle>
                <CardDescription className={`${
                  plan.id === 'dorameira' ? 'text-white/80' : 'text-muted-foreground'
                }`}>
                  {plan.description}
                </CardDescription>
                
                <div className="text-center py-4">
                  <div className={`text-4xl font-bold ${
                    plan.id === 'dorameira' ? 'text-white' : 'text-foreground'
                  }`}>
                    {plan.price}
                  </div>
                  <div className={`${
                    plan.id === 'dorameira' ? 'text-white/80' : 'text-muted-foreground'
                  }`}>
                    {plan.period}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {plan.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      feature.included 
                        ? plan.id === 'dorameira' 
                          ? 'bg-white/20' 
                          : 'bg-kpop-purple/20'
                        : plan.id === 'dorameira'
                          ? 'bg-white/10'
                          : 'bg-muted/50'
                    }`}>
                      {feature.included ? (
                        <Check className={`h-3 w-3 ${
                          plan.id === 'dorameira' ? 'text-white' : 'text-kpop-purple'
                        }`} />
                      ) : (
                        <X className={`h-3 w-3 ${
                          plan.id === 'dorameira' ? 'text-white/50' : 'text-muted-foreground'
                        }`} />
                      )}
                    </div>
                    <span className={`text-sm ${
                      plan.id === 'dorameira' 
                        ? feature.included ? 'text-white' : 'text-white/50'
                        : feature.included ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {feature.text}
                    </span>
                  </div>
                ))}

                <Button 
                  variant={plan.id === 'dorameira' ? 'secondary' : 'default'}
                  size="lg" 
                  className="w-full mt-6 font-semibold"
                  onClick={() => window.open('https://checkout.com', '_blank')}
                >
                  {plan.id === 'free' ? 'Começar Grátis' : '🚀 Assinar Agora'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Compare todos os planos</h2>
          <p className="text-xl text-muted-foreground">
            Veja todos os recursos lado a lado
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="bg-gradient-card border-border/20 shadow-card overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-3 md:p-4 font-semibold text-foreground min-w-[150px]">Recursos</th>
                      {plans.map((plan) => (
                        <th key={plan.id} className={`text-center p-3 md:p-4 font-semibold min-w-[100px] ${
                          plan.id === 'dorameira' 
                            ? 'bg-gradient-primary text-white' 
                            : 'text-foreground'
                        }`}>
                          <div className="text-sm md:text-base">{plan.name}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, index) => (
                      <tr key={index} className="border-b border-border/30 last:border-0">
                        <td className="p-3 md:p-4 font-medium text-foreground text-sm md:text-base">{feature}</td>
                        {plans.map((plan) => (
                          <td key={plan.id} className={`text-center p-3 md:p-4 text-sm md:text-base ${
                            plan.id === 'dorameira' 
                              ? 'bg-kpop-purple/10 font-semibold text-kpop-purple' 
                              : 'text-foreground'
                          }`}>
                            {getFeatureValue(plan.id, index)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Money Back Guarantee */}
      <section className="container mx-auto px-4 py-12">
        <Card className="max-w-3xl mx-auto bg-gradient-card border-border/20 shadow-elegant">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 text-kpop-purple mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-foreground">Garantia de 7 dias</h3>
            <p className="text-lg text-muted-foreground mb-6">
              Não está satisfeita? Devolvemos 100% do seu dinheiro nos primeiros 7 dias, 
              sem perguntas e sem complicações.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Cancelamento fácil
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Reembolso total
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Sem taxas ocultas
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Pronta para começar? 💜
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Junte-se a milhares de fãs que já descobriram a magia de conversar com seus ídolos. 
            Comece hoje mesmo!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline"
              size="lg" 
              className="text-lg px-8 py-4"
            >
              Começar Grátis
            </Button>
            <Button 
              variant="default"
              size="lg" 
              className="text-lg px-8 py-4"
              onClick={() => window.open('https://checkout.com', '_blank')}
            >
              <Crown className="h-5 w-5" />
              Assinar Dorameira
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            Sem compromisso • Cancele quando quiser • Acesso imediato
          </p>
        </div>
      </section>
    </div>
  );
};

export default SubscriptionPage;