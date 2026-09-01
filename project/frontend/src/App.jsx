import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/common/ProtectedRoute';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ChangePasswordPage from './pages/ChangePasswordPage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminUserDetailsPage from './pages/admin/AdminUserDetailsPage';
import AdminAddUserPage from './pages/admin/AdminAddUserPage';
import AdminStoresPage from './pages/admin/AdminStoresPage';
import AdminAddStorePage from './pages/admin/AdminAddStorePage';

import UserStoresPage from './pages/user/UserStoresPage';

import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';

const ROLE_HOME = {
  SYSTEM_ADMIN: '/admin/dashboard',
  NORMAL_USER: '/user/stores',
  STORE_OWNER: '/owner/dashboard'
};

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-state">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_HOME[user.role] || '/login'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/change-password"
              element={
                <ProtectedRoute allowedRoles={['SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER']}>
                  <ChangePasswordPage />
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/new"
              element={
                <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
                  <AdminAddUserPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/:id"
              element={
                <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
                  <AdminUserDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stores"
              element={
                <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
                  <AdminStoresPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stores/new"
              element={
                <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
                  <AdminAddStorePage />
                </ProtectedRoute>
              }
            />

            {/* Normal user */}
            <Route
              path="/user/stores"
              element={
                <ProtectedRoute allowedRoles={['NORMAL_USER']}>
                  <UserStoresPage />
                </ProtectedRoute>
              }
            />

            {/* Store owner */}
            <Route
              path="/owner/dashboard"
              element={
                <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                  <OwnerDashboardPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
