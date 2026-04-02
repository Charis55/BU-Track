import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, ArrowRight, Mail, Lock, User, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { loginWithGoogle, loginWithEmail, signUpWithEmail, resetPassword, resendVerification, logout } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userResult = await loginWithGoogle();
      
      // Strict Babcock Student Domain Validation for Google Auth
      if (!userResult.email.trim().toLowerCase().endsWith('@student.babcock.edu.ng')) {
        await logout(); // Forcibly sign them out from Firebase
        setError("Access Denied: Only @student.babcock.edu.ng emails are authorized.");
        return;
      }
      
      if (!userResult.emailVerified) {
        setIsVerificationSent(true);
        return;
      }
      
      navigate('/');
    } catch (err) {
      console.error(err);
      setError("Google Sign-In failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    
    // Strict Babcock Student Domain Validation
    if (!email.trim().toLowerCase().endsWith('@student.babcock.edu.ng')) {
      setError("Access Denied: Only @student.babcock.edu.ng emails are authorized.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isForgotPassword) {
        await resetPassword(email);
        setMessage("Security link sent! Check your inbox.");
        return;
      }

      let result;
      if (isSignUp) {
        result = await signUpWithEmail(email, password);
        setIsVerificationSent(true);
      } else {
        result = await loginWithEmail(email, password);
        if (!result.user.emailVerified) {
          setIsVerificationSent(true);
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError("Account not found. Maybe try signing up first?");
      } else if (err.code === 'auth/wrong-password') {
        setError("Incorrect password. Please try again.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Try logging in.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Please enter a valid email address.");
      } else {
        setError("Authentication failed. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await resendVerification();
      setMessage("Verification email resent!");
    } catch (err) {
      setError("Failed to resend. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerificationSent) {
    return (
      <div className="login-container">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card login-card text-center" style={{ padding: 'max(1.5rem, 3rem)' }}>
          <CheckCircle size={64} className="glow-emerald" style={{ margin: '0 auto 1.5rem' }} />
          <h1 className="glow-emerald" style={{ fontSize: 'clamp(1.5rem, 6vw, 2.5rem)' }}>Verify Email</h1>
          <p className="text-secondary" style={{ marginBottom: '2rem', fontSize: '0.95rem' }}>
            A security link was sent to <strong style={{ color: '#fff' }}>{email}</strong>. 
            Verification is required to access the Semester Cup.
          </p>
          <div className="login-actions" style={{ gap: '1rem' }}>
            <button onClick={handleResend} disabled={isLoading} className="login-btn primary-btn" style={{ width: '100%', minHeight: '52px' }}>
              {isLoading ? 'Sending...' : 'Resend Link'}
            </button>
            <button onClick={() => { setIsVerificationSent(false); logout(); }} className="toggle-btn" style={{ margin: '1rem auto' }}>
              Back to Login
            </button>
          </div>
          {message && <p className="success-text mt-4">{message}</p>}
          {error && <p className="error-text mt-4">{error}</p>}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card login-card"
      >
        <div className="login-header">
          <h1 className="glow-emerald" style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', marginBottom: '0.25rem' }}>BU-Track</h1>
          <p className="text-secondary" style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            {isForgotPassword ? 'Reset your security' : isSignUp ? 'Create your profile' : 'Elite Student Fitness'}
          </p>
        </div>

        <div className="login-actions">
          {!isForgotPassword && (
            <>
              {/* Primary Action: Google */}
              <button 
                onClick={handleGoogleSignIn} 
                disabled={isLoading} 
                className="login-btn google-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
              </button>

              <div className="divider">
                <span className="divider-line" />
                <span className="divider-text">or use email</span>
                <span className="divider-line" />
              </div>
            </>
          )}

          <form onSubmit={handleAuthSubmit} className="login-form">
            <div className="input-group">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                placeholder="Student Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={{ fontSize: '16px' }}
              />
            </div>

            {!isForgotPassword && (
              <div className="input-group">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  style={{ fontSize: '16px' }}
                />
              </div>
            )}

            {error && <p className="error-text animate-fade-in">{error}</p>}
            {message && <p className="success-text animate-fade-in" style={{ color: 'var(--accent-emerald)', fontSize: '0.9rem', textAlign: 'center' }}>{message}</p>}

            <button type="submit" disabled={isLoading} className="login-btn primary-btn">
              {isLoading ? (
                <span className="loader">Please wait...</span>
              ) : (
                <>
                  {isForgotPassword ? 'Send Reset Link' : isSignUp ? 'Start Your Journey' : 'Access Analytics'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {!isForgotPassword && !isSignUp && (
            <button className="toggle-btn" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }} onClick={() => setIsForgotPassword(true)}>
              Forgot Password?
            </button>
          )}
        </div>

        <div className="login-footer">
          <p>
            {isForgotPassword ? 'Wait, I remember!' : isSignUp ? 'Already a member?' : "Don't have an account yet?"} 
            <button className="toggle-btn" onClick={() => { 
                if (isForgotPassword) setIsForgotPassword(false);
                else setIsSignUp(!isSignUp); 
                setError(null); 
                setMessage(null);
              }}>
              {isForgotPassword ? 'Back to Login' : isSignUp ? 'Log In' : 'Sign Up Free'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
