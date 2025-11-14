// import Card from "@/custom-components/Card";
// import Spinner from "@/custom-components/Spinner";
// import React from "react";
// import { useSelector } from "react-redux";

// const Auctions = () => {
//   const { allAuctions, loading } = useSelector((state) => state.auction);
//   return (
//     <>
//       {loading ? (
//         <Spinner />
//       ) : (
//         <article className="w-full px-5 flex flex-col flex-1 justify-center items-center py-8 lg:px-8">
//           <section className="py-8">
//             <h1
//               className={`text-[#d6482b] text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
//             >
//               Auctions
//             </h1>
//             <div className="flex flex-wrap gap-6">
//               {allAuctions.map((element) => (
//                 <Card
//                   title={element.title}
//                   startTime={element.startTime}
//                   endTime={element.endTime}
//                   imgSrc={element.image?.url}
//                   startingBid={element.startingBid}
//                   id={element._id}
//                   key={element._id}
//                 />
//               ))}
//             </div>
//           </section>
//         </article>
//       )}
//     </>
//   );
// };

// export default Auctions;

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Search, Filter, Clock, TrendingUp, Flame, ChevronDown, Grid3x3, List, Tag } from "lucide-react";
import Card from "@/custom-components/Card";

const Auctions = () => {
  const { allAuctions, loading } = useSelector((state) => state.auction);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("ending-soon");

  // Filter and sort auctions
  const getFilteredAuctions = () => {
    let filtered = [...allAuctions];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((auction) =>
        auction.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    const now = new Date();
    if (filterStatus === "live") {
      filtered = filtered.filter((auction) => {
        const start = new Date(auction.startTime);
        const end = new Date(auction.endTime);
        return now >= start && now <= end;
      });
    } else if (filterStatus === "upcoming") {
      filtered = filtered.filter((auction) => new Date(auction.startTime) > now);
    } else if (filterStatus === "ended") {
      filtered = filtered.filter((auction) => new Date(auction.endTime) < now);
    }

    // Sort
    if (sortBy === "ending-soon") {
      filtered.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    } else if (sortBy === "price-low") {
      filtered.sort((a, b) => a.startingBid - b.startingBid);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.startingBid - a.startingBid);
    }

    return filtered;
  };

  const filteredAuctions = getFilteredAuctions();

  const getAuctionStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return { label: "Upcoming", color: "bg-blue-500" };
    if (now > end) return { label: "Ended", color: "bg-gray-500" };
    return { label: "Live", color: "bg-green-500" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 text-white py-20 px-5 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in">
              Live Auctions
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-2xl mx-auto">
              Discover exclusive items and place your winning bids
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
              <div className="text-4xl font-bold mb-2">{allAuctions.length}</div>
              <div className="text-orange-100">Total Auctions</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
              <div className="text-4xl font-bold mb-2">
                {allAuctions.filter(a => getAuctionStatus(a.startTime, a.endTime).label === "Live").length}
              </div>
              <div className="text-orange-100">Live Now</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-orange-100">Always Open</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search auctions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="live">Live Now</option>
              <option value="upcoming">Upcoming</option>
              <option value="ended">Ended</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white cursor-pointer"
            >
              <option value="ending-soon">Ending Soon</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            {/* View Toggle */}
            <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 font-medium">
            Showing <span className="text-orange-600 font-bold">{filteredAuctions.length}</span> auctions
          </p>
        </div>

        {/* Auctions Grid/List */}
        {filteredAuctions.length === 0 ? (
          <div className="text-center py-20">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No auctions found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAuctions.map((element) => (
              // <AuctionCard key={auction._id} auction={auction} />
               <Card
                  title={element.title}
                  startTime={element.startTime}
                  endTime={element.endTime}
                  imgSrc={element.image?.url}
                  startingBid={element.startingBid}
                  id={element._id}
                  key={element._id}
                />
            ))}
           
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAuctions.map((element) => (
              // <AuctionCard key={auction._id} auction={auction} />
               <Card
                  title={element.title}
                  startTime={element.startTime}
                  endTime={element.endTime}
                  imgSrc={element.image?.url}
                  startingBid={element.startingBid}
                  id={element._id}
                  key={element._id}
                />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Auctions;