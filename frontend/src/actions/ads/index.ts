import { ViewAdType } from '../../types';
import axiosInstance from '../../utils/axios.util';

export const getAdsList = async (token: string) => {
  try {
    const response = await axiosInstance.get(`/ads/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAds = async (token: string) => {
  try {
    const response = await axiosInstance.get(`/ads/available`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAds = async (formData: FormData, token: string) => {
  try {
    const response = await axiosInstance.post(`/ads/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createViewAd = async (viewAd: ViewAdType, token: string) => {
  try {
    const response = await axiosInstance.post(`/ads/view`, viewAd, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAds = async (
  id: number,
  formData: FormData,
  token: string
) => {
  try {
    const response = await axiosInstance.patch(`/ads/` + id, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAdStatus = async (
  id: number,
  status: string,
  token: string
) => {
  try {
    const response = await axiosInstance.patch(
      `/ads/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const updateAdTransactionStatus = async (
  id: number,
  status: string,
  approved_by: number,
  token: string
) => {
  try {
    const response = await axiosInstance.patch(
      `/ads/${id}/transaction-status`,
      { status, approved_by },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteAds = async (id: number, token: string) => {
  try {
    const response = await axiosInstance.delete(`/ads/` + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
