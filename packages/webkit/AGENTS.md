# AGENTS.md — `packages/webkit`

Package-specific guidance for contributors and coding agents. Complements the repository-wide [AGENTS.md](../../AGENTS.md) and is loaded automatically by agents working inside `packages/webkit/`.

## 1) Layers within this package

```
packages/webkit/src/
├── components/
│   ├── webkit/          <-- canonical webkit layer (this AGENTS.md focuses here)
│   │   ├── actions/     button, icon-button
│   │   ├── content/     card-pricing, currency, tag
│   │   ├── data/        (empty, ready to receive)
│   │   ├── feedback/    message, status-indicator
│   │   ├── inputs/      checkbox, dropdown, input-switch, input-text, radio-button
│   │   ├── layout/      (empty, ready to receive)
│   │   ├── navigation/  (empty, ready to receive)
│   │   ├── overlay/     (empty, ready to receive)
│   │   └── utils/       spinner
│   ├── buttons/         legacy convenience buttons (button-cancel, ...)
│   ├── azion-system-status, pricing-card, ...
├── core/
│   ├── form/            field-* (VeeValidate-based form fields)
│   ├── primevue/        thin PrimeVue wrappers (see PRIMEVUE_ABSTRACTION.md)
│   ├── card/, list-data-table/, selector-block/
├── composables/         use-toast, use-dialog
├── directives/          tooltip
├── services/            primevue-api, markdown
├── plugins/             WebkitPlugin
├── svg/, styles/, vite/
└── docs/
    ├── Design.md                    visual rules (typography, spacing, colors, shape, max-width)
    ├── COMPONENT_REQUIREMENTS.md    component structure + § Webkit Layer Pattern (in-depth)
    └── PRIMEVUE_ABSTRACTION.md      PrimeVue wrappers and consumer migration
```

This package-level guidance applies primarily to the `components/webkit/` tree. Other layers have their own established patterns (`core/form/*` uses VeeValidate; `core/primevue/*` are wrappers).

## 2) Sources of truth (read first)

Before touching `src/components/webkit/**`, the agent MUST read:

1. **[Design.md](./docs/Design.md)** — typography (always via generated classes such as `text-heading-md`, `text-body-sm`, `text-button-lg`), spacing (`var(--spacing-*)`), max-width (`var(--container-*)`), shape (`var(--shape-*)`), semantic colors. **Design.md wins** in any visual conflict.
2. **[COMPONENT_REQUIREMENTS.md](./docs/COMPONENT_REQUIREMENTS.md) § "Webkit Layer Pattern (in-depth)"** — TypeScript pattern, JSDoc on props, naming conventions, controlled/uncontrolled states, typed slots, Composition Pattern criteria, `data-testid` BEM-style, class structure, ARIA, usability, light/dark, Code Connect, Storybook.
3. **Canonical components** to mirror:
   - [actions/button/button.vue](./src/components/webkit/actions/button/button.vue) — atomic interactive (`kindClasses`/`sizeClasses`, polymorphism `<a>`/`<button>`, pseudo `before:` overlays).
   - [actions/icon-button/icon-button.vue](./src/components/webkit/actions/icon-button/icon-button.vue) — atomic variation.
   - [content/card-pricing/card-pricing.vue](./src/components/webkit/content/card-pricing/card-pricing.vue) — monolithic with props + default and named `actions` slot, `data-testid` BEM (`${testId}__header`/`__title`/`__actions`), typography via generated classes (`text-heading-md`/`text-body-sm`/`text-body-xs`).
4. **External reference for Composition Pattern decisions:** [shadcn-vue.com/docs/components](https://www.shadcn-vue.com/docs/components).

## 3) Mandatory entry point: skill `/component-create`

For any new component (or significant change to an existing one) in `src/components/webkit/**`, **invoke the skill `/component-create`** ([../../skills/component-create.md](../../skills/component-create.md)).

The skill automates:

- Token discovery via MCP `plugin:figma:figma` (`get_variable_defs`, `get_design_context`).
- Mapping Figma tokens to Design.md classes / `var(--*)` and registering theme gaps.
- Anti-duplication sweep across [composables/](./src/composables/), [utils/](./src/components/webkit/utils/), [packages/theme/src/](../theme/src/).
- Composition Pattern decision (monolithic vs composed) using the shadcn-vue criterion.
- File creation: `.vue` (TypeScript), `package.json` local, `package.json#exports` entry, `<name>.figma.ts` Code Connect, Storybook story with full Storybook features (`argTypes`/`args`/`parameters`/`decorators`/`play` function via `@storybook/test`).
- Validation gate.

Skipping the skill "because it is small" is not allowed. Two `PreToolUse` hooks (see § 8) physically block non-compliant Writes — invoking the skill is the path of least resistance.

### Auto-invoke (the agent must trigger without waiting)

The agent must trigger `component-create` automatically whenever any of the following is true — even if the user does not mention the skill:

- The user's request combines a creation verb (`criar`/`crie`/`gerar`/`adicionar`/`novo`/`create`/`add`/`make`/`build`) with a UI noun (`button`/`botao`/`dialog`/`modal`/`drawer`/`sheet`/`tooltip`/`tabs`/`accordion`/`card`/`tag`/`badge`/`chip`/`input`/`select`/`dropdown`/`checkbox`/`radio`/`switch`/`spinner`/`toast`/`alert`/`message`/`breadcrumb`/`menu`/`popover`/`avatar`/`progress`/`skeleton`/`divider`) or one of the categories (`actions`/`content`/`data`/`feedback`/`inputs`/`layout`/`navigation`/`overlay`/`utils`).
- The request contains a Figma URL (`figma.com/design/...`, `figma.com/proto/...`) or refers to a design/mockup/frame.
- The agent is about to `Write`/`Edit` any file under:
  - `packages/webkit/src/components/webkit/**/*.vue`
  - `packages/webkit/src/components/webkit/**/package.json`
  - new entries in `packages/webkit/package.json#exports` mapping `./<category>/<name>` to `src/components/webkit/`
  - new stories under `apps/storybook/src/stories/webkit/<category>/`

When a trigger fires, the agent must announce the detection and collect missing inputs (name, category, Figma URL, monolithic vs composition) before writing any file. Full trigger spec: [../../skills/component-create.md](../../skills/component-create.md) § "Trigger / Auto-invoke".

## 4) Hard rules (non-negotiable for new components)

- **No hallucination — only reference things that exist.** Before importing a module, calling a function, or writing a file path in code, **verify it exists**. For `@aziontech/webkit/<subpath>` check [`package.json#exports`](./package.json). For relative imports check the file on disk. For npm packages check `node_modules/`. If a dependency is missing, install it (`pnpm --filter webkit add ...`), create the file (with its `package.json`), or annotate the gap as `TODO: install/create <path>` and skip the dependent code. The `validate-references.mjs` hook (§ 8) blocks Writes with unresolved imports.
- `<script setup lang="ts">` placed **before** `<template>`.
- `defineOptions({ name: 'PascalCase', inheritAttrs: false })`.
- `defineProps<{...}>()` with **JSDoc on every public prop**. `defineEmits<{...}>()`. `defineSlots<{...}>()` when applicable. `defineModel<T>('propName')` for v-model.
- Zero `any`, zero `// @ts-ignore`.
- **Naming:** variants always `kind`; sizes always `size` (`'small' | 'medium' | 'large'`); boolean state props without `is`/`has` prefix; events kebab-case.
- **Tokens:**
  - Typography always via generated class from Design.md. Never `text-[length:var(--text-*)]`, `leading-*`, `tracking-*`, `font-family` raw.
  - Colors, spacing, max-width, shape via `var(--*)` semantic tokens.
  - No hex/rgb/hsl, no Tailwind palette (`bg-gray-*`), no PrimeVue color utilities (`text-color`, `surface-*`).
- `useAttrs()` + `rootClasses` that merges `attrs.class`. Never declare `class` in `defineProps`.
- `data-testid` hierarchical BEM: root with fallback `'<category>-<name>'`; children with `${testId}__<part>`.
- Composition Pattern only when the consumer needs to swap order or omit parts (Dialog, Card composto, Tabs, Accordion, DropdownMenu, Sheet/Drawer, Form). When in doubt, stay monolithic. When applying it, ship the **complete shadcn-vue anatomy** (Root + Trigger + Portal + Overlay + Content + Title + Description + Close for Dialog, etc.).
- **shadcn-vue patterns** (see [docs/COMPONENT_REQUIREMENTS.md](./docs/COMPONENT_REQUIREMENTS.md) § 2.5-2.9):
  - **Available today** (use immediately): `data-state`/`data-disabled`/`data-orientation` on root and stateful sub-components for `data-[state=open]:...` Tailwind variants. `VariantProps` exported as named exports (`export type DialogSize = ...`).
  - **Conditional — pending deps not yet installed** (see § 9; do NOT emulate before they land, the `validate-references.mjs` hook blocks fake imports): `asChild` (waits for a Slot helper added under `src/composables/`); `cn` helper (waits for `clsx` + `tailwind-merge`); `<name>.figma.ts` Code Connect (waits for `@figma/code-connect`); Storybook `play` functions (wait for `@storybook/test`).
- Reusable utilities (animations, classes, logic) live in [composables/](./src/composables/), [components/webkit/utils/](./src/components/webkit/utils/), or [packages/theme/src/](../theme/src/) — never inline.
- WCAG 2.1 AA: visible focus (`focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]`), full keyboard support, minimum ARIA, contrast >=4.5:1 / >=3:1 (verify disabled), `motion-reduce:*` on animated components, touch target >=40x40px.
- New public components and sub-components each receive an entry in `packages/webkit/package.json#exports`.
- Each component ships a Storybook story under `apps/storybook/src/stories/webkit/<category>/<Name>.stories.js` with full Storybook usage (`argTypes`, `args`, `parameters.actions`/`a11y`/`docs`/`backgrounds`/`layout`, `decorators`, stories Default + per `kind` + per `size` + Disabled + Loading + WithSlots/WithComposition + Controlled + Uncontrolled + **LightDark** + Accessibility with `play` function via `@storybook/test` + Playground).

## 5) Validation gate

Before reporting done, run from the repository root:

```bash
pnpm webkit:lint
pnpm webkit:type-check
pnpm webkit:type-coverage
pnpm webkit:build:dts
pnpm storybook:build
```

All must pass. Type coverage threshold is 95%.

## 6) Files agents must NOT edit without explicit human approval

- [docs/Design.md](./docs/Design.md)
- [docs/COMPONENT_REQUIREMENTS.md](./docs/COMPONENT_REQUIREMENTS.md)
- [docs/PRIMEVUE_ABSTRACTION.md](./docs/PRIMEVUE_ABSTRACTION.md)
- `package.json` outside of the `exports` block (structural changes only with approval)
- `.github/workflows/governance.yml` (CI config)

## 7) Layer rules outside `components/webkit/**`

- **`core/form/*`** — VeeValidate-based form fields. Follow the existing pattern documented in `COMPONENT_REQUIREMENTS.md` § 4 (Form Components). Do not migrate these to the webkit-layer pattern in the same change.
- **`core/primevue/*`** — thin PrimeVue wrappers. Read [PRIMEVUE_ABSTRACTION.md](./docs/PRIMEVUE_ABSTRACTION.md) before touching.
- **`composables/*`** — pure functions or Vue composables; document the API in TSDoc; export through a `package.json` per composable.
- **`directives/*`** — Vue directives re-exported (see [tooltip/](./src/directives/tooltip/)).

## 8) Active enforcement (hooks)

Three `PreToolUse` hooks in [`../../.claude/hooks/`](../../.claude/hooks/) run automatically on every `Write`/`Edit`/`MultiEdit`. They are configured in [`../../.claude/settings.json`](../../.claude/settings.json) and act as physical guard rails — the agent cannot bypass them with words.

- **[`validate-tokens.mjs`](../../.claude/hooks/validate-tokens.mjs)** — triggers on `Write`/`Edit`/`MultiEdit` of `.vue`/`.css`/`.scss`/`.ts` under the webkit layer. Blocks when the **new** content introduces hex/rgb/hsl colors, Tailwind palette names (`bg-gray-*`, `text-violet-*`), raw typography (`text-xs|sm|base|lg|...`, `text-[length:var(--text-*)]`, `leading-*`, `tracking-*`, `font-family`), PrimeVue color utilities (`text-color`, `surface-*`), `class` in `defineProps`, `any`, or `@ts-ignore`. Pre-existing violations in the baseline file are not retroactively flagged.
- **[`validate-references.mjs`](../../.claude/hooks/validate-references.mjs)** — triggers on `Write`/`Edit`/`MultiEdit` of any `.vue`/`.ts`/`.js` file. Blocks when the new content introduces an import that does not resolve: `@aziontech/webkit/<subpath>` missing from `packages/webkit/package.json#exports`, relative path with no matching file, bare npm package not installed in any `node_modules/`, or non-existent `@aziontech/*` workspace. Prevents path hallucination.
- **[`enforce-component-create.mjs`](../../.claude/hooks/enforce-component-create.mjs)** — triggers on the first `Write` creating a new `.vue` under `packages/webkit/src/components/webkit/<category>/<name>/`. Blocks when the session transcript shows no reference to the `component-create` skill. Forces the agent to read [`../../skills/component-create.md`](../../skills/component-create.md) first.

If a hook blocks a Write, the agent should:

1. Read the stderr message — it states which rule fired and how to fix it.
2. Replace the offending token with a `Design.md` equivalent (or invoke the `component-create` skill).
3. Retry the Write. The hook re-evaluates on every call.

The hooks **fail open** on unexpected errors — they never silently break workflows.

## 9) Known dependency gaps

Some Storybook / Code Connect features described in `component-create` depend on packages that are **not yet installed**. Adopt them only after the deps land in [`package.json`](./package.json):

| Feature                                | Required dep              | Status        |
| -------------------------------------- | ------------------------- | ------------- |
| `play` function in Storybook stories   | `@storybook/test`         | Not installed |
| `<name>.figma.ts` (Figma Code Connect) | `@figma/code-connect`     | Not installed |
| `cn` helper (Tailwind class merging)   | `clsx` + `tailwind-merge` | Not installed |

Until each dep is installed, the skill records the missing piece as a pending item in the report instead of generating broken code.

## 10) Common pitfalls

- **Tokenizing manually:** if Figma exposes a variable that has no equivalent in Design.md, do not invent a hex or hardcode a Tailwind palette. Register a theme gap (`TODO: tokenizar`) and use the closest primitive temporarily.
- **Slots in the wrong layer:** monolithic components (button/icon-button/tag) do not expose slots. Card-pricing exposes `default` + named `actions` because the layout slot positions are explicit configuration points — not Composition Pattern.
- **Importing PrimeVue directly:** consumer apps should not import from `primevue/*`. Re-export through [`@aziontech/webkit/<name>`](./package.json) and follow PRIMEVUE_ABSTRACTION.md.
- **Typography raw classes leaking in:** `text-[length:var(--text-button-lg-font-size)]` etc. are legacy. New components always use the generated class (`text-button-lg`). When updating an existing component, prefer migrating to the generated class — but note `validate-tokens.mjs` only blocks **new** violations, so pre-existing legacy expressions are not retroactively flagged.
- **Hook blocking a legitimate edit:** if `validate-tokens.mjs` blocks a change that is genuinely correct (e.g. a unit test fixture intentionally containing a hex), move the file outside `packages/webkit/src/components/webkit/` or scope the hook's TARGET_PREFIX more narrowly via PR.

---

**Last Updated:** 2026-05-21
**Maintainer:** Azion WebKit Team
