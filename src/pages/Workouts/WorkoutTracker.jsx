import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Dumbbell, 
  Flame, 
  Timer, 
  History, 
  Plus, 
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logUserWorkout, getDailyLog } from '../../utils/db';
import { useNavigate } from 'react-router-dom';

const WORKOUT_TYPES = [
  { id: 'run', name: 'Running', icon: <Play size={20} />, calPerMin: 10, color: '#10b981' },
  { id: 'gym', name: 'Gym Session', icon: <Dumbbell size={20} />, calPerMin: 6, color: '#f59e0b' },
  { id: 'football', name: 'Football Match', icon: <Award size={20} />, calPerMin: 12, color: '#3b82f6' },
  { id: 'walk', name: 'Campus Walk', icon: <Timer size={20} />, calPerMin: 4, color: '#64748b' }
];

const WorkoutTracker = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [duration, setDuration] = useState(30);
  const [isLogging, setIsLogging] = useState(false);
  const [burnedToday, setBurnedToday] = useState(0);

  useEffect(() => {
    const fetchDaily = async () => {
      if (user?.uid) {
        const log = await getDailyLog(user.uid);
        setBurnedToday(log.caloriesBurned || 0);
      }
    };
    fetchDaily();
  }, [user?.uid]);

  const handleLog = async () => {
    if (!selectedWorkout || !user?.uid) return;
    setIsLogging(true);
    const calories = selectedWorkout.calPerMin * duration;
    
    try {
      await logUserWorkout(user.uid, {
        name: selectedWorkout.name,
        duration,
        calories,
        type: selectedWorkout.id
      });
      setBurnedToday(prev => prev + calories);
      setSelectedWorkout(null);
      setDuration(30);
    } catch (err) {
      console.error("Error logging workout:", err);
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="workout-container container animate-fade-in">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}><ChevronLeft size={20} /> Back</button>
        <h1 className="glow-emerald">Workout Tracker</h1>
        <div style={{ width: '40px' }} />
      </header>

      <div className="workout-grid">
        <section className="workout-selector">
          <div className="glass-card main-selector">
            <h3>Start New Activity</h3>
            <div className="type-grid">
              {WORKOUT_TYPES.map(type => (
                <button 
                  key={type.id} 
                  className={`type-btn ${selectedWorkout?.id === type.id ? 'selected' : ''}`}
                  onClick={() => setSelectedWorkout(type)}
                >
                  <div className="type-icon" style={{ color: type.color }}>{type.icon}</div>
                  <span>{type.name}</span>
                </button>
              ))}
            </div>

            {selectedWorkout && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="setup-details">
                <div className="input-field">
                  <label>Duration (minutes)</label>
                  <div className="range-container">
                    <input 
                      type="range" 
                      min="5" max="180" step="5" 
                      value={duration} 
                      onChange={(e) => setDuration(parseInt(e.target.value))} 
                    />
                    <div className="range-val">{duration} min</div>
                  </div>
                </div>
                
                <div className="est-calories glass-card">
                  <Flame size={20} className="gold-text" />
                  <span>Estimated Burn: <strong>{selectedWorkout.calPerMin * duration} kcal</strong></span>
                </div>

                <button 
                  className="log-btn primary" 
                  disabled={isLogging} 
                  onClick={handleLog}
                >
                  {isLogging ? 'Saving Session...' : 'Finish & Log Workout'}
                </button>
              </motion.div>
            )}
          </div>
        </section>

        <section className="workout-history">
          <div className="glass-card summary-display">
             <div className="summary-info">
               <h3 className="gold-text">Today's Activity</h3>
               <div className="burned-val">{burnedToday} <small>kcal</small></div>
             </div>
             <Award size={40} className="gold-text" />
          </div>

          <div className="glass-card history-card" style={{ marginTop: '1.5rem' }}>
            <div className="header-flex">
              <h3>Stats & Impact</h3>
              <TrendingUp size={18} className="text-muted" />
            </div>
            <div className="text-secondary" style={{ fontSize: '0.9rem', fontStyle: 'italic', padding: '1rem' }}>
              Consistency is key. BU-Track ranks you among your hostel mates based on active minutes!
            </div>
          </div>
        </section>
      </div>

    </div>
  );
};

export default WorkoutTracker;
