---
name: call-to-action
category: marketing
structure: monolithic
status: implemented
spec_version: 2
checksum: 892eb76761001e7d71bff6abdf9e2b449aa9d09b56c3199c38249df41fd90cc8
created: 2026-09-22
last_updated: 2026-09-24
---

# Call To Action — Component Spec

## Purpose

The closing ask of a marketing page: a headline, a supporting sentence and the actions that follow from them, set apart from the surrounding copy by its own surface. It is a panel, not a section header — `section-title` opens a section, `call-to-action` closes one.

Three registers. `panel` sets the copy and its controls on one surface, as a row from `md` up. `split` divides the band in two at a 7fr/3fr ratio: a raised lead cell carrying the headline and the primary action, and an aside carrying the supporting line and the secondary one — each cell pushing its control to the band's floor, so the two actions share a baseline at any height. `split` is the register a product page closes on, where the ask has a primary and a secondary path and the headline turns on a second, muted line.

`lead` is that lead cell standing alone: the same raised surface, the same two-tone headline, with the supporting line moved under it and every control in one row on the band's floor. It is the register for a close that has no second, quieter path to describe — the band states the ask once and offers its actions together, rather than dividing them across two cells of unequal weight.

## When to use

- At the end of a marketing page or section, to carry the reader into signup, docs or sales.
- Whenever a page needs one visually separated block whose whole job is the action.
- Between two sections, as a mid-page ask that should not read as a new section header.
- In `split`, when the ask has two paths of unequal weight — a primary one to start and a secondary one to talk to someone.
- In `lead`, when the band's actions are peers and belong in one row, so an aside cell would have nothing of its own to carry.

## When NOT to use

- To open a section with a headline and optional actions → use `section-title`, which draws a header rule rather than a panel.
- For the page's leading statement and primary CTAs → use `hero`, whose `Hero.Title` owns the `h1`.
- For a dismissible or time-bound announcement → use `message`.
- For a plan's call to action inside pricing → use `card-pricing`, which owns its own action row.

## Related

- `section-title` — opens a section with a header rule; this closes one with a panel.
- `hero` — the page's leading band; its `Hero.Title` owns the statement and the `h1`.
- `frame-box` — the registration frame the band draws when `framed` is on, and the one the page supplies around it when off.
- `button` — the controls composed into the `actions` and `aside-actions` slots.
- `overline` — the `//`-prefixed eyebrow the band renders above the headline.

## Best practices

- `framed` decides who draws the rule. On, the band draws its own registration frame — vertical rules handed back to the column, a tick at its floor. Off, the rule and the corner marks belong to the `section-module` or `frame-box` the page assembles it into, so a band placed in an already-framed column never lands a second hairline on the column's own.
- Keep `title` to one line and one ask. A panel that poses two questions gets neither answered.
- Put the controls in the `actions` slot; the panel lays them out as a row beside the copy from `md` up and stacks them full-width below it.
- Lead with the primary action and keep secondary ones `outlined` or `text`, so the panel has one obvious target.
- Use `eyebrow` only when the panel needs naming out of context; the headline usually carries the ask on its own.
- In `split`, `title` states the claim and `title-muted` states its consequence — one sentence in two tones, not two headlines. The band renders them as two spans of a single `h2`, so a screen reader reads one heading.
- In `split`, put the primary control in `actions` and the secondary one in `aside`; each cell floors its own control, which is what gives the two a shared baseline. `actions` stretches its child full-width below `md`; `aside` stretches its child at every width, so a control drawn to size to its own content goes in a wrapper there.
- In `lead`, every control goes in `actions` — they lay out as one row from `md` up and stack full-width below it. The copy column is capped at `--container-2xl` so the headline keeps a readable measure however wide the band runs.
- `lead` sets the copy-to-actions gap at `--spacing-xl`, not the `--spacing-xxl` the other two use. In `split` that larger number is the *floor* of a stretched cell — what pushes the control onto the band's bottom edge — and in `panel` the controls sit beside the copy from `md` up. In `lead` nothing stretches and nothing sits beside, so `--spacing-xxl` stops reading as a floor and starts reading as a hole.
- Leave `framed` on when the band stands in a section column of its own, and off when the page already wraps it in a `frame-box` — two frames draw two hairlines on the same edge.

## Usage

```vue
<script setup>
import CallToAction from '@aziontech/webkit/call-to-action'
import Button from '@aziontech/webkit/button'
</script>

<template>
  <CallToAction
    eyebrow="Get started"
    title="Ship your first application today."
    description="Deploy to every edge location in seconds. No credit card required."
  >
    <template #actions>
      <Button label="Start for free" />
      <Button
        kind="outlined"
        label="Talk to sales"
      />
    </template>
  </CallToAction>
</template>
```

The `lead` register, the lead cell standing alone:

```vue
<script setup>
import CallToAction from '@aziontech/webkit/call-to-action'
import Button from '@aziontech/webkit/button'
</script>

<template>
  <CallToAction
    kind="lead"
    eyebrow="Build"
    title="Built by you,"
    title-muted="or your agents."
    description="Same CLI, same docs over MCP, same deploy."
  >
    <template #actions>
      <Button
        kind="secondary"
        label="Deploy now"
      />
      <Button
        kind="outlined"
        label="Read the docs"
      />
    </template>
  </CallToAction>
</template>
```

The `split` register, which a product page closes on:

```vue
<script setup>
import CallToAction from '@aziontech/webkit/call-to-action'
import Button from '@aziontech/webkit/button'
</script>

<template>
  <CallToAction
    kind="split"
    eyebrow="Build"
    title="Build once."
    title-muted="Run anywhere."
    description="Get a faster path to launch, less latency, and less infrastructure overhead."
  >
    <template #actions>
      <Button
        kind="secondary"
        label="Start for free"
      />
    </template>
    <template #aside>
      <Button
        kind="outlined"
        label="Talk to our team"
      />
    </template>
  </CallToAction>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `title` | `string` | `—` | true | Headline of the band, rendered as its `h2`. |
| `titleMuted` | `string` | `''` | false | Second line of the headline, set in muted ink; rendered as a second span of the same `h2`. |
| `description` | `string` | `''` | false | Supporting sentence — under the headline in `panel` and `lead`, in the aside cell in `split`; overridden by the default slot. |
| `eyebrow` | `string` | `''` | false | Short uppercase overline rendered above the headline. |
| `kind` | `CallToActionKind` | `'panel'` | false | Layout of the band: `panel` sets the copy and its controls on one surface, `split` divides it into a raised lead cell and an aside that each floor their own control, `lead` is that lead cell standing alone with every control in it. |
| `framed` | `boolean` | `false` | false | Draw the band's own registration frame. Turn it off when the page already wraps the band in a frame. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Description body; replaces the `description` prop when provided. |
| `actions` | — | The controls the band exists to offer; in `split`, the lead cell's primary control. |
| `aside` | — | The aside cell's control in `split`; ignored in `panel` and `lead`, where every control belongs in `actions`. |

## States

- Visual states: `default`
- Register: `data-kind="panel" | "split" | "lead"` on the root
- The band holds no state of its own; controls composed into `actions` / `aside` keep theirs

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (headline) | `.text-heading-xl` |
| typography (description, `panel`) | `.text-body-lg` |
| typography (description, `split`) | `.text-heading-sm` |
| typography (description, `lead`) | `.text-heading-sm` |
| headline text | `var(--text-default)` |
| headline second line | `var(--text-muted)` |
| description text | `var(--text-muted)` |
| panel surface (`panel`) | `var(--bg-surface)` |
| lead cell surface (`split`, `lead`) | `var(--bg-surface-raised)` |
| panel rules and marks | `var(--border-default)` |
| spacing (panel padding, `panel`) | `var(--spacing-xxl)` |
| spacing (cell padding, `split`, `lead`) | `var(--spacing-xl)` |
| copy measure (`lead`) | `var(--container-2xl)` |
| spacing (between controls, `lead`) | `var(--spacing-sm)` |
| spacing (copy stack) | `var(--spacing-lg)` |
| spacing (copy to actions, `panel`, `split`) | `var(--spacing-xxl)` |
| spacing (copy to actions, `lead`) | `var(--spacing-xl)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: not applicable to the panel itself; controls composed into `actions` keep their own `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` ring.
- Keyboard map: none of its own — `Tab` reaches only the controls placed in the `actions` slot, in DOM order.
- ARIA: the headline is a real `h2` — rendered by the composed `section-title` in `panel`, and by the band itself in `split` and `lead`, where `title` and `title-muted` are two spans of that one heading so it is announced as a single string. The band is a `<section>` named by its `title`, reachable as a landmark with a name; no `role` is added.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the headline is `var(--text-default)` on `var(--bg-surface)`; the description uses `var(--text-muted)`, which clears AA on the dark canvas and is a known theme-level shortfall on the light one (see `big-numbers`).
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the panel is static.
- Touch target ≥40×40 px — both action slots stretch their children to full width below the breakpoint, so slotted buttons keep their own target size.

## Stories (Storybook)

- Default
- Types — the `panel`, `split` and `lead` registers, one under the other
- WithEyebrow — the overline above the headline (justified: `eyebrow` is absent from the default args and changes the panel's vertical rhythm)

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
