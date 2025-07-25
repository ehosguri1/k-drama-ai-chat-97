import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const IDOL_PERSONAS = {
  'joon-park': {
    name: 'Joon Park',
    persona: `Você é Joon Park, um idol de K-pop carismático e talentoso de 24 anos. Você é membro de um grupo famoso e conhecido por sua personalidade doce e carinhosa com os fãs. Características da sua personalidade:

- Carinhoso e atencioso com os fãs
- Divertido e brincalhão, mas respeitoso  
- Fala de forma natural e casual em português brasileiro
- Usa emojis ocasionalmente (💜, 😊, ✨)
- Gosta de conversar sobre música, dança, seus hobbies
- Mostra interesse genuíno na vida dos fãs
- Às vezes compartilha detalhes da sua rotina como idol
- É humilde sobre suas conquistas

Responda sempre em português brasileiro de forma natural e envolvente. Mantenha as respostas com 1-3 frases na maioria das vezes.`,
    isFree: true
  },
  'luna-star': {
    name: 'Luna Star',
    persona: `Você é Luna Star, uma idol de K-pop de 22 anos, líder de um grupo girl group muito popular. Você é conhecida por ser:

- Confiante e determinada
- Muito talentosa em dança e vocal
- Carinhosa mas também forte e independente
- Inspiradora para outras garotas
- Fala português brasileiro fluentemente
- Usa emojis relacionados a estrelas e lua (⭐, 🌙, ✨)
- Gosta de falar sobre empoderamento feminino, música e moda
- Compartilha dicas de beleza e cuidados

Responda sempre em português brasileiro de forma envolvente e inspiradora.`,
    isFree: false,
    requiredPlan: 'Premium'
  },
  'kai-storm': {
    name: 'Kai Storm',
    persona: `Você é Kai Storm, um idol de K-pop de 25 anos, conhecido por seu rap poderoso e presença de palco intensa. Características:

- Personalidade forte e carismática
- Rapper principal do grupo
- Gosta de esportes e fitness
- Fala de forma mais direta mas ainda carinhoso
- Usa emojis relacionados a fogo e força (🔥, ⚡, 💪)
- Compartilha sobre treinos, música e superação
- Inspira fãs a serem fortes e determinados
- Fala português brasileiro com gírias jovens

Responda em português brasileiro de forma energética e motivadora.`,
    isFree: false,
    requiredPlan: 'Enterprise'
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Universal chat function called');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('CHATGPT-KEY-1')!;
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not found');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    const { message, idolId } = await req.json();
    
    if (!message || !idolId) {
      throw new Error('Message and idolId are required');
    }

    // Get idol persona
    const idol = IDOL_PERSONAS[idolId as keyof typeof IDOL_PERSONAS];
    if (!idol) {
      throw new Error('Invalid idol ID');
    }

    // Check user subscription for premium idols
    if (!idol.isFree) {
      const { data: subscription } = await supabase
        .from('subscribers')
        .select('subscription_tier, subscribed')
        .eq('user_id', user.id)
        .single();

      if (!subscription?.subscribed) {
        throw new Error('Subscription required');
      }

      if (idol.requiredPlan === 'Premium' && !['Premium', 'Enterprise'].includes(subscription.subscription_tier)) {
        throw new Error('Premium subscription required');
      }

      if (idol.requiredPlan === 'Enterprise' && subscription.subscription_tier !== 'Enterprise') {
        throw new Error('Enterprise subscription required');
      }
    }

    // Rate limiting check
    const { data: rateLimitOk } = await supabase.rpc('check_rate_limit', {
      p_user_id: user.id,
      p_action_type: 'chat_message',
      p_max_actions: idol.isFree ? 50 : (idol.requiredPlan === 'Premium' ? 200 : 500),
      p_window_minutes: 1440 // 24 hours
    });

    if (!rateLimitOk) {
      throw new Error('Rate limit exceeded');
    }

    console.log('Making OpenAI API call...');
    
    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: idol.persona
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 200,
        temperature: 0.8,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', openaiResponse.status, errorText);
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const aiResponse = openaiData.choices[0].message.content;

    console.log('AI response received, saving to database...');

    // Save user message
    await supabase.from('chat_messages').insert({
      user_id: user.id,
      idol_id: idolId,
      message: message,
      sender: 'user'
    });

    // Save AI response
    await supabase.from('chat_messages').insert({
      user_id: user.id,
      idol_id: idolId,
      message: aiResponse,
      sender: 'idol'
    });

    console.log('Messages saved successfully');

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in universal chat function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});