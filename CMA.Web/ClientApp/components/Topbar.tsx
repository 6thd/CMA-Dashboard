import React, { useState, useRef, useEffect } from 'react';
import { Notification, User, UserRole } from '../types.js';
import { useUser } from '../contexts/UserContext.js';
import { useTranslation } from 'react-i18next';

interface TopbarProps {
  onMenuClick: () => void;
  title: string;
  notifications: Notification[];
  unreadCount: number;
  onMarkAllRead: () => void;
  onChangeLanguage: (lng: string) => void;
}

const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
  const commonClasses = 'w-8 h-8 p-1.5 rounded-full flex-shrink-0';
  switch (type) {
    case 'submission':
      return (
        <div className={`bg-blue-500/30 text-blue-300 ${commonClasses}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
      );
    case 'registration':
      return (
        <div className={`bg-green-500/30 text-green-300 ${commonClasses}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.75 3.75 0 1 1-6.75 0 3.75 3.75 0 0 1 6.75 0ZM4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25h-15a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        </div>
      );
    case 'high_score':
      return (
        <div className={`bg-yellow-500/30 text-yellow-300 ${commonClasses}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
            />
          </svg>
        </div>
      );
    case 'exam_published':
      return (
        <div className={`bg-purple-500/30 text-purple-300 ${commonClasses}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
            />
          </svg>
        </div>
      );
    default:
      return null;
  }
};

const Topbar: React.FC<TopbarProps> = ({
  onMenuClick,
  title,
  notifications,
  unreadCount,
  onMarkAllRead,
  onChangeLanguage,
}) => {
  const { t, i18n } = useTranslation();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const { currentUser, setCurrentUser } = useUser();

  // Add console log to verify i18n is working
  useEffect(() => {
    console.log('Current language:', i18n.language);
    console.log('Available languages:', i18n.options.supportedLngs);
  }, [i18n.language, i18n.options.supportedLngs]);

  const MOCK_USERS: Record<UserRole, User> = {
    Admin: { id: 'user1', name: 'Admin User', role: 'Admin' },
    Moderator: { id: 'user2', name: 'Moderator User', role: 'Moderator' },
    'Content Creator': { id: 'user3', name: 'Content Creator', role: 'Content Creator' },
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentUser(MOCK_USERS[role]);
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNotificationsOpen(false);
        setIsUserMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const handleLanguageChange = (lng: string) => {
    console.log('Changing language to:', lng);
    onChangeLanguage(lng);
    setIsLanguageMenuOpen(false);
  };

  return (
    <header className="relative z-30 h-16 bg-surface/80 backdrop-blur-xl border-b border-white/10 flex-shrink-0 flex items-center justify-between px-4 md:px-6 shadow-glass">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="md:hidden text-white mr-4 p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-white text-shadow">{title}</h1>
      </div>

      {/* Search - Hidden on mobile by default, shown when search button is clicked */}
      <div className="hidden md:flex relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-64 px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 text-white placeholder-gray-400 focus:outline-none"
        />
        <button
          aria-label="Search"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none focus:text-white transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile search button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="text-white p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
          aria-label="Search"
          aria-expanded={isSearchOpen ? 'true' : 'false'}
          aria-controls="mobile-search-panel"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </button>

        {/* Mobile search input */}
        {isSearchOpen && (
          <div
            id="mobile-search-panel"
            className="absolute right-0 mt-2 w-64 bg-surface/90 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl z-50 p-2"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 bg-white/10 rounded-lg border border-white/20 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 text-white placeholder-gray-400 focus:outline-none"
                autoFocus
              />
              <button
                aria-label="Search"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none focus:text-white transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notifications Dropdown */}
      <div className="relative" ref={notificationsRef}>
        <button
          onClick={() => setIsNotificationsOpen(prev => !prev)}
          className="relative text-white p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
          aria-label={`Notifications (${unreadCount} unread)`}
          aria-expanded={isNotificationsOpen ? 'true' : 'false'}
          aria-haspopup="menu"
          aria-controls="notifications-panel"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a1 1 0 10-2 0v.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            ></path>
          </svg>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </button>

        {isNotificationsOpen && (
          <div
            id="notifications-panel"
            className="absolute right-0 mt-2 w-80 max-w-sm bg-surface/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl z-50 text-white animate-fade-in"
            role="dialog"
            aria-labelledby="notifications-heading"
          >
            <div className="flex justify-between items-center p-4 border-b border-white/20">
              <h2 id="notifications-heading" className="font-semibold text-shadow">
                Notifications
              </h2>
              <button
                onClick={onMarkAllRead}
                className="text-sm text-blue-300 hover:underline disabled:text-gray-400 disabled:no-underline focus:outline-none focus:underline transition-all duration-200"
                disabled={unreadCount === 0}
              >
                Mark all as read
              </button>
            </div>
            <ul className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(n => (
                  <li
                    key={n.id}
                    className={`p-4 border-b border-white/10 flex items-start gap-3 hover:bg-white/10 transition-colors duration-200 ${!n.read ? '' : 'opacity-60'}`}
                  >
                    <NotificationIcon type={n.type} />
                    <div className="flex-1">
                      <p className="text-sm">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{n.timestamp}</p>
                    </div>
                    {!n.read && (
                      <div className="w-2.5 h-2.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    )}
                  </li>
                ))
              ) : (
                <li className="p-6 text-center text-sm text-gray-300">
                  You have no new notifications.
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* User Menu Dropdown */}
      <div className="relative" ref={userMenuRef}>
        <button
          onClick={() => setIsUserMenuOpen(prev => !prev)}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
          aria-label="User menu"
          aria-expanded={isUserMenuOpen ? 'true' : 'false'}
          aria-haspopup="menu"
          aria-controls="user-menu-panel"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-white text-shadow">
            {currentUser.name.charAt(0)}
          </div>
          <span className="hidden md:inline text-white text-sm font-medium">
            {currentUser.name}
          </span>
        </button>

        {isUserMenuOpen && (
          <div
            id="user-menu-panel"
            className="absolute right-0 mt-2 w-48 bg-surface/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl z-50 text-white overflow-hidden animate-fade-in"
          >
            <div className="p-4 border-b border-white/20">
              <p className="text-sm font-semibold text-shadow truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-400">{currentUser.role}</p>
            </div>
            <div className="py-1">
              <p className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-400">Switch Role</p>
              <button
                onClick={() => handleRoleChange('Admin')}
                className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:bg-white/10 transition-colors duration-200"
                disabled={currentUser.role === 'Admin'}
              >
                Admin
              </button>
              <button
                onClick={() => handleRoleChange('Moderator')}
                className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:bg-white/10 transition-colors duration-200"
                disabled={currentUser.role === 'Moderator'}
              >
                Moderator
              </button>
              <button
                onClick={() => handleRoleChange('Content Creator')}
                className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:bg-white/10 transition-colors duration-200"
                disabled={currentUser.role === 'Content Creator'}
              >
                Content Creator
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Language Selector - Added more visible styling */}
      <div className="relative" ref={languageMenuRef}>
        <button
          onClick={() => setIsLanguageMenuOpen(prev => !prev)}
          className="flex items-center gap-2 p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 z-50 border-2 border-blue-400 bg-blue-500/20"
          aria-label={t('language')}
          aria-expanded={isLanguageMenuOpen ? 'true' : 'false'}
          aria-haspopup="menu"
          aria-controls="language-menu-panel"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            ></path>
          </svg>
          <span className="hidden md:inline text-white font-medium">{t('language')}</span>
        </button>

        {isLanguageMenuOpen && (
          <div
            id="language-menu-panel"
            className="absolute right-0 mt-2 w-48 bg-surface/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl z-50 text-white overflow-hidden animate-fade-in"
          >
            <div className="py-1">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 focus:outline-none focus:bg-white/10 transition-colors duration-200 flex items-center justify-between ${i18n.language === 'en' ? 'bg-white/10' : ''}`}
              >
                <span>{t('english')}</span>
                {i18n.language === 'en' && (
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                )}
              </button>
              <button
                onClick={() => handleLanguageChange('ar')}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 focus:outline-none focus:bg-white/10 transition-colors duration-200 flex items-center justify-between ${i18n.language === 'ar' ? 'bg-white/10' : ''}`}
              >
                <span>{t('arabic')}</span>
                {i18n.language === 'ar' && (
                  <svg
                    className="w-5 h-5 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
