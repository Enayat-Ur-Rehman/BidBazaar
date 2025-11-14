// import Spinner from "@/custom-components/Spinner";
// import { getAuctionDetail } from "@/store/slices/auctionSlice";
// import { placeBid } from "@/store/slices/bidSlice";
// import React, { useEffect, useState } from "react";
// import { FaGreaterThan } from "react-icons/fa";
// import { RiAuctionFill } from "react-icons/ri";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate, useParams } from "react-router-dom";

// const AuctionItem = () => {
//   const { id } = useParams();
//   const { loading, auctionDetail, auctionBidders } = useSelector(
//     (state) => state.auction
//   );
//   const { isAuthenticated } = useSelector((state) => state.user);

//   const navigateTo = useNavigate();
//   const dispatch = useDispatch();

//   const [amount, setAmount] = useState(0);
//   const handleBid = () => {
//     const formData = new FormData();
//     formData.append("amount", amount);
//     dispatch(placeBid(id, formData));
//     dispatch(getAuctionDetail(id));
//   };

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigateTo("/");
//     }
//     if (id) {
//       dispatch(getAuctionDetail(id));
//     }
//   }, [isAuthenticated]);
//   return (
//     <>
//       <section className="w-full px-5 lg:px-8 py-8 flex flex-col ">
//         <div className="text-[16px] flex flex-wrap gap-2 items-center">
//           <Link
//             to="/"
//             className="font-semibold transition-all duration-300 hover:text-[#D6482B]"
//           >
//             Home
//           </Link>
//           <FaGreaterThan className="text-stone-400" />
//           <Link
//             to={"/auctions"}
//             className="font-semibold transition-all duration-300 hover:text-[#D6482B]"
//           >
//             Auctions
//           </Link>
//           <FaGreaterThan className="text-stone-400" />
//           <p className="text-stone-600">{auctionDetail.title}</p>
//         </div>
//         {loading ? (
//           <Spinner />
//         ) : (
//           <div className="flex gap-4 flex-col lg:flex-row">
//             <div className="flex-1 flex flex-col gap-3">
//               <div className="flex gap-4 flex-col lg:flex-row">
//                 <div className="bg-white w-[100%] lg:w-40 lg:h-40 flex justify-center items-center p-5">
//                   <img
//                     src={auctionDetail.image?.url}
//                     alt={auctionDetail.title}
//                   />
//                 </div>
//                 <div className="flex flex-col justify-around pb-4">
//                   <h3 className="text-[#111] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl">
//                     {auctionDetail.title}
//                   </h3>
//                   <p className="text-xl font-semibold">
//                     Condition:{" "}
//                     <span className="text-[#D6482B]">
//                       {auctionDetail.condition}
//                     </span>
//                   </p>
//                   <p className="text-xl font-semibold">
//                     Minimum Bid:{" "}
//                     <span className="text-[#D6482B]">
//                       Rs.{auctionDetail.startingBid}
//                     </span>
//                   </p>
//                 </div>
//               </div>
//               <p className="text-xl w-fit font-bold">
//                 Auction Item Description
//               </p>
//               <hr className="my-2 border-t-[1px] border-t-stone-700" />
//               {auctionDetail.description &&
//                 auctionDetail.description.split(". ").map((element, index) => {
//                   return (
//                     <li key={index} className="text-[18px] my-2">
//                       {element}
//                     </li>
//                   );
//                 })}
//             </div>
//             <div className="flex-1">
//               <header className="bg-stone-200 py-4 text-[24px] font-semibold px-4">
//                 BIDS
//               </header>
//               <div className="bg-white px-4 min-h-fit lg:min-h-[650px]">
//                 {auctionBidders &&
//                 new Date(auctionDetail.startTime) < Date.now() &&
//                 new Date(auctionDetail.endTime) > Date.now() ? (
//                   auctionBidders.length > 0 ? (
//                     auctionBidders.map((element, index) => {
//                       return (
//                         <div
//                           key={index}
//                           className="py-2 flex items-center justify-between"
//                         >
//                           <div className="flex items-center gap-4">
//                             <img
//                               src={element.profileImage}
//                               alt={element.userName}
//                               className="w-12 h-12 rounded-full my-2 hidden md:block"
//                             />
//                             <p className="text-[18px] font-semibold">
//                               {element.userName}
//                             </p>
//                           </div>
//                           {index === 0 ? (
//                             <p className="text-[20px] font-semibold text-green-600">
//                               1st
//                             </p>
//                           ) : index === 1 ? (
//                             <p className="text-[20px] font-semibold text-blue-600">
//                               2nd
//                             </p>
//                           ) : index === 2 ? (
//                             <p className="text-[20px] font-semibold text-yellow-600">
//                               3rd
//                             </p>
//                           ) : (
//                             <p className="text-[20px] font-semibold text-gray-600">
//                               {index + 1}th
//                             </p>
//                           )}
//                         </div>
//                       );
//                     })
//                   ) : (
//                     <p className="text-center text-gray-500 py-4">
//                       No bids for this auction
//                     </p>
//                   )
//                 ) : Date.now() < new Date(auctionDetail.startTime) ? (
//                   <img
//                     src="/notStarted.png"
//                     alt="not-started"
//                     className="w-full max-h-[650px]"
//                   />
//                 ) : (
//                   <img
//                     src="/auctionEnded.png"
//                     alt="ended"
//                     className="w-full max-h-[650px]"
//                   />
//                 )}
//               </div>

//               <div className="bg-[#D6482B] py-4 text-[16px] md:text-[24px] font-semibold px-4 flex items-center justify-between">
//                 {Date.now() >= new Date(auctionDetail.startTime) &&
//                 Date.now() <= new Date(auctionDetail.endTime) ? (
//                   <>
//                     <div className="flex gap-3 flex-col sm:flex-row sm:items-center">
//                       <p className="text-white">Place Bid</p>
//                       <input
//                         type="number"
//                         className="w-32 focus:outline-none md:text-[20px] p-1"
//                         value={amount}
//                         onChange={(e) => setAmount(e.target.value)}
//                       />
//                     </div>
//                     <button
//                       className="p-4 text-white bg-black rounded-full transition-all duration-300 hover:bg-[#222]"
//                       onClick={handleBid}
//                     >
//                       <RiAuctionFill />
//                     </button>
//                   </>
//                 ) : new Date(auctionDetail.startTime) > Date.now() ? (
//                   <p className="text-white font-semibold text-xl">
//                     Auction has not started yet!
//                   </p>
//                 ) : (
//                   <p className="text-white font-semibold text-xl">
//                     Auction has ended!
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </section>
//     </>
//   );
// };

// export default AuctionItem;
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { FaGreaterThan, FaClock, FaTrophy, FaHistory, FaEye, FaHeart, FaShare, FaInfoCircle } from "react-icons/fa";
import { RiAuctionFill, RiTimerFlashLine } from "react-icons/ri";
import { BsLightningChargeFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Spinner from "@/custom-components/Spinner";
import { getAuctionDetail } from "@/store/slices/auctionSlice";
import { placeBid } from "@/store/slices/bidSlice";

const AuctionItem = () => {
  const { id } = useParams();
  const { loading, auctionDetail, auctionBidders } = useSelector(
    (state) => state.auction
  );
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  
  // State management
  const [amount, setAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBidHistory, setShowBidHistory] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isWatching, setIsWatching] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [quickBidAmounts, setQuickBidAmounts] = useState([]);

  // Calculate auction status
  const auctionStatus = useMemo(() => {
    const now = Date.now();
    const startTime = new Date(auctionDetail.startTime).getTime();
    const endTime = new Date(auctionDetail.endTime).getTime();

    return {
      isActive: startTime < now && endTime > now,
      isUpcoming: startTime > now,
      isEnded: endTime < now,
      startTime,
      endTime
    };
  }, [auctionDetail.startTime, auctionDetail.endTime]);

  // Calculate quick bid suggestions
  useEffect(() => {
    const currentBid = auctionDetail.currentBid || auctionDetail.startingBid || 0;
    const increment = Math.ceil(currentBid * 0.05); // 5% increment
    setQuickBidAmounts([
      currentBid + increment,
      currentBid + increment * 2,
      currentBid + increment * 4
    ]);
  }, [auctionDetail.currentBid, auctionDetail.startingBid]);

  // Real-time countdown timer
  useEffect(() => {
    if (!auctionStatus.isActive && !auctionStatus.isUpcoming) return;

    const updateTimer = () => {
      const now = Date.now();
      const targetTime = auctionStatus.isActive ? auctionStatus.endTime : auctionStatus.startTime;
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeRemaining("Ended");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [auctionStatus]);

  // Validate bid amount
  const validateBid = useCallback((bidAmount) => {
    const numAmount = parseFloat(bidAmount);
    const minBid = auctionDetail.currentBid 
      ? auctionDetail.currentBid + 1 
      : auctionDetail.startingBid;

    if (!bidAmount || isNaN(numAmount)) {
      return "Please enter a valid amount";
    }
    if (numAmount < minBid) {
      return `Minimum bid is Rs. ${minBid.toLocaleString()}`;
    }
   
    return "";
  }, [auctionDetail.currentBid, auctionDetail.startingBid]);

  // Handle bid submission with validation
  const handleBid = async (bidAmount = amount) => {
    const error = validateBid(bidAmount);
    if (error) {
      setBidError(error);
      return;
    }

    setIsSubmitting(true);
    setBidError("");

    try {
      const formData = new FormData();
      formData.append("amount", bidAmount);
      await dispatch(placeBid(id, formData));
      await dispatch(getAuctionDetail(id));
      setAmount("");
    } catch (error) {
      setBidError("Failed to place bid. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle quick bid
  const handleQuickBid = (quickAmount) => {
    setAmount(quickAmount.toString());
    handleBid(quickAmount);
  };

  // Handle amount input change
  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    if (value) {
      const error = validateBid(value);
      setBidError(error);
    } else {
      setBidError("");
    }
  };

  // Share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: auctionDetail.title,
        text: `Check out this auction: ${auctionDetail.title}`,
        url: window.location.href
      });
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  // Initial load
  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
      return;
    }
    if (id) {
      dispatch(getAuctionDetail(id));
    }
  }, [isAuthenticated, id, navigateTo, dispatch]);

  

  // Rank badge component
  const getRankBadge = (index) => {
    const badges = [
      { color: "bg-gradient-to-r from-yellow-400 to-yellow-600", text: "1st", icon: "🥇" },
      { color: "bg-gradient-to-r from-gray-300 to-gray-400", text: "2nd", icon: "🥈" },
      { color: "bg-gradient-to-r from-orange-400 to-orange-600", text: "3rd", icon: "🥉" },
    ];
    
    if (index < 3) {
      return (
        <div className={`${badges[index].color} text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-md`}>
          <span>{badges[index].icon}</span>
          <span>{badges[index].text}</span>
        </div>
      );
    }
    return (
      <div className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
        #{index + 1}
      </div>
    );
  };

  // Status badge component
  const StatusBadge = () => {
    if (auctionStatus.isActive) {
      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-300 rounded-full animate-pulse">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="text-green-700 font-bold text-sm">LIVE AUCTION</span>
        </div>
      );
    }
    if (auctionStatus.isUpcoming) {
      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-300 rounded-full">
          <FaClock className="text-blue-600" />
          <span className="text-blue-700 font-bold text-sm">UPCOMING</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-full">
        <span className="text-gray-700 font-bold text-sm">ENDED</span>
      </div>
    );
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/*Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Link
                to="/"
                className="text-gray-600 hover:text-red-600 font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <FaGreaterThan className="text-gray-400 text-xs" />
              <Link
                to="/auctions"
                className="text-gray-600 hover:text-red-600 font-medium transition-colors duration-200"
              >
                Auctions
              </Link>
              <FaGreaterThan className="text-gray-400 text-xs" />
              <span className="text-gray-900 font-semibold">
                {auctionDetail.title || "Loading..."}
              </span>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsWatching(!isWatching)}
                className={`p-2 rounded-lg border transition-all duration-200 ${
                  isWatching 
                    ? "bg-red-50 border-red-300 text-red-600" 
                    : "bg-white border-gray-300 text-gray-600 hover:border-red-300"
                }`}
                title="Watch this auction"
              >
                <FaHeart className={isWatching ? "fill-current" : ""} />
              </button>
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:border-red-300 transition-all duration-200"
                  title="Share auction"
                >
                  <FaShare />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Auction Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status and Timer Banner */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <StatusBadge />
                    {(auctionStatus.isActive || auctionStatus.isUpcoming) && (
                      <div className="flex items-center gap-3 text-white">
                        <RiTimerFlashLine className="text-2xl text-yellow-400" />
                        <div>
                          <p className="text-xs text-gray-400">
                            {auctionStatus.isActive ? "Ends in" : "Starts in"}
                          </p>
                          <p className="text-2xl font-bold">{timeRemaining}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Image and Quick Info Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image Container with hover effect */}
                    <div className="md:w-72 md:h-72 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center p-6 border border-gray-200 overflow-hidden group">
                      <img
                        src={auctionDetail.image?.url}
                        alt={auctionDetail.title}
                        className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Info Container */}
                    <div className="flex-1 flex flex-col justify-center space-y-5">
                      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                        {auctionDetail.title}
                      </h1>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600 font-medium min-w-[120px]">Condition:</span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700 border border-red-200">
                            {auctionDetail.condition}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600 font-medium min-w-[120px]">Starting Bid:</span>
                          <span className="text-2xl font-bold text-gray-700">
                            Rs. {auctionDetail.startingBid?.toLocaleString()}
                          </span>
                        </div>

                        {auctionDetail.currentBid && (
                          <div className="flex items-center gap-3 bg-green-50 -mx-2 px-2 py-2 rounded-lg border border-green-200">
                            <span className="text-green-700 font-medium min-w-[120px]">Current Bid:</span>
                            <div className="flex items-center gap-2">
                              <BsLightningChargeFill className="text-green-600 text-xl" />
                              <span className="text-3xl font-bold text-green-600">
                                Rs. {auctionDetail.currentBid?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Auction Stats */}
                        <div className="flex items-center gap-6 pt-2 text-sm text-gray-600">
                          
                          <div className="flex items-center gap-2">
                            <RiAuctionFill className="text-gray-400" />
                            <span>{auctionBidders?.length || 0} bids</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4 flex items-center gap-2">
                  <FaInfoCircle className="text-gray-600" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Item Description
                  </h2>
                </div>
                <div className="p-6">
                  {auctionDetail.description ? (
                    <ul className="space-y-3">
                      {auctionDetail.description.split(". ").map((element, index) => (
                        <li
                          key={index}
                          className="text-gray-700 leading-relaxed flex items-start gap-3 hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors"
                        >
                          <span className="text-red-500 mt-1.5 font-bold">•</span>
                          <span>{element.trim()}{element.endsWith('.') ? '' : '.'}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No description available</p>
                  )}
                </div>
              </div>

              {/* Bid History Toggle */}
              {auctionBidders && auctionBidders.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                  <button
                    onClick={() => setShowBidHistory(!showBidHistory)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FaHistory className="text-gray-600" />
                      <h2 className="text-xl font-bold text-gray-900">Bid History</h2>
                      <span className="text-sm text-gray-500">({auctionBidders.length})</span>
                    </div>
                    <FaGreaterThan className={`text-gray-400 transition-transform ${showBidHistory ? 'rotate-90' : ''}`} />
                  </button>
                  {showBidHistory && (
                    <div className="border-t border-gray-200 p-6">
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {auctionBidders.map((bidder, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={bidder.profileImage}
                                alt={bidder.userName}
                                className="w-10 h-10 rounded-full border-2 border-gray-300"
                              />
                              <div>
                                <p className="font-semibold text-gray-900">{bidder.userName}</p>
                                <p className="text-sm text-gray-500">Bid #{auctionBidders.length - index}</p>
                              </div>
                            </div>
                            {getRankBadge(index)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Bidding Section */}
            <div className="lg:col-span-1 ">
              <div className="bg-white rounded-xl  shadow-lg overflow-hidden sticky top-6 border border-gray-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-6 py-4">
                  <div className="flex items-center gap-2">
                    <FaTrophy className="text-yellow-400 text-xl" />
                    <h2 className="text-xl font-bold text-white">Live Bidding</h2>
                  </div>
                  {auctionStatus.isActive && (
                    <p className="text-gray-300 text-sm mt-1">
                      {auctionBidders?.length || 0} active bidders
                    </p>
                  )}
                </div>

                {/* Bidders List */}
                <div className="max-h-80 overflow-y-auto border-b border-gray-200">
                  {auctionStatus.isActive ? (
                    auctionBidders && auctionBidders.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {auctionBidders.slice(0, 5).map((bidder, index) => (
                          <div
                            key={index}
                            className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <img
                                  src={bidder.profileImage}
                                  alt={bidder.userName}
                                  className="w-10 h-10 rounded-full border-2 border-gray-200 flex-shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="font-semibold text-gray-900 truncate">
                                    {bidder.userName}
                                  </p>
                                  <p className="text-xs text-gray-500">Just now</p>
                                </div>
                              </div>
                              {getRankBadge(index)}
                            </div>
                          </div>
                        ))}
                        {auctionBidders.length > 5 && (
                          <div className="px-6 py-3 text-center">
                            <button
                              onClick={() => setShowBidHistory(true)}
                              className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                              View all {auctionBidders.length} bids
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="px-6 py-12 text-center">
                        <RiAuctionFill className="mx-auto text-gray-300 text-5xl mb-3" />
                        <p className="text-gray-500 font-medium">No bids yet</p>
                        <p className="text-gray-400 text-sm mt-1">Be the first to place a bid!</p>
                      </div>
                    )
                  ) : auctionStatus.isUpcoming ? (
                    <div className="px-6 py-12 text-center">
                      <img
                        src="/notStarted.png"
                        alt="Auction not started"
                        className="w-full max-w-xs mx-auto"
                      />
                      <div className="mt-4 flex items-center justify-center gap-2 text-gray-600">
                        <FaClock />
                        <p className="font-medium">Auction hasn't started yet</p>
                      </div>
                    </div>
                  ) : (
                    <div className="px-6 py-12 text-center">
                      <img
                        src="/auctionEnded.png"
                        alt="Auction ended"
                        className="w-full max-w-xs mx-auto"
                      />
                      <p className="mt-4 font-medium text-gray-600">Auction has ended</p>
                      {auctionBidders && auctionBidders.length > 0 && (
                        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-sm text-yellow-800 font-semibold">Winner</p>
                          <div className="flex items-center justify-center gap-2 mt-2">
                            <img
                              src={auctionBidders[0].profileImage}
                              alt={auctionBidders[0].userName}
                              className="w-8 h-8 rounded-full border-2 border-yellow-400"
                            />
                            <p className="font-bold text-gray-900">{auctionBidders[0].userName}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bidding Footer */}
                <div className="px-6 py-5 bg-gradient-to-br from-gray-50 to-white">
                  {auctionStatus.isActive ? (
                    <div className="space-y-4">
                      {/* Quick Bid Buttons */}
                      <div>
                        <p className="text-xs text-gray-600 mb-2 font-medium">Quick Bid</p>
                        <div className="grid grid-cols-3 gap-2">
                          {quickBidAmounts.map((quickAmount, index) => (
                            <button
                              key={index}
                              onClick={() => handleQuickBid(quickAmount)}
                              disabled={isSubmitting}
                              className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                            >
                              +{((quickAmount - (auctionDetail.currentBid || auctionDetail.startingBid)) / 1000).toFixed(0)}k
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Bid Input */}
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Enter custom amount"
                            className={`flex-1 px-4 py-3 rounded-lg border ${
                              bidError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-red-500'
                            } focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 font-semibold`}
                            value={amount}
                            onChange={handleAmountChange}
                            min={auctionDetail.currentBid || auctionDetail.startingBid}
                            disabled={isSubmitting}
                          />
                          <button
                            onClick={() => handleBid()}
                            disabled={!amount || parseFloat(amount) <= 0 || bidError || isSubmitting}
                            className="px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg font-semibold hover:from-slate-900 hover:to-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
                          >
                            {isSubmitting ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <RiAuctionFill className="text-xl" />
                                <span className="hidden sm:inline">Bid</span>
                              </>
                            )}
                          </button>
                        </div>
                        
                        {bidError && (
                          <p className="text-red-600 text-xs font-medium flex items-center gap-1">
                            <FaInfoCircle />
                            {bidError}
                          </p>
                        )}
                        
                        <p className="text-gray-600 text-xs">
                          Minimum: Rs. {(auctionDetail.currentBid 
                            ? auctionDetail.currentBid + 1 
                            : auctionDetail.startingBid)?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ) : auctionStatus.isUpcoming ? (
                    <div className="text-center py-2">
                      <p className="text-gray-900 font-semibold">Auction Starting Soon</p>
                      <p className="text-gray-600 text-sm mt-1">Check back in {timeRemaining}</p>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-gray-900 font-semibold">Auction Concluded</p>
                      <p className="text-gray-600 text-sm mt-1">Bidding is now closed</p>
                    </div>
                  )}
                </div>

                {/* Additional Info Card */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <FaInfoCircle className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">Bidding Tips</p>
                      <ul className="space-y-1 text-blue-800">
                        <li>• Set a maximum bid limit before starting</li>
                        <li>• Bid in the last few minutes for best chances</li>
                        <li>• Watch multiple items to compare prices</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AuctionItem;