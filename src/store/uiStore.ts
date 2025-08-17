import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'auto';
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface Modal {
  id: string;
  component: React.ComponentType<any>;
  props?: any;
}

interface UIState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  
  // Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Mobile menu
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  
  // Loading
  isPageLoading: boolean;
  setPageLoading: (loading: boolean) => void;
  loadingMessage: string;
  setLoadingMessage: (message: string) => void;
  
  // Toasts
  toasts: Toast[];
  showToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // Modals
  modals: Modal[];
  openModal: (component: React.ComponentType<any>, props?: any) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  
  // Search
  isSearchOpen: boolean;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Notifications
  hasNewNotifications: boolean;
  setHasNewNotifications: (has: boolean) => void;
  notificationCount: number;
  setNotificationCount: (count: number) => void;
  
  // Preferences
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  compactMode: boolean;
  setCompactMode: (compact: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      // Theme
      theme: 'light',
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      
      // Sidebar
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      
      // Mobile menu
      isMobileMenuOpen: false,
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      
      // Loading
      isPageLoading: false,
      setPageLoading: (loading) => set({ isPageLoading: loading }),
      loadingMessage: 'Loading...',
      setLoadingMessage: (message) => set({ loadingMessage: message }),
      
      // Toasts
      toasts: [],
      showToast: (type, message, duration = 5000) => {
        const id = Date.now().toString();
        const toast: Toast = { id, type, message, duration };
        
        set((state) => ({ toasts: [...state.toasts, toast] }));
        
        // Auto remove toast after duration
        if (duration > 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, duration);
        }
      },
      removeToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        }));
      },
      clearToasts: () => set({ toasts: [] }),
      
      // Modals
      modals: [],
      openModal: (component, props) => {
        const id = Date.now().toString();
        const modal: Modal = { id, component, props };
        
        set((state) => ({ modals: [...state.modals, modal] }));
        return id;
      },
      closeModal: (id) => {
        set((state) => ({
          modals: state.modals.filter((modal) => modal.id !== id),
        }));
      },
      closeAllModals: () => set({ modals: [] }),
      
      // Search
      isSearchOpen: false,
      toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      // Notifications
      hasNewNotifications: false,
      setHasNewNotifications: (has) => set({ hasNewNotifications: has }),
      notificationCount: 0,
      setNotificationCount: (count) => set({ notificationCount: count }),
      
      // Preferences
      fontSize: 'medium',
      setFontSize: (size) => {
        set({ fontSize: size });
        // Apply font size to document
        document.documentElement.style.fontSize = 
          size === 'small' ? '14px' : size === 'large' ? '18px' : '16px';
      },
      compactMode: false,
      setCompactMode: (compact) => set({ compactMode: compact }),
    }),
    {
      name: 'ui-store',
    }
  )
);

// Helper functions for common toast types
export const toast = {
  success: (message: string, duration?: number) => 
    useUIStore.getState().showToast('success', message, duration),
  error: (message: string, duration?: number) => 
    useUIStore.getState().showToast('error', message, duration),
  warning: (message: string, duration?: number) => 
    useUIStore.getState().showToast('warning', message, duration),
  info: (message: string, duration?: number) => 
    useUIStore.getState().showToast('info', message, duration),
};