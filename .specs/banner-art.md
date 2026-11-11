---
name: banner-art
category: marketing
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: faf4a15958ad13b1fee1bda306b8b61faa1430b071f730ba6be3d84928161356
created: 2026-11-11
last_updated: 2026-11-11
---

# BannerArt — Component Spec

## Purpose

The decorative backdrop a site, hub or docs band stands on, for a `Hero` `background` slot or any band with `relative overflow-hidden`: `globe` hangs half a globe past the page's inline-end rule over the dot lattice, `map` insets the world map beside the copy, `network` lays the map full bleed with its PoPs lit, the sample's `MapMesh` traffic crossing between them (`NetworkMap` `traffic`: links and packets, the links alone as the still frame under reduced motion) and a scrim over the copy column. From the design sample's `shared/ui/banners` (GlobeBanner, MapBanner, NetworkBanner), drawn with WebKit's own `SpinningGlobe` and `NetworkMap` so there is one map and one globe in the system. The inventory's "`Banner` `art` variants" became this sibling component under `marketing/banner`: `Banner` is an announcement band with its own surfaces, and a backdrop layer is a different thing.

## When to use

- Behind the opening band of a landing, the hub or the docs home.

## When NOT to use

- As content: it is `aria-hidden` and says nothing.
- Behind dense text or a form.
- For a plain texture — use `TextureMaterial`.

## Related

- `Hero` — the `background` slot it fills.
- `NetworkMap`, `SpinningGlobe` — what it draws.
- `TextureMaterial` — the dot lattice.
- `Banner` — the announcement band (unrelated surface).

## Best practices

- One backdrop per page.
- Keep the copy at the inline start: every art is washed toward it.

## Usage

```vue
<script setup>
  import BannerArt from '@aziontech/webkit/banner-art'
  import Hero from '@aziontech/webkit/hero-root'
  import HeroTitle from '@aziontech/webkit/hero-title'
</script>

<template>
  <Hero
    kind="band"
    max-width="site"
  >
    <template #background>
      <BannerArt art="network" />
    </template>
    <HeroTitle title="Close to every user" />
  </Hero>
</template>
```

## Props

| Prop       | Type        | Default  | Required   | JSDoc                                                                                 |
| ---------- | ----------- | -------- | ---------- | ------------------------------------------------------------------------------------- |
| `art`      | `'globe' \\ | 'map' \\ | 'network'` | `'map'`                                                                               | false | Which backdrop to draw. |
| `animated` | `boolean`   | `true`   | false      | Spins the globe or pulses the PoPs; a still frame when false or under reduced motion. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- `data-art` mirrors `art`.

## Motion & Animations

From `SpinningGlobe` (rotation, stopped under reduced motion) and `NetworkMap` (`animate-pulse` with `motion-reduce:animate-none`).

## Tokens

| Region        | Token (DESIGN.md)                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------- |
| washes        | `var(--bg-canvas)` through `color-mix`                                                                              |
| lattice       | From `TextureMaterial`                                                                                              |
| map and globe | From `NetworkMap` and `SpinningGlobe` (`--text-muted`, `--primary`, illustration tokens)                            |
| globe width   | `var(--container-5xl)`, `var(--layout-measure-site)`; sized off the band height through a size container (`100cqh`) |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- `aria-hidden="true"` and `pointer-events-none`: never announced, never in the way of a click.
- The washes keep the copy column at canvas contrast.

## Internationalization

- Built-in strings: none.

## Right-to-left

- The globe hangs off the inline-end rule and the washes run from the inline start in both directions (`rtl:` variants).
- Keyboard: not focusable.

## Responsive

- The globe is sized off the band height (a size container on the backdrop) and capped by `150vw` and `--container-5xl`.
- The map takes the full width below medium and the inline-end three fifths from medium.

## Performance

- Bundle budget: 10.1 KB gzip for `./banner-art` in `.size-limit.json` (map data and globe included).
- The globe draws to a canvas and pauses off screen (from `SpinningGlobe`).

## Examples

- Default — `map` behind a hero.
- Arts — the three backdrops.

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
