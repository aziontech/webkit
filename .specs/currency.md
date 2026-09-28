---
name: currency
category: content
structure: monolithic
status: implemented
spec_version: 1
checksum: 092d3bc30e7a43aca8d92d9396c95bdb607fa4f830f99b02fa47b63fe12e16c7
created: 2026-05-22
last_updated: 2026-08-24
---

# Currency — Component Spec

## Purpose

Typesets one monetary amount as three separately-styled parts — the currency symbol, the figure, and a trailing period or unit — so money reads the same everywhere in the product instead of being a formatted string each screen spells its own way. The suffix carries the code typeface (`text-label-code-*`), which keeps the unit visually subordinate to the figure and aligns the whole set with the way the system typesets metered values.

The size ladder is the house one (`small` / `medium` / `large`) and each step is a different reading distance: `small` is an amount inside a table row or a list cell, `medium` an amount stated as a fact on a card, `large` the headline figure of a pricing card. `large` bottom-aligns the suffix against the figure rather than centring it, because a 56px numeral centred against a 14px unit reads as two unrelated pieces of text.

## Props

| Prop     | Type                             | Default   | Required | JSDoc                                                                         |
| -------- | -------------------------------- | --------- | -------- | ----------------------------------------------------------------------------- |
| `value`  | `string`                         | `''`      | false    | value.                                                                        |
| `prefix` | `string`                         | `'$'`     | false    | prefix.                                                                       |
| `suffix` | `string`                         | `''`      | false    | suffix.                                                                       |
| `size`   | `'small' \| 'medium' \| 'large'` | `'small'` | false    | Size token; affects typography and the gap between the figure and the suffix. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`

## Motion & Animations

_none_

## Tokens

| Region                                 | Token (DESIGN.md)     |
| -------------------------------------- | --------------------- |
| amount typography — `small`            | `.text-amount-sm`     |
| amount typography — `medium`           | `.text-amount-md`     |
| amount typography — `large`            | `.text-amount-lg`     |
| suffix typography — `small`            | `.text-label-code-sm` |
| suffix typography — `medium` / `large` | `.text-label-code-md` |
| amount text                            | `var(--text-default)` |
| suffix text                            | `var(--text-muted)`   |
| gap — `small`                          | `var(--spacing-xxs)`  |
| gap — `medium` / `large`               | `var(--spacing-xs)`   |
| suffix baseline offset — `large`       | `var(--spacing-md)`   |

## Theme gaps

_none_ — the amount's `-0.08em` letter-spacing, previously shipped without, is now carried by the dedicated `text-amount-sm` / `-md` / `-lg` tokens (`packages/theme/src/tokens/semantic/texts.data.js`). Each mirrors the heading/label token the amount used to borrow — same size ramp, same leading, same weight — and adds the tracking. It is expressed in `em` because the design specifies one proportional ratio (−1.28px @16px, −1.92px @24px, −4.48px @56px), which the `rem`-based `tracking.js` scale cannot hold; dedicated tokens rather than tracking on the borrowed ones, because `text-heading-2xl` sets every hero headline in the system and a hero is prose, not a numeral.

> Follow-up outside this spec: the three new tokens are not yet listed in `.claude/docs/DESIGN.md` (this pipeline may not edit that file). Whoever owns the catalog should add them beside the `text-heading-*` / `text-label-*` families.

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Stories (Storybook)

- Default
- Sizes (small / medium / large)

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
- Do not add bespoke Storybook stories beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Stories (Storybook)" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
