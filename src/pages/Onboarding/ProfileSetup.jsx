import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Target, Activity, Ruler, Weight, User } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const steps = [
  { id: 'basics', title: 'The Basics', icon: <User size={24} /> },
  { id: 'metrics', title: 'Your Stats', icon: <Activity size={24} /> },
  { id: 'goals', title: 'The Goal', icon: <Target size={24} /> }
];

const ProfileSetup = ({ onComplete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    weight: '',
    height: '',
    goal: ''
  });

  const nextStep = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleComplete = async () => {
    if (!user?.uid) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        ...formData,
        completedOnboarding: true,
        displayName: user.displayName || 'Student',
        email: user.email
      });
      if (onComplete) onComplete(formData);
      navigate('/');
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-stepper glass-card">
        <div className="stepper-header">
          {steps.map((s, i) => (
            <div key={s.id} className={`step-item ${i === step ? 'active' : i < step ? 'completed' : ''}`}>
              <div className="step-icon">{s.icon}</div>
              <span>{s.title}</span>
            </div>
          ))}
        </div>

        <div className="stepper-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="step-form"
            >
              {step === 0 && (
                <div className="form-group">
                  <h2 className="glow-emerald">Let's get started</h2>
                  <p className="text-secondary">Tell us a bit about yourself.</p>
                  <div className="input-field">
                    <label>Age</label>
                    <input type="number" placeholder="Enter your age" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                  </div>
                  <div className="input-field">
                    <label>Gender</label>
                    <div className="option-grid">
                      {['Male', 'Female', 'Non-binary'].map(g => (
                        <button key={g} className={`option-btn ${formData.gender === g ? 'selected' : ''}`} onClick={() => setFormData({...formData, gender: g})}>{g}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="form-group">
                  <h2 className="glow-emerald">Your Metrics</h2>
                  <p className="text-secondary">Used for accurate calorie calculations.</p>
                  <div className="input-field">
                    <label><Weight size={18} /> Weight (kg)</label>
                    <input type="number" placeholder="70" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
                  </div>
                  <div className="input-field">
                    <label><Ruler size={18} /> Height (cm)</label>
                    <input type="number" placeholder="175" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="form-group">
                  <h2 className="glow-gold">What's the goal?</h2>
                  <p className="text-secondary">We'll tailor your plan based on this.</p>
                  <div className="option-stack">
                    {['Lose Weight', 'Maintain', 'Build Muscle'].map(g => (
                      <button key={g} className={`option-btn large ${formData.goal === g ? 'selected' : ''}`} onClick={() => setFormData({...formData, goal: g})}>{g}</button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="stepper-footer">
          {step > 0 && (
            <button className="nav-btn secondary" onClick={prevStep}>
              <ChevronLeft size={20} /> Back
            </button>
          )}
          <div style={{ flex: 1 }} />
          {step < steps.length - 1 ? (
            <button className="nav-btn primary" onClick={nextStep}>
              Next <ChevronRight size={20} />
            </button>
          ) : (
            <button className="nav-btn primary finish" onClick={handleComplete} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Finish Setup'} <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default ProfileSetup;
