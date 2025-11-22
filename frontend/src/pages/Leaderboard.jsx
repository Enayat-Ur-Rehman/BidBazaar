// import Spinner from "@/custom-components/Spinner";
// import React from "react";
// import { useSelector } from "react-redux";

// const Leaderboard = () => {
//   const { loading, leaderboard } = useSelector((state) => state.user);
//   console.log(leaderboard);
//   return (
//     <>
//       <section className="w-full px-5 py-8 lg:px-8 flex flex-col items-center justify-center">
//         {loading ? (
//           <Spinner />
//         ) : (
//           <>
//             <div className="flex flex-col min-[340px]:flex-row min-[340px]:gap-2 mb-5">
//               <h1
//                 className={`text-[#D6482B] text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
//               >
//                 Bidders Leaderboard
//               </h1>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white border my-5 border-gray-300">
//                 <thead>
//                   <tr>
//                     <th className="py-2 px-4 text-left">Profile Pic</th>
//                     <th className="py-2 px-4 text-left">Username</th>
//                     <th className="py-2 px-4 text-left">Bid Expenditure</th>
//                     <th className="py-2 px-4 text-left">Auctions Won</th>
//                   </tr>
//                 </thead>
//                 <tbody className="text-gray-700">
//                   {leaderboard.slice(0, 100).map((element, index) => {
//                     return (
//                       <tr
//                         key={element._id}
//                         className="border-b border-gray-300"
//                       >
//                         <td className="flex gap-2 items-center py-2 px-4">
//                           <span className="text-stone-400 font-semibold text-xl w-7 hidden sm:block">
//                             {index + 1}
//                           </span>
//                           <span>
//                             <img
//                               src={element.profileImage?.url}
//                               alt={element.username}
//                               className="h-12 w-12 object-cover rounded-full"
//                             />
//                           </span>
//                         </td>
//                         <td className="py-2 px-4">{element.userName}</td>
//                         <td className="py-2 px-4">{element.moneySpent}</td>
//                         <td className="py-2 px-4">{element.auctionsWon}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}
//       </section>
//     </>
//   );
// };

// export default Leaderboard;
import Spinner from "@/custom-components/Spinner";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { 
  Trophy, 
  TrendingUp, 
  DollarSign, 
  Award,
  Medal,
  Crown,
  Flame,
  Target,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const Leaderboard = () => {
  const { loading, leaderboard } = useSelector((state) => state.user);
  const [sortBy, setSortBy] = useState("moneySpent"); // moneySpent, auctionsWon
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc

  // Sort leaderboard based on selected criteria
  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    const aValue = sortBy === "moneySpent" ? a.moneySpent : a.auctionsWon;
    const bValue = sortBy === "moneySpent" ? b.moneySpent : b.auctionsWon;
    return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
  });

  // Calculate total statistics
  const totalStats = {
    totalBidders: leaderboard.length,
    totalMoneySpent: leaderboard.reduce((sum, user) => sum + user.moneySpent, 0),
    totalAuctionsWon: leaderboard.reduce((sum, user) => sum + user.auctionsWon, 0),
    avgMoneySpent: leaderboard.length > 0 
      ? leaderboard.reduce((sum, user) => sum + user.moneySpent, 0) / leaderboard.length 
      : 0,
  };

  // Get medal/rank icon based on position
  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Crown className="w-8 h-8 text-yellow-500" />;
      case 1:
        return <Medal className="w-7 h-7 text-gray-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-amber-700" />;
      default:
        return <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>;
    }
  };

  // Get rank badge color
  const getRankBadgeColor = (index) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 border-yellow-500";
      case 1:
        return "bg-gradient-to-r from-gray-300 to-gray-500 border-gray-400";
      case 2:
        return "bg-gradient-to-r from-amber-600 to-amber-800 border-amber-700";
      default:
        return "bg-white border-gray-200";
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-yellow-500" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-600 via-red-600 to-purple-600 bg-clip-text text-transparent">
              Bidders Leaderboard
            </h1>
            <Flame className="w-12 h-12 text-red-500" />
          </div>
          <p className="text-gray-600 text-lg">
            Compete with the best bidders and climb to the top!
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Total Bidders</p>
            <p className="text-3xl font-bold text-gray-900">{totalStats.totalBidders}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Total Spent</p>
            <p className="text-3xl font-bold text-gray-900">
              {totalStats.totalMoneySpent.toLocaleString()} PKR
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Total Wins</p>
            <p className="text-3xl font-bold text-gray-900">{totalStats.totalAuctionsWon}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-yellow-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Avg. Spent</p>
            <p className="text-3xl font-bold text-gray-900">
              {Math.round(totalStats.avgMoneySpent).toLocaleString()} PKR
            </p>
          </div>
        </div>

        {/* Top 3 Podium */}
        {sortedLeaderboard.length >= 3 && (
          <div className="flex items-end justify-center gap-4 mb-12 px-4">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <img
                  src={sortedLeaderboard[1].profileImage?.url}
                  alt={sortedLeaderboard[1].userName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-gray-400 shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-gray-400 rounded-full p-2">
                  <Medal className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="bg-gradient-to-b from-gray-200 to-gray-400 rounded-t-2xl p-6 w-32 sm:w-40 text-center shadow-xl">
                <p className="text-white font-bold text-sm mb-1 truncate">
                  {sortedLeaderboard[1].userName}
                </p>
                <p className="text-white text-2xl font-bold mb-1">2nd</p>
                <p className="text-white text-xs">
                  {sortedLeaderboard[1].moneySpent.toLocaleString()} PKR
                </p>
              </div>
              <div className="bg-gray-300 w-32 sm:w-40 h-20 rounded-b-lg"></div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center -mt-8">
              <div className="relative mb-4">
                <img
                  src={sortedLeaderboard[0].profileImage?.url}
                  alt={sortedLeaderboard[0].userName}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-yellow-500 shadow-2xl ring-4 ring-yellow-200"
                />
                <div className="absolute -bottom-2 -right-2 bg-yellow-500 rounded-full p-2">
                  <Crown className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-t-2xl p-6 w-36 sm:w-44 text-center shadow-2xl">
                <p className="text-white font-bold mb-1 truncate">
                  {sortedLeaderboard[0].userName}
                </p>
                <p className="text-white text-3xl font-bold mb-1">1st</p>
                <p className="text-white text-sm">
                  {sortedLeaderboard[0].moneySpent.toLocaleString()} PKR
                </p>
              </div>
              <div className="bg-yellow-500 w-36 sm:w-44 h-32 rounded-b-lg"></div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <img
                  src={sortedLeaderboard[2].profileImage?.url}
                  alt={sortedLeaderboard[2].userName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-amber-700 shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-amber-700 rounded-full p-2">
                  <Medal className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="bg-gradient-to-b from-amber-600 to-amber-800 rounded-t-2xl p-6 w-32 sm:w-40 text-center shadow-xl">
                <p className="text-white font-bold text-sm mb-1 truncate">
                  {sortedLeaderboard[2].userName}
                </p>
                <p className="text-white text-2xl font-bold mb-1">3rd</p>
                <p className="text-white text-xs">
                  {sortedLeaderboard[2].moneySpent.toLocaleString()} PKR
                </p>
              </div>
              <div className="bg-amber-700 w-32 sm:w-40 h-16 rounded-b-lg"></div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Award className="w-6 h-6" />
              Full Rankings
            </h2>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-bold text-gray-700">
                    Rank
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-bold text-gray-700">
                    Bidder
                  </th>
                  <th 
                    className="py-4 px-6 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => handleSort("moneySpent")}
                  >
                    <div className="flex items-center gap-2">
                      Total Spent
                      {sortBy === "moneySpent" && (
                        sortOrder === "desc" ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="py-4 px-6 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => handleSort("auctionsWon")}
                  >
                    <div className="flex items-center gap-2">
                      Auctions Won
                      {sortBy === "auctionsWon" && (
                        sortOrder === "desc" ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-bold text-gray-700">
                    Avg. Bid
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-bold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedLeaderboard.slice(0, 100).map((bidder, index) => {
                  const avgBid = bidder.auctionsWon > 0 
                    ? Math.round(bidder.moneySpent / bidder.auctionsWon) 
                    : 0;
                  
                  return (
                    <tr 
                      key={bidder._id}
                      className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                        index < 3 ? 'bg-gradient-to-r from-yellow-50 to-white' : ''
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {getRankIcon(index)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={bidder.profileImage?.url}
                            alt={bidder.userName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{bidder.userName}</p>
                            <p className="text-xs text-gray-500">{bidder.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-green-600">
                            {bidder.moneySpent.toLocaleString()} PKR
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-yellow-600" />
                          <span className="font-semibold text-gray-900">
                            {bidder.auctionsWon}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-700 font-medium">
                          {avgBid.toLocaleString()} PKR
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {bidder.pendingPayments?.length > 0 ? (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                            Pending
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            Active
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4 p-4">
            {sortedLeaderboard.slice(0, 100).map((bidder, index) => {
              const avgBid = bidder.auctionsWon > 0 
                ? Math.round(bidder.moneySpent / bidder.auctionsWon) 
                : 0;
              
              return (
                <div 
                  key={bidder._id}
                  className={`rounded-xl p-5 border-2 shadow-md ${getRankBadgeColor(index)}`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0">
                      {getRankIcon(index)}
                    </div>
                    <img
                      src={bidder.profileImage?.url}
                      alt={bidder.userName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
                    />
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg ${index < 3 ? 'text-white' : 'text-gray-900'}`}>
                        {bidder.userName}
                      </h3>
                      <p className={`text-sm ${index < 3 ? 'text-white/80' : 'text-gray-600'}`}>
                        {bidder.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`${index < 3 ? 'bg-white/20' : 'bg-gray-50'} rounded-lg p-3`}>
                      <p className={`text-xs mb-1 ${index < 3 ? 'text-white/80' : 'text-gray-600'}`}>
                        Total Spent
                      </p>
                      <p className={`font-bold ${index < 3 ? 'text-white' : 'text-green-600'}`}>
                        {bidder.moneySpent.toLocaleString()} PKR
                      </p>
                    </div>
                    <div className={`${index < 3 ? 'bg-white/20' : 'bg-gray-50'} rounded-lg p-3`}>
                      <p className={`text-xs mb-1 ${index < 3 ? 'text-white/80' : 'text-gray-600'}`}>
                        Wins
                      </p>
                      <p className={`font-bold ${index < 3 ? 'text-white' : 'text-gray-900'}`}>
                        {bidder.auctionsWon}
                      </p>
                    </div>
                    <div className={`${index < 3 ? 'bg-white/20' : 'bg-gray-50'} rounded-lg p-3`}>
                      <p className={`text-xs mb-1 ${index < 3 ? 'text-white/80' : 'text-gray-600'}`}>
                        Avg. Bid
                      </p>
                      <p className={`font-bold ${index < 3 ? 'text-white' : 'text-gray-900'}`}>
                        ${avgBid.toLocaleString()}
                      </p>
                    </div>
                    <div className={`${index < 3 ? 'bg-white/20' : 'bg-gray-50'} rounded-lg p-3`}>
                      <p className={`text-xs mb-1 ${index < 3 ? 'text-white/80' : 'text-gray-600'}`}>
                        Status
                      </p>
                      {bidder.pendingPayments?.length > 0 ? (
                        <span className="px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-semibold">
                          Pending
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Showing top {Math.min(100, leaderboard.length)} bidders • Updated in real-time
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;