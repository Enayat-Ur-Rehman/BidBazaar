import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "@/custom-components/Spinner";
import {getPaymentDetails,createStripeSession,} from "@/store/slices/paymentSlice";
import { loadStripe } from "@stripe/stripe-js";

import {
  Clock,
  AlertCircle,
  CheckCircle,
  Lock,
  ArrowLeft,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY
);

export default function PaymentCheckout() {
  const { paymentId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPayment, loading, sessionLoading } = useSelector(
    (state) => state.payment
  );
  const [timeLeft, setTimeLeft] = useState("");
  const [processing, setProcessing] = useState(false);

  // Fetch payment details
  useEffect(() => {
    console.log("📋 PaymentCheckout mounted, fetching payment details");
    dispatch(getPaymentDetails(paymentId));
  }, [dispatch, paymentId]);

  // Countdown timer
  useEffect(() => {
    if (!currentPayment) return;

    const timer = setInterval(() => {
      const now = new Date();
      const expiry = new Date(currentPayment.expiresAt);
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("EXPIRED");
        clearInterval(timer);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPayment]);

  // Handle payment
  const handlePayNow = async () => {
    try {
      setProcessing(true);

      // Create Stripe session
      const url = await dispatch(createStripeSession(paymentId));

      if (!url) {
        throw new Error("Failed to create payment session");
      }

      console.log("✅ Session created, redirecting to Stripe");

      // Store payment ID for webhook verification
      localStorage.setItem("currentPaymentId", paymentId);

      // Redirect to Stripe Checkout
      window.location.href = url;

      if (error) {
        console.error("❌ Stripe redirect error:", error);
        toast.error(error.message);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error(error.message || "Failed to process payment");
    } finally {
      setProcessing(false);
    }
  };

  // Loading state
  if (loading || !currentPayment) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const isExpired = timeLeft === "EXPIRED";
  const remaining80 = (currentPayment.bidAmount * 0.8).toLocaleString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/bidder/myPayments")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Payments
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Confirm Your Win
          </h1>
          <p className="text-gray-600">
            Complete the 20% payment to secure your item
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Status Banner */}
          {isExpired ? (
            <div className="bg-red-500 text-white p-4 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-bold">Payment Deadline Expired</p>
                <p className="text-sm">Your offer has been cancelled</p>
              </div>
            </div>
          ) : (
            <div
              className={`text-white p-4 flex items-center gap-3 ${
                timeLeft === "EXPIRED"
                  ? "bg-red-500"
                  : timeLeft.startsWith("0h") || timeLeft.startsWith("1h")
                  ? "bg-orange-500"
                  : "bg-green-500"
              }`}
            >
              <Clock className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-bold">Time Remaining: {timeLeft}</p>
                <p className="text-sm">Complete payment within this timeframe</p>
              </div>
            </div>
          )}

          <div className="p-8">
            {/* Auction Details */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {currentPayment.auctionItem?.title}
              </h2>

              {currentPayment.auctionItem?.image && (
                <img
                  src={currentPayment.auctionItem.image.url}
                  alt="Auction item"
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}

              {/* Payment Breakdown */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Winning Bid Amount:</span>
                  <span className="font-bold text-gray-900 text-lg">
                    Rs. {currentPayment.bidAmount.toLocaleString()}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 font-semibold">
                      20% Payment (Due Now):
                    </span>
                    <span className="font-bold text-green-600 text-2xl">
                      Rs. {currentPayment.paymentAmount}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    ℹ️ Pay remaining 80% directly to auctioneer after confirmation
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Remaining 80% (Later):</span>
                    <span className="text-gray-900 font-semibold">
                      Rs. {remaining80}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-2">What happens after:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Your win will be officially confirmed</li>
                    <li>Auctioneer will contact you for delivery</li>
                    <li>Pay remaining 80% using preferred method</li>
                    <li>Receive your item</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 flex gap-3">
              <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-900">
                <p className="font-semibold mb-1">🔒 Secure Payment</p>
                <p>Your payment is protected by Stripe encryption</p>
              </div>
            </div>

            {/* Action Buttons */}
            {isExpired ? (
              <div className="space-y-3">
                <button
                  disabled
                  className="w-full bg-gray-400 text-white py-4 rounded-lg font-bold cursor-not-allowed"
                >
                  Payment Period Expired
                </button>
                <button
                  onClick={() => navigate("/bidder/myPayments")}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300"
                >
                  Back to Payments
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handlePayNow}
                  disabled={processing || sessionLoading}
                  className={`w-full py-4 rounded-lg font-bold transition flex items-center justify-center gap-2 ${
                    processing || sessionLoading
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800"
                  }`}
                >
                  {processing || sessionLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Pay Rs. {currentPayment.paymentAmount} with Stripe
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate("/bidder/myPayments")}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            )}

            <p className="text-center text-xs text-gray-500 mt-4">
              By clicking "Pay Now", you agree to our terms and conditions
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-bold mb-4 text-gray-900">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-900">Why 20% upfront?</p>
              <p className="text-gray-600 text-sm mt-1">
                The 20% deposit confirms your commitment and secures the item.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                What if I miss the deadline?
              </p>
              <p className="text-gray-600 text-sm mt-1">
                The auction will be offered to the next highest bidder.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                Is this payment secure?
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Yes, we use Stripe for secure, PCI-compliant payment processing.
              </p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">How do I pay the 80%?</p>
              <p className="text-gray-600 text-sm mt-1">
                Contact the auctioneer after 20% is confirmed. You can use bank transfer, easypaisa, or COD.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}