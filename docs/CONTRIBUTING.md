# 贡献指南

感谢您对提醒助手项目的关注！我们欢迎任何形式的贡献。

## 📋 贡献方式

您可以通过以下方式为项目做贡献：

- 🐛 报告 Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复
- ✨ 实现新功能
- 🌍 翻译和国际化

---

## 🐛 报告 Bug

在提交 Bug 报告前，请：

1. **搜索现有 Issue** - 确认问题是否已被报告
2. **使用最新版本** - 确保您使用的是最新版本
3. **收集信息** - 准备详细的问题描述

### Bug 报告模板

```markdown
**问题描述**
简要描述遇到的问题

**复现步骤**
1. 打开应用
2. 点击 ...
3. 看到错误 ...

**预期行为**
描述您期望发生的情况

**实际行为**
描述实际发生的情况

**环境信息**
- 设备: [例如 Xiaomi Mi 10]
- Android版本: [例如 Android 11]
- 应用版本: [例如 v1.0.0]
- 下载版本: [标准版/兼容版]

**截图**
如果适用，请添加截图帮助说明问题

**额外信息**
任何其他可能有用的信息
```

---

## 💡 功能建议

我们欢迎新功能建议！提交前请：

1. **搜索现有 Issue** - 避免重复建议
2. **详细描述** - 说明功能的用途和价值
3. **考虑实现** - 思考技术可行性

### 功能建议模板

```markdown
**功能描述**
简要描述建议的功能

**使用场景**
描述什么情况下需要这个功能

**解决的问题**
说明这个功能解决了什么痛点

**可能的实现方案**
（可选）您对实现方式的想法

**替代方案**
（可选）考虑过的其他解决方案
```

---

## 🔧 代码贡献

### 准备工作

1. **Fork 仓库**
   ```bash
   # 在 GitHub 上点击 Fork 按钮
   # 克隆您的 fork
   git clone https://github.com/YOUR_USERNAME/rehab-assistant.git
   cd rehab-assistant
   ```

2. **添加上游仓库**
   ```bash
   git remote add upstream https://github.com/sgaoshang/rehab-assistant.git
   ```

3. **安装依赖**
   ```bash
   npm install
   ```

4. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

### 开发流程

1. **编写代码**
   - 遵循项目的代码规范
   - 添加必要的注释
   - 确保 TypeScript 类型正确

2. **测试您的更改**
   ```bash
   # TypeScript 类型检查
   npx tsc --noEmit
   
   # 启动开发服务器
   npm start
   
   # 在真机/模拟器上测试
   ```

3. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **保持同步**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

5. **推送到您的 Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **创建 Pull Request**
   - 访问 GitHub 上您的 fork
   - 点击 "New Pull Request"
   - 填写 PR 描述
   - 提交 PR

### 代码规范

#### TypeScript

```typescript
// ✅ 好的示例
interface UserProps {
  name: string;
  age: number;
}

export const User: React.FC<UserProps> = ({ name, age }) => {
  return <Text>{name} - {age}</Text>;
};

// ❌ 避免
export const User = (props: any) => {
  return <Text>{props.name}</Text>;
};
```

#### 组件命名

- 使用 PascalCase 命名组件
- 文件名与组件名一致
- 使用描述性名称

```typescript
// ✅ 好的
ProjectCard.tsx
export const ProjectCard: React.FC<Props> = () => { ... };

// ❌ 避免
card.tsx
export const Card = () => { ... };
```

#### 样式

```typescript
// ✅ 使用 StyleSheet.create
import { StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

// ❌ 避免内联样式（除非必要）
<View style={{ flex: 1 }}>
```

### 提交消息规范

使用语义化提交消息：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type:**
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 添加测试
- `chore`: 构建/工具更新

**示例:**
```
feat(notifications): add custom sound support

Add ability to select custom notification sounds for different
project types. Users can now choose from system sounds or use
default notification tone.

Closes #42
```

### Pull Request 指南

**PR 描述应包含：**

1. **更改描述** - 您做了什么更改
2. **动机** - 为什么需要这个更改
3. **测试** - 如何测试您的更改
4. **截图** - 如果有 UI 更改，请附上截图
5. **相关 Issue** - 如果修复了 Issue，请引用

**PR 模板：**

```markdown
## 更改类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] 文档更新
- [ ] 重构
- [ ] 其他

## 更改描述
简要描述您的更改

## 测试
说明如何测试您的更改
- [ ] 在 Android 设备上测试
- [ ] 在 iOS 模拟器上测试
- [ ] TypeScript 编译通过
- [ ] 无 lint 错误

## 截图
如果有 UI 更改，请附上截图

## 相关 Issue
Closes #(issue number)
```

---

## 📝 文档贡献

文档同样重要！您可以：

- 修正错别字和语法错误
- 改进现有文档的清晰度
- 添加示例和教程
- 翻译文档

文档位置：
- `README.md` - 项目概览
- `docs/INSTALLATION.md` - 用户安装指南
- `docs/DEVELOPMENT.md` - 开发者指南
- `docs/CHANGELOG.md` - 更新日志
- `docs/DEPLOYMENT.md` - 部署指南

---

## 🌍 翻译和国际化

帮助将应用翻译成更多语言：

1. 翻译文件位置：`src/i18n/translations/`
2. 添加新语言：
   ```typescript
   // src/i18n/translations/es.ts
   export const es: Translations = {
     common: {
       confirm: 'Confirmar',
       cancel: 'Cancelar',
       // ...
     },
     // ...
   };
   ```

3. 注册新语言：
   ```typescript
   // src/i18n/index.ts
   import { es } from './translations/es';
   
   const translations = {
     zh,
     en,
     es, // 添加新语言
   };
   ```

---

## 👥 行为准则

### 我们的承诺

为了营造开放和友好的环境，我们承诺：

- 尊重不同的观点和经历
- 优雅地接受建设性批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

### 不可接受的行为

- 使用性化的语言或图像
- 人身攻击
- 公开或私下骚扰
- 未经许可发布他人的私人信息
- 其他不道德或不专业的行为

### 执行

违反行为准则的情况将导致：

1. 警告
2. 暂时封禁
3. 永久封禁

---

## ❓ 问题和帮助

如有任何问题：

- 📧 发送邮件：sgaoshang@outlook.com
- 💬 提交 Issue：https://github.com/sgaoshang/rehab-assistant/issues
- 📱 电话：13552276232

---

## 📄 许可

通过为本项目做贡献，您同意您的贡献将按照项目的许可证进行授权。

---

**感谢您的贡献！** 🎉
