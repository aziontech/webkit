---
name: doc-cta
category: documentation
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: cd31ac478c825df1bfc44bddea1e05f3d752ae03f14fdcbdae27ba94c9be1e14
created: 2026-11-11
last_updated: 2026-11-11
---

# DocCta — Component Spec

## Purpose

The closing offer of a documentation page, parked at the foot of the "On this page" rail after the outline. It is a docs card built like every other card on the page: a `FrameBox` with corner marks, a flat `--bg-surface` face, the wordmark at the headline size, a headline, a subtitle and full-width stacked actions. Set on the rail scale (14 px headline, 12 px copy) so it never out-shouts the page outline. Every string is content passed by the page.

## When to use

- Once per documentation page, last in the right rail.

## When NOT to use

- In the prose column — use `CallToAction` on marketing pages or a `DocCard` link in docs.
- More than once per page.

## Related

- `DocOnThisPage` — the rail it closes.
- `FrameBox` — the frame.
- `CallToAction` — the marketing closing band.

## Best practices

- One primary action; a secondary only when it is a real alternative (talk to sales).
- A one-line headline and a one-line subtitle.

## Usage

```vue
<script setup>
  import DocCta from '@aziontech/webkit/doc-cta'
</script>

<template>
  <DocCta
    title="Ready to build?"
    primary-label="Start for free"
    primary-href="/signup"
  >
    Deploy your first application in minutes.
  </DocCta>
</template>
```

## Props

| Prop             | Type     | Default | Required | JSDoc                                                            |
| ---------------- | -------- | ------- | -------- | ---------------------------------------------------------------- |
| `title`          | `string` | `''`    | false    | The offer's headline; names the complementary landmark.          |
| `label`          | `string` | `''`    | false    | Fallback copy when the default slot is empty.                    |
| `primaryLabel`   | `string` | `''`    | false    | The primary action's label; empty renders no primary action.     |
| `primaryHref`    | `string` | `''`    | false    | Where the primary action goes.                                   |
| `secondaryLabel` | `string` | `''`    | false    | The secondary action's label; empty renders no secondary action. |
| `secondaryHref`  | `string` | `''`    | false    | Where the secondary action goes.                                 |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                             |
| --------- | ----- | ------------------------------------------------- |
| `default` | —     | The offer's copy, set as the headline's subtitle. |

## States

- Visual states: `default`.

## Motion & Animations

_none_

## Tokens

| Region   | Token (DESIGN.md)                                              |
| -------- | -------------------------------------------------------------- |
| face     | `var(--bg-surface)`                                            |
| frame    | From `FrameBox` (`var(--border-default)`)                      |
| headline | `.text-heading-xxs`, `var(--text-default)`                     |
| copy     | `.text-body-xs`, `var(--text-muted)`                           |
| spacing  | `var(--spacing-md)`, `var(--spacing-xs)`, `var(--spacing-xxs)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- `role="complementary"` named by the visible headline (`aria-labelledby`).
- The wordmark is the `Brand` image with its own accessible name.
- Buttons come from `Button` with visible focus.

## Internationalization

- Built-in strings: none. Every visible string is content and arrives through props or slots, so the page supplies it in its own language.

## Right-to-left

- Layout: logical utilities only.
- Icons: none.
- Keyboard: unchanged.

## Responsive

- Fills the rail (about 225 px); actions stack full width.

## Performance

- Bundle budget: 12 KB gzip for `./doc-cta` in `.size-limit.json` (Brand, Button and FrameBox included).

## Stories (Storybook)

- Default — headline, copy and one action.
- Two actions — Start for free and Talk to sales.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
