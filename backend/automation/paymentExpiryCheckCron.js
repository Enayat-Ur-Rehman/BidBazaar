import cron from "node-cron";
import { Payment } from "../models/paymentSchema.js";
import { handlePaymentExpiry } from "../services/paymentFlowService.js";

export const paymentExpiryCron = () => {
  cron.schedule("*/5 * * * *", async () => {
    const now = new Date();
    console.log("Checking for expired payment deadlines...");

    try {
      const expiredPayments = await Payment.find({
        paymentStatus: "Pending",
        expiresAt: { $lt: now },
      });

      console.log(`Found ${expiredPayments.length} expired payment deadlines`);

      if (expiredPayments.length === 0) {
        return;
      }

      for (const payment of expiredPayments) {
        try {
          console.log(
            `Processing expired payment for auction ${payment.auctionItem}`
          );

          await handlePaymentExpiry(payment.auctionItem);
        } catch (error) {
          console.error(
            `Error handling expiry for payment ${payment._id}:`,
            error.message
          );
        }
      }
    } catch (error) {
      console.error("Critical error in payment expiry check cron:", error);
    }
  });
};
