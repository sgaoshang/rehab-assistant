# Multilingual Support Design

**Date:** 2026-04-14  
**Version:** 1.0  
**Status:** Design Phase

## Overview

Add internationalization (i18n) support to the Reminder Assistant app, enabling Chinese and English bilingual support across the entire application including UI, preset projects, and voice announcements.

## Requirements

### Functional Requirements

1. **Dual Language Support**: Chinese (zh) and English (en)
2. **Language Detection**: 
   - Default to system language on first launch
   - Allow manual language selection in Settings
   - Persist user's language preference
3. **Translation Scope**:
   - All UI text (buttons, labels, headings, messages)
   - Preset project names and descriptions
   - Voice announcement content
   - Date formatting
   - Notification messages
4. **Voice Announcements**: Use the same language as the UI (no separate voice language setting)

### Non-Functional Requirements

1. **Type Safety**: TypeScript types ensure all translation keys are valid
2. **Performance**: No noticeable delay when switching languages
3. **Maintainability**: Clear structure for adding new translations
4. **Zero Breaking Changes**: Existing user data remains compatible

## Technical Approach

### Solution: expo-localization + Custom i18n System

**Rationale:**
- Lightweight solution (no additional dependencies beyond Expo SDK)
- Perfect integration with Expo ecosystem
- Sufficient for dual-language requirements
- Full control over implementation
- Easy to understand and maintain

**Why not react-i18next:**
- Overkill for simple dual-language app (~50KB overhead)
- Complex configuration not needed
- Advanced features (pluralization rules, gender, namespaces) not required

## Architecture

### Directory Structure

```
src/
├── i18n/
│   ├── index.ts                    # LocaleProvider, useTranslation hook
│   ├── translations/
│   │   ├── zh.ts                   # Chinese translations
│   │   └── en.ts                   # English translations
│   └── types.ts                    # TypeScript type definitions
```

### Core Components

#### 1. LocaleContext

Provides global access to:
- Current locale (`'zh' | 'en'`)
- Translation function `t(key, params?)`
- Locale setter `setLocale(locale)`

#### 2. useTranslation Hook

```typescript
const { locale, t, setLocale } = useTranslation();
```

Allows components to:
- Access current language
- Get translated strings
- Switch language

#### 3. Translation Files

Organized by feature modules:

```typescript
export const zh = {
  common: { confirm: '确认', cancel: '取消', ... },
  tabs: { home: '首页', settings: '设置' },
  home: { greeting: '您好！当前有{{count}}个提醒项目', ... },
  settings: { title: '项目管理', addProject: '+ 添加项目', ... },
  projects: { reminderTimes: '提醒时间', enabled: '已启用', ... },
  presets: {
    fistExercise: {
      name: '握拳练习',
      description: '缓慢握拳再放松，重复10-15次',
    },
    // ... more presets
  },
  speech: {
    todayProjectsIntro: '今天有{{count}}个提醒项目',
    projectReminder: '{{name}}，提醒时间：{{times}}',
  },
  // ... more modules
};
```

English translations mirror this structure exactly.

### Data Flow

```
App Launch
    ↓
LocaleProvider initializes
    ↓
Check AsyncStorage for saved locale
    ↓
If found → use saved locale
If not found → detect system language via expo-localization
    ↓
Load appropriate translation file (zh.ts or en.ts)
    ↓
Provide locale context to all components
    ↓
Components call t('key') to get translated text
    ↓
User changes language in Settings
    ↓
setLocale() called → save to AsyncStorage → update context
    ↓
All components re-render with new translations
```

## Implementation Details

### 1. Locale Initialization

```typescript
// src/i18n/index.ts
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'userLocale';

const initializeLocale = async (): Promise<'zh' | 'en'> => {
  // Check saved preference first
  const saved = await AsyncStorage.getItem(STORAGE_KEY);
  if (saved === 'zh' || saved === 'en') {
    return saved;
  }
  
  // Fallback to system language
  const systemLocale = Localization.getLocales()[0]?.languageCode;
  return systemLocale === 'zh' ? 'zh' : 'en'; // Default to English for non-Chinese systems
};
```

### 2. Translation Function

```typescript
const t = (key: string, params?: Record<string, any>): string => {
  const translations = locale === 'zh' ? zh : en;
  
  // Navigate nested keys (e.g., 'home.greeting')
  const value = key.split('.').reduce((obj, k) => obj?.[k], translations);
  
  if (typeof value !== 'string') {
    console.warn(`Translation missing: ${key}`);
    return key;
  }
  
  // Replace {{variable}} placeholders
  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (_, param) => params[param] ?? '');
  }
  
  return value;
};
```

### 3. Type Safety

```typescript
// src/i18n/types.ts
type TranslationKeys = {
  [K in keyof typeof zh]: typeof zh[K] extends object
    ? { [P in keyof typeof zh[K]]: string }
    : string;
};

// Ensure English translations match Chinese structure
const en: TranslationKeys = { /* ... */ };
```

TypeScript will error if:
- English translations are missing keys
- Keys have different nesting structure
- Values are wrong type

### 4. Settings Screen Integration

Add language selector:

```typescript
// src/screens/SettingsScreen.tsx
const { locale, setLocale, t } = useTranslation();

<View style={styles.section}>
  <Text style={CommonStyles.title}>{t('settings.languageSettings')}</Text>
  <Picker
    selectedValue={locale}
    onValueChange={(value) => setLocale(value)}
  >
    <Picker.Item label="中文" value="zh" />
    <Picker.Item label="English" value="en" />
  </Picker>
</View>
```

### 5. Preset Projects

Transform static preset list to function:

```typescript
// src/constants/presetProjects.ts
export const getPresetProjects = (t: (key: string) => string) => [
  {
    category: t('projects.rehabilitation'),
    items: [
      {
        id: 'fist-exercise',
        name: t('presets.fistExercise.name'),
        description: t('presets.fistExercise.description'),
        icon: '✊',
        defaultTimes: ['09:00', '15:00', '20:00'],
      },
      // ... more items
    ],
  },
  // ... more categories
];

// Usage in components:
const { t } = useTranslation();
const presets = getPresetProjects(t);
```

### 6. Voice Announcements

Update speech service to accept locale:

```typescript
// src/services/speechService.ts
import * as Speech from 'expo-speech';

export const speakTodayProjects = async (
  projects: Project[],
  t: (key: string, params?: any) => string,
  locale: 'zh' | 'en'
) => {
  const language = locale === 'zh' ? 'zh-CN' : 'en-US';
  
  if (projects.length === 0) {
    await Speech.speak(t('speech.noProjects'), { language });
    return;
  }
  
  const intro = t('speech.todayProjectsIntro', { count: projects.length });
  await Speech.speak(intro, { language });
  
  for (const project of projects) {
    const times = project.reminderTimes.join(', ');
    const text = t('speech.projectReminder', { 
      name: project.name, 
      times 
    });
    await Speech.speak(text, { language });
    
    // Small pause between projects
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};

// Usage in HomeScreen:
const { locale, t } = useTranslation();
speakTodayProjects(enabledProjects, t, locale);
```

### 7. Date Formatting

Update date helper for bilingual support:

```typescript
// src/utils/dateHelper.ts
export const formatDate = (date: Date, locale: 'zh' | 'en'): string => {
  if (locale === 'zh') {
    return formatChineseDate(date); // Existing function
  } else {
    return formatEnglishDate(date);
  }
};

const formatEnglishDate = (date: Date): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  return `${dayName}, ${monthName} ${day}, ${year}`;
};
```

### 8. Notification Messages

Update notification service:

```typescript
// src/services/notificationService.ts
export const scheduleProjectNotifications = async (
  project: Project,
  t: (key: string, params?: any) => string
) => {
  for (const time of project.reminderTimes) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('notifications.title'),
        body: t('notifications.body', { name: project.name }),
      },
      trigger: { /* ... */ },
    });
  }
};
```

### 9. User-Created vs Preset Projects

**Challenge:** User-created projects should keep their original language, while preset-based projects should translate.

**Solution:** Add `presetId` field to Project type:

```typescript
// src/types/index.ts
export interface Project {
  id: string;
  name: string;
  description: string;
  presetId?: string;  // NEW: identifies if created from preset
  // ... other fields
}
```

**Display Logic:**

```typescript
// In ProjectCard or display components
const displayName = project.presetId 
  ? t(`presets.${project.presetId}.name`)
  : project.name;

const displayDescription = project.presetId
  ? t(`presets.${project.presetId}.description`)
  : project.description;
```

This allows:
- Preset projects to display in current language
- User custom projects to show exactly as entered
- Seamless language switching for preset content

## Edge Cases & Considerations

### 1. System Language Detection

- If system language is Chinese (zh, zh-CN, zh-TW) → use Chinese
- All other languages → default to English
- User can always override in Settings

### 2. Language Switching

- Switching language triggers immediate re-render of all components
- No app restart required
- AsyncStorage ensures preference persists across app restarts

### 3. Existing User Data

- Projects created before i18n implementation continue working
- No migration needed
- Missing `presetId` field means treat as custom project (don't translate)

### 4. Missing Translations

- Translation function logs warning and returns the key itself
- App remains functional even with missing translations
- TypeScript catches missing keys at compile time

### 5. Notification Language

- Notifications use language active when scheduled
- Changing language requires re-saving projects to update notifications
- This is acceptable behavior (happens automatically when user edits)

### 6. Date Formatting Edge Cases

- All dates use locale-aware formatting
- Time format (24-hour) remains consistent across languages
- Week starts on Monday in both languages

## Testing Strategy

### Manual Testing Checklist

1. **Initial Launch**
   - [ ] App detects system language correctly
   - [ ] Chinese system → shows Chinese
   - [ ] English/other system → shows English

2. **Language Switching**
   - [ ] Can switch to Chinese in Settings
   - [ ] Can switch to English in Settings
   - [ ] All UI updates immediately
   - [ ] Choice persists after app restart

3. **Preset Projects**
   - [ ] Preset names translate correctly
   - [ ] Preset descriptions translate correctly
   - [ ] Categories translate correctly

4. **Custom Projects**
   - [ ] User-entered names don't change
   - [ ] User-entered descriptions don't change

5. **Voice Announcements**
   - [ ] Chinese UI → Chinese voice
   - [ ] English UI → English voice
   - [ ] Content translates correctly

6. **Notifications**
   - [ ] Notification titles translate
   - [ ] Notification bodies translate
   - [ ] Project names display correctly

7. **Date Display**
   - [ ] Home screen date format matches language
   - [ ] Chinese: YYYY年MM月DD日 星期X
   - [ ] English: Weekday, Month Day, Year

## Migration Path

### Phase 1: Foundation (No user impact)
1. Install expo-localization (already in Expo SDK)
2. Create i18n infrastructure (Context, translations, types)
3. Add LocaleProvider to App.tsx

### Phase 2: UI Translation (Gradual rollout)
1. Replace hardcoded strings in SettingsScreen
2. Replace strings in HomeScreen
3. Replace strings in AddProjectScreen
4. Replace strings in ManageProjectsScreen
5. Replace strings in common components

### Phase 3: Dynamic Content
1. Update preset projects to use translation function
2. Update speech service for bilingual announcements
3. Update notification service for translated messages
4. Update date formatting

### Phase 4: Settings UI
1. Add language selector to SettingsScreen
2. Test language switching end-to-end

Each phase is independently testable and deployable.

## Dependencies

- `expo-localization` - Already included in Expo SDK, no installation needed
- No additional npm packages required

## Open Questions

None - all requirements clarified during design phase.

## Future Considerations

### If Adding More Languages

Current architecture supports adding more languages easily:

1. Add new translation file (e.g., `ja.ts` for Japanese)
2. Update locale type: `'zh' | 'en' | 'ja'`
3. Add picker item in Settings
4. Add voice language mapping in speech service

No architectural changes needed.

### Advanced Features (YAGNI for now)

- Pluralization rules (e.g., "1 project" vs "2 projects")
- Date/time localization beyond formatting
- Right-to-left language support
- Translation management tools

These can be added later if needed, but current requirements don't justify the complexity.

## Success Metrics

1. **Functional Completeness**: All UI text translates correctly
2. **User Experience**: Language switch happens instantly with no lag
3. **Data Integrity**: No user data lost or corrupted during migration
4. **Code Quality**: TypeScript catches missing translations at compile time
5. **Maintainability**: Adding new strings requires <5 minutes

## Approval

Design approved for implementation on: [Pending user review]
