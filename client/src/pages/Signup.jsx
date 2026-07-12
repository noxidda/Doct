import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSignUp } from '@clerk/clerk-react';
import { Eye, EyeOff } from 'lucide-react';
import doctBg from '../assets/doct.jpg';

const Signup = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Info, 2: Verification
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Start registration attempt with Clerk
      await signUp.create({
        emailAddress: email,
        password: password,
      });

      // Send verification code email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setStep(2);
    } catch (err) {
      console.error(err);
      setError(err.errors?.[0]?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    if (!otp) {
      setError('Please enter verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Verify email verification code
      const result = await signUp.attemptEmailAddressVerification({
        code: otp,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate('/dashboard');
      } else {
        setError(`Unexpected registration state: ${result.status}`);
      }
    } catch (err) {
      console.error(err);
      setError(err.errors?.[0]?.message || 'Verification failed. Please check the code sent to your email.');
    } finally {
      setLoading(false);
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
      <div className="signup-bg-side" />
      
      {/* Right Column contains the centered signup card */}
      <div className="login-split-card-side" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
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
          <h2 style={{ fontSize: '2.00rem', marginBottom: '0.5rem', letterSpacing: '-0.02em', color: '#000000', fontWeight: 'bold' }}>SIGN UP FOR DOCT</h2>
          <p style={{ color: '#666666', fontSize: '13px', marginBottom: '2rem', lineHeight: '1.5' }}>
            {step === 1 ? 'Start your collaborative modern workspace account.' : 'Verify your email code to finalize setup.'}
          </p>

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
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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

                <div>
                  <label className="bauhaus-label" style={{ color: '#000000', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="bauhaus-input" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        backgroundColor: 'transparent',
                        color: '#000000',
                        border: 'none',
                        borderBottom: '2px solid #E5E5E5',
                        padding: '0.75rem 2rem 0.75rem 0',
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
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: 0,
                        background: 'none',
                        border: 'none',
                        color: '#666666',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
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
                  {loading ? 'Creating...' : 'Sign Up'}
                </button>
              </form>
              <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '13px', color: '#666666' }}>
                Already registered? <Link to="/login" style={{ fontWeight: 'bold', color: '#000000', textDecoration: 'underline' }}>Sign In</Link>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label className="bauhaus-label" style={{ color: '#000000', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>Verification Code</label>
                  <input 
                    type="text" 
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
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
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
                  {loading ? 'Verifying...' : 'Verify & Sign Up'}
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
                  Back to Registration
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
