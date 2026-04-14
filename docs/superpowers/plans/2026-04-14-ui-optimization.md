# UI Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Optimize the rehabilitation assistant UI to be clean, compact, and professional with new color scheme and layout.

**Architecture:** This is a pure UI refactoring - updating colors, layouts, spacing, and typography across three files. The compact horizontal card layout moves the completion button to the left, merges time and stats into one line, and reduces font sizes. The minimal header design removes card backgrounds and merges stats with the filter toggle. No business logic changes.

**Tech Stack:** React Native, TypeScript, StyleSheet

---

## File Structure

**Files to modify:**
1. `src/constants/colors.ts` - Update 3 color values for new professional blue-green scheme
2. `src/components/ProjectCard.tsx` - Major layout refactor to compact horizontal design
3. `src/screens/HomeScreen.tsx` - Header layout updates to minimal design

---

### Task 1: Update Color Constants

**Files:**
- Modify: `src/constants/colors.ts:3,7,13`

- [ ] **Step 1: Update primary color to deep blue**

Update line 3 in `src/constants/colors.ts`:

```typescript
  primary: '#2E5C8A',
```

- [ ] **Step 2: Update success color to fresh green**

Update line 7 in `src/constants/colors.ts`:

```typescript
  success: '#10B981',
```

- [ ] **Step 3: Update background color to light blue-gray**

Update line 13 in `src/constants/colors.ts`:

```typescript
  background: '#F8F9FA',
```

- [ ] **Step 4: Verify color file changes**

Run: `cat src/constants/colors.ts`
Expected: Lines 3, 7, 13 show the new color values

- [ ] **Step 5: Commit color changes**

```bash
git add src/constants/colors.ts
git commit -m "style: update color scheme to professional blue-green

- primary: #4A90E2 → #2E5C8A (deeper, more professional)
- success: #4CAF50 → #10B981 (fresher, more modern)
- background: #F5F5F5 → #F8F9FA (subtle blue tint)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 2: Refactor ProjectCard to Compact Horizontal Layout

**Files:**
- Modify: `src/components/ProjectCard.tsx:36-144`

- [ ] **Step 1: Add left border to card container**

Replace the card container at line 36 in `src/components/ProjectCard.tsx`:

```tsx
    <View style={[
      CommonStyles.card,
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
    ]}>
```

Note: This replaces the single `<View style={CommonStyles.card}>` with inline style overrides for padding, margin, border, and shadow.

- [ ] **Step 2: Restructure header layout to horizontal row**

Replace the entire header section (lines 41-67) with this new structure:

```tsx
        <View style={styles.header}>
          {/* Completion button - left side */}
          <TouchableOpacity
            style={[styles.completionButton, completed && styles.completionButtonActive]}
            onPress={handleToggleCompletion}
            activeOpacity={0.7}
          >
            <Text style={[styles.completionIcon, completed && styles.completionIconActive]}>
              ✓
            </Text>
          </TouchableOpacity>

          {/* Content area - middle */}
          <View style={styles.content}>
            <Text style={styles.projectName}>{displayName}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.timeText}>
                {project.reminderTimes.join(' · ')}
              </Text>
              {stats.total > 0 && (
                <>
                  <Text style={styles.separator}>•</Text>
                  <Text style={styles.statsText}>
                    本周{stats.thisWeek} 总计{stats.total}
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* Expand icon - right side */}
          <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
        </View>
```

Note: This moves the completion button to the left as the first child, merges time and stats into one row with a bullet separator, and removes the actions wrapper.

- [ ] **Step 3: Update header layout styles**

Replace lines 81-85 in the styles section:

```typescript
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
```

- [ ] **Step 4: Update content area styles**

Replace lines 86-88:

```typescript
  content: {
    flex: 1,
    minWidth: 0,
  },
```

Note: `minWidth: 0` prevents flex overflow issues with long text.

- [ ] **Step 5: Add projectName style for title**

Add new style after content (insert at line 89):

```typescript
  projectName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
```

- [ ] **Step 6: Add infoRow style for time and stats container**

Add new style after projectName:

```typescript
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
```

- [ ] **Step 7: Update reminderText to timeText with new size and color**

Replace lines 89-93 (the old reminderText):

```typescript
  timeText: {
    fontSize: 13,
    color: Colors.primary,
  },
```

- [ ] **Step 8: Add separator style for bullet between time and stats**

Add new style after timeText:

```typescript
  separator: {
    fontSize: 13,
    color: Colors.textDisabled,
  },
```

- [ ] **Step 9: Update statsText with new size and color**

Replace lines 94-98 (the old statsText):

```typescript
  statsText: {
    fontSize: 13,
    color: Colors.success,
    fontWeight: '500',
  },
```

- [ ] **Step 10: Remove old actions style**

Delete lines 99-103 (the actions style is no longer needed).

- [ ] **Step 11: Update completionButton to rounded square**

Replace lines 104-113 with:

```typescript
  completionButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
```

Note: Changed borderRadius from 16 (circular) to 6 (rounded square), added flexShrink: 0.

- [ ] **Step 12: Update completionButtonActive style**

Replace lines 114-117:

```typescript
  completionButtonActive: {
    borderWidth: 0,
    backgroundColor: Colors.success,
  },
```

Note: Set borderWidth to 0 when active.

- [ ] **Step 13: Update completionIcon size**

Replace lines 118-122:

```typescript
  completionIcon: {
    fontSize: 16,
    color: Colors.border,
    fontWeight: 'bold',
  },
```

Note: Reduced from 18 to 16.

- [ ] **Step 14: Update expandIcon size and remove margin**

Replace lines 126-130:

```typescript
  expandIcon: {
    fontSize: 14,
    color: Colors.textSecondary,
    flexShrink: 0,
  },
```

Note: Reduced from 16 to 14, removed marginLeft, added flexShrink: 0.

- [ ] **Step 15: Visual verification - run the app**

Run: `npm start` (or restart if already running)
Expected: 
- Cards should show completion button on left (32×32px rounded square)
- Project name should be 17px, medium weight
- Time and stats should be on same line with bullet separator
- Time should be in new primary blue color (#2E5C8A)
- Stats should be in new success green color (#10B981)
- Cards should feel more compact with smaller spacing

- [ ] **Step 16: Commit ProjectCard changes**

```bash
git add src/components/ProjectCard.tsx
git commit -m "refactor: redesign ProjectCard to compact horizontal layout

- Move completion button to left side (first in flex row)
- Change button from circular to rounded square (borderRadius: 6)
- Reduce title font size from 24px to 17px
- Merge time and stats into single row with bullet separator
- Reduce time/stats font size to 13px
- Update colors to use new primary and success
- Reduce card padding to 14px/16px
- Reduce card spacing to 4px vertical
- Add left border indicator (4px, success when completed)
- Reduce shadow intensity for lighter appearance

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Update HomeScreen Header to Minimal Design

**Files:**
- Modify: `src/screens/HomeScreen.tsx:29,64-81,113-133`

- [ ] **Step 1: Calculate completed count**

Add this line after line 29 (after `const totalProjects = enabledProjects.length;`):

```typescript
  const completedCount = enabledProjects.filter((proj) => isCompletedToday(proj.completionHistory)).length;
```

- [ ] **Step 2: Remove getGreeting function**

Delete lines 50-55 (the getGreeting function is no longer needed).

- [ ] **Step 3: Restructure header with minimal design**

Replace the entire header section (lines 64-81) with:

```tsx
        <View style={styles.header}>
          <Text style={styles.dateText}>{formatDate(new Date(), locale)}</Text>
          
          <View style={styles.statsRow}>
            <Text style={styles.statsText}>
              今天有 {totalProjects} 个项目 · 已完成 {completedCount} 个
            </Text>
            
            {enabledProjects.length > 0 && (
              <View style={styles.filterControl}>
                <Text style={styles.filterLabel}>
                  {hideCompleted ? t('home.showAll') : t('home.hideCompleted')}
                </Text>
                <Switch
                  value={hideCompleted}
                  onValueChange={setHideCompleted}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={Colors.cardBackground}
                />
              </View>
            )}
          </View>
        </View>
```

Note: This removes the greeting, adds statsRow with stats text on the left and filter control on the right.

- [ ] **Step 4: Update header container style**

Replace lines 121-123 in the styles section:

```typescript
  header: {
    marginBottom: 16,
  },
```

Note: Reduced from 24px to 16px.

- [ ] **Step 5: Add dateText style**

Add new style after header (insert at line 124):

```typescript
  dateText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
```

- [ ] **Step 6: Add statsRow style**

Add new style after dateText:

```typescript
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
```

- [ ] **Step 7: Add statsText style**

Add new style after statsRow:

```typescript
  statsText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
```

- [ ] **Step 8: Add filterControl style**

Add new style after statsText:

```typescript
  filterControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
```

- [ ] **Step 9: Add filterLabel style**

Add new style after filterControl:

```typescript
  filterLabel: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
```

- [ ] **Step 10: Remove old greeting and filterRow styles**

Delete lines 124-133 (the old greeting and filterRow styles are no longer needed).

- [ ] **Step 11: Visual verification - run the app**

Run: `npm start` (or restart if already running)
Expected:
- Header should have no background card
- Date should be 20px, semibold
- Stats line should show "今天有 X 个项目 · 已完成 Y 个" on the left
- Filter toggle should be on the right side of same line as stats
- Filter label should be 13px in new primary blue color
- Overall header should feel lighter and take less space

- [ ] **Step 12: Commit HomeScreen changes**

```bash
git add src/screens/HomeScreen.tsx
git commit -m "refactor: redesign HomeScreen header to minimal design

- Remove card background from header area
- Update date font size from 24px to 20px
- Merge stats and filter toggle into same row
- Change stats format to '今天有 X 个项目 · 已完成 Y 个'
- Update filter label to 13px with new primary color
- Reduce header bottom margin from 24px to 16px
- Remove greeting function (replaced with inline stats)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Verification Checklist

After all tasks are complete, verify the following in the running app:

**Colors:**
- [ ] Primary blue is darker and more professional (#2E5C8A)
- [ ] Success green is fresher and more modern (#10B981)
- [ ] Background has subtle blue tint (#F8F9FA)

**ProjectCard:**
- [ ] Completion button is on the left side, 32×32px rounded square
- [ ] Completed cards have green button, uncompleted have gray border
- [ ] Project name is 17px, visually smaller than before
- [ ] Time and stats are on same line with bullet separator
- [ ] Time is in new primary blue, stats in new success green
- [ ] Cards feel more compact with tighter spacing
- [ ] Left border shows green when completed, light gray when not

**HomeScreen:**
- [ ] Header has no background card, just text
- [ ] Date is 20px, slightly smaller than before
- [ ] Stats and filter toggle are on same row
- [ ] Stats show format "今天有 X 个项目 · 已完成 Y 个"
- [ ] Filter label is 13px in new primary blue
- [ ] Overall header takes less vertical space

**Overall Feel:**
- [ ] Interface feels cleaner and less cluttered
- [ ] Information density is higher but still readable
- [ ] Professional medical app aesthetic
- [ ] Compact but not cramped
