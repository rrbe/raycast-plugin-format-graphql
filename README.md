# Format GraphQL

A Raycast extension that formats GraphQL query strings copied from Chrome DevTools (Network tab → request payload).

## Features

- Formats minified GraphQL queries with proper indentation
- Parses JSON request bodies (`{"query":"...","variables":{...}}`)
- Supports batch operations (array of queries)
- Extracts and displays variables alongside formatted queries
- Configurable indentation (tabs, 2/4/8 spaces)
- Copies formatted result to clipboard

## Prerequisites

- [Raycast](https://raycast.com/) v1.26.0+
- [Node.js](https://nodejs.org/) 22.14+
- [pnpm](https://pnpm.io/)

## Development

```bash
# Install dependencies
pnpm install

# Start dev mode (hot-reload, extension appears in Raycast)
pnpm dev

# Build
pnpm build

# Lint
pnpm lint
```

## Usage

1. Copy a GraphQL request payload from Chrome DevTools
2. Open Raycast and search for **"Format GraphQL"**
3. Paste the payload, choose indentation, and submit
4. Formatted result is copied to your clipboard

Supports three input formats:

- Raw GraphQL query string
- JSON object: `{"query": "...", "variables": {...}}`
- JSON array of objects (batch)
