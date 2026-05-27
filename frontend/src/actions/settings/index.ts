import {
  NotificationState,
  SecuritySettingsState,
  SettingSecurityState,
  SystemState,
} from '../../types';
import axiosInstance from '../../utils/axios.util';

export const getSettings = async (token: string) => {
  try {
    const response = await axiosInstance.get(`/setting`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSecurity = async (
  generalData: SecuritySettingsState,
  token: string
) => {
  try {
    const response = await axiosInstance.patch(
      `/setting/security`,
      generalData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateGeneral = async (generalData: FormData, token: string) => {
  try {
    const response = await axiosInstance.patch(
      `/setting/general`,
      generalData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (profileData: FormData, token: string) => {
  try {
    const response = await axiosInstance.patch(
      `/setting/profile`,
      profileData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNotificationPreferences = async (token: string) => {
  try {
    const response = await axiosInstance.get(`/setting/notification`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateNotification = async (
  notificationData: NotificationState,
  token: string
) => {
  try {
    const response = await axiosInstance.patch(
      `/setting/notification`,
      notificationData,
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

export const updateSystem = async (systemData: SystemState, token: string) => {
  try {
    const response = await axiosInstance.patch(`/setting/system`, systemData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSettingSecurity = async (
  systemData: SettingSecurityState,
  token: string
) => {
  try {
    const response = await axiosInstance.patch(
      `/setting/change-password`,
      systemData,
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
