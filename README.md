# 提醒助手 (Rehab Assistant)

<div align="center">

专为脑卒中康复设计的智能提醒管理应用

[![GitHub Release](https://img.shields.io/github/v/release/sgaoshang/rehab-assistant)](https://github.com/sgaoshang/rehab-assistant/releases)
[![Platform](https://img.shields.io/badge/platform-Android-green)](https://github.com/sgaoshang/rehab-assistant/releases)
[![License](https://img.shields.io/badge/license-Private-blue)](LICENSE)

[下载应用](#-下载安装) • [功能特性](#-核心功能) • [使用指南](#-使用指南) • [开发文档](#-开发指南)

</div>

---

## 📥 下载安装

### 最新版本：v1.0.2 Build 5

**下载地址：** [GitHub Releases](https://github.com/sgaoshang/rehab-assistant/releases/latest)

**文件：** `rehab-assistant-v1.0.2-production.apk` (75MB)

**系统要求：** Android 5.0+

### ⚠️ 重要提示

**如果您已安装旧版本，请先卸载再安装新版本！**

通知渠道配置会被系统缓存，直接覆盖安装会导致震动、声音等功能失效。

---

## ✨ 核心功能

### 🎯 智能提醒管理
- **40+ 专业预设** - 覆盖康复全周期（早期/中期/后期）
- **自定义项目** - 灵活添加个性化提醒
- **多时间段** - 每个项目支持最多 8 个提醒时间
- **可视化时间轴** - 拖拽调整，一键应用模板
- **分类管理** - 按康复阶段和类型智能分组

### 🔔 强大通知系统
- **精准推送** - 本地通知，不依赖网络
- **锁屏操作** - 直接在锁屏上点击"播报"或"完成"
- **语音播报** - 自动语音提醒训练内容
- **震动提醒** - 4次震动，更明显
- **声音提示** - 可配置通知铃声

### 📊 进度追踪
- **每日打卡** - 一键标记完成状态
- **统计分析** - 本周完成次数、总计完成次数
- **卡片视图** - 统计信息始终可见，不被遮挡
- **历史记录** - 完整的训练历史

---

## 🏥 专业预设项目

### 早期康复（软瘫期/床上训练）
床上护理、体位管理、被动活动、主动关节训练、吞咽训练等

### 中期康复（坐立训练）
平衡控制、上肢功能、手部精细、下肢训练等

### 后期康复（步行平衡）
步态训练、平衡强化、双任务训练、日常生活活动等

### 用药提醒
抗血小板药、降压药、降脂药、降糖药

### 健康测量
测量血压、测量血糖、喝水提醒

---

## 📱 使用指南

### 首次安装

1. **下载APK** - 从 [Releases](https://github.com/sgaoshang/rehab-assistant/releases) 下载最新版本
2. **安装应用** - 允许"安装未知来源应用"
3. **授予权限** - 通知权限、精确闹钟权限
4. **完成设置** - 按照下方说明配置系统

### ⚙️ 小米手机必读

小米 MIUI 系统对通知有严格限制，必须完成以下设置：

#### 1. 锁屏通知详情
```
设置 → 锁屏 → 锁屏显示通知 → 开启
设置 → 锁屏 → 锁屏显示通知详情 → 开启 ⭐️ 必须开启
```

#### 2. 应用通知权限
```
设置 → 应用设置 → 应用管理 → 提醒助手 → 通知管理
→ 允许通知 ✓
→ 锁屏通知 → 选择"显示通知及内容" ⭐️ 不是"仅显示通知"
→ 横幅 ✓
→ 响铃 ✓
```

#### 3. 通知渠道设置
```
设置 → 应用 → 提醒助手 → 通知 → 训练提醒
→ 声音 → 选择一个铃声 ⭐️ 不能是"无"
→ 震动 → 开启
→ 优先级 → 紧急
```

#### 4. 后台运行权限
```
设置 → 应用设置 → 应用管理 → 提醒助手
→ 省电策略 → 无限制
→ 自启动 → 允许
→ 后台弹出界面 → 允许
```

#### 5. 系统音量
```
音量键 → 点击三个点展开 → 确认"通知音量"不为0
```

### 其他品牌手机

华为、OPPO、vivo等品牌也有类似限制，请在系统设置中：
- 允许应用自启动
- 关闭电池优化
- 允许锁屏通知
- 选择通知铃声

---

## 🎬 快速上手

### 1. 添加训练项目

**方式一：使用预设**
1. 点击首页底部 "+" 按钮
2. 选择"从预设添加"
3. 选择康复阶段和项目
4. 设置提醒时间
5. 保存

**方式二：自定义**
1. 点击首页底部 "+" 按钮
2. 选择"自定义项目"
3. 输入名称和描述
4. 设置提醒时间
5. 保存

### 2. 设置提醒时间

- **点击时间轴** - 添加提醒时间
- **拖动标记** - 调整时间
- **应用模板** - 一日三次、早晚各一次等
- **删除时间** - 点击标记上的 × 按钮

### 3. 管理项目

- **切换开关** - 启用/禁用提醒
- **标记完成** - 点击项目左侧的 ✓ 按钮
- **编辑项目** - 左滑选择"编辑"
- **删除项目** - 左滑选择"删除"

### 4. 接收通知

**应用在前台：** 自动语音播报

**应用在后台/已退出：**
- 收到通知 → 震动 + 声音
- 点击"🔊 播报" → 解锁并播报
- 点击"✓ 完成" → 标记完成（不打开应用）

---

## 🔧 常见问题

<details>
<summary><strong>Q: 锁屏时看不到通知按钮？</strong></summary>

**A:** 小米手机需要开启"锁屏显示通知详情"，其他手机也需要在系统设置中允许锁屏通知。详见上方[小米手机设置](#️-小米手机必读)。
</details>

<details>
<summary><strong>Q: 通知没有声音？</strong></summary>

**A:** 检查三个地方：
1. 系统设置 → 应用 → 提醒助手 → 通知 → 训练提醒 → 声音（必须选择铃声）
2. 音量键展开 → 通知音量不为0
3. 手机不在静音/勿扰模式
</details>

<details>
<summary><strong>Q: 只震动一次？</strong></summary>

**A:** 您安装的是旧版本（v3或更早）。请卸载后安装最新版 v1.0.2，新版本震动4次。注意：必须卸载重装，直接覆盖安装无效！
</details>

<details>
<summary><strong>Q: 应用退出后还会收到通知吗？</strong></summary>

**A:** 会！通知由 Android 系统管理，不依赖应用运行。但要确保：
1. 允许应用自启动
2. 关闭电池优化
3. 省电策略设为"无限制"
</details>

<details>
<summary><strong>Q: 为什么不能自动播报？</strong></summary>

**A:** Android 系统限制，应用退出后无法自动播放音频。需要点击通知或"播报"按钮才能播报。只有应用在前台时才会自动播报。
</details>

---

## 🚀 技术栈

- **框架**: React Native 0.81 + Expo SDK 54
- **语言**: TypeScript 5.3
- **导航**: React Navigation 6
- **状态**: React Context + Hooks
- **存储**: AsyncStorage
- **通知**: Expo Notifications
- **语音**: Expo Speech
- **国际化**: 多语言支持（中文/英文）

---

## 💻 开发指南

### 环境要求

- Node.js 18+
- npm 或 yarn
- Expo CLI
- (可选) Android Studio / Xcode

### 快速开始

```bash
# 克隆仓库
git clone https://github.com/sgaoshang/rehab-assistant.git
cd rehab-assistant

# 安装依赖
npm install

# 启动开发服务器
npm start

# 在设备上运行
npm run android   # Android
npm run ios       # iOS
```

### 构建发布版本

```bash
# 使用 EAS Build 构建 production APK
npx eas-cli build --platform android --profile production

# 构建完成后会得到 APK 下载链接
```

### 项目结构

```
rehab-assistant/
├── src/
│   ├── components/       # UI 组件
│   ├── constants/        # 常量和预设
│   ├── context/          # 状态管理
│   ├── i18n/            # 国际化
│   ├── navigation/       # 导航配置
│   ├── screens/          # 页面
│   ├── services/         # 服务（通知、语音）
│   ├── storage/          # 数据持久化
│   └── utils/            # 工具函数
├── assets/              # 静态资源
├── docs/                # 文档
└── app.json             # Expo 配置
```

### 相关文档

- [通知行为说明](docs/NOTIFICATION_BEHAVIOR.md) - 详细的通知工作原理
- [语音通知文档](docs/VOICE_NOTIFICATION.md) - 语音播报功能说明
- [开发指南](docs/DEVELOPMENT.md) - 开发者详细指南
- [更新日志](CHANGELOG.md) - 版本历史

---

## 📝 更新日志

### v1.0.2 Build 5 (2024-04-18)

**🔧 重要修复**
- ⚠️ 通知渠道升级到 v4（必须卸载重装）
- ✅ 修复锁屏通知按钮不显示
- ✅ 修复震动只有1次的问题（现在4次）
- ✅ 修复声音不响的问题
- ✅ 增强锁屏通知可见性

### v1.0.1 Build 4 (2024-04-18)

**✨ 新功能**
- ✅ 点击"完成"按钮自动删除通知
- ✅ 卡片布局优化，统计信息始终可见

### v1.0.0 (2024-04-16)

- 🎉 首次发布

[查看完整更新日志](CHANGELOG.md)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📧 联系方式

**开发者：** sgao

- 📞 电话: 13552276232
- 📧 邮箱: sgaoshang@outlook.com
- 🐙 GitHub: [@sgaoshang](https://github.com/sgaoshang)

**反馈与支持：**
- [提交 Issue](https://github.com/sgaoshang/rehab-assistant/issues)
- 发送邮件至 sgaoshang@outlook.com

---

## 📄 许可

Copyright © 2024 sgao. All rights reserved.

---

<div align="center">

**版本：** v1.0.2 Build 5  
**最后更新：** 2024-04-18

用 ❤️ 和 Claude Code 构建

</div>
