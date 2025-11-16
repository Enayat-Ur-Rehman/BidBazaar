import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ThemeProvider } from "./contexts/ThemeContext";

// Layout Components
import SideDrawer from "./layout/SideDrawer";
import Header from "./layout/Header";
import ProtectedRoute from "./layout/ProtectedRoute";

// Redux Actions
import { fetchUser, fetchLeaderboard } from "./store/slices/userSlice";
import { getAllAuctionItems } from "./store/slices/auctionSlice";

// Public Pages
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Leaderboard from "./pages/Leaderboard";
import Auctions from "./pages/Auctions";
import AuctionItem from "./pages/AuctionItem";

// Protected Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import CreateAuction from "./pages/CreateAuction";
import ViewMyAuctions from "./pages/ViewMyAuctions";
import ViewAuctionDetails from "./pages/ViewAuctionDetails";
import SubmitCommission from "./pages/SubmitCommission";
import UserProfile from "./pages/UserProfile";
import MyBids from "./pages/Bidder/MyBids";
import BidderDashboard from "./pages/Bidder/BidderDash";


import PendingPayments from "./pages/Payment/PendingPages";
import PaymentCheckout from "./pages/Payment/PaymentCheckout";
import PaymentCancel from "./pages/Payment/PaymentCancel";
import PaymentSuccess from "./pages/Payment/PaymentSuccess";

// --- AppContent handles route-based layout ---
const AppContent = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Hide sidebar + header only when path is "/"
  const hideLayout = location.pathname === "/" || location.pathname === "/login"  || location.pathname === "/sign-up";

  const handleToggleSidebar = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* ===== Sidebar ===== */}
      {!hideLayout && (
        <SideDrawer
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />
      )}

      {/* ===== Main Content ===== */}
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-500 ${
          !hideLayout
            ? sidebarCollapsed
              ? "lg:ml-[80px]"
              : "lg:ml-[320px]"
            : ""
        }`}
      >
        {/* ===== Header ===== */}
        {!hideLayout && (
          <Header
            title="BidBazaar"
            subtitle="Online Auction Platform"
            toggleSidebar={handleToggleSidebar}
            sidebarCollapsed={sidebarCollapsed}
          />
        )}

        {/* ===== Main Body ===== */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#fdfbf7] via-[#fff5f0] to-[#ffe8e0] ">
          <Routes>
            {/* ========== PUBLIC ROUTES ========== */}
            <Route path="/" element={<Home />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/how-it-works-info" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/auctions" element={<Auctions />} />
            <Route path="/auction/item/:id" element={<AuctionItem />} />

            {/* ========== PROTECTED ROUTES ========== */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["Super Admin" , "Bidder"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-auction"
              element={
                <ProtectedRoute allowedRoles={["Auctioneer"]}>
                  <CreateAuction />
                </ProtectedRoute>
              }
            />

            <Route
              path="/view-my-auctions"
              element={
                <ProtectedRoute allowedRoles={["Auctioneer"]}>
                  <ViewMyAuctions />
                </ProtectedRoute>
              }
            />

            <Route
              path="/auction/details/:id"
              element={
                <ProtectedRoute allowedRoles={["Auctioneer"]}>
                  <ViewAuctionDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/submit-commission"
              element={
                <ProtectedRoute allowedRoles={["Auctioneer"]}>
                  <SubmitCommission />
                </ProtectedRoute>
              }
            />


            <Route
              path="/me"
              element={
                <ProtectedRoute
                  allowedRoles={["Auctioneer", "Bidder", "Super Admin"]}
                >
                  <UserProfile />
                </ProtectedRoute>
              }
            />

            {/* ========== BIDDER ROUTES ========== */}
            <Route
              path="/bidder/myBids"
              element={
                <ProtectedRoute allowedRoles={["Bidder"]}>
                  <MyBids />
                </ProtectedRoute>
              }
            />

            <Route
              path="/bidder/myPayments"
              element={
                <ProtectedRoute allowedRoles={["Bidder"]}>
                  <PendingPayments></PendingPayments>
                </ProtectedRoute>
              }
            ></Route>

            <Route
              path="/payment/:paymentId"
              element={
                <ProtectedRoute allowedRoles={["Bidder"]}>
                  <PaymentCheckout></PaymentCheckout>
                </ProtectedRoute>
              }
            ></Route>

            <Route
              path="/bidder/dashboard"
              element={
                <ProtectedRoute allowedRoles={["Bidder"]}>
                  <BidderDashboard></BidderDashboard>
                </ProtectedRoute>
              }
            ></Route>



            <Route
              path="/payment/success"
              element={
                <PaymentSuccess></PaymentSuccess>
              }
            ></Route>

            <Route
              path="/payment/cancel"
              element={
                <PaymentCancel></PaymentCancel>
              }
            ></Route>


          

            {/* ========== FALLBACK ========== */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// --- Root App Component ---
const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(getAllAuctionItems());
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  return (
    <ThemeProvider>
      <Router>
        <AppContent />
        <ToastContainer
          position="top-right"
          theme="light"
          toastStyle={{
            background: "linear-gradient(135deg, #fdfbf7 0%, #fff5f0 100%)",
            border: "1px solid #ffe8e0",
          }}
        />
      </Router>
    </ThemeProvider>
  );
};

export default App;
