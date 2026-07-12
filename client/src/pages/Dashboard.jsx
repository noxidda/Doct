import React from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, CheckSquare, Users, AlertTriangle, Play } from 'lucide-react';

const Dashboard = () => {
  const { tasks, projects, members, activityLogs, currentWorkspace } = useApp();
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

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Task Priority Distribution
  const criticalCount = workspaceTasks.filter(t => t.priority === 'Critical').length;
  const highCount = workspaceTasks.filter(t => t.priority === 'High').length;
  const mediumCount = workspaceTasks.filter(t => t.priority === 'Medium').length;
  const lowCount = workspaceTasks.filter(t => t.priority === 'Low').length;
  const maxPriorityCount = Math.max(criticalCount, highCount, mediumCount, lowCount, 1);

  return (
    <div>
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
      <div className="bauhaus-grid-4" style={{ marginBottom: '2rem' }}>
        
        {/* Metric 1 */}
        <div className="bauhaus-card" style={{ margin: 0, padding: '1.5rem' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Active Projects</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1.1, marginTop: '0.5rem' }}>{activeProjects.length}</div>
        </div>

        {/* Metric 2 */}
        <div className="bauhaus-card" style={{ margin: 0, padding: '1.5rem' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Completion Rate</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1.1, marginTop: '0.5rem' }}>{completionRate}%</div>
        </div>

        {/* Metric 3 */}
        <div className="bauhaus-card" style={{ margin: 0, padding: '1.5rem' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Workspace Members</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1.1, marginTop: '0.5rem' }}>{totalMembers}</div>
        </div>

        {/* Metric 4 */}
        <div className="bauhaus-card" style={{ margin: 0, padding: '1.5rem', border: overdueTasks > 0 ? '1px solid var(--error)' : 'none' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', color: overdueTasks > 0 ? 'var(--error)' : 'var(--text-secondary)', fontWeight: 'bold' }}>Overdue Tasks</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1.1, marginTop: '0.5rem', color: overdueTasks > 0 ? 'var(--error)' : 'var(--text-primary)' }}>{overdueTasks}</div>
        </div>

      </div>

      {/* Main Grid: Projects progress + Priority Chart */}
      <div className="bauhaus-grid-2" style={{ marginBottom: '2rem' }}>
        
        {/* Project Progress Widget */}
        <div className="bauhaus-card" style={{ margin: 0 }}>
          <div className="bauhaus-card-header">
            <h3>PROJECT RUNTIME</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>PROGRESS %</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {activeProjects.map(proj => {
              const projTasks = workspaceTasks.filter(t => t.projectId === proj.id);
              const completedProjTasks = projTasks.filter(t => t.status === 'Completed').length;
              const progress = projTasks.length > 0 ? Math.round((completedProjTasks / projTasks.length) * 100) : 0;
              
              return (
                <div key={proj.id} onClick={() => navigate(`/projects/${proj.id}`)} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '13px' }}>
                    <span style={{ fontWeight: 'bold' }}>{proj.name}</span>
                    <span style={{ color: 'var(--warning)' }}>{progress}% ({completedProjTasks}/{projTasks.length})</span>
                  </div>
                  
                  {/* Custom Neobrutalist progress bar */}
                  <div style={{ height: '16px', backgroundColor: '#FFFFFF', border: '2px solid var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${progress}%`,
                      backgroundColor: 'var(--secondary)'
                    }} />
                  </div>
                </div>
              );
            })}
            
            {activeProjects.length === 0 && (
              <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 0' }}>
                No active projects in this workspace.
              </div>
            )}
          </div>
        </div>

        {/* Task Priority Distribution Widget */}
        <div className="bauhaus-card" style={{ margin: 0 }}>
          <div className="bauhaus-card-header">
            <h3>PRIORITY DISTRIBUTION</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>TASK count</span>
          </div>

          {/* SVG Custom Column Chart */}
          <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '1rem 0' }}>
            {[
              { label: 'CRITICAL', count: criticalCount, color: 'var(--accent)' },
              { label: 'HIGH', count: highCount, color: 'var(--secondary)' },
              { label: 'MEDIUM', count: mediumCount, color: 'var(--tertiary)' },
              { label: 'LOW', count: lowCount, color: 'var(--quaternary)' }
            ].map(col => {
              const barHeight = Math.max(10, Math.round((col.count / maxPriorityCount) * 120));
              return (
                <div key={col.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--foreground)' }}>{col.count}</span>
                  <div style={{
                    width: '32px',
                    height: `${barHeight}px`,
                    backgroundColor: col.color,
                    border: '2px solid var(--border)',
                    boxShadow: 'none',
                    borderRadius: '6px'
                  }} />
                  <span style={{ fontSize: '12px', fontWeight: '800', marginTop: '0.75rem', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>{col.label}</span>
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
