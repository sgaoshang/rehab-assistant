import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import * as Notifications from 'expo-notifications';

import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider, useApp } from './src/context/AppContext';
import { LocaleProvider, useTranslation } from './src/i18n';
import { requestNotificationPermission } from './src/services/notificationService';
import { speakProjectNotification } from './src/services/speechService';

// Component that handles notifications with access to locale
function NotificationHandler() {
  const { locale, t } = useTranslation();
  const { toggleProjectCompletion } = useApp();

  useEffect(() => {
    // Notifications are not supported on web
    if (Platform.OS === 'web') {
      return;
    }

    // 监听前台通知（app打开时收到通知）
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      const projectName = notification.request.content.data?.projectName as string;
      const description = notification.request.content.data?.projectDescription as string;
      const presetId = notification.request.content.data?.presetId as string | undefined;

      if (projectName) {
        // Get translated name if it's a preset
        const translatedName = presetId ? t(`presets.${presetId}.name`) : projectName;
        const translatedDescription = presetId ? t(`presets.${presetId}.description`) : description;

        // 延迟0.5秒播报，等通知显示完成
        setTimeout(() => {
          speakProjectNotification(translatedName, translatedDescription, locale);
        }, 500);
      }
    });

    // 监听通知点击（用户点击通知或通知操作按钮）
    const responseListener = Notifications.addNotificationResponseReceivedListener(async (response) => {
      const projectId = response.notification.request.content.data?.projectId as string;
      const projectName = response.notification.request.content.data?.projectName as string;
      const description = response.notification.request.content.data?.projectDescription as string;
      const presetId = response.notification.request.content.data?.presetId as string | undefined;
      const actionIdentifier = response.actionIdentifier;

      if (__DEV__) {
        console.log('[Notification] Action received:', actionIdentifier, 'for project:', projectId);
      }

      if (projectName) {
        // Get translated name if it's a preset
        const translatedName = presetId ? t(`presets.${presetId}.name`) : projectName;
        const translatedDescription = presetId ? t(`presets.${presetId}.description`) : description;

        // 处理不同的操作
        if (actionIdentifier === 'speak' || actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
          // 播报操作或点击通知
          const delay = actionIdentifier === 'speak' ? 500 : 1000;
          setTimeout(() => {
            speakProjectNotification(translatedName, translatedDescription, locale);
          }, delay);
        } else if (actionIdentifier === 'done') {
          // 完成操作：标记项目为已完成
          if (!projectId) {
            console.warn('[Notification] Done action received but projectId is missing');
            return;
          }

          if (__DEV__) {
            console.log('[Notification] Marking project as done:', projectId);
          }

          try {
            await toggleProjectCompletion(projectId);
            if (__DEV__) {
              console.log('[Notification] Project marked as done successfully');
            }
          } catch (error) {
            console.error('[Notification] Failed to mark project as done:', error);
            // Show error notification to user
            await Notifications.scheduleNotificationAsync({
              content: {
                title: '❌ 操作失败',
                body: '无法标记项目完成，请打开应用重试',
              },
              trigger: null, // Show immediately
            });
          }
        }
      }
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [locale, t, toggleProjectCompletion]);

  return null;
}

function App() {
  useEffect(() => {
    // Request notification permissions on app start
    requestNotificationPermission();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LocaleProvider>
        <SafeAreaProvider>
          <AppProvider>
            <NotificationHandler />
            <AppNavigator />
            <StatusBar style="auto" />
          </AppProvider>
        </SafeAreaProvider>
      </LocaleProvider>
    </GestureHandlerRootView>
  );
}

export default App;
registerRootComponent(App);
