# 康复助手界面优化设计规范

**设计目标：** 优化界面使其简洁美观实用

**设计日期：** 2026-04-14

**设计风格：** 清爽简约专业风

---

## 一、设计理念

### 核心原则

1. **简洁实用** - 信息密度适中，减少视觉噪音，最大化内容展示
2. **层次清晰** - 明确的信息优先级，重要操作突出
3. **美观专业** - 配色协调，细节精致，传达医疗应用的专业性
4. **易于操作** - 大按钮，合理间距，适合各年龄段用户

### 设计方向

- **整体风格：** 清爽简约风格
- **布局形式：** 紧凑型布局
- **头部设计：** 极简无卡片
- **配色方案：** 专业蓝绿配色

---

## 二、配色系统

### 主要颜色更新

| 用途 | 当前颜色 | 新颜色 | 色值 | 说明 |
|------|---------|--------|------|------|
| 主色调 | #4A90E2 | #2E5C8A | `Colors.primary` | 深蓝色，更专业稳重 |
| 完成色 | #4CAF50 | #10B981 | `Colors.success` | 清新绿，现代感强 |
| 背景色 | #F5F5F5 | #F8F9FA | `Colors.background` | 浅灰蓝，柔和舒适 |

### 保持不变的颜色

- `Colors.primaryDark` - #2E5C8A（已经是目标色）
- `Colors.warning` - #FFC107
- `Colors.error` - #F44336
- `Colors.neutral` - #9E9E9E
- `Colors.cardBackground` - #FFFFFF
- `Colors.textPrimary` - #333333
- `Colors.textSecondary` - #666666
- `Colors.textDisabled` - #999999
- `Colors.border` - #E0E0E0

### 配色理由

**深蓝 #2E5C8A：**
- 传达专业、可靠、医疗属性
- 对比度适中，不刺眼
- 适合康复应用场景

**清新绿 #10B981：**
- 完成状态积极正面
- 与深蓝形成良好对比
- 现代简洁

---

## 三、首页（HomeScreen）设计

### 3.1 头部区域

**设计方案：极简式头部**

```
布局结构：
┌─────────────────────────────────────────┐
│ 2026年4月14日                            │
│ 今天有 5 个项目 · 已完成 3 个  [隐藏已完成] ●━━○ │
│                                         │
└─────────────────────────────────────────┘
```

**样式规范：**

```typescript
// 日期
- 字体大小：20px
- 字重：600 (semibold)
- 颜色：#2c3e50 (textPrimary)
- 下边距：6px

// 统计信息
- 字体大小：14px
- 颜色：#7f8c8d (textSecondary)
- 位置：左对齐

// 过滤开关
- 位置：与统计信息同行，右对齐
- 标签字体：13px, #2E5C8A (新主色), medium
- 开关尺寸：40×22px
- 圆角：11px
- 激活色：#2E5C8A (新主色)

// 容器
- 无背景卡片
- 上下边距：16px
- 左右内边距：继承父容器（16px）
```

**实现要点：**
- 移除现有的卡片背景和边框
- 过滤器与统计信息使用 flexbox 布局，`justifyContent: 'space-between'`
- 开关颜色从 `Colors.primary` 更新为新的主色值

---

### 3.2 项目列表

**间距：**
- 项目卡片之间：8px (当前为 16px，更紧凑)
- 列表与头部：16px

**空状态：**
- 保持现有设计
- 图标大小：48px
- 文字居中

---

## 四、项目卡片（ProjectCard）设计

### 4.1 整体布局

**设计方案：紧凑型 - 单行布局**

```
视觉示例：

已完成项目
┌────┬────────────────────────────────────┬───┐
│ ✓  │ 握拳练习                            │ ▼ │
│    │ 08:00 · 12:00 · 18:00 • 本周2 总计8  │   │
└────┴────────────────────────────────────┴───┘
 32px    flex: 1                          14px

未完成项目  
┌────┬────────────────────────────────────┬───┐
│ ✓  │ 手指伸展                            │ ▼ │
│    │ 09:00 · 15:00                      │   │
└────┴────────────────────────────────────┴───┘
```

**结构组成：**

1. **完成按钮区域** (左侧，固定 32px)
2. **内容区域** (中间，flex: 1)
   - 项目名称（第一行）
   - 时间 + 统计信息（第二行）
3. **展开图标区域** (右侧，固定 14px)

---

### 4.2 完成按钮设计

**尺寸和形状：**
```typescript
width: 32px
height: 32px
borderRadius: 6px  // 方形圆角，非圆形
```

**未完成状态：**
```typescript
borderWidth: 2px
borderColor: Colors.border  // #E0E0E0
backgroundColor: 'transparent'
iconColor: Colors.border
iconSize: 16px
iconWeight: 'bold'
```

**已完成状态：**
```typescript
borderWidth: 0
borderColor: Colors.success  // #10B981 (新完成色)
backgroundColor: Colors.success  // #10B981
iconColor: '#FFFFFF'
iconSize: 16px
iconWeight: 'bold'
```

**交互：**
- 点击区域：建议扩大到 40×40px（通过 padding 或 hitSlop）
- activeOpacity: 0.7

---

### 4.3 内容区域设计

**项目名称：**
```typescript
fontSize: 17px  // 从 24px 减小
fontWeight: '600'
color: Colors.textPrimary  // #333333
marginBottom: 4px (与时间行的间距)
```

**时间和统计信息（同一行）：**

```typescript
// 容器
display: 'flex'
flexDirection: 'row'
alignItems: 'center'
gap: 10px
fontSize: 13px  // 从 16px/14px 减小
marginTop: 4px

// 时间部分
color: Colors.primary  // #2E5C8A (新主色)
separator: ' · '  // 中点分隔符

// 分隔符
color: Colors.textDisabled  // #95a5a6
content: '•'

// 统计部分（仅在有数据时显示）
color: Colors.success  // #10B981 (新完成色)
fontWeight: '500'
format: '本周{thisWeek} 总计{total}'
```

**示例代码：**
```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 13 }}>
  <span style={{ color: '#2E5C8A' }}>08:00 · 12:00 · 18:00</span>
  <span style={{ color: '#95a5a6' }}>•</span>
  <span style={{ color: '#10B981', fontWeight: 500 }}>本周2 总计8</span>
</div>
```

---

### 4.4 卡片容器样式

**基础样式：**
```typescript
backgroundColor: Colors.cardBackground  // #FFFFFF
borderRadius: 8px  // 保持现有
padding: '14px 16px'  // 从 20px 减小，更紧凑
marginVertical: 4px  // 从 8px 减小（总间距 8px）
```

**阴影：**
```typescript
// iOS
shadowColor: '#000'
shadowOffset: { width: 0, height: 1 }  // 从 height: 2 减小
shadowOpacity: 0.08  // 从 0.1 减小，更轻微
shadowRadius: 3  // 从 4 减小

// Android
elevation: 2  // 保持
```

**左侧状态条：**
```typescript
borderLeftWidth: 4px
borderLeftColor: 已完成 ? Colors.success : Colors.border
```

**整体布局：**
```typescript
// header 容器
flexDirection: 'row'
alignItems: 'center'
gap: 12px
```

---

### 4.5 展开/收起区域

**展开图标：**
```typescript
fontSize: 14px  // 从 16px 减小
color: Colors.textSecondary  // #666666
content: isExpanded ? '▲' : '▼'
marginLeft: 4px  // 从 12px 减小
```

**展开内容：**
- 保持现有设计
- 分割线、说明文字等不变

---

## 五、尺寸和间距系统

### 全局间距规范

| 用途 | 当前值 | 新值 | 说明 |
|------|--------|------|------|
| 页面左右内边距 | 16px | 16px | 保持 |
| 页面上下内边距 | 16px | 16px | 保持 |
| 卡片间距 | 16px | 8px | 更紧凑 |
| 卡片内边距 | 20px | 14px 16px | 上下减小 |
| 元素间距（小） | 8px | 8px | 保持 |
| 元素间距（中） | 12px | 12px | 保持 |
| 元素间距（大） | 24px | 16px | 头部区域 |

### 圆角系统

| 元素 | 圆角值 | 说明 |
|------|--------|------|
| 卡片 | 8px | 保持 |
| 按钮（大） | 12px | 保持（设置页等） |
| 完成按钮 | 6px | 方形圆角 |
| 徽章 | 4px | 统计徽章等 |
| 开关 | 11px | 圆形开关 |

### 字体大小

| 用途 | 当前值 | 新值 | 说明 |
|------|--------|------|------|
| 大标题 | 28px | 28px | 保持 |
| 标题 | 24px | 20px | 页面标题 |
| 卡片标题 | 24px | 17px | 项目名称 |
| 正文 | 20px | 20px | 保持 |
| 小正文 | 18px | 18px | 保持 |
| 次要文字 | 16px | 14px | 统计、提示等 |
| 辅助文字 | 14px | 13px | 时间、标签等 |

---

## 六、实现清单

### 6.1 文件修改清单

**必须修改的文件：**

1. **`src/constants/colors.ts`**
   - 更新 `primary: '#2E5C8A'`
   - 更新 `success: '#10B981'`
   - 更新 `background: '#F8F9FA'`

2. **`src/components/ProjectCard.tsx`**
   - 重构布局为 flexDirection: 'row'
   - 完成按钮移到最左侧（32×32px, borderRadius: 6px）
   - 项目名称字体调整为 17px
   - 时间和统计信息合并到同一行（13px）
   - 调整卡片内边距为 14px 16px
   - 更新左侧状态条颜色
   - 调整 gap 和 marginVertical

3. **`src/screens/HomeScreen.tsx`**
   - 移除头部卡片背景（filterRow 背景和边框）
   - 日期字体调整为 20px
   - 统计信息和过滤器放在同一行
   - 过滤器标签字体 13px，颜色使用新主色
   - 调整头部边距为 16px
   - Switch 颜色更新为新主色

**可选修改的文件：**

4. **`src/constants/styles.ts`**
   - 可选：更新 `card` 的默认 padding 和 marginVertical
   - 可选：更新 `title` 的默认字体大小

---

### 6.2 关键代码片段

#### ProjectCard 布局结构

```tsx
// 主容器
<View style={CommonStyles.card}>  {/* borderLeft 由样式添加 */}
  <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} activeOpacity={0.7}>
    <View style={styles.header}>  {/* flexDirection: 'row', alignItems: 'center', gap: 12 */}
      
      {/* 完成按钮 - 左侧 */}
      <TouchableOpacity
        style={[styles.completionButton, completed && styles.completionButtonActive]}
        onPress={handleToggleCompletion}
        activeOpacity={0.7}
      >
        <Text style={[styles.completionIcon, completed && styles.completionIconActive]}>
          ✓
        </Text>
      </TouchableOpacity>

      {/* 内容区域 - 中间 */}
      <View style={styles.content}>  {/* flex: 1 */}
        <Text style={styles.projectName}>{displayName}</Text>
        <View style={styles.infoRow}>  {/* flexDirection: 'row', alignItems: 'center', gap: 10 */}
          <Text style={styles.timeText}>{project.reminderTimes.join(' · ')}</Text>
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

      {/* 展开图标 - 右侧 */}
      <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
    </View>

    {/* 展开内容 */}
    {isExpanded && (
      <View style={styles.descriptionContainer}>
        <View style={styles.divider} />
        <Text style={styles.descriptionText}>{displayDescription}</Text>
      </View>
    )}
  </TouchableOpacity>
</View>
```

#### HomeScreen 头部结构

```tsx
<View style={styles.header}>  {/* marginBottom: 16px, 无背景 */}
  <Text style={styles.dateText}>{formatDate(new Date(), locale)}</Text>
  
  <View style={styles.statsRow}>  {/* flexDirection: 'row', justifyContent: 'space-between' */}
    <Text style={styles.statsText}>
      今天有 {totalProjects} 个项目 · 已完成 {completedCount} 个
    </Text>
    
    {enabledProjects.length > 0 && (
      <View style={styles.filterControl}>  {/* flexDirection: 'row', alignItems: 'center', gap: 8 */}
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

---

## 七、设计细节说明

### 7.1 为什么选择紧凑型布局？

1. **信息密度适中** - 在不牺牲可读性的前提下，能在一屏显示更多项目
2. **完成按钮突出** - 放在左侧第一位置，符合从左到右的阅读习惯
3. **统计信息紧凑** - 与时间在同一行，节省垂直空间
4. **适合康复场景** - 用户通常有多个项目，紧凑布局更实用

### 7.2 为什么选择极简头部？

1. **最大化内容区** - 减少头部占用，把空间留给项目列表
2. **符合简约风格** - 无卡片背景，视觉更清爽
3. **信息清晰** - 虽然简单但不简陋，层次分明
4. **操作便捷** - 过滤器在同一行，减少视线移动

### 7.3 为什么选择专业蓝绿配色？

1. **医疗属性** - 深蓝色传达专业可靠，符合康复应用定位
2. **视觉舒适** - 色调沉稳，长时间使用不疲劳
3. **对比度好** - 深蓝主色与绿色完成状态有良好对比
4. **现代感** - 清新绿比传统绿更现代简洁

---

## 八、注意事项

### 8.1 兼容性考虑

- 所有颜色变更需要同时更新亮色和暗色主题（如果有）
- 字体大小调整需确保在不同屏幕尺寸下可读
- 圆角和阴影在 iOS 和 Android 上表现一致

### 8.2 可访问性

- 颜色对比度符合 WCAG AA 标准
- 完成按钮点击区域足够大（建议扩展到 40×40px）
- 文字大小不小于 13px，确保可读性

### 8.3 性能考虑

- 减少不必要的阴影和圆角可提升渲染性能
- 卡片间距调整不影响列表滚动性能
- 保持组件简洁，避免过度嵌套

### 8.4 未来扩展

- 配色系统可进一步扩展支持深色模式
- 间距系统可抽取为主题配置
- 字体大小可根据用户设置动态调整（无障碍）

---

## 九、验收标准

### 视觉效果

- [ ] 整体风格清爽简约，无冗余装饰
- [ ] 配色协调，深蓝 + 绿色搭配和谐
- [ ] 卡片布局紧凑，信息密度适中
- [ ] 完成按钮突出，易于识别和点击
- [ ] 头部简洁，不抢占内容空间

### 交互体验

- [ ] 完成按钮点击响应迅速，状态切换流畅
- [ ] 过滤开关操作便捷，效果即时
- [ ] 卡片展开/收起动画自然
- [ ] 列表滚动流畅，无卡顿

### 功能完整性

- [ ] 所有文字正确显示，无乱码
- [ ] 统计信息准确计算和显示
- [ ] 多语言支持正常
- [ ] 边界情况处理正确（无项目、全部完成等）

### 代码质量

- [ ] 组件结构清晰，易于维护
- [ ] 样式复用合理，减少重复代码
- [ ] 颜色使用统一的 Colors 常量
- [ ] 代码注释充分，便于理解

---

## 十、后续优化建议

### 短期（可选）

1. **完成动画** - 点击完成按钮时添加缩放或弹跳动画
2. **过渡效果** - 卡片状态变化时添加颜色渐变
3. **触觉反馈** - iOS 上添加 haptic feedback

### 中期（可考虑）

1. **深色模式** - 根据系统设置自动切换
2. **字体缩放** - 支持用户自定义字体大小
3. **主题切换** - 提供多套配色方案选择

### 长期（规划中）

1. **个性化** - 用户可自定义卡片样式
2. **动效库** - 建立统一的动画组件库
3. **设计系统** - 完整的 Design System 文档

---

## 附录：视觉对比

### A. 配色对比

| 元素 | 修改前 | 修改后 | 变化 |
|------|--------|--------|------|
| 主色调 | #4A90E2 | #2E5C8A | 更深更专业 |
| 完成色 | #4CAF50 | #10B981 | 更清新现代 |
| 背景色 | #F5F5F5 | #F8F9FA | 略带蓝调 |

### B. 尺寸对比

| 元素 | 修改前 | 修改后 | 变化 |
|------|--------|--------|------|
| 卡片标题 | 24px | 17px | 减小29% |
| 时间文字 | 16px | 13px | 减小19% |
| 卡片内边距 | 20px | 14px 16px | 上下减小30% |
| 卡片间距 | 16px | 8px | 减小50% |
| 完成按钮 | 32px 圆形 | 32px 方圆角 | 形状变化 |

### C. 布局对比

**修改前：**
- 完成按钮：右上角
- 信息布局：垂直堆叠
- 头部：卡片式背景
- 总体：较松散

**修改后：**
- 完成按钮：左侧第一位
- 信息布局：紧凑横向
- 头部：无背景极简
- 总体：紧凑高效

---

**设计规范版本：** v1.0  
**最后更新：** 2026-04-14  
**设计师：** Claude (AI Assistant)  
**审核状态：** 待用户审核
