---
name: regen-baselines
description: Regenerate the styled visual baselines (Playwright over the docs site's examples and blocks and over the demos) for a branch/PR via the CI workflow, download the artifact, mirror it into apps/visual/baselines, and commit it to the branch. Baselines come only from the Playwright container image.
status: active
last_updated: 2026-11-13
scope: webkit
enforced_by: [git-workflow, release-types, review]
---

# Skill: regen-baselines

## Purpose

Refresh the baselines that the `governance.yml` `visual` job compares every PR against. The
suite lives in `apps/visual` (Playwright, `pnpm visual:test`): it serves the built docs site
(`apps/docs/dist`) and demos (`apps/demos/dist`) and screenshots, with the real theme CSS, the
first example of every component (`/example?path=<dir>/<file>`), the primary state of every block
(`/frame/<state>/<id>`), every state of the AI blocks, every demo route, and the geometry checks
in `tests/geometry.spec.ts`. Baselines live in `apps/visual/baselines/` and are valid only when
rendered in `mcr.microsoft.com/playwright:v1.62.0-noble` (the CI job runs in that image), so a run
on a laptop outside the container would poison the folder. Regeneration happens in CI through the
`Visual baselines` workflow
([`visual-baselines.yml`](../../../.github/workflows/visual-baselines.yml)) and the artifact is
committed by hand. This skill is that end-to-end flow.

## When to invoke

- A PR branch merged `main` and `main` brought rendering changes (theme tokens, typography).
- The branch changes rendering on purpose and the PR's `visual` job fails with **expected** diffs.
- An example, block state or demo route was added, renamed or removed.

## Inputs

- **Branch or PR** — a branch name, or a PR number/URL (`gh pr view <n> --json headRefName`).
- **Grep (optional)** — a Playwright title pattern (`example table`, `block platform/ai`,
  `demo resources`, `geometry`) to regenerate only part of the suite. Empty = the whole suite.

## Workflow

1. **Resolve + preflight.** Confirm the branch exists on origin; the workflow runs its **HEAD**,
   so push the `main` merge first.
2. **Trigger** (`pnpm visual:update:baseline` does the same for the current branch):
   ```sh
   gh workflow run visual-baselines.yml --ref <branch> -f update_baselines=true [-f grep=<pattern>]
   gh run list --workflow=visual-baselines.yml --branch <branch> --limit 1 --json databaseId,status,url,headSha
   ```
3. **Wait** for `status == "completed"` (`gh run view <id> --json status,conclusion`). Never name
   the poll variable `status` (read-only in zsh). Re-triggering on the same ref cancels the run.
4. **Download** into a fresh directory: `gh run download <id> -n visual-baselines -D <dir>`.
   The run also uploads `visual-baseline-review`, a page with every changed file before and
   after (the job summary links it): `gh run download <id> -n visual-baseline-review -D <dir2>`,
   then open `<dir2>/index.html`.
5. **Mirror** on a clean checkout of the branch:
   `rsync -a --delete <dir>/ apps/visual/baselines/` (with a `grep`, copy without `--delete`).
6. **List the changed files** by name, grouped by status:
   ```sh
   git status --porcelain --untracked-files=all apps/visual/baselines | awk '
     $1 == "??" || $1 == "A" { print "added    " $2; next }
     $1 == "D"               { print "removed  " $2; next }
                             { print "modified " $2 }' | sort
   ```
7. **Review the scope**: look at each listed image on the review page. Every change must be
   explained by the branch; anything else is a flake or an unintended global change — stop and
   investigate.
8. **Commit only the baselines folder** and push:
   `git commit -m "test(visual): regenerate baselines <context>"`.
9. **Report** (format below).

Locally, the same container gives the same pixels:
`docker run --rm --ipc=host -v "$PWD":/w -w /w/apps/visual mcr.microsoft.com/playwright:v1.62.0-noble npx playwright test --update-snapshots=all`
after `pnpm docs:build && pnpm demos:build`. Use it to look at a change before dispatching; the
committed baselines still come from the workflow or from that exact image.

## Report

The final message names every changed snapshot, not only the counts:

```text
Baselines regenerated: run <url>, head <sha>, grep <pattern or "none">
Review page: visual-baseline-review artifact of that run
Commit: <sha> test(visual): regenerate baselines <context>

Added (2)
- apps/visual/baselines/examples/date-picker/default--light-1280.png
- apps/visual/baselines/examples/date-picker/default--dark-1280.png
Modified (1)
- apps/visual/baselines/blocks/platform/auth/login--dark-1280.png
Removed (0)

Why each change: <one line per group, tied to the branch's scope>
```

A list longer than 50 files per group is cut to 50 lines plus `and <n> more`; the full list is
`changes.json` in the review page artifact.

## Rules

- Never commit baselines rendered outside `mcr.microsoft.com/playwright:v1.62.0-noble`.
- Never mix unrelated files into the baseline commit, and never commit a diff you cannot explain.
- Regenerate **after** merging `main`.

## Fallbacks

- `gh workflow run` answers 404 → the workflow is not on that branch yet; merge `main` first.
- Run failed → download the `visual-report` artifact (Playwright HTML report with the diffs).
- Artifact expired (7 days) → run the workflow again.

## Definition of Done

- [ ] Workflow run concluded `success` on the intended branch HEAD.
- [ ] `apps/visual/baselines/` mirrors the artifact.
- [ ] Every changed image is explained by the branch's scope.
- [ ] The report lists each added, modified and removed snapshot by file name.
- [ ] One `test(visual): …` commit with only the baselines, pushed.
