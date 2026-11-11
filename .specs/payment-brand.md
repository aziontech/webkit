---
name: payment-brand
category: content
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 4a3dce5b8171f095075a7db987a8076e50a1d02646d8156a5d1102cc752a694d
created: 2026-11-11
last_updated: 2026-11-11
---

# PaymentBrand — Component Spec

## Purpose

The card-brand plate shown beside a payment card: a small bordered plate with the network's mark (Visa, Mastercard, American Express, Diners Club, JCB) drawn in theme tokens, so it reads in light, dark and forced colors without a raster image or a brand hex. It replaces the design sample's `CardBrandMark` (a Visa plate on a hard-coded blue fill), the Console Kit's `card-flag-block` (six colored SVG logos) and the inline Visa SVG the account blocks repeated. A brand it does not draw (Discover, Elo, Hipercard, UnionPay, or an unknown value) shows a generic card glyph and keeps the brand's name for assistive technology.

## When to use

- A payment method row, a checkout summary or a billing table names the card on file: the plate sits before `Ending in 4242` or `Visa •••• 4242`.
- A list of saved cards where the brand helps the reader tell them apart.

## When NOT to use

- The Azion logo → use `Brand`.
- A partner or integration logo (Git providers, clouds) → use the product's logo asset or an `Avatar`.
- A status or category of the card (expired, default) → use `Tag` beside the plate.

## Related

- `brand` — the same idea for the Azion lockup: an inline mark, sized by token.
- `tag` — put `Default` or `Expired` next to the plate, not inside it.

## Best practices

- Pass the brand as the payment API returns it; the plate normalizes `American Express`, `american_express`, `Diners Club` and casing.
- When the row text already says the brand (`Visa •••• 4242`), set `decorative` so the name is not read twice; when the text says only `Ending in 4242`, leave the plate named.
- Keep the plate at `medium` in rows and forms, `small` inside dense tables.

## Usage

```vue
<script setup>
  import PaymentBrand from '@aziontech/webkit/payment-brand'
</script>

<template>
  <div class="flex items-center gap-(--spacing-sm)">
    <PaymentBrand brand="visa" />
    <span class="text-label-md text-(--text-default)">Ending in 4242</span>
  </div>
</template>
```

## Props

| Prop         | Type                  | Default     | Required | JSDoc                                                                                                                                                          |
| ------------ | --------------------- | ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `brand`      | `string`              | `''`        | false    | The card network as the payment API names it (`visa`, `mastercard`, `amex`, `American Express`, `diners`, `jcb`…). Unknown values draw the generic card glyph. |
| `size`       | `'small' \| 'medium'` | `'medium'`  | false    | Plate size: `small` 20 × 32 px for dense tables, `medium` 28 × 40 px for rows and forms.                                                                       |
| `label`      | `string`              | `undefined` | false    | Accessible name. Empty uses the brand's name (`Visa`), or the catalog's `Card` for an unknown brand.                                                           |
| `decorative` | `boolean`             | `false`     | false    | Hide the plate from assistive technology when the text next to it already names the brand.                                                                     |

## Events

_none_

## Slots

_none_

## States

- `data-brand` on the root: `visa` | `mastercard` | `amex` | `diners` | `jcb` | `discover` | `elo` | `hipercard` | `unionpay` | `unknown`.
- `data-size`: `small` | `medium`.
- `data-glyph`: `mark` when the brand has a drawn mark, `generic` otherwise.

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
| ------- | ---------------------- | ----- | ----------------------- |
| —       | none (static mark)     | —     | —                       |

## Tokens

| Region        | Token                   |
| ------------- | ----------------------- |
| plate         | `var(--bg-surface)`     |
| plate border  | `var(--border-default)` |
| mark          | `var(--text-default)`   |
| mark cut-outs | `var(--bg-surface)`     |
| plate radius  | `var(--shape-elements)` |

## Theme gaps

| Figma variable  | Temporary primitive | Follow-up                                                                                      |
| --------------- | ------------------- | ---------------------------------------------------------------------------------------------- |
| card-brand fill | none (monochrome)   | The design sample fills the Visa plate with the network's blue; WebKit draws marks monochrome. |

## Accessibility (WCAG 2.1 AA)

- The root is `role="img"` named by `label` or the brand's name; with `decorative` it is `aria-hidden="true"` and has no role.
- The SVG inside is `aria-hidden` and not focusable; the plate takes no focus.
- Contrast: the mark is `--text-default` on `--bg-surface` (above 4.5:1 in both themes); forced colors draw it in `CanvasText` because it uses `currentColor`.

## Internationalization

| Key                    | English source | Override prop |
| ---------------------- | -------------- | ------------- |
| `paymentBrand.unknown` | `Card`         | `label`       |

- Brand names (`Visa`, `Mastercard`, `American Express`, `Diners Club`, `JCB`, `Discover`, `Elo`, `Hipercard`, `UnionPay`) are trademarks and are not translated.

## Right-to-left

- Layout: the plate is symmetric; no logical spacing inside it.
- Icons: brand marks are not mirrored (they are logos).
- Keyboard: none.
- User data: none.

## Responsive

- Container queries: none.
- Narrow: fixed size; `shrink-0` so a row never squeezes it.
- Touch: not interactive.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: 4.05 KB gzip for `./payment-brand` in `.size-limit.json` (the five marks are inline paths; the catalog lookup brings `useTranslate`).
- Runtime budget: one SVG per plate.
- Heavy parts: none.

## Stories (Storybook)

- Default — a Visa plate before `Ending in 4242`.
- Brands — every drawn mark plus the generic glyph, at both sizes.

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
