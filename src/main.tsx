import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './i18n/config'
import './styles/globals.css'
import { enforceHttpsInProduction } from './utils/forceHttps'
import { initializeVersionInfo, checkForVersionUpdate } from './utils/versionManager'

// Initialize version management
initializeVersionInfo();

// Check for version updates (could trigger a reload prompt in production)
if (checkForVersionUpdate()) {
  console.log('New version detected. Consider reloading for latest updates.');
}

// Force HTTPS for all API requests in production
enforceHttpsInProduction();

// Suppress React DevTools message in development
if (import.meta.env.DEV) {
  // @ts-ignore
  globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__ = { isDisabled: true };
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)