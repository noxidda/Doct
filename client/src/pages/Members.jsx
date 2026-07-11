import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Search, UserMinus, ShieldAlert, Activity } from 'lucide-react';

const Members = () => {
  const { user: currentUser } = useAuth();
  const { members, inviteMember, removeMember, changeMemberRole, activityLogs } = useApp();
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInvite = (e) => {
    e.preventDefault();
    if (!email) return;
    inviteMember(email, role);
    setEmail('');
    setShowInviteForm(false);
  };

  // Check permissions: Owner can manage everyone, Admin can manage Manager/Member, Manager/Member cannot manage roles
  const canManageRoles = currentUser?.role === 'Owner' || currentUser?.role === 'Admin';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '2rem' }}>WORKSPACE MEMBERS</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Control user privileges and access parameters.</p>
        </div>
        
        {canManageRoles && (
          <button 
            onClick={() => setShowInviteForm(!showInviteForm)} 
            className="bauhaus-btn bauhaus-btn-primary"
          >
            <UserPlus size={16} />
            <span>Invite Member</span>
          </button>
        )}
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <form onSubmit={handleInvite} className="bauhaus-card" style={{ borderColor: 'var(--text-primary)', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>Send Workspace Invitation</h3>
          <div className="bauhaus-grid-2" style={{ marginBottom: '1.5rem' }}>
            <div>
              <label className="bauhaus-label">Email Address</label>
              <input 
                type="email" 
                className="bauhaus-input"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="bauhaus-label">Assign Privilege Role</label>
              <select 
                className="bauhaus-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Member">Member</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="bauhaus-btn bauhaus-btn-primary">Send Invite</button>
            <button type="button" onClick={() => setShowInviteForm(false)} className="bauhaus-btn">Cancel</button>
          </div>
        </form>
      )}

      {/* Filter search bar */}
      <div style={{ position: 'relative', maxWidth: '360px', marginBottom: '1.5rem' }}>
        <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input 
          type="text" 
          placeholder="Filter members name or email..."
          className="bauhaus-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: '2.5rem', height: '38px' }}
        />
      </div>

      <div className="bauhaus-grid-3" style={{ marginBottom: '2.5rem' }}>
        
        {/* Members Cards */}
        {filteredMembers.map(member => {
          const isSelf = member.id === currentUser?.id;
          
          return (
            <div key={member.id} className="bauhaus-card" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    style={{ width: '48px', height: '48px', objectFit: 'cover', border: '2px solid var(--border)' }}
                  />
                  {/* Online/Offline status indicator */}
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '12px',
                    height: '12px',
                    backgroundColor: member.online ? 'var(--success)' : 'var(--text-secondary)',
                    border: '2px solid var(--card)'
                  }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {member.name} {isSelf && <span style={{ color: 'var(--warning)', fontSize: '12px' }}>(YOU)</span>}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{member.email}</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                
                {/* Role Switcher */}
                <div>
                  <label className="bauhaus-label" style={{ fontSize: '12px', marginBottom: '0.25rem' }}>Access Role</label>
                  {canManageRoles && !isSelf && member.role !== 'Owner' ? (
                    <select
                      className="bauhaus-select"
                      value={member.role}
                      onChange={(e) => changeMemberRole(member.id, e.target.value)}
                      style={{ height: '28px', padding: '0 1.5rem 0 0.5rem', fontSize: '12px', width: '120px' }}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Member">Member</option>
                    </select>
                  ) : (
                    <span className="bauhaus-badge" style={{ fontSize: '12px' }}>{member.role}</span>
                  )}
                </div>

                {/* Remove button */}
                {canManageRoles && !isSelf && member.role !== 'Owner' && (
                  <button 
                    onClick={() => {
                      if (window.confirm(`Revoke workspace access for ${member.name}?`)) {
                        removeMember(member.id);
                      }
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    title="Remove Member"
                  >
                    <UserMinus size={16} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Member Activity logs */}
      <div className="bauhaus-card">
        <div className="bauhaus-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} style={{ color: 'var(--warning)' }} />
            <h3>MEMBER ACTION STREAM</h3>
          </div>
        </div>

        <div className="bauhaus-table-container">
          <table className="bauhaus-table">
            <thead>
              <tr>
                <th>Operator</th>
                <th>Operation</th>
                <th>Target Object</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {activityLogs.map(log => (
                <tr key={log.id}>
                  <td style={{ fontWeight: 'bold' }}>{log.user}</td>
                  <td>{log.action}</td>
                  <td>{log.target}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Members;
