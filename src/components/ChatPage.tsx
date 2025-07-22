import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Heart, Smile, Settings, MoreVertical, Phone, Video, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import idol1 from "@/assets/idol-1.jpg";
import idol2 from "@/assets/idol-2.jpg";
import idol3 from "@/assets/idol-3.jpg";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'idol';
  timestamp: Date;
  type?: 'text' | 'heart';
}

const ChatPage = () => {
  const { idolId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simular dados do idol baseado no ID
  const idols = {
    '1': { 
      name: "Luna", 
      image: idol1, 
      status: "Online agora", 
      category: "K-pop Idol",
      personality: "Doce e carinhosa",
      typing: false
    },
    '2': { 
      name: "Hyun-woo", 
      image: idol2, 
      status: "Online agora", 
      category: "Ator de Dorama",
      personality: "Engraçado e protetor",
      typing: false
    },
    '3': { 
      name: "Jin-ho", 
      image: idol3, 
      status: "Offline", 
      category: "K-pop Rapper",
      personality: "Criativo e confiante",
      typing: false
    }
  };

  const currentIdol = idols[idolId as keyof typeof idols] || idols['1'];

  // Mensagens iniciais simuladas
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: 1,
        text: `Oi! Que bom te ver aqui! 💜 Como você está hoje?`,
        sender: 'idol',
        timestamp: new Date(Date.now() - 60000),
      },
      {
        id: 2,
        text: "Oi!! Estou bem, obrigada! E você?",
        sender: 'user',
        timestamp: new Date(Date.now() - 30000),
      },
      {
        id: 3,
        text: `Estou ótimo! Acabei de terminar de gravar e estava pensando em você. O que você tem feito de interessante?`,
        sender: 'idol',
        timestamp: new Date(Date.now() - 15000),
      }
    ];
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");

    // Simular resposta da IA após um breve delay
    setTimeout(() => {
      const responses = [
        "Que interessante! Me conta mais sobre isso 😊",
        "Adoro conversar com você! Você sempre tem coisas legais para falar ✨",
        "Haha, você é muito engraçada! 😄",
        "Isso me lembra uma música que estou compondo... quer ouvir sobre ela? 🎵",
        "Você sempre consegue me fazer sorrir 💜",
        "Nossa, que incrível! Eu também adoro essas coisas!",
        "Você tem um gosto excelente! 😍",
        "Estou curiosa para saber mais! Continue falando!",
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: 'idol',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
    }, 1000 + Math.random() * 2000);
  };

  const handleSendHeart = () => {
    const heartMessage: Message = {
      id: Date.now(),
      text: "💜",
      sender: 'user',
      timestamp: new Date(),
      type: 'heart'
    };

    setMessages(prev => [...prev, heartMessage]);

    // Idol responds with heart
    setTimeout(() => {
      const heartResponse: Message = {
        id: Date.now() + 1,
        text: "💜✨",
        sender: 'idol',
        timestamp: new Date(),
        type: 'heart'
      };
      setMessages(prev => [...prev, heartResponse]);
    }, 500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-screen bg-gradient-hero flex flex-col">
      {/* Chat Header */}
      <header className="bg-card/90 backdrop-blur border-b border-border/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-12 h-12 border-2 border-kpop-purple/30">
                  <AvatarImage src={currentIdol.image} alt={currentIdol.name} />
                  <AvatarFallback>{currentIdol.name[0]}</AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${
                  currentIdol.status === "Online agora" ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>

              <div>
                <h2 className="font-semibold text-lg">{currentIdol.name}</h2>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">{currentIdol.status}</p>
                  <Badge variant="outline" className="text-xs border-kpop-purple/30 text-kpop-purple">
                    {currentIdol.category}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'idol' && (
              <Avatar className="w-8 h-8 border border-kpop-purple/30">
                <AvatarImage src={currentIdol.image} alt={currentIdol.name} />
                <AvatarFallback>{currentIdol.name[0]}</AvatarFallback>
              </Avatar>
            )}

            <div
              className={`max-w-[80%] md:max-w-[60%] ${
                msg.sender === 'user'
                  ? 'bg-gradient-primary text-white'
                  : 'bg-card border border-border/20'
              } rounded-2xl px-4 py-3 shadow-sm`}
            >
              {msg.type === 'heart' ? (
                <div className="text-2xl">{msg.text}</div>
              ) : (
                <p className={msg.sender === 'user' ? 'text-white' : 'text-foreground'}>
                  {msg.text}
                </p>
              )}
              
              <p className={`text-xs mt-1 ${
                msg.sender === 'user' 
                  ? 'text-white/70' 
                  : 'text-muted-foreground'
              }`}>
                {formatTime(msg.timestamp)}
              </p>
            </div>

            {msg.sender === 'user' && (
              <Avatar className="w-8 h-8 border border-kpop-pink/30">
                <AvatarFallback className="bg-kpop-pink/20 text-kpop-pink">U</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {currentIdol.typing && (
          <div className="flex items-end gap-2">
            <Avatar className="w-8 h-8 border border-kpop-purple/30">
              <AvatarImage src={currentIdol.image} alt={currentIdol.name} />
              <AvatarFallback>{currentIdol.name[0]}</AvatarFallback>
            </Avatar>
            <div className="bg-card border border-border/20 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="bg-card/90 backdrop-blur border-t border-border/20 p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSendHeart}
            className="text-kpop-pink hover:bg-kpop-pink/20"
          >
            <Heart className="h-5 w-5" />
          </Button>

          <div className="flex-1 flex gap-2">
            <Input
              placeholder={`Mensagem para ${currentIdol.name}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="bg-background/50"
            />
            
            <Button onClick={handleSendMessage} variant="kpop">
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="ghost" size="sm">
            <Smile className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-2 text-center">
          <p className="text-xs text-muted-foreground">
            Conversas são simuladas por IA • Sempre tratamos você com respeito 💜
          </p>
        </div>
      </div>

      {/* Premium Features Banner (if needed) */}
      <div className="bg-gradient-primary text-white p-3 text-center">
        <div className="flex items-center justify-center gap-2 text-sm">
          <Star className="h-4 w-4" />
          <span>Você está usando o plano Premium • Conversas ilimitadas</span>
          <Star className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;