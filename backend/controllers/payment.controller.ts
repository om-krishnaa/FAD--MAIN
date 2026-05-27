import { Request, Response } from "express";
import { Database } from "../config/db";

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await Database.getAllPayments();
    res.json(payments);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const requestPayment = async (req: Request, res: Response) => {
  const { payment_method } = req.body;

  const user = await Database.getUserById(req.user!.id);

  if (!user) return res.json({ success: false, message: "User not found" });
  const { current_balance } = user;

  const { minimum_withdrawal } = await Database.getSettings();
  console.log(current_balance, minimum_withdrawal);
  if (Number(current_balance) < Number(minimum_withdrawal))
    return res.json({
      success: false,
      message: "Minimum amount is " + minimum_withdrawal,
    });
  try {
    const payments = await Database.requestPayment(
      req.user!.id,
      current_balance,
      payment_method
    );
    if (!payments) {
      return res.json({ success: false, message: "Payment request failed" });
    }
    res.json({ success: true, message: "Payment request successful" });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updatePayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const {
      transaction_id,
      type,
      amount,
      currency,
      payment_method,
      status,
      description,
      failure_reason,
    } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }

    const result = await Database.updateTransaction({
      id,
      transaction_id,
      type,
      amount,
      currency,
      payment_method,
      status,
      description,
      failure_reason,
      processed_by: req.user!.id,
    });

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      result,
    });
  } catch (error: any) {
    console.error("Error updating transaction:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
