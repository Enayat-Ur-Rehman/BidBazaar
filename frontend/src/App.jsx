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

                {/* ========== SUPER ADMIN PROTECTED ROUTES ========== */}
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

// import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // Context
// import { ThemeProvider } from "./contexts/ThemeContext";

// // Layout Components
// import SideDrawer from "./layout/SideDrawer";
// import Header from "./layout/Header";
// import ProtectedRoute from "./layout/ProtectedRoute";

// // Redux Actions
// import { fetchUser } from "./store/slices/userSlice";
// import { getAllAuctionItems } from "./store/slices/auctionSlice";
// import { fetchLeaderboard } from "./store/slices/userSlice";

// // Public Pages
// import Home from "./pages/Home";
// import SignUp from "./pages/SignUp";
// import Login from "./pages/Login";
// import HowItWorks from "./pages/HowItWorks";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
// import Leaderboard from "./pages/Leaderboard";
// import Auctions from "./pages/Auctions";
// import AuctionItem from "./pages/AuctionItem";

// // Protected Pages
// import Dashboard from "./pages/Dashboard/Dashboard";
// import CreateAuction from "./pages/CreateAuction";
// import ViewMyAuctions from "./pages/ViewMyAuctions";
// import ViewAuctionDetails from "./pages/ViewAuctionDetails";
// import SubmitCommission from "./pages/SubmitCommission";
// import UserProfile from "./pages/UserProfile";

// // Layout wrapper for authenticated users
// const AuthenticatedLayout = ({ children, sidebarCollapsed, handleToggleSidebar }) => {
//   return (
//     <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       {/* Sidebar */}
//       <SideDrawer 
//         isCollapsed={sidebarCollapsed} 
//         onToggleCollapse={handleToggleSidebar}
//       />

//       {/* Main Content Area - Flex Column with dynamic margin */}
//       <div 
//         className={`flex-1 flex flex-col overflow-hidden transition-all duration-500 ${
//           sidebarCollapsed ? 'lg:ml-[80px]' : 'lg:ml-[320px]'
//         }`}
//       >
//         {/* Header - Sticky */}
//         <Header 
//           title="BidBazaar"
//           subtitle="Online Auction Platform"
//           toggleSidebar={handleToggleSidebar}
//           sidebarCollapsed={sidebarCollapsed}
//         />

//         {/* Main Body - Scrollable */}
//         <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#fdfbf7] via-[#fff5f0] to-[#ffe8e0]">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// // Layout wrapper for public pages (full width)
// const PublicLayout = ({ children }) => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#fdfbf7] via-[#fff5f0] to-[#ffe8e0]">
//       {children}
//     </div>
//   );
// };

// const App = () => {
//   const dispatch = useDispatch();
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const { isAuthenticated } = useSelector((state) => state.user);

//   useEffect(() => {
//     dispatch(fetchUser());
//     dispatch(getAllAuctionItems());
//     dispatch(fetchLeaderboard());
//   }, [dispatch]);

//   const handleToggleSidebar = (collapsed) => {
//     setSidebarCollapsed(collapsed);
//   };

//   return (
//     <ThemeProvider>
//       <Router>
//         <Routes>
//           {/* ========== PUBLIC ROUTES (Full Width) ========== */}
//           <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
//           <Route path="/sign-up" element={<PublicLayout><SignUp /></PublicLayout>} />
//           <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
//           <Route path="/how-it-works-info" element={<PublicLayout><HowItWorks /></PublicLayout>} />
//           <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
//           <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
//           <Route path="/leaderboard" element={<PublicLayout><Leaderboard /></PublicLayout>} />
//           <Route path="/auctions" element={<PublicLayout><Auctions /></PublicLayout>} />
//           <Route path="/auction/item/:id" element={<PublicLayout><AuctionItem /></PublicLayout>} />

//           {/* ========== AUTHENTICATED ROUTES (With Sidebar & Header) ========== */}
//           {isAuthenticated && (
//             <>
//               {/* ========== SUPER ADMIN PROTECTED ROUTES ========== */}
//               <Route
//                 path="/dashboard"
//                 element={
//                   <AuthenticatedLayout sidebarCollapsed={sidebarCollapsed} handleToggleSidebar={handleToggleSidebar}>
//                     <ProtectedRoute allowedRoles={['Super Admin']}>
//                       <Dashboard />
//                     </ProtectedRoute>
//                   </AuthenticatedLayout>
//                 }
//               />

//               {/* ========== AUCTIONEER PROTECTED ROUTES ========== */}
//               <Route
//                 path="/create-auction"
//                 element={
//                   <AuthenticatedLayout sidebarCollapsed={sidebarCollapsed} handleToggleSidebar={handleToggleSidebar}>
//                     <ProtectedRoute allowedRoles={['Auctioneer']}>
//                       <CreateAuction />
//                     </ProtectedRoute>
//                   </AuthenticatedLayout>
//                 }
//               />
//               <Route
//                 path="/view-my-auctions"
//                 element={
//                   <AuthenticatedLayout sidebarCollapsed={sidebarCollapsed} handleToggleSidebar={handleToggleSidebar}>
//                     <ProtectedRoute allowedRoles={['Auctioneer']}>
//                       <ViewMyAuctions />
//                     </ProtectedRoute>
//                   </AuthenticatedLayout>
//                 }
//               />
//               <Route
//                 path="/auction/details/:id"
//                 element={
//                   <AuthenticatedLayout sidebarCollapsed={sidebarCollapsed} handleToggleSidebar={handleToggleSidebar}>
//                     <ProtectedRoute allowedRoles={['Auctioneer']}>
//                       <ViewAuctionDetails />
//                     </ProtectedRoute>
//                   </AuthenticatedLayout>
//                 }
//               />
//               <Route
//                 path="/submit-commission"
//                 element={
//                   <AuthenticatedLayout sidebarCollapsed={sidebarCollapsed} handleToggleSidebar={handleToggleSidebar}>
//                     <ProtectedRoute allowedRoles={['Auctioneer']}>
//                       <SubmitCommission />
//                     </ProtectedRoute>
//                   </AuthenticatedLayout>
//                 }
//               />

//               {/* ========== SHARED PROTECTED ROUTES ========== */}
//               <Route
//                 path="/me"
//                 element={
//                   <AuthenticatedLayout sidebarCollapsed={sidebarCollapsed} handleToggleSidebar={handleToggleSidebar}>
//                     <ProtectedRoute allowedRoles={['Auctioneer', 'Bidder', 'Super Admin']}>
//                       <UserProfile />
//                     </ProtectedRoute>
//                   </AuthenticatedLayout>
//                 }
//               />
//             </>
//           )}

//           {/* ========== FALLBACK ROUTE ========== */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>

//         {/* Toast Notifications */}
//         <ToastContainer 
//           position="top-right" 
//           theme="light"
//           toastStyle={{
//             background: 'linear-gradient(135deg, #fdfbf7 0%, #fff5f0 100%)',
//             border: '1px solid #ffe8e0',
//           }}
//         />
//       </Router>
//     </ThemeProvider>
//   );
// };

// export default App;