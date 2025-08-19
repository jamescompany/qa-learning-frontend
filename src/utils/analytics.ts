import ReactGA from 'react-ga4';

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-BY4672YR48';
const isProduction = import.meta.env.PROD;
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const initGA = () => {
  // Show debug logs in development, hide in production
  const enableDebug = !isProduction;
  
  console.log('Google Analytics initializing', {
    isProduction,
    isLocalhost,
    enableDebug,
    hostname: window.location.hostname
  });
  
  ReactGA.initialize(MEASUREMENT_ID, {
    gaOptions: {
      debug_mode: enableDebug,  // true in development, false in production
      anonymize_ip: true,
    },
    gtagOptions: {
      debug_mode: enableDebug,  // true in development, false in production
      send_page_view: false,
    },
  });
  
  // In production, suppress console logs
  if (isProduction) {
    // Override console methods for gtag
    const originalLog = console.log;
    console.log = function(...args: any[]) {
      // Filter out Google Tag Manager logs in production
      if (args[0] && typeof args[0] === 'string' && 
          (args[0].includes('Google Tag') || 
           args[0].includes('Processing') || 
           args[0].includes('Tag fired') ||
           args[0].includes('GTAG') ||
           args[0].includes('____'))) {
        return;
      }
      originalLog.apply(console, args);
    };
  }
};

export const logPageView = (path: string) => {
  // Always track page views but suppress logs in production
  ReactGA.send({ hitType: 'pageview', page: path });
};

export const logEvent = (category: string, action: string, label?: string, value?: number) => {
  // Always track events but suppress logs in production
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
  // Always track timing but suppress logs in production
  ReactGA.gtag('event', 'timing_complete', {
    name: variable,
    value,
    event_category: category,
    event_label: label,
  });
};