import React from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, ArrowRight } from "lucide-react";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100 p-4">
      <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
        <XCircle className="w-20 h-20 text-yellow-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Payment Cancelled
        </h2>
        <p className="text-gray-600 mb-2">
          You cancelled the payment. Your auction offer is still active.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6 text-left">
          <p className="text-sm text-yellow-800">
            <strong>⏰ Important:</strong>
          </p>
          <p className="text-sm text-yellow-700 mt-2">
            You still have time to complete payment before the deadline expires.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/bidder/myPayments")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            Try Again
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate("/bidder/myBids")}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300"
          >
            Go to My Bids
          </button>
        </div>
      </div>
    </div>
  );
}