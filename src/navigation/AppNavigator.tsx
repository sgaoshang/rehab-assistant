import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import { HomeScreen } from '../screens/HomeScreen';
import { CheckInScreen } from '../screens/CheckInScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AddExerciseScreen } from '../screens/AddExerciseScreen';
import { ManageExercisesScreen } from '../screens/ManageExercisesScreen';
import { COLORS } from '../constants/theme';

export type RootStackParamList = {
  MainTabs: undefined;
  AddExercise: undefined;
  ManageExercises: undefined;
};

export type TabParamList = {
  Home: undefined;
  CheckIn: undefined;
  History: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CheckIn') {
            iconName = focused ? 'checkbox' : 'checkbox-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: COLORS.surface,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '首页',
          headerTitle: '康复助手',
        }}
      />
      <Tab.Screen
        name="CheckIn"
        component={CheckInScreen}
        options={{
          title: '打卡',
          headerTitle: '今日打卡',
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: '历史',
          headerTitle: '训练历史',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: '设置',
          headerTitle: '设置',
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const navigationRef = useRef<any>();

  useEffect(() => {
    // 监听通知点击事件
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const exerciseId = response.notification.request.content.data?.exerciseId;

      if (exerciseId && navigationRef.current) {
        // 导航到打卡页面（不传exercise参数，让用户从列表选择）
        navigationRef.current.navigate('MainTabs', {
          screen: 'CheckIn',
        });
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.surface,
          },
          headerTintColor: COLORS.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddExercise"
          component={AddExerciseScreen}
          options={{
            title: '添加训练',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="ManageExercises"
          component={ManageExercisesScreen}
          options={{
            title: '管理训练',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
