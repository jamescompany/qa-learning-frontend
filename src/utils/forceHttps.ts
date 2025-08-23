// Force HTTPS for all API requests in production
export function enforceHttpsInProduction() {
  if (typeof window === 'undefined') return;
  
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  
  if (!isProduction) return;
  
  console.warn('Enforcing HTTPS for all API requests');
  
  // Override XMLHttpRequest
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method: string, url: string | URL, ...args: any[]) {
    let modifiedUrl = url.toString();
    
    // Force HTTPS for api.qalearningweb.com
    if (modifiedUrl.includes('api.qalearningweb.com') && modifiedUrl.startsWith('http://')) {
      modifiedUrl = modifiedUrl.replace('http://', 'https://');
      console.warn('Forced HTTPS for XMLHttpRequest:', modifiedUrl);
    }
    
    return originalXHROpen.apply(this, [method, modifiedUrl, ...args] as any);
  };
  
  // Override fetch
  const originalFetch = window.fetch;
  window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
    let url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    
    // Force HTTPS for api.qalearningweb.com
    if (url.includes('api.qalearningweb.com') && url.startsWith('http://')) {
      const httpsUrl = url.replace('http://', 'https://');
      console.warn('Forced HTTPS for fetch:', httpsUrl);
      
      if (typeof input === 'string') {
        input = httpsUrl;
      } else if (input instanceof URL) {
        input = new URL(httpsUrl);
      } else {
        input = new Request(httpsUrl, input);
      }
    }
    
    return originalFetch.call(window, input, init);
  };
}