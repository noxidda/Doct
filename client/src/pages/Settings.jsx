import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Save, Shield, HardDrive, Bell, Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const { currentWorkspace, editWorkspace, createWorkspace } = useApp();

  const [activeTab, setActiveTab] = useState('general');
  
  // Workspace states
  const [wsName, setWsName] = useState(currentWorkspace?.name || '');
  const [wsDesc, setWsDesc] = useState(currentWorkspace?.description || '');

  // Workspace creator states
  const [newWsName, setNewWsName] = useState('');
  const [newWsDesc, setNewWsDesc] = useState('');

  // Preferences
  const [notifMode, setNotifMode] = useState('all');
  const [mfaEnabled, setMfaEnabled] = useState(false);

  React.useEffect(() => {
    if (currentWorkspace) {
      setWsName(currentWorkspace.name);
      setWsDesc(currentWorkspace.description);
    }
  }, [currentWorkspace]);

  const handleUpdateWorkspace = (e) => {
    e.preventDefault();
    if (!currentWorkspace) return;
    editWorkspace(currentWorkspace.id, { name: wsName, description: wsDesc });
    alert('Workspace preferences saved successfully!');
  };

  const handleCreateWorkspace = (e) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    createWorkspace(newWsName, newWsDesc);
    setNewWsName('');
    setNewWsDesc('');
    alert('New workspace established!');
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontSize: '2rem' }}>WORKSPACE SETTINGS</h2>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        
        {/* Left Side Tab Navigation */}
        <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
          <button 
            className="bauhaus-btn btn-press" 
            style={{ 
              justifyContent: 'flex-start',
              border: activeTab === 'general' ? '2px solid var(--text-primary)' : '2px solid transparent',
              backgroundColor: activeTab === 'general' ? 'var(--hover)' : 'transparent'
            }}
            onClick={() => setActiveTab('general')}
          >
            <SettingsIcon size={16} />
            <span>General</span>
          </button>
          
          <button 
            className="bauhaus-btn btn-press" 
            style={{ 
              justifyContent: 'flex-start',
              border: activeTab === 'notifications' ? '2px solid var(--text-primary)' : '2px solid transparent',
              backgroundColor: activeTab === 'notifications' ? 'var(--hover)' : 'transparent'
            }}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={16} />
            <span>Notifications</span>
          </button>

          <button 
            className="bauhaus-btn btn-press" 
            style={{ 
              justifyContent: 'flex-start',
              border: activeTab === 'security' ? '2px solid var(--text-primary)' : '2px solid transparent',
              backgroundColor: activeTab === 'security' ? 'var(--hover)' : 'transparent'
            }}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={16} />
            <span>Security</span>
          </button>

          <button 
            className="bauhaus-btn btn-press" 
            style={{ 
              justifyContent: 'flex-start',
              border: activeTab === 'storage' ? '2px solid var(--text-primary)' : '2px solid transparent',
              backgroundColor: activeTab === 'storage' ? 'var(--hover)' : 'transparent'
            }}
            onClick={() => setActiveTab('storage')}
          >
            <HardDrive size={16} />
            <span>Storage Register</span>
          </button>
        </div>

        {/* Right Side Tab panels */}
        <div style={{ flex: 1 }}>
          
          {/* General Workspace Settings */}
          {activeTab === 'general' && (
            <div className="bauhaus-card" style={{ margin: 0 }}>
              <h3 style={{ marginBottom: '1.5rem' }}>General Settings</h3>
              
              <form onSubmit={handleUpdateWorkspace} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                <div>
                  <label className="bauhaus-label">Workspace Title</label>
                  <input 
                    type="text" 
                    className="bauhaus-input"
                    value={wsName}
                    onChange={(e) => setWsName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="bauhaus-label">Workspace Description</label>
                  <textarea 
                    className="bauhaus-input"
                    rows="3"
                    value={wsDesc}
                    onChange={(e) => setWsDesc(e.target.value)}
                    style={{ resize: 'none' }}
                  />
                </div>
                <button type="submit" className="bauhaus-btn bauhaus-btn-primary btn-press" style={{ alignSelf: 'flex-start' }}>
                  <Save size={14} />
                  <span>Save General Settings</span>
                </button>
              </form>

              {/* Establish New Workspace */}
              <div style={{ borderTop: '2px solid var(--border)', paddingTop: '2rem' }}>
                <h3 style={{ marginBottom: '1.25rem' }}>Establish New Workspace</h3>
                <form onSubmit={handleCreateWorkspace} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label className="bauhaus-label">New Workspace Name</label>
                    <input 
                      type="text" 
                      className="bauhaus-input"
                      placeholder="e.g. Doct Marketing"
                      value={newWsName}
                      onChange={(e) => setNewWsName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="bauhaus-label">New Workspace Description</label>
                    <textarea 
                      className="bauhaus-input"
                      rows="2"
                      placeholder="Detail workspace bounds..."
                      value={newWsDesc}
                      onChange={(e) => setNewWsDesc(e.target.value)}
                      style={{ resize: 'none' }}
                    />
                  </div>
                  <button type="submit" className="bauhaus-btn btn-press" style={{ alignSelf: 'flex-start' }}>
                    Create Workspace
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="bauhaus-card" style={{ margin: 0 }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Notification Preferences</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label className="bauhaus-label">Transmission Level</label>
                  <select 
                    className="bauhaus-select"
                    value={notifMode}
                    onChange={(e) => setNotifMode(e.target.value)}
                  >
                    <option value="all">All transmissions (Assignments, Comments, Pages)</option>
                    <option value="mentions">Mentions and Assignments Only</option>
                    <option value="none">Disable all notifications</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input type="checkbox" defaultChecked id="cb_email" style={{ accentColor: 'var(--text-primary)', width: '16px', height: '16px' }} />
                    <label htmlFor="cb_email" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Send Email OTP Digests</label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input type="checkbox" defaultChecked id="cb_digest" style={{ accentColor: 'var(--text-primary)', width: '16px', height: '16px' }} />
                    <label htmlFor="cb_digest" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Weekly Workspace summaries</label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Panel */}
          {activeTab === 'security' && (
            <div className="bauhaus-card" style={{ margin: 0 }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Security Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Multi-Factor Authentication (MFA)</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Secure login verification via secondary OTP validation.</div>
                  </div>
                  <button 
                    onClick={() => {
                      setMfaEnabled(!mfaEnabled);
                      alert(`MFA is now ${!mfaEnabled ? 'Enabled' : 'Disabled'}`);
                    }}
                    className="bauhaus-btn btn-press" 
                    style={{ borderColor: mfaEnabled ? 'var(--success)' : 'var(--border)', color: mfaEnabled ? 'var(--success)' : 'var(--text-primary)' }}
                  >
                    {mfaEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                <div>
                  <h4 style={{ marginBottom: '1rem', fontSize: '12px' }}>Credentials Reset</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input type="password" placeholder="Current Password" className="bauhaus-input" />
                    <input type="password" placeholder="New Password" className="bauhaus-input" />
                    <button type="button" className="bauhaus-btn bauhaus-btn-primary btn-press" style={{ alignSelf: 'flex-start' }} onClick={() => alert('Credentials updated!')}>
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Storage register */}
          {activeTab === 'storage' && (
            <div className="bauhaus-card" style={{ margin: 0 }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Cloudinary Storage Registers</h3>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '13px' }}>
                  <span>Used Space</span>
                  <span style={{ fontWeight: 'bold' }}>148.5 MB / 1024 MB</span>
                </div>
                
                {/* Custom Bauhaus storage bar */}
                <div style={{ height: '16px', backgroundColor: 'var(--bg-primary)', border: '2px solid var(--border)', marginBottom: '1.5rem' }}>
                  <div style={{ height: '100%', width: '14.5%', backgroundColor: 'var(--warning)' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <div>Total Images: <strong>24 files</strong></div>
                  <div>Total PDF Manuals: <strong>12 files</strong></div>
                  <div>Audit Logs space: <strong>4.2 MB</strong></div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Settings;
