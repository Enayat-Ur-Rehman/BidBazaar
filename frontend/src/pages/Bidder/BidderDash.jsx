import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "@/custom-components/Spinner";
import { fetchMyBids, clearMyBidsError } from "@/store/slices/bidSlice";
import { fetchPendingPayments } from "@/store/slices/paymentSlice";
import {
  TrendingUp,
  Trophy,
  Heart,
  DollarSign,
  Gavel,
  ArrowRight,
  Target,
  Calendar,
  AlertCircle,
  Package,
  RefreshCw,
  CreditCard,
  Clock,
} from "lucide-react";

const BidderDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux Selectors
  const { myBids, myBidsLoading, myBidsError } = useSelector(
    (state) => state.bid
  );
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { pendingPayments } = useSelector((state) => state.payment);

  const [refreshing, setRefreshing] = useState(false);

  // Check Authentication & Role
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "Bidder") {
      navigate("/");
      return;
    }
    dispatch(fetchMyBids());
    dispatch(fetchPendingPayments());
  }, [dispatch, isAuthenticated, user?.role, navigate]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("🔄 Auto-refreshing dashboard...");
      dispatch(fetchMyBids());
      dispatch(fetchPendingPayments());
    }, 30000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  // Manual refresh handler
  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(fetchMyBids());
    dispatch(fetchPendingPayments());
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Calculate Statistics
  const stats = {
    total: myBids?.length || 0,
    activeBids: myBids?.filter((b) => {
      const now = new Date();
      const end = new Date(b.auctionItem?.endTime);
      return now < end;
    }).length || 0,
    wonAuctions: myBids?.filter((b) => {
      const now = new Date();
      const end = new Date(b.auctionItem?.endTime);
      const isWinner = b.amount === b.auctionItem?.currentBid;
      return now > end && isWinner;
    }).length || 0,
    totalSpent: myBids
      ?.filter((b) => {
        const now = new Date();
        const end = new Date(b.auctionItem?.endTime);
        const isWinner = b.amount === b.auctionItem?.currentBid;
        return now > end && isWinner;
      })
      .reduce((sum, b) => sum + (b.amount || 0), 0) || 0,
    pendingPaymentsCount: pendingPayments?.length || 0,
    winRate:
      myBids && myBids.length > 0
        ? Math.round(
            ((myBids?.filter((b) => {
              const now = new Date();
              const end = new Date(b.auctionItem?.endTime);
              const isWinner = b.amount === b.auctionItem?.currentBid;
              return now > end && isWinner;
            }).length || 0) /
              myBids.length) *
              100
          )
        : 0,
  };

  // Get Auctions Ending Soon (Next 24 hours)
  const endingSoon = myBids
    ?.filter((b) => {
      const now = new Date();
      const end = new Date(b.auctionItem?.endTime);
      const timeLeft = end - now;
      const isWinning = b.amount === b.auctionItem?.currentBid;
      return timeLeft > 0 && timeLeft < 24 * 60 * 60 * 1000 && !isWinning;
    })
    .sort(
      (a, b) =>
        new Date(a.auctionItem?.endTime) - new Date(b.auctionItem?.endTime)
    )
    .slice(0, 3) || [];

  // Get Leading Bids (Top 5)
  const leadingBids = myBids
    ?.filter((b) => {
      const now = new Date();
      const end = new Date(b.auctionItem?.endTime);
      const isWinning = b.amount === b.auctionItem?.currentBid;
      return now < end && isWinning;
    })
    .slice(0, 5) || [];

  // Get Recent Bids Activity
  const recentBids = myBids?.slice(0, 5) || [];

  // Format Time Remaining
  const formatTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return "Ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Loading State
  if (myBidsLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <Spinner />
          <p className="text-gray-600 font-semibold mt-4">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 lg:px-8 py-8 bg-gradient-to-br from-gray-50 to-blue-50">
      {/* ========== HEADER ========== */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          Welcome back,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">
            {user?.userName || "Bidder"}
          </span>
        </h1>
        <p className="text-gray-600 text-lg">
          Here's your bidding activity overview
        </p>
      </div>

      {/* ========== PENDING PAYMENTS ALERT ========== */}
      {pendingPayments && pendingPayments.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-orange-900 mb-1">
                🔔 You Have {pendingPayments.length} Pending Payment
                {pendingPayments.length > 1 ? "s" : ""}!
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

      {/* ========== STATS CARDS ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {/* Active Bids */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Active
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {stats.activeBids}
          </h3>
          <p className="text-gray-600 font-medium">Active Bids</p>
        </div>

        {/* Won Auctions */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
              Won
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {stats.wonAuctions}
          </h3>
          <p className="text-gray-600 font-medium">Won Auctions</p>
        </div>

        {/* Total Spent */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              Spent
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            Rs. {stats.totalSpent.toLocaleString()}
          </h3>
          <p className="text-gray-600 font-medium">Total Spent</p>
        </div>

        {/* Win Rate */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              Rate
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {stats.winRate}%
          </h3>
          <p className="text-gray-600 font-medium">Win Rate</p>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-red-200 p-6 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
              Pending
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {stats.pendingPaymentsCount}
          </h3>
          <p className="text-gray-600 font-medium">Payments Due</p>
        </div>
      </div>

      {/* ========== MAIN SECTIONS ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Leading Bids Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              Your Leading Bids
            </h2>
            <button
              onClick={() => navigate("/bidder/myBids")}
              className="text-blue-600 font-semibold text-sm hover:text-blue-700"
            >
              See All →
            </button>
          </div>

          {leadingBids.length > 0 ? (
            <div className="space-y-4">
              {leadingBids.map((bid) => (
                <div
                  key={bid._id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-white rounded-lg hover:shadow-md transition-all group border-l-4 border-green-500"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1">
                      {bid.auctionItem?.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Your bid:{" "}
                      <span className="font-bold text-gray-700">
                        Rs. {bid.amount.toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">
                      ✓ Winning
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimeRemaining(bid.auctionItem?.endTime)} left
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No leading bids yet</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-sm border border-blue-400 p-6 text-white h-fit">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Gavel className="w-6 h-6" />
            Quick Actions
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/auctions")}
              className="w-full bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-4 rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-md"
            >
              <Gavel className="w-5 h-5" />
              Browse Auctions
            </button>

            <button
              onClick={() => navigate("/bidder/myBids")}
              className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-lg transition-all border border-white/30"
            >
              View My Bids
            </button>

            {stats.pendingPaymentsCount > 0 && (
              <button
                onClick={() => navigate("/bidder/myPayments")}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-all animate-pulse"
              >
                Pay Now ({stats.pendingPaymentsCount})
              </button>
            )}

            <button
              onClick={() => navigate("/me")}
              className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-lg transition-all border border-white/30"
            >
              View Profile
            </button>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-lg transition-all border border-white/30 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Member Info */}
          <div className="mt-8 pt-6 border-t border-white/20 text-sm">
            <p className="text-white/80 mb-2">Member since:</p>
            <p className="font-semibold">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "Recently"}
            </p>
          </div>
        </div>
      </div>

      {/* ========== ENDING SOON SECTION ========== */}
      {endingSoon.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-orange-600" />
              Ending Soon (Outbid)
            </h2>
            <button
              onClick={() => navigate("/bidder/myBids")}
              className="text-blue-600 font-semibold text-sm hover:text-blue-700"
            >
              See All →
            </button>
          </div>

          <div className="space-y-4">
            {endingSoon.map((bid) => (
              <div
                key={bid._id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-white rounded-lg hover:shadow-md transition-all group border-l-4 border-orange-500"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {bid.auctionItem?.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Your bid:{" "}
                    <span className="font-bold text-gray-700">
                      Rs. {bid.amount.toLocaleString()}
                    </span>
                    {" • Current: "}
                    <span className="font-bold text-red-600">
                      Rs. {bid.auctionItem?.currentBid.toLocaleString()}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-red-600">⚠️ Outbid</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTimeRemaining(bid.auctionItem?.endTime)} left
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== RECENT ACTIVITY TABLE ========== */}
      {recentBids.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            Recent Bids Activity
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Auction
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Your Bid
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Current Bid
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Ends
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentBids.map((bid) => {
                  const isWinning = bid.amount === bid.auctionItem?.currentBid;
                  const isEnded =
                    new Date(bid.auctionItem?.endTime) < new Date();

                  return (
                    <tr
                      key={bid._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-gray-900 line-clamp-1">
                        {bid.auctionItem?.title}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        Rs. {bid.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        Rs. {bid.auctionItem?.currentBid.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        {isEnded && isWinning ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                            ✓ Won
                          </span>
                        ) : isWinning ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                            Winning
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                            Outbid
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {isEnded
                          ? "Ended"
                          : formatTimeRemaining(bid.auctionItem?.endTime)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========== EMPTY STATE ========== */}
      {myBids.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No bids yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start bidding on auctions to see them here!
          </p>
          <button
            onClick={() => navigate("/auctions")}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition inline-flex items-center gap-2"
          >
            Browse Auctions
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BidderDashboard;