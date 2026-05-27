import { X } from 'lucide-react';
import { useState } from 'react';

type ReasonFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { reason: string; notes?: string | null }) => void;
};

export default function BlockUserForm({
  isOpen,
  onClose,
  onSubmit,
}: ReasonFormProps) {
  const [formData, setFormData] = useState({
    reason: '',
    notes: '',
  });

  const handleSubmit = () => {
    if (!formData.reason) {
      alert('Please enter a reason');
      return;
    }

    onSubmit({
      reason: formData.reason,
      notes: formData.notes || null,
    });

    handleClose();
  };

  const handleClose = () => {
    setFormData({
      reason: '',
      notes: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Provide Reason
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 rounded-lg hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Reason *
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter reason"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Notes (optional)
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional notes"
            />
          </div>
        </div>

        <div className="flex flex-col p-4 space-y-2 border-t border-gray-200 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-4 dark:border-gray-700">
          <button
            onClick={handleClose}
            className="w-full px-6 py-2 text-gray-700 border border-gray-300 rounded-lg sm:w-auto dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="w-full px-6 py-2 text-white bg-blue-600 rounded-lg sm:w-auto hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
