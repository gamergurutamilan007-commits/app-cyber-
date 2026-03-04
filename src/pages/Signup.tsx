import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, User, Loader2, Cpu, Zap, Fingerprint } from 'lucide-react';
import { Button, Card } from '../components/UI';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(name, email, password);
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <Card glow variant="purple" className="border-electric-purple/20 bg-dark-surface/40 backdrop-blur-2xl p-10 relative overflow-hidden glass-panel">
        <div className="absolute top-0 left-0 w-full h-1 bg-electric-purple" />
        <div className="text-center mb-10">
          <div className="w-28 h-28 rounded-3xl bg-dark-surface border border-electric-purple/40 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(139,92,246,0.2)] relative group overflow-hidden">
            <span className="text-electric-purple font-black text-4xl tracking-tighter drop-shadow-[0_0_15px_rgba(139,92,246,0.7)] group-hover:scale-110 transition-transform relative z-10">SRM</span>
            <div className="absolute inset-0 bg-electric-purple/10 animate-pulse" />
            <div className="absolute inset-0 bg-electric-purple/5 blur-xl rounded-full" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-2 uppercase">REGISTER <span className="text-electric-purple">IDENTITY</span></h1>
          <p className="text-text-secondary font-mono text-[10px] uppercase tracking-[0.3em]">&gt; Join the neural command network.</p>
        </div>

        {error && (
          <div className="bg-soft-red/10 border border-soft-red/20 text-soft-red text-[10px] font-mono p-4 rounded-xl mb-8 uppercase tracking-widest flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-soft-red rounded-full animate-pulse" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Full Designation (Name)</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-electric-purple transition-colors" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm font-mono focus:outline-none focus:border-electric-purple focus:bg-electric-purple/5 transition-all text-text-primary placeholder:text-text-secondary/20"
                placeholder="Alex Cipher"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Neural Link (Email)</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-electric-purple transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm font-mono focus:outline-none focus:border-electric-purple focus:bg-electric-purple/5 transition-all text-text-primary placeholder:text-text-secondary/20"
                placeholder="researcher@neural.net"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Access Key (Password)</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-electric-purple transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm font-mono focus:outline-none focus:border-electric-purple focus:bg-electric-purple/5 transition-all text-text-primary placeholder:text-text-secondary/20"
                placeholder="••••••••"
              />
            </div>
          </div>
          <Button type="submit" variant="purple" disabled={isLoading} className="w-full py-4 gap-3 uppercase tracking-[0.4em] text-xs font-black shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'REGISTER IDENTITY'}
          </Button>
        </form>

        <div className="mt-10 text-center text-[10px] font-mono uppercase tracking-[0.2em] text-text-secondary">
          Already registered? <Link to="/login" className="text-electric-purple hover:text-electric-purple/80 transition-colors font-black">Authenticate</Link>
        </div>
      </Card>
    </div>
  );
};

export default Signup;
