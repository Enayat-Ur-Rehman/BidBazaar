// import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
// import ErrorHandler from "../middlewares/error.js";
// import { Auction } from "../models/auctionSchema.js";
// import { Bid } from "../models/bidSchema.js";
// import { User } from "../models/userSchema.js";

// export const placeBid = catchAsyncErrors(async (req, res, next) => {
//   const { id } = req.params;
//   const auctionItem = await Auction.findById(id);
//   if (!auctionItem) {
//     return next(new ErrorHandler("Auction Item not found.", 404));
//   }
//   const { amount } = req.body;
//   if (!amount) {
//     return next(new ErrorHandler("Please place your bid.", 404));
//   }
//   if (amount <= auctionItem.currentBid) {
//     return next(
//       new ErrorHandler("Bid amount must be greater than the current bid.", 404)
//     );
//   }
//   if (amount < auctionItem.startingBid) {
//     return next(
//       new ErrorHandler("Bid amount must be greater than starting bid.", 404)
//     );
//   }

//   try {
//     const existingBid = await Bid.findOne({
//       "bidder.id": req.user._id,
//       auctionItem: auctionItem._id,
//     });
//     const existingBidInAuction = auctionItem.bids.find(
//       (bid) => bid.userId.toString() == req.user._id.toString()
//     );
//     if (existingBid && existingBidInAuction) {
//       existingBidInAuction.amount = amount;
//       existingBid.amount = amount;
//       await existingBidInAuction.save();
//       await existingBid.save();
//       auctionItem.currentBid = amount;
//     } else {
//       const bidderDetail = await User.findById(req.user._id);
//       const bid = await Bid.create({
//         amount,
//         bidder: {
//           id: bidderDetail._id,
//           userName: bidderDetail.userName,
//           profileImage: bidderDetail.profileImage?.url,
//         },
//         auctionItem: auctionItem._id,
//       });
//       auctionItem.bids.push({
//         userId: req.user._id,
//         userName: bidderDetail.userName,
//         profileImage: bidderDetail.profileImage?.url,
//         amount,
//       });
//       auctionItem.currentBid = amount;
//     }
//     await auctionItem.save();

//     res.status(201).json({
//       success: true,
//       message: "Bid placed.",
//       currentBid: auctionItem.currentBid,
//     });
//   } catch (error) {
//     return next(new ErrorHandler(error.message || "Failed to place bid.", 500));
//   }
// });

// export const getMyBids = async (req,res,next) => {
//   try{
//     const bids = await Bid.find({"bidder.id": req.user._id}).populate("auctionItem");

//     res.status(200).json({success: true, bids});
//   }catch(error){
//       return next(new ErrorHandler(error.message || "Failed to get my bids.", 500));
//   }
// };
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
    return next(new ErrorHandler("Please place your bid.", 400));
  }
  
  if (amount <= auctionItem.currentBid) {
    return next(
      new ErrorHandler("Bid amount must be greater than the current bid.", 400)
    );
  }
  
  if (amount < auctionItem.startingBid) {
    return next(
      new ErrorHandler("Bid amount must be greater than starting bid.", 400)
    );
  }

  try {
    const existingBid = await Bid.findOne({
      "bidder.id": req.user._id,
      auctionItem: auctionItem._id,
    });
    
    const existingBidInAuction = auctionItem.bids.find(
      (bid) => bid.userId.toString() === req.user._id.toString()
    );
    
    if (existingBid && existingBidInAuction) {
      // Update existing bid
      existingBidInAuction.amount = amount;
      existingBid.amount = amount;
      await existingBid.save();
      auctionItem.currentBid = amount;
    } else {
      // Create new bid
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
      
      console.log("New bid created:", bid); // Debug log
    }
    
    await auctionItem.save();

    res.status(201).json({
      success: true,
      message: "Bid placed successfully.",
      currentBid: auctionItem.currentBid,
      bidId: existingBid?._id,
    });
  } catch (error) {
    console.error("Error placing bid:", error); // Debug log
    return next(new ErrorHandler(error.message || "Failed to place bid.", 500));
  }
});

export const getMyBids = catchAsyncErrors(async (req, res, next) => {
  try {
    console.log("Fetching bids for user:", req.user._id); // Debug log
    
    const bids = await Bid.find({ "bidder.id": req.user._id })
      .populate({
        path: "auctionItem",
        select: "title description currentBid startingBid endTime startTime category image"
      })
      .sort({ createdAt: -1 }); // Sort by newest first

    console.log(`Found ${bids.length} bids for user`); // Debug log

    // Filter out bids where auction item was deleted
    const validBids = bids.filter(bid => bid.auctionItem !== null);

    res.status(200).json({
      success: true,
      count: validBids.length,
      bids: validBids,
    });
  } catch (error) {
    console.error("Error fetching bids:", error); // Debug log
    return next(new ErrorHandler(error.message || "Failed to get my bids.", 500));
  }
});