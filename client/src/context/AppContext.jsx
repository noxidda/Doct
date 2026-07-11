import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';
import { io } from 'socket.io-client';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  
  // Workspaces
  const [workspaces, setWorkspaces] = useState([
    { id: 'ws_1', name: 'Doct Core Team', description: 'Main workspace for Doct platform development', avatar: 'D' },
    { id: 'ws_2', name: 'Doct Creative Studio', description: 'Branding and design exploration space', avatar: 'C' }
  ]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);

  // Members
  const [members, setMembers] = useState([
    { id: 'usr_owner', name: 'Arthur Bauhaus', email: 'owner@doct.com', role: 'Owner', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80', online: true },
    { id: 'usr_admin', name: 'Gropius Admin', email: 'admin@doct.com', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80', online: true },
    { id: 'usr_manager', name: 'Mies Manager', email: 'manager@doct.com', role: 'Manager', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80', online: false },
    { id: 'usr_member', name: 'Anni Albers', email: 'member@doct.com', role: 'Member', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', online: true }
  ]);

  // Projects
  const [projects, setProjects] = useState([
    { id: 'proj_1', workspaceId: 'ws_1', name: 'Doct Platform v1', description: 'Core product implementation phase 1', deadline: '2026-08-30', status: 'Active' },
    { id: 'proj_2', workspaceId: 'ws_1', name: 'Design System Guidelines', description: 'Creating the Doct css rules and guidelines', deadline: '2026-07-25', status: 'Active' },
    { id: 'proj_3', workspaceId: 'ws_1', name: 'Legacy Workspace Migrator', description: 'Data extraction scripts from old servers', deadline: '2026-05-15', status: 'Archived' }
  ]);

  // Tasks
  const [tasks, setTasks] = useState([
    {
      id: 'task_1',
      projectId: 'proj_1',
      workspaceId: 'ws_1',
      title: 'Setup Clerk Authentication Integration',
      description: 'Configure Clerk provider and construct JWT verification middlewares on backend.',
      priority: 'Critical',
      status: 'Todo',
      dueDate: '2026-07-15',
      assigneeId: 'usr_admin',
      subtasks: [
        { id: 'sub_1_1', title: 'Register Clerk application console', completed: true },
        { id: 'sub_1_2', title: 'Code Express verification route middleware', completed: false }
      ],
      comments: [
        { id: 'comm_1_1', userId: 'usr_owner', content: 'Make sure the session stores the fallback local credentials.', timestamp: '2026-07-10T12:00:00Z', replies: [] }
      ],
      attachments: []
    },
    {
      id: 'task_2',
      projectId: 'proj_1',
      workspaceId: 'ws_1',
      title: 'Design CSS Tokens & Grids',
      description: 'Implement typography variables and card components matching dark brown theme (#1C140D).',
      priority: 'High',
      status: 'In Progress',
      dueDate: '2026-07-12',
      assigneeId: 'usr_member',
      subtasks: [],
      comments: [],
      attachments: []
    }
  ]);

  // Documents
  const [documents, setDocuments] = useState([
    {
      id: 'doc_1',
      workspaceId: 'ws_1',
      title: 'Project Manifesto',
      content: '# Doct Project Manifesto\n\nWelcome to Doct.\n\n## Core Principles\n- **Simple Card Layouts:** Clean rounded borders.\n- **Velvety Wine Backdrop:** Organic wheat accents.',
      parentId: null,
      authorId: 'usr_owner',
      createdAt: '2026-07-01'
    }
  ]);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 'not_1', userId: 'usr_member', title: 'Task Assigned', content: 'You have been assigned to "Design CSS Tokens & Grids"', isRead: false, type: 'assignment', timestamp: '2026-07-10T14:30:00Z' }
  ]);

  // Activity Logs
  const [activityLogs, setActivityLogs] = useState([
    { id: 'log_1', workspaceId: 'ws_1', user: 'Arthur Bauhaus', action: 'Created Project', target: 'Doct Platform v1', timestamp: '2026-07-01T10:00:00Z' }
  ]);

  // Default workspace
  useEffect(() => {
    if (workspaces.length > 0 && !currentWorkspace) {
      setCurrentWorkspace(workspaces[0]);
    }
  }, [workspaces]);

  // Initialize Socket.io connection
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const s = io(socketUrl, { autoConnect: false });
    
    s.connect();
    setSocket(s);

    s.on('connect', () => {
      console.log('📡 Connected to Socket server.');
      if (currentWorkspace) {
        s.emit('join_workspace', currentWorkspace.id);
      }
    });

    s.on('task_created', (newTask) => {
      setTasks(prev => {
        if (prev.some(t => t.id === newTask._id || t.id === newTask.id)) return prev;
        return [...prev, { ...newTask, id: newTask._id || newTask.id }];
      });
    });

    s.on('task_updated', (updatedTask) => {
      setTasks(prev => prev.map(t => {
        if (t.id === updatedTask._id || t.id === updatedTask.id) {
          return { ...t, ...updatedTask, id: updatedTask._id || updatedTask.id };
        }
        return t;
      }));
    });

    s.on('task_deleted', ({ taskId }) => {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    });

    s.on('project_created', (newProj) => {
      setProjects(prev => {
        if (prev.some(p => p.id === newProj._id || p.id === newProj.id)) return prev;
        return [...prev, { ...newProj, id: newProj._id || newProj.id }];
      });
    });

    return () => {
      s.disconnect();
    };
  }, []);

  // Sync socket workspace room on switch
  useEffect(() => {
    if (socket && currentWorkspace) {
      socket.emit('join_workspace', currentWorkspace.id);
    }
  }, [currentWorkspace, socket]);

  // Fetch initial data from server
  useEffect(() => {
    const fetchData = async () => {
      if (!currentWorkspace) return;
      try {
        // Fetch workspaces
        const wsRes = await api.get('/workspaces');
        if (wsRes.data && wsRes.data.length > 0) {
          setWorkspaces(wsRes.data.map(w => ({ ...w, id: w._id || w.id })));
        }

        // Fetch projects
        const projRes = await api.get(`/workspaces/${currentWorkspace.id}/projects`);
        if (projRes.data) {
          setProjects(projRes.data.map(p => ({ ...p, id: p._id || p.id })));
        }

        // Fetch tasks
        const tasksRes = await api.get(`/workspaces/${currentWorkspace.id}/tasks`);
        if (tasksRes.data) {
          setTasks(tasksRes.data.map(t => ({ ...t, id: t._id || t.id })));
        }

        // Fetch documents
        const docsRes = await api.get(`/workspaces/${currentWorkspace.id}/documents`);
        if (docsRes.data) {
          setDocuments(docsRes.data.map(d => ({ ...d, id: d._id || d.id })));
        }
      } catch (err) {
        console.warn('⚠️ Server offline or request failed. operating on Local Workspace mode.', err.message);
      }
    };

    fetchData();
  }, [currentWorkspace]);

  // Activity log helper
  const logActivity = (action, target) => {
    const newLog = {
      id: `log_${Date.now()}`,
      workspaceId: currentWorkspace?.id || 'ws_1',
      user: user?.name || 'System',
      action,
      target,
      timestamp: new Date().toISOString()
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Push notifications helper
  const sendNotification = (title, content, type = 'system') => {
    const newNotif = {
      id: `not_${Date.now()}`,
      userId: user?.id || 'usr_member',
      title,
      content,
      isRead: false,
      type,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Workspace CRUD
  const createWorkspace = async (name, description) => {
    const localWS = {
      id: `ws_${Date.now()}`,
      name,
      description,
      avatar: name.charAt(0).toUpperCase()
    };
    
    // Optimistic local state update
    setWorkspaces(prev => [...prev, localWS]);
    setCurrentWorkspace(localWS);
    logActivity('Created Workspace', name);

    try {
      const res = await api.post('/workspaces', { name, description });
      if (res.data) {
        // Swap local id with server generated id
        const serverWS = { ...res.data, id: res.data._id || res.data.id };
        setWorkspaces(prev => prev.map(w => w.id === localWS.id ? serverWS : w));
        setCurrentWorkspace(serverWS);
      }
    } catch (e) {
      console.warn('Workspace api create failed, falling back locally');
    }
  };

  const editWorkspace = (id, updatedData) => {
    setWorkspaces(prev => prev.map(ws => ws.id === id ? { ...ws, ...updatedData } : ws));
    if (currentWorkspace?.id === id) {
      setCurrentWorkspace(prev => ({ ...prev, ...updatedData }));
    }
    logActivity('Updated Workspace Settings', updatedData.name || id);
  };

  const deleteWorkspace = (id) => {
    setWorkspaces(prev => prev.filter(ws => ws.id !== id));
    if (currentWorkspace?.id === id) {
      setCurrentWorkspace(workspaces.find(ws => ws.id !== id) || null);
    }
    logActivity('Deleted Workspace', id);
  };

  // Project CRUD
  const createProject = async (name, description, deadline) => {
    const localProj = {
      id: `proj_${Date.now()}`,
      workspaceId: currentWorkspace.id,
      name,
      description,
      deadline,
      status: 'Active'
    };

    setProjects(prev => [...prev, localProj]);
    logActivity('Created Project', name);

    try {
      const res = await api.post('/projects', {
        workspaceId: currentWorkspace.id,
        name,
        description,
        deadline
      });
      if (res.data) {
        const serverProj = { ...res.data, id: res.data._id || res.data.id };
        setProjects(prev => prev.map(p => p.id === localProj.id ? serverProj : p));
        return serverProj;
      }
    } catch (e) {
      console.warn('Project api create failed');
    }
    return localProj;
  };

  const editProject = (id, updatedData) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    logActivity('Updated Project', updatedData.name || id);
  };

  const deleteProject = (id) => {
    const proj = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(p => p.id !== id));
    logActivity('Deleted Project', proj?.name || id);
  };

  // Task CRUD
  const createTask = async (taskData) => {
    const localTask = {
      id: `task_${Date.now()}`,
      workspaceId: currentWorkspace.id,
      subtasks: [],
      comments: [],
      attachments: [],
      ...taskData
    };

    setTasks(prev => [...prev, localTask]);
    logActivity('Created Task', localTask.title);
    sendNotification('Task Created', `New task "${localTask.title}" has been created.`, 'task_created');

    try {
      const res = await api.post('/tasks', {
        workspaceId: currentWorkspace.id,
        ...taskData
      });
      if (res.data) {
        const serverTask = { ...res.data, id: res.data._id || res.data.id };
        setTasks(prev => prev.map(t => t.id === localTask.id ? serverTask : t));
        return serverTask;
      }
    } catch (e) {
      console.warn('Task api create failed');
    }
    return localTask;
  };

  const updateTask = async (id, updatedData) => {
    // Optimistic Update
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const merged = { ...t, ...updatedData };
        if (updatedData.status && updatedData.status !== t.status) {
          logActivity('Updated Task Status', `${t.title} -> ${updatedData.status}`);
          sendNotification('Task Updated', `Task "${t.title}" status changed to ${updatedData.status}`, 'task_updated');
        } else {
          logActivity('Updated Task Details', t.title);
        }
        return merged;
      }
      return t;
    }));

    try {
      await api.put(`/tasks/${id}`, updatedData);
    } catch (e) {
      console.warn('Task api update failed');
    }
  };

  const deleteTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    logActivity('Deleted Task', task?.title || id);

    try {
      await api.delete(`/tasks/${id}`);
    } catch (e) {
      console.warn('Task api delete failed');
    }
  };

  const duplicateTask = (id) => {
    const target = tasks.find(t => t.id === id);
    if (target) {
      createTask({
        title: `${target.title} (Copy)`,
        description: target.description,
        priority: target.priority,
        status: target.status,
        dueDate: target.dueDate,
        projectId: target.projectId,
        assigneeId: target.assigneeId
      });
    }
  };

  // Subtasks CRUD
  const addSubtask = (taskId, title) => {
    const subtask = { id: `sub_${Date.now()}`, title, completed: false };
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedSubtasks = [...t.subtasks, subtask];
        updateTask(taskId, { subtasks: updatedSubtasks });
        return { ...t, subtasks: updatedSubtasks };
      }
      return t;
    }));
    logActivity('Added Subtask', title);
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedSubtasks = t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s);
        updateTask(taskId, { subtasks: updatedSubtasks });
        return { ...t, subtasks: updatedSubtasks };
      }
      return t;
    }));
  };

  const deleteSubtask = (taskId, subtaskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedSubtasks = t.subtasks.filter(s => s.id !== subtaskId);
        updateTask(taskId, { subtasks: updatedSubtasks });
        return { ...t, subtasks: updatedSubtasks };
      }
      return t;
    }));
  };

  // Task Comments CRUD
  const addComment = (taskId, content) => {
    const newComment = {
      id: `comm_${Date.now()}`,
      userId: user?.id || 'usr_member',
      content,
      timestamp: new Date().toISOString(),
      replies: []
    };
    
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedComments = [...t.comments, newComment];
        updateTask(taskId, { comments: updatedComments });
        return { ...t, comments: updatedComments };
      }
      return t;
    }));

    logActivity('Comment Added', `Added comment on task ${taskId}`);
    
    if (content.includes('@')) {
      const parts = content.split('@');
      if (parts.length > 1) {
        const username = parts[1].split(' ')[0];
        sendNotification('You were mentioned', `${user?.name} mentioned you in a comment: "${content.substring(0, 30)}..."`, 'mention');
      }
    } else {
      sendNotification('New Comment', `${user?.name} commented on task.`, 'comment');
    }
  };

  const deleteComment = (taskId, commentId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedComments = t.comments.filter(c => c.id !== commentId);
        updateTask(taskId, { comments: updatedComments });
        return { ...t, comments: updatedComments };
      }
      return t;
    }));
  };

  // Task Attachments
  const addAttachment = (taskId, file) => {
    const newAtt = {
      id: `att_${Date.now()}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      url: '#'
    };
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedAttachments = [...t.attachments, newAtt];
        updateTask(taskId, { attachments: updatedAttachments });
        return { ...t, attachments: updatedAttachments };
      }
      return t;
    }));
    logActivity('Uploaded Attachment', file.name);
  };

  const deleteAttachment = (taskId, attId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedAttachments = t.attachments.filter(a => a.id !== attId);
        updateTask(taskId, { attachments: updatedAttachments });
        return { ...t, attachments: updatedAttachments };
      }
      return t;
    }));
  };

  // Documents CRUD
  const createDocument = async (title, content, parentId = null) => {
    const localDoc = {
      id: `doc_${Date.now()}`,
      workspaceId: currentWorkspace.id,
      title,
      content,
      parentId,
      authorId: user?.id || 'usr_member',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setDocuments(prev => [...prev, localDoc]);
    logActivity('Created Page', title);

    try {
      const res = await api.post('/documents', {
        workspaceId: currentWorkspace.id,
        title,
        content,
        parentId
      });
      if (res.data) {
        const serverDoc = { ...res.data, id: res.data._id || res.data.id };
        setDocuments(prev => prev.map(d => d.id === localDoc.id ? serverDoc : d));
        return serverDoc;
      }
    } catch (e) {
      console.warn('Document api create failed');
    }
    return localDoc;
  };

  const updateDocument = (id, title, content) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, title, content } : d));
    logActivity('Edited Page', title);
  };

  const deleteDocument = (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id && d.parentId !== id));
    logActivity('Deleted Page', id);
  };

  // Member Management
  const inviteMember = (email, role) => {
    const name = email.split('@')[0];
    const newMember = {
      id: `usr_${Date.now()}`,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${email}`,
      online: false
    };
    setMembers(prev => [...prev, newMember]);
    logActivity('Invited Member', email);
    sendNotification('Member Invited', `${email} has been invited as ${role}`, 'member_joined');
  };

  const removeMember = (id) => {
    const member = members.find(m => m.id === id);
    setMembers(prev => prev.filter(m => m.id !== id));
    logActivity('Removed Member', member?.name || id);
  };

  const changeMemberRole = (id, role) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m));
    logActivity('Changed Member Role', `${id} -> ${role}`);
  };

  // Notifications CRUD
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <AppContext.Provider value={{
      workspaces,
      currentWorkspace,
      setCurrentWorkspace,
      createWorkspace,
      editWorkspace,
      deleteWorkspace,
      
      members,
      inviteMember,
      removeMember,
      changeMemberRole,

      projects,
      createProject,
      editProject,
      deleteProject,

      tasks,
      createTask,
      updateTask,
      deleteTask,
      duplicateTask,

      addSubtask,
      toggleSubtask,
      deleteSubtask,

      addComment,
      deleteComment,

      addAttachment,
      deleteAttachment,

      documents,
      createDocument,
      updateDocument,
      deleteDocument,

      notifications,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      sendNotification,

      activityLogs,
      logActivity
    }}>
      {children}
    </AppContext.Provider>
  );
};
