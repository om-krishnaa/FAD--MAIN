import {
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  Eye,
  FileText,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getReportAnalytics, getReports } from '../actions/analytics';
import { useAuth } from '../contexts/AuthContext';
import { KeyMetrics, Report } from '../types';
import Loader from './Loader';
import {
  generateAdsReport,
  generateFinanceReport,
  generateReport,
  generateUserReport,
} from '../actions/reports';
import { formatDate } from '../utils';

const defaultKeyMetrics: KeyMetrics = {
  overview: [
    { label: 'Total Users', value: '0' },
    { label: 'Active Ads', value: '0' },
    { label: 'Total Revenue', value: '0' },
    { label: 'Ad Views', value: '0' },
  ],
  revenue: [
    { label: 'Gross Revenue', value: '0' },
    { label: 'User Payouts', value: '0' },
    { label: 'Net Profit', value: '0' },
    { label: 'Avg. Revenue/Ad', value: '0' },
  ],
  'user-activity': [
    { label: 'Daily Active Users', value: '0' },
    { label: 'Avg. Session Time', value: '0' },
    { label: 'Ads per User', value: '0' },
    { label: 'Retention Rate', value: '0' },
  ],
  'ad-performance': [
    { label: 'Total Impressions', value: '0' },
    { label: 'Click-through Rate', value: '0' },
    { label: 'Completion Rate', value: '0' },
    { label: 'Avg. View Duration', value: '0' },
  ],
  financial: [
    { label: 'Operating Revenue', value: '0' },
    { label: 'Operating Expenses', value: '0' },
    { label: 'EBITDA', value: '0' },
    { label: 'Profit Margin', value: '0' },
  ],
};

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [timeframe, setTimeframe] = useState('30d');
  const [analytics, setAnalytics] = useState<KeyMetrics>(defaultKeyMetrics);
  const [loading, setLoading] = useState(false);
  const [recentReports, setRecentReports] = useState<Report[] | null>(null);

  const { accessToken } = useAuth();

  const reportTypes = [
    { id: 'overview', name: 'Overview Report', icon: BarChart3 },
    { id: 'revenue', name: 'Revenue Report', icon: DollarSign },
    { id: 'user-activity', name: 'User Activity', icon: Users },
    { id: 'ad-performance', name: 'Ad Performance', icon: Eye },
    { id: 'financial', name: 'Financial Summary', icon: FileText },
  ];

  const currentMetrics =
    analytics[selectedReport as keyof typeof analytics] || analytics.overview;

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      const res = (await generateReport(accessToken!, timeframe)) as {
        success: boolean;
        report: { file_path: string };
      };
      if (res.success) {
        window.open(
          import.meta.env.VITE_BACKEND_URL + res.report.file_path,
          '_blank'
        );
      }
      setLoading(false);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };
  const handleGenerate30DReport = async () => {
    try {
      setLoading(true);
      const res = (await generateReport(accessToken!, '7d')) as {
        success: boolean;
        report: { file_path: string };
      };
      if (res.success) {
        window.open(
          import.meta.env.VITE_BACKEND_URL + res.report.file_path,
          '_blank'
        );
      }
      setLoading(false);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleGenerateUserReport = async () => {
    try {
      setLoading(true);
      const res = (await generateUserReport(accessToken!)) as {
        success: boolean;
        report: { file_path: string };
      };
      if (res.success) {
        window.open(
          import.meta.env.VITE_BACKEND_URL + res.report.file_path,
          '_blank'
        );
      }
      setLoading(false);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleGenerateFinanceReport = async () => {
    try {
      setLoading(true);
      const res = (await generateFinanceReport(accessToken!, timeframe)) as {
        success: boolean;
        report: { file_path: string };
      };
      if (res.success) {
        window.open(
          import.meta.env.VITE_BACKEND_URL + res.report.file_path,
          '_blank'
        );
      }
      setLoading(false);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleGenerateAdsReport = async () => {
    try {
      setLoading(true);
      const res = (await generateAdsReport(accessToken!, timeframe)) as {
        success: boolean;
        report: { file_path: string };
      };
      if (res.success) {
        window.open(
          import.meta.env.VITE_BACKEND_URL + res.report.file_path,
          '_blank'
        );
      }
      setLoading(false);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleDownloadReport = (path: string) => {
    const url = import.meta.env.VITE_BACKEND_URL + path;

    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const reportAnalysisResponse = (await getReportAnalytics(
          accessToken!,
          timeframe
        )) as KeyMetrics;
        const reportResponse = (await getReports(accessToken!)) as Report[];
        setRecentReports(reportResponse);
        setLoading(false);
        if (!reportAnalysisResponse) return;
        setAnalytics(reportAnalysisResponse);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchAnalytics();
  }, [timeframe]);

  if (loading) return <Loader />;
  return (
    <div className="p-8 bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate comprehensive reports and export data
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1yr">Last year</option>
          </select>
          <button
            onClick={handleGenerateReport}
            className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="p-6 mb-8 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Select Report Type
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-colors ${
                  selectedReport === report.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium text-center">
                  {report.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Key Metrics for Selected Report */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {currentMetrics.map((metric, index) => (
          <div
            key={index}
            className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {metric.label}
              </h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Recent Reports
            </h2>
          </div>

          <div className="space-y-4 text-center max-h-[400px] overflow-y-auto">
            {recentReports && recentReports.length > 0 ? (
              recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 transition-colors border border-gray-100 rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-left text-gray-900 dark:text-gray-100">
                        {report.report_name}
                      </h3>
                      <div className="flex items-center mt-1 space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatDate(report.generated_at)}</span>
                        <span>
                          {(report.file_size / 1024).toFixed(2) + 'KB'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadReport(report.file_path)}
                    className="flex items-center space-x-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              ))
            ) : (
              <div>No reports found</div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Quick Export Options
          </h2>
          <div className="space-y-4">
            <button
              onClick={handleGenerate30DReport}
              className="flex items-center justify-between w-full p-4 transition-colors border border-gray-200 rounded-lg dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 hover:border-blue-300 dark:hover:border-blue-600"
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    Performance Summary
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Last 30 days overview
                  </div>
                </div>
              </div>
              <Download className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </button>

            <button
              onClick={handleGenerateFinanceReport}
              className="flex items-center justify-between w-full p-4 transition-colors border border-gray-200 rounded-lg dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900 hover:border-green-300 dark:hover:border-green-600"
            >
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-300" />
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    Financial Report
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Revenue and expenses
                  </div>
                </div>
              </div>
              <Download className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </button>

            <button
              onClick={handleGenerateUserReport}
              className="flex items-center justify-between w-full p-4 transition-colors border border-gray-200 rounded-lg dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900 hover:border-purple-300 dark:hover:border-purple-600"
            >
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    User Data Export
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Complete user database
                  </div>
                </div>
              </div>
              <Download className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </button>

            <button
              onClick={handleGenerateAdsReport}
              className="flex items-center justify-between w-full p-4 transition-colors border border-gray-200 rounded-lg dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-orange-900 hover:border-orange-300 dark:hover:border-orange-600"
            >
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-orange-600 dark:text-orange-300" />
                <div className="text-left">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    Ad Analytics
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Detailed ad performance
                  </div>
                </div>
              </div>
              <Download className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="p-6 mt-8 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Scheduled Reports
          </h2>
          <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            + Add Schedule
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
            <div className="flex items-center mb-2 space-x-2">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-300" />
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Weekly Summary
              </span>
            </div>
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              Every Monday at 9:00 AM
            </p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                Active
              </span>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                Edit
              </button>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
            <div className="flex items-center mb-2 space-x-2">
              <Calendar className="w-4 h-4 text-green-600 dark:text-green-300" />
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Monthly Revenue
              </span>
            </div>
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              1st of every month at 8:00 AM
            </p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                Active
              </span>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                Edit
              </button>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-700">
            <div className="flex items-center mb-2 space-x-2">
              <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-300" />
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Quarterly Analysis
              </span>
            </div>
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              Every quarter end
            </p>
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 text-xs text-yellow-800 bg-yellow-100 rounded-full dark:bg-yellow-900 dark:text-yellow-300">
                Paused
              </span>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
