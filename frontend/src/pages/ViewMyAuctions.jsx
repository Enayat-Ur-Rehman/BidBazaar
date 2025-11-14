// import CardTwo from "@/custom-components/MyAuctionsCard";
// import Spinner from "@/custom-components/Spinner";
// import { getMyAuctionItems } from "@/store/slices/auctionSlice";
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const ViewMyAuctions = () => {
//   const { myAuctions, loading } = useSelector((state) => state.auction);
//   const { user, isAuthenticated } = useSelector((state) => state.user);

//   const dispatch = useDispatch();
//   const navigateTo = useNavigate();

//   useEffect(() => {
//     if (!isAuthenticated || user.role !== "Auctioneer") {
//       navigateTo("/");
//     }
//     dispatch(getMyAuctionItems());
//   }, [dispatch, isAuthenticated]);

//   return (
//     <>
//       <div className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
//         <h1
//           className={`text-[#d6482b] text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
//         >
//           My Auctions
//         </h1>
//         {loading ? (
//           <Spinner />
//         ) : (
//           <div
//             className={`${
//               myAuctions.length > 2 && "flex-grow"
//             } flex flex-wrap gap-6`}
//           >
//             {myAuctions.length > 0 ? (
//               myAuctions.map((element) => {
//                 return (
//                   <CardTwo
//                     title={element.title}
//                     startingBid={element.startingBid}
//                     endTime={element.endTime}
//                     startTime={element.startTime}
//                     imgSrc={element.image?.url}
//                     id={element._id}
//                     key={element._id}
//                   />
//                 );
//               })
//             ) : (
//               <h3 className="text-[#666] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl mt-5">
//                 You have not posted any auction.
//               </h3>
//             )}{" "}
//             :
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default ViewMyAuctions;


//Version 2:

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMyAuctionItems } from "@/store/slices/auctionSlice";
import { 
  Plus, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package
} from "lucide-react";
import CardTwo from "@/custom-components/MyAuctionsCard";

const ViewMyAuctions = () => {
  const { myAuctions, loading } = useSelector((state) => state.auction);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  console.log(myAuctions);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || user.role !== "Auctioneer") {
      navigateTo("/");
    }
    dispatch(getMyAuctionItems());
  }, [dispatch, isAuthenticated]);

  const getAuctionStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return "upcoming";
    if (now > end) return "ended";
    return "live";
  };

  const getFilteredAuctions = () => {
    let filtered = [...myAuctions];

    if (searchQuery) {
      filtered = filtered.filter((auction) =>
        auction.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((auction) => 
        getAuctionStatus(auction.startTime, auction.endTime) === filterStatus
      );
    }

    return filtered;
  };

  const filteredAuctions = getFilteredAuctions();

  const stats = {
    total: myAuctions.length,
    live: myAuctions.filter(a => getAuctionStatus(a.startTime, a.endTime) === "live").length,
    upcoming: myAuctions.filter(a => getAuctionStatus(a.startTime, a.endTime) === "upcoming").length,
    ended: myAuctions.filter(a => getAuctionStatus(a.startTime, a.endTime) === "ended").length,
    totalValue: myAuctions.reduce((sum, a) => sum + (a.startingBid || 0), 0)
  };

  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  





  return (
    <div className="w-full min-h-screen px-5 pb-12 lg:px-8 py-8 flex flex-col bg-gradient-to-br from-gray-50 to-orange-50">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-2">
              My Auctions
            </h1>
            <p className="text-gray-600 text-lg">
              Manage and track all your auction listings
            </p>
          </div>
          <button 
            onClick={() => navigateTo("/create-auction")}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Create New Auction
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Auctions</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 shadow-sm border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-green-700 mb-1">{stats.live}</div>
            <div className="text-sm text-green-700 font-medium">Live Now</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 shadow-sm border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-700 mb-1">{stats.upcoming}</div>
            <div className="text-sm text-blue-700 font-medium">Upcoming</div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-gray-600" />
            </div>
            <div className="text-3xl font-bold text-gray-700 mb-1">{stats.ended}</div>
            <div className="text-sm text-gray-700 font-medium">Completed</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 shadow-sm border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-700 mb-1">
              ${stats.totalValue.toLocaleString()}
            </div>
            <div className="text-sm text-orange-700 font-medium">Total Value</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search your auctions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {["all", "live", "upcoming", "ended"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-5 py-3 rounded-lg font-medium transition-all capitalize ${
                    filterStatus === status
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Auctions Grid */}
      {filteredAuctions.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {searchQuery || filterStatus !== "all" 
                ? "No auctions found" 
                : "No auctions yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterStatus !== "all"
                ? "Try adjusting your filters or search query"
                : "Start by creating your first auction listing"}
            </p>
            {!searchQuery && filterStatus === "all" && (
              <button 
                onClick={() => navigateTo("/submit-auction")}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Create Your First Auction
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-600 font-medium">
              Showing <span className="text-orange-600 font-bold">{filteredAuctions.length}</span> of {myAuctions.length} auctions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions.map((auction) => (
              <CardTwo imgSrc={auction.image?.url} title={auction.title} startingBid={auction.startingBid} startTime={auction.startingBid} endTime={auction.endTime} id={auction._id}  />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ViewMyAuctions;


//Version 3 - older card:

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { getMyAuctionItems } from "@/store/slices/auctionSlice";
// import { 
//   Plus, 
//   TrendingUp, 
//   Clock, 
//   DollarSign, 
//   Package,
//   CheckCircle,
//   Search
// } from "lucide-react";
// import CardTwo from "@/custom-components/MyAuctionsCard";

// const ViewMyAuctions = () => {
//   const { myAuctions, loading } = useSelector((state) => state.auction);
//   const { user, isAuthenticated } = useSelector((state) => state.user);
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");

//   const dispatch = useDispatch();
//   const navigateTo = useNavigate();

//   useEffect(() => {
//     if (!isAuthenticated || user.role !== "Auctioneer") {
//       navigateTo("/");
//     }
//     dispatch(getMyAuctionItems());
//   }, [dispatch, isAuthenticated]);

//   const getAuctionStatus = (startTime, endTime) => {
//     const now = new Date();
//     const start = new Date(startTime);
//     const end = new Date(endTime);

//     if (now < start) return "upcoming";
//     if (now > end) return "ended";
//     return "live";
//   };

//   const getFilteredAuctions = () => {
//     let filtered = [...myAuctions];

//     if (searchQuery) {
//       filtered = filtered.filter((auction) =>
//         auction.title.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     if (filterStatus !== "all") {
//       filtered = filtered.filter((auction) => 
//         getAuctionStatus(auction.startTime, auction.endTime) === filterStatus
//       );
//     }

//     return filtered;
//   };

//   const filteredAuctions = getFilteredAuctions();

//   const stats = {
//     total: myAuctions.length,
//     live: myAuctions.filter(a => getAuctionStatus(a.startTime, a.endTime) === "live").length,
//     upcoming: myAuctions.filter(a => getAuctionStatus(a.startTime, a.endTime) === "upcoming").length,
//     ended: myAuctions.filter(a => getAuctionStatus(a.startTime, a.endTime) === "ended").length,
//     totalValue: myAuctions.reduce((sum, a) => sum + (a.startingBid || 0), 0)
//   };

//   if (loading) {
//     return (
//       <div className="w-full ml-0 m-0 h-screen px-5 pt-20 lg:pl-[320px] flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading your auctions...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full ml-0 m-0 min-h-screen px-5 pt-20 lg:pl-[320px] pb-12 bg-gradient-to-br from-gray-50 to-orange-50">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-2">
//               My Auctions
//             </h1>
//             <p className="text-gray-600 text-lg">
//               Manage and track all your auction listings
//             </p>
//           </div>
//           <button 
//             onClick={() => navigateTo("/submit-auction")}
//             className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
//           >
//             <Plus className="w-5 h-5" />
//             Create New Auction
//           </button>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
//           <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between mb-2">
//               <Package className="w-8 h-8 text-gray-400" />
//             </div>
//             <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
//             <div className="text-sm text-gray-600">Total Auctions</div>
//           </div>

//           <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 shadow-sm border border-green-200">
//             <div className="flex items-center justify-between mb-2">
//               <TrendingUp className="w-8 h-8 text-green-600" />
//             </div>
//             <div className="text-3xl font-bold text-green-700 mb-1">{stats.live}</div>
//             <div className="text-sm text-green-700 font-medium">Live Now</div>
//           </div>

//           <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 shadow-sm border border-blue-200">
//             <div className="flex items-center justify-between mb-2">
//               <Clock className="w-8 h-8 text-blue-600" />
//             </div>
//             <div className="text-3xl font-bold text-blue-700 mb-1">{stats.upcoming}</div>
//             <div className="text-sm text-blue-700 font-medium">Upcoming</div>
//           </div>

//           <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 shadow-sm border border-gray-200">
//             <div className="flex items-center justify-between mb-2">
//               <CheckCircle className="w-8 h-8 text-gray-600" />
//             </div>
//             <div className="text-3xl font-bold text-gray-700 mb-1">{stats.ended}</div>
//             <div className="text-sm text-gray-700 font-medium">Completed</div>
//           </div>

//           <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 shadow-sm border border-orange-200">
//             <div className="flex items-center justify-between mb-2">
//               <DollarSign className="w-8 h-8 text-orange-600" />
//             </div>
//             <div className="text-2xl font-bold text-orange-700 mb-1">
//               ${stats.totalValue.toLocaleString()}
//             </div>
//             <div className="text-sm text-orange-700 font-medium">Total Value</div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search your auctions..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//               />
//             </div>
//             <div className="flex gap-2 flex-wrap">
//               {["all", "live", "upcoming", "ended"].map((status) => (
//                 <button
//                   key={status}
//                   onClick={() => setFilterStatus(status)}
//                   className={`px-5 py-3 rounded-lg font-medium transition-all capitalize ${
//                     filterStatus === status
//                       ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   {status}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Auctions Grid */}
//       {filteredAuctions.length === 0 ? (
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
//           <div className="max-w-md mx-auto">
//             <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Package className="w-10 h-10 text-orange-600" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900 mb-3">
//               {searchQuery || filterStatus !== "all" 
//                 ? "No auctions found" 
//                 : "No auctions yet"}
//             </h3>
//             <p className="text-gray-600 mb-6">
//               {searchQuery || filterStatus !== "all"
//                 ? "Try adjusting your filters or search query"
//                 : "Start by creating your first auction listing"}
//             </p>
//             {!searchQuery && filterStatus === "all" && (
//               <button 
//                 onClick={() => navigateTo("/submit-auction")}
//                 className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
//               >
//                 <Plus className="w-5 h-5" />
//                 Create Your First Auction
//               </button>
//             )}
//           </div>
//         </div>
//       ) : (
//         <>
//           <div className="mb-4">
//             <p className="text-gray-600 font-medium">
//               Showing <span className="text-orange-600 font-bold">{filteredAuctions.length}</span> of {myAuctions.length} auctions
//             </p>
//           </div>
//           <div className="flex flex-wrap gap-6">
//             {filteredAuctions.map((element) => (
//               <CardTwo
//                 key={element._id}
//                 title={element.title}
//                 startingBid={element.startingBid}
//                 endTime={element.endTime}
//                 startTime={element.startTime}
//                 imgSrc={element.image?.url}
//                 id={element._id}
//               />
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default ViewMyAuctions;