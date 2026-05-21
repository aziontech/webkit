---
description: Create a new webkit-layer component following the project's standard (Design.md tokens, COMPONENT_REQUIREMENTS, TypeScript, BEM data-testid, full Storybook story).
argument-hint: <name> [--category <category>] [--structure monolithic|composition] [--figma <url>]
---

You are creating a new component for `packages/webkit/src/components/webkit/`. Follow the `component-create` skill exactly.

**User input:** $ARGUMENTS

## What to do

1. **Read the skill end-to-end before doing anything else:**
   - [`skills/component-create.md`](skills/component-create.md) — full workflow, rules, guardrails, DoD.

2. **Read the sources of truth referenced by the skill:**
   - [`packages/webkit/docs/Design.md`](packages/webkit/docs/Design.md) — typography (generated classes like `text-heading-md`, `text-body-sm`, `text-button-lg`), spacing, max-width, shape, semantic colors. **Design.md wins** any visual conflict.
   - [`packages/webkit/docs/COMPONENT_REQUIREMENTS.md`](packages/webkit/docs/COMPONENT_REQUIREMENTS.md) § "Webkit Layer Pattern (in-depth)" — TS pattern, JSDoc, naming, controlled/uncontrolled, slots, Composition Pattern criteria, `data-testid` BEM, ARIA, light/dark, Storybook.
   - Canonical components to mirror: [`actions/button/button.vue`](packages/webkit/src/components/webkit/actions/button/button.vue), [`actions/icon-button/icon-button.vue`](packages/webkit/src/components/webkit/actions/icon-button/icon-button.vue), [`content/card-pricing/card-pricing.vue`](packages/webkit/src/components/webkit/content/card-pricing/card-pricing.vue).
   - [`packages/webkit/AGENTS.md`](packages/webkit/AGENTS.md) for the package-level rules.

3. **Parse the user input** (`$ARGUMENTS`). Identify:
   - `<name>` (kebab-case) — **required**.
   - `--category <category>` — optional. Valid values: `actions`, `content`, `data`, `feedback`, `inputs`, `layout`, `navigation`, `overlay`, `utils`. **If omitted**, infer the best fit from the component name and the Figma context using the taxonomy in `skills/component-create.md` § "Inputs". Then **state the inferred category and ask the user to confirm** before writing any file.
   - `--structure monolithic|composition` — optional. Default `monolithic` unless the request needs sub-components per shadcn-vue criterion.
   - `--figma <url>` — optional but strongly preferred.

   If `<name>` is missing, ask for it. Never invent a name. Never create files before the category is confirmed.

4. **Execute the skill workflow** (steps 1–14 in `skills/component-create.md`):
   - Figma token discovery via MCP (`/figma-use` first, then `mcp__plugin_figma_figma__get_variable_defs` + `get_design_context`).
   - Map tokens to Design.md classes / `var(--*)`. Register theme gaps as `TODO: tokenizar`.
   - Sweep `packages/webkit/src/composables/` and `packages/webkit/src/components/webkit/utils/` for reusable utilities to avoid duplication.
   - Decide monolithic vs Composition Pattern using the shadcn-vue rule: "does the consumer need to swap order or omit parts?". When in doubt, go monolithic.
   - Create files: `<name>.vue` (TypeScript with JSDoc on every public prop), `package.json` (main/module/types/browser./sfc/sideEffects), entry in `packages/webkit/package.json#exports`, story under `apps/storybook/src/stories/webkit/<category>/<Name>.stories.js`.
   - Apply naming conventions strictly (`kind`, `size`, boolean props without `is`/`has`, events kebab-case, `defineModel` for v-model).
   - Apply the **available shadcn-vue patterns**: `data-state`/`data-disabled`/`data-orientation`, `VariantProps` named exports, `cn` helper from `@aziontech/webkit/utils/cn` (when consumer classes may override defaults), `<name>.figma.ts` Code Connect (config at `packages/webkit/figma.config.json`; publishing needs `FIGMA_ACCESS_TOKEN`), and Storybook `play` functions via `@storybook/test`. **Pending: `asChild`** — depends on a Slot helper not yet in the repo. Do not import phantom paths; the `validate-references.mjs` hook blocks them.
   - Validate: `pnpm webkit:lint && pnpm webkit:type-check && pnpm webkit:type-coverage && pnpm webkit:build:dts && pnpm storybook:build`.

5. **Deliver the final report** with: list of files created, tokens mapped (Figma → Design.md class / `var(--*)`), theme gaps, extracted utilities, command results, accessibility checklist, usability checklist.

## Hard rules (the hooks will enforce these — see `.claude/hooks/`)

- **No hallucination.** Only reference paths/packages/exports that exist. The `validate-references.mjs` hook will block any `Write`/`Edit` that introduces an unresolved import. If a dependency is missing, install it (`pnpm --filter <ws> add ...`), create the file first, or record the gap and skip the dependent code.
- **No HEX, no Tailwind palette, no raw typography, no `class` in `defineProps`, no `any`, no `@ts-ignore`** inside `packages/webkit/src/components/webkit/**`. The `validate-tokens.mjs` hook will block violations.
- **No webkit-layer `.vue` without going through this command/skill.** The `enforce-component-create.mjs` hook blocks the first `Write` if the skill has not been referenced in the session.

Start by acknowledging which component you will create, then read the skill, then collect any missing inputs from the user before writing files.
