// API Configuration with automatic protocol detection

const getApiUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL || 'https://api.qalearningweb.com/api/v1';
  
  // Always use HTTPS in production when page is served over HTTPS
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    return baseUrl.replace(/^http:/, 'https:');
  }
  
  // For local development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
  }
  
  return baseUrl;
};

const getWsUrl = () => {
  const wsUrl = import.meta.env.VITE_WS_URL || 'wss://api.qalearningweb.com/ws';
  
  // Always use WSS in production when page is served over HTTPS
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    return wsUrl.replace(/^ws:/, 'wss:');
  }
  
  // For local development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
  }
  
  return wsUrl;
};

// Export as getter functions to ensure dynamic evaluation
export const API_CONFIG = {
  get API_URL() { return getApiUrl(); },
  get WS_URL() { return getWsUrl(); },
};

export default API_CONFIG;