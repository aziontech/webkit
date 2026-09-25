---
name: feature-card
category: marketing
structure: monolithic
status: implemented
spec_version: 1
checksum: 0a33eeab767a2189d2ea988f4ec39faab738149da04c32ee399f564c7eaac862
created: 2026-09-22
last_updated: 2026-09-22
---

# Feature Card — Component Spec

## Purpose

One feature stated as a tile: an optional icon and overline, a short headline, a sentence of explanation, and — when there is somewhere to go — the whole tile as a link. It is the repeated unit of a marketing feature grid, and it is the marketing counterpart of `card-box`, which is a console container with header, content and footer regions.

## When to use

- As the repeated unit of a feature, capability or product grid on a marketing page.
- Whenever a short claim needs a name, a sentence and optionally a destination.
- Hand-authored a few at a time in a grid the page owns, so the layout stays the page's decision.

## When NOT to use

- For a console surface with header, content and footer regions → use `card-box`.
- For a plan and its price → use `card-pricing`.
- For a documentation link tile → use `doc-card`.
- For a label-and-value row inside a list → use `item`.

## Related

- `card-box` — the console card with slot regions; this is the marketing tile.
- `card-pricing` — the same tile shape carrying a plan and a price.
- `doc-card` — the documentation equivalent, inside `doc-card-group`.

## Best practices

- Keep `title` to a few words and `description` to one sentence. A tile is a promise, not the proof.
- Give the whole tile an `href` rather than adding a link inside it — a single target is easier to hit and announces once.
- Use `icon` or `eyebrow`, rarely both; two labels above a three-word headline is more furniture than signal.
- Keep every tile in a grid to the same shape. One tile with a long description sets the height of the whole row.

## Usage

```vue
<script setup>
import FeatureCard from '@aziontech/webkit/feature-card'
</script>

<template>
  <FeatureCard
    icon="pi pi-bolt"
    title="Run at the edge"
    description="Your code executes in the location closest to each user, with no region to choose."
    href="/products/edge-application"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `title` | `string` | `—` | true | Headline of the tile, rendered as its `h3`. |
| `description` | `string` | `''` | false | One sentence explaining the headline; overridden by the default slot. |
| `eyebrow` | `string` | `''` | false | Short uppercase overline rendered above the headline. |
| `icon` | `string` | `''` | false | PrimeIcons class for the glyph above the copy. |
| `href` | `string` | `''` | false | When set, the whole tile renders as an anchor link to this URL. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Description body; replaces the `description` prop when provided. |

## States

- Visual states: `default`, and `hover` / `focus-visible` when `href` is set
- `data-linked` present when the tile carries an `href`
- The root element switches between `<a>` and `<article>` on the `href` data prop, never on an `as` string

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| hover / focus on a linked tile | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (headline) | `.text-heading-sm` |
| typography (description) | `.text-body-sm` |
| typography (icon) | `.text-heading-sm` |
| headline text | `var(--text-default)` |
| description text | `var(--text-muted)` |
| icon and eyebrow accent | `var(--primary)` |
| surface | `var(--bg-surface)` |
| hover surface | `var(--bg-hover)` |
| border | `var(--border-default)` |
| spacing (tile padding) | `var(--spacing-lg)` |
| spacing (copy stack) | `var(--spacing-sm)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: a linked tile carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`; an unlinked tile is not focusable.
- Keyboard map: `Tab` reaches a linked tile and `Enter` follows it — native anchor behaviour, no key handler of its own. An unlinked tile is skipped.
- ARIA: the headline is a real `h3`; the tile's accessible name is its own text content, so no `aria-label` is added. The decorative glyph is `aria-hidden="true"`, since `icon` names a glyph and never carries meaning the copy does not.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the headline is `var(--text-default)` on `var(--bg-surface)`; the description uses `var(--text-muted)`, which clears AA on the dark canvas and is a known theme-level shortfall on the light one (see `big-numbers`).
- `motion-reduce:transition-none` on the hover/focus colour transition.
- Touch target ≥40×40 px — a linked tile's anchor is the whole tile, well past the minimum.

## Stories (Storybook)

- Default
- Linked — the tile as an anchor with its hover and focus affordances (justified: the `href` polymorphism swaps the root element and is the only path to the tile's interactive states)

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
