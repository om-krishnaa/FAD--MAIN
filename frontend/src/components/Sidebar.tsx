import {
  BarChart3,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  PlayCircle,
  Settings,
  Shield,
  Users,
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ads', label: 'Manage Ads', icon: PlayCircle },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col w-64 h-screen transition-all duration-300 bg-white border-r border-gray-200 shadow-lg dark:bg-gray-900 dark:border-gray-700">
      {/* Enhanced CSS animations */}
      <style>
        {`
          @keyframes floatUp {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
          .animate-floatUp {
            animation: floatUp 3s ease-in-out infinite;
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }
          .animate-pulse-subtle {
            animation: pulse 2s ease-in-out infinite;
          }
        `}
      </style>

      {/* Logo with enhanced styling */}
      <div className="p-6 transition-colors duration-300 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center">
          <img
            src="/FAD Logo.png"
            alt="FAD Logo"
            className="object-contain w-auto h-24 transition-transform duration-300 animate-floatUp hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.innerHTML = `
                <div class="h-24 w-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                  <span class="text-2xl font-bold text-white">FAD</span>
                </div>
              `;
            }}
          />
        </div>
        <div className="mt-2 text-center">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Dashboard of Advertisement
          </p>
        </div>
      </div>

      {/* Navigation with enhanced animations */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            if (
              user?.role !== 'super_admin' &&
              (item.label === 'Users' ||
                item.label === 'Payments' ||
                item.label === 'Security')
            ) {
              return null;
            }

            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li
                key={item.id}
                className="animate-slideIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:transform hover:scale-102'
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-white rounded-r-full animate-pulse-subtle" />
                  )}

                  <Icon
                    size={20}
                    className={`transition-all duration-300 ${
                      isActive ? 'transform rotate-12' : 'group-hover:scale-110'
                    }`}
                  />
                  <span className="font-medium transition-all duration-300">
                    {item.label}
                  </span>

                  {/* Hover effect background */}
                  <div className="absolute inset-0 transition-transform duration-700 transform -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:translate-x-full" />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Enhanced Logout Section */}
      <div className="p-4 transition-colors duration-300 bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900">
        <button
          onClick={handleLogout}
          className="relative flex items-center w-full px-4 py-3 space-x-3 overflow-hidden text-gray-600 transition-all duration-300 rounded-xl dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 group"
        >
          <LogOut
            size={20}
            className="transition-transform duration-300 group-hover:rotate-12"
          />
          <span className="font-medium">Logout</span>

          {/* Hover effect */}
          <div className="absolute inset-0 transition-transform duration-500 transform -translate-x-full bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 group-hover:translate-x-full" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
