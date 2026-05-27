import { Save } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { updateGeneral } from '../../actions/settings';
import { useAuth } from '../../contexts/AuthContext';
import { SystemSettings } from '../../types';

interface GeneralSettings {
  platform_name: string;
  platform_description: string;
  default_currency: string;
  timezone: string;
}

export default function General({
  systemSettings,
}: {
  systemSettings: SystemSettings | null;
}) {
  if (!systemSettings) return null;

  const [settings, setSettings] = useState<GeneralSettings>({
    platform_name: systemSettings.platform_name,
    platform_description: systemSettings.platform_description,
    default_currency: systemSettings.default_currency,
    timezone: systemSettings.timezone,
  });

  const [loading, setLoading] = useState(false);

  const { accessToken } = useAuth();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('platform_name', settings.platform_name);
      formData.append('platform_description', settings.platform_description);
      formData.append('default_currency', settings.default_currency);
      formData.append('timezone', settings.timezone);

      const res = (await updateGeneral(formData, accessToken!)) as {
        success: boolean;
        message?: string;
      };

      if (!res.success) {
        toast.error(res.message || 'Something went wrong. Please try again.');
      }
      toast.success(res.message || 'Settings saved successfully');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        General Settings
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Platform Name
          </label>
          <input
            type="text"
            name="platform_name"
            value={settings.platform_name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Platform Description
          </label>
          <input
            type="text"
            name="platform_description"
            value={settings.platform_description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Default Currency
          </label>
          <select
            name="default_currency"
            value={settings.default_currency}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="NPR">Nepali Rupee (Rs)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Timezone
          </label>
          <select
            name="timezone"
            value={settings.timezone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="Asia/Nepal">Asia/Nepal (NST)</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York (EST)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-6 mt-8 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center px-6 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : 'Save'}</span>
        </button>
      </div>
    </div>
  );
}
