import axiosInstance from '../../utils/axios.util';

export const getUser = async (token: string) => {
  try {
    const response = await axiosInstance.get(`/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async (token: string) => {
  try {
    const response = await axiosInstance.get(`/user/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getBlockedUsers = async (token: string) => {
  try {
    const response = await axiosInstance.get(`/user/blocked`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changeUserStatus = async (token: string, id: number) => {
  try {
    const response = await axiosInstance.patch(
      `/user/${id}/status`,
      { status: 'active' },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const blockUser = async (
  token: string,
  id: number,
  body: {
    status: string;
    reason: string;
    blocked_by: string;
    is_permanent: boolean;
    unblock_date: null;
    notes?: string | null;
  }
) => {
  try {
    const response = await axiosInstance.patch(`/user/${id}/status`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserRole = async (
  token: string,
  id: number,
  role: 'user' | 'admin'
) => {
  try {
    const response = await axiosInstance.patch(
      `/user/${id}/role`,
      { role },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
