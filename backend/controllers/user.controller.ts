import { Request, Response } from "express";
import { Database } from "../config/db";

export const getUser = async (req: Request, res: Response) => {
  try {
    const users = await Database.getUserById(req.user!.id);
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { status, role, page, limit } = req.query;

    const pageNum = page ? parseInt(page as string, 10) : 1;
    const limitNum = limit ? parseInt(limit as string, 10) : 10;

    const { rows, total } = await Database.getAllUsers({
      status: status ? String(status) : undefined,
      role: role ? String(role) : undefined,
      page: pageNum,
      limit: limitNum,
    });

    res.json({
      data: rows,
      metadata: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getBlockedUser = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;

    const pageNum = page ? parseInt(page as string, 10) : 1;
    const limitNum = limit ? parseInt(limit as string, 10) : 10;

    const { rows, total } = await Database.getBlockedUsers({
      page: pageNum,
      limit: limitNum,
    });

    res.json({
      data: rows,
      metadata: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const changeUserStatus = async (req: Request, res: Response) => {
  const { status, reason, blocked_by, is_permanent, unblock_date, notes } =
    req.body;
  const { id } = req.params;

  try {
    const blockedData =
      status === "blocked"
        ? {
            reason,
            blocked_by,
            is_permanent: !!is_permanent,
            unblock_date: unblock_date || null,
            notes: notes || null,
          }
        : undefined;

    const success = await Database.updateUserStatus(
      Number(id),
      status,
      blockedData
    );

    if (!success) return res.json({ message: "User not found" });

    res.json({ success: true, message: "User status updated" });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const changeUserRole = async (req: Request, res: Response) => {
  const { role } = req.body;
  const { id } = req.params;

  try {
    const success = await Database.updateUserRole(Number(id), role);

    if (!success) return res.json({ message: "User not found" });

    res.json({ success: true, message: "User role updated" });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
