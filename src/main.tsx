import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

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