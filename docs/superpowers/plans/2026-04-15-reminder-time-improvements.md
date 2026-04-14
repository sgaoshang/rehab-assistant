# Reminder Time Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify reminder time selection by replacing quick time grid and template cards with a single dropdown template selector.

**Architecture:** Modify AddProjectScreen to use a Picker component for template selection. Template selection appends times to existing array with automatic deduplication. Remove quick time buttons and template card UI.

**Tech Stack:** React Native, TypeScript, React Native Picker (@react-native-picker/picker)

---

## File Structure

**Files to modify:**
- `src/screens/AddProjectScreen.tsx` - Main screen component (remove old UI, add dropdown, update logic)
- `src/i18n/translations/zh.ts` - Add Chinese translations for new UI elements
- `src/i18n/translations/en.ts` - Add English translations for new UI elements

**No new files needed** - this is a UI simplification that works within existing structure.

---

### Task 1: Add i18n Translations

**Files:**
- Modify: `src/i18n/translations/zh.ts`
- Modify: `src/i18n/translations/en.ts`

- [ ] **Step 1: Add Chinese translations**

Open `src/i18n/translations/zh.ts` and add to the `addProject` section:

```typescript
selectTemplate: '选择常用模板（可选）',
noTimeSelectedHint: '请选择模板或添加自定义时间',
templateChangeHint: '选择模板后会自动添加时间，切换模板会追加新时间（自动去重）',
timesCount: '({{count}}个)',
timeRequiredError: '请至少添加一个提醒时间',
```

- [ ] **Step 2: Add English translations**

Open `src/i18n/translations/en.ts` and add to the `addProject` section:

```typescript
selectTemplate: 'Select template (optional)',
noTimeSelectedHint: 'Select a template or add custom time',
templateChangeHint: 'Times will be added automatically when selecting template. Switching templates will append new times (auto-dedup)',
timesCount: '({{count}})',
timeRequiredError: 'Please add at least one reminder time',
```

- [ ] **Step 3: Verify translations build**

Run: `npm run type-check` or `npx tsc --noEmit`
Expected: No errors related to i18n files

- [ ] **Step 4: Commit translations**

```bash
git add src/i18n/translations/zh.ts src/i18n/translations/en.ts
git commit -m "feat: add i18n translations for simplified time selector

Add translations for template dropdown, empty state hint, and
validation messages.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 2: Install and Import Picker Component

**Files:**
- Modify: `src/screens/AddProjectScreen.tsx:1-23` (imports section)

- [ ] **Step 1: Install @react-native-picker/picker**

Run: `npm install @react-native-picker/picker`
Expected: Package installed successfully

For iOS:
Run: `cd ios && pod install && cd ..`
Expected: Pods installed successfully

- [ ] **Step 2: Add Picker import**

In `src/screens/AddProjectScreen.tsx`, add after line 13 (after Modal import):

```typescript
import { Picker } from '@react-native-picker/picker';
```

- [ ] **Step 3: Verify build**

Run: `npm run type-check`
Expected: No import errors

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json ios/Podfile.lock src/screens/AddProjectScreen.tsx
git commit -m "feat: add @react-native-picker/picker dependency

Install picker library for template dropdown selector.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Add State for Template Selection

**Files:**
- Modify: `src/screens/AddProjectScreen.tsx:47-48` (state declarations)

- [ ] **Step 1: Add selectedTemplate state**

After line 47 (`const [presetId, setPresetId] = ...`), add:

```typescript
const [selectedTemplate, setSelectedTemplate] = useState<string>('');
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npm run type-check`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/screens/AddProjectScreen.tsx
git commit -m "feat: add state for template selection

Track currently selected template in dropdown.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 4: Define Template Data Structure

**Files:**
- Modify: `src/screens/AddProjectScreen.tsx:73-82` (after quickTimes, before timeTemplates)

- [ ] **Step 1: Remove old timeTemplates useMemo**

Delete lines 75-82 (the existing timeTemplates useMemo with label and times structure).

- [ ] **Step 2: Add new template data structure**

After the quickTimes useMemo (line 72), add:

```typescript
// Template definitions for dropdown
const templates = useMemo(() => [
  {
    value: 'three-daily-morning-noon-evening',
    label: t('addProject.threeDailyMorningNoonEvening'),
    times: ['08:00', '12:00', '18:00'],
  },
  {
    value: 'three-daily-before-meals',
    label: t('addProject.threeDailyBeforeMeals'),
    times: ['07:30', '11:30', '17:30'],
  },
  {
    value: 'three-daily-after-meals',
    label: t('addProject.threeDailyAfterMeals'),
    times: ['08:30', '12:30', '18:30'],
  },
  {
    value: 'twice-daily-morning-evening',
    label: t('addProject.twiceDailyMorningEvening'),
    times: ['08:00', '20:00'],
  },
  {
    value: 'once-daily-morning',
    label: t('addProject.onceDailyMorning'),
    times: ['08:00'],
  },
  {
    value: 'once-daily-evening',
    label: t('addProject.onceDailyEvening'),
    times: ['20:00'],
  },
], [t]);
```

- [ ] **Step 3: Verify compilation**

Run: `npm run type-check`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/screens/AddProjectScreen.tsx
git commit -m "feat: define template data structure for dropdown

Replace old template format with value-based structure.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 5: Implement Template Selection Handler

**Files:**
- Modify: `src/screens/AddProjectScreen.tsx` (add handler after handleDescriptionChange)

- [ ] **Step 1: Remove old handleUseTemplate function**

Find and delete the `handleUseTemplate` function (around lines 114-122).

- [ ] **Step 2: Add new handleTemplateChange function**

After `handleDescriptionChange` function (around line 104), add:

```typescript
// Handle template selection from dropdown
const handleTemplateChange = (value: string) => {
  setSelectedTemplate(value);
  
  // Don't process empty/placeholder selection
  if (!value) return;
  
  // Find selected template
  const template = templates.find(t => t.value === value);
  if (!template) return;
  
  // Append times with deduplication
  const merged = [...new Set([...reminderTimes, ...template.times])];
  
  // Sort and update
  setReminderTimes(merged.sort());
};
```

- [ ] **Step 3: Verify TypeScript**

Run: `npm run type-check`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/screens/AddProjectScreen.tsx
git commit -m "feat: implement template selection with append+dedup

Template selection appends times to existing array and automatically
removes duplicates.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 6: Remove Quick Times UI

**Files:**
- Modify: `src/screens/AddProjectScreen.tsx:344-379` (quickTimesGrid section)

- [ ] **Step 1: Remove quickTimesGrid JSX**

In the reminder time section, find and delete the entire quickTimesGrid block (lines 345-379), which includes:
- The comment `{/* 快捷时间 */}`
- The `<View style={styles.quickTimesGrid}>` block with all quickTime chips
- The custom time chip button

- [ ] **Step 2: Remove quickTimes useMemo**

Delete lines 64-72 (the quickTimes constant definition).

- [ ] **Step 3: Remove handleAddQuickTime function**

Delete the `handleAddQuickTime` function (around lines 107-111).

- [ ] **Step 4: Verify compilation**

Run: `npm run type-check`
Expected: No errors (might have warnings about unused styles)

- [ ] **Step 5: Commit**

```bash
git add src/screens/AddProjectScreen.tsx
git commit -m "refactor: remove quick time grid UI

Remove redundant quick time buttons in favor of template dropdown.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 7: Remove Template Cards UI

**Files:**
- Modify: `src/screens/AddProjectScreen.tsx:381-400` (templates section)

- [ ] **Step 1: Remove template cards JSX**

Find and delete the template cards section (lines 381-400), which includes:
- The comment `{/* 时间模板 */}`
- The `<Text style={styles.sectionLabel}>` for templates
- The entire `<View style={styles.templatesContainer}>` block

- [ ] **Step 2: Verify compilation**

Run: `npm run type-check`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/screens/AddProjectScreen.tsx
git commit -m "refactor: remove template cards UI

Remove redundant template cards in favor of dropdown selector.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 8: Add Template Dropdown UI

**Files:**
- Modify: `src/screens/AddProjectScreen.tsx:322-324` (reminder time section)

- [ ] **Step 1: Add dropdown after reminder time label**

After line 324 (the label and hint for reminder time), add:

```typescript
          {/* Template Dropdown */}
          <View style={styles.templateDropdownContainer}>
            <Picker
              selectedValue={selectedTemplate}
              onValueChange={handleTemplateChange}
              style={styles.templatePicker}
            >
              <Picker.Item
                label={t('addProject.selectTemplate')}
                value=""
                color={Platform.OS === 'ios' ? Colors.textDisabled : undefined}
              />
              {templates.map((template) => (
                <Picker.Item
                  key={template.value}
                  label={template.label}
                  value={template.value}
                />
              ))}
            </Picker>
            <Text style={styles.templateHint}>
              💡 {t('addProject.templateChangeHint')}
            </Text>
          </View>
```

- [ ] **Step 2: Verify compilation**

Run: `npm run type-check`
Expected: Errors about missing styles - that's expected, we'll add them next

- [ ] **Step 3: Commit**

```bash
git add src/screens/AddProjectScreen.tsx
git commit -m "feat: add template dropdown selector UI

Add Picker component with template options and hint text.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 9: Add Empty State UI for Selected Times

**Files:**
- Modify: `src/screens/AddProjectScreen.tsx:327-342` (selected times section)

- [ ] **Step 1: Replace selected times display with conditional rendering**

Find the selected times section (lines 327-342) and replace it with:

```typescript
          {/* Selected Times */}
          <View style={styles.selectedTimesSection}>
            <Text style={styles.selectedTimesLabel}>
              {t('addProject.reminderTime')} 
              <Text style={styles.timesCount}>
                {t('addProject.timesCount', { count: reminderTimes.length })}
              </Text>
            </Text>
            
            {reminderTimes.length === 0 ? (
              <View style={styles.emptyTimesContainer}>
                <Text style={styles.emptyTimesText}>
                  {t('addProject.noTimeSelectedHint')}
                </Text>
              </View>
            ) : (
              <View style={styles.selectedTimesList}>
                {reminderTimes.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={styles.selectedTimeChip}
                    onPress={() => handleRemoveTime(time)}
                  >
                    <Text style={styles.selectedTimeText}>{time}</Text>
                    <Text style={styles.removeChipIcon}>×</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
```

- [ ] **Step 2: Verify compilation**

Run: `npm run type-check`
Expected: Errors about missing styles - we'll add them soon

- [ ] **Step 3: Commit**

```bash
git add src/screens/AddProjectScreen.tsx
git commit -m "feat: add empty state for selected times

Show placeholder when no times selected, chips when times exist.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 10: Update Custom Time Button

**Files:**
- Modify: `src/screens/AddProjectScreen.tsx` (custom time button section)

- [ ] **Step 1: Update custom time button**

Find the custom time button (should be after the selected times section) and replace with:

```typescript
          {/* Add Custom Time Button */}
          <TouchableOpacity
            style={styles.customTimeButton}
            onPress={() => {
              if (Platform.OS === 'ios') {
                setShowTimeModal(true);
              } else {
                setShowTimePicker(true);
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.customTimeButtonText}>
              + {t('addProject.customTimeShort')}
            </Text>
          </TouchableOpacity>
```

- [ ] **Step 2: Verify compilation**

Run: `npm run type-check`
Expected: Still have style errors

- [ ] **Step 3: Commit**

```bash
git add src/screens/AddProjectScreen.tsx
git commit -m "refactor: update custom time button styling

Use new dedicated style for custom time button.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 11: Add New Styles

**Files:**
- Modify: `src/screens/AddProjectScreen.tsx:457-736` (styles section)

- [ ] **Step 1: Remove unused styles**

In the StyleSheet.create section, remove these unused styles:
- `quickTimesGrid`
- `quickTimeChip`
- `quickTimeChipSelected`
- `quickTimeChipText`
- `quickTimeChipTextSelected`
- `customTimeChip`
- `customTimeChipText`
- `sectionLabel`
- `templatesContainer`
- `templateCard`
- `templateLabel`
- `templateTimesRow`
- `templateTimeChip`
- `templateTimeText`

- [ ] **Step 2: Add new styles after existing styles**

Add these new styles in the StyleSheet.create:

```typescript
  templateDropdownContainer: {
    marginBottom: 12,
  },
  templatePicker: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  templateHint: {
    fontSize: 12,
    color: Colors.textDisabled,
    marginTop: 6,
  },
  selectedTimesSection: {
    marginBottom: 12,
  },
  selectedTimesLabel: {
    fontSize: 13,
    color: Colors.textDisabled,
    marginBottom: 8,
  },
  timesCount: {
    fontWeight: '600',
    color: Colors.primary,
  },
  emptyTimesContainer: {
    minHeight: 48,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fafafa',
  },
  emptyTimesText: {
    fontSize: 13,
    color: Colors.textDisabled,
    fontStyle: 'italic',
  },
  customTimeButton: {
    width: '100%',
    padding: 12,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  customTimeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
```

- [ ] **Step 3: Verify compilation**

Run: `npm run type-check`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/screens/AddProjectScreen.tsx
git commit -m "style: add styles for new template dropdown UI

Add styles for picker, empty state, and custom time button.
Remove unused quick time and template card styles.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 12: Update Save Button Validation

**Files:**
- Modify: `src/screens/AddProjectScreen.tsx:446-452` (submit button section)

- [ ] **Step 1: Add validation error display**

Find the LargeButton for saving (around line 446) and replace with:

```typescript
        {reminderTimes.length === 0 && (
          <Text style={styles.validationError}>
            {t('addProject.timeRequiredError')}
          </Text>
        )}
        
        <LargeButton
          title={t('addProject.saveProject')}
          onPress={handleSubmit}
          loading={submitting}
          disabled={reminderTimes.length === 0}
          style={styles.submitButton}
        />
```

- [ ] **Step 2: Add validation error style**

In the StyleSheet.create section, add:

```typescript
  validationError: {
    fontSize: 12,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 8,
  },
```

- [ ] **Step 3: Verify compilation**

Run: `npm run type-check`
Expected: No errors

- [ ] **Step 4: Verify the disabled prop is supported**

Check if LargeButton component supports `disabled` prop. If not, we'll need to handle it with opacity/styling instead.

Read: `src/components/LargeButton.tsx`

- [ ] **Step 5: Commit**

```bash
git add src/screens/AddProjectScreen.tsx
git commit -m "feat: add save button validation for empty times

Disable save button and show error when no times selected.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 13: Test Empty State Flow

**Files:**
- Test manually on device/simulator

- [ ] **Step 1: Start development server**

Run: `npm start`
Expected: Metro bundler starts

- [ ] **Step 2: Launch app on simulator/device**

Run: `npx react-native run-ios` or `npx react-native run-android`
Expected: App builds and launches

- [ ] **Step 3: Test empty state**

1. Navigate to Add Project screen
2. Verify dropdown shows "选择常用模板（可选）"
3. Verify empty state shows placeholder text
4. Verify save button is disabled
5. Verify validation error message appears

Expected: All UI elements display correctly in empty state

- [ ] **Step 4: Document test results**

Create a note of any issues found.

---

### Task 14: Test Template Selection Flow

**Files:**
- Test manually on device/simulator

- [ ] **Step 1: Test single template selection**

1. Open Add Project screen
2. Select "每日三次 - 早中晚" from dropdown
3. Verify times 08:00, 12:00, 18:00 appear as chips
4. Verify times count shows "(3个)"
5. Verify save button is enabled

Expected: Template times added correctly

- [ ] **Step 2: Test template switching (append + dedup)**

1. With times 08:00, 12:00, 18:00 already selected
2. Switch to "每日两次 - 早晚"
3. Verify times become: 08:00, 12:00, 18:00, 20:00
4. Verify 08:00 is not duplicated
5. Verify times are sorted

Expected: New time 20:00 appended, no duplicates

- [ ] **Step 3: Test another template with full overlap**

1. Select "每日一次 - 早晨"
2. Verify times remain the same (08:00 already exists)
3. Verify no duplicates

Expected: Deduplication works correctly

- [ ] **Step 4: Document test results**

Note any issues or unexpected behavior.

---

### Task 15: Test Custom Time Addition

**Files:**
- Test manually on device/simulator

- [ ] **Step 1: Test adding custom time**

1. From empty state, click "+ 添加自定义时间"
2. Verify modal/picker appears
3. Select time 14:30
4. Confirm selection
5. Verify 14:30 appears as chip
6. Verify times count updates to "(1个)"

Expected: Custom time added successfully

- [ ] **Step 2: Test adding duplicate custom time**

1. With existing times, try to add a time that already exists
2. Verify alert shows "该时间已存在"
3. Verify time is not duplicated

Expected: Duplicate prevention works

- [ ] **Step 3: Test mixing template and custom**

1. Select template "每日两次 - 早晚" (08:00, 20:00)
2. Add custom time 14:30
3. Verify result: 08:00, 14:30, 20:00 (sorted)

Expected: Template and custom times work together

- [ ] **Step 4: Document test results**

Note any issues.

---

### Task 16: Test Time Deletion

**Files:**
- Test manually on device/simulator

- [ ] **Step 1: Test deleting individual time**

1. Have multiple times selected
2. Tap × on one chip
3. Verify that time is removed
4. Verify other times remain
5. Verify count updates

Expected: Individual deletion works

- [ ] **Step 2: Test deleting all times**

1. Delete times one by one until none remain
2. Verify empty state placeholder appears
3. Verify save button becomes disabled
4. Verify validation error appears

Expected: Returns to empty state correctly

- [ ] **Step 3: Document test results**

Note any issues.

---

### Task 17: Test Edit Mode

**Files:**
- Test manually on device/simulator

- [ ] **Step 1: Create a test project**

1. Create a new project with times: 08:00, 12:00, 18:00
2. Save the project

Expected: Project saved successfully

- [ ] **Step 2: Test editing existing project**

1. Navigate to edit the created project
2. Verify times load correctly as chips
3. Verify dropdown shows default "选择常用模板（可选）"
4. Select a template and verify times append
5. Delete a time and verify it's removed
6. Add custom time and verify it's added
7. Save and verify changes persist

Expected: Edit mode works correctly with all operations

- [ ] **Step 3: Document test results**

Note any issues.

---

### Task 18: Test Edge Cases

**Files:**
- Test manually on device/simulator

- [ ] **Step 1: Test rapid template switching**

1. Quickly switch between multiple templates
2. Verify all times accumulate correctly
3. Verify deduplication works
4. Verify no crashes or UI glitches

Expected: Handles rapid changes smoothly

- [ ] **Step 2: Test maximum times**

1. Add times until you have 8 or more
2. Verify UI handles many chips (wrapping)
3. Verify all operations still work

Expected: UI scales with many times

- [ ] **Step 3: Test form validation**

1. Try to save with empty project name
2. Verify name validation still works
3. Try to save with no times
4. Verify time validation works

Expected: All validations work correctly

- [ ] **Step 4: Document any issues**

Create list of bugs or improvements needed.

---

### Task 19: Final Code Review and Cleanup

**Files:**
- Review: `src/screens/AddProjectScreen.tsx`

- [ ] **Step 1: Remove any commented-out code**

Search for commented code blocks and remove them.

- [ ] **Step 2: Check for console.log statements**

Remove any debug console.log statements.

- [ ] **Step 3: Verify imports are used**

Check that all imports are actually used in the file.

- [ ] **Step 4: Run linter**

Run: `npm run lint` or `npx eslint src/screens/AddProjectScreen.tsx`
Expected: No errors or warnings

Fix any issues found.

- [ ] **Step 5: Commit cleanup**

```bash
git add src/screens/AddProjectScreen.tsx
git commit -m "refactor: cleanup and code review

Remove unused code and fix linting issues.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 20: Update Documentation

**Files:**
- Create/Update: `docs/CHANGELOG.md` or similar

- [ ] **Step 1: Document the changes**

Add entry to changelog or create a migration note:

```markdown
## 2026-04-15 - Simplified Reminder Time Selection

### Changed
- Replaced quick time button grid with dropdown template selector
- Replaced template cards with dropdown options
- Template selection now appends times with automatic deduplication
- Added empty state placeholder for better UX

### Migration Notes
- No data migration needed
- Existing projects load and work correctly
- Users familiar with old UI will need brief orientation to new dropdown

### User Impact
- Simplified interface with less visual clutter
- Faster template selection (1 click vs multiple)
- More flexible time combination with append+dedup behavior
```

- [ ] **Step 2: Commit documentation**

```bash
git add docs/CHANGELOG.md
git commit -m "docs: document reminder time UI simplification

Add changelog entry for template dropdown feature.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Verification Checklist

After completing all tasks, verify:

- [ ] Empty state displays correctly with placeholder text
- [ ] Dropdown shows all 6 templates with correct labels
- [ ] Template selection adds times (tested all 6 templates)
- [ ] Template switching appends and deduplicates correctly
- [ ] Custom time addition works via modal
- [ ] Duplicate time prevention works
- [ ] Time deletion works (individual and all)
- [ ] Save button disabled when no times
- [ ] Validation error message displays
- [ ] Edit mode loads existing times correctly
- [ ] All times display as sorted chips
- [ ] Translations work in both Chinese and English
- [ ] No TypeScript errors
- [ ] No lint errors
- [ ] No console warnings in app

## Success Criteria

1. **UI Simplification**: Quick time grid and template cards removed, replaced with single dropdown
2. **Functionality Preserved**: All original features work (template selection, custom times, deletion)
3. **Enhanced Behavior**: Template switching appends times instead of replacing
4. **Better UX**: Empty state, validation feedback, clear time count
5. **No Bugs**: All edge cases handled correctly
6. **Clean Code**: No unused code, passes linting, good TypeScript types
