import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const ForbiddenPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const handleGoToDashboard = () => {
    const role = user?.role?.toLowerCase();
    if (role) {
      navigate(`/dashboard/${role}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <ShieldAlert className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <div className="text-red-600 dark:text-red-400 text-7xl font-bold mb-4">
          403
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Access Denied
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        
        <button
          onClick={handleGoToDashboard}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Go to My Dashboard
        </button>
      </div>
    </div>
  );
};

export default ForbiddenPage;