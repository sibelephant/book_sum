import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AppShell } from '../components/layout/Logo';
import TopBar from '../components/layout/TopBar';
import Button from '../components/ui/Button';
import QuizCard from '../components/ui/QuizCard';
import Spinner from '../components/ui/Spinner';
import { useUser } from '../hooks/useUser';
import { useToast } from '../context/ToastContext';
import { generateQuiz } from '../lib/api';
import { supabase } from '../lib/supabaseClient';

export default function Quiz() {
  const { user } = useUser();
  const location = useLocation();
  const toast = useToast();
  const state = location.state || {};

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(!state.text ? false : true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(false);
  const [score, setScore] = useState(0);
  const [percent, setPercent] = useState(0);
  const [retryKey, setRetryKey] = useState(0);

  React.useEffect(() => {
    if (!state.text) return;
    let mounted = true;
    (async () => {
      try {
        const data = await generateQuiz(state.text, 5);
        if (mounted) {
          setQuiz(data.quiz.length ? data.quiz : data);
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryKey]);

  const handleSelect = (idx) => {
    setAnswers((prev) => ({ ...prev, [current]: idx }));
  };

  const handleSubmit = () => {
    let correct = 0;
    quiz.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct += 1;
    });
    setScore(correct);
    setPercent(Math.round((correct / quiz.length) * 100));
    setResults(true);
    saveResult(correct);
  };

  const saveResult = async (correct) => {
    if (!user) return;
    await supabase.from('quizzes').insert({
      user_id: user.id,
      quiz_title: state.title || 'Quiz',
      score: correct,
      total: quiz.length,
    }).catch(() => {});
  };

  const retry = () => {
    setAnswers({});
    setResults(false);
    setCurrent(0);
    setScore(0);
    setPercent(0);
    setRetryKey((k) => k + 1);
  };

  if (loading) {
    return (
      <AppShell active="new">
        <TopBar user={user} />
        <div className="page-body">
          <div className="center-screen">
            <Spinner label="Generating quiz…" />
            <p className="page-sub" style={{ marginTop: '0.75rem' }}>Turning your summary into questions.</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!quiz) {
    return (
      <AppShell active="new">
        <TopBar user={user} />
        <div className="page-body">
          <div className="center-screen">
            <p className="page-sub">Generate a summary first, then create a quiz from it.</p>
          </div>
        </div>
      </AppShell>
    );
  }

  const questions = Array.isArray(quiz) ? quiz : quiz.quiz;
  const answeredCount = Object.keys(answers).length;

  return (
    <AppShell active="new">
      <TopBar user={user} />
      <div className="page-body">
        <div className="page-head">
          <div>
            <h1 className="page-title">{state.title || 'Quiz'}</h1>
            <p className="page-sub">
              {results
                ? 'Here’s how you did.'
                : `${Math.max(0, current + 1)} of ${questions.length} — answer each question then submit.`}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        {!results && (
          <div className="quiz-progress">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`quiz-progress-seg ${
                  i === current ? 'seg-current' : i < current ? 'seg-done' : ''
                }`}
              />
            ))}
          </div>
        )}

        {results ? (
          <div className="card quiz-results">
            <div className={`result-ring ${percent >= 50 ? 'ring-good' : 'ring-bad'}`}>
              <span className="result-ring-value">{percent}%</span>
            </div>
            <h2 className="result-title">
              {percent >= 80 ? 'Excellent!' : percent >= 50 ? 'Good effort!' : 'Keep practicing'}
            </h2>
            <p className="result-desc">
              You got {score} out of {questions.length} correct.
            </p>
            <div className="result-actions">
              <Button onClick={retry}>Retry quiz</Button>
              <Button variant="ghost" onClick={() => setCurrent(0)}>Review answers</Button>
            </div>
          </div>
        ) : (
          <>
            <QuizCard
              question={questions[current]}
              index={current}
              total={questions.length}
              selected={answers[current]}
              onSelect={handleSelect}
            />
            <div className="quiz-nav">
              <Button
                variant="ghost"
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
              >
                ← Previous
              </Button>
              <span className="quiz-nav-status">{answeredCount}/{questions.length} answered</span>
              {current < questions.length - 1 ? (
                <Button
                  onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
                  disabled={answers[current] === undefined}
                >
                  Next →
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={answeredCount < questions.length}>
                  Submit quiz
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}