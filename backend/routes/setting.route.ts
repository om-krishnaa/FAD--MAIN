import {
  changePassword,
  getNotification,
  getSettings,
  updateGeneral,
  updateNotification,
  updateProfile,
  updateSecurity,
  updateSystem,
} from "../controllers/setting.controller";
import { isAdmin, isAuth } from "../middlewares/auth.middleware";
import { createUploader } from "../middlewares/upload.middleware";

const express = require("express");
const router = express.Router();

router.get("/", isAuth, getSettings);
router.get("/notification", isAuth, isAdmin, getNotification);
router.patch("/general", isAuth, isAdmin, updateGeneral);
router.patch(
  "/profile",
  isAuth,
  isAdmin,
  createUploader("profile").single("file"),
  updateProfile
);

router.patch("/notification", isAuth, isAdmin, updateNotification);
router.patch("/system", isAuth, isAdmin, updateSystem);
router.patch("/change-password", isAuth, isAdmin, changePassword);
router.patch("/security", isAuth, isAdmin, updateSecurity);

module.exports = router;
