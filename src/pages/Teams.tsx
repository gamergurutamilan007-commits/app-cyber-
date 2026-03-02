import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
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
      const data = await res.json();
      setTeams(data);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Elite <span className="text-neon-blue">Teams</span></h1>
          <p className="text-slate-400">Form alliances, collaborate on projects, and compete together.</p>
        </div>

        {user && (
          <Button onClick={() => setIsCreating(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Create Team
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teams.map((team) => (
            <motion.div
              key={team._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="h-full flex flex-col border-white/5 hover:border-neon-blue/20 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-neon-blue/10 rounded-lg">
                    <Shield className="w-5 h-5 text-neon-blue" />
                  </div>
                  <Badge variant="blue">{team.members.length}/{team.maxMembers} Members</Badge>
                </div>

                <h3 className="text-xl font-bold mb-2">{team.name}</h3>
                <p className="text-xs text-slate-500 mb-4 font-mono uppercase tracking-wider">Leader: {team.leader.name}</p>
                <p className="text-slate-400 text-sm mb-6 flex-grow">{team.description}</p>

                {/* Team Management for Leader or Admin */}
                {user && (team.leader._id === user.id || user.role === 'admin') && team.requests.length > 0 && (
                  <div className="mb-6 p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-neon-blue">Pending Requests</p>
                      {user.role === 'admin' && team.leader._id !== user.id && <Badge variant="purple">Admin Mode</Badge>}
                    </div>
                    <div className="space-y-2">
                      {team.requests.map((req) => (
                        <div key={req._id} className="flex items-center justify-between bg-dark-bg/50 p-2 rounded-lg">
                          <span className="text-xs font-medium">{req.name}</span>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => handleAcceptMember(team._id, req._id)}
                              className="p-1 hover:bg-emerald-500/20 text-emerald-500 rounded transition-colors"
                              title="Accept Member"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button className="p-1 hover:bg-rose-500/20 text-rose-500 rounded transition-colors" title="Reject Request">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex -space-x-2">
                    {team.members.map((member, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-dark-bg flex items-center justify-center text-[10px] font-bold" title={member.name}>
                        {member.name.charAt(0)}
                      </div>
                    ))}
                  </div>
                  
                  {user && team.leader._id !== user.id && !team.members.some(m => m._id === user.id) && (
                    <Button 
                      variant={team.members.length >= team.maxMembers ? 'secondary' : 'outline'} 
                      className="w-full gap-2"
                      disabled={team.members.length >= team.maxMembers || team.requests.some(r => r._id === user.id)}
                      onClick={() => handleJoinRequest(team._id)}
                    >
                      <UserPlus className="w-4 h-4" /> 
                      {team.requests.some(r => r._id === user.id) ? 'Request Pending' : team.members.length >= team.maxMembers ? 'Team Full' : 'Request to Join'}
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Team Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCreating(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md glass-card p-8"
          >
            <button
              onClick={() => setIsCreating(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-6">Initialize New Team</h2>
            
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Team Name</label>
                <input
                  type="text"
                  required
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neon-blue transition-colors"
                  placeholder="e.g. Cyber Phantoms"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Mission Description</label>
                <textarea
                  required
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neon-blue transition-colors h-32 resize-none"
                  placeholder="What is your team's focus?"
                />
              </div>
              <Button type="submit" className="w-full py-3">
                Deploy Team
              </Button>
              <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest mt-4">
                Note: Team creation requires admin authorization.
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Teams;
