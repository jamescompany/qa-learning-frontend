// API Configuration with automatic protocol detection

const getApiUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL;
  
  // In production, ensure HTTPS is used
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    return baseUrl?.replace(/^http:/, 'https:') || 'https://api.qalearningweb.com/api/v1';
  }
  
  return baseUrl || 'http://localhost:8000/api/v1';
};

const getWsUrl = () => {
  const wsUrl = import.meta.env.VITE_WS_URL;
  
  // In production, ensure WSS is used
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    return wsUrl?.replace(/^ws:/, 'wss:') || 'wss://api.qalearningweb.com/ws';
  }
  
  return wsUrl || 'ws://localhost:8000/ws';
};

export const API_CONFIG = {
  API_URL: getApiUrl(),
  WS_URL: getWsUrl(),
};

export default API_CONFIG;