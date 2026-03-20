# Format GraphQL

一个 Raycast 扩展，用于格式化从 Chrome DevTools 复制的 GraphQL 请求（Network 标签 → 请求载荷）。

## 功能

- 格式化压缩的 GraphQL 查询，生成清晰缩进的代码
- 解析 JSON 请求体（`{"query":"...","variables":{...}}`）
- 支持批量操作（查询数组）
- 提取并展示 variables
- 可配置缩进方式（Tab、2/4/8 空格）
- 格式化结果自动复制到剪贴板

## 前置要求

- [Raycast](https://raycast.com/) v1.26.0+
- [Node.js](https://nodejs.org/) 22.14+
- [pnpm](https://pnpm.io/)

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发模式（热重载，扩展自动出现在 Raycast 中）
pnpm dev

# 构建
pnpm build

# 代码检查
pnpm lint
```

## 使用方法

1. 从 Chrome DevTools 复制 GraphQL 请求载荷
2. 打开 Raycast，搜索 **"Format GraphQL"**
3. 粘贴内容，选择缩进方式，提交
4. 格式化结果已复制到剪贴板

支持三种输入格式：

- 原始 GraphQL 查询字符串
- JSON 对象：`{"query": "...", "variables": {...}}`
- JSON 数组（批量查询）
