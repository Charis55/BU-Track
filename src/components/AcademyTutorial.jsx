import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Activity, 
  Calendar, 
  Award, 
  X, 
  ChevronRight, 
  Zap,
  Users,
  Utensils,
  Dumbbell
} from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const slides = [
  {
    title: "Welcome to the Academy",
    desc: "You are now part of the most elite health ecosystem at Babcock University. Every action you take earns you personal points and brings your Course of Study closer to the Cup.",
    icon: <Zap size={48} className="glow-emerald" />,
    color: "var(--accent-emerald)"
  },
  {
    title: "The Strict Consistency Rule",
    desc: "Log a meal or workout EVERY SINGLE DAY (Sun-Sat) to earn a massive +100 Point Bonus. Miss one day, and you lose the streak. Discipline is the only way to the top.",
    icon: <Calendar size={48} className="glow-gold" />,
    color: "var(--accent-gold)"
  },
  {
    title: "Earning Your Points",
    points: [
      { label: "Log a Meal", value: "+10", icon: <Utensils size={20} /> },
      { label: "Log a Workout", value: "+25", icon: <Dumbbell size={20} /> },
      { label: "Weekly 7-Day Streak", value: "+100", icon: <Trophy size={20} /> }
    ],
    desc: "Consistency beats intensity. Small daily steps lead to campus-wide dominance.",
    icon: <Activity size={48} className="glow-blue" />,
    color: "#3b82f6"
  },
  {
    title: "Course of Study Cup",
    desc: "Your points are shared! Every point you earn is added to your Course's total. Compete with Software Eng, Nursing, and Law to see who rules the campus.",
    icon: <Users size={48} className="glow-purple" />,
    color: "#a855f7"
  },
  {
    title: "The Grand Prizes",
    desc: "At the end of the semester, the top students and courses win exclusive rewards including Free Gym Memberships, Meal Discounts, and Tech Gadgets.",
    icon: <Award size={48} className="glow-emerald" />,
    color: "var(--accent-emerald)"
  }
];

const AcademyTutorial = ({ user, onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = async () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(s => s + 1);
    } else {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { tutorialCompleted: true });
      if (onComplete) onComplete();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="tutorial-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,5,0.95)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="tutorial-card glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '200px', height: '200px', background: slides[currentSlide].color, opacity: 0.1, borderRadius: '50%', filter: 'blur(60px)' }} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
              {slides[currentSlide].icon}
            </div>
            
            <h2 className="glow-emerald" style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#fff' }}>{slides[currentSlide].title}</h2>
            <p className="text-secondary" style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>{slides[currentSlide].desc}</p>
            
            {slides[currentSlide].points && (
              <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '2rem' }}>
                {slides[currentSlide].points.map((p, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ color: 'var(--accent-emerald)' }}>{p.icon}</span>
                      <span style={{ fontWeight: 600 }}>{p.label}</span>
                    </div>
                    <span style={{ color: 'var(--accent-gold)', fontWeight: 800 }}>{p.value}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="tutorial-footer" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {slides.map((_, i) => (
              <div key={i} style={{ width: i === currentSlide ? '20px' : '6px', height: '6px', borderRadius: '3px', background: i === currentSlide ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.2)', transition: '0.3s' }} />
            ))}
          </div>
          
          <button 
            className="log-btn primary" 
            onClick={handleNext}
            style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {currentSlide === slides.length - 1 ? 'Start My Journey' : 'Continue'} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AcademyTutorial;
