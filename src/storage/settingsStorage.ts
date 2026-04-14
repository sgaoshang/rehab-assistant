import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings } from '../types';

const STORAGE_KEY = '@rehab_app:settings';

const DEFAULT_SETTINGS: Settings = {
  enableEarlyReminder: false,
  notificationPermissionGranted: false,
};

/**
 * 获取设置
 */
export const getSettings = async (): Promise<Settings> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Failed to get settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * 保存设置
 */
export const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw error;
  }
};

/**
 * 更新设置
 */
export const updateSettings = async (updates: Partial<Settings>): Promise<void> => {
  try {
    const settings = await getSettings();
    const newSettings = { ...settings, ...updates };
    await saveSettings(newSettings);
  } catch (error) {
    console.error('Failed to update settings:', error);
    throw error;
  }
};
