import React from 'react';

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const LENGTH_LABELS = {
  short: 'Short',
  medium: 'Medium',
  detailed: 'Detailed',
};

const STYLE_LABELS = {
  simple: 'Simple',
  academic: 'Academic',
  bullets: 'Bullet points',
};

export default function SummaryCard({ summary, onOpen, onDownload, onDelete }) {
  const { title, created_at, length, style, excerpt } = summary;
  return (
    <div className="summary-card">
      <div className="summary-card-top">
        <div className="summary-card-icon" aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        </div>
        <div className="summary-card-meta">
          <h3 className="summary-card-title">{title || 'Untitled summary'}</h3>
          <p className="summary-card-date">{formatDate(created_at)}</p>
        </div>
      </div>
      {excerpt && <p className="summary-card-excerpt">{excerpt}</p>}
      <div className="summary-card-tags">
        {length && <span className="tag tag-indigo">{LENGTH_LABELS[length] || length}</span>}
        {style && <span className="tag tag-emerald">{STYLE_LABELS[style] || style}</span>}
      </div>
      <div className="summary-card-actions">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onOpen}
        >
          Open
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onDownload}
        >
          Download
        </button>
        <button
          type="button"
          className="btn btn-icon-danger btn-sm"
          onClick={onDelete}
          aria-label="Delete summary"
        >
          Delete
        </button>
      </div>
    </div>
  );
}