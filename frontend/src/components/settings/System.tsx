import { useState, ChangeEvent } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { SystemSettings, SystemState } from '../../types';
import { updateSystem } from '../../actions/settings';

interface SystemProps {
  systemSettings: SystemSettings | null;
}

export default function System({ systemSettings }: SystemProps) {
  if (!systemSettings) return null;

  const { accessToken } = useAuth();

  const [config, setConfig] = useState<SystemState>({
    backup_frequency: systemSettings.backup_frequency || 'daily',
    minimum_withdrawal: Number(systemSettings.minimum_withdrawal) || 1000,
    cost_per_view: Number(systemSettings.cost_per_view) || 30,
    referral_bonus: Number(systemSettings.referral_bonus) || 10,
    maintenance_mode:
      Number(systemSettings.maintenance_mode) === 1 ? true : false,
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setConfig((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setConfig((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleToggle = (field: keyof Pick<SystemState, 'maintenance_mode'>) => {
    setConfig((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = (await updateSystem(config, accessToken!)) as {
        success: boolean;
        message?: string;
      };

      if (!res.success) {
        toast.error(res.message || 'Failed to update system configuration');
        return;
      }
      toast.success(res.message || 'System configuration saved');
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || 'Failed to save system configuration'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        System Configuration
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Backup Frequency
          </label>
          <select
            name="backup_frequency"
            value={config.backup_frequency}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Referral Bonus
          </label>
          <input
            type="number"
            name="referral_bonus"
            value={config.referral_bonus}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Minimum Withdrawal Amount
          </label>
          <input
            type="number"
            name="minimum_withdrawal"
            value={config.minimum_withdrawal}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">ADES</p>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Cost Per View
          </label>
          <input
            type="number"
            name="cost_per_view"
            value={config.cost_per_view}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">ADES</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              Maintenance Mode
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Enable maintenance mode for system updates
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.maintenance_mode}
              onChange={() => handleToggle('maintenance_mode')}
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
