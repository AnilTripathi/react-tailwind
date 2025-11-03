/**
 * Central router configuration - single source of truth for all routing
 * Handles both public routes (login, about) and private routes (dashboard, etc.)
 * Private routes are wrapped with Layout and authentication guards
 */

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import SuspenseFallback from '@/components/SuspenseFallback';
import { PrivateRoute } from './PrivateRoute';

// Lazy-loaded components
const Layout = lazy(() => import('../layout/layout'));
const LoginPage = lazy(() => import('../pages/login'));
const RegisterPage = lazy(() => import('../pages/register'));
const HomePage = lazy(() => import('../pages/home'));
const AboutPage = lazy(() => import('../pages/about'));
const NotFound = lazy(() => import('../pages/notfound'));
const MyToDosPage = lazy(() => import('../pages/mytodo/MyToDo'));
const UserPage = lazy(() => import('../pages/user'));
const ProfilePage = lazy(() => import('../pages/profile'));
const SettingsPage = lazy(() => import('../pages/settings'));

// Private route wrapper that includes Layout
const PrivateRouteWithLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <PrivateRoute>
    <Layout>{children}</Layout>
  </PrivateRoute>
);

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          {/* Public routes - no Layout wrapper */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Private routes - wrapped with Layout */}
          <Route
            path="/home"
            element={
              <PrivateRouteWithLayout>
                <HomePage />
              </PrivateRouteWithLayout>
            }
          />
          <Route
            path="/mytodo"
            element={
              <PrivateRouteWithLayout>
                <MyToDosPage />
              </PrivateRouteWithLayout>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRouteWithLayout>
                <UserPage />
              </PrivateRouteWithLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRouteWithLayout>
                <ProfilePage />
              </PrivateRouteWithLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRouteWithLayout>
                <SettingsPage />
              </PrivateRouteWithLayout>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Catch all - show NotFound page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
