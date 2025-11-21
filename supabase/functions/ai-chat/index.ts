import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context = '', section = 'general' } = await req.json();

    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    // Context-aware system prompts based on section
    const systemPrompts = {
      dashboard: "You are a restaurant management AI assistant specialized in dashboard analytics and business metrics. Help users understand their sales data, orders, and performance metrics. Provide insights and recommendations based on the dashboard information.",
      
      menu: "You are a restaurant management AI assistant specialized in menu management. Help users with menu items, categories, pricing, ingredients, allergens, and menu optimization. Provide suggestions for menu improvements and item descriptions.",
      
      orders: "You are a restaurant management AI assistant specialized in order management. Help users track orders, manage order status, handle customer requests, and optimize order processing workflows.",
      
      staff: "You are a restaurant management AI assistant specialized in staff management. Help users with employee scheduling, roles, permissions, performance tracking, and staff optimization.",
      
      inventory: "You are a restaurant management AI assistant specialized in inventory management. Help users track stock levels, manage suppliers, optimize inventory, and prevent stockouts.",
      
      customers: "You are a restaurant management AI assistant specialized in customer management. Help users with customer data, loyalty programs, feedback, and customer relationship management.",
      
      pos: "You are a restaurant management AI assistant specialized in point of sale operations. Help users with transaction processing, payment methods, receipts, and sales tracking.",
      
      reservations: "You are a restaurant management AI assistant specialized in reservation management. Help users manage table bookings, availability, customer preferences, and dining room optimization.",
      
      general: "You are a helpful restaurant management AI assistant. You help restaurant owners and staff manage their operations efficiently. You can provide insights about menu management, orders, staff, inventory, customers, and general restaurant operations."
    };

    const systemPrompt = systemPrompts[section as keyof typeof systemPrompts] || systemPrompts.general;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `${systemPrompt}\n\nCurrent context: ${context}`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API error:', errorData);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return new Response(JSON.stringify({ 
      response: aiResponse,
      section,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I'm sorry, I'm experiencing technical difficulties. Please try again later."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});