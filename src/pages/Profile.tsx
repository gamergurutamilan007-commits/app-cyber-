import React from 'react';
import { motion } from 'motion/react';
import { User, Github, Linkedin, Award, Target, Zap, Shield, Edit3, Loader2 } from 'lucide-react';
import { Button, Card, Badge } from '../components/UI';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, loading } = useAuth();

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="text-center pt-12 pb-8 border-neon-blue/20 relative">
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="icon">
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
            <div className="w-32 h-32 rounded-full bg-neon-blue/10 border-4 border-neon-blue/20 flex items-center justify-center mx-auto mb-6 relative group">
              <User className="w-16 h-16 text-neon-blue" />
              <div className="absolute inset-0 rounded-full bg-neon-blue/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
            </div>
            <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
            <p className="text-slate-400 text-sm mb-6">{user.bio || 'Cyber Researcher'}</p>
            
            <div className="flex justify-center gap-4 mb-8">
              <a href="#" target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-8">
              <div>
                <p className="text-2xl font-bold text-neon-blue">{user.points || 0}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Points</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-electric-purple">{user.eventsParticipated || 0}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Events</p>
              </div>
            </div>
          </Card>

          <Card className="border-white/5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-neon-blue" /> Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {(user.skills || ['Security', 'AI']).map((skill, i) => (
                <Badge key={i} variant="blue">{skill}</Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-white/5">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              <Award className="w-6 h-6 text-electric-purple" /> Achievement Badges
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {(user.badges || ['🆕 Newbie']).map((badge, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center group"
                >
                  <div className="w-12 h-12 bg-electric-purple/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-electric-purple/20 transition-colors">
                    <Shield className="w-6 h-6 text-electric-purple" />
                  </div>
                  <p className="text-xs font-bold text-slate-300">{badge}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
