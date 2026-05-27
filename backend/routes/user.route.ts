import {
  changeUserRole,
  changeUserStatus,
  getAllUsers,
  getBlockedUser,
  getUser,
} from "../controllers/user.controller";
import { isAdmin, isAuth } from "../middlewares/auth.middleware";

const express = require("express");
const router = express.Router();

router.get("/", isAuth, getUser);
router.get("/all", isAuth, isAdmin, getAllUsers);
router.get("/blocked", isAuth, isAdmin, getBlockedUser);
router.patch("/:id/status", isAuth, isAdmin, changeUserStatus);
router.patch("/:id/role", isAuth, isAdmin, changeUserRole);

module.exports = router;
