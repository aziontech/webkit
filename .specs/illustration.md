---
name: illustration
category: content
structure: monolithic
status: approved
spec_version: 2
figma:
  url: https://www.figma.com/design/aerxJReCkLz3x3z29IERE9/Assets?node-id=1901-225133
  node_id: 1901:225133
checksum: 872ca60184a95b9975f2864293d96393f729c2e6536b6e0560d5afa9ccf8c7b0
created: 2026-08-05
last_updated: 2026-09-24
---

# Illustration — Component Spec

## Purpose

Renders an **official product illustration** — one of the scenes drawn in the Assets
library in Figma and exported as an SVG that ships with this package. `name` selects a
scene from a closed registry; there is no way to assemble artwork out of markup, so a
page can only render illustrations design has actually signed off, and a scene can never
drift between the screens that use it.

## When to use

- An empty state, error page, onboarding step, or marketing tile needs a diagrammatic illustration of a product concept (a deploy, a request path, a connected service).
- The same concept appears on more than one screen and must be the same drawing every time.
- The artwork must scale to its container without rasterizing or re-exporting.

## When NOT to use

- A single glyph is enough → use an icon from `@aziontech/icons` (`<i class="ai ai-…">`).
- The artwork is a brand mark (a client logo, a framework mark) → those are brand assets, not illustrations.
- The whole component is "no data here, with a title and an action" → use `empty-state`, which already owns that layout and may embed an `Illustration`.
- The graphic is a live data visualization → that is a chart, not an illustration.
- The scene you need is not in the registry → it has to be drawn in Figma and exported first. Do not approximate it in markup.

## Related

- `empty-state` — the surrounding layout (illustration + title + description + actions); reach for it first and put an `Illustration` inside it.
- `flow` — a real interactive node/edge diagram driven by data; `Illustration` is decorative and static by comparison.
- `skeleton` — the loading placeholder; an illustration is never a loading state.
- `svg/azion/*` — drawn brand marks, for artwork that is not part of the illustration library.

## Best practices

- Leave the illustration decorative (no `ariaLabel`) unless it carries information the surrounding copy does not. A decorative illustration is hidden from assistive tech, which keeps screen readers out of a graphic that adds nothing.
- Size the illustration from the call site with a class. The root is `w-full` at the canvas aspect ratio, so a narrower column simply gets a smaller scene.
- Pick the scene that draws the claim next to it, not the one whose filename matches the page title.
- To add a scene, export the frame from the Figma assets library at 592×300, drop the `.svg` into `src/assets/illustrations/`, and register it. Never hand-draw one.
- Leave `<Illustration />` unnamed where a scene is still being drawn: the placeholder frame reserves the space and reads as unfinished on the screen, which is louder than a gap nobody notices.

## Usage

```vue
<script setup>
  import Illustration from '@aziontech/webkit/illustration'
</script>

<template>
  <!-- Decorative: the copy beside it already carries the meaning. -->
  <Illustration name="modern-frontends" />

  <!-- Named: the scene is the only thing saying what this is. -->
  <Illustration
    name="deploy-secure-mcp-server"
    aria-label="An MCP server deployed behind the edge firewall"
  />

  <!-- No name: the placeholder frame, for a scene design has not drawn yet. -->
  <Illustration />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `name` | `string` | `''` | no | Name of an official scene in the illustration asset library. |
| `ariaLabel` | `string` | `''` | no | Accessible name; empty keeps the illustration decorative and hidden from assistive tech. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default` — an illustration is decorative and has no `hover`, `focus-visible`, `disabled`, `loading`, or `active` state, and is never interactive.
- Every scene is drawn on the one 592×300 canvas (`--illustration-canvas-width` × `--illustration-canvas-height`), so scenes line up with each other in a grid. The root declares that frame as its intrinsic `width`/`height`, which reserves the box before the SVG loads, and renders at its container's width at that aspect ratio. A call site that wants it smaller caps it with a class.
- A `name` that resolves to no scene — empty, or not in the registry — renders the **placeholder**: a tinted frame reading `PLACE DESIGN ASSET`, marked `data-placeholder`. An unregistered `name` also warns in development; neither case throws, and neither collapses the layout. The placeholder is always decorative, `ariaLabel` or not: it draws no scene, so announcing a description of the missing artwork would describe something that is not on the page.
- While a registered scene's SVG is still resolving, the frame already on screen stays — the placeholder never flashes in front of a scene that is about to arrive.

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| _none_ | The scene is a static SVG; any motion belongs to the artwork itself, not to the component. | — | — |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| _none_ | — |

The component declares no utility that resolves a token: the artwork's every value lives
inside the exported SVG, and the canvas the library is drawn on
(`--illustration-canvas-width` × `--illustration-canvas-height`) reaches the root as the
intrinsic `width`/`height` the frame already carries.

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | The component declares no colour of its own; every fill is inside the exported SVG. |

## Accessibility (WCAG 2.1 AA)

- Visible focus: _not applicable_ — an illustration is never focusable or interactive, so it declares no focus ring.
- Keyboard map: _none_ — no interactive elements, nothing in the tab order.
- ARIA: with no `ariaLabel` the root is an `<img>` with an empty `alt` and `aria-hidden="true"`, so assistive tech skips a purely decorative graphic; with an `ariaLabel` the root carries it as the image's `alt`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the component declares no text and no colour. An exported scene is decorative shape, not information — no meaning is conveyed by the artwork alone, so the copy beside it must carry the claim.
- Touch target ≥40×40 px: _not applicable_ — nothing here is a target.

## Stories (Storybook)

- Default — the `name`-driven form with Controls.
- Assets — composite story rendering every registered scene side-by-side. **Justified addition:** `name` is the whole public API and its valid values are a closed registry, so the story is the only place a consumer can see what `name` accepts. A Controls dropdown alone would not show them together.
- Labeled — the accessible-name form (an args delta of `ariaLabel`).
- Placeholder — the fallback frame, rendered by an unnamed `Illustration`. **Justified addition:** it is a rendered state of the component (see § States), not a variant, and it is the one thing in the component a consumer cannot reach from the `name` dropdown — every option in that list resolves to a scene.

There is no `Types` or `Sizes` story: the root declares neither `kind` nor `size`. There are no `Loading` / `Disabled` stories: the component declares neither prop (see § States).

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
