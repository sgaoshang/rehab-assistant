# 康复助手 APP 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个面向脑梗康复患者的 React Native 移动应用，支持训练提醒、打卡和历史记录功能。

**Architecture:** 使用 React Native + Expo 开发跨平台移动应用，通过 Context API 管理状态，AsyncStorage 存储本地数据，Expo Notifications 实现定时提醒功能。

**Tech Stack:** React Native, Expo SDK 51+, TypeScript, React Navigation 6.x, AsyncStorage, Expo Notifications, date-fns, react-native-calendars

---

## 文件结构概览

本项目将创建以下文件：

**配置文件：**
- `package.json` - 项目依赖
- `tsconfig.json` - TypeScript 配置
- `app.json` - Expo 配置
- `.gitignore` - Git 忽略文件

**源代码目录：**
- `src/types/index.ts` - TypeScript 类型定义
- `src/constants/colors.ts` - 颜色常量
- `src/constants/styles.ts` - 通用样式
- `src/constants/presetExercises.ts` - 预设训练模板
- `src/utils/dateHelper.ts` - 日期工具函数
- `src/storage/exerciseStorage.ts` - 训练数据存储
- `src/storage/checkinStorage.ts` - 打卡记录存储
- `src/storage/settingsStorage.ts` - 设置数据存储
- `src/context/AppContext.tsx` - 全局状态管理
- `src/services/notificationService.ts` - 通知服务
- `src/services/exportService.ts` - 导出服务
- `src/components/LargeButton.tsx` - 大按钮组件
- `src/components/ExerciseCard.tsx` - 训练卡片组件
- `src/components/FeelingSelector.tsx` - 感受选择器
- `src/components/StatCard.tsx` - 统计卡片
- `src/screens/HomeScreen.tsx` - 主页
- `src/screens/AddExerciseScreen.tsx` - 添加训练页面
- `src/screens/CheckInScreen.tsx` - 打卡页面
- `src/screens/HistoryScreen.tsx` - 历史记录页面
- `src/screens/SettingsScreen.tsx` - 设置页面
- `src/navigation/AppNavigator.tsx` - 导航配置
- `src/App.tsx` - 应用入口
- `App.js` - Expo 入口

---

## Task 1: 初始化 Expo 项目

**Files:**
- Create: `package.json`
- Create: `app.json`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `App.js`

- [ ] **Step 1: 初始化 Expo 项目**

```bash
npx create-expo-app@latest . --template blank-typescript
```

Expected: 创建基础 Expo TypeScript 项目

- [ ] **Step 2: 安装必要依赖**

```bash
npm install @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage expo-notifications date-fns react-native-calendars expo-sharing expo-file-system
```

Expected: 安装完成，无错误

- [ ] **Step 3: 配置 app.json**

修改 `app.json`，添加通知权限和应用配置：

```json
{
  "expo": {
    "name": "康复助手",
    "slug": "rehab-assistant",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#4A90E2"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.rehab.assistant",
      "infoPlist": {
        "UIBackgroundModes": ["remote-notification"]
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#4A90E2"
      },
      "package": "com.rehab.assistant",
      "permissions": [
        "RECEIVE_BOOT_COMPLETED",
        "VIBRATE",
        "SCHEDULE_EXACT_ALARM"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#4A90E2"
        }
      ]
    ]
  }
}
```

- [ ] **Step 4: 创建项目目录结构**

```bash
mkdir -p src/{types,constants,utils,storage,context,services,components,screens,navigation}
```

Expected: 创建所有必要的目录

- [ ] **Step 5: 创建 App.js 入口文件**

创建 `App.js`：

```javascript
import { registerRootComponent } from 'expo';
import App from './src/App';

registerRootComponent(App);
```

- [ ] **Step 6: 验证项目启动**

```bash
npx expo start
```

Expected: 开发服务器启动，显示 QR 码

- [ ] **Step 7: 提交初始化代码**

```bash
git add .
git commit -m "feat: initialize Expo project with TypeScript

- Setup React Native with Expo SDK
- Configure notification permissions
- Create project directory structure

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: 定义 TypeScript 类型和常量

**Files:**
- Create: `src/types/index.ts`
- Create: `src/constants/colors.ts`
- Create: `src/constants/styles.ts`
- Create: `src/constants/presetExercises.ts`

- [ ] **Step 1: 创建类型定义文件**

创建 `src/types/index.ts`：

```typescript
export type FeelingType = 'easy' | 'normal' | 'hard' | 'pain';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  isPreset: boolean;
  isEnabled: boolean;
  reminderTimes: string[];
  createdAt: number;
}

export interface CheckIn {
  id: string;
  exerciseId: string;
  exerciseName: string;
  timestamp: number;
  feeling: FeelingType;
  note?: string;
}

export interface Settings {
  enableEarlyReminder: boolean;
  notificationPermissionGranted: boolean;
}

export interface AppState {
  exercises: Exercise[];
  checkins: CheckIn[];
  settings: Settings;
  initialized: boolean;
}
```

- [ ] **Step 2: 创建颜色常量**

创建 `src/constants/colors.ts`：

```typescript
export const Colors = {
  // 主色调
  primary: '#4A90E2',
  primaryDark: '#2E5C8A',
  
  // 状态色
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  neutral: '#9E9E9E',
  
  // 感受色
  feelingEasy: '#4CAF50',
  feelingNormal: '#2196F3',
  feelingHard: '#FFC107',
  feelingPain: '#F44336',
  
  // 背景色
  background: '#F5F5F5',
  cardBackground: '#FFFFFF',
  
  // 文字色
  textPrimary: '#333333',
  textSecondary: '#666666',
  textDisabled: '#999999',
  
  // 边框色
  border: '#E0E0E0',
};
```

- [ ] **Step 3: 创建通用样式**

创建 `src/constants/styles.ts`：

```typescript
import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const CommonStyles = StyleSheet.create({
  largeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 20,
    color: Colors.textSecondary,
  },
  smallBody: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  largeButton: {
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenPadding: {
    padding: 16,
  },
});
```

- [ ] **Step 4: 创建预设训练模板**

创建 `src/constants/presetExercises.ts`：

```typescript
import { Exercise } from '../types';

export const PRESET_EXERCISES: Omit<Exercise, 'id' | 'createdAt' | 'isEnabled' | 'reminderTimes'>[] = [
  {
    name: '握拳练习',
    description: '慢慢握紧拳头，保持5秒，然后放松。每次重复10-15次',
    isPreset: true,
  },
  {
    name: '手指伸展',
    description: '将手指尽量张开，保持5秒后放松。每次重复10次',
    isPreset: true,
  },
  {
    name: '抬臂运动',
    description: '慢慢将手臂向前抬高，尽量到肩膀高度。每侧重复8-10次',
    isPreset: true,
  },
  {
    name: '肩关节旋转',
    description: '缓慢转动肩膀，画圆圈。顺时针和逆时针各10次',
    isPreset: true,
  },
  {
    name: '踝关节运动',
    description: '坐姿，脚尖向上勾，再向下压。每侧重复15次',
    isPreset: true,
  },
  {
    name: '膝关节屈伸',
    description: '坐姿，慢慢伸直腿，再弯曲。每侧重复10次',
    isPreset: true,
  },
  {
    name: '原地踏步',
    description: '扶稳椅背，原地缓慢踏步。持续3-5分钟',
    isPreset: true,
  },
  {
    name: '颈部转动',
    description: '慢慢左右转头，不要用力过猛。每侧重复8次',
    isPreset: true,
  },
  {
    name: '深呼吸练习',
    description: '深吸气5秒，慢慢呼出5秒。重复10次',
    isPreset: true,
  },
  {
    name: '平衡训练',
    description: '扶稳物体，单脚站立保持10秒。每侧重复5次',
    isPreset: true,
  },
];
```

- [ ] **Step 5: 验证类型定义**

```bash
npx tsc --noEmit
```

Expected: 无类型错误

- [ ] **Step 6: 提交类型和常量定义**

```bash
git add src/types src/constants
git commit -m "feat: add TypeScript types and constants

- Define Exercise, CheckIn, Settings interfaces
- Add color scheme for elderly-friendly UI
- Create common styles for consistent design
- Define 10 preset rehabilitation exercises

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: 实现工具函数

**Files:**
- Create: `src/utils/dateHelper.ts`

- [ ] **Step 1: 创建日期工具函数**

创建 `src/utils/dateHelper.ts`：

```typescript
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, subDays, isSameDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';

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
```

- [ ] **Step 2: 验证工具函数**

```bash
npx tsc --noEmit
```

Expected: 无类型错误

- [ ] **Step 3: 提交工具函数**

```bash
git add src/utils
git commit -m "feat: add date helper utilities

- Implement Chinese date formatting
- Add day/week range calculations
- Create time parsing functions

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: 实现数据存储层

**Files:**
- Create: `src/storage/exerciseStorage.ts`
- Create: `src/storage/checkinStorage.ts`
- Create: `src/storage/settingsStorage.ts`

- [ ] **Step 1: 创建训练数据存储**

创建 `src/storage/exerciseStorage.ts`：

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise } from '../types';
import { PRESET_EXERCISES } from '../constants/presetExercises';

const STORAGE_KEY = '@rehab_app:exercises';
const INIT_KEY = '@rehab_app:initialized';

/**
 * 生成 UUID
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 初始化预设训练
 */
export const initializePresetExercises = async (): Promise<void> => {
  try {
    const initialized = await AsyncStorage.getItem(INIT_KEY);
    if (initialized === 'true') {
      return;
    }

    const exercises: Exercise[] = PRESET_EXERCISES.map((preset) => ({
      ...preset,
      id: generateId(),
      isEnabled: false,
      reminderTimes: [],
      createdAt: Date.now(),
    }));

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
    await AsyncStorage.setItem(INIT_KEY, 'true');
  } catch (error) {
    console.error('Failed to initialize preset exercises:', error);
    throw error;
  }
};

/**
 * 获取所有训练
 */
export const getExercises = async (): Promise<Exercise[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get exercises:', error);
    return [];
  }
};

/**
 * 保存训练列表
 */
export const saveExercises = async (exercises: Exercise[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
  } catch (error) {
    console.error('Failed to save exercises:', error);
    throw error;
  }
};

/**
 * 添加训练
 */
export const addExercise = async (exercise: Omit<Exercise, 'id' | 'createdAt'>): Promise<Exercise> => {
  try {
    const exercises = await getExercises();
    const newExercise: Exercise = {
      ...exercise,
      id: generateId(),
      createdAt: Date.now(),
    };
    exercises.push(newExercise);
    await saveExercises(exercises);
    return newExercise;
  } catch (error) {
    console.error('Failed to add exercise:', error);
    throw error;
  }
};

/**
 * 更新训练
 */
export const updateExercise = async (id: string, updates: Partial<Exercise>): Promise<void> => {
  try {
    const exercises = await getExercises();
    const index = exercises.findIndex((ex) => ex.id === id);
    if (index !== -1) {
      exercises[index] = { ...exercises[index], ...updates };
      await saveExercises(exercises);
    }
  } catch (error) {
    console.error('Failed to update exercise:', error);
    throw error;
  }
};

/**
 * 删除训练
 */
export const deleteExercise = async (id: string): Promise<void> => {
  try {
    const exercises = await getExercises();
    const filtered = exercises.filter((ex) => ex.id !== id);
    await saveExercises(filtered);
  } catch (error) {
    console.error('Failed to delete exercise:', error);
    throw error;
  }
};

/**
 * 获取启用的训练
 */
export const getEnabledExercises = async (): Promise<Exercise[]> => {
  try {
    const exercises = await getExercises();
    return exercises.filter((ex) => ex.isEnabled);
  } catch (error) {
    console.error('Failed to get enabled exercises:', error);
    return [];
  }
};
```

- [ ] **Step 2: 创建打卡记录存储**

创建 `src/storage/checkinStorage.ts`：

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckIn } from '../types';
import { getTodayStart, getTodayEnd, getDaysAgoStart } from '../utils/dateHelper';

const STORAGE_KEY = '@rehab_app:checkins';

/**
 * 生成 UUID
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 获取所有打卡记录
 */
export const getCheckIns = async (): Promise<CheckIn[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get check-ins:', error);
    return [];
  }
};

/**
 * 保存打卡记录列表
 */
export const saveCheckIns = async (checkins: CheckIn[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(checkins));
  } catch (error) {
    console.error('Failed to save check-ins:', error);
    throw error;
  }
};

/**
 * 添加打卡记录
 */
export const addCheckIn = async (checkin: Omit<CheckIn, 'id' | 'timestamp'>): Promise<CheckIn> => {
  try {
    const checkins = await getCheckIns();
    const newCheckIn: CheckIn = {
      ...checkin,
      id: generateId(),
      timestamp: Date.now(),
    };
    checkins.push(newCheckIn);
    await saveCheckIns(checkins);
    return newCheckIn;
  } catch (error) {
    console.error('Failed to add check-in:', error);
    throw error;
  }
};

/**
 * 获取今天的打卡记录
 */
export const getTodayCheckIns = async (): Promise<CheckIn[]> => {
  try {
    const checkins = await getCheckIns();
    const todayStart = getTodayStart();
    const todayEnd = getTodayEnd();
    return checkins.filter(
      (c) => c.timestamp >= todayStart && c.timestamp <= todayEnd
    );
  } catch (error) {
    console.error('Failed to get today check-ins:', error);
    return [];
  }
};

/**
 * 检查今天是否已打卡某个训练
 */
export const hasCheckedInToday = async (exerciseId: string): Promise<boolean> => {
  try {
    const todayCheckIns = await getTodayCheckIns();
    return todayCheckIns.some((c) => c.exerciseId === exerciseId);
  } catch (error) {
    console.error('Failed to check today check-in:', error);
    return false;
  }
};

/**
 * 获取最近N天的打卡记录
 */
export const getRecentCheckIns = async (days: number): Promise<CheckIn[]> => {
  try {
    const checkins = await getCheckIns();
    const startTime = getDaysAgoStart(days);
    return checkins
      .filter((c) => c.timestamp >= startTime)
      .sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Failed to get recent check-ins:', error);
    return [];
  }
};

/**
 * 清空所有打卡记录
 */
export const clearAllCheckIns = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear check-ins:', error);
    throw error;
  }
};
```

- [ ] **Step 3: 创建设置数据存储**

创建 `src/storage/settingsStorage.ts`：

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings } from '../types';

const STORAGE_KEY = '@rehab_app:settings';

const DEFAULT_SETTINGS: Settings = {
  enableEarlyReminder: false,
  notificationPermissionGranted: false,
};

/**
 * 获取设置
 */
export const getSettings = async (): Promise<Settings> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Failed to get settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * 保存设置
 */
export const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw error;
  }
};

/**
 * 更新设置
 */
export const updateSettings = async (updates: Partial<Settings>): Promise<void> => {
  try {
    const settings = await getSettings();
    const newSettings = { ...settings, ...updates };
    await saveSettings(newSettings);
  } catch (error) {
    console.error('Failed to update settings:', error);
    throw error;
  }
};
```

- [ ] **Step 4: 验证存储层**

```bash
npx tsc --noEmit
```

Expected: 无类型错误

- [ ] **Step 5: 提交存储层代码**

```bash
git add src/storage
git commit -m "feat: implement storage layer

- Add exercise storage with CRUD operations
- Implement check-in storage with today/recent queries
- Create settings storage with defaults
- Use AsyncStorage for local persistence

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: 实现通知服务

**Files:**
- Create: `src/services/notificationService.ts`

- [ ] **Step 1: 创建通知服务**

创建 `src/services/notificationService.ts`：

```typescript
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Exercise } from '../types';

// 配置通知处理器
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
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
          title: '该做训练了',
          body: exercise.name,
          subtitle: exercise.description.substring(0, 30),
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: {
            exerciseId: exercise.id,
            exerciseName: exercise.name,
          },
        },
        trigger: {
          hour: hours,
          minute: minutes,
          repeats: true,
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
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '测试通知',
        body: '通知功能正常！',
        sound: true,
      },
      trigger: {
        seconds: 2,
      },
    });
  } catch (error) {
    console.error('Failed to send test notification:', error);
    throw error;
  }
};
```

- [ ] **Step 2: 验证通知服务**

```bash
npx tsc --noEmit
```

Expected: 无类型错误

- [ ] **Step 3: 提交通知服务**

```bash
git add src/services/notificationService.ts
git commit -m "feat: implement notification service

- Add notification permission request
- Implement daily recurring notifications
- Support multiple reminders per exercise
- Add cancel and reschedule functions

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: 实现导出服务

**Files:**
- Create: `src/services/exportService.ts`

- [ ] **Step 1: 创建导出服务**

创建 `src/services/exportService.ts`：

```typescript
import * as FileSystem from 'expo-file-system';
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
```

- [ ] **Step 2: 验证导出服务**

```bash
npx tsc --noEmit
```

Expected: 无类型错误

- [ ] **Step 3: 提交导出服务**

```bash
git add src/services/exportService.ts
git commit -m "feat: implement export service

- Add CSV export with date/exercise/feeling/note
- Implement text export with grouped by date
- Support sharing via system share sheet

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: 实现全局状态管理

**Files:**
- Create: `src/context/AppContext.tsx`

- [ ] **Step 1: 创建 AppContext**

创建 `src/context/AppContext.tsx`：

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Exercise, CheckIn, Settings } from '../types';
import { getExercises, saveExercises, initializePresetExercises } from '../storage/exerciseStorage';
import { getCheckIns, addCheckIn as addCheckInStorage, hasCheckedInToday } from '../storage/checkinStorage';
import { getSettings, saveSettings } from '../storage/settingsStorage';
import { scheduleExerciseNotifications, cancelExerciseNotifications, rescheduleAllNotifications } from '../services/notificationService';

interface AppContextType {
  state: AppState;
  loading: boolean;
  refreshExercises: () => Promise<void>;
  refreshCheckIns: () => Promise<void>;
  addExercise: (exercise: Omit<Exercise, 'id' | 'createdAt'>) => Promise<void>;
  updateExercise: (id: string, updates: Partial<Exercise>) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
  toggleExerciseEnabled: (id: string) => Promise<void>;
  addCheckIn: (checkin: Omit<CheckIn, 'id' | 'timestamp'>) => Promise<void>;
  isCheckedInToday: (exerciseId: string) => boolean;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    exercises: [],
    checkins: [],
    settings: {
      enableEarlyReminder: false,
      notificationPermissionGranted: false,
    },
    initialized: false,
  });
  const [loading, setLoading] = useState(true);

  // 初始化数据
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializePresetExercises();
        const exercises = await getExercises();
        const checkins = await getCheckIns();
        const settings = await getSettings();
        
        setState({
          exercises,
          checkins,
          settings,
          initialized: true,
        });
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const refreshExercises = async () => {
    const exercises = await getExercises();
    setState((prev) => ({ ...prev, exercises }));
  };

  const refreshCheckIns = async () => {
    const checkins = await getCheckIns();
    setState((prev) => ({ ...prev, checkins }));
  };

  const addExercise = async (exercise: Omit<Exercise, 'id' | 'createdAt'>) => {
    const exercises = [...state.exercises];
    const newExercise: Exercise = {
      ...exercise,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
    };
    exercises.push(newExercise);
    await saveExercises(exercises);
    setState((prev) => ({ ...prev, exercises }));
    
    if (newExercise.isEnabled) {
      await scheduleExerciseNotifications(newExercise);
    }
  };

  const updateExercise = async (id: string, updates: Partial<Exercise>) => {
    const exercises = [...state.exercises];
    const index = exercises.findIndex((ex) => ex.id === id);
    if (index !== -1) {
      const oldExercise = exercises[index];
      exercises[index] = { ...oldExercise, ...updates };
      await saveExercises(exercises);
      setState((prev) => ({ ...prev, exercises }));
      
      // 重新调度通知
      if (exercises[index].isEnabled) {
        await scheduleExerciseNotifications(exercises[index]);
      } else {
        await cancelExerciseNotifications(id);
      }
    }
  };

  const deleteExercise = async (id: string) => {
    await cancelExerciseNotifications(id);
    const exercises = state.exercises.filter((ex) => ex.id !== id);
    await saveExercises(exercises);
    setState((prev) => ({ ...prev, exercises }));
  };

  const toggleExerciseEnabled = async (id: string) => {
    const exercise = state.exercises.find((ex) => ex.id === id);
    if (exercise) {
      await updateExercise(id, { isEnabled: !exercise.isEnabled });
    }
  };

  const addCheckIn = async (checkin: Omit<CheckIn, 'id' | 'timestamp'>) => {
    const newCheckIn = await addCheckInStorage(checkin);
    setState((prev) => ({
      ...prev,
      checkins: [...prev.checkins, newCheckIn],
    }));
  };

  const isCheckedInToday = (exerciseId: string): boolean => {
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const todayEnd = new Date().setHours(23, 59, 59, 999);
    return state.checkins.some(
      (c) => c.exerciseId === exerciseId && c.timestamp >= todayStart && c.timestamp <= todayEnd
    );
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    const newSettings = { ...state.settings, ...updates };
    await saveSettings(newSettings);
    setState((prev) => ({ ...prev, settings: newSettings }));
  };

  const value: AppContextType = {
    state,
    loading,
    refreshExercises,
    refreshCheckIns,
    addExercise,
    updateExercise,
    deleteExercise,
    toggleExerciseEnabled,
    addCheckIn,
    isCheckedInToday,
    updateSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
```

- [ ] **Step 2: 验证 Context**

```bash
npx tsc --noEmit
```

Expected: 无类型错误

- [ ] **Step 3: 提交 Context**

```bash
git add src/context
git commit -m "feat: implement global state management

- Create AppContext with exercises/checkins/settings
- Add CRUD operations for exercises and check-ins
- Integrate notification scheduling with state updates
- Implement today's check-in status tracking

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 8: 实现基础 UI 组件

**Files:**
- Create: `src/components/LargeButton.tsx`
- Create: `src/components/ExerciseCard.tsx`
- Create: `src/components/FeelingSelector.tsx`

- [ ] **Step 1: 创建大按钮组件**

创建 `src/components/LargeButton.tsx`：

```typescript
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';

interface LargeButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const LargeButton: React.FC<LargeButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return Colors.neutral;
    switch (variant) {
      case 'primary':
        return Colors.primary;
      case 'secondary':
        return Colors.cardBackground;
      case 'danger':
        return Colors.error;
      default:
        return Colors.primary;
    }
  };

  const getTextColor = () => {
    if (variant === 'secondary') {
      return Colors.textPrimary;
    }
    return '#FFFFFF';
  };

  return (
    <TouchableOpacity
      style={[
        CommonStyles.largeButton,
        { backgroundColor: getBackgroundColor() },
        variant === 'secondary' && styles.secondaryBorder,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
  secondaryBorder: {
    borderWidth: 2,
    borderColor: Colors.border,
  },
});
```

- [ ] **Step 2: 创建训练卡片组件**

创建 `src/components/ExerciseCard.tsx`：

```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Exercise } from '../types';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';

interface ExerciseCardProps {
  exercise: Exercise;
  isCompleted: boolean;
  onPress: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, isCompleted, onPress }) => {
  const truncateDescription = (text: string, maxLength: number = 30) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <TouchableOpacity style={CommonStyles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.row}>
        <View style={styles.content}>
          <Text style={CommonStyles.title}>{exercise.name}</Text>
          <Text style={[CommonStyles.smallBody, styles.description]}>
            {truncateDescription(exercise.description)}
          </Text>
          {exercise.reminderTimes.length > 0 && (
            <Text style={styles.reminderText}>
              ⏰ {exercise.reminderTimes.join(', ')}
            </Text>
          )}
        </View>
        <View style={styles.status}>
          {isCompleted ? (
            <Text style={styles.checkmark}>✓</Text>
          ) : (
            <View style={styles.emptyCircle} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginRight: 16,
  },
  description: {
    marginTop: 4,
  },
  reminderText: {
    fontSize: 16,
    color: Colors.primary,
    marginTop: 8,
  },
  status: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 36,
    color: Colors.success,
    fontWeight: 'bold',
  },
  emptyCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: Colors.neutral,
  },
});
```

- [ ] **Step 3: 创建感受选择器组件**

创建 `src/components/FeelingSelector.tsx`：

```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FeelingType } from '../types';
import { Colors } from '../constants/colors';

interface FeelingSelectorProps {
  selectedFeeling: FeelingType | null;
  onSelect: (feeling: FeelingType) => void;
}

const FEELINGS: { type: FeelingType; emoji: string; label: string; color: string }[] = [
  { type: 'easy', emoji: '😊', label: '轻松', color: Colors.feelingEasy },
  { type: 'normal', emoji: '🙂', label: '正常', color: Colors.feelingNormal },
  { type: 'hard', emoji: '😕', label: '困难', color: Colors.feelingHard },
  { type: 'pain', emoji: '😣', label: '疼痛', color: Colors.feelingPain },
];

export const FeelingSelector: React.FC<FeelingSelectorProps> = ({ selectedFeeling, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>选择您的感受：</Text>
      <View style={styles.grid}>
        {FEELINGS.map((feeling) => {
          const isSelected = selectedFeeling === feeling.type;
          return (
            <TouchableOpacity
              key={feeling.type}
              style={[
                styles.button,
                isSelected && { backgroundColor: feeling.color, borderColor: feeling.color },
              ]}
              onPress={() => onSelect(feeling.type)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{feeling.emoji}</Text>
              <Text style={[styles.label, isSelected && styles.selectedLabel]}>
                {feeling.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 16,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  label: {
    fontSize: 20,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  selectedLabel: {
    color: '#FFFFFF',
  },
});
```

- [ ] **Step 4: 验证组件**

```bash
npx tsc --noEmit
```

Expected: 无类型错误

- [ ] **Step 5: 提交 UI 组件**

```bash
git add src/components/LargeButton.tsx src/components/ExerciseCard.tsx src/components/FeelingSelector.tsx
git commit -m "feat: implement basic UI components

- Add LargeButton with primary/secondary/danger variants
- Create ExerciseCard with completion status
- Implement FeelingSelector with 4 feeling options
- Use elderly-friendly large fonts and buttons

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 9: 实现主页

**Files:**
- Create: `src/screens/HomeScreen.tsx`

- [ ] **Step 1: 创建主页组件**

创建 `src/screens/HomeScreen.tsx`：

```typescript
import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { ExerciseCard } from '../components/ExerciseCard';
import { LargeButton } from '../components/LargeButton';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';
import { formatChineseDate } from '../utils/dateHelper';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { state, loading, refreshExercises, refreshCheckIns, isCheckedInToday } = useApp();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshExercises(), refreshCheckIns()]);
    setRefreshing(false);
  };

  const enabledExercises = state.exercises.filter((ex) => ex.isEnabled);
  const totalExercises = enabledExercises.length;
  const completedCount = enabledExercises.filter((ex) => isCheckedInToday(ex.id)).length;

  const getGreeting = () => {
    if (completedCount === 0) {
      return `您好！今天要完成${totalExercises}项训练`;
    } else if (completedCount === totalExercises && totalExercises > 0) {
      return '太棒了！今天的训练全部完成！';
    } else {
      return `已完成${completedCount}项，还有${totalExercises - completedCount}项`;
    }
  };

  return (
    <View style={CommonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={CommonStyles.title}>{formatChineseDate(new Date())}</Text>
          <Text style={[CommonStyles.body, styles.greeting]}>{getGreeting()}</Text>
        </View>

        {enabledExercises.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[CommonStyles.body, styles.emptyText]}>
              还没有启用的训练项目
            </Text>
            <Text style={[CommonStyles.smallBody, styles.emptyHint]}>
              点击下方按钮添加训练
            </Text>
          </View>
        ) : (
          enabledExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              isCompleted={isCheckedInToday(exercise.id)}
              onPress={() => navigation.navigate('CheckIn' as never, { exercise } as never)}
            />
          ))
        )}

        <LargeButton
          title="+ 添加训练"
          onPress={() => navigation.navigate('AddExercise' as never)}
          variant="secondary"
          style={styles.addButton}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyHint: {
    textAlign: 'center',
    color: Colors.textDisabled,
  },
  addButton: {
    marginTop: 24,
  },
});
```

- [ ] **Step 2: 验证主页**

```bash
npx tsc --noEmit
```

Expected: 无类型错误

- [ ] **Step 3: 提交主页**

```bash
git add src/screens/HomeScreen.tsx
git commit -m "feat: implement home screen

- Display today's date and greeting
- Show enabled exercises with completion status
- Add pull-to-refresh functionality
- Navigate to check-in screen on card tap

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 10: 实现打卡页面

**Files:**
- Create: `src/screens/CheckInScreen.tsx`

- [ ] **Step 1: 创建打卡页面**

创建 `src/screens/CheckInScreen.tsx`：

```typescript
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { FeelingSelector } from '../components/FeelingSelector';
import { LargeButton } from '../components/LargeButton';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';
import { FeelingType, Exercise } from '../types';

const ENCOURAGEMENTS = [
  '太棒了！坚持就是胜利！',
  '您真棒！继续加油！',
  '做得好！明天继续哦！',
  '真不错！保持下去！',
  '很棒！一天比一天好！',
];

export const CheckInScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { addCheckIn } = useApp();
  
  const exercise = (route.params as { exercise: Exercise }).exercise;
  
  const [selectedFeeling, setSelectedFeeling] = useState<FeelingType | null>(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedFeeling) {
      Alert.alert('提示', '请选择您的感受');
      return;
    }

    setSubmitting(true);
    try {
      await addCheckIn({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        feeling: selectedFeeling,
        note: note.trim() || undefined,
      });

      const encouragement = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
      Alert.alert('完成！', encouragement, [
        {
          text: '确定',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('错误', '打卡失败，请重试');
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={CommonStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={CommonStyles.largeTitle}>{exercise.name}</Text>
        <Text style={[CommonStyles.body, styles.description]}>{exercise.description}</Text>

        <FeelingSelector selectedFeeling={selectedFeeling} onSelect={setSelectedFeeling} />

        <View style={styles.noteContainer}>
          <Text style={styles.noteLabel}>备注（选填）</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="可以记录一些感受..."
            placeholderTextColor={Colors.textDisabled}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            maxLength={200}
            textAlignVertical="top"
          />
        </View>

        <LargeButton
          title="✓ 完成打卡"
          onPress={handleSubmit}
          loading={submitting}
          disabled={!selectedFeeling}
          style={styles.submitButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  description: {
    marginTop: 12,
    marginBottom: 24,
  },
  noteContainer: {
    marginTop: 8,
  },
  noteLabel: {
    fontSize: 20,
    color: Colors.textPrimary,
    marginBottom: 8,
    fontWeight: '600',
  },
  noteInput: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    fontSize: 18,
    color: Colors.textPrimary,
    minHeight: 100,
  },
  submitButton: {
    marginTop: 32,
  },
});
```

- [ ] **Step 2: 验证打卡页面**

```bash
npx tsc --noEmit
```

Expected: 无类型错误

- [ ] **Step 3: 提交打卡页面**

```bash
git add src/screens/CheckInScreen.tsx
git commit -m "feat: implement check-in screen

- Display exercise name and description
- Add feeling selector with 4 options
- Support optional note input
- Show random encouragement after completion

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 11: 实现添加训练页面

**Files:**
- Create: `src/screens/AddExerciseScreen.tsx`

- [ ] **Step 1: 创建添加训练页面**

创建 `src/screens/AddExerciseScreen.tsx`：

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useApp } from '../context/AppContext';
import { LargeButton } from '../components/LargeButton';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';
import { PRESET_EXERCISES } from '../constants/presetExercises';
import { formatTime } from '../utils/dateHelper';

type Mode = 'select' | 'preset' | 'custom';

export const AddExerciseScreen: React.FC = () => {
  const navigation = useNavigation();
  const { addExercise } = useApp();

  const [mode, setMode] = useState<Mode>('select');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [reminderTimes, setReminderTimes] = useState<string[]>([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState(new Date());
  const [submitting, setSubmitting] = useState(false);

  const handleSelectPreset = (preset: typeof PRESET_EXERCISES[0]) => {
    setName(preset.name);
    setDescription(preset.description);
    setMode('custom');
  };

  const handleAddTime = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const timeString = formatTime(selectedDate);
      if (!reminderTimes.includes(timeString)) {
        setReminderTimes([...reminderTimes, timeString].sort());
      }
    }
  };

  const handleRemoveTime = (time: string) => {
    setReminderTimes(reminderTimes.filter((t) => t !== time));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('提示', '请输入训练名称');
      return;
    }

    if (name.length > 20) {
      Alert.alert('提示', '训练名称不能超过20个字');
      return;
    }

    if (description.length > 100) {
      Alert.alert('提示', '训练说明不能超过100个字');
      return;
    }

    setSubmitting(true);
    try {
      await addExercise({
        name: name.trim(),
        description: description.trim(),
        isPreset: false,
        isEnabled: reminderTimes.length > 0,
        reminderTimes,
      });

      Alert.alert('成功', '训练已添加', [
        {
          text: '确定',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('错误', '添加失败，请重试');
      setSubmitting(false);
    }
  };

  if (mode === 'select') {
    return (
      <View style={CommonStyles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <LargeButton
            title="选择预设训练"
            onPress={() => setMode('preset')}
            variant="primary"
            style={styles.modeButton}
          />
          <LargeButton
            title="自定义训练"
            onPress={() => setMode('custom')}
            variant="secondary"
            style={styles.modeButton}
          />
        </ScrollView>
      </View>
    );
  }

  if (mode === 'preset') {
    return (
      <View style={CommonStyles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          <Text style={CommonStyles.title}>选择预设训练</Text>

          {PRESET_EXERCISES.map((preset, index) => (
            <TouchableOpacity
              key={index}
              style={styles.presetCard}
              onPress={() => handleSelectPreset(preset)}
              activeOpacity={0.7}
            >
              <Text style={styles.presetName}>{preset.name}</Text>
              <Text style={styles.presetDescription}>{preset.description}</Text>
            </TouchableOpacity>
          ))}

          <LargeButton
            title="返回"
            onPress={() => setMode('select')}
            variant="secondary"
            style={styles.backButton}
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={CommonStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={CommonStyles.title}>训练信息</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>训练名称 *</Text>
          <TextInput
            style={styles.input}
            placeholder="例如：握拳练习"
            placeholderTextColor={Colors.textDisabled}
            value={name}
            onChangeText={setName}
            maxLength={20}
          />
          <Text style={styles.hint}>{name.length}/20</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>训练说明</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="详细说明训练方法和次数"
            placeholderTextColor={Colors.textDisabled}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            maxLength={100}
            textAlignVertical="top"
          />
          <Text style={styles.hint}>{description.length}/100</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>提醒时间</Text>
          {reminderTimes.map((time) => (
            <View key={time} style={styles.timeItem}>
              <Text style={styles.timeText}>{time}</Text>
              <TouchableOpacity onPress={() => handleRemoveTime(time)}>
                <Text style={styles.removeButton}>删除</Text>
              </TouchableOpacity>
            </View>
          ))}
          <LargeButton
            title="+ 添加提醒时间"
            onPress={() => setShowTimePicker(true)}
            variant="secondary"
            style={styles.addTimeButton}
          />
        </View>

        {showTimePicker && (
          <DateTimePicker
            value={tempTime}
            mode="time"
            is24Hour={true}
            display="spinner"
            onChange={handleAddTime}
          />
        )}

        <LargeButton
          title="保存训练"
          onPress={handleSubmit}
          loading={submitting}
          style={styles.submitButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  modeButton: {
    marginBottom: 16,
  },
  presetCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  presetDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  backButton: {
    marginTop: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  textArea: {
    minHeight: 100,
  },
  hint: {
    fontSize: 14,
    color: Colors.textDisabled,
    marginTop: 4,
    textAlign: 'right',
  },
  timeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeText: {
    fontSize: 18,
    color: Colors.textPrimary,
  },
  removeButton: {
    fontSize: 16,
    color: Colors.error,
  },
  addTimeButton: {
    marginTop: 8,
  },
  submitButton: {
    marginTop: 16,
  },
});
```

- [ ] **Step 2: 安装时间选择器依赖**

```bash
npx expo install @react-native-community/datetimepicker
```

Expected: 安装成功

- [ ] **Step 3: 验证添加训练页面**

```bash
npx tsc --noEmit
```

Expected: 无类型错误

- [ ] **Step 4: 提交添加训练页面**

```bash
git add src/screens/AddExerciseScreen.tsx package.json
git commit -m "feat: implement add exercise screen

- Add mode selection (preset vs custom)
- Display 10 preset exercises with descriptions
- Support custom exercise with name/description
- Implement time picker for multiple reminders
- Auto-enable exercise when reminders are set

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 12: 实现历史记录和设置页面

**Files:**
- Create: `src/components/StatCard.tsx`
- Create: `src/screens/HistoryScreen.tsx`
- Create: `src/screens/SettingsScreen.tsx`

- [ ] **Step 1: 创建统计卡片组件**

创建 `src/components/StatCard.tsx`：

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';

interface StatCardProps {
  label: string;
  value: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});
```

- [ ] **Step 2: 创建历史记录页面**

创建 `src/screens/HistoryScreen.tsx`：

```typescript
import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/StatCard';
import { LargeButton } from '../components/LargeButton';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';
import { formatShortDate, formatDateTime, getWeekStart, getWeekEnd, isSameDayTimestamp } from '../utils/dateHelper';
import { exportToCSV, exportToText } from '../services/exportService';
import { CheckIn, FeelingType } from '../types';

const FEELING_EMOJIS: Record<FeelingType, string> = {
  easy: '😊',
  normal: '🙂',
  hard: '😕',
  pain: '😣',
};

export const HistoryScreen: React.FC = () => {
  const { state } = useApp();

  // 计算连续打卡天数
  const streakDays = useMemo(() => {
    if (state.checkins.length === 0) return 0;

    const today = new Date().setHours(0, 0, 0, 0);
    let streak = 0;
    let currentDay = today;

    while (true) {
      const hasCheckIn = state.checkins.some((c) => isSameDayTimestamp(c.timestamp, currentDay));
      if (!hasCheckIn) break;
      streak++;
      currentDay -= 24 * 60 * 60 * 1000; // 前一天
    }

    return streak;
  }, [state.checkins]);

  // 计算本周完成率
  const weekCompletion = useMemo(() => {
    const weekStart = getWeekStart();
    const weekEnd = getWeekEnd();
    const enabledExercises = state.exercises.filter((ex) => ex.isEnabled);

    if (enabledExercises.length === 0) return 0;

    const daysInWeek = Math.ceil((Date.now() - weekStart) / (24 * 60 * 60 * 1000));
    const totalExpected = enabledExercises.length * daysInWeek;

    const weekCheckins = state.checkins.filter(
      (c) => c.timestamp >= weekStart && c.timestamp <= weekEnd
    );

    return totalExpected > 0 ? Math.round((weekCheckins.length / totalExpected) * 100) : 0;
  }, [state.checkins, state.exercises]);

  // 日历标记
  const markedDates = useMemo(() => {
    const marked: any = {};
    state.checkins.forEach((checkin) => {
      const dateString = new Date(checkin.timestamp).toISOString().split('T')[0];
      marked[dateString] = {
        marked: true,
        dotColor: Colors.success,
      };
    });
    return marked;
  }, [state.checkins]);

  // 最近30天的打卡记录，按日期分组
  const recentCheckIns = useMemo(() => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recent = state.checkins
      .filter((c) => c.timestamp >= thirtyDaysAgo)
      .sort((a, b) => b.timestamp - a.timestamp);

    const grouped = new Map<string, CheckIn[]>();
    recent.forEach((checkin) => {
      const dateKey = formatShortDate(checkin.timestamp);
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(checkin);
    });

    return Array.from(grouped.entries());
  }, [state.checkins]);

  const handleExport = async () => {
    if (state.checkins.length === 0) {
      Alert.alert('提示', '还没有打卡记录可以导出');
      return;
    }

    Alert.alert('选择导出格式', '', [
      {
        text: 'CSV格式',
        onPress: async () => {
          try {
            await exportToCSV(state.checkins);
          } catch (error) {
            Alert.alert('错误', '导出失败，请重试');
          }
        },
      },
      {
        text: '文本格式',
        onPress: async () => {
          try {
            await exportToText(state.checkins);
          } catch (error) {
            Alert.alert('错误', '导出失败，请重试');
          }
        },
      },
      {
        text: '取消',
        style: 'cancel',
      },
    ]);
  };

  return (
    <View style={CommonStyles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.statsRow}>
          <StatCard label="已坚持" value={`${streakDays}天`} />
          <StatCard label="本周完成率" value={`${weekCompletion}%`} />
        </View>

        <View style={styles.section}>
          <Text style={CommonStyles.title}>打卡日历</Text>
          <Calendar
            markedDates={markedDates}
            theme={{
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={CommonStyles.title}>最近记录</Text>
            <TouchableOpacity onPress={handleExport}>
              <Text style={styles.exportButton}>导出</Text>
            </TouchableOpacity>
          </View>

          {recentCheckIns.length === 0 ? (
            <Text style={[CommonStyles.body, styles.emptyText]}>还没有打卡记录</Text>
          ) : (
            recentCheckIns.map(([date, checkins]) => (
              <View key={date} style={styles.dateGroup}>
                <Text style={styles.dateTitle}>{date}</Text>
                {checkins.map((checkin) => (
                  <View key={checkin.id} style={styles.checkinItem}>
                    <View style={styles.checkinLeft}>
                      <Text style={styles.checkinTime}>
                        {formatDateTime(checkin.timestamp).split(' ')[1]}
                      </Text>
                      <Text style={styles.checkinName}>{checkin.exerciseName}</Text>
                      <Text style={styles.checkinEmoji}>{FEELING_EMOJIS[checkin.feeling]}</Text>
                    </View>
                    {checkin.note && <Text style={styles.checkinNote}>{checkin.note}</Text>}
                  </View>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exportButton: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textDisabled,
    marginTop: 20,
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  checkinItem: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  checkinLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkinTime: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginRight: 12,
  },
  checkinName: {
    fontSize: 18,
    color: Colors.textPrimary,
    flex: 1,
  },
  checkinEmoji: {
    fontSize: 24,
  },
  checkinNote: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.border,
  },
});
```

- [ ] **Step 3: 安装日历依赖**

```bash
npm install react-native-calendars
```

Expected: 安装成功

- [ ] **Step 4: 创建设置页面**

创建 `src/screens/SettingsScreen.tsx`：

```typescript
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { LargeButton } from '../components/LargeButton';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';
import { clearAllCheckIns } from '../storage/checkinStorage';
import { sendTestNotification } from '../services/notificationService';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { state, updateSettings, refreshCheckIns } = useApp();

  const handleClearData = () => {
    Alert.alert('确认清空', '这将删除所有打卡记录，训练项目不会被删除。确定要继续吗？', [
      {
        text: '取消',
        style: 'cancel',
      },
      {
        text: '确定',
        style: 'destructive',
        onPress: async () => {
          try {
            await clearAllCheckIns();
            await refreshCheckIns();
            Alert.alert('成功', '打卡记录已清空');
          } catch (error) {
            Alert.alert('错误', '清空失败，请重试');
          }
        },
      },
    ]);
  };

  const handleTestNotification = async () => {
    try {
      await sendTestNotification();
      Alert.alert('提示', '测试通知将在2秒后显示');
    } catch (error) {
      Alert.alert('错误', '发送测试通知失败');
    }
  };

  return (
    <View style={CommonStyles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={CommonStyles.title}>训练管理</Text>
          <LargeButton
            title="管理我的训练"
            onPress={() => navigation.navigate('ManageExercises' as never)}
            variant="secondary"
            style={styles.button}
          />
        </View>

        <View style={styles.section}>
          <Text style={CommonStyles.title}>通知设置</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>提前10分钟提醒</Text>
            <Switch
              value={state.settings.enableEarlyReminder}
              onValueChange={(value) => updateSettings({ enableEarlyReminder: value })}
              trackColor={{ false: Colors.neutral, true: Colors.primary }}
            />
          </View>

          <LargeButton
            title="测试通知"
            onPress={handleTestNotification}
            variant="secondary"
            style={styles.button}
          />
        </View>

        <View style={styles.section}>
          <Text style={CommonStyles.title}>数据管理</Text>
          
          <LargeButton
            title="清空所有数据"
            onPress={handleClearData}
            variant="danger"
            style={styles.button}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>康复助手 v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  button: {
    marginTop: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  settingLabel: {
    fontSize: 18,
    color: Colors.textPrimary,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  version: {
    fontSize: 14,
    color: Colors.textDisabled,
  },
});
```

- [ ] **Step 5: 验证页面**

```bash
npx tsc --noEmit
```

Expected: 无类型错误

- [ ] **Step 6: 提交历史和设置页面**

```bash
git add src/components/StatCard.tsx src/screens/HistoryScreen.tsx src/screens/SettingsScreen.tsx package.json
git commit -m "feat: implement history and settings screens

- Add StatCard component for streak/completion stats
- Implement HistoryScreen with calendar and recent checkins
- Support CSV and text export with sharing
- Create SettingsScreen with notification and data management
- Add test notification feature

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 13: 实现管理训练页面

**Files:**
- Create: `src/screens/ManageExercisesScreen.tsx`

- [ ] **Step 1: 创建管理训练页面**

创建 `src/screens/ManageExercisesScreen.tsx`：

```typescript
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';

export const ManageExercisesScreen: React.FC = () => {
  const { state, toggleExerciseEnabled, deleteExercise } = useApp();

  const handleDelete = (id: string, name: string) => {
    Alert.alert('确认删除', `确定要删除"${name}"吗？历史打卡记录将保留。`, [
      {
        text: '取消',
        style: 'cancel',
      },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteExercise(id);
            Alert.alert('成功', '训练已删除');
          } catch (error) {
            Alert.alert('错误', '删除失败，请重试');
          }
        },
      },
    ]);
  };

  return (
    <View style={CommonStyles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {state.exercises.length === 0 ? (
          <Text style={[CommonStyles.body, styles.emptyText]}>还没有训练项目</Text>
        ) : (
          state.exercises.map((exercise) => (
            <View key={exercise.id} style={styles.exerciseItem}>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseDescription} numberOfLines={1}>
                  {exercise.description}
                </Text>
                {exercise.reminderTimes.length > 0 && (
                  <Text style={styles.reminderText}>
                    提醒时间: {exercise.reminderTimes.join(', ')}
                  </Text>
                )}
              </View>
              <View style={styles.actions}>
                <Switch
                  value={exercise.isEnabled}
                  onValueChange={() => toggleExerciseEnabled(exercise.id)}
                  trackColor={{ false: Colors.neutral, true: Colors.success }}
                />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(exercise.id, exercise.name)}
                >
                  <Text style={styles.deleteText}>删除</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textDisabled,
    marginTop: 40,
  },
  exerciseItem: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
    marginRight: 16,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  reminderText: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 4,
  },
  actions: {
    alignItems: 'center',
  },
  deleteButton: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteText: {
    fontSize: 14,
    color: Colors.error,
  },
});
```

- [ ] **Step 2: 验证管理页面**

```bash
npx tsc --noEmit
```

Expected: 无类型错误

- [ ] **Step 3: 提交管理页面**

```bash
git add src/screens/ManageExercisesScreen.tsx
git commit -m "feat: implement manage exercises screen

- Display all exercises with enable/disable switch
- Show reminder times for each exercise
- Support exercise deletion with confirmation
- Preserve check-in history when deleting exercises

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 14: 配置导航和应用入口

**Files:**
- Create: `src/navigation/AppNavigator.tsx`
- Create: `src/App.tsx`

- [ ] **Step 1: 创建导航配置**

创建 `src/navigation/AppNavigator.tsx`：

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { AddExerciseScreen } from '../screens/AddExerciseScreen';
import { CheckInScreen } from '../screens/CheckInScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ManageExercisesScreen } from '../screens/ManageExercisesScreen';
import { Colors } from '../constants/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontSize: 20, fontWeight: '600' },
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: '今日训练' }} />
      <Stack.Screen name="AddExercise" component={AddExerciseScreen} options={{ title: '添加训练' }} />
      <Stack.Screen name="CheckIn" component={CheckInScreen} options={{ title: '打卡' }} />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontSize: 20, fontWeight: '600' },
      }}
    >
      <Stack.Screen name="SettingsMain" component={SettingsScreen} options={{ title: '设置' }} />
      <Stack.Screen name="ManageExercises" component={ManageExercisesScreen} options={{ title: '管理训练' }} />
    </Stack.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: '600',
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textDisabled,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            headerShown: false,
            title: '今日训练',
            tabBarIcon: () => <Text style={{ fontSize: 24 }}>🏠</Text>,
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            title: '历史记录',
            tabBarIcon: () => <Text style={{ fontSize: 24 }}>📊</Text>,
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontSize: 20, fontWeight: '600' },
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsStack}
          options={{
            headerShown: false,
            title: '设置',
            tabBarIcon: () => <Text style={{ fontSize: 24 }}>⚙️</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
```

- [ ] **Step 2: 安装导航依赖**

```bash
npm install @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
```

Expected: 安装成功

- [ ] **Step 3: 创建应用入口**

创建 `src/App.tsx`：

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { AppProvider } from './context/AppContext';
import { AppNavigator } from './navigation/AppNavigator';
import { LargeButton } from './components/LargeButton';
import { Colors } from './constants/colors';
import { requestNotificationPermission } from './services/notificationService';

const App: React.FC = () => {
  const [permissionChecked, setPermissionChecked] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      const granted = await requestNotificationPermission();
      setPermissionChecked(true);
      
      if (!granted) {
        setTimeout(() => {
          Alert.alert(
            '通知权限',
            '为了按时提醒您做训练，请在设置中允许通知权限',
            [{ text: '知道了' }]
          );
        }, 1000);
      }
    };

    checkPermission();
  }, []);

  if (!permissionChecked) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 20,
    color: Colors.textPrimary,
  },
});

export default App;
```

- [ ] **Step 4: 验证应用入口**

```bash
npx tsc --noEmit
```

Expected: 无类型错误

- [ ] **Step 5: 测试应用启动**

```bash
npx expo start
```

Expected: 应用启动成功，可以在 Expo Go 中扫码查看

- [ ] **Step 6: 提交导航和入口**

```bash
git add src/navigation src/App.tsx package.json
git commit -m "feat: implement navigation and app entry

- Create bottom tab navigator with 3 tabs
- Setup stack navigators for Home and Settings
- Configure navigation headers with primary color
- Add notification permission request on app start
- Use elderly-friendly tab bar with large icons

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 15: 测试和优化

**Files:**
- Modify: `app.json`
- Modify: `package.json`

- [ ] **Step 1: 在真机上测试基本功能**

```bash
npx expo start
```

使用 Expo Go APP 扫码测试：
- ✓ 首次启动，预设训练已创建
- ✓ 添加自定义训练
- ✓ 启用训练并设置提醒时间
- ✓ 打卡功能正常，显示鼓励语
- ✓ 历史记录显示正确
- ✓ 日历标记打卡日期
- ✓ 数据导出功能正常
- ✓ 通知权限请求正常

Expected: 所有功能正常工作

- [ ] **Step 2: 测试通知功能**

在设置页面点击"测试通知"，验证：
- ✓ 2秒后收到测试通知
- ✓ 通知声音和震动正常
- ✓ 点击通知可以打开APP

为训练设置提醒时间（设置为1分钟后），验证：
- ✓ 到时间收到通知
- ✓ 通知内容包含训练名称和说明
- ✓ 点击通知跳转到打卡页面

Expected: 通知功能完全正常

- [ ] **Step 3: 优化性能**

检查并优化：
- ✓ 使用 FlatList 而不是 ScrollView（如果列表很长）
- ✓ 避免不必要的重新渲染
- ✓ 优化图片和资源加载

```bash
npx tsc --noEmit
```

Expected: 无类型错误，无性能警告

- [ ] **Step 4: 添加应用图标和启动画面**

将图标文件放置到 assets 目录：
- `assets/icon.png` (1024x1024)
- `assets/splash.png` (1242x2436)
- `assets/adaptive-icon.png` (Android, 1024x1024)

或使用默认图标暂时跳过此步骤

- [ ] **Step 5: 提交测试和优化**

```bash
git add .
git commit -m "test: verify all features on real device

- Test exercise management functionality
- Verify notification scheduling and delivery
- Test check-in flow and history display
- Confirm data export and sharing works
- Optimize performance and fix issues

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 16: 构建和部署

**Files:**
- Create: `eas.json`

- [ ] **Step 1: 安装 EAS CLI**

```bash
npm install -g eas-cli
eas login
```

Expected: 登录 Expo 账号成功

- [ ] **Step 2: 初始化 EAS Build**

```bash
eas build:configure
```

这将创建 `eas.json` 配置文件

- [ ] **Step 3: 构建 Android APK**

```bash
eas build -p android --profile preview
```

Expected: 构建成功，生成APK下载链接

等待构建完成（约10-15分钟），下载APK文件

- [ ] **Step 4: 安装和测试 APK**

将APK传输到Android手机并安装：
- 验证所有功能正常
- 测试通知在独立APP中是否工作
- 测试数据持久化

Expected: 独立APP功能完全正常

- [ ] **Step 5: 构建 iOS IPA（需要 Apple Developer 账号）**

如果有 Apple Developer 账号：

```bash
eas build -p ios --profile preview
```

Expected: 构建成功，生成IPA文件

如果没有账号，可以跳过此步骤，使用 Expo Go 在 iOS 上测试

- [ ] **Step 6: 创建部署文档**

创建 `README.md` 说明如何安装使用：

```markdown
# 康复助手 APP

## 安装方法

### Android
1. 下载APK文件
2. 允许"未知来源"安装
3. 打开APK文件完成安装

### iOS
1. 使用 TestFlight 安装（需要邀请）
2. 或使用 Expo Go 扫码运行

## 使用说明

1. 首次打开时允许通知权限
2. 在主页添加训练项目
3. 设置提醒时间
4. 按时完成训练并打卡
5. 在历史页面查看进度

## 技术支持

如有问题请联系：[您的联系方式]
```

- [ ] **Step 7: 提交构建配置**

```bash
git add eas.json README.md
git commit -m "build: add EAS build configuration and deployment docs

- Configure EAS Build for Android and iOS
- Add installation instructions
- Document usage guide

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## 实施计划完成

所有任务已完成！应用现在具备：

✅ **核心功能**
- 10种预设康复训练
- 自定义训练添加
- 多时间段提醒
- 打卡记录与感受追踪
- 历史记录和统计

✅ **老年友好设计**
- 大字体（28-32pt标题）
- 大按钮（60px高）
- 高对比度配色
- 简单清晰的导航

✅ **数据管理**
- 本地数据持久化
- CSV和文本格式导出
- 数据分享功能

✅ **通知系统**
- 本地定时通知
- 通知权限管理
- 测试通知功能

✅ **部署就绪**
- Android APK构建
- iOS IPA构建（可选）
- 安装使用文档

## 下一步

应用已经可以使用！建议：

1. **测试阶段**：在真实设备上测试1-2天，收集反馈
2. **优化改进**：根据实际使用体验调整界面和流程
3. **功能扩展**：
   - 添加训练图片或视频演示
   - 支持家属端查看（云端同步）
   - 语音提醒功能
   - 更丰富的数据统计

祝您的康复助手APP能真正帮助到患者！💪
