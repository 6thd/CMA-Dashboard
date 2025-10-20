/**
 * Global Application Store using Zustand
 * Centralized state management for the entire application
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student' | 'instructor';
  avatar?: string;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // UI state
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'ar';
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // Loading states
  isLoading: boolean;
  loadingMessage?: string;
}

interface AppActions {
  // User actions
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  
  // UI actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: AppState['theme']) => void;
  setLanguage: (language: AppState['language']) => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Loading actions
  setLoading: (isLoading: boolean, message?: string) => void;
  
  // Reset
  reset: () => void;
}

type AppStore = AppState & AppActions;

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  sidebarCollapsed: false,
  theme: 'system',
  language: 'ar',
  notifications: [],
  unreadCount: 0,
  isLoading: false,
};

// Create store with middleware
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      immer((set) => ({
        ...initialState,

        // User actions
        setUser: (user) =>
          set((state) => {
            state.user = user;
            state.isAuthenticated = !!user;
          }),

        login: (user) =>
          set((state) => {
            state.user = user;
            state.isAuthenticated = true;
          }),

        logout: () =>
          set((state) => {
            state.user = null;
            state.isAuthenticated = false;
          }),

        // UI actions
        toggleSidebar: () =>
          set((state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
          }),

        setSidebarCollapsed: (collapsed) =>
          set((state) => {
            state.sidebarCollapsed = collapsed;
          }),

        setTheme: (theme) =>
          set((state) => {
            state.theme = theme;
          }),

        setLanguage: (language) =>
          set((state) => {
            state.language = language;
          }),

        // Notification actions
        addNotification: (notification) =>
          set((state) => {
            const newNotification: Notification = {
              ...notification,
              id: crypto.randomUUID(),
              timestamp: new Date(),
              read: false,
            };
            state.notifications.unshift(newNotification);
            state.unreadCount = state.notifications.filter((n) => !n.read).length;
          }),

        markAsRead: (id) =>
          set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            if (notification) {
              notification.read = true;
              state.unreadCount = state.notifications.filter((n) => !n.read).length;
            }
          }),

        markAllAsRead: () =>
          set((state) => {
            state.notifications.forEach((n) => (n.read = true));
            state.unreadCount = 0;
          }),

        removeNotification: (id) =>
          set((state) => {
            state.notifications = state.notifications.filter((n) => n.id !== id);
            state.unreadCount = state.notifications.filter((n) => !n.read).length;
          }),

        clearNotifications: () =>
          set((state) => {
            state.notifications = [];
            state.unreadCount = 0;
          }),

        // Loading actions
        setLoading: (isLoading, message) =>
          set((state) => {
            state.isLoading = isLoading;
            state.loadingMessage = message;
          }),

        // Reset
        reset: () => set(initialState),
      })),
      {
        name: 'cma-app-storage',
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
          sidebarCollapsed: state.sidebarCollapsed,
        }),
      }
    ),
    { name: 'CMA App Store' }
  )
);

// Selectors for optimized re-renders
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useTheme = () => useAppStore((state) => state.theme);
export const useLanguage = () => useAppStore((state) => state.language);
export const useNotifications = () => useAppStore((state) => state.notifications);
export const useUnreadCount = () => useAppStore((state) => state.unreadCount);
export const useIsLoading = () => useAppStore((state) => state.isLoading);
