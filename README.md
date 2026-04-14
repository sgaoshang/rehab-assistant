# 提醒助手 (Reminder Assistant)

一个通用的提醒管理应用，支持康复训练、用药提醒、测量血压血糖等各种日常提醒事项。

## 功能特性

- **项目管理**：添加、编辑、启用/禁用提醒项目
- **定时提醒**：为每个项目设置多个提醒时间
- **语音播报**：每天首次打开应用自动播报待办事项
- **预设项目**：内置康复训练、用药提醒、健康测量等常用项目
- **简洁界面**：清晰的项目展示，点击展开查看详情

## 预设项目类型

### 康复训练
- 握拳练习、手指伸展、抬臂运动
- 肩关节旋转、踝关节运动、膝关节屈伸
- 原地踏步、颈部转动、深呼吸练习
- 平衡训练

### 用药提醒
- 降压药、降糖药
- 维生素补充、钙片补充

### 健康测量
- 测量血压、测量血糖
- 喝水提醒、午休提醒

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
