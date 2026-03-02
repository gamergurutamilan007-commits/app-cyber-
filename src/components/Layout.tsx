import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, Calendar, Users, Trophy, MessageSquare, User, Bot, LogOut } from 'lucide-react';
import { cn, Button, Logo } from './UI';
import { useAuth } from '../contexts/AuthContext';

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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Logo className="group-hover:bg-neon-blue/10 transition-colors" />
              <div className="absolute -inset-1 bg-neon-blue/20 blur opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight leading-none">
                SRM MCET
              </span>
              <span className="text-[10px] font-bold text-neon-blue uppercase tracking-widest leading-none mt-1">
                AI × CYBER
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2',
                  location.pathname === item.path
                    ? 'text-neon-blue bg-neon-blue/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all">
                  <div className="w-8 h-8 rounded-full bg-electric-purple/20 border border-electric-purple/30 flex items-center justify-center">
                    <User className="w-4 h-4 text-electric-purple" />
                  </div>
                  <span className="text-sm font-medium hidden lg:block">{user.name}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="neon" size="sm">Join</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export const Footer = () => (
  <footer className="border-t border-white/5 py-12 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Logo />
            <span className="font-bold text-lg tracking-tight">SRM MCET AI × CYBER</span>
          </div>
          <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
            The ultimate student ecosystem for the next generation of cybersecurity experts and AI researchers at SRM MCET. Build, secure, and lead the future.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-300">Resources</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="#" className="hover:text-neon-blue transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-neon-blue transition-colors">Lab Access</a></li>
            <li><a href="#" className="hover:text-neon-blue transition-colors">Knowledge Base</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-300">Community</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="#" className="hover:text-neon-blue transition-colors">Discord</a></li>
            <li><a href="#" className="hover:text-neon-blue transition-colors">GitHub</a></li>
            <li><a href="#" className="hover:text-neon-blue transition-colors">Twitter</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-slate-500">
        © 2026 SRM AI × Cyber Command. All rights reserved. Securely encrypted.
      </div>
    </div>
  </footer>
);
