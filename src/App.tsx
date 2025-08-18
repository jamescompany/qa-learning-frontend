import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import MainLayout from './components/layout/MainLayout'
import ScrollToTop from './components/common/ScrollToTop'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import PostListPage from './pages/PostListPage'
import PostDetailPage from './pages/PostDetailPage'
import PostCreatePage from './pages/PostCreatePage'
import TodoPage from './pages/TodoPage'
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
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  return (
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Routes with MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
          </Route>
          
          {/* Routes without layout (have their own layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Dashboard and related routes (already have DashboardLayout) */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/posts" element={<PostListPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/posts/create" element={<PostCreatePage />} />
          <Route path="/todos" element={<TodoPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}

export default App