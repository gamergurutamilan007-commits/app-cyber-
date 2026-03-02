import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Github, Linkedin, Award, Target, Zap, Shield, Edit3, Loader2, X, Save } from 'lucide-react';
import { Button, Card, Badge, cn } from '../components/UI';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, loading, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    skills: '',
    github: '',
    linkedin: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  const startEditing = () => {
    if (!user) return;
    setEditForm({
      name: user.name,
      bio: user.bio || '',
      skills: (user.skills || []).join(', '),
      github: user.github || '',
      linkedin: user.linkedin || ''
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          skills: editForm.skills.split(',').map(s => s.trim()).filter(s => s)
        }),
      });
      if (res.ok) {
        await refreshUser();
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-10">
          <Card glow variant="cyan" className="text-center pt-16 pb-10 relative overflow-hidden group border-neon-cyan/20">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />
            <div className="absolute top-4 right-4 z-10">
              <Button variant="ghost" size="icon" onClick={startEditing} className="hover:bg-neon-cyan/10 text-neon-cyan">
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
            <div className="w-40 h-40 rounded-3xl bg-dark-surface border-2 border-neon-cyan/30 flex items-center justify-center mx-auto mb-8 relative group/avatar overflow-hidden shadow-[0_0_30px_rgba(0,245,255,0.1)]">
              <User className="w-20 h-20 text-neon-cyan drop-shadow-[0_0_10px_rgba(0,245,255,0.5)]" />
              <div className="absolute inset-0 bg-neon-cyan/10 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-neon-cyan/20 blur-xl" />
            </div>
            <h2 className="text-3xl font-black mb-2 tracking-tight">{user.name}</h2>
            <p className="text-text-secondary font-mono text-xs uppercase tracking-[0.3em] mb-8">&gt; {user.bio || 'Cyber Researcher'}</p>
            
            <div className="flex justify-center gap-6 mb-10">
              {user.github && (
                <a href={user.github} target="_blank" rel="noreferrer" className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-neon-cyan/30 hover:bg-neon-cyan/5 transition-all group/link">
                  <Github className="w-5 h-5 text-text-secondary group-hover/link:text-neon-cyan" />
                </a>
              )}
              {user.linkedin && (
                <a href={user.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-neon-cyan/30 hover:bg-neon-cyan/5 transition-all group/link">
                  <Linkedin className="w-5 h-5 text-text-secondary group-hover/link:text-neon-cyan" />
                </a>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 border-t border-white/5 pt-10">
              <div className="relative">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-px bg-neon-cyan/30" />
                <p className="text-3xl font-black text-neon-cyan drop-shadow-[0_0_10px_rgba(0,245,255,0.3)]">{user.points || 0}</p>
                <p className="text-[10px] text-text-secondary font-mono uppercase tracking-[0.2em] mt-1">Points</p>
              </div>
              <div className="relative">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-px bg-electric-purple/30" />
                <p className="text-3xl font-black text-electric-purple drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]">{user.eventsParticipated || 0}</p>
                <p className="text-[10px] text-text-secondary font-mono uppercase tracking-[0.2em] mt-1">Events</p>
              </div>
            </div>
          </Card>

          <Card className="border-white/5 glass-panel relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-neon-cyan/5 rounded-full blur-2xl -mr-8 -mt-8" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary mb-8 flex items-center gap-3">
              <Zap className="w-4 h-4 text-neon-cyan" /> Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-3">
              {(user.skills && user.skills.length > 0 ? user.skills : ['Security', 'AI']).map((skill, i) => (
                <Badge key={i} variant="cyan" className="px-4 py-1.5 text-[10px] font-mono tracking-wider border-neon-cyan/20 bg-neon-cyan/5">{skill}</Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          <Card className="border-white/5 glass-panel relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-electric-purple/50 via-transparent to-transparent" />
            <h3 className="text-xl font-black mb-10 flex items-center gap-4 tracking-tight">
              <Award className="w-8 h-8 text-electric-purple drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]" /> 
              ACHIEVEMENT BADGES
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {(user.badges && user.badges.length > 0 ? user.badges : ['🆕 Newbie']).map((badge, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="p-6 bg-dark-surface border border-white/5 rounded-3xl text-center group relative overflow-hidden hover:border-electric-purple/30 transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-electric-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-16 h-16 bg-electric-purple/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-electric-purple/20 transition-all relative z-10 shadow-[0_0_20px_rgba(139,92,246,0.1)]">
                    <Shield className="w-8 h-8 text-electric-purple group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-[10px] font-black text-text-primary tracking-widest uppercase relative z-10">{badge}</p>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="border-white/5 glass-panel relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-green/50 via-transparent to-transparent" />
            <h3 className="text-xl font-black mb-10 flex items-center gap-4 tracking-tight">
              <Target className="w-8 h-8 text-neon-green drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]" /> 
              MISSION PARAMETERS
            </h3>
            <div className="space-y-6">
              {[
                { label: 'System Integrity', value: 94, color: 'neon-cyan' },
                { label: 'Neural Sync', value: 78, color: 'electric-purple' },
                { label: 'Data Extraction', value: 62, color: 'neon-green' }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">{stat.label}</span>
                    <span className="text-xs font-mono font-black text-text-primary">{stat.value}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className={cn(
                        "h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]",
                        stat.color === 'neon-cyan' ? 'bg-neon-cyan' : stat.color === 'electric-purple' ? 'bg-electric-purple' : 'bg-neon-green'
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setIsEditing(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass-panel p-10 border border-neon-cyan/20 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-neon-cyan" />
              <button
                onClick={() => setIsEditing(false)}
                className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-xl transition-colors text-text-secondary hover:text-neon-cyan"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-3xl font-black mb-8 tracking-tighter">UPDATE <span className="text-neon-cyan">IDENTITY</span></h2>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-black tracking-tight focus:outline-none focus:border-neon-cyan focus:bg-neon-cyan/5 transition-all text-text-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Bio / Designation</label>
                  <input
                    type="text"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-mono focus:outline-none focus:border-neon-cyan focus:bg-neon-cyan/5 transition-all text-text-primary"
                    placeholder="e.g. AI Researcher @ SRM"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Skills (comma separated)</label>
                  <input
                    type="text"
                    value={editForm.skills}
                    onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm font-mono focus:outline-none focus:border-neon-cyan focus:bg-neon-cyan/5 transition-all text-text-primary"
                    placeholder="Python, React, Penetration Testing"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">GitHub URL</label>
                    <input
                      type="url"
                      value={editForm.github}
                      onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-xs font-mono focus:outline-none focus:border-neon-cyan focus:bg-neon-cyan/5 transition-all text-text-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">LinkedIn URL</label>
                    <input
                      type="url"
                      value={editForm.linkedin}
                      onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-xs font-mono focus:outline-none focus:border-neon-cyan focus:bg-neon-cyan/5 transition-all text-text-primary"
                    />
                  </div>
                </div>
                <Button type="submit" variant="cyan" disabled={isSaving} className="w-full py-4 gap-3 uppercase tracking-[0.3em] text-xs shadow-[0_0_20px_rgba(0,245,255,0.2)]">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> SYNC IDENTITY</>}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
