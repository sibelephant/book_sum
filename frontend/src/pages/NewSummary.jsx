import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/Logo';
import TopBar from '../components/layout/TopBar';
import UploadCard from '../components/ui/UploadCard';
import Button from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { useNotification } from '../context/NotificationContext';
import { summarizeText } from '../lib/api';
import { useUser } from '../hooks/useUser';

const LENGTHS = [
  { id: 'short', label: 'Short', desc: 'A few key bullets' },
  { id: 'medium', label: 'Medium', desc: 'Balanced overview' },
  { id: 'detailed', label: 'Detailed', desc: 'Full deep dive' },
];

const STYLES = [
  { id: 'simple', label: 'Simple', desc: 'Plain, easy language' },
  { id: 'academic', label: 'Academic', desc: 'Formal, scholarly tone' },
  { id: 'bullets', label: 'Bullet points', desc: 'Scannable list' },
];

export default function NewSummary() {
  const navigate = useNavigate();
  const toast = useToast();
  const { addNotification } = useNotification();
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [mode, setMode] = useState('file');
  const [length, setLength] = useState('medium');
  const [style, setStyle] = useState('simple');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const canSubmit = mode === 'text' ? text.trim().length > 0 : !!file;

  const handleGenerate = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    setProgress(15);
    const timer = setInterval(() => {
      setProgress((p) => (p < 90 ? p + 5 : p));
    }, 200);
    try {
      setProgress(50);
      const data = await summarizeText(text, { length, style });
      clearInterval(timer);
      setProgress(100);
      addNotification('success', `Summary ready: ${title || 'Pasted text'}`);
      navigate('/result', {
        state: { summary: data.summary, sourceTitle: title || 'Pasted text', length, style },
      });
    } catch (err) {
      clearInterval(timer);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell active="new">
      <TopBar user={user} />
      <div className="page-body">
        <div className="page-head">
          <div>
            <h1 className="page-title">New Summary</h1>
            <p className="page-sub">Upload a document or paste text to generate an AI summary.</p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="segmented">
          <button
            type="button"
            className={`segmented-btn ${mode === 'file' ? 'segmented-active' : ''}`}
            onClick={() => setMode('file')}
          >
            📄 Upload file
          </button>
          <button
            type="button"
            className={`segmented-btn ${mode === 'text' ? 'segmented-active' : ''}`}
            onClick={() => setMode('text')}
          >
            ✏️ Paste text
          </button>
        </div>

        <div className="new-summary-grid">
          <div className="new-summary-main">
            {mode === 'file' ? (
              <div className="new-input-area">
                <UploadCard
                  label={file ? file.name : 'Drag & drop your PDF, DOCX, or image here'}
                  onFile={setFile}
                />
                {file && (
                  <div className="file-chip">
                    <span>Selected: {file.name}</span>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setFile(null)}>
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="new-input-area">
                <div className="field">
                  <label className="field-label" htmlFor="paste-title">Title (optional)</label>
                  <input
                    id="paste-title"
                    className="input"
                    placeholder="e.g. Chapter 1 of Atomic Habits"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="field-label" htmlFor="paste-text">Your text</label>
                  <textarea
                    id="paste-text"
                    className="textarea"
                    rows={10}
                    placeholder="Paste the content you want summarized here…"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
                <p className="char-count">{text.length.toLocaleString()} characters</p>
              </div>
            )}

            <Button
              onClick={handleGenerate}
              loading={loading}
              loadingText="Generating summary…"
              fullWidth
            >
              Generate Summary
            </Button>
            {loading && (
              <div className="progress-wrap">
                <div className="progressbar wide">
                  <div className="progressbar-track">
                    <div className="progressbar-fill" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="progressbar-label">{progress}%</span>
                </div>
              </div>
            )}
          </div>

          <div className="new-summary-side">
            <div className="card side-card">
              <h3 className="side-card-title">Summary length</h3>
              <div className="option-list">
                {LENGTHS.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    className={`option-btn ${length === l.id ? 'option-active' : ''}`}
                    onClick={() => setLength(l.id)}
                  >
                    <span className="option-label">{l.label}</span>
                    <span className="option-desc">{l.desc}</span>
                  </button>
                ))}
              </div>

              <h3 className="side-card-title" style={{ marginTop: '1.75rem' }}>Summary style</h3>
              <div className="option-list">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`option-btn ${style === s.id ? 'option-active' : ''}`}
                    onClick={() => setStyle(s.id)}
                  >
                    <span className="option-label">{s.label}</span>
                    <span className="option-desc">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}