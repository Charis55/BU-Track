import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  ChevronLeft,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { WORKOUT_CATEGORIES } from '../../data/workouts';
import ShareModal from '../../components/ShareModal';

const WorkoutTracker = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [activeCategory, setActiveCategory] = useState(WORKOUT_CATEGORIES[0]);
  const [activeSub, setActiveSub] = useState(WORKOUT_CATEGORIES[0].subcategories[0]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  
  const [duration, setDuration] = useState(30);
  const [isLogging, setIsLogging] = useState(false);
  const [burnedToday, setBurnedToday] = useState(0);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    const fetchDaily = async () => {
      if (user?.uid) {
        const log = await getDailyLog(user.uid);
        setBurnedToday(log.caloriesBurned || 0);
      }
    };
    fetchDaily();

    if (state?.sharedWorkout) {
      setTimeout(() => {
        setSelectedWorkout(state.sharedWorkout);
        if (state.sharedWorkout.sharedDuration) setDuration(state.sharedWorkout.sharedDuration);
        navigate(window.location.pathname, { replace: true, state: {} });
      }, 300);
    }
  }, [user?.uid, state, navigate]);

  // Handle category change
  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    setActiveSub(cat.subcategories[0]); // auto-select first sub
    setSelectedWorkout(null);
  };

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
        <button className="back-btn" onClick={() => navigate(-1)}><ChevronLeft size={20} /> Back</button>
        <h1 className="glow-emerald">Workout Tracker</h1>
        <div style={{ width: '40px' }} />
      </header>

      <div className="workout-grid">
        <section className="workout-selector">
          
          <div className="glass-card main-selector p-0" style={{ padding: '1.5rem' }}>
            <h3>Choose Activity</h3>
            
            {/* Primary Category Selection */}
            <div className="category-chips flex-wrap mb-4" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {WORKOUT_CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat)}
                  style={{
                    padding: '0.6rem 1rem',
                    borderRadius: '50px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: activeCategory.id === cat.id ? `${cat.color}20` : 'rgba(255,255,255,0.03)',
                    color: activeCategory.id === cat.id ? cat.color : '#cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    whiteSpace: 'nowrap',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                >
                  <span>{cat.icon}</span> {cat.name}
                </button>
              ))}
            </div>

            {/* Sub-Category Selection */}
            {activeCategory.subcategories.length > 0 && (
              <div className="subcategory-tabs mb-4 border-b pb-2" style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1rem', overflowX: 'auto' }}>
                {activeCategory.subcategories.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setActiveSub(sub);
                      setSelectedWorkout(null);
                    }}
                    style={{
                      paddingBottom: '0.5rem',
                      background: 'none',
                      border: 'none',
                      color: activeSub.id === sub.id ? activeCategory.color : '#94a3b8',
                      borderBottom: activeSub.id === sub.id ? `2px solid ${activeCategory.color}` : '2px solid transparent',
                      fontWeight: activeSub.id === sub.id ? 700 : 500,
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s'
                    }}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}

            {/* Workouts Grid for active Subcategory */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeSub.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="type-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: '1rem',
                  marginTop: '1rem'
                }}
              >
                {activeSub.workouts.map(workout => (
                  <button 
                    key={workout.id} 
                    className={`type-btn ${selectedWorkout?.id === workout.id ? 'selected' : ''}`}
                    onClick={() => setSelectedWorkout(workout)}
                    style={{
                      background: selectedWorkout?.id === workout.id ? `${activeCategory.color}15` : 'rgba(255,255,255,0.04)',
                      borderColor: selectedWorkout?.id === workout.id ? activeCategory.color : 'rgba(255,255,255,0.1)',
                      color: selectedWorkout?.id === workout.id ? '#fff' : '#cbd5e1',
                    }}
                  >
                    <div className="type-icon" style={{ fontSize: '24px', marginBottom: '0.5rem' }}>{workout.icon}</div>
                    <span style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>{workout.name}</span>
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Logging Setup Modal/Drawer */}
            <AnimatePresence>
              {selectedWorkout && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="setup-details" 
                  style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px dashed rgba(255,255,255,0.1)' }}
                >
                  <h4 style={{ color: '#f1f5f9', marginBottom: '1rem' }}>Logging: {selectedWorkout.name}</h4>
                  
                  <div className="input-field">
                    <label>Duration (minutes)</label>
                    <div className="range-container">
                      <input 
                        type="range" 
                        min="5" max="180" step="5" 
                        value={duration} 
                        onChange={(e) => setDuration(parseInt(e.target.value))} 
                        style={{ accentColor: activeCategory.color }}
                      />
                      <div className="range-val">{duration} <small>min</small></div>
                    </div>
                  </div>
                  
                  <div className="est-calories glass-card" style={{ background: 'rgba(0,0,0,0.3)', marginTop: '1rem' }}>
                    <Flame size={20} className="gold-text" />
                    <span>Estimated Burn: <strong>{selectedWorkout.calPerMin * duration} kcal</strong></span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <button 
                      type="button"
                      onClick={() => setShareModalOpen(true)}
                      style={{ 
                        flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.05)', color: activeCategory.color, 
                        border: `1px solid ${activeCategory.color}50`, borderRadius: '0.625rem', cursor: 'pointer', fontWeight: 600
                      }}
                    >
                      Share
                    </button>
                    <button 
                      className="log-btn primary" 
                      disabled={isLogging} 
                      onClick={handleLog}
                      style={{ background: activeCategory.color, flex: 2 }}
                    >
                      {isLogging ? 'Saving Session...' : 'Finish & Log Workout'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Share Modal Wrapper */}
          {selectedWorkout && (
            <ShareModal
              isOpen={shareModalOpen}
              onClose={() => setShareModalOpen(false)}
              type="workout"
              payload={{ ...selectedWorkout, sharedDuration: duration }}
            />
          )}
        </section>

        <section className="workout-history">
          <div className="glass-card summary-display">
             <div className="summary-info">
               <h3 className="gold-text">Today's Burn</h3>
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
              Consistency is key. Push hard on your specific workouts—BU-Track ranks you among your campus mates based on total calories burned!
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WorkoutTracker;
