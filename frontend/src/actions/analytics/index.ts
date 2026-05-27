import axiosInstance from '../../utils/axios.util';

export const getAnalytics = async (
  timeframe: string,

  token: string
) => {
  try {
    const response = await axiosInstance.get(`/analytics/` + timeframe, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDashboardAnalytics = async (token: string) => {
  try {
    const response = await axiosInstance.get(`/analytics/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserAnalytics = async (token: string) => {
  try {
    const response = await axiosInstance.get(`/analytics/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTransactionAnalytics = async (token: string) => {
  try {
    const response = await axiosInstance.get(`/analytics/transaction`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReports = async (token: string) => {
  try {
    const response = await axiosInstance.get(`/report/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getReportAnalytics = async (token: string, timeframe: string) => {
  try {
    const response = await axiosInstance.get(`/analytics/report/` + timeframe, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
