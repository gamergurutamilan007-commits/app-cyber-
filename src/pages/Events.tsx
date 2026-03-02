import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, MapPin, Clock, Filter, Search, X, Loader2, Terminal, Shield, Info, CheckCircle2 } from 'lucide-react';
import { Button, Card, Badge, cn } from '../components/UI';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_EVENTS } from '../constants';

interface Event {
  _id: string;
  id?: string;
  title: string;
  type: 'Hackathon' | 'Workshop' | 'CTF' | 'Conference';
  status: 'Live' | 'Upcoming' | 'Past';
  date: string;
  description: string;
  fullDescription: string;
  timeline: string[];
  rules: string[];
  participants: number;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS as any);
  const [myRegistrations, setMyRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('All');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regForm, setRegForm] = useState({ department: '', year: '', phone: '', motivation: '' });
  const { user } = useAuth();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [eventsRes, regRes] = await Promise.all([
        fetch('/api/events'),
        user ? fetch('/api/my-registrations') : Promise.resolve(null)
      ]);
      
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        if (eventsData && eventsData.length > 0) {
          setEvents(eventsData);
        }
      }
      
      if (regRes && regRes.ok) {
        const regData = await regRes.json();
        setMyRegistrations(regData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    
    try {
      const res = await fetch(`/api/events/${selectedEvent._id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setIsRegistering(false);
        fetchData();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getRegStatus = (eventId: string) => {
    const reg = myRegistrations.find(r => r.event._id === eventId);
    return reg ? reg.status : null;
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'All') return true;
    return event.type === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <Badge variant="cyan" className="mb-4">Operational Sector</Badge>
          <h1 className="text-5xl font-black tracking-tighter mb-2">ECOSYSTEM <span className="text-neon-cyan drop-shadow-[0_0_10px_rgba(0,245,255,0.3)]">EVENTS</span></h1>
          <p className="text-text-secondary font-mono text-sm">&gt; Discover hackathons, workshops, and CTFs happening in the command center.</p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {['All', 'Hackathon', 'Workshop', 'CTF', 'Conference'].map((type) => (
            <Button
              key={type}
              variant={filter === type ? 'cyan' : 'outline'}
              size="sm"
              onClick={() => setFilter(type)}
              className="whitespace-nowrap uppercase tracking-widest text-[10px]"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-12 h-12 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin shadow-[0_0_15px_rgba(0,245,255,0.2)]" />
          <p className="text-neon-cyan font-mono text-xs animate-pulse">SYNCHRONIZING DATA...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <motion.div
              key={event._id || event.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                glow 
                variant={event.status === 'Live' ? 'green' : event.status === 'Upcoming' ? 'cyan' : 'purple'}
                className="h-full flex flex-col group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent -mr-12 -mt-12 rotate-45 pointer-events-none" />
                
                <div className="flex justify-between items-start mb-6">
                  <Badge variant={event.status === 'Live' ? 'red' : event.status === 'Upcoming' ? 'cyan' : 'blue'} className={cn(
                    event.status === 'Live' && "animate-pulse shadow-[0_0_10px_rgba(255,77,77,0.5)]"
                  )}>
                    {event.status}
                  </Badge>
                  <div className="flex items-center gap-2 text-[10px] text-text-secondary font-mono">
                    <Calendar className="w-3 h-3" />
                    {event.date}
                  </div>
                </div>
                
                <h3 className="text-2xl font-black mb-3 group-hover:text-neon-cyan transition-colors tracking-tight">{event.title}</h3>
                <p className="text-text-secondary text-sm mb-8 flex-grow leading-relaxed line-clamp-3 font-mono opacity-80">{event.description}</p>
                
                <div className="flex items-center gap-6 text-[10px] text-text-secondary mb-8 font-bold uppercase tracking-widest border-y border-white/5 py-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-neon-cyan" /> {event.participants} Joined
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-electric-purple" /> {event.type}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={() => setSelectedEvent(event)} 
                    variant={event.status === 'Live' ? 'cyan' : 'outline'}
                    className="w-full uppercase tracking-[0.2em] text-xs py-3"
                  >
                    Access Intel
                  </Button>
                  {user && (getRegStatus(event._id) || getRegStatus(event.id!)) && (
                    <div className={cn(
                      "text-[9px] font-black uppercase tracking-[0.3em] text-center py-2 rounded-lg border backdrop-blur-md",
                      (getRegStatus(event._id) || getRegStatus(event.id!)) === 'Approved' ? "text-neon-green bg-neon-green/10 border-neon-green/20 shadow-[0_0_10px_rgba(57,255,20,0.1)]" :
                      (getRegStatus(event._id) || getRegStatus(event.id!)) === 'Pending' ? "text-amber-400 bg-amber-400/10 border-amber-400/20" :
                      "text-soft-red bg-soft-red/10 border-soft-red/20"
                    )}>
                      &gt; STATUS: {(getRegStatus(event._id) || getRegStatus(event.id!)) === 'Approved' ? 'REGISTERED' : (getRegStatus(event._id) || getRegStatus(event.id!)).toUpperCase()}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSelectedEvent(null); setIsRegistering(false); }}
              className="absolute inset-0 bg-dark-bg/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="relative w-full max-w-2xl glass-panel p-0 overflow-hidden max-h-[90vh] flex flex-col border-neon-cyan/20 shadow-[0_0_50px_rgba(0,245,255,0.1)]"
            >
              <div className="p-8 overflow-y-auto flex-grow scrollbar-hide">
                <button
                  onClick={() => { setSelectedEvent(null); setIsRegistering(false); }}
                  className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-xl transition-colors text-text-secondary hover:text-neon-cyan z-20"
                >
                  <X className="w-6 h-6" />
                </button>

                {!isRegistering ? (
                  <div className="relative">
                    <div className="absolute top-0 left-0 w-1 h-20 bg-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.5)]" />
                    <div className="pl-6">
                      <Badge variant="purple" className="mb-4">{selectedEvent.type}</Badge>
                      <h2 className="text-4xl font-black mb-6 tracking-tight">{selectedEvent.title}</h2>
                      
                      <div className="grid grid-cols-2 gap-6 mb-10">
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 group hover:border-neon-cyan/30 transition-colors">
                          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold mb-2">Operation Date</p>
                          <p className="font-mono text-neon-cyan">{selectedEvent.date}</p>
                        </div>
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 group hover:border-electric-purple/30 transition-colors">
                          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold mb-2">Active Nodes</p>
                          <p className="font-mono text-electric-purple">{selectedEvent.participants} Registered</p>
                        </div>
                      </div>

                      <div className="space-y-10">
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-neon-cyan mb-4 flex items-center gap-2">
                            <Terminal className="w-4 h-4" /> Mission Briefing
                          </h4>
                          <p className="text-text-secondary leading-relaxed font-mono text-sm bg-white/5 p-4 rounded-xl border border-white/5">{selectedEvent.fullDescription}</p>
                        </div>

                        {selectedEvent.timeline && selectedEvent.timeline.length > 0 && (
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-electric-purple mb-6 flex items-center gap-2">
                              <Clock className="w-4 h-4" /> Operation Timeline
                            </h4>
                            <div className="relative pl-8 border-l-2 border-white/5 space-y-8">
                              {selectedEvent.timeline.map((item, i) => (
                                <div key={i} className="relative">
                                  <div className="absolute -left-[35px] top-1 w-3 h-3 rounded-full bg-dark-bg border-2 border-electric-purple shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                                  <p className="text-sm text-text-primary font-mono">{item}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedEvent.rules && selectedEvent.rules.length > 0 && (
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-neon-green mb-4 flex items-center gap-2">
                              <Shield className="w-4 h-4" /> Engagement Rules
                            </h4>
                            <ul className="space-y-3">
                              {selectedEvent.rules.map((rule, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-text-secondary font-mono bg-white/5 p-3 rounded-lg border border-white/5">
                                  <span className="text-neon-green font-bold">#</span>
                                  {rule}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="pt-4 pb-8">
                          {!(getRegStatus(selectedEvent._id) || getRegStatus(selectedEvent.id!)) ? (
                            <Button 
                              onClick={() => setIsRegistering(true)} 
                              variant="cyan"
                              className="w-full py-4 uppercase tracking-[0.3em] text-sm shadow-[0_0_30px_rgba(0,245,255,0.2)]" 
                              disabled={!user}
                            >
                              {user ? 'Initiate Registration' : 'Authentication Required'}
                            </Button>
                          ) : (
                            <div className={cn(
                              "w-full py-4 rounded-2xl border text-center font-black uppercase tracking-[0.3em] text-sm backdrop-blur-xl",
                              (getRegStatus(selectedEvent._id) || getRegStatus(selectedEvent.id!)) === 'Approved' ? "text-neon-green bg-neon-green/10 border-neon-green/30 shadow-[0_0_20px_rgba(57,255,20,0.1)]" : "text-amber-400 bg-amber-400/10 border-amber-400/30"
                            )}>
                              {(getRegStatus(selectedEvent._id) || getRegStatus(selectedEvent.id!)) === 'Approved' ? 'Registration Confirmed' : 'Authorization Pending'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-4">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center">
                        <Users className="w-6 h-6 text-neon-cyan" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black tracking-tight">ENROLLMENT</h2>
                        <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">Operation: {selectedEvent.title}</p>
                      </div>
                    </div>
                    
                    <form onSubmit={handleRegister} className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-3">Department</label>
                          <input
                            type="text"
                            required
                            value={regForm.department}
                            onChange={(e) => setRegForm({ ...regForm, department: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-neon-cyan focus:bg-neon-cyan/5 transition-all text-text-primary"
                            placeholder="e.g. CSE"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-3">Year of Study</label>
                          <select
                            required
                            value={regForm.year}
                            onChange={(e) => setRegForm({ ...regForm, year: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-neon-cyan focus:bg-neon-cyan/5 transition-all text-text-primary"
                          >
                            <option value="" disabled className="bg-dark-surface">Select Year</option>
                            <option value="1st Year" className="bg-dark-surface">1st Year</option>
                            <option value="2nd Year" className="bg-dark-surface">2nd Year</option>
                            <option value="3rd Year" className="bg-dark-surface">3rd Year</option>
                            <option value="4th Year" className="bg-dark-surface">4th Year</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-3">Comms Channel (Phone)</label>
                        <input
                          type="tel"
                          required
                          value={regForm.phone}
                          onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-neon-cyan focus:bg-neon-cyan/5 transition-all text-text-primary"
                          placeholder="e.g. +91 9876543210"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-3">Mission Motivation</label>
                        <textarea
                          required
                          value={regForm.motivation}
                          onChange={(e) => setRegForm({ ...regForm, motivation: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-neon-cyan focus:bg-neon-cyan/5 transition-all text-text-primary h-32 resize-none"
                          placeholder="State your objectives for joining this operation..."
                        />
                      </div>
                      <div className="flex gap-4 pt-4">
                        <Button type="button" variant="outline" className="flex-1 uppercase tracking-widest text-xs" onClick={() => setIsRegistering(false)}>
                          Abort
                        </Button>
                        <Button type="submit" variant="cyan" className="flex-1 uppercase tracking-widest text-xs">
                          Confirm Enrollment
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
