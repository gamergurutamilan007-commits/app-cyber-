import { motion } from 'motion/react';
import { ArrowRight, Shield, Zap, Target, Terminal } from 'lucide-react';
import { Button, Logo } from '../components/UI';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-neon-blue/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-electric-purple/10 rounded-full blur-[100px] -z-10" />

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8 relative inline-block"
          >
            <Logo size="lg" className="shadow-[0_0_30px_rgba(255,255,255,0.1)]" />
            <div className="absolute -inset-4 bg-neon-blue/20 blur-2xl opacity-50 -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-neon-blue mb-8"
          >
            <Terminal className="w-3 h-3" />
            <span>SYSTEM STATUS: OPERATIONAL</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            SRM MCET AI <span className="text-neon-blue">×</span> CYBER <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-electric-purple">
              COMMAND CENTER
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Build. Secure. Lead. <br />
            The ultimate student ecosystem for managing events, teams, leaderboards, and knowledge sharing in one centralized digital hub.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/events">
              <Button size="lg" className="gap-2">
                Explore Events <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/community">
              <Button variant="outline" size="lg">
                Join Community
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Event Ticker */}
      <div className="w-full bg-white/5 border-y border-white/10 py-3 overflow-hidden whitespace-nowrap mb-20">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="inline-block"
        >
          <span className="mx-8 text-sm font-mono text-neon-blue">LIVE: CyberSentinel Hackathon 2026 is now OPEN for registration!</span>
          <span className="mx-8 text-sm font-mono text-electric-purple">UPCOMING: Zero-Day CTF starting in 5 days!</span>
          <span className="mx-8 text-sm font-mono text-neon-blue">NEW: AI Threat Analyzer tool v2.0 released!</span>
          <span className="mx-8 text-sm font-mono text-slate-400">ANNOUNCEMENT: Weekly leaderboard reset in 24 hours.</span>
          {/* Duplicate for seamless loop */}
          <span className="mx-8 text-sm font-mono text-neon-blue">LIVE: CyberSentinel Hackathon 2026 is now OPEN for registration!</span>
          <span className="mx-8 text-sm font-mono text-electric-purple">UPCOMING: Zero-Day CTF starting in 5 days!</span>
        </motion.div>
      </div>

      {/* Mission Section */}
      <section className="py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="glass-card p-8 group border-neon-blue/20 hover:border-neon-blue/50 transition-all"
          >
            <div className="w-12 h-12 bg-neon-blue/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-neon-blue" />
            </div>
            <h3 className="text-xl font-bold mb-4">Secure the Future</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Master the art of defensive and offensive security. Learn to protect systems against the next generation of AI-powered threats.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="glass-card p-8 group border-electric-purple/20 hover:border-electric-purple/50 transition-all"
          >
            <div className="w-12 h-12 bg-electric-purple/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-electric-purple" />
            </div>
            <h3 className="text-xl font-bold mb-4">AI-Driven Defense</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Leverage the power of machine learning and large language models to automate threat detection and incident response.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="glass-card p-8 group border-white/10 hover:border-white/30 transition-all"
          >
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold mb-4">Community Driven</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Connect with like-minded students, form elite teams, and climb the leaderboard through consistent participation and excellence.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
