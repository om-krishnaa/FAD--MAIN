import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  CreditCard,
  Download,
  Edit,
  Eye,
  Filter,
  Plane,
  Search,
  Wallet,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getTransactionAnalytics } from '../actions/analytics';
import { getPayments, updatePayment } from '../actions/payments';
import { useAuth } from '../contexts/AuthContext';
import { Payment, PaymentStats } from '../types';
import { formatDate } from '../utils';
import ModalLayout from './layout/ModalLayout';
import Loader from './Loader';

interface TransactionViewProps {
  isOpen: boolean;
  onClose: () => void;
  payment?: Payment | null;
}

interface TransactionUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
}

const PaymentView = ({
  isOpen,
  onClose,
  payment: transaction,
}: TransactionViewProps) => {
  if (!transaction) return null;

  const user = transaction.user || {};

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} title="Transaction Details">
      <div className="space-y-2">
        <p>
          <span className="font-semibold">Transaction ID:</span>{' '}
          {transaction.transaction_id}
        </p>
        <p>
          <span className="font-semibold">Type:</span> {transaction.type}
        </p>
        <p>
          <span className="font-semibold">Amount:</span> Rs {transaction.amount}
        </p>
        <p>
          <span className="font-semibold">Currency:</span>{' '}
          {transaction.currency}
        </p>
        <p>
          <span className="font-semibold">Payment Method:</span>{' '}
          {transaction.payment_method}
        </p>
        <p>
          <span className="font-semibold">Status:</span>{' '}
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(
              transaction.status
            )}`}
          >
            {transaction.status.charAt(0).toUpperCase() +
              transaction.status.slice(1)}
          </span>
        </p>
      </div>

      {user && (
        <div className="space-y-2">
          <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            User Details
          </h4>
          <p>
            <span className="font-semibold">Name:</span> {user.name || 'N/A'}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user.email || 'N/A'}
          </p>
          <p>
            <span className="font-semibold">Role:</span> {user.role || 'N/A'}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Additional Details
        </h4>
        <p>
          <span className="font-semibold">Facility ID:</span>{' '}
          {transaction.facility_id ?? 'N/A'}
        </p>
        <p>
          <span className="font-semibold">Payment Reference:</span>{' '}
          {transaction.payment_reference ?? 'N/A'}
        </p>
        <p>
          <span className="font-semibold">Description:</span>{' '}
          {transaction.description ?? 'N/A'}
        </p>
        <p>
          <span className="font-semibold">Processed By:</span>{' '}
          {transaction.processed_by ?? 'N/A'}
        </p>
        <p>
          <span className="font-semibold">Processed At:</span>{' '}
          {transaction.processed_at
            ? formatDate(transaction.processed_at)
            : 'N/A'}
        </p>
        <p>
          <span className="font-semibold">Failure Reason:</span>{' '}
          {transaction.failure_reason ?? 'N/A'}
        </p>
        <p>
          <span className="font-semibold">Created At:</span>{' '}
          {formatDate(transaction.created_at)}
        </p>
        <p>
          <span className="font-semibold">Updated At:</span>{' '}
          {formatDate(transaction.updated_at)}
        </p>
      </div>
    </ModalLayout>
  );
};

const TransactionUpdateModal = ({
  isOpen,
  onClose,
  payment,
}: TransactionUpdateProps) => {
  const [formData, setFormData] = useState({
    transaction_id: '',
    type: '',
    amount: 0,
    currency: '',
    payment_method: '',
    status: '',
    description: '',
    failure_reason: '',
  });

  const { accessToken } = useAuth();

  useEffect(() => {
    if (payment) {
      setFormData({
        transaction_id: payment.transaction_id || '',
        type: payment.type || '',
        amount: Number(payment.amount) || 0,
        currency: payment.currency || 'NPR',
        payment_method: payment.payment_method || '',
        status: payment.status || 'pending',
        description: payment.description || '',
        failure_reason: payment.failure_reason || '',
      });
    }
  }, [payment]);

  if (!payment) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = (await updatePayment(payment.id.toString(), accessToken!, {
      id: payment.id,
      ...formData,
    })) as {
      success: boolean;
      message: string;
    };
    if (!res.success) return toast.error(res.message);
    toast.success(res.message);
    window.location.reload();
    onClose();
  };

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} title="Update Transaction">
      {/* Stop click propagation so modal doesn't close */}
      <div onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type */}
          <div>
            <label className="block mb-1 font-semibold text-gray-900 dark:text-gray-100">
              Transaction Id
            </label>
            <input
              type="text"
              name="transaction_id"
              value={formData.transaction_id}
              onChange={handleChange}
              className="w-full px-2 py-1 text-gray-900 bg-white border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-900 dark:text-gray-100">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-2 py-1 text-gray-900 bg-white border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="payout">Payout</option>
              <option value="revenue">Revenue</option>
              <option value="refund">Refund</option>
              <option value="bonus">Bonus</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block mb-1 font-semibold text-gray-900 dark:text-gray-100">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              disabled
              className="w-full px-2 py-1 text-gray-900 bg-white border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Currency */}
          <div>
            <label className="block mb-1 font-semibold text-gray-900 dark:text-gray-100">
              Currency
            </label>
            <input
              type="text"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              disabled
              className="w-full px-2 py-1 text-gray-900 bg-white border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block mb-1 font-semibold text-gray-900 dark:text-gray-100">
              Payment Method
            </label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              disabled
              className="w-full px-2 py-1 text-gray-900 bg-white border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="esewa">eSewa</option>
              <option value="khalti">Khalti</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="digital_wallet">Digital Wallet</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 font-semibold text-gray-900 dark:text-gray-100">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-2 py-1 text-gray-900 bg-white border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-semibold text-gray-900 dark:text-gray-100">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-2 py-1 text-gray-900 bg-white border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Failure Reason */}
          <div>
            <label className="block mb-1 font-semibold text-gray-900 dark:text-gray-100">
              Failure Reason
            </label>
            <textarea
              name="failure_reason"
              value={formData.failure_reason}
              onChange={handleChange}
              className="w-full px-2 py-1 text-gray-900 bg-white border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update Transaction
          </button>
        </form>
      </div>
    </ModalLayout>
  );
};

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [payments, setPayments] = useState<Payment[] | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const [analytics, setAnalytics] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(false);
  const { accessToken } = useAuth();

  const paymentStats = [
    {
      title: 'Total Revenue',
      value: analytics ? 'Rs ' + analytics.total_revenue : '-',
      icon: ArrowUpRight,
      color: 'green',
    },
    {
      title: 'Total Payouts',
      value: analytics ? 'Rs ' + analytics.total_payouts : '-',
      icon: ArrowDownLeft,
      color: 'blue',
    },
    {
      title: 'Pending Payouts',
      value: analytics ? analytics.pending_payouts : '-',
      icon: Clock,
      color: 'yellow',
    },
    {
      title: 'Failed Transactions',
      value: analytics ? analytics.failed_transactions : '-',
      icon: XCircle,
      color: 'red',
    },
  ];

  const filteredTransactions = payments?.filter((transaction) => {
    const matchesSearch =
      transaction.id.toString().includes(searchTerm.toLowerCase()) ||
      (transaction.user &&
        transaction.user.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus =
      filterStatus === 'all' || transaction.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowViewModal(true);
  };

  const handleUpdatePayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowUpdateModal(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const analyticsResponse = (await getTransactionAnalytics(
          accessToken!
        )) as PaymentStats;
        const paymentResponse = (await getPayments(accessToken!)) as Payment[];
        setLoading(false);
        if (!analyticsResponse || !paymentResponse) return;
        setPayments(paymentResponse);
        setAnalytics(analyticsResponse);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-8 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            Payment Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor transactions, payouts, and revenue streams
          </p>
        </div>
        <button className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {paymentStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
            >
              <div className="flex items-center space-x-8">
                <div
                  className={`p-3 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-900`}
                >
                  <Icon
                    className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-300`}
                  />
                </div>
                <div>
                  <h3 className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Methods Overview */}
      <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-4">
        {analytics &&
          [
            {
              icon: <Wallet className="w-5 h-5 text-blue-600" />,
              iconBg: 'bg-blue-50 dark:bg-blue-900',
              title: 'Esewa Payments',
              totalTransactions:
                analytics.payment_methods.esewa.total_transactions,
              successRate: analytics.payment_methods.esewa.success_rate,
              volume: 'Rs ' + analytics.payment_methods.esewa.volume,
              successColor: 'text-green-600 dark:text-green-400',
            },
            {
              icon: <Plane className="w-5 h-5 text-red-600" />,
              iconBg: 'bg-red-50 dark:bg-red-900',
              title: 'Khalti Payments',
              totalTransactions:
                analytics.payment_methods.khalti.total_transactions,
              successRate: analytics.payment_methods.khalti.success_rate,
              volume: 'Rs ' + analytics.payment_methods.khalti.volume,
              successColor: 'text-green-600 dark:text-green-400',
            },
            {
              icon: <CreditCard className="w-5 h-5 text-green-600" />,
              iconBg: 'bg-green-50 dark:bg-green-900',
              title: 'Bank Transfers',
              totalTransactions:
                analytics.payment_methods.bank_transfer.total_transactions,
              successRate: analytics.payment_methods.bank_transfer.success_rate,
              volume: 'Rs ' + analytics.payment_methods.bank_transfer.volume,
              successColor: 'text-green-600 dark:text-green-400',
            },
            {
              icon: <Wallet className="w-5 h-5 text-purple-600" />,
              iconBg: 'bg-purple-50 dark:bg-purple-900',
              title: 'Digital Wallets',
              totalTransactions:
                analytics.payment_methods.digital_wallet.total_transactions,
              successRate:
                analytics.payment_methods.digital_wallet.success_rate,
              volume: 'Rs ' + analytics.payment_methods.digital_wallet.volume,
              successColor: 'text-green-600 dark:text-green-400',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
            >
              <div className="flex items-center mb-4 space-x-3">
                <div className={`p-2 rounded-lg ${item.iconBg}`}>
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {item.title}
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Transactions
                  </span>
                  <span className="font-medium">{item.totalTransactions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Success Rate
                  </span>
                  <span className={`font-medium ${item.successColor}`}>
                    {item.successRate}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Volume
                  </span>
                  <span className="font-medium">{item.volume}</span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Filters and Search */}
      <div className="p-6 mb-8 bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="payout">Payouts</option>
                <option value="revenue">Revenue</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
              <tr>
                <th className="px-6 py-4 font-semibold text-left text-gray-900 dark:text-gray-100">
                  Transaction ID
                </th>
                <th className="px-6 py-4 font-semibold text-left text-gray-900 dark:text-gray-100">
                  Type
                </th>
                <th className="px-6 py-4 font-semibold text-left text-gray-900 dark:text-gray-100">
                  Recipient/Source
                </th>
                <th className="px-6 py-4 font-semibold text-left text-gray-900 dark:text-gray-100">
                  Amount
                </th>
                <th className="px-6 py-4 font-semibold text-left text-gray-900 dark:text-gray-100">
                  Method
                </th>
                <th className="px-6 py-4 font-semibold text-left text-gray-900 dark:text-gray-100">
                  Status
                </th>
                <th className="px-6 py-4 font-semibold text-left text-gray-900 dark:text-gray-100">
                  Date & Time
                </th>
                <th className="px-6 py-4 font-semibold text-left text-gray-900 dark:text-gray-100">
                  Actions
                </th>
              </tr>
            </thead>
            {filteredTransactions?.length ? (
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                        {transaction.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {transaction.type === 'payout' ? (
                          <ArrowDownLeft className="w-4 h-4 text-red-500" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                        )}
                        <span className="text-sm text-gray-900 capitalize dark:text-gray-100">
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 dark:text-gray-100">
                        {transaction.user.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-medium whitespace-nowrap text-green-600 dark:text-green-400`}
                      >
                        Rs {transaction.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900 dark:text-gray-100">
                        {transaction.payment_method}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            transaction.status
                          )}`}
                        >
                          {transaction.status.charAt(0).toUpperCase() +
                            transaction.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        <div>{formatDate(transaction.created_at)}</div>
                      </div>
                    </td>
                    <td className="flex px-6 py-4">
                      <button
                        onClick={() => handleViewPayment(transaction)}
                        className="p-2 text-gray-400 transition-colors rounded-lg hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-800"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUpdatePayment(transaction)}
                        className="p-2 text-gray-400 transition-colors rounded-lg hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="py-5 text-center text-gray-500 dark:text-gray-400"
                >
                  Nothing found
                </td>
              </tr>
            )}
          </table>
        </div>
      </div>

      <PaymentView
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
      />
      <TransactionUpdateModal
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
      />
    </div>
  );
};

export default Payments;
