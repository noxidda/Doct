import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Folder, FolderArchive, Plus, Calendar, Edit3, Trash2 } from 'lucide-react';

const Projects = () => {
  const { projects, currentWorkspace, createProject, editProject, deleteProject } = useApp();
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'archived'

  const workspaceProjects = projects.filter(p => p.workspaceId === currentWorkspace?.id);
  const activeProjects = workspaceProjects.filter(p => p.status === 'Active');
  const archivedProjects = workspaceProjects.filter(p => p.status === 'Archived');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    createProject(name, description, deadline);
    setName('');
    setDescription('');
    setDeadline('');
    setShowCreateForm(false);
  };

  const toggleArchive = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Archived' : 'Active';
    editProject(id, { status: nextStatus });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '2rem' }}>PROJECT ARCHIVE</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Organize structural modules and deadline milestones.</p>
        </div>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)} 
          className="bauhaus-btn bauhaus-btn-primary"
        >
          <Plus size={16} />
          <span>New Project</span>
        </button>
      </div>

      {/* New Project Form */}
      {showCreateForm && (
        <form onSubmit={handleCreate} className="bauhaus-card" style={{ borderColor: 'var(--text-primary)', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>Define Project Parameters</h3>
          <div className="bauhaus-grid-2" style={{ marginBottom: '1rem' }}>
            <div>
              <label className="bauhaus-label">Project Title</label>
              <input 
                type="text" 
                className="bauhaus-input"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g. Core Database Migrations"
                required 
              />
            </div>
            <div>
              <label className="bauhaus-label">Target Milestone (Deadline)</label>
              <input 
                type="date" 
                className="bauhaus-input"
                value={deadline} 
                onChange={(e) => setDeadline(e.target.value)} 
                required
              />
            </div>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="bauhaus-label">Scope Description</label>
            <textarea 
              className="bauhaus-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail structural components, metrics, and goals..."
              rows="3"
              style={{ resize: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="bauhaus-btn bauhaus-btn-primary">Initialize Project</button>
            <button type="button" onClick={() => setShowCreateForm(false)} className="bauhaus-btn">Cancel</button>
          </div>
        </form>
      )}

      {/* Tabs */}
      <div className="bauhaus-tabs">
        <button 
          className={`bauhaus-tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active Projects ({activeProjects.length})
        </button>
        <button 
          className={`bauhaus-tab ${activeTab === 'archived' ? 'active' : ''}`}
          onClick={() => setActiveTab('archived')}
        >
          Archived ({archivedProjects.length})
        </button>
      </div>

      {/* Projects List */}
      <div className="bauhaus-grid-3">
        {(activeTab === 'active' ? activeProjects : archivedProjects).map(proj => (
          <div 
            key={proj.id} 
            className="bauhaus-card" 
            style={{ 
              margin: 0, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
            onClick={() => navigate(`/projects/${proj.id}`)}
          >
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', marginTop: '0.25rem' }}>{proj.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '1rem', minHeight: '40px', overflow: 'hidden', textDisplay: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {proj.description || 'No description provided.'}
              </p>
              <div style={{ marginBottom: '1rem' }}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleArchive(proj.id, proj.status);
                  }}
                  className="bauhaus-btn"
                  style={{ padding: '0.3rem 0.6rem', fontSize: '12px' }}
                >
                  {proj.status === 'Active' ? 'Archive' : 'Restore'}
                </button>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '12px', color: 'var(--warning)' }}>
                <Calendar size={14} />
                <span>{proj.deadline}</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if(window.confirm('Delete project permanently?')) {
                    deleteProject(proj.id);
                  }
                }}
                style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(activeTab === 'active' ? activeProjects.length : archivedProjects.length) === 0 && (
        <div className="bauhaus-card" style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
          No {activeTab} projects found in this workspace.
        </div>
      )}
    </div>
  );
};

export default Projects;
