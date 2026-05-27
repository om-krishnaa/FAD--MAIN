import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import Login from '../components/auth/Login';
import DashboardLayout from '../components/DashboardLayout';
import UserDashboard from '../components/UserDashboard';
import ProtectedRoute from './ProtectedRoute';
import { useRoleCheck } from '../utils/auth.util';
import PublicRoute from './PublicRoute';

const AppRoutes = () => {
  const { isAdminLoggedIn, isUserLoggedIn } = useRoleCheck();
  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute checkAuth={isAdminLoggedIn} redirectPath="/">
              <DashboardLayout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute checkAuth={isUserLoggedIn} redirectPath="/">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
