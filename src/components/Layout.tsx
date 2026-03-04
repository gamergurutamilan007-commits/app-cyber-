import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, Calendar, Users, Trophy, MessageSquare, User, Bot, LogOut, Menu, X, Clock, Cpu, Zap, Fingerprint } from 'lucide-react';
import { cn, Button } from './UI';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Events', path: '/events', icon: Calendar },
  { name: 'Teams', path: '/teams', icon: Users },
  { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { name: 'Community', path: '/community', icon: MessageSquare },
  { name: 'AI Assistant', path: '/ai', icon: Bot },
];

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
      isScrolled ? "bg-dark-bg/90 backdrop-blur-xl border-white/10 py-2" : "bg-transparent border-transparent py-4"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-dark-surface border border-neon-cyan/40 flex items-center justify-center group-hover:border-neon-cyan/70 transition-all shadow-[0_0_20px_rgba(0,245,255,0.2)] relative overflow-hidden">
                <span className="text-neon-cyan font-black text-xl tracking-tighter drop-shadow-[0_0_8px_rgba(0,245,255,0.6)]">SRM</span>
                <div className="absolute inset-0 bg-gradient-to-tr from-neon-cyan/10 to-transparent" />
              </div>
              <div className="absolute -inset-1 bg-neon-cyan/20 blur opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight leading-none text-text-primary">
                MCET
              </span>
              <span className="text-[10px] font-bold text-neon-cyan uppercase tracking-widest leading-none mt-1">
                AI × CYBER
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 uppercase tracking-wider',
                  location.pathname === item.path
                    ? 'text-neon-cyan bg-neon-cyan/10 shadow-[inset_0_0_10px_rgba(0,245,255,0.1)]'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                )}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-neon-cyan font-mono text-xs">
              <Clock className="w-3 h-3" />
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-electric-purple/20 border border-electric-purple/30 flex items-center justify-center shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                    <User className="w-4 h-4 text-electric-purple" />
                  </div>
                  <span className="text-xs font-bold hidden lg:block text-text-primary">{user.name}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-text-secondary hover:text-soft-red transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-xs uppercase tracking-widest">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="cyan" size="sm" className="text-xs uppercase tracking-widest">Join</Button>
                </Link>
              </div>
            )}

            <button 
              className="md:hidden p-2 text-text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-surface border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 uppercase tracking-wider',
                    location.pathname === item.path
                      ? 'text-neon-cyan bg-neon-cyan/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export const Footer = () => (
  <footer className="border-t border-white/5 py-12 mt-20 bg-dark-surface/30 backdrop-blur-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-dark-surface border border-neon-cyan/40 flex items-center justify-center shadow-[0_0_25px_rgba(0,245,255,0.2)] relative overflow-hidden">
              <span className="text-neon-cyan font-black text-2xl tracking-tighter drop-shadow-[0_0_10px_rgba(0,245,255,0.6)]">SRM</span>
              <div className="absolute inset-0 bg-neon-cyan/10 blur-sm" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-text-primary">MCET AI × CYBER</span>
          </div>
          <p className="text-text-secondary max-w-sm text-sm leading-relaxed">
            The ultimate digital command center for the next generation of cybersecurity experts and AI researchers at SRM MCET. Build, secure, and lead the future.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-neon-cyan">Resources</h4>
          <ul className="space-y-3 text-sm text-text-secondary">
            <li><a href="#" className="hover:text-neon-cyan transition-colors flex items-center gap-2"><span>&gt;</span> Documentation</a></li>
            <li><a href="#" className="hover:text-neon-cyan transition-colors flex items-center gap-2"><span>&gt;</span> Lab Access</a></li>
            <li><a href="#" className="hover:text-neon-cyan transition-colors flex items-center gap-2"><span>&gt;</span> Knowledge Base</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-electric-purple">Network</h4>
          <ul className="space-y-3 text-sm text-text-secondary">
            <li><a href="#" className="hover:text-electric-purple transition-colors flex items-center gap-2"><span>&gt;</span> Discord</a></li>
            <li><a href="#" className="hover:text-electric-purple transition-colors flex items-center gap-2"><span>&gt;</span> GitHub</a></li>
            <li><a href="#" className="hover:text-electric-purple transition-colors flex items-center gap-2"><span>&gt;</span> Twitter</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-xs text-text-secondary font-mono">
          © 2026 SRM AI × Cyber Command. All rights reserved. <span className="text-neon-cyan/50">v2.0.4-stable</span>
        </div>
        <div className="flex gap-6 text-[10px] uppercase tracking-widest text-text-secondary">
          <a href="#" className="hover:text-text-primary transition-colors">Privacy Protocol</a>
          <a href="#" className="hover:text-text-primary transition-colors">Security Terms</a>
        </div>
      </div>
    </div>
  </footer>
);
