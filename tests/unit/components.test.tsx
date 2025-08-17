import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// Components to test
import LoginForm from '../../src/components/forms/LoginForm';
import SignupForm from '../../src/components/forms/SignupForm';
import TodoForm from '../../src/components/forms/TodoForm';
import PostForm from '../../src/components/forms/PostForm';
import FormInput from '../../src/components/forms/FormInput';
import Header from '../../src/components/common/Header';
import Footer from '../../src/components/common/Footer';
import Loading from '../../src/components/common/Loading';
import ErrorBoundary from '../../src/components/common/ErrorBoundary';

// Mock router
const MockedRouter = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Form Components', () => {
  describe('LoginForm', () => {
    it('renders login form correctly', () => {
      const mockSubmit = vi.fn();
      render(<LoginForm onSubmit={mockSubmit} />);
      
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('validates required fields', async () => {
      const mockSubmit = vi.fn();
      render(<LoginForm onSubmit={mockSubmit} />);
      
      const submitButton = screen.getByRole('button', { name: /login/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockSubmit).not.toHaveBeenCalled();
      });
    });

    it('submits form with valid data', async () => {
      const mockSubmit = vi.fn();
      render(<LoginForm onSubmit={mockSubmit} />);
      
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      const submitButton = screen.getByRole('button', { name: /login/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });
  });

  describe('SignupForm', () => {
    it('renders signup form correctly', () => {
      const mockSubmit = vi.fn();
      render(<SignupForm onSubmit={mockSubmit} />);
      
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('validates password confirmation', async () => {
      const mockSubmit = vi.fn();
      render(<SignupForm onSubmit={mockSubmit} />);
      
      const passwordInput = screen.getByLabelText(/^password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPassword' } });
      
      const submitButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
        expect(mockSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('FormInput', () => {
    it('renders input with label', () => {
      const mockChange = vi.fn();
      render(
        <FormInput
          label="Test Label"
          name="test"
          value=""
          onChange={mockChange}
        />
      );
      
      expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    });

    it('displays error message', () => {
      const mockChange = vi.fn();
      render(
        <FormInput
          label="Test Label"
          name="test"
          value=""
          onChange={mockChange}
          error="This field is required"
        />
      );
      
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('handles multiline input', () => {
      const mockChange = vi.fn();
      render(
        <FormInput
          label="Description"
          name="description"
          value=""
          onChange={mockChange}
          multiline
          rows={5}
        />
      );
      
      const textarea = screen.getByLabelText('Description');
      expect(textarea.tagName).toBe('TEXTAREA');
      expect(textarea).toHaveAttribute('rows', '5');
    });
  });
});

describe('Common Components', () => {
  describe('Header', () => {
    it('renders header with logo', () => {
      render(
        <MockedRouter>
          <Header />
        </MockedRouter>
      );
      
      expect(screen.getByText('QA')).toBeInTheDocument();
      expect(screen.getByText('Learning')).toBeInTheDocument();
    });

    it('shows login/signup buttons when not authenticated', () => {
      render(
        <MockedRouter>
          <Header isAuthenticated={false} />
        </MockedRouter>
      );
      
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });

    it('shows user menu when authenticated', () => {
      render(
        <MockedRouter>
          <Header isAuthenticated={true} userName="John Doe" />
        </MockedRouter>
      );
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
      expect(screen.queryByText('Login')).not.toBeInTheDocument();
    });

    it('calls logout handler when logout clicked', () => {
      const mockLogout = vi.fn();
      render(
        <MockedRouter>
          <Header isAuthenticated={true} userName="John Doe" onLogout={mockLogout} />
        </MockedRouter>
      );
      
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);
      
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  describe('Footer', () => {
    it('renders footer with links', () => {
      render(
        <MockedRouter>
          <Footer />
        </MockedRouter>
      );
      
      expect(screen.getByText('QA Learning App')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
      expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    });

    it('displays current year in copyright', () => {
      render(
        <MockedRouter>
          <Footer />
        </MockedRouter>
      );
      
      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(`${currentYear}`))).toBeInTheDocument();
    });
  });

  describe('Loading', () => {
    it('renders loading spinner with default text', () => {
      render(<Loading />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders custom loading text', () => {
      render(<Loading text="Fetching data..." />);
      expect(screen.getByText('Fetching data...')).toBeInTheDocument();
    });

    it('renders fullscreen loading when specified', () => {
      const { container } = render(<Loading fullScreen />);
      const fullscreenDiv = container.querySelector('.fixed.inset-0');
      expect(fullscreenDiv).toBeInTheDocument();
    });

    it('applies correct size classes', () => {
      const { container: smallContainer } = render(<Loading size="small" />);
      const { container: largeContainer } = render(<Loading size="large" />);
      
      expect(smallContainer.querySelector('.w-4.h-4')).toBeInTheDocument();
      expect(largeContainer.querySelector('.w-12.h-12')).toBeInTheDocument();
    });
  });

  describe('ErrorBoundary', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    beforeEach(() => {
      // Suppress console.error for these tests
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('catches errors and displays fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );
      
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText(/An unexpected error occurred/)).toBeInTheDocument();
    });

    it('renders children when no error', () => {
      render(
        <ErrorBoundary>
          <div>Normal content</div>
        </ErrorBoundary>
      );
      
      expect(screen.getByText('Normal content')).toBeInTheDocument();
    });

    it('allows resetting error state', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );
      
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      
      const tryAgainButton = screen.getByText('Try Again');
      fireEvent.click(tryAgainButton);
      
      rerender(
        <ErrorBoundary>
          <div>Reset content</div>
        </ErrorBoundary>
      );
      
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });
  });
});