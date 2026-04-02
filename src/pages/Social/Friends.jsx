import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, Users, Activity, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_FRIENDS = [
  { id: 1, name: 'Tunde Afolabi', streak: 12, status: 'Ran 5km today' },
  { id: 2, name: 'Sarah Joy', streak: 5, status: 'Logged Lunch' },
];

const Friends = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  
  return (
    <div className="container animate-fade-in">
      <header className="page-header">
        <button className="back-btn" onClick={() => navigate('/')}><ChevronLeft size={20} /> Back</button>
        <h1 className="glow-emerald">Friends</h1>
        <div style={{ width: '40px' }} />
      </header>

      <div className="search-bar-wrapper" style={{ margin: '1rem 0' }}>
        <Search size={20} className="search-icon" color="#94a3b8" />
        <input 
          type="text" 
          placeholder="Search global usernames..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="directory-search-input"
          style={{ width: '100%' }}
        />
      </div>

      <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: '#f1f5f9' }}>Your Campus Crew</h3>
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        {MOCK_FRIENDS.map(friend => (
          <div key={friend.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={20} color="white"/>
              </div>
              <div>
                <h4 style={{ margin: 0, color: '#f1f5f9' }}>{friend.name}</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Activity size={12}/> {friend.status}
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f59e0b' }}>{friend.streak}🔥</div>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Day Streak</span>
            </div>
          </div>
        ))}

        <button className="log-btn primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <UserPlus size={18} /> Add New Friend
        </button>
      </div>
    </div>
  );
};

export default Friends;
