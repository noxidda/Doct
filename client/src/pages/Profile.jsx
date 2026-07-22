import React, { useState, useRef } from 'react';
import { useAuth, DEFAULT_AVATAR } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [timezone, setTimezone] = useState(user?.timezone || 'UTC');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Cropper states
  const [cropperOpen, setCropperOpen] = useState(false);
  const [srcImage, setSrcImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSrcImage(reader.result);
        setZoom(1);
        setOffset({ x: 0, y: 0 });
        setCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const applyCrop = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.src = srcImage;
    img.onload = () => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 300, 300);
      const drawWidth = 300 * zoom;
      const drawHeight = drawWidth * (img.height / img.width);
      ctx.drawImage(img, offset.x, offset.y, drawWidth, drawHeight);
      
      const dataUrl = canvas.toDataURL('image/jpeg');
      setAvatar(dataUrl);
      setCropperOpen(false);
      setSrcImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
  };

  const cancelCrop = () => {
    setCropperOpen(false);
    setSrcImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    let currentAvatarUrl = avatar;
    if (avatar && avatar.startsWith('data:image/')) {
      try {
        const response = await api.post('/upload', { fileStr: avatar });
        currentAvatarUrl = response.data.url;
        setAvatar(currentAvatarUrl);
      } catch (err) {
        console.error('Failed to upload profile picture to Cloudinary:', err);
        alert('Profile image upload failed: ' + (err.response?.data?.message || err.message));
        return;
      }
    }
    updateProfile({ name, email, bio, timezone, avatar: currentAvatarUrl });
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
      </div>

      <form onSubmit={handleUpdate} className="bauhaus-card">
        
        {/* Avatar Section with local upload & square crop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
          <img 
            src={avatar || DEFAULT_AVATAR} 
            alt={name}
            style={{ width: '90px', height: '90px', objectFit: 'cover', border: '3px solid var(--border)' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label className="bauhaus-label" style={{ margin: 0 }}>Profile Image</label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                style={{
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  padding: '0.5rem 1rem',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'background-color 200ms ease, color 200ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#333333';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#000000';
                }}
              >
                Upload Photo
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <input 
                type="text" 
                className="bauhaus-input" 
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="Or paste image URL"
                style={{ width: '240px', height: '36px' }}
              />
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Upload a local image (crop to square) or paste an absolute URL.</span>
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

        <button type="submit" className="bauhaus-btn bauhaus-btn-primary btn-press">
          Save Profile Parameters
        </button>

      </form>

      {/* Cropper Modal - Blocks page closing profile picture configuration until Save or Cancel */}
      {cropperOpen && srcImage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #000000',
            padding: '2rem',
            borderRadius: '4px',
            width: '100%',
            maxWidth: '360px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#000000' }}>Crop Profile Image</h3>
            
            {/* Crop Viewport Box */}
            <div 
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              style={{
                width: '300px',
                height: '300px',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#F3F4F6',
                border: '2px solid #000000',
                cursor: 'move',
                userSelect: 'none'
              }}
            >
              <img
                src={srcImage}
                alt="To Crop"
                draggable="false"
                style={{
                  position: 'absolute',
                  left: `${offset.x}px`,
                  top: `${offset.y}px`,
                  width: `${300 * zoom}px`,
                  height: 'auto',
                  pointerEvents: 'none',
                  maxWidth: 'none'
                }}
              />
              {/* Square Guide Border */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                border: '2px solid #000000',
                pointerEvents: 'none',
                boxSizing: 'border-box'
              }} />
            </div>

            {/* Zoom Slider */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                <span>Zoom Scale</span>
                <span>{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="0.01"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#000000',
                  cursor: 'pointer'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              <button
                type="button"
                onClick={cancelCrop}
                style={{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  border: '1px solid #E5E5E5',
                  borderRadius: '4px',
                  padding: '0.6rem',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyCrop}
                style={{
                  flex: 1,
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  border: '1px solid #000000',
                  borderRadius: '4px',
                  padding: '0.6rem',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                Set Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
