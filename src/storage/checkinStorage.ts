import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckIn } from '../types';
import { getTodayStart, getTodayEnd, getDaysAgoStart } from '../utils/dateHelper';

const STORAGE_KEY = '@rehab_app:checkins';

/**
 * 生成 UUID
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 获取所有打卡记录
 */
export const getCheckIns = async (): Promise<CheckIn[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get check-ins:', error);
    return [];
  }
};

/**
 * 保存打卡记录列表
 */
export const saveCheckIns = async (checkins: CheckIn[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(checkins));
  } catch (error) {
    console.error('Failed to save check-ins:', error);
    throw error;
  }
};

/**
 * 添加打卡记录
 */
export const addCheckIn = async (checkin: Omit<CheckIn, 'id' | 'timestamp'>): Promise<CheckIn> => {
  try {
    const checkins = await getCheckIns();
    const newCheckIn: CheckIn = {
      ...checkin,
      id: generateId(),
      timestamp: Date.now(),
    };
    checkins.push(newCheckIn);
    await saveCheckIns(checkins);
    return newCheckIn;
  } catch (error) {
    console.error('Failed to add check-in:', error);
    throw error;
  }
};

/**
 * 获取今天的打卡记录
 */
export const getTodayCheckIns = async (): Promise<CheckIn[]> => {
  try {
    const checkins = await getCheckIns();
    const todayStart = getTodayStart();
    const todayEnd = getTodayEnd();
    return checkins.filter(
      (c) => c.timestamp >= todayStart && c.timestamp <= todayEnd
    );
  } catch (error) {
    console.error('Failed to get today check-ins:', error);
    return [];
  }
};

/**
 * 检查今天是否已打卡某个训练
 */
export const hasCheckedInToday = async (exerciseId: string): Promise<boolean> => {
  try {
    const todayCheckIns = await getTodayCheckIns();
    return todayCheckIns.some((c) => c.exerciseId === exerciseId);
  } catch (error) {
    console.error('Failed to check today check-in:', error);
    return false;
  }
};

/**
 * 获取最近N天的打卡记录
 */
export const getRecentCheckIns = async (days: number): Promise<CheckIn[]> => {
  try {
    const checkins = await getCheckIns();
    const startTime = getDaysAgoStart(days);
    return checkins
      .filter((c) => c.timestamp >= startTime)
      .sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to get recent check-ins:', error);
    return [];
  }
};

/**
 * 清空所有打卡记录
 */
export const clearAllCheckIns = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear check-ins:', error);
    throw error;
  }
};
