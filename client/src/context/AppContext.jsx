import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';
import { io } from 'socket.io-client';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const pendingCreateKeysRef = useRef(new Set());
  
  // Workspaces
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [pendingInvitations, setPendingInvitations] = useState([]);

  // Members
  const [members, setMembers] = useState([]);

  // Projects
  const [projects, setProjects] = useState([]);

  // Tasks
  const [tasks, setTasks] = useState([]);

  // Documents
  const [documents, setDocuments] = useState([]);

  // Notifications
  const [notifications, setNotifications] = useState([]);

  // Activity Logs
  const [activityLogs, setActivityLogs] = useState([]);

  const currentWorkspaceRef = useRef(currentWorkspace);
  useEffect(() => {
    currentWorkspaceRef.current = currentWorkspace;
  }, [currentWorkspace]);

  const runWithCreateLock = async (key, action) => {
    if (pendingCreateKeysRef.current.has(key)) {
      return null;
    }

    pendingCreateKeysRef.current.add(key);
    try {
      return await action();
    } finally {
      pendingCreateKeysRef.current.delete(key);
    }
  };

  // Default workspace loading & creation
  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!user) return;
      try {
        // Fetch invitations
        const invRes = await api.get('/workspaces/invitations');
        if (invRes.data) {
          setPendingInvitations(invRes.data.map(w => ({ ...w, id: w._id || w.id })));
        }
      } catch (invErr) {
        console.warn('Failed to fetch workspace invitations:', invErr.message);
      }

      try {
        const wsRes = await api.get('/workspaces');
        if (wsRes.data && wsRes.data.length > 0) {
          const formatted = wsRes.data.map(w => ({ ...w, id: w._id || w.id }));
          setWorkspaces(formatted);
          setCurrentWorkspace(formatted[0]);
        } else {
          // If no workspaces exist, create a default one for this new user!
          try {
            const createRes = await api.post('/workspaces', {
              name: 'My Workspace',
              description: 'Default personal workspace area.'
            });
            if (createRes.data) {
              const newWS = { ...createRes.data, id: createRes.data._id || createRes.data.id };
              setWorkspaces([newWS]);
              setCurrentWorkspace(newWS);
            }
          } catch (createErr) {
            console.error('Failed to create default workspace:', createErr);
            // Fallback locally
            const localWS = {
              id: 'ws_default',
              name: 'My Workspace',
              description: 'Default personal workspace area.'
            };
            setWorkspaces([localWS]);
            setCurrentWorkspace(localWS);
          }
        }
      } catch (err) {
        console.warn('Server offline or workspaces fetch failed. Operating in local mode.', err.message);
        // Fallback local workspace
        const localWS = {
          id: 'ws_default',
          name: 'My Workspace',
          description: 'Default personal workspace area.'
        };
        setWorkspaces([localWS]);
        setCurrentWorkspace(localWS);
      }
    };

    fetchWorkspaces();
  }, [user]);

  // Initialize Socket.io connection
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const s = io(socketUrl, { autoConnect: false });
    
    s.connect();
    setSocket(s);

    s.on('connect', () => {
      console.log('Connected to Socket server.');
      if (currentWorkspaceRef.current) {
        s.emit('join_workspace', currentWorkspaceRef.current.id);
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

    s.on('member_joined', (newMember) => {
      setMembers(prev => {
        if (prev.some(m => m.id === newMember.id || m.id === newMember._id)) return prev;
        return [...prev, { ...newMember, id: newMember.id || newMember._id }];
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

        // Fetch members
        const membersRes = await api.get(`/workspaces/${currentWorkspace.id}/members`);
        if (membersRes.data) {
          setMembers(membersRes.data.map(m => ({ ...m, id: m.id || m._id })));
        }
      } catch (err) {
        console.warn('Server offline or request failed. operating on Local Workspace mode.', err.message);
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
    setNotifications(prev => {
      // Prevent duplicate notification within 2 seconds window
      const isDuplicate = prev.some(n => 
        n.title === title && 
        n.content === content && 
        (Date.now() - new Date(n.timestamp).getTime()) < 2000
      );
      if (isDuplicate) return prev;

      const newNotif = {
        id: `not_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        userId: user?.id || 'usr_member',
        title,
        content,
        isRead: false,
        type,
        timestamp: new Date().toISOString()
      };
      return [newNotif, ...prev];
    });
  };

  // Workspace CRUD
  const createWorkspace = async (name, description) => {
    const lockKey = `workspace:${(name || '').trim().toLowerCase()}`;
    return runWithCreateLock(lockKey, async () => {
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
          return serverWS;
        }
      } catch (e) {
        console.warn('Workspace api create failed, falling back locally');
      }

      return localWS;
    });
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
    if (!currentWorkspace) return null;
    const lockKey = `project:${currentWorkspace.id}:${(name || '').trim().toLowerCase()}:${(deadline || '').trim()}`;
    return runWithCreateLock(lockKey, async () => {
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
          setProjects(prev => {
            if (prev.some(p => p.id === serverProj.id)) return prev;
            return [...prev, serverProj];
          });
          return serverProj;
        }
      } catch (e) {
        console.warn('Project api create failed');
      }
      return null;
    });
  };

  const editProject = async (id, updatedData) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    logActivity('Updated Project', updatedData.name || id);
    try {
      await api.put(`/projects/${id}`, updatedData);
    } catch (e) {
      console.warn('Project api update failed');
    }
  };

  const deleteProject = async (id) => {
    const proj = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(p => p.id !== id));
    logActivity('Deleted Project', proj?.name || id);
    try {
      await api.delete(`/projects/${id}`);
    } catch (e) {
      console.warn('Project api delete failed');
    }
  };

  // Task CRUD
  const createTask = async (taskData) => {
    if (!currentWorkspace) return null;
    const lockKey = `task:${currentWorkspace.id}:${(taskData.title || '').trim().toLowerCase()}:${(taskData.projectId || '')}:${(taskData.dueDate || '')}`;
    return runWithCreateLock(lockKey, async () => {
      logActivity('Created Task', taskData.title);
      sendNotification('Task Created', `New task "${taskData.title}" has been created.`, 'task_created');

      try {
        const res = await api.post('/tasks', {
          workspaceId: currentWorkspace.id,
          ...taskData
        });
        if (res.data) {
          const serverTask = { ...res.data, id: res.data._id || res.data.id };
          setTasks(prev => {
            if (prev.some(t => t.id === serverTask.id)) return prev;
            return [...prev, serverTask];
          });
          return serverTask;
        }
      } catch (e) {
        console.warn('Task api create failed');
      }
      return null;
    });
  };

  const updateTask = async (id, updatedData) => {
    const existingTask = tasks.find(t => t.id === id);
    if (existingTask) {
      if (updatedData.status && updatedData.status !== existingTask.status) {
        logActivity('Updated Task Status', `${existingTask.title} -> ${updatedData.status}`);
        sendNotification('Task Updated', `Task "${existingTask.title}" status changed to ${updatedData.status}`, 'task_updated');
      } else {
        logActivity('Updated Task Details', existingTask.title);
      }
    }

    // Optimistic Update
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, ...updatedData };
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
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const subtask = { id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`, title, completed: false };
    const currentSubtasks = targetTask.subtasks || [];
    const updatedSubtasks = [...currentSubtasks, subtask];
    
    updateTask(taskId, { subtasks: updatedSubtasks });
    logActivity('Added Subtask', title);
  };

  const toggleSubtask = (taskId, subtaskId) => {
    if (!subtaskId) return;
    const targetTask = tasks.find(t => (t.id === taskId || t._id === taskId));
    if (!targetTask) return;

    const updatedSubtasks = (targetTask.subtasks || []).map(s => {
      const sId = (s._id || s.id || '').toString();
      return sId === subtaskId.toString() ? { ...s, completed: !s.completed } : s;
    });
    updateTask(taskId, { subtasks: updatedSubtasks });
  };

  const deleteSubtask = (taskId, subtaskId) => {
    if (!subtaskId) return;
    const targetTask = tasks.find(t => (t.id === taskId || t._id === taskId));
    if (!targetTask) return;

    const updatedSubtasks = (targetTask.subtasks || []).filter(s => {
      const sId = (s._id || s.id || '').toString();
      return sId !== subtaskId.toString();
    });
    updateTask(taskId, { subtasks: updatedSubtasks });
  };

  // Task Comments CRUD
  const addComment = (taskId, content) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const newComment = {
      id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      userId: user?.id || 'usr_member',
      content,
      timestamp: new Date().toISOString(),
      replies: []
    };
    
    const updatedComments = [...(targetTask.comments || []), newComment];
    updateTask(taskId, { comments: updatedComments });

    logActivity('Comment Added', `Added comment on task ${taskId}`);
    
    if (content.includes('@')) {
      const parts = content.split('@');
      if (parts.length > 1) {
        sendNotification('You were mentioned', `${user?.name} mentioned you in a comment: "${content.substring(0, 30)}..."`, 'mention');
      }
    } else {
      sendNotification('New Comment', `${user?.name} commented on task.`, 'comment');
    }
  };

  const deleteComment = (taskId, commentId) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const updatedComments = (targetTask.comments || []).filter(c => c.id !== commentId);
    updateTask(taskId, { comments: updatedComments });
  };

  // Task Attachments
  const addAttachment = (taskId, file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const fileStr = reader.result;
        const response = await api.post('/upload', { fileStr });
        const cloudinaryUrl = response.data.url;

        const newAtt = {
          id: `att_${Date.now()}`,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          url: cloudinaryUrl
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
      } catch (err) {
        console.error('Failed to upload attachment to Cloudinary:', err);
        alert('File upload failed: ' + (err.response?.data?.message || err.message));
      }
    };
    reader.readAsDataURL(file);
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
    if (!currentWorkspace) return null;
    const lockKey = `document:${currentWorkspace.id}:${(title || '').trim().toLowerCase()}:${parentId || 'root'}`;
    return runWithCreateLock(lockKey, async () => {
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
    });
  };

  const updateDocument = async (id, title, content) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, title, content } : d));
    logActivity('Edited Page', title);
    try {
      await api.put(`/documents/${id}`, { title, content });
    } catch (e) {
      console.warn('Document api update failed');
    }
  };

  const deleteDocument = async (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id && d.parentId !== id));
    logActivity('Deleted Page', id);
    try {
      await api.delete(`/documents/${id}`);
    } catch (e) {
      console.warn('Document api delete failed');
    }
  };

  // Member Management
  const inviteMember = async (email, role) => {
    const lockKey = `invite:${currentWorkspace?.id || 'none'}:${(email || '').trim().toLowerCase()}`;
    return runWithCreateLock(lockKey, async () => {
      const name = email.split('@')[0];
      const localMember = {
        id: `usr_${Date.now()}`,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        role,
        avatar: '',
        online: false
      };
      setMembers(prev => [...prev, localMember]);
      logActivity('Invited Member', email);
      sendNotification('Member Invited', `${email} has been invited as ${role}`, 'member_joined');

      try {
        const res = await api.post(`/workspaces/${currentWorkspace.id}/members`, { email, role });
        if (res.data) {
          const serverMember = { ...res.data, id: res.data.id || res.data._id };
          setMembers(prev => prev.map(m => m.id === localMember.id ? serverMember : m));
          return serverMember;
        }
      } catch (e) {
        console.warn('Invite member api failed');
      }
      return localMember;
    });
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

  const acceptInvitation = async (workspaceId) => {
    try {
      const res = await api.post(`/workspaces/${workspaceId}/accept`);
      if (res.data) {
        setPendingInvitations(prev => prev.filter(w => w.id !== workspaceId));
        const wsRes = await api.get('/workspaces');
        if (wsRes.data && wsRes.data.length > 0) {
          const formatted = wsRes.data.map(w => ({ ...w, id: w._id || w.id }));
          setWorkspaces(formatted);
          setCurrentWorkspace(formatted[formatted.length - 1]);
        }
      }
    } catch (e) {
      console.error('Failed to accept invitation:', e);
    }
  };

  const declineInvitation = async (workspaceId) => {
    try {
      await api.post(`/workspaces/${workspaceId}/decline`);
      setPendingInvitations(prev => prev.filter(w => w.id !== workspaceId));
    } catch (e) {
      console.error('Failed to decline invitation:', e);
    }
  };

  return (
    <AppContext.Provider value={{
      workspaces,
      currentWorkspace,
      setCurrentWorkspace,
      createWorkspace,
      editWorkspace,
      deleteWorkspace,
      pendingInvitations,
      acceptInvitation,
      declineInvitation,
      
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
