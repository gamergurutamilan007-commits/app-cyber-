import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Footer, PageTransition } from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Events from './pages/Events';
import Teams from './pages/Teams';
import Leaderboard from './pages/Leaderboard';
import Community from './pages/Community';
import Profile from './pages/Profile';
import AIAssistant from './pages/AIAssistant';
import Login from './pages/Login';
import Signup from './pages/Signup';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-dark-bg text-text-primary cyber-grid relative overflow-hidden">
          <div className="scanline" />
          
          {/* Global Background Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-cyan/5 blur-[120px] rounded-full animate-pulse-slow" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-electric-purple/5 blur-[120px] rounded-full animate-pulse-slow" />
          </div>

          <Navbar />
          <main className="flex-grow pt-24 pb-12 relative z-10">
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/community" element={<Community />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/ai" element={<AIAssistant />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Routes>
            </PageTransition>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
