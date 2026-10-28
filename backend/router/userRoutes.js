import express from "express";
import {
  fetchLeaderboard,
  getProfile,
  getUnpaidCommission,
  login,
  logout,
  register,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuthenticated, getProfile);
router.get("/logout", isAuthenticated, logout);
router.get("/unpaid-commission", isAuthenticated, getUnpaidCommission);
router.get("/leaderboard", fetchLeaderboard);

export default router;
