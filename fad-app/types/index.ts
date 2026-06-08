export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  is_verified?: number | boolean;
  status?: 'active' | 'pending' | 'suspended' | 'blocked';
  current_balance?: string;
  total_earned?: string;
  ads_watched_count?: number;
}

export interface Ad {
  id: number;
  title: string;
  description?: string;
  ad_type: 'image' | 'video';
  content_url?: string;
  thumbnail_url?: string | null;
  budget: string;
  spent_amount: string;
  actual_views: number;
  status: 'active' | 'paused' | 'completed' | 'draft';
}

export interface DashboardStats {
  totalUsers: number;
  activeAds: number;
  totalRevenue: string;
  adViewsToday: number;
  recentAds: Ad[];
}
export interface ViewAdType {
  user_id: number;
  campaign_id?: number;
  view_duration: number;
  full_duration: number;
  completion_percentage: number;
  device_type: 'mobile' | 'desktop';
  ip_address: string;
  is_completed: boolean;
}