import { Payment } from "../models/paymentSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import {createCheckoutSession, verifyPaymentSession,} from "../services/stripeService.js";
import { confirmPaymentSuccess } from "../services/paymentFlowService.js";

// Get pending payments for user
export const getUserPendingPayments = catchAsyncErrors(
  async (req, res, next) => {
    const userId = req.user._id;

    const payments = await Payment.find({
      bidder: userId,
      paymentStatus: "Pending",
    })
      .populate({
        path: "auctionItem",
        select: "title currentBid image endTime",
      })
      .sort({ expiresAt: 1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  }
);

// Create Stripe checkout session
export const createStripePaymentSession = catchAsyncErrors(
  async (req, res, next) => {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId).populate("auctionItem");

    if (!payment) {
      return next(new ErrorHandler("Payment not found", 404));
    }

    if (payment.paymentStatus !== "Pending") {
      return next(new ErrorHandler("Payment already processed", 400));
    }

    if (new Date() > payment.expiresAt) {
      await Payment.findByIdAndUpdate(paymentId, { paymentStatus: "Expired" });
      return next(new ErrorHandler("Payment deadline has passed", 400));
    }

    const sessionData = {
      paymentId: payment._id.toString(),
      auctionTitle: payment.auctionItem.title,
      amount: parseFloat(payment.paymentAmount),
    };

    const session = await createCheckoutSession(sessionData);

    await Payment.findByIdAndUpdate(paymentId, {
      stripeSessionId: session.id,
    });

    res.status(200).json({
      success: true,
      url: session.url,
    });
  }
);

// Verify Stripe payment
export const verifyStripePayment = catchAsyncErrors(
  async (req, res, next) => {
    const { sessionId, paymentId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return next(new ErrorHandler("Payment not found", 404));
    }

    const { isPaid } = await verifyPaymentSession(sessionId);

    if (isPaid) {
      await confirmPaymentSuccess(paymentId);
      res.status(200).json({
        success: true,
        message: "Payment verified and confirmed",
        payment: await Payment.findById(paymentId),
      });
    } else {
      await Payment.findByIdAndUpdate(paymentId, { paymentStatus: "Failed" });
      return next(new ErrorHandler("Payment not completed", 400));
    }
  }
);

// Get payment details
export const getPaymentDetails = catchAsyncErrors(
  async (req, res, next) => {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId)
      .populate({
        path: "auctionItem",
        select: "title currentBid image",
      })
      .populate({
        path: "bidder",
        select: "userName email",
      });

    if (!payment) {
      return next(new ErrorHandler("Payment not found", 404));
    }

    res.status(200).json({
      success: true,
      payment,
    });
  }
);