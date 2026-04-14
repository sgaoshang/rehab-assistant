# 提醒时间设置改进设计

**日期：** 2026-04-15  
**功能：** 简化提醒时间设置，只保留常用模板（下拉选择）和自定义时间

## 目标

简化 AddProjectScreen 中的提醒时间设置界面，移除当前复杂的快捷时间网格和模板卡片，改为更简洁的下拉框模板选择方式，降低界面复杂度，提升用户体验。

## 背景

当前的提醒时间设置包含：
- 快捷时间网格（早晨、中午、下午、晚上等7个按钮）
- 时间模板卡片（每日三次-早中晚、饭前、饭后等6个卡片）
- 自定义时间按钮（弹出模态框选择器）

用户反馈界面过于复杂，快捷时间和模板功能重复，占用过多屏幕空间。

## 设计约束

- 至少需要选择一个提醒时间才能保存项目
- 时间格式保持为 "HH:mm"（如 "08:00"）
- 时间自动按升序排序
- 保持与现有应用的设计语言一致（卡片式、蓝绿色调）
- 兼容编辑模式（编辑现有项目时需正确加载已有时间）

## 设计方案

### 界面布局

```
┌─────────────────────────────────────────┐
│ 项目名称 *                               │
│ [___________________________________]    │
│                                          │
│ 项目描述                                 │
│ [___________________________________]    │
│ [___________________________________]    │
│                                          │
│ 提醒时间 *                               │
│ ┌─────────────────────────────────────┐ │
│ │ 选择常用模板（可选）            ▼   │ │
│ └─────────────────────────────────────┘ │
│ 💡 选择模板后会自动添加时间...           │
│                                          │
│ 已选时间 (3个)                           │
│ [08:00 ×] [12:00 ×] [18:00 ×]           │
│                                          │
│ [+ 添加自定义时间]                       │
│                                          │
│ [保存项目]                               │
└─────────────────────────────────────────┘
```

### 组件结构

1. **常用模板下拉框**
   - 默认选项："选择常用模板（可选）" - 灰色文字
   - 模板选项：
     - 每日三次 - 早中晚 (08:00, 12:00, 18:00)
     - 每日三次 - 饭前 (07:30, 11:30, 17:30)
     - 每日三次 - 饭后 (08:30, 12:30, 18:30)
     - 每日两次 - 早晚 (08:00, 20:00)
     - 每日一次 - 早晨 (08:00)
     - 每日一次 - 晚上 (20:00)
   - 样式：白色背景，1px灰色边框，8px圆角，14px字号

2. **提示文字**
   - 内容："💡 选择模板后会自动添加时间，切换模板会追加新时间（自动去重）"
   - 样式：12px字号，灰色文字，位于下拉框下方

3. **已选时间显示区域**
   - 标签："已选时间 (N个)" - 13px字号，灰色
   - 空状态：
     - 显示占位框（1px虚线边框，圆角8px）
     - 居中显示："请选择模板或添加自定义时间" - 斜体，灰色
     - 最小高度：48px
   - 有数据状态：
     - 时间chips横向排列，自动换行
     - 每个chip：蓝色背景(#2E5C8A)，白色文字，12px圆角
     - 格式："HH:mm ×"
     - 点击 × 删除该时间

4. **添加自定义时间按钮**
   - 文字："+ 添加自定义时间"
   - 样式：白色背景，1px蓝色虚线边框，8px圆角
   - 点击后弹出现有的时间选择器模态框

5. **保存按钮**
   - 禁用状态（reminderTimes.length === 0）：
     - 灰色背景(#ccc)，灰色文字(#888)
     - 下方显示提示："请至少添加一个提醒时间" - 红色文字
   - 启用状态：蓝色背景(#2E5C8A)，白色文字

### 交互行为

#### 1. 初始状态（新建项目）

- 下拉框显示："选择常用模板（可选）"
- 已选时间为空数组 `[]`
- 显示空状态占位符
- 保存按钮禁用

#### 2. 选择模板

用户从下拉框选择一个模板（非默认选项）时：

```typescript
handleTemplateChange = (value: string) => {
  if (value === 'placeholder') {
    // 选择了默认占位选项，不做任何操作
    return;
  }
  
  // 获取模板对应的时间数组
  const templateTimes = getTemplateTimesByValue(value);
  
  // 追加去重：合并已有时间和模板时间，使用Set去重
  const mergedTimes = [...new Set([...reminderTimes, ...templateTimes])];
  
  // 排序并更新状态
  setReminderTimes(mergedTimes.sort());
};
```

**行为示例：**
- 初始状态：`reminderTimes = []`
- 选择"每日三次 - 早中晚"：`reminderTimes = ['08:00', '12:00', '18:00']`
- 再选择"每日两次 - 早晚"：`reminderTimes = ['08:00', '12:00', '18:00', '20:00']`
  - 追加了新时间 20:00
  - 08:00 已存在，自动去重

#### 3. 切换模板

用户在已有时间的情况下切换模板：
- 保留所有已选时间
- 将新模板的时间追加到数组
- 自动去除重复时间
- 自动按时间升序排序

**示例：**
```
已有时间：08:00, 12:00, 18:00
切换到"每日三次 - 饭前"
结果：07:30, 08:00, 11:30, 12:00, 17:30, 18:00
```

用户可以手动删除不需要的时间。

#### 4. 添加自定义时间

- 点击"+ 添加自定义时间"按钮
- 弹出现有的时间选择器模态框（iOS滚轮样式）
- 用户选择时间并确认
- 检查时间是否已存在：
  - 如果存在：弹出提示 "该时间已存在"
  - 如果不存在：添加到数组并排序
- 更新已选时间显示

#### 5. 删除时间

- 点击时间chip上的 × 按钮
- 从 reminderTimes 数组中移除该时间
- 更新显示
- 如果删除后数组为空，显示空状态并禁用保存按钮

#### 6. 编辑模式

当用户编辑现有项目时：
- 从现有项目加载 reminderTimes
- 下拉框保持默认选项"选择常用模板（可选）"
- 已选时间显示加载的时间chips
- 用户可以继续使用模板追加时间或添加自定义时间

### 数据结构

```typescript
// 时间模板定义
interface TimeTemplate {
  value: string;          // 唯一标识
  label: string;          // 显示文本
  times: string[];        // 时间数组
}

const timeTemplates: TimeTemplate[] = [
  {
    value: 'three-daily-morning-noon-evening',
    label: t('addProject.threeDailyMorningNoonEvening'), // "每日三次 - 早中晚 (08:00, 12:00, 18:00)"
    times: ['08:00', '12:00', '18:00']
  },
  {
    value: 'three-daily-before-meals',
    label: t('addProject.threeDailyBeforeMeals'), // "每日三次 - 饭前 (07:30, 11:30, 17:30)"
    times: ['07:30', '11:30', '17:30']
  },
  {
    value: 'three-daily-after-meals',
    label: t('addProject.threeDailyAfterMeals'), // "每日三次 - 饭后 (08:30, 12:30, 18:30)"
    times: ['08:30', '12:30', '18:30']
  },
  {
    value: 'twice-daily-morning-evening',
    label: t('addProject.twiceDailyMorningEvening'), // "每日两次 - 早晚 (08:00, 20:00)"
    times: ['08:00', '20:00']
  },
  {
    value: 'once-daily-morning',
    label: t('addProject.onceDailyMorning'), // "每日一次 - 早晨 (08:00)"
    times: ['08:00']
  },
  {
    value: 'once-daily-evening',
    label: t('addProject.onceDailyEvening'), // "每日一次 - 晚上 (20:00)"
    times: ['20:00']
  }
];

// 组件状态
const [reminderTimes, setReminderTimes] = useState<string[]>([]);
const [selectedTemplate, setSelectedTemplate] = useState<string>('placeholder');
```

### 需要移除的代码

从 `AddProjectScreen.tsx` 中移除：

1. **快捷时间相关**：
   - `quickTimes` 常量定义（lines 64-72）
   - `quickTimesGrid` 样式和JSX（lines 345-379）
   - `handleAddQuickTime` 函数

2. **时间模板卡片相关**：
   - `timeTemplates` 的卡片展示部分（lines 381-400）
   - `handleUseTemplate` 函数（替换为新的 `handleTemplateChange` 函数）
   - 相关样式：`templatesContainer`, `templateCard`, `templateLabel` 等

3. **样式清理**：
   - 移除 `quickTimesGrid`, `quickTimeChip`, `customTimeChip` 等样式
   - 移除 `templatesContainer`, `templateCard` 等样式

### 需要添加的代码

1. **下拉框组件**：
   ```tsx
   <Picker
     selectedValue={selectedTemplate}
     onValueChange={handleTemplateChange}
     style={styles.templatePicker}
   >
     <Picker.Item 
       label={t('addProject.selectTemplate')} 
       value="placeholder"
       color={Colors.textDisabled}
     />
     {timeTemplates.map((template) => (
       <Picker.Item
         key={template.value}
         label={template.label}
         value={template.value}
       />
     ))}
   </Picker>
   ```

2. **空状态显示**：
   ```tsx
   {reminderTimes.length === 0 ? (
     <View style={styles.emptyTimesContainer}>
       <Text style={styles.emptyTimesText}>
         {t('addProject.noTimeSelectedHint')}
       </Text>
     </View>
   ) : (
     <View style={styles.selectedTimesList}>
       {/* existing chips */}
     </View>
   )}
   ```

3. **新增样式**：
   ```typescript
   templatePicker: {
     backgroundColor: Colors.cardBackground,
     borderRadius: 8,
     borderWidth: 1,
     borderColor: Colors.border,
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
   ```

## 国际化文本

需要在 `src/i18n/translations/zh.ts` 和 `en.ts` 中添加：

```typescript
// 中文
addProject: {
  // ... existing translations
  selectTemplate: '选择常用模板（可选）',
  noTimeSelectedHint: '请选择模板或添加自定义时间',
  templateChangeHint: '💡 选择模板后会自动添加时间，切换模板会追加新时间（自动去重）',
  timesCount: '({{count}}个)',
  timeRequired: '请至少添加一个提醒时间',
}

// 英文
addProject: {
  // ... existing translations
  selectTemplate: 'Select template (optional)',
  noTimeSelectedHint: 'Select a template or add custom time',
  templateChangeHint: '💡 Times will be added automatically when selecting template. Switching templates will append new times (auto-dedup)',
  timesCount: '({{count}})',
  timeRequired: 'Please add at least one reminder time',
}
```

## 使用场景

### 场景1：用户使用模板快速创建

1. 用户打开新建项目页面
2. 填写项目名称和描述
3. 从下拉框选择"每日三次 - 早中晚"
4. 时间自动填充为 08:00, 12:00, 18:00
5. 点击保存完成

**优点**：一次点击完成时间设置，比原来的快捷时间网格更高效

### 场景2：用户组合使用模板

1. 用户选择"每日一次 - 早晨"，得到 08:00
2. 再选择"每日一次 - 晚上"，得到 08:00, 20:00
3. 手动删除不需要的时间或继续添加

**优点**：灵活组合，追加去重机制避免重复时间

### 场景3：用户完全自定义

1. 用户不选择任何模板
2. 直接点击"+ 添加自定义时间"
3. 通过模态框选择器添加多个时间
4. 保存项目

**优点**：完全自主控制，适合特殊时间需求

### 场景4：编辑现有项目

1. 用户点击编辑现有项目
2. 已选时间区域显示现有时间chips
3. 用户可以：
   - 选择模板追加更多时间
   - 添加自定义时间
   - 删除不需要的时间
4. 保存更新

## 边界情况处理

### 1. 重复时间

- **情况**：用户选择模板或添加自定义时间时，时间已存在
- **处理**：
  - 模板选择：自动去重，不弹提示
  - 自定义添加：弹出 Alert "该时间已存在"

### 2. 空时间保存

- **情况**：用户未选择任何时间就点击保存
- **处理**：保存按钮禁用，显示红色提示文字

### 3. 快速切换模板

- **情况**：用户连续快速切换多个模板
- **处理**：每次切换都追加时间并去重，可能导致大量时间堆积
- **建议**：在提示文字中说明"切换模板会追加时间"，提醒用户手动清理

### 4. 编辑模式加载

- **情况**：编辑模式下加载现有项目
- **处理**：
  - 正确加载 reminderTimes 数组
  - 下拉框保持默认"选择常用模板（可选）"
  - 不自动选择任何模板（即使现有时间匹配某个模板）

### 5. 删除所有时间

- **情况**：用户删除所有已选时间
- **处理**：
  - 显示空状态占位符
  - 禁用保存按钮
  - 显示红色提示文字

## 技术实现要点

### React Native Picker 注意事项

在 iOS 和 Android 上，Picker 的行为略有不同：

- **iOS**：可以使用 `color` prop 为默认选项设置灰色
- **Android**：默认选项的颜色可能需要通过 `style` 或主题设置

建议使用 `@react-native-picker/picker` 库以获得更好的跨平台一致性。

### 状态管理

```typescript
// 模板选择处理
const handleTemplateChange = (value: string) => {
  if (value === 'placeholder') return;
  
  setSelectedTemplate(value);
  
  const template = timeTemplates.find(t => t.value === value);
  if (!template) return;
  
  // 追加去重
  const merged = [...new Set([...reminderTimes, ...template.times])];
  setReminderTimes(merged.sort());
};

// 自定义时间添加（保留现有逻辑）
const handleAddCustomTime = (event: any, selectedDate?: Date) => {
  // ... existing implementation
  // 需要添加重复检查
  if (reminderTimes.includes(timeString)) {
    Alert.alert('', t('addProject.timeDuplicate'));
    return;
  }
  // ... rest of the logic
};
```

### 性能优化

- `timeTemplates` 使用 `useMemo` 缓存，避免每次渲染重新创建
- 时间chips使用 `key={time}` 确保正确的列表更新
- 下拉框的 `onValueChange` 使用 `useCallback` 避免不必要的重渲染

## 测试要点

### 功能测试

1. **模板选择**
   - 选择每个模板，验证正确的时间被添加
   - 验证时间自动排序
   
2. **追加去重**
   - 连续选择多个模板，验证时间正确追加且去重
   - 验证已存在的时间不会重复

3. **自定义时间**
   - 添加新时间成功
   - 添加重复时间提示错误
   - 验证时间自动排序

4. **删除时间**
   - 删除单个时间
   - 删除所有时间，验证空状态显示

5. **保存验证**
   - 空时间时保存按钮禁用
   - 有时间后保存按钮启用
   - 保存后数据正确存储

6. **编辑模式**
   - 加载现有项目数据
   - 编辑时间并保存
   - 验证更新成功

### UI 测试

1. 下拉框样式正确
2. 空状态占位符显示正确
3. 时间chips排列和换行正确
4. 提示文字显示位置和样式正确
5. 保存按钮禁用/启用状态视觉反馈明显

### 边界测试

1. 添加最大数量时间（8个）
2. 快速连续切换模板
3. 同时使用模板和自定义时间
4. 屏幕旋转时状态保持

## 成功标准

1. **简化程度**：界面元素减少约40%（移除7个快捷按钮和6个模板卡片）
2. **效率提升**：使用模板的用户只需1次点击完成时间设置（原来需要3次）
3. **无功能损失**：所有原有功能通过新界面仍然可以实现
4. **无bug**：所有测试点通过，无边界情况错误
5. **用户满意度**：内部测试反馈界面更清晰易用

## 未来增强（超出范围）

- 支持用户自定义保存常用模板
- 模板时间可配置（例如将"早晨"从08:00改为07:00）
- 智能推荐：根据项目名称推荐合适的时间模板
- 批量编辑时间（例如整体前移或后移1小时）
