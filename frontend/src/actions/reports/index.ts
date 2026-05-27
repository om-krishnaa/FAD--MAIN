import axiosInstance from '../../utils/axios.util';

export const generateReport = async (token: string, timeframe: string) => {
  try {
    const response = await axiosInstance.post(
      `/report`,
      {
        timeframe,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const generateUserReport = async (token: string) => {
  try {
    const response = await axiosInstance.post(
      `/report/users`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const generateFinanceReport = async (
  token: string,
  timeframe: string
) => {
  try {
    const response = await axiosInstance.post(
      `/report/finance`,
      { timeframe },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const generateAdsReport = async (token: string, timeframe: string) => {
  try {
    const response = await axiosInstance.post(
      `/report/ads`,
      { timeframe },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
