---
name: spacer
category: layout
structure: monolithic
status: implemented
spec_version: 8
checksum: 03568e1c71a66a13f950ed6147eadcf972fa4c1394ff6626af760f20f9747e24
figma:
  url: https://www.figma.com/design/QEbHSTFDWfh4VHkBp6NWN3/Azion.com?node-id=8869-10008
  node_id: 8869:10008
created: 2026-08-11
last_updated: 2026-11-17
---

# Spacer — Component Spec

## Purpose

The empty registration frame that divides two page sections. On a page with no margins between sections, this frame _is_ the gap: it holds the vertical air, and its own two rules are what separate the sections it sits between — which is why it is a frame and not an empty `div`. `size` picks how much air, on a three-step scale built from the theme's own spacing tokens.

## When to use

- Use Spacer only between marketing page sections inside Container; in product UI use Separator.
- Between two stacked page sections on a full-bleed, framed layout.
- Wherever a page needs breathing room that still reads as part of the frame instead of as empty margin.
- To change the weight of one break without touching its neighbours — a `large` gap before a new part of the page, `small` between two bands that belong together.

## When NOT to use

- To space two elements inside a section → use the layout's own `gap-(--spacing-*)` utility.
- To draw a single separating line with no air → use `separator` instead.
- When the gap must hold content (a headline, a CTA) → use `module-header`, or a `registration-frame` you fill yourself.

## Related

- `registration-frame` — the frame this component configures; reach for it directly when the gap needs content or different rules.
- `texture` — the layer that paints the ruling, composed here at its `lines` kind.
- `module-header` — the framed header that usually follows a gap; it owns no vertical air of its own beyond its padding, so the gaps around it are what set the page's rhythm.
- `separator` — a hairline with no vertical air.

## Best practices

- Pick the step by what the break means, not by how the page happens to look: `medium` is the ordinary break between sections, `large` opens a new part of the page, `small` keeps two related bands close.
- On the Blog, the gap right after the `title-band` hero (`size="medium"`) is `small`, so the article highlight reads as part of the opening.
- Do not override the height from the call site. The steps are multiples of `--spacing-2xl`, so they already scale with the viewport; a hand-set height freezes one break out of the page rhythm.
- Keep one step per break — stacking two gaps to reach a bigger one draws an extra pair of rules.
- The gap draws its own bottom rule, so the `module` that follows it passes `divided` as `false`: two rules never share one seam.
- Let it carry the shared rule: it renders `flush`, so its top rule is subtracted and the section above supplies it instead of doubling it. It still ticks every corner (`marks="all"`): the shared rule is given away, the registration mark is not.
- Reach for `hatch` here rather than on a section header: the gap is the one band with no copy of its own, so the texture gives the break identity without sitting behind a headline.
- Leave the ruling unmasked. Each line is one solid ink edge to edge and its transparency is the ink's own, so the field reads as ruled page material rather than as a fill that fades out; a vignette on a band this short reads as a smear.
- Do not wrap it in a padded container; the gap is the padding.

## Usage

```vue
<script setup>
  import Spacer from '@aziontech/ui/spacer'
</script>

<template>
  <Spacer size="large" />
</template>
```

## Props

| Prop    | Type                             | Default    | Required | JSDoc                                                                                                                                                                                                                                                               |
| ------- | -------------------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `size`  | `'small' \| 'medium' \| 'large'` | `'medium'` | false    | How much vertical air the gap holds, as a multiple of `--spacing-2xl`: `small` is 1× (keeps two related bands close), `medium` 2× (the ordinary break), `large` 3× (opens a new part of the page). The token is responsive, so every step scales with the viewport. |
| `hatch` | `boolean`                        | `false`    | false    | Draw the gap's ruled line texture — fine vertical rules at a fixed pitch.                                                                                                                                                                                           |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- `data-size` mirrors the `size` prop: `small` | `medium` | `large`
- `data-hatch` present when the hatch texture is drawn; the texture layer itself is addressable at `spacer__hatch`

## Motion & Animations

_none_

## Tokens

| Region          | Token (TOKENS.md)                                                                                                         |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- |
| frame rule      | `var(--border-default)`                                                                                                   |
| corner mark     | `var(--border-default)`                                                                                                   |
| hatch line      | `var(--text-default)` at 6%, via `texture`'s `lines` kind — mixed down so the step off the canvas is equal in both themes |
| hatch pitch     | 8 px (the `lines` kind at its `medium` step)                                                                              |
| height (small)  | `var(--spacing-2xl)` — 1×                                                                                                 |
| height (medium) | `var(--spacing-2xl)` — 2×                                                                                                 |
| height (large)  | `var(--spacing-2xl)` — 3×                                                                                                 |

## Theme gaps

<!-- No new token group: the steps are multiples of `--spacing-2xl`, the largest step of the
     existing semantic scale in `packages/theme/src/tokens/semantic/spacing.js`. That
     token is already responsive (2rem / 4rem / 6rem across breakpoints), so the gap inherits
     the responsiveness instead of declaring a scale of its own. -->

| Figma variable                                                 | Temporary primitive              | Follow-up                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--spacing-spacer-spacer-{sm,md,lg,xl}` (80 / 128 / 160 / 240) | `var(--spacing-2xl)` × 1 / 2 / 3 | The Figma spacer family is deliberately **not** ported as its own token group: the theme's existing spacing scale already carries the page's rhythm, and a second family would be a parallel source of truth for the same decision. The multiples land on the Figma weights in the middle of the responsive range (64/128/192 at `sm`) and scale past them on a wide screen. Revisit only if the design needs a step the existing scale cannot express. |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable — the gap holds no content and no interactive surface.
- Keyboard map: none — the gap is not focusable and is skipped by `Tab`.
- ARIA: no role and no accessible name; the frame's rules and corner marks are decoration inherited from `registration-frame`, which marks them `aria-hidden="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons) — no text; the rules are non-informational decoration.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the component is static.
- Touch target ≥40×40 px — not applicable, no interactive control.

## Examples

- Default — one gap between two stub sections, so the shared rules and the vertical air are both visible (justified: an empty frame rendered alone shows nothing; the neighbours are what the story is about)
- Sizes — composite story rendering every `size` value between stub sections
- Hatch — the `hatch` texture on (mutually-exclusive boolean state of the `hatch` prop)

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/ui/*` path must exist in `packages/ui/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `contributing/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `contributing/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `contributing/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `contributing/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
