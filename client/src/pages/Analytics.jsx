import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, TrendingUp, Users, CheckSquare } from 'lucide-react';

const Analytics = () => {
  const { tasks, projects, members, currentWorkspace } = useApp();

  const workspaceTasks = tasks.filter(t => t.workspaceId === currentWorkspace?.id);
  const totalTasks = workspaceTasks.length;
  const completedTasks = workspaceTasks.filter(t => t.status === 'Completed').length;
  const pendingTasks = workspaceTasks.filter(t => t.status !== 'Completed').length;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueTasks = workspaceTasks.filter(t => t.dueDate && t.dueDate < todayStr && t.status !== 'Completed').length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Project Progress stats
  const activeProjects = projects.filter(p => p.workspaceId === currentWorkspace?.id && p.status === 'Active');

  // User Performance Stats
  const memberPerformance = members.map(m => {
    const userTasks = workspaceTasks.filter(t => t.assigneeId === m.id);
    const userCompleted = userTasks.filter(t => t.status === 'Completed').length;
    const userPending = userTasks.length - userCompleted;
    const ratio = userTasks.length > 0 ? Math.round((userCompleted / userTasks.length) * 100) : 0;

    return {
      name: m.name,
      avatar: m.avatar,
      role: m.role,
      assigned: userTasks.length,
      completed: userCompleted,
      pending: userPending,
      ratio
    };
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontSize: '2rem' }}>SYSTEM ANALYTICS</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Data processing grid displaying workspace performance metrics.</p>
      </div>

      {/* Grid: Gauge chart + General stats */}
      <div className="bauhaus-grid-3" style={{ marginBottom: '2rem' }}>
        
        {/* SVG Radial Progress Widget */}
        <div className="bauhaus-card" style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <label className="bauhaus-label" style={{ alignSelf: 'flex-start' }}>COMPLETION RATE GAUGE</label>
          <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1rem 0' }}>
            <svg width="150" height="150" viewBox="0 0 150 150">
              {/* Background circle */}
              <circle cx="75" cy="75" r="60" fill="none" stroke="var(--border)" strokeWidth="12" />
              {/* Foreground circle indicator (2 * PI * r = 376.99) */}
              <circle 
                cx="75" 
                cy="75" 
                r="60" 
                fill="none" 
                stroke="var(--text-primary)" 
                strokeWidth="12"
                strokeDasharray="376.99"
                strokeDashoffset={376.99 - (376.99 * completionRate) / 100}
                transform="rotate(-90 75 75)"
              />
            </svg>
            <div style={{ position: 'absolute', fontSize: '1.8rem', fontWeight: 'bold' }}>{completionRate}%</div>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total assigned workspace items</span>
        </div>

        {/* Workspace Load Metrics Card */}
        <div className="bauhaus-card" style={{ margin: 0 }}>
          <label className="bauhaus-label" style={{ marginBottom: '1.5rem' }}>WORKSPACE LOAD PARAMETERS</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Task Register</span>
              <span style={{ fontWeight: 'bold' }}>{totalTasks}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Completed Streams</span>
              <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>{completedTasks}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Pending Items</span>
              <span style={{ fontWeight: 'bold', color: 'var(--warning)' }}>{pendingTasks}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Overdue Backlog</span>
              <span style={{ fontWeight: 'bold', color: overdueTasks > 0 ? 'var(--error)' : 'var(--text-secondary)' }}>{overdueTasks}</span>
            </div>
          </div>
        </div>

        {/* Project progress overview list */}
        <div className="bauhaus-card" style={{ margin: 0 }}>
          <label className="bauhaus-label" style={{ marginBottom: '1rem' }}>PROJECT RUNTIME PROGRESS</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '180px', overflowY: 'auto' }}>
            {activeProjects.map(p => {
              const projTasks = workspaceTasks.filter(t => t.projectId === p.id);
              const comp = projTasks.filter(t => t.status === 'Completed').length;
              const ratio = projTasks.length > 0 ? Math.round((comp / projTasks.length) * 100) : 0;
              return (
                <div key={p.id} style={{ fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 'bold' }}>{p.name}</span>
                    <span>{ratio}%</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                    <div style={{ height: '100%', width: `${ratio}%`, backgroundColor: 'var(--warning)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* User Performance Analytics Table */}
      <div className="bauhaus-card">
        <div className="bauhaus-card-header">
          <h3>USER RUNTIME PERFORMANCE OVERVIEW</h3>
        </div>

        <div className="bauhaus-table-container">
          <table className="bauhaus-table">
            <thead>
              <tr>
                <th>Operator</th>
                <th>Role</th>
                <th>Assigned Tasks</th>
                <th>Completed</th>
                <th>Pending</th>
                <th>Completion Rate</th>
                <th>Performance Chart</th>
              </tr>
            </thead>
            <tbody>
              {memberPerformance.map(m => (
                <tr key={m.name}>
                  <td style={{ fontWeight: 'bold' }}>{m.name}</td>
                  <td>{m.role}</td>
                  <td>{m.assigned}</td>
                  <td style={{ color: 'var(--success)' }}>{m.completed}</td>
                  <td style={{ color: 'var(--warning)' }}>{m.pending}</td>
                  <td style={{ fontWeight: 'bold' }}>{m.ratio}%</td>
                  <td style={{ width: '160px' }}>
                    {/* SVG horizontal performance block */}
                    <div style={{ height: '12px', width: '100px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                      <div style={{ height: '100%', width: `${m.ratio}%`, backgroundColor: m.ratio > 70 ? 'var(--success)' : m.ratio > 40 ? 'var(--warning)' : 'var(--error)' }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
