import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../context/ToastContext';

export default function Logo({ small = false }) {
  return (
    <span className={`logo ${small ? 'logo-small' : ''}`}>
      <span className="logo-mark" aria-hidden="true">
        <svg width={small ? 18 : 22} height={small ? 18 : 22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      </span>
      <span className="logo-text">Summara</span>
    </span>
  );
}

export function Sidebar({ active }) {
  const toast = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out');
  };

  const items = [
    { to: '/dashboard', label: 'Dashboard', icon: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z' },
    { to: '/new', label: 'New Summary', icon: 'M12 5v14M5 12h14' },
    { to: '/summaries', label: 'My Summaries', icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' },
    { to: '/profile', label: 'Profile', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
    { to: '/settings', label: 'Settings', icon: 'M19 14l-1.5-1.5a7 7 0 0 0 0-7L19 4M4 10l1.5 1.5a7 7 0 0 0 0 7L4 20M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Link to="/dashboard">
          <Logo small />
        </Link>
      </div>
      <nav className="sidebar-nav">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`sidebar-link ${active === item.to.replace('/', '') ? 'sidebar-link-active' : ''}`}
          >
            <svg
              className="sidebar-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={item.icon} />
            </svg>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button type="button" className="sidebar-link sidebar-logout" onClick={handleLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export function AppShell({ children, active }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  return (
    <div className={`app-shell ${mobileOpen ? 'app-shell-mobile' : ''}`}>
      <div className={`sidebar-mobile-overlay ${mobileOpen ? 'sidebar-mobile-overlay-open' : ''}`} onClick={() => setMobileOpen(false)} />
      <div className={`sidebar-mobile ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
        <Sidebar active={active} />
      </div>
      <div className="app-main">
        {children}
      </div>
    </div>
  );
}