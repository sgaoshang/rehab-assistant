import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { registerRootComponent } from 'expo';
import * as Notifications from 'expo-notifications';

import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider } from './src/context/AppContext';
import { LocaleProvider } from './src/i18n';
import { requestNotificationPermission } from './src/services/notificationService';
import { speakProjectNotification } from './src/services/speechService';

function App() {
  useEffect(() => {
    // Request notification permissions on app start
    requestNotificationPermission();

    // 监听前台通知（app打开时收到通知）
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      const projectName = notification.request.content.data?.projectName as string;
      const description = notification.request.content.data?.projectDescription as string;

      if (projectName) {
        // 延迟0.5秒播报，等通知显示完成
        setTimeout(() => {
          speakProjectNotification(projectName, description);
        }, 500);
      }
    });

    // 监听通知点击（用户点击通知打开app）
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const projectName = response.notification.request.content.data?.projectName as string;
      const description = response.notification.request.content.data?.projectDescription as string;

      if (projectName) {
        // 延迟1秒播报，等app完全打开
        setTimeout(() => {
          speakProjectNotification(projectName, description);
        }, 1000);
      }
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <LocaleProvider>
      <SafeAreaProvider>
        <AppProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </AppProvider>
      </SafeAreaProvider>
    </LocaleProvider>
  );
}

export default App;
registerRootComponent(App);
