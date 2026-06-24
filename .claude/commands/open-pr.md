---
description: Open a PR against `dev` — branch from `dev` if needed (prompting for the issue), commit the working changes by context, push, and open the PR.
argument-hint: [PR title or focus]
---

You are running `/open-pr`. Land the current working changes as a pull request against `dev`, following our conventions end to end: ensure a `dev`-based branch, commit by context, push, and open the PR.

**User input:** $ARGUMENTS

## Steps

### 0. Preflight
- Run `git fetch origin --prune`.
- Run `git status`. If there is nothing to commit and nothing unpushed, tell the user there is nothing to open a PR for, and stop.

### 1. Ensure a proper branch (off `dev`)
- If the current branch is `dev` or `main` (or it is not a `dev`-based feature branch), run the **`/create-branch`** flow first: ask for the **related issue (required)** and a short slug, then `git checkout -b <type>/<ISSUE>-<slug> origin/dev`, carrying the working changes over.
- If already on a `dev`-based feature branch, keep it.
- **Never** open a PR directly from `main` or `dev`.

### 2. Commit by context
- Review the diff and group changes into logical commits — prefer one focused commit unless the diff spans clearly separate concerns.
- **Split shared docs/rules from code.** If the diff mixes code with shared docs/rules/templates (`.claude/rules/*`, `.claude/skills/*`, `.specs/_template.md`, `eslint`/config not required by the change, …), tell the user those belong in a **separate PR** and offer to split them out. A component's own new `.specs/<name>.md` stays with the component.
- Write a Conventional Commits message: `<type>(<scope>): <summary>`.
- **Never** add a `Co-Authored-By` trailer or any "Generated with Claude" / attribution footer — in the commit or the PR body.
- Try a normal commit first. If a git hook fails for an environmental reason (e.g. `lint-staged` unavailable in this checkout), report it and only then retry with `--no-verify`.

### 3. Push
- `git push -u origin <branch>`.

### 4. Open the PR
- `gh pr create --base dev --head <branch>` with:
  - **Title:** from `$ARGUMENTS`; otherwise the main commit summary.
  - **Body:** `## Summary` (bullets — what changed and why) and `## Notes` (anything reviewers should know). No Figma links. No attribution footer.
- Report the PR URL back to the user.

## Rules

- The base branch is always `dev`.
- Commit and push only as part of this command (running it is the explicit authorization). Do not commit unrelated changes.
- If the change introduces a new external dependency or edits shared rules, call it out explicitly in the PR body.
- Keep imports/exports in the public flat form per [`.claude/rules/imports.md`](../rules/imports.md) when the diff touches `package.json#exports` or stories.
