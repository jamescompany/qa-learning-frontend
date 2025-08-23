// API Configuration with automatic protocol detection

const getApiUrl = () => {
  // Force HTTPS for production domain
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Always use HTTPS for production domains
    if (hostname === 'qalearningweb.com' || hostname === 'www.qalearningweb.com') {
      return 'https://api.qalearningweb.com/api/v1';
    }
    
    // For localhost development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
    }
  }
  
  // Default to HTTPS in production
  const baseUrl = import.meta.env.VITE_API_URL || 'https://api.qalearningweb.com/api/v1';
  
  // Always replace http with https if page is served over HTTPS
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    return baseUrl.replace(/^http:/, 'https:');
  }
  
  return baseUrl;
};

const getWsUrl = () => {
  // Force WSS for production domain
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Always use WSS for production domains
    if (hostname === 'qalearningweb.com' || hostname === 'www.qalearningweb.com') {
      return 'wss://api.qalearningweb.com/ws';
    }
    
    // For localhost development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
    }
  }
  
  // Default to WSS in production
  const wsUrl = import.meta.env.VITE_WS_URL || 'wss://api.qalearningweb.com/ws';
  
  // Always replace ws with wss if page is served over HTTPS
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    return wsUrl.replace(/^ws:/, 'wss:');
  }
  
  return wsUrl;
};

// Export as getter functions to ensure dynamic evaluation
export const API_CONFIG = {
  get API_URL() { return getApiUrl(); },
  get WS_URL() { return getWsUrl(); },
};

export default API_CONFIG;