import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Star, Filter, Search, TrendingUp } from 'lucide-react';
import { Button, Card, Badge, cn } from '../components/UI';
import { MOCK_LEADERBOARD } from '../constants';

const Leaderboard = () => {
  const [filter, setFilter] = useState<'Weekly' | 'Monthly' | 'All Time'>('All Time');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Elite <span className="text-neon-blue">Leaderboard</span></h1>
          <p className="text-slate-400">Recognizing the top contributors and security experts in the community.</p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {['Weekly', 'Monthly', 'All Time'].map((type) => (
            <Button
              key={type}
              variant={filter === type ? 'neon' : 'outline'}
              size="sm"
              onClick={() => setFilter(type as any)}
              className="whitespace-nowrap"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-end">
        {/* Rank 2 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="order-2 md:order-1"
        >
          <Card className="text-center pt-12 pb-8 border-slate-400/20 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-400/50" />
            <div className="w-16 h-16 rounded-full bg-slate-400/10 border-2 border-slate-400/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Medal className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold mb-1">{MOCK_LEADERBOARD[1].name}</h3>
            <p className="text-slate-400 text-sm mb-4">{MOCK_LEADERBOARD[1].points} PTS</p>
            <div className="flex flex-wrap justify-center gap-1">
              {MOCK_LEADERBOARD[1].badges.slice(0, 2).map((badge, i) => (
                <Badge key={i} variant="blue">{badge}</Badge>
              ))}
            </div>
            <div className="mt-6 text-2xl font-black text-slate-400/20">RANK #2</div>
          </Card>
        </motion.div>

        {/* Rank 1 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="order-1 md:order-2"
        >
          <Card className="text-center pt-16 pb-12 border-neon-blue/40 relative overflow-hidden group shadow-[0_0_30px_rgba(0,245,255,0.1)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-neon-blue" />
            <div className="w-20 h-20 rounded-full bg-neon-blue/10 border-2 border-neon-blue/50 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,245,255,0.2)]">
              <Trophy className="w-10 h-10 text-neon-blue" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{MOCK_LEADERBOARD[0].name}</h3>
            <p className="text-neon-blue font-bold text-lg mb-4">{MOCK_LEADERBOARD[0].points} PTS</p>
            <div className="flex flex-wrap justify-center gap-1">
              {MOCK_LEADERBOARD[0].badges.map((badge, i) => (
                <Badge key={i} variant="purple">{badge}</Badge>
              ))}
            </div>
            <div className="mt-8 text-4xl font-black text-neon-blue/20">RANK #1</div>
          </Card>
        </motion.div>

        {/* Rank 3 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="order-3"
        >
          <Card className="text-center pt-12 pb-8 border-orange-400/20 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-orange-400/50" />
            <div className="w-16 h-16 rounded-full bg-orange-400/10 border-2 border-orange-400/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Star className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold mb-1">{MOCK_LEADERBOARD[2].name}</h3>
            <p className="text-slate-400 text-sm mb-4">{MOCK_LEADERBOARD[2].points} PTS</p>
            <div className="flex flex-wrap justify-center gap-1">
              {MOCK_LEADERBOARD[2].badges.slice(0, 2).map((badge, i) => (
                <Badge key={i} variant="blue">{badge}</Badge>
              ))}
            </div>
            <div className="mt-6 text-2xl font-black text-orange-400/20">RANK #3</div>
          </Card>
        </motion.div>
      </div>

      {/* Table List */}
      <Card className="overflow-hidden p-0 border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Rank</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Member</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Points</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Badges</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Events</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_LEADERBOARD.map((entry) => (
                <motion.tr
                  key={entry.rank}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span className={cn(
                      "font-mono font-bold",
                      entry.rank === 1 ? "text-neon-blue" : entry.rank === 2 ? "text-slate-400" : entry.rank === 3 ? "text-orange-400" : "text-slate-600"
                    )}>
                      #{entry.rank.toString().padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold">
                        {entry.name.charAt(0)}
                      </div>
                      <span className="font-medium group-hover:text-neon-blue transition-colors">{entry.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono font-bold text-slate-300">{entry.points.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {entry.badges.map((badge, i) => (
                        <Badge key={i} variant={i % 2 === 0 ? 'blue' : 'purple'}>{badge}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-slate-400">{entry.eventsParticipated}</span>
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
