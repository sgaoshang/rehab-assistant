import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { registerRootComponent } from 'expo';

import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider } from './src/context/AppContext';
import { requestNotificationPermission } from './src/services/notificationService';

function App() {
  useEffect(() => {
    // Request notification permissions on app start
    requestNotificationPermission();
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
