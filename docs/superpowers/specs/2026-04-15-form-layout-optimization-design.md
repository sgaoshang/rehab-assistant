# AddProjectScreen Form Layout Optimization Design

## Goal

Optimize the AddProjectScreen form page layout to improve spacing, alignment, and visual hierarchy using a minimalist compact approach. The design maintains the existing functionality (quick time buttons and template cards) while establishing a systematic spacing system and tightening the overall layout for better information density and visual clarity.

## Scope

This optimization focuses on the form page layout only, without changing the time selection mechanism. We work with the current interface that includes quick time buttons and template cards, improving their visual presentation and spacing relationships.

**Base branch**: main (not the dropdown PR branch)

## Design System

### Spacing Constants

All spacing follows 8px base grid:

- **xs (8px)**: Minimum spacing - chip gaps, small element spacing
- **sm (12px)**: Small spacing - card internal padding, label-to-content gap
- **md (16px)**: Standard spacing - input field gaps, section internal spacing
- **lg (20px)**: Large spacing - section-to-section spacing

### Typography Scale

- **Page title**: 24px, bold
- **Section title**: 16px, semibold
- **Input text**: 16px, regular
- **Button/chip text**: 14px, medium
- **Label/hint text**: 12px, regular

### Color Hierarchy

- **Primary text**: Colors.textPrimary - main content, section titles
- **Secondary text**: Colors.textSecondary - labels, unselected states
- **Tertiary text**: Colors.textTertiary - hints, character counts
- **Error**: Colors.error - required markers, validation messages

### Component Sizing

- **Quick time button**: height 28px, paddingVertical 4px, paddingHorizontal 10px
- **Template card**: padding 10px (reduced from 12px)
- **Time chip**: height 28px, paddingVertical 4px, paddingHorizontal 10px
- **Save button**: minHeight 50px (unchanged)

## Layout Structure

### Project Information Section

```
┌─ Section Container (marginBottom: 20) ─────────────────┐
│ [项目信息] 16px semibold                                │
│     ↓ 12px                                              │
│                                                         │
│ [项目名称 *] 12px, Colors.textSecondary                 │
│     ↓ 8px                                               │
│ ┌─ TextInput ─────────────────────────────────────┐    │
│ │ placeholder text / input text (16px)            │    │
│ └─────────────────────────────────────────────────┘    │
│ [0/20] 12px, Colors.textTertiary, align right           │
│     ↓ 4px (marginTop of hint)                           │
│     ↓ 16px (marginBottom of inputGroup)                 │
│                                                         │
│ [项目说明] 12px, Colors.textSecondary                   │
│     ↓ 8px                                               │
│ ┌─ TextInput (multiline) ─────────────────────────┐    │
│ │ placeholder text / input text (16px)            │    │
│ └─────────────────────────────────────────────────┘    │
│ [0/100] 12px, Colors.textTertiary, align right          │
│     ↓ 4px                                               │
└─────────────────────────────────────────────────────────┘
```

### Reminder Time Section

```
┌─ Section Container (marginBottom: 20) ─────────────────┐
│ [提醒时间 *] 16px semibold                              │
│ [说明文字] 12px, Colors.textTertiary                    │
│     ↓ 4px (marginTop of sectionHint)                    │
│     ↓ 12px (marginBottom of title group)                │
│                                                         │
│ [快捷时间] 12px, Colors.textSecondary                   │
│     ↓ 8px                                               │
│ ┌─ Quick Times Grid (gap: 8) ───────────────────┐      │
│ │ [早上] [上午] [中午] [下午]                     │      │
│ │ [傍晚] [晚上] [睡前]                           │      │
│ │ (each button: 28px height, 4/10 padding)      │      │
│ └───────────────────────────────────────────────┘      │
│     ↓ 16px                                              │
│                                                         │
│ [常用模板] 12px, Colors.textSecondary                   │
│     ↓ 8px                                               │
│ ┌─ Template Cards (marginBottom: 8 each) ──────┐       │
│ │ ┌─ Card (padding: 10) ──────────────────┐    │       │
│ │ │ [每日三次] 14px semibold               │    │       │
│ │ │ [08:00 12:00 18:00] 12px secondary    │    │       │
│ │ └───────────────────────────────────────┘    │       │
│ │ ┌─ Card (padding: 10) ──────────────────┐    │       │
│ │ │ [早晚各一次] 14px semibold             │    │       │
│ │ │ [08:00 20:00] 12px secondary          │    │       │
│ │ └───────────────────────────────────────┘    │       │
│ └─────────────────────────────────────────────┘        │
│     ↓ 16px                                              │
│                                                         │
│ [已选择 (3):] 12px, Colors.textSecondary                │
│     ↓ 8px                                               │
│ ┌─ Selected Times (flexWrap, gap: 8) ──────────┐       │
│ │ [08:00 ×] [12:00 ×] [18:00 ×]              │       │
│ │ (each chip: 28px height, 4/10 padding)     │       │
│ └───────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

## Component Specifications

### Input Group

**Style changes:**
- `inputGroup.marginBottom`: 20 → 16
- `label.fontSize`: 14 → 12
- `label.color`: Colors.textPrimary → Colors.textSecondary
- `hintText.fontSize`: 13 → 12
- `hintText.marginTop`: 4 (unchanged)

**Visual hierarchy**: Labels are now visually subordinate to input content, establishing clear reading order.

### Quick Time Buttons

**Style changes:**
- `quickTimeButton.paddingVertical`: 6 → 4
- `quickTimeButton.paddingHorizontal`: 14 → 10
- `quickTimeButton.height`: add 28px
- `quickTimesGrid.gap`: 10 → 8

**States:**
- Unselected: `backgroundColor: Colors.surface, borderColor: Colors.border, textColor: Colors.textSecondary`
- Selected: `backgroundColor: Colors.primary, borderColor: Colors.primary, textColor: #fff`

**Rationale**: Tighter button sizing reduces visual weight while maintaining tap target comfort (28px height meets accessibility guidelines).

### Template Cards

**Style changes:**
- `templateCard.padding`: 12 → 10
- `templateCard.marginBottom`: 10 → 8
- `templateCardTitle.fontSize`: 15 → 14

**States:**
- Unselected: `backgroundColor: Colors.surface, borderColor: Colors.border, borderWidth: 1`
- Selected: `backgroundColor: Colors.primaryLight, borderColor: Colors.primary, borderWidth: 2`

**Rationale**: Reduced padding tightens card footprint while maintaining internal spacing proportions.

### Selected Time Chips

**Style changes:**
- `selectedTimeChip.paddingVertical`: 6 → 4
- `selectedTimeChip.paddingHorizontal`: 12 → 10
- `selectedTimeChip.height`: add 28px
- `selectedTimesContainer.gap`: 10 → 8

**Visual design:**
- Background: Colors.primaryLight
- Border: Colors.primary, 1px
- Text: Colors.primary, 14px
- Delete icon: Colors.primary, 16px

**Rationale**: Chips match quick time button sizing for visual consistency, creating unified 28px height rhythm across interactive elements.

### Section Structure

**Style changes:**
- `sectionTitle.fontSize`: 18 → 16
- `sectionTitle.marginBottom`: 16 → 12
- `section.marginBottom`: 24 → 20
- Add `sectionHint`: fontSize 12, color Colors.textTertiary, marginTop 4

**Hierarchy:**
1. Section title (16px semibold) establishes content block
2. Optional hint text (12px tertiary) provides context
3. Label text (12px secondary) introduces inputs
4. Content (14-16px primary) is the focus

## Implementation Impact

### File Changes

**Modified:**
- `src/screens/AddProjectScreen.tsx`: Update all style definitions in StyleSheet

**Unchanged:**
- Component logic remains identical
- No prop changes
- No state management changes
- No i18n changes needed

### Style Additions

New styles to add:
```typescript
sectionHint: {
  fontSize: 12,
  color: Colors.textTertiary,
  marginTop: 4,
}
```

### Style Modifications

28 style properties modified across 12 style objects:
- inputGroup (1 property)
- label (2 properties)
- hintText (1 property)
- sectionTitle (2 properties)
- section (1 property)
- quickTimeButton (3 properties + 1 new)
- quickTimesGrid (1 property)
- templateCard (2 properties)
- templateCardTitle (1 property)
- selectedTimeChip (3 properties + 1 new)
- selectedTimesContainer (1 property)

### Expected Outcomes

**Visual improvements:**
- Form height reduction: ~15-20%
- Information density: +25% (more content visible without scrolling)
- Visual noise reduction: tighter spacing creates calmer appearance
- Hierarchy clarity: 3-level text size system (16→14→12) improves scannability

**User experience:**
- Faster form completion: less scrolling required
- Clearer focus: reduced visual weight on chrome elements
- Maintained usability: all tap targets meet 28px+ minimum
- Professional appearance: systematic spacing conveys quality

## Testing Strategy

**Visual regression:**
1. Compare before/after screenshots at various content states:
   - Empty form
   - Partial completion (name only)
   - Full completion (name + description + times)
   - Maximum times (8 times selected)

**Spacing verification:**
- Measure spacing between elements using design tools
- Verify all spacing matches xs/sm/md/lg system
- Check no orphaned legacy spacing values remain

**Interactive states:**
- Verify button/card selected states render correctly
- Check chip delete interaction remains responsive
- Confirm scrolling behavior with full content

**Cross-device:**
- Test on iPhone SE (small screen) for minimum comfortable spacing
- Test on iPad for layout adaptation
- Verify no layout breaks at different screen sizes

## Risks and Mitigations

**Risk**: Tighter spacing may feel cramped on small screens
**Mitigation**: All spacing still uses 8px minimum (iOS guideline), test on iPhone SE

**Risk**: Reduced font sizes may hurt readability
**Mitigation**: Content text remains 14-16px, only labels reduced to 12px (still readable)

**Risk**: Users accustomed to current layout may feel disoriented
**Mitigation**: Functionality unchanged, only visual refinement - adaptation should be quick

**Risk**: Smaller tap targets could reduce accessibility
**Mitigation**: All interactive elements maintain 28px height minimum (meets WCAG 2.1 Level AA)

## Success Criteria

- [ ] All spacing values conform to 8/12/16/20 system
- [ ] Form height reduced by 15-20% without functionality loss
- [ ] Typography hierarchy uses only 12/14/16px sizes (excluding title)
- [ ] All interactive elements maintain ≥28px height
- [ ] Visual consistency: buttons and chips share sizing
- [ ] No regressions in existing functionality
- [ ] Passes visual regression testing on iPhone SE and iPad
