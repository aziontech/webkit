---
description: AI-only flow for a new Azion UI component, from a "New component" issue to a PR. Research → draft spec → second-agent spec review → build → machine gates → ui-craft review → usage check → PR. Stops on the first failure.
argument-hint: <issue number or URL>
---

You are the orchestrator of `/component-new`. You turn one **New component** issue
(`.github/ISSUE_TEMPLATE/new-component.yml`) into one pull request, with no human edit in
between. You run the nine steps below **in order**. Each step has an exit condition; when it is
not met you **stop**, print `STOPPED at step <n>: <reason>` with the failing output, comment the
same on the issue (`gh issue comment`), and do nothing else.

**User input:** $ARGUMENTS

## Ground rules

- One component per run. Nothing under `packages/ui/src/components/` is written before step 4
  approves the spec (`enforce-spec-exists` blocks it anyway).
- Every phase that writes runs in an isolated sub-agent with the universal envelope
  (`contributing/agents/_README.md`). The spec is the contract: no prop, event, slot or import beyond it.
- Never weaken a gate to get through it: no `--update` on a baseline, no edited or skipped test,
  no raised budget, no `--no-verify`, no `eslint-disable`. A failing gate sends you back to the
  step that owns the defect (spec → 3, code → 5), at most twice; the third failure stops the run.
- Log one JSON line per step to `contributing/logs/<run-id>.jsonl` (gitignored).
- Changing an existing component runs the same flow from step 2 with the existing spec: bump
  `spec_version`, move it to `template: 2`, and add a codemod entry under
  `packages/ui/src/cli/migrations/` for any breaking change.

## Step 1 — Read the request

1. `gh issue view <n> --json number,title,body,labels,url`. Parse the form fields: proposed
   name, Figma URL (optional), intent, benchmark links, where it is used, surface, acceptance
   criteria, notes.
2. Exit condition: every required field is present and the name is kebab-case and follows
   `contributing/rules/naming.md` (modifier first, noun last: `icon-button`; a `docs/` piece starts
   with `doc-`; a page section ends in `-section`; § 25 for how the docs list shows it).
   Otherwise stop and ask, on the issue, for the missing field.
3. Create the branch with `/branch-create new component <name> #<n>`.

## Step 2 — Research and reuse

1. **Benchmarks.** Fetch each link. For Cloudscape use the Markdown page
   `https://cloudscape.design/components/<x>/index.html.md` (index: `https://cloudscape.design/llms.txt`);
   for shadcn use the docs page `https://ui.shadcn.com/docs/components/<x>` and its registry item
   (index: `https://ui.shadcn.com/llms.txt`). Extract anatomy, props, states, keyboard map,
   accessibility notes and the "when not to use" guidance. Benchmarks inform; they are never
   copied (`contributing/rules/migration.md`).
2. **Reuse.** Run the `reuse-auditor` sub-agent (`reuse-audit` skill); ask the Azion UI MCP
   `search_components` and `suggest_component` with the intent in plain words; look the name and
   its synonyms up in `packages/ui/catalog.json#aliases`. Read the closest exports against
   the planned API: `check:look-alikes` fails a new pair that scores 35 % or more and where neither
   imports the other (`contributing/docs/CODE_QUALITY.md` § 3.3), so a near-twin is a prop or a shared
   part, not a new component.
3. Write the notes (benchmark summary + reuse JSON) to the run log; they are the input of steps 3
   and 4.
4. Exit condition: no existing export or block does the job. If one does, stop and answer the
   issue with the export (or the prop that would extend it) instead of a new component.

## Step 3 — Spec (draft)

1. Run `/spec-create <name> --category <category>` in **Mode B**, with the issue and the research
   notes as the answers to every question (or Mode A, `--figma <url>`, when the issue's Figma URL
   field is filled). The `spec-creator` sub-agent copies `.specs/_template.md`, so the spec
   carries `template: 2` and must fill `## Internationalization`, `## Right-to-left`,
   `## Responsive` and `## Performance`.
2. Exit condition: `.specs/<name>.md` exists with `status: draft`, `stability: preview` and no `TBD`. An unanswerable
   section is `BLOCKED:` — stop and ask on the issue.

## Step 4 — Spec review by a second agent

1. Spawn the `spec-reviewer` sub-agent (`contributing/agents/spec-reviewer.md`) with the spec, the
   issue and the research notes — never with this conversation.
2. `return` → hand the findings to `spec-creator`, which revises the draft; spawn a **fresh**
   reviewer. Three returns on the same spec stop the run.
3. `approve` → spawn `spec-validator` (`spec-validate` skill): schema, body, Constraints block,
   template-2 sections; it writes the checksum and flips `status: draft → approved`.
4. Exit condition: `status: approved`, checksum matches, and
   `pnpm --filter @aziontech/ui run check:spec-template` passes.

## Step 5 — Build

1. `/component-create <name>`: scaffold (`component-scaffold`), examples, Code
   Connect when a frame exists, echo cross-check, `component-validate`. Its hooks run on every
   write. The code stays inside the `contributing/docs/CODE_QUALITY.md` § 3.1 limits (400-line `.vue`,
   200-line script, 60-line functions, 20 props and 5 models per root) and ships the § 3.5
   extension points; a native control or ARIA widget role it renders needs its owner entry in
   `packages/ui/src/eslint-plugin/owners.json` (`azion-ui/no-unowned-element`).
2. Exports: after the scaffold adds the flat `./<name>` entries, run
   `pnpm --filter @aziontech/ui build:exports` (the `exports` gate wants the typed
   `{ types, default }` shape and `typesVersions`).
3. Co-located test `<name>.test.ts` (Vitest browser; `contributing/rules/testing.md`): every state,
   the keyboard map, axe, and the `dir="rtl"` case.
4. Strings: every key of the spec's `## Internationalization` goes into the component's camelCase
   namespace in all three catalogs, `packages/ui/src/locales/en.ts`, `pt-BR.ts` and `es.ts`
   (`naming.md` § 13; `test/standards/i18n-catalogs.test.mjs` fails a missing key or placeholder).
5. Examples in `packages/ui/examples/<name>/`: `examples.json` (`component`, `title`
   `Components/<Category>/<Pascal>`, `examples[]` with `name`, `summary`, `file`) and one copyable
   `.vue` per example of the spec's `## Examples`, no fewer (`check:complete`). The first is
   `default.vue`; file names follow `naming.md` § 4; sample data follows
   `rules/azion-ui-example-data.md`; a floating overlay starts closed
   (`rules/azion-ui-overlays-closed-on-load.md`).
6. Budget: an entry in `packages/ui/.size-limit.json` with the spec's `## Performance` budget.
7. Regenerate: `pnpm --filter @aziontech/ui build:catalog` (it writes `catalog.json`,
   `catalog/` and `llms/`; commit all three). The docs page
   (`/components/<name>`, `/frame/example/<name>/<file>`) and the visual test of the first example follow
   from the files; its baseline comes from the `Visual baselines` workflow (`/baselines-regenerate`).
   `check:complete` fails until `apps/visual/baselines/examples/<name>/default--light-1280.png`
   is committed, so dispatch it as soon as the examples are final.
8. Exit condition: `/component-create` finished with `status: implemented` and the echo verdict
   is `parity`.

## Step 6 — Machine gates

Run, from the repository root, and keep the output for the PR:

```bash
pnpm --filter @aziontech/ui run gates          # every gate in scripts/run-gates.mjs (GATES) → table
pnpm --filter @aziontech/ui lint
pnpm --filter @aziontech/ui lint:style
pnpm --filter @aziontech/ui typecheck
pnpm --filter @aziontech/ui check:type-coverage
pnpm --filter @aziontech/ui check:format
pnpm --filter @aziontech/ui run check:size
pnpm --filter @aziontech/ui test:ssr
cd packages/ui && pnpm exec vitest run <name>.test copyable-sfcs   # filters by file path
```

Exit condition: every command exits 0. The same gates run in `.github/workflows/governance.yml`,
so a skipped one fails the PR anyway.

## Step 7 — `ui-craft` review (mandatory)

1. Run `/ui-craft <file>` (`contributing/skills/ui-craft/SKILL.md`) on the component, each example, and
   every block that imports it (`catalog.json#blocks[*].imports`). Output each child skill's
   findings under its own heading.
2. Fix every finding you can (back to step 5, then step 6). What stays open is listed with its
   reason.
3. Exit condition: no open finding of severity "blocker"; the report is saved for the PR.

## Step 8 — Usage check

1. Write an intent-only prompt from the issue's intent and "where it is used": the product task,
   never the component name or a synonym of it.
2. Run `pnpm --filter @aziontech/ui run check:usage -- <name> "<prompt>" --report usage-report.md`
   when the `claude` CLI and an API key are available; otherwise the PR in step 9 opens as draft
   and you dispatch `gh workflow run usage-check.yml -f target=<name> -f prompt="<prompt>"` on the
   branch.
3. Exit condition: the report says `Usage check passed.` (the fresh session imported
   `@aziontech/ui/<name>` through the MCP and `azion-ui doctor` passed). A failure means the
   catalog cannot steer an agent to the component: fix its `When to use`, intents or name (back to
   step 3 or 5), never the prompt.

## Step 9 — Pull request

1. Commit by context (Conventional Commits, `feat(ui): <name>`), push, and open the PR with
   `/pr-open`, body generated from `.github/pull_request_template.md`:
   - `Closes #<n>`, the spec path, the spec-reviewer checklist and verdict;
   - the gates table printed by `gates` and the results of the other step-6 commands;
   - the `ui-craft` report and the open findings;
   - the usage-check report;
   - the screenshot checklist (light, dark, RTL, mobile 320 px, wide 1920 px) with the images.
2. The PR stays draft until the usage check passes. The head of design reviews; a rejection goes
   back to step 3 or 5 with their comments, never to a human fix.

## Acknowledge before doing anything

Start your turn with one sentence: the issue you are reading and the component it asks for. Then
run Step 1.
