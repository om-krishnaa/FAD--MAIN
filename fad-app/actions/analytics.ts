import { apiRequest } from '@/lib/api';
import { DashboardStats } from '@/types';

export async function getDashboardAnalytics(token: string): Promise<DashboardStats> {
  return apiRequest('/analytics/dashboard', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}