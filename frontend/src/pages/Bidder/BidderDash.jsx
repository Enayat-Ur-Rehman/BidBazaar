import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMyBids, getWonBids } from "@/store/slices/bidSlice";
import {
  TrendingUp,
  Trophy,
  Heart,
  DollarSign,
  Gavel,
  ArrowRight,
  Target,
  Calendar,
} from "lucide-react";

const BidderDash = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const { myBids, wonBids, loading } = useSelector((state) => state.bid);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.auction);

  useEffect(() => {
    if (!isAuthenticated || user.role !== "Bidder") {
      navigateTo("/");
      return;
    }
    dispatch(getMyBids());
    dispatch(getWonBids());
  }, [dispatch, isAuthenticated, user.role, navigateTo]);

  // Calculate statistics
  const stats = {
    activeBids: myBids?.filter(b => {
      const now = new Date();
      const end = new Date(b.auctionEndTime);
      return now < end;
    }).length || 0,
    wonAuctions: wonBids?.length || 0,
    totalSpent: wonBids?.reduce((sum, b) => sum + (b.bidAmount || 0), 0) || 0,
    winPercentage: myBids && myBids.length > 0 
      ? Math.round((wonBids?.length / myBids.length) * 100) 
      : 0,
  };

  // Get upcoming auctions (ending soon)
  const upcomingEndings = myBids
    ?.filter(b => {
      const now = new Date();
      const end = new Date(b.auctionEndTime);
      const timeLeft = end - now;
      return timeLeft > 0 && timeLeft < 24 * 60 * 60 * 1000; // Less than 24 hours
    })
    .sort((a, b) => new Date(a.auctionEndTime) - new Date(b.auctionEndTime))
    .slice(0, 3) || [];

  // Get recent bids
  const recentBids = myBids?.slice(0, 5) || [];

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-5 pb-12 lg:px-8 py-8 bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">{user?.userName}</span>
        </h1>
        <p className="text-gray-600 text-lg">Here's your bidding activity overview</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Active Bids */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Active</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.activeBids}</h3>
          <p className="text-gray-600 font-medium">Active Bids</p>
          <button
            onClick={() => navigateTo("/my-bids")}
            className="mt-4 text-blue-600 font-semibold text-sm hover:text-blue-700 flex items-center gap-2 group"
          >
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Won Auctions */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">Won</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.wonAuctions}</h3>
          <p className="text-gray-600 font-medium">Won Auctions</p>
          <button
            onClick={() => navigateTo("/won-bids")}
            className="mt-4 text-green-600 font-semibold text-sm hover:text-green-700 flex items-center gap-2 group"
          >
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Total Spent */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Spent</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">${stats.totalSpent.toLocaleString()}</h3>
          <p className="text-gray-600 font-medium">Total Spent</p>
        </div>

        {/* Win Percentage */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">Rate</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.winPercentage}%</h3>
          <p className="text-gray-600 font-medium">Win Rate</p>
        </div>
      </div>

      {/* Second Row - Active Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ending Soon */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              Ending Soon
            </h2>
            <button
              onClick={() => navigateTo("/my-bids")}
              className="text-blue-600 font-semibold text-sm hover:text-blue-700"
            >
              See All →
            </button>
          </div>

          {upcomingEndings.length > 0 ? (
            <div className="space-y-4">
              {upcomingEndings.map((bid) => (
                <div
                  key={bid._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {bid.auctionTitle}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Your bid: <span className="font-bold text-gray-700">${bid.bidAmount.toLocaleString()}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-orange-600">
                      {(() => {
                        const now = new Date();
                        const end = new Date(bid.auctionEndTime);
                        const diff = end - now;
                        const hours = Math.floor(diff / (1000 * 60 * 60));
                        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                        return `${hours}h ${minutes}m left`;
                      })()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {bid.isWinning ? (
                        <span className="text-green-600 font-semibold">✓ Winning</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Outbid</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No auctions ending soon</p>
              <button
                onClick={() => navigateTo("/auctions")}
                className="mt-4 text-blue-600 font-semibold hover:text-blue-700"
              >
                Browse Auctions →
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-sm border border-blue-400 p-6 text-white">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Gavel className="w-6 h-6" />
            Quick Actions
          </h2>

          <div className="space-y-4">
            <button
              onClick={() => navigateTo("/auctions")}
              className="w-full bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-4 rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-md"
            >
              <Gavel className="w-5 h-5" />
              Browse Auctions
            </button>

            <button
              onClick={() => navigateTo("/my-bids")}
              className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-lg transition-all border border-white/30"
            >
              View My Bids
            </button>

            <button
              onClick={() => navigateTo("/won-bids")}
              className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-lg transition-all border border-white/30"
            >
              View Won Items
            </button>

            <button
              onClick={() => navigateTo("/me")}
              className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-lg transition-all border border-white/30"
            >
              View Profile
            </button>
          </div>

          {/* Stats Footer */}
          <div className="mt-8 pt-6 border-t border-white/20 text-sm">
            <p className="text-white/80 mb-2">Member since:</p>
            <p className="font-semibold">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {recentBids.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Recent Bids Activity
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Auction</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Your Bid</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Highest Bid</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Ends</th>
                </tr>
              </thead>
              <tbody>
                {recentBids.map((bid) => (
                  <tr key={bid._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">{bid.auctionTitle}</td>
                    <td className="py-3 px-4 text-gray-700">${bid.bidAmount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-700">${bid.highestBid.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      {bid.isWinning ? (
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
                      {new Date(bid.auctionEndTime).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidderDash;