/**
 * Main Entry Point
 * React application bootstrap
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ============================================================================
// ROOT RENDER
// ============================================================================

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ============================================================================
// SERVICE WORKER REGISTRATION (for PWA support)
// ============================================================================

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration);
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
}

// ============================================================================
// CONSOLE BRANDING
// ============================================================================

console.log(
  '%c Samsung Memory Flip ',
  'background: linear-gradient(135deg, #00d4ff, #7b2cbf); color: white; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 8px;'
);

console.log(
  '%c Premium Kiosk Experience ',
  'color: #00d4ff; font-size: 14px;'
);
