// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// const Card = ({ imgSrc, title, startingBid, startTime, endTime, id }) => {
//   const calculateTimeLeft = () => {
//     const now = new Date();
//     const startDifference = new Date(startTime) - now;
//     const endDifference = new Date(endTime) - now;
//     let timeLeft = {};

//     if (startDifference > 0) {
//       timeLeft = {
//         type: "Starts In:",
//         days: Math.floor(startDifference / (1000 * 60 * 60 * 24)),
//         hours: Math.floor((startDifference / (1000 * 60 * 60)) % 24),
//         minutes: Math.floor((startDifference / 1000 / 60) % 60),
//         seconds: Math.floor((startDifference / 1000) % 60),
//       };
//     } else if (endDifference > 0) {
//       timeLeft = {
//         type: "Ends In:",
//         days: Math.floor(endDifference / (1000 * 60 * 60 * 24)),
//         hours: Math.floor((endDifference / (1000 * 60 * 60)) % 24),
//         minutes: Math.floor((endDifference / 1000 / 60) % 60),
//         seconds: Math.floor((endDifference / 1000) % 60),
//       };
//     }
//     return timeLeft;
//   };

//   const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setTimeLeft(calculateTimeLeft());
//     });
//     return () => clearTimeout(timer);
//   }, [timeLeft]);

//   const formatTimeLeft = ({ days, hours, minutes, seconds }) => {
//     const pad = (num) => String(num).padStart(2, "0");
//     return `(${days} Days) ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
//   };

//   return (
//     <>
//       <Link
//         to={`/auction/item/${id}`}
//         className="flex-grow basis-full bg-white rounded-md group sm:basis-56 lg:basis-60 2xl:basis-80"
//       >
//         <img
//           src={imgSrc}
//           alt={title}
//           className="w-full aspect-[4/3] m-auto md:p-12"
//         />
//         <div className="px-2 pt-4 pb-2">
//           <h5 className="font-semibold text-[18px] group-hover:text-[#d6482b] mb-2">
//             {title}
//           </h5>
//           {startingBid && (
//             <p className="text-stone-600 font-light">
//               Starting Bid:{" "}
//               <span className="text-[#fdba88] font-bold ml-1">
//                 {startingBid}
//               </span>
//             </p>
//           )}
//           <p className="text-stone-600 font-light">
//             {timeLeft.type}
//             {Object.keys(timeLeft).length > 1 ? (
//               <span className="text-[#fdba88] font-bold ml-1">
//                 {formatTimeLeft(timeLeft)}
//               </span>
//             ) : (
//               <span className="text-[#fdba88] font-bold ml-1">Time's up!</span>
//             )}
//           </p>
//         </div>
//       </Link>
//     </>
//   );
// };

// export default Card;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, TrendingUp, Flame, Zap, DollarSign, Calendar } from "lucide-react";

const Card = ({ imgSrc, title, startingBid, startTime, endTime, id }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [status, setStatus] = useState("upcoming");

  const calculateTimeLeft = () => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    const startDifference = start - now;
    const endDifference = end - now;

    if (startDifference > 0) {
      // Auction hasn't started
      setStatus("upcoming");
      return {
        type: "Starts In",
        days: Math.floor(startDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((startDifference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((startDifference / 1000 / 60) % 60),
        seconds: Math.floor((startDifference / 1000) % 60),
      };
    } else if (endDifference > 0) {
      // Auction is live
      setStatus("live");
      return {
        type: "Ends In",
        days: Math.floor(endDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((endDifference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((endDifference / 1000 / 60) % 60),
        seconds: Math.floor((endDifference / 1000) % 60),
      };
    } else {
      // Auction ended
      setStatus("ended");
      return { type: "Ended" };
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  const formatTimeLeft = ({ days, hours, minutes, seconds }) => {
    const pad = (num) => String(num).padStart(2, "0");
    
    if (days > 0) {
      return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const getStatusBadge = () => {
    switch (status) {
      case "upcoming":
        return (
          <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
            <Calendar className="w-3.5 h-3.5" />
            Upcoming
          </div>
        );
      case "live":
        return (
          <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            Live Now
          </div>
        );
      case "ended":
        return (
          <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
            Ended
          </div>
        );
      default:
        return null;
    }
  };

  const isEndingSoon = status === "live" && timeLeft.days === 0 && timeLeft.hours < 1;

  return (
    <Link
      to={`/auction/item/${id}`}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-stone-200 hover:border-[#D6482B] hover:-translate-y-2 flex flex-col"
    >
      {/* Image Container */}
      <div className="relative h-62 overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Status Badge */}
        {getStatusBadge()}

        {/* Time Remaining Badge */}
        {status !== "ended" && (
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {Object.keys(timeLeft).length > 1 ? formatTimeLeft(timeLeft) : "Time's up!"}
          </div>
        )}

        {/* Hot Badge for ending soon */}
        {isEndingSoon && (
          <div className="absolute bottom-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 animate-pulse shadow-lg">
            <Flame className="w-3.5 h-3.5" />
            Ending Soon!
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-xl font-bold text-stone-800 mb-3 line-clamp-2 group-hover:text-[#D6482B] transition-colors duration-300">
          {title}
        </h3>

        {/* Price Section */}
        <div className="mt-auto space-y-3">
          {/* Starting Bid */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#D6482B]/10 to-[#ff6b4a]/10 rounded-lg border border-[#D6482B]/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#D6482B] rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-xs text-stone-600 font-medium block">Starting Bid</span>
                <span className="text-lg font-bold text-[#D6482B]">
                  Rs. {startingBid?.toLocaleString() || "N/A"}
                </span>
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-[#D6482B]" />
          </div>

          {/* Time Info */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-stone-500" />
            <span className="text-stone-600 font-medium">{timeLeft.type}:</span>
            <span className={`font-bold ${
              status === "live" ? "text-green-600" : 
              status === "upcoming" ? "text-blue-600" : 
              "text-red-600"
            }`}>
              {Object.keys(timeLeft).length > 1 ? formatTimeLeft(timeLeft) : "Time's up!"}
            </span>
          </div>

          {/* Action Button */}
          <button className="w-full bg-gradient-to-r from-[#D6482B] to-[#b8381e] text-white font-semibold py-3 rounded-xl transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
            {status === "ended" ? (
              <>View Results</>
            ) : status === "live" ? (
              <>
                <Zap className="w-4 h-4" />
                Place Bid Now
              </>
            ) : (
              <>View Details</>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default Card;

