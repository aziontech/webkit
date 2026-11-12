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

| Tool                 | Answer                                                                                                                                                                                                                                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `search_patterns`    | Whole-screen patterns ranked by intent ("login", "account settings", "tela de login"). Start every screen here.                                                                                                                                                                                                |
| `get_pattern`        | One pattern: the runnable SFC, its components, skills, steps and variants (other states of the screen).                                                                                                                                                                                                        |
| `list_components`    | Every renderable component (compact cards), optionally filtered by category.                                                                                                                                                                                                                                   |
| `list_categories`    | The distinct categories in the installed catalog.                                                                                                                                                                                                                                                              |
| `list_tokens`        | The positive token inventory (what to use instead of hardcoding): the token group index + typography classes, or a group's CSS custom properties when given a category.                                                                                                                                        |
| `list_assets`        | The names a component takes for its artwork, which live in registries and nowhere else: illustrations, diagrams, line figures, brand marks and icon classes (with keywords). Without a kind, each kind with its count and the components that use it; with a kind (and an optional `query`), every valid name. |
| `get_component`      | Full API for one component: props, events, slots, sub-components, structure, purpose, when to use, examples and the classes allowed on its tag.                                                                                                                                                                |
| `get_import`         | The tree-shakeable import to prefer, plus the compound (dot-notation) alternative when one exists.                                                                                                                                                                                                             |
| `search_components`  | Components matching a substring.                                                                                                                                                                                                                                                                               |
| `suggest_component`  | The best fit for a free-text need: the pattern first for a screen, the page section for a marketing band, else the component, with alternatives.                                                                                                                                                               |
| `get_usage_example`  | A runnable `<script setup>` SFC using the tree-shakeable import and real props.                                                                                                                                                                                                                                |
| `get_best_practices` | The usage guidance for a component (or the general do/avoid list): composition patterns, token rules, pitfalls.                                                                                                                                                                                                |
| `validate_usage`     | Checks an import path (published? not internal?) and a class string (token rules; with `component`, only layout utilities on its tag).                                                                                                                                                                         |

### Search

`search_patterns`, `search_components` and `suggest_component` understand English, Portuguese and Spanish: a query is matched against each block's intents and name first (an exact id or name ranks first), then against synonyms (`src/mcp/search-lexicon.js`: "cadastro" and "crear cuenta" reach sign-up, "botão" and "botón" reach `button`), then against the summary. All three take an optional `surface` (`product`, `marketing`, `docs`). The fixed query set `test/mcp/search-queries.json` (en, pt-BR, es; expected first result and acceptable first three) runs in CI through `test/mcp/search-quality.test.mjs`; add a query there whenever a search answers wrong, then fix the lexicon or the intents.

### Without the MCP

The same content ships as files in `llms/` (generated by `scripts/build-llms.mjs`, checked by the `llms` gate): `llms.txt` links one Markdown page per block, component and foundation, each component has a JSON API next to its page, and `llms-full.txt` holds every page in one file.

## How it fits the adoption toolkit

This is the **GUIDE** layer: assistive, helps get usage right up front. The companion **FORCE** layer (the [webkit ESLint plugin](./eslint-plugin.md) + [Stylelint config](./stylelint-config.md)) blocks incorrect usage on commit and in CI. Both read the same `catalog.json`. Wire everything in one step with `npx @aziontech/webkit init`.

## License

MIT
