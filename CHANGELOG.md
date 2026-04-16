# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-04-16

### Added
- ✨ 交互式通知操作按钮（🔊 播报、✓ 完成）
- 📱 锁屏状态下可通过通知按钮触发语音播报
- 🔧 Android 后台音频支持（添加 expo-av）
- 📝 语音播报功能详细说明文档 (docs/VOICE_NOTIFICATION.md)

### Changed
- ⚡️ 提升通知优先级从 HIGH 到 MAX
- 🔔 启用锁屏通知显示（PUBLIC visibility）
- 🚨 通知可绕过勿扰模式（bypassDnd）
- 📱 改进 iOS 后台模式配置（添加 audio 模式）

### Improved
- 🎯 通知在锁屏状态下的可见性和响应性
- 📢 更灵活的语音播报触发方式
- 🔊 增强振动和灯光提示

### Fixed
- 🐛 修复锁屏状态下无法语音播报的问题（通过添加操作按钮）
- 🔧 通知数据传递优化（使用翻译后的名称）

### Technical
- 📦 添加 expo-av 依赖 (^16.0.8)
- 🔐 新增 Android 权限：USE_FULL_SCREEN_INTENT, WAKE_LOCK, FOREGROUND_SERVICE
- 🔧 versionCode 从 1 升级到 2

## [1.0.0] - 2026-04-16

### Added
- 🎉 首个正式版本发布
- ✨ 康复提醒和任务管理
- 📅 日历视图和任务统计
- 🔔 本地通知支持
- 🗣️ 语音播报功能（应用前台）
- 📱 Android 平台支持
- 🔄 OTA 更新支持 (EAS Update)
- 🌐 中英文双语支持
- 📊 任务完成统计
- 🎨 预设任务分类

### Technical
- Expo SDK 54.0.0
- React Native 0.81.5
- React Navigation 6
- TypeScript
- expo-notifications ~0.32.16
- expo-speech ~14.0.8

## Links
- [v1.0.1 Release](https://github.com/sgaoshang/rehab-assistant/releases/tag/v1.0.1)
- [v1.0.0 Release](https://github.com/sgaoshang/rehab-assistant/releases/tag/v1.0.0)
