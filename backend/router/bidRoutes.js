import express from "express";
import { placeBid } from "../controllers/bidController.js";
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

router.get("/my-bids", isAuthenticated, isAuthorized("Bidder"), getMyBids);

router.get("/won-bids", isAuthenticated, isAuthorized("Bidder"), getWonBids);

export default router;
