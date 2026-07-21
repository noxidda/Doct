import React from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, CheckSquare, Users, AlertTriangle, Play, Mail } from 'lucide-react';

const Dashboard = () => {
  const { tasks, projects, members, activityLogs, currentWorkspace, pendingInvitations, acceptInvitation, declineInvitation } = useApp();
  const navigate = useNavigate();

  // Metrics calculations
  const totalProjects = projects.filter(p => p.workspaceId === currentWorkspace?.id).length;
  const activeProjects = projects.filter(p => p.workspaceId === currentWorkspace?.id && p.status === 'Active');
  const totalMembers = members.length;
  
  const workspaceTasks = tasks.filter(t => t.workspaceId === currentWorkspace?.id);
  const totalTasks = workspaceTasks.length;
  const completedTasks = workspaceTasks.filter(t => t.status === 'Completed').length;
  const pendingTasks = workspaceTasks.filter(t => t.status !== 'Completed').length;
  
  // Calculate Overdue (Due date exists and is in the past, and task is not completed)
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueTasks = workspaceTasks.filter(t => t.dueDate && t.dueDate < todayStr && t.status !== 'Completed').length;



  // Task Priority Distribution
  const criticalCount = workspaceTasks.filter(t => t.priority === 'Critical').length;
  const highCount = workspaceTasks.filter(t => t.priority === 'High').length;
  const mediumCount = workspaceTasks.filter(t => t.priority === 'Medium').length;
  const lowCount = workspaceTasks.filter(t => t.priority === 'Low').length;
  const maxPriorityCount = Math.max(criticalCount, highCount, mediumCount, lowCount, 1);

  return (
    <div>
      {/* Workspace invitations banner */}
      {pendingInvitations && pendingInvitations.length > 0 && (
        <div 
          style={{
            padding: '1.5rem',
            border: '2px solid var(--border)',
            backgroundColor: 'var(--surface-container)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '2rem',
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Mail size={24} style={{ color: 'var(--text-primary)' }} />
            <div>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>PENDING WORKSPACE INVITATIONS</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '0.15rem' }}>
                You have been invited to participate in the following workspaces.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pendingInvitations.map(inv => (
              <div 
                key={inv.id} 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div>
                  <strong style={{ fontSize: '14px' }}>{inv.name}</strong>
                  {inv.description && <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>{inv.description}</p>}
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginTop: '0.25rem' }}>
                    Invited by: {inv.owner?.name || 'Workspace Administrator'} ({inv.owner?.email})
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => acceptInvitation(inv.id)} 
                    className="bauhaus-btn bauhaus-btn-success"
                    style={{ padding: '0.4rem 1rem', fontSize: '12px' }}
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => declineInvitation(inv.id)} 
                    className="bauhaus-btn bauhaus-btn-danger"
                    style={{ padding: '0.4rem 1rem', fontSize: '12px' }}
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Welcome header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '2rem' }}>WORKSPACE OVERVIEW</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '0.25rem' }}>
            Current Area: <strong>{currentWorkspace?.name || 'Doct Workspace'}</strong>
          </p>
        </div>
        <button 
          onClick={() => navigate('/tasks')} 
          className="bauhaus-btn bauhaus-btn-primary"
        >
          <Play size={14} />
          <span>Launch Tasks Board</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="bauhaus-grid-3" style={{ marginBottom: '2rem' }}>
        
        {/* Metric 1 */}
        <div className="bauhaus-card" style={{ margin: 0, padding: '1.5rem' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Active Projects</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1.1, marginTop: '0.5rem' }}>{activeProjects.length}</div>
        </div>

        {/* Metric 2 */}
        <div className="bauhaus-card" style={{ margin: 0, padding: '1.5rem' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Workspace Members</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1.1, marginTop: '0.5rem' }}>{totalMembers}</div>
        </div>

        {/* Metric 3 */}
        <div className="bauhaus-card" style={{ margin: 0, padding: '1.5rem', border: overdueTasks > 0 ? '1px solid var(--error)' : 'none' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', color: overdueTasks > 0 ? 'var(--error)' : 'var(--text-secondary)', fontWeight: 'bold' }}>Overdue Tasks</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1.1, marginTop: '0.5rem', color: overdueTasks > 0 ? 'var(--error)' : 'var(--text-primary)' }}>{overdueTasks}</div>
        </div>

      </div>

      {/* Priority Distribution Widget */}
      <div style={{ marginBottom: '2rem' }}>
        
        {/* Task Priority Distribution Widget */}
        <div className="bauhaus-card" style={{ margin: 0 }}>
          <div className="bauhaus-card-header">
            <h3>PRIORITY DISTRIBUTION</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>TASK count</span>
          </div>

          {/* Custom Column Chart */}
          <div style={{ 
            height: '240px', 
            display: 'flex', 
            alignItems: 'flex-end', 
            justifyContent: 'center', 
            gap: '3rem', 
            padding: '2rem 1rem 1rem 1rem',
            backgroundColor: 'var(--surface-container-low)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)'
          }}>
            {[
              { label: 'CRITICAL', count: criticalCount, color: '#FF6B6B' },
              { label: 'HIGH', count: highCount, color: '#FFAD5A' },
              { label: 'MEDIUM', count: mediumCount, color: '#4DABF7' },
              { label: 'LOW', count: lowCount, color: '#51CF66' }
            ].map(col => {
              const fillPercentage = maxPriorityCount > 0 ? Math.round((col.count / maxPriorityCount) * 100) : 0;
              return (
                <div key={col.label} style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  position: 'relative'
                }}>
                  {/* Task Count Indicator */}
                  <span style={{ 
                    fontSize: '13px', 
                    fontWeight: '800', 
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    boxShadow: '2px 2px 0px var(--border)'
                  }}>
                    {col.count}
                  </span>

                  {/* Vertical Track / Bar Container */}
                  <div style={{
                    width: '44px',
                    height: '130px',
                    backgroundColor: 'var(--bg-primary)',
                    border: '2px solid var(--border)',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'flex-end',
                    boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.05)'
                  }}>
                    {/* Filling Bar */}
                    <div style={{
                      width: '100%',
                      height: `${fillPercentage}%`,
                      backgroundColor: col.color,
                      borderRadius: '9999px',
                      transition: 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      borderTop: fillPercentage > 0 ? '2px solid var(--border)' : 'none'
                    }} />
                  </div>

                  {/* Priority Label */}
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: '800', 
                    letterSpacing: '0.05em', 
                    color: 'var(--text-secondary)' 
                  }}>
                    {col.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Activity Logs Section */}
      <div className="bauhaus-card" style={{ margin: 0 }}>
        <div className="bauhaus-card-header">
          <h3>RECENT RUNTIME ACTIONS</h3>
          <button onClick={() => navigate('/notifications')} className="bauhaus-btn" style={{ padding: '0.25rem 0.75rem', fontSize: '12px' }}>
            Open Audits
          </button>
        </div>
        
        <div className="bauhaus-table-container">
          <table className="bauhaus-table">
            <thead>
              <tr>
                <th>Operator</th>
                <th>Action</th>
                <th>Target</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {activityLogs.slice(0, 5).map(log => (
                <tr key={log.id}>
                  <td style={{ fontWeight: 'bold' }}>{log.user}</td>
                  <td>{log.action}</td>
                  <td>{log.target}</td>
                  <td>{new Date(log.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))}
              {activityLogs.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No log streams found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
