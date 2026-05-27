import { Key, Save } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { SettingSecurityState, SystemSettings } from '../../types';
import { updateSettingSecurity } from '../../actions/settings';
import { useAuth } from '../../contexts/AuthContext';

interface SystemProps {
  systemSettings: SystemSettings | null;
}

export default function Security({ systemSettings }: SystemProps) {
  const [settings, setSettings] = useState<SettingSecurityState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    two_factor_auth: systemSettings?.two_factor_auth === '1' ? true : false,
    login_notification:
      systemSettings?.login_notification === '1' ? true : false,
  });
  const [loading, setLoading] = useState(false);
  const { accessToken } = useAuth();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof SettingSecurityState
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }));
  };

  const handleSave = async () => {
    if (settings.newPassword !== settings.confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }
    setLoading(true);
    const res = (await updateSettingSecurity(settings, accessToken!)) as {
      success: boolean;
      message?: string;
    };
    setLoading(false);
    if (!res.success) {
      toast.error(res.message || 'Failed to save security settings');
      return;
    }
    toast.success('Security settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Security Settings
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Current Password
          </label>
          <div className="relative">
            <Key className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 dark:text-gray-500" />
            <input
              type="password"
              value={settings.currentPassword}
              onChange={(e) => handleChange(e, 'currentPassword')}
              className="w-full py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            New Password
          </label>
          <div className="relative">
            <Key className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 dark:text-gray-500" />
            <input
              type="password"
              value={settings.newPassword}
              onChange={(e) => handleChange(e, 'newPassword')}
              className="w-full py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirm New Password
          </label>
          <div className="relative">
            <Key className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 dark:text-gray-500" />
            <input
              type="password"
              value={settings.confirmPassword}
              onChange={(e) => handleChange(e, 'confirmPassword')}
              className="w-full py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              Two-Factor Authentication
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Add an extra layer of security
            </div>
          </div>
          <button
            onClick={() =>
              setSettings((prev) => ({
                ...prev,
                two_factor_auth: !prev.two_factor_auth,
              }))
            }
            className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            {settings.two_factor_auth ? 'Disable 2FA' : 'Enable 2FA'}
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              Login Notifications
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Get notified of new login attempts
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.login_notification}
              onChange={(e) => handleChange(e, 'login_notification')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
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
