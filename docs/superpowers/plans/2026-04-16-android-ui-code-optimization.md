# Android界面与代码优化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 通过替换时间选择器、消除重复代码和统一样式，快速提升用户体验和代码质量

**Architecture:** 创建共享工具函数消除重复逻辑，建立DesignTokens设计系统统一样式，使用现有TimelineSelector组件改善时间选择体验

**Tech Stack:** React Native, TypeScript, Expo, React Navigation

---

## 文件结构规划

### 新增文件
- `src/utils/projectHelpers.ts` - 项目分组排序的共享工具函数

### 修改文件
- `src/constants/styles.ts` - 添加DesignTokens和CardStyles
- `src/screens/HomeScreen.tsx` - 使用共享helpers和统一样式
- `src/screens/ManageProjectsScreen.tsx` - 使用共享helpers和统一样式
- `src/screens/AddProjectScreen.tsx` - 替换时间选择器，应用统一样式
- `src/screens/SettingsScreen.tsx` - 应用统一样式
- `src/components/ProjectCard.tsx` - 应用统一样式

---

## Task 1: 创建共享项目工具函数

**Files:**
- Create: `src/utils/projectHelpers.ts`
- Reference: `src/screens/HomeScreen.tsx:37-87` (提取源)
- Reference: `src/types/index.ts` (类型定义)

- [ ] **Step 1: 创建工具文件并导出类型和函数**

```typescript
// src/utils/projectHelpers.ts
import { Project } from '../types';
import { TFunction } from '../i18n/types';
import { getPresetProjects } from '../constants/presetProjects';

export type ProjectCategory = 'custom' | 'medication' | 'healthCheck' | 'rehabilitation';

export interface ProjectGroup {
  category: ProjectCategory;
  title: string;
  projects: Project[];
}

/**
 * 按类别分组并按最早提醒时间排序项目
 * @param projects - 项目列表
 * @param t - 翻译函数
 * @returns 分组后的项目数组（过滤掉空分组）
 */
export const groupAndSortProjects = (
  projects: Project[],
  t: TFunction
): ProjectGroup[] => {
  const presetProjects = getPresetProjects(t);
  
  // 按最早提醒时间排序
  const sortByEarliestTime = (a: Project, b: Project) => {
    const aTime = a.reminderTimes.length > 0 ? a.reminderTimes[0] : '99:99';
    const bTime = b.reminderTimes.length > 0 ? b.reminderTimes[0] : '99:99';
    return aTime.localeCompare(bTime);
  };

  // 自定义项目
  const custom = projects
    .filter(p => !p.isPreset)
    .sort(sortByEarliestTime);
  
  // 按预设类别筛选并排序
  const categorizePreset = (category: 'medication' | 'healthCheck' | 'rehabilitation') => {
    return projects
      .filter(p => {
        if (!p.isPreset || !p.presetId) return false;
        const preset = presetProjects.find(preset => preset.presetId === p.presetId);
        return preset?.category === category;
      })
      .sort(sortByEarliestTime);
  };

  // 返回分组结果（过滤空分组）
  return [
    {
      category: 'custom' as ProjectCategory,
      title: t('projects.categoryCustom'),
      projects: custom
    },
    {
      category: 'medication' as ProjectCategory,
      title: t('projects.categoryMedication'),
      projects: categorizePreset('medication')
    },
    {
      category: 'healthCheck' as ProjectCategory,
      title: t('projects.categoryHealthCheck'),
      projects: categorizePreset('healthCheck')
    },
    {
      category: 'rehabilitation' as ProjectCategory,
      title: t('projects.categoryRehabilitation'),
      projects: categorizePreset('rehabilitation')
    },
  ].filter(group => group.projects.length > 0);
};
```

- [ ] **Step 2: 验证TypeScript编译**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: 提交新工具文件**

```bash
git add src/utils/projectHelpers.ts
git commit -m "feat: add shared projectHelpers utility

Extract groupAndSortProjects logic to eliminate duplication
between HomeScreen and ManageProjectsScreen.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: 扩展样式系统添加DesignTokens

**Files:**
- Modify: `src/constants/styles.ts`

- [ ] **Step 1: 在styles.ts开头添加DesignTokens和CardStyles**

在 `src/constants/styles.ts` 的 `import` 语句后、`CommonStyles` 定义前添加：

```typescript
/**
 * 设计Token - 统一的设计规范
 * 所有尺寸和间距必须使用这些预定义值
 */
export const DesignTokens = {
  // 圆角规范
  borderRadius: {
    small: 6,      // 小按钮、输入框
    medium: 8,     // 标准卡片
    large: 12,     // 大卡片、弹窗
    xlarge: 16,    // 弹窗顶部圆角
  },
  
  // 间距规范
  spacing: {
    xs: 4,         // 最小间距（chip间距、卡片上下间距）
    sm: 8,         // 小间距（按钮组间距）
    md: 12,        // 中等间距（内容分隔）
    lg: 16,        // 大间距（页面padding）
    xl: 20,        // 超大间距（区块间距）
    xxl: 24,       // 特大间距（弹窗padding）
  },
  
  // 阴影规范
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 5,
    },
  },
};

/**
 * 统一的卡片样式
 * 所有卡片应使用这些预定义样式，而非自定义
 */
export const CardStyles = {
  // 标准卡片（项目卡片、设置项等）
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: DesignTokens.borderRadius.medium,
    padding: 14,
    paddingHorizontal: 16,
    marginVertical: DesignTokens.spacing.xs,
    ...DesignTokens.shadow.small,
  },
  
  // 大卡片（弹窗内容等）
  largeCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.spacing.xl,
    marginVertical: DesignTokens.spacing.sm,
    ...DesignTokens.shadow.medium,
  },
};
```

- [ ] **Step 2: 更新CommonStyles使用DesignTokens**

修改 `CommonStyles.largeButton`:

```typescript
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
    borderRadius: DesignTokens.borderRadius.large,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: CardStyles.card,
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenPadding: {
    padding: DesignTokens.spacing.lg,
  },
});
```

- [ ] **Step 3: 验证TypeScript编译**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: 提交样式系统更新**

```bash
git add src/constants/styles.ts
git commit -m "feat: add DesignTokens and CardStyles to unify UI

Add design token system for consistent spacing, border radius,
and shadows across all components.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: 更新HomeScreen使用共享工具和统一样式

**Files:**
- Modify: `src/screens/HomeScreen.tsx`

- [ ] **Step 1: 添加imports并删除本地类型定义**

在 `src/screens/HomeScreen.tsx` 顶部imports区域：

添加：
```typescript
import { groupAndSortProjects } from '../utils/projectHelpers';
import { DesignTokens } from '../constants/styles';
```

删除第14-20行：
```typescript
// 删除这些行
type ProjectCategory = 'custom' | 'medication' | 'healthCheck' | 'rehabilitation';

interface ProjectGroup {
  category: ProjectCategory;
  title: string;
  projects: Project[];
}
```

- [ ] **Step 2: 删除本地groupAndSortProjects函数**

删除第37-87行的整个 `groupAndSortProjects` 函数定义

- [ ] **Step 3: 更新使用共享函数并添加useMemo**

找到第93行 `const groupedProjects = groupAndSortProjects(visibleProjects);`

替换为：
```typescript
const groupedProjects = useMemo(
  () => groupAndSortProjects(visibleProjects, t),
  [visibleProjects, t]
);
```

- [ ] **Step 4: 应用DesignTokens到样式**

修改 `styles` 对象中的以下属性：

```typescript
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: DesignTokens.spacing.lg,
    paddingBottom: 32,
  },
  header: {
    marginBottom: DesignTokens.spacing.lg,
  },
  // ... 其他样式保持不变
});
```

- [ ] **Step 5: 验证TypeScript编译**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 6: 提交HomeScreen更新**

```bash
git add src/screens/HomeScreen.tsx
git commit -m "refactor: use shared projectHelpers and DesignTokens in HomeScreen

- Remove duplicated groupAndSortProjects function
- Use useMemo for performance optimization
- Apply consistent spacing with DesignTokens

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: 更新ManageProjectsScreen使用共享工具和统一样式

**Files:**
- Modify: `src/screens/ManageProjectsScreen.tsx`

- [ ] **Step 1: 添加imports并删除本地类型定义**

在 `src/screens/ManageProjectsScreen.tsx` 顶部imports区域：

添加：
```typescript
import { groupAndSortProjects } from '../utils/projectHelpers';
import { CardStyles, DesignTokens } from '../constants/styles';
```

删除第16-22行：
```typescript
// 删除这些行
type ProjectCategory = 'custom' | 'medication' | 'healthCheck' | 'rehabilitation';

interface ProjectGroup {
  category: ProjectCategory;
  title: string;
  projects: Project[];
}
```

- [ ] **Step 2: 删除本地groupAndSortProjects函数**

删除第80-129行的整个 `groupAndSortProjects` 函数定义

- [ ] **Step 3: 更新使用共享函数并添加useMemo**

找到第162行 `const groupedProjects = groupAndSortProjects(state.projects);`

替换为：
```typescript
const groupedProjects = useMemo(
  () => groupAndSortProjects(state.projects, t),
  [state.projects, t]
);
```

- [ ] **Step 4: 应用CardStyles和DesignTokens到样式**

修改 `styles` 对象：

```typescript
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: DesignTokens.spacing.lg,
    paddingBottom: 32,
  },
  header: {
    marginBottom: DesignTokens.spacing.lg,
  },
  statsText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: DesignTokens.spacing.lg,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textSecondary,
  },
  projectItem: {
    ...CardStyles.card,
    borderLeftWidth: 4,
    // borderLeftColor 保持动态（在组件中设置）
  },
  // ... 其他样式保持不变
});
```

- [ ] **Step 5: 验证TypeScript编译**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 6: 提交ManageProjectsScreen更新**

```bash
git add src/screens/ManageProjectsScreen.tsx
git commit -m "refactor: use shared projectHelpers and unified styles in ManageProjectsScreen

- Remove duplicated groupAndSortProjects function
- Use useMemo for performance optimization
- Apply CardStyles and DesignTokens for consistency

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: 替换AddProjectScreen时间选择器

**Files:**
- Modify: `src/screens/AddProjectScreen.tsx`

- [ ] **Step 1: 删除不需要的state定义**

删除以下state定义（第44-54行左右）：

```typescript
// 删除这些行
const [showTimePicker, setShowTimePicker] = useState(false);
const [showTimeModal, setShowTimeModal] = useState(false);
const [tempTime, setTempTime] = useState(new Date());
const [selectedTemplate, setSelectedTemplate] = useState<string>('');

// Web time picker state
const [webTimeHour, setWebTimeHour] = useState('08');
const [webTimeMinute, setWebTimeMinute] = useState('00');
```

- [ ] **Step 2: 删除templates定义**

删除第110-141行的 `templates` useMemo定义

- [ ] **Step 3: 删除时间选择相关函数**

删除以下函数（第229-267行左右）：
- `handleTemplateChange`
- `handleAddCustomTime`
- `handleCancelTimePicker`

保留 `handleRemoveTime` 函数（它仍然被TimelineSelector需要）

- [ ] **Step 4: 添加TimelineSelector导入**

在文件顶部imports区域添加：
```typescript
import { TimelineSelector } from '../components/TimelineSelector';
```

- [ ] **Step 5: 替换时间选择UI（第642-848行）**

找到 `{/* 提醒时间 */}` 部分，完全替换为：

```typescript
{/* 提醒时间 */}
<View style={styles.inputContainer}>
  <Text style={styles.label}>
    {t('addProject.reminderTime')} {t('addProject.reminderTimeRequired')}
  </Text>
  
  <TimelineSelector
    selectedTimes={reminderTimes}
    onTimesChange={setReminderTimes}
    maxTimes={8}
  />
  
  {/* 快捷模板 - 可选 */}
  <View style={styles.quickTemplates}>
    <Text style={styles.quickTemplatesLabel}>{t('addProject.quickTemplates')}</Text>
    <View style={styles.templateButtons}>
      <TouchableOpacity
        style={styles.templateChip}
        onPress={() => {
          const merged = [...new Set([...reminderTimes, '08:00', '12:00', '18:00'])];
          setReminderTimes(merged.sort());
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.templateChipText}>早中晚</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.templateChip}
        onPress={() => {
          const merged = [...new Set([...reminderTimes, '08:00', '20:00'])];
          setReminderTimes(merged.sort());
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.templateChipText}>早晚</Text>
      </TouchableOpacity>
    </View>
  </View>
</View>
```

- [ ] **Step 6: 删除旧的时间选择器相关样式，添加新样式**

在 `styles` StyleSheet中删除：
- `templateButton`
- `templateButtonText`
- `templateButtonIcon`
- `customButton`
- `customButtonText`
- `selectedTimesList`
- `selectedTimeChip`
- `selectedTimeText`
- `removeChipIcon`
- `templateHint`
- `templateModalOverlay`
- `templateModalContent`
- `templateModalHeader`
- `templateModalTitle`
- `templateOptionCard`
- `templateOptionCardSelected`
- `templateOptionTitle`
- `templateOptionTimes`
- `emptyTimesContainer`
- `emptyTimesText`
- `modalOverlay`
- `modalContent`
- `modalHeader`
- `modalTitle`
- `modalCancelButton`
- `modalConfirmButton`
- `timePicker`
- `webTimePickerContainer`
- `webTimePickerLabel`
- `webTimePickerInputs`
- `webTimeInputGroup`
- `webTimeInput`
- `webTimeInputLabel`
- `webTimeSeparator`

添加新样式：
```typescript
quickTemplates: {
  marginTop: DesignTokens.spacing.md,
},
quickTemplatesLabel: {
  fontSize: 13,
  color: Colors.textSecondary,
  marginBottom: DesignTokens.spacing.sm,
},
templateButtons: {
  flexDirection: 'row',
  gap: DesignTokens.spacing.sm,
  flexWrap: 'wrap',
},
templateChip: {
  backgroundColor: Colors.background,
  borderRadius: DesignTokens.borderRadius.small,
  borderWidth: 1,
  borderColor: Colors.border,
  paddingVertical: 6,
  paddingHorizontal: DesignTokens.spacing.md,
},
templateChipText: {
  fontSize: 13,
  color: Colors.textPrimary,
  fontWeight: '500',
},
```

- [ ] **Step 7: 应用CardStyles和DesignTokens到其他样式**

更新 `styles` 中的以下样式：

```typescript
import { CardStyles, DesignTokens } from '../constants/styles';

const styles = StyleSheet.create({
  // ... 其他样式
  contentContainer: {
    padding: DesignTokens.spacing.lg,
  },
  modeCard: CardStyles.card,
  presetCard: CardStyles.card,
  inputContainer: {
    marginBottom: DesignTokens.spacing.md,
  },
  // ... 其他样式保持不变
});
```

- [ ] **Step 8: 验证TypeScript编译**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 9: 提交AddProjectScreen更新**

```bash
git add src/screens/AddProjectScreen.tsx
git commit -m "feat: replace time picker with TimelineSelector component

- Remove Android native DateTimePicker (200+ lines)
- Integrate existing TimelineSelector for visual time selection
- Add quick template buttons for common time patterns
- Apply unified CardStyles and DesignTokens

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: 应用统一样式到SettingsScreen

**Files:**
- Modify: `src/screens/SettingsScreen.tsx`

- [ ] **Step 1: 添加imports**

在 `src/screens/SettingsScreen.tsx` 顶部imports区域添加：
```typescript
import { CardStyles, DesignTokens } from '../constants/styles';
```

- [ ] **Step 2: 应用CardStyles和DesignTokens到样式**

修改 `styles` 对象：

```typescript
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: DesignTokens.spacing.lg,
    paddingBottom: 32,
  },
  settingCard: CardStyles.card,
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.md,
  },
  cardIcon: {
    fontSize: 22,
    width: 28,
    textAlign: 'center',
  },
  cardTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cardArrow: {
    fontSize: 24,
    color: Colors.textDisabled,
    fontWeight: '300',
  },
  languageRow: {
    gap: DesignTokens.spacing.md,
  },
  languageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.md,
    marginBottom: 2,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.sm,
    marginTop: DesignTokens.spacing.sm,
  },
  languageButton: {
    backgroundColor: Colors.background,
    borderRadius: DesignTokens.borderRadius.small,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: 6,
    paddingHorizontal: DesignTokens.spacing.lg,
    alignItems: 'center',
  },
  languageButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  languageButtonTextActive: {
    color: Colors.textWhite,
  },
  donateCard: {
    marginTop: DesignTokens.spacing.lg,
  },
  developerContent: {
    gap: DesignTokens.spacing.lg,
  },
  developerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.md,
  },
  developerInfo: {
    flex: 1,
    gap: DesignTokens.spacing.xs,
  },
  developerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  developerEmail: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  versionInCard: {
    fontSize: 12,
    color: Colors.textDisabled,
    textAlign: 'center',
    paddingTop: DesignTokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.cardBackground,
    borderRadius: DesignTokens.borderRadius.large,
    padding: DesignTokens.spacing.xxl,
    width: '85%',
    maxWidth: 400,
    ...DesignTokens.shadow.large,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: DesignTokens.spacing.sm,
  },
  modalDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: DesignTokens.spacing.xl,
  },
  payMethodTabs: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.sm,
    marginBottom: DesignTokens.spacing.xl,
  },
  payTab: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: DesignTokens.borderRadius.medium,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: 10,
    alignItems: 'center',
  },
  payTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  payTabText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  payTabTextActive: {
    color: Colors.textWhite,
  },
  qrCodeContainer: {
    backgroundColor: Colors.background,
    borderRadius: DesignTokens.borderRadius.medium,
    padding: DesignTokens.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: DesignTokens.spacing.xl,
  },
  qrCodeImage: {
    width: 240,
    height: 240,
    marginBottom: DesignTokens.spacing.md,
  },
  scanToPayText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: DesignTokens.spacing.sm,
    marginBottom: DesignTokens.spacing.md,
  },
  recognizeButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: DesignTokens.borderRadius.medium,
    paddingVertical: 14,
    alignItems: 'center',
  },
  recognizeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textWhite,
  },
  saveButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: DesignTokens.borderRadius.medium,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
  closeButton: {
    backgroundColor: Colors.background,
    borderRadius: DesignTokens.borderRadius.medium,
    paddingVertical: DesignTokens.spacing.md,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
```

- [ ] **Step 3: 验证TypeScript编译**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: 提交SettingsScreen更新**

```bash
git add src/screens/SettingsScreen.tsx
git commit -m "style: apply unified CardStyles and DesignTokens to SettingsScreen

Use consistent spacing, border radius, and card styles throughout
the settings interface.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: 应用统一样式到ProjectCard组件

**Files:**
- Modify: `src/components/ProjectCard.tsx`

- [ ] **Step 1: 添加imports**

在 `src/components/ProjectCard.tsx` 顶部imports区域添加：
```typescript
import { CardStyles, DesignTokens } from '../constants/styles';
```

- [ ] **Step 2: 更新卡片根View样式**

找到组件return中的根View（第36-49行），修改为使用CardStyles：

```typescript
return (
  <View style={[
    CardStyles.card,
    {
      borderLeftWidth: 4,
      borderLeftColor: completed ? Colors.success : Colors.border,
    }
  ]}>
```

删除原来的内联样式定义：
```typescript
// 删除这些内联样式
{
  borderLeftWidth: 4,
  borderLeftColor: completed ? Colors.success : Colors.border,
  padding: 14,
  paddingHorizontal: 16,
  marginVertical: 4,
  borderRadius: 8,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 3,
}
```

- [ ] **Step 3: 应用DesignTokens到组件内部样式**

修改 `styles` 对象：

```typescript
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignTokens.spacing.md,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  projectName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: DesignTokens.spacing.xs,
  },
  timeText: {
    fontSize: 13,
    color: Colors.primary,
  },
  separator: {
    fontSize: 13,
    color: Colors.textDisabled,
  },
  statsText: {
    fontSize: 13,
    color: Colors.success,
    fontWeight: '500',
  },
  completionButton: {
    width: 32,
    height: 32,
    borderRadius: DesignTokens.borderRadius.small,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  completionButtonActive: {
    borderWidth: 0,
    backgroundColor: Colors.success,
  },
  completionIcon: {
    fontSize: 16,
    color: Colors.border,
    fontWeight: 'bold',
  },
  completionIconActive: {
    color: '#FFFFFF',
  },
  expandIcon: {
    fontSize: 14,
    color: Colors.textSecondary,
    flexShrink: 0,
  },
  descriptionContainer: {
    marginTop: DesignTokens.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: DesignTokens.spacing.md,
  },
  descriptionText: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
});
```

- [ ] **Step 4: 验证TypeScript编译**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: 提交ProjectCard更新**

```bash
git add src/components/ProjectCard.tsx
git commit -m "style: apply unified CardStyles and DesignTokens to ProjectCard

Use consistent card styling and spacing throughout project cards.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 8: 最终集成测试和验证

**Files:**
- Test: All modified screens

- [ ] **Step 1: 完整TypeScript编译检查**

Run: `npx tsc --noEmit`
Expected: No errors, no warnings

- [ ] **Step 2: 启动开发服务器**

Run: `npm start`
Expected: Metro bundler starts without errors

- [ ] **Step 3: 在Android设备/模拟器上测试**

Run: `npm run android`

测试清单：
1. **首页 (HomeScreen)**
   - [ ] 项目按类别正确分组显示
   - [ ] 卡片样式统一（圆角8px，间距4px）
   - [ ] 滑动流畅，无性能问题

2. **添加项目 (AddProjectScreen)**
   - [ ] TimelineSelector正常显示
   - [ ] 点击时间轴可以添加时间
   - [ ] 拖动marker可以调整时间
   - [ ] 点击marker可以删除时间
   - [ ] 快捷模板按钮可以添加时间
   - [ ] 时间自动15分钟对齐
   - [ ] 卡片样式统一

3. **管理项目 (ManageProjectsScreen)**
   - [ ] 项目按类别正确分组显示
   - [ ] 左滑编辑/删除功能正常
   - [ ] 开关切换功能正常
   - [ ] 卡片样式统一

4. **设置 (SettingsScreen)**
   - [ ] 所有卡片样式统一
   - [ ] 语言切换正常
   - [ ] 打赏弹窗样式统一（圆角12px）

- [ ] **Step 4: iOS测试（如果可用）**

Run: `npm run ios`

重复上述测试清单

- [ ] **Step 5: Web测试（如果需要）**

Run: `npm run web`

测试TimelineSelector在Web上的表现

- [ ] **Step 6: 视觉一致性检查**

检查以下视觉要素：
- [ ] 所有卡片圆角为8px
- [ ] 页面padding统一为16px
- [ ] 卡片间距统一为4px上下
- [ ] 阴影效果一致
- [ ] 按钮圆角为6px（小）或12px（大）

- [ ] **Step 7: 代码质量检查**

验证：
- [ ] `groupAndSortProjects` 只在 `projectHelpers.ts` 存在
- [ ] HomeScreen和ManageProjectsScreen使用useMemo
- [ ] 所有卡片使用CardStyles或DesignTokens
- [ ] 无重复样式定义

- [ ] **Step 8: 创建最终提交**

如果所有测试通过：

```bash
git add -A
git commit -m "chore: final integration and testing verification

All features tested and verified:
- TimelineSelector working on all platforms
- Project grouping logic unified
- UI styles consistent across all screens

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## 验收清单

### 功能验收
- [ ] 时间选择器可以通过点击时间轴添加时间
- [ ] 时间选择器可以通过拖动调整已选时间
- [ ] 时间选择器可以通过点击marker删除时间
- [ ] 快捷模板按钮可以正常添加时间
- [ ] 首页项目分组显示正常
- [ ] 管理页面项目分组显示正常
- [ ] 所有现有功能正常工作

### 代码验收
- [ ] `groupAndSortProjects`只在`projectHelpers.ts`中存在一份
- [ ] HomeScreen和ManageProjectsScreen都使用useMemo
- [ ] 所有卡片使用CardStyles
- [ ] 所有间距使用DesignTokens.spacing
- [ ] 所有圆角使用DesignTokens.borderRadius
- [ ] TypeScript编译无错误
- [ ] 无ESLint警告

### UI验收
- [ ] 所有卡片圆角一致（8px）
- [ ] 页面padding一致（16px）
- [ ] 卡片间距一致（4px上下）
- [ ] 阴影效果统一
- [ ] Android和iOS显示一致
- [ ] Web端显示正常

---

## 完成

所有任务完成后，项目将实现：
- ✅ 用户友好的可视化时间选择器
- ✅ 删除330行重复/冗余代码
- ✅ 统一的UI设计系统
- ✅ 更好的性能（useMemo优化）
- ✅ 更易维护的代码结构
