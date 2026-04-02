import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, Send, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../firebase';

const VerifyEmail = () => {
  const { user, logout, resendVerification } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState('');

  const handleResend = async () => {
    setIsResending(true);
    try {
      await resendVerification();
      setMessage("A fresh verification link has been sent to your student email.");
    } catch (err) {
      setMessage("Failed to resend. Please try again in 1 minute.");
    } finally {
      setIsResending(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await auth.currentUser.reload();
      // OnAuthStateChanged in AuthContext will catch this and update the 'user' object
      window.location.reload(); 
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="login-container">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        class="glass-card login-card"
        style={{ padding: '3rem 2.5rem' }}
      >
        <div className="login-logo-ring">
          <Mail size={32} />
        </div>
        
        <div className="login-header">
          <h1 className="glow-emerald">Identify Yourself</h1>
          <p className="text-secondary">We've sent a verification link to:</p>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '12px', border: '1px solid var(--border-emerald)', margin: '1rem 0' }}>
            <span style={{ color: '#fff', fontWeight: 600 }}>{user?.email}</span>
          </div>
          <p style={{ fontSize: '0.85rem' }}>Please check your inbox (and spam folder) and click the link to activate your BU-Track account.</p>
        </div>

        <div className="login-actions" style={{ marginTop: '2rem' }}>
          <button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="login-btn primary-btn"
          >
            {isRefreshing ? <RefreshCw size={18} className="spin" /> : <RefreshCw size={18} />}
            I've Verified My Email
          </button>

          <button 
            onClick={handleResend} 
            disabled={isResending}
            className="login-btn secondary-btn"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--border-subtle)' }}
          >
            {isResending ? <RefreshCw size={18} className="spin" /> : <Send size={18} />}
            Resend Verification Link
          </button>

          <button 
            onClick={logout} 
            className="login-btn"
            style={{ marginTop: '1rem', background: 'transparent', color: '#ef4444', border: 'none', textDecoration: 'underline' }}
          >
            <LogOut size={16} /> Sign Out & Use Different Email
          </button>
        </div>

        {message && (
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="error-text" 
            style={{ marginTop: '1.5rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.08)', borderColor: 'rgba(16, 185, 129, 0.2)' }}
          >
            {message}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
