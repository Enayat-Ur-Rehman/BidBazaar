import React, { useState } from "react";
import { RiAuctionFill } from "react-icons/ri";
import { MdLeaderboard, MdDashboard } from "react-icons/md";
import { SiGooglesearchconsole } from "react-icons/si";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdCloseCircleOutline, IoIosCreate } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/userSlice";
import { Link } from "react-router-dom";

const SideDrawer = () => {
  const [show, setShow] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      {/* Backdrop Overlay */}
      {show && (
        <div
          onClick={() => setShow(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
        />
      )}

      {/* Hamburger Button */}
      <button
        onClick={() => setShow(!show)}
        className="fixed right-5 top-5 bg-gradient-to-br from-[#D6482B] to-[#b8381e] text-white text-3xl p-3 rounded-xl hover:scale-110 hover:shadow-2xl hover:shadow-[#D6482B]/50 lg:hidden z-50 transition-all duration-300 active:scale-95"
      >
        <GiHamburgerMenu className="animate-pulse" />
      </button>

      {/* Sidebar */}
      <div
        className={`w-[100%] sm:w-[320px] bg-gradient-to-b from-[#fdfbf7] to-[#f6f4f0] h-full fixed top-0 ${
          show ? "left-0" : "left-[-100%]"
        } transition-all duration-500 ease-in-out p-6 flex flex-col justify-between lg:left-0 border-r-[1px] border-r-stone-200 shadow-2xl z-50`}
      >
        <div className="relative">
          {/* Logo */}
          <Link to={"/"} className="block mb-8 group">
            <h4 className="text-3xl font-bold mb-2 transition-all duration-300 group-hover:scale-105">
              Bid<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D6482b] to-[#ff6b4a]">Bazaar</span>
            </h4>
            <div className="h-1 w-16 bg-gradient-to-r from-[#D6482b] to-[#ff6b4a] rounded-full transition-all duration-300 group-hover:w-24"></div>
          </Link>

          {/* Main Navigation */}
          <nav className="mb-6">
            <ul className="flex flex-col gap-2">
              <li className="transform transition-all duration-300 hover:translate-x-2">
                <Link
                  to={"/auctions"}
                  className="flex text-lg font-semibold gap-3 items-center px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#D6482b]/10 hover:to-[#ff6b4a]/10 hover:text-[#D6482b] transition-all duration-300 group"
                >
                  <RiAuctionFill className="text-2xl group-hover:scale-110 transition-transform duration-300" />
                  <span>Auctions</span>
                </Link>
              </li>
              <li className="transform transition-all duration-300 hover:translate-x-2">
                <Link
                  to={"/leaderboard"}
                  className="flex text-lg font-semibold gap-3 items-center px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#D6482b]/10 hover:to-[#ff6b4a]/10 hover:text-[#D6482b] transition-all duration-300 group"
                >
                  <MdLeaderboard className="text-2xl group-hover:scale-110 transition-transform duration-300" />
                  <span>Leaderboard</span>
                </Link>
              </li>

              {/* Auctioneer Links */}
              {isAuthenticated && user && user.role === "Auctioneer" && (
                <>
                  <li className="transform transition-all duration-300 hover:translate-x-2">
                    <Link
                      to={"/submit-commission"}
                      className="flex text-lg font-semibold gap-3 items-center px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#D6482b]/10 hover:to-[#ff6b4a]/10 hover:text-[#D6482b] transition-all duration-300 group"
                    >
                      <FaFileInvoiceDollar className="text-2xl group-hover:scale-110 transition-transform duration-300" />
                      <span>Submit Commission</span>
                    </Link>
                  </li>
                  <li className="transform transition-all duration-300 hover:translate-x-2">
                    <Link
                      to={"/create-auction"}
                      className="flex text-lg font-semibold gap-3 items-center px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#D6482b]/10 hover:to-[#ff6b4a]/10 hover:text-[#D6482b] transition-all duration-300 group"
                    >
                      <IoIosCreate className="text-2xl group-hover:scale-110 transition-transform duration-300" />
                      <span>Create Auction</span>
                    </Link>
                  </li>
                  <li className="transform transition-all duration-300 hover:translate-x-2">
                    <Link
                      to={"/view-my-auctions"}
                      className="flex text-lg font-semibold gap-3 items-center px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#D6482b]/10 hover:to-[#ff6b4a]/10 hover:text-[#D6482b] transition-all duration-300 group"
                    >
                      <FaEye className="text-2xl group-hover:scale-110 transition-transform duration-300" />
                      <span>View My Auctions</span>
                    </Link>
                  </li>
                </>
              )}

              {/* Super Admin Link */}
              {isAuthenticated && user && user.role === "Super Admin" && (
                <li className="transform transition-all duration-300 hover:translate-x-2">
                  <Link
                    to={"/dashboard"}
                    className="flex text-lg font-semibold gap-3 items-center px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#D6482b]/10 hover:to-[#ff6b4a]/10 hover:text-[#D6482b] transition-all duration-300 group"
                  >
                    <MdDashboard className="text-2xl group-hover:scale-110 transition-transform duration-300" />
                    <span>Dashboard</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Auth Buttons */}
          {!isAuthenticated ? (
            <div className="my-6 flex gap-3">
              <Link
                to={"/sign-up"}
                className="flex-1 bg-gradient-to-r from-[#D6482B] to-[#b8381e] font-semibold hover:shadow-lg hover:shadow-[#D6482B]/50 text-lg py-3 px-4 rounded-xl text-white text-center transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Sign Up
              </Link>
              <Link
                to={"/login"}
                className="flex-1 text-[#D6482B] bg-white border-2 border-[#D6482B] hover:bg-[#D6482B] hover:text-white font-semibold text-lg py-3 px-4 rounded-xl text-center transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="my-6">
              <button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-[#D6482B] to-[#b8381e] font-semibold hover:shadow-lg hover:shadow-[#D6482B]/50 text-lg py-3 px-4 rounded-xl text-white transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Logout
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-300"></div>
            </div>
          </div>

          {/* Secondary Navigation */}
          <nav>
            <ul className="flex flex-col gap-2">
              {isAuthenticated && (
                <li className="transform transition-all duration-300 hover:translate-x-2">
                  <Link
                    to={"/me"}
                    className="flex text-lg font-semibold gap-3 items-center px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#D6482b]/10 hover:to-[#ff6b4a]/10 hover:text-[#D6482b] transition-all duration-300 group"
                  >
                    <FaUserCircle className="text-2xl group-hover:scale-110 transition-transform duration-300" />
                    <span>Profile</span>
                  </Link>
                </li>
              )}
              <li className="transform transition-all duration-300 hover:translate-x-2">
                <Link
                  to={"/how-it-works-info"}
                  className="flex text-lg font-semibold gap-3 items-center px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#D6482b]/10 hover:to-[#ff6b4a]/10 hover:text-[#D6482b] transition-all duration-300 group"
                >
                  <SiGooglesearchconsole className="text-2xl group-hover:scale-110 transition-transform duration-300" />
                  <span>How it works</span>
                </Link>
              </li>
              <li className="transform transition-all duration-300 hover:translate-x-2">
                <Link
                  to={"/about"}
                  className="flex text-lg font-semibold gap-3 items-center px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-[#D6482b]/10 hover:to-[#ff6b4a]/10 hover:text-[#D6482b] transition-all duration-300 group"
                >
                  <BsFillInfoSquareFill className="text-2xl group-hover:scale-110 transition-transform duration-300" />
                  <span>About Us</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Close Button */}
          <button
            onClick={() => setShow(!show)}
            className="absolute top-0 right-4 text-[32px] sm:hidden text-stone-400 hover:text-[#D6482B] transition-all duration-300 hover:rotate-90 hover:scale-110"
          >
            <IoMdCloseCircleOutline />
          </button>
        </div>

        {/* Footer */}
        <div className="space-y-4">
          {/* Social Links */}
          <div className="flex gap-3 items-center">
            <Link
              to="/"
              className="bg-white text-stone-500 p-3 text-xl rounded-xl hover:text-blue-600 hover:shadow-lg hover:shadow-blue-600/30 hover:scale-110 transition-all duration-300 border border-stone-200"
            >
              <FaFacebook />
            </Link>
            <Link
              to="/"
              className="bg-white text-stone-500 p-3 text-xl rounded-xl hover:text-pink-600 hover:shadow-lg hover:shadow-pink-600/30 hover:scale-110 transition-all duration-300 border border-stone-200"
            >
              <RiInstagramFill />
            </Link>
          </div>

          {/* Contact & Copyright */}
          <div className="space-y-1">
            <Link
              to={"/contact"}
              className="block text-stone-600 font-semibold hover:text-[#d6482b] transition-all duration-300 hover:translate-x-1"
            >
              Contact Us →
            </Link>
            <p className="text-stone-500 text-sm">&copy; BidBazaar, LLC.</p>
            {/* <p className="text-stone-500 text-sm">
              Designed By{" "}
            </p>
            <p className="text-stone-500 text-sm">
              <Link
                to={"/"}
                className="font-semibold hover:text-[#d6482b] transition-all duration-300"
              >
                Saad Ali Khan
                Enayat Ur Rehman
                Ammar Bin Amir
              </Link>
            </p> */}

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