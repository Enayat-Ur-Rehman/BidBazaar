import Spinner from "@/custom-components/Spinner";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  CreditCard,
  Building2,
  DollarSign,
  Trophy,
  TrendingUp,
  Award,
  Wallet,
  BadgeCheck,
  Edit2
} from "lucide-react";

const UserProfile = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  // Calculate bidder statistics
  const bidderStats = user.role === "Bidder" ? {
    winRate: user.auctionsWon > 0 
      ? ((user.auctionsWon / (user.auctionsWon + 5)) * 100).toFixed(1) 
      : 0,
    avgSpent: user.auctionsWon > 0 
      ? (user.moneySpent / user.auctionsWon).toFixed(0) 
      : 0,
  } : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Cover Background */}
          <div className="h-32 sm:h-40 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
          
          {/* Profile Section */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-20">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={user.profileImage?.url || "/imageHolder.jpg"}
                  alt={user.userName}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-8 border-white shadow-2xl object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left sm:mt-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  {user.userName}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-3">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                    user.role === "Auctioneer" 
                      ? "bg-purple-100 text-purple-700"
                      : user.role === "Bidder"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    <Shield className="w-4 h-4 inline mr-1" />
                    {user.role}
                  </span>
                  <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    <BadgeCheck className="w-4 h-4 inline mr-1" />
                    Verified
                  </span>
                </div>
                <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-2">
                  <Calendar className="w-4 h-4" />
                  Member since {new Date(user.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

            
            </div>
          </div>
        </div>

        {/* Statistics Cards - Bidder Only */}
        {user.role === "Bidder" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Trophy className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Auctions Won</p>
              <p className="text-3xl font-bold text-gray-900">{user.auctionsWon}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Spent</p>
              <p className="text-3xl font-bold text-gray-900">
                ${user.moneySpent?.toLocaleString()}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Avg. Bid</p>
              <p className="text-3xl font-bold text-gray-900">
                ${bidderStats.avgSpent > 0 ? parseInt(bidderStats.avgSpent).toLocaleString() : '0'}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-yellow-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Win Rate</p>
              <p className="text-3xl font-bold text-gray-900">
                {bidderStats.winRate}%
              </p>
            </div>
          </div>
        )}

        {/* Auctioneer Statistics */}
        {user.role === "Auctioneer" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-red-100 rounded-xl">
                  <Wallet className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Unpaid Commission</p>
              <p className="text-3xl font-bold text-red-600">
                ${user.unpaidCommission?.toLocaleString()}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-100 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Account Status</p>
              <p className="text-2xl font-bold text-green-600">
                {user.unpaidCommission === 0 ? "Clear" : "Pending"}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Details */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              Personal Details
            </h2>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-600 block mb-1">
                    Username
                  </label>
                  <p className="text-lg text-gray-900 font-medium">{user.userName}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Mail className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-600 block mb-1">
                    Email Address
                  </label>
                  <p className="text-lg text-gray-900 font-medium break-all">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Phone className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-600 block mb-1">
                    Phone Number
                  </label>
                  <p className="text-lg text-gray-900 font-medium">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-600 block mb-1">
                    Address
                  </label>
                  <p className="text-lg text-gray-900 font-medium">{user.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-pink-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-pink-600" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-600 block mb-1">
                    Member Since
                  </label>
                  <p className="text-lg text-gray-900 font-medium">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details - Auctioneer Only */}
          {user.role === "Auctioneer" && (
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-green-600" />
                Payment Methods
              </h2>
              
              <div className="space-y-6">
                {/* Bank Transfer */}
                <div className="p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">Bank Transfer</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">
                        Bank Name
                      </label>
                      <p className="text-base text-gray-900 font-medium">
                        {user.paymentMethods?.bankTransfer?.bankName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">
                        Account Number (IBAN)
                      </label>
                      <p className="text-base text-gray-900 font-medium font-mono">
                        {user.paymentMethods?.bankTransfer?.bankAccountNumber || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">
                        Account Holder Name
                      </label>
                      <p className="text-base text-gray-900 font-medium">
                        {user.paymentMethods?.bankTransfer?.bankAccountName || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Easypaisa */}
                <div className="p-5 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Wallet className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-bold text-gray-900">Easypaisa</h3>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">
                      Account Number
                    </label>
                    <p className="text-base text-gray-900 font-medium font-mono">
                      {user.paymentMethods?.easypaisa?.easypaisaAccountNumber || "N/A"}
                    </p>
                  </div>
                </div>

                {/* PayPal */}
                <div className="p-5 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-900">PayPal</h3>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">
                      PayPal Email
                    </label>
                    <p className="text-base text-gray-900 font-medium break-all">
                      {user.paymentMethods?.paypal?.paypalEmail || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Activity - Bidder Only */}
          {user.role === "Bidder" && (
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                Account Activity
              </h2>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Trophy className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-semibold text-gray-600 block mb-1">
                      Total Auctions Won
                    </label>
                    <p className="text-2xl text-blue-600 font-bold">
                      {user.auctionsWon}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-semibold text-gray-600 block mb-1">
                      Total Money Spent
                    </label>
                    <p className="text-2xl text-green-600 font-bold">
                      ${user.moneySpent?.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Award className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-semibold text-gray-600 block mb-1">
                      Average Winning Bid
                    </label>
                    <p className="text-2xl text-purple-600 font-bold">
                      ${bidderStats.avgSpent > 0 ? parseInt(bidderStats.avgSpent).toLocaleString() : '0'}
                    </p>
                  </div>
                </div>

                {/* Pending Payments */}
                {user.pendingPayments && user.pendingPayments.length > 0 && (
                  <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Wallet className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-gray-600 block mb-1">
                        Pending Payments
                      </label>
                      <p className="text-2xl text-yellow-600 font-bold">
                        {user.pendingPayments.length}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;