// API Configuration - COMPLETELY IGNORE ALL ENVIRONMENT VARIABLES

const getApiUrl = () => {
  // NEVER use environment variables - they are compromised
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // For localhost development only
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000/api/v1';
    }
  }
  
  // ALWAYS return HTTPS for any non-localhost environment
  return 'https://api.qalearningweb.com/api/v1';
};

const getWsUrl = () => {
  // NEVER use environment variables - they are compromised
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // For localhost development only
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'ws://localhost:8000/ws';
    }
  }
  
  // ALWAYS return WSS for any non-localhost environment
  return 'wss://api.qalearningweb.com/ws';
};

// Export as getter functions to ensure dynamic evaluation
export const API_CONFIG = {
  get API_URL() { return getApiUrl(); },
  get WS_URL() { return getWsUrl(); },
};

export default API_CONFIG;