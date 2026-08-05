# Rule: git workflow — branches and PRs always via `/create-branch` and `/open-pr`

When the user asks to **create a branch** or **open/make a PR** — in any phrasing, slash command, or natural language ("open a PR", "send it to a PR", "create a branch for this") — follow the canonical flows. **Do not improvise** the git/PR steps.

| User intent | Flow to follow |
|---|---|
| Create a new branch | [`/create-branch`](../commands/create-branch.md) |
| Commit + push + open PR | [`/open-pr`](../commands/open-pr.md) |

These commands are the **source of truth** for the process. This rule exists only to ensure they are triggered even when the user does not type the slash explicitly.

## Conventions (already embedded in the flows — repeated here because they are non-negotiable)

- **Always base on `main`.** The branch comes off `origin/main`, the PR targets `main`.
- **Branch name:** kebab-case `<type>/<ISSUE>-<slug>` (or `<type>/<slug>` without an issue). `type` comes from the same Conventional Commits enum ([`CONTRIBUTING.md`](../../CONTRIBUTING.md) § Commit convention / [`commitlint.config.js`](../../commitlint.config.js)). That enum must match the release-please mapping (only `feat`/`fix`/breaking release) — see [`release-types.md`](./release-types.md).
- **Commit:** Conventional Commits, commitlint-valid header. **Never** add `Co-Authored-By` or an attribution footer ("Generated with Claude"). **Never** `--no-verify` to skip commitlint.
- **Every commit is signed** and lands **verified** — see [Signed commits](#signed-commits) below.
- **Commit/push only as part of `/open-pr`** — running the command is the authorization. Do not commit unrelated changes.
- **Shared docs/rules in a separate PR from code.** If the diff mixes code with `.claude/rules/*`, `.claude/skills/*`, `.specs/_template.md`, etc., split them into another PR. A component's own `.specs/<name>.md` stays with the component.

## Signed commits

Every commit that reaches `main` carries a **verified signature**. This is enforced server-side by the `main` ruleset (`Protected branchs` → `required_signatures`), which is why an unsigned commit surfaces as an unmergeable PR with **every check green and no failing gate to point at** — the only symptom is a blocked merge state.

A signature is part of the commit object, and signing is configured per machine. So:

- **Closing and reopening the PR does not help**, and neither does opening a new PR from the same commits, or re-pushing them under a different author. The commit has to be rewritten (`--amend` / `rebase --exec`, then `--force-with-lease`).
- **Fixing one PR does not fix the next one.** Each contributor configures signing once on each machine they commit from.
- **Commits GitHub itself creates are already signed** with its own key (web-UI edits, the **Update branch** button, the squash commit on merge), so only locally-authored commits need the setup.
- **Rewriting to sign dismisses existing approvals** (`dismiss_stale_reviews_on_push`) — expect to request review again.

Setup and recovery steps: [`CONTRIBUTING.md`](../../CONTRIBUTING.md) § Signed commits.

## What not to do

- Don't run `git checkout -b`, `git commit`, `git push`, or `gh pr create` "by hand" outside these flows when the request is to create a branch / open a PR.
- Don't open a PR directly from `main` — feature branches are still required.
- Don't mark a change as breaking without confirming with the user first.
- Don't try to work around an unsigned commit by reopening the PR, re-authoring it, or merging via the web UI as the PR author — sign the commit instead.
- Don't reach for `--no-verify` when a signature is missing; it skips commitlint and produces no signature.
