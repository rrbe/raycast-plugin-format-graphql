import { Icon, Form, ActionPanel, Action, showToast, Clipboard, Toast, showHUD, popToRoot } from "@raycast/api";

interface CommandForm {
  input: string;
  indent: string;
}

interface ParsedOperation {
  operation: string;
  variables: string | null;
  operationName: string;
}

function formatGraphQL(source: string, indent: string): string {
  let depth = 0;
  let out = "";
  let i = 0;
  const len = source.length;

  function skipWhitespace(): void {
    while (i < len && /\s/.test(source[i])) i++;
  }

  function emitNewline(): void {
    out += "\n" + indent.repeat(depth);
  }

  while (i < len) {
    const ch = source[i];

    // Skip block string """..."""
    if (ch === '"' && source[i + 1] === '"' && source[i + 2] === '"') {
      const end = source.indexOf('"""', i + 3);
      const slice = end === -1 ? source.slice(i) : source.slice(i, end + 3);
      out += slice;
      i += slice.length;
      continue;
    }

    // Skip regular string "..."
    if (ch === '"') {
      let j = i + 1;
      while (j < len && source[j] !== '"') {
        if (source[j] === "\\") j++;
        j++;
      }
      out += source.slice(i, j + 1);
      i = j + 1;
      continue;
    }

    // Comment: pass through to end of line
    if (ch === "#") {
      let j = i;
      while (j < len && source[j] !== "\n") j++;
      out += source.slice(i, j);
      i = j;
      continue;
    }

    if (ch === "{") {
      // Trim trailing space before brace
      out = out.replace(/ +$/, "");
      out += " {";
      depth++;
      i++;
      skipWhitespace();
      emitNewline();
      continue;
    }

    if (ch === "}") {
      depth = Math.max(0, depth - 1);
      // Trim trailing whitespace/newline
      out = out.replace(/\s+$/, "");
      emitNewline();
      out += "}";
      i++;
      skipWhitespace();
      // If next char is not } or end, add newline
      if (i < len && source[i] !== "}" && source[i] !== ")") {
        emitNewline();
      }
      continue;
    }

    if (ch === "(") {
      out += "(";
      i++;
      // Collect everything inside parens (handles nesting)
      let parenDepth = 1;
      while (i < len && parenDepth > 0) {
        if (source[i] === "(") parenDepth++;
        else if (source[i] === ")") parenDepth--;
        if (parenDepth > 0) out += source[i];
        i++;
      }
      out += ")";
      skipWhitespace();
      continue;
    }

    // Collapse whitespace: newlines and spaces between tokens
    if (/\s/.test(ch)) {
      skipWhitespace();
      // Don't add leading space at start of line
      if (out.length > 0 && !/\n\s*$/.test(out)) {
        out += " ";
      }
      continue;
    }

    out += ch;
    i++;
  }

  return out.trim();
}

function extractOperationName(query: string): string | null {
  const match = query.match(/(?:query|mutation|subscription)\s+(\w+)/);
  return match ? match[1] : null;
}

function parseInput(raw: string): ParsedOperation[] {
  const parsed = JSON.parse(raw);
  const items = Array.isArray(parsed) ? parsed : [parsed];

  if (items.length === 0) {
    throw new Error("Empty array — no operations found");
  }

  return items.map((item, i) => {
    if (typeof item !== "object" || item === null) {
      throw new Error(`Item ${i + 1} is not an object`);
    }
    if (!("query" in item) || typeof item.query !== "string") {
      throw new Error(`Item ${i + 1} is missing a "query" string field`);
    }

    const variables = item.variables ? JSON.stringify(item.variables, null, 2) : null;

    const operationName = item.operationName || extractOperationName(item.query) || `Operation ${i + 1}`;

    return {
      operation: item.query,
      variables,
      operationName,
    };
  });
}

function isValidJSON(input: string): boolean {
  try {
    JSON.parse(input);
    return true;
  } catch {
    return false;
  }
}

function isValidGraphQLQuery(input: string): boolean {
  // Basic check: contains GraphQL-like keywords or brace structure
  return /^\s*(query|mutation|subscription|fragment|\{)/.test(input);
}

export default function Command() {
  function handleSubmit(values: CommandForm) {
    const { input, indent } = values;

    if (input.trim().length === 0) {
      showToast({ style: Toast.Style.Failure, title: "Empty input" });
      return;
    }

    const indentStr = indent === "tab" ? "\t" : " ".repeat(parseInt(indent));

    let output = "";

    try {
      if (isValidJSON(input)) {
        const operations = parseInput(input);
        const parts = operations.map((op) => {
          let part = `# ${op.operationName}\n${formatGraphQL(op.operation, indentStr)}`;
          if (op.variables) {
            part += `\n\n# Variables\n${op.variables}`;
          }
          return part;
        });
        output = parts.join("\n\n---\n\n");
      } else if (isValidGraphQLQuery(input)) {
        output = formatGraphQL(input, indentStr);
      } else {
        showToast({ style: Toast.Style.Failure, title: "Invalid GraphQL" });
        return;
      }
    } catch (e) {
      showToast({ style: Toast.Style.Failure, title: "Parse error", message: (e as Error).message });
      return;
    }

    Clipboard.copy(output);
    showHUD("Copied to clipboard");
    popToRoot();
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm icon={Icon.Checkmark} title="Format and Copy" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextArea id="input" title="Input" placeholder="Paste GraphQL here…" />
      <Form.Dropdown id="indent" title="Indentation" storeValue>
        <Form.Dropdown.Item value="tab" title="Tabs" />
        <Form.Dropdown.Item value="2" title="Spaces: 2" />
        <Form.Dropdown.Item value="4" title="Spaces: 4" />
        <Form.Dropdown.Item value="8" title="Spaces: 8" />
      </Form.Dropdown>
    </Form>
  );
}
