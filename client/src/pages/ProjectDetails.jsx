import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Calendar, FileSpreadsheet, Layers, CheckSquare, Clock } from 'lucide-react';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, tasks, currentWorkspace } = useApp();

  const project = projects.find(p => p.id === projectId);
  const projectTasks = tasks.filter(t => t.projectId === projectId);
  
  if (!project) {
    return (
      <div className="bauhaus-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>PROJECT NOT FOUND</h2>
        <button onClick={() => navigate('/projects')} className="bauhaus-btn" style={{ marginTop: '1rem' }}>
          Back to Projects
        </button>
      </div>
    );
  }

  const completedCount = projectTasks.filter(t => t.status === 'Completed').length;
  const pendingCount = projectTasks.filter(t => t.status !== 'Completed').length;
  const progress = projectTasks.length > 0 ? Math.round((completedCount / projectTasks.length) * 100) : 0;

  // Export Project Report as CSV
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Task ID,Title,Status,Priority,Due Date,Subtasks (Total),Subtasks (Completed)\n';
    
    projectTasks.forEach(t => {
      const subTotal = t.subtasks.length;
      const subComp = t.subtasks.filter(s => s.completed).length;
      csvContent += `"${t.id}","${t.title}","${t.status}","${t.priority}","${t.dueDate}",${subTotal},${subComp}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${project.name.replace(/\s+/g, '_')}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* Back button */}
      <Link to="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: 'bold' }}>
        <ChevronLeft size={14} />
        Back to projects Archive
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', gap: '2rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '2rem' }}>{project.name}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '0.5rem', maxWidth: '650px' }}>{project.description}</p>
        </div>

        <button onClick={handleExportCSV} className="bauhaus-btn bauhaus-btn-success" style={{ display: 'inline-flex', gap: '0.5rem' }}>
          <FileSpreadsheet size={16} />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="bauhaus-grid-3" style={{ marginBottom: '2rem' }}>
        <div className="bauhaus-card" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>PROGRESS RATE</span>
            <Layers size={16} style={{ color: 'var(--warning)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{progress}%</div>
          <div style={{ height: '8px', backgroundColor: 'var(--bg-primary)', border: '2px solid var(--border)' }}>
            <div style={{ height: '100%', width: `${progress}%`, backgroundColor: 'var(--text-primary)' }} />
          </div>
        </div>

        <div className="bauhaus-card" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>COMPLETED TASKS</span>
            <CheckSquare size={16} style={{ color: 'var(--success)' }} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{completedCount}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total assigned items: {projectTasks.length}</div>
        </div>

        <div className="bauhaus-card" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>TARGET MILESTONE</span>
            <Calendar size={16} style={{ color: 'var(--warning)' }} />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.75rem 0 0.5rem 0' }}>{project.deadline}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Status: {project.status}</div>
        </div>
      </div>

      {/* Task List table within Project */}
      <div className="bauhaus-card">
        <div className="bauhaus-card-header">
          <h3>PROJECT RUNTIME TASKS ({projectTasks.length})</h3>
          <Link to="/tasks" className="bauhaus-btn" style={{ padding: '0.25rem 0.75rem', fontSize: '12px' }}>
            Open Task Board
          </Link>
        </div>

        <div className="bauhaus-table-container">
          <table className="bauhaus-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Subtasks</th>
              </tr>
            </thead>
            <tbody>
              {projectTasks.map(task => {
                const subTotal = task.subtasks.length;
                const subComp = task.subtasks.filter(s => s.completed).length;

                return (
                  <tr key={task.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/tasks')}>
                    <td style={{ fontWeight: 'bold' }}>{task.title}</td>
                    <td>
                      <span className={`bauhaus-badge badge-${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`bauhaus-badge badge-${task.status.toLowerCase()}`}>
                        {task.status}
                      </span>
                    </td>
                    <td>{task.dueDate}</td>
                    <td>{subTotal > 0 ? `${subComp}/${subTotal}` : '-'}</td>
                  </tr>
                );
              })}
              {projectTasks.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No tasks assigned to this project yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
