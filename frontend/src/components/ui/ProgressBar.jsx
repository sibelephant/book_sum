import React from 'react';

export default function ProgressBar({ value, max = 100, showLabel = true }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="progressbar" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div className="progressbar-track">
        <div className="progressbar-fill" style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <span className="progressbar-label">{Math.round(pct)}%</span>}
    </div>
  );
}