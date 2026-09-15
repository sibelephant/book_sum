import React, { useEffect, useRef } from 'react';
import { useNotification } from '../../context/NotificationContext';

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const TYPE_ICON = {
  success: '✓',
  error: '!',
  info: 'ℹ',
  tip: '💡',
};

export default function NotificationPanel({ open, onClose }) {
  const { notifications, markAsRead, markAllRead, dismiss, clearAll, unreadCount } =
    useNotification();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="notif-panel" ref={panelRef} role="menu" aria-label="Notifications">
      <div className="notif-panel-header">
        <h4 className="notif-panel-title">Notifications</h4>
        <div className="notif-panel-actions">
          {unreadCount > 0 && (
            <button type="button" className="notif-panel-action" onClick={markAllRead}>
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button type="button" className="notif-panel-action notif-panel-action-danger" onClick={clearAll}>
              Clear all
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="notif-panel-empty">
          <p>No notifications yet.</p>
        </div>
      ) : (
        <ul className="notif-list">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`notif-item ${n.read ? '' : 'notif-item-unread'}`}
              onClick={() => markAsRead(n.id)}
              role="menuitem"
            >
              <span className={`notif-icon notif-icon-${n.type}`}>
                {TYPE_ICON[n.type] || 'ℹ'}
              </span>
              <div className="notif-body">
                <p className="notif-message">{n.message}</p>
                <span className="notif-time">{timeAgo(n.timestamp)}</span>
              </div>
              <button
                type="button"
                className="notif-dismiss"
                onClick={(e) => {
                  e.stopPropagation();
                  dismiss(n.id);
                }}
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
