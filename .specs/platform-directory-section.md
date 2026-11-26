---
name: platform-directory-section
category: section
structure: monolithic
template: 2
status: implemented
spec_version: 5
created: 2026-11-05
last_updated: 2026-11-16
checksum: 5d81c318072233f1ef368325e91ade70744163d8d3e59fa638879780be3dca65
---

# PlatformDirectorySection — Component Spec

## Purpose

A directory of Azion's products under a section title: one column per product group (Build, Store, Secure, Observe), each row an icon, a product name and one line about it, linking to that product. It is a page section — the site places it from a `{ _id: 'platform-directory-section', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `module`, `module-header`, `registration-frame` and `link-directory` rather than owning any anatomy of its own.

## When to use

- Use PlatformDirectorySection for the Azion products directory band.
- On Home, right under the hero, to show every product the platform offers at a glance.
- On a solution, product or pricing page that repeats the full product map.

## When NOT to use

- For a handful of icon-led use cases → use `customer-use-cases-section`.
- For a site-wide navigation menu → use `navigation-menu`.
- Inside another band's cell → compose `link-directory` directly.

## Related

- `link-directory` — the named navigation landmark whose columns and rows this band fills.
- `module-header` — the headline over the directory.

## Best practices

- Keep to four groups or fewer; the directory fans out to one column per group at the large breakpoint, up to four, so one, two or three groups never leave an empty cell.
- Give each item an `href`; an item without a title or a link is skipped, and a group left with no items is skipped too.
- Set `ariaLabel` so the directory's navigation landmark is told apart from the site navigation; left empty, the landmark takes the `title`.
- Use `eyebrow` for the short label above the headline (the page's name for the product map) and `description` for one sentence under it.
- Give the band an `anchor` when a page links to it with a `#hash`.

## Usage

```vue
<script setup>
  import PlatformDirectorySection from '@aziontech/ui/platform-directory-section'
</script>

<template>
  <PlatformDirectorySection
    anchor="products"
    eyebrow="Platform"
    title="Everything you need to build and run applications"
    description="Build, store, secure and observe applications on one platform."
    aria-label="Azion products"
    :groups="[
      {
        title: 'Build',
        items: [
          {
            icon: 'az az-functions',
            title: 'Functions',
            description: 'Run code globally with no cold starts',
            href: '/products/functions'
          }
        ]
      },
      {
        title: 'Store',
        items: [
          {
            icon: 'az az-kv-store',
            title: 'KV Store',
            description: 'Store key-value data with low latency',
            href: '/products/kv-store'
          }
        ]
      }
    ]"
  />
</template>
```

## Props

| Prop          | Type                              | Default | Required | JSDoc                                                                                                                                                                                     |
| ------------- | --------------------------------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `anchor`      | `string`                          | `''`    | false    | In-page id set on the band so a `#hash` link can scroll to it.                                                                                                                            |
| `eyebrow`     | `string`                          | `''`    | false    | Short label above the headline; shown only with a title.                                                                                                                                  |
| `title`       | `string`                          | `''`    | false    | Headline over the directory, rendered by the section title as its `h2`; the band renders no header, eyebrow or description when empty.                                                    |
| `description` | `string`                          | `''`    | false    | One sentence under the headline; shown only with a title.                                                                                                                                 |
| `ariaLabel`   | `string`                          | `''`    | false    | Accessible name of the directory's navigation landmark; empty uses the title.                                                                                                             |
| `groups`      | `PlatformDirectorySectionGroup[]` | `[]`    | false    | The columns, in order; each is `{ title, items }` where every item is `{ icon, title, description, href }`. Items without a title or an `href` are skipped, and so are groups left empty. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- One column per group from the large breakpoint, up to four (`link-directory`'s `columns` is 2, 3 or 4), one column below the small one; the column layout is `link-directory`'s own
- No empty cell: a single group spans the whole row (`data-span="full"`), and with three groups the third spans both columns between the small and the large breakpoints (`data-span="pair"`), so the rule colour never shows through a missing column
- Header: with a `title`, the section title renders the eyebrow and the description that are set around the headline; without one, no header renders
- Anchor: the root carries `id` = `anchor` when set, with a scroll margin so a `#hash` jump clears a sticky header
- Empty: when no group carries a linked item the band renders nothing — not the header, not the frame

## Motion & Animations

_none_

## Tokens

| Region                | Token (TOKENS.md)       |
| --------------------- | ----------------------- |
| frame rules and marks | `var(--border-default)` |
| column fill           | `var(--bg-canvas)`      |
| anchor scroll offset  | `var(--spacing-2xl)`    |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the composed `link-directory` item links.
- Keyboard map: `Tab` moves through the product links in reading order; `Enter` follows one. Nothing else in the band is interactive.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the directory is `link-directory`'s `nav`, named by `ariaLabel` (or the title when `ariaLabel` is empty), and each column's overline heading names its list of rows.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components.
- `motion-reduce:transition-none motion-reduce:transform-none` — the row hover belongs to `link-directory`, which carries its own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — each row is a full-width link taller than 40 px.

## Internationalization

- No built-in strings: every visible string arrives through props.

## Right-to-left

- Layout: logical utilities and the composed components' own mirroring, so the directory cells fill from the inline start.
- Icons: action chevrons mirror (owned by `button`).
- Keyboard: unchanged.

## Responsive

- One cell per row on phones (`mobileColumns: 1`); from the grid's breakpoints the cells fill the computed track count, wide cells spanning two tracks from small and large.
- No horizontal scroll at 320 px.

## Performance

- Bundle budget: 5 KB for `./platform-directory-section` gzip in `.size-limit.json`.
- Renders static cells and links; no state, timers or observers.

## Examples

- Default
- Three groups — the directory fans out to three columns, with no empty cell at any width.
- With header — eyebrow, headline and description over the directory, with an `anchor` for in-page links.

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
