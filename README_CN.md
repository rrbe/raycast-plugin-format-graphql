# Format GraphQL

Raycast 扩展，用于格式化从 Chrome DevTools / ProxyMan 等地方复制的 GraphQL 请求。

## 功能

- 解析 JSON 请求体（`{"query":"...","variables":{...}}`）, 格式化成 query 和 variables 分离的 GraphQL 查询代码，方便粘贴到 graphiql、GraphQL Playground、Apollo Studio 等工具中
- 支持批量操作（查询数组）
- 结果直接复制到剪贴板

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

## Raycast 扩展分发方式

Raycast 可用的分发方式：

| 方式                                               | 费用         | 受众   | 审核                     |
| -------------------------------------------------- | ------------ | ------ | ------------------------ |
| 使用 `@raycast/api`                                | 免费         | 个人   | 无                       |
| [公共 Store](https://www.raycast.com/store)        | 免费         | 所有人 | 需要（Raycast 团队审核） |
| [Raycast for Teams](https://www.raycast.com/teams) | $12–15/人/月 | 团队   | 无                       |

`pnpm build` 的产物（`dist/`）是发布流水线的中间产物，不能直接安装到 Raycast。
