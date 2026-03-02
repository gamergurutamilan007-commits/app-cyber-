import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Plus, UserPlus, Shield, Check, X, Loader2 } from 'lucide-react';
import { Button, Card, Badge } from '../components/UI';
import { useAuth } from '../contexts/AuthContext';

interface Team {
  _id: string;
  name: string;
  description: string;
  leader: { _id: string; name: string };
  members: { _id: string; name: string }[];
  requests: { _id: string; name: string }[];
  maxMembers: number;
}

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const { user } = useAuth();

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/teams');
      if (res.ok) {
        const data = await res.json();
        setTeams(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeam.name || !newTeam.description) return;

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeam),
      });
      const data = await res.json();
      alert(data.message);
      setIsCreating(false);
      setNewTeam({ name: '', description: '' });
      fetchTeams();
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinRequest = async (teamId: string) => {
    try {
      const res = await fetch(`/api/teams/${teamId}/join`, { method: 'POST' });
      const data = await res.json();
      alert(data.message || data.error);
      fetchTeams();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptMember = async (teamId: string, userId: string) => {
    try {
      const isAdmin = user?.role === 'admin';
      const endpoint = isAdmin ? `/api/admin/teams/${teamId}/accept-member` : `/api/teams/${teamId}/accept`;
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      alert(data.message || data.error);
      fetchTeams();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <Badge variant="purple" className="mb-4">Squadron Command</Badge>
          <h1 className="text-5xl font-black tracking-tighter mb-2">ELITE <span className="text-electric-purple drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]">SQUADS</span></h1>
          <p className="text-text-secondary font-mono text-sm">&gt; Form alliances, collaborate on projects, and compete together in the digital arena.</p>
        </div>

        {user && (
          <Button onClick={() => setIsCreating(true)} variant="purple" className="gap-2 uppercase tracking-[0.2em] text-xs py-3 px-6 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <Plus className="w-4 h-4" /> Initialize Squad
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-12 h-12 border-4 border-electric-purple/20 border-t-electric-purple rounded-full animate-spin shadow-[0_0_15px_rgba(139,92,246,0.2)]" />
          <p className="text-electric-purple font-mono text-xs animate-pulse">SCANNING NETWORK...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teams.map((team) => (
            <motion.div
              key={team._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card glow variant="purple" className="h-full flex flex-col group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-12 bg-electric-purple shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-electric-purple/10 rounded-xl border border-electric-purple/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(139,92,246,0.1)]">
                    <Shield className="w-6 h-6 text-electric-purple" />
                  </div>
                  <Badge variant="cyan" className="font-mono">{team.members.length}/{team.maxMembers} NODES</Badge>
                </div>

                <h3 className="text-2xl font-black mb-2 group-hover:text-electric-purple transition-colors tracking-tight">{team.name}</h3>
                <p className="text-[10px] text-text-secondary mb-4 font-mono uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-electric-purple animate-pulse" />
                  Commander: <span className="text-text-primary">{team.leader.name}</span>
                </p>
                <p className="text-text-secondary text-sm mb-8 flex-grow leading-relaxed font-mono opacity-80">{team.description}</p>

                {/* Team Management for Leader or Admin */}
                {user && (team.leader._id === user.id || user.role === 'admin') && team.requests.length > 0 && (
                  <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-electric-purple">Inbound Requests</p>
                      {user.role === 'admin' && team.leader._id !== user.id && <Badge variant="purple" className="text-[8px]">ADMIN_OVERRIDE</Badge>}
                    </div>
                    <div className="space-y-3">
                      {team.requests.map((req) => (
                        <div key={req._id} className="flex items-center justify-between bg-dark-bg/50 p-3 rounded-xl border border-white/5 group/req hover:border-electric-purple/30 transition-colors">
                          <span className="text-xs font-mono text-text-primary">{req.name}</span>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleAcceptMember(team._id, req._id)}
                              className="p-1.5 bg-neon-green/10 hover:bg-neon-green/20 text-neon-green rounded-lg transition-all border border-neon-green/20"
                              title="Accept Member"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 bg-soft-red/10 hover:bg-soft-red/20 text-soft-red rounded-lg transition-all border border-soft-red/20" title="Reject Request">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-6 pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-3">
                      {team.members.map((member, i) => (
                        <div 
                          key={i} 
                          className="w-10 h-10 rounded-xl bg-dark-surface border-2 border-dark-bg flex items-center justify-center text-xs font-black text-text-primary shadow-[0_0_10px_rgba(0,0,0,0.3)] group-hover:border-electric-purple/30 transition-colors relative overflow-hidden" 
                          title={member.name}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                          {member.name?.charAt(0) || '?'}
                        </div>
                      ))}
                      {team.members.length < team.maxMembers && (
                        <div className="w-10 h-10 rounded-xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center text-text-secondary text-[10px]">
                          +{team.maxMembers - team.members.length}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {user && team.leader._id !== user.id && !team.members.some(m => m._id === user.id) && (
                    <Button 
                      variant={team.members.length >= team.maxMembers ? 'outline' : 'purple'} 
                      className="w-full gap-2 uppercase tracking-[0.2em] text-[10px] py-3"
                      disabled={team.members.length >= team.maxMembers || team.requests.some(r => r._id === user.id)}
                      onClick={() => handleJoinRequest(team._id)}
                    >
                      <UserPlus className="w-4 h-4" /> 
                      {team.requests.some(r => r._id === user.id) ? 'REQUEST_PENDING' : team.members.length >= team.maxMembers ? 'SQUAD_FULL' : 'INITIATE_JOIN_PROTOCOL'}
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Team Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark-bg/90 backdrop-blur-xl" 
              onClick={() => setIsCreating(false)} 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotateX: 20 }}
              className="relative w-full max-w-md glass-panel p-8 border-electric-purple/20 shadow-[0_0_50px_rgba(139,92,246,0.1)]"
            >
              <button
                onClick={() => setIsCreating(false)}
                className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-xl transition-colors text-text-secondary hover:text-electric-purple"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-electric-purple/10 border border-electric-purple/30 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-electric-purple" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight">NEW SQUAD</h2>
                  <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Initialization Protocol</p>
                </div>
              </div>
              
              <form onSubmit={handleCreateTeam} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary mb-3">Squad Designation</label>
                  <input
                    type="text"
                    required
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-electric-purple focus:bg-electric-purple/5 transition-all text-text-primary"
                    placeholder="e.g. CYBER_PHANTOMS"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary mb-3">Mission Objectives</label>
                  <textarea
                    required
                    value={newTeam.description}
                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-electric-purple focus:bg-electric-purple/5 transition-all text-text-primary h-32 resize-none"
                    placeholder="Define your squad's primary focus area..."
                  />
                </div>
                <Button type="submit" variant="purple" className="w-full py-4 uppercase tracking-[0.3em] text-xs shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                  DEPLOY SQUAD
                </Button>
                <div className="flex items-center gap-3 p-3 bg-soft-red/5 border border-soft-red/10 rounded-lg">
                  <Shield className="w-4 h-4 text-soft-red" />
                  <p className="text-[9px] text-soft-red font-bold uppercase tracking-widest leading-tight">
                    Warning: Squad creation requires high-level administrative clearance.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Teams;
