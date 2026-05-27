export interface UserSession {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  registeredAt: Date;
  passwordResetAt?: Date;
}

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
  status: "pending" | "active" | "suspended" | "blocked";
  current_balance: string;
  total_earned: string;
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
  role: "user" | "admin" | "super_admin";
}

export interface SystemSetting {
  id: number;
  setting_key: string;
  setting_value: string;
  setting_type: "string" | "integer" | "decimal" | "boolean" | "json";
  description: string;
  category: string;
  is_public: boolean;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface MetricItem {
  label: string;
  value: string;
}

export interface KeyMetrics {
  overview: MetricItem[];
  revenue: MetricItem[];
  "user-activity": MetricItem[];
  "ad-performance": MetricItem[];
  financial: MetricItem[];
}
