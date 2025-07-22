import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, MessageCircle, Settings, LogOut, Star, Heart, Sparkles, Lock } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Link } from "react-router-dom";
import idol1 from "@/assets/idol-1.jpg";
import idol2 from "@/assets/idol-2.jpg";
import idol3 from "@/assets/idol-3.jpg";

const Dashboard = () => {
  const [hasSubscription] = useState(false); // Simular estado de assinatura

  const idols = [
    {
      id: 1,
      name: "Luna",
      description: "Doce e carinhosa, sempre pronta para conversar sobre música e sonhos",
      image: idol1,
      category: "K-pop Idol",
      personality: "Romântica, sonhadora",
      online: true
    },
    {
      id: 2,
      name: "Hyun-woo",
      description: "Ator de doramas charmoso, inteligente e com senso de humor incrível",
      image: idol2,
      category: "Ator de Dorama",
      personality: "Engraçado, protetor",
      online: true
    },
    {
      id: 3,
      name: "Jin-ho",
      description: "Rapper talentoso e estiloso, adora falar sobre arte e criatividade",
      image: idol3,
      category: "K-pop Rapper",
      personality: "Criativo, confiante",
      online: false
    }
  ];

  const handleChatClick = (idolId: number) => {
    if (!hasSubscription) {
      // Redirecionar para página de assinatura
      window.location.href = '/subscription';
    } else {
      // Abrir chat
      window.location.href = `/chat/${idolId}`;
    }
  };

  const handleLogout = () => {
    // Simular logout
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Crown className="h-8 w-8 text-kpop-purple" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              IdolChat
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {hasSubscription && (
              <Badge className="bg-kpop-gold/20 text-kpop-gold border-kpop-gold/30">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
            
            <ThemeToggle />
            
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">
            Olá, seja bem-vinda! 💜
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            {hasSubscription 
              ? 'Escolha com quem você quer conversar hoje' 
              : 'Escolha seu plano ideal e comece a conversar'
            }
          </p>
        </div>

        {/* Subscription Status */}
        {!hasSubscription && (
          <Card className="mb-8 bg-gradient-primary text-white border-0 shadow-glow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    🚀 Desbloqueie o acesso premium
                  </h3>
                  <p className="opacity-90">
                    Converse ilimitadamente com todos os ídolos - vários planos disponíveis
                  </p>
                </div>
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="w-full md:w-auto"
                  onClick={() => window.location.href = '/subscription'}
                >
                  Ver Planos
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Idols Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {idols.map((idol) => (
            <Card key={idol.id} className="bg-gradient-card border-kpop-purple/20 shadow-card hover:shadow-elegant transition-all duration-300 group">
              <CardHeader className="text-center">
                <div className="relative mx-auto mb-4">
                  <Avatar className="w-24 h-24 border-4 border-kpop-purple/30">
                    <AvatarImage src={idol.image} alt={idol.name} />
                    <AvatarFallback>{idol.name[0]}</AvatarFallback>
                  </Avatar>
                  
                  {/* Status indicator */}
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-card ${
                    idol.online ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  
                  {!hasSubscription && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <Lock className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>

                <CardTitle className="flex items-center justify-center gap-2">
                  {idol.name}
                  <Heart className="h-4 w-4 text-kpop-pink" />
                </CardTitle>

                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="secondary" className="text-xs">
                    {idol.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-kpop-lavender text-kpop-lavender">
                    {idol.personality}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="text-center">
                <CardDescription className="mb-4 text-sm">
                  {idol.description}
                </CardDescription>

                <div className="flex items-center justify-center gap-1 mb-4 text-kpop-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-current" />
                  ))}
                  <span className="text-xs text-muted-foreground ml-2">(4.9)</span>
                </div>

                <Button 
                  variant={hasSubscription ? "default" : "outline"} 
                  className="w-full group-hover:scale-105 transition-transform"
                  onClick={() => handleChatClick(idol.id)}
                  disabled={!idol.online && hasSubscription}
                >
                  {!hasSubscription ? (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Assinar para conversar
                    </>
                  ) : !idol.online ? (
                    <>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Offline
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Conversar agora
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add more idols teaser */}
        <Card className="mt-8 bg-gradient-card border-kpop-purple/20 shadow-card">
          <CardContent className="p-8 text-center">
            <Sparkles className="h-12 w-12 text-kpop-purple mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Mais ídolos chegando em breve!</h3>
            <p className="text-muted-foreground mb-4">
              Estamos trabalhando para trazer ainda mais personagens incríveis para você conversar
            </p>
            <Badge className="bg-kpop-purple/20 text-kpop-purple border-kpop-purple/30">
              ✨ Em desenvolvimento
            </Badge>
          </CardContent>
        </Card>

        {/* Quick Stats for Premium Users */}
        {hasSubscription && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-card border-kpop-purple/20">
              <CardContent className="p-4 text-center">
                <MessageCircle className="h-8 w-8 text-kpop-purple mx-auto mb-2" />
                <p className="text-2xl font-bold">247</p>
                <p className="text-sm text-muted-foreground">Mensagens enviadas</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-kpop-purple/20">
              <CardContent className="p-4 text-center">
                <Heart className="h-8 w-8 text-kpop-pink mx-auto mb-2" />
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Dias ativos</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-kpop-purple/20">
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 text-kpop-gold mx-auto mb-2" />
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Ídolos favoritos</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;