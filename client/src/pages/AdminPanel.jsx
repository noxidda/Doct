import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, HardDrive, ShieldAlert, Cpu, Database, Eye } from 'lucide-react';

const AdminPanel = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  
  const { 
    members, removeMember, changeMemberRole, 
    workspaces, deleteWorkspace, activityLogs 
  } = useApp();

  const [activeTab, setActiveTab] = useState('users');

  // Enforce access control: Admin Panel is restricted to Owner/Admin
  if (currentUser?.role !== 'Owner' && currentUser?.role !== 'Admin') {
    return (
      <div className="bauhaus-card" style={{ borderColor: 'var(--error)', textAlign: 'center', padding: '3rem' }}>
        <h2 style={{ color: 'var(--error)' }}>ACCESS BLOCKED</h2>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>You do not possess the required privilege credentials to access this system supervision area.</p>
        <button onClick={() => navigate('/dashboard')} className="bauhaus-btn" style={{ marginTop: '1.5rem' }}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontSize: '2rem' }}>ADMINISTRATOR PANEL</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>System level supervision, user management, and hardware monitor gauges.</p>
      </div>

      {/* Tabs */}
      <div className="bauhaus-tabs">
        <button 
          className={`bauhaus-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Supervision
        </button>
        <button 
          className={`bauhaus-tab ${activeTab === 'workspaces' ? 'active' : ''}`}
          onClick={() => setActiveTab('workspaces')}
        >
          Workspace Supervision
        </button>
        <button 
          className={`bauhaus-tab ${activeTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveTab('system')}
        >
          Hardware & Audits
        </button>
      </div>

      {/* User Management Panel */}
      {activeTab === 'users' && (
        <div className="bauhaus-card" style={{ margin: 0 }}>
          <div className="bauhaus-card-header">
            <h3>USER DIRECTORY REGISTER</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>ACTIVE USERS: {members.length}</span>
          </div>

          <div className="bauhaus-table-container">
            <table className="bauhaus-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.id}>
                    <td><code>{member.id}</code></td>
                    <td style={{ fontWeight: 'bold' }}>{member.name}</td>
                    <td>{member.email}</td>
                    <td>
                      <select 
                        className="bauhaus-select" 
                        value={member.role} 
                        onChange={(e) => changeMemberRole(member.id, e.target.value)}
                        disabled={member.role === 'Owner'}
                        style={{ height: '28px', padding: '0 1.5rem 0 0.5rem', fontSize: '12px', width: '120px' }}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Member">Member</option>
                      </select>
                    </td>
                    <td>
                      {member.role !== 'Owner' && member.id !== currentUser.id && (
                        <button 
                          onClick={() => {
                            if(window.confirm(`Revoke all server access for user ${member.name}?`)) {
                              removeMember(member.id);
                            }
                          }}
                          className="bauhaus-btn bauhaus-btn-danger" 
                          style={{ padding: '0.2rem 0.5rem', fontSize: '12px' }}
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Workspace Management Panel */}
      {activeTab === 'workspaces' && (
        <div className="bauhaus-card" style={{ margin: 0 }}>
          <div className="bauhaus-card-header">
            <h3>WORKSPACE DATABASE ARCHIVE</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>ACTIVE CLUSTERS: {workspaces.length}</span>
          </div>

          <div className="bauhaus-table-container">
            <table className="bauhaus-table">
              <thead>
                <tr>
                  <th>Workspace ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Privilege Actions</th>
                </tr>
              </thead>
              <tbody>
                {workspaces.map(ws => (
                  <tr key={ws.id}>
                    <td><code>{ws.id}</code></td>
                    <td style={{ fontWeight: 'bold' }}>{ws.name}</td>
                    <td>{ws.description}</td>
                    <td>
                      <button 
                        onClick={() => {
                          if (workspaces.length <= 1) {
                            alert('Cannot delete the final remaining workspace container.');
                            return;
                          }
                          if(window.confirm(`Delete workspace "${ws.name}" and purge all related databases?`)) {
                            deleteWorkspace(ws.id);
                          }
                        }}
                        className="bauhaus-btn bauhaus-btn-danger" 
                        style={{ padding: '0.2rem 0.5rem', fontSize: '12px' }}
                      >
                        Delete Purge
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Hardware Monitor & Audits */}
      {activeTab === 'system' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Hardware metrics widgets */}
          <div className="bauhaus-grid-3">
            <div className="bauhaus-card" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>SERVER CPU LOAD</span>
                <Cpu size={16} />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>14.2%</div>
              <div style={{ height: '8px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                <div style={{ height: '100%', width: '14.2%', backgroundColor: 'var(--success)' }} />
              </div>
            </div>

            <div className="bauhaus-card" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>DATABASE STORAGE</span>
                <Database size={16} />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>4.8 MB / 512 MB</div>
              <div style={{ height: '8px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                <div style={{ height: '100%', width: '1%', backgroundColor: 'var(--success)' }} />
              </div>
            </div>

            <div className="bauhaus-card" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>CLOUDINARY STORAGE</span>
                <HardDrive size={16} />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>14.5%</div>
              <div style={{ height: '8px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                <div style={{ height: '100%', width: '14.5%', backgroundColor: 'var(--warning)' }} />
              </div>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bauhaus-card" style={{ margin: 0 }}>
            <div className="bauhaus-card-header">
              <h3>SYSTEM AUDIT TRAIL LOGS</h3>
            </div>
            <div className="bauhaus-table-container">
              <table className="bauhaus-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Operator</th>
                    <th>Action</th>
                    <th>Target</th>
                  </tr>
                </thead>
                <tbody>
                  {activityLogs.map(log => (
                    <tr key={log.id}>
                      <td>{log.timestamp}</td>
                      <td><code>{log.user}</code></td>
                      <td>{log.action}</td>
                      <td>{log.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminPanel;
