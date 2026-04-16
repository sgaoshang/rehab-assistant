# 提醒助手 (Rehab Assistant)

专为脑卒中康复设计的智能提醒管理应用，提供系统化的康复训练、用药提醒和健康测量功能。

[![GitHub Release](https://img.shields.io/github/v/release/sgaoshang/rehab-assistant)](https://github.com/sgaoshang/rehab-assistant/releases)
[![License](https://img.shields.io/badge/license-Private-blue)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Android-green)](https://github.com/sgaoshang/rehab-assistant/releases)

## 📥 下载应用

### Android 版本

**最新版本：v1.0.0**

**下载地址：** [GitHub Releases](https://github.com/sgaoshang/rehab-assistant/releases/tag/v1.0.0)

**可用版本：**
- **标准版** (3.5 MB) - 适用于大部分 Android 设备
- **兼容版** (3.2 MB) - 专为 MIUI 10 等老设备优化

**系统要求：** Android 5.0 及以上

### iOS 版本

iOS 版本正在准备中，敬请期待。

---

## ✨ 核心功能

### 🎯 智能项目管理
- **快速添加**：一键添加 40+ 个专业预设项目，无需繁琐配置
- **分类展示**：按康复阶段（早期/中期/后期）和类型（康复/用药/测量）智能分组
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
- **多时间段**：每个项目支持最多 8 个提醒时间
- **语音播报**：每天首次打开应用自动播报待办事项

### 📊 康复进度追踪
- **完成记录**：每日完成状态记录
- **统计分析**：本周/总计完成次数
- **进度可视化**：已完成/未完成状态一目了然

---

## 🏥 专业预设项目（40+）

### 早期康复（软瘫期/床上训练）
- 床上护理与体位管理（定时翻身、良肢位摆放、皮肤护理）
- 被动关节活动训练
- 主动关节活动（踝关节、颈部、肩关节等）
- 床上肌力训练（桥式运动）
- 床上移动能力训练
- 吞咽功能训练

### 中期康复（坐立训练）
- 平衡与姿势控制（坐位、站立、重心转移）
- 上肢功能训练
- 手部精细功能（握拳、手眼协调等）
- 下肢功能训练

### 后期康复（步行平衡）
- 高级平衡训练
- 步态训练（原地踏步、侧方行走、后退、转身等）
- 下肢肌力强化
- 日常生活活动训练
- 认知与双任务训练

### 用药提醒
- 抗血小板药、降压药、降脂药、降糖药

### 健康测量
- 测量血压、测量血糖、喝水提醒

---

## 🚀 技术栈

- **框架**: React Native + Expo SDK 54
- **语言**: TypeScript
- **导航**: React Navigation 6
- **存储**: AsyncStorage
- **通知**: Expo Notifications
- **语音**: Expo Speech
- **国际化**: 多语言支持（中文/英文）
- **更新**: EAS Update (OTA)

---

## 💻 开发指南

### 环境要求

- Node.js 18+
- npm 或 yarn
- Expo CLI
- Android Studio / Xcode（可选）

### 快速开始

```bash
# 克隆仓库
git clone https://github.com/sgaoshang/rehab-assistant.git
cd rehab-assistant

# 安装依赖
npm install

# 启动开发服务器
npm start

# 在 Android 设备上运行
npm run android

# 在 iOS 设备上运行
npm run ios
```

### 可用脚本

```bash
npm start          # 启动 Expo 开发服务器
npm run android    # Android 设备/模拟器运行
npm run ios        # iOS 设备/模拟器运行
npx tsc --noEmit   # TypeScript 类型检查
```

### 构建发布版本

```bash
# 构建 Android APK
eas build --platform android --profile production

# 构建 Android 兼容版
eas build --platform android --profile compatible

# 发布 OTA 更新
eas update --branch production --message "更新说明"
```

---

## 📁 项目结构

```
rehab-assistant/
├── src/
│   ├── components/       # 可复用 UI 组件
│   ├── constants/        # 常量配置（颜色、主题、预设项目）
│   ├── context/          # React Context 状态管理
│   ├── i18n/            # 国际化配置
│   ├── navigation/       # 导航配置
│   ├── screens/          # 页面组件
│   ├── services/         # 业务逻辑服务
│   ├── storage/          # 数据持久化层
│   ├── types/            # TypeScript 类型定义
│   └── utils/            # 工具函数
├── assets/              # 静态资源
├── docs/                # 项目文档
├── app.json             # Expo 配置
├── eas.json             # EAS Build 配置
├── package.json         # 依赖配置
└── tsconfig.json        # TypeScript 配置
```

---

## 📖 文档

- [安装指南](docs/INSTALLATION.md) - 用户安装说明
- [开发指南](docs/DEVELOPMENT.md) - 开发者指南
- [更新日志](docs/CHANGELOG.md) - 版本历史
- [部署指南](docs/DEPLOYMENT.md) - 构建和发布流程

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

查看 [贡献指南](docs/CONTRIBUTING.md) 了解详情。

---

## 📝 许可

Copyright © 2024 sgao. All rights reserved.

---

## 👨‍💻 开发者

**sgao**
- 📞 电话: 13552276232
- 📧 邮箱: sgaoshang@outlook.com
- 🐙 GitHub: [@sgaoshang](https://github.com/sgaoshang)

---

## 💡 反馈与支持

如果您在使用过程中遇到问题或有任何建议，欢迎：
- 提交 [Issue](https://github.com/sgaoshang/rehab-assistant/issues)
- 发送邮件至 sgaoshang@outlook.com

---

**版本：** v1.0.0  
**最后更新：** 2024-04-16
