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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 shrink-0">
        <div>
          <Badge variant="cyan" className="mb-4">Neural Interface v2.5</Badge>
          <h1 className="text-5xl font-black tracking-tighter mb-2">AI <span className="text-neon-cyan drop-shadow-[0_0_10px_rgba(0,245,255,0.3)]">ASSISTANT</span></h1>
          <p className="text-text-secondary font-mono text-sm">&gt; Powered by Gemini Core for advanced threat analysis and research.</p>
        </div>

        <div className="flex bg-dark-surface p-1.5 rounded-2xl border border-white/5 shadow-inner">
          <button
            onClick={() => setMode('Chat')}
            className={cn(
              "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3",
              mode === 'Chat' ? "bg-neon-cyan text-dark-bg shadow-[0_0_15px_rgba(0,245,255,0.3)]" : "text-text-secondary hover:text-text-primary"
            )}
          >
            <Bot className="w-4 h-4" /> Chat
          </button>
          <button
            onClick={() => setMode('Threat Analyzer')}
            className={cn(
              "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3",
              mode === 'Threat Analyzer' ? "bg-electric-purple text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]" : "text-text-secondary hover:text-text-primary"
            )}
          >
            <Shield className="w-4 h-4" /> Threat Analyzer
          </button>
        </div>
      </div>

      <Card className="flex-grow flex flex-col p-0 overflow-hidden border-white/5 relative bg-dark-surface/40 backdrop-blur-2xl glass-panel">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-electric-purple to-neon-cyan animate-pulse shadow-[0_0_10px_rgba(0,245,255,0.5)]" />
        
        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar scroll-smooth"
        >
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex gap-5 max-w-[90%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500",
                msg.role === 'user' 
                  ? "bg-electric-purple/10 border-electric-purple/30 text-electric-purple shadow-[0_0_15px_rgba(139,92,246,0.1)]" 
                  : "bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.1)]"
              )}>
                {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
              </div>
              <div className={cn(
                "p-6 rounded-3xl text-sm leading-relaxed shadow-2xl relative group transition-all duration-300",
                msg.role === 'user' 
                  ? "bg-gradient-to-br from-electric-purple/10 to-dark-surface/80 border border-electric-purple/20 text-text-primary rounded-tr-none hover:border-electric-purple/40" 
                  : "bg-gradient-to-br from-neon-cyan/10 to-dark-surface/80 border border-neon-cyan/20 text-text-primary rounded-tl-none hover:border-neon-cyan/40"
              )}>
                <div className="whitespace-pre-wrap font-mono opacity-90">{msg.content}</div>
                <div className={cn(
                  "absolute -bottom-6 text-[9px] font-mono uppercase tracking-[0.2em] opacity-0 group-hover:opacity-40 transition-opacity",
                  msg.role === 'user' ? "right-0" : "left-0"
                )}>
                  {msg.role === 'user' ? 'LOCAL_USER_ID' : 'NEURAL_CORE_RESPONSE'} • {new Date().toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex gap-5 mr-auto">
              <div className="w-12 h-12 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,245,255,0.1)]">
                <Loader2 className="w-6 h-6 text-neon-cyan animate-spin" />
              </div>
              <div className="p-6 rounded-3xl bg-dark-surface/60 border border-white/5 text-text-secondary text-xs italic flex items-center gap-4 shadow-xl">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce shadow-[0_0_8px_rgba(0,245,255,0.5)]" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce shadow-[0_0_8px_rgba(0,245,255,0.5)]" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce shadow-[0_0_8px_rgba(0,245,255,0.5)]" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="font-mono uppercase tracking-widest text-[10px]">Analyzing neural patterns...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-white/5 bg-dark-surface/60 backdrop-blur-3xl">
          <form onSubmit={handleSend} className="flex gap-4 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-cyan opacity-50">
              <Terminal className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'Chat' ? "Input query for neural core..." : "Paste encrypted logs for threat analysis..."}
              className="flex-grow bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-mono focus:outline-none focus:border-neon-cyan focus:bg-neon-cyan/5 transition-all text-text-primary placeholder:text-text-secondary/30"
            />
            <Button type="submit" variant="cyan" disabled={isLoading} className="shrink-0 px-8 rounded-2xl shadow-[0_0_20px_rgba(0,245,255,0.2)]">
              <Send className="w-5 h-5" />
            </Button>
          </form>
          <div className="flex justify-between items-center mt-4 px-2">
            <p className="text-[9px] text-text-secondary/40 font-mono uppercase tracking-[0.3em]">
              Secure Channel • End-to-End Encrypted • Neural Core v2.5
            </p>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-[0_0_5px_rgba(57,255,20,0.5)]" />
              <span className="text-[9px] text-neon-green font-mono uppercase tracking-widest">Core Online</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIAssistant;
