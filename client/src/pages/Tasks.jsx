import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, Search, Filter, SlidersHorizontal, CheckSquare, 
  Trash2, Copy, Archive, CornerDownRight, MessageSquare, 
  Paperclip, PlusSquare, X, ChevronRight, User as UserIcon, Calendar, Check
} from 'lucide-react';

const Tasks = () => {
  const { user } = useAuth();
  const { 
    tasks, projects, members, createTask, updateTask, deleteTask, duplicateTask,
    addSubtask, toggleSubtask, deleteSubtask, addComment, deleteComment,
    addAttachment, deleteAttachment, currentWorkspace
  } = useApp();

  const [activeView, setActiveView] = useState('kanban'); // 'kanban', 'list', 'table'
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Task Creator Form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newStatus, setNewStatus] = useState('Todo');
  const [newDueDate, setNewDueDate] = useState('');
  const [newProjectId, setNewProjectId] = useState('');
  const [newAssigneeId, setNewAssigneeId] = useState('');

  // Subtask/Comment inputs
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [sortBy, setSortBy] = useState(''); // 'dueDate', 'priority'

  const statuses = ['Backlog', 'Todo', 'In Progress', 'Review', 'Completed'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  // Handle task click
  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  // Get freshest data for active task drawer
  const activeTask = tasks.find(t => t.id === selectedTask?.id) || null;

  // Filter and Sort logic
  const workspaceTasks = tasks.filter(t => t.workspaceId === currentWorkspace?.id);
  const activeProjects = projects.filter(p => p.workspaceId === currentWorkspace?.id && p.status === 'Active');

  const filteredTasks = workspaceTasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject = filterProject ? t.projectId === filterProject : true;
    const matchesPriority = filterPriority ? t.priority === filterPriority : true;
    const matchesAssignee = filterAssignee ? t.assigneeId === filterAssignee : true;
    return matchesSearch && matchesProject && matchesPriority && matchesAssignee;
  }).sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
    }
    if (sortBy === 'priority') {
      const priorityWeights = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      return priorityWeights[b.priority] - priorityWeights[a.priority];
    }
    return 0;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newProjectId) return;
    
    createTask({
      title: newTitle,
      description: newDesc,
      priority: newPriority,
      status: newStatus,
      dueDate: newDueDate || new Date().toISOString().split('T')[0],
      projectId: newProjectId,
      assigneeId: newAssigneeId || user?.id
    });

    setNewTitle('');
    setNewDesc('');
    setNewDueDate('');
    setShowCreateForm(false);
  };

  // Attachment upload simulation
  const handleFileUploadSim = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    addAttachment(activeTask.id, file);
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)', gap: '1.5rem', position: 'relative' }}>
      
      {/* Left Area: View and Board Column lists */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Filter bar and view selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '2rem' }}>RUNNING TASKS</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Grid workflows, lists, and task prioritizations.</p>
            </div>
            <button onClick={() => setShowCreateForm(!showCreateForm)} className="bauhaus-btn bauhaus-btn-primary">
              <Plus size={16} />
              <span>Create Task</span>
            </button>
          </div>

          {/* Action filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bauhaus-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.25rem', height: '36px', fontSize: '13px' }}
              />
            </div>

            <select className="bauhaus-select" style={{ width: '140px', height: '36px', padding: '0 1.5rem 0 0.75rem', fontSize: '12px' }} value={filterProject} onChange={(e) => setFilterProject(e.target.value)}>
              <option value="">All Projects</option>
              {activeProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>

            <select className="bauhaus-select" style={{ width: '120px', height: '36px', padding: '0 1.5rem 0 0.75rem', fontSize: '12px' }} value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="">All Priorities</option>
              {priorities.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            <select className="bauhaus-select" style={{ width: '130px', height: '36px', padding: '0 1.5rem 0 0.75rem', fontSize: '12px' }} value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)}>
              <option value="">All Assignees</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>

            <select className="bauhaus-select" style={{ width: '120px', height: '36px', padding: '0 1.5rem 0 0.75rem', fontSize: '12px' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="">Sort By</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </select>

            {/* View switcher buttons */}
            <div style={{ display: 'flex', border: '2px solid var(--border)', borderRadius: '9999px', overflow: 'hidden', marginLeft: 'auto', backgroundColor: '#FFFFFF', boxShadow: 'none' }}>
              <button 
                onClick={() => setActiveView('kanban')} 
                style={{ 
                  padding: '0.4rem 1.25rem', 
                  border: 'none', 
                  backgroundColor: activeView === 'kanban' ? 'var(--primary)' : 'transparent',
                  color: activeView === 'kanban' ? '#FFFFFF' : 'var(--foreground)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '800',
                  fontFamily: 'var(--font-heading)'
                }}
              >
                KANBAN
              </button>
              <button 
                onClick={() => setActiveView('list')} 
                style={{ 
                  padding: '0.4rem 1.25rem', 
                  border: 'none', 
                  backgroundColor: activeView === 'list' ? 'var(--primary)' : 'transparent',
                  color: activeView === 'list' ? '#FFFFFF' : 'var(--foreground)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '800',
                  borderLeft: '2px solid var(--border)',
                  fontFamily: 'var(--font-heading)'
                }}
              >
                LIST
              </button>
              <button 
                onClick={() => setActiveView('table')} 
                style={{ 
                  padding: '0.4rem 1.25rem', 
                  border: 'none', 
                  backgroundColor: activeView === 'table' ? 'var(--primary)' : 'transparent',
                  color: activeView === 'table' ? '#FFFFFF' : 'var(--foreground)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '800',
                  borderLeft: '2px solid var(--border)',
                  fontFamily: 'var(--font-heading)'
                }}
              >
                TABLE
              </button>
            </div>
          </div>
        </div>

        {/* Task Creation Form */}
        {showCreateForm && (
          <form onSubmit={handleCreate} className="bauhaus-card" style={{ borderColor: 'var(--text-primary)', marginBottom: '1.5rem', flexShrink: 0 }}>
            <h3 style={{ marginBottom: '1rem' }}>Create Task</h3>
            <div className="bauhaus-grid-3" style={{ marginBottom: '1rem' }}>
              <div>
                <label className="bauhaus-label">Task Title</label>
                <input type="text" className="bauhaus-input" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Design CSS variables" required />
              </div>
              <div>
                <label className="bauhaus-label">Project Scope</label>
                <select className="bauhaus-select" value={newProjectId} onChange={(e) => setNewProjectId(e.target.value)} required>
                  <option value="">Select Project...</option>
                  {activeProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="bauhaus-label">Due Date</label>
                <input type="date" className="bauhaus-input" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} />
              </div>
            </div>

            <div className="bauhaus-grid-3" style={{ marginBottom: '1rem' }}>
              <div>
                <label className="bauhaus-label">Priority</label>
                <select className="bauhaus-select" value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
                  {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="bauhaus-label">Initial Status</label>
                <select className="bauhaus-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="bauhaus-label">Assignee</label>
                <select className="bauhaus-select" value={newAssigneeId} onChange={(e) => setNewAssigneeId(e.target.value)}>
                  <option value="">Select Member...</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="bauhaus-label">Detailed Description</label>
              <textarea className="bauhaus-input" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Provide functional guidelines..." rows="2" style={{ resize: 'none' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="bauhaus-btn bauhaus-btn-primary">Add Task</button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="bauhaus-btn">Cancel</button>
            </div>
          </form>
        )}

        {/* Task lists by View Mode */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          
          {/* Kanban Board View */}
          {activeView === 'kanban' && (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${statuses.length}, 1fr)`, gap: '1rem', height: '100%' }}>
              {statuses.map(status => {
                const columnTasks = filteredTasks.filter(t => t.status === status);
                return (
                  <div key={status} style={{ display: 'flex', flexDirection: 'column', minWidth: '180px', backgroundColor: 'var(--surface-container)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <div style={{ 
                      padding: '1rem', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.01em', fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>{status}</span>
                      <span className="bauhaus-badge" style={{ fontSize: '12px', padding: '2px 8px' }}>{columnTasks.length}</span>
                    </div>
                    
                    <div style={{ flex: 1, padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', backgroundColor: 'transparent' }}>
                      {columnTasks.map(task => {
                        const proj = projects.find(p => p.id === task.projectId);
                        return (
                          <div 
                            key={task.id} 
                            onClick={() => handleTaskClick(task)}
                            style={{
                              padding: '1rem',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: '#FFFFFF',
                              cursor: 'pointer',
                              transition: 'all 300ms cubic-bezier(0.2, 0, 0, 1)',
                              boxShadow: activeTask?.id === task.id ? 'none' : '0px 1px 3px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.1)',
                              border: activeTask?.id === task.id ? '2px solid var(--primary)' : '1px solid var(--border)'
                            }}
                            onMouseEnter={(e) => {
                              if (activeTask?.id !== task.id) {
                                e.currentTarget.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.05)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (activeTask?.id !== task.id) {
                                e.currentTarget.style.boxShadow = '0px 1px 3px rgba(0, 0, 0, 0.05), 0px 1px 2px rgba(0, 0, 0, 0.1)';
                              }
                            }}
                          >
                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--warning)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                              {proj ? proj.name : 'Unassigned Project'}
                            </div>
                            <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '0.5rem', lineHeight: 1.3 }}>{task.title}</div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                              <span className={`bauhaus-badge badge-${task.priority.toLowerCase()}`} style={{ fontSize: '12px' }}>
                                {task.priority}
                              </span>
                              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{task.dueDate}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* List View */}
          {activeView === 'list' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {statuses.map(status => {
                const columnTasks = filteredTasks.filter(t => t.status === status);
                if (columnTasks.length === 0) return null;
                return (
                  <div key={status} className="bauhaus-card" style={{ margin: 0, padding: '1rem' }}>
                    <h3 style={{ fontSize: '12px', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                      {status.toUpperCase()} ({columnTasks.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {columnTasks.map(task => (
                        <div 
                          key={task.id}
                          onClick={() => handleTaskClick(task)}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.75rem',
                            border: '1px solid var(--border)',
                            cursor: 'pointer',
                            backgroundColor: activeTask?.id === task.id ? 'var(--hover)' : 'transparent'
                          }}
                        >
                          <span style={{ fontWeight: 'bold' }}>{task.title}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span className={`bauhaus-badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{task.dueDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Table View */}
          {activeView === 'table' && (
            <div className="bauhaus-table-container">
              <table className="bauhaus-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Project</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Assignee</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map(task => {
                    const proj = projects.find(p => p.id === task.projectId);
                    const member = members.find(m => m.id === task.assigneeId);
                    return (
                      <tr key={task.id} onClick={() => handleTaskClick(task)} style={{ cursor: 'pointer', backgroundColor: activeTask?.id === task.id ? 'var(--hover)' : 'transparent' }}>
                        <td style={{ fontWeight: 'bold' }}>{task.title}</td>
                        <td>{proj ? proj.name : '-'}</td>
                        <td><span className={`bauhaus-badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span></td>
                        <td><span className={`bauhaus-badge badge-${task.status.toLowerCase()}`}>{task.status}</span></td>
                        <td>{task.dueDate}</td>
                        <td>{member ? member.name : '-'}</td>
                      </tr>
                    );
                  })}
                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center' }}>No matches found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>

      {/* Right Drawer: Task Details Pane */}
      {activeTask && (
        <div style={{
          width: '420px',
          border: '2px solid var(--text-primary)',
          backgroundColor: 'var(--card)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
          overflowY: 'auto'
        }}>
          
          {/* Header */}
          <div style={{ padding: '1rem', borderBottom: '2px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--warning)', letterSpacing: '0.1em' }}>TASK PARAMETERS</span>
            <button onClick={() => setSelectedTask(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>

          <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
            
            {/* Title / Description */}
            <div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', textTransform: 'none' }}>{activeTask.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.4 }}>
                {activeTask.description || 'No description provided.'}
              </p>
            </div>

            {/* Quick parameter edit toggles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <div>
                <label className="bauhaus-label">Status</label>
                <select 
                  className="bauhaus-select" 
                  value={activeTask.status} 
                  onChange={(e) => updateTask(activeTask.id, { status: e.target.value })}
                  style={{ height: '32px', padding: '0 1.5rem 0 0.5rem', fontSize: '12px' }}
                >
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              
              <div>
                <label className="bauhaus-label">Priority</label>
                <select 
                  className="bauhaus-select" 
                  value={activeTask.priority} 
                  onChange={(e) => updateTask(activeTask.id, { priority: e.target.value })}
                  style={{ height: '32px', padding: '0 1.5rem 0 0.5rem', fontSize: '12px' }}
                >
                  {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {/* Subtasks (Module 7) */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <label className="bauhaus-label">Subtasks Track</label>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {activeTask.subtasks.map(sub => (
                  <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '13px' }}>
                    <button 
                      onClick={() => toggleSubtask(activeTask.id, sub.id)}
                      style={{
                        width: '16px',
                        height: '16px',
                        border: '1px solid var(--text-primary)',
                        backgroundColor: sub.completed ? 'var(--text-primary)' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {sub.completed && <Check size={10} style={{ color: 'var(--bg-primary)' }} />}
                    </button>
                    <span style={{ textDecoration: sub.completed ? 'line-through' : 'none', color: sub.completed ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                      {sub.title}
                    </span>
                    <button 
                      onClick={() => deleteSubtask(activeTask.id, sub.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', marginLeft: 'auto' }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  className="bauhaus-input"
                  placeholder="New subtask..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  style={{ height: '32px', fontSize: '12px' }}
                />
                <button 
                  onClick={() => {
                    if(!newSubtaskTitle.trim()) return;
                    addSubtask(activeTask.id, newSubtaskTitle);
                    setNewSubtaskTitle('');
                  }}
                  className="bauhaus-btn" 
                  style={{ padding: '0 0.75rem', height: '32px' }}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Attachments Section (Module 9) */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <label className="bauhaus-label">File Attachments</label>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {activeTask.attachments.map(att => (
                  <div key={att.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0.5rem', border: '1px solid var(--border)', fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Paperclip size={12} />
                      <span style={{ fontWeight: 'bold' }}>{att.name}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>({att.size})</span>
                    </div>
                    <button 
                      onClick={() => deleteAttachment(activeTask.id, att.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ position: 'relative' }}>
                <input 
                  type="file" 
                  onChange={handleFileUploadSim}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                <button className="bauhaus-btn" style={{ width: '100%', padding: '0.4rem', fontSize: '12px', display: 'flex', gap: '0.25rem' }}>
                  <PlusSquare size={12} />
                  <span>Upload Document / Image</span>
                </button>
              </div>
            </div>

            {/* Comments Thread (Module 8) */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <label className="bauhaus-label">Comments Feed</label>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '180px', overflowY: 'auto', marginBottom: '1rem' }}>
                {activeTask.comments.map(comm => {
                  const commMember = members.find(m => m.id === comm.userId);
                  return (
                    <div key={comm.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                        <span style={{ fontWeight: 'bold' }}>{commMember ? commMember.name : 'Unknown User'}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{new Date(comm.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{comm.content}</p>
                      <button 
                        onClick={() => deleteComment(activeTask.id, comm.id)}
                        style={{ alignSelf: 'flex-end', background: 'none', border: 'none', color: 'var(--error)', fontSize: '12px', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <textarea 
                  className="bauhaus-input"
                  placeholder="Add comment... Use @member for mentions."
                  rows="2"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  style={{ resize: 'none', fontSize: '12px' }}
                />
                <button 
                  onClick={() => {
                    if(!newCommentText.trim()) return;
                    addComment(activeTask.id, newCommentText);
                    setNewCommentText('');
                  }}
                  className="bauhaus-btn" 
                  style={{ alignSelf: 'flex-end', padding: '0.4rem 1rem', fontSize: '12px' }}
                >
                  Send Comment
                </button>
              </div>
            </div>

            {/* Task manipulation utilities */}
            <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
              <button 
                onClick={() => duplicateTask(activeTask.id)} 
                className="bauhaus-btn" 
                style={{ flex: 1, padding: '0.4rem', fontSize: '12px' }}
              >
                <Copy size={12} />
                <span>Duplicate</span>
              </button>
              <button 
                onClick={() => {
                  if(window.confirm('Delete this task permanently?')) {
                    deleteTask(activeTask.id);
                    setSelectedTask(null);
                  }
                }} 
                className="bauhaus-btn bauhaus-btn-danger" 
                style={{ flex: 1, padding: '0.4rem', fontSize: '12px' }}
              >
                <Trash2 size={12} />
                <span>Delete</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Tasks;
