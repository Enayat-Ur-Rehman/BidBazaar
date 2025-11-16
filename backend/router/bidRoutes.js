import express from "express";
import { getMyBids, placeBid } from "../controllers/bidController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { checkAuctionEndTime } from "../middlewares/checkAuctionEndTime.js";
import { getMyBids } from "../controllers/bidController.js";
import { getWonBids } from "../controllers/bidController.js";




const router = express.Router();

router.post(
  "/place/:id",
  isAuthenticated,
  isAuthorized("Bidder"),
  checkAuctionEndTime,
  placeBid
);

router.get("/myBids",isAuthenticated,getMyBids);

export default router;
