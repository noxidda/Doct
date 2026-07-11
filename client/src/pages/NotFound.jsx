import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-primary)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '8rem', color: 'var(--error)', margin: 0, lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginTop: '1rem', letterSpacing: '0.05em' }}>PAGE OUTSIDE THE GRID</h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '1rem 0 2rem 0', lineHeight: '1.6' }}>
        The requested URL is not configured within the active Wattker workspace coordinates.
      </p>
      <Link to="/dashboard" className="bauhaus-btn bauhaus-btn-primary">
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
