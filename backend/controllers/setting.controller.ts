import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import { Database } from "../config/db";

export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await Database.getSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateGeneral = async (req: Request, res: Response) => {
  try {
    const { platform_name, platform_description, default_currency, timezone } =
      req.body;

    if (
      !platform_name ||
      !platform_description ||
      !default_currency ||
      !timezone
    ) {
      return res.json({
        success: false,
        message:
          "All fields (platform_name, platform_description, default_currency, timezone) are required",
      });
    }

    await Database.updateSettings(
      { platform_name, platform_description, default_currency, timezone },
      req.user!.id
    );

    res.status(200).json({
      success: true,
      message: "General settings updated successfully",
    });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, email, bio } = req.body;

    if (!name || !email || !bio) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, phone, bio) are required",
      });
    }

    const user = await Database.getUserById(req.user!.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let profile_picture = user.profile_picture;

    if (req.file) {
      if (user.profile_picture && fs.existsSync(user.profile_picture)) {
        fs.unlinkSync(user.profile_picture);
      }

      profile_picture = path.join(req.file.destination, req.file.filename);
    }

    const updated = await Database.updateUser(req.user!.id, {
      name,
      email,
      bio,
      profile_picture,
    });

    if (!updated) {
      return res.status(400).json({ message: "Failed to update user" });
    }

    res.json({ success: true, message: "User updated successfully" });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getNotification = async (req: Request, res: Response) => {
  try {
    const notification = await Database.getNotificationPreferences();
    res.json(notification);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const updateNotification = async (req: Request, res: Response) => {
  try {
    const {
      email_notifications,
      security_alerts,
      payment_notifications,
      system_updates,
    } = req.body;

    await Database.updateNotificationPreferences(
      email_notifications,
      security_alerts,
      payment_notifications,
      system_updates
    );

    res.json({
      success: true,
      message: "Notification preferences updated successfully",
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateSystem = async (req: Request, res: Response) => {
  try {
    const {
      backup_frequency,
      minimum_withdrawal,
      cost_per_view,
      referral_bonus,
      maintenance_mode,
    } = req.body;

    if (
      !backup_frequency ||
      !minimum_withdrawal ||
      !cost_per_view ||
      !referral_bonus
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields ( backup_frequency,minimum_withdrawal,cost_per_view,maintenance_mode) are required",
      });
    }

    await Database.updateSettings(
      {
        backup_frequency,
        minimum_withdrawal,
        cost_per_view,
        maintenance_mode,
        referral_bonus,
      },
      req.user!.id
    );

    res.status(200).json({
      success: true,
      message: "System settings updated successfully",
    });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const updateSecurity = async (req: Request, res: Response) => {
  try {
    const {
      daily_ad_limit,
      min_view_duration,
      multiple_account_detection,
      ip_tracking_enabled,
    } = req.body;

    await Database.updateSettings(
      {
        daily_ad_limit,
        min_view_duration,
        multiple_account_detection,
        ip_tracking_enabled,
      },
      req.user!.id
    );

    res.json({
      success: true,
      message: "Security updated successfully",
    });
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export async function changePassword(req: Request, res: Response) {
  const { newPassword, two_factor_auth, login_notification } = req.body;
  try {
    if (newPassword) {
      if (newPassword.length < 6) {
        return res.json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }
      const user = await Database.getUserById(req.user!.id);
      if (!user) return res.json({ success: false, message: "User not found" });
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await Database.updateUserPassword(user.id, hashedPassword);
    }

    await Database.updateSettings(
      {
        two_factor_auth,
        login_notification,
      },
      req.user!.id
    );

    res.json({ success: true, message: "Updated successful" });
  } catch (error: any) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
