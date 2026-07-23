import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSignIn } from '@clerk/clerk-react';
import { Eye, EyeOff, ShieldCheck, Mail, ArrowLeft } from 'lucide-react';
import doctBg from '../assets/doct.jpg';
import logoBlack from '../assets/logo-black.png';

const Login = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const navigate = useNavigate();
  
  // Step 1: Credentials ('credentials'), Step 2: 2FA ('2fa')
  const [step, setStep] = useState('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [secondFactorStrategy, setSecondFactorStrategy] = useState('email_code');
  
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    setInfoMessage('');

    try {
      // Create a sign-in attempt with Clerk
      const result = await signIn.create({
        identifier: email,
        password: password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate('/dashboard');
      } else if (result.status === "needs_second_factor") {
        // Handle 2FA requirement: prepare email_code factor
        const emailFactor = result.supportedSecondFactors?.find(f => f.strategy === 'email_code');
        if (emailFactor) {
          await signIn.prepareSecondFactor({
            strategy: 'email_code',
            emailAddressId: emailFactor.emailAddressId
          });
          setSecondFactorStrategy('email_code');
        } else if (result.supportedSecondFactors?.[0]) {
          const factor = result.supportedSecondFactors[0];
          await signIn.prepareSecondFactor({ strategy: factor.strategy });
          setSecondFactorStrategy(factor.strategy);
        }
        setStep('2fa');
        setInfoMessage(`A 2-Factor Authentication code has been sent to ${email}`);
      } else if (result.status === "needs_first_factor") {
        const emailFactor = result.supportedFirstFactors?.find(f => f.strategy === 'email_code');
        if (emailFactor) {
          await signIn.prepareFirstFactor({ strategy: 'email_code' });
          setSecondFactorStrategy('email_code');
          setStep('2fa');
          setInfoMessage(`A verification code has been sent to ${email}`);
        } else {
          setError(`Additional verification required: ${result.status}`);
        }
      } else {
        setError(`Unexpected authentication state: ${result.status}`);
      }
    } catch (err) {
      console.error(err);
      setError(err.errors?.[0]?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    if (!twoFactorCode) {
      setError('Please enter your 2FA verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let result;
      if (signIn.status === 'needs_second_factor') {
        result = await signIn.attemptSecondFactor({
          strategy: secondFactorStrategy,
          code: twoFactorCode,
        });
      } else if (signIn.status === 'needs_first_factor') {
        result = await signIn.attemptFirstFactor({
          strategy: secondFactorStrategy,
          code: twoFactorCode,
        });
      } else {
        result = await signIn.attemptSecondFactor({
          strategy: 'email_code',
          code: twoFactorCode,
        });
      }

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate('/dashboard');
      } else {
        setError(`Verification result: ${result.status}`);
      }
    } catch (err) {
      console.error(err);
      setError(err.errors?.[0]?.message || 'Invalid 2FA code. Please check your email and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend2FACode = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError('');
    try {
      if (signIn.status === 'needs_second_factor') {
        await signIn.prepareSecondFactor({ strategy: secondFactorStrategy });
      } else if (signIn.status === 'needs_first_factor') {
        await signIn.prepareFirstFactor({ strategy: secondFactorStrategy });
      }
      setInfoMessage(`A new 2FA code was sent to ${email}`);
    } catch (err) {
      console.error(err);
      setError(err.errors?.[0]?.message || 'Failed to resend 2FA code.');
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
      {/* Left Column is empty to reveal background image */}
      <div className="login-bg-side" />
      
      {/* Right Column contains the centered login card */}
      <div className="login-split-card-side" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        padding: '2rem'
      }}>
        {/* Black & White Card */}
        <div style={{ 
          width: '100%', 
          maxWidth: '380px',
          backgroundColor: '#FFFFFF',
          border: '3px solid #000000',
          boxShadow: '8px 8px 0px 0px #000000',
          padding: '2.5rem',
          borderRadius: '0px'
        }}>
          {/* Logo Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '2px solid #000000'
          }}>
            <img src={logoBlack} alt="Doct Logo" style={{ height: '32px', width: 'auto', display: 'block' }} />
            <span style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '-0.02em', color: '#000000' }}>DOCT</span>
          </div>

          <h2 style={{ fontSize: '1.65rem', marginBottom: '0.5rem', letterSpacing: '-0.02em', color: '#000000', fontWeight: '900', textTransform: 'uppercase' }}>
            {step === 'credentials' ? 'LOGIN TO DOCT' : '2FA VERIFICATION'}
          </h2>
          <p style={{ color: '#444444', fontSize: '13px', marginBottom: '1.75rem', lineHeight: '1.5', fontWeight: '500' }}>
            {step === 'credentials' 
              ? 'Enter your email and password to access your workspace.' 
              : `Enter the 2-factor authentication code sent to ${email}.`}
          </p>

          {infoMessage && (
            <div style={{
              border: '2px solid #000000',
              color: '#000000',
              backgroundColor: '#F5F5F5',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              fontSize: '12px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Mail size={16} />
              <span>{infoMessage}</span>
            </div>
          )}

          {error && (
            <div style={{
              border: '2px solid #000000',
              color: '#000000',
              backgroundColor: '#FFFFFF',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              fontSize: '12px',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              letterSpacing: '0.05em'
            }}>
              {error}
            </div>
          )}

          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', color: '#000000', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Email Address
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    border: '2px solid #000000',
                    padding: '0.85rem 1rem',
                    fontSize: '14px',
                    width: '100%',
                    outline: 'none',
                    borderRadius: 0,
                    boxSizing: 'border-box',
                    transition: 'box-shadow 150ms ease'
                  }}
                  onFocus={(e) => e.target.style.boxShadow = '3px 3px 0px 0px #000000'}
                  onBlur={(e) => e.target.style.boxShadow = 'none'}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#000000', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#000000',
                      border: '2px solid #000000',
                      padding: '0.85rem 2.75rem 0.85rem 1rem',
                      fontSize: '14px',
                      width: '100%',
                      outline: 'none',
                      borderRadius: 0,
                      boxSizing: 'border-box',
                      transition: 'box-shadow 150ms ease'
                    }}
                    onFocus={(e) => e.target.style.boxShadow = '3px 3px 0px 0px #000000'}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      background: 'none',
                      border: 'none',
                      color: '#000000',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                style={{ 
                  width: '100%', 
                  marginTop: '0.75rem',
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  border: '2px solid #000000',
                  boxShadow: '4px 4px 0px 0px #000000',
                  padding: '0.85rem 1.5rem',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'all 150ms ease-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#222222';
                  e.currentTarget.style.transform = 'translate(2px, 2px)';
                  e.currentTarget.style.boxShadow = '2px 2px 0px 0px #000000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#000000';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '4px 4px 0px 0px #000000';
                }}
              >
                {loading ? 'Logging In...' : 'Log In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handle2FASubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ color: '#000000', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <ShieldCheck size={16} />
                  2FA Verification Code
                </label>
                <input 
                  type="text" 
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="123456"
                  style={{
                    letterSpacing: '0.5em',
                    textAlign: 'center',
                    fontSize: '20px',
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    border: '2px solid #000000',
                    padding: '0.85rem 1rem',
                    width: '100%',
                    outline: 'none',
                    borderRadius: 0,
                    boxSizing: 'border-box',
                    transition: 'box-shadow 150ms ease'
                  }}
                  onFocus={(e) => e.target.style.boxShadow = '3px 3px 0px 0px #000000'}
                  onBlur={(e) => e.target.style.boxShadow = 'none'}
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  width: '100%', 
                  marginTop: '0.5rem',
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  border: '2px solid #000000',
                  boxShadow: '4px 4px 0px 0px #000000',
                  padding: '0.85rem 1.5rem',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'all 150ms ease-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#222222';
                  e.currentTarget.style.transform = 'translate(2px, 2px)';
                  e.currentTarget.style.boxShadow = '2px 2px 0px 0px #000000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#000000';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '4px 4px 0px 0px #000000';
                }}
              >
                {loading ? 'Verifying 2FA...' : 'Verify 2FA & Log In'}
              </button>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  type="button" 
                  onClick={handleResend2FACode} 
                  disabled={loading}
                  style={{ 
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    border: '2px solid #000000',
                    padding: '0.75rem 1rem',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    transition: 'background-color 150ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F0F0F0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  Resend Code
                </button>

                <button 
                  type="button" 
                  onClick={() => { setStep('credentials'); setError(''); setInfoMessage(''); }} 
                  disabled={loading}
                  style={{ 
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    border: '2px solid #000000',
                    padding: '0.75rem 1rem',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem',
                    transition: 'background-color 150ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F0F0F0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
              </div>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '13px', color: '#444444', fontWeight: '500' }}>
            New to Doct? <Link to="/signup" style={{ fontWeight: 'bold', color: '#000000', textDecoration: 'underline' }}>Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
