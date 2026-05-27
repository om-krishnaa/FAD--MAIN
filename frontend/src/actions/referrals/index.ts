import axiosInstance from '../../utils/axios.util';

export const getMyReferrals = async (token: string) => {
  try {
    const response = await axiosInstance.get(`/referral`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
