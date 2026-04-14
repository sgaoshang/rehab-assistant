import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { Platform } from 'react-native';
import { Exercise } from '../types';

// 配置通知处理器
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * 请求通知权限
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: '训练提醒',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4A90E2',
      });
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.error('Failed to request notification permission:', error);
    return false;
  }
};

/**
 * 检查通知权限状态
 */
export const checkNotificationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Failed to check notification permission:', error);
    return false;
  }
};

/**
 * 为训练调度通知
 */
export const scheduleExerciseNotifications = async (exercise: Exercise): Promise<void> => {
  if (!exercise.isEnabled || exercise.reminderTimes.length === 0) {
    return;
  }

  try {
    // 取消该训练的所有现有通知
    await cancelExerciseNotifications(exercise.id);

    // 为每个提醒时间创建通知
    for (const timeString of exercise.reminderTimes) {
      const [hours, minutes] = timeString.split(':').map(Number);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `⏰ ${timeString} 该做训练了`,
          body: `${exercise.name} - ${exercise.description.substring(0, 40) || '点击查看详情'}`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: {
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            screen: 'CheckIn',
          },
        },
        trigger: {
          type: SchedulableTriggerInputTypes.DAILY,
          hour: hours,
          minute: minutes,
        },
        identifier: `${exercise.id}_${hours}${minutes}`,
      });
    }
  } catch (error) {
    console.error('Failed to schedule notifications:', error);
    throw error;
  }
};

/**
 * 取消训练的所有通知
 */
export const cancelExerciseNotifications = async (exerciseId: string): Promise<void> => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const notificationIds = scheduledNotifications
      .filter((n) => n.identifier.startsWith(exerciseId))
      .map((n) => n.identifier);

    for (const id of notificationIds) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
  } catch (error) {
    console.error('Failed to cancel notifications:', error);
  }
};

/**
 * 取消所有通知
 */
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Failed to cancel all notifications:', error);
  }
};

/**
 * 重新调度所有启用训练的通知
 */
export const rescheduleAllNotifications = async (exercises: Exercise[]): Promise<void> => {
  try {
    await cancelAllNotifications();

    const enabledExercises = exercises.filter((ex) => ex.isEnabled);
    for (const exercise of enabledExercises) {
      await scheduleExerciseNotifications(exercise);
    }
  } catch (error) {
    console.error('Failed to reschedule all notifications:', error);
    throw error;
  }
};

/**
 * 发送测试通知
 */
export const sendTestNotification = async (): Promise<void> => {
  try {
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `⏰ ${timeString} 该做训练了`,
        body: '测试训练 - 这是一条测试通知，点击可打开应用',
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: {
          exerciseId: 'test',
          exerciseName: '测试训练',
          screen: 'CheckIn',
        },
      },
      trigger: {
        type: SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
  } catch (error) {
    console.error('Failed to send test notification:', error);
    throw error;
  }
};
