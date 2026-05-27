import { Request, Response } from "express";
import { Database } from "../config/db";

export const getMyReferrals = async (req: Request, res: Response) => {
  try {
    const referrals = await Database.getMyReferrals(req.user!.id);
    res.json(referrals);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
