# AGENTS.md

Guidelines for contributors and coding agents working in the Azion Webkit monorepo.

## 1) Monorepo context

This repository is a `pnpm` workspace with two top-level domains:

- `apps/*`: runnable applications (for documentation and tooling)
- `packages/*`: publishable/shared libraries used by Azion products

Current main workspaces:

- `apps/storybook`: visual documentation and component development environment
- `apps/icons-gallery`: icon browsing/validation app
- `packages/webkit`: reusable Vue component library (`@aziontech/webkit`)
- `packages/theme`: tokens, theme, and styling foundations (`@aziontech/theme`)
- `packages/icons`: icon font pipeline and package (`@aziontech/icons`)

## 2) Core principles

1. Preserve consistency with existing patterns before introducing new ones.
2. Make the smallest safe change that solves the problem.
3. Keep docs and stories updated when behavior or API changes.
4. Prefer semantic design tokens over hardcoded visual values.
5. Keep workspace commands reproducible from repository root.

## 3) Environment and tooling

- Node.js: `>= 22.18.0`
- Package manager: `pnpm` (workspace-first)
- Install dependencies from root only:

```bash
pnpm install
```

Prefer root scripts when available:

```bash
pnpm storybook:dev
pnpm storybook:build
pnpm storybook:preview
pnpm icons:build
pnpm webkit:build:dts
```

## 4) Where to change what

- Webkit components: `packages/webkit/src/**`
- Theme tokens/styles: `packages/theme/**`
- Icons and generation pipeline: `packages/icons/**`
- Storybook stories/docs: `apps/storybook/src/stories/**`

When changing UI components in `packages/webkit`, update or add stories in Storybook in the same branch.

## 5) Component and styling standards

For `@aziontech/webkit` and Storybook content:

- Reuse established component patterns and naming conventions.
- Keep props semantic and explicit (avoid cryptic booleans when possible).
- Maintain backward-compatible defaults unless a breaking change is intentional.
- Use `@aziontech/theme` tokens/classes for colors, text, and surfaces.
- Avoid hardcoded hex colors in components when semantic tokens exist.
- Keep accessibility in mind (labels, states, disabled/readability, keyboard behavior).

## 6) Storybook standards

- Storybook is the source of truth for component behavior.
- Add clear examples for new states/props.
- Prefer docs-first pages for onboarding and conceptual guidance.
- Keep story titles and grouping consistent with existing sidebar taxonomy.
- For foundations docs, keep content practical and copy-paste friendly.

## 7) Git workflow and commits

- Create focused branches by context (examples: `feat/...`, `fix/...`, `docs/...`).
- Use conventional commit messages when possible:
  - `feat(...)`: new feature/enhancement
  - `fix(...)`: bug fix
  - `docs(...)`: documentation changes
  - `chore(...)`: maintenance
- Keep commits scoped and coherent (one context per commit).
- Never rewrite unrelated changes in a dirty working tree.

## 8) Validation checklist before push

Run the minimum relevant validations for the scope of your change.

- Storybook/docs change:
  - `pnpm storybook:build`
- Icons change:
  - `pnpm icons:build`
- Webkit typings/API surface change:
  - `pnpm webkit:build:dts`

If a full validation is too expensive, run targeted checks and document what was/was not validated.

## 9) Documentation expectations

When behavior changes, update docs close to the code:

- Root overview: `README.md`
- Storybook app docs: `apps/storybook/README.md`
- Package-level docs in each `packages/*/README.md`

For onboarding content, prioritize Storybook docs pages under `Foundations`.

## 10) Safety rules

- Do not commit secrets, credentials, or environment-specific private data.
- Do not perform destructive git operations without explicit approval.
- Avoid broad refactors during targeted fixes unless required for correctness.

---

If in doubt, follow existing code style in the touched files, keep the change minimal, and leave the repository in a buildable and documented state.
