import { getMyReferrals } from "../controllers/referral.controller";
import { isAuth } from "../middlewares/auth.middleware";

const express = require("express");
const router = express.Router();

router.get("/", isAuth, getMyReferrals);

module.exports = router;
