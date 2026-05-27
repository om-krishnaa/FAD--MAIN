import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
  checkAuth: () => boolean;
  redirectPath: string;
}

const ProtectedRoute = ({
  children,
  checkAuth,
  redirectPath,
}: ProtectedRouteProps) => {
  return checkAuth() ? children : <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;
