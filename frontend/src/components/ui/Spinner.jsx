import React from 'react';

export default function Spinner({ size = 'md', label }) {
  return (
    <div className={`spinner-wrap`} role="status" aria-label={label || 'Loading'}>
      <span
        className={`spinner spinner-${size}`}
        aria-hidden="true"
      />
      {label && <span className="spinner-label">{label}</span>}
    </div>
  );
}