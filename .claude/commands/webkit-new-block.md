---
description: AI-only flow for a new WebKit block (a screen agents copy), from a "New block" issue to a PR. Research → block brief → second-agent review → build → machine gates → ui-craft review → usage check → PR. Stops on the first failure.
argument-hint: <issue number or URL>
---

You are the orchestrator of `/webkit-new-block`. You turn one **New block** issue
(`.github/ISSUE_TEMPLATE/new-block.yml`) into one pull request, with no human edit in between.
It mirrors `/webkit-new` (`.claude/commands/webkit-new.md`): same ground rules, same stop rule
(`STOPPED at step <n>: <reason>`, commented on the issue), same gates. Read that file first; only
the differences are written here.

**User input:** $ARGUMENTS

## What a block is

A screen built only from `@aziontech/webkit` components, which agents copy through the MCP
(`search_patterns` → `get_pattern`). It lives in one folder:

| Category                                                                                           | Folder                                               |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `auth`, `account`, `create`, `view`, `detail`, `edit`, `delete`, `settings`, `states`, `dashboard` | `packages/webkit/blocks/platform/<category>/<name>/` |
| `shell`                                                                                            | `packages/webkit/blocks/shells/<name>/`              |

```
<folder>/
├── block.json          id (= folder path under blocks/), name, title, surface, summary, preview,
│                       intents (en + pt-BR), skills, primary { name, file }, variants[], steps?
├── <name>.vue          the primary state, a copyable SFC
└── variants/
    └── <state>.vue     one copyable SFC per state (empty, loading, error, ...)
```

The catalog (`catalog:build`), the MCP, `patterns:check` (consumer lint on every SFC), the
generated Storybook stories (`apps/storybook/scripts/gen-block-stories.mjs`) and the browser test
that mounts every SFC (`src/test/copyable-sfcs.test.ts`) all read these files.

## Step 1 — Read the request

`gh issue view <n> --json number,title,body,labels,url`; parse category, name, intent, benchmarks,
where it is used, surface, states, acceptance criteria. Exit condition: every required field is
present. Create the branch with `/create-branch new block <name> #<n>`.

## Step 2 — Research and reuse

1. Benchmarks: Cloudscape patterns and demos as Markdown (`https://cloudscape.design/patterns/<x>/index.html.md`,
   index `https://cloudscape.design/llms.txt`), shadcn blocks (`https://ui.shadcn.com/blocks`).
2. Reuse: MCP `search_patterns` with the intent (en and pt-BR), `get_pattern` on the closest hits,
   `catalog.json#patternAliases`. For each region of the screen, `suggest_component`.
3. Exit condition: no block does the job. If one nearly does, the run adds a **variant** to it
   instead (same steps, the existing folder). If a region needs a component that does not exist,
   stop and open a **New component** issue; the block waits for it (`/webkit-new` first).

## Step 3 — Block brief (draft)

Write the brief to the run log: the draft `block.json` (no files in `blocks/` yet), one line per
region naming the components that render it, the variant list from the issue's states, and the
sample content. Every component named exists in `packages/webkit/package.json#exports` (check it
with the MCP `get_component`, never from memory).

## Step 4 — Brief review by a second agent

Spawn `spec-reviewer` in **block mode** (`.claude/agents/spec-reviewer.md`, "Block mode") with the
brief, the issue and the research notes. Same loop as `/webkit-new` step 4: `return` → revise →
fresh reviewer, three returns stop the run. Exit condition: `approve`.

## Step 5 — Build

1. Write `block.json`, `<name>.vue` and `variants/<state>.vue` in the folder above. Each SFC
   imports only `@aziontech/webkit/*` subpaths and `@aziontech/icons`, follows
   `.claude/skills/ui-craft` "Start here", and stands alone (copy one file and it runs).
2. `pnpm --filter @aziontech/webkit catalog:build` and
   `node apps/storybook/scripts/gen-block-stories.mjs` (commit `catalog.json` and the generated
   stories).
3. Exit condition: `node packages/webkit/scripts/check-naming.mjs` and
   `node packages/webkit/scripts/check-patterns.mjs` pass.

## Step 6 — Machine gates

The `/webkit-new` step-6 commands, with the browser run narrowed to the copyable SFCs:
`cd packages/webkit && pnpm exec vitest run copyable-sfcs`. Exit condition: all exit 0.

## Step 7 — `ui-craft` review (mandatory)

`/ui-craft <file>` on the primary SFC and on every variant. Fix or list each finding; no open
blocker.

## Step 8 — Usage check

`pnpm --filter @aziontech/webkit run usage-check -- <category-path>/<name> "<prompt>" --report usage-report.md`
(for example `platform/settings/api-tokens`), or the `usage-check.yml` workflow. The prompt asks for
the screen by its job, never by the block id. Pass: the generated `src/**/*.vue` imports at least
80 % of the components the block's primary SFC imports (the session copied it through
`get_pattern`) and `webkit doctor` passes.

## Step 9 — Pull request

As `/webkit-new` step 9, with the block folder in place of the spec path and screenshots of every
variant (light, dark, RTL, mobile 320 px, wide 1920 px).

## Acknowledge before doing anything

Start your turn with one sentence: the issue you are reading and the block it asks for. Then run
Step 1.
