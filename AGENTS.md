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

## 11) Webkit Layer Components (mandatory for agents)

**Scope:** any file under `packages/webkit/src/components/webkit/**` (categories `actions`, `content`, `data`, `feedback`, `inputs`, `layout`, `navigation`, `overlay`, `utils`).

**Before creating or modifying any component in this layer**, an agent MUST:

1. **Read the sources of truth:**
   - `packages/webkit/docs/Design.md` — typography (generated classes such as `text-heading-md`, `text-body-sm`, `text-button-lg`), spacing (`var(--spacing-*)`), max-width (`var(--container-*)`), shape (`var(--shape-*)`), semantic colors. In any visual conflict, **Design.md wins**.
   - `packages/webkit/docs/COMPONENT_REQUIREMENTS.md` § "Webkit Layer Pattern (in-depth)" — TypeScript pattern, JSDoc on props, naming conventions, controlled/uncontrolled states, typed slots, Composition Pattern criteria, `data-testid` BEM-style, class structure, ARIA, usability, light/dark, Code Connect, Storybook.
   - Canonical components: `packages/webkit/src/components/webkit/actions/button/button.vue`, `packages/webkit/src/components/webkit/actions/icon-button/icon-button.vue`, `packages/webkit/src/components/webkit/content/card-pricing/card-pricing.vue`.
   - External reference for Composition Pattern: [shadcn-vue.com/docs/components](https://www.shadcn-vue.com/docs/components).

2. **Invoke the skill `/component-create`** instead of authoring files manually. The skill at `skills/component-create.md` performs token discovery via MCP Figma, generates the `.vue` + `package.json` + `package.json#exports` entry + `<name>.figma.ts` Code Connect + Storybook story (with `argTypes`/`args`/`parameters`/`decorators`/`play` function), and validates the a11y/UX checklist.

3. **Hard rules (non-negotiable):**
   - New components use `<script setup lang="ts">` with `defineProps<...>()`, `defineEmits<...>()`, `defineSlots<...>()` and `defineModel<...>()` where applicable. JSDoc on every public prop. Zero `any`. Zero `// @ts-ignore`.
   - Variants are always exposed as `kind`. Sizes as `size` (`'small' | 'medium' | 'large'`). Boolean state props have no `is`/`has` prefix.
   - Typography is **always** applied via the generated class from Design.md (`text-heading-md`, `text-body-sm`, etc.). Never `text-[length:var(--text-*)]`, `leading-*`, `tracking-*`, or `font-family` directly.
   - Colors, spacing, max-width, and shape come from semantic `var(--*)` tokens. No hex, no Tailwind palette names (`bg-gray-*`), no PrimeVue color utilities (`text-color`, `surface-*`).
   - `defineOptions({ name, inheritAttrs: false })` + `useAttrs()` + `rootClasses` that merges `attrs.class`. Never declare `class` in `defineProps`.
   - `data-testid` hierarchical, BEM-style: root with fallback `'<category>-<name>'`, children with `${testId}__<part>` (two underscores).
   - Composition Pattern only when the consumer needs to swap the order or omit parts (Dialog, Card composto, Tabs, Accordion, DropdownMenu, Sheet/Drawer, Form). When in doubt, stay monolithic.
   - WCAG 2.1 AA: visible focus, full keyboard navigation, minimum ARIA, contrast >=4.5:1 / >=3:1, `motion-reduce:*` on animated components, touch target >=40x40px.
   - Light/dark validated via the `LightDark` Storybook story.
   - Each new public component (including each Composition Pattern sub-component) receives its own entry in `packages/webkit/package.json#exports` and its own Storybook story.

4. **Storybook story** uses Storybook features fully: `argTypes` (with `control`, `description`, `table.defaultValue`) for every prop and `{ action: '...' }` for every event, `args`, `parameters.actions`/`a11y`/`docs`/`backgrounds`/`layout`, `decorators` when needed; stories Default + per `kind` + per `size` + Disabled + Loading + WithSlots/WithComposition + Controlled + Uncontrolled + **LightDark** + Accessibility (with `play` function via `@storybook/test`) + Playground.

5. **Validation gate (must pass before reporting done):**

   ```bash
   pnpm webkit:lint
   pnpm webkit:type-check
   pnpm webkit:type-coverage
   pnpm webkit:build:dts
   pnpm storybook:build
   ```

6. **Forbidden shortcuts:**
   - Skipping the `/component-create` skill "because it is a small change".
   - Adding hex colors, raw typography classes, or Tailwind palette names "until the theme catches up". Register a theme gap with `TODO: tokenizar` instead.
   - Applying Composition Pattern reflexively. Use the decision rule: "does the consumer need to swap order or omit parts?"
   - Removing `focus-visible`, `aria-*`, `data-testid`, `disabled` HTML, or `<a>`/`<button>` polymorphism to simplify code.
   - Editing `packages/webkit/docs/Design.md`, `COMPONENT_REQUIREMENTS.md`, or `PRIMEVUE_ABSTRACTION.md` without explicit human approval (these are sources of truth).

For deeper, package-specific instructions agents should also read `packages/webkit/AGENTS.md` when working inside `packages/webkit/`.

---

If in doubt, follow existing code style in the touched files, keep the change minimal, and leave the repository in a buildable and documented state.
