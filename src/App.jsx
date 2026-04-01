import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Overview';
import MealLogger from './pages/Meals/MealLogger';
import WorkoutTracker from './pages/Workouts/WorkoutTracker';
import Leaderboard from './pages/Social/Leaderboard';
import CampusMap from './pages/Campus/Map';
import ProfileSetup from './pages/Onboarding/ProfileSetup';

const AppContent = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-deep)' }}>
      <div className="glow-emerald" style={{ fontSize: '1.5rem', fontWeight: '700' }}>BU-TRACK</div>
    </div>
  );

  const showNavbar = user && location.pathname !== '/login' && location.pathname !== '/onboarding';

  // Redirect to onboarding if profile is not complete
  if (user && !user.profile?.completedOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" />;
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/onboarding" element={user ? <ProfileSetup /> : <Navigate to="/login" />} />
        
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/meals" element={user ? <MealLogger /> : <Navigate to="/login" />} />
        <Route path="/workouts" element={user ? <WorkoutTracker /> : <Navigate to="/login" />} />
        <Route path="/leaderboard" element={user ? <Leaderboard /> : <Navigate to="/login" />} />
        <Route path="/campus" element={user ? <CampusMap /> : <Navigate to="/login" />} />
      </Routes>
      
      {showNavbar && <Navbar />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
