import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Heart, Smile, Settings, MoreVertical, Phone, Video, Star, Crown } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import idol1 from "@/assets/idol-1.jpg";
import idol2 from "@/assets/idol-2.jpg";
import idol3 from "@/assets/idol-3.jpg";
import joonParkImage from "@/assets/joon-park.jpg";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'idol';
  timestamp: Date;
  type?: 'text' | 'heart';
}

const ChatPage = () => {
  const { idolId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isPremium, loading: subLoading } = useSubscription();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simular dados do idol baseado no ID
  const idols = {
    'joon-park': {
      name: "Joon Park",
      image: joonParkImage,
      status: "Online agora",
      category: "Modelo de Testes",
      personality: "Carismático e atencioso",
      typing: false,
      isFree: true
    },
    '1': { 
      name: "Luna", 
      image: idol1, 
      status: "Online agora", 
      category: "K-pop Idol",
      personality: "Doce e carinhosa",
      typing: false,
      isFree: false
    },
    '2': { 
      name: "Hyun-woo", 
      image: idol2, 
      status: "Online agora", 
      category: "Ator de Dorama",
      personality: "Engraçado e protetor",
      typing: false,
      isFree: false
    },
    '3': { 
      name: "Jin-ho", 
      image: idol3, 
      status: "Offline", 
      category: "K-pop Rapper",
      personality: "Criativo e confiante",
      typing: false,
      isFree: false
    }
  };

  const currentIdol = idols[idolId as keyof typeof idols] || idols['joon-park'];

  useEffect(() => {
    if (!authLoading && !subLoading) {
      if (!user) {
        navigate('/auth');
        return;
      }
      // Allow access to Joon Park for all users (free model)
      if (currentIdol && !currentIdol.isFree && !isPremium()) {
        navigate('/subscription');
        return;
      }
    }
  }, [user, isPremium, authLoading, subLoading, navigate, currentIdol]);

  // Load messages from database
  useEffect(() => {
    if (user && idolId) {
      loadChatHistory();
    }
  }, [user, idolId]);

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user?.id)
        .eq('idol_id', idolId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const loadedMessages: Message[] = data.map(msg => ({
          id: parseInt(msg.id.split('-')[0]),
          text: msg.message,
          sender: msg.sender as 'user' | 'idol',
          timestamp: new Date(msg.created_at),
        }));
        setMessages(loadedMessages);
      } else {
        // Load initial messages if no chat history
        const initialMessages: Message[] = [
          {
            id: 1,
            text: `Oi! Que bom te ver aqui! 💜 Como você está hoje?`,
            sender: 'idol',
            timestamp: new Date(Date.now() - 60000),
          }
        ];
        setMessages(initialMessages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user || !idolId) return;

    // Enhanced input validation
    const sanitizedMessage = message.trim();
    if (sanitizedMessage.length > 1000) {
      toast({
        title: "Mensagem muito longa",
        description: "A mensagem deve ter no máximo 1000 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (sanitizedMessage.length === 0) {
      toast({
        title: "Mensagem vazia",
        description: "Por favor, digite uma mensagem.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Server-side rate limiting check
      const { data: rateCheckResult, error: rateError } = await supabase
        .rpc('check_rate_limit', {
          p_user_id: user.id,
          p_action_type: 'chat_message',
          p_max_actions: 50, // 50 messages per hour
          p_window_minutes: 60
        });

      if (rateError || !rateCheckResult) {
        toast({
          title: "Limite de mensagens atingido",
          description: "Você atingiu o limite de mensagens. Tente novamente mais tarde.",
          variant: "destructive",
        });
        return;
      }
    } catch (error) {
      console.error('Rate limit check failed:', error);
      // Fallback to client-side rate limiting if server check fails
      const now = Date.now();
      const oneHourAgo = now - (60 * 60 * 1000);
      const recentMessages = messages.filter(msg => 
        msg.sender === 'user' && msg.timestamp.getTime() > oneHourAgo
      );
      
      if (recentMessages.length >= 50) {
        toast({
          title: "Limite de mensagens atingido",
          description: "Você pode enviar no máximo 50 mensagens por hora.",
          variant: "destructive",
        });
        return;
      }
    }

    const newMessage: Message = {
      id: Date.now(),
      text: sanitizedMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Save user message to database
    try {
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        idol_id: idolId,
        message: sanitizedMessage,
        sender: 'user'
      });
    } catch (error) {
      console.error('Error saving user message:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente em alguns segundos.",
        variant: "destructive",
      });
      return;
    }

    setMessage("");

    // For Joon Park, use ChatGPT API, for others use predefined responses
    if (idolId === 'joon-park') {
      // Show typing indicator
      const typingIdol = { ...currentIdol, typing: true };
      
      setTimeout(async () => {
        try {
          const { data, error } = await supabase.functions.invoke('chat-with-joon', {
            body: { message: sanitizedMessage }
          });

          if (error) throw error;

          const aiResponse: Message = {
            id: Date.now() + 1,
            text: data.response,
            sender: 'idol',
            timestamp: new Date(),
          };

          setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
          console.error('Error getting AI response:', error);
          // Fallback to default response
          const fallbackResponse: Message = {
            id: Date.now() + 1,
            text: "Desculpe, estou com dificuldades técnicas agora. Tente novamente em alguns minutos! 😅",
            sender: 'idol',
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, fallbackResponse]);
        }
      }, 1000 + Math.random() * 2000);
    } else {
      // Default responses for other idols
      setTimeout(async () => {
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

        // Save AI response to database
        try {
          await supabase.from('chat_messages').insert({
            user_id: user.id,
            idol_id: idolId,
            message: randomResponse,
            sender: 'idol'
          });
        } catch (error) {
          console.error('Error saving AI message:', error);
        }
      }, 1000 + Math.random() * 2000);
    }
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

  if (authLoading || subLoading) {
    return (
      <div className="h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <Crown className="h-8 w-8 text-kpop-purple mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Carregando chat...</p>
        </div>
      </div>
    );
  }

  if (!user || (!currentIdol?.isFree && !isPremium())) return null;

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
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-kpop-purple/30 text-kpop-purple">
                      {currentIdol.category}
                    </Badge>
                    {currentIdol.isFree && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
                        Gratuito
                      </Badge>
                    )}
                  </div>
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
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 1000) {
                  setMessage(value);
                }
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="bg-background/50"
              maxLength={1000}
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

      {/* Premium Features Banner */}
      <div className="bg-gradient-primary text-white p-3 text-center">
        <div className="flex items-center justify-center gap-2 text-sm">
          <Star className="h-4 w-4" />
          {currentIdol?.isFree ? (
            <span>Chat gratuito com {currentIdol.name} • Aproveite!</span>
          ) : (
            <span>Você está usando o plano Premium • Conversas ilimitadas</span>
          )}
          <Star className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;