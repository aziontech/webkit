---
name: card-pricing
category: content
structure: monolithic
status: implemented
spec_version: 1
checksum: 61f0bfa3dd66961de163959526fd4905c25f762d2e35f5e7501c205b62eda98d
created: 2026-05-22
last_updated: 2026-08-28
---

# Card Pricing — Component Spec

## Purpose

One tier of a pricing table: what it is called, what it costs, what that price includes, and the one action that moves the account onto it. The card owns the typographic hierarchy of a price — an overline plan name, the amount as the headline figure, and the billing caveat under it in muted body copy — so a row of tiers reads as a comparison rather than as three differently-typeset cards.

`slotPosition` is the axis that decides which of the two compositions the card is. **`bottom`** is the compact tier: the name, a `medium` amount and the caveat stack at the top, the action follows, and the slot sits under it — a card sized by its own content, for a row of tiers a reader scans. **`middle`** is the full tier: the amount becomes the `large` headline figure, the caveat moves up to `body-md`, the slot grows to fill the card, and the action is pinned to the bottom edge so a row of `middle` cards has its buttons on one line whatever each tier's feature list holds.

`kind` decides only whether the card draws its own surface (`contained`) or sits on the one behind it (`transparent`); it never changes the composition.

The name, the amount and the caveat are **one column**, capped at `--container-xs` (348px) rather than at the card's full width: the caveat is a sentence about the price directly above it, so it wraps on the price's measure. The cap shipped as `--container-3xs` (256px) — two rungs down the ladder, and too narrow for the copy it holds. 256px sets `body-md` at roughly 33 characters, under the 45–75 a prose measure wants, and all three billing caveats on the sample pricing page (66, 69 and 84 characters) ran to three lines there. At 348px the measure is ~46 characters and the same three set in two, while the card's own content box at 1440 is 413px — so the caveat is still held to the price's column instead of the card's.

The card carries **one** prose region — the pricing caveat, below the amount. It used to carry a second paragraph above the amount as well, and with `aligned` reserving a band for each, a row of tiers showed two two-line muted blocks around every price doing the same visual job. The Figma component (`3605:2260`) has a single prose region, `Pricing Details`, positioned below the amount, so that is the one the card keeps; a tier's positioning sentence belongs to whatever the consumer puts in the slot.

`aligned` makes a ROW of cards read as one comparison. Every region is content-sized by default, which is right for a single card and wrong for three side by side — a tier with a two-line caveat and a tier with none put their feature lists on different lines, and the reader has to re-find the row in every column. It reserves **three** lines for the caveat, in `lh` so the reservation follows the type token rather than a hard-coded height. Three is the design's 64px band expressed in whole lines of the region's own token (`body-md` is a 22px line box, so `3lh` is 66px; `2lh` is 44px and twenty short) — it shipped as `2lh`, and the shortfall stayed invisible until a tier's caveat ran to three lines at the region's then-256px measure, overflowed the band, and pushed that column's feature list 22px below the other two. Opt-in, because reserving empty lines is wrong for a lone card; set it on every card in the row. A caveat past three lines still pushes the row down, like any overflow.

The plan title is an **overline** (`.text-overline-md` on an `<h3>`): the token carries the display face, the uppercase transform and the widest tracking step, so the tier reads as a label on the card rather than as a title competing with the price beneath it. It stays an `<h3>` for the document outline — the tier is the section heading — while looking like an overline.

## Props

| Prop                 | Type                           | Default       | Required | JSDoc                                                                                             |
| -------------------- | ------------------------------ | ------------- | -------- | ------------------------------------------------------------------------------------------------- |
| `planTitle`          | `string`                       | `'Pro'`       | false    | plan Title.                                                                                       |
| `pricingDetails`     | `string`                       | `''`          | false    | pricing Details.                                                                                  |
| `showPricingDetails` | `boolean`                      | `true`        | false    | show Pricing Details.                                                                             |
| `showTag`            | `boolean`                      | `false`       | false    | show Tag.                                                                                         |
| `tagLabel`           | `string`                       | `'Popular'`   | false    | tag Label.                                                                                        |
| `aligned`            | `boolean`                      | `false`       | false    | Reserves the caveat's band so a row of cards aligns row-for-row. Set it on every card in the row. |
| `slotPosition`       | `'bottom' \| 'middle'`         | `'bottom'`    | false    | slot Position.                                                                                    |
| `kind`               | `'contained' \| 'transparent'` | `'contained'` | false    | card Style.                                                                                       |
| `value`              | `string`                       | `'20'`        | false    | value.                                                                                            |
| `prefix`             | `string`                       | `'$'`         | false    | prefix.                                                                                           |
| `suffix`             | `string`                       | `'/ mon'`     | false    | suffix.                                                                                           |
| `showPrefix`         | `boolean`                      | `true`        | false    | show Prefix.                                                                                      |
| `showSuffix`         | `boolean`                      | `true`        | false    | show Suffix.                                                                                      |
| `actionLabel`        | `string`                       | `'Label'`     | false    | action Label.                                                                                     |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes         |
| --------- | ----- | ------------- |
| `actions` | —     | Named slot.   |
| `default` | —     | Main content. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`

## Motion & Animations

_none_

## Tokens

| Region                     | Token (DESIGN.md)                                                                 |
| -------------------------- | --------------------------------------------------------------------------------- |
| plan title typography      | `.text-overline-md` (carries the display face, `uppercase` and `tracking-widest`) |
| caveat band (`aligned`)    | `3lh` of the region's own line box — 66px, the whole-line form of the design's 64px |
| amount                     | `Currency` at `medium` (`bottom`) / `large` (`middle`)                            |
| pricing details typography | `.text-body-sm` (`bottom`) / `.text-body-md` (`middle`)                           |
| surface (`contained`)      | `var(--bg-surface)`                                                               |
| border (`contained`)       | `var(--border-default)` @ `var(--border-width-default)`                           |
| shape                      | `var(--shape-card)`                                                               |
| inset                      | `var(--spacing-lg)`                                                               |
| stack gap                  | `var(--spacing-lg)`                                                               |
| header gap                 | `var(--spacing-xs)` (`bottom`) / `var(--spacing-md)` (`middle`)                   |
| title↔tag gap              | `var(--spacing-xs)`                                                               |
| action row gap             | `var(--spacing-md)`                                                               |
| text                       | `var(--text-default)`                                                             |
| muted text                 | `var(--text-muted)`                                                               |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Stories (Storybook)

- Default
- Variants (`slotPosition` × `kind`)
- Aligned (a row of three tiers with uneven copy)
- WithTag
- Slots

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
