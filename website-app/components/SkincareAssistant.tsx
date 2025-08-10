"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  ShoppingBag,
  Calendar,
  HelpCircle,
  Minimize2
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  suggestions?: string[];
}

export function SkincareAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your personal skincare assistant from Benotia. I'm here to help you with skincare concerns, product recommendations, and personalized advice for Indian skin. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date(),
      suggestions: [
        "Analyze my skin concerns",
        "Recommend products for acne",
        "Help with pigmentation",
        "Create a skincare routine"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    {
      icon: Sparkles,
      text: "What's my skin type?",
      color: "bg-[#D4AF37]"
    },
    {
      icon: ShoppingBag,
      text: "Recommend products",
      color: "bg-[#8B6F47]"
    },
    {
      icon: Calendar,
      text: "Daily routine help",
      color: "bg-[#6B5537]"
    },
    {
      icon: HelpCircle,
      text: "Skincare concerns",
      color: "bg-[#D4AF37]"
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAssistantResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('acne') || lowerMessage.includes('pimple') || lowerMessage.includes('breakout')) {
      return "For acne-prone skin, I recommend our Anti-Acne range! Start with our Clear Skin Salicylic Cleanser (₹849) and Acne Control Serum with Niacinamide + Zinc (₹1,199). These are specifically formulated for Indian skin and humid climate. Would you like me to create a complete routine for you?";
    }
    
    if (lowerMessage.includes('pigmentation') || lowerMessage.includes('dark spots') || lowerMessage.includes('hyperpigmentation')) {
      return "Hyperpigmentation is common in Indian skin! Our Brightening Vitamin C Serum with Ethyl Ascorbic Acid + Arbutin (₹1,299) is clinically proven to reduce dark spots by 40% in 8 weeks. Pair it with our Even Tone Moisturizer for best results. Shall I suggest a complete pigmentation-fighting routine?";
    }
    
    if (lowerMessage.includes('routine') || lowerMessage.includes('skincare routine')) {
      return "I'd love to help create a personalized routine! To give you the best recommendations, could you tell me: 1) Your main skin concerns 2) Your skin type (oily/dry/combination) 3) Any products you're currently using? Our AI skin analysis can also provide detailed insights - would you like to try that?";
    }
    
    if (lowerMessage.includes('skin type') || lowerMessage.includes('oily') || lowerMessage.includes('dry')) {
      return "Understanding your skin type is crucial! For the most accurate assessment, I recommend our free AI Skin Analysis that analyzes 50+ parameters. It only takes 2 minutes and provides detailed insights about your skin type, concerns, and personalized product recommendations. Would you like to start the analysis?";
    }
    
    if (lowerMessage.includes('age') || lowerMessage.includes('aging') || lowerMessage.includes('wrinkles') || lowerMessage.includes('fine lines')) {
      return "Our Anti-Aging collection is perfect for you! The Marine Algae Renewal Mask (₹1,549) improves skin elasticity by 35%, and our Retinol Night Renewal Cream with Bakuchiol (₹1,799) is gentle yet effective. These are formulated for Indian skin maturity. What's your age range so I can suggest the best routine?";
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('₹')) {
      return "All our products are competitively priced with current discounts! Most of our serums range from ₹899-₹1,299, cleansers from ₹749-₹899, and moisturizers from ₹999-₹1,149. We also offer starter kits and subscription plans for better value. Would you like to see products within a specific budget?";
    }

    if (lowerMessage.includes('ingredients') || lowerMessage.includes('active')) {
      return "We use clinically proven actives! Key ingredients include Vitamin C (Ethyl Ascorbic Acid), Niacinamide, Hyaluronic Acid, Retinol with Bakuchiol, Salicylic Acid, and Arbutin. All formulations are designed for Indian skin and climate. Which specific ingredient or concern would you like to know more about?";
    }
    
    // Default responses
    const defaultResponses = [
      "That's a great question! Our dermatologist-backed products are specifically formulated for Indian skin. Could you tell me more about your specific skin concerns so I can provide personalized recommendations?",
      "I'm here to help with all your skincare needs! Our AI-powered analysis can provide detailed insights about your skin. Would you like to share more about what you're looking for?",
      "Thanks for reaching out! Our products are clinically tested and designed for Indian climate conditions. What specific skincare goal would you like to achieve?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAssistantResponse(inputValue),
        sender: 'assistant',
        timestamp: new Date(),
        suggestions: inputValue.toLowerCase().includes('routine') ? 
          ["Start AI analysis", "View product categories", "Book consultation"] : 
          ["Tell me more", "Show products", "Get AI analysis"]
      };

      setMessages(prev => [...prev, assistantResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          className="w-16 h-16 rounded-full bg-[#D4AF37] hover:bg-[#B8941F] text-[#2C1810] shadow-2xl smooth-hover transform hover:scale-110 animate-bounce"
        >
          <MessageCircle className="h-8 w-8" />
        </Button>
        
        {/* Notification Badge */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">1</span>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 hover:opacity-100 transition-opacity">
          <div className="bg-[#2C1810] text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
            Ask me anything about skincare! 
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#2C1810]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 h-[600px] shadow-2xl border-2 border-[#D4AF37] smooth-hover ${isMinimized ? 'h-16' : ''}`}>
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#2C1810] p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Skincare Assistant</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs opacity-90">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={minimizeChat}
                className="text-[#2C1810] hover:bg-white/20 h-8 w-8"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="text-[#2C1810] hover:bg-white/20 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages Area */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px] bg-[#FDF9F3]">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start space-x-2 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user' 
                          ? 'bg-[#8B6F47] text-white' 
                          : 'bg-[#D4AF37] text-[#2C1810]'
                      }`}>
                        {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      
                      <div className={`rounded-2xl p-3 ${
                        message.sender === 'user'
                          ? 'bg-[#8B6F47] text-white'
                          : 'bg-white border border-[#F5F1EB] text-[#2C1810]'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <span className="text-xs opacity-70 block mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    
                    {/* Suggestions */}
                    {message.suggestions && message.sender === 'assistant' && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer hover:bg-[#D4AF37] hover:text-[#2C1810] border-[#D4AF37] text-[#8B6F47] smooth-hover text-xs"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-[#2C1810]" />
                    </div>
                    <div className="bg-white border border-[#F5F1EB] rounded-2xl p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#8B6F47] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-[#8B6F47] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-[#8B6F47] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Quick Questions (show only if no messages from user) */}
            {messages.length === 1 && (
              <div className="px-4 py-2 bg-[#F5F1EB] border-t border-[#D4AF37]/20">
                <p className="text-xs text-[#5A4A3A] mb-2">Quick questions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickQuestions.map((question, index) => {
                    const IconComponent = question.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(question.text)}
                        className={`flex items-center space-x-2 p-2 rounded-lg ${question.color} text-white text-xs smooth-hover hover:opacity-90 transform hover:scale-105`}
                      >
                        <IconComponent className="h-3 w-3" />
                        <span className="truncate">{question.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-[#F5F1EB] bg-white rounded-b-lg">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about skincare, products, routines..."
                  className="flex-1 border-[#D4AF37]/30 focus:border-[#D4AF37] bg-[#FDF9F3]"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-[#D4AF37] hover:bg-[#B8941F] text-[#2C1810] px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-center mt-2">
                <p className="text-xs text-[#5A4A3A] text-center">
                  Powered by Benotia AI • <span className="text-[#D4AF37]">Always here to help</span>
                </p>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}