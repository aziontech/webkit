# webkit MCP server — the `webkit-mcp` bin

A [Model Context Protocol](https://modelcontextprotocol.io) server that lets an AI assistant in **any** project generate correct and performant [`@aziontech/webkit`](https://github.com/aziontech/webkit) code — the right component, the right tree-shakeable import, real props, and a runnable single-file component — instead of guessing or reaching for another UI library. It ships **inside** `@aziontech/webkit` as the `webkit-mcp` bin — there is no separate MCP package.

It reads the **installed** webkit `catalog.json` (the version-locked manifest of exports, per-component API, and token rules), so every answer matches the webkit version the project actually has. If no catalog can be resolved, tools degrade to a clear "not available" answer and the server logs one line to **stderr** (never stdout, which carries the protocol).

## Run

```bash
npx -y -p @aziontech/webkit webkit-mcp
```

Register it with your MCP client (`npx @aziontech/webkit init` does this for you):

```jsonc
// .mcp.json
{
  "mcpServers": {
    "webkit": { "command": "npx", "args": ["-y", "-p", "@aziontech/webkit", "webkit-mcp"] }
  }
}
```

Requires Node ≥ 22. `@modelcontextprotocol/sdk` and `zod` are runtime dependencies, fetched automatically at `npx` time.

## Tools

| Tool                 | Answer                                                                                                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `list_components`    | Every renderable component (compact cards), optionally filtered by category.                                                                                            |
| `list_categories`    | The distinct categories in the installed catalog.                                                                                                                       |
| `list_tokens`        | The positive token inventory (what to use instead of hardcoding): the token group index + typography classes, or a group's CSS custom properties when given a category. |
| `get_component`      | Full API for one component: props, events, slots, sub-components, structure.                                                                                            |
| `get_import`         | The tree-shakeable import to prefer, plus the compound (dot-notation) alternative when one exists.                                                                      |
| `search_components`  | Components matching a substring.                                                                                                                                        |
| `suggest_component`  | The best component for a free-text need, with alternatives.                                                                                                             |
| `get_usage_example`  | A runnable `<script setup>` SFC using the tree-shakeable import and real props.                                                                                         |
| `get_best_practices` | The usage guidance for a component (or the general do/avoid list): composition patterns, token rules, pitfalls.                                                         |
| `validate_usage`     | Checks an import path (published? not internal?) and a class string (any token-rule violations?).                                                                       |

## How it fits the adoption toolkit

This is the **GUIDE** layer: assistive, helps get usage right up front. The companion **FORCE** layer (the [webkit ESLint plugin](./eslint-plugin.md) + [Stylelint config](./stylelint-config.md)) blocks incorrect usage on commit and in CI. Both read the same `catalog.json`. Wire everything in one step with `npx @aziontech/webkit init`.

## License

MIT
