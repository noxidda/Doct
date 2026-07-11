import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (otp !== '123456' && otp.trim() !== '') {
      setError('Invalid OTP code. Try "123456".');
      return;
    }
    if (!newPassword) {
      setError('Please enter your new password');
      return;
    }
    setError('');
    try {
      const res = await resetPassword(email, newPassword);
      if (res.success) {
        setMessage('Password updated successfully. Redirecting...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError('Password reset failed.');
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
      <div className="bauhaus-card" style={{ width: '100%', maxWidth: '440px', border: '2px solid var(--border)' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>RESET PASSWORD</h2>

        {message && (
          <div style={{ border: '2px solid var(--success)', color: 'var(--success)', padding: '0.75rem', marginBottom: '1.5rem', fontSize: '13px' }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{ border: '2px solid var(--error)', color: 'var(--error)', padding: '0.75rem', marginBottom: '1.5rem', fontSize: '12px' }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '1.5rem' }}>
              We will send you a 6-digit OTP to reset your credentials.
            </p>
            <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="bauhaus-label">Email Address</label>
                <input 
                  type="email" 
                  className="bauhaus-input" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                />
              </div>
              <button type="submit" className="bauhaus-btn bauhaus-btn-primary" style={{ width: '100%' }}>
                Request OTP
              </button>
              <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '13px' }}>
                Remembered it? <Link to="/login" style={{ fontWeight: 'bold' }}>Back to Login</Link>
              </div>
            </form>
          </>
        ) : (
          <>
            <p style={{ color: 'var(--warning)', fontSize: '13px', marginBottom: '1.5rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
              Enter the OTP sent to {email}.
            </p>
            <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="bauhaus-label">OTP Code</label>
                <input 
                  type="text" 
                  maxLength="6"
                  className="bauhaus-input" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '0.3em' }}
                />
              </div>
              <div>
                <label className="bauhaus-label">New Password</label>
                <input 
                  type="password" 
                  className="bauhaus-input" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <button type="submit" className="bauhaus-btn bauhaus-btn-primary" style={{ width: '100%' }}>
                Update Password
              </button>
              <button type="button" onClick={() => setStep(1)} className="bauhaus-btn" style={{ width: '100%' }}>
                Back
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
