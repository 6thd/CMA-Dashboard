/**
 * Advanced Notification System
 * Toast notifications with queue management
 */

import React, { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, title, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div
      className={`${bgColors[type]} border rounded-lg shadow-lg p-4 mb-3 animate-slide-in flex items-start gap-3 max-w-md`}
      role="alert"
    >
      {icons[type]}
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const NotificationContainer: React.FC = () => {
  const notifications = useAppStore((state) => state.notifications);
  const removeNotification = useAppStore((state) => state.removeNotification);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.slice(0, 5).map((notification) => (
        <Toast
          key={notification.id}
          id={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

// Custom hook for notifications
export function useNotification() {
  const addNotification = useAppStore((state) => state.addNotification);

  return {
    success: (title: string, message: string) =>
      addNotification({ type: 'success', title, message }),
    error: (title: string, message: string) =>
      addNotification({ type: 'error', title, message }),
    warning: (title: string, message: string) =>
      addNotification({ type: 'warning', title, message }),
    info: (title: string, message: string) =>
      addNotification({ type: 'info', title, message }),
  };
}

export default NotificationContainer;
