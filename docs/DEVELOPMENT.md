# 开发指南

本文档为开发者提供详细的开发、构建和发布指南。

## 🛠️ 开发环境配置

### 必需软件

- **Node.js**: v18.0.0 或更高
- **npm**: v9.0.0 或更高（或使用 yarn）
- **Git**: 最新版本
- **Expo CLI**: 通过 npm 全局安装或使用 npx

### 可选软件

- **Android Studio**: Android 开发和模拟器
- **Xcode**: macOS 上的 iOS 开发（需要 Mac）
- **VS Code**: 推荐的代码编辑器
- **EAS CLI**: 用于构建和发布

### VS Code 推荐扩展

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "expo.vscode-expo-tools"
  ]
}
```

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/sgaoshang/rehab-assistant.git
cd rehab-assistant
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm start
```

这将启动 Expo 开发服务器，您可以：
- 按 `a` 在 Android 模拟器/设备上运行
- 按 `i` 在 iOS 模拟器上运行（仅 macOS）
- 按 `w` 在浏览器中运行
- 扫描二维码在 Expo Go 中运行

---

## 📁 项目结构详解

```
rehab-assistant/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── ProjectCard.tsx  # 项目卡片组件
│   │   └── LargeButton.tsx  # 大按钮组件
│   │
│   ├── constants/           # 常量定义
│   │   ├── colors.ts        # 颜色主题
│   │   ├── styles.ts        # 通用样式
│   │   ├── theme.ts         # 主题配置
│   │   └── presetProjects.ts # 预设项目定义
│   │
│   ├── context/             # 状态管理
│   │   └── AppContext.tsx   # 全局应用状态
│   │
│   ├── i18n/                # 国际化
│   │   ├── index.ts         # i18n 入口
│   │   ├── types.ts         # 翻译类型定义
│   │   └── translations/    # 翻译文件
│   │       ├── zh.ts        # 中文
│   │       └── en.ts        # 英文
│   │
│   ├── navigation/          # 导航配置
│   │   └── AppNavigator.tsx # 主导航器
│   │
│   ├── screens/             # 页面组件
│   │   ├── HomeScreen.tsx           # 首页
│   │   ├── SettingsScreen.tsx       # 设置页
│   │   ├── AddProjectScreen.tsx     # 添加/编辑项目
│   │   └── ManageProjectsScreen.tsx # 管理项目
│   │
│   ├── services/            # 业务服务
│   │   ├── notificationService.ts   # 通知服务
│   │   └── speechService.ts         # 语音服务
│   │
│   ├── storage/             # 数据持久化
│   │   ├── projectStorage.ts        # 项目数据存储
│   │   └── settingsStorage.ts       # 设置数据存储
│   │
│   ├── types/               # 类型定义
│   │   └── index.ts         # TypeScript 类型
│   │
│   └── utils/               # 工具函数
│       └── dateHelper.ts    # 日期处理工具
│
├── assets/                  # 静态资源
│   ├── icon.png            # 应用图标
│   └── images/             # 图片资源
│
├── docs/                    # 项目文档
│
├── .gitignore              # Git 忽略配置
├── app.json                # Expo 配置
├── eas.json                # EAS Build 配置
├── package.json            # 项目依赖
└── tsconfig.json           # TypeScript 配置
```

---

## 💻 开发工作流

### 代码规范

#### TypeScript

- 所有组件和函数使用 TypeScript
- 避免使用 `any` 类型
- 为复杂对象定义 interface 或 type
- 使用严格模式

```typescript
// 好的示例
interface Project {
  id: string;
  name: string;
  description: string;
}

const createProject = (data: Omit<Project, 'id'>): Project => {
  return {
    id: generateId(),
    ...data
  };
};

// 避免
const createProject = (data: any) => { ... };
```

#### 组件规范

```typescript
// 函数组件
export const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  return <View>...</View>;
};

// 使用 memo 优化性能
export const MyComponent = React.memo<Props>(({ prop1 }) => {
  return <View>...</View>;
});
```

#### 样式规范

```typescript
// 使用 StyleSheet.create
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

// 使用常量定义颜色
import { Colors } from '../constants/colors';

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
  },
});
```

### 提交规范

使用语义化提交消息：

```
feat: 添加新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构代码
perf: 性能优化
test: 添加测试
chore: 构建/工具更新
```

示例：
```bash
git commit -m "feat: add project categorization by rehabilitation stage"
git commit -m "fix: resolve MIUI 10 APK parsing error"
```

---

## 🔨 构建和发布

### 本地测试构建

```bash
# TypeScript 类型检查
npx tsc --noEmit

# 运行 Expo 诊断
npx expo-doctor
```

### 使用 EAS Build

#### 1. 安装 EAS CLI

```bash
npm install -g eas-cli
```

#### 2. 登录 EAS

```bash
eas login
```

#### 3. 配置项目

项目已配置好 `eas.json`，包含以下构建配置：

- **development**: 开发构建，包含调试工具
- **preview**: 预览构建，用于内部测试
- **production**: 生产构建，用于正式发布
- **compatible**: 兼容构建，针对老设备优化

#### 4. 构建应用

```bash
# Android 生产版本
eas build --platform android --profile production

# Android 兼容版本（MIUI 10 等老设备）
eas build --platform android --profile compatible

# Android 预览版本
eas build --platform android --profile preview

# iOS 生产版本（需要 Apple 开发者账号）
eas build --platform ios --profile production
```

#### 5. 查看构建状态

```bash
eas build:list
eas build:view [BUILD_ID]
```

### OTA 更新

使用 EAS Update 推送代码更新，无需重新下载安装：

```bash
# 发布更新到 production 分支
eas update --branch production --message "修复通知bug"

# 查看更新历史
eas update:list
```

**注意：** OTA 更新仅适用于 JavaScript 代码更改，原生代码更改需要重新构建。

---

## 🧪 测试

### 手动测试清单

在发布前，确保测试以下功能：

- [ ] 应用启动和退出
- [ ] 添加预设项目
- [ ] 添加自定义项目
- [ ] 编辑项目
- [ ] 删除项目
- [ ] 启用/禁用项目
- [ ] 设置提醒时间
- [ ] 接收通知
- [ ] 标记完成/未完成
- [ ] 查看统计信息
- [ ] 语音播报
- [ ] 语言切换
- [ ] 应用更新

### 设备测试

建议在以下设备/系统上测试：

**Android:**
- MIUI 10/11/12
- 原生 Android 11+
- 华为 EMUI
- OPPO ColorOS
- vivo OriginOS

---

## 📦 发布流程

### 1. 准备发布

```bash
# 更新版本号（package.json 和 app.json）
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# 更新 CHANGELOG.md
# 提交更改
git add .
git commit -m "chore: bump version to v1.0.1"
git push
```

### 2. 创建 Git Tag

```bash
git tag v1.0.1
git push origin v1.0.1
```

### 3. 构建应用

```bash
# 构建 Android 生产版本
eas build --platform android --profile production

# 构建 Android 兼容版本
eas build --platform android --profile compatible
```

### 4. 下载构建产物

```bash
# 查看构建
eas build:list

# 下载 APK（从构建详情页面获取 URL）
curl -L -o rehab-assistant-v1.0.1.apk [APK_URL]
```

### 5. 创建 GitHub Release

```bash
# 使用 gh CLI
gh release create v1.0.1 \
  --title "提醒助手 v1.0.1" \
  --notes-file RELEASE_NOTES.md \
  rehab-assistant-v1.0.1.apk \
  rehab-assistant-compatible-v1.0.1.apk
```

### 6. 应用商店提交（可选）

**国内 Android 应用商店：**
- 腾讯应用宝
- 华为应用市场
- 小米应用商店
- OPPO 软件商店
- vivo 应用商店

**国际应用商店：**
- Google Play Store（需要 Google Play 开发者账号，$25 一次性费用）

---

## 🐛 调试技巧

### React Native Debugger

```bash
# 在开发模式下，摇动设备打开调试菜单
# 或使用快捷键：
# Android: Ctrl/Cmd + M
# iOS: Cmd + D
```

### Chrome DevTools

1. 在调试菜单中选择 "Debug with Chrome"
2. 打开 Chrome 开发者工具
3. 使用 Console、Network、Sources 面板调试

### Expo Logging

```typescript
import { LogBox } from 'react-native';

// 忽略特定警告
LogBox.ignoreLogs(['Warning: ...']);

// 添加日志
console.log('Debug info:', data);
console.warn('Warning:', message);
console.error('Error:', error);
```

### AsyncStorage 调试

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// 查看所有存储的 keys
const keys = await AsyncStorage.getAllKeys();
console.log('Storage keys:', keys);

// 查看特定 key 的值
const value = await AsyncStorage.getItem('projects');
console.log('Projects:', JSON.parse(value));

// 清空存储（谨慎使用）
await AsyncStorage.clear();
```

---

## 📚 参考资源

### 官方文档

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Update](https://docs.expo.dev/eas-update/introduction/)

### 有用的工具

- [Expo Snack](https://snack.expo.dev/) - 在线 React Native 编辑器
- [React Native Directory](https://reactnative.directory/) - 组件库目录

---

## 🤝 贡献指南

请参阅 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何为项目做贡献。

---

## 📞 联系方式

如有技术问题，请联系：
- 📧 邮箱: sgaoshang@outlook.com
- 🐙 GitHub: [@sgaoshang](https://github.com/sgaoshang)
