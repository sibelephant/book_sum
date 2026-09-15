import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

const NotificationContext = createContext(null);

let idCounter = 0;

const SAMPLE_NOTIFICATIONS = [
  {
    id: ++idCounter,
    type: 'info',
    message: 'Welcome to Summara! Click any summary to review it.',
    read: false,
    timestamp: Date.now() - 60000,
  },
  {
    id: ++idCounter,
    type: 'success',
    message: 'Your account is ready. Start by uploading a book or pasting text.',
    read: false,
    timestamp: Date.now() - 30000,
  },
  {
    id: ++idCounter,
    type: 'tip',
    message: 'Tip: Use the quiz feature to test your understanding.',
    read: true,
    timestamp: Date.now() - 10000,
  },
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);

  const addNotification = useCallback((type, message) => {
    setNotifications((prev) => [
      { id: ++idCounter, type, message, read: false, timestamp: Date.now() },
      ...prev,
    ]);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismiss = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllRead,
      dismiss,
      clearAll,
    }),
    [notifications, unreadCount, addNotification, markAsRead, markAllRead, dismiss, clearAll]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
}
