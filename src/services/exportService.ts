import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { CheckIn, FeelingType } from '../types';
import { formatDateTime, formatShortDate } from '../utils/dateHelper';

const FEELING_LABELS: Record<FeelingType, string> = {
  easy: '轻松',
  normal: '正常',
  hard: '困难',
  pain: '疼痛',
};

/**
 * 导出为 CSV 格式
 */
export const exportToCSV = async (checkins: CheckIn[]): Promise<void> => {
  try {
    // 按日期倒序排列
    const sorted = [...checkins].sort((a, b) => b.timestamp - a.timestamp);

    // 生成 CSV 内容
    let csv = '日期,训练名称,感受,备注\n';
    sorted.forEach((checkin) => {
      const date = formatDateTime(checkin.timestamp);
      const feeling = FEELING_LABELS[checkin.feeling];
      const note = checkin.note || '';
      csv += `${date},${checkin.exerciseName},${feeling},${note}\n`;
    });

    // 保存文件
    const fileName = `康复训练记录_${new Date().toISOString().split('T')[0]}.csv`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // 分享文件
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: '分享训练记录',
      });
    } else {
      throw new Error('分享功能不可用');
    }
  } catch (error) {
    console.error('Failed to export CSV:', error);
    throw error;
  }
};

/**
 * 导出为纯文本格式
 */
export const exportToText = async (checkins: CheckIn[]): Promise<void> => {
  try {
    // 按日期倒序排列
    const sorted = [...checkins].sort((a, b) => b.timestamp - a.timestamp);

    // 按日期分组
    const grouped = new Map<string, CheckIn[]>();
    sorted.forEach((checkin) => {
      const dateKey = formatShortDate(checkin.timestamp);
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(checkin);
    });

    // 生成文本内容
    let text = '康复训练记录\n';
    text += `导出时间：${formatDateTime(Date.now())}\n\n`;

    grouped.forEach((checkins, date) => {
      text += `${date}\n`;
      checkins.forEach((checkin) => {
        const time = formatDateTime(checkin.timestamp).split(' ')[1];
        const feeling = FEELING_LABELS[checkin.feeling];
        text += `  ${time} ${checkin.exerciseName} - ${feeling}\n`;
        if (checkin.note) {
          text += `    备注：${checkin.note}\n`;
        }
      });
      text += '\n';
    });

    // 保存文件
    const fileName = `康复训练记录_${new Date().toISOString().split('T')[0]}.txt`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(fileUri, text, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // 分享文件
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/plain',
        dialogTitle: '分享训练记录',
      });
    } else {
      throw new Error('分享功能不可用');
    }
  } catch (error) {
    console.error('Failed to export text:', error);
    throw error;
  }
};
