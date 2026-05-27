import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Database } from "../config/db";
import { User } from "../types";

interface JwtPayload {
  id: string;
  email: string;
}

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.json({ success: false, message: "Unauthorized Access" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const userData: User | null = await Database.getUserById(
      Number(decoded.id)
    );
    if (!userData)
      return res.json({
        success: false,
        message: "User Profile Doesn't Exist",
      });

    req.user = userData;

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ tokenExpire: true });
    } else {
      return res.json({ success: false, message: "Invalid token" });
    }
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;

  if (!user?.role || (user.role !== "admin" && user.role !== "super_admin")) {
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized Access" });
  }

  next();
};

export const isSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as User;

  if (!user?.role || user.role !== "super_admin") {
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized Access" });
  }

  next();
};
