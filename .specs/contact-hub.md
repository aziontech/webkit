---
name: contact-hub
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: 2d8e39974295440e86995b3ab82a9defae99d770b64470a8cce56e9c3b935db0
---
# ContactHub — Component Spec

## Purpose

The band under the Contact title band: the team lanes side by side (Sales and Support), each with its scope in one sentence and the action that reaches that team, over a row of self-serve channels. It is a page section — the site places it from a `{ _id: 'contact-hub', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `card-grid`, `topic` and `button`. A lane can carry a second link to the system status page, so a reader can check for an incident before opening a ticket.

## When to use

- On the Contact page, to route a reader to the team or channel that answers them.

## When NOT to use

- For a closing ask at the end of a page → use `closing-call-to-action`.
- For a grid of product use cases → use `use-cases`.

## Related

- `topic` — each self-serve channel is a linked topic.
- `use-cases` — the sibling band of icon-led topics.

## Best practices

- Keep two lanes so they split the frame evenly, and three channels for the three-column row.
- Keep each lane's description to one sentence that states what that team handles.
- Set `target: '_blank'` on a channel or status link that leaves the site.

## Usage

```vue
<script setup>
import ContactHub from '@aziontech/webkit/contact-hub'
</script>

<template>
  <ContactHub
    :lanes="[
      {
        icon: 'pi pi-briefcase',
        title: 'Sales',
        description: 'Discuss your requirements or get custom pricing.',
        action: { label: 'Talk to sales', href: '/contact/sales' }
      }
    ]"
    :channels="[
      {
        icon: 'pi pi-book',
        title: 'Read the docs',
        description: 'Guides and API reference for every Azion product.',
        href: 'https://www.azion.com/en/documentation/',
        target: '_blank'
      }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `lanes` | `ContactHubLane[]` | `[]` | false | The team lanes side by side, in order; each is `{ icon, title, description, action?, statusLink? }` where `action` is the lane's button and `statusLink` the system status link beside it. |
| `channels` | `ContactHubChannel[]` | `[]` | false | The self-serve channels under the lanes, in order; each is `{ icon, title, description, href, target? }`, rendered as a linked topic. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- Empty: the lanes frame renders only when `lanes` is set and the channels frame only when `channels` is set; with neither the band renders nothing but its root
- A lane's action and status link render only when given

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| status link hover | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| lane heading | `.text-body-md`, `var(--text-muted)` |
| lane description | `.text-heading-sm`, `var(--text-default)` |
| lane glyph | `var(--primary)` |
| status link | `var(--bg-surface)`, `var(--bg-surface-raised)`, `var(--border-default)`, `.text-button-lg` |
| status dot | `var(--success-contrast)` |
| frame rules and marks | `var(--border-default)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the status link carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`; buttons and topics own theirs.
- Keyboard map: `Tab` reaches each lane action, the status link and each channel; `Enter` follows it.
- ARIA: the band is an unnamed `<section>`; each lane heading and each channel is an `h2`, so the outline reads one entry per route. Glyphs and the status dot are `aria-hidden`. A link with `target: '_blank'` carries `rel="noopener noreferrer"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): lane heading `var(--text-muted)`, description `var(--text-default)`.
- `motion-reduce:transition-none` on the status link's colour transition.
- Touch target ≥40×40 px — the status link is `h-10`, buttons are large, channels are whole-cell links.

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
