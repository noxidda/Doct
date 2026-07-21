import React, { useEffect } from 'react';
import { Mail, X } from 'lucide-react';

const Toast = ({ message, onClose, duration = 15000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      backgroundColor: 'var(--primary-blue)',
      color: '#FFFFFF',
      border: '3px solid var(--border)',
      boxShadow: 'none',
      padding: '1rem 1.5rem',
      borderRadius: 'var(--radius-xs)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      maxWidth: '90%',
      width: '450px',
      animation: 'slideDown 300ms ease-out'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'center', color: '#FFFFFF' }}>
        <Mail size={20} />
      </div>
      <div style={{ flex: 1, fontSize: '13px', lineHeight: '1.4', fontWeight: 700, textAlign: 'left', fontFamily: 'var(--font-heading)' }}>
        <div style={{ textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '2px', fontWeight: 'bold' }}>
          Simulated Mail Server
        </div>
        {message}
      </div>
      <button 
        onClick={onClose} 
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.8)',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          outline: 'none'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
      >
        <X size={16} />
      </button>
      <style>{`
        @keyframes slideDown {
          from { transform: translate(-50%, -20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Toast;
