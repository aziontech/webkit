# Azion UI for AI

Azion UI is built for AI agents as much as for people. Everything this site shows also ships in
`@aziontech/ui` as files an agent reads, a server it queries and checks it has to pass. And
Azion UI itself is built by agents, through one reviewed flow.

## Build with AI

### Set up your agent in one step

Paste this into Claude Code, Cursor, Codex or any other coding agent, in your project:

> Install `@aziontech/ui`, `@aziontech/theme` and `@aziontech/icons` in this project, then
> run `npx @aziontech/ui init` to wire the lint, the MCP server and the agent docs.

`npx @aziontech/ui init` reads the project first and never overwrites your files. It writes:

- **`.mcp.json`**: the `azion-ui` MCP server, pinned to the major version you installed.
- **The agent instructions**: an Azion UI block in `AGENTS.md`, which every agent reads, and the
  skills, rules and agents in `.agents/`. When the project uses Claude Code (or with
  `init --claude`), it also adds short pointer files in `.claude/` and a `CLAUDE.md` that imports
  `AGENTS.md`, so Claude Code finds the same files.
- **The lint**: an ESLint config with the Azion UI preset, a Stylelint config and a pre-commit
  hook, so a wrong import or a raw colour fails before it is committed.
- **The styles**: `src/azion-ui.css` with the theme and the component classes, imported once in
  `src/main`.

The full list, with every flag, is in the
[CLI guide](https://github.com/aziontech/webkit/blob/main/packages/ui/docs/toolkit/CLI.md).

### The MCP server

`@aziontech/ui-mcp` answers from the catalog of the Azion UI version installed in the project,
so every answer matches the code the project has. The tools an agent uses most:

| Tool                                   | What it answers                                                              |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| `search_blocks`, `get_block`           | The whole screen to start from (sign-in, a list, a create flow) and its code |
| `suggest_component`                    | The block, page section or component that fits a need in plain words         |
| `get_component`, `get_usage_example`   | One component's props, events, slots and a runnable example                  |
| `list_tokens`, `list_assets`           | The tokens, icons and illustrations to use instead of a raw value            |
| `get_best_practices`, `validate_usage` | The guidance for a component, and a check of an import or a class string     |

Run it on its own with `npx -y @aziontech/ui-mcp@^6`. The tool list is in the
[MCP server guide](https://github.com/aziontech/webkit/blob/main/packages/ui-mcp/README.md).

### The guidance agents load

The pages of this site are the same Markdown files an agent reads:

- **Skills** (`node_modules/@aziontech/ui/skills/`): how to build a form, a table, an error,
  an empty or loading state, navigation and the rest. The docs show them under
  [Patterns](/patterns). `azion-ui-usage` is the entry point: it sends the agent to the pattern for
  the job before it writes code.
- **Rules** (`node_modules/@aziontech/ui/rules/`): the standards behind tokens, layout,
  motion, keyboard and accessibility, shown under [Foundations](/foundations).
- **Blocks** (`node_modules/@aziontech/ui/blocks/`): whole screens with their states and
  guidelines, shown under [Blocks](/blocks) and copied with `npx @aziontech/ui add <id>`.
- **llms.txt** (`node_modules/@aziontech/ui/llms/llms.txt`, also at [/llms.txt](/llms.txt)):
  one Markdown page per component, block and foundation, for an agent with no MCP.

### The checks that hold the line

- **Lint**: the ESLint plugin and the Stylelint config block a raw colour, a left or right utility
  where start or end belongs, an icon button with no accessible name and the other mechanical
  rules, every one at `error`.
- **`npx @aziontech/ui doctor`**: checks that the setup is healthy (theme, MCP, lint).
- **`npx @aziontech/ui check`**: one CI gate that runs doctor, the lint, the import check and
  the drift of every copied block.

### Do and Don't

- **Do:** start a screen from a block (`search_blocks`, then `npx @aziontech/ui add`), change
  only its content, and run `npx @aziontech/ui check` in CI.
- **Don't:** let the agent build a screen from scratch or reach for another UI library: the MCP and
  the skills exist so it never has to guess.

## Contribute

Azion UI has no design file and no hand-built component. Every new component and block is built by
AI agents through one flow, and a person approves the result:

1. **Request.** Open a GitHub issue from the **New component** or **New block** form: what it is
   for, where it is used and links to the benchmarks (Cloudscape, shadcn).
2. **Research.** An agent studies the benchmarks and searches the catalog, so nothing that already
   exists is built twice.
3. **Spec.** The agent writes the component's spec: its props, events, states, accessibility,
   languages, right-to-left, sizes and performance budget.
4. **Spec review.** A second agent reviews the spec with a fixed checklist. Only an approved spec
   can be built.
5. **Build.** Agents write the component, its test and its examples, matching the spec one to one;
   checks in the editor block anything the spec does not list.
6. **Gates.** Every machine gate runs: naming, tokens, types, tests in a real browser,
   accessibility, bundle size and the catalog.
7. **UI review.** The `ui-craft` review checks the component, its examples and every block that
   uses it, in light and dark.
8. **Usage check.** A fresh agent that knows nothing about the new piece must find it through the
   MCP and use it correctly.
9. **Pull request.** The agent opens the pull request with the gate table, the review report and
   screenshots. The head of design approves it; changes go back to the agents, never to a hand fix.

The whole flow, and what to update when Azion UI changes, is in
[CONTRIBUTING.md](https://github.com/aziontech/webkit/blob/main/CONTRIBUTING.md); an agent that works
on Azion UI starts at [AGENTS.md](https://github.com/aziontech/webkit/blob/main/AGENTS.md).
