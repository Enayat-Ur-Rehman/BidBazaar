import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    bidder: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      userName: {
        type: String,
        required: true,
      },
      profileImage: String,
    },
    auctionItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt fields
  }
);

// Add index for faster queries
bidSchema.index({ "bidder.id": 1, auctionItem: 1 });

export const Bid = mongoose.model("Bid", bidSchema);