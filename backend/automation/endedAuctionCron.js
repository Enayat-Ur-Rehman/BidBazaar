import cron from "node-cron";
import { Auction } from "../models/auctionSchema.js";
import { initiateAuctionPayment } from "../services/paymentFlowService.js";

export const endedAuctionCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    const now = new Date();
    console.log("Cron for ended auction running...");

    try{
      const endedAuctions = await Auction.find({
        endTime: {$lt: now},
        paymentInitiated: false,
      });
      console.log(`Found ${endedAuctions.length} ended Auctions`);

      for(const auction of endedAuctions){
        try{
          if(auction.bids.length === 0){
            await Auction.findByIdAndUpdate(auction._id, {
              auctionState: "Cancelled",
              commissionCalculated: true, //No Commsion if no bids
            });
            console.log(`Auction ${auction._id} cancelled due to no bids`);
          }
          else{
          await initiateAuctionPayment(auction._id);
          console.log(`Payment Initiated for auction ${auction._id}`);
        }
      }catch(error){
        console.error(`Error processing auction ${auction._id}:`,error);
      }
    }
    }catch(error){
      console.error("Error in Ended Auction Cron :",error);
    }
  });
};
