import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "@/custom-components/Spinner";
import { fetchMyBids, clearMyBidsError } from "@/store/slices/bidSlice";
import { fetchPendingPayments } from "@/store/slices/paymentSlice";
import { 
  Trophy, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Package,
  ArrowRight,
  RefreshCw,
  CreditCard
} from "lucide-react";

export default function MyBids() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get data from Redux - Bids
  const { myBids, myBidsLoading, myBidsError } = useSelector(
    (state) => state.bid
  );
  
  // Get data from Redux - Payments
  const { pendingPayments } = useSelector(
    (state) => state.payment
  );
  
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  // CRITICAL: Fetch bids when component mounts
  useEffect(() => {
    console.log(" MyBids component mounted, fetching bids and payments...");
    dispatch(fetchMyBids());
    dispatch(fetchPendingPayments());
  }, [dispatch]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("🔄 Auto-refreshing bids and payments...");
      setRefreshing(true);
      dispatch(fetchMyBids());
      dispatch(fetchPendingPayments());
      setRefreshing(false);
    }, 30000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearMyBidsError());
    };
  }, [dispatch]);

  // Manual refresh handler
  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(fetchMyBids());
    dispatch(fetchPendingPayments());
    setRefreshing(false);
  };

  // Filter bids
  const filteredBids = myBids.filter((bid) => {
    if (!bid.auctionItem) return false;

    const isEnded = new Date(bid.auctionItem.endTime) < new Date();
    const isWinner = bid.amount === bid.auctionItem.currentBid;

    switch (filter) {
      case "ongoing":
        return !isEnded;
      case "ended":
        return isEnded;
      case "won":
        return isEnded && isWinner;
      default:
        return true;
    }
  });

  // Calculate stats
  const stats = {
    total: myBids.length,
    ongoing: myBids.filter(
      (b) => b.auctionItem && new Date(b.auctionItem.endTime) > new Date()
    ).length,
    won: myBids.filter(
      (b) =>
        b.auctionItem &&
        new Date(b.auctionItem.endTime) < new Date() &&
        b.amount === b.auctionItem.currentBid
    ).length,
    totalSpent: myBids
      .filter(
        (b) =>
          b.auctionItem &&
          new Date(b.auctionItem.endTime) < new Date() &&
          b.amount === b.auctionItem.currentBid
      )
      .reduce((sum, b) => sum + b.amount, 0),
  };

  // Loading state
  if (myBidsLoading && myBids.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <Spinner />
      </div>
    );
  }

  // Error state
  if (myBidsError && myBids.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error!</h3>
          <p className="text-red-500 mb-4">{myBidsError}</p>
          <button
            onClick={() => dispatch(fetchMyBids())}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bids</h1>
          <p className="text-gray-600">Track all your auction bids in one place</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {/* ✅ PENDING PAYMENTS BUTTON - Shows when payments exist */}
          {pendingPayments && pendingPayments.length > 0 && (
            <button
              onClick={() => navigate("/bidder/myPayments")}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition shadow-lg font-semibold animate-pulse"
            >
              <CreditCard className="w-5 h-5" />
              <span>💳 {pendingPayments.length} Pending Payment{pendingPayments.length > 1 ? 's' : ''}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition ${
              refreshing ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="font-medium">Refresh</span>
          </button>
        </div>
      </div>

      {/* ✅ PENDING PAYMENTS ALERT BANNER */}
      {pendingPayments && pendingPayments.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-orange-900 mb-1">
                🔔 You Have Pending Payments!
              </h3>
              <p className="text-sm text-orange-700 mb-3">
                Complete your 20% payment within 12 hours to confirm your wins
              </p>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => navigate("/bidder/myPayments")}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold flex items-center gap-2"
                >
                  View Payments
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate("/bidder/myPayments")}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-2"
                >
                  Pay Now ⚡
                  <CreditCard className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards - Only show if there are bids */}
      {myBids.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Bids</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="w-10 h-10 text-blue-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Bids</p>
                <p className="text-2xl font-bold text-green-600">{stats.ongoing}</p>
              </div>
              <Clock className="w-10 h-10 text-green-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Won Auctions</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.won}</p>
              </div>
              <Trophy className="w-10 h-10 text-yellow-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Won</p>
                <p className="text-2xl font-bold text-purple-600">
                  Rs. {stats.totalSpent.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-purple-500 opacity-80" />
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      {myBids.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { value: "all", label: "All Bids" },
            { value: "ongoing", label: "Active" },
            { value: "ended", label: "Ended" },
            { value: "won", label: "Won" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-5 py-2 rounded-lg font-medium transition-all ${
                filter === tab.value
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Bids Grid or Empty State */}
      {filteredBids.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {myBids.length === 0 ? "No bids yet" : `No ${filter} bids`}
          </h3>
          <p className="text-gray-500 mb-6">
            {myBids.length === 0
              ? "Start bidding on auctions to see them here!"
              : `You don't have any ${filter} bids at the moment.`}
          </p>
          <button
            onClick={() => navigate("/auctions")}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition inline-flex items-center gap-2"
          >
            Browse Auctions
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBids.map((bid) => {
            if (!bid.auctionItem) {
              console.warn("⚠️ Bid missing auctionItem:", bid);
              return null;
            }

            const isEnded = new Date(bid.auctionItem.endTime) < new Date();
            const isWinner = bid.amount === bid.auctionItem.currentBid;
            const isLeading = !isEnded && isWinner;

            return (
              <div
                key={bid._id}
                className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all hover:shadow-lg ${
                  isEnded && isWinner
                    ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-white"
                    : isLeading
                    ? "border-green-400 bg-gradient-to-br from-green-50 to-white"
                    : "border-gray-200"
                }`}
              >
                {/* Winner Badge */}
                {isEnded && isWinner && (
                  <div className="flex items-center gap-2 mb-3 text-yellow-600">
                    <Trophy className="w-5 h-5" />
                    <span className="font-bold text-sm uppercase tracking-wide">
                      You Won! 🎉
                    </span>
                  </div>
                )}

                {/* ✅ PAYMENT NEEDED BADGE - Shows when auction ended and is winner */}
                {isEnded && isWinner && (
                  <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-orange-100 border border-orange-300 rounded-lg text-orange-700">
                    <CreditCard className="w-4 h-4" />
                    <span className="font-semibold text-xs">Complete Payment</span>
                  </div>
                )}

                {/* Leading Badge */}
                {isLeading && (
                  <div className="flex items-center gap-2 mb-3 text-green-600">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-bold text-sm uppercase tracking-wide">
                      Leading Bid
                    </span>
                  </div>
                )}

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2">
                  {bid.auctionItem.title}
                </h2>

                {/* Bid Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Your Bid:</span>
                    <span className="text-lg font-bold text-blue-600">
                      Rs. {bid.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current High:</span>
                    <span
                      className={`text-lg font-semibold ${
                        bid.amount === bid.auctionItem.currentBid
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Rs. {bid.auctionItem.currentBid.toLocaleString()}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span
                        className={`font-medium ${
                          isEnded ? "text-gray-600" : "text-green-600"
                        }`}
                      >
                        {isEnded ? "Auction Ended" : "Ongoing"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* View Button */}
                <button
                  onClick={() => navigate(`/auction/item/${bid.auctionItem._id}`)}
                  className="w-full py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium flex items-center justify-center gap-2"
                >
                  View Auction
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}