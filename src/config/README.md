# 应用配置说明

## 文件位置
`src/config/app.ts`

## 配置项说明

### enableDonation（打赏功能开关）

控制是否在设置页面显示"打赏开发者"入口。

**使用方法：**

1. **显示打赏功能**（默认）
   ```typescript
   enableDonation: true,
   ```
   
2. **隐藏打赏功能**
   ```typescript
   enableDonation: false,
   ```

**效果：**
- `true`: 设置页面会显示"打赏开发者"卡片，用户可以打赏
- `false`: 完全隐藏打赏相关入口和功能

---

### developer（开发者信息）

配置在设置页面显示的开发者信息。

```typescript
developer: {
  name: 'sgao',           // 开发者名称
  email: 'sgaoshang@outlook.com',  // 联系邮箱
}
```

**修改方法：**
直接修改 `name` 和 `email` 字段即可。

---

### version（版本号）

应用版本信息。

```typescript
version: '1.0.0',
```

**注意：** 建议与 `package.json` 和 `app.json` 中的版本号保持一致。

---

## 修改配置后

修改配置文件后，重新启动应用即可生效，无需重新构建。

如果是生产环境，建议在发版前测试配置是否正确。
