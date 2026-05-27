const express = require("express");
const router = express.Router();
import {
  getAnalytics,
  getDashboardAnalytics,
  getReportMetrics,
  getTransactionAnalytics,
  getUserAnalytics,
} from "../controllers/analytic.controller";
import { isAdmin, isAuth } from "../middlewares/auth.middleware";

router.get("/dashboard", isAuth, isAdmin, getDashboardAnalytics);
router.get("/user", isAuth, isAdmin, getUserAnalytics);
router.get("/transaction", isAuth, isAdmin, getTransactionAnalytics);
router.get("/report/:timeframe", isAuth, isAdmin, getReportMetrics);
router.get("/:timeframe", isAuth, isAdmin, getAnalytics);

module.exports = router;
