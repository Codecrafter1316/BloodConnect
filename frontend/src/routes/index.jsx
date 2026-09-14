import { Navigate, Route, Routes } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import RoleProtectedRoute from './RoleProtectedRoute';

import LandingPage from '../pages/Landing/LandingPage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';

import DonorDashboardPage from '../pages/Donor/DonorDashboardPage';
import DonorRequestsPage from '../pages/Donor/DonorRequestsPage';
import DonorConnectionsPage from '../pages/Donor/DonorConnectionsPage';
import DonorProfilePage from '../pages/Donor/DonorProfilePage';

import RecipientDashboardPage from '../pages/Recipient/RecipientDashboardPage';
import RecipientRequestsPage from '../pages/Recipient/RecipientRequestsPage';
import RecipientRequestCreatePage from '../pages/Recipient/RecipientRequestCreatePage';
import RecipientDonorsPage from '../pages/Recipient/RecipientDonorsPage';
import RecipientConnectionsPage from '../pages/Recipient/RecipientConnectionsPage';
import RecipientProfilePage from '../pages/Recipient/RecipientProfilePage';

import AdminDashboardPage from '../pages/Admin/AdminDashboardPage';
import AdminUsersPage from '../pages/Admin/AdminUsersPage';
import AdminBloodRequestsPage from '../pages/Admin/AdminBloodRequestsPage';
import AdminConnectionsPage from '../pages/Admin/AdminConnectionsPage';

const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <PublicRoute>
          <LandingPage />
        </PublicRoute>
      }
    />

    <Route
      path="/login"
      element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      }
    />

    <Route
      path="/register"
      element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      }
    />

    <Route
      path="/donor/dashboard"
      element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['DONOR']}>
            <DonorDashboardPage />
          </RoleProtectedRoute>
        </ProtectedRoute>
      }
    />

    <Route
      path="/donor/requests"
      element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['DONOR']}>
            <DonorRequestsPage />
          </RoleProtectedRoute>
        </ProtectedRoute>
      }
    />

    <Route
      path="/donor/connections"
      element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['DONOR']}>
            <DonorConnectionsPage />
          </RoleProtectedRoute>
        </ProtectedRoute>
      }
    />

    <Route
      path="/donor/profile"
      element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['DONOR']}>
            <DonorProfilePage />
          </RoleProtectedRoute>
        </ProtectedRoute>
      }
    />

    <Route
      path="/recipient/dashboard"
      element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['RECIPIENT']}>
            <RecipientDashboardPage />
          </RoleProtectedRoute>
        </ProtectedRoute>
      }
    />

    <Route
      path="/recipient/requests"
      element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['RECIPIENT']}>
            <RecipientRequestsPage />
          </RoleProtectedRoute>
        </ProtectedRoute>
      }
    />

    <Route
      path="/recipient/requests/new"
      element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['RECIPIENT']}>
            <RecipientRequestCreatePage />
          </RoleProtectedRoute>
        </ProtectedRoute>
      }
    />

    <Route
      path="/recipient/requests/create"
      element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['RECIPIENT']}>
            <RecipientRequestCreatePage />
          </RoleProtectedRoute>
        </ProtectedRoute>
      }
    />

    <Route
      path="/recipient/create-request"
      element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['RECIPIENT']}>
            <RecipientRequestCreatePage />
          </RoleProtectedRoute>
        </ProtectedRoute>
      }
    />

    <Route
      path="/recipient/donors"
      element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['RECIPIENT']}>
            <RecipientDonorsPage />
          </RoleProtectedRoute>
        </ProtectedRoute>
      }
    />

    <Route
      path="/recipient/connections"
      element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['RECIPIENT']}>
            <RecipientConnectionsPage />
          </RoleProtectedRoute>
        </ProtectedRoute>
      }
    />

    <Route
      path="/recipient/profile"
      element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['RECIPIENT']}>
            <RecipientProfilePage />
          </RoleProtectedRoute>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboardPage />
          </RoleProtectedRoute>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/users"
      element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <AdminUsersPage />
          </RoleProtectedRoute>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/blood-requests"
      element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <AdminBloodRequestsPage />
          </RoleProtectedRoute>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/connections"
      element={
        <ProtectedRoute>
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <AdminConnectionsPage />
          </RoleProtectedRoute>
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
