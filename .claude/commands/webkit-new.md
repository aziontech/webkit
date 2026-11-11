---
description: AI-only flow for a new WebKit component, from a "New component" issue to a PR. Research → draft spec → second-agent spec review → build → machine gates → ui-craft review → usage check → PR. Stops on the first failure.
argument-hint: <issue number or URL>
---

You are the orchestrator of `/webkit-new`. You turn one **New component** issue
(`.github/ISSUE_TEMPLATE/new-component.yml`) into one pull request, with no human edit in
between. You run the nine steps below **in order**. Each step has an exit condition; when it is
not met you **stop**, print `STOPPED at step <n>: <reason>` with the failing output, comment the
same on the issue (`gh issue comment`), and do nothing else.

**User input:** $ARGUMENTS

## Ground rules

- One component per run. Nothing under `packages/webkit/src/components/` is written before step 4
  approves the spec (`enforce-spec-exists` blocks it anyway).
- Every phase that writes runs in an isolated sub-agent with the universal envelope
  (`.claude/agents/_README.md`). The spec is the contract: no prop, event, slot or import beyond it.
- Never weaken a gate to get through it: no `--update` on a baseline, no edited or skipped test,
  no raised budget, no `--no-verify`, no `eslint-disable`. A failing gate sends you back to the
  step that owns the defect (spec → 3, code → 5), at most twice; the third failure stops the run.
- Log one JSON line per step to `.claude/logs/<run-id>.jsonl` (gitignored).
- Changing an existing component runs the same flow from step 2 with the existing spec: bump
  `spec_version`, move it to `template: 2`, and add a codemod entry under
  `packages/webkit/src/cli/migrations/` for any breaking change.

## Step 1 — Read the request

1. `gh issue view <n> --json number,title,body,labels,url`. Parse the form fields: proposed
   name, intent, benchmark links, where it is used, surface, acceptance criteria, notes.
2. Exit condition: every required field is present and the name is kebab-case. Otherwise stop
   and ask, on the issue, for the missing field.
3. Create the branch with `/create-branch new component <name> #<n>`.

## Step 2 — Research and reuse

1. **Benchmarks.** Fetch each link. For Cloudscape use the Markdown page
   `https://cloudscape.design/components/<x>/index.html.md` (index: `https://cloudscape.design/llms.txt`);
   for shadcn use the docs page `https://ui.shadcn.com/docs/components/<x>` and its registry item
   (index: `https://ui.shadcn.com/llms.txt`). Extract anatomy, props, states, keyboard map,
   accessibility notes and the "when not to use" guidance. Benchmarks inform; they are never
   copied (`.claude/rules/migration.md`).
2. **Reuse.** Run the `reuse-auditor` sub-agent (`reuse-audit` skill); ask the webkit MCP
   `search_components` and `suggest_component` with the intent in plain words; look the name and
   its synonyms up in `packages/webkit/catalog.json#aliases`.
3. Write the notes (benchmark summary + reuse JSON) to the run log; they are the input of steps 3
   and 4.
4. Exit condition: no existing export or block does the job. If one does, stop and answer the
   issue with the export (or the prop that would extend it) instead of a new component.

## Step 3 — Spec (draft)

1. Run `/spec-create <name> --category <category>` in **Mode B**, with the issue and the research
   notes as the answers to every question (or Mode A when the issue links a Figma frame). The
   `spec-author` sub-agent copies `.specs/_template.md`, so the spec carries `template: 2` and
   must fill `## Internationalization`, `## Right-to-left`, `## Responsive` and `## Performance`.
2. Exit condition: `.specs/<name>.md` exists with `status: draft` and no `TBD`. An unanswerable
   section is `BLOCKED:` — stop and ask on the issue.

## Step 4 — Spec review by a second agent

1. Spawn the `spec-reviewer` sub-agent (`.claude/agents/spec-reviewer.md`) with the spec, the
   issue and the research notes — never with this conversation.
2. `return` → hand the findings to `spec-author`, which revises the draft; spawn a **fresh**
   reviewer. Three returns on the same spec stop the run.
3. `approve` → spawn `spec-validator` (`spec-validate` skill): schema, body, Constraints block,
   template-2 sections; it writes the checksum and flips `status: draft → approved`.
4. Exit condition: `status: approved`, checksum matches, and
   `pnpm --filter @aziontech/webkit run spec-template:check` passes.

## Step 5 — Build

1. `/component-create <name>`: scaffold (`component-scaffold`), examples, Code
   Connect when a frame exists, echo cross-check, `validate-component`. Its hooks run on every
   write.
2. Co-located test `<name>.test.ts` (Vitest browser; `.claude/rules/testing.md`): every state,
   the keyboard map, axe, and the `dir="rtl"` case.
3. Examples in `packages/webkit/examples/<name>/`: `examples.json` (`component`, `title`,
   `examples[]` with `name`, `summary`, `file`) and one copyable `.vue` per example, covering the
   states of the spec.
4. Budget: an entry in `packages/webkit/.size-limit.json` with the spec's `## Performance` budget.
5. Regenerate: `pnpm --filter @aziontech/webkit catalog:build`. The docs page
   (`/components/<name>`, `/example?path=<name>/<file>`) and the visual test of the first example follow
   from the files; its baseline comes from the `Visual baselines` workflow (`/regen-baselines`).
6. Exit condition: `/component-create` finished with `status: implemented` and the echo verdict
   is `parity`.

## Step 6 — Machine gates

Run, from the repository root, and keep the output for the PR:

```bash
pnpm --filter @aziontech/webkit run gates          # catalog, naming, marketing, patterns, cited names,
                                                    # spec status, spec template, authoring, doc standards,
                                                    # test gate, hook tests, toolkit tests → table
pnpm --filter @aziontech/webkit lint
pnpm --filter @aziontech/webkit lint:style
pnpm --filter @aziontech/webkit type-check
pnpm --filter @aziontech/webkit type-coverage
pnpm --filter @aziontech/webkit format:check
pnpm --filter @aziontech/webkit run size
cd packages/webkit && pnpm exec vitest run <name>.test copyable-sfcs   # filters by file path
```

Exit condition: every command exits 0. The same gates run in `.github/workflows/governance.yml`,
so a skipped one fails the PR anyway.

## Step 7 — `ui-craft` review (mandatory)

1. Run `/ui-craft <file>` (`.claude/skills/ui-craft/SKILL.md`) on the component, each example, and
   every block that imports it (`catalog.json#patterns[*].imports`). Output each child skill's
   findings under its own heading.
2. Fix every finding you can (back to step 5, then step 6). What stays open is listed with its
   reason.
3. Exit condition: no open finding of severity "blocker"; the report is saved for the PR.

## Step 8 — Usage check

1. Write an intent-only prompt from the issue's intent and "where it is used": the product task,
   never the component name or a synonym of it.
2. Run `pnpm --filter @aziontech/webkit run usage-check -- <name> "<prompt>" --report usage-report.md`
   when the `claude` CLI and an API key are available; otherwise the PR in step 9 opens as draft
   and you dispatch `gh workflow run usage-check.yml -f target=<name> -f prompt="<prompt>"` on the
   branch.
3. Exit condition: the report says `Usage check passed.` (the fresh session imported
   `@aziontech/webkit/<name>` through the MCP and `webkit doctor` passed). A failure means the
   catalog cannot steer an agent to the component: fix its `When to use`, intents or name (back to
   step 3 or 5), never the prompt.

## Step 9 — Pull request

1. Commit by context (Conventional Commits, `feat(webkit): <name>`), push, and open the PR with
   `/open-pr`, body generated from `.github/pull_request_template.md`:
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
