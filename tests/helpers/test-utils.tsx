import React from 'react';
import { render, RenderOptions, screen, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { vi, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Create a custom render function that includes providers
interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: AllTheProviders, ...options });
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
export { userEvent };

// Custom test utilities
export const waitForLoadingToFinish = () => 
  waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

// Mock implementations
export const createMockRouter = (props: Partial<any> = {}) => ({
  navigate: vi.fn(),
  location: {
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    ...props.location,
  },
  ...props,
});

export const createMockAuthContext = (overrides = {}) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
  signup: vi.fn(),
  ...overrides,
});

// Form testing helpers
export const fillInput = async (input: HTMLElement, value: string) => {
  await userEvent.clear(input);
  await userEvent.type(input, value);
};

export const selectOption = async (select: HTMLElement, optionText: string) => {
  await userEvent.selectOptions(select, optionText);
};

export const submitForm = async (form: HTMLElement) => {
  const submitButton = within(form).getByRole('button', { name: /submit/i });
  await userEvent.click(submitButton);
};

// Assertion helpers
export const expectToBeDisabled = (element: HTMLElement) => {
  expect(element).toBeDisabled();
  expect(element).toHaveAttribute('aria-disabled', 'true');
};

export const expectToBeAccessible = (element: HTMLElement) => {
  // Check for basic accessibility attributes
  const role = element.getAttribute('role');
  const ariaLabel = element.getAttribute('aria-label');
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  const ariaDescribedBy = element.getAttribute('aria-describedby');
  
  expect(
    role || ariaLabel || ariaLabelledBy || ariaDescribedBy || element.textContent
  ).toBeTruthy();
};

// API mocking helpers
export function mockAPIResponse<T>(data: T, delay: number = 0): Promise<T> {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

export const mockAPIError = (message: string, status: number = 500, delay: number = 0) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject({
        response: {
          data: { message },
          status,
        },
      });
    }, delay);
  });
};

// Local storage helpers
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key]);
    },
  };
};

// Date helpers for testing
export const mockDate = (date: Date | string) => {
  const RealDate = Date;
  const mockDate = new Date(date);
  
  (globalThis as any).Date = class extends RealDate {
    constructor(...args: any[]) {
      super();
      if (args.length === 0) {
        return mockDate;
      }
      // @ts-ignore
      return new RealDate(...args);
    }
    
    static now() {
      return mockDate.getTime();
    }
  } as any;
  
  return () => {
    (globalThis as any).Date = RealDate;
  };
};

// WebSocket mocking
export class MockWebSocket {
  url: string;
  readyState: number;
  onopen: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  
  constructor(url: string) {
    this.url = url;
    this.readyState = WebSocket.CONNECTING;
    
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      if (this.onopen) {
        this.onopen(new Event('open'));
      }
    }, 0);
  }
  
  send(_data: string) {
    // Mock send implementation
  }
  
  close() {
    this.readyState = WebSocket.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close'));
    }
  }
  
  mockReceiveMessage(data: any) {
    if (this.onmessage) {
      this.onmessage(new MessageEvent('message', { data: JSON.stringify(data) }));
    }
  }
}

// Performance testing helpers
export const measureRenderTime = async (component: React.ReactElement) => {
  const start = performance.now();
  const { rerender } = render(component);
  const end = performance.now();
  
  return {
    initialRender: end - start,
    rerender: async () => {
      const rerenderStart = performance.now();
      rerender(component);
      const rerenderEnd = performance.now();
      return rerenderEnd - rerenderStart;
    },
  };
};

// Accessibility testing helpers
export const checkA11y = async (container: HTMLElement) => {
  // Check for common accessibility issues
  const images = container.querySelectorAll('img');
  images.forEach(img => {
    expect(img).toHaveAttribute('alt');
  });
  
  const buttons = container.querySelectorAll('button');
  buttons.forEach(button => {
    const text = button.textContent;
    const ariaLabel = button.getAttribute('aria-label');
    expect(text || ariaLabel).toBeTruthy();
  });
  
  const inputs = container.querySelectorAll('input');
  inputs.forEach(input => {
    const label = container.querySelector(`label[for="${input.id}"]`);
    const ariaLabel = input.getAttribute('aria-label');
    expect(label || ariaLabel).toBeTruthy();
  });
};

// Snapshot testing helpers
export const createStableSnapshot = (element: HTMLElement) => {
  // Remove dynamic values like IDs, timestamps, etc.
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Remove dynamic IDs
  clone.querySelectorAll('[id]').forEach(el => {
    el.removeAttribute('id');
  });
  
  // Remove timestamps
  clone.querySelectorAll('[data-timestamp]').forEach(el => {
    el.setAttribute('data-timestamp', 'TIMESTAMP');
  });
  
  return clone.outerHTML;
};