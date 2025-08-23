// Version management utility for cache busting and update detection
interface VersionInfo {
  version: string;
  hash: string;
  buildTime: string;
  lastChecked: string;
}

const VERSION_KEY = 'app_version_info';
const CURRENT_VERSION = '0.0.1'; // This should match package.json version

// Generate a unique hash based on current timestamp and random value
function generateBuildHash(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${random}`;
}

// Get stored version info from localStorage
export function getStoredVersionInfo(): VersionInfo | null {
  try {
    const stored = localStorage.getItem(VERSION_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading version info:', error);
  }
  return null;
}

// Initialize or update version info
export function initializeVersionInfo(): void {
  const buildHash = generateBuildHash();
  const buildTime = new Date().toISOString();
  
  const storedInfo = getStoredVersionInfo();
  
  // Check if version has changed
  if (storedInfo && storedInfo.version !== CURRENT_VERSION) {
    console.log(`Version updated from ${storedInfo.version} to ${CURRENT_VERSION}`);
    
    // Clear potentially outdated cached data
    clearOutdatedCache();
  }
  
  // Update version info in localStorage
  const newVersionInfo: VersionInfo = {
    version: CURRENT_VERSION,
    hash: buildHash,
    buildTime: buildTime,
    lastChecked: new Date().toISOString()
  };
  
  localStorage.setItem(VERSION_KEY, JSON.stringify(newVersionInfo));
  
  // Also store individual items for easy access
  localStorage.setItem('version', CURRENT_VERSION);
  localStorage.setItem('hash', buildHash);
  
  console.log('Version info initialized:', {
    version: CURRENT_VERSION,
    hash: buildHash,
    buildTime: buildTime
  });
}

// Clear outdated cache when version changes
function clearOutdatedCache(): void {
  // List of keys to preserve during cache clear
  const preserveKeys = [
    VERSION_KEY,
    'theme',
    'language',
    'authToken',
    'refreshToken',
    'user'
  ];
  
  // Get all localStorage keys
  const keys = Object.keys(localStorage);
  
  // Remove items not in preserve list
  keys.forEach(key => {
    if (!preserveKeys.includes(key)) {
      localStorage.removeItem(key);
    }
  });
  
  console.log('Outdated cache cleared');
}

// Check if the app needs to reload due to version change
export function checkForVersionUpdate(): boolean {
  const storedInfo = getStoredVersionInfo();
  
  if (!storedInfo) {
    return false;
  }
  
  // In production, you might fetch the latest version from an API
  // For now, we just compare with the current version
  return storedInfo.version !== CURRENT_VERSION;
}

// Get version display string
export function getVersionDisplay(): string {
  const info = getStoredVersionInfo();
  if (info) {
    return `v${info.version} (${info.hash.substring(0, 7)})`;
  }
  return `v${CURRENT_VERSION}`;
}

// Export version constants for use in other parts of the app
export const VERSION = CURRENT_VERSION;
export const BUILD_HASH = getStoredVersionInfo()?.hash || generateBuildHash();