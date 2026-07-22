---
description: Create a new working branch from `main`. Infers the branch type from the diff and prompts for the related issue (optional).
argument-hint: [short description] [ENG-1234]
---

You are running `/create-branch`. Cut a fresh branch off the latest `main`, named from the change **type** + related **issue** + a short **slug**.

**User input:** $ARGUMENTS

## Source of truth

- Allowed types and the type→version-bump mapping: [`CONTRIBUTING.md`](../../CONTRIBUTING.md) § Commit convention and [`commitlint.config.js`](../../commitlint.config.js).

## Steps

1. **Sync.** Run `git fetch origin --prune`.
2. **Read the change (if any).** If the working tree already has changes, run `git status` and `git diff` and use them to infer the branch `type` and a slug. If the tree is clean, derive both from `$ARGUMENTS` (ask for a 2–4 word description if none was given).
3. **Type.** Pick from the same enum the repo's commit convention uses: `feat` (default — new component/prop/event/export), `fix`, `hotfix`, `chore`, `docs`, `style`, `refactor`, `perf`, `test`, `ci`, `revert`.
4. **Related issue (optional).** Ask: "Which issue does this relate to? (`ENG-1234`, or leave blank for `NO-ISSUE`)". A blank answer is fine — treat it as no issue. Do not block on it.
5. **Create.**
   - With an issue: `git checkout -b <type>/<ISSUE>-<slug> origin/main`
   - Without: `git checkout -b <type>/<slug> origin/main`

   If uncommitted changes would block the checkout, **stop** and tell the user to commit or stash first — never discard their work.
6. **Confirm.** Report the new branch name and that it is based on `origin/main`.

## Rules

- Always base on `origin/main`.
- Branch name: lowercase kebab-case — `<type>/<ISSUE>-<slug>` (or `<type>/<slug>` when there is no issue). Example: `feat/ENG-46315-toast`.
- Do not push or open a PR here — that is `/open-pr`'s job.
