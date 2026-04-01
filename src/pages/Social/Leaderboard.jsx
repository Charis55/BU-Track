import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  MapPin, 
  School, 
  Search, 
  TrendingUp, 
  Award,
  Users,
  ChevronLeft
} from 'lucide-react';
import { getLeaderboardData } from '../../utils/db';
import { useNavigate } from 'react-router-dom';

const Leaderboard = () => {
  const [tab, setTab] = useState('students');
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaders = async () => {
      setLoading(true);
      try {
        const data = await getLeaderboardData();
        setLeaders(data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  return (
    <div className="leaderboard-container container animate-fade-in">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}><ChevronLeft size={20} /> Back</button>
        <h1 className="glow-emerald">Campus Rankings</h1>
        <div style={{ width: '40px' }} />
      </header>

      <section className="leaderboard-tabs glass-card">
        <button 
          className={`tab-btn ${tab === 'students' ? 'active' : ''}`}
          onClick={() => setTab('students')}
        >
          <Users size={18} /> Top Students
        </button>
        <button 
          className={`tab-btn ${tab === 'departments' ? 'active' : ''}`}
          onClick={() => setTab('departments')}
        >
          <School size={18} /> Departments
        </button>
      </section>

      <div className="leaderboard-main animate-fade-in">
        {loading ? (
          <div className="glass-card loading-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div className="loader emerald-text">Loading ranking data...</div>
          </div>
        ) : leaders.length === 0 ? (
          <div className="glass-card empty-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <p className="text-secondary">No activity logs found for today. Be the first to log a meal or workout!</p>
          </div>
        ) : (
          <div className="rankings-list glass-card">
            {leaders.map((student, idx) => (
              <motion.div 
                key={idx}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="rank-item"
              >
                <span className="rank-num">{idx + 1}</span>
                <div className="rank-info">
                  <h4>Student ({student.uid.substring(0, 5)}...)</h4>
                  <span>Today's Calories</span>
                </div>
                <div className="rank-points emerald-text">{student.caloriesConsumed || 0} kcal</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Leaderboard;
