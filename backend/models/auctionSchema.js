import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
  title: String,
  description: String,
  startingBid: Number,
  category: String,
  condition: {
    type: String,
    enum: ["New", "Used"],
  },
  currentBid: { type: Number, default: 0 },
  startTime: String,
  endTime: String,
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bids: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bid",
      },
      userName: String,
      profileImage: String,
      amount: Number,
    },
  ],
  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  commissionCalculated: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  paymentInitiated:{
    type:Boolean,
    default: false,
  },
  currentPaymentBidderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  paymentHistory:[
    {
      bidderId: mongoose.Schema.Types.ObjectId,
      status: String,
      expiresAt: Date,
      paidAt: Date,
      bidderSequenceOrder: Number,
    },
  ],
  finalWinner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  auctionState:{
    type:String,
    enum: ["Active","Waiting_Payment","Completed","Cancelled"],
  },
  
});

export const Auction = mongoose.model("Auction", auctionSchema);
