import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import ForbiddenPage from './ForbiddenPage';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user) {
    return <div>Loading...</div>; // user data not loaded yet
  }

  const userRole = user.role;

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(userRole)) {
      return <ForbiddenPage />;
    }
  }

  return children;
};

export default ProtectedRoute;
