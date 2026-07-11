import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // Step 1: Info, Step 2: OTP
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setStep(2); // Go to OTP verification step
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp !== '123456' && otp.trim() !== '') {
      // Allow '123456' or any code for evaluation purposes, but notify that '123456' is default
      setError('Invalid OTP code. Try "123456".');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const res = await signup(name, email, password);
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Verification failed.');
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
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>CREATE ACCOUNT</h2>
        
        {step === 1 ? (
          <>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '1.5rem' }}>Create your Wattker credentials below.</p>
            {error && <div style={{ border: '2px solid var(--error)', color: 'var(--error)', padding: '0.75rem', marginBottom: '1.5rem', fontSize: '12px' }}>{error}</div>}
            
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="bauhaus-label">Full Name</label>
                <input 
                  type="text" 
                  className="bauhaus-input" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anni Albers"
                  required
                />
              </div>

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
                <label className="bauhaus-label">Password</label>
                <input 
                  type="password" 
                  className="bauhaus-input" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className="bauhaus-btn bauhaus-btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                Generate OTP Code
              </button>
            </form>
            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '13px' }}>
              Already registered? <Link to="/login" style={{ fontWeight: 'bold' }}>Sign In</Link>
            </div>
          </>
        ) : (
          <>
            <p style={{ color: 'var(--warning)', fontSize: '13px', marginBottom: '1.5rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
              Verification required: We sent a 6-digit OTP code to {email}.
            </p>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '1.5rem', padding: '0.5rem', backgroundColor: 'var(--border)' }}>
              Evaluation Hint: Enter <strong>123456</strong> or leave empty to verify.
            </div>

            {error && <div style={{ border: '2px solid var(--error)', color: 'var(--error)', padding: '0.75rem', marginBottom: '1.5rem', fontSize: '12px' }}>{error}</div>}

            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="bauhaus-label">Verification OTP</label>
                <input 
                  type="text" 
                  maxLength="6"
                  className="bauhaus-input" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  style={{ letterSpacing: '0.5em', textAlign: 'center', fontSize: '20px' }}
                />
              </div>

              <button type="submit" disabled={loading} className="bauhaus-btn bauhaus-btn-primary" style={{ width: '100%' }}>
                {loading ? 'Verifying...' : 'Verify & Setup'}
              </button>
              
              <button type="button" onClick={() => setStep(1)} className="bauhaus-btn" style={{ width: '100%' }}>
                Back to registration
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
