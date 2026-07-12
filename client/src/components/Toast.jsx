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
      backgroundColor: '#1C1B1F',
      color: '#FFFFFF',
      border: '2px solid #FFFFFF',
      boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.25)',
      padding: '1rem 1.5rem',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      maxWidth: '90%',
      width: '450px',
      animation: 'slideDown 300ms ease-out'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E8DEF8' }}>
        <Mail size={20} />
      </div>
      <div style={{ flex: 1, fontSize: '13px', lineHeight: '1.4', fontWeight: 500, textAlign: 'left' }}>
        <div style={{ textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em', color: '#888888', marginBottom: '2px', fontWeight: 'bold' }}>
          Simulated Mail Server
        </div>
        {message}
      </div>
      <button 
        onClick={onClose} 
        style={{
          background: 'none',
          border: 'none',
          color: '#888888',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          outline: 'none'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#888888'}
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
