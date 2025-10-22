import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar.js';
import Topbar from './Topbar.js';
import { Notification } from '../types.js';
import AIAssistant from './AIAssistant.js';
import { syllabusData } from '../data/curriculum.js';
import { Toaster } from 'react-hot-toast';
import { setLanguage } from '../services/languageService.js';

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
  const { t, i18n } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantContext, setAssistantContext] = useState<string | undefined>();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location, isMobile]);

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
    if (pathname === '/') return 'dashboard';
    const title = pathname.replace('/', '').replace('-', ' ');
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  const pageTitle = getPageTitle(location.pathname);
  
  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  }

  const changeLanguage = async (lng: string) => {
    console.log('Layout: Changing language to:', lng);
    // Change language in frontend
    i18n.changeLanguage(lng);
    
    // Notify backend about language change
    try {
      await setLanguage(lng);
    } catch (error) {
      console.error('Failed to set language on backend:', error);
    }
  };

  return (
    <div className="flex h-screen font-tajawal bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <div className="relative z-0 flex flex-col flex-1 w-0">
        <Topbar 
          onMenuClick={() => setIsSidebarOpen(true)}
          title={t(pageTitle)}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllRead={markAllAsRead}
          onChangeLanguage={changeLanguage}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 py-6">
            {children ? children : <Outlet context={{ openAssistant }} />}
          </div>
        </main>
      </div>
      <button
        onClick={openGlobalAssistant}
        className="fixed bottom-6 right-6 bg-gradient-secondary hover:bg-secondary-dark text-white w-14 h-14 rounded-full flex items-center justify-center shadow-glass-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-secondary z-20"
        aria-label="Open AI Assistant"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <title>AI Assistant Icon</title>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
      <AIAssistant isOpen={isAssistantOpen} onClose={closeAssistant} context={assistantContext} />
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'bg-surface border border-white/20 text-gray-100',
          style: {
            background: 'rgba(30, 41, 59, 0.9)',
            color: '#e2e8f0',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '0.75rem',
          },
        }}
      />
    </div>
  );
};

export default Layout;