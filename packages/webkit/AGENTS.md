# AGENTS.md — `packages/webkit`

Package-specific guidance for contributors and coding agents. Complements the repository-wide [AGENTS.md](../../AGENTS.md) and is loaded automatically by agents working inside `packages/webkit/`.

## 1) Layers within this package

```
packages/webkit/src/
├── components/
│   ├── webkit/          <-- canonical webkit layer (this AGENTS.md focuses here)
│   │   ├── actions/     button, icon-button
│   │   ├── content/     currency, tag, card-pricing
│   │   ├── data/        (empty, ready to receive)
│   │   ├── feedback/    message, status-indicator
│   │   ├── inputs/      (empty, ready to receive)
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

Skipping the skill "because it is small" is not allowed.

## 4) Hard rules (non-negotiable for new components)

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
- Composition Pattern only when the consumer needs to swap order or omit parts (Dialog, Card composto, Tabs, Accordion, DropdownMenu, Sheet/Drawer, Form). When in doubt, stay monolithic.
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

## 8) Common pitfalls

- **Tokenizing manually:** if Figma exposes a variable that has no equivalent in Design.md, do not invent a hex or hardcode a Tailwind palette. Register a theme gap (`TODO: tokenizar`) and use the closest primitive temporarily.
- **Slots in the wrong layer:** monolithic components (button/icon-button/tag) do not expose slots. Card-pricing exposes `default` + named `actions` because the layout slot positions are explicit configuration points — not Composition Pattern.
- **Importing PrimeVue directly:** consumer apps should not import from `primevue/*`. Re-export through [`@aziontech/webkit/<name>`](./package.json) and follow PRIMEVUE_ABSTRACTION.md.
- **Typography raw classes leaking in:** `text-[length:var(--text-button-lg-font-size)]` etc. are legacy. New components always use the generated class (`text-button-lg`). When updating an existing component, prefer migrating to the generated class.

---

**Last Updated:** 2026-05-21
**Maintainer:** Azion WebKit Team
