---
name: platform-directory
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: 9bda24203f42596e7292d4568df71eca35995949c4da0bde9a09996ff721202f
---

# PlatformDirectory — Component Spec

## Purpose

A directory of Azion's products under a section title: one column per product group (Build, Store, Secure, Observe), each row an icon, a product name and one line about it, linking to that product. It is a page section — the site places it from a `{ _id: 'platform-directory', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `section-module`, `section-title`, `frame-box` and `column-navigation` rather than owning any anatomy of its own.

## When to use

- On Home, right under the hero, to show every product the platform offers at a glance.
- On a solution, product or pricing page that repeats the full product map.

## When NOT to use

- For a handful of icon-led use cases → use `use-cases`.
- For a site-wide navigation menu → use `navigation-menu`.
- Inside another band's cell → compose `column-navigation` directly.

## Related

- `column-navigation` — the named navigation landmark whose columns and rows this band fills.
- `section-title` — the headline over the directory.

## Best practices

- Keep to four groups; the directory fans out to four columns at the large breakpoint.
- Give each item an `href`; an item without a title or a link is skipped, and a group left with no items is skipped too.
- Set `ariaLabel` so the directory's navigation landmark is told apart from the site navigation.

## Usage

```vue
<script setup>
import PlatformDirectory from '@aziontech/webkit/platform-directory'
</script>

<template>
  <PlatformDirectory
    title="Everything you need to build and run applications"
    aria-label="Azion products"
    :groups="[
      {
        title: 'Build',
        items: [
          { icon: 'ai ai-edge-functions', title: 'Functions', description: 'Run code globally with no cold starts', href: '/products/functions' }
        ]
      },
      {
        title: 'Store',
        items: [
          { icon: 'ai ai-edge-kv', title: 'KV Store', description: 'Store key-value data with low latency', href: '/products/kv-store' }
        ]
      }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `title` | `string` | `''` | false | Headline over the directory, rendered by the section title as its `h2`; the band renders no header when empty. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the directory's navigation landmark. |
| `groups` | `PlatformDirectoryGroup[]` | `[]` | false | The columns, in order; each is `{ title, items }` where every item is `{ icon, title, description, href }`. Items without a title or an `href` are skipped, and so are groups left empty. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- Four columns from the large breakpoint, one column below the small one; the column layout is `column-navigation`'s own
- Empty: when no group carries a linked item the band renders nothing — not the header, not the frame

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| frame rules and marks | `var(--border-default)` |
| column fill | `var(--bg-canvas)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the composed `column-navigation` item links.
- Keyboard map: `Tab` moves through the product links in reading order; `Enter` follows one. Nothing else in the band is interactive.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the directory is `column-navigation`'s `nav`, named by `ariaLabel`, and each column's overline heading names its list of rows.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components.
- `motion-reduce:transition-none motion-reduce:transform-none` — the row hover belongs to `column-navigation`, which carries its own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — each row is a full-width link taller than 40 px.

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
