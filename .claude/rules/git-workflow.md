# Rule: git workflow — branches and PRs always via `/create-branch` and `/open-pr`

When the user asks to **create a branch** or **open/make a PR** — in any phrasing, slash command, or natural language ("open a PR", "send it to a PR", "create a branch for this") — follow the canonical flows. **Do not improvise** the git/PR steps.

| User intent | Flow to follow |
|---|---|
| Create a new branch | [`/create-branch`](../commands/create-branch.md) |
| Commit + push + open PR | [`/open-pr`](../commands/open-pr.md) |

These commands are the **source of truth** for the process. This rule exists only to ensure they are triggered even when the user does not type the slash explicitly.

## Conventions (already embedded in the flows — repeated here because they are non-negotiable)

- **Always base on `main`.** The branch comes off `origin/main`, the PR targets `main`.
- **Branch name:** kebab-case `<type>/<ISSUE>-<slug>` (or `<type>/<slug>` without an issue). `type` comes from the same Conventional Commits enum ([`CONTRIBUTING.md`](../../CONTRIBUTING.md) § Commit convention / [`commitlint.config.js`](../../commitlint.config.js)). That enum must match every `packages/*/.releaserc` — see [`release-types.md`](./release-types.md).
- **Commit:** Conventional Commits, commitlint-valid header. **Never** add `Co-Authored-By` or an attribution footer ("Generated with Claude"). **Never** `--no-verify` to skip commitlint.
- **Commit/push only as part of `/open-pr`** — running the command is the authorization. Do not commit unrelated changes.
- **Shared docs/rules in a separate PR from code.** If the diff mixes code with `.claude/rules/*`, `.claude/skills/*`, `.specs/_template.md`, etc., split them into another PR. A component's own `.specs/<name>.md` stays with the component.

## What not to do

- Don't run `git checkout -b`, `git commit`, `git push`, or `gh pr create` "by hand" outside these flows when the request is to create a branch / open a PR.
- Don't open a PR directly from `main` — feature branches are still required.
- Don't mark a change as breaking without confirming with the user first.
