import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyPayment, fetchPendingPayments } from "@/store/slices/paymentSlice";
import { CheckCircle, Loader, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("Verifying your payment...");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const verifyPaymentFromURL = async () => {
      try {
        const sessionId = searchParams.get("session_id");
        const paymentId = localStorage.getItem("currentPaymentId");

        console.log("🔍 Verifying payment...", { sessionId, paymentId });

        if (!sessionId || !paymentId) {
          throw new Error("Missing payment details. Session or Payment ID not found.");
        }

        // Verify payment with backend
        const result = await dispatch(verifyPayment(sessionId, paymentId));

        if (result) {
          setStatus("success");
          setMessage("Your payment has been confirmed!");
          localStorage.removeItem("currentPaymentId");

          // Refresh pending payments
          setTimeout(() => {
            dispatch(fetchPendingPayments());
          }, 1000);

          // Start countdown
          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                navigate("/bidder/myBids");
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        } else {
          throw new Error("Payment verification failed on backend");
        }
      } catch (error) {
        console.error("❌ Verification error:", error);
        setStatus("error");
        setMessage(
          error.message || "Payment verification failed. Please contact support."
        );
        toast.error(error.message || "Verification failed");
      }
    };

    verifyPaymentFromURL();
  }, [dispatch, navigate, searchParams]);

  // Verifying state
  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md">
          <Loader className="w-20 h-20 text-blue-600 mx-auto mb-6 animate-spin" />
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Verifying Payment
          </h2>
          <p className="text-gray-600 mb-2 text-lg">{message}</p>
          <p className="text-sm text-gray-500">
            Please wait while we confirm your transaction with Stripe...
          </p>
          <div className="mt-8 flex justify-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="text-center bg-white rounded-2xl shadow-2xl p-12 max-w-md">
          <CheckCircle className="w-24 h-24 text-green-600 mx-auto mb-6 animate-bounce" />
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Success!</h2>
          <p className="text-gray-600 mb-2 text-lg font-semibold">
            {message}
          </p>

          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 my-8 text-left">
            <h3 className="font-bold text-green-900 mb-4 text-lg">
              ✅ What Happens Next:
            </h3>
            <ul className="text-sm text-green-800 space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">1.</span>
                <span>Your 20% payment has been confirmed</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">2.</span>
                <span>You officially own the item</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">3.</span>
                <span>Auctioneer will contact you soon</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">4.</span>
                <span>Pay remaining 80% to auctioneer</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold">5.</span>
                <span>Arrange delivery and receive item</span>
              </li>
            </ul>
          </div>

          <p className="text-sm text-gray-500 mb-8">
            Redirecting to your bids in <span className="font-bold text-green-600">{countdown}</span> seconds...
          </p>

          <button
            onClick={() => navigate("/bidder/myBids")}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 transition text-lg"
          >
            Go to My Bids Now
          </button>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4">
      <div className="text-center bg-white rounded-2xl shadow-2xl p-12 max-w-md">
        <AlertTriangle className="w-24 h-24 text-red-600 mx-auto mb-6" />
        <h2 className="text-4xl font-bold text-gray-900 mb-3">
          Payment Failed
        </h2>
        <p className="text-gray-600 mb-6 text-lg">{message}</p>

        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 my-8 text-left">
          <p className="text-sm text-red-800 font-bold mb-3">
            What you can do:
          </p>
          <ul className="text-sm text-red-700 space-y-2">
            <li>✓ Check your internet connection</li>
            <li>✓ Try again with a different card</li>
            <li>✓ Use a different payment method</li>
            <li>✓ Contact support if problem persists</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/bidder/myPayments")}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition"
          >
            Back to Payments
          </button>
          <button
            onClick={() => navigate("/bidder/myBids")}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
          >
            Go to My Bids
          </button>
        </div>
      </div>
    </div>
  );
}
