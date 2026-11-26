# @aziontech/webkit-mcp — the webkit MCP server

A [Model Context Protocol](https://modelcontextprotocol.io) server that lets an AI assistant in **any** project generate correct and performant [`@aziontech/webkit`](https://github.com/aziontech/webkit) code — the right component, the right tree-shakeable import, real props, and a runnable single-file component — instead of guessing or reaching for another UI library. It ships as its own package, `@aziontech/webkit-mcp` (bin `webkit-mcp`), so apps that install `@aziontech/webkit` do not download the MCP libraries.

It reads the **installed** webkit `catalog.json` (the version-locked manifest of exports, per-component API, and token rules), so every answer matches the webkit version the project actually has. If no catalog can be resolved, tools degrade to a clear "not available" answer and the server logs one line to **stderr** (never stdout, which carries the protocol).

## Run

```bash
npx -y @aziontech/webkit-mcp@^6
```

Register it with your MCP client (`npx @aziontech/webkit init` does this for you):

```jsonc
// .mcp.json
{
  "mcpServers": {
    "webkit": { "command": "npx", "args": ["-y", "@aziontech/webkit-mcp@^6"] }
  }
}
```

Requires Node ≥ 22. `@modelcontextprotocol/sdk`, `zod` and `@aziontech/webkit` (for the query engine, `@aziontech/webkit/catalog-queries`) are its dependencies, fetched at `npx` time. The catalog it answers from is the one installed in the project it runs in.

## Tools

Every argument is a JSON field of the tool call (`{ "name": "suggest_component", "arguments": { "need": "…" } }`). Required arguments are in bold; `surface` is always one of `app` (console and apps), `site` (the azion.com site) or `docs` (the documentation site), and console screens use `app`.

| Tool                 | Arguments                                                                                                                                                    | Answer                                                                                                                                                                                                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `search_blocks`      | **`query`** (the screen in plain words; empty lists every block), `surface`, `fragments` (boolean: `true` includes cards dropped into a page, `false` never) | Whole-screen blocks ranked by intent ("login", "account settings", "tela de login"). Start every screen here.                                                                                                                                                                                    |
| `get_block`          | **`id`** (from `search_blocks`, e.g. `view/view-table`), `variant` (a variant name, e.g. `IncorrectCredentials`), `sections` (`["guidelines"]` or `["sfc"]`) | One block: the runnable SFC, its components, skills, steps and variants (other states of the screen).                                                                                                                                                                                            |
| `list_components`    | `category` (e.g. `data`), `surface`, `cursor` (the previous answer's `nextCursor`), `limit` (1–300, default 60)                                              | Every renderable component (compact cards), optionally filtered by category.                                                                                                                                                                                                                     |
| `list_categories`    | none                                                                                                                                                         | The distinct categories in the installed catalog.                                                                                                                                                                                                                                                |
| `list_tokens`        | `category` (a token group: `primary`, `bg`, `text`, `chart`, `spacing`, `typography`, …, or one token name such as `--bg-surface`; omit for the index)       | The positive token inventory (what to use instead of hardcoding): the group index + typography classes, or a group's tokens. Every semantic token carries its light and dark value (colours) or value and breakpoints (lengths, type classes) and a one-line purpose.                            |
| `list_assets`        | `kind` (`illustrations`, `diagrams`, `brandMarks` or `icons`; omit for the index), `query` (words such as `ddos` or `delete`)                                | The names a component takes for its artwork, which live in registries and nowhere else: illustrations, diagrams, brand marks and icon classes (with keywords). Without a kind, each kind with its count and the components that use it; with a kind (and an optional `query`), every valid name. |
| `get_component`      | **`name`** (kebab-case, e.g. `button`)                                                                                                                       | Full API for one component: props, events, slots, sub-components, structure, purpose, when to use, examples and the classes allowed on its tag.                                                                                                                                                  |
| `get_import`         | **`name`** (kebab-case)                                                                                                                                      | The tree-shakeable import to prefer, plus the compound (dot-notation) alternative when one exists.                                                                                                                                                                                               |
| `search_components`  | **`query`** (free text in en, pt-BR or es, e.g. `date picker`, `botão`), `surface`                                                                           | Components matching a substring.                                                                                                                                                                                                                                                                 |
| `suggest_component`  | **`need`** (what you are building, in plain words, e.g. `a searchable paginated table`), `surface`                                                           | The best fit for a free-text need: the block first for a screen, the page section for a marketing band, else the component, with alternatives.                                                                                                                                                   |
| `get_usage_example`  | **`name`** (kebab-case)                                                                                                                                      | A runnable `<script setup>` SFC using the tree-shakeable import and real props.                                                                                                                                                                                                                  |
| `get_best_practices` | **`name`** (kebab-case)                                                                                                                                      | The usage guidance for a component (or the general do/avoid list): composition patterns, token rules, pitfalls.                                                                                                                                                                                  |
| `validate_usage`     | `import` (e.g. `@aziontech/webkit/button`), `classes` (a class string), `component` (kebab-case: the tag the classes sit on); pass at least one              | Checks an import path (published? not internal?) and a class string (token rules; with `component`, only layout utilities on its tag).                                                                                                                                                           |

### Search

`search_blocks`, `search_components` and `suggest_component` understand English, Portuguese and Spanish: a query is matched against each block's intents and name first (an exact id or name ranks first), then against synonyms (`@aziontech/webkit` `src/catalog/lexicon/synonyms.js`: "cadastro" and "crear cuenta" reach sign-up, "botão" and "botón" reach `button`), then against the summary. All three take an optional `surface` (`app`, `site`, `docs`). The fixed query set `packages/webkit/test/catalog/search-queries.json` (en, pt-BR, es; expected first result and acceptable first three) runs in CI through `packages/webkit/test/catalog/search-quality.test.mjs`; add a query there whenever a search answers wrong, then fix the lexicon or the intents.

### Without the MCP

The same content ships as files in `@aziontech/webkit`'s `llms/` (generated by `packages/webkit/scripts/build-llms.mjs`, checked by the `llms` gate): `llms.txt` links one Markdown page per block, component and foundation, each component has a JSON API next to its page (its examples are named there with the path of their shipped `.vue`), `llms-full.txt` holds every foundation, block and product (`app`) component in one file, and `llms-full-site.txt` holds the marketing and documentation site components.

What goes in the two full files (budgets in `FULL_BUDGETS`, about 2 MB and 0.7 MB; they only go down, cut the file instead of raising one): each entry carries what an agent needs to choose and use it. A component keeps its API tables, guidance, states and accessibility, but only its first example, its sub-component notes cut to their first sentence and its related names without links; its RTL, i18n and responsive notes stay on its page. A block keeps its summary's first sentence, intents and guidelines, with its building blocks and variants as names only and no code. Asset pages list names only. Text every entry would repeat (the tag-class rule, the JSON link) is stated once in the header. The per-page files under `llms/components/`, `llms/blocks/` and `llms/foundations/` stay complete.

### Answer size

Answers are compact JSON. `list_components` returns 60 cards per page with a `nextCursor` to pass back as `cursor` (`limit` changes the page size). `search_blocks` and `suggest_component` return block cards with a one-sentence summary and the first five intents; `get_block` has the detail, and `sections: ["guidelines"]` or `["sfc"]` returns one of its two heavy parts at a time.

## How it fits the adoption toolkit

This is the **GUIDE** layer: assistive, helps get usage right up front. The companion **FORCE** layer (the [webkit ESLint plugin](https://github.com/aziontech/webkit/blob/main/packages/webkit/docs/toolkit/ESLINT_PLUGIN.md) + [Stylelint config](https://github.com/aziontech/webkit/blob/main/packages/webkit/docs/toolkit/STYLELINT_CONFIG.md)) blocks incorrect usage on commit and in CI. Both read the same `catalog.json`. Wire everything in one step with `npx @aziontech/webkit init`.

## License

MIT
