import { Payment } from "../models/paymentSchema.js";
import { Auction } from "../models/auctionSchema.js";
import { Bid } from "../models/bidSchema.js";
import { User } from "../models/userSchema.js";
import { sendEmail } from "../utils/sendEmail.js";

/*
STEP#1:
    Fetches all bidders for the auction in descending order of bid amounts.
    Ensures each bidder appears only once using their highest bid.
*/
export const getBiddersInOrder = async (auctionId) => {
  try {
    const bids = await Bid.find({ auctionItem: auctionId })
      .sort({ amount: -1 })
      .populate("bidder.id", "email userName");

    const uniqueBidders = [];
    const seenBidderIds = new Set();

    // Filter unique bidders while keeping highest bid first
    for (const bid of bids) {
      const bidderId = bid.bidder.id._id.toString();
      if (!seenBidderIds.has(bidderId)) {
        uniqueBidders.push(bid);
        seenBidderIds.add(bidderId);
      }
    }

    return uniqueBidders;
  } catch (error) {
    console.error("Error getting bidders:", error);
    throw error;
  }
};

/*
STEP#2:
    Starts the payment process for the highest bidder of a completed auction.
    Creates initial payment entry, stores payment reference in user and auction,
    and sends payment instruction email to highest bidder.
*/
export const initiateAuctionPayment = async (auctionId) => {
  try {
    const auction = await Auction.findById(auctionId).populate("createdBy");
    if (!auction) throw new Error("Auction not found");

    const bidders = await getBiddersInOrder(auctionId);
    if (bidders.length === 0) throw new Error("No bidders found");

    const highestBidder = bidders[0];

    // 20 percent of winning bid
    const paymentAmount = (auction.currentBid * 0.2).toFixed(2);

    // Payment expires in 12 hours
    const expiryTime = new Date(Date.now() + 12 * 60 * 60 * 1000);

    // Create payment entry
    const payment = await Payment.create({
      auctionItem: auctionId,
      bidder: highestBidder.bidder.id._id,
      bidAmount: auction.currentBid,
      paymentAmount,
      status: "Pending",
      expiresAt: expiryTime,
      bidderSequence: 0,
      reason: "Win confirmation",
    });

    // Update auction fields related to payment workflow
    await Auction.findByIdAndUpdate(auctionId, {
      paymentInitiated: true,
      currentPaymentBidderId: highestBidder.bidder.id._id,
      auctionState: "Waiting_Payment",
      $push: {
        paymentHistory: {
          bidderId: highestBidder.bidder.id._id,
          status: "Pending",
          expiresAt: expiryTime,
          bidderSequenceOrder: 0,
        },
      },
    });

    // Add payment to user's pending payments
    await User.findByIdAndUpdate(highestBidder.bidder.id._id, {
      $push: { pendingPayments: payment._id },
    });

    // Send payment email
    await sendPaymentNotificationEmail(
      highestBidder.bidder.id,
      auction,
      payment,
      0
    );

    console.log(`Payment initiated for auction ${auctionId}`);
    return payment;
  } catch (error) {
    console.error("Error initiating payment:", error);
    throw error;
  }
};

/*
STEP#3:
    Sends the payment instruction email to the respective bidder.
    This email informs them about payment deadline, deposit amount and auction details.
*/
export const sendPaymentNotificationEmail = async (
  user,
  auction,
  payment,
  bidderPosition
) => {
  const bidderText =
    bidderPosition === 0 ? "highest bidder" : `${bidderPosition} highest bidder`;

  const subject = `Complete Your Payment for Auction - ${auction.title}`;
  const message = `
    Dear ${user.userName},

    You are the ${bidderText} for "${auction.title}".

    Auction Details:
    Item: ${auction.title}
    Winning Bid: Rs. ${auction.currentBid.toLocaleString()}
    Required Deposit (20 percent): Rs. ${payment.paymentAmount}
    Payment Deadline: ${new Date(payment.expiresAt).toLocaleString()}

    You have 12 hours to complete this payment. Failure to pay will transfer the offer to the next highest bidder.

    To pay, visit your dashboard, open My Payments and select this auction.

    Regards,
    BidBazaar Auction Team
    `;

  try {
    await sendEmail({ email: user.email, subject, message });
  } catch (error) {
    console.error("Email error:", error);
  }
};

/*
STEP#4:
    Handles the expiration of a payment.
    If the highest bidder fails to pay, the next bidder in sequence is offered
    the chance to confirm the win with a new 12 hour deadline.
*/
export const handlePaymentExpiry = async (auctionId) => {
  try {
    const auction = await Auction.findById(auctionId).populate("createdBy");
    const bidders = await getBiddersInOrder(auctionId);

    const currentPaymentIndex = bidders.findIndex(
      (b) =>
        b.bidder.id._id.toString() ===
        auction.currentPaymentBidderId?.toString()
    );

    // Expire current pending payment
    await Payment.findOneAndUpdate(
      {
        auctionItem: auctionId,
        bidder: auction.currentPaymentBidderId,
        status: "Pending",
      },
      { status: "Expired" }
    );

    // Notify expired bidder
    const currentBidder = await User.findById(auction.currentPaymentBidderId);
    if (currentBidder) {
      await sendPaymentExpiredEmail(currentBidder, auction);
    }

    // If another bidder exists, offer them the auction
    if (currentPaymentIndex < bidders.length - 1) {
      const nextBidder = bidders[currentPaymentIndex + 1];

      const newPaymentAmount = (auction.currentBid * 0.2).toFixed(2);
      const newExpiryTime = new Date(Date.now() + 12 * 60 * 60 * 1000);

      const newPayment = await Payment.create({
        auctionItem: auctionId,
        bidder: nextBidder.bidder.id._id,
        bidAmount: auction.currentBid,
        paymentAmount: newPaymentAmount,
        status: "Pending",
        expiresAt: newExpiryTime,
        bidderSequence: currentPaymentIndex + 1,
        reason: "Fallback - previous bidder expired",
      });

      await Auction.findByIdAndUpdate(auctionId, {
        currentPaymentBidderId: nextBidder.bidder.id._id,
        $push: {
          paymentHistory: {
            bidderId: nextBidder.bidder.id._id,
            status: "Pending",
            expiresAt: newExpiryTime,
            bidderSequenceOrder: currentPaymentIndex + 1,
          },
        },
      });

      await User.findByIdAndUpdate(nextBidder.bidder.id._id, {
        $push: { pendingPayments: newPayment._id },
      });

      await sendPaymentNotificationEmail(
        nextBidder.bidder.id,
        auction,
        newPayment,
        currentPaymentIndex + 1
      );

      console.log(`Auction offered to next bidder`);
    } else {
      // No more bidders, auction is cancelled
      await Auction.findByIdAndUpdate(auctionId, {
        auctionState: "Cancelled",
      });
      console.log(`Auction cancelled, no bidders left`);
    }
  } catch (error) {
    console.error("Expiry error:", error);
    throw error;
  }
};

/*
STEP#5:
    Confirms a successful payment. Updates payment, user and auction state
    and finalizes the auction by marking the bidder as the winner.
*/
export const confirmPaymentSuccess = async (paymentId) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status: "Paid",
        paidAt: new Date(),
        updatedAt: new Date(),
      },
      { new: true }
    );

    const auction = await Auction.findById(
      payment.auctionItem
    ).populate("createdBy");
    const bidder = await User.findById(payment.bidder);

    //Calculate Commsion only after payment confirmed
    try{
        const {calculateCommission} = await import("../controllers/commissionController.js");
        const commissionAmount = await calculateCommission(auction._id);
        
        await User.findByIdAndUpdate(auction.createdBy._id, {
            unpaidCommission: commissionAmount,
        },{new: true});

        console.log(`Commission calculated: Rs. ${commissionAmount} for auction ${auction._id}`);
    }catch (error) {
      console.error("Commission calculation error:", error);
    }

    // Update auction state to completed
    await Auction.findByIdAndUpdate(payment.auctionItem, {
      finalWinner: payment.bidder,
      auctionState: "Completed",
      highestBidder: payment.bidder,
      commissionCalculated: true,
    });

    // Move payment from pending to completed for user
    await User.findByIdAndUpdate(payment.bidder, {
      $pull: { pendingPayments: paymentId },
      $push: { completedPayments: paymentId },
      $inc: {
        auctionsWon: 1,
        moneySpent: payment.bidAmount,
      },
    });

    await sendPaymentConfirmedEmail(bidder, auction, payment);
    console.log(`Payment confirmed`);
    return payment;
  } catch (error) {
    console.error("Confirmation error:", error);
    throw error;
  }
};

/*
    Sends an email when bidder fails to complete payment before expiry.
*/
export const sendPaymentExpiredEmail = async (user, auction) => {
  const subject = `Payment Deadline Missed`;
  const message = `
    Dear ${user.userName},

    Unfortunately, you did not complete the payment within the 12-hour window for the auction "${auction.title}".

    Your exclusive offer has been revoked and the auction has been offered to the next highest bidder.

    Thank you for participating in BidBazaar auctions!

    Best regards,
    BidBazaar Auction Team
    `;

  try {
    await sendEmail({ email: user.email, subject, message });
  } catch (error) {
    console.error("Email error:", error);
  }
};

/*
    Sends confirmation email to bidder after successful payment.
*/
export const sendPaymentConfirmedEmail = async (bidder, auction, payment) => {
  const remaining80 = (auction.currentBid * 0.8).toLocaleString();

  const subject = `Payment Confirmed! Your Win is Official`;

  const message = `
    Dear ${bidder.userName},

    Great news! Your payment of Rs. ${payment.paymentAmount} has been confirmed.

     **YOU OFFICIALLY WON:**
    - Item: ${auction.title}
    - Winning Bid: Rs. ${auction.currentBid.toLocaleString()}
    - 20% Paid: Rs. ${payment.paymentAmount}
    - Remaining 80%: Rs. ${remaining80}

     **NEXT STEPS:**
    1. Contact the auctioneer to arrange delivery/pickup
    2. Pay remaining 80% using your preferred method
    3. Receive your item

    Auctioneer Email: ${auction.createdBy.email}
    Auctioneer Phone: ${auction.createdBy.phone || "N/A"}

    Thank you for your business!

    Best regards,
    BidBazaar Auction Team
    `;

  try {
    await sendEmail({ email: bidder.email, subject, message });
  } catch (error) {
    console.error("Email error:", error);
  }
};

