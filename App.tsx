import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { registerRootComponent } from 'expo';
import * as Notifications from 'expo-notifications';

import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider } from './src/context/AppContext';
import { requestNotificationPermission } from './src/services/notificationService';
import { speakExerciseNotification } from './src/services/speechService';

function App() {
  useEffect(() => {
    // Request notification permissions on app start
    requestNotificationPermission();

    // 监听前台通知（app打开时收到通知）
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      const exerciseName = notification.request.content.data?.exerciseName as string;
      const description = notification.request.content.data?.exerciseDescription as string;

      if (exerciseName) {
        // 延迟0.5秒播报，等通知显示完成
        setTimeout(() => {
          speakExerciseNotification(exerciseName, description);
        }, 500);
      }
    });

    // 监听通知点击（用户点击通知打开app）
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const exerciseName = response.notification.request.content.data?.exerciseName as string;
      const description = response.notification.request.content.data?.exerciseDescription as string;

      if (exerciseName) {
        // 延迟1秒播报，等app完全打开
        setTimeout(() => {
          speakExerciseNotification(exerciseName, description);
        }, 1000);
      }
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </AppProvider>
    </SafeAreaProvider>
  );
}

export default App;
registerRootComponent(App);
