const express = require("express");
const router = express.Router();
import {
  createAd,
  createAdViewRecord,
  deleteAd,
  getAllAds,
  getAvailableAds,
  updateAd,
  updateAdStatus,
  updateAdTransactionStatus,
} from "../controllers/ad_campaigns.controller";
import { isAdmin, isAuth } from "../middlewares/auth.middleware";
import { createUploader } from "../middlewares/upload.middleware";

router.get("/", isAuth, isAdmin, getAllAds);
router.get("/available", isAuth, getAvailableAds);

router.post(
  "/create",
  isAuth,
  isAdmin,
  createUploader().single("file"),
  createAd
);
router.post("/view", isAuth, createAdViewRecord);
router.patch(
  "/:id",
  isAuth,
  isAdmin,
  createUploader().single("file"),
  updateAd
);
router.patch("/:id/status", isAuth, isAdmin, updateAdStatus);
router.patch(
  "/:id/transaction-status",
  isAuth,
  isAdmin,
  updateAdTransactionStatus
);
router.delete("/:id", isAuth, isAdmin, deleteAd);

module.exports = router;
