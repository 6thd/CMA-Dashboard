import './src/index.css';
import './src/i18n'; // Initialize i18n
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { QueryProvider } from './config/queryClient';
import NotificationContainer from './components/NotificationContainer';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryProvider>
      <App />
      <NotificationContainer />
    </QueryProvider>
  </React.StrictMode>
);