import React from 'react';

export default function Input({
  label,
  error,
  id,
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
      <input
        id={inputId}
        className={`input ${error ? 'input-error' : ''}`}
        aria-invalid={!!error}
        {...props}
      />
      {error && <div className="field-error">{error}</div>}
    </div>
  );
}