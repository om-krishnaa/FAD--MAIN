import { Request, Response } from "express";
import { Database } from "../config/db";

export const getAnalytics = async (req: Request, res: Response) => {
  const { timeframe } = req.params as {
    timeframe: "7d" | "30d" | "90d" | "1yr";
  };

  try {
    const stats = await Database.getStats(
      timeframe,
      req.user!.role,
      req.user!.id
    );
    const weeklyEngagement = await Database.getWeeklyEngagement(
      req.user!.role,
      req.user!.id
    );
    const topAds = await Database.getTopAds(
      timeframe,
      req.user!.role,
      req.user!.id
    );
    const recentAds = await Database.getRecentAds();
    const revenueBreakdown = await Database.getRevenueBreakdown(timeframe);

    res.json({
      stats,
      weeklyEngagement,
      topAds,
      recentAds,
      revenueBreakdown,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getDashboardAnalytics = async (req: Request, res: Response) => {
  try {
    const totalUsers = await Database.getTotalUsers();
    const activeAds = await Database.getActiveAds();
    const totalRevenue = await Database.getTotalRevenue();
    const adViewsToday = await Database.getAdViewsToday();
    const recentAds = await Database.getRecentAds();

    res.json({
      totalUsers,
      activeAds,
      totalRevenue,
      adViewsToday,
      recentAds,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getUserAnalytics = async (req: Request, res: Response) => {
  try {
    const userStats = await Database.getUserStats();

    res.json(userStats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getTransactionAnalytics = async (req: Request, res: Response) => {
  try {
    const transactionStats = await Database.getTransactionStats();

    res.json(transactionStats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getReportMetrics = async (req: Request, res: Response) => {
  try {
    const { timeframe } = req.params as {
      timeframe: "7d" | "30d" | "90d" | "1yr";
    };
    const data = await Database.getKeyMetrics(
      req.user!.role,
      req.user!.id,
      timeframe
    );
    res.json(data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
