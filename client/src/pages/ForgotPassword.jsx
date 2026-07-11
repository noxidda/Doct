import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import doctBg from '../assets/doct.jpg';

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
    <div className="login-split-container" style={{
      backgroundImage: `url(${doctBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr', // Split screen layout
      alignItems: 'stretch',
      padding: 0
    }}>
      {/* Left Column is empty to reveal the background image */}
      <div className="login-bg-side" />
      
      {/* Right Column contains the centered forgot password card */}
      <div className="login-split-card-side" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent', // Transparent, so bg image is clear and fully visible
        backdropFilter: 'none', // No blur effect
        padding: '2rem'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '380px',
          backgroundColor: '#FFFFFF', // Solid white background
          border: '1px solid #000000', // Black border
          padding: '2.5rem',
          borderRadius: '4px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', letterSpacing: '-0.02em', color: '#000000', fontWeight: 'bold' }}>RESET PASSWORD</h2>

          {message && (
            <div style={{
              border: '2px solid #000000',
              color: '#000000',
              backgroundColor: '#FFFFFF',
              padding: '0.75rem',
              marginBottom: '1.5rem',
              fontSize: '12px',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              letterSpacing: '0.05em'
            }}>
              {message}
            </div>
          )}

          {error && (
            <div style={{
              border: '2px solid #000000',
              color: '#000000',
              backgroundColor: '#FFFFFF',
              padding: '0.75rem',
              marginBottom: '1.5rem',
              fontSize: '12px',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              letterSpacing: '0.05em'
            }}>
              {error}
            </div>
          )}

          {step === 1 ? (
            <>
              <p style={{ color: '#666666', fontSize: '13px', marginBottom: '2rem', lineHeight: '1.5' }}>
                We will send you a 6-digit OTP to reset your credentials.
              </p>
              <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label className="bauhaus-label" style={{ color: '#000000', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                  <input 
                    type="email" 
                    className="bauhaus-input" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    style={{
                      backgroundColor: 'transparent',
                      color: '#000000',
                      border: 'none',
                      borderBottom: '2px solid #E5E5E5',
                      padding: '0.75rem 0',
                      fontSize: '14px',
                      width: '100%',
                      outline: 'none',
                      borderRadius: 0,
                      transition: 'border-color 200ms ease'
                    }}
                    onFocus={(e) => e.target.style.borderBottomColor = '#000000'}
                    onBlur={(e) => e.target.style.borderBottomColor = '#E5E5E5'}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  style={{ 
                    width: '100%', 
                    marginTop: '1rem',
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    border: '1px solid #000000',
                    borderRadius: '4px',
                    padding: '0.75rem 1.5rem',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    transition: 'background-color 200ms ease, color 200ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.color = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#000000';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                >
                  Request OTP
                </button>
                <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '13px', color: '#666666' }}>
                  Remembered it? <Link to="/login" style={{ fontWeight: 'bold', color: '#000000', textDecoration: 'underline' }}>Back to Login</Link>
                </div>
              </form>
            </>
          ) : (
            <>
              <p style={{ color: '#000000', fontSize: '13px', marginBottom: '1.5rem', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em' }}>
                Enter the OTP sent to {email}.
              </p>
              <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label className="bauhaus-label" style={{ color: '#000000', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OTP Code</label>
                  <input 
                    type="text" 
                    maxLength="6"
                    className="bauhaus-input" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    style={{
                      letterSpacing: '0.5em',
                      textAlign: 'center',
                      fontSize: '20px',
                      backgroundColor: 'transparent',
                      color: '#000000',
                      border: 'none',
                      borderBottom: '2px solid #E5E5E5',
                      padding: '0.75rem 0',
                      width: '100%',
                      outline: 'none',
                      borderRadius: 0,
                      transition: 'border-color 200ms ease'
                    }}
                    onFocus={(e) => e.target.style.borderBottomColor = '#000000'}
                    onBlur={(e) => e.target.style.borderBottomColor = '#E5E5E5'}
                  />
                </div>
                <div>
                  <label className="bauhaus-label" style={{ color: '#000000', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Password</label>
                  <input 
                    type="password" 
                    className="bauhaus-input" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      backgroundColor: 'transparent',
                      color: '#000000',
                      border: 'none',
                      borderBottom: '2px solid #E5E5E5',
                      padding: '0.75rem 0',
                      fontSize: '14px',
                      width: '100%',
                      outline: 'none',
                      borderRadius: 0,
                      transition: 'border-color 200ms ease'
                    }}
                    onFocus={(e) => e.target.style.borderBottomColor = '#000000'}
                    onBlur={(e) => e.target.style.borderBottomColor = '#E5E5E5'}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  style={{ 
                    width: '100%', 
                    backgroundColor: '#000000',
                    color: '#FFFFFF',
                    border: '1px solid #000000',
                    borderRadius: '4px',
                    padding: '0.75rem 1.5rem',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    transition: 'background-color 200ms ease, color 200ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.color = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#000000';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                >
                  Update Password
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  style={{ 
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    border: '1px solid #E5E5E5',
                    borderRadius: '4px',
                    padding: '0.75rem 1.5rem',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    transition: 'border-color 200ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E5E5E5';
                  }}
                >
                  Back
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
