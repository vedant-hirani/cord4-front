import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/store/theme.context';
import Landing from '@/pages/Landing/index';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import Dashboard from '@/pages/Dashboard/index';
import AIParser from '@/pages/AIParser/index';
import Budgets from '@/pages/Budgets/index';
import NotFound from '@/pages/NotFound/index';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/budgets"   element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
      <Route path="/ai-parser" element={<ProtectedRoute><AIParser /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
