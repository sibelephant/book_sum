import React from 'react';

export default function TextArea({
  label,
  error,
  id,
  rows = 4,
  className = '',
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={`field ${className}`}>
      {label && (
        <label className="field-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`textarea ${error ? 'input-error' : ''}`}
        aria-invalid={!!error}
        {...props}
      />
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}