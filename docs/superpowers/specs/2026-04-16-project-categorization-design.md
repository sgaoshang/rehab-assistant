# Project Categorization and Visual Improvements

**Date:** 2026-04-16  
**Status:** Approved

## Overview

Enhance the rehab assistant app by adding category-based organization for projects in the Home and Manage Projects screens, and improving the visual feedback for preset project cards.

## Requirements

### 1. Project Categorization
- Display projects grouped by category in HomeScreen and ManageProjectsScreen
- Categories (in display order):
  1. Custom (自定义项目) - user-created projects
  2. Medication (用药提醒) - preset medication reminders
  3. Health Check (健康检查) - preset health monitoring tasks
  4. Rehabilitation (康复训练) - preset rehabilitation exercises
- Sort projects within each category by earliest reminder time
- Categories are always expanded (no collapse/expand functionality)
- Only show categories that contain projects

### 2. Visual Feedback Improvements
- Improve click feedback for preset project cards in AddProjectScreen
- Right arrow (›) remains as decorative element
- Enhance activeOpacity and visual styling to make interactions clearer

### 3. Development Branch
- Create a new git branch for this feature development

## Technical Design

### Architecture

**Approach:** UI-layer grouping with visual optimization (Option A)

**Rationale:**
- Minimal changes, only modifying screen components
- No data structure changes, backward compatible
- Clear sorting logic, easy to maintain
- Good performance for current project scale
- Simple implementation, lowest risk

**Trade-offs considered:**
- Some code duplication between HomeScreen and ManageProjectsScreen
- Acceptable for current scale (only 2 screens need this)
- Can refactor to shared utilities if more screens need categorization later

### Data Model

No changes to existing data structures. Projects continue using:

```typescript
export interface Project {
  id: string;
  name: string;
  description: string;
  isPreset: boolean;
  isEnabled: boolean;
  reminderTimes: string[];
  createdAt: number;
  presetId?: string;
  completionHistory: string[];
}
```

Category is derived from:
- `isPreset === false` → Custom category
- `isPreset === true` + presetId lookup in presetProjects → Medication/HealthCheck/Rehabilitation

### Components

#### 1. Grouping and Sorting Logic

Add to both HomeScreen.tsx and ManageProjectsScreen.tsx:

```typescript
type ProjectCategory = 'custom' | 'medication' | 'healthCheck' | 'rehabilitation';

interface ProjectGroup {
  category: ProjectCategory;
  title: string;
  projects: Project[];
}

const groupAndSortProjects = (projects: Project[]): ProjectGroup[] => {
  const presetProjects = getPresetProjects(t);
  
  // Group by category
  const custom = projects.filter(p => !p.isPreset);
  const medication = projects.filter(p => 
    p.isPreset && 
    presetProjects.find(preset => preset.presetId === p.presetId)?.category === 'medication'
  );
  const healthCheck = projects.filter(p => 
    p.isPreset && 
    presetProjects.find(preset => preset.presetId === p.presetId)?.category === 'healthCheck'
  );
  const rehabilitation = projects.filter(p => 
    p.isPreset && 
    presetProjects.find(preset => preset.presetId === p.presetId)?.category === 'rehabilitation'
  );
  
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

#### 2. UI Structure

**HomeScreen.tsx:**

Replace the flat project list with grouped rendering:

```tsx
{enabledProjects.length === 0 ? (
  <View style={styles.emptyState}>
    {/* existing empty state */}
  </View>
) : visibleProjects.length === 0 ? (
  <View style={styles.emptyState}>
    {/* existing all completed state */}
  </View>
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
          <ProjectCard key={project.id} project={project} />
        ))}
      </View>
    ))}
  </>
)}
```

**ManageProjectsScreen.tsx:**

Similar structure, preserving Swipeable functionality:

```tsx
{state.projects.length === 0 ? (
  <View style={styles.emptyState}>
    {/* existing empty state */}
  </View>
) : (
  <>
    {groupedProjects.map((group) => (
      <View key={group.category}>
        {/* Category header */}
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryTitle}>{group.title}</Text>
          <Text style={styles.categoryCount}>({group.projects.length})</Text>
        </View>
        
        {/* Project list with swipe actions */}
        {group.projects.map((project) => {
          const projectContent = (/* existing content */);
          
          if (Platform.OS === 'web') {
            return <View key={project.id}>{projectContent}</View>;
          }
          
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

#### 3. Visual Feedback Enhancement

**AddProjectScreen.tsx** - Preset card improvements:

```tsx
<TouchableOpacity
  key={index}
  style={styles.presetCard}
  onPress={() => handleSelectPreset(preset)}
  activeOpacity={0.6}  // Enhanced from 0.7 for better feedback
>
  <View style={styles.presetCardContent}>
    <View style={styles.presetCardText}>
      <Text style={styles.presetName}>{preset.name}</Text>
      <Text style={styles.presetDescription}>{preset.description}</Text>
    </View>
    <Text style={styles.presetCardArrow}>›</Text>
  </View>
</TouchableOpacity>
```

Style updates:

```typescript
presetCard: {
  backgroundColor: Colors.cardBackground,
  borderRadius: 8,
  padding: 14,
  paddingHorizontal: 16,
  marginVertical: 4,
  shadowColor: Colors.shadow,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 3,
  elevation: 2,
  borderWidth: 1,
  borderColor: 'transparent',  // Add subtle border for feedback
},
presetCardArrow: {
  fontSize: 24,
  color: Colors.textDisabled,
  fontWeight: '300',
  opacity: 0.5,  // Reduce opacity to clarify decorative purpose
},
```

### Styling

New styles for category headers (add to both screens):

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

### Internationalization

Add new translation key for custom category:

**zh.ts:**
```typescript
projects: {
  categoryCustom: '自定义项目',
  categoryMedication: '用药提醒',      // existing
  categoryHealthCheck: '健康检查',     // existing
  categoryRehabilitation: '康复训练',  // existing
}
```

**en.ts:**
```typescript
projects: {
  categoryCustom: 'Custom Projects',
  categoryMedication: 'Medication',           // existing
  categoryHealthCheck: 'Health Monitoring',   // existing
  categoryRehabilitation: 'Rehabilitation',   // existing
}
```

## Implementation Plan

### Files to Modify

1. **src/screens/HomeScreen.tsx**
   - Add `groupAndSortProjects` function
   - Update rendering to use grouped structure
   - Add category header styles

2. **src/screens/ManageProjectsScreen.tsx**
   - Add `groupAndSortProjects` function
   - Update rendering to use grouped structure
   - Add category header styles

3. **src/screens/AddProjectScreen.tsx**
   - Update `activeOpacity` for preset cards
   - Update `presetCardArrow` style

4. **src/i18n/zh.ts** and **src/i18n/en.ts**
   - Add `projects.categoryCustom` translation

### Testing Considerations

**Test Cases:**

1. **Grouping Logic:**
   - Custom projects appear in first group
   - Preset projects correctly categorized by medication/healthCheck/rehabilitation
   - Empty categories are hidden

2. **Sorting:**
   - Projects within each category sorted by earliest reminder time
   - Projects with no reminder times appear last
   - Sorting stable across screen navigation

3. **Visual Feedback:**
   - Preset card press provides clear visual feedback
   - Arrow remains decorative, doesn't suggest separate action
   - No regression in existing interactions

4. **Edge Cases:**
   - Empty project list shows empty state
   - Single category with projects displays correctly
   - Category headers render correctly in both languages

5. **Platform Compatibility:**
   - Works on iOS, Android, and Web
   - Swipeable actions still work in ManageProjectsScreen (native only)

## Success Criteria

- ✅ Projects displayed in 4 categories, custom first
- ✅ Projects sorted by earliest reminder time within category
- ✅ Only populated categories are shown
- ✅ Categories always expanded (no collapse UI)
- ✅ Preset card feedback improved
- ✅ No breaking changes to existing functionality
- ✅ Works on all platforms (iOS, Android, Web)

## Future Considerations

**Potential Enhancements (out of scope):**

1. Add collapse/expand functionality if category list grows large
2. Extract shared grouping logic to utility if more screens need it
3. Add category-specific icons or colors for visual distinction
4. Persist user's category expansion preferences
5. Add category filtering options

**Migration Path:**

If we later need shared utilities (Option B from alternatives):
- Extract `groupAndSortProjects` to `src/utils/projectGrouping.ts`
- Create reusable `<CategoryHeader>` component
- Refactor screens to use shared code
- No data migration needed
