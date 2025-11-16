import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2, Trophy, TrendingUp } from "lucide-react";

const MyBidsCard = ({ 
  imgSrc, 
  title, 
  bidAmount, 
  highestBid, 
  auctionEndTime, 
  id,
  isWinning 
}) => {
  const navigateTo = useNavigate();

  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getAuctionStatus = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    return now > end ? "ended" : "active";
  };

  const handleViewDetails = () => {
    navigateTo(`/auction/${id}`);
  };

  const handleRemoveBid = () => {
    // TODO: Implement remove bid functionality
    console.log("Remove bid:", id);
  };

  const status = getAuctionStatus(auctionEndTime);
  const timeRemaining = getTimeRemaining(auctionEndTime);
  const isHighestBidder = bidAmount === highestBid;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:scale-105">
      {/* Image Section */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {imgSrc ? (
          <img 
            src={imgSrc} 
            alt={title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
            <span className="text-gray-600 text-sm font-medium">No Image</span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {isWinning && status === "active" ? (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
              <Trophy className="w-3 h-3" />
              Winning
            </div>
          ) : isWinning && status === "ended" ? (
            <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
              <Trophy className="w-3 h-3" />
              Won
            </div>
          ) : status === "ended" ? (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Ended
            </div>
          ) : (
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Active
            </div>
          )}
        </div>

        {/* Time Remaining Badge */}
        <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {timeRemaining}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Bid Information */}
        <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Your Bid</span>
            <span className="text-lg font-bold text-blue-600">
              ${bidAmount?.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Highest Bid
            </span>
            <span className={`text-lg font-bold ${isHighestBidder ? "text-green-600" : "text-gray-700"}`}>
              ${highestBid?.toLocaleString()}
            </span>
          </div>

          {!isHighestBidder && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
              <p className="text-xs text-orange-700 font-medium">
                You are outbid by ${(highestBid - bidAmount).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleViewDetails}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-2 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={handleRemoveBid}
            className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-semibold py-2 rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyBidsCard;