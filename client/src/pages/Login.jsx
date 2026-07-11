import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Failed to sign in. Please check configurations.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (emailAddr) => {
    setLoading(true);
    try {
      const res = await login(emailAddr, 'password');
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-primary)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="bauhaus-card" style={{ width: '100%', maxWidth: '440px' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>LOGIN TO DOCT</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '1.5rem' }}>Enter credentials to access your workspaces.</p>

        {error && (
          <div style={{
            border: '2px solid var(--error)',
            color: 'var(--error)',
            padding: '0.75rem',
            marginBottom: '1.5rem',
            fontSize: '13px',
            textTransform: 'uppercase',
            fontWeight: 'bold'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="bauhaus-label">Email Address</label>
            <input 
              type="email" 
              className="bauhaus-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@domain.com"
              required
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="bauhaus-label">Password</label>
              <Link to="/forgot-password" style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--warning)', marginBottom: '0.5rem' }}>Forgot password?</Link>
            </div>
            <input 
              type="password" 
              className="bauhaus-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="bauhaus-btn bauhaus-btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '13px' }}>
          Don't have an account? <Link to="/signup" style={{ fontWeight: 'bold' }}>Sign Up</Link>
        </div>

        {/* Quick Demo Accounts widget */}
        <div style={{
          marginTop: '2rem',
          borderTop: '1px solid var(--border)',
          paddingTop: '1.5rem'
        }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--warning)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '1rem' }}>
            EVALUATOR QUICK ACCESS (DEMO ACCOUNTS)
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button 
              onClick={() => handleQuickLogin('owner@doct.com')}
              className="bauhaus-btn" 
              style={{ fontSize: '12px', padding: '0.5rem', justifyContent: 'flex-start' }}
            >
              <span>Arthur (Owner)</span>
            </button>
            <button 
              onClick={() => handleQuickLogin('admin@doct.com')}
              className="bauhaus-btn" 
              style={{ fontSize: '12px', padding: '0.5rem', justifyContent: 'flex-start' }}
            >
              <span>Gropius (Admin)</span>
            </button>
            <button 
              onClick={() => handleQuickLogin('manager@doct.com')}
              className="bauhaus-btn" 
              style={{ fontSize: '12px', padding: '0.5rem', justifyContent: 'flex-start' }}
            >
              <span>Mies (Manager)</span>
            </button>
            <button 
              onClick={() => handleQuickLogin('member@doct.com')}
              className="bauhaus-btn" 
              style={{ fontSize: '12px', padding: '0.5rem', justifyContent: 'flex-start' }}
            >
              <span>Anni (Member)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
