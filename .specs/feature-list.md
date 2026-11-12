---
name: feature-list
category: content
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 9d223a6f0406f8c6f7f6e04f6714419cdc13ea5df8a381cd2d2a47488700acab
created: 2026-11-12
last_updated: 2026-11-12
---

# FeatureList — Component Spec

## Purpose

The features a plan, product or upgrade includes, each behind a check mark, in one or two columns. It is the "what you get" list of a plan card, an upgrade card or a change-plan drawer: short labels, an optional one-line description under each, and a check that says "included", never "done". It replaces the hand-written `ul` with a `pi pi-check` per row that the billing pages and the change-plan drawer drew with different icon colours.

## When to use

- The perks of an upgrade card (Upgrade to Pro: Unlimited Applications, Unlimited Workloads, Custom Domains).
- The features a plan includes in a change-plan or upgrade drawer, each with a short description.
- Any short list of included capabilities where the check is the only marker.

## When NOT to use

- Steps or tasks with a done/not-done state (a production checklist, a setup guide) → use `outcome-mark` per row, or the `stepper`.
- A comparison of features across plans → use `compare-plans` or `table`.
- Label and value facts → use `key-value-pairs`.
- Rows that navigate or carry actions → use `item`.
- Marketing pricing cards on the site → use `card-pricing` / `pricing-plans`, which carry their own feature lists.

## Related

- `key-value-pairs` — the plan facts that sit next to the feature list in a billing card.
- `card` — the surface the list sits in; FeatureList brings no surface of its own.
- `outcome-mark` — the mark for a step that finished, which this check is not.

## Best practices

- Keep each label to a few words in title case or sentence case, one capability per row; put the detail in `description`, not in the label.
- Use `columns: 2` for six or more short labels in a wide card; it falls back to one column in a narrow box on its own.
- Name the list with `ariaLabel` (for example "Pro plan features") when no visible heading right above it says what the features belong to.
- Do not hand-write the list with your own check icons: the check colour and spacing are part of the component.

## Usage

```vue
<script setup>
  import FeatureList from '@aziontech/webkit/feature-list'

  const features = [
    { label: 'Unlimited Applications' },
    { label: 'Unlimited Workloads' },
    { label: 'Custom Domains' },
    { label: 'Priority Support' }
  ]
</script>

<template>
  <FeatureList
    :items="features"
    :columns="2"
    aria-label="Pro plan features"
  />
</template>
```

## Props

| Prop        | Type                | Default | Required | JSDoc                                                                                                                       |
| ----------- | ------------------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `items`     | `FeatureListItem[]` | `[]`    | false    | The features, in order; each item is `{ label: string; description?: string }`.                                            |
| `columns`   | `1 \| 2`            | `1`     | false    | Columns when the list's own box is at least the md container; a narrower box always shows one column.                      |
| `ariaLabel` | `string`            | `''`    | false    | Accessible name of the list when no visible heading names it.                                                               |

## Events

| _none_ | — | — |

## Slots

_No slots — the rows are data (`items`)._

## States

- Visual states: `default`
- `data-columns` on the list mirrors `columns`
- Empty: with no `items` the component renders nothing (no empty list, no placeholder); the card around it decides what to say
- No `loading`, `disabled`, `invalid`, `readonly`, `error` or `open` states: the list is static, read-only text

## Motion & Animations

_none_

## Tokens

| Region                       | Token (DESIGN.md)                          |
| ---------------------------- | ------------------------------------------ |
| check glyph                  | `pi pi-check`, `var(--success-contrast)`   |
| label                        | `.text-label-sm`, `var(--text-default)`    |
| description                  | `.text-body-xs`, `var(--text-muted)`       |
| row gap / column gap         | `var(--spacing-sm)` / `var(--spacing-lg)`  |
| check → text gap             | `var(--spacing-xs)`                        |
| label → description gap      | `var(--spacing-xxs)`                       |

## Theme gaps

_none_

## Accessibility (WCAG 2.1 AA)

- Visible focus: none; the list has no interactive part.
- Keyboard map: no tab stop.
- ARIA: a native `ul` with `role="list"` (so the list semantics survive `list-style: none` in Safari); each feature is an `li`; the check glyph is `aria-hidden="true"`; `ariaLabel` is set as `aria-label` on the `ul` only when non-empty.
- Contrast ≥4.5:1 for the label and the muted description, ≥3:1 for the check glyph, on `var(--bg-surface)` in both themes.
- No motion.
- No touch target: nothing is interactive.

## Internationalization

No built-in strings: every visible text comes from `items`, and the accessible name from `ariaLabel`.

- Formatting: none

## Right-to-left

- Layout: logical utilities only; the check sits at the inline start and the text after it, so the row mirrors under `dir="rtl"`.
- Icons: the check does not mirror.
- Keyboard: no arrow-key logic.
- User data: each label and description renders `dir="auto"`, so a product name in another script keeps its own direction.

## Responsive

- Container queries: the root is `@container/feature-list`; `columns: 2` applies from `@md` of that box (448 px) and the list shows one column below it, so a card in a split view or on a phone stacks the features by itself.
- Narrow (≤ 640 px or a narrow container): one column; labels and descriptions wrap, never truncate.
- Touch: nothing is interactive.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; long unbroken words break.

## Performance

- Bundle budget: 1.5 kB gzip for `./feature-list`.
- Runtime budget: none: static list.
- Heavy parts: none.

## Examples

- Default — the perks of an upgrade card, four short labels in one column.
- Columns — the same list at `columns: 2` (eight perks); justified because `columns` changes the layout and is the component's only axis.
- WithDescriptions — the features of a change-plan drawer, each with a one-line description; justified because the description row is a distinct anatomy.

## Spec review

Self-review by the lane agent acting as `spec-reviewer` (`.claude/agents/spec-reviewer.md`), 2026-11-12:

1. Naming — `feature-list`, kebab, singular concept, flat export `./feature-list`; no collision in `catalog.json` (the marketing `feature-*` sections are page bands, not lists). Pass.
2. Reuse — `item` rows carry padding and a media slot for navigable rows; `key-value-pairs` is label/value; `outcome-mark` states an outcome; `card-pricing` / `pricing-plans` are site sections with their own lists. No export draws an included-feature list; the design sample (`console/pages/account/panels/Billing.vue`, `components/billing/PlanUpgradeDrawer.vue`) and WebKit's own `platform/account/change-plan-drawer` block hand-write it three times. Pass.
3. Prop vocabulary — `items` (data), `columns` (same name and meaning as `key-value-pairs`), `ariaLabel`. No banned alias. Pass.
4. States — static list; empty renders nothing, stated. Pass.
5. Internationalization — no built-in strings. Pass.
6. Right-to-left — logical utilities, non-mirrored check, `dir="auto"` on user text. Pass.
7. Responsive — container query at `@md` of its own box. Pass.
8. Accessibility — native list, decorative glyph hidden, optional name. Pass.
9. Tokens only — every token above is in DESIGN.md. Pass.
10. Performance — budget declared. Pass.

Verdict: approve.

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
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
