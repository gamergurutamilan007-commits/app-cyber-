import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, Loader2 } from 'lucide-react';
import { Button, Card } from '../components/UI';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <Card className="border-neon-blue/20">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-neon-blue/10">
            <Shield className="w-10 h-10 text-neon-blue" />
          </div>
          <h1 className="text-2xl font-bold">Access Command Center</h1>
          <p className="text-slate-400 text-sm">Secure login required to proceed.</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-neon-blue transition-colors"
                placeholder="researcher@srm.edu"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Access Key</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-neon-blue transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full py-3 gap-2">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Authenticate'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          New researcher? <Link to="/signup" className="text-neon-blue hover:underline">Register Identity</Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
