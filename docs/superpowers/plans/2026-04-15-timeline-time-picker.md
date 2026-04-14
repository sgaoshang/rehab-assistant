# Timeline Slider Time Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace chip-based time selection in AddProjectScreen with a timeline slider that allows direct manipulation via tap-to-add, drag-to-adjust, and tap-to-delete interactions.

**Architecture:** Create a new TimelineSelector component containing selected time chips display, interactive timeline track with time markers, and instruction hint. Use React Native's PanResponder for gesture handling and Animated API for smooth animations. Times snap to 15-minute intervals with maximum of 8 times.

**Tech Stack:** React Native, TypeScript, PanResponder, Animated API, React Hooks

---

## File Structure

**New Files:**
- `src/components/TimelineSelector.tsx` - Main timeline component

**Modified Files:**
- `src/i18n/types.ts` - Add timeline translation keys
- `src/i18n/translations/zh.ts` - Add Chinese translations
- `src/i18n/translations/en.ts` - Add English translations  
- `src/screens/AddProjectScreen.tsx` - Replace quick times section with TimelineSelector

---

### Task 1: Add i18n Translations

**Files:**
- Modify: `src/i18n/types.ts:126-170`
- Modify: `src/i18n/translations/zh.ts:126-173`
- Modify: `src/i18n/translations/en.ts:126-173`

- [ ] **Step 1: Add translation type definitions**

Edit `src/i18n/types.ts`, add new keys to `addProject` interface:

```typescript
  addProject: {
    // ... existing keys ...
    onceDailyEvening: string;
    // Add new keys below
    timelineInstruction: string;
    timeDuplicate: string;
    timeLimit: string;
    noTimeSelected: string;
    selectPresetDesc: string;
    customProjectDesc: string;
    customTimeShort: string;
  };
```

- [ ] **Step 2: Add Chinese translations**

Edit `src/i18n/translations/zh.ts`, add to `addProject` object after `onceDailyEvening`:

```typescript
    onceDailyEvening: '一日一次(晚)',
    timelineInstruction: '点击时间轴添加提醒时间，拖动圆点调整，点击圆点删除',
    timeDuplicate: '该时间已存在',
    timeLimit: '最多添加8个提醒时间',
    noTimeSelected: '未选择时间',
    selectPresetDesc: '选择预设的康复项目',
    customProjectDesc: '创建自定义项目',
    customTimeShort: '自定义',
```

- [ ] **Step 3: Add English translations**

Edit `src/i18n/translations/en.ts`, add to `addProject` object after `onceDailyEvening`:

```typescript
    onceDailyEvening: 'Once Daily (Evening)',
    timelineInstruction: 'Tap timeline to add time, drag marker to adjust, tap marker to delete',
    timeDuplicate: 'Time already exists',
    timeLimit: 'Maximum 8 reminder times',
    noTimeSelected: 'No time selected',
    selectPresetDesc: 'Choose from preset rehabilitation projects',
    customProjectDesc: 'Create a custom project',
    customTimeShort: 'Custom',
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 5: Commit translations**

```bash
git add src/i18n/types.ts src/i18n/translations/zh.ts src/i18n/translations/en.ts
git commit -m "feat: add timeline selector i18n translations

Add translation keys for timeline instruction, error messages, and
placeholders.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 2: Create TimelineSelector Component Structure

**Files:**
- Create: `src/components/TimelineSelector.tsx`

- [ ] **Step 1: Create component file with imports**

Create `src/components/TimelineSelector.tsx`:

```typescript
import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Alert,
  LayoutChangeEvent,
} from 'react-native';
import { Colors } from '../constants/colors';
import { useTranslation } from '../i18n';

interface TimelineSelectorProps {
  selectedTimes: string[];
  onTimesChange: (times: string[]) => void;
  maxTimes?: number;
}

export const TimelineSelector: React.FC<TimelineSelectorProps> = ({
  selectedTimes,
  onTimesChange,
  maxTimes = 8,
}) => {
  const { t } = useTranslation();
  const [trackWidth, setTrackWidth] = useState(0);

  // Placeholder render for now
  return (
    <View style={styles.container}>
      <Text>Timeline Selector Placeholder</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
```

- [ ] **Step 2: Add helper functions for time conversion**

Add after the component declaration, before `const styles`:

```typescript
// Helper: Convert position (0 to trackWidth) to time string "HH:mm"
const positionToTime = (position: number, trackWidth: number): string => {
  if (trackWidth === 0) return '00:00';
  const ratio = position / trackWidth;
  const totalMinutes = Math.round(ratio * 1440); // 24 hours = 1440 minutes
  const snappedMinutes = Math.round(totalMinutes / 15) * 15; // Snap to 15min
  const hours = Math.floor(snappedMinutes / 60) % 24;
  const minutes = snappedMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// Helper: Convert time string "HH:mm" to position (0 to trackWidth)
const timeToPosition = (time: string, trackWidth: number): number => {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  const ratio = totalMinutes / 1440;
  return ratio * trackWidth;
};
```

- [ ] **Step 3: Build static layout structure**

Replace the placeholder `return` statement with:

```typescript
  return (
    <View style={styles.container}>
      {/* Selected Times Chips */}
      <View style={styles.chipsContainer}>
        {selectedTimes.length === 0 ? (
          <Text style={styles.emptyText}>{t('addProject.noTimeSelected')}</Text>
        ) : (
          selectedTimes.map((time) => (
            <View key={time} style={styles.chip}>
              <Text style={styles.chipText}>{time}</Text>
              <TouchableOpacity
                onPress={() => {
                  onTimesChange(selectedTimes.filter((t) => t !== time));
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.chipDelete}>×</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* Timeline Track */}
      <View style={styles.trackCard}>
        <View
          style={styles.trackContainer}
          onLayout={(e: LayoutChangeEvent) => {
            setTrackWidth(e.nativeEvent.layout.width);
          }}
        >
          {/* Track line */}
          <View style={styles.trackLine} />

          {/* Scale labels */}
          <Text style={[styles.scaleLabel, styles.scaleLabelLeft]}>00:00</Text>
          <Text style={[styles.scaleLabel, styles.scaleLabelRight]}>23:59</Text>

          {/* Time markers - rendered on top of track */}
          {selectedTimes.map((time) => {
            const position = timeToPosition(time, trackWidth);
            return (
              <View
                key={time}
                style={[
                  styles.marker,
                  { left: position },
                ]}
              >
                <Text style={styles.markerLabel}>{time}</Text>
                <View style={styles.markerCircle} />
              </View>
            );
          })}
        </View>
      </View>

      {/* Instruction Hint */}
      <View style={styles.instructionHint}>
        <Text style={styles.instructionText}>{t('addProject.timelineInstruction')}</Text>
      </View>
    </View>
  );
```

- [ ] **Step 4: Add styles**

Replace the `styles` constant with:

```typescript
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    minHeight: 32,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textDisabled,
    fontStyle: 'italic',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 8,
    gap: 6,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  chipDelete: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  trackCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 24,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  trackContainer: {
    width: '100%',
    height: 80,
    position: 'relative',
    justifyContent: 'center',
  },
  trackLine: {
    position: 'absolute',
    left: '10%',
    right: '10%',
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    top: '50%',
    marginTop: -2,
  },
  scaleLabel: {
    position: 'absolute',
    fontSize: 11,
    color: '#95A5A6',
    bottom: 8,
  },
  scaleLabelLeft: {
    left: '10%',
  },
  scaleLabelRight: {
    right: '10%',
  },
  marker: {
    position: 'absolute',
    top: '50%',
    alignItems: 'center',
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  markerLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  markerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  instructionHint: {
    backgroundColor: '#E8F4FD',
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
  },
  instructionText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
});
```

- [ ] **Step 5: Verify component renders**

Start dev server: `npm start`
Expected: App compiles without errors

- [ ] **Step 6: Commit component structure**

```bash
git add src/components/TimelineSelector.tsx
git commit -m "feat: create TimelineSelector component structure

Add basic layout with chips display, timeline track, and instruction
hint. No interactions yet.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Add Tap-to-Add Interaction

**Files:**
- Modify: `src/components/TimelineSelector.tsx`

- [ ] **Step 1: Add tap handler for track**

Find the `trackContainer` View, modify its `onLayout` to also include `onStartShouldSetResponder`:

```typescript
        <View
          style={styles.trackContainer}
          onLayout={(e: LayoutChangeEvent) => {
            setTrackWidth(e.nativeEvent.layout.width);
          }}
          onStartShouldSetResponder={() => true}
          onResponderGrant={(e) => handleTrackPress(e)}
        >
```

- [ ] **Step 2: Implement handleTrackPress function**

Add before the `return` statement in the component:

```typescript
  const handleTrackPress = (e: any) => {
    const touchX = e.nativeEvent.locationX;
    const trackStart = trackWidth * 0.1; // 10% margin
    const trackEnd = trackWidth * 0.9;   // 90% position
    const effectiveWidth = trackEnd - trackStart;
    
    // Calculate relative position within the track
    const relativeX = touchX - trackStart;
    
    // Ignore if outside track bounds
    if (relativeX < 0 || relativeX > effectiveWidth) {
      return;
    }
    
    // Convert to time
    const newTime = positionToTime(relativeX, effectiveWidth);
    
    // Check if time already exists
    if (selectedTimes.includes(newTime)) {
      Alert.alert('', t('addProject.timeDuplicate'));
      return;
    }
    
    // Check if limit reached
    if (selectedTimes.length >= maxTimes) {
      Alert.alert('', t('addProject.timeLimit'));
      return;
    }
    
    // Add and sort times
    const newTimes = [...selectedTimes, newTime].sort();
    onTimesChange(newTimes);
  };
```

- [ ] **Step 3: Test tap-to-add in dev**

Run: `npm start` and test on device/simulator
Expected: Tapping timeline adds times at correct positions, sorted, with 15-min snapping

- [ ] **Step 4: Commit tap-to-add**

```bash
git add src/components/TimelineSelector.tsx
git commit -m "feat: add tap-to-add interaction to timeline

Users can tap anywhere on timeline to add a time point. Times snap to
15-minute intervals, check for duplicates and max limit.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 4: Add Drag-to-Adjust Interaction

**Files:**
- Modify: `src/components/TimelineSelector.tsx`

- [ ] **Step 1: Add state for dragging**

Add after the `trackWidth` state:

```typescript
  const [draggingTime, setDraggingTime] = useState<string | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const dragOffsetAnim = useRef(new Animated.Value(0)).current;
```

- [ ] **Step 2: Create PanResponder for each marker**

Add before the `return` statement:

```typescript
  const createMarkerPanResponder = (time: string) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only start drag if moved more than 5px horizontally
        return Math.abs(gestureState.dx) > 5;
      },
      onPanResponderGrant: (e, gestureState) => {
        setDraggingTime(time);
        setDragStartX(gestureState.x0);
        dragOffsetAnim.setValue(0);
      },
      onPanResponderMove: (e, gestureState) => {
        dragOffsetAnim.setValue(gestureState.dx);
      },
      onPanResponderRelease: (e, gestureState) => {
        // If movement < 5px, treat as tap (delete)
        if (Math.abs(gestureState.dx) < 5) {
          handleDeleteTime(time);
          setDraggingTime(null);
          dragOffsetAnim.setValue(0);
          return;
        }
        
        // Calculate new position
        const trackStart = trackWidth * 0.1;
        const trackEnd = trackWidth * 0.9;
        const effectiveWidth = trackEnd - trackStart;
        
        const currentPosition = timeToPosition(time, effectiveWidth);
        const newPosition = currentPosition + gestureState.dx;
        
        // Constrain to bounds
        const constrainedPosition = Math.max(0, Math.min(effectiveWidth, newPosition));
        
        // Convert to time
        const newTime = positionToTime(constrainedPosition, effectiveWidth);
        
        // Check for duplicate
        const otherTimes = selectedTimes.filter((t) => t !== time);
        if (otherTimes.includes(newTime)) {
          Alert.alert('', t('addProject.timeDuplicate'));
          setDraggingTime(null);
          dragOffsetAnim.setValue(0);
          return;
        }
        
        // Update time
        const newTimes = [...otherTimes, newTime].sort();
        onTimesChange(newTimes);
        
        setDraggingTime(null);
        dragOffsetAnim.setValue(0);
      },
    });
  };
  
  const handleDeleteTime = (time: string) => {
    onTimesChange(selectedTimes.filter((t) => t !== time));
  };
```

- [ ] **Step 3: Apply PanResponder to markers**

Modify the markers rendering in the `return` statement to use `Animated.View` and apply pan responder:

```typescript
          {/* Time markers - rendered on top of track */}
          {selectedTimes.map((time) => {
            const trackStart = trackWidth * 0.1;
            const trackEnd = trackWidth * 0.9;
            const effectiveWidth = trackEnd - trackStart;
            const position = timeToPosition(time, effectiveWidth) + trackStart;
            
            const isDragging = draggingTime === time;
            const panResponder = createMarkerPanResponder(time);
            
            return (
              <Animated.View
                key={time}
                {...panResponder.panHandlers}
                style={[
                  styles.marker,
                  {
                    left: isDragging
                      ? position
                      : position,
                    transform: [
                      { translateX: isDragging ? dragOffsetAnim : 0 },
                      { translateY: -10 },
                    ],
                  },
                ]}
              >
                <Text style={styles.markerLabel}>{time}</Text>
                <View style={styles.markerCircle} />
              </Animated.View>
            );
          })}
```

- [ ] **Step 4: Test drag interaction**

Run: `npm start` and test on device/simulator
Expected: 
- Tap marker (< 5px movement) deletes it
- Drag marker adjusts time smoothly
- Release snaps to 15-min interval
- Duplicate times show alert and revert

- [ ] **Step 5: Commit drag-to-adjust**

```bash
git add src/components/TimelineSelector.tsx
git commit -m "feat: add drag-to-adjust and tap-to-delete interactions

Users can drag markers to adjust times or tap to delete. Movement > 5px
triggers drag mode, < 5px is treated as delete tap.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 5: Add Animations

**Files:**
- Modify: `src/components/TimelineSelector.tsx`

- [ ] **Step 1: Add animation state for markers**

Add to imports:

```typescript
import { useEffect } from 'react';
```

Add after existing state:

```typescript
  const markerScales = useRef<{ [key: string]: Animated.Value }>({}).current;
```

- [ ] **Step 2: Initialize scale animations for markers**

Add before the `return` statement:

```typescript
  // Initialize scale animations for each marker
  useEffect(() => {
    selectedTimes.forEach((time) => {
      if (!markerScales[time]) {
        markerScales[time] = new Animated.Value(0);
        // Animate in
        Animated.spring(markerScales[time], {
          toValue: 1,
          tension: 100,
          friction: 7,
          useNativeDriver: true,
        }).start();
      }
    });
    
    // Clean up removed times
    Object.keys(markerScales).forEach((time) => {
      if (!selectedTimes.includes(time)) {
        delete markerScales[time];
      }
    });
  }, [selectedTimes]);
```

- [ ] **Step 3: Apply scale animation to markers**

Modify marker rendering to include scale transform:

```typescript
              <Animated.View
                key={time}
                {...panResponder.panHandlers}
                style={[
                  styles.marker,
                  {
                    left: isDragging ? position : position,
                    transform: [
                      { translateX: isDragging ? dragOffsetAnim : 0 },
                      { translateY: -10 },
                      { scale: markerScales[time] || 1 },
                    ],
                  },
                ]}
              >
```

- [ ] **Step 4: Add drag scale effect**

Modify `onPanResponderGrant` to scale up marker:

```typescript
      onPanResponderGrant: (e, gestureState) => {
        setDraggingTime(time);
        setDragStartX(gestureState.x0);
        dragOffsetAnim.setValue(0);
        
        // Scale up marker
        Animated.spring(markerScales[time], {
          toValue: 1.1,
          tension: 100,
          friction: 7,
          useNativeDriver: true,
        }).start();
      },
```

Modify `onPanResponderRelease` to scale back:

```typescript
      onPanResponderRelease: (e, gestureState) => {
        // Scale back to normal
        Animated.spring(markerScales[time], {
          toValue: 1,
          tension: 100,
          friction: 7,
          useNativeDriver: true,
        }).start();
        
        // If movement < 5px, treat as tap (delete)
        if (Math.abs(gestureState.dx) < 5) {
          // Animate out before deleting
          Animated.timing(markerScales[time], {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            handleDeleteTime(time);
          });
          setDraggingTime(null);
          dragOffsetAnim.setValue(0);
          return;
        }
        
        // ... rest of existing release logic
```

- [ ] **Step 5: Test animations**

Run: `npm start` and test on device/simulator
Expected:
- New markers scale in smoothly
- Drag scales marker to 1.1x
- Release scales back to 1x
- Delete animates marker out before removing

- [ ] **Step 6: Commit animations**

```bash
git add src/components/TimelineSelector.tsx
git commit -m "feat: add animations to timeline markers

Markers scale in on add, scale up during drag, and animate out on
delete for smooth visual feedback.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 6: Integrate TimelineSelector into AddProjectScreen

**Files:**
- Modify: `src/screens/AddProjectScreen.tsx:320-380`

- [ ] **Step 1: Import TimelineSelector**

Add to imports at top of file:

```typescript
import { TimelineSelector } from '../components/TimelineSelector';
```

- [ ] **Step 2: Remove old time selection code**

Find the section starting with `{/* 已选时间 */}` (around line 327) and the `{/* 快捷时间 */}` section (around line 345).

Delete from:
```typescript
          {/* 已选时间 */}
          {reminderTimes.length > 0 && (
```

To (including the closing of the quick times section):
```typescript
          </View>

          {/* 常用时间模板 */}
```

This removes:
- selectedTimesContainer
- selectedTimesList  
- quickTimesGrid
- customTimeChip

- [ ] **Step 3: Add TimelineSelector component**

Replace the deleted section with:

```typescript
          {/* 时间轴选择器 */}
          <TimelineSelector
            selectedTimes={reminderTimes}
            onTimesChange={setReminderTimes}
            maxTimes={8}
          />

          {/* 常用时间模板 */}
```

- [ ] **Step 4: Remove unused state and functions**

Delete these lines from AddProjectScreen:

```typescript
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [tempTime, setTempTime] = useState(new Date());
```

Delete these functions:

```typescript
  // Quick time options
  const quickTimes = useMemo(() => [
    // ... entire quickTimes array
  ], [t]);
  
  // 添加快捷时间
  const handleAddQuickTime = (time: string) => {
    // ...
  };
  
  // 使用时间模板  
  const handleUseTemplate = (times: string[]) => {
    // ...
  };
  
  // 处理时间选择
  const handleTimeChange = (event: any, selectedDate?: Date) => {
    // ...
  };
  
  const handleRemoveTime = (time: string) => {
    // ... (this is now handled by TimelineSelector)
  };
```

- [ ] **Step 5: Remove time picker modals**

Find and delete the time picker modal sections (iOS modal and Android DateTimePicker):

Delete from:
```typescript
        {/* iOS 时间选择模态框 */}
        <Modal
```

To:
```typescript
        </Modal>

        {/* 常用时间模板 */}
```

And delete:

```typescript
        {/* Android 时间选择器 */}
        {showTimePicker && Platform.OS === 'android' && (
          <DateTimePicker
            value={tempTime}
            mode="time"
            is24Hour={true}
            onChange={handleTimeChange}
          />
        )}
```

- [ ] **Step 6: Remove unused styles**

Delete these style definitions from the `styles` constant:

```typescript
  selectedTimesContainer: { /* ... */ },
  selectedTimesList: { /* ... */ },
  selectedTimeChip: { /* ... */ },
  selectedTimeText: { /* ... */ },
  deleteButton: { /* ... */ },
  deleteButtonText: { /* ... */ },
  quickTimesGrid: { /* ... */ },
  quickTimeChip: { /* ... */ },
  quickTimeChipSelected: { /* ... */ },
  quickTimeChipText: { /* ... */ },
  quickTimeChipTextSelected: { /* ... */ },
  customTimeChip: { /* ... */ },
  customTimeChipText: { /* ... */ },
  timePickerContainer: { /* ... */ },
  timePickerButtons: { /* ... */ },
  timePickerButton: { /* ... */ },
  timePickerButtonText: { /* ... */ },
```

- [ ] **Step 7: Remove DateTimePicker import**

Remove from imports:

```typescript
import DateTimePicker from '@react-native-community/datetimepicker';
```

- [ ] **Step 8: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 9: Test integration**

Run: `npm start` and test full flow
Expected:
- Add Project screen shows timeline selector
- Can add, adjust, and delete times
- Save button validates correctly
- Edit mode loads existing times onto timeline
- Project saves with correct times

- [ ] **Step 10: Commit integration**

```bash
git add src/screens/AddProjectScreen.tsx
git commit -m "feat: replace chip-based time selection with timeline

Remove quick times grid and custom time modal. Replace with
TimelineSelector component for direct timeline manipulation.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

### Task 7: Manual Testing and Bug Fixes

**Files:**
- All modified files (iterate as needed)

- [ ] **Step 1: Test empty state**

Manual test:
1. Open Add Project screen
2. Verify "未选择时间" placeholder shows
3. Verify save button is disabled

Expected: Empty state displays correctly, save blocked

- [ ] **Step 2: Test adding times**

Manual test:
1. Tap timeline at various positions
2. Verify times snap to 15-min intervals
3. Verify times appear as chips above
4. Verify times appear as markers on timeline
5. Verify times are sorted in chips

Expected: All add interactions work correctly

- [ ] **Step 3: Test duplicate prevention**

Manual test:
1. Add a time (e.g., 08:00)
2. Tap timeline at same position
3. Verify alert shows "该时间已存在"

Expected: Duplicate prevention works

- [ ] **Step 4: Test max limit**

Manual test:
1. Add 8 times
2. Try to add 9th time
3. Verify alert shows "最多添加8个提醒时间"

Expected: Limit enforcement works

- [ ] **Step 5: Test drag to adjust**

Manual test:
1. Add a time
2. Press and drag marker left/right
3. Verify marker follows finger
4. Verify time label updates during drag
5. Release and verify snap to 15-min
6. Verify chip updates to new time

Expected: Drag adjustment smooth and accurate

- [ ] **Step 6: Test tap to delete marker**

Manual test:
1. Add a time
2. Tap marker (no drag)
3. Verify marker animates out
4. Verify chip disappears

Expected: Tap delete works

- [ ] **Step 7: Test chip delete button**

Manual test:
1. Add a time
2. Tap × on chip
3. Verify chip disappears
4. Verify marker disappears

Expected: Chip delete works

- [ ] **Step 8: Test edge collision**

Manual test:
1. Add time at 08:00
2. Drag another time to 08:00
3. Verify alert and revert to original

Expected: Collision prevention works

- [ ] **Step 9: Test project save**

Manual test:
1. Fill in project name
2. Add times via timeline
3. Save project
4. Verify project appears on home screen with correct times

Expected: Save works correctly

- [ ] **Step 10: Test edit mode**

Manual test:
1. Edit an existing project
2. Verify existing times load on timeline
3. Adjust times
4. Save
5. Verify changes persist

Expected: Edit mode works

- [ ] **Step 11: Fix any bugs discovered**

If bugs found during testing:
1. Note the bug
2. Fix in relevant file
3. Re-test
4. Commit fix with descriptive message

- [ ] **Step 12: Final commit**

If any bugs were fixed:

```bash
git add .
git commit -m "fix: address timeline selector edge cases

[List specific fixes made]

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Testing Checklist

After all tasks complete, verify:

- [ ] Timeline renders correctly on small screens (320px width)
- [ ] Tap adds time at correct position
- [ ] Times snap to 15-minute intervals
- [ ] Duplicate times prevented
- [ ] Max 8 times enforced
- [ ] Drag adjusts time smoothly
- [ ] Tap on marker deletes it
- [ ] Chip × deletes corresponding marker
- [ ] Animations are smooth (60fps)
- [ ] Empty state displays correctly
- [ ] Save validates at least one time
- [ ] Edit mode loads existing times
- [ ] Project saves with correct times
- [ ] Both languages (zh/en) work correctly

## Success Criteria

- ✅ TimelineSelector component created
- ✅ All three interactions work (tap-add, drag-adjust, tap-delete)
- ✅ Animations smooth and polished
- ✅ Integrated into AddProjectScreen
- ✅ Old chip-based code removed
- ✅ All tests pass
- ✅ No TypeScript errors
- ✅ Design matches spec
