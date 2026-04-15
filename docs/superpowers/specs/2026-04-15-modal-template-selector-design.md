# Modal Template Selector and Visual Hierarchy Improvements Design

## Goal

Improve AddProjectScreen visual hierarchy and user experience by:
1. Replacing native Picker with custom Modal template selector (better iOS experience)
2. Enhancing visual hierarchy through stronger typography, spacing, and section differentiation
3. Fixing label readability and spacing issues

## Scope

**In scope:**
- Replace Picker component with TouchableOpacity trigger + Modal selector
- Create TemplateSelectorModal component
- Increase label font size to 16px and change to textPrimary color
- Add 24px top margin to first input container
- Enhance section titles with accent bar, larger font (20px bold)
- Add independent background cards for template section and selected times section
- Adjust overall spacing system (section: 24px, inputContainer: 20px)

**Out of scope:**
- Changes to time selection logic (append+dedup remains)
- Changes to custom time picker Modal (already works well)
- Changes to form validation logic
- Changes to preset selection or mode switching

## Design System

### Visual Hierarchy

**Typography scale:**
- **Level 1 - Section title**: 20px, bold, textPrimary + accent bar
- **Level 2 - Label**: 16px, medium (500), textPrimary
- **Level 3 - Content**: 14-16px, regular/medium, textPrimary
- **Level 4 - Helper**: 12-14px, regular, textSecondary/textDisabled

**Spacing scale:**
- **XL (24px)**: Section-to-section spacing
- **L (20px)**: InputContainer spacing
- **M (16px)**: Card internal padding, card-to-card spacing
- **S (12px)**: Label-to-content, small element spacing
- **XS (8px)**: Chip gaps, minimal spacing

**Color usage:**
- **Primary (#2E5C8A)**: Accent bars, action buttons, selected states
- **Background variants**:
  - White (#FFFFFF): Main content, selected times card
  - Light gray (#F5F7FA): Template section card background
  - Very light gray (#FAFBFC): Empty state background
- **Text hierarchy**:
  - textPrimary (#333): Titles, labels, main content
  - textSecondary (#666): Secondary labels, helper text
  - textDisabled (#999): Placeholders, hints

### Section Differentiation Strategy

1. **Section titles**: Left accent bar (4px × 20px, primary color) + bold 20px text
2. **Template section**: Light gray background card (#F5F7FA) with padding
3. **Selected times section**: White background card with border
4. **Custom time button**: Dashed border style (consistent with existing pattern)

## Component Design

### 1. Section Title Component

**Structure:**
```
┌─ sectionTitleContainer ─────────────┐
│ [■] Section Title (20px bold)       │
│  ↑                                   │
│  accent bar (4×20, primary)          │
└─────────────────────────────────────┘
```

**Styles:**
```typescript
sectionTitleContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 16,
}

sectionTitleAccent: {
  width: 4,
  height: 20,
  backgroundColor: Colors.primary,
  borderRadius: 2,
  marginRight: 12,
}

sectionTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: Colors.textPrimary,
}
```

**Usage:**
```jsx
<View style={styles.sectionTitleContainer}>
  <View style={styles.sectionTitleAccent} />
  <Text style={styles.sectionTitle}>项目信息</Text>
</View>
```

### 2. Label and Input Container

**Label update:**
```typescript
label: {
  fontSize: 16,              // Up from 12px
  fontWeight: '500',         // Medium weight
  color: Colors.textPrimary, // Changed from textSecondary
  marginBottom: 8,
}
```

**Container spacing:**
```typescript
inputContainer: {
  marginBottom: 20,  // Up from 16px
}

firstInputContainer: {
  marginTop: 24,     // New: spacing from section title
  marginBottom: 20,
}
```

**Visual rationale:**
- 16px label matches input text size for reading flow
- textPrimary color ensures labels are not subordinate
- 24px top margin on first input prevents "too close to top" issue
- 20px between containers provides breathing room

### 3. Template Selector Trigger Button

**Design goals:**
- Visually distinct from regular input fields (dashed border)
- Clear affordance for tapping (icon indicator)
- Shows selected state or placeholder

**Styles:**
```typescript
templateSelectorButton: {
  backgroundColor: Colors.cardBackground,
  borderRadius: 8,
  borderWidth: 1.5,
  borderStyle: 'dashed',
  borderColor: Colors.primary,
  padding: 16,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}

templateSelectorText: {
  fontSize: 15,
  color: Colors.textPrimary,
  fontWeight: '500',
}

templateSelectorPlaceholder: {
  fontSize: 15,
  color: Colors.textDisabled,
}

templateSelectorIcon: {
  fontSize: 20,
  color: Colors.primary,
}
```

**UI structure:**
```jsx
<TouchableOpacity 
  style={styles.templateSelectorButton}
  onPress={() => setShowTemplateModal(true)}
>
  <Text style={selectedTemplate ? styles.templateSelectorText : styles.templateSelectorPlaceholder}>
    {selectedTemplate 
      ? templates.find(t => t.value === selectedTemplate)?.label 
      : t('addProject.selectTemplate')}
  </Text>
  <Text style={styles.templateSelectorIcon}>▼</Text>
</TouchableOpacity>
```

### 4. Template Selector Modal

**Design goals:**
- Native iOS bottom sheet experience
- Clear template options with time preview
- Visual feedback for selected state
- Easy to dismiss

**Modal container:**
```typescript
templateModalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'flex-end',
}

templateModalContent: {
  backgroundColor: Colors.cardBackground,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingTop: 20,
  paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  maxHeight: '70%',
}

templateModalHeader: {
  paddingHorizontal: 20,
  paddingBottom: 16,
  borderBottomWidth: 1,
  borderBottomColor: Colors.border,
}

templateModalTitle: {
  fontSize: 18,
  fontWeight: '600',
  color: Colors.textPrimary,
  textAlign: 'center',
}
```

**Template option cards:**
```typescript
templateOptionCard: {
  backgroundColor: Colors.background,  // #F8F9FA
  marginHorizontal: 16,
  marginVertical: 6,
  padding: 16,
  borderRadius: 12,
  borderWidth: 2,
  borderColor: 'transparent',
}

templateOptionCardSelected: {
  backgroundColor: '#E8F0F8',  // Light blue
  borderColor: Colors.primary,
}

templateOptionTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: Colors.textPrimary,
  marginBottom: 8,
}

templateOptionTimes: {
  fontSize: 14,
  color: Colors.textSecondary,
}
```

**Modal structure:**
```jsx
<Modal 
  visible={showTemplateModal} 
  transparent 
  animationType="slide"
  onRequestClose={() => setShowTemplateModal(false)}
>
  <TouchableOpacity 
    style={styles.templateModalOverlay}
    activeOpacity={1}
    onPress={() => setShowTemplateModal(false)}
  >
    <View style={styles.templateModalContent}>
      <View style={styles.templateModalHeader}>
        <Text style={styles.templateModalTitle}>选择常用模板</Text>
      </View>
      
      <ScrollView>
        {templates.map((template) => (
          <TouchableOpacity
            key={template.value}
            style={[
              styles.templateOptionCard,
              selectedTemplate === template.value && styles.templateOptionCardSelected
            ]}
            onPress={() => {
              handleTemplateChange(template.value);
              setShowTemplateModal(false);
            }}
          >
            <Text style={styles.templateOptionTitle}>{template.label}</Text>
            <Text style={styles.templateOptionTimes}>
              {template.times.join(' · ')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  </TouchableOpacity>
</Modal>
```

**Interaction flow:**
1. User taps trigger button → Modal slides up from bottom
2. User taps template option → handleTemplateChange called, Modal closes
3. User taps overlay → Modal closes without selection
4. Selected template shown in trigger button text

### 5. Template Section Card

**Design goal:** Visually group template-related controls in an independent background card

**Styles:**
```typescript
templateSectionCard: {
  backgroundColor: '#F5F7FA',  // Light gray-blue
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: '#E8ECEF',
}

templateSectionLabel: {
  fontSize: 14,
  fontWeight: '600',
  color: Colors.textSecondary,
  marginBottom: 12,
}
```

**Structure:**
```jsx
<View style={styles.templateSectionCard}>
  <Text style={styles.templateSectionLabel}>常用模板</Text>
  
  {/* Template selector button */}
  <TouchableOpacity style={styles.templateSelectorButton}>...</TouchableOpacity>
  
  {/* Hint text */}
  <Text style={styles.templateHint}>
    💡 {t('addProject.templateChangeHint')}
  </Text>
</View>
```

**Visual effect:**
- Light background (#F5F7FA) contrasts with white form area
- Rounded corners + subtle border creates card elevation
- Groups all template-related UI in one visual unit

### 6. Selected Times Card

**Design goal:** Clearly separate selected times from other form elements

**Styles:**
```typescript
selectedTimesCard: {
  backgroundColor: Colors.cardBackground,  // White
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: Colors.border,
}

selectedTimesCardHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 12,
}

selectedTimesLabel: {
  fontSize: 14,
  fontWeight: '600',
  color: Colors.textSecondary,
}

timesCount: {
  fontSize: 14,
  fontWeight: '700',
  color: Colors.primary,
}

selectedTimesList: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
}
```

**Empty state:**
```typescript
emptyTimesContainer: {
  minHeight: 60,
  borderWidth: 1,
  borderStyle: 'dashed',
  borderColor: Colors.border,
  borderRadius: 8,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#FAFBFC',
}

emptyTimesText: {
  fontSize: 13,
  color: Colors.textDisabled,
  fontStyle: 'italic',
}
```

**Structure:**
```jsx
<View style={styles.selectedTimesCard}>
  {/* Header */}
  <View style={styles.selectedTimesCardHeader}>
    <Text style={styles.selectedTimesLabel}>已选时间</Text>
    <Text style={styles.timesCount}>({reminderTimes.length})</Text>
  </View>
  
  {/* Content */}
  {reminderTimes.length === 0 ? (
    <View style={styles.emptyTimesContainer}>
      <Text style={styles.emptyTimesText}>
        {t('addProject.noTimeSelectedHint')}
      </Text>
    </View>
  ) : (
    <View style={styles.selectedTimesList}>
      {reminderTimes.map((time) => (
        <TouchableOpacity key={time} style={styles.selectedTimeChip}>
          <Text style={styles.selectedTimeText}>{time}</Text>
          <Text style={styles.removeChipIcon}>×</Text>
        </TouchableOpacity>
      ))}
    </View>
  )}
</View>
```

**Visual rationale:**
- White card on white background differentiated by border
- Header shows count prominently in primary color
- Empty state uses dashed border to match "add" pattern
- Chips remain visually contained within card boundary

### 7. Overall Layout Structure

**Complete section hierarchy:**
```jsx
<ScrollView contentContainerStyle={styles.contentContainer}>
  {/* Section 1: Project Info */}
  <View style={[styles.section, styles.firstSection]}>
    {/* Section title with accent */}
    <View style={styles.sectionTitleContainer}>
      <View style={styles.sectionTitleAccent} />
      <Text style={styles.sectionTitle}>项目信息</Text>
    </View>
    
    {/* First input with extra top margin */}
    <View style={[styles.inputContainer, styles.firstInputContainer]}>
      <Text style={styles.label}>项目名称 *</Text>
      <TextInput style={styles.input} ... />
      <Text style={styles.hint}>0/20</Text>
    </View>
    
    {/* Second input */}
    <View style={styles.inputContainer}>
      <Text style={styles.label}>项目说明</Text>
      <TextInput style={[styles.input, styles.textArea]} ... />
      <Text style={styles.hint}>0/100</Text>
    </View>
  </View>
  
  {/* Section 2: Reminder Times */}
  <View style={styles.section}>
    {/* Section title with accent */}
    <View style={styles.sectionTitleContainer}>
      <View style={styles.sectionTitleAccent} />
      <Text style={styles.sectionTitle}>提醒时间</Text>
    </View>
    
    {/* Template section card */}
    <View style={styles.templateSectionCard}>
      <Text style={styles.templateSectionLabel}>常用模板</Text>
      <TouchableOpacity style={styles.templateSelectorButton}>...</TouchableOpacity>
      <Text style={styles.templateHint}>💡 提示</Text>
    </View>
    
    {/* Selected times card */}
    <View style={styles.selectedTimesCard}>
      <View style={styles.selectedTimesCardHeader}>
        <Text style={styles.selectedTimesLabel}>已选时间</Text>
        <Text style={styles.timesCount}>({count})</Text>
      </View>
      <View style={styles.selectedTimesList}>...</View>
    </View>
    
    {/* Custom time button */}
    <TouchableOpacity style={styles.customTimeButton}>
      <Text style={styles.customTimeButtonText}>+ 自定义时间</Text>
    </TouchableOpacity>
  </View>
  
  {/* Save button */}
  <LargeButton ... />
</ScrollView>
```

**Spacing summary:**
```typescript
section: {
  marginBottom: 24,  // Section-to-section
}

firstSection: {
  marginTop: 0,      // No top margin for first section
}

inputContainer: {
  marginBottom: 20,  // Between inputs
}

firstInputContainer: {
  marginTop: 24,     // From section title to first input
  marginBottom: 20,
}

templateSectionCard: {
  marginBottom: 16,  // Card spacing
}

selectedTimesCard: {
  marginBottom: 16,  // Card spacing
}
```

## Implementation Impact

### Files Modified

**Modified:**
- `src/screens/AddProjectScreen.tsx` - Major changes to JSX and styles

**No new files created** - Modal component inline within AddProjectScreen

### State Changes

**New state:**
```typescript
const [showTemplateModal, setShowTemplateModal] = useState(false);
```

**Removed:**
- Native Picker component and its styles (templatePicker, templateDropdownContainer)

### Style Changes Summary

**28 style properties modified/added:**

**Modified existing styles:**
1. `label.fontSize`: 12 → 16
2. `label.color`: textSecondary → textPrimary
3. `label.fontWeight`: '600' → '500'
4. `inputContainer.marginBottom`: 16 → 20
5. `section.marginBottom`: 20 → 24 (if exists)

**New styles added:**
6. `sectionTitleContainer`
7. `sectionTitleAccent`
8. `sectionTitle` (updated: fontSize 16→20, fontWeight '600'→'bold')
9. `firstSection`
10. `firstInputContainer`
11. `templateSectionCard`
12. `templateSectionLabel`
13. `templateSelectorButton`
14. `templateSelectorText`
15. `templateSelectorPlaceholder`
16. `templateSelectorIcon`
17. `templateModalOverlay`
18. `templateModalContent`
19. `templateModalHeader`
20. `templateModalTitle`
21. `templateOptionCard`
22. `templateOptionCardSelected`
23. `templateOptionTitle`
24. `templateOptionTimes`
25. `selectedTimesCard`
26. `selectedTimesCardHeader`
27. `selectedTimesLabel` (updated fontSize 12→14)
28. `timesCount`

**Removed styles:**
- `templateDropdownContainer`
- `templatePicker`

### i18n Changes

**No new translation keys needed** - All existing keys remain valid

**Existing keys used:**
- `addProject.selectTemplate` - Modal trigger placeholder
- `addProject.templateChangeHint` - Hint text in template card
- `addProject.reminderTime` - Selected times label
- `addProject.timesCount` - Count display
- `addProject.noTimeSelectedHint` - Empty state text
- `addProject.customTimeShort` - Custom button text

## Interaction Flows

### Template Selection Flow

```
1. User sees template section card with trigger button
   ↓
2. User taps trigger button
   ↓
3. Modal slides up from bottom with template options
   ↓
4. User sees 6 template cards with titles and time previews
   ↓
5a. User taps a template option
    → handleTemplateChange(value) called
    → Times appended to reminderTimes (with dedup)
    → Modal closes with animation
    → Trigger button shows selected template name
    → Selected times card updates with new chips
    
5b. User taps overlay or back gesture
    → Modal closes without change
    → No state update
```

### Visual Hierarchy Perception Flow

```
User opens screen
  ↓
1. Eyes drawn to blue accent bar + bold section title "项目信息"
  ↓
2. Clear separation: first input has breathing room (24px gap)
  ↓
3. Label "项目名称 *" clearly readable (16px, dark color)
  ↓
4. Input field seamlessly follows label (same font size)
  ↓
5. Next section clearly marked with accent bar + "提醒时间"
  ↓
6. Template section visually grouped by light gray card
  ↓
7. Selected times clearly separated in white card with border
  ↓
8. Custom time button distinct with dashed border
```

## Testing Strategy

### Visual Regression Testing

**Test scenarios:**
1. **Empty form state**
   - Section titles with accent bars visible
   - First input has 24px top spacing
   - Labels are 16px and easily readable
   - Template trigger shows placeholder
   - Selected times card shows empty state

2. **Populated form state**
   - All labels clear and prominent
   - Template trigger shows selected template name
   - Selected times card shows 3-4 chips
   - Visual hierarchy clear between sections

3. **Modal interaction**
   - Modal slides in smoothly from bottom
   - Template options clearly displayed with time previews
   - Selected template highlighted
   - Modal dismissible by tap outside

### Functional Testing

**Core functionality:**
- [ ] Template modal opens on trigger button tap
- [ ] Template selection adds times (append+dedup works)
- [ ] Modal closes after selection
- [ ] Selected template name displays in trigger button
- [ ] Times display in chips within card
- [ ] Chip deletion works
- [ ] Custom time button still functional
- [ ] Form validation unchanged
- [ ] Submit flow unchanged

### Cross-device Testing

**Devices:**
- iPhone SE (small screen) - Check spacing doesn't cause overflow
- iPhone 13 (standard) - Optimal layout check
- iPad - Verify no awkward stretching

**Platform-specific:**
- iOS: Modal bottom sheet animation smooth
- Android: Modal displays correctly (no iOS-specific issues)

### Accessibility Testing

**Checks:**
- [ ] All interactive elements ≥28px tap target (existing requirement maintained)
- [ ] Labels 16px readable on all screens
- [ ] Color contrast ratios meet WCAG AA (existing colors maintained)
- [ ] Modal overlay tap target covers full screen
- [ ] Template option cards easily tappable (48px+ height with padding)

## Risks and Mitigations

### Risk 1: Modal performance on low-end devices

**Risk:** Modal with multiple cards may lag on older phones

**Mitigation:**
- Template list is small (6 items max) - minimal render cost
- No complex animations, just native slide
- Cards use simple layout, no heavy computations
- Monitor performance during testing; optimize if needed

### Risk 2: Increased visual complexity

**Risk:** More cards/backgrounds might feel cluttered

**Mitigation:**
- Light background colors (#F5F7FA) provide subtle differentiation
- Card borders are subtle (1px, light gray)
- Spacing system prevents cramming (24px section gaps)
- User testing during implementation to validate

### Risk 3: Label 16px may reduce information density

**Risk:** Larger labels take more space, increase scrolling

**Mitigation:**
- Trade-off accepted: readability > density
- Only 4 labels total on entire form (name, description, reminder time, custom label)
- Increased spacing (24px, 20px) already accounts for layout expansion
- Test on iPhone SE to verify acceptable scroll amount

### Risk 4: Breaking existing user muscle memory

**Risk:** Users accustomed to Picker may be confused by button

**Mitigation:**
- Dashed border + down arrow icon signals "tap to open"
- Visual pattern consistent with custom time button (also dashed)
- Modal UX is more intuitive than Picker scroll wheel
- Minimal user base, low impact if adjustment needed

## Success Criteria

**Visual hierarchy:**
- [ ] Section titles clearly establish content blocks (20px bold + accent bar)
- [ ] Labels are easily readable (16px textPrimary)
- [ ] First input has adequate spacing from title (24px)
- [ ] Template section visually distinct (light gray card)
- [ ] Selected times clearly separated (white card with border)
- [ ] Overall spacing feels comfortable (24px/20px/16px system)

**Template selector:**
- [ ] Modal opens smoothly on iOS and Android
- [ ] Template options clearly show time previews
- [ ] Selected state visually obvious (blue background + border)
- [ ] Modal dismisses correctly (tap option or overlay)
- [ ] Trigger button shows selected template name
- [ ] Append+dedup logic unchanged and functional

**No regressions:**
- [ ] Custom time picker still works
- [ ] Form validation unchanged
- [ ] Submit flow unchanged
- [ ] Edit mode loads correctly
- [ ] All existing functionality intact

**User experience:**
- [ ] Form feels more organized and scannable
- [ ] Template selection more pleasant on iOS than Picker
- [ ] Visual weight balanced (not too heavy or too light)
- [ ] Scrolling amount acceptable on small screens
