import axiosInstance from '../../utils/axios.util';

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(`/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  ref: string | null
) => {
  try {
    const response = await axiosInstance.post(`/auth/register`, {
      name,
      email,
      password,
      ref,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyEmail = async (email: string, code: string) => {
  try {
    const response = await axiosInstance.patch(`/auth/verify-email`, {
      email,
      code,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resendVerification = async (email: string) => {
  try {
    const response = await axiosInstance.post(`/auth/resend-verification`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const requestResetPassword = async (email: string) => {
  try {
    const response = await axiosInstance.post(`/auth/request-reset`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (
  email: string,
  token: string,
  newPassword: string
) => {
  try {
    const response = await axiosInstance.post(`/auth/reset-password`, {
      email,
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
