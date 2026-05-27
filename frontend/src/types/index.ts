export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  password_hash: string;
  is_verified: number;
  is_email_verified: number;
  verification_code: string | null;
  verification_expires_at: string | null;
  reset_token: string | null;
  reset_token_expires_at: string | null;
  status: 'active' | 'pending' | 'suspended' | 'blocked';
  current_balance: string;
  total_earned: string;
  referals_earned: string;
  ads_watched_count: number;
  last_active_at: string | null;
  ip_address: string | null;
  device_fingerprint: string | null;
  profile_picture: string | null;
  bio: string | null;
  date_of_birth: string | null;
  gender: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
  role: 'user' | 'admin' | 'super_admin';
}

export interface Ad {
  id: number;
  facility_id: number;
  title: string;
  description: string;
  ad_type: 'image' | 'video';
  content_url: string;
  thumbnail_url: string | null;
  file_size: number | null;
  duration: number | null;
  dimensions: string | null;
  budget: string;
  spent_amount: string;
  cost_per_view: string;
  target_views: string;
  actual_views: number;
  click_through_rate: string;
  completion_rate: string;
  approved_by: string;
  transaction_code: string;
  transaction_amount: string;
  transaction_status: string;
  payment_method: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  start_date: string | null;
  end_date: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  facility_name: string;
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

export interface DashboardStats {
  totalUsers: number;
  activeAds: number;
  totalRevenue: string;
  adViewsToday: number;
  recentAds: Ad[];
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalPayouts: number;
}

export interface Analytics {
  stats: {
    totalViews: number;
    activeUsers: number;
    revenueGenerated: string;
    avgCTR: string;
  };
  weeklyEngagement: {
    date: string;
    day: string;
    total_views: number;
    active_users: number;
  }[];
  topAds: {
    title: string;
    views: number;
    ctr: string;
    revenue: string;
  }[];
  recentAds: Ad[];
  revenueBreakdown: {
    revenueFromFacilities: string;
    paidToUsers: number;
    netProfit: number;
  };
}

type PaymentMethod = 'esewa' | 'khalti' | 'bank_transfer' | 'digital_wallet';

export interface PaymentMethodStats {
  total_transactions: number;
  success_rate: string;
  volume: string;
}

export interface PaymentStats {
  total_revenue: string;
  total_payouts: string;
  pending_payouts: string;
  failed_transactions: number;
  payment_methods: Record<PaymentMethod, PaymentMethodStats>;
}

export interface Payment {
  id: number;
  transaction_id: string;
  user_id: number;
  facility_id: number | null;
  type: 'revenue' | 'payout';
  amount: string;
  currency: string;
  user: User;
  payment_method: PaymentMethod;
  payment_reference: string | null;
  status: 'completed' | 'pending' | 'failed';
  description: string | null;
  processed_by: number | null;
  processed_at: string | null;
  failure_reason: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface SystemSettings {
  platform_name: string;
  platform_description: string;
  default_currency: string;
  timezone: string;
  referral_bonus: string;
  daily_ad_limit: string;
  min_view_duration: string;
  cost_per_view: string;
  ip_tracking_enabled: string;
  multiple_account_detection: string;
  minimum_withdrawal: string;
  session_timeout: string;
  backup_frequency: string;
  platform_logo: string;
  database_type: string;
  maintenance_mode: string;
  debug_mode: string;
  two_factor_auth: string;
  login_notification: string;
}

export interface SecuritySettingsState {
  daily_ad_limit: string;
  min_view_duration: string;
  ip_tracking_enabled: boolean;
  multiple_account_detection: boolean;
}

export interface NotificationState {
  email_notifications: boolean;
  security_alerts: boolean;
  payment_notifications: boolean;
  system_updates: boolean;
}

export interface SystemState {
  backup_frequency: string;
  minimum_withdrawal: number;
  cost_per_view: number;
  referral_bonus: number;
  maintenance_mode: boolean;
}

export interface SettingSecurityState {
  currentPassword: string;
  confirmPassword: string;
  newPassword: string;
  two_factor_auth: boolean;
  login_notification: boolean;
}

export interface Notification {
  id: number;
  email_notifications: 0 | 1;
  security_alerts: 0 | 1;
  payment_notifications: 0 | 1;
  system_updates: 0 | 1;
  created_at: string;
  updated_at: string;
}

export interface BlockedUser {
  id: number;
  user_id: number;
  reason: string;
  blocked_by: number;
  user: User;
  is_permanent: boolean;
  unblock_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface MetricItem {
  label: string;
  value: string;
}

export interface KeyMetrics {
  overview: MetricItem[];
  revenue: MetricItem[];
  'user-activity': MetricItem[];
  'ad-performance': MetricItem[];
  financial: MetricItem[];
}
export interface Report {
  id: number;
  report_name: string;
  report_type: string;
  file_path: string;
  file_size: number;
  status: 'pending' | 'completed' | 'failed';
  parameters: Record<string, any>;
  date_range_start: string;
  date_range_end: string;
  generated_by: number;
  generated_at: string;
}

export interface Referral {
  id: number;
  earned_amount: number;
  created_at: string;
  new_user: User;
}
