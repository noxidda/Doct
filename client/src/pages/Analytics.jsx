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

  // Project Progress stats
  const activeProjects = projects.filter(p => p.workspaceId === currentWorkspace?.id && p.status === 'Active');

  // User Performance Stats
  const memberPerformance = members.map(m => {
    const userTasks = workspaceTasks.filter(t => t.assigneeId === m.id);
    const userCompleted = userTasks.filter(t => t.status === 'Completed').length;
    const userPending = userTasks.length - userCompleted;

    return {
      name: m.name,
      avatar: m.avatar,
      role: m.role,
      assigned: userTasks.length,
      completed: userCompleted,
      pending: userPending
    };
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontSize: '2rem' }}>SYSTEM ANALYTICS</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Data processing grid displaying workspace performance metrics.</p>
      </div>

      {/* Workspace Load Metrics Section */}
      <div style={{ marginBottom: '2rem' }}>
        
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
