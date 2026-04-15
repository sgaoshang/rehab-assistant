# 康复助手 (Rehab Assistant)

专为脑卒中康复设计的智能提醒管理应用，提供系统化的康复训练、用药提醒和健康测量功能。

## ✨ 核心功能

### 🎯 智能项目管理
- **快速添加**：一键添加37个专业预设项目，无需繁琐配置
- **灵活编辑**：支持自定义项目名称、描述和提醒时间
- **批量管理**：左滑编辑/删除，开关控制启用状态
- **统计一览**：首页和管理页实时显示项目完成情况

### ⏰ 时间轴选择器
- **可视化时间选择**：24小时时间轴，点击添加提醒时间
- **拖拽调整**：直接拖动标记点精确调整时间
- **快捷模板**：一日三次、早晚各一次等常用模板
- **智能去重**：自动合并重复时间

### 🔔 定时提醒
- **本地通知**：精准的本地推送通知
- **多时间段**：每个项目支持最多8个提醒时间
- **语音播报**：每天首次打开应用自动播报待办事项

### 📊 康复进度追踪
- **完成记录**：每日完成状态记录
- **统计分析**：本周/总计完成次数
- **进度可视化**：已完成/未完成状态一目了然

## 🏥 专业预设项目（37个）

### 早期康复（软瘫期/床上训练）- 14项
**床上护理与体位管理：**
- 定时翻身（每2-3小时）
- 良肢位摆放
- 皮肤护理

**被动关节活动：**
- 被动关节活动训练
- 患肢按摩
- 躯干旋转训练（被动）

**主动关节活动：**
- 踝关节屈伸训练
- 下肢屈伸训练
- 颈部功能训练
- 肩关节活动训练
- 呼吸功能训练

**床上肌力训练：**
- 桥式运动（腰桥）

**床上移动能力：**
- 床上移动训练
- 床边坐起训练

**吞咽与ADL准备：**
- 吞咽功能训练

### 中期康复（坐立训练）- 13项
**平衡与姿势控制：**
- 坐位平衡训练
- 躯干控制训练
- 站立平衡训练
- 重心转移训练

**上肢功能训练：**
- 上肢抬举训练
- 伸手取物训练
- 上肢功能训练

**手部精细功能：**
- 手部握拳训练
- 手指分合训练
- 手眼协调训练
- 精细动作训练

**下肢功能训练：**
- 坐站转移训练
- 站立耐力训练

### 后期康复（步行平衡）- 12项
**高级平衡训练：**
- 平衡协调训练

**步态训练：**
- 原地踏步训练
- 步态训练
- 侧方行走训练
- 后退行走训练
- 转身训练
- 跨越障碍训练
- 一字步行走
- 上下楼梯训练

**下肢肌力强化：**
- 下蹲训练（蹲起）

**日常生活活动：**
- 日常生活活动训练

**认知与双任务：**
- 双任务训练

### 用药提醒 - 4项
- 抗血小板药（早上空腹）
- 降压药（早上）
- 降脂药（晚上）
- 降糖药（餐前/餐后）

### 健康测量 - 3项
- 测量血压（早起、睡前）
- 测量血糖（空腹、餐后）
- 喝水提醒

## 技术栈

- **框架**: React Native + Expo SDK 51
- **语言**: TypeScript
- **导航**: React Navigation (Stack & Bottom Tabs)
- **存储**: AsyncStorage 本地数据持久化
- **通知**: Expo Notifications
- **语音**: Expo Speech

## 环境要求

- Node.js (v18 或更高)
- npm 或 yarn
- Expo Go app (用于真机测试)
- iOS Simulator 或 Android Emulator (可选)

## 安装步骤

1. 克隆仓库:
```bash
git clone <repository-url>
cd rehab-assistant
```

2. 安装依赖:
```bash
npm install
```

3. 启动开发服务器:
```bash
npm start
```

## 可用脚本

- `npm start` - 启动 Expo 开发服务器
- `npm run android` - 在 Android 设备/模拟器运行
- `npm run ios` - 在 iOS 设备/模拟器运行
- `npx tsc --noEmit` - TypeScript 类型检查

## 项目结构

```
src/
├── components/       # 可复用 UI 组件
│   ├── ProjectCard.tsx
│   └── LargeButton.tsx
├── constants/        # 常量配置
│   ├── colors.ts
│   ├── styles.ts
│   ├── theme.ts
│   └── presetProjects.ts
├── context/          # React Context 状态管理
│   └── AppContext.tsx
├── navigation/       # 导航配置
│   └── AppNavigator.tsx
├── screens/          # 页面组件
│   ├── HomeScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── AddProjectScreen.tsx
│   └── ManageProjectsScreen.tsx
├── services/         # 业务逻辑服务
│   ├── notificationService.ts
│   └── speechService.ts
├── storage/          # 数据持久化层
│   ├── projectStorage.ts
│   └── settingsStorage.ts
├── types/            # TypeScript 类型定义
│   └── index.ts
└── utils/            # 工具函数
    └── dateHelper.ts
```

## 使用指南

### 添加提醒项目

1. 进入"设置"页面
2. 点击"+ 添加项目"
3. 选择预设项目或自定义项目
4. 输入项目名称和说明
5. 设置提醒时间
6. 保存项目

### 管理项目

1. 进入"设置"页面
2. 点击"管理我的项目"
3. 开关控制启用/禁用项目
4. 点击"删除"移除项目

### 查看项目详情

1. 在首页点击任意项目卡片展开
2. 查看完整的项目说明和提醒时间
3. 再次点击收起

### 通知设置

应用使用 Expo Notifications 实现定时提醒：
- **iOS**: 首次使用时请求权限
- **Android**: 首次使用时请求权限

## 数据存储

所有数据使用 AsyncStorage 本地存储：
- 提醒项目列表
- 项目启用状态
- 提醒时间设置
- 通知权限状态

## 生产构建

### 使用 EAS Build

1. 安装 EAS CLI:
```bash
npm install -g eas-cli
```

2. 配置项目 (参见 `eas.json`)

3. iOS 构建:
```bash
eas build --platform ios
```

4. Android 构建:
```bash
eas build --platform android
```

## 开发

### 类型检查

运行 TypeScript 编译器检查类型错误:
```bash
npx tsc --noEmit
```

### 代码规范

- 所有组件使用 TypeScript
- React Context API 状态管理
- 模块化架构，清晰的关注点分离
- Service 层处理业务逻辑
- Storage 层处理数据持久化

## 故障排除

### 常见问题

**应用无法启动:**
- 清理 Metro bundler 缓存: `npx expo start -c`
- 删除 node_modules 重新安装: `rm -rf node_modules && npm install`

**通知不工作:**
- 确保已授予通知权限
- 检查设备通知设置
- 验证 Expo Notifications 配置正确

**数据未保存:**
- 检查 AsyncStorage 实现
- 确保 storage 方法使用 await
- 检查存储配额问题

## 开发者

**sgao**
- 电话: 13552276232
- 邮箱: sgaoshang@outlook.com

## 版本

v1.0.0

## 许可

Private - All rights reserved
