import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, Droplet, TrendingUp, Plus, ChevronRight,
  Utensils, Dumbbell, Zap, Trophy, Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getDailyLog } from '../../utils/db';
import { Link } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};

const RadialRing = ({ value, max, color, size = 80 }) => {
  const pct = Math.min(value / max, 1);
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
      <motion.circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke={color} strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
      />
    </svg>
  );
};

const StatCard = ({ icon: Icon, label, value, unit, color, colorHex, max }) => (
  <motion.div variants={itemVariants} whileHover={{ y: -6, scale: 1.02 }} className="glass-card stat-card">
    <div className="icon-circle" style={{ background: `${colorHex}15`, color: colorHex, border: `1px solid ${colorHex}40` }}>
      <Icon size={20} />
    </div>
    <div className="stat-info">
      <span>{label}</span>
      <h3>{value.toLocaleString()} <small>{unit}</small></h3>
    </div>
    {max && <RadialRing value={value} max={max} color={colorHex} size={64} />}
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const calGoal = 2200;
  const burnGoal = 500;

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.uid) {
        setLoading(true);
        try {
          const log = await getDailyLog(user.uid);
          setStats(log);
        } catch (err) {
          console.error("Error fetching stats:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchStats();
  }, [user?.uid]);

  const caloriesIn = stats?.caloriesConsumed || 0;
  const caloriesOut = stats?.caloriesBurned || 0;
  const netCals = caloriesIn - caloriesOut;
  const water = stats?.water || 0;

  if (loading) return (
    <div className="dashboard-container container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.1em' }}
      >
        LOADING YOUR STATS...
      </motion.div>
    </div>
  );

  return (
    <div className="dashboard-container container">
      {/* Hero Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="dashboard-header animate-fade-in"
      >
        <div className="user-greeting">
          <p className="text-secondary" style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-emerald)', marginBottom: '0.25rem' }}>
            Good day 👋
          </p>
          <h1>Hello, {user?.displayName?.split(' ')[0] || 'Student'}!</h1>
          <p className="text-secondary" style={{ marginTop: '0.25rem' }}>
            Ready to smash your <span className="glow-emerald">{user?.profile?.goal || 'Fitness'}</span> goals today?
          </p>
        </div>
        <div className="header-actions">
          <Link to="/meals" className="action-btn primary">
            <Utensils size={16} /> Log Meal
          </Link>
          <Link to="/workouts" className="action-btn primary" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 20px var(--gold-glow)' }}>
            <Dumbbell size={16} /> Workout
          </Link>
        </div>
      </motion.header>

      {/* Stats Grid with radial rings */}
      <motion.section
        className="stats-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <StatCard
          icon={Flame} label="Calories In" value={caloriesIn} unit="kcal"
          colorHex="#10b981" max={calGoal}
        />
        <StatCard
          icon={Zap} label="Calories Burned" value={caloriesOut} unit="kcal"
          colorHex="#f59e0b" max={burnGoal}
        />
        <StatCard
          icon={Droplet} label="Water" value={water} unit="L"
          colorHex="#3b82f6" max={3}
        />
        <StatCard
          icon={Activity} label="Net Calories" value={Math.abs(netCals)} unit={netCals >= 0 ? 'surplus' : 'deficit'}
          colorHex="#8b5cf6" max={calGoal}
        />
      </motion.section>

      {/* Main grid */}
      <div className="dashboard-main-grid">
        <div className="main-left">
          {/* Calorie Progress Banner */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="glass-card chart-container"
          >
            <div className="chart-header">
              <h3>Today's Calorie Balance</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1rem 0' }}>
              <RadialRing value={caloriesIn} max={calGoal} color="#10b981" size={100} />
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Consumed</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>{caloriesIn} / {calGoal} kcal</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(caloriesIn / calGoal * 100, 100)}%` }}
                      transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      style={{ height: '100%', background: 'var(--accent-emerald)', borderRadius: '3px', boxShadow: '0 0 10px rgba(16,185,129,0.5)' }}
                    />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Burned</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)' }}>{caloriesOut} / {burnGoal} kcal</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(caloriesOut / burnGoal * 100, 100)}%` }}
                      transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      style={{ height: '100%', background: 'var(--accent-gold)', borderRadius: '3px', boxShadow: '0 0 10px rgba(245,158,11,0.5)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick action cards */}
          <div className="quick-actions-grid">
            <Link to="/meals" style={{ textDecoration: 'none' }}>
              <motion.div whileHover={{ y: -5 }} className="glass-card action-card">
                <div style={{ padding: '0.75rem', background: 'rgba(16,185,129,0.1)', borderRadius: '0.875rem', border: '1px solid var(--border-emerald)' }}>
                  <Utensils size={22} color="var(--accent-emerald)" />
                </div>
                <div>
                  <h4>Log Meal</h4>
                  <p className="text-muted">Track nutrition</p>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </motion.div>
            </Link>
            <Link to="/workouts" style={{ textDecoration: 'none' }}>
              <motion.div whileHover={{ y: -5 }} className="glass-card action-card">
                <div style={{ padding: '0.75rem', background: 'rgba(245,158,11,0.1)', borderRadius: '0.875rem', border: '1px solid var(--border-gold)' }}>
                  <Dumbbell size={22} color="var(--accent-gold)" />
                </div>
                <div>
                  <h4>Workout</h4>
                  <p className="text-muted">Crush your session</p>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </motion.div>
            </Link>
          </div>
        </div>

        <div className="main-right">
          {/* Community / Leaderboard preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="glass-card leaderboard-preview"
          >
            <div className="chart-header">
              <h3><Trophy size={16} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--accent-gold)' }} />Campus Rankings</h3>
              <Link to="/leaderboard" style={{ textDecoration: 'none' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>View All →</span>
              </Link>
            </div>
            <div className="leader-list">
              <div className="leader-item" style={{ background: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.2)' }}>
                <span className="leader-rank gold">🥇</span>
                <span className="leader-name">Top Spot</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Log meals to compete!</span>
              </div>
              <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                Log your first meal or workout to appear on the <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>leaderboard</span>.
              </div>
              <Link to="/leaderboard" style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ y: -2 }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    padding: '0.875rem', borderRadius: '0.875rem',
                    background: 'rgba(16,185,129,0.08)', border: '1px solid var(--border-emerald)',
                    color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.9rem'
                  }}
                >
                  <Trophy size={16} /> See Leaderboard
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
