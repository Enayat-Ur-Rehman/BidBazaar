import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import ForbiddenPage from './ForbiddenPage';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const location = useLocation();

  // Debug logging
  console.log("=== ProtectedRoute Debug ===");
  console.log("Path:", location.pathname);
  console.log("isAuthenticated:", isAuthenticated);
  console.log("user:", user);
  console.log("user.role:", user?.role);
  console.log("allowedRoles:", allowedRoles);
  console.log("Includes check:", allowedRoles?.includes(user?.role));

  if (!isAuthenticated) {
    console.log("❌ Not authenticated - redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user) {
    console.log("⏳ User data loading...");
    return <div>Loading...</div>;
  }

  const userRole = user.role;

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(userRole)) {
      console.log(`❌ User role "${userRole}" not in allowed roles:`, allowedRoles);
      return <ForbiddenPage />;
    }
  }

  console.log("✅ Access granted");
  return children;
};

export default ProtectedRoute;