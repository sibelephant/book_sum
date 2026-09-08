import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { AppShell } from '../components/layout/Logo';
import TopBar from '../components/layout/TopBar';
import { useUser } from '../hooks/useUser';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import SummaryCard from '../components/ui/SummaryCard';

const ICONS = {
  summaries: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
  quizzes: 'M8 12h8M9 16h6M12 8h.01M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16z',
  uploads: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
};

export default function Dashboard() {
  const { user, loading } = useUser();
  const [summaries, setSummaries] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from('summaries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(4);
      if (!error && mounted) setSummaries(data || []);
      if (mounted) setDataLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [user]);

  if (loading) {
    return (
      <div className="center-screen">
        <Spinner label="Loading…" />
      </div>
    );
  }

  const stats = [
    { label: 'Total Summaries', value: summaries.length, icon: ICONS.summaries, tint: 'indigo' },
    { label: 'Total Quizzes', value: '—', icon: ICONS.quizzes, tint: 'emerald' },
    { label: 'Documents Uploaded', value: summaries.length, icon: ICONS.uploads, tint: 'amber' },
  ];

  return (
    <AppShell active="dashboard">
      <TopBar user={user} />
      <div className="page-body">
        <div className="page-head">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-sub">Here’s what’s happening with your summaries.</p>
          </div>
          <Link to="/new" className="btn btn-primary">+ New Summary</Link>
        </div>

        <div className="stats-grid">
          {stats.map((s) => (
            <div key={s.label} className={`stat-card stat-${s.tint}`}>
              <div className="stat-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={s.icon} />
                </svg>
              </div>
              <div>
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="section-block">
          <div className="section-head-row">
            <h2 className="section-title-sm">Recent Summaries</h2>
            <Link to="/summaries" className="link-indigo">View all</Link>
          </div>
          {dataLoading ? (
            <div className="center-pad"><Spinner label="Loading summaries…" /></div>
          ) : summaries.length === 0 ? (
            <EmptyState
              icon="📚"
              title="No summaries yet"
              description="Create your first summary and it will show up here."
              action={<Link to="/new" className="btn btn-primary">Create a summary</Link>}
            />
          ) : (
            <div className="grid-2">
              {summaries.map((s) => (
                <SummaryCard
                  key={s.id}
                  summary={s}
                  onOpen={() => {}}
                  onDownload={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}