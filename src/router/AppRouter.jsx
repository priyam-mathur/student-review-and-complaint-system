import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

// We'll lazy load pages for better performance
// Auth Pages
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/auth/RegisterPage'));

// Student Pages
const StudentDashboard = React.lazy(() => import('@/pages/student/DashboardPage'));
const StudentComplaintsPage = React.lazy(() => import('@/pages/student/ComplaintsPage'));
const SubmitComplaintPage = React.lazy(() => import('@/pages/student/SubmitComplaintPage'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('@/pages/admin/DashboardPage'));
const AdminComplaintsPage = React.lazy(() => import('@/pages/admin/ComplaintsPage'));

// Shared Pages
const ComplaintDetailPage = React.lazy(() => import('@/pages/shared/ComplaintDetailPage'));

// Layouts
const DashboardLayout = React.lazy(() => import('@/components/layout/DashboardLayout'));
const AuthLayout = React.lazy(() => import('@/components/layout/AuthLayout'));

// Fallback loader
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const AppRouter = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <PageLoader />;

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes (Auth) */}
        <Route element={<AuthLayout />}>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to={user?.role === 'student' ? '/student' : '/admin'} /> : <LoginPage />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to={user?.role === 'student' ? '/student' : '/admin'} /> : <RegisterPage />} 
          />
          {/* Landing page can go here or separately */}
          <Route path="/" element={<Navigate to="/login" />} /> 
        </Route>

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route element={<DashboardLayout role="student" />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/complaints" element={<StudentComplaintsPage />} />
            <Route path="/student/complaints/:id" element={<ComplaintDetailPage />} />
            <Route path="/student/submit" element={<SubmitComplaintPage />} />
            <Route path="/student/messages" element={<div>Messages (Coming Soon)</div>} />
            <Route path="/student/profile" element={<div>Profile (Coming Soon)</div>} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
          <Route element={<DashboardLayout role="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/complaints" element={<AdminComplaintsPage />} />
            <Route path="/admin/complaints/:id" element={<ComplaintDetailPage />} />
            <Route path="/admin/students" element={<div>Students (Coming Soon)</div>} />
            <Route path="/admin/analytics" element={<div>Analytics (Coming Soon)</div>} />
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
