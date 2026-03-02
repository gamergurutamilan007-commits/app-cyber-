import express from "express";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "cyber_secret_key";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cyber_cmd";

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Schemas
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: "Cyber Researcher" },
  skills: [String],
  points: { type: Number, default: 0 },
  badges: [String],
  eventsParticipated: { type: Number, default: 0 },
  github: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

const PostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
  timestamp: { type: Date, default: Date.now }
});

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxMembers: { type: Number, default: 4 },
  isApproved: { type: Boolean, default: false }, // Admin must approve team creation
});

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Hackathon', 'Workshop', 'CTF', 'Conference'], required: true },
  status: { type: String, enum: ['Live', 'Upcoming', 'Past'], required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
  fullDescription: String,
  timeline: [String],
  rules: [String],
  participants: { type: Number, default: 0 },
});

const RegistrationSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  details: {
    department: String,
    year: String,
    phone: String,
    motivation: String,
  },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  registeredAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
const Team = mongoose.model("Team", TeamSchema);
const Event = mongoose.model("Event", EventSchema);
const Registration = mongoose.model("Registration", RegistrationSchema);
const Post = mongoose.model("Post", PostSchema);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Auth Middleware
const authenticate = async (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// --- API Routes ---

// Auth
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

app.get("/api/auth/me", authenticate, async (req: any, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
});

app.put("/api/auth/profile", authenticate, async (req: any, res) => {
  try {
    const { name, bio, skills, github, linkedin } = req.body;
    const user = await User.findByIdAndUpdate(req.userId, {
      name, bio, skills, github, linkedin
    }, { new: true }).select("-password");
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Teams
app.get("/api/teams", async (req, res) => {
  const teams = await Team.find({ isApproved: true }).populate("leader members requests", "name");
  res.json(teams);
});

app.post("/api/teams", authenticate, async (req: any, res) => {
  try {
    const { name, description } = req.body;
    const team = new Team({
      name,
      description,
      leader: req.userId,
      members: [req.userId],
      isApproved: false, // Needs admin approval (manual DB change as per user request)
    });
    await team.save();
    res.json({ message: "Team creation request sent. Awaiting admin approval.", team });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/teams/:id/join", authenticate, async (req: any, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ error: "Team not found" });
    if (team.members.includes(req.userId) || team.requests.includes(req.userId)) {
      return res.status(400).json({ error: "Already a member or request pending" });
    }
    team.requests.push(req.userId);
    await team.save();
    res.json({ message: "Join request sent" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/teams/:id/accept", authenticate, async (req: any, res) => {
  try {
    const { userId } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ error: "Team not found" });
    if (team.leader.toString() !== req.userId) {
      return res.status(403).json({ error: "Only the leader can accept members" });
    }
    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({ error: "Team is full" });
    }
    
    team.requests = team.requests.filter(id => id.toString() !== userId);
    team.members.push(userId);
    await team.save();
    res.json({ message: "Member accepted" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Community Posts
app.get("/api/posts", async (req, res) => {
  const posts = await Post.find().sort({ timestamp: -1 }).populate("author comments.author", "name");
  res.json(posts);
});

app.post("/api/posts", authenticate, async (req: any, res) => {
  try {
    const { title, content } = req.body;
    const post = new Post({
      author: req.userId,
      title,
      content
    });
    await post.save();
    const populatedPost = await post.populate("author", "name");
    io.emit("new_post", populatedPost);
    res.json(populatedPost);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/posts/:id/like", authenticate, async (req: any, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    
    const index = post.likes.indexOf(req.userId);
    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes.splice(index, 1);
    }
    await post.save();
    io.emit("post_updated", post);
    res.json(post);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/posts/:id/comments", authenticate, async (req: any, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    
    post.comments.push({
      author: req.userId,
      content,
      timestamp: new Date()
    });
    await post.save();
    const populatedPost = await post.populate("author comments.author", "name");
    io.emit("post_updated", populatedPost);
    res.json(populatedPost);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin Team Approval (Requested by user)
app.post("/api/admin/teams/:id/approve", authenticate, async (req: any, res) => {
  try {
    const admin = await User.findById(req.userId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ error: "Only admins can approve teams" });
    }
    const team = await Team.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json({ message: "Team approved", team });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin Team Member Approval (Requested by user)
app.post("/api/admin/teams/:id/accept-member", authenticate, async (req: any, res) => {
  try {
    const admin = await User.findById(req.userId);
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ error: "Only admins can accept members" });
    }
    const { userId } = req.body;
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ error: "Team not found" });
    
    team.requests = team.requests.filter(id => id.toString() !== userId);
    if (!team.members.includes(userId)) {
      team.members.push(userId);
    }
    await team.save();
    res.json({ message: "Member accepted by admin", team });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Leaderboard API
app.get("/api/leaderboard", async (req, res) => {
  try {
    const users = await User.find()
      .sort({ points: -1 })
      .limit(20)
      .select("name points badges eventsParticipated");
    
    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      points: user.points || 0,
      badges: user.badges || [],
      eventsParticipated: user.eventsParticipated || 0
    }));
    
    res.json(leaderboard);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Events API
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/events/:id/register", authenticate, async (req: any, res) => {
  try {
    const { department, year, phone, motivation } = req.body;
    const existing = await Registration.findOne({ event: req.params.id, user: req.userId });
    if (existing) return res.status(400).json({ error: "Already registered for this event" });

    const registration = new Registration({
      event: req.params.id,
      user: req.userId,
      details: { department, year, phone, motivation },
      status: 'Pending'
    });
    await registration.save();
    res.json({ message: "Registration submitted successfully. Awaiting admin approval." });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/my-registrations", authenticate, async (req: any, res) => {
  const registrations = await Registration.find({ user: req.userId }).populate('event');
  res.json(registrations);
});

// Seed Events if empty
const seedEvents = async () => {
  const count = await Event.countDocuments();
  if (count < 12) {
    // Clear existing to avoid duplicates if we're re-seeding
    await Event.deleteMany({});
    await Event.create([
      {
        title: 'CyberSentinel Hackathon 2026',
        type: 'Hackathon',
        status: 'Live',
        date: '2026-03-15',
        description: 'Build AI-driven security tools to protect critical infrastructure.',
        fullDescription: 'Join the most intense hackathon of the year where AI meets Cybersecurity. This 48-hour event challenges you to create innovative solutions for real-world security problems.',
        timeline: ['09:00 AM - Registration', '10:00 AM - Opening Ceremony', '11:00 AM - Hacking Begins', 'Day 2 04:00 PM - Final Submissions'],
        rules: ['Teams of 2-4 members', 'Open source tools only', 'Original code required'],
        participants: 124
      },
      {
        title: 'Neural Network Forensics Workshop',
        type: 'Workshop',
        status: 'Upcoming',
        date: '2026-03-20',
        description: 'Learn how to investigate deepfake attacks and model poisoning.',
        fullDescription: 'A hands-on workshop focusing on the forensic analysis of neural networks. We will cover techniques to detect adversarial examples and model tampering.',
        timeline: ['02:00 PM - Intro to AI Forensics', '03:30 PM - Hands-on Lab', '05:00 PM - Q&A Session'],
        rules: ['Basic Python knowledge required', 'Bring your own laptop'],
        participants: 45
      },
      {
        title: 'Zero-Day CTF: AI Guarded Vault',
        type: 'CTF',
        status: 'Upcoming',
        date: '2026-04-05',
        description: 'A capture-the-flag competition where the vault is guarded by an autonomous AI agent.',
        fullDescription: 'Test your skills against an AI-driven defense system. Can you bypass the neural firewall and retrieve the flags?',
        timeline: ['10:00 AM - Briefing', '11:00 AM - CTF Start', '06:00 PM - Awards Ceremony'],
        rules: ['Individual or teams of 2', 'No DDoS attacks allowed'],
        participants: 89
      },
      {
        title: 'AI Ethics & Security Summit',
        type: 'Conference',
        status: 'Past',
        date: '2026-02-10',
        description: 'A global summit discussing the intersection of AI ethics and cybersecurity.',
        fullDescription: 'Industry leaders and researchers gathered to discuss the future of secure AI and the ethical implications of autonomous defense systems.',
        timeline: ['09:00 AM - Keynote', '01:00 PM - Panel Discussion'],
        rules: ['Open to all students'],
        participants: 250
      },
      {
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
        title: 'LLM Prompt Injection Defense Lab',
        type: 'Workshop',
        status: 'Upcoming',
        date: '2026-03-28',
        description: 'Deep dive into securing Large Language Models against prompt injection.',
        fullDescription: 'Learn the latest techniques to sanitize inputs and harden LLM-based applications against malicious prompts and jailbreaks.',
        timeline: ['10:00 AM - Attack Vectors', '11:30 AM - Defense Strategies', '01:00 PM - Live Lab'],
        rules: ['Laptop with Python environment', 'Basic understanding of LLMs'],
        participants: 38
      },
      {
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
        title: 'IoT Security Fundamentals',
        type: 'Workshop',
        status: 'Upcoming',
        date: '2026-07-10',
        description: 'Learn to secure connected devices and smart home systems.',
        fullDescription: 'Explore the vulnerabilities in IoT devices and learn how to implement robust security measures.',
        timeline: ['09:00 AM - IoT Architecture', '11:00 AM - Common Attacks', '02:00 PM - Hardware Lab'],
        rules: ['Bring your own IoT kit (optional)', 'Basic networking knowledge'],
        participants: 28
      },
      {
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
        title: 'Future of AI in Defense',
        type: 'Conference',
        status: 'Upcoming',
        date: '2026-09-05',
        description: 'Exploring the role of AI in modern warfare and national security.',
        fullDescription: 'A specialized conference discussing the strategic implications of AI in defense systems.',
        timeline: ['10:00 AM - Opening Remarks', '11:00 AM - Session 1: Autonomous Systems', '02:00 PM - Session 2: Cyber Warfare'],
        rules: ['Registration required'],
        participants: 150
      },
      {
        title: 'Zero-Day Exploit Development',
        type: 'Workshop',
        status: 'Upcoming',
        date: '2026-10-12',
        description: 'Advanced workshop on finding and exploiting zero-day vulnerabilities.',
        fullDescription: 'Deep dive into memory corruption, ROP chains, and bypassing modern exploit mitigations.',
        timeline: ['09:00 AM - Memory Management', '11:00 AM - Fuzzing Techniques', '02:00 PM - Exploit Lab'],
        rules: ['Advanced C and Assembly knowledge', 'Laptop with Linux required'],
        participants: 20
      },
      {
        title: 'Global Cyber Defense Hackathon',
        type: 'Hackathon',
        status: 'Upcoming',
        date: '2026-11-01',
        description: 'Build the next generation of intrusion detection systems.',
        fullDescription: 'A 48-hour hackathon to create innovative solutions for protecting critical infrastructure.',
        timeline: ['Friday 06:00 PM - Kickoff', 'Saturday - Hacking', 'Sunday 02:00 PM - Demos'],
        rules: ['Teams of 2-4', 'Must use open-source technologies'],
        participants: 120
      },
      {
        title: 'Quantum Cryptography CTF',
        type: 'CTF',
        status: 'Upcoming',
        date: '2026-12-15',
        description: 'Solve challenges related to post-quantum cryptographic algorithms.',
        fullDescription: 'Test your knowledge of lattice-based and code-based cryptography in this unique CTF.',
        timeline: ['12:00 PM - Challenges Released', '12:00 PM (Next Day) - End'],
        rules: ['Individual or Teams of 2', 'Math background recommended'],
        participants: 65
      },
      {
        title: 'AI Security Summit 2027',
        type: 'Conference',
        status: 'Upcoming',
        date: '2027-01-20',
        description: 'The premier event for AI security researchers and practitioners.',
        fullDescription: 'Two days of talks, workshops, and networking focused on securing the AI lifecycle.',
        timeline: ['Day 1: Keynotes & Research Tracks', 'Day 2: Workshops & Industry Panels'],
        rules: ['Early bird registration open'],
        participants: 500
      }
    ]);
  }
};

// Seed Community Posts if empty
const seedCommunity = async () => {
  const count = await Post.countDocuments();
  if (count === 0) {
    // Find or create a system user for seeding
    let systemUser = await User.findOne({ email: 'system@srmmcet.edu' });
    if (!systemUser) {
      systemUser = new User({
        name: 'Neural Core',
        email: 'system@srmmcet.edu',
        password: 'system_secure_pass',
        role: 'admin'
      });
      await systemUser.save();
    }

    const posts = [
      {
        author: systemUser._id,
        title: 'Welcome to the Command Center!',
        content: 'This is the central hub for all SRM MCET AI and Cybersecurity students. Feel free to share your research, ask questions, and collaborate on projects.',
        comments: [
          { author: systemUser._id, content: 'Glad to be here!', timestamp: new Date() },
          { author: systemUser._id, content: 'The UI looks amazing, very futuristic.', timestamp: new Date() },
          { author: systemUser._id, content: 'Can we have a dedicated channel for CTF writeups?', timestamp: new Date() }
        ]
      },
      {
        author: systemUser._id,
        title: 'New Research: Adversarial Attacks on LLMs',
        content: 'I recently published a paper on how to mitigate prompt injection attacks. Check it out in the resources section!',
        comments: [
          { author: systemUser._id, content: 'This is crucial for our upcoming project.', timestamp: new Date() },
          { author: systemUser._id, content: 'Does it cover indirect prompt injection as well?', timestamp: new Date() },
          { author: systemUser._id, content: 'Great work! The defense strategies are very practical.', timestamp: new Date() }
        ]
      },
      {
        author: systemUser._id,
        title: 'Tips for the upcoming CTF',
        content: 'Focus on your binary exploitation and web security skills. The AI guardian is particularly sensitive to buffer overflows.',
        comments: [
          { author: systemUser._id, content: 'Thanks for the tip! Time to brush up on GDB.', timestamp: new Date() },
          { author: systemUser._id, content: 'Will there be any crypto challenges?', timestamp: new Date() },
          { author: systemUser._id, content: 'I heard the AI uses reinforcement learning to adapt to our attacks.', timestamp: new Date() }
        ]
      },
      {
        author: systemUser._id,
        title: 'Job Opportunity: Security Intern at TechCorp',
        content: 'TechCorp is looking for a cybersecurity intern with a focus on AI security. Apply through the career portal!',
        comments: [
          { author: systemUser._id, content: 'Just applied! Hope to get an interview.', timestamp: new Date() },
          { author: systemUser._id, content: 'What are the requirements for this role?', timestamp: new Date() },
          { author: systemUser._id, content: 'Is it remote or on-site?', timestamp: new Date() }
        ]
      },
      {
        author: systemUser._id,
        title: 'Weekly Knowledge Sharing: Zero Trust Architecture',
        content: 'This week we are discussing Zero Trust. Why is it becoming the industry standard?',
        comments: [
          { author: systemUser._id, content: 'Never trust, always verify!', timestamp: new Date() },
          { author: systemUser._id, content: 'It really helps in mitigating lateral movement within a network.', timestamp: new Date() },
          { author: systemUser._id, content: 'The principle of least privilege is key here.', timestamp: new Date() }
        ]
      },
      {
        author: systemUser._id,
        title: 'Call for Volunteers: CyberSentinel Hackathon',
        content: 'We need volunteers for the upcoming hackathon! If you are interested in helping with logistics or mentoring, please sign up.',
        comments: [
          { author: systemUser._id, content: 'I can help with mentoring for the AI track.', timestamp: new Date() },
          { author: systemUser._id, content: 'Count me in for logistics!', timestamp: new Date() }
        ]
      },
      {
        author: systemUser._id,
        title: 'New Tool: AI-Powered Vulnerability Scanner',
        content: 'I developed a simple tool that uses GPT-4 to scan for common web vulnerabilities. Check out the repo!',
        comments: [
          { author: systemUser._id, content: 'This is amazing! Can it detect SQLi?', timestamp: new Date() },
          { author: systemUser._id, content: 'Be careful with false positives.', timestamp: new Date() },
          { author: systemUser._id, content: 'I tried it on a test site, it found a few XSS!', timestamp: new Date() }
        ]
      },
      {
        author: systemUser._id,
        title: 'Discussion: Ethical Implications of AI in Cyberwarfare',
        content: 'What are your thoughts on autonomous cyber weapons? Should there be international regulations?',
        comments: [
          { author: systemUser._id, content: 'Absolutely, we need a Geneva Convention for cyberspace.', timestamp: new Date() },
          { author: systemUser._id, content: 'It is a double-edged sword.', timestamp: new Date() },
          { author: systemUser._id, content: 'The attribution problem makes regulation difficult.', timestamp: new Date() }
        ]
      }
    ];

    await Post.create(posts);
  }
};

// Seed Teams if empty
const seedTeams = async () => {
  const count = await Team.countDocuments();
  if (count === 0) {
    let systemUser = await User.findOne({ email: 'system@srmmcet.edu' });
    if (!systemUser) return;

    const teams = [
      {
        name: 'Cyber Phantoms',
        description: 'An elite group of ethical hackers focused on penetration testing and vulnerability research.',
        leader: systemUser._id,
        members: [systemUser._id],
        maxMembers: 5
      },
      {
        name: 'Neural Defenders',
        description: 'Specializing in AI-driven threat detection and automated incident response systems.',
        leader: systemUser._id,
        members: [systemUser._id],
        maxMembers: 5
      },
      {
        name: 'Binary Wizards',
        description: 'Focused on reverse engineering, malware analysis, and low-level system security.',
        leader: systemUser._id,
        members: [systemUser._id],
        maxMembers: 5
      }
    ];

    await Team.create(teams);
  }
};

// Seed Users if empty
const seedUsers = async () => {
  const count = await User.countDocuments();
  if (count <= 1) { // Only system user or none
    const users = [
      { name: 'Alex "Cipher" Chen', email: 'alex@srm.edu', password: 'password123', points: 2450, badges: ['🏆 CTF Champ', '🛡️ Bug Hunter'], eventsParticipated: 12 },
      { name: 'Sarah "Neural" Smith', email: 'sarah@srm.edu', password: 'password123', points: 2100, badges: ['🧠 AI Expert', '💻 Code Ninja'], eventsParticipated: 10 },
      { name: 'Jordan "Root" Miller', email: 'jordan@srm.edu', password: 'password123', points: 1950, badges: ['🔥 Speedster'], eventsParticipated: 8 },
      { name: 'Elena "Ghost" V', email: 'elena@srm.edu', password: 'password123', points: 1800, badges: ['🕵️ Forensics'], eventsParticipated: 7 },
      { name: 'Marcus "Void" Lee', email: 'marcus@srm.edu', password: 'password123', points: 1650, badges: ['🛠️ Tool Builder'], eventsParticipated: 6 },
      { name: 'Priya "Secure" K', email: 'priya@srm.edu', password: 'password123', points: 1500, badges: ['🔐 Crypto', '🛡️ Defender'], eventsParticipated: 5 },
      { name: 'David "Data" W', email: 'david@srm.edu', password: 'password123', points: 1420, badges: ['📊 Analyst'], eventsParticipated: 5 },
      { name: 'Sofia "Logic" R', email: 'sofia@srm.edu', password: 'password123', points: 1350, badges: ['🧩 Solver'], eventsParticipated: 4 },
      { name: 'Kevin "Kernel" J', email: 'kevin@srm.edu', password: 'password123', points: 1280, badges: ['🐧 Linux Guru'], eventsParticipated: 4 },
      { name: 'Aisha "Cloud" M', email: 'aisha@srm.edu', password: 'password123', points: 1200, badges: ['☁️ Cloud Sec'], eventsParticipated: 3 }
    ];
    
    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        await User.create({ ...u, password: hashedPassword });
      }
    }
  }
};

seedEvents();
seedCommunity();
seedTeams();
seedUsers();

// --- Vite Middleware ---
async function startServer() {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    console.log(`Starting server in ${isProduction ? 'production' : 'development'} mode...`);
    
    // API 404 handler
    app.all("/api/*", (req, res) => {
      res.status(404).json({ error: `API route ${req.method} ${req.url} not found` });
    });

    if (!isProduction) {
      console.log("Initializing Vite dev server...");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("Vite middleware attached.");
    } else {
      const distPath = path.resolve("dist");
      console.log(`Serving static files from: ${distPath}`);
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`>>> COMMAND CENTER ONLINE: http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error("CRITICAL: Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
