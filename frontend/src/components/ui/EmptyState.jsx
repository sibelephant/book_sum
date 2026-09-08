import React from 'react';

export default function EmptyState({ title, description, icon, action }) {
  return (
    <div className="empty-state">
      {icon && (
        <div className="empty-icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="empty-title">{title}</h3>
      {description && <p className="empty-desc">{description}</p>}
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
}