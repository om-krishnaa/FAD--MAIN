const express = require("express");
const router = express.Router();
import {
  login,
  register,
  requestReset,
  resendVerification,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.controller";

router.post("/register", register);
router.patch("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/request-reset", requestReset);
router.post("/reset-password", resetPassword);
router.post("/resend-verification", resendVerification);

module.exports = router;
