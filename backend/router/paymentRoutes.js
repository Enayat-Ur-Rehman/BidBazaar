import express from "express";
import {getUserPendingPayments,createStripePaymentSession,verifyStripePayment,getPaymentDetails,} from "../controllers/paymentContoller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const paymentRouter = express.Router();

paymentRouter.get("/myPayments", isAuthenticated, getUserPendingPayments);
paymentRouter.get("/:paymentId", isAuthenticated, getPaymentDetails);
paymentRouter.post(
  "/stripe/createSession/:paymentId",
  isAuthenticated,
  createStripePaymentSession
);
paymentRouter.post("/stripe/verify", isAuthenticated, verifyStripePayment);

export default paymentRouter;