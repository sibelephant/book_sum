import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import NewSummary from './pages/NewSummary';
import SummaryResult from './pages/SummaryResult';
import Quiz from './pages/Quiz';
import MySummaries from './pages/MySummaries';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <NotificationProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new" element={<NewSummary />} />
            <Route path="/result" element={<SummaryResult />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/summaries" element={<MySummaries />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </NotificationProvider>
    </ToastProvider>
  );
}

export default App;