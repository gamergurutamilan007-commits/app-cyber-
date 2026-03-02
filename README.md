# AI × Cyber Command HQ – Digital Headquarters

A modern, fully responsive student ecosystem platform for managing events, teams, leaderboards, and knowledge sharing in one centralized digital hub.

## 🚀 Tech Stack
- **Frontend**: React 19 (Vite), TypeScript, Tailwind CSS 4.0, Motion.
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **Security**: JWT Authentication, bcryptjs password hashing, Cookie-based sessions.
- **AI**: Google Gemini 3 Flash integration for Chat & Threat Analysis.

---

## 💻 Local Development (VS Code)

### 1. Prerequisites
- **Node.js**: [Download & Install Node.js](https://nodejs.org/) (v18+ recommended).
- **MongoDB**: 
  - **Local**: Install [MongoDB Community Server](https://www.mongodb.com/try/download/community).
  - **Cloud**: Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- **Gemini API Key**: Get your key from [Google AI Studio](https://aistudio.google.com/).

### 2. Setup Steps
1. **Clone the repository** (or download the source code).
2. **Open the folder** in VS Code.
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Configure Environment Variables**:
   - Create a `.env` file in the root directory.
   - Copy the contents from `.env.example` and fill in your values:
     ```env
     MONGODB_URI="mongodb://localhost:27017/cyber_cmd" # Or your Atlas URI
     JWT_SECRET="your_random_secret_string"
     GEMINI_API_KEY="your_gemini_api_key"
     ```
5. **Run the Application**:
   ```bash
   npm run dev
   ```
6. **Access the App**: Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment Guide

Since this is a **Full-Stack (Express + Vite)** application, you need a platform that supports Node.js servers.

### Option A: Railway (Recommended for Full-Stack)
1. **Push your code** to a GitHub repository.
2. **Connect GitHub to Railway**: Go to [railway.app](https://railway.app/) and create a new project from your repo.
3. **Add MongoDB**: You can add a MongoDB service directly within your Railway project.
4. **Set Variables**: In the "Variables" tab, add:
   - `MONGODB_URI` (Railway will provide this if you add the MongoDB service).
   - `JWT_SECRET`.
   - `GEMINI_API_KEY`.
   - `NODE_ENV=production`.
5. **Build & Start**: Railway will automatically detect the `scripts` in `package.json`. Ensure your `start` script is set to `node server.ts`.

### Option B: Render
1. Create a **Web Service** on [Render](https://render.com/).
2. Connect your GitHub repo.
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `node server.ts`
5. **Environment Variables**: Add your `.env` variables in the Render dashboard.

---

## 🛡️ Admin Instructions
To authorize a team creation request:
1. Connect to your MongoDB database (using MongoDB Compass or Atlas UI).
2. Find the `teams` collection.
3. Locate the team document you want to approve.
4. Set `isApproved: true`.

---

## 📝 Future Improvements
- Real-time WebSockets for live chat.
- Automated Admin Dashboard for team approvals.
- Integrated CTF challenge platform.
