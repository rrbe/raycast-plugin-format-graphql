import {
  Icon,
  Form,
  Detail,
  ActionPanel,
  Action,
  showToast,
  Clipboard,
  Toast,
  useNavigation,
} from "@raycast/api";
import { useState } from "react";

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
      out = out.replace(/\s+$/, "");
      emitNewline();
      out += "}";
      i++;
      skipWhitespace();
      if (i < len && source[i] !== "}" && source[i] !== ")") {
        emitNewline();
      }
      continue;
    }

    if (ch === "(") {
      out += "(";
      i++;
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

    if (/\s/.test(ch)) {
      skipWhitespace();
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

    return { operation: item.query, variables, operationName };
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
  return /^\s*(query|mutation|subscription|fragment|\{)/.test(input);
}

function buildOutput(input: string, indentStr: string): string {
  if (isValidJSON(input)) {
    const operations = parseInput(input);
    const parts = operations.map((op) => {
      let part = `# ${op.operationName}\n${formatGraphQL(op.operation, indentStr)}`;
      if (op.variables) {
        part += `\n\n# Variables\n${op.variables}`;
      }
      return part;
    });
    return parts.join("\n\n---\n\n");
  } else if (isValidGraphQLQuery(input)) {
    return formatGraphQL(input, indentStr);
  } else {
    throw new Error("Invalid GraphQL");
  }
}

function ResultView({ output }: { output: string }) {
  const markdown = "```graphql\n" + output + "\n```";

  return (
    <Detail
      markdown={markdown}
      actions={
        <ActionPanel>
          <Action.CopyToClipboard title="Copy to Clipboard" content={output} />
          <Action.Paste title="Paste to Active App" content={output} />
        </ActionPanel>
      }
    />
  );
}

export default function Command() {
  const { push } = useNavigation();
  const [input, setInput] = useState("");

  function handleSubmit(values: CommandForm) {
    const trimmed = values.input.trim();

    if (trimmed.length === 0) {
      showToast({ style: Toast.Style.Failure, title: "Empty input" });
      return;
    }

    const indentStr = values.indent === "tab" ? "\t" : " ".repeat(parseInt(values.indent));

    try {
      const output = buildOutput(trimmed, indentStr);
      Clipboard.copy(output);
      showToast({ style: Toast.Style.Success, title: "Copied to clipboard" });
      push(<ResultView output={output} />);
    } catch (e) {
      showToast({ style: Toast.Style.Failure, title: "Parse error", message: (e as Error).message });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm icon={Icon.Checkmark} title="Format" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextArea id="input" title="Input" placeholder="Paste GraphQL here…" value={input} onChange={setInput} />
      <Form.Dropdown id="indent" title="Indentation" storeValue>
        <Form.Dropdown.Item value="tab" title="Tabs" />
        <Form.Dropdown.Item value="2" title="Spaces: 2" />
        <Form.Dropdown.Item value="4" title="Spaces: 4" />
        <Form.Dropdown.Item value="8" title="Spaces: 8" />
      </Form.Dropdown>
    </Form>
  );
}
