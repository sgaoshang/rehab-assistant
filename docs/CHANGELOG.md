# 更新日志

本文档记录所有版本的重要更改。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [1.0.0] - 2024-04-16

### 🎉 首次发布

#### ✨ 新增功能

**项目管理：**
- 添加 40+ 专业康复训练预设项目
- 支持自定义项目创建
- 项目分类展示（早期/中期/后期康复阶段）
- 项目分组（康复训练/用药提醒/健康测量）
- 项目启用/禁用控制
- 项目编辑和删除功能
- 完成状态标记和记录

**提醒功能：**
- 本地推送通知
- 可视化时间轴选择器
- 支持每个项目最多 8 个提醒时间
- 快捷时间模板（一日三次、早晚各一次等）
- 拖拽调整提醒时间
- 语音播报每日待办事项

**用户界面：**
- 双标签页导航（首页/设置）
- 项目卡片可展开/收起
- 完成状态切换
- 统计信息展示
- 多语言支持（中文/英文）

**数据管理：**
- AsyncStorage 本地数据持久化
- 完成历史记录
- 统计数据（本周/总计）

#### 🔧 技术实现

- React Native + Expo SDK 54
- TypeScript 严格模式
- React Navigation 6
- Expo Notifications
- Expo Speech
- 国际化支持
- EAS Update (OTA) 支持

#### 📱 发布渠道

**Android：**
- GitHub Release 发布
- 标准版 APK (3.5 MB)
- 兼容版 APK (3.2 MB，专为 MIUI 10 优化)
- 支持 Android 5.0+

**iOS：**
- 待发布（需要 Apple 开发者账号）

#### 🐛 修复问题

- 修复 TypeScript 编译错误
- 修复依赖版本兼容性问题（Expo SDK 54）
- 修复图片格式问题（JPEG → PNG）
- 修复 MIUI 10 APK 解析错误

#### 📝 文档

- 完善 README.md
- 添加用户安装指南
- 添加开发者指南
- 添加部署文档

---

## [开发日志]

### 2024-04-15 - 简化提醒时间选择

#### Changed
- 将快捷时间按钮网格替换为下拉模板选择器
- 将模板卡片替换为下拉选项
- 模板选择现在会自动附加时间并去重
- 添加空状态占位符以改善用户体验

#### 迁移说明
- 无需数据迁移
- 现有项目可正常加载和工作
- 熟悉旧界面的用户需要简单适应新的下拉菜单

#### 用户影响
- 界面更简洁，视觉干扰更少
- 模板选择更快（1 次点击 vs 多次）
- 通过附加+去重行为实现更灵活的时间组合

---

## 版本规范

### 版本号格式

**主版本号.次版本号.修订号** (MAJOR.MINOR.PATCH)

- **主版本号（MAJOR）**：不兼容的 API 修改
- **次版本号（MINOR）**：向下兼容的功能性新增
- **修订号（PATCH）**：向下兼容的问题修正

### 变更类型

- **Added** - 新增功能
- **Changed** - 既有功能的变更
- **Deprecated** - 即将移除的功能
- **Removed** - 已移除的功能
- **Fixed** - 任何 bug 修复
- **Security** - 安全性相关的修复

---

## 相关链接

- [GitHub Releases](https://github.com/sgaoshang/rehab-assistant/releases)
- [问题跟踪](https://github.com/sgaoshang/rehab-assistant/issues)
- [开发指南](DEVELOPMENT.md)
