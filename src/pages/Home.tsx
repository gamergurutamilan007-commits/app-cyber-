import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Shield, Zap, Target, Terminal, Cpu, Network, Globe, Activity, Fingerprint } from 'lucide-react';
import { Button, Card, Badge } from '../components/UI';
import { Link } from 'react-router-dom';

const TypewriterText = ({ text, delay = 100 }: { text: string; delay?: number }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{currentText}</span>;
};

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="min-h-[85vh] flex flex-col lg:flex-row items-center justify-between gap-12 py-12">
        <div className="flex-1 text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 text-[10px] font-bold text-neon-cyan mb-6 tracking-[0.2em] uppercase"
          >
            <Activity className="w-3 h-3 animate-pulse" />
            <span>Neural Link Established</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none"
          >
            SRM MCET <br />
            <span className="text-neon-cyan drop-shadow-[0_0_15px_rgba(0,245,255,0.3)]">AI × CYBER</span> <br />
            <span className="text-text-secondary opacity-50">COMMAND</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-text-secondary max-w-xl mb-10 font-mono leading-relaxed"
          >
            <span className="text-neon-cyan">&gt;</span> <TypewriterText text="The definitive digital headquarters for the next generation of cybersecurity experts and AI researchers." delay={30} />
            <span className="inline-block w-2 h-5 bg-neon-cyan animate-pulse ml-1 align-middle" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link to="/signup">
              <Button variant="cyan" size="lg" className="group uppercase tracking-widest">
                Join Community <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/events">
              <Button variant="outline" size="lg" className="uppercase tracking-widest border-white/10 hover:border-neon-cyan/50">
                Explore Events
              </Button>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 grid grid-cols-3 gap-6 border-l border-white/10 pl-6"
          >
            <div>
              <div className="text-2xl font-black text-text-primary">1.2K+</div>
              <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Nodes Active</div>
            </div>
            <div>
              <div className="text-2xl font-black text-neon-cyan">45+</div>
              <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Operations</div>
            </div>
            <div>
              <div className="text-2xl font-black text-electric-purple">80+</div>
              <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Squads</div>
            </div>
          </motion.div>
        </div>

        <div className="flex-1 relative hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10"
          >
            <div className="relative w-full aspect-square max-w-[500px] mx-auto">
              {/* Central Core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-3xl bg-dark-surface/50 backdrop-blur-xl border border-neon-cyan/40 animate-pulse-slow flex items-center justify-center shadow-[0_0_60px_rgba(0,245,255,0.3)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 via-transparent to-electric-purple/20 animate-pulse" />
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-neon-cyan font-black text-6xl tracking-tighter drop-shadow-[0_0_20px_rgba(0,245,255,0.8)]">SRM</span>
                    <span className="text-text-primary font-bold text-sm tracking-[0.3em] mt-2 opacity-80">MCET</span>
                  </div>
                  <div className="absolute inset-0 bg-neon-cyan/5 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Orbiting Elements */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-dark-surface border border-neon-cyan/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,245,255,0.2)]">
                  <Cpu className="w-6 h-6 text-neon-cyan" />
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-dark-surface border border-electric-purple/30 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                  <Network className="w-6 h-6 text-electric-purple" />
                </div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-dark-surface border border-neon-green/30 flex items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.2)]">
                  <Globe className="w-6 h-6 text-neon-green" />
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-dark-surface border border-soft-red/30 flex items-center justify-center shadow-[0_0_15px_rgba(255,77,77,0.2)]">
                  <Terminal className="w-6 h-6 text-soft-red" />
                </div>
              </motion.div>

              {/* Background Mesh */}
              <div className="absolute inset-0 -z-10 opacity-20">
                <div className="w-full h-full border border-neon-cyan/10 rounded-full animate-pulse" />
                <div className="absolute inset-4 border border-neon-cyan/5 rounded-full animate-pulse-slow" />
              </div>
            </div>
          </motion.div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [0, -40, 0],
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
                className="absolute w-1 h-1 bg-neon-cyan rounded-full"
                style={{ 
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Live Ticker */}
      <div className="w-full bg-dark-surface/50 backdrop-blur-md border-y border-white/5 py-4 overflow-hidden whitespace-nowrap mb-24 relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-dark-bg to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-dark-bg to-transparent z-10" />
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="inline-block"
        >
          <span className="mx-12 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-neon-cyan">
            <span className="mr-2 text-soft-red animate-pulse">●</span> LIVE: CyberSentinel Hackathon 2026 is now OPEN for registration!
          </span>
          <span className="mx-12 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-electric-purple">
            <span className="mr-2 text-neon-cyan animate-pulse">●</span> UPCOMING: Zero-Day CTF starting in 5 days!
          </span>
          <span className="mx-12 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-neon-green">
            <span className="mr-2 text-neon-cyan animate-pulse">●</span> NEW: AI Threat Analyzer tool v2.0 released!
          </span>
          <span className="mx-12 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-text-secondary">
            <span className="mr-2 text-soft-red animate-pulse">●</span> ANNOUNCEMENT: Weekly leaderboard reset in 24 hours.
          </span>
          {/* Duplicate for loop */}
          <span className="mx-12 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-neon-cyan">
            <span className="mr-2 text-soft-red animate-pulse">●</span> LIVE: CyberSentinel Hackathon 2026 is now OPEN for registration!
          </span>
        </motion.div>
      </div>

      {/* Mission Modules */}
      <section className="py-24">
        <div className="text-center mb-16">
          <Badge variant="cyan" className="mb-4">Operational Modules</Badge>
          <h2 className="text-4xl font-black tracking-tight">MISSION PARAMETERS</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card glow variant="cyan" className="group">
            <div className="w-14 h-14 bg-neon-cyan/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,245,255,0.1)]">
              <Shield className="w-7 h-7 text-neon-cyan" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-text-primary">Secure the Future</h3>
            <p className="text-text-secondary text-sm leading-relaxed font-mono">
              Master the art of defensive and offensive security. Learn to protect systems against the next generation of AI-powered threats.
            </p>
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-bold text-neon-cyan uppercase tracking-widest">Status: Active</span>
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            </div>
          </Card>

          <Card glow variant="purple" className="group">
            <div className="w-14 h-14 bg-electric-purple/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(139,92,246,0.1)]">
              <Zap className="w-7 h-7 text-electric-purple" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-text-primary">AI-Driven Defense</h3>
            <p className="text-text-secondary text-sm leading-relaxed font-mono">
              Leverage the power of machine learning and large language models to automate threat detection and incident response.
            </p>
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-bold text-electric-purple uppercase tracking-widest">Status: Operational</span>
              <div className="w-2 h-2 rounded-full bg-electric-purple animate-pulse" />
            </div>
          </Card>

          <Card glow variant="green" className="group">
            <div className="w-14 h-14 bg-neon-green/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(57,255,20,0.1)]">
              <Target className="w-7 h-7 text-neon-green" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-text-primary">Elite Community</h3>
            <p className="text-text-secondary text-sm leading-relaxed font-mono">
              Connect with like-minded students, form elite teams, and climb the leaderboard through consistent participation and excellence.
            </p>
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-bold text-neon-green uppercase tracking-widest">Status: Online</span>
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
