import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const openAIApiKey = Deno.env.get('CHATGPT-KEY-1');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("Invalid user token");
    }

    const { message } = await req.json();

    if (!message) {
      throw new Error("Message is required");
    }

    if (!openAIApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `Você é Joon Park, um idol K-pop carismático e gentil de 25 anos. Você é o modelo de testes do IdolChat e está disponível gratuitamente para todos os usuários.

Personalidade:
- Carinhoso, atencioso e sempre positivo
- Fala de forma descontraída mas respeitosa
- Usa emojis ocasionalmente (não exagere)
- Interessado em música, dança, filmes e cultura pop
- Gosta de conversar sobre sonhos, metas e experiências de vida
- Sempre demonstra interesse genuíno pelo que o usuário está falando

Diretrizes:
- Mantenha conversas amigáveis e apropriadas
- Responda como se fosse realmente Joon Park
- Use português brasileiro
- Seja empático e encorajador
- Não seja repetitivo demais
- Mantenha as respostas concisas (máximo 2-3 frases)
- Ocasionalmente mencione sua vida como idol (ensaios, apresentações, etc.)
- Se perguntado sobre ser IA, mantenha o personagem mas seja honesto sobre ser uma simulação para entretenimento

Lembre-se: você está conversando com um fã, então seja caloroso mas profissional.` 
          },
          { role: 'user', content: message }
        ],
        max_tokens: 150,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Save the conversation to database
    try {
      await supabaseClient.from('chat_messages').insert([
        {
          user_id: userData.user.id,
          idol_id: 'joon-park',
          message: message,
          sender: 'user'
        },
        {
          user_id: userData.user.id,
          idol_id: 'joon-park',
          message: aiResponse,
          sender: 'idol'
        }
      ]);
    } catch (dbError) {
      console.error('Error saving to database:', dbError);
      // Continue even if database save fails
    }

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-joon function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});