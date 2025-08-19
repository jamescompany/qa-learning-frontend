import ReactGA from 'react-ga4';

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-BY4672YR48';
const isGAEnabled = import.meta.env.VITE_ENABLE_GA === 'true';
const isDevelopment = import.meta.env.DEV;
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const initGA = () => {
  // Only initialize GA if explicitly enabled and not in local development
  if (!isGAEnabled || isLocalhost || isDevelopment) {
    console.log('Google Analytics disabled');
    return;
  }
  
  // Disable all debug logs in production
  window.gtag = window.gtag || function() {
    (window.dataLayer = window.dataLayer || []).push(arguments);
  };
  
  ReactGA.initialize(MEASUREMENT_ID, {
    gaOptions: {
      debug_mode: false,
      anonymize_ip: true,
    },
    gtagOptions: {
      debug_mode: false,
      send_page_view: false,
    },
  });
};

export const logPageView = (path: string) => {
  if (!isGAEnabled || isLocalhost || isDevelopment) return;
  ReactGA.send({ hitType: 'pageview', page: path });
};

export const logEvent = (category: string, action: string, label?: string, value?: number) => {
  if (!isGAEnabled || isLocalhost || isDevelopment) return;
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

export const logUserInteraction = (action: string, label?: string) => {
  logEvent('User Interaction', action, label);
};

export const logFormSubmission = (formName: string, success: boolean) => {
  logEvent('Form', success ? 'Submit Success' : 'Submit Error', formName);
};

export const logSearch = (searchTerm: string, resultsCount?: number) => {
  logEvent('Search', 'Search Performed', searchTerm, resultsCount);
};

export const logTiming = (category: string, variable: string, value: number, label?: string) => {
  if (!isGAEnabled || isLocalhost || isDevelopment) return;
  ReactGA.gtag('event', 'timing_complete', {
    name: variable,
    value,
    event_category: category,
    event_label: label,
  });
};