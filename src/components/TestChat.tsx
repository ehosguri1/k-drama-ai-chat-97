import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const TestChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Olá! Eu sou o Joon Park 😊 Esta é sua conversa teste gratuita! Você pode enviar até 3 mensagens para experimentar nosso chat. O que gostaria de saber sobre mim?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messagesLeft, setMessagesLeft] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || messagesLeft <= 0) return;

    const userMessage = {
      id: messages.length + 1,
      text: currentMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);
    setMessagesLeft(prev => prev - 1);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: generateTestResponse(currentMessage),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateTestResponse = (userMessage: string) => {
    const responses = [
      "Que pergunta interessante! 😊 No modo premium, posso dar respostas muito mais detalhadas e personalizadas sobre qualquer assunto que você quiser conversar.",
      "Adorei sua mensagem! 💜 Esta é apenas uma pequena amostra do que posso fazer. Com o plano completo, nossas conversas podem ser muito mais profundas e divertidas!",
      "Muito obrigado por perguntar! 🌟 No chat completo, posso lembrar de nossas conversas anteriores e criar uma conexão ainda mais especial conosco."
    ];
    
    if (messagesLeft === 1) {
      return "Esta foi sua última mensagem teste! 😢 Mas não se preocupe - você pode assinar um de nossos planos para conversas ilimitadas comigo e com outros ídolos! 💜✨";
    }
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link to="/subscription" className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar aos planos
          </Link>
          <Badge className="bg-kpop-purple/20 text-kpop-purple border-kpop-purple/30">
            Chat Teste Gratuito
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Chat Header */}
          <Card className="bg-gradient-card border-border/20 shadow-card mb-4">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/src/assets/joon-park.jpg" alt="Joon Park" />
                  <AvatarFallback>JP</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-xl">Joon Park</CardTitle>
                  <p className="text-muted-foreground">Ator de Dorama • Online</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      Mensagens restantes: {messagesLeft}
                    </Badge>
                    {messagesLeft === 0 && (
                      <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-xs">
                        Limite atingido
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Messages */}
          <Card className="bg-gradient-card border-border/20 shadow-card mb-4">
            <CardContent className="p-6">
              <div className="space-y-4 h-[400px] overflow-y-auto mb-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.isUser 
                        ? 'bg-kpop-purple text-white' 
                        : 'bg-muted text-foreground'
                    }`}>
                      <p className="text-sm md:text-base">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.isUser ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-foreground rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="animate-pulse">Joon está digitando...</div>
                        <MessageCircle className="h-4 w-4 animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={messagesLeft > 0 ? "Digite sua mensagem..." : "Limite de mensagens atingido"}
                  disabled={messagesLeft <= 0 || isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || messagesLeft <= 0 || isLoading}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upgrade Prompt */}
          {messagesLeft <= 1 && (
            <Card className="bg-gradient-primary text-white border-0 shadow-glow">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">
                  {messagesLeft === 0 ? "Teste finalizado! 🎉" : "Última mensagem! ⚡"}
                </h3>
                <p className="mb-4 text-white/90">
                  Gostou da experiência? Assine um plano para conversas ilimitadas com Joon Park e outros ídolos!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    variant="secondary"
                    onClick={() => navigate('/subscription')}
                    className="text-primary"
                  >
                    Ver todos os planos
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/subscription')}
                    className="border-white text-white hover:bg-white hover:text-primary"
                  >
                    Assinar Dorameira Premium
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestChat;