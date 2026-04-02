import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ChevronLeft, Flag, Users, Clock, Zap, Calendar, Heart, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ShareModal from '../../components/ShareModal';
import { 
  getDailyChallenges, 
  enrollInChallenge, 
  getChallengeParticipants,
  getEnrollmentCount 
} from '../../utils/db';

const ChallengeCard = ({ challenge, user }) => {
  const [participants, setParticipants] = useState([]);
  const [count, setCount] = useState(0);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const p = await getChallengeParticipants(challenge.id);
      const c = await getEnrollmentCount(challenge.id);
      setParticipants(p);
      setCount(c);
      setEnrolled(p.includes(user?.profile?.username));
      setLoading(false);
    };
    fetchData();
  }, [challenge.id, user?.profile?.username]);

  const handleEnroll = async () => {
    if (enrolled) return;
    setEnrolled(true);
    setCount(prev => prev + 1);
    setParticipants(prev => [...prev, user?.profile?.username]);
    await enrollInChallenge(challenge.id, user.uid);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card" 
      style={{ padding: '1.5rem', border: enrolled ? '1px solid var(--border-emerald)' : '1px solid var(--border-subtle)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, color: enrolled ? 'var(--accent-emerald)' : '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem' }}>
            <Flag size={18} /> {challenge.title}
          </h3>
          <p className="text-secondary" style={{ marginTop: '0.5rem', fontSize: '0.9rem', lineHeight: '1.4' }}>{challenge.desc}</p>
        </div>
        {enrolled && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>
            ENROLLED
          </motion.div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.25rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            <Users size={14} /> <span>{count} Students Enrolled</span>
          </div>
          <div style={{ display: 'flex', gap: '-8px' }}>
            {participants.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                  {participants.slice(0, 3).map(p => `@${p}`).join(', ')} {participants.length > 3 ? `+${participants.length - 3}` : ''}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>are in!</span>
              </div>
            ) : (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Be the first to join!</span>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => setShareModalOpen(true)}
            style={{ 
              background: 'rgba(255,255,255,0.05)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px', padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' 
            }}
          >
            <Share2 size={16} />
          </button>
          <button 
            onClick={handleEnroll} 
            disabled={enrolled}
            className={`log-btn ${enrolled ? 'secondary' : 'primary'}`}
            style={{ width: 'auto', padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
          >
            {enrolled ? 'See You There' : 'Join Session'}
          </button>
        </div>
      </div>
      <ShareModal 
        isOpen={shareModalOpen} 
        onClose={() => setShareModalOpen(false)} 
        type="challenge" 
        payload={challenge} 
      />
    </motion.div>
  );
};

const Challenges = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dailyData, setDailyData] = useState(null);

  useEffect(() => {
    setDailyData(getDailyChallenges());
  }, []);

  if (!dailyData) return null;

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '100px' }}>
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}><ChevronLeft size={20} /> Back</button>
        <h1 className="glow-emerald">Campus Challenges</h1>
        <div style={{ width: '40px' }} />
      </header>

      <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1rem' }}>
        {/* State Banners */}
        {dailyData.type === 'REST_DAY' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', border: '1.5px dashed var(--border-gold)' }}>
            <Calendar size={48} color="var(--accent-gold)" style={{ margin: '0 auto 1.5rem' }} />
            <h2 className="glow-gold">Sabbath Rest Day</h2>
            <p className="text-secondary" style={{ maxWidth: '400px', margin: '0.5rem auto' }}>Take today to recharge both physically and spiritually. No active challenges on Saturdays.</p>
          </motion.div>
        )}

        {dailyData.type === 'FRIDAY_CLOSED' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', border: '1.5px dashed var(--accent-emerald)' }}>
            <Clock size={48} color="var(--accent-emerald)" style={{ margin: '0 auto 1.5rem' }} />
            <h2 className="glow-emerald">Preparation Day</h2>
            <p className="text-secondary" style={{ maxWidth: '400px', margin: '0.5rem auto' }}>Friday challenges are morning-only. Check back early next week to smash your goals!</p>
          </motion.div>
        )}

        {dailyData.type === 'ACTIVE' && (
          <>
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)' }}>
              <Zap size={40} color="var(--accent-emerald)" style={{ margin: '0 auto 1rem' }} />
              <h3>Daily Double Duo</h3>
              <p className="text-secondary" style={{ fontSize: '0.9rem' }}>Two new challenges have dropped. Enroll and log your progress to climb the student leaderboards.</p>
            </div>

            <h3 style={{ marginTop: '1rem', color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy size={20} color="var(--accent-gold)"/> Active Today
            </h3>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {dailyData.challenges.map(challenge => (
                <ChallengeCard key={challenge.id} challenge={challenge} user={user} />
              ))}
            </div>
          </>
        )}

        {/* Global Schedule Card */}
        <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1rem', border: '1px solid rgba(255,255,255,0.03)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16}/> Campus Schedule</h4>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            • Sunday - Thursday: 2 Daily Challenges<br />
            • Friday: Morning Sprint (Closes at 12 PM)<br />
            • Saturday: Collective Rest & Worship
          </p>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
