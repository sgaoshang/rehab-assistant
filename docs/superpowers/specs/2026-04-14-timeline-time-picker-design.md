# Timeline Slider Time Picker Design

**Date:** 2026-04-14  
**Feature:** Replace chip-based time selection with timeline slider interaction

## Goal

Replace the current chip-based time selection in AddProjectScreen with a timeline slider interface that provides intuitive visual feedback, easier time adjustment through drag interactions, and clearer visualization of time distribution across the day.

## Context

The rehabilitation assistant app currently uses a chip-based time selection where users tap preset times or add custom times via a modal. This design will replace it with a timeline slider that allows direct manipulation of time points on a visual timeline representing a 24-hour day.

## Design Constraints

- Maximum 8 reminder times per project
- Times snap to 15-minute intervals (00, 15, 30, 45)
- Maintain consistent design language with existing app (card-based, professional blue-green palette)
- Must work on mobile screens (minimum width ~320px)
- Support both touch gestures and simple taps

## Visual Design

### Layout Structure

```
┌─────────────────────────────────────────┐
│ Selected Times Chips                     │
│ [08:00 ×] [12:00 ×] [18:00 ×]           │
│                                          │
│ Timeline Track                           │
│ 00:00  ━━●━━━━━●━━━━━━━━━●━━  23:59    │
│        08:00   12:00       18:00         │
│        │       │           │             │
│        06:00   12:00       18:00         │
│                                          │
│ Instruction Hint                         │
│ "点击时间轴添加提醒时间，拖动调整"      │
└─────────────────────────────────────────┘
```

### Selected Times Chips (Top Section)

- **Layout:** Horizontal flex wrap, gap 8px
- **Chip Style:**
  - Background: #2E5C8A (primary blue)
  - Text: White, 14px, medium weight
  - Border radius: 12px
  - Padding: 6px 12px
  - Delete button: × symbol, 16px, right aligned with 6px gap
- **Sorting:** Times automatically sorted in ascending order
- **Empty State:** Show placeholder text "未选择时间" in light gray (#95A5A6)

### Timeline Track

- **Container:**
  - Background: White card (#FFFFFF)
  - Border radius: 8px
  - Padding: 24px 16px
  - Shadow: 0 2px 8px rgba(0,0,0,0.08)
  
- **Track Line:**
  - Height: 4px
  - Background: #E0E0E0 (light gray)
  - Border radius: 2px
  - Horizontal margin: 10% on each side (leave space for edge labels)

- **Time Point Markers:**
  - Circle diameter: 20px
  - Background: #2E5C8A (primary blue)
  - Border: 3px solid white
  - Box shadow: 0 2px 8px rgba(46,92,138,0.3)
  - Position: Centered on track line

- **Time Labels (above markers):**
  - Font size: 13px
  - Font weight: 600 (semi-bold)
  - Color: #2E5C8A
  - Position: 8px above marker center
  - Format: "HH:mm" (e.g., "08:00")

- **Scale Labels (below track):**
  - Left edge: "00:00" at 10% position
  - Right edge: "23:59" at 90% position
  - Mid-points: "06:00", "12:00", "18:00" (light gray, 11px, positioned below track)
  - Color: #95A5A6
  - Font size: 11px

### Instruction Hint

- **Layout:** Below timeline, centered
- **Style:**
  - Background: #E8F4FD (light blue)
  - Border left: 3px solid #2E5C8A
  - Padding: 12px
  - Border radius: 8px
  - Margin top: 16px
- **Text:** 
  - Chinese: "点击时间轴添加提醒时间，拖动圆点调整，点击圆点删除"
  - English: "Tap timeline to add time, drag marker to adjust, tap marker to delete"
  - Font size: 12px
  - Color: #7f8c8d

## Interaction Behavior

### Adding a Time Point

1. **User Action:** Tap anywhere on the timeline track
2. **System Response:**
   - Calculate time from tap position (position / track width * 1440 minutes)
   - Round to nearest 15-minute interval
   - Check if time already exists (prevent duplicates)
   - Check if limit reached (max 8 times)
   - If valid:
     - Add time to reminderTimes array
     - Animate marker appearance (scale from 0 to 1, 200ms)
     - Add chip to top section
     - Sort times in ascending order
   - If invalid:
     - Show toast message:
       - Duplicate: "该时间已存在"
       - Limit: "最多添加8个提醒时间"

### Adjusting a Time Point

1. **User Action:** Press on a time marker and drag (movement > 5px horizontally triggers drag mode)
2. **System Response:**
   - On drag start (movement detected):
     - Increase marker size by 10% (scale animation 150ms)
     - Attach marker to finger position
     - Show haptic feedback (if available)
   - During drag:
     - Move marker with finger horizontally (constrain to track bounds)
     - Show real-time time preview (update label continuously)
     - No snapping during drag (smooth movement)
   - On release:
     - Calculate final time from position
     - Round to nearest 15-minute interval
     - Check for duplicates with other times
     - If valid:
       - Snap to final position (spring animation 100ms)
       - Update time in array
       - Update chip display
       - Return marker to normal size
     - If duplicate:
       - Return to original position (spring animation 200ms)
       - Show toast: "该时间已存在"

**Note:** To distinguish between tap (delete) and drag (adjust), the system detects horizontal movement. If movement is less than 5px, it's treated as a tap and deletes the marker. If movement is 5px or more, it enters drag mode to adjust the time.

### Deleting a Time Point

**Method 1 - Tap Marker:**
1. User taps on a time marker
2. Marker scales down and fades out (200ms)
3. Remove from reminderTimes array
4. Remove corresponding chip
5. Update display

**Method 2 - Tap Chip Delete Button (×):**
1. User taps × on a chip
2. Chip fades out (150ms)
3. Corresponding marker fades out (150ms)
4. Remove from reminderTimes array
5. Update display

### Edge Cases

- **No times selected:** Show empty state, disable save button
- **Tap timeline at position that rounds to existing time:** Show toast "该时间已存在", do not add duplicate
- **Tap directly on marker:** Delete that marker (< 5px movement = tap)
- **Drag marker onto existing time:** Return to original position with error message "该时间已存在"
- **Rapid taps:** Debounce add action (100ms) to prevent double-adding
- **Drag outside track bounds:** Constrain marker to track area (0% to 100%)

## Technical Implementation

### Component Structure

```
TimelineSelector (new component)
├── SelectedTimesChips
│   └── TimeChip (×N)
├── TimelineTrack
│   ├── TrackLine (background bar)
│   ├── ScaleLabels (00:00, 06:00, ..., 23:59)
│   └── TimeMarker (×N, one per selected time)
│       ├── MarkerCircle
│       └── TimeLabel
└── InstructionHint
```

### State Management

```typescript
// In AddProjectScreen
const [reminderTimes, setReminderTimes] = useState<string[]>([]);
const MAX_REMINDER_TIMES = 8;

// Helper functions
const positionToTime = (position: number, trackWidth: number): string => {
  const totalMinutes = Math.round((position / trackWidth) * 1440);
  const snappedMinutes = Math.round(totalMinutes / 15) * 15;
  const hours = Math.floor(snappedMinutes / 60);
  const minutes = snappedMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const timeToPosition = (time: string, trackWidth: number): number => {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  return (totalMinutes / 1440) * trackWidth;
};
```

### Gesture Handling (PanResponder)

```typescript
const panResponder = useRef(
  PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onStartShouldSetPanResponderCapture: () => false,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      // Only start drag if moved more than 5px horizontally
      return Math.abs(gestureState.dx) > 5;
    },
    
    onPanResponderGrant: (evt, gestureState) => {
      // Drag gesture detected, prepare for dragging
      // Record initial position
      // Scale up marker (will happen once movement > 5px is detected)
    },
    
    onPanResponderMove: (evt, gestureState) => {
      // Update marker position based on gestureState.dx
      // Calculate and display real-time time
      // Constrain to track bounds
    },
    
    onPanResponderRelease: (evt, gestureState) => {
      // Calculate final time from position
      // Snap to 15-minute interval
      // Check for duplicates
      // Update state or revert to original
      // Animate to final position
    },
  })
).current;
```

### Animation Implementation

Use React Native's `Animated` API:

```typescript
// Marker appearance
const scaleAnim = useRef(new Animated.Value(0)).current;
Animated.spring(scaleAnim, {
  toValue: 1,
  tension: 100,
  friction: 7,
  useNativeDriver: true,
}).start();

// Marker drag scale
const dragScaleAnim = useRef(new Animated.Value(1)).current;
// Scale to 1.1 on long press start
// Scale back to 1 on release

// Marker deletion
const fadeAnim = useRef(new Animated.Value(1)).current;
Animated.parallel([
  Animated.timing(fadeAnim, {
    toValue: 0,
    duration: 200,
    useNativeDriver: true,
  }),
  Animated.timing(scaleAnim, {
    toValue: 0,
    duration: 200,
    useNativeDriver: true,
  }),
]).start(() => {
  // Remove from array after animation
});
```

### Accessibility

- Time markers should have accessibilityLabel: "提醒时间 {time}"
- Timeline track should have accessibilityHint: "双击添加提醒时间"
- Delete buttons should have accessibilityLabel: "删除 {time}"
- Ensure minimum touch target size of 44×44pt

## Integration Points

### Replace Existing Time Selection

**File:** `src/screens/AddProjectScreen.tsx`

**Current implementation (to be removed):**
- Quick times grid with chip buttons
- Custom time modal
- Template time sets

**New implementation:**
- TimelineSelector component
- Direct manipulation on timeline
- No modal dialogs needed

**Preserved elements:**
- reminderTimes state array (same format)
- Validation logic (at least one time required)
- Selected count display above timeline

### Data Format

No changes needed to data structure:
- reminderTimes remains `string[]` with format "HH:mm"
- Times stored in ascending order
- Same validation rules apply

## Testing Considerations

### Visual Tests
- Timeline renders correctly on different screen widths
- Markers positioned accurately at time boundaries
- Labels don't overlap on small screens
- Animations smooth and performant

### Interaction Tests
- Tap on timeline adds time at correct position
- Times snap to 15-minute intervals correctly
- Duplicate times are prevented
- Maximum 8 times enforced
- Long press triggers drag mode
- Drag updates time smoothly
- Release snaps to nearest 15-minute mark
- Tap on marker deletes it
- Tap on chip × deletes corresponding marker
- Both deletion methods update both views

### Edge Cases
- Empty state displays correctly
- Adding first time works
- Deleting all times returns to empty state
- Dragging marker to duplicate time reverts
- Rapid taps don't create duplicates
- Very small screen sizes (320px width) still usable

### Regression Tests
- Save button still validates correctly
- Form submission includes timeline times
- Edit mode loads existing times onto timeline
- Navigation preserves state correctly

## Success Metrics

- Users can add a time in one tap (vs. current 2-3 taps for custom time)
- Time adjustment requires no modal opening
- Visual distribution of times is immediately apparent
- No increase in user errors (duplicate times, wrong times selected)
- Component renders and animates at 60fps on mid-range devices

## Future Enhancements (Out of Scope)

- Custom snap intervals (e.g., 30-minute instead of 15-minute)
- Time range selection (select start and end time)
- Common time patterns as preset buttons below timeline
- Haptic feedback for Android devices
- Voice input for time selection
