---
name: architecture-tabs-section
category: section
structure: monolithic
status: implemented
spec_version: 6
created: 2026-11-05
last_updated: 2026-11-16
checksum: 49a0de1404e0c92eee4eb9c3bc004e01011f930d5af8cd3672613e44fe395ce4
---

# ArchitectureTabsSection — Component Spec

## Purpose

The architecture band of a product page: a horizontal section title with one large button, over a row of up to five tabs whose active tab draws its named diagram the full width of the frame. It is a page section — the site places it from a `{ _id: 'architecture-tabs-section', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `button`, `registration-frame`, `media-tabs` and `diagram`. The tabs advance on a timer that pauses under the pointer or keyboard focus and never runs under reduced motion; that state is owned by `media-tabs`.

## When to use

- Use ArchitectureTabsSection only when every tab shows a full-width official diagram (up to five tabs).
- To plot several architectures of one product, or one request across the platform, one diagram at a time.

## When NOT to use

- For features shown by an illustration each → use `feature-tabs-section`.
- For a scroll-driven walkthrough → use `feature-scroll-section`.

## Related

- `media-tabs` — the timed tab row this section renders through.
- `diagram` — the named architecture diagram each tab draws.

## Best practices

- Keep to five tabs with `tabsSide` `top` or `bottom`, three with `start` or `end`; tabs past the limit are not rendered.
- Give every tab a `diagram` from the diagram library and a stable `value`.

## Usage

```vue
<script setup>
  import ArchitectureTabsSection from '@aziontech/webkit/architecture-tabs-section'
</script>

<template>
  <ArchitectureTabsSection
    eyebrow="Routing"
    title="Every AI request through one control point"
    description="Every client calls one endpoint."
    tabs-side="bottom"
    :tabs="[
      {
        value: 'request-path',
        title: 'Request path',
        description: 'A call crosses Firewall before it reaches a model.',
        diagram: 'ai-gateway'
      },
      {
        value: 'failover',
        title: 'Provider failover',
        description: 'The gateway moves to the next model on the alias.',
        diagram: 'ai-gateway-provider-failover'
      }
    ]"
    :primary-action="{ label: 'Docs', href: '/docs', trailing: true }"
  />
</template>
```

## Props

| Prop               | Type                           | Default     | Required | JSDoc                                                                                                                                                                                                                                         |
| ------------------ | ------------------------------ | ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `anchor`           | `string`                       | `''`        | false    | In-page id set on the band so a `#hash` link can scroll to it.                                                                                                                                                                                |
| `eyebrow`          | `string`                       | `''`        | false    | Eyebrow above the section title.                                                                                                                                                                                                              |
| `title`            | `string`                       | `''`        | false    | Headline of the band, rendered by the horizontal section title as its `h2`; the band renders no header when empty.                                                                                                                            |
| `description`      | `string`                       | `''`        | false    | Supporting sentence beside the headline.                                                                                                                                                                                                      |
| `tabsSide`         | `ArchitectureTabsSectionSide`  | `'top'`     | false    | Side of the diagram the tabs sit on: `top`, `bottom`, `start` or `end`; start and end hold up to three tabs.                                                                                                                                  |
| `tabs`             | `ArchitectureTabsSectionTab[]` | `[]`        | false    | The architectures, in order; each is `{ value, title, description, diagram, diagramAriaLabel? }` where `diagram` is the name of the diagram drawn while the tab is active and `diagramAriaLabel` replaces the description that diagram ships. |
| `autoplay`         | `boolean`                      | `true`      | false    | Opens the next tab on a timer, with the composed tabs' visible pause control.                                                                                                                                                                 |
| `autoplayInterval` | `number`                       | `6000`      | false    | Milliseconds each tab holds before the next one opens.                                                                                                                                                                                        |
| `primaryAction`    | `SectionTitleAction`           | `undefined` | false    | Large button in the section title; `{ label, href, trailing?, target? }`. Omitted when absent.                                                                                                                                                |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`; the active tab, its progress and the timer are owned by `media-tabs`
- Empty: when `tabs` is empty the band renders nothing — not the header, not the frame
- The header renders only when `title` is set
- The timer holds each tab for `autoplayInterval` milliseconds (owned by `media-tabs`)

## Motion & Animations

_none_

## Tokens

| Region       | Token (DESIGN.md)       |
| ------------ | ----------------------- |
| diagram fill | `var(--bg-surface)`     |
| frame rule   | `var(--border-default)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `media-tabs` (the tabs) and `button`.
- Keyboard map: `Tab` reaches the button and the tab row; the tab row's keys are owned by `media-tabs`.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the headline is the section title's `h2`; each diagram carries the description its spec ships, or the tab's `diagramAriaLabel` when one is set.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `section-title`, `media-tabs` and `diagram`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the timer never runs under reduced motion (owned by `media-tabs`).
- Touch target ≥40×40 px: the large button and the tab rows.

## Examples

- Default — carries `diagramAriaLabel` on one tab and a custom `autoplayInterval`.

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
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
