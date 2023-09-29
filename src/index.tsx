import { Icon, Form, ActionPanel, Action, showToast, Clipboard, Toast, showHUD, popToRoot } from "@raycast/api";
import prettier from "prettier";

interface CommandForm {
  input: string;
  indent: string;
}

function isValidJSON(input: string) {
  try {
    JSON.parse(input);
    return true;
  } catch (e) {
    return false;
  }
}

function isValidGraphQLQuery(input: string) {
  try {
    prettier.format(input, { parser: "graphql" });
    return true;
  } catch (e) {
    return false;
  }
}

interface GraphQLItem {
  operationName?: string;
  variables?: Record<string, any>;
  query: string;
}

function parseGraphQLItem(graphqlItem: GraphQLItem, parseOptions?: prettier.Options) {
  const {
    // operationName, variables,
    query,
  } = graphqlItem;

  return prettier.format(query, parseOptions);
}

export default function Command() {
  function handleSubmit(values: CommandForm) {
    const { input, indent } = values;

    if (input.length === 0) {
      showToast({
        style: Toast.Style.Failure,
        title: "Empty input",
      });
      return;
    }

    const useTabs = indent === "tab";
    const tabWidth = indent !== "tab" ? parseInt(indent) : 2;

    const options = {
      parser: "graphql",
      useTabs,
      tabWidth,
    };

    let output = "";
    if (isValidJSON(input)) {
      const jsonInput = JSON.parse(input);
      if (Array.isArray(jsonInput)) {
        const graphqlItems = jsonInput as GraphQLItem[];
        output = graphqlItems.map((item) => parseGraphQLItem(item, options)).join("\n\n");
      } else {
        const graphqlItem = jsonInput as GraphQLItem;
        output = parseGraphQLItem(graphqlItem, options);
      }
    } else if (isValidGraphQLQuery(input)) {
      output = parseGraphQLItem({ query: input }, options);
    } else {
      showToast({
        style: Toast.Style.Failure,
        title: "Invalid GraphQL",
      });
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
