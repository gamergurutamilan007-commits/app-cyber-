import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Star, Loader2 } from 'lucide-react';
import { Button, Card, Badge, cn } from '../components/UI';

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  badges: string[];
  eventsParticipated: number;
}

const Leaderboard = () => {
  const [filter, setFilter] = useState<'Weekly' | 'Monthly' | 'All Time'>('All Time');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/leaderboard');
        if (res.ok) {
          const data = await res.json();
          setLeaderboard(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
      </div>
    );
  }

  const top3 = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <Badge variant="cyan" className="mb-4">Global Rankings</Badge>
          <h1 className="text-5xl font-black tracking-tighter mb-2">ELITE <span className="text-neon-cyan drop-shadow-[0_0_10px_rgba(0,245,255,0.3)]">LEADERBOARD</span></h1>
          <p className="text-text-secondary font-mono text-sm">&gt; Recognizing the top contributors and security experts in the command center.</p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {['Weekly', 'Monthly', 'All Time'].map((type) => (
            <Button
              key={type}
              variant={filter === type ? 'cyan' : 'outline'}
              size="sm"
              onClick={() => setFilter(type as any)}
              className="whitespace-nowrap uppercase tracking-widest text-[10px]"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 items-end">
          {/* Rank 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="order-2 md:order-1"
          >
            <Card glow variant="purple" className="text-center pt-16 pb-10 relative overflow-hidden group border-white/5">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-electric-purple to-transparent opacity-50" />
              <div className="w-20 h-20 rounded-2xl bg-electric-purple/10 border border-electric-purple/30 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(139,92,246,0.1)] relative">
                <Medal className="w-10 h-10 text-electric-purple" />
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-lg bg-dark-surface border border-electric-purple/50 flex items-center justify-center text-[10px] font-black text-electric-purple">2</div>
              </div>
              <h3 className="text-2xl font-black mb-2 tracking-tight">{top3[1].name}</h3>
              <p className="text-electric-purple font-mono text-lg mb-6 font-bold">{top3[1].points.toLocaleString()} <span className="text-[10px] uppercase tracking-widest opacity-50">PTS</span></p>
              <div className="flex flex-wrap justify-center gap-2">
                {top3[1].badges.slice(0, 2).map((badge, i) => (
                  <Badge key={i} variant="purple" className="text-[8px]">{badge}</Badge>
                ))}
              </div>
              <div className="mt-8 text-5xl font-black text-white/5 select-none tracking-tighter">SILVER</div>
            </Card>
          </motion.div>

          {/* Rank 1 */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="order-1 md:order-2"
          >
            <Card glow variant="cyan" className="text-center pt-20 pb-12 relative overflow-hidden group border-neon-cyan/20 shadow-[0_0_50px_rgba(0,245,255,0.1)]">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />
              <div className="w-24 h-24 rounded-3xl bg-neon-cyan/10 border border-neon-cyan/40 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(0,245,255,0.2)] relative">
                <Trophy className="w-12 h-12 text-neon-cyan drop-shadow-[0_0_10px_rgba(0,245,255,0.5)]" />
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-xl bg-dark-surface border border-neon-cyan flex items-center justify-center text-xs font-black text-neon-cyan shadow-[0_0_10px_rgba(0,245,255,0.5)]">1</div>
              </div>
              <h3 className="text-3xl font-black mb-2 tracking-tight">{top3[0].name}</h3>
              <p className="text-neon-cyan font-mono text-2xl mb-8 font-black drop-shadow-[0_0_10px_rgba(0,245,255,0.3)]">{top3[0].points.toLocaleString()} <span className="text-xs uppercase tracking-widest opacity-50">PTS</span></p>
              <div className="flex flex-wrap justify-center gap-2">
                {top3[0].badges.map((badge, i) => (
                  <Badge key={i} variant="cyan" className="text-[9px]">{badge}</Badge>
                ))}
              </div>
              <div className="mt-10 text-6xl font-black text-white/5 select-none tracking-tighter">CHAMPION</div>
            </Card>
          </motion.div>

          {/* Rank 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="order-3"
          >
            <Card glow variant="green" className="text-center pt-16 pb-10 relative overflow-hidden group border-white/5">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-neon-green to-transparent opacity-50" />
              <div className="w-20 h-20 rounded-2xl bg-neon-green/10 border border-neon-green/30 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(57,255,20,0.1)] relative">
                <Star className="w-10 h-10 text-neon-green" />
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-lg bg-dark-surface border border-neon-green/50 flex items-center justify-center text-[10px] font-black text-neon-green">3</div>
              </div>
              <h3 className="text-2xl font-black mb-2 tracking-tight">{top3[2].name}</h3>
              <p className="text-neon-green font-mono text-lg mb-6 font-bold">{top3[2].points.toLocaleString()} <span className="text-[10px] uppercase tracking-widest opacity-50">PTS</span></p>
              <div className="flex flex-wrap justify-center gap-2">
                {top3[2].badges.slice(0, 2).map((badge, i) => (
                  <Badge key={i} variant="green" className="text-[8px]">{badge}</Badge>
                ))}
              </div>
              <div className="mt-8 text-5xl font-black text-white/5 select-none tracking-tighter">BRONZE</div>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Table List */}
      <Card className="overflow-hidden p-0 border-white/5 glass-panel">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Rank</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Member</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary text-right">Points</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Badges</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary text-center">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leaderboard.map((entry) => (
                <motion.tr
                  key={entry.rank}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: entry.rank * 0.05 }}
                  className="hover:bg-neon-cyan/5 transition-all group cursor-default"
                >
                  <td className="px-8 py-5">
                    <span className={cn(
                      "font-mono font-black text-sm",
                      entry.rank === 1 ? "text-neon-cyan drop-shadow-[0_0_5px_rgba(0,245,255,0.5)]" : 
                      entry.rank === 2 ? "text-electric-purple" : 
                      entry.rank === 3 ? "text-neon-green" : 
                      "text-text-secondary opacity-50"
                    )}>
                      #{entry.rank.toString().padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-dark-surface border border-white/10 flex items-center justify-center text-xs font-black group-hover:border-neon-cyan/30 transition-colors relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                        {entry.name?.charAt(0) || '?'}
                      </div>
                      <span className="font-bold text-text-primary group-hover:text-neon-cyan transition-colors tracking-tight">{entry.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="font-mono font-black text-text-primary group-hover:text-neon-cyan transition-colors">{entry.points.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-wrap gap-2">
                      {entry.badges.map((badge, i) => (
                        <Badge key={i} variant={i % 2 === 0 ? 'cyan' : 'purple'} className="text-[8px]">{badge}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="text-xs font-mono font-bold text-text-secondary">{entry.eventsParticipated}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Leaderboard;
