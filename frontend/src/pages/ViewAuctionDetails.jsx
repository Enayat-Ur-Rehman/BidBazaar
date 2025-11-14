import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { 
  FaGreaterThan, 
  FaClock, 
  FaGavel, 
  FaTrophy, 
  FaCheckCircle,
  FaTimesCircle 
} from "react-icons/fa";
import { 
  Clock, 
  User, 
  DollarSign, 
  Award, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { getAuctionDetail } from "@/store/slices/auctionSlice";
import Spinner from "@/custom-components/Spinner";

// Countdown Timer Component
const CountdownTimer = ({ startTime, endTime }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [status, setStatus] = useState("upcoming"); // upcoming, active, ended

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();

      if (now < start) {
        setStatus("upcoming");
        const difference = start - now;
        return calculateTime(difference);
      } else if (now >= start && now < end) {
        setStatus("active");
        const difference = end - now;
        return calculateTime(difference);
      } else {
        setStatus("ended");
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
    };

    const calculateTime = (difference) => {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  const TimeBox = ({ value, label }) => (
    <div className="flex flex-col items-center bg-white rounded-lg p-3 shadow-md min-w-[70px]">
      <span className="text-2xl md:text-3xl font-bold text-[#D6482B]">{String(value).padStart(2, '0')}</span>
      <span className="text-xs text-stone-500 uppercase mt-1">{label}</span>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-xl p-6 border border-stone-200">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-[#D6482B]" />
        <h3 className="text-lg font-semibold text-stone-800">
          {status === "upcoming" && "Auction Starts In"}
          {status === "active" && "Time Remaining"}
          {status === "ended" && "Auction Ended"}
        </h3>
      </div>
      
      {status !== "ended" ? (
        <div className="flex gap-2 justify-center">
          <TimeBox value={timeLeft.days} label="Days" />
          <div className="flex items-center text-2xl font-bold text-[#D6482B]">:</div>
          <TimeBox value={timeLeft.hours} label="Hours" />
          <div className="flex items-center text-2xl font-bold text-[#D6482B]">:</div>
          <TimeBox value={timeLeft.minutes} label="Mins" />
          <div className="flex items-center text-2xl font-bold text-[#D6482B]">:</div>
          <TimeBox value={timeLeft.seconds} label="Secs" />
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 py-4">
          <XCircle className="w-6 h-6 text-red-500" />
          <span className="text-lg font-semibold text-red-600">This auction has ended</span>
        </div>
      )}
    </div>
  );
};

// Bid List Item Component
const BidListItem = ({ bidder, amount, rank, isHighest }) => {
  const getRankBadge = () => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center gap-1 text-yellow-600 font-bold">
            <Award className="w-5 h-5" />
            <span>1st</span>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center gap-1 text-gray-400 font-bold">
            <Award className="w-5 h-5" />
            <span>2nd</span>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center gap-1 text-orange-600 font-bold">
            <Award className="w-5 h-5" />
            <span>3rd</span>
          </div>
        );
      default:
        return <span className="text-stone-500 font-semibold">{rank}th</span>;
    }
  };

  return (
    <div 
      className={`py-4 px-4 flex items-center justify-between rounded-lg transition-all duration-300 hover:bg-stone-50 ${
        isHighest ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300' : 'border-b border-stone-200'
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        {bidder.profileImage ? (
          <img
            src={bidder.profileImage}
            alt={bidder.userName}
            className="w-12 h-12 rounded-full border-2 border-stone-200 hidden md:block"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D6482B] to-[#ff6b4a] flex items-center justify-center text-white font-bold hidden md:block">
            {bidder.userName?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex flex-col">
          <p className="font-semibold text-stone-800">{bidder.userName}</p>
          {isHighest && (
            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Highest Bidder
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 font-bold text-lg text-[#D6482B]">
        <DollarSign className="w-5 h-5" />
        Rs. {amount?.toLocaleString()}
      </div>
      
      <div className="flex-1 flex justify-end">
        {getRankBadge()}
      </div>
    </div>
  );
};

// Auction Status Badge
const AuctionStatusBadge = ({ status }) => {
  const statusConfig = {
    upcoming: {
      icon: Clock,
      text: "Starting Soon",
      colors: "bg-blue-100 text-blue-700 border-blue-300"
    },
    active: {
      icon: CheckCircle2,
      text: "Live Auction",
      colors: "bg-green-100 text-green-700 border-green-300"
    },
    ended: {
      icon: XCircle,
      text: "Auction Ended",
      colors: "bg-red-100 text-red-700 border-red-300"
    }
  };

  const config = statusConfig[status] || statusConfig.upcoming;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold ${config.colors}`}>
      <Icon className="w-4 h-4" />
      {config.text}
    </div>
  );
};

// Main Component
const ViewAuctionDetails = () => {
  const { id } = useParams();
  const { loading, auctionDetail, auctionBidders } = useSelector((state) => state.auction);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const [auctionStatus, setAuctionStatus] = useState("upcoming");

  useEffect(() => {
    if (!isAuthenticated || user.role === "Bidder") {
      navigateTo("/");
      return;
    }
    if (id) {
      dispatch(getAuctionDetail(id));
    }
  }, [isAuthenticated, user, id, dispatch, navigateTo]);

  useEffect(() => {
    if (auctionDetail.startTime && auctionDetail.endTime) {
      const now = Date.now();
      const start = new Date(auctionDetail.startTime).getTime();
      const end = new Date(auctionDetail.endTime).getTime();

      if (now < start) setAuctionStatus("upcoming");
      else if (now >= start && now < end) setAuctionStatus("active");
      else setAuctionStatus("ended");
    }
  }, [auctionDetail]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-stone-600">Loading auction details...</p>
        </div>
      </div>
    );
  }

  if (!auctionDetail || !auctionDetail.title) {
    return (
      <div className="w-full px-5 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <div>
            <h3 className="text-lg font-semibold text-red-800">Auction Not Found</h3>
            <p className="text-red-600">The auction you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full px-5 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="text-sm flex flex-wrap gap-2 items-center mb-6 text-stone-600">
        <Link to="/" className="font-semibold hover:text-[#D6482B] transition-colors">
          Home
        </Link>
        <FaGreaterThan className="text-stone-400 text-xs" />
        <Link to="/view-my-auctions" className="font-semibold hover:text-[#D6482B] transition-colors">
          My Auctions
        </Link>
        <FaGreaterThan className="text-stone-400 text-xs" />
        <p className="text-[#D6482B] font-semibold">{auctionDetail.title}</p>
      </div>

      {/* Main Content */}
      <div className="flex gap-6 flex-col 2xl:flex-row">
        
        {/* Left Section - Item Details */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Item Preview Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden">
            <div className="flex gap-6 flex-col lg:flex-row p-6">
              
              {/* Image */}
              <div className="w-full lg:w-64 h-64 bg-gradient-to-br from-stone-50 to-stone-100 rounded-xl flex items-center justify-center p-4 border border-stone-200">
                {auctionDetail.image?.url ? (
                  <img
                    src={auctionDetail.image.url}
                    alt={auctionDetail.title}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-stone-400 text-center">
                    <FaGavel className="w-16 h-16 mx-auto mb-2" />
                    <p>No Image</p>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-stone-800">
                      {auctionDetail.title}
                    </h1>
                    <AuctionStatusBadge status={auctionStatus} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-3 bg-stone-50 rounded-lg p-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-stone-500 uppercase">Condition</p>
                        <p className="font-bold text-stone-800">{auctionDetail.condition}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gradient-to-br from-[#D6482B]/10 to-[#ff6b4a]/10 rounded-lg p-4">
                      <div className="w-10 h-10 bg-[#D6482B] rounded-full flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-stone-500 uppercase">Starting Bid</p>
                        <p className="font-bold text-[#D6482B] text-xl">
                          Rs. {auctionDetail.startingBid?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {auctionBidders && auctionBidders.length > 0 && (
                    <div className="flex items-center gap-3 bg-green-50 rounded-lg p-4 border-2 border-green-200">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-stone-500 uppercase">Current Highest Bid</p>
                        <p className="font-bold text-green-600 text-xl">
                          Rs. {auctionBidders[0]?.amount?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Countdown Timer */}
          {auctionDetail.startTime && auctionDetail.endTime && (
            <CountdownTimer 
              startTime={auctionDetail.startTime} 
              endTime={auctionDetail.endTime} 
            />
          )}

          {/* Description */}
          <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6">
            <h2 className="text-2xl font-bold text-stone-800 mb-4 flex items-center gap-2">
              <div className="w-1 h-8 bg-gradient-to-b from-[#D6482B] to-[#ff6b4a] rounded-full"></div>
              Item Description
            </h2>
            <div className="prose max-w-none">
              {auctionDetail.description ? (
                <ul className="space-y-2">
                  {auctionDetail.description.split(". ").map((sentence, index) => (
                    sentence.trim() && (
                      <li key={index} className="text-stone-600 leading-relaxed">
                        {sentence.trim()}.
                      </li>
                    )
                  ))}
                </ul>
              ) : (
                <p className="text-stone-500 italic">No description available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Bids */}
        <div className="flex-1 max-w-full 2xl:max-w-xl">
          <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden sticky top-6">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-stone-800 to-stone-700 py-5 px-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <FaGavel className="text-[#ff6b4a]" />
                  Live Bids
                </h2>
                {auctionBidders && auctionBidders.length > 0 && (
                  <span className="bg-white text-stone-800 px-3 py-1 rounded-full text-sm font-bold">
                    {auctionBidders.length} Bid{auctionBidders.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Bids List */}
            <div className="max-h-[600px] overflow-y-auto">
              {auctionBidders && auctionBidders.length > 0 && auctionStatus === "active" ? (
                <div className="divide-y divide-stone-200">
                  {auctionBidders.map((bidder, index) => (
                    <BidListItem
                      key={index}
                      bidder={bidder}
                      amount={bidder.amount}
                      rank={index + 1}
                      isHighest={index === 0}
                    />
                  ))}
                </div>
              ) : auctionStatus === "upcoming" ? (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                  <img
                    src="/notStarted.png"
                    alt="Auction not started"
                    className="w-64 h-64 object-contain mb-4"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <FaClock className="w-16 h-16 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-stone-800 mb-2">Auction Not Started</h3>
                  <p className="text-stone-500 text-center">
                    Bidding will begin when the auction starts.
                  </p>
                </div>
              ) : auctionStatus === "ended" ? (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                  <img
                    src="/auctionEnded.png"
                    alt="Auction ended"
                    className="w-64 h-64 object-contain mb-4"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <FaTimesCircle className="w-16 h-16 text-red-400 mb-4" />
                  <h3 className="text-xl font-bold text-stone-800 mb-2">Auction Ended</h3>
                  <p className="text-stone-500 text-center">
                    This auction has concluded. Check back for results.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                  <User className="w-16 h-16 text-stone-300 mb-4" />
                  <h3 className="text-xl font-bold text-stone-800 mb-2">No Bids Yet</h3>
                  <p className="text-stone-500 text-center">
                    Be the first to place a bid on this item!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewAuctionDetails;