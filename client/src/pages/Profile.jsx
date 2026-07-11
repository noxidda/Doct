import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [timezone, setTimezone] = useState(user?.timezone || 'UTC');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const handleUpdate = (e) => {
    e.preventDefault();
    updateProfile({ name, email, bio, timezone, avatar });
    alert('Profile parameters updated!');
  };

  const timezones = [
    'UTC', 'Europe/London', 'Europe/Berlin', 'America/New_York', 
    'America/Los_Angeles', 'Asia/Kolkata', 'Asia/Tokyo'
  ];

  return (
    <div style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontSize: '2rem' }}>PERSONAL PROFILE</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Modify profile parameters, timezone contexts, and bio descriptions.</p>
      </div>

      <form onSubmit={handleUpdate} className="bauhaus-card">
        
        {/* Avatar Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
          <img 
            src={avatar || 'https://via.placeholder.com/150'} 
            alt={name}
            style={{ width: '90px', height: '90px', objectFit: 'cover', border: '3px solid var(--border)' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="bauhaus-label">Profile Image URL</label>
            <input 
              type="text" 
              className="bauhaus-input" 
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="Paste Image URL"
              style={{ width: '320px', height: '36px' }}
            />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Enter an absolute URL to change your profile image avatar.</span>
          </div>
        </div>

        {/* Input Details */}
        <div className="bauhaus-grid-2" style={{ marginBottom: '1.5rem' }}>
          <div>
            <label className="bauhaus-label">Full Operator Name</label>
            <input 
              type="text" 
              className="bauhaus-input" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="bauhaus-label">Email Register</label>
            <input 
              type="email" 
              className="bauhaus-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
        </div>

        <div className="bauhaus-grid-2" style={{ marginBottom: '1.5rem' }}>
          <div>
            <label className="bauhaus-label">Default Timezone</label>
            <select 
              className="bauhaus-select" 
              value={timezone} 
              onChange={(e) => setTimezone(e.target.value)}
            >
              {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>
          <div>
            <label className="bauhaus-label">System Privilege Scope</label>
            <input 
              type="text" 
              className="bauhaus-input" 
              value={user?.role} 
              disabled 
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label className="bauhaus-label">Biography Details</label>
          <textarea 
            className="bauhaus-input" 
            rows="3" 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write details about your operational roles..."
            style={{ resize: 'none' }}
          />
        </div>

        <button type="submit" className="bauhaus-btn bauhaus-btn-primary">
          Save Profile Parameters
        </button>

      </form>
    </div>
  );
};

export default Profile;
