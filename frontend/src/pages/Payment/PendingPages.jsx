import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "@/custom-components/Spinner";
import { fetchPendingPayments } from "@/store/slices/paymentSlice";
import {
  Clock,
  AlertCircle,
  Package,
  DollarSign,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

export default function PendingPayments() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pendingPayments, loading, error } = useSelector(
    (state) => state.payment
  );
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    console.log("📋 PendingPayments component mounted");
    dispatch(fetchPendingPayments());

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      setRefreshing(true);
      dispatch(fetchPendingPayments()).finally(() => setRefreshing(false));
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(fetchPendingPayments()).finally(() => setRefreshing(false));
  };

  const calculateTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;

    if (diff <= 0) return { text: "EXPIRED", color: "red" };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { text: `${hours}h ${minutes}m`, color: hours > 2 ? "green" : "yellow" };
  };

  if (loading && pendingPayments.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <Spinner />
      </div>
    );
  }

  if (error && pendingPayments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error</h3>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchPendingPayments())}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pending Payments
          </h1>
          <p className="text-gray-600">
            Complete your 20% payments to confirm your wins
          </p>
        </div>
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

      {/* Empty State */}
      {pendingPayments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Pending Payments
          </h3>
          <p className="text-gray-500 mb-6">
            You don't have any pending auction payments
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
          {pendingPayments.map((payment) => {
            const timeInfo = calculateTimeRemaining(payment.expiresAt);
            const isExpired = timeInfo.color === "red";

            return (
              <div
                key={payment._id}
                className={`bg-white rounded-xl p-6 shadow-lg border-2 transition-all hover:shadow-xl ${
                  isExpired
                    ? "border-red-400 bg-red-50"
                    : timeInfo.color === "yellow"
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-green-400 bg-green-50"
                }`}
              >
                {/* Status Badge */}
                <div
                  className={`flex items-center gap-2 mb-4 font-bold text-sm uppercase tracking-wide ${
                    isExpired
                      ? "text-red-600"
                      : timeInfo.color === "yellow"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  <Clock className="w-5 h-5" />
                  <span>{isExpired ? "EXPIRED" : `⏰ ${timeInfo.text}`}</span>
                </div>

                {/* Item Image */}
                {payment.auctionItem?.image && (
                  <img
                    src={payment.auctionItem.image.url}
                    alt="Auction item"
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2">
                  {payment.auctionItem?.title}
                </h3>

                {/* Payment Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bid Amount:</span>
                    <span className="font-bold text-gray-900">
                      Rs. {payment.bidAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-blue-100 px-3 py-2 rounded-lg flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">Pay Now (20%):</span>
                    </div>
                    <span className="font-bold text-blue-600 text-lg">
                      Rs. {payment.paymentAmount}
                    </span>
                  </div>

                  <div className="text-xs text-gray-600 italic">
                    Remaining 80%: Rs.{" "}
                    {(payment.bidAmount * 0.8).toLocaleString()} (pay to auctioneer)
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => navigate(`/payment/${payment._id}`)}
                  disabled={isExpired}
                  className={`w-full py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                    isExpired
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {isExpired ? "Payment Expired" : "Pay Now"}
                  {!isExpired && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}