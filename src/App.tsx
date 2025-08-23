import { useEffect, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from './store/authStore'
import { initGA } from './utils/analytics'
import { useTheme } from './hooks/useTheme'
import MainLayout from './components/layout/MainLayout'
import ProtectedRoute from './components/common/ProtectedRoute'
import ScrollToTop from './components/common/ScrollToTop'
import GoogleAnalytics from './components/common/GoogleAnalytics'
import LanguageRouter from './components/common/LanguageRouter'
import HomePageKo from './pages/ko/HomePageKo'
import HomePageEn from './pages/en/HomePageEn'
import LoginPageKo from './pages/ko/LoginPageKo'
import LoginPageEn from './pages/en/LoginPageEn'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import DashboardPage from './pages/DashboardPage'
import PostListPage from './pages/PostListPage'
import PostDetailPage from './pages/PostDetailPage'
import PostCreatePage from './pages/PostCreatePage'
import PostEditPage from './pages/PostEditPage'
import TodoPageKo from './pages/ko/TodoPageKo'
import TodoPageEn from './pages/en/TodoPageEn'
import ChatPage from './pages/ChatPage'
import CalendarPage from './pages/CalendarPage'
import KanbanPage from './pages/KanbanPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import SearchPage from './pages/SearchPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import NotFoundPage from './pages/NotFoundPage'
import ComponentPlaygroundPage from './pages/ComponentPlaygroundPage'
import EcommercePage from './pages/qa-scenarios/EcommercePage'
import BankingDashboardPage from './pages/qa-scenarios/BankingDashboardPage'
import SocialFeedPage from './pages/qa-scenarios/SocialFeedPage'
import BookingSystemPage from './pages/qa-scenarios/BookingSystemPage'
import QAHubPage from './pages/qa-scenarios/QAHubPage'
import UserGuidePage from './pages/UserGuidePage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
})

function AppContent() {
  const { checkAuth } = useAuthStore();
  const { i18n } = useTranslation();
  const { theme } = useTheme(); // Initialize theme
  
  useEffect(() => {
    // Set the lang attribute on the HTML element
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
  
  useEffect(() => {
    // Only check auth once on app mount
    checkAuth();
    initGA();
  }, []); // Remove checkAuth from dependencies to prevent re-runs
  
  return (
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <GoogleAnalytics />
        <Routes>
          {/* Public routes with MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LanguageRouter ko={HomePageKo} en={HomePageEn} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/guide" element={<UserGuidePage />} />
          </Route>
          
          {/* Public auth routes */}
          <Route path="/login" element={<LanguageRouter ko={LoginPageKo} en={LoginPageEn} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/posts" element={<PostListPage />} />
            <Route path="/posts/create" element={<PostCreatePage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/posts/:id/edit" element={<PostEditPage />} />
            <Route path="/todos" element={<LanguageRouter ko={TodoPageKo} en={TodoPageEn} />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/kanban" element={<KanbanPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/search" element={<SearchPage />} />
            
            {/* Protected QA Testing Playground - all QA pages require login */}
            <Route path="/qa" element={<QAHubPage />} />
            <Route path="/playground" element={<ComponentPlaygroundPage />} />
            <Route path="/qa/ecommerce" element={<EcommercePage />} />
            <Route path="/qa/banking" element={<BankingDashboardPage />} />
            <Route path="/qa/social" element={<SocialFeedPage />} />
            <Route path="/qa/booking" element={<BookingSystemPage />} />
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <AppContent />
      </Suspense>
    </QueryClientProvider>
  )
}

export default App