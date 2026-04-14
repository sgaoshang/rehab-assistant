import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { Platform } from 'react-native';
import { Project } from '../types';
import { TranslationFunction } from '../i18n/types';

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
 * Get translated project name and description
 */
const getTranslatedProject = (
  project: Project,
  t: TranslationFunction
): { name: string; description: string } => {
  if (project.presetId) {
    return {
      name: t(`presets.${project.presetId}.name`),
      description: t(`presets.${project.presetId}.description`),
    };
  }
  return {
    name: project.name,
    description: project.description,
  };
};

/**
 * 为训练调度通知
 */
export const scheduleProjectNotifications = async (
  project: Project,
  t: TranslationFunction
): Promise<void> => {
  if (!project.isEnabled || project.reminderTimes.length === 0) {
    return;
  }

  try {
    // 取消该训练的所有现有通知
    await cancelProjectNotifications(project.id);

    const { name, description } = getTranslatedProject(project, t);

    // 为每个提醒时间创建通知
    for (const timeString of project.reminderTimes) {
      const [hours, minutes] = timeString.split(':').map(Number);

      const notificationTitle = `⏰ ${timeString} ${t('notifications.title')}`;
      const notificationBody = t('notifications.body', { name }).substring(0, 100) ||
        (description ? description.substring(0, 100) : '');

      await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationTitle,
          body: notificationBody,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: {
            projectId: project.id,
            projectName: project.name,
            projectDescription: project.description,
            presetId: project.presetId,
          },
        },
        trigger: {
          type: SchedulableTriggerInputTypes.DAILY,
          hour: hours,
          minute: minutes,
        },
        identifier: `${project.id}_${hours}${minutes}`,
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
export const cancelProjectNotifications = async (projectId: string): Promise<void> => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const notificationIds = scheduledNotifications
      .filter((n) => n.identifier.startsWith(projectId))
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
export const rescheduleAllNotifications = async (
  projects: Project[],
  t: TranslationFunction
): Promise<void> => {
  try {
    await cancelAllNotifications();

    const enabledProjects = projects.filter((ex) => ex.isEnabled);
    for (const project of enabledProjects) {
      await scheduleProjectNotifications(project, t);
    }
  } catch (error) {
    console.error('Failed to reschedule all notifications:', error);
    throw error;
  }
};

/**
 * 发送测试通知
 */
export const sendTestNotification = async (t: TranslationFunction): Promise<void> => {
  try {
    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const testProjectName = t('notifications.title');
    const testBody = t('notifications.body', { name: testProjectName });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `⏰ ${timeString} ${t('notifications.title')}`,
        body: testBody,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: {
          projectId: 'test',
          projectName: testProjectName,
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
