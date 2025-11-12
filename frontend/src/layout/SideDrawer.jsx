import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaFacebook, FaSignInAlt, FaSignOutAlt, FaUserPlus } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { logout } from "@/store/slices/userSlice";
import sidebarRoutes from "@/config/sidebarRoutes";

const SideDrawer = ({ isCollapsed = false, onToggleCollapse }) => {
  const [show, setShow] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  // Get routes based on user role
  const getMainRoutes = () => {
    const routes = [...sidebarRoutes.common];
    
    if (isAuthenticated && user) {
      if (user.role === "Super Admin") {
        routes.push(...sidebarRoutes.superAdmin);
      } else if (user.role === "Auctioneer") {
        routes.push(...sidebarRoutes.auctioneer);
      } else if (user.role === "Bidder") {
        routes.push(...sidebarRoutes.bidder);
      }
    }
    
    return routes;
  };

  const getSecondaryRoutes = () => {
    const routes = [];
    
    if (isAuthenticated) {
      routes.push(...sidebarRoutes.profile);
    }
    
    routes.push(...sidebarRoutes.secondary);
    
    return routes;
  };

  const NavLink = ({ route, collapsed }) => {
    const Icon = route.icon;
    
    return (
      <li className={`transform transition-all duration-300 ${collapsed ? 'lg:hover:translate-x-0' : 'hover:translate-x-2'}`}>
        <Link
          to={route.href}
          className={`flex font-semibold gap-3 items-center rounded-xl hover:bg-gradient-to-r hover:from-[#D6482b]/10 hover:to-[#ff6b4a]/10 hover:text-[#D6482b] transition-all duration-300 group ${
            collapsed ? 'lg:justify-center lg:px-3 lg:py-3 text-lg' : 'text-lg px-4 py-3'
          }`}
          title={collapsed ? route.label : ''}
          onClick={() => setShow(false)} 
        >
          <Icon className="text-2xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
          <span className={collapsed ? 'lg:hidden' : ''}>{route.label}</span>
        </Link>
      </li>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {show && (
        <div
          onClick={() => setShow(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
        />
      )}

      {/* Hamburger Button - Mobile Only */}
      <button
        onClick={() => setShow(!show)}
        className="fixed right-5 top-5 bg-gradient-to-br from-[#D6482B] to-[#b8381e] text-white text-3xl p-3 rounded-xl hover:scale-110 hover:shadow-2xl hover:shadow-[#D6482B]/50 lg:hidden z-50 transition-all duration-300 active:scale-95"
      >
        <GiHamburgerMenu className="animate-pulse" />
      </button>

      {/* Sidebar */}
      <div
        className={`bg-gradient-to-b from-[#fdfbf7] to-[#f6f4f0] h-full fixed top-0 transition-all duration-500 ease-in-out p-6 flex flex-col justify-between border-r-[1px] border-r-stone-200 shadow-2xl z-50 ${
          show ? "left-0 w-[100%] sm:w-[320px]" : "left-[-100%] w-[100%] sm:w-[320px]"
        } ${
          isCollapsed 
            ? 'lg:left-0 lg:w-[80px] lg:p-3' 
            : 'lg:left-0 lg:w-[320px] lg:p-6'
        }`}
      >
        <div className="relative overflow-y-auto">
          {/* Logo */}
          <Link to={"/"} className={`block mb-8 group ${isCollapsed ? 'lg:mb-4' : ''}`}>
            <h4 className={`text-3xl font-bold mb-2 transition-all duration-300 group-hover:scale-105 ${isCollapsed ? 'lg:text-xl lg:mb-0' : ''}`}>
              {isCollapsed ? (
                <div className="flex items-center justify-center">
                  B<span className=" text-transparent bg-clip-text bg-gradient-to-r from-[#D6482b] to-[#ff6b4a]">B</span>
                </div>
             
              ) : (
                <>
                  Bid<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D6482b] to-[#ff6b4a]">Bazaar</span>
                </>
              )}
            </h4>
            <div className={`h-1 bg-gradient-to-r from-[#D6482b] to-[#ff6b4a] rounded-full transition-all duration-300 ${
              isCollapsed ? 'lg:hidden' : 'w-16 group-hover:w-24'
            }`}></div>
          </Link>

          {/* Main Navigation */}
          <nav className="mb-6">
            <ul className="flex flex-col gap-2">
              {getMainRoutes().map((route, index) => (
                <NavLink key={index} route={route} collapsed={isCollapsed} />
              ))}
            </ul>
          </nav>

          {/* Auth Buttons */}
          {!isAuthenticated ? (
            <div className={`my-6 flex gap-3 ${isCollapsed ? 'lg:flex-col lg:gap-2' : ''}`}>
              <Link
                to={"/sign-up"}
                className={`flex flex-1 items-center justify-center bg-gradient-to-r from-[#D6482B] to-[#b8381e] font-semibold hover:shadow-lg hover:shadow-[#D6482B]/50 py-3 px-4 rounded-xl text-white text-center transition-all duration-300 hover:scale-105 active:scale-95 ${
                  isCollapsed ? 'lg:text-sm lg:py-2 lg:px-2' : 'text-lg'
                }`}
              >
                {isCollapsed ? <FaUserPlus size={20}></FaUserPlus> : 'Sign Up'}
              </Link>
              <Link
                to={"/login"}
                className={`flex flex-1 items-center justify-center text-[#D6482B] bg-white border-2 border-[#D6482B] hover:bg-[#D6482B] hover:text-white font-semibold py-3 px-4 rounded-xl text-center transition-all duration-300 hover:scale-105 active:scale-95 ${
                  isCollapsed ? 'lg:text-sm lg:py-2 lg:px-2' : 'text-lg'
                }`}
              >
                {isCollapsed ? <FaSignInAlt size={20}></FaSignInAlt>: 'Login'}
                
              </Link>
            </div>
          ) : (
            <div className="my-6">
              <button
                onClick={handleLogout}
                className={`w-full flex flex-1 items-center justify-center bg-gradient-to-r from-[#D6482B] to-[#b8381e] font-semibold hover:shadow-lg hover:shadow-[#D6482B]/50 py-3 px-4 rounded-xl text-white transition-all duration-300 hover:scale-105 active:scale-95 ${
                  isCollapsed ? 'lg:text-sm lg:py-2 lg:px-2' : 'text-lg'
                }`}
              >
                {isCollapsed ? <FaSignOutAlt size={20}></FaSignOutAlt> : 'Logout'}
              </button>
            </div>
          )}

          {/* Divider */}
          <div className={`relative my-6 ${isCollapsed ? 'lg:hidden' : ''}`}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-300"></div>
            </div>
          </div>

          {/* Secondary Navigation */}
          <nav>
            <ul className="flex flex-col gap-2">
              {getSecondaryRoutes().map((route, index) => (
                <NavLink key={index} route={route} collapsed={isCollapsed} />
              ))}
            </ul>
          </nav>

          {/* Close Button - Mobile Only */}
          <button
            onClick={() => setShow(!show)}
            className="absolute top-0 right-4 text-[32px] sm:hidden text-stone-400 hover:text-[#D6482B] transition-all duration-300 hover:rotate-90 hover:scale-110"
          >
            <IoMdCloseCircleOutline />
          </button>
        </div>

        {/* Footer */}
        <div className={`space-y-4 ${isCollapsed ? 'lg:space-y-2' : ''}`}>
          {/* Social Links */}
          <div className={`flex gap-3 items-center ${isCollapsed ? 'lg:flex-col lg:gap-2 lg:items-center' : ''}`}>
            <Link
              to="/"
              className={`bg-white text-stone-500 text-xl rounded-xl hover:text-blue-600 hover:shadow-lg hover:shadow-blue-600/30 hover:scale-110 transition-all duration-300 border border-stone-200 ${
                isCollapsed ? 'lg:p-2' : 'p-3'
              }`}
              title="Facebook"
            >
              <FaFacebook />
            </Link>
            <Link
              to="/"
              className={`bg-white text-stone-500 text-xl rounded-xl hover:text-pink-600 hover:shadow-lg hover:shadow-pink-600/30 hover:scale-110 transition-all duration-300 border border-stone-200 ${
                isCollapsed ? 'lg:p-2' : 'p-3'
              }`}
              title="Instagram"
            >
              <RiInstagramFill />
            </Link>
          </div>

          {/* Contact & Copyright */}
          <div className={`space-y-1 ${isCollapsed ? 'lg:hidden' : ''}`}>
            <Link
              to={"/contact"}
              className="block text-stone-600 font-semibold hover:text-[#d6482b] transition-all duration-300 hover:translate-x-1"
            >
              Contact Us →
            </Link>
            <p className="text-stone-500 text-sm">&copy; BidBazaar, LLC.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default SideDrawer;