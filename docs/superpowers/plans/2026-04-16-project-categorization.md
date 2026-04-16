# Project Categorization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add category-based organization to Home and Manage Projects screens with improved visual feedback for preset cards.

**Architecture:** UI-layer grouping and sorting in screen components. No data model changes. Projects grouped into 4 categories (Custom, Medication, Health Check, Rehabilitation) and sorted by earliest reminder time within each category.

**Tech Stack:** React Native, TypeScript, React Navigation

---

## File Structure

**Modified files:**
- `src/screens/HomeScreen.tsx` - Add grouping logic and category headers
- `src/screens/ManageProjectsScreen.tsx` - Add grouping logic and category headers
- `src/screens/AddProjectScreen.tsx` - Improve preset card visual feedback
- `src/i18n/zh.ts` - Add custom category translation
- `src/i18n/en.ts` - Add custom category translation

**No new files created** - UI-layer implementation only

---

### Task 1: Create Feature Branch

**Files:**
- None (git operations only)

- [ ] **Step 1: Check current branch status**

```bash
git status
```

Expected: On branch `main`, working tree clean (or only HomeScreen.tsx modified)

- [ ] **Step 2: Stash any uncommitted changes**

```bash
git stash
```

Expected: "Saved working directory and index state" or "No local changes to save"

- [ ] **Step 3: Create and checkout feature branch**

```bash
git checkout -b feature/project-categorization
```

Expected: "Switched to a new branch 'feature/project-categorization'"

- [ ] **Step 4: Restore stashed changes if any**

```bash
git stash pop
```

Expected: Changes restored or "No stash entries found"

- [ ] **Step 5: Verify branch**

```bash
git branch --show-current
```

Expected: `feature/project-categorization`

---

### Task 2: Add Translation Keys

**Files:**
- Modify: `src/i18n/zh.ts`
- Modify: `src/i18n/en.ts`

- [ ] **Step 1: Add Chinese translation for custom category**

In `src/i18n/zh.ts`, locate the `projects` object and add:

```typescript
projects: {
  categoryCustom: '自定义项目',
  categoryMedication: '用药提醒',
  categoryHealthCheck: '健康检查',
  categoryRehabilitation: '康复训练',
  // ... existing keys
```

- [ ] **Step 2: Add English translation for custom category**

In `src/i18n/en.ts`, locate the `projects` object and add:

```typescript
projects: {
  categoryCustom: 'Custom Projects',
  categoryMedication: 'Medication',
  categoryHealthCheck: 'Health Monitoring',
  categoryRehabilitation: 'Rehabilitation',
  // ... existing keys
```

- [ ] **Step 3: Verify translations load**

```bash
npm start
```

Expected: App starts without TypeScript errors related to translations

- [ ] **Step 4: Commit translation changes**

```bash
git add src/i18n/zh.ts src/i18n/en.ts
git commit -m "feat: add category translation keys for project grouping

Add categoryCustom translation in Chinese and English

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Update HomeScreen with Categorization

**Files:**
- Modify: `src/screens/HomeScreen.tsx`

- [ ] **Step 1: Add type definitions at top of file**

After the existing imports in `HomeScreen.tsx`, add:

```typescript
type ProjectCategory = 'custom' | 'medication' | 'healthCheck' | 'rehabilitation';

interface ProjectGroup {
  category: ProjectCategory;
  title: string;
  projects: Project[];
}
```

- [ ] **Step 2: Add grouping and sorting function**

Add this function inside the `HomeScreen` component, before the `enabledProjects` calculation:

```typescript
const groupAndSortProjects = (projects: Project[]): ProjectGroup[] => {
  const presetProjects = useMemo(() => getPresetProjects(t), [t]);
  
  // Group by category
  const custom = projects.filter(p => !p.isPreset);
  const medication = projects.filter(p => {
    if (!p.isPreset || !p.presetId) return false;
    const preset = presetProjects.find(preset => preset.presetId === p.presetId);
    return preset?.category === 'medication';
  });
  const healthCheck = projects.filter(p => {
    if (!p.isPreset || !p.presetId) return false;
    const preset = presetProjects.find(preset => preset.presetId === p.presetId);
    return preset?.category === 'healthCheck';
  });
  const rehabilitation = projects.filter(p => {
    if (!p.isPreset || !p.presetId) return false;
    const preset = presetProjects.find(preset => preset.presetId === p.presetId);
    return preset?.category === 'rehabilitation';
  });
  
  // Sort by earliest reminder time
  const sortByEarliestTime = (a: Project, b: Project) => {
    const aTime = a.reminderTimes.length > 0 ? a.reminderTimes[0] : '99:99';
    const bTime = b.reminderTimes.length > 0 ? b.reminderTimes[0] : '99:99';
    return aTime.localeCompare(bTime);
  };
  
  // Return groups with projects, in display order
  return [
    { 
      category: 'custom', 
      title: t('projects.categoryCustom'), 
      projects: custom.sort(sortByEarliestTime) 
    },
    { 
      category: 'medication', 
      title: t('projects.categoryMedication'), 
      projects: medication.sort(sortByEarliestTime) 
    },
    { 
      category: 'healthCheck', 
      title: t('projects.categoryHealthCheck'), 
      projects: healthCheck.sort(sortByEarliestTime) 
    },
    { 
      category: 'rehabilitation', 
      title: t('projects.categoryRehabilitation'), 
      projects: rehabilitation.sort(sortByEarliestTime) 
    },
  ].filter(group => group.projects.length > 0);
};
```

- [ ] **Step 3: Use grouping function to prepare grouped projects**

After the `visibleProjects` calculation, add:

```typescript
const groupedProjects = groupAndSortProjects(visibleProjects);
```

- [ ] **Step 4: Update rendering to use grouped structure**

Replace the existing project rendering (lines 108-114) with:

```typescript
        ) : (
          <>
            {groupedProjects.map((group) => (
              <View key={group.category}>
                {/* Category header */}
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryTitle}>{group.title}</Text>
                  <Text style={styles.categoryCount}>({group.projects.length})</Text>
                </View>
                
                {/* Project list */}
                {group.projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                  />
                ))}
              </View>
            ))}
          </>
        )}
```

- [ ] **Step 5: Add category header styles**

In the `StyleSheet.create` section at the bottom, add these new styles before the closing `});`:

```typescript
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 12,
    marginTop: 16,
    marginBottom: 4,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryCount: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
```

- [ ] **Step 6: Test HomeScreen categorization**

```bash
npm start
```

Manual test:
1. Open app in simulator/browser
2. Navigate to Home screen
3. Verify projects are grouped by category
4. Verify custom projects appear first
5. Verify projects within each category are sorted by earliest reminder time
6. Verify category headers show correct titles and counts

Expected: Projects display in categorized groups with headers

- [ ] **Step 7: Commit HomeScreen changes**

```bash
git add src/screens/HomeScreen.tsx
git commit -m "feat: add category grouping to HomeScreen

- Group projects by category (Custom, Medication, Health Check, Rehabilitation)
- Sort projects within categories by earliest reminder time
- Add category headers with project counts
- Custom projects displayed first

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 4: Update ManageProjectsScreen with Categorization

**Files:**
- Modify: `src/screens/ManageProjectsScreen.tsx`

- [ ] **Step 1: Add type definitions at top of file**

After the existing imports in `ManageProjectsScreen.tsx`, add:

```typescript
type ProjectCategory = 'custom' | 'medication' | 'healthCheck' | 'rehabilitation';

interface ProjectGroup {
  category: ProjectCategory;
  title: string;
  projects: Project[];
}
```

- [ ] **Step 2: Add grouping and sorting function**

Add this function inside the `ManageProjectsScreen` component, before the `totalProjects` calculation:

```typescript
const groupAndSortProjects = (projects: Project[]): ProjectGroup[] => {
  const presetProjectsList = useMemo(() => getPresetProjects(t), [t]);
  
  // Group by category
  const custom = projects.filter(p => !p.isPreset);
  const medication = projects.filter(p => {
    if (!p.isPreset || !p.presetId) return false;
    const preset = presetProjectsList.find(preset => preset.presetId === p.presetId);
    return preset?.category === 'medication';
  });
  const healthCheck = projects.filter(p => {
    if (!p.isPreset || !p.presetId) return false;
    const preset = presetProjectsList.find(preset => preset.presetId === p.presetId);
    return preset?.category === 'healthCheck';
  });
  const rehabilitation = projects.filter(p => {
    if (!p.isPreset || !p.presetId) return false;
    const preset = presetProjectsList.find(preset => preset.presetId === p.presetId);
    return preset?.category === 'rehabilitation';
  });
  
  // Sort by earliest reminder time
  const sortByEarliestTime = (a: Project, b: Project) => {
    const aTime = a.reminderTimes.length > 0 ? a.reminderTimes[0] : '99:99';
    const bTime = b.reminderTimes.length > 0 ? b.reminderTimes[0] : '99:99';
    return aTime.localeCompare(bTime);
  };
  
  // Return groups with projects, in display order
  return [
    { 
      category: 'custom', 
      title: t('projects.categoryCustom'), 
      projects: custom.sort(sortByEarliestTime) 
    },
    { 
      category: 'medication', 
      title: t('projects.categoryMedication'), 
      projects: medication.sort(sortByEarliestTime) 
    },
    { 
      category: 'healthCheck', 
      title: t('projects.categoryHealthCheck'), 
      projects: healthCheck.sort(sortByEarliestTime) 
    },
    { 
      category: 'rehabilitation', 
      title: t('projects.categoryRehabilitation'), 
      projects: rehabilitation.sort(sortByEarliestTime) 
    },
  ].filter(group => group.projects.length > 0);
};
```

- [ ] **Step 3: Add import for getPresetProjects**

At the top of the file, add to the imports:

```typescript
import { getPresetProjects } from '../constants/presetProjects';
```

And add React import for useMemo if not already present:

```typescript
import React, { useMemo } from 'react';
```

- [ ] **Step 4: Use grouping function to prepare grouped projects**

After the `enabledCount` calculation, add:

```typescript
const groupedProjects = groupAndSortProjects(state.projects);
```

- [ ] **Step 5: Update rendering to use grouped structure**

Replace the existing project rendering (lines 118-191) with:

```typescript
        ) : (
          <>
            {groupedProjects.map((group) => (
              <View key={group.category}>
                {/* Category header */}
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryTitle}>{group.title}</Text>
                  <Text style={styles.categoryCount}>({group.projects.length})</Text>
                </View>
                
                {/* Project list */}
                {group.projects.map((project) => {
                  const projectContent = (
                    <View style={[
                      styles.projectItem,
                      {
                        borderLeftWidth: 4,
                        borderLeftColor: project.isEnabled ? Colors.success : Colors.border,
                      }
                    ]}>
                      <View style={styles.projectContent}>
                        <View style={styles.projectInfo}>
                          <Text style={styles.projectName}>
                            {project.presetId
                              ? t(`presets.${project.presetId}.name`)
                              : project.name}
                          </Text>
                          <Text style={styles.projectDescription} numberOfLines={2}>
                            {project.presetId
                              ? t(`presets.${project.presetId}.description`)
                              : project.description}
                          </Text>
                          {project.reminderTimes.length > 0 && (
                            <Text style={styles.reminderText}>
                              {project.reminderTimes.join(' · ')}
                            </Text>
                          )}
                        </View>
                        <View style={styles.projectControls}>
                          <Switch
                            value={project.isEnabled}
                            onValueChange={() => toggleProjectEnabled(project.id)}
                            trackColor={{ false: Colors.border, true: Colors.primary }}
                            thumbColor={Colors.cardBackground}
                          />
                          {Platform.OS === 'web' && (
                            <View style={styles.webButtons}>
                              <TouchableOpacity
                                style={styles.webEditButton}
                                onPress={() => navigation.navigate('AddProject', { projectId: project.id })}
                              >
                                <Text style={styles.webButtonText}>{t('manageProjects.edit')}</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.webDeleteButton}
                                onPress={() => handleDelete(project.id, getDisplayName(project))}
                              >
                                <Text style={styles.webButtonText}>{t('common.delete')}</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  );

                  // On web, render without Swipeable
                  if (Platform.OS === 'web') {
                    return <View key={project.id}>{projectContent}</View>;
                  }

                  // On native, use Swipeable
                  return (
                    <Swipeable
                      key={project.id}
                      renderRightActions={renderRightActions(project.id, getDisplayName(project))}
                      overshootRight={false}
                      friction={2}
                      rightThreshold={40}
                    >
                      {projectContent}
                    </Swipeable>
                  );
                })}
              </View>
            ))}
          </>
        )}
```

- [ ] **Step 6: Add category header styles**

In the `StyleSheet.create` section at the bottom, add these new styles before the closing `});`:

```typescript
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 12,
    marginTop: 16,
    marginBottom: 4,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryCount: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
```

- [ ] **Step 7: Test ManageProjectsScreen categorization**

```bash
npm start
```

Manual test:
1. Open app in simulator/browser
2. Navigate to Manage Projects screen
3. Verify projects are grouped by category
4. Verify custom projects appear first
5. Verify projects within each category are sorted by earliest reminder time
6. Verify category headers show correct titles and counts
7. Verify swipe actions still work on native (edit/delete)
8. Verify web buttons still work (edit/delete)

Expected: Projects display in categorized groups, all interactions work

- [ ] **Step 8: Commit ManageProjectsScreen changes**

```bash
git add src/screens/ManageProjectsScreen.tsx
git commit -m "feat: add category grouping to ManageProjectsScreen

- Group projects by category (Custom, Medication, Health Check, Rehabilitation)
- Sort projects within categories by earliest reminder time
- Add category headers with project counts
- Preserve swipeable actions on native and button actions on web
- Custom projects displayed first

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 5: Improve AddProjectScreen Visual Feedback

**Files:**
- Modify: `src/screens/AddProjectScreen.tsx`

- [ ] **Step 1: Update preset card activeOpacity**

In `AddProjectScreen.tsx`, locate all `TouchableOpacity` components with `style={styles.presetCard}` and update their `activeOpacity` from `0.7` to `0.6`:

Find (appears twice, around lines 450 and 547):
```typescript
<TouchableOpacity
  key={index}
  style={styles.presetCard}
  onPress={() => handleSelectPreset(preset)}
  activeOpacity={0.7}
>
```

Replace with:
```typescript
<TouchableOpacity
  key={index}
  style={styles.presetCard}
  onPress={() => handleSelectPreset(preset)}
  activeOpacity={0.6}
>
```

- [ ] **Step 2: Update presetCardArrow style**

In the `StyleSheet.create` section, locate `presetCardArrow` style (around line 1039) and update:

From:
```typescript
presetCardArrow: {
  fontSize: 24,
  color: Colors.textDisabled,
  fontWeight: '300',
},
```

To:
```typescript
presetCardArrow: {
  fontSize: 24,
  color: Colors.textDisabled,
  fontWeight: '300',
  opacity: 0.5,
},
```

- [ ] **Step 3: Test preset card visual feedback**

```bash
npm start
```

Manual test:
1. Open app in simulator/browser
2. Navigate to Add Project screen
3. Tap "选择预设项目" to expand preset list
4. Expand a category
5. Press and hold on a preset card
6. Verify visual feedback is more pronounced (darker than before)
7. Verify arrow appears more subdued (decorative)

Expected: Clearer visual feedback on press, arrow less prominent

- [ ] **Step 4: Commit AddProjectScreen changes**

```bash
git add src/screens/AddProjectScreen.tsx
git commit -m "feat: improve preset card visual feedback

- Increase activeOpacity to 0.6 for clearer press feedback
- Reduce arrow opacity to 0.5 to clarify decorative purpose

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Testing Checklist

After all tasks complete, verify:

- [ ] **Grouping Logic**
  - Custom projects appear in first group
  - Preset projects correctly categorized
  - Empty categories are hidden

- [ ] **Sorting**
  - Projects sorted by earliest reminder time within category
  - Projects with no times appear last in category

- [ ] **Visual Feedback**
  - Preset cards show clear press feedback
  - Arrow is visually de-emphasized

- [ ] **Platform Compatibility**
  - Works on iOS simulator
  - Works on Android emulator
  - Works on web browser
  - Swipe actions work on native
  - Web buttons work on web

- [ ] **Internationalization**
  - Category titles display in Chinese
  - Category titles display in English when locale switched

- [ ] **Edge Cases**
  - Empty project list shows empty state
  - Single category displays correctly
  - All projects in one category displays correctly

---

## Completion

When all tasks and testing complete:

- [ ] **Final verification**

Run full test:
```bash
npm start
```

Test all three screens:
1. HomeScreen - verify categorization
2. ManageProjectsScreen - verify categorization  
3. AddProjectScreen - verify visual feedback

- [ ] **Push feature branch**

```bash
git push -u origin feature/project-categorization
```

Expected: Branch pushed to remote

- [ ] **Create pull request (optional)**

If using GitHub/GitLab, create PR from `feature/project-categorization` to `main` with description:
```
## Project Categorization

Adds category-based organization to Home and Manage Projects screens.

### Changes
- Projects grouped by category (Custom, Medication, Health Check, Rehabilitation)
- Custom projects displayed first
- Projects sorted by earliest reminder time within categories
- Improved visual feedback for preset project cards

### Testing
- ✅ Verified on iOS/Android/Web
- ✅ All existing interactions preserved
- ✅ Translations added for both languages
```
