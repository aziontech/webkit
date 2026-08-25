---
name: doc-pagination
category: documentation
structure: monolithic
status: implemented
spec_version: 1
checksum: e20d600f75d4a530e21e8a1313a918c34e379a733f49e4fdbe681bce11079480
created: 2026-08-22
last_updated: 2026-08-22
---

# DocPagination — Component Spec

## Purpose

The previous / next pair that closes a documentation page. Each side is a link carrying an eyebrow and the destination's title; a side with no neighbour leaves its half of the row empty, so the remaining link stays anchored to its own edge rather than drifting to the centre.

## When to use

- At the foot of a page that sits in a reading order — a guide, a tutorial, a numbered series.
- Whenever "what do I read next" has a single obvious answer in each direction.

## When NOT to use

- To page through a data set — that is `Paginator`, which walks pages of rows and owns a page number. This links two neighbouring documents and knows nothing about a total.
- On a page with no reading order (a reference index, a landing page): a next link that points somewhere arbitrary is worse than none.

## Related

- `Paginator` — the data counterpart; numbered pages over a collection, not two named documents.
- `DocOnThisPage` — navigation _within_ the page, where this is navigation _between_ pages.

## Best practices

- Pass the destination's real title, not "Next page". The title is what tells the reader whether they want to go.
- Leave a side `null` at the ends of a series rather than looping around.
- Handle `navigate` when the app routes client-side; the anchor's `href` is what makes the link real for everyone else.

## Usage

```vue
<script setup>
  import DocPagination from '@aziontech/webkit/doc-pagination'
</script>

<template>
  <DocPagination
    :previous="{ title: 'Deploy an application', href: '/docs/deploy' }"
    :next="{ title: 'Bind a domain', href: '/docs/domains' }"
    @navigate="(event, page) => router.push(page.href)"
  />
</template>
```

## Props

| Prop            | Type                  | Default      | Required | JSDoc                           |
| --------------- | --------------------- | ------------ | -------- | ------------------------------- |
| `previous`      | `DocPageLink \| null` | `null`       | false    | The page before this one.       |
| `next`          | `DocPageLink \| null` | `null`       | false    | The page after this one.        |
| `previousLabel` | `string`              | `'Previous'` | false    | Eyebrow over the previous link. |
| `nextLabel`     | `string`              | `'Next'`     | false    | Eyebrow over the next link.     |

## Events

| Event      | Payload                                  | Notes                                                                                                                |
| ---------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `navigate` | `(event: MouseEvent, page: DocPageLink)` | Fired when either neighbour is activated; `page` is the side that was clicked. Event first, per `event-payloads.md`. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover` (the chevron travels outward), `focus-visible`
- One side absent renders an empty placeholder so the other stays edge-anchored; there is no `data-*` state, because the component holds none

## Motion & Animations

| Trigger              | Animation / Transition                                        | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| -------------------- | ------------------------------------------------------------- | ------------------------------------------------- | ------------------------------- |
| hover on either side | `transition-[translate] duration-150 ease-out` on the chevron | inline (matches catalog)                          | `motion-reduce:transition-none` |

## Tokens

| Region                | Token (DESIGN.md)                                                |
| --------------------- | ---------------------------------------------------------------- |
| typography (eyebrow)  | `.text-label-sm`                                                 |
| typography (title)    | `.text-label-md`                                                 |
| text (title, chevron) | `var(--text-default)`                                            |
| text (eyebrow)        | `var(--text-muted)`                                              |
| shape                 | `var(--shape-elements)`                                          |
| spacing               | `var(--spacing-md)` / `var(--spacing-xs)` / `var(--spacing-xxs)` |
| ring                  | `var(--ring-color)`                                              |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)` on each link.
- Keyboard map: `Tab` reaches each present side; `Enter` follows it. Nothing else — the component owns no keyboard model of its own.
- ARIA: the root is a `nav` labelled "Page navigation", so a screen reader announces it as a landmark distinct from the page's own nav. That name is **overridable** by passing `aria-label` — two nav landmarks may not share an accessible name (axe `landmark-unique`), so a page carrying two paginations must distinguish them. Each link's accessible name is its eyebrow plus the destination title; the chevrons are decorative (`aria-hidden`).
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons).
- Touch target: each side is a padded block, comfortably over 40×40 px.

## Stories (Storybook)

- Default — both neighbours present.
- Ends of the series — composite story with previous-only and next-only side by side, which is the only way to see that the remaining link stays anchored to its own edge instead of centring. Justified in writing here because that edge-anchoring is the component's one layout decision.

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
