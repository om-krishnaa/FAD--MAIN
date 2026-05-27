import { Mail, Save, Upload } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { updateProfile } from '../../actions/settings';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types';

interface ProfileProps {
  user: User | null;
}

interface ProfileState {
  name: string;
  email: string;
  bio: string;
  avatar: string | File | null;
}

export default function Profile({ user }: ProfileProps) {
  if (!user) return null;

  const { accessToken } = useAuth();
  const [profile, setProfile] = useState<ProfileState>({
    name: user.name,
    email: user.email,
    bio: user.bio || '',
    avatar: user.profile_picture || null,
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfile((prev) => ({ ...prev, avatar: e.target.files![0] }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('email', profile.email);
      formData.append('bio', profile.bio);
      if (profile.avatar instanceof File) {
        formData.append('file', profile.avatar);
      }

      const res = (await updateProfile(formData, accessToken!)) as {
        success: boolean;
        message?: string;
      };

      if (!res.success) {
        toast.error('Failed to update profile');
        return;
      }
      toast.success(res.message || 'Profile updated successfully');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Admin Profile
      </h2>

      <div className="flex items-center space-x-6">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
          {profile.avatar ? (
            <img
              src={import.meta.env.VITE_BACKEND_URL + profile.avatar}
              alt="Avatar"
              className="object-cover w-full h-full rounded-full"
            />
          ) : (
            <span className="text-2xl font-bold text-white">AD</span>
          )}
        </div>

        <div>
          <label className="flex items-center px-4 py-2 space-x-2 text-gray-700 transition-colors border border-gray-300 rounded-lg cursor-pointer dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300">
            <Upload className="w-4 h-4" />
            <span>Change Avatar</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            JPG, PNG up to 2MB
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <input
            type="text"
            name="full_name"
            value={profile.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 dark:text-gray-500" />
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              className="w-full py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Bio
        </label>
        <textarea
          name="bio"
          rows={3}
          value={profile.bio}
          onChange={handleInputChange}
          className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
        />
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
