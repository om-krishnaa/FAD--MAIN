import { Router } from "express";
import { isAdmin, isAuth } from "../middlewares/auth.middleware";
import {
  generateAdAnalyticsReport,
  generateFinancialReport,
  generateReport,
  generateUserReport,
  getReports,
} from "../controllers/report.controller";

const router = Router();

router.get("/", isAuth, isAdmin, getReports);
router.post("/", isAuth, isAdmin, generateReport);
router.post("/users", isAuth, isAdmin, generateUserReport);
router.post("/finance", isAuth, isAdmin, generateFinancialReport);
router.post("/ads", isAuth, isAdmin, generateAdAnalyticsReport);
module.exports = router;
