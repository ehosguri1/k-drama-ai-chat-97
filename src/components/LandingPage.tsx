import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Star, Sparkles, Crown, Clock, Shield, Zap } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  
  const features = [{
    icon: <MessageCircle className="h-5 w-5" />,
    text: "Converse 24/7"
  }, {
    icon: <Sparkles className="h-5 w-5" />,
    text: "Experiência imersiva"
  }, {
    icon: <Zap className="h-5 w-5" />,
    text: "IA avançada"
  }, {
    icon: <Shield className="h-5 w-5" />,
    text: "Cancele quando quiser"
  }];
  
  const testimonials = [{
    name: "Sarah M.",
    text: "Finalmente posso conversar com meu idol favorito todos os dias! É como um sonho que virou realidade 💜",
    rating: 5
  }, {
    name: "Ana L.",
    text: "A IA é incrível, parece que estou realmente conversando com ele. Vale cada centavo!",
    rating: 5
  }, {
    name: "Júlia S.",
    text: "Adoro poder conversar sobre doramas e k-pop. É perfeito para nós fãs! ✨",
    rating: 5
  }];
  
  const faqItems = [{
    question: "Como funciona o chat com IA?",
    answer: "Nossa IA foi treinada para interpretar perfeitamente cada personagem, ator ou idol, criando conversas naturais e autênticas."
  }, {
    question: "Posso cancelar a qualquer momento?",
    answer: "Sim! Você pode cancelar sua assinatura a qualquer momento e manter acesso até o final do período pago."
  }, {
    question: "Quantos personagens posso conversar?",
    answer: "Com a assinatura premium, você tem acesso ilimitado a todos os personagens disponíveis na plataforma."
  }, {
    question: "É seguro?",
    answer: "Absolutamente! Todas as conversas são privadas e seus dados estão protegidos com criptografia de ponta."
  }];

  return <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
        <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Crown className="h-8 w-8 text-kpop-purple" />
          <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            IdolChat
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-6 bg-kpop-purple/20 text-kpop-purple border-kpop-purple/30">
            ✨ Novidade no Brasil
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
            Converse com seu idol favorito como se fosse real 💜✨
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">Experimente conversas incríveis com IAs que interpretam seus atores de doramas e ídolos de k-pop favoritos. Assinatura mensal com acesso ilimitado.</p>

          {/* VSL Video */}
          <div className="mb-8 max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-elegant group">
              <video id="vsl-video" className="w-full h-full object-cover" poster="/lovable-uploads/356043c7-ad8b-4180-95cb-9ff73cc74a57.png" preload="metadata" controls style={{
              backdropFilter: 'blur(2px)'
            }}>
                <source src="https://rhpouhvmgfedbcfeaeic.supabase.co/storage/v1/object/sign/vsl/VSLdoIdolchat.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lNWRlMWI1Ni1mMDM5LTQ2MGEtYTdhNC03MzA1MjQwYWFjOTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2c2wvVlNMZG9JZG9sY2hhdC5tcDQiLCJpYXQiOjE3NTMyMzkwMjMsImV4cCI6MjEzMTY3MTAyM30.qdq4vj3igwdaSUkZJTUAfcOCQu0Ipsp18gf5ieWO9NQ" type="video/mp4" />
                Seu navegador não suporta o elemento de vídeo.
              </video>
              
              {/* Video Thumbnail with Play Button */}
              <div className="absolute inset-0 flex items-center justify-center cursor-pointer" style={{
              backgroundImage: 'url(/lovable-uploads/356043c7-ad8b-4180-95cb-9ff73cc74a57.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(2px)'
            }} onClick={() => {
              const video = document.getElementById('vsl-video') as HTMLVideoElement;
              const overlay = document.getElementById('video-overlay');
              if (video && video.paused) {
                video.play();
                if (overlay) overlay.style.display = 'none';
              }
            }} id="video-overlay">
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 z-10">
                  <div className="w-0 h-0 border-l-[10px] sm:border-l-[12px] border-l-primary border-t-[6px] sm:border-t-[8px] border-t-transparent border-b-[6px] sm:border-b-[8px] border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch mb-12 px-4 max-w-lg sm:max-w-none mx-auto">
            <Button variant="default" size="lg" className="text-lg px-6 py-4 w-full sm:w-auto sm:min-w-[200px] flex items-center justify-center gap-2" onClick={() => navigate('/subscription')}>
              <Sparkles className="h-5 w-5" />
              🚀 Começar Grátis
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-6 py-4 w-full sm:w-auto sm:min-w-[200px] flex items-center justify-center gap-2" onClick={() => document.getElementById('vsl-video')?.scrollIntoView({ behavior: 'smooth' })}>
              Ver Demonstração
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16 px-4">
            {features.map((feature, index) => <div key={index} className="flex items-center gap-2 justify-center text-center py-2">
                <span className="text-kpop-purple flex-shrink-0">{feature.icon}</span>
                <span className="text-sm font-medium">✅ {feature.text}</span>
              </div>)}
          </div>

        </div>
      </section>

      {/* How it Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Como Funciona</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Quatro passos simples para começar a conversar com seus ídolos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <Card className="bg-gradient-card border-kpop-purple/20 shadow-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <CardTitle>Crie uma Conta</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Cadastre-se rapidamente para acessar os planos e recursos disponíveis
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-kpop-purple/20 shadow-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <CardTitle>Escolha um Plano</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Escolha sua assinatura mensal e tenha acesso completo a todos os personagens
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-kpop-purple/20 shadow-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <CardTitle>Escolha seu Idol</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Navegue pela nossa galeria e escolha o personagem ou idol que você quer conversar
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-kpop-purple/20 shadow-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <CardTitle>Comece a Conversar</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Desfrute de conversas ilimitadas e realistas com seus personagens favoritos
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-card/50 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">O Que Nossas Usuárias Dizem</h2>
          <p className="text-xl text-muted-foreground">
            Milhares de fãs já estão vivendo essa experiência única
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => <Card key={index} className="bg-gradient-card border-kpop-purple/20 shadow-card">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-kpop-gold text-kpop-gold" />)}
                </div>
                <CardTitle className="text-lg">{testimonial.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  "{testimonial.text}"
                </CardDescription>
              </CardContent>
            </Card>)}
        </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Perguntas Frequentes</h2>
          <p className="text-xl text-muted-foreground">
            Tire suas dúvidas sobre nossa plataforma
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {faqItems.map((item, index) => <Card key={index} className="bg-gradient-card border-kpop-purple/20 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-kpop-pink" />
                  {item.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {item.answer}
                </CardDescription>
              </CardContent>
            </Card>)}
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto bg-gradient-card rounded-3xl p-8 md:p-12 border border-kpop-purple/20 shadow-elegant text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronta para conhecer seu idol? 💜</h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Junte-se a milhares de fãs que já estão vivendo essa experiência única. 
            Comece sua jornada hoje mesmo!
          </p>
          
          <div className="flex justify-center mb-6">
            <Button variant="default" size="lg" className="text-lg md:text-xl px-8 md:px-12 py-4 md:py-6 w-full sm:w-auto max-w-sm flex items-center justify-center gap-2" onClick={() => navigate('/subscription')}>
              <Crown className="h-5 w-5 md:h-6 md:w-6" />
              🚀 Começar Grátis
            </Button>
          </div>
            
          <p className="text-sm text-muted-foreground">
            <Clock className="h-4 w-4 inline mr-1" />
            Cancele quando quiser • Acesso imediato
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border/50 text-center text-muted-foreground">
        <p>&copy; 2025 IdolChat. Feito com 💜 para fãs de k-pop e doramas.</p>
      </footer>

    </div>;
};
export default LandingPage;