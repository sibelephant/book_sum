import React from 'react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <div className="error-icon" aria-hidden="true">
        !
      </div>
      <h3 className="error-title">Something went wrong</h3>
      <p className="error-desc">{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-ghost btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}