import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, subDays, isSameDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Locale } from '../i18n/types';

/**
 * 获取当天的开始时间戳（00:00:00）
 */
export const getTodayStart = (): number => {
  return startOfDay(new Date()).getTime();
};

/**
 * 获取当天的结束时间戳（23:59:59）
 */
export const getTodayEnd = (): number => {
  return endOfDay(new Date()).getTime();
};

/**
 * 获取本周的开始时间戳（周一 00:00:00）
 */
export const getWeekStart = (): number => {
  return startOfWeek(new Date(), { weekStartsOn: 1 }).getTime();
};

/**
 * 获取本周的结束时间戳（周日 23:59:59）
 */
export const getWeekEnd = (): number => {
  return endOfWeek(new Date(), { weekStartsOn: 1 }).getTime();
};

/**
 * 格式化日期为中文格式：2026年4月14日 星期一
 */
export const formatChineseDate = (date: Date): string => {
  return format(date, 'yyyy年M月d日 EEEE', { locale: zhCN });
};

/**
 * 格式化日期为英文格式：Monday, April 14, 2026
 */
export const formatEnglishDate = (date: Date): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${dayName}, ${monthName} ${day}, ${year}`;
};

/**
 * 根据语言环境格式化日期
 */
export const formatDate = (date: Date, locale: Locale): string => {
  if (locale === 'zh') {
    return formatChineseDate(date);
  } else {
    return formatEnglishDate(date);
  }
};

/**
 * 格式化时间为 HH:mm 格式
 */
export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm');
};

/**
 * 格式化日期时间为：4月14日 09:30
 */
export const formatDateTime = (timestamp: number): string => {
  return format(new Date(timestamp), 'M月d日 HH:mm');
};

/**
 * 格式化日期为：4月14日 星期一
 */
export const formatShortDate = (timestamp: number): string => {
  return format(new Date(timestamp), 'M月d日 EEEE', { locale: zhCN });
};

/**
 * 判断两个时间戳是否在同一天
 */
export const isSameDayTimestamp = (timestamp1: number, timestamp2: number): boolean => {
  return isSameDay(new Date(timestamp1), new Date(timestamp2));
};

/**
 * 获取指定天数前的日期开始时间戳
 */
export const getDaysAgoStart = (days: number): number => {
  return startOfDay(subDays(new Date(), days)).getTime();
};

/**
 * 解析时间字符串 "HH:mm" 为今天的时间戳
 */
export const parseTimeToToday = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const today = new Date();
  today.setHours(hours, minutes, 0, 0);
  return today.getTime();
};
