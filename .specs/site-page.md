---
name: site-page
category: marketing
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 89cd623be6b7e960d1a9108db9e2b9d3eac9fc9ee4782383782c30b54c3daf1d
created: 2026-11-12
last_updated: 2026-11-13
---

# SitePage — Component Spec

## Purpose

The page renderer of the marketing site: it takes a page as data — the page JSON `{ hero, sections }` whose entries are `{ _id, props, scenes?, gap?, submission? }` — and renders each entry with the page section published at `@aziontech/webkit/<_id>`, binding `props` onto it. Openings (`hero`) run full bleed; the column (`sections`) sits in one `SectionContainer max-width="site"` with a hatched `SectionGap` before each band and one more after the last, the hatched break a page closes on before the footer (in the design sample that break is drawn by the closing call to action of every page), as the design sample's `SitePage` lays a page out. A scene named in `scenes` is resolved by name through the scene registry and drawn in the section's slot of that name (`hero-band` `top` / `bottom`, `console-panel` `scene`). Every section and scene is loaded on demand, so a page pulls in only the sections it lists. An `_id` or scene name the renderer does not know is skipped with a development warning naming it, never silently.

It reverses the earlier rule in `.claude/docs/SECTIONS.md` ("the package ships no registry and no dispatcher"): the owner decided to ship the renderer (ROADMAP M2.10 row 44), and that doc is updated with it.

**Section registry.** `src/components/marketing/site-page/site-page-sections.ts`, beside the component, maps every folder in `src/components/sections/` except `site-nav` and `site-footer` (the frame, which `shells/website` owns) to a `() => import('../../sections/<name>/<name>.vue')` thunk, keyed by the folder name, which is the `_id`. The component test fails when a section folder has no entry.

**Scene registry.** `src/assets/scene-registry.ts` exports `sceneAssets` (scene name to a `() => import(...)` thunk), the `SceneName` union of its keys and `resolveScene(name)`, which returns one cached async component per name or `null` for a name it does not hold. It is seeded with `BrandGlobeScene` and `SpinningGlobe` (the two scenes `media-split-band` drew from a private map) and with `Diagram`, `ProductWidget` and `Illustration`, the components a scene slot already takes. `media-split-band` moves from its private `SCENES` constant onto it in the same change, so the system has one scene map, and a scene ported later (`ConsoleApplicationScene`, `ConsoleTraceScene`, `FunctionsHeroCanvas`) becomes drawable on every page by one entry there.

**Root.** A plain `div` with no role, carrying `v-bind="$attrs"` and the `data-testid` fallback `marketing-site-page`.

## When to use

- Rendering a marketing page stored as data (a CMS entry, a JSON file, the site's page modules) on WebKit sections.
- A campaign landing built from existing sections with no page-specific code.

## When NOT to use

- A page that composes marketing primitives by hand (`Hero`, `MediaSplit`, `CardGrid`) — write the SFC with `SectionContainer` / `SectionGap` instead.
- A console screen or a docs page — use `shells/console` or `shells/documentation`.
- One section on its own — import that section (`@aziontech/webkit/<name>`) and bind its props.

## Related

- `section-container` — the column the renderer lays `sections` in.
- `section-gap` — the hatched break it draws before each band.
- The page sections (`hero-band`, `use-cases`, `faq-section`, …) — what each `_id` names.
- `shells/website` — the nav and footer frame a page renders inside.

## Best practices

- Write `_id` as the section's public subpath (`use-cases` for `@aziontech/webkit/use-cases`); the `props` object is exactly what the section's own `site-*.json` example carries.
- Put openings (`hero-band`, `hero-form`, `hero-with-opening`, `hero-copy-on-top-art`, `article-body`, `pricing-plans`) in `hero` and every band after them in `sections`.
- Keep scenes as names (`{ component: 'BrandGlobeScene' }`), never as code, so the page stays plain JSON.
- Use `gap` only to change the default break: `none` for a band that follows its neighbour with no break, `small` for two bands that belong together.
- Keep transport details of a form (`endpoint`, `hiddenFields`) in `submission`, next to `props`; the renderer passes the entry back on `submit` and the site sends.
- Watch the development console after changing a page: an unknown `_id` or scene is named there.
- Keep one opening per page: every opening renders the page `h1`, so two openings put two `h1` on the page.
- Render the page on the server when layout shift matters: a section still loading on the client reserves no space.

## Usage

```vue
<script setup>
  import SitePage from '@aziontech/webkit/site-page'

  const page = {
    hero: [
      {
        _id: 'hero-band',
        props: { kind: 'centered-band', title: 'Deliver content fast, worldwide' }
      }
    ],
    sections: [
      {
        _id: 'faq-section',
        props: {
          title: 'Frequently asked questions',
          items: [{ value: 'what', question: 'What is it?', answer: 'A page from data.' }]
        }
      }
    ]
  }
</script>

<template>
  <SitePage v-bind="page" />
</template>
```

## Props

| Prop       | Type                | Default    | Required | JSDoc                                                                                                                                                               |
| ---------- | ------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hero`     | `SitePageSection[]` | `() => []` | false    | Opening sections, rendered full bleed above the column in order; each is `{ _id, props?, scenes?, gap?, submission? }`.                                             |
| `sections` | `SitePageSection[]` | `() => []` | false    | Column sections, rendered in order inside the site column with a hatched gap before each and after the last; each is `{ _id, props?, scenes?, gap?, submission? }`. |

Exported types, beside the component:

- `SitePageSection` — `{ _id: string; props?: Record<string, unknown>; scenes?: Record<string, SitePageScene>; gap?: SitePageGap; submission?: Record<string, unknown> }`. `_id` is the section's public subpath; `props` is bound onto the section; `scenes` maps a slot name of the section to the scene drawn in it; `gap` sets the break before a column section (`none`, `small`, `medium`; default `medium`, ignored on openings); `submission` is opaque to the renderer and handed back on `submit`.
- `SitePageScene` — `{ component: string; props?: Record<string, unknown> }`: a scene registry name and the props bound onto it, merged with the slot's own props; on a key clash the slot's props win, so a live value the section passes (`console-panel`'s `tab`) is never shadowed by page data.
- `SitePageGap` — `'none' | 'small' | 'medium'`.
- `SitePageSubmit` — `{ section: SitePageSection; values: Record<string, string> }`: the entry whose form was submitted and its values.

## Events

| Event    | Payload                                         | Notes                                                                                                                                                                                           |
| -------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `submit` | `(event: SubmitEvent, payload: SitePageSubmit)` | A section's form passed its own validation (`hero-form`, `closing-call-to-action-newsletter`); the site sends it and feeds `loading` / `submitted` / `error` back through that entry's `props`. |

## Slots

| _none_ | — | — |

## States

- No state of its own; each section owns its states (`loading`, `submitted`, `error` on a form band come from its `props`).
- An unknown `_id` or scene name renders nothing in its place and warns once per name in development.
- A section or scene still loading renders nothing in its place until its chunk arrives.
- A section or scene whose chunk fails to load (network failure, deploy skew) or takes longer than 10 s renders nothing in its place, the rest of the page keeps rendering, and a development warning names the `_id` or scene; it does not retry (`defineAsyncComponent` with `timeout` and `onError`).

## Motion & Animations

_none_

## Tokens

| Region           | Token (DESIGN.md)                                                          |
| ---------------- | -------------------------------------------------------------------------- |
| column           | From `SectionContainer` (`max-width="site"`, `var(--layout-measure-site)`) |
| breaks           | From `SectionGap` (`hatch`, `small` / `medium`)                            |
| sections, scenes | Their own tokens                                                           |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The renderer adds no landmark, heading or focusable element of its own; each section owns its landmark (`<section>` named by its title) and its keyboard model.
- Openings render before the column, so the page `h1` (in the opening) comes first in reading order.
- The breaks are decorative (`SectionGap` is `aria-hidden`).
- Keyboard map: none of its own; focus moves through the sections in page order.

## Internationalization

- Built-in strings: none. Every visible string comes from the page data.
- Development warnings are English and never rendered.

## Right-to-left

- Layout: block flow only; the column and the sections use logical utilities.
- Icons: none of its own.
- Keyboard: none of its own.
- User data: none of its own; sections isolate their own user data.

## Responsive

- Container queries: none of its own; the column follows `SectionContainer` and each section its own breakpoints.
- Narrow (≤ 640 px): the column runs edge to edge as `SectionContainer` does; sections stack themselves.
- Touch: no targets of its own.
- Reflow: no horizontal scroll at 320 px from the renderer; the sections hold the same contract.

## Performance

- Bundle budget: 2.5 KB gzip for `./site-page` in `.size-limit.json`, `entryOnly: true` (every section and scene is its own async chunk).
- Runtime budget: none of its own; a page loads only the sections and scenes it lists.
- Heavy parts: every section and every scene is lazy-loaded through `defineAsyncComponent`.

## Examples

- Default — a short product page from data: an opening `hero-band`, then `use-cases`, `faq-section` and a `closing-call-to-action`, the column gaps included.

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
