# Project Completion Tracking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add completion tracking and statistics to projects, allowing users to mark projects as completed for today and view completion statistics.

**Architecture:** Extend Project interface with completionHistory array storing date strings (YYYY-MM-DD format). Add toggle completion method in AppContext, completion UI in ProjectCard with stats display, and filter toggle in HomeScreen to show/hide today's completed projects.

**Tech Stack:** React Native, TypeScript, AsyncStorage, date-fns for date utilities

---

## File Structure

**Modified files:**
- `src/types/index.ts` - Add completionHistory field to Project interface
- `src/utils/dateHelper.ts` - Add completion statistics utilities
- `src/i18n/translations/zh.ts` - Add completion-related translations
- `src/i18n/translations/en.ts` - Add completion-related translations
- `src/storage/projectStorage.ts` - Add migration to initialize completionHistory
- `src/context/AppContext.tsx` - Add toggleProjectCompletion method
- `src/components/ProjectCard.tsx` - Add completion button and statistics display
- `src/screens/HomeScreen.tsx` - Add filter toggle for completed projects

---

### Task 1: Update Type Definitions

**Files:**
- Modify: `src/types/index.ts:1-10`

- [ ] **Step 1: Add completionHistory field to Project interface**

```typescript
export interface Project {
  id: string;
  name: string;
  description: string;
  isPreset: boolean;
  isEnabled: boolean;
  reminderTimes: string[];
  createdAt: number;
  presetId?: string;  // identifies if created from preset
  completionHistory: string[];  // Array of completion dates in YYYY-MM-DD format
}
```

- [ ] **Step 2: Commit type changes**

```bash
git add src/types/index.ts
git commit -m "feat(types): add completionHistory field to Project interface"
```

---

### Task 2: Add Date Utility Functions

**Files:**
- Modify: `src/utils/dateHelper.ts:113-end`

- [ ] **Step 1: Add getTodayDateString function**

Add after the parseTimeToToday function:

```typescript
/**
 * 获取今天的日期字符串 (YYYY-MM-DD format)
 */
export const getTodayDateString = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};
```

- [ ] **Step 2: Add getWeekStartDateString function**

```typescript
/**
 * 获取本周一的日期字符串 (YYYY-MM-DD format)
 */
export const getWeekStartDateString = (): string => {
  return format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
};
```

- [ ] **Step 3: Add isCompletedToday function**

```typescript
/**
 * 检查项目今天是否已完成
 */
export const isCompletedToday = (completionHistory: string[]): boolean => {
  const today = getTodayDateString();
  return completionHistory.includes(today);
};
```

- [ ] **Step 4: Add getCompletionStats function**

```typescript
/**
 * 获取完成统计信息
 */
export const getCompletionStats = (completionHistory: string[]): { total: number; thisWeek: number } => {
  const total = completionHistory.length;
  const weekStart = getWeekStartDateString();
  const thisWeek = completionHistory.filter(date => date >= weekStart).length;
  return { total, thisWeek };
};
```

- [ ] **Step 5: Commit date utilities**

```bash
git add src/utils/dateHelper.ts
git commit -m "feat(utils): add completion tracking date utilities"
```

---

### Task 3: Add Chinese Translations

**Files:**
- Modify: `src/i18n/translations/zh.ts`

- [ ] **Step 1: Add home section completion translations**

Find the `home` section and add new keys after existing ones:

```typescript
  home: {
    greeting: '今天有 {{count}} 个提醒项目',
    greetingEmpty: '今天没有提醒项目',
    emptyState: '还没有添加任何项目',
    emptyHint: '点击设置页面的"管理项目"开始添加',
    showAll: '显示全部',
    hideCompleted: '隐藏已完成',
  },
```

- [ ] **Step 2: Add projects section completion translations**

Find the `projects` section and add:

```typescript
  projects: {
    reminderTimes: '提醒时间',
    completed: '已完成',
    notCompleted: '未完成',
    markCompleted: '标记完成',
    markIncomplete: '标记未完成',
    completionStats: '完成 {{thisWeek}}/本周 · {{total}}/总计',
  },
```

- [ ] **Step 3: Commit Chinese translations**

```bash
git add src/i18n/translations/zh.ts
git commit -m "feat(i18n): add completion tracking translations (zh)"
```

---

### Task 4: Add English Translations

**Files:**
- Modify: `src/i18n/translations/en.ts`

- [ ] **Step 1: Add home section completion translations**

Find the `home` section and add new keys after existing ones:

```typescript
  home: {
    greeting: 'You have {{count}} reminder projects today',
    greetingEmpty: 'No reminder projects today',
    emptyState: 'No projects added yet',
    emptyHint: 'Go to Settings → Manage Projects to add one',
    showAll: 'Show All',
    hideCompleted: 'Hide Completed',
  },
```

- [ ] **Step 2: Add projects section completion translations**

Find the `projects` section and add:

```typescript
  projects: {
    reminderTimes: 'Reminder Times',
    completed: 'Completed',
    notCompleted: 'Not Completed',
    markCompleted: 'Mark Completed',
    markIncomplete: 'Mark Incomplete',
    completionStats: 'Completed {{thisWeek}}/Week · {{total}}/Total',
  },
```

- [ ] **Step 3: Commit English translations**

```bash
git add src/i18n/translations/en.ts
git commit -m "feat(i18n): add completion tracking translations (en)"
```

---

### Task 5: Implement Storage Migration

**Files:**
- Modify: `src/storage/projectStorage.ts:16-24`

- [ ] **Step 1: Add migration function**

Add after the generateId function:

```typescript
/**
 * 迁移项目数据：添加 completionHistory 字段
 */
const migrateProjects = (projects: any[]): Project[] => {
  return projects.map(project => ({
    ...project,
    completionHistory: project.completionHistory || [],
  }));
};
```

- [ ] **Step 2: Update getProjects to use migration**

Replace the getProjects function:

```typescript
/**
 * 获取所有项目
 */
export const getProjects = async (): Promise<Project[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    const rawProjects = data ? JSON.parse(data) : [];
    return migrateProjects(rawProjects);
  } catch (error) {
    console.error('Failed to get projects:', error);
    return [];
  }
};
```

- [ ] **Step 3: Commit storage migration**

```bash
git add src/storage/projectStorage.ts
git commit -m "feat(storage): add migration for completionHistory field"
```

---

### Task 6: Add Context Method for Toggle Completion

**Files:**
- Modify: `src/context/AppContext.tsx:8-17` (interface)
- Modify: `src/context/AppContext.tsx:118-end` (implementation)

- [ ] **Step 1: Import date utilities**

Add to imports at top of file:

```typescript
import { getTodayDateString, isCompletedToday } from '../utils/dateHelper';
```

- [ ] **Step 2: Add toggleProjectCompletion to interface**

In the AppContextType interface, add after toggleProjectEnabled:

```typescript
interface AppContextType {
  state: AppState;
  loading: boolean;
  refreshProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  toggleProjectEnabled: (id: string) => Promise<void>;
  toggleProjectCompletion: (id: string) => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
}
```

- [ ] **Step 3: Implement toggleProjectCompletion method**

Add after the toggleProjectEnabled function:

```typescript
  const toggleProjectCompletion = async (id: string) => {
    const project = state.projects.find((proj) => proj.id === id);
    if (!project) return;

    const today = getTodayDateString();
    const completionHistory = [...project.completionHistory];
    
    if (isCompletedToday(completionHistory)) {
      // Remove today's completion
      const filtered = completionHistory.filter(date => date !== today);
      await updateProject(id, { completionHistory: filtered });
    } else {
      // Add today's completion
      completionHistory.push(today);
      await updateProject(id, { completionHistory });
    }
  };
```

- [ ] **Step 4: Add to context value**

Update the value object to include toggleProjectCompletion:

```typescript
  const value: AppContextType = {
    state,
    loading,
    refreshProjects,
    addProject,
    updateProject,
    deleteProject,
    toggleProjectEnabled,
    toggleProjectCompletion,
    updateSettings,
  };
```

- [ ] **Step 5: Commit context changes**

```bash
git add src/context/AppContext.tsx
git commit -m "feat(context): add toggleProjectCompletion method"
```

---

### Task 7: Update ProjectCard with Completion UI

**Files:**
- Modify: `src/components/ProjectCard.tsx:1-50`

- [ ] **Step 1: Add imports**

Update imports:

```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Project } from '../types';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';
import { useTranslation } from '../i18n';
import { useApp } from '../context/AppContext';
import { isCompletedToday, getCompletionStats } from '../utils/dateHelper';
```

- [ ] **Step 2: Update component to use toggleProjectCompletion**

Replace the component implementation:

```typescript
export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();
  const { toggleProjectCompletion } = useApp();

  // Use translations for preset projects, original text for custom projects
  const displayName = project.presetId
    ? t(`presets.${project.presetId}.name`)
    : project.name;

  const displayDescription = project.presetId
    ? t(`presets.${project.presetId}.description`)
    : project.description;

  const completed = isCompletedToday(project.completionHistory);
  const stats = getCompletionStats(project.completionHistory);

  const handleToggleCompletion = async () => {
    await toggleProjectCompletion(project.id);
  };
```

- [ ] **Step 3: Update render to add completion button**

Continue the component:

```typescript
  return (
    <View style={CommonStyles.card}>
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <View style={styles.content}>
            <Text style={CommonStyles.title}>{displayName}</Text>
            {project.reminderTimes.length > 0 && (
              <Text style={styles.reminderText}>
                ⏰ {project.reminderTimes.join(', ')}
              </Text>
            )}
            {stats.total > 0 && (
              <Text style={styles.statsText}>
                {t('projects.completionStats', { thisWeek: stats.thisWeek, total: stats.total })}
              </Text>
            )}
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.completionButton, completed && styles.completionButtonActive]}
              onPress={handleToggleCompletion}
              activeOpacity={0.7}
            >
              <Text style={[styles.completionIcon, completed && styles.completionIconActive]}>
                ✓
              </Text>
            </TouchableOpacity>
            <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.descriptionContainer}>
            <View style={styles.divider} />
            <Text style={styles.descriptionText}>{displayDescription}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};
```

- [ ] **Step 4: Update styles for completion UI**

Replace the styles:

```typescript
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  reminderText: {
    fontSize: 16,
    color: Colors.primary,
    marginTop: 8,
  },
  statsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  completionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionButtonActive: {
    borderColor: Colors.success,
    backgroundColor: Colors.success,
  },
  completionIcon: {
    fontSize: 18,
    color: Colors.border,
    fontWeight: 'bold',
  },
  completionIconActive: {
    color: '#FFFFFF',
  },
  expandIcon: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  descriptionContainer: {
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
});
```

- [ ] **Step 5: Commit ProjectCard changes**

```bash
git add src/components/ProjectCard.tsx
git commit -m "feat(components): add completion button and stats to ProjectCard"
```

---

### Task 8: Add Filter Toggle to HomeScreen

**Files:**
- Modify: `src/screens/HomeScreen.tsx:1-86`

- [ ] **Step 1: Add imports**

Update imports to include Switch and date helper:

```typescript
import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Switch } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { ProjectCard } from '../components/ProjectCard';
import { Colors } from '../constants/colors';
import { CommonStyles } from '../constants/styles';
import { formatDate } from '../utils/dateHelper';
import { speakTodayProjects } from '../services/speechService';
import { useTranslation } from '../i18n';
import { isCompletedToday } from '../utils/dateHelper';
```

- [ ] **Step 2: Add hideCompleted state**

Add after the hasSpokenToday ref:

```typescript
  const [hideCompleted, setHideCompleted] = useState(false);
```

- [ ] **Step 3: Update project filtering logic**

Replace the enabledProjects and totalProjects lines:

```typescript
  const enabledProjects = state.projects.filter((proj) => proj.isEnabled);
  
  const visibleProjects = hideCompleted
    ? enabledProjects.filter(proj => !isCompletedToday(proj.completionHistory))
    : enabledProjects;
  
  const totalProjects = enabledProjects.length;
  const completedToday = enabledProjects.filter(proj => isCompletedToday(proj.completionHistory)).length;
```

- [ ] **Step 4: Add filter toggle UI**

Replace the return statement with this updated version that includes the toggle:

```typescript
  return (
    <View style={CommonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={CommonStyles.title}>{formatDate(new Date(), locale)}</Text>
            <Text style={[CommonStyles.body, styles.greeting]}>{getGreeting()}</Text>
          </View>
          
          {enabledProjects.length > 0 && (
            <View style={styles.filterContainer}>
              <Text style={styles.filterLabel}>
                {hideCompleted ? t('home.hideCompleted') : t('home.showAll')}
              </Text>
              <Switch
                value={hideCompleted}
                onValueChange={setHideCompleted}
                trackColor={{ false: Colors.neutral, true: Colors.primary }}
              />
            </View>
          )}
        </View>

        {visibleProjects.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>
              {enabledProjects.length === 0 ? '📝' : '✅'}
            </Text>
            <Text style={[CommonStyles.body, styles.emptyText]}>
              {enabledProjects.length === 0 
                ? t('home.emptyState')
                : hideCompleted 
                  ? t('home.allCompletedToday', { count: completedToday })
                  : t('home.emptyState')
              }
            </Text>
            {enabledProjects.length === 0 && (
              <Text style={[CommonStyles.smallBody, styles.emptyHint]}>
                {t('home.emptyHint')}
              </Text>
            )}
          </View>
        ) : (
          visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
```

- [ ] **Step 5: Update styles for filter toggle**

Update the styles object:

```typescript
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
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
  },
  filterLabel: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyHint: {
    textAlign: 'center',
    color: Colors.textDisabled,
  },
});
```

- [ ] **Step 6: Add missing translation key for allCompletedToday**

Need to add this key to both translation files first. Edit `src/i18n/translations/zh.ts`:

```typescript
  home: {
    greeting: '今天有 {{count}} 个提醒项目',
    greetingEmpty: '今天没有提醒项目',
    emptyState: '还没有添加任何项目',
    emptyHint: '点击设置页面的"管理项目"开始添加',
    showAll: '显示全部',
    hideCompleted: '隐藏已完成',
    allCompletedToday: '太棒了！今天的 {{count}} 个项目都已完成',
  },
```

- [ ] **Step 7: Add missing translation key for allCompletedToday (English)**

Edit `src/i18n/translations/en.ts`:

```typescript
  home: {
    greeting: 'You have {{count}} reminder projects today',
    greetingEmpty: 'No reminder projects today',
    emptyState: 'No projects added yet',
    emptyHint: 'Go to Settings → Manage Projects to add one',
    showAll: 'Show All',
    hideCompleted: 'Hide Completed',
    allCompletedToday: 'Great! All {{count}} projects completed today',
  },
```

- [ ] **Step 8: Commit all HomeScreen changes**

```bash
git add src/screens/HomeScreen.tsx src/i18n/translations/zh.ts src/i18n/translations/en.ts
git commit -m "feat(home): add filter toggle to show/hide completed projects"
```

---

### Task 9: Manual Integration Testing

**Files:**
- Test in app manually

- [ ] **Step 1: Start the app and verify migration**

```bash
npm start
```

Expected: App starts without errors, existing projects have empty completionHistory arrays

- [ ] **Step 2: Test marking a project as completed**

1. Open the app
2. Click the ✓ button on a project card
3. Verify the button turns green and filled
4. Verify stats appear showing "1/Week · 1/Total"

Expected: Project marked as completed for today

- [ ] **Step 3: Test unmarking completion**

1. Click the green ✓ button again
2. Verify button returns to gray outline
3. Verify stats update or disappear if total is 0

Expected: Today's completion removed

- [ ] **Step 4: Test filter toggle**

1. Mark some projects as completed
2. Toggle the "Hide Completed" switch
3. Verify completed projects disappear
4. Toggle back to "Show All"
5. Verify all projects reappear

Expected: Filter works correctly

- [ ] **Step 5: Test stats accumulation**

1. Mark a project completed
2. Close and reopen the app (simulate next day by changing device date)
3. Mark the same project completed again
4. Verify stats show "2/Week · 2/Total" (or "1/Week · 2/Total" if weeks differ)

Expected: Completion history persists and accumulates

- [ ] **Step 6: Test empty states**

1. Toggle "Hide Completed" when all projects are completed
2. Verify "All X projects completed today" message appears
3. Test with no projects at all
4. Verify original empty state message

Expected: Appropriate empty state messages

- [ ] **Step 7: Test multilingual support**

1. Switch language to English in Settings
2. Verify all completion UI is translated
3. Switch back to Chinese
4. Verify translations

Expected: All text properly localized

- [ ] **Step 8: Document testing results**

Create a simple test report noting any issues found.

Expected: All features working as designed, or issues documented for follow-up

---

## Self-Review Checklist

**Spec coverage:**
- ✅ Project can be marked completed/uncompleted for today
- ✅ Completion history persisted in completionHistory array
- ✅ Statistics shown (total completions, this week completions)
- ✅ Filter toggle to hide completed projects
- ✅ Today's completed projects can be hidden
- ✅ Completion state resets daily (automatically via date check)
- ✅ Multilingual support for all new UI text

**No placeholders:**
- ✅ All code blocks contain actual implementation
- ✅ All translation keys defined with actual text
- ✅ All file paths are exact
- ✅ All commands include expected output

**Type consistency:**
- ✅ completionHistory: string[] used consistently
- ✅ Method names consistent: toggleProjectCompletion, isCompletedToday, getCompletionStats
- ✅ Translation keys follow established patterns

**Architecture alignment:**
- ✅ Follows existing patterns in codebase
- ✅ Uses established utilities (date-fns)
- ✅ Maintains separation of concerns (storage, context, components)
- ✅ No breaking changes to existing functionality
