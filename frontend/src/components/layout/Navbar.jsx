import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Navbar({ navLinks = [] }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <nav className={`navbar-links ${open ? 'navbar-links-open' : ''}`}>
          {navLinks.map((l, i) =>
            l.href ? (
              <a key={i} className="navbar-link" href={l.href}>
                {l.label}
              </a>
            ) : (
              <Link key={i} className="navbar-link" to={l.to}>
                {l.label}
              </Link>
            )
          )}
        </nav>
        <div className="navbar-actions">
          <Link className="btn btn-ghost btn-sm navbar-login" to="/login">
            Log in
          </Link>
          <Link className="btn btn-primary btn-sm" to="/register">
            Get started
          </Link>
        </div>
        <button
          type="button"
          className="navbar-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '×' : '☰'}
        </button>
      </div>
    </header>
  );
}