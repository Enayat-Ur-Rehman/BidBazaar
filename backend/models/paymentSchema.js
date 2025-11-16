import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  auctionItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auction",
    required: true,
  },
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bidAmount: {
    type: Number,
    required: true,
  },
  paymentAmount: {
    type: Number, // 20% of bid amount
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Paid", "Failed", "Expired"],
    default: "Pending",
  },
  paymentMethod: {
    type: String,
    enum: ["Stripe", "Manual", "Pending"],
    default: "Pending",
  },
  stripeSessionId: String,
  paymentProofImage: {
    public_id: String,
    url: String,
  },
  paidAt: Date,
  expiresAt: {
    type: Date,
    required: true,
  },
  bidderSequence: {
    type: Number,
    default: 0,
  },
  reason: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

paymentSchema.index({ auctionItem: 1, bidder: 1 });
paymentSchema.index({ expiresAt: 1 });
paymentSchema.index({ status: 1 });

export const Payment = mongoose.model("Payment", paymentSchema);