import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.js';
import Topbar from './Topbar.js';
import { Notification } from '../types.js';
import AIAssistant from './AIAssistant.js';
import { syllabusData } from '../data/curriculum.js';

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, read: false, type: 'submission', message: 'Jane Smith submitted "Calculus I Final".', timestamp: '5m ago' },
  { id: 2, read: false, type: 'registration', message: 'New student "Alex Ray" has registered.', timestamp: '2h ago' },
  { id: 3, read: true, type: 'high_score', message: 'Emily Davis scored 96% on "Modern Physics Midterm".', timestamp: '1d ago' },
  { id: 4, read: true, type: 'exam_published', message: 'New exam "Data Structures" has been published.', timestamp: '2d ago' },
];

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantContext, setAssistantContext] = useState<string | undefined>();

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const openAssistant = (context?: string) => {
    setAssistantContext(context);
    setIsAssistantOpen(true);
  };
  
  const openGlobalAssistant = () => {
    const globalContext = `The following curriculum study units are available:\n${syllabusData.map((unit: any) => `- ${unit.title}`).join('\n')}`;
    openAssistant(globalContext);
  }

  const closeAssistant = () => {
    setIsAssistantOpen(false);
    setTimeout(() => setAssistantContext(undefined), 300); // Delay clearing context for fade-out
  };

  // Capitalize the first letter and remove the leading slash
  const getPageTitle = (pathname: string) => {
    if (pathname === '/') return 'Dashboard';
    const title = pathname.replace('/', '').replace('-', ' ');
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  const pageTitle = getPageTitle(location.pathname);
  
  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  }

  return (
    <div className="flex h-screen font-sans bg-gray-900/50">
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <div className="relative z-0 flex flex-col flex-1 w-0"> {/* Added positioning context */}
        <Topbar 
          onMenuClick={() => setIsSidebarOpen(true)}
          title={pageTitle}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllRead={markAllAsRead}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 py-8">
            {children ? children : <Outlet context={{ openAssistant }} />}
          </div>
        </main>
      </div>
      <button
        onClick={openGlobalAssistant}
        className="fixed bottom-6 right-6 bg-secondary hover:bg-secondary-dark text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white z-20"
        aria-label="Open AI Assistant"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <title>AI Assistant Icon</title>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
      <AIAssistant isOpen={isAssistantOpen} onClose={closeAssistant} context={assistantContext} />
    </div>
  );
};

export default Layout;