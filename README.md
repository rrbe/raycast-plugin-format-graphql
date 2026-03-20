# Format GraphQL

A Raycast extension that formats GraphQL query strings copied from Chrome DevTools (Network tab → request payload).

## Features

- Formats minified GraphQL queries with proper indentation
- Parses JSON request bodies (`{"query":"...","variables":{...}}`)
- Supports batch operations (array of queries)
- Extracts and displays variables alongside formatted queries
- Configurable indentation (tabs, 2/4/8 spaces)
- Result displayed in a Detail view with syntax highlighting
- Copies formatted result to clipboard, or paste directly to active app

## Prerequisites

- [Raycast](https://raycast.com/) v1.26.0+
- [Node.js](https://nodejs.org/) 22.14+
- [pnpm](https://pnpm.io/)

## Install to Raycast

```bash
pnpm install
pnpm dev
```

Running `pnpm dev` registers the extension in Raycast immediately. Open Raycast and search for **"Format GraphQL"** to use it.

The extension stays registered even after you stop the dev server. To pick up code changes, run `pnpm dev` again.

Alternatively, you can import the source folder directly in Raycast:

1. Open Raycast, search for **"Import Extension"**
2. Select this project folder
3. Run `pnpm install && pnpm dev`

## Development

```bash
pnpm dev          # Dev mode with hot-reload
pnpm build        # Production build (type-check + bundle)
pnpm lint         # Lint
pnpm fix-lint     # Auto-fix lint issues
```

## Usage

1. Copy a GraphQL request payload from Chrome DevTools
2. Open Raycast and search for **"Format GraphQL"**
3. Paste the payload, choose indentation, and submit
4. View the formatted result, press Enter to copy or Cmd+Shift+Enter to paste

Supports three input formats:

- Raw GraphQL query string
- JSON object: `{"query": "...", "variables": {...}}`
- JSON array of objects (batch)

## Raycast Extension Distribution

Raycast does not support standalone packaging — there is no `.rayext` file or sideloading mechanism. Available distribution methods:

| Method | Cost | Audience | Review |
|---|---|---|---|
| `pnpm dev` → Ctrl+C | Free | Personal | No |
| [Public Store](https://www.raycast.com/store) | Free | Everyone | Yes (Raycast team) |
| [Raycast for Teams](https://www.raycast.com/teams) | $12–15/user/mo | Your org | No |
| Share source code | Free | Anyone technical | No |

- **Personal use**: Run `pnpm dev` once, then Ctrl+C. The extension persists in Raycast.
- **Public Store**: Run `pnpm publish`, which opens a PR to [raycast/extensions](https://github.com/raycast/extensions). After review and merge, the extension is available in the Store.
- **Teams (private)**: Requires a Raycast for Teams subscription. Publish directly to your org's private store with `pnpm publish` or via CI/CD.
- **Share source**: Share the repo and have the recipient run `pnpm install && pnpm dev`.

`pnpm build` output (`dist/`) is an intermediate artifact for the publishing pipeline — it cannot be installed into Raycast directly.
