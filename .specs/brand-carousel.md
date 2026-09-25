---
name: brand-carousel
category: marketing
structure: monolithic
status: approved
spec_version: 1
checksum: ef7deadf5da9c9238b13242dba4f350e7e0e99504aba87547a28dca017307fe1
created: 2026-09-23
last_updated: 2026-09-23
---

# Brand Carousel — Component Spec

## Purpose

An endlessly looping row of brand marks — the trust strip that names the companies running on the platform, and the stack strip that names the frameworks and clouds a workload already uses. The marks come from the package's own registry and are drawn in one ink, so a strip reads as a list rather than as a dozen competing palettes.

## When to use

- Under a hero, to name the companies a product already serves ("Trusted by mission-critical workloads").
- To state compatibility as a list of framework, cloud and tooling marks ("Your Stack, Your Way").
- Whenever the set of marks is longer than the row that holds it and no single mark has to be read.

## When NOT to use

- When every mark must be seen → use `logo-wall`, which wraps into a grid and never moves.
- When the reader chooses how far to go through browsable content → use `carousel`, which is user-driven and never advances on its own.
- For a mark a reader must act on, such as a partner directory → the strip is decorative motion, so put linked marks in a `logo-wall`.
- For one mark in its own right (a header lockup, a client story card) → use `brand`.

## Related

- `logo-wall` — the static, wrapping grid of consumer-supplied marks; reach for the strip only when the wall would be too long.
- `carousel` — the user-driven snap scroller; this one moves on its own and holds no essential content.
- `brand` — the Azion lockup, for the product's own mark rather than a third party's.
- `overline` — renders the `label` above the row.

## Best practices

- Name marks from the registry rather than passing artwork: the registry is what keeps one company's mark identical on every surface, and a name with no entry still renders as its own wordmark so a strip is never incomplete.
- Let `duration` derive itself. The component holds speed constant rather than duration, so an eleven-mark strip and a thirty-mark strip advance at the same rate; pass a number only to slow one deliberately.
- Keep `label` to the claim the row makes, not to a heading — the strip sits under a hero, and a second heading competes with the one above it.
- Use `size="small"` only where the strip is the quietest thing on the page, such as the floor of a sign-in column; `medium` is the marketing band and carries its own responsive ladder.
- Never put a call to action, a price or anything else a reader needs inside a strip. It scrolls away, and under `prefers-reduced-motion` it becomes a wrapped grid instead.

## Usage

```vue
<script setup>
  import BrandCarousel from '@aziontech/webkit/brand-carousel'
</script>

<template>
  <BrandCarousel
    label="Trusted by mission-critical workloads"
    aria-label="Companies running on Azion"
    :marks="['itau', 'magalu', 'netshoes', 'caixa', 'agibank', 'gpa']"
  />
</template>
```

## Props

| Prop        | Type                  | Default    | Required | JSDoc                                                                                                                                              |
| ----------- | --------------------- | ---------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `kind`      | `'plain' \| 'band'`   | `'plain'`  | false    | Whether the strip paints its own ground; `band` fills it with the page canvas so a textured hero cannot show through the marks, and the floor still reads continuous with the band above it. |
| `marks`     | `string[]`            | `[]`       | false    | Registry names of the marks rendered in the row, in order; an unregistered name renders as its own typographic wordmark so the row stays complete. |
| `label`     | `string`              | `''`       | false    | Overline above the row, stating the claim the marks make.                                                                                          |
| `size`      | `'small' \| 'medium'` | `'medium'` | false    | Mark scale; `medium` is the marketing band and climbs 32/40/48 px by device class, `small` is a flat 24 px for a column.                           |
| `duration`  | `number`              | `0`        | false    | Seconds for one full pass; left at `0` it is derived from the number of marks so every strip moves at one speed.                                   |
| `ariaLabel` | `string`              | `''`       | false    | Accessible name for the row of marks, announced instead of an unnamed list.                                                                        |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: every mark rests at 70% opacity and lifts to full on `hover`
- `data-size` mirrors the `size` prop and is what drives the mark height, the cell width and the row gap
- `data-kind` mirrors the `kind` prop; `band` paints the page canvas and the strip's own vertical rhythm so nothing behind it shows through while the fill still matches the band it floors, `plain` leaves it transparent over whatever it sits on
- `data-duplicate` marks the second, `aria-hidden` copy of the row — the one the loop translates into place, and the one hidden outright under reduced motion
- Empty: when `marks` is empty the row renders nothing, so a page with no marks to name shows no empty band
- Reduced motion: the track stops and wraps into a centred static grid, with the duplicate row removed, so every mark stays reachable

## Motion & Animations

| Trigger           | Animation / Transition                                         | Token (see `.claude/docs/DESIGN.md` § Animations)                                                      | Reduced-motion fallback                                         |
| ----------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| always (the loop) | `animate-brand-marquee`                                        | semantic (59s default · linear infinite; the track overrides `animation-duration` from its mark count) | `motion-reduce:animate-none` (the row wraps into a static grid) |
| hover on a mark   | `transition-opacity duration-fast-02 ease-productive-entrance` | inline (matches catalog)                                                                               | `motion-reduce:transition-none`                                 |

## Tokens

| Region                            | Token (DESIGN.md)                                   |
| --------------------------------- | --------------------------------------------------- |
| typography (fallback wordmark)    | `.text-heading-xxs`                                 |
| ink (mark)                        | `var(--text-default)` at 70% opacity, full on hover |
| spacing (label ↔ row)             | `var(--spacing-xl)`                                 |
| spacing (row gap, medium)         | `var(--spacing-4)` / `var(--spacing-8)`             |
| spacing (row gap, small)          | `var(--spacing-8)`                                  |
| spacing (reduced-motion grid gap) | `var(--spacing-md)`                                 |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: none of its own — no mark is a focusable target, so the strip adds no tab stop and needs no ring. The loop still pauses on `:focus-within`, so anything a consumer places over it stays still while it is reached.
- Keyboard map: no arrow-key model and no tab stop — this is a list, not a composite widget.
- ARIA: the row is a `<ul>` of `<li>` named by `ariaLabel` when set; the second copy carries `aria-hidden="true"` so a screen reader hears each mark once, and each mark is titled with its own name.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): marks are drawn in `var(--text-default)` at 70%, which WCAG 1.4.11 exempts as a logotype; the typographic fallback is real text and clears the minimum in both themes at that strength.
- `motion-reduce:animate-none` on the track and `motion-reduce:transition-none` on the mark hover. WCAG 2.2.2 applies — the loop is longer than five seconds, so it pauses on hover and on focus-within, and stops outright under `prefers-reduced-motion`.
- Touch target ≥40×40 px: marks are not interactive targets; the whole strip is one decorative band.

## Stories (Storybook)

- Default
- Sizes — composite story rendering both `size` values side-by-side
- Frameworks — the stack strip rather than the client strip (justified: the two registries are the component's whole reason for existing, and no arg on the Default story shows that a framework mark resolves the same way a client mark does)
- Fallback — a row mixing registered names with an unregistered one (justified: the typographic wordmark is a rendered state no prop can reach, and it is what lets a page name a company whose artwork has not landed)

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
