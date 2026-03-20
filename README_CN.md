# Format GraphQL

一个 Raycast 扩展，用于格式化从 Chrome DevTools 复制的 GraphQL 请求（Network 标签 → 请求载荷）。

## 功能

- 格式化压缩的 GraphQL 查询，生成清晰缩进的代码
- 解析 JSON 请求体（`{"query":"...","variables":{...}}`）
- 支持批量操作（查询数组）
- 提取并展示 variables
- 可配置缩进方式（Tab、2/4/8 空格）
- 格式化结果在 Detail 视图中展示，带语法高亮
- 复制到剪贴板，或直接粘贴到当前应用

## 前置要求

- [Raycast](https://raycast.com/) v1.26.0+
- [Node.js](https://nodejs.org/) 22.14+
- [pnpm](https://pnpm.io/)

## 安装到 Raycast

```bash
pnpm install
pnpm dev
```

执行 `pnpm dev` 后扩展会立即注册到 Raycast。打开 Raycast 搜索 **"Format GraphQL"** 即可使用。

停止 dev server 后扩展仍然保留在 Raycast 中。修改代码后重新运行 `pnpm dev` 即可生效。

也可以通过 Raycast 导入：

1. 打开 Raycast，搜索 **"Import Extension"**
2. 选择本项目文件夹
3. 运行 `pnpm install && pnpm dev`

## 开发

```bash
pnpm dev          # 开发模式，支持热重载
pnpm build        # 生产构建（类型检查 + 打包）
pnpm lint         # 代码检查
pnpm fix-lint     # 自动修复 lint 问题
```

## 使用方法

1. 从 Chrome DevTools 复制 GraphQL 请求载荷
2. 打开 Raycast，搜索 **"Format GraphQL"**
3. 粘贴内容，选择缩进方式，提交
4. 查看格式化结果，按 Enter 复制或 Cmd+Shift+Enter 粘贴到当前应用

支持三种输入格式：

- 原始 GraphQL 查询字符串
- JSON 对象：`{"query": "...", "variables": {...}}`
- JSON 数组（批量查询）

## Raycast 扩展分发方式

Raycast 不支持独立打包安装，没有 `.rayext` 之类的格式，也不支持 sideload。可用的分发方式：

| 方式 | 费用 | 受众 | 审核 |
|---|---|---|---|
| `pnpm dev` → Ctrl+C | 免费 | 个人 | 无 |
| [公共 Store](https://www.raycast.com/store) | 免费 | 所有人 | 需要（Raycast 团队审核） |
| [Raycast for Teams](https://www.raycast.com/teams) | $12–15/人/月 | 团队 | 无 |
| 分享源码 | 免费 | 技术用户 | 无 |

- **个人使用**：运行 `pnpm dev`，然后 Ctrl+C 停止。扩展会持久保留在 Raycast 中。
- **公共 Store**：运行 `pnpm publish`，会自动向 [raycast/extensions](https://github.com/raycast/extensions) 仓库提 PR。审核通过合并后即上架 Store。
- **团队（私有）**：需要 Raycast for Teams 订阅。通过 `pnpm publish` 或 CI/CD 直接发布到团队私有 Store。
- **分享源码**：分享仓库地址，对方 clone 后运行 `pnpm install && pnpm dev` 即可。

`pnpm build` 的产物（`dist/`）是发布流水线的中间产物，不能直接安装到 Raycast。
