import { useAuth } from '../contexts/AuthContext';

export const useRoleCheck = () => {
  const { user } = useAuth();

  const isAdminLoggedIn = () =>
    user?.role === 'admin' || user?.role === 'super_admin';

  const isUserLoggedIn = () => user?.role === 'user';

  return { isAdminLoggedIn, isUserLoggedIn };
};
