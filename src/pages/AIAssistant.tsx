import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, Shield, Zap, AlertTriangle, Terminal, Loader2, User } from 'lucide-react';
import { Button, Card, Badge, cn } from '../components/UI';
import { GoogleGenAI } from "@google/genai";

const AIAssistant = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: 'Greetings, researcher. I am the Command Center AI. How can I assist you with your cybersecurity or AI inquiries today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'Chat' | 'Threat Analyzer'>('Chat');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = mode === 'Chat' 
        ? `You are a helpful AI assistant for a Cybersecurity and AI student community. Answer the following question concisely and professionally: ${userMessage}`
        : `You are a Cybersecurity Threat Analyzer. Analyze the following input for potential security risks, vulnerabilities, or malicious intent. Provide a structured feedback: ${userMessage}`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const aiResponse = response.text || "I'm sorry, I couldn't process that request. My neural links are experiencing interference.";
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "ERROR: Connection to AI Core lost. Please check your API configuration." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 h-[calc(100vh-160px)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 shrink-0">
        <div>
          <h1 className="text-4xl font-bold mb-2">AI <span className="text-neon-blue">Assistant</span></h1>
          <p className="text-slate-400">Powered by Gemini Core for advanced threat analysis and research.</p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setMode('Chat')}
            className={cn(
              "px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2",
              mode === 'Chat' ? "bg-neon-blue text-dark-bg" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Bot className="w-3 h-3" /> Chat
          </button>
          <button
            onClick={() => setMode('Threat Analyzer')}
            className={cn(
              "px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2",
              mode === 'Threat Analyzer' ? "bg-electric-purple text-white" : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Shield className="w-3 h-3" /> Threat Analyzer
          </button>
        </div>
      </div>

      <Card className="flex-grow flex flex-col p-0 overflow-hidden border-white/5 relative bg-dark-bg/40 backdrop-blur-xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-electric-purple to-neon-blue animate-pulse" />
        
        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar"
        >
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-lg",
                msg.role === 'user' 
                  ? "bg-electric-purple/20 border-electric-purple/30 text-electric-purple" 
                  : "bg-neon-blue/20 border-neon-blue/30 text-neon-blue"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed shadow-xl relative group",
                msg.role === 'user' 
                  ? "bg-gradient-to-br from-electric-purple/20 to-dark-bg border border-electric-purple/30 text-slate-200 rounded-tr-none" 
                  : "bg-gradient-to-br from-neon-blue/20 to-dark-bg border border-neon-blue/30 text-slate-300 rounded-tl-none"
              )}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div className={cn(
                  "absolute -bottom-5 text-[9px] font-mono uppercase tracking-tighter opacity-0 group-hover:opacity-50 transition-opacity",
                  msg.role === 'user' ? "right-0" : "left-0"
                )}>
                  {msg.role === 'user' ? 'Local User' : 'AI Core Response'} • {new Date().toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex gap-4 mr-auto">
              <div className="w-10 h-10 rounded-xl bg-neon-blue/20 border border-neon-blue/30 flex items-center justify-center shrink-0">
                <Loader2 className="w-5 h-5 text-neon-blue animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-500 text-xs italic flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                AI is analyzing neural patterns...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/5 bg-white/5">
          <form onSubmit={handleSend} className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'Chat' ? "Ask anything about AI or Cyber..." : "Paste code or logs for threat analysis..."}
              className="flex-grow bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-blue transition-colors"
            />
            <Button type="submit" disabled={isLoading} className="shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-[10px] text-slate-600 mt-2 text-center uppercase tracking-widest">
            Secure Channel • End-to-End Encrypted • Powered by Gemini
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AIAssistant;
