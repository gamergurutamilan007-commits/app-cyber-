import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, MapPin, Clock, Filter, Search, X, Loader2 } from 'lucide-react';
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
      
      const eventsData = await eventsRes.json();
      if (eventsData && eventsData.length > 0) {
        setEvents(eventsData);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">Ecosystem <span className="text-neon-blue">Events</span></h1>
          <p className="text-slate-400">Discover hackathons, workshops, and CTFs happening in the community.</p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {['All', 'Hackathons', 'Workshops', 'CTF', 'Conference'].map((type) => (
            <Button
              key={type}
              variant={filter === type ? 'neon' : 'outline'}
              size="sm"
              onClick={() => setFilter(type)}
              className="whitespace-nowrap"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
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
              <Card className="h-full flex flex-col group hover:border-neon-blue/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant={event.status === 'Live' ? 'green' : event.status === 'Upcoming' ? 'purple' : 'blue'}>
                    {event.status}
                  </Badge>
                  <span className="text-xs text-slate-500 font-mono">{event.date}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-neon-blue transition-colors">{event.title}</h3>
                <p className="text-slate-400 text-sm mb-6 flex-grow">{event.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {event.participants} Joined
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {event.type}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button onClick={() => setSelectedEvent(event)} className="w-full">
                    View Details
                  </Button>
                  {user && (getRegStatus(event._id) || getRegStatus(event.id!)) && (
                    <div className={cn(
                      "text-[10px] font-bold uppercase tracking-widest text-center py-1 rounded border",
                      (getRegStatus(event._id) || getRegStatus(event.id!)) === 'Approved' ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" :
                      (getRegStatus(event._id) || getRegStatus(event.id!)) === 'Pending' ? "text-amber-500 bg-amber-500/10 border-amber-500/20" :
                      "text-rose-500 bg-rose-500/10 border-rose-500/20"
                    )}>
                      Status: {(getRegStatus(event._id) || getRegStatus(event.id!)) === 'Approved' ? 'Registered' : (getRegStatus(event._id) || getRegStatus(event.id!))}
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
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass-card p-8 overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => { setSelectedEvent(null); setIsRegistering(false); }}
                className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {!isRegistering ? (
                <>
                  <Badge variant="purple" className="mb-4">{selectedEvent.type}</Badge>
                  <h2 className="text-3xl font-bold mb-4">{selectedEvent.title}</h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Date</p>
                      <p className="font-semibold">{selectedEvent.date}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Participants</p>
                      <p className="font-semibold">{selectedEvent.participants} Registered</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-neon-blue mb-2">Description</h4>
                      <p className="text-slate-400 leading-relaxed">{selectedEvent.fullDescription}</p>
                    </div>

                    {selectedEvent.timeline && selectedEvent.timeline.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-neon-blue mb-2">Timeline</h4>
                        <ul className="space-y-2">
                          {selectedEvent.timeline.map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                              <div className="w-1.5 h-1.5 rounded-full bg-neon-blue" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedEvent.rules && selectedEvent.rules.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-neon-blue mb-2">Rules</h4>
                        <ul className="space-y-2">
                          {selectedEvent.rules.map((rule, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                              <div className="w-1.5 h-1.5 rounded-full bg-electric-purple" />
                              {rule}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {!(getRegStatus(selectedEvent._id) || getRegStatus(selectedEvent.id!)) ? (
                      <Button 
                        onClick={() => setIsRegistering(true)} 
                        className="w-full mt-4" 
                        size="lg"
                        disabled={!user}
                      >
                        {user ? 'Register Now' : 'Login to Register'}
                      </Button>
                    ) : (
                      <div className={cn(
                        "w-full mt-4 py-3 rounded-xl border text-center font-bold uppercase tracking-widest",
                        (getRegStatus(selectedEvent._id) || getRegStatus(selectedEvent.id!)) === 'Approved' ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : "text-amber-500 bg-amber-500/10 border-amber-500/20"
                      )}>
                        {(getRegStatus(selectedEvent._id) || getRegStatus(selectedEvent.id!)) === 'Approved' ? 'Successfully Registered' : 'Registration Pending Approval'}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="py-4">
                  <h2 className="text-2xl font-bold mb-2">Event Registration</h2>
                  <p className="text-slate-400 text-sm mb-6">Provide your details to complete registration for {selectedEvent.title}.</p>
                  
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Department</label>
                        <input
                          type="text"
                          required
                          value={regForm.department}
                          onChange={(e) => setRegForm({ ...regForm, department: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neon-blue transition-colors"
                          placeholder="e.g. CSE"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Year of Study</label>
                        <select
                          required
                          value={regForm.year}
                          onChange={(e) => setRegForm({ ...regForm, year: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neon-blue transition-colors"
                        >
                          <option value="" disabled className="bg-dark-bg">Select Year</option>
                          <option value="1st Year" className="bg-dark-bg">1st Year</option>
                          <option value="2nd Year" className="bg-dark-bg">2nd Year</option>
                          <option value="3rd Year" className="bg-dark-bg">3rd Year</option>
                          <option value="4th Year" className="bg-dark-bg">4th Year</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neon-blue transition-colors"
                        placeholder="e.g. +91 9876543210"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Why do you want to join?</label>
                      <textarea
                        required
                        value={regForm.motivation}
                        onChange={(e) => setRegForm({ ...regForm, motivation: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-neon-blue transition-colors h-24 resize-none"
                        placeholder="Tell us about your interest in this event..."
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setIsRegistering(false)}>
                        Back
                      </Button>
                      <Button type="submit" className="flex-1">
                        Submit Registration
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
