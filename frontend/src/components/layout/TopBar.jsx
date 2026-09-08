import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../ui/SearchBar';

export default function TopBar({ user }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (q) => {
    setQuery(q);
    if (q.trim()) navigate(`/summaries?q=${encodeURIComponent(q.trim())}`);
  };

  const initials = (user?.email || 'U')
    .split('@')[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="topbar">
      <div className="topbar-mobile-brand" aria-hidden="true" />
      <SearchBar value={query} onChange={handleSearch} placeholder="Search your summaries…" />
      <div className="topbar-right">
        <button type="button" className="topbar-notif" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
          <span className="topbar-notif-dot" />
        </button>
        <button
          type="button"
          className="topbar-user"
          onClick={() => navigate('/profile')}
          aria-label="Open profile"
        >
          <span className="avatar">{initials}</span>
        </button>
      </div>
    </header>
  );
}