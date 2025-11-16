import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Auction } from "../models/auctionSchema.js";
import { Bid } from "../models/bidSchema.js";
import { User } from "../models/userSchema.js";

export const placeBid = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Auction Item not found.", 404));
  }
  const { amount } = req.body;
  if (!amount) {
    return next(new ErrorHandler("Please place your bid.", 404));
  }
  if (amount <= auctionItem.currentBid) {
    return next(
      new ErrorHandler("Bid amount must be greater than the current bid.", 404)
    );
  }
  if (amount < auctionItem.startingBid) {
    return next(
      new ErrorHandler("Bid amount must be greater than starting bid.", 404)
    );
  }

  try {
    const existingBid = await Bid.findOne({
      "bidder.id": req.user._id,
      auctionItem: auctionItem._id,
    });
    const existingBidInAuction = auctionItem.bids.find(
      (bid) => bid.userId.toString() == req.user._id.toString()
    );
    if (existingBid && existingBidInAuction) {
      existingBidInAuction.amount = amount;
      existingBid.amount = amount;
      await existingBidInAuction.save();
      await existingBid.save();
      auctionItem.currentBid = amount;
    } else {
      const bidderDetail = await User.findById(req.user._id);
      const bid = await Bid.create({
        amount,
        bidder: {
          id: bidderDetail._id,
          userName: bidderDetail.userName,
          profileImage: bidderDetail.profileImage?.url,
        },
        auctionItem: auctionItem._id,
      });
      auctionItem.bids.push({
        userId: req.user._id,
        userName: bidderDetail.userName,
        profileImage: bidderDetail.profileImage?.url,
        amount,
      });
      auctionItem.currentBid = amount;
    }
    await auctionItem.save();

    res.status(201).json({
      success: true,
      message: "Bid placed.",
      currentBid: auctionItem.currentBid,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message || "Failed to place bid.", 500));
  }
});

export const getMyBids = catchAsyncErrors(async (req, res, next) => {
  try {
    const bids = await Bid.find({ "bidder.id": req.user._id })
      .populate("auctionItem")
      .sort({ createdAt: -1 });

    const myBids = bids
      .filter((bid) => bid.auctionItem) // Filter out deleted auctions
      .map((bid) => {
        try {
          return {
            _id: bid._id,
            bidAmount: bid.amount,
            auctionTitle: bid.auctionItem?.title || "Unknown",
            auctionImage: bid.auctionItem?.image?.url
              ? { url: bid.auctionItem.image.url }
              : null,
            auctionStartTime: bid.auctionItem?.startTime,
            auctionEndTime: bid.auctionItem?.endTime,
            highestBid: bid.auctionItem?.currentBid || 0,
            isWinning: bid.amount === bid.auctionItem?.currentBid,
            auctioneerName: bid.auctionItem?.createdBy?.userName || "Unknown",
            itemCount: 1,
          };
        } catch (mapError) {
          console.error("Error mapping bid:", mapError);
          return null;
        }
      })
      .filter((bid) => bid !== null); // Remove any failed mappings

    res.status(200).json({
      success: true,
      bids: myBids,
    });
  } catch (error) {
    console.error("getMyBids error:", error);
    return next(new ErrorHandler(error.message || "Failed to fetch bids", 500));
  }
});

export const getWonBids = catchAsyncErrors(async (req, res, next) => {
  try {
    const bids = await Bid.find({ "bidder.id": req.user._id })
      .populate("auctionItem")
      .sort({ createdAt: -1 });

    console.log("Total bids found:", bids.length);

    const wonBids = bids
      .filter((bid) => {
        if (!bid.auctionItem) {
          console.log("Bid has no auctionItem:", bid._id);
          return false;
        }

        const now = new Date();
        const endTime = new Date(bid.auctionItem.endTime);
        const isEnded = now > endTime;
        const isWinning = bid.amount === bid.auctionItem.currentBid;

        console.log(`Bid ${bid._id}: ended=${isEnded}, winning=${isWinning}`);

        return isEnded && isWinning;
      })
      .map((bid) => {
        try {
          return {
            _id: bid._id,
            bidAmount: bid.amount,
            auctionTitle: bid.auctionItem?.title || "Unknown",
            auctionImage: bid.auctionItem?.image?.url
              ? { url: bid.auctionItem.image.url }
              : null,
            auctionStartTime: bid.auctionItem?.startTime,
            auctionEndTime: bid.auctionItem?.endTime,
            highestBid: bid.auctionItem?.currentBid || 0,
            isWinning: true,
            auctioneerName: bid.auctionItem?.createdBy?.userName || "Unknown",
            itemCount: 1,
          };
        } catch (mapError) {
          console.error("Error mapping won bid:", mapError);
          return null;
        }
      })
      .filter((bid) => bid !== null);

    console.log("Won bids count:", wonBids.length);

    res.status(200).json({
      success: true,
      bids: wonBids,
    });
  } catch (error) {
    console.error("getWonBids error:", error);
    return next(new ErrorHandler(error.message || "Failed to fetch won bids", 500));
  }
});