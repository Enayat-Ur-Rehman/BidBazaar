import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./contexts/ThemeContext";

// Layout Components
import SideDrawer from "./layout/SideDrawer";
import Header from "./layout/Header";
import ProtectedRoute from "./layout/ProtectedRoute";

// Redux Actions
import { fetchUser } from "./store/slices/userSlice";
import { getAllAuctionItems } from "./store/slices/auctionSlice";
import { fetchLeaderboard } from "./store/slices/userSlice";

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
import BidderDash from "./pages/Bidder/BidderDash";
import MyBids from "./pages/Bidder/MyBids";
import WonBits from "./pages/Bidder/WonBits";

const App = () => {
  const dispatch = useDispatch();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(getAllAuctionItems());
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  const handleToggleSidebar = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {/* Sidebar */}
          <SideDrawer 
            isCollapsed={sidebarCollapsed} 
            onToggleCollapse={handleToggleSidebar}
          />

          {/* Main Content Area */}
          <div 
            className={`flex-1 flex flex-col overflow-hidden transition-all duration-500 ${
              sidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[320px]'
            }`}
          >
            {/* Header */}
            <Header 
              title="BidBazaar"
              subtitle="Online Auction Platform"
              toggleSidebar={handleToggleSidebar}
              sidebarCollapsed={sidebarCollapsed}
            />

            {/* Main Body */}
            <main className="h-screen flex-1 overflow-y-auto bg-gradient-to-br from-[#fdfbf7] via-[#fff5f0] to-[#ffe8e0]">
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

                {/* ========== SUPER ADMIN PROTECTED ROUoTES ========== */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['Super Admin']}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* ========== AUCTIONEER PROTECTED ROUTES ========== */}
                <Route
                  path="/create-auction"
                  element={
                    <ProtectedRoute allowedRoles={['Auctioneer']}>
                      <CreateAuction />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/view-my-auctions"
                  element={
                    <ProtectedRoute allowedRoles={['Auctioneer']}>
                      <ViewMyAuctions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/auction/details/:id"
                  element={
                    <ProtectedRoute allowedRoles={['Auctioneer']}>
                      <ViewAuctionDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/submit-commission"
                  element={
                    <ProtectedRoute allowedRoles={['Auctioneer']}>
                      <SubmitCommission />
                    </ProtectedRoute>
                  }
                />

              {/* ========== Bidder PROTECTED ROUTES ========== */}
                <Route
                  path="/bidder"
                  element={
                    <ProtectedRoute allowedRoles={['Bidder']}>
                      <BidderDash />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/bidder/my-bids"
                  element={
                    <ProtectedRoute allowedRoles={['Bidder']}>
                      <MyBids />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/bidder/won-items"
                  element={
                    <ProtectedRoute allowedRoles={['Bidder']}>
                      <WonBits />
                    </ProtectedRoute>
                  }
                />


                {/* ========== SHARED PROTECTED ROUTES ========== */}
                <Route
                  path="/me"
                  element={
                    <ProtectedRoute allowedRoles={['Auctioneer', 'Bidder', 'Super Admin']}>
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />

                {/* ========== FALLBACK ROUTE ========== */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>

        {/* Toast Notifications */}
        <ToastContainer 
          position="top-right" 
          theme="light"
          toastStyle={{
            background: 'linear-gradient(135deg, #fdfbf7 0%, #fff5f0 100%)',
            border: '1px solid #ffe8e0',
          }}
        />
      </Router>
    </ThemeProvider>
  );
};

export default App;

