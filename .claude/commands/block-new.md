---
description: AI-only flow for a new WebKit block (a screen agents copy), from a "New block" issue to a PR. Research → block brief → second-agent review → build → machine gates → ui-craft review → usage check → PR. Stops on the first failure.
argument-hint: <issue number or URL>
---

You are the orchestrator of `/block-new`. You turn one **New block** issue
(`.github/ISSUE_TEMPLATE/new-block.yml`) into one pull request, with no human edit in between.
It mirrors `/component-new` (`.claude/commands/component-new.md`): same ground rules, same stop rule
(`STOPPED at step <n>: <reason>`, commented on the issue), same gates. Read that file first; only
the differences are written here.

**User input:** $ARGUMENTS

## What a block is

A screen built only from `@aziontech/webkit` components, which agents copy through the MCP
(`search_blocks` → `get_block`). It lives in one folder:

| Group                                                                                                             | Folder                                   |
| ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `account`, `ai`, `auth`, `create`, `dashboard`, `detail`, `edit`, `settings`, `state`, `view`, `shell`, `top-bar` | `packages/webkit/blocks/<group>/<name>/` |

The group is the job, never the surface: `block.json#surface` says where the screen lives (`app`,
`docs` or `site`). The `<name>` starts with the group word, once: `<group>-<what>`
(`dashboard/dashboard-alerts`, `view/view-table`; `check:naming` rule `block-group-first`). The
docs sidebar lists its full title ("Dashboard Alerts" under Dashboard); see
`.claude/rules/naming.md` § 3 and § 25.

```
<folder>/
├── block.json          id (= folder path under blocks/), name, title, surface, summary, preview,
│                       intents (en + pt-BR), skills, primary { name, file }, variants[], steps?
├── <name>.vue          the primary state, a copyable SFC that takes its data through typed props
├── sample.ts           the sample records the primary renders when its data props are left out
│                       (listed in block.json "files", with any adapter next to it)
├── guidelines.md       when to use / not, building blocks A, B, C… (each naming the components
│                       the primary SFC imports), data (props, events, going live), do / don't,
│                       copy, accessibility, one States line per variant, related blocks
└── variants/
    └── <state>.vue     one state each (empty, loading, error, ...): the primary with other props
```

### The data contract

A block is a screen an app feeds, not a demo. The primary SFC:

- declares `withDefaults(defineProps<<Name>Props>(), …)` with exported record types
  (`export interface <Name><Thing>`), each member with a one-line JSDoc;
- takes its records, `loading?: boolean` and `error?: string` (the message the error state shows)
  as props; empty is the data prop set to `[]`;
- reads each data prop as `props.x ?? (props.loading || props.error ? [] : sampleX)`, so a
  left-out prop renders `sample.ts` and the sample never shows while loading or failed;
- emits every action with the typed tuple form (`create`, `refresh`, `retry`, `delete`,
  `row-action`, `submit`…; activation events put the DOM event first) and owns two-way state
  the parent must control through `defineModel` (time range, open folder, active tab);
- fakes no backend: no `setTimeout` refresh, save or upload; the parent sets `loading`.

`sample.ts` holds every record, series and fixed clock (`Date.UTC`), typed with
`import type { … } from './<name>.vue'`; UI config (columns, filter properties, menus) stays in
the SFC. A variant imports the primary (`import X from '../<name>.vue'`) and passes it other props
or slots; only a genuinely different screen may stay a full SFC. `npx @aziontech/webkit add`
copies the `files` beside the SFC (a part SFC as kebab `<stem>-<part>.vue`, or `<part>.vue` when
its name already starts with `<stem>-`; data and helpers as `<stem>.<file>`) and rewrites the
local imports, and
`get_block` returns them under `files`. `check:blocks` fails on a primary without props, a
primary that holds records, a variant that repeats 90 % or more of the primary, and a variant
of 60 lines or more that copies 60 % or more of the primary and adds its own code (a fork, which
misses every later fix to the primary) (`scripts/blocks-data-baseline.json` freezes the legacy
findings and only shrinks). The exemplar is
`view/view-table`.

The catalog (`build:catalog`), the MCP (`get_block` returns `guidelines.md` with the SFC),
`check:blocks` (consumer lint on every SFC, and `guidelines.md` against the SFC), the
docs site (`apps/docs`, one page per block and one frame per state), the styled visual suite
(`apps/visual`, the primary state; every state for `ai`) and the browser test
that mounts every SFC (`src/test/copyable-sfcs.test.ts`) all read these files.

## Step 1 — Read the request

`gh issue view <n> --json number,title,body,labels,url`; parse category, name, intent, benchmarks,
where it is used, surface, states, acceptance criteria. Exit condition: every required field is
present. Create the branch with `/branch-create new block <name> #<n>`.

## Step 2 — Research and reuse

1. Benchmarks: Cloudscape patterns and demos as Markdown (`https://cloudscape.design/patterns/<x>/index.html.md`,
   index `https://cloudscape.design/llms.txt`), shadcn blocks (`https://ui.shadcn.com/blocks`).
2. Reuse: MCP `search_blocks` with the intent (en and pt-BR), `get_block` on the closest hits,
   `catalog.json#blockAliases`. For each region of the screen, `suggest_component`.
3. Exit condition: no block does the job. If one nearly does, the run adds a **variant** to it
   instead (same steps, the existing folder). If a region needs a component that does not exist,
   stop and open a **New component** issue; the block waits for it (`/component-new` first).

## Step 3 — Block brief (draft)

Write the brief to the run log: the draft `block.json` (no files in `blocks/` yet), one line per
region naming the components that render it, the variant list from the issue's states, the sample
content, and the draft `guidelines.md` in the shared format (see any
`packages/webkit/blocks/view/view-table/guidelines.md`: `# <Block name>`, the purpose
paragraph, `## When to use`, `## When not to use`, `## Building blocks` with
``### A. <Element> — `Component` ``, `## Data`, `## Do`, `## Don't`, `## Copy`, `## Accessibility`,
`## States`, `## Related`), written against the consumer skills the block lists. Every component named exists in `packages/webkit/package.json#exports` (check it
with the MCP `get_component`, never from memory).

## Step 4 — Brief review by a second agent

Spawn `spec-reviewer` in **block mode** (`.claude/agents/spec-reviewer.md`, "Block mode") with the
brief, the issue and the research notes. Same loop as `/component-new` step 4: `return` → revise →
fresh reviewer, three returns stop the run. Exit condition: `approve`.

## Step 5 — Build

1. Write `block.json`, `<name>.vue`, `variants/<state>.vue` and `guidelines.md` in the folder
   above; update `guidelines.md` to the built SFC (letters follow the SFC order, every imported
   component appears in one building block, one States line per variant). Each SFC
   imports only `@aziontech/webkit/*` subpaths and `@aziontech/icons`, follows
   `.claude/skills/ui-craft` "Start here", and follows the data contract above (the primary
   plus its `files` run on their own; a variant needs only them).
2. `pnpm --filter @aziontech/webkit build:catalog` and
   commit `catalog.json` and `catalog/`. The docs page and the visual test follow from the files;
   baselines for a new block come from the `Visual baselines` workflow (`/baselines-regenerate`).
3. Exit condition: `node packages/webkit/scripts/check-naming.mjs` and
   `node packages/webkit/scripts/check-blocks.mjs` pass (the latter fails when `guidelines.md`
   is missing, a section is missing or empty, a building block names a component the primary SFC
   does not import or leaves one out, or a variant has no States line).

## Step 6 — Machine gates

The `/component-new` step-6 commands, with the browser run narrowed to the copyable SFCs:
`cd packages/webkit && pnpm exec vitest run copyable-sfcs`. Exit condition: all exit 0.

## Step 7 — `ui-craft` review (mandatory)

`/ui-craft <file>` on the primary SFC and on every variant. Fix or list each finding; no open
blocker.

## Step 8 — Usage check

`pnpm --filter @aziontech/webkit run check:usage -- <category-path>/<name> "<prompt>" --report usage-report.md`
(for example `settings/api-tokens`), or the `usage-check.yml` workflow. The prompt asks for
the screen by its job, never by the block id. Pass: the generated `src/**/*.vue` imports at least
80 % of the components the block's primary SFC imports (the session copied it through
`get_block`) and `webkit doctor` passes.

## Step 9 — Pull request

As `/component-new` step 9, with the block folder in place of the spec path and screenshots of every
variant (light, dark, RTL, mobile 320 px, wide 1920 px).

## Acknowledge before doing anything

Start your turn with one sentence: the issue you are reading and the block it asks for. Then run
Step 1.
