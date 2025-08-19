import ReactGA from 'react-ga4';

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-BY4672YR48';
const hostname = window.location.hostname;
const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

// Simple domain-based detection
const isDevDomain = hostname.includes('dev.qalearningweb.com');
const isProdDomain = hostname.includes('www.qalearningweb.com') || hostname === 'qalearningweb.com';
const isVercelPreview = hostname.includes('vercel.app');

// True production = only the production domain
const isRealProduction = isProdDomain && !isDevDomain && !isVercelPreview;

export const initGA = () => {
  // Show debug logs everywhere except production domain
  const enableDebug = !isRealProduction;
  
  console.log('Google Analytics initializing', {
    hostname,
    isLocalhost,
    isDevDomain,
    isProdDomain,
    isVercelPreview,
    isRealProduction,
    enableDebug
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
  
  // In production domain only, suppress console logs
  if (isRealProduction) {
    // Override console methods for gtag
    const originalLog = console.log;
    console.log = function(...args: any[]) {
      // Filter out Google Tag Manager logs in production
      if (args[0] && typeof args[0] === 'string' && 
          (args[0].includes('Google Tag') || 
           args[0].includes('Processing') || 
           args[0].includes('Tag fired') ||
           args[0].includes('GTAG') ||
           args[0].includes('____') ||
           args[0].includes('gtm.') ||
           args[0].includes('js?id='))) {
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