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
  const posts = await Post.find().sort({ timestamp: -1 }).populate("author", "name");
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
  if (count === 0) {
    await Event.create([
      {
        title: 'CyberSentinel Hackathon 2026',
        type: 'Hackathon',
        status: 'Live',
        date: '2026-03-15',
        description: 'Build AI-driven security tools to protect critical infrastructure.',
        fullDescription: 'Join the most intense hackathon of the year where AI meets Cybersecurity.',
        timeline: ['09:00 AM - Registration', '10:00 AM - Opening Ceremony'],
        rules: ['Teams of 2-4 members', 'Open source tools only'],
        participants: 124
      },
      {
        title: 'Neural Network Forensics Workshop',
        type: 'Workshop',
        status: 'Upcoming',
        date: '2026-03-20',
        description: 'Learn how to investigate deepfake attacks and model poisoning.',
        fullDescription: 'A hands-on workshop focusing on the forensic analysis of neural networks.',
        timeline: ['02:00 PM - Intro to AI Forensics'],
        rules: ['Basic Python knowledge required'],
        participants: 45
      }
    ]);
  }
};
seedEvents();

// --- Vite Middleware ---
async function startServer() {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    console.log(`Starting server in ${isProduction ? 'production' : 'development'} mode...`);
    
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
