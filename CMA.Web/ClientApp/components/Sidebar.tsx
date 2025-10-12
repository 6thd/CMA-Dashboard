import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext.js';

const allMenuItems = [
  { path: '/', title: 'Dashboard', iconPath: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', roles: ['Admin', 'Moderator', 'Content Creator'] },
  { path: '/analytics', title: 'Analytics', iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', roles: ['Admin', 'Moderator'] },
  { path: '/students', title: 'Students', iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm-9 3a2 2 0 11-4 0 2 2 0 014 0z', roles: ['Admin', 'Moderator'] },
  { path: '/exams', title: 'Exams', iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', roles: ['Admin', 'Content Creator'] },
  { path: '/questions', title: 'Questions', iconPath: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', roles: ['Admin', 'Content Creator'] },
  { path: '/results', title: 'Results', iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', roles: ['Admin', 'Moderator'] },
  { path: '/curriculum', title: 'Curriculum', iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', roles: ['Admin', 'Moderator', 'Content Creator'] },
  { path: '/exam-simulation', title: 'Exam Simulation', iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', roles: ['Admin', 'Moderator', 'Content Creator'] },
  { path: '/ai-dashboard', title: 'AI Dashboard', iconPath: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', roles: ['Admin', 'Moderator', 'Content Creator'] },
  { path: '/achievements', title: 'Achievements', iconPath: 'M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z', roles: ['Admin', 'Moderator', 'Content Creator'] },
  { path: '/audit-log', title: 'Audit Log', iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', roles: ['Admin'] },
  { path: '/settings', title: 'Settings', iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z', roles: ['Admin'] },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useUser();
  const menuItems = allMenuItems.filter(item => item.roles.includes(currentUser.role));
  const location = useLocation();

  return (
    <>
      {/* Desktop sidebar - always visible */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="w-64 bg-gray-900/50 backdrop-blur-xl border-r border-white/10 text-gray-200 flex flex-col">
          <div className="h-20 flex items-center justify-center border-b border-white/10 bg-gradient-primary">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white text-shadow">FMAA Pro</h1>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`sidebar-link flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 text-shadow group ${
                  location.pathname === item.path || (item.path === '/' && location.pathname === '/')
                    ? 'active text-white font-semibold shadow-lg' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <title>{item.title}</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.iconPath}></path>
                  </svg>
                </div>
                <span className="ml-3 font-medium">{item.title}</span>
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center">
              <div className="relative">
                <div className="h-12 w-12 rounded-full object-cover ring-2 ring-cyan-500 bg-gradient-secondary flex items-center justify-center text-xl font-bold text-white">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>
              <div className="mr-3 flex-1">
                <p className="font-bold text-white">{currentUser.name}</p>
                <p className="text-sm text-gray-400">{currentUser.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar - only shown when open */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-black/60" 
            onClick={onClose}
          ></div>
          <div className="relative w-64 bg-gray-900/50 backdrop-blur-xl border-r border-white/10 text-gray-200 flex flex-col h-full">
            <div className="h-20 flex items-center justify-center border-b border-white/10 bg-gradient-primary">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white text-shadow">FMAA Pro</h1>
              </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`sidebar-link flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 text-shadow group ${
                    location.pathname === item.path || (item.path === '/' && location.pathname === '/')
                      ? 'active text-white font-semibold shadow-lg' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <title>{item.title}</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.iconPath}></path>
                    </svg>
                  </div>
                  <span className="ml-3 font-medium">{item.title}</span>
                </Link>
              ))}
            </nav>
            
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full object-cover ring-2 ring-cyan-500 bg-gradient-secondary flex items-center justify-center text-xl font-bold text-white">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                </div>
                <div className="mr-3 flex-1">
                  <p className="font-bold text-white">{currentUser.name}</p>
                  <p className="text-sm text-gray-400">{currentUser.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;