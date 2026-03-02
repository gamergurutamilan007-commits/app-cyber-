export interface Event {
  id: string;
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

export interface Team {
  id: string;
  name: string;
  leader: string;
  members: string[];
  maxMembers: number;
  description: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  badges: string[];
  eventsParticipated: number;
}

export interface Post {
  id: string;
  author: string;
  title: string;
  content: string;
  likes: number;
  comments: Comment[];
  timestamp: number;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  bio: string;
  skills: string[];
  github: string;
  linkedin: string;
  points: number;
  badges: string[];
  eventsParticipated: number;
}
