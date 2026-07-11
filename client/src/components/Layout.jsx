import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import logoBlack from '../assets/logo-black.png';
import logoWhite from '../assets/logo-white.png';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  FileText,
  BarChart3,
  Calendar as CalendarIcon,
  Bell,
  Settings as SettingsIcon,
  Shield,
  User,
  LogOut,
  Search,
  ChevronDown
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { workspaces, currentWorkspace, setCurrentWorkspace, notifications, tasks, projects, members, documents } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const activeNotifications = notifications.filter(n => !n.isRead).length;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Members', path: '/members', icon: Users },
    { name: 'Documents', path: '/documents', icon: FileText },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
  ];

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults(null);
      return;
    }

    const lowerQ = q.toLowerCase();
    
    // Search Tasks, Projects, Members, Documents
    const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(lowerQ) || t.description.toLowerCase().includes(lowerQ));
    const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(lowerQ) || p.description.toLowerCase().includes(lowerQ));
    const filteredMembers = members.filter(m => m.name.toLowerCase().includes(lowerQ) || m.email.toLowerCase().includes(lowerQ));
    const filteredDocs = documents.filter(d => d.title.toLowerCase().includes(lowerQ) || d.content.toLowerCase().includes(lowerQ));

    setSearchResults({
      tasks: filteredTasks,
      projects: filteredProjects,
      members: filteredMembers,
      documents: filteredDocs
    });
  };

  const handleSearchResultClick = (type, id) => {
    setSearchQuery('');
    setSearchResults(null);
    if (type === 'task') navigate(`/tasks`);
    if (type === 'project') navigate(`/projects/${id}`);
    if (type === 'member') navigate(`/members`);
    if (type === 'document') navigate(`/documents`);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            textAlign: 'left',
            marginBottom: '0.5rem',
            padding: '0 0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <img src={logoBlack} alt="Doct Logo" style={{ height: '32px', width: 'auto', display: 'block' }} />
            <span style={{ 
              fontSize: '1.6rem', 
              fontWeight: 800, 
              color: '#1C1B1F', 
              letterSpacing: '0.02em',
              fontFamily: 'var(--font-heading)'
            }}>
              doct.
            </span>
          </div>
          
          {/* Workspace Switcher */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
              className="bauhaus-btn" 
              style={{ width: '100%', justifyContent: 'space-between', padding: '0.5rem 0.75rem', fontSize: '12px' }}
            >
              <span>{currentWorkspace ? currentWorkspace.name : 'Select Workspace'}</span>
              <ChevronDown size={14} />
            </button>
            
            {showWorkspaceMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    zIndex: 10,
                    marginTop: '2px',
                    overflow: 'hidden'
                  }}>
                {workspaces.map(ws => (
                  <div 
                    key={ws.id}
                    onClick={() => {
                      setCurrentWorkspace(ws);
                      setShowWorkspaceMenu(false);
                    }}
                    style={{
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--border)',
                      backgroundColor: currentWorkspace?.id === ws.id ? 'var(--hover)' : 'transparent'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = currentWorkspace?.id === ws.id ? 'var(--hover)' : 'transparent'}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{ws.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{ws.description}</div>
                  </div>
                ))}
                <div 
                  onClick={() => {
                    navigate('/settings');
                    setShowWorkspaceMenu(false);
                  }}
                  style={{ padding: '0.75rem 1rem', cursor: 'pointer', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', textAlign: 'center', backgroundColor: 'var(--border)' }}
                >
                  Manage Workspaces
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path}
                to={item.path}
                className={isActive ? 'active' : ''}
                style={{ textDecoration: 'none' }}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Admin panel link - visible only to Owner/Admin */}
          {(user?.role === 'Owner' || user?.role === 'Admin') && (
            <Link 
              to="/admin"
              className={location.pathname === '/admin' ? 'active' : ''}
              style={{
                marginTop: 'auto',
                textDecoration: 'none'
              }}
            >
              <Shield size={18} />
              <span>Admin Panel</span>
            </Link>
          )}
        </nav>

        {/* User profile & Role switcher */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
            <img 
              src={user?.avatar} 
              alt={user?.name} 
              style={{ width: '38px', height: '38px', objectFit: 'cover', border: '2px solid var(--border)', borderRadius: '50%' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 'bold', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'var(--font-heading)' }}>{user?.name}</div>
              <div className="bauhaus-badge" style={{ fontSize: '12px', padding: '1px 8px', border: '2px solid var(--border)', borderRadius: '9999px' }}>{user?.role}</div>
            </div>
            <button 
              onClick={logout}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Topbar Header */}
        <header className="appbar">
          
          {/* Search bar */}
          <div style={{ position: 'relative', width: '320px' }}>
            <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
              <Search size={16} />
            </div>
            <input 
              type="text" 
              placeholder="Search tasks, projects, files..."
              className="bauhaus-input"
              value={searchQuery}
              onChange={handleSearch}
              style={{ paddingLeft: '2.5rem', paddingRight: '1rem', height: '38px' }}
            />

            {searchResults && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'var(--card)',
                border: '2px solid var(--border)',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 20,
                marginTop: '4px'
              }}>
                {/* Tasks */}
                {searchResults.tasks.length > 0 && (
                  <div>
                    <div style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--border)', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Tasks</div>
                    {searchResults.tasks.map(t => (
                      <div 
                        key={t.id} 
                        onClick={() => handleSearchResultClick('task', t.id)}
                        style={{ padding: '0.5rem 0.75rem', cursor: 'pointer', borderBottom: '1px solid var(--border)', fontSize: '12px' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        {t.title}
                      </div>
                    ))}
                  </div>
                )}
                {/* Projects */}
                {searchResults.projects.length > 0 && (
                  <div>
                    <div style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--border)', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Projects</div>
                    {searchResults.projects.map(p => (
                      <div 
                        key={p.id} 
                        onClick={() => handleSearchResultClick('project', p.id)}
                        style={{ padding: '0.5rem 0.75rem', cursor: 'pointer', borderBottom: '1px solid var(--border)', fontSize: '12px' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        {p.name}
                      </div>
                    ))}
                  </div>
                )}
                {/* Documents */}
                {searchResults.documents.length > 0 && (
                  <div>
                    <div style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--border)', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>Documents</div>
                    {searchResults.documents.map(d => (
                      <div 
                        key={d.id} 
                        onClick={() => handleSearchResultClick('document', d.id)}
                        style={{ padding: '0.5rem 0.75rem', cursor: 'pointer', borderBottom: '1px solid var(--border)', fontSize: '12px' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        {d.title}
                      </div>
                    ))}
                  </div>
                )}
                {searchResults.tasks.length === 0 && searchResults.projects.length === 0 && searchResults.documents.length === 0 && (
                  <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px' }}>No matches found</div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/notifications" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--text-primary)' }}>
              <Bell size={20} />
              {activeNotifications > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--error)',
                  color: 'var(--bg-primary)',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  padding: '2px 5px',
                  lineHeight: 1
                }}>
                  {activeNotifications}
                </span>
              )}
            </Link>
            
            <Link to="/settings" style={{ display: 'flex', alignItems: 'center', color: 'var(--text-primary)' }}>
              <SettingsIcon size={20} />
            </Link>

            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', color: 'var(--text-primary)' }}>
              <User size={20} />
            </Link>
          </div>
        </header>

        {/* Page Inner Container */}
        <div style={{ flex: 1, padding: '2rem' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
