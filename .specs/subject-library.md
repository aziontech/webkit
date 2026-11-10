---
name: subject-library
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: ec14e1a7b5aa88da7646bfbce60403c173cbf83b2922cb6c7eb0c4a0722cefef
---

# SubjectLibrary — Component Spec

## Purpose

A library of learning subjects in a divider grid: each subject is one framed card with its name, what it covers and a list of its article links, and an optional closing call to action spans the grid's last two cells so the grid ends without an empty cell. It is a page section — the site places it from a `{ _id: 'subject-library', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `section-module`, `frame-box`, `card-grid`, `call-to-action` and `button` rather than owning any anatomy of its own.

## When to use

- On the Learning Center index, to list every subject with the articles that teach it.
- Whenever a page needs a grid of topic cards that each carry a short list of links, closed by one call to action.

## When NOT to use

- For a grid of features with artwork → use `feature-tiles`.
- For a filterable list of rows → use `listing-browser`.
- Inside another band's cell → compose `frame-box` and `call-to-action` directly.

## Related

- `call-to-action` — the `lead` band drawn in the closing cell.
- `card-grid` — the divider grid the subject cards sit in.

## Best practices

- Give every subject a unique `slug`; it is the card's `id`, so a `#slug` link lands on it.
- Keep the subject count at a multiple of three plus one when `closing` is set, so the closing cell fills the last row exactly.
- Keep each subject's articles to a handful; the card grows with its list.

## Usage

```vue
<script setup>
import SubjectLibrary from '@aziontech/webkit/subject-library'
</script>

<template>
  <SubjectLibrary
    anchor="subjects"
    :subjects="[
      {
        slug: 'cdn',
        title: 'CDN',
        description: 'Reduce latency by caching content close to users.',
        articles: [{ label: 'What is a CDN?', href: '/learning/cdn/what-is-a-cdn/' }]
      }
    ]"
    :closing="{
      eyebrow: 'Next step',
      title: 'Put what you learned to work.',
      titleMuted: 'On Azion.',
      description: 'Deploy your first application in minutes.',
      primaryAction: { label: 'Start for free', href: '/signup' },
      secondaryAction: { label: 'Talk to a specialist', href: '/contact', trailing: true }
    }"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `anchor` | `string` | `''` | false | In-page `id` of the band, the target of a `#hash` link. |
| `subjects` | `SubjectLibrarySubject[]` | `[]` | false | The subject cards, in order; each is `{ slug, title, description, articles }` where every article is `{ label, href }`. Subjects without a title or a linked article are skipped. |
| `closing` | `SubjectLibraryClosing` | `undefined` | false | Call to action across the grid's last two cells; `{ eyebrow, title, titleMuted, description, primaryAction, secondaryAction }` where each action is `{ label, href, trailing?, target? }`. Omitted when absent. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- Three columns from the large breakpoint, one below the small one; the closing cell spans two columns from the small breakpoint up
- Empty: when no subject carries a title and a linked article the band renders nothing — not the grid, not the closing cell

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| hover on an article link | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (subject title) | `.text-heading-sm` |
| typography (description, articles) | `.text-body-sm` |
| subject title | `var(--text-default)` |
| description and article links | `var(--text-muted)` |
| article link hover | `var(--text-default)` |
| card fill | `var(--bg-canvas)` |
| closing cell fill | `var(--bg-surface-raised)` |
| card inset | `var(--spacing-xl)` |
| card rhythm | `var(--spacing-lg)` |
| focus ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: each article link draws `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)`; the closing buttons own theirs.
- Keyboard map: `Tab` moves through the article links in reading order, then the closing actions; `Enter` follows one. Nothing else in the band is interactive.
- ARIA: the band is a `<section>` carrying `anchor` as its `id`; each subject is an `h3` over a `role="list"` of links; the closing cell is `call-to-action`'s own section, named by its title.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): titles `var(--text-default)`, descriptions and links `var(--text-muted)`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the article link colour transition carries `motion-reduce:transition-none`.
- Touch target ≥40×40 px — the closing actions are large `button`s; article links are inline text links inside a list.

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
