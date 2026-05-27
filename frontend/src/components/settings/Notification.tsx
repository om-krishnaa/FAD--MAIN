import { Save } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { updateNotification } from '../../actions/settings';
import { useAuth } from '../../contexts/AuthContext';
import { Notification, NotificationState } from '../../types';

interface NotificationProps {
  notificationState: Notification | null;
}

export default function Notifications({
  notificationState,
}: NotificationProps) {
  if (!notificationState) return null;

  const { accessToken } = useAuth();
  const [notifications, setNotifications] = useState<NotificationState>({
    email_notifications:
      notificationState.email_notifications === 1 ? true : false,
    security_alerts: notificationState.security_alerts === 1 ? true : false,
    payment_notifications:
      notificationState.payment_notifications === 1 ? true : false,
    system_updates: notificationState.system_updates === 1 ? true : false,
  });

  const [loading, setLoading] = useState(false);

  const handleToggle = (field: keyof NotificationState) => {
    setNotifications((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = (await updateNotification(notifications, accessToken!)) as {
        success: boolean;
        message?: string;
      };

      if (!res.success) {
        toast.error(res.message || 'Failed to update notifications');
        return;
      }

      toast.success(res.message || 'Notification preferences saved');
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || 'Failed to save notifications'
      );
    } finally {
      setLoading(false);
    }
  };

  const notificationItems = [
    {
      label: 'Email Notifications',
      description: 'Receive notifications via email',
      field: 'email_notifications' as const,
    },
    {
      label: 'Security Alerts',
      description: 'Get notified about security events',
      field: 'security_alerts' as const,
    },
    {
      label: 'Payment Notifications',
      description: 'Notifications for payment activities',
      field: 'payment_notifications' as const,
    },
    {
      label: 'System Updates',
      description: 'Updates about system maintenance',
      field: 'system_updates' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Notification Preferences
      </h2>

      <div className="space-y-4">
        {notificationItems.map((item) => (
          <div
            key={item.field}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700"
          >
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {item.label}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {item.description}
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications[item.field]}
                onChange={() => handleToggle(item.field)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-6 mt-8 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`flex items-center px-6 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : 'Save'}</span>
        </button>
      </div>
    </div>
  );
}
