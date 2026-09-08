import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Logo from '../components/layout/Logo';

const FEATURES = [
  {
    icon: 'M12 3v12m0 0l-3-3m3 3l3-3M3 21h18',
    title: 'AI Summarization',
    desc: 'Upload a book or paste any text and get a clear, structured summary in seconds.',
  },
  {
    icon: 'M8 12h8M9 16h6M12 8h.01M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16z',
    title: 'Quiz Generation',
    desc: 'Turn any summary into a multiple-choice quiz to test what you learned.',
  },
  {
    icon: 'M9 18V5l12-2v13M9 18a2 2 0 1 1-2 2 2 2 0 0 1 2-2zm12-2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z',
    title: 'Audio Summary',
    desc: 'Listen to your summary on the go with natural AI text-to-speech.',
  },
  {
    icon: 'M20 7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2m2-2V5a2 2 0 0 1 2-2h3l2.5 3H15a2 2 0 0 1 2 2v7H6a2 2 0 0 0-2 2z',
    title: 'Secure Storage',
    desc: 'Your summaries and documents are saved safely so you can revisit them anytime.',
  },
];

export default function Landing() {
  return (
    <div className="landing-page">
      <Navbar
        navLinks={[
          { to: '/', label: 'Home' },
          { href: '#features', label: 'Features' },
          { to: '/login', label: 'Login' },
          { to: '/register', label: 'Get Started' },
        ]}
      />

      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="hero-eyebrow">AI Book Summarization</p>
            <h1 className="hero-title">
              Read less.<br />
              <span className="hero-accent">Understand more.</span>
            </h1>
            <p className="hero-desc">
              Summara turns any book or long document into a clear AI summary,
              a quiz to test yourself, and audio you can listen to anywhere.
            </p>
            <div className="hero-cta">
              <Link to="/register" className="btn btn-primary btn-lg">
                Get started — it's free
              </Link>
              <a href="#features" className="btn btn-ghost btn-lg">
                See how it works
              </a>
            </div>
            <p className="hero-note">No credit card required · Works with PDF, DOCX, and more</p>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="book-stack">
              <div className="book book-1">
                <span className="book-title">Atomic Habits</span>
                <span className="book-author">J. Clear</span>
              </div>
              <div className="book book-2">
                <span className="book-title">The Design of Everyday Things</span>
                <span className="book-author">D. Norman</span>
              </div>
              <div className="book book-3">
                <span className="book-title">Thinking, Fast and Slow</span>
                <span className="book-author">D. Kahneman</span>
              </div>
            </div>
            <div className="hero-card hero-card-summary">
              <span className="hero-card-label">AI Summary</span>
              <p className="hero-card-text">
                “Habits compound. Small daily actions produce remarkable results over time…”
              </p>
              <span className="hero-card-tag">Summarized in 12s</span>
            </div>
            <div className="hero-card hero-card-quiz">
              <span className="hero-card-label">Quiz ready</span>
              <div className="hero-quiz-dots">
                <span className="dot dot-fill" />
                <span className="dot dot-fill" />
                <span className="dot dot-fill" />
                <span className="dot" />
                <span className="dot" />
              </div>
              <span className="hero-card-tag">4 / 5 correct</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-head">
            <p className="section-eyebrow">Everything you need</p>
            <h2 className="section-title">
              From a wall of text to a clear takeaway
            </h2>
            <p className="section-desc">
              Summara does the heavy lifting so you can focus on what matters:
              actually understanding the book.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon" aria-hidden="true">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={f.icon} />
                  </svg>
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="container cta-inner">
          <h2 className="cta-title">Your next book is waiting to be summarized.</h2>
          <p className="cta-desc">
            Create a free account and see how fast understanding happens.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Start summarizing
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <Logo small />
          <p className="footer-tagline">AI book summarization for curious people.</p>
          <p className="footer-copy">© {new Date().getFullYear()} Summara. Built as a final-year project.</p>
        </div>
      </footer>
    </div>
  );
}