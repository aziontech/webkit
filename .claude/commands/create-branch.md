---
description: Create a new working branch from `dev` (never `main`), prompting for the related issue.
argument-hint: [short description of the change]
---

You are running `/create-branch`. Create a fresh working branch off the latest `dev`, named from the related issue plus a short slug. **Never branch from `main`.**

**User input:** $ARGUMENTS

## Steps

1. **Sync.** Run `git fetch origin --prune`.
2. **Related issue (required).** Identify the issue key this work relates to (e.g. `ENG-12345`):
   - If the user passed it in `$ARGUMENTS`, use it.
   - Otherwise **ask**: "Which issue does this relate to? (e.g. `ENG-12345`)". Do **not** proceed without an answer. Only accept `no-issue` after the user explicitly confirms there is none.
3. **Slug.** Derive a short kebab-case slug (2–4 words) from `$ARGUMENTS`; if there is no description, ask for one. Strip the issue key out of the slug so it is not duplicated.
4. **Type.** Choose the branch type from the change intent: `feat` (default), `fix`, `chore`, or `docs`.
5. **Create.** Branch from the remote dev tip (not the local one):
   ```
   git checkout -b <type>/<ISSUE>-<slug> origin/dev
   ```
   If the working tree has uncommitted changes that would block the checkout, **stop** and tell the user to commit or stash first — never discard their work.
6. **Confirm.** Report the new branch name and that it is based on `origin/dev`.

## Rules

- Always base on `origin/dev`. If asked to branch from `main`, warn and use `dev` unless the user explicitly insists.
- Branch name pattern: `<type>/<ISSUE>-<slug>`, all lowercase, kebab-case. Example: `feat/ENG-46315-toast`.
- Do not push or open a PR here — that is `/open-pr`'s job.
