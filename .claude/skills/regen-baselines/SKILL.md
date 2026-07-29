---
name: regen-baselines
description: Regenerate the Linux visual-regression baselines for a branch/PR via the CI workflow, download the artifact, mirror it into the snapshots folder, and commit it to the branch. Baselines are CI-only — never generated locally.
status: active
last_updated: 2026-07-29
scope: webkit
enforced_by: [git-workflow, release-types, review]
---

# Skill: regen-baselines

## Purpose

Refresh the visual-regression baselines that the `governance.yml` visual job (`test:visual:ci`)
compares every PR against. Baselines live in
`apps/storybook/.storybook/test-visual/__image_snapshots__/linux/` and are **platform-specific**:
only snapshots rendered on the CI runner (ubuntu) are valid. A local run on macOS renders with
different font metrics/AA and would poison the folder — regeneration therefore always happens in
CI via the `Storybook Regenerate Baseline` workflow
([`app-storybook-generate-baseline.yml`](../../../.github/workflows/app-storybook-generate-baseline.yml)),
and the resulting artifact is committed manually. This skill is that end-to-end flow.

## When to invoke

- A PR branch merged `main` and `main` brought rendering changes (theme tokens, typography), so
  the branch's committed baselines no longer match what its tree renders.
- The branch itself changes rendering on purpose (component fix, token change) and the PR's
  visual job fails with **expected** diffs.
- A story was added/renamed/removed and its snapshots must be (re)created or pruned.

## Inputs

- **Branch or PR** — a branch name, or a PR number/URL to resolve via
  `gh pr view <n> --json headRefName`.
- **Modes (optional)** — comma-separated subset of the 6-mode matrix
  (`{dark,light} × {desktop,tablet,mobile}`, keys in `apps/storybook/.storybook/visual-modes.js`,
  e.g. `light-desktop,dark-mobile`). Empty = full matrix. The mode key is the snapshot filename
  suffix; the historical **dark-desktop** snapshot carries **no** suffix
  (`<story>.png`, not `<story>--dark-desktop.png`).

## Workflow

1. **Resolve + preflight.** Resolve the branch (from the PR when given) and confirm it exists on
   origin (`git ls-remote --heads origin <branch>`). The workflow runs the branch **HEAD on
   origin** — anything that must be reflected (e.g. the `main` merge) has to be pushed first.
2. **Trigger the workflow.**
   ```sh
   gh workflow run app-storybook-generate-baseline.yml --ref <branch> -f update_baselines=true [-f modes=<csv>]
   ```
   `update_baselines=true` is **mandatory** — without it the run only builds Storybook and
   uploads nothing. Then grab the run:
   ```sh
   gh run list --workflow=app-storybook-generate-baseline.yml --branch <branch> --limit 1 --json databaseId,status,url,headSha
   ```
3. **Wait for completion.** ~5 min with warm caches (60 min workflow timeout). Poll
   `gh run view <id> --json status,conclusion` every ~30 s until `status == "completed"`.
   Shell gotcha: **never name the poll variable `status`** — it is a read-only special variable
   in zsh and the loop dies with `read-only variable: status`. Re-triggering on the same ref
   cancels the in-progress run (concurrency group), so do not double-fire.
4. **Download the artifact** (retention: 7 days) into a **fresh** temp dir:
   ```sh
   gh run download <id> -n visual-baselines-linux -D <fresh-tmp-dir>
   ```
5. **Checkout the branch and mirror.** `git fetch origin <branch> && git checkout <branch>`
   (snapshots folder must be clean), then:
   ```sh
   rsync -a --delete <fresh-tmp-dir>/ apps/storybook/.storybook/test-visual/__image_snapshots__/linux/
   ```
   The artifact is the **complete folder state** after the CI run, so `--delete` correctly
   propagates snapshots of deleted/renamed stories. Never cherry-pick files out of it.
6. **Review the diff scope before committing.** Group the changed files by story and check byte
   deltas:
   ```sh
   git status --porcelain apps/storybook/.storybook/test-visual/__image_snapshots__/linux/ | awk '{print $1}' | sort | uniq -c
   git diff --stat apps/storybook/.storybook/test-visual/__image_snapshots__/linux/
   ```
   The changed stories must be explainable by the branch's diff (e.g. a calendar fix touching
   only `components-inputs-calendar--*`, or a `main` merge touching the component its theme fix
   affects). **Unexplained stories = stop and investigate** (flake or unintended global change)
   instead of committing.
7. **Commit only the snapshots folder, push.**
   ```sh
   git add apps/storybook/.storybook/test-visual/__image_snapshots__/linux/
   git commit -m "test(storybook): regenerate linux baselines <context>"
   git push origin <branch>
   ```
   `test` is commitlint-valid and non-releasing (see `release-types`). Context examples used on
   real branches: `… after main merge`, `… for the calendar field contract`. No attribution
   footers (see `git-workflow`). The push updates the open PR and re-runs its visual job.

## Outputs

- One commit on the branch containing only `__image_snapshots__/linux/` changes, pushed.
- A short report: run URL, files changed/added/deleted grouped by story, and why the scope
  matches the branch.

## Rules

- **Never generate baselines locally.** `test:visual:update` exists for the CI job; a macOS run
  writes snapshots that do not match the `linux/` folder the PR gate compares against.
- **Never mix** unrelated working-tree files into the baseline commit.
- **Never commit a diff you cannot explain** from the branch's changes.
- Regenerate **after** merging `main`, not before — the artifact must reflect the merged tree.
- Shared-docs changes (like this skill) ride a separate PR; baseline commits belong to the
  component/theme branch they fix.

## Conflict recovery (PR shows CONFLICTING on the snapshots)

When `main` and the branch both regenerated the **same** snapshot files (two theme/component
PRs in flight), the PNGs conflict as binaries — git cannot content-merge them, and **neither
side is correct** for the merged tree. The fresh CI regen is the resolution:

1. Finish the merge/rebase first. A conflicted PNG can be resolved with **either side**
   (it is about to be overwritten); a rebase stopped on a **baseline-only** commit whose
   content is now stale can simply drop it with `git rebase --skip`.
2. Push (force-with-lease after a rebase) so origin has the merged/rebased tree.
3. Run this skill's workflow — the fresh artifact, mirrored with `--delete`, replaces
   whatever side was picked during resolution with baselines generated on the real tree.

## Fallbacks

- `gh workflow run --ref <branch>` fails with 404 → the workflow file does not exist on that
  branch; merge `main` into it first.
- Run failed → download the `visual-diff-output` artifact (the `__diff_output__` folder) to see
  which stories diverged, fix, re-trigger.
- Artifact expired (> 7 days) → re-run the workflow.
- `gh run download` refuses/merges into a non-empty dir → always use a fresh temp dir per run.

## Definition of Done

- [ ] Workflow run concluded `success` on the intended branch HEAD.
- [ ] Local folder mirrors the artifact exactly (rsync `--delete`).
- [ ] Diff reviewed: every changed story is explained by the branch's scope.
- [ ] Single `test(storybook): …` commit containing only the `linux/` folder, pushed to origin.
