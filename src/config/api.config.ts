// API Configuration - FORCE HTTPS IN PRODUCTION

const getApiUrl = () => {
  // DO NOT USE ENVIRONMENT VARIABLES IN PRODUCTION
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // For localhost development only
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000/api/v1';
    }
    
    // PRODUCTION - ALWAYS HTTPS (ignore all environment variables)
    console.warn('Production mode: Using HTTPS (ignoring env vars)');
    return 'https://api.qalearningweb.com/api/v1';
  }
  
  // Server-side/build time - always HTTPS for production
  return 'https://api.qalearningweb.com/api/v1';
};

const getWsUrl = () => {
  // DO NOT USE ENVIRONMENT VARIABLES IN PRODUCTION
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // For localhost development only
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'ws://localhost:8000/ws';
    }
    
    // PRODUCTION - ALWAYS WSS (ignore all environment variables)
    return 'wss://api.qalearningweb.com/ws';
  }
  
  // Server-side/build time - always WSS for production
  return 'wss://api.qalearningweb.com/ws';
};

// Export as getter functions to ensure dynamic evaluation
export const API_CONFIG = {
  get API_URL() { return getApiUrl(); },
  get WS_URL() { return getWsUrl(); },
};

export default API_CONFIG;