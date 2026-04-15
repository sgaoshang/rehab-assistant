import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import * as Notifications from 'expo-notifications';

import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider } from './src/context/AppContext';
import { LocaleProvider, useTranslation } from './src/i18n';
import { requestNotificationPermission } from './src/services/notificationService';
import { speakProjectNotification } from './src/services/speechService';

// Component that handles notifications with access to locale
function NotificationHandler() {
  const { locale, t } = useTranslation();

  useEffect(() => {
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

    // 监听通知点击（用户点击通知打开app）
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const projectName = response.notification.request.content.data?.projectName as string;
      const description = response.notification.request.content.data?.projectDescription as string;
      const presetId = response.notification.request.content.data?.presetId as string | undefined;

      if (projectName) {
        // Get translated name if it's a preset
        const translatedName = presetId ? t(`presets.${presetId}.name`) : projectName;
        const translatedDescription = presetId ? t(`presets.${presetId}.description`) : description;

        // 延迟1秒播报，等app完全打开
        setTimeout(() => {
          speakProjectNotification(translatedName, translatedDescription, locale);
        }, 1000);
      }
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [locale, t]);

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
