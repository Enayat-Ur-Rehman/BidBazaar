import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { deleteAuction, republishAuction } from "@/store/slices/auctionSlice";
import { Eye, Trash2, RefreshCw, Clock, DollarSign, X, Calendar, AlertCircle } from "lucide-react";

const CardTwo = ({ imgSrc, title, startingBid, startTime, endTime, id }) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const startDifference = new Date(startTime) - now;
    const endDifference = new Date(endTime) - now;
    let timeLeft = {};

    if (startDifference > 0) {
      timeLeft = {
        type: "Starts In:",
        status: "upcoming",
        days: Math.floor(startDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((startDifference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((startDifference / 1000 / 60) % 60),
        seconds: Math.floor((startDifference / 1000) % 60),
      };
    } else if (endDifference > 0) {
      timeLeft = {
        type: "Ends In:",
        status: "live",
        days: Math.floor(endDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((endDifference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((endDifference / 1000 / 60) % 60),
        seconds: Math.floor((endDifference / 1000) % 60),
      };
    } else {
      timeLeft = {
        type: "Ended",
        status: "ended"
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTimeLeft = ({ days, hours, minutes, seconds }) => {
    const pad = (num) => String(num).padStart(2, "0");
    return `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  const dispatch = useDispatch();
  
  const handleDeleteAuction = () => {
    dispatch(deleteAuction(id));
    setShowDeleteConfirm(false);
  };

  const getStatusBadge = () => {
    const status = timeLeft.status;
    const config = {
      live: { label: "Live Now", color: "bg-green-500", dotColor: "bg-green-400" },
      upcoming: { label: "Upcoming", color: "bg-blue-500", dotColor: "bg-blue-400" },
      ended: { label: "Ended", color: "bg-gray-500", dotColor: "bg-gray-400" }
    };

    const { label, color, dotColor } = config[status] || config.ended;

    return (
      <div className={`absolute top-3 left-3 ${color} text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 z-10`}>
        {status === "live" && <span className={`w-2 h-2 ${dotColor} rounded-full animate-pulse`}></span>}
        {label}
      </div>
    );
  };

  const isEnded = timeLeft.status === "ended";
  const canRepublish = isEnded;

  return (
    <>
      <div className="basis-full sm:basis-56 lg:basis-60 2xl:basis-80 bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 hover:border-orange-300 group flex flex-col">
        {/* Image Container */}
        <div className="relative h-63 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <img
            src={imgSrc}
            alt={title}
            className="w-full
             h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {getStatusBadge()}
          
          {/* Time Badge */}
          {!isEnded && (
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-3 py-2 rounded-lg flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {formatTimeLeft(timeLeft)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h5 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 mb-3 line-clamp-2 transition-colors min-h-[3.5rem]">
            {title}
          </h5>

          {/* Starting Bid */}
          <div className="mb-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 border border-orange-100">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              <DollarSign className="w-4 h-4 text-orange-600" />
              <span className="font-medium">Starting Bid</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${startingBid?.toLocaleString()}
            </div>
          </div>

          {/* Time Status */}
          <div className="mb-5 flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 font-medium">{timeLeft.type}</span>
            {Object.keys(timeLeft).length > 2 ? (
              <span className="text-orange-600 font-bold">
                {formatTimeLeft(timeLeft)}
              </span>
            ) : (
              <span className="text-red-600 font-bold">Time's up!</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 mt-auto">
            <Link
              to={`/auction/details/${id}`}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Eye className="w-4 h-4" />
              View Details
            </Link>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2.5 rounded-lg transition-all border border-red-200 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>

              <button
                disabled={!canRepublish}
                onClick={() => setOpenDrawer(true)}
                className={`flex items-center justify-center gap-2 font-medium py-2.5 rounded-lg transition-all border ${
                  canRepublish
                    ? "bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 hover:border-blue-300 cursor-pointer"
                    : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-50"
                }`}
              >
                <RefreshCw className="w-4 h-4" />
                Republish
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Delete Auction?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete "{title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAuction}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Drawer id={id} openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
    </>
  );
};

export default CardTwo;

const Drawer = ({ setOpenDrawer, openDrawer, id }) => {
  const dispatch = useDispatch();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const { loading } = useSelector((state) => state.auction);

  const handleRepublishAuction = () => {
    if (!startTime || !endTime) {
      return;
    }
    const formData = new FormData();
    formData.append("startTime", startTime);
    formData.append("endTime", endTime);
    dispatch(republishAuction(id, formData));
    setOpenDrawer(false);
  };

  const resetForm = () => {
    setStartTime("");
    setEndTime("");
    setOpenDrawer(false);
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        openDrawer ? "visible" : "invisible"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          openDrawer ? "opacity-100" : "opacity-0"
        }`}
        onClick={resetForm}
      />

      {/* Drawer */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transition-transform duration-500 ${
          openDrawer ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="w-full px-5 py-8 sm:max-w-2xl sm:mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Republish Auction
                </h3>
                <p className="text-sm text-gray-600">
                  Set new dates to make it live again
                </p>
              </div>
            </div>
            <button
              onClick={resetForm}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Start Time */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <label className="flex items-center gap-2 text-sm font-semibold text-blue-900 mb-3">
                <Calendar className="w-4 h-4" />
                Auction Start Time
              </label>
              <DatePicker
                selected={startTime}
                onChange={(date) => setStartTime(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={new Date()}
                className="w-full text-base py-3 px-4 bg-white border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-medium"
                placeholderText="Select start date and time"
              />
            </div>

            {/* End Time */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <label className="flex items-center gap-2 text-sm font-semibold text-orange-900 mb-3">
                <Calendar className="w-4 h-4" />
                Auction End Time
              </label>
              <DatePicker
                selected={endTime}
                onChange={(date) => setEndTime(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={startTime || new Date()}
                className="w-full text-base py-3 px-4 bg-white border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 font-medium"
                placeholderText="Select end date and time"
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 font-medium mb-1">
                  Important Information
                </p>
                <p className="text-sm text-blue-700">
                  The auction will be republished with the same details but new timing. Make sure to set appropriate start and end times.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRepublishAuction}
                disabled={loading || !startTime || !endTime}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg disabled:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Republishing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Republish Auction
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

