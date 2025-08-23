// API Configuration

const getApiUrl = () => {
  // Use environment variable if available
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback for local development
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000/api/v1';
    }
  }
  
  // Default production URL
  return 'https://api.qalearningweb.com/api/v1';
};

const getWsUrl = () => {
  // Use environment variable if available
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }
  
  // Fallback for local development
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'ws://localhost:8000/ws';
    }
  }
  
  // Default production URL
  return 'wss://api.qalearningweb.com/ws';
};

// Export as getter functions to ensure dynamic evaluation
export const API_CONFIG = {
  get API_URL() { return getApiUrl(); },
  get WS_URL() { return getWsUrl(); },
};

export default API_CONFIG;