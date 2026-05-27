import { useState } from 'react';
import Analytics from './Analytics';
import Dashboard from './Dashboard';
import ManageAds from './ManageAds';
import Payments from './Payments';
import Reports from './Reports';
import Security from './Security';
import Settings from './Settings';
import Sidebar from './Sidebar';
import Users from './Users';

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'ads':
        return <ManageAds />;
      case 'users':
        return <Users />;
      case 'analytics':
        return <Analytics />;
      case 'payments':
        return <Payments />;
      case 'reports':
        return <Reports />;
      case 'security':
        return <Security />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen text-gray-900 transition-colors duration-300 bg-white dark:bg-gray-900 dark:text-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto transition-colors duration-300 bg-white dark:bg-gray-900">
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardLayout;
