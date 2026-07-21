import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Check, Trash2, Eye, Calendar, User, Mail } from 'lucide-react';

const Notifications = () => {
  const { 
    notifications, markNotificationRead, markAllNotificationsRead, deleteNotification,
    activityLogs, pendingInvitations, acceptInvitation, declineInvitation
  } = useApp();

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const totalUnreadCount = unreadNotifications.length + pendingInvitations.length;

  const invitationNotifications = pendingInvitations.map(inv => ({
    id: `inv_${inv.id}`,
    title: `Workspace Invitation: ${inv.name.toUpperCase()}`,
    content: `You have been invited to participate in the "${inv.name}" workspace by ${inv.owner?.name || 'Administrator'} (${inv.owner?.email || ''}).`,
    timestamp: inv.createdAt || new Date().toISOString(),
    isRead: false,
    type: 'invitation',
    workspaceId: inv.id
  }));

  const allNotifications = [...invitationNotifications, ...notifications];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Notifications Panel */}
      <div className="bauhaus-card" style={{ margin: 0 }}>
        <div className="bauhaus-card-header">
          <div>
            <h2 style={{ margin: 0, fontSize: '1.75rem' }}>INBOX STREAMS</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '0.25rem' }}>
              You have <strong>{totalUnreadCount}</strong> unread transmissions.
            </p>
          </div>
          
          {unreadNotifications.length > 0 && (
            <button 
              onClick={markAllNotificationsRead} 
              className="bauhaus-btn bauhaus-btn-success"
              style={{ padding: '0.4rem 1rem', fontSize: '12px' }}
            >
              <Check size={14} />
              <span>Mark All Read</span>
            </button>
          )}
        </div>

        {/* Notifications list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {allNotifications.map(notif => (
            <div 
              key={notif.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                border: '2px solid var(--border)',
                backgroundColor: notif.isRead ? 'transparent' : 'var(--hover)',
                opacity: notif.isRead ? 0.7 : 1
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                <div style={{
                  padding: '0.5rem',
                  backgroundColor: notif.isRead ? 'var(--border)' : 'var(--text-primary)',
                  color: notif.isRead ? 'var(--text-primary)' : 'var(--bg-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px'
                }}>
                  {notif.type === 'invitation' ? <Mail size={18} /> : <Bell size={18} />}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '14px', textTransform: 'none' }}>{notif.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '0.25rem' }}>{notif.content}</p>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{new Date(notif.timestamp).toLocaleString()}</span>
                  
                  {notif.type === 'invitation' && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                      <button 
                        onClick={() => acceptInvitation(notif.workspaceId)} 
                        className="bauhaus-btn bauhaus-btn-success"
                        style={{ padding: '0.35rem 0.8rem', fontSize: '11px' }}
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => declineInvitation(notif.workspaceId)} 
                        className="bauhaus-btn bauhaus-btn-danger"
                        style={{ padding: '0.35rem 0.8rem', fontSize: '11px' }}
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                {notif.type !== 'invitation' && !notif.isRead && (
                  <button 
                    onClick={() => markNotificationRead(notif.id)}
                    className="bauhaus-btn" 
                    style={{ padding: '0.4rem', border: '1px solid var(--border)' }}
                    title="Mark as read"
                  >
                    <Check size={14} />
                  </button>
                )}
                {notif.type !== 'invitation' && (
                  <button 
                    onClick={() => deleteNotification(notif.id)}
                    className="bauhaus-btn bauhaus-btn-danger" 
                    style={{ padding: '0.4rem', border: '1px solid var(--error)' }}
                    title="Delete transmission"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {allNotifications.length === 0 && (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '3rem 0' }}>
              No incoming messages registered.
            </div>
          )}
        </div>
      </div>

      {/* Global Activity Logs Panel (Module 14) */}
      <div className="bauhaus-card" style={{ margin: 0 }}>
        <div className="bauhaus-card-header">
          <h3>GLOBAL AUDIT LOGS</h3>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>RUNTIME HISTORY</span>
        </div>

        <div className="bauhaus-table-container">
          <table className="bauhaus-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Operator User</th>
                <th>Operation Event</th>
                <th>Target Element</th>
              </tr>
            </thead>
            <tbody>
              {activityLogs.map(log => (
                <tr key={log.id}>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td style={{ fontWeight: 'bold' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <User size={12} />
                      <span>{log.user}</span>
                    </div>
                  </td>
                  <td>{log.action}</td>
                  <td style={{ fontWeight: 'bold' }}>{log.target}</td>
                </tr>
              ))}
              {activityLogs.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No audit logs recorded in this session.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Notifications;
