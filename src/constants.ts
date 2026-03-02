import { Event, LeaderboardEntry, UserProfile } from './types';

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'CyberSentinel Hackathon 2026',
    type: 'Hackathon',
    status: 'Live',
    date: '2026-03-15',
    description: 'Build AI-driven security tools to protect critical infrastructure.',
    fullDescription: 'Join the most intense hackathon of the year where AI meets Cybersecurity. Participants will build innovative solutions to real-world security challenges.',
    timeline: ['09:00 AM - Registration', '10:00 AM - Opening Ceremony', '11:00 AM - Hacking Starts', '04:00 PM - Final Submissions'],
    rules: ['Teams of 2-4 members', 'Open source tools only', 'Original code required'],
    participants: 124
  },
  {
    id: '2',
    title: 'Neural Network Forensics Workshop',
    type: 'Workshop',
    status: 'Upcoming',
    date: '2026-03-20',
    description: 'Learn how to investigate deepfake attacks and model poisoning.',
    fullDescription: 'A hands-on workshop focusing on the forensic analysis of neural networks and identifying adversarial attacks.',
    timeline: ['02:00 PM - Intro to AI Forensics', '03:30 PM - Lab Session', '05:00 PM - Q&A'],
    rules: ['Basic Python knowledge required', 'Bring your own laptop'],
    participants: 45
  },
  {
    id: '3',
    title: 'Zero-Day CTF: AI Edition',
    type: 'CTF',
    status: 'Upcoming',
    date: '2026-04-05',
    description: 'A capture-the-flag competition with AI-powered vulnerabilities.',
    fullDescription: 'Test your skills in this unique CTF where the flags are hidden behind AI-guarded systems.',
    timeline: ['10:00 AM - CTF Starts', '06:00 PM - Leaderboard Freeze', '07:00 PM - Winners Announcement'],
    rules: ['Individual or teams of 2', 'No DDoS attacks', 'Respect the platform'],
    participants: 89
  },
  {
    id: '4',
    title: 'Global Cyber Summit 2025',
    type: 'Conference',
    status: 'Past',
    date: '2025-12-10',
    description: 'Annual gathering of cyber experts and AI researchers.',
    fullDescription: 'The 2025 summit brought together the brightest minds in the industry to discuss the future of AI in security.',
    timeline: ['Keynote: The AI Arms Race', 'Panel: Ethics in Automated Defense', 'Closing: 2026 Roadmap'],
    rules: [],
    participants: 500
  }
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Alex "Cipher" Chen', points: 2450, badges: ['🏆 CTF Champ', '🛡️ Bug Hunter'], eventsParticipated: 12 },
  { rank: 2, name: 'Sarah "Neural" Smith', points: 2100, badges: ['🧠 AI Expert', '💻 Code Ninja'], eventsParticipated: 10 },
  { rank: 3, name: 'Jordan "Root" Miller', points: 1950, badges: ['🔥 Speedster'], eventsParticipated: 8 },
  { rank: 4, name: 'Elena "Ghost" V', points: 1800, badges: ['🕵️ Forensics'], eventsParticipated: 7 },
  { rank: 5, name: 'Marcus "Void" Lee', points: 1650, badges: ['🛠️ Tool Builder'], eventsParticipated: 6 },
  { rank: 6, name: 'Priya "Secure" K', points: 1500, badges: ['🔐 Crypto', '🛡️ Defender'], eventsParticipated: 5 },
  { rank: 7, name: 'David "Data" W', points: 1420, badges: ['📊 Analyst'], eventsParticipated: 5 },
  { rank: 8, name: 'Sofia "Logic" R', points: 1350, badges: ['🧩 Solver'], eventsParticipated: 4 },
  { rank: 9, name: 'Kevin "Kernel" J', points: 1280, badges: ['🐧 Linux Guru'], eventsParticipated: 4 },
  { rank: 10, name: 'Aisha "Cloud" M', points: 1200, badges: ['☁️ Cloud Sec'], eventsParticipated: 3 }
];

export const INITIAL_USER: UserProfile = {
  name: 'Cyber Cadet',
  bio: 'Aspiring AI Security Researcher | CTF Enthusiast',
  skills: ['Python', 'TensorFlow', 'Penetration Testing', 'Network Security'],
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  points: 450,
  badges: ['🆕 Newbie', '🎓 Student'],
  eventsParticipated: 2
};
