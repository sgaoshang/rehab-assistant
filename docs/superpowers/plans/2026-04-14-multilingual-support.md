# Multilingual Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Chinese/English bilingual support across UI, preset projects, and voice announcements with language detection and user preference persistence.

**Architecture:** Custom i18n system using expo-localization for language detection, React Context for global state, AsyncStorage for persistence. Translation files organized by feature module with TypeScript type safety.

**Tech Stack:** React Context API, expo-localization, AsyncStorage, TypeScript

---

## File Structure

**New Files:**
- `src/i18n/types.ts` - TypeScript types for translations
- `src/i18n/translations/zh.ts` - Chinese translation dictionary
- `src/i18n/translations/en.ts` - English translation dictionary
- `src/i18n/index.ts` - LocaleProvider, useTranslation hook, locale detection

**Modified Files:**
- `src/types/index.ts` - Add `presetId?` and `locale?` to types
- `src/utils/dateHelper.ts` - Add English date formatting
- `App.tsx` - Wrap with LocaleProvider
- `src/constants/presetProjects.ts` - Convert to function using translations
- `src/screens/HomeScreen.tsx` - Use translations and locale-aware formatting
- `src/screens/SettingsScreen.tsx` - Add language picker and use translations
- `src/screens/AddProjectScreen.tsx` - Use translations
- `src/screens/ManageProjectsScreen.tsx` - Use translations
- `src/components/ProjectCard.tsx` - Use translations with preset/custom distinction
- `src/navigation/AppNavigator.tsx` - Use translations for tab labels
- `src/services/speechService.ts` - Add locale parameter for voice selection
- `src/services/notificationService.ts` - Accept translation function

---

## Task 1: Create TypeScript Types for i18n

**Files:**
- Create: `src/i18n/types.ts`

- [ ] **Step 1: Create translation types file**

```typescript
// src/i18n/types.ts

export type Locale = 'zh' | 'en';

export interface Translations {
  common: {
    confirm: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    back: string;
  };
  tabs: {
    home: string;
    settings: string;
  };
  home: {
    greeting: string;
    greetingEmpty: string;
    emptyState: string;
    emptyHint: string;
  };
  settings: {
    title: string;
    addProject: string;
    manageProjects: string;
    languageSettings: string;
    language: string;
    developerInfo: string;
    version: string;
  };
  projects: {
    reminderTimes: string;
    enabled: string;
    disabled: string;
    rehabilitation: string;
    medication: string;
    healthCheck: string;
  };
  presets: {
    fistExercise: {
      name: string;
      description: string;
    };
    fingerStretch: {
      name: string;
      description: string;
    };
    armRaise: {
      name: string;
      description: string;
    };
    shoulderRotation: {
      name: string;
      description: string;
    };
    ankleExercise: {
      name: string;
      description: string;
    };
    kneeFlexion: {
      name: string;
      description: string;
    };
    marchingInPlace: {
      name: string;
      description: string;
    };
    neckRotation: {
      name: string;
      description: string;
    };
    deepBreathing: {
      name: string;
      description: string;
    };
    balanceTraining: {
      name: string;
      description: string;
    };
    bloodPressureMed: {
      name: string;
      description: string;
    };
    diabetesMed: {
      name: string;
      description: string;
    };
    vitaminSupplement: {
      name: string;
      description: string;
    };
    calciumSupplement: {
      name: string;
      description: string;
    };
    checkBloodPressure: {
      name: string;
      description: string;
    };
    checkBloodSugar: {
      name: string;
      description: string;
    };
    drinkWater: {
      name: string;
      description: string;
    };
    afternoonNap: {
      name: string;
      description: string;
    };
  };
  speech: {
    todayProjectsIntro: string;
    projectReminder: string;
    noProjects: string;
  };
  addProject: {
    title: string;
    selectPreset: string;
    customProject: string;
    projectName: string;
    projectNamePlaceholder: string;
    projectDescription: string;
    projectDescriptionPlaceholder: string;
    addReminderTime: string;
    selectTime: string;
  };
  manageProjects: {
    title: string;
    noProjects: string;
  };
  notifications: {
    title: string;
    body: string;
  };
}

export type TranslationFunction = (key: string, params?: Record<string, any>) => string;
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit types**

```bash
git add src/i18n/types.ts
git commit -m "feat(i18n): add TypeScript types for translations"
```

---

## Task 2: Create Chinese Translation Dictionary

**Files:**
- Create: `src/i18n/translations/zh.ts`

- [ ] **Step 1: Create Chinese translations file**

```typescript
// src/i18n/translations/zh.ts
import { Translations } from '../types';

export const zh: Translations = {
  common: {
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    back: '返回',
  },
  tabs: {
    home: '首页',
    settings: '设置',
  },
  home: {
    greeting: '您好！当前有{{count}}个提醒项目',
    greetingEmpty: '欢迎使用提醒助手！',
    emptyState: '还没有提醒项目',
    emptyHint: '点击下方"设置"添加提醒项目',
  },
  settings: {
    title: '项目管理',
    addProject: '+ 添加项目',
    manageProjects: '管理我的项目',
    languageSettings: '语言设置',
    language: '语言',
    developerInfo: '开发者信息',
    version: '提醒助手 v1.0.0',
  },
  projects: {
    reminderTimes: '提醒时间',
    enabled: '已启用',
    disabled: '已禁用',
    rehabilitation: '康复训练',
    medication: '用药提醒',
    healthCheck: '健康测量',
  },
  presets: {
    fistExercise: {
      name: '握拳练习',
      description: '缓慢握拳再放松，重复10-15次',
    },
    fingerStretch: {
      name: '手指伸展',
      description: '伸展手指，保持5秒，重复10次',
    },
    armRaise: {
      name: '抬臂运动',
      description: '双臂缓慢向上抬起，保持3秒后放下',
    },
    shoulderRotation: {
      name: '肩关节旋转',
      description: '肩部画圈转动，顺时针和逆时针各5次',
    },
    ankleExercise: {
      name: '踝关节运动',
      description: '脚踝上下活动，左右各10次',
    },
    kneeFlexion: {
      name: '膝关节屈伸',
      description: '坐姿屈伸膝盖，重复10-15次',
    },
    marchingInPlace: {
      name: '原地踏步',
      description: '原地抬腿踏步，每次持续1-2分钟',
    },
    neckRotation: {
      name: '颈部转动',
      description: '缓慢转动头部，左右各5次',
    },
    deepBreathing: {
      name: '深呼吸练习',
      description: '深吸气保持3秒，缓慢呼气',
    },
    balanceTraining: {
      name: '平衡训练',
      description: '单腿站立保持平衡，每侧30秒',
    },
    bloodPressureMed: {
      name: '降压药',
      description: '按医嘱服用降压药物',
    },
    diabetesMed: {
      name: '降糖药',
      description: '按医嘱服用降糖药物',
    },
    vitaminSupplement: {
      name: '维生素补充',
      description: '服用维生素补充剂',
    },
    calciumSupplement: {
      name: '钙片补充',
      description: '服用钙片',
    },
    checkBloodPressure: {
      name: '测量血压',
      description: '使用血压计测量并记录',
    },
    checkBloodSugar: {
      name: '测量血糖',
      description: '使用血糖仪测量并记录',
    },
    drinkWater: {
      name: '喝水提醒',
      description: '喝一杯水（约200ml）',
    },
    afternoonNap: {
      name: '午休提醒',
      description: '午休30-60分钟',
    },
  },
  speech: {
    todayProjectsIntro: '今天有{{count}}个提醒项目',
    projectReminder: '{{name}}，提醒时间：{{times}}',
    noProjects: '今天没有提醒项目',
  },
  addProject: {
    title: '添加项目',
    selectPreset: '选择预设项目',
    customProject: '自定义项目',
    projectName: '项目名称',
    projectNamePlaceholder: '输入项目名称',
    projectDescription: '项目说明',
    projectDescriptionPlaceholder: '输入项目说明',
    addReminderTime: '+ 添加提醒时间',
    selectTime: '选择时间',
  },
  manageProjects: {
    title: '管理项目',
    noProjects: '暂无项目',
  },
  notifications: {
    title: '提醒通知',
    body: '{{name}} - 是时候了！',
  },
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors (types match Translations interface)

- [ ] **Step 3: Commit Chinese translations**

```bash
git add src/i18n/translations/zh.ts
git commit -m "feat(i18n): add Chinese translation dictionary"
```

---

## Task 3: Create English Translation Dictionary

**Files:**
- Create: `src/i18n/translations/en.ts`

- [ ] **Step 1: Create English translations file**

```typescript
// src/i18n/translations/en.ts
import { Translations } from '../types';

export const en: Translations = {
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
  },
  tabs: {
    home: 'Home',
    settings: 'Settings',
  },
  home: {
    greeting: 'Hello! You have {{count}} reminder projects',
    greetingEmpty: 'Welcome to Reminder Assistant!',
    emptyState: 'No reminder projects yet',
    emptyHint: 'Tap "Settings" below to add projects',
  },
  settings: {
    title: 'Project Management',
    addProject: '+ Add Project',
    manageProjects: 'Manage My Projects',
    languageSettings: 'Language Settings',
    language: 'Language',
    developerInfo: 'Developer Info',
    version: 'Reminder Assistant v1.0.0',
  },
  projects: {
    reminderTimes: 'Reminder Times',
    enabled: 'Enabled',
    disabled: 'Disabled',
    rehabilitation: 'Rehabilitation',
    medication: 'Medication',
    healthCheck: 'Health Check',
  },
  presets: {
    fistExercise: {
      name: 'Fist Exercise',
      description: 'Slowly make a fist and release, repeat 10-15 times',
    },
    fingerStretch: {
      name: 'Finger Stretch',
      description: 'Stretch fingers, hold for 5 seconds, repeat 10 times',
    },
    armRaise: {
      name: 'Arm Raise',
      description: 'Slowly raise both arms up, hold for 3 seconds and lower',
    },
    shoulderRotation: {
      name: 'Shoulder Rotation',
      description: 'Rotate shoulders in circles, 5 times clockwise and counterclockwise',
    },
    ankleExercise: {
      name: 'Ankle Exercise',
      description: 'Move ankles up and down, 10 times each side',
    },
    kneeFlexion: {
      name: 'Knee Flexion',
      description: 'Bend and extend knees while seated, repeat 10-15 times',
    },
    marchingInPlace: {
      name: 'Marching in Place',
      description: 'March in place lifting legs, 1-2 minutes each time',
    },
    neckRotation: {
      name: 'Neck Rotation',
      description: 'Slowly rotate head, 5 times each direction',
    },
    deepBreathing: {
      name: 'Deep Breathing',
      description: 'Breathe in deeply for 3 seconds, exhale slowly',
    },
    balanceTraining: {
      name: 'Balance Training',
      description: 'Stand on one leg maintaining balance, 30 seconds each side',
    },
    bloodPressureMed: {
      name: 'Blood Pressure Medicine',
      description: 'Take blood pressure medication as prescribed',
    },
    diabetesMed: {
      name: 'Diabetes Medicine',
      description: 'Take diabetes medication as prescribed',
    },
    vitaminSupplement: {
      name: 'Vitamin Supplement',
      description: 'Take vitamin supplement',
    },
    calciumSupplement: {
      name: 'Calcium Supplement',
      description: 'Take calcium supplement',
    },
    checkBloodPressure: {
      name: 'Check Blood Pressure',
      description: 'Measure and record blood pressure',
    },
    checkBloodSugar: {
      name: 'Check Blood Sugar',
      description: 'Measure and record blood sugar',
    },
    drinkWater: {
      name: 'Drink Water',
      description: 'Drink a glass of water (about 200ml)',
    },
    afternoonNap: {
      name: 'Afternoon Nap',
      description: 'Take a 30-60 minute nap',
    },
  },
  speech: {
    todayProjectsIntro: 'You have {{count}} reminder projects today',
    projectReminder: '{{name}}, reminder times: {{times}}',
    noProjects: 'No reminder projects today',
  },
  addProject: {
    title: 'Add Project',
    selectPreset: 'Select Preset Project',
    customProject: 'Custom Project',
    projectName: 'Project Name',
    projectNamePlaceholder: 'Enter project name',
    projectDescription: 'Project Description',
    projectDescriptionPlaceholder: 'Enter project description',
    addReminderTime: '+ Add Reminder Time',
    selectTime: 'Select Time',
  },
  manageProjects: {
    title: 'Manage Projects',
    noProjects: 'No projects yet',
  },
  notifications: {
    title: 'Reminder',
    body: '{{name}} - Time to do it!',
  },
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors (types match Translations interface)

- [ ] **Step 3: Commit English translations**

```bash
git add src/i18n/translations/en.ts
git commit -m "feat(i18n): add English translation dictionary"
```

---

## Task 4: Create LocaleProvider and useTranslation Hook

**Files:**
- Create: `src/i18n/index.ts`

- [ ] **Step 1: Create i18n context and provider**

```typescript
// src/i18n/index.ts
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { Locale, TranslationFunction, Translations } from './types';
import { zh } from './translations/zh';
import { en } from './translations/en';

const LOCALE_STORAGE_KEY = 'userLocale';

interface LocaleContextType {
  locale: Locale;
  t: TranslationFunction;
  setLocale: (locale: Locale) => Promise<void>;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export const useTranslation = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useTranslation must be used within LocaleProvider');
  }
  return context;
};

interface LocaleProviderProps {
  children: ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('zh');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeLocale();
  }, []);

  const initializeLocale = async () => {
    try {
      // Check for saved user preference
      const savedLocale = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
      if (savedLocale === 'zh' || savedLocale === 'en') {
        setLocaleState(savedLocale);
        setIsInitialized(true);
        return;
      }

      // Fallback to system language
      const systemLocales = Localization.getLocales();
      const systemLanguage = systemLocales[0]?.languageCode;
      const defaultLocale: Locale = systemLanguage === 'zh' ? 'zh' : 'en';
      setLocaleState(defaultLocale);
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize locale:', error);
      setLocaleState('zh'); // Fallback to Chinese
      setIsInitialized(true);
    }
  };

  const setLocale = async (newLocale: Locale) => {
    try {
      await AsyncStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      setLocaleState(newLocale);
    } catch (error) {
      console.error('Failed to save locale:', error);
    }
  };

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const t: TranslationFunction = (key: string, params?: Record<string, any>) => {
    const translations: Translations = locale === 'zh' ? zh : en;
    const value = getNestedValue(translations, key);

    if (typeof value !== 'string') {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }

    // Replace {{variable}} placeholders
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? String(params[paramKey]) : match;
      });
    }

    return value;
  };

  // Don't render children until locale is initialized
  if (!isInitialized) {
    return null;
  }

  const contextValue: LocaleContextType = {
    locale,
    t,
    setLocale,
  };

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit i18n infrastructure**

```bash
git add src/i18n/index.ts
git commit -m "feat(i18n): add LocaleProvider and useTranslation hook"
```

---

## Task 5: Wrap App with LocaleProvider

**Files:**
- Modify: `App.tsx`

- [ ] **Step 1: Import LocaleProvider and wrap app**

```typescript
// App.tsx
import React from 'react';
import { AppProvider } from './src/context/AppContext';
import { LocaleProvider } from './src/i18n';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <LocaleProvider>
      <AppProvider>
        <AppNavigator />
      </AppProvider>
    </LocaleProvider>
  );
}
```

- [ ] **Step 2: Test app starts without errors**

Run: `npm start`
Expected: App starts, no errors in console, UI still shows (Chinese text for now)

- [ ] **Step 3: Commit LocaleProvider integration**

```bash
git add App.tsx
git commit -m "feat(i18n): wrap app with LocaleProvider"
```

---

## Task 6: Update Project Type for presetId

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Add presetId to Project interface**

Find the Project interface and add the optional presetId field:

```typescript
export interface Project {
  id: string;
  name: string;
  description: string;
  reminderTimes: string[];
  isEnabled: boolean;
  createdAt: number;
  presetId?: string;  // NEW: identifies if created from preset
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit type update**

```bash
git add src/types/index.ts
git commit -m "feat(i18n): add presetId to Project type for translation support"
```

---

## Task 7: Add English Date Formatting

**Files:**
- Modify: `src/utils/dateHelper.ts`

- [ ] **Step 1: Read current dateHelper implementation**

Read: `src/utils/dateHelper.ts`

- [ ] **Step 2: Add English date formatting function**

Add this function to the file:

```typescript
export const formatEnglishDate = (date: Date): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${dayName}, ${monthName} ${day}, ${year}`;
};
```

- [ ] **Step 3: Add locale-aware format function**

Add this function to the file:

```typescript
import { Locale } from '../i18n/types';

export const formatDate = (date: Date, locale: Locale): string => {
  if (locale === 'zh') {
    return formatChineseDate(date);
  } else {
    return formatEnglishDate(date);
  }
};
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit date formatting**

```bash
git add src/utils/dateHelper.ts
git commit -m "feat(i18n): add English date formatting support"
```

---

## Task 8: Update HomeScreen for i18n

**Files:**
- Modify: `src/screens/HomeScreen.tsx`

- [ ] **Step 1: Import useTranslation and update imports**

At the top of HomeScreen.tsx, replace the formatChineseDate import with formatDate and add useTranslation:

```typescript
import { useTranslation } from '../i18n';
import { formatDate } from '../utils/dateHelper';
```

- [ ] **Step 2: Use translation hook in component**

Add at the start of the HomeScreen component:

```typescript
const { t, locale } = useTranslation();
```

- [ ] **Step 3: Replace hardcoded strings with translations**

Replace the getGreeting function:

```typescript
const getGreeting = () => {
  if (totalProjects === 0) {
    return t('home.greetingEmpty');
  }
  return t('home.greeting', { count: totalProjects });
};
```

- [ ] **Step 4: Update date display to use locale**

Replace the date formatting line in the return statement:

```typescript
<Text style={CommonStyles.title}>{formatDate(new Date(), locale)}</Text>
```

- [ ] **Step 5: Update empty state text**

Replace the empty state text:

```typescript
<Text style={[CommonStyles.body, styles.emptyText]}>
  {t('home.emptyState')}
</Text>
<Text style={[CommonStyles.smallBody, styles.emptyHint]}>
  {t('home.emptyHint')}
</Text>
```

- [ ] **Step 6: Update speech service call**

Update the speakTodayProjects call to pass locale:

```typescript
speakTodayProjects(enabledProjects, t, locale);
```

- [ ] **Step 7: Test HomeScreen renders**

Run: `npm start`
Navigate to Home screen
Expected: See Chinese or English text based on system language

- [ ] **Step 8: Commit HomeScreen i18n**

```bash
git add src/screens/HomeScreen.tsx
git commit -m "feat(i18n): add translations to HomeScreen"
```

---

## Task 9: Add Language Selector to SettingsScreen

**Files:**
- Modify: `src/screens/SettingsScreen.tsx`

- [ ] **Step 1: Import useTranslation and Picker**

Add imports at the top:

```typescript
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from '../i18n';
```

- [ ] **Step 2: Use translation hook**

Add at the start of the SettingsScreen component:

```typescript
const { t, locale, setLocale } = useTranslation();
```

- [ ] **Step 3: Replace all hardcoded strings**

Replace the project management section:

```typescript
<View style={styles.section}>
  <Text style={CommonStyles.title}>{t('settings.title')}</Text>
  <LargeButton
    title={t('settings.addProject')}
    onPress={() => navigation.navigate('AddProject' as never)}
    variant="primary"
    style={styles.button}
  />
  <LargeButton
    title={t('settings.manageProjects')}
    onPress={() => navigation.navigate('ManageProjects' as never)}
    variant="secondary"
    style={styles.button}
  />
</View>
```

- [ ] **Step 4: Add language selection section**

Add this new section after the project management section:

```typescript
<View style={styles.section}>
  <Text style={CommonStyles.title}>{t('settings.languageSettings')}</Text>
  <View style={styles.languagePicker}>
    <Text style={styles.languageLabel}>{t('settings.language')}</Text>
    <Picker
      selectedValue={locale}
      onValueChange={(value) => setLocale(value)}
      style={styles.picker}
    >
      <Picker.Item label="中文" value="zh" />
      <Picker.Item label="English" value="en" />
    </Picker>
  </View>
</View>
```

- [ ] **Step 5: Update developer info and version**

Replace the footer section:

```typescript
<View style={styles.footer}>
  <View style={styles.developerInfo}>
    <Text style={styles.developerTitle}>{t('settings.developerInfo')}</Text>
    <Text style={styles.developerText}>sgao</Text>
    <Text style={styles.developerText}>📱 13552276232</Text>
    <Text style={styles.developerText}>✉️ sgaoshang@outlook.com</Text>
  </View>
  <Text style={styles.version}>{t('settings.version')}</Text>
</View>
```

- [ ] **Step 6: Add styles for language picker**

Add to the styles object:

```typescript
languagePicker: {
  borderWidth: 1,
  borderColor: Colors.border,
  borderRadius: 8,
  padding: 12,
  marginTop: 12,
  backgroundColor: Colors.surface,
},
languageLabel: {
  fontSize: 14,
  fontWeight: '600',
  color: Colors.text,
  marginBottom: 8,
},
picker: {
  height: 50,
},
```

- [ ] **Step 7: Install Picker package if needed**

Run: `npx expo install @react-native-picker/picker`
Expected: Package installed

- [ ] **Step 8: Test language switching**

Run: `npm start`
Go to Settings
Switch between Chinese and English
Expected: All UI updates immediately, choice persists after app restart

- [ ] **Step 9: Commit SettingsScreen i18n**

```bash
git add src/screens/SettingsScreen.tsx package.json package-lock.json
git commit -m "feat(i18n): add language selector to SettingsScreen"
```

---

## Task 10: Convert Preset Projects to Use Translations

**Files:**
- Modify: `src/constants/presetProjects.ts`

- [ ] **Step 1: Read current preset projects structure**

Read: `src/constants/presetProjects.ts`

- [ ] **Step 2: Convert to function that accepts translation function**

Replace the entire file content:

```typescript
// src/constants/presetProjects.ts
import { TranslationFunction } from '../i18n/types';

export interface PresetProject {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultTimes: string[];
}

export interface PresetCategory {
  category: string;
  items: PresetProject[];
}

export const getPresetProjects = (t: TranslationFunction): PresetCategory[] => [
  {
    category: t('projects.rehabilitation'),
    items: [
      {
        id: 'fistExercise',
        name: t('presets.fistExercise.name'),
        description: t('presets.fistExercise.description'),
        icon: '✊',
        defaultTimes: ['09:00', '15:00', '20:00'],
      },
      {
        id: 'fingerStretch',
        name: t('presets.fingerStretch.name'),
        description: t('presets.fingerStretch.description'),
        icon: '🖐',
        defaultTimes: ['09:00', '15:00', '20:00'],
      },
      {
        id: 'armRaise',
        name: t('presets.armRaise.name'),
        description: t('presets.armRaise.description'),
        icon: '💪',
        defaultTimes: ['09:00', '15:00', '20:00'],
      },
      {
        id: 'shoulderRotation',
        name: t('presets.shoulderRotation.name'),
        description: t('presets.shoulderRotation.description'),
        icon: '🔄',
        defaultTimes: ['09:00', '15:00', '20:00'],
      },
      {
        id: 'ankleExercise',
        name: t('presets.ankleExercise.name'),
        description: t('presets.ankleExercise.description'),
        icon: '🦶',
        defaultTimes: ['10:00', '16:00'],
      },
      {
        id: 'kneeFlexion',
        name: t('presets.kneeFlexion.name'),
        description: t('presets.kneeFlexion.description'),
        icon: '🦵',
        defaultTimes: ['10:00', '16:00'],
      },
      {
        id: 'marchingInPlace',
        name: t('presets.marchingInPlace.name'),
        description: t('presets.marchingInPlace.description'),
        icon: '🚶',
        defaultTimes: ['09:00', '17:00'],
      },
      {
        id: 'neckRotation',
        name: t('presets.neckRotation.name'),
        description: t('presets.neckRotation.description'),
        icon: '↩️',
        defaultTimes: ['10:00', '14:00', '18:00'],
      },
      {
        id: 'deepBreathing',
        name: t('presets.deepBreathing.name'),
        description: t('presets.deepBreathing.description'),
        icon: '🫁',
        defaultTimes: ['08:00', '12:00', '18:00'],
      },
      {
        id: 'balanceTraining',
        name: t('presets.balanceTraining.name'),
        description: t('presets.balanceTraining.description'),
        icon: '⚖️',
        defaultTimes: ['10:00', '16:00'],
      },
    ],
  },
  {
    category: t('projects.medication'),
    items: [
      {
        id: 'bloodPressureMed',
        name: t('presets.bloodPressureMed.name'),
        description: t('presets.bloodPressureMed.description'),
        icon: '💊',
        defaultTimes: ['08:00', '20:00'],
      },
      {
        id: 'diabetesMed',
        name: t('presets.diabetesMed.name'),
        description: t('presets.diabetesMed.description'),
        icon: '💉',
        defaultTimes: ['08:00', '18:00'],
      },
      {
        id: 'vitaminSupplement',
        name: t('presets.vitaminSupplement.name'),
        description: t('presets.vitaminSupplement.description'),
        icon: '🌟',
        defaultTimes: ['09:00'],
      },
      {
        id: 'calciumSupplement',
        name: t('presets.calciumSupplement.name'),
        description: t('presets.calciumSupplement.description'),
        icon: '🦴',
        defaultTimes: ['09:00', '21:00'],
      },
    ],
  },
  {
    category: t('projects.healthCheck'),
    items: [
      {
        id: 'checkBloodPressure',
        name: t('presets.checkBloodPressure.name'),
        description: t('presets.checkBloodPressure.description'),
        icon: '🩺',
        defaultTimes: ['08:00', '20:00'],
      },
      {
        id: 'checkBloodSugar',
        name: t('presets.checkBloodSugar.name'),
        description: t('presets.checkBloodSugar.description'),
        icon: '🩸',
        defaultTimes: ['07:00', '11:00', '17:00'],
      },
      {
        id: 'drinkWater',
        name: t('presets.drinkWater.name'),
        description: t('presets.drinkWater.description'),
        icon: '💧',
        defaultTimes: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
      },
      {
        id: 'afternoonNap',
        name: t('presets.afternoonNap.name'),
        description: t('presets.afternoonNap.description'),
        icon: '😴',
        defaultTimes: ['13:00'],
      },
    ],
  },
];
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit preset projects conversion**

```bash
git add src/constants/presetProjects.ts
git commit -m "feat(i18n): convert preset projects to use translation function"
```

---

## Task 11: Update AddProjectScreen for i18n

**Files:**
- Modify: `src/screens/AddProjectScreen.tsx`

- [ ] **Step 1: Read current AddProjectScreen**

Read: `src/screens/AddProjectScreen.tsx`

- [ ] **Step 2: Import useTranslation and update preset import**

Add/update imports:

```typescript
import { useTranslation } from '../i18n';
import { getPresetProjects } from '../constants/presetProjects';
```

- [ ] **Step 3: Use translation hook and get localized presets**

At the start of the component:

```typescript
const { t } = useTranslation();
const presetProjects = getPresetProjects(t);
```

- [ ] **Step 4: Replace all hardcoded strings in UI**

Replace strings throughout the component. Key replacements:

Title:
```typescript
<Text style={CommonStyles.title}>{t('addProject.title')}</Text>
```

Section headers:
```typescript
<Text style={CommonStyles.subtitle}>{t('addProject.selectPreset')}</Text>
<Text style={CommonStyles.subtitle}>{t('addProject.customProject')}</Text>
```

Form labels:
```typescript
<Text style={styles.label}>{t('addProject.projectName')}</Text>
<TextInput
  placeholder={t('addProject.projectNamePlaceholder')}
  ...
/>
<Text style={styles.label}>{t('addProject.projectDescription')}</Text>
<TextInput
  placeholder={t('addProject.projectDescriptionPlaceholder')}
  ...
/>
```

Buttons:
```typescript
<LargeButton title={t('addProject.addReminderTime')} ... />
<LargeButton title={t('common.save')} ... />
```

- [ ] **Step 5: Update project creation to include presetId**

When creating a project from a preset, add the presetId field:

```typescript
const handleSelectPreset = (preset: PresetProject) => {
  setName(preset.name);
  setDescription(preset.description);
  setReminderTimes(preset.defaultTimes);
  setSelectedPresetId(preset.id);  // NEW: track preset ID
};

// In handleSave:
await addProject({
  name,
  description,
  reminderTimes,
  isEnabled: true,
  presetId: selectedPresetId,  // NEW: include preset ID
});
```

- [ ] **Step 6: Add selectedPresetId state**

Add state for tracking preset:

```typescript
const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>();
```

- [ ] **Step 7: Clear presetId on manual edit**

When user manually edits name or description, clear the preset ID:

```typescript
<TextInput
  value={name}
  onChangeText={(text) => {
    setName(text);
    setSelectedPresetId(undefined);  // Clear preset link on manual edit
  }}
  ...
/>
```

- [ ] **Step 8: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 9: Test AddProjectScreen**

Run: `npm start`
Navigate to Add Project
Expected: All labels in correct language, preset projects show translated names

- [ ] **Step 10: Commit AddProjectScreen i18n**

```bash
git add src/screens/AddProjectScreen.tsx
git commit -m "feat(i18n): add translations to AddProjectScreen with presetId tracking"
```

---

## Task 12: Update ManageProjectsScreen for i18n

**Files:**
- Modify: `src/screens/ManageProjectsScreen.tsx`

- [ ] **Step 1: Read current ManageProjectsScreen**

Read: `src/screens/ManageProjectsScreen.tsx`

- [ ] **Step 2: Import useTranslation**

Add import:

```typescript
import { useTranslation } from '../i18n';
```

- [ ] **Step 3: Use translation hook**

At the start of component:

```typescript
const { t } = useTranslation();
```

- [ ] **Step 4: Replace title**

Replace title:

```typescript
<Text style={CommonStyles.title}>{t('manageProjects.title')}</Text>
```

- [ ] **Step 5: Replace empty state text**

Replace empty state:

```typescript
<Text style={styles.emptyText}>{t('manageProjects.noProjects')}</Text>
```

- [ ] **Step 6: Replace delete button text**

Replace delete button:

```typescript
<LargeButton
  title={t('common.delete')}
  onPress={() => handleDelete(project.id)}
  variant="danger"
/>
```

- [ ] **Step 7: Test ManageProjectsScreen**

Run: `npm start`
Navigate to Manage Projects
Expected: All text in correct language

- [ ] **Step 8: Commit ManageProjectsScreen i18n**

```bash
git add src/screens/ManageProjectsScreen.tsx
git commit -m "feat(i18n): add translations to ManageProjectsScreen"
```

---

## Task 13: Update ProjectCard for i18n

**Files:**
- Modify: `src/components/ProjectCard.tsx`

- [ ] **Step 1: Read current ProjectCard**

Read: `src/components/ProjectCard.tsx`

- [ ] **Step 2: Import useTranslation**

Add import:

```typescript
import { useTranslation } from '../i18n';
```

- [ ] **Step 3: Use translation hook**

At the start of component:

```typescript
const { t } = useTranslation();
```

- [ ] **Step 4: Add logic for preset vs custom project display**

Add this logic at the start of the component:

```typescript
// If project has presetId, use translations; otherwise use stored name
const displayName = project.presetId 
  ? t(`presets.${project.presetId}.name`)
  : project.name;

const displayDescription = project.presetId
  ? t(`presets.${project.presetId}.description`)
  : project.description;
```

- [ ] **Step 5: Use displayName and displayDescription in render**

Replace project.name and project.description:

```typescript
<Text style={styles.name}>{displayName}</Text>
<Text style={styles.description}>{displayDescription}</Text>
```

- [ ] **Step 6: Replace "提醒时间" label**

Replace reminder times label:

```typescript
<Text style={styles.timesLabel}>{t('projects.reminderTimes')}:</Text>
```

- [ ] **Step 7: Test ProjectCard displays correctly**

Run: `npm start`
Expected: Preset projects show in current language, custom projects show as entered

- [ ] **Step 8: Commit ProjectCard i18n**

```bash
git add src/components/ProjectCard.tsx
git commit -m "feat(i18n): add translation support to ProjectCard with preset detection"
```

---

## Task 14: Update AppNavigator for i18n

**Files:**
- Modify: `src/navigation/AppNavigator.tsx`

- [ ] **Step 1: Read current AppNavigator**

Read: `src/navigation/AppNavigator.tsx`

- [ ] **Step 2: Import useTranslation**

Add import:

```typescript
import { useTranslation } from '../i18n';
```

- [ ] **Step 3: Use translation hook in tab navigator**

Update the BottomTabNavigator component:

```typescript
const BottomTabNavigator: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
};
```

- [ ] **Step 4: Test tab labels**

Run: `npm start`
Expected: Tab labels show in correct language

- [ ] **Step 5: Commit AppNavigator i18n**

```bash
git add src/navigation/AppNavigator.tsx
git commit -m "feat(i18n): add translations to tab navigator"
```

---

## Task 15: Update Speech Service for i18n

**Files:**
- Modify: `src/services/speechService.ts`

- [ ] **Step 1: Read current speechService**

Read: `src/services/speechService.ts`

- [ ] **Step 2: Update function signature to accept locale and translation**

Replace the speakTodayProjects function:

```typescript
import * as Speech from 'expo-speech';
import { Project } from '../types';
import { Locale, TranslationFunction } from '../i18n/types';

export const speakTodayProjects = async (
  projects: Project[],
  t: TranslationFunction,
  locale: Locale
) => {
  const language = locale === 'zh' ? 'zh-CN' : 'en-US';

  if (projects.length === 0) {
    const text = t('speech.noProjects');
    await Speech.speak(text, { language });
    return;
  }

  // Announce intro
  const intro = t('speech.todayProjectsIntro', { count: projects.length });
  await Speech.speak(intro, { language });

  // Small pause after intro
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Announce each project
  for (const project of projects) {
    // Use translated name if from preset, otherwise use stored name
    const projectName = project.presetId 
      ? t(`presets.${project.presetId}.name`)
      : project.name;
    
    const times = project.reminderTimes.join(locale === 'zh' ? '、' : ', ');
    const text = t('speech.projectReminder', { name: projectName, times });
    
    await Speech.speak(text, { language });
    
    // Small pause between projects
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
};
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Test voice announcement**

Run: `npm start`
Open app (triggers voice announcement)
Expected: Hears announcement in correct language with correct voice

- [ ] **Step 5: Commit speech service i18n**

```bash
git add src/services/speechService.ts
git commit -m "feat(i18n): add multilingual support to speech service"
```

---

## Task 16: Update Notification Service for i18n

**Files:**
- Modify: `src/services/notificationService.ts`

- [ ] **Step 1: Read current notificationService**

Read: `src/services/notificationService.ts`

- [ ] **Step 2: Update to accept translation function**

The notification service needs access to translations. Since notifications are scheduled in the background, we'll update the scheduleProjectNotifications function signature:

```typescript
import * as Notifications from 'expo-notifications';
import { Project } from '../types';
import { TranslationFunction } from '../i18n/types';

export const scheduleProjectNotifications = async (
  project: Project,
  t: TranslationFunction
) => {
  // Cancel existing notifications for this project first
  await cancelProjectNotifications(project.id);

  if (!project.isEnabled || project.reminderTimes.length === 0) {
    return;
  }

  // Get project name (translated if from preset)
  const projectName = project.presetId
    ? t(`presets.${project.presetId}.name`)
    : project.name;

  for (const time of project.reminderTimes) {
    const [hours, minutes] = time.split(':').map(Number);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('notifications.title'),
        body: t('notifications.body', { name: projectName }),
        data: { projectId: project.id },
      },
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });
  }
};
```

- [ ] **Step 3: Update AppContext to pass translation function**

Read: `src/context/AppContext.tsx`

Update the imports:

```typescript
import { useTranslation } from '../i18n';
```

Inside the AppProvider component, get the translation function:

```typescript
const { t } = useTranslation();
```

Update all calls to scheduleProjectNotifications to pass t:

```typescript
// In addProject:
if (newProject.isEnabled) {
  await scheduleProjectNotifications(newProject, t);
}

// In updateProject:
if (projects[index].isEnabled) {
  await scheduleProjectNotifications(projects[index], t);
}
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Test notifications**

Run: `npm start`
Add a project with notification in 1 minute
Wait for notification
Expected: Notification appears with translated text

- [ ] **Step 6: Commit notification service i18n**

```bash
git add src/services/notificationService.ts src/context/AppContext.tsx
git commit -m "feat(i18n): add multilingual support to notifications"
```

---

## Task 17: End-to-End Testing and Final Commit

**Files:**
- All modified files

- [ ] **Step 1: Full app restart and language detection test**

Run: `npm start`
Clear app data / reinstall
Launch app
Expected: Detects system language correctly (Chinese for zh systems, English for others)

- [ ] **Step 2: Test language switching**

Go to Settings
Switch to English
Expected: All UI updates immediately (tabs, screens, buttons)

Switch to Chinese
Expected: All UI updates back to Chinese

Restart app
Expected: Language preference persists

- [ ] **Step 3: Test preset projects in both languages**

Add Project screen
View preset projects
Expected: Names and descriptions show in current language

Switch language in Settings
Return to Add Project
Expected: Same presets now show in new language

- [ ] **Step 4: Test custom projects**

Create a custom project with Chinese name "我的项目"
Switch to English
Expected: Custom project name remains "我的项目" (not translated)

Create a custom project with English name "My Project"
Switch to Chinese
Expected: Custom project name remains "My Project" (not translated)

- [ ] **Step 5: Test preset-based projects**

Create project from preset "Fist Exercise"
Switch language
Expected: Project name changes to "握拳练习" in Chinese

- [ ] **Step 6: Test voice announcements**

Open app with Chinese selected
Expected: Hears Chinese announcement with zh-CN voice

Close and reopen with English selected
Expected: Hears English announcement with en-US voice

- [ ] **Step 7: Test date formatting**

Check Home screen date display in Chinese
Expected: "2026年4月14日 星期一" format

Switch to English
Expected: "Monday, April 14, 2026" format

- [ ] **Step 8: Test notifications (requires waiting)**

Set a project with reminder in 1 minute
Wait for notification
Expected: Notification title and body in correct language

- [ ] **Step 9: Verify TypeScript types**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 10: Final commit**

```bash
git add -A
git status
# Verify all changes are as expected
git commit -m "feat(i18n): complete multilingual support implementation

Add comprehensive Chinese/English bilingual support including:
- Language detection from system settings
- User preference persistence in AsyncStorage
- UI translations across all screens
- Preset project translations
- Voice announcements in correct language
- Notification translations
- Date formatting for both locales
- Distinction between preset and custom projects

Users can switch language in Settings with immediate UI update."
```

---

## Self-Review Checklist

**Spec Coverage:**
- ✓ Dual language support (zh, en)
- ✓ Language detection (system language on first launch)
- ✓ Manual language selection in Settings
- ✓ Persist user preference (AsyncStorage)
- ✓ Translate UI text (all screens, components, navigation)
- ✓ Translate preset projects
- ✓ Translate voice announcements
- ✓ Voice uses same language as UI
- ✓ Date formatting per locale
- ✓ Notification translations
- ✓ Type safety (TypeScript types for all translations)
- ✓ No breaking changes (existing data compatible via optional presetId)

**Placeholder Check:**
- ✓ No "TBD" or "TODO" in plan
- ✓ All code blocks are complete
- ✓ All file paths are exact
- ✓ All commands have expected outputs
- ✓ No "similar to Task N" references

**Type Consistency:**
- ✓ Locale type: 'zh' | 'en' used consistently
- ✓ TranslationFunction signature matches across all usages
- ✓ Translations interface structure matches translation files
- ✓ presetId field is optional (presetId?: string)
- ✓ All translation keys reference actual keys in translation files

**Implementation Quality:**
- ✓ DRY: Translation function reused everywhere, no duplicate logic
- ✓ YAGNI: No over-engineering, simple context-based solution
- ✓ Frequent commits: Each task ends with a commit
- ✓ Testing: Manual testing steps after UI changes
- ✓ Clear boundaries: i18n infrastructure separate from components

---

## Notes

**Testing Strategy:** This implementation uses manual testing rather than automated tests because:
1. UI translation verification requires visual inspection
2. Voice announcement testing requires audio playback
3. System language detection requires device-level simulation
4. Language switching persistence requires app restart

For production apps, consider adding:
- Integration tests for translation key coverage
- Snapshot tests for translated UI
- E2E tests for language switching flow

**Future Enhancements:** If more languages are needed:
1. Add translation file (e.g., `ja.ts`)
2. Update Locale type to include new language
3. Add Picker.Item for new language
4. Add voice language mapping in speech service

No architectural changes required.
