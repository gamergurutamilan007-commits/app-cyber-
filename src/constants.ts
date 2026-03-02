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
  },
  {
    id: '5',
    title: 'AI for Social Good Hackathon',
    type: 'Hackathon',
    status: 'Upcoming',
    date: '2026-06-05',
    description: 'Develop AI solutions for healthcare, education, and sustainability.',
    fullDescription: 'Use your AI skills to solve pressing social issues. This hackathon focuses on creating positive impact through technology.',
    timeline: ['09:00 AM - Theme Reveal', '10:00 AM - Ideation', 'Day 2 03:00 PM - Pitching'],
    rules: ['Teams of 3-5', 'Must address a social challenge'],
    participants: 75
  },
  {
    id: '6',
    title: 'Cloud Security Masterclass',
    type: 'Workshop',
    status: 'Upcoming',
    date: '2026-05-10',
    description: 'Master the art of securing AWS and Azure environments.',
    fullDescription: 'Learn how to configure IAM policies, secure S3 buckets, and implement network security groups in the cloud.',
    timeline: ['09:00 AM - Cloud Fundamentals', '11:00 AM - IAM Best Practices', '02:00 PM - Hands-on Lab'],
    rules: ['AWS Free Tier account required', 'Basic networking knowledge'],
    participants: 55
  },
  {
    id: '7',
    title: 'Web3 Security Challenge',
    type: 'CTF',
    status: 'Upcoming',
    date: '2026-07-25',
    description: 'A CTF focused on DeFi vulnerabilities and smart contract exploits.',
    fullDescription: 'Test your skills in finding vulnerabilities in decentralized finance protocols.',
    timeline: ['10:00 AM - Challenge Start', '06:00 PM - Submission Deadline'],
    rules: ['Individual participation', 'No front-running allowed'],
    participants: 50
  },
  {
    id: '8',
    title: 'SRM Cyber Security Day 2026',
    type: 'Conference',
    status: 'Upcoming',
    date: '2026-08-15',
    description: 'Annual conference featuring talks from industry experts.',
    fullDescription: 'A day-long event with keynote speakers, panel discussions, and networking opportunities.',
    timeline: ['09:00 AM - Welcome Address', '10:30 AM - Keynote 1', '01:30 PM - Panel Discussion'],
    rules: ['Open to all SRM students'],
    participants: 350
  },
  {
    id: '9',
    title: 'Blockchain Security Sprint',
    type: 'Hackathon',
    status: 'Upcoming',
    date: '2026-06-20',
    description: 'Audit smart contracts and build secure decentralized applications.',
    fullDescription: 'A high-speed hackathon focused on the security of blockchain protocols and smart contracts.',
    timeline: ['10:00 AM - Briefing', '11:00 AM - Auditing Starts', '05:00 PM - Final Reports'],
    rules: ['Solidity knowledge required', 'Open source tools only'],
    participants: 42
  },
  {
    id: '10',
    title: 'Malware Analysis Deep Dive',
    type: 'Workshop',
    status: 'Upcoming',
    date: '2026-05-22',
    description: 'Reverse engineer real-world malware samples in a safe environment.',
    fullDescription: 'Understand how malware works by analyzing its code and behavior. Learn to use tools like Ghidra and x64dbg.',
    timeline: ['10:00 AM - Static Analysis', '01:00 PM - Dynamic Analysis', '03:30 PM - Report Writing'],
    rules: ['Virtual Machine with Flare VM installed', 'Basic C/C++ knowledge'],
    participants: 30
  },
  {
    id: '11',
    title: 'Bug Bounty Blitz: SRM Edition',
    type: 'CTF',
    status: 'Upcoming',
    date: '2026-04-15',
    description: 'Hunt for vulnerabilities in our internal student projects.',
    fullDescription: 'A friendly competition to find and report bugs in various student-led projects. Prizes for the most critical vulnerabilities found!',
    timeline: ['09:00 AM - Scope Reveal', '10:00 AM - Hunting Starts', '05:00 PM - Triage & Awards'],
    rules: ['Responsible disclosure only', 'No destructive testing'],
    participants: 62
  },
  {
    id: '12',
    title: 'Future of AI in Defense',
    type: 'Conference',
    status: 'Upcoming',
    date: '2026-09-05',
    description: 'Exploring the role of AI in modern warfare and national security.',
    fullDescription: 'A specialized conference discussing the strategic implications of AI in defense systems.',
    timeline: ['10:00 AM - Opening Remarks', '11:00 AM - Session 1: Autonomous Systems', '02:00 PM - Session 2: Cyber Warfare'],
    rules: ['Registration required'],
    participants: 150
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
