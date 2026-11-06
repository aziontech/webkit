---
name: hero-copy-on-top-art
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: d2358bf611f4037f7f9afc8a7c8bef9f91573f8483bef89b70ba31832e6331df
---
# HeroCopyOnTopArt — Component Spec

## Purpose

The opening band of a product page whose copy sits centered on top of a topology scene: the page `h1` with its overline, sentence and up to two actions over columns of status cards wired left to right. It is a page section — the site places it from a `{ _id: 'hero-copy-on-top-art', props }` entry and binds `props` straight onto it — and it composes `hero`, `hero-title`, `button`, `flow` and `tag`. It is a separate section from `hero-band` because the scene is a data model of its own: levels of cards, each with a status and an optional focus.

## When to use

- To open a product page whose object is best shown as a small topology (domains feeding a workload that binds an application and a firewall).

## When NOT to use

- For an opening band with no scene → use `hero-band`.
- For an opening band followed by a grid of arguments → use `hero-with-opening`.

## Related

- `hero-band` — the sibling opening band with the same copy and actions and no scene.
- `flow` — the diagram primitive the scene is rendered with.

## Best practices

- Keep three levels of one or two cards so the scene fits the column on a tablet.
- Mark exactly one card `lit`, the focus of the scene.

## Usage

```vue
<script setup>
import HeroCopyOnTopArt from '@aziontech/webkit/sections/hero-copy-on-top-art'
</script>

<template>
  <HeroCopyOnTopArt
    eyebrow="Workloads"
    title="Put your application close to users in seconds"
    description="Create a workload and it is live in every Azion data center."
    :primary-action="{ label: 'Start for free', href: '/signup' }"
    :levels="[
      { nodes: [{ eyebrow: 'Domain', icon: 'ai ai-domains', title: 'shop.example.com', label: 'Public', severity: 'info' }] },
      { nodes: [{ eyebrow: 'Workload', icon: 'ai ai-workloads', title: 'shop-prod', label: 'Live', severity: 'success', lit: true }] }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `eyebrow` | `string` | `''` | false | Short overline above the headline. |
| `highlight` | `string` | `''` | false | Opening words of the headline, painted in the brand accent; reads as one sentence with `title`. |
| `title` | `string` | `''` | false | Page headline, rendered as the page `h1`; the band renders nothing when empty. |
| `description` | `string` | `''` | false | Sentence under the headline. |
| `primaryAction` | `HeroCopyOnTopArtAction` | `undefined` | false | First button under the headline; `{ label, href, trailing?, target? }`. Shown only with a label and a link. |
| `secondaryAction` | `HeroCopyOnTopArtAction` | `undefined` | false | Second, outlined button beside the first; `{ label, href, trailing?, target? }`. Shown only with a label and a link. |
| `levels` | `HeroCopyOnTopArtLevel[]` | `[]` | false | The columns of the topology, left to right; each is `{ nodes }`, the cards top to bottom, each `{ eyebrow, icon, title, label, severity, lit? }`. A card without `title` is skipped, and the scene renders only when a level has a card. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- A card with `lit` carries `data-lit` and is drawn as the focus of the scene, with the brand border and glow
- Empty: when `title` is empty the band renders nothing but its root; when no level has a card the scene is omitted
- Each action renders only with a label and a link

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| scene enters | `animate-content-enter` with a 120ms delay | semantic | `motion-reduce:animate-none` |
| card hover / focus | `transition-colors duration-moderate-01 ease-productive-entrance` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| card fill | `var(--bg-surface)` |
| card border | `var(--border-default)`, hover `var(--border-strong)`, lit `var(--primary)` |
| card shape | `var(--shape-card)` |
| card eyebrow and icon | `var(--text-muted)` |
| card title | `var(--text-default)` |
| lit glow | `var(--accent)`, `var(--primary)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `button`; the cards are not interactive.
- Keyboard map: `Tab` moves through the actions.
- ARIA: the hero `<section>` is named by the full headline (`aria-label`); the headline is the page `h1`; card icons are `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `hero-title`, `button` and `tag`; card text uses `--text-default` and `--text-muted`.
- `motion-reduce:transition-none motion-reduce:animate-none` on every motion-bearing class.
- Touch target ≥40×40 px — the large buttons meet it.

## Stories (Storybook)

- Default

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
