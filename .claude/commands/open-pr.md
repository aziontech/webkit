---
description: Open a PR to `main`. Analyzes the diff to pick the Conventional Commit type/scope (drives the semantic-release bump), prompts for the related issue (optional), commits by context, pushes, and opens the PR.
argument-hint: [PR title or focus]
---

You are running `/open-pr`. Land the current working changes as a pull request against `main`, following the repo's commit + versioning conventions end to end.

**User input:** $ARGUMENTS

## Source of truth

- Commit format and type→bump: [`CONTRIBUTING.md`](../../CONTRIBUTING.md) § Commit convention and [`commitlint.config.js`](../../commitlint.config.js).
- Release rules: `packages/<pkg>/.releaserc` (semantic-release; merges to `main` cut the version).

## Steps

### 0. Preflight
- Run `git fetch origin --prune` and `git status`. If there is nothing to commit and nothing unpushed → tell the user there is nothing to open a PR for, and stop.

### 1. Analyze the diff (drives the version bump)
Run `git diff` (staged + unstaged) and determine, from the change itself:
- **type** → `feat` (new component / prop / event / slot / public export), `fix` / `hotfix` (bug, a11y, visual regression), `refactor`, `perf`, `docs`, `style`, `chore`, `test`, `ci`, `revert`. This sets the bump: `feat`→minor; `fix`/`hotfix`/`chore`/`docs`/`style`/`refactor`/`perf`→patch; `test`/`ci`/`revert`→no release.
- **scope** → the package without its namespace (`webkit`, `theme`, `icons`), inferred from the changed paths.
- **breaking?** → a removed or renamed public prop, event, slot, or export ⇒ major. Mark it with `!` and a `BREAKING CHANGE:` footer. **Confirm with the user before marking a change breaking.**

If the diff spans multiple packages, prefer **one commit per scope** (CONTRIBUTING: "one package per commit when possible").

### 2. Related issue (optional)
- Ask: "Which issue does this relate to? (`ENG-1234`, or leave blank for `NO-ISSUE`)". Blank → use `[NO-ISSUE]`.

### 3. Ensure a `main`-based feature branch
- If on `main` (or not on a `main`-based feature branch), run the `/create-branch` flow (type from step 1, issue from step 2), carrying the working changes over.
- **Never** open a PR directly from `main`.

### 4. Commit by context
- **Split shared docs/rules from code.** If the diff mixes code with shared docs/rules/templates (`.claude/rules/*`, `.claude/skills/*`, `.specs/_template.md`, …), tell the user those belong in a **separate PR** and offer to split them out. A component's own new `.specs/<name>.md` stays with the component.
- Header (commitlint-valid, ≤100 chars): `[<ISSUE|NO-ISSUE>] <type>(<scope>): <subject>`
  - Breaking: `[…] <type>(<scope>)!: <subject>` plus a `BREAKING CHANGE: <what + migration>` footer.
- **Never** add a `Co-Authored-By` trailer or any "Generated with Claude" / attribution footer.
- Let the hooks run — `commit-msg` runs commitlint and the header must pass. **Do not** use `--no-verify` to skip commitlint. If `pre-commit` (lint-staged) fails for an environmental reason, report it and ask the user before retrying.

### 5. Show the plan and confirm
- Show the planned commit header(s), the implied version bump (minor/patch/major/none), and the target base (`main`). Confirm with the user before pushing.

### 6. Push and open the PR
- `git push -u origin <branch>`.
- If a PR already exists for the branch, update it; otherwise `gh pr create --base main --head <branch>`.
- **Title:** the conventional commit header (or `$ARGUMENTS`). **Body:** `## Summary` (what + why) and `## Notes`; call out any new dependency and any breaking change; reference the issue. No Figma links, no attribution footer.
- Report the PR URL.

## Rules

- The base branch is always `main`.
- Commit and push only as part of this command (running it is the authorization). Do not commit unrelated changes.
- Keep imports/exports in the public flat form per [`.claude/rules/imports.md`](../rules/imports.md) when the diff touches `package.json#exports` or stories.
