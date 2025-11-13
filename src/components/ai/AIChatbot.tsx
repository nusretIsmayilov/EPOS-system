import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  Sparkles,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface AIChatbotProps {
  section?: string;
  context?: string;
}

export function AIChatbot({ section = 'general', context = '' }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message based on section
      const welcomeMessages = {
        dashboard: "Hi! I'm your AI assistant for dashboard analytics. I can help you understand your sales data, performance metrics, and provide business insights.",
        menu: "Hello! I'm here to help you manage your menu items, categories, pricing, and optimize your offerings.",
        orders: "Hi there! I can assist you with order management, tracking, and processing workflows.",
        staff: "Hello! I'm your staff management assistant. I can help with scheduling, roles, and team optimization.",
        inventory: "Hi! I can help you manage inventory, track stock levels, and optimize supply chain operations.",
        customers: "Hello! I'm here to assist with customer management, loyalty programs, and relationship building.",
        pos: "Hi! I can help you with point of sale operations, transactions, and sales tracking.",
        reservations: "Hello! I'm your reservation management assistant. I can help with bookings and table optimization.",
        general: "Hi! I'm your AI restaurant assistant. I can help you with any aspect of restaurant management. What would you like to know?"
      };

      const welcomeMessage = welcomeMessages[section as keyof typeof welcomeMessages] || welcomeMessages.general;

      setMessages([{
        id: '1',
        content: welcomeMessage,
        role: 'assistant',
        timestamp: new Date()
      }]);
    }
  }, [isOpen, section]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          context,
          section,
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble responding right now.",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getSectionColor = (section: string) => {
    const colors = {
      dashboard: 'bg-blue-500',
      menu: 'bg-green-500',
      orders: 'bg-orange-500',
      staff: 'bg-purple-500',
      inventory: 'bg-red-500',
      customers: 'bg-pink-500',
      pos: 'bg-yellow-500',
      reservations: 'bg-indigo-500',
      general: 'bg-primary'
    };
    return colors[section as keyof typeof colors] || colors.general;
  };

  if (!isOpen) {
    return (
      <div className={`fixed z-50 ${isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'}`}>
        <Button
          onClick={() => setIsOpen(true)}
          className={`rounded-full ${isMobile ? 'w-12 h-12' : 'w-14 h-14'} p-0 ${getSectionColor(section)} hover:scale-110 transition-all duration-300 shadow-lg animate-pulse`}
        >
          <div className="relative">
            <MessageCircle className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 animate-spin" />
          </div>
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed z-50 transition-all duration-300 animate-scale-in ${isMobile
      ? `bottom-4 left-4 right-4 ${isMinimized ? 'h-12' : 'h-80'}`
      : `bottom-6 right-6 ${isMinimized ? 'w-80 h-12' : 'w-96 h-[500px]'}`
      }`}>
      <Card className="w-full h-full shadow-2xl border-2 flex flex-col">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-full ${getSectionColor(section)}`}>
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm">AI Assistant</CardTitle>
                <Badge variant="secondary" className="text-xs capitalize">
                  {section}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-8 h-8 p-0"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-4 pt-0 flex flex-col h-full overflow-hidden">
            <ScrollArea className={`flex-1 pr-4 ${isMobile ? 'mb-2' : 'mb-4'} min-h-0`}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 animate-fade-in ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                  >
                    <div className={`p-2 rounded-full ${message.role === 'user'
                      ? 'bg-primary'
                      : getSectionColor(section)
                      }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`max-w-[70%] ${message.role === 'user' ? 'text-right' : 'text-left'
                      }`}>
                      <div className={`p-3 rounded-lg ${message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                        }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 animate-fade-in">
                    <div className={`p-2 rounded-full ${getSectionColor(section)}`}>
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="max-w-[70%]">
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className={`flex gap-2 flex-shrink-0 ${isMobile ? 'sticky bottom-0 bg-background pt-2' : ''}`}>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                size="sm"
                className="px-3 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}