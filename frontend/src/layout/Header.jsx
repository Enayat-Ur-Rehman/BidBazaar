import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, LogOut, ChevronDown, Settings } from 'lucide-react';
import { logout } from '../store/slices/userSlice';

const Header = ({ title, subtitle, toggleSidebar, sidebarCollapsed }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleToggleSidebar = () => {
    if (toggleSidebar) {
      toggleSidebar(!sidebarCollapsed);
    }
  };

  return (
    <header className="h-24 bg-white border-b border-stone-200 px-4 lg:px-6 sticky right-0 top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between h-full">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleSidebar}
            className="text-stone-500 hover:text-[#D6482B] transition-colors p-2 hover:bg-stone-100 rounded-lg"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-[#D6482b] to-[#ff6b4a] bg-clip-text text-transparent">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-stone-600 hidden sm:block mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button 
            className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-[#D6482B] transition-all duration-200 relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D6482B] rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-stone-100 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D6482B] to-[#ff6b4a] flex items-center justify-center text-white font-semibold text-sm shadow-md">
                {user?.userName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <ChevronDown className="w-4 h-4 text-stone-500 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-stone-200 py-2 z-20">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-stone-200">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.userName || 'User'}
                    </p>
                    <p className="text-xs text-stone-600 truncate">
                      {user?.email || ''}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r from-[#D6482B]/10 to-[#ff6b4a]/10 text-[#D6482B]">
                      {user?.role || 'User'}
                    </span>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate('/me');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-100 flex items-center gap-3 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate('/dashboard/settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-100 flex items-center gap-3 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="pt-1 border-t border-stone-200">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-[#D6482B] hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;