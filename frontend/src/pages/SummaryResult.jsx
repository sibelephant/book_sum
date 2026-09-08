import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/Logo';
import TopBar from '../components/layout/TopBar';
import Button from '../components/ui/Button';
import { useUser } from '../hooks/useUser';
import { useToast } from '../context/ToastContext';
import { generateAudio } from '../lib/api';
import { supabase } from '../lib/supabaseClient';

export default function SummaryResult() {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const state = location.state || {};

  const [summary] = useState(state.summary || '');
  const [title] = useState(state.sourceTitle || 'Untitled summary');
  const [saving, setSaving] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [listening, setListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState(null);

  if (!summary) {
    return (
      <AppShell active="new">
        <TopBar user={user} />
        <div className="page-body">
          <div className="center-screen">
            <p className="page-sub">No summary to display. Generate one first.</p>
            <Button onClick={() => navigate('/new')}>New Summary</Button>
          </div>
        </div>
      </AppShell>
    );
  }

  const download = () => {
    const blob = new Blob([summary], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Summary downloaded');
  };

  const save = async () => {
    if (!user) {
      toast.error('Log in to save summaries.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('summaries').insert({
      user_id: user.id,
      title,
      content: summary,
      length: state.length || 'medium',
      style: state.style || 'simple',
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Summary saved');
  };

  const handleQuiz = async () => {
    navigate('/quiz', { state: { text: summary, title } });
  };

  const handleListen = async () => {
    if (audioUrl) {
      audioRef?.play();
      setIsPlaying(true);
      return;
    }
    setListening(true);
    try {
      const blob = await generateAudio(summary);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setIsPlaying(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setListening(false);
    }
  };

  return (
    <AppShell active="new">
      <TopBar user={user} />
      <div className="page-body">
        <div className="page-head">
          <div>
            <h1 className="page-title">{title}</h1>
            <p className="page-sub">Your AI summary is ready.</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/new')}>
            + Generate another
          </Button>
        </div>

        <div className="result-actions">
          <Button onClick={handleQuiz}>Generate Quiz</Button>
          <Button variant="secondary" onClick={handleListen} loading={listening} loadingText="Generating audio…">
            {isPlaying ? 'Playing…' : 'Listen to Summary'}
          </Button>
          <Button variant="secondary" onClick={download}>Download</Button>
          <Button variant="ghost" onClick={save} loading={saving} loadingText="Saving…">
            Save
          </Button>
        </div>

        {audioUrl && (
          <div className="audio-player">
            <audio ref={setAudioRef} controls src={audioUrl} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}>
              Your browser doesn't support audio playback.
            </audio>
          </div>
        )}

        <div className="reading-panel">
          <div className="reading-prose">{summary}</div>
        </div>
      </div>
    </AppShell>
  );
}