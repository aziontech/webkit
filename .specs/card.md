---
name: card
category: content
structure: monolithic
status: implemented
spec_version: 14
template: 2
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=562-6473
  node_id: 562:6473
checksum: ed9481f1e87e0ccae98167ac3a0dd35dbe9fd1dda86eb95527abadd0e1ddee53
created: 2026-05-22
last_updated: 2026-11-21
---

# Card Box — Component Spec

## Purpose

Use Card for one bordered box of related content in product UI; for a collection of records shown as cards use CardList, for a catalog tile use IntegrationCard, and for the frame of a dashboard chart use ChartCard.

A bordered surface that groups related content under a title, with a header, a body and an optional footer the consumer composes. It holds a settings block, a summary or a form section.

## When to use

- Group related console content into one bordered surface with a title header, a body and an optional footer, such as a settings block, a summary or a form section.
- Host a divided list edge to edge: set `:padded="false"` and put an `Item` list in the body.
- A centered single-card screen (sign-up, onboarding, a success page) that needs header, body and footer regions.

## When NOT to use

- The surface sits above the page as a modal or a side sheet → use `dialog` or `drawer`.
- It is one tier of a pricing comparison → use `pricing-card`.
- It is a framed cell or band of a marketing page → use `registration-frame` or `card-grid`.
- It is a single row of title, description, media and actions → use `item`.
- It is one record of a resource list shown as cards, with selection and fields → use `card-list` (with `useCollection`).
- It is a catalog tile for an integration, an extension or a plugin (logo, vendor, badges, installed state) → use `integration-card`.

## Related

- `item` — rows inside the card; with `padded` set to false, an `Item` list runs its dividers to the card edges.
- `integration-card` — the catalog tile, split out of Card in 6.0.
- `pricing-card` — pricing tier card with its own price hierarchy and action.
- `card-grid` — responsive grid of cells for marketing pages.
- `panel` — the layered shell behind overlays, not an in-page card.
- `empty-state` — goes in the default slot when the card has no data yet.

## Best practices

- Put the body in the default slot.
- Use `title` for a plain heading (rendered as an `h2`). Use the `header` slot only when the header needs another layout: it replaces both the title and `header-actions`.
- `header-actions` content stays hidden until the header is hovered or focused, so keep it to secondary actions and never make it the only way to reach a control.
- Set `:padded="false"` only when the content draws its own inset or needs flush dividers.
- The footer renders only when the `footer` slot has content; don't pass an empty template to reserve space.
- To make the whole card one link (a template or a destination tile), set `href` instead of wrapping the card in an anchor or stretching a hand-made link over it. Keep buttons and other links out of a linked card: its content is the link's name.

## Usage

```vue
<script setup>
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
</script>

<template>
  <Card title="Domains">
    <template #header-actions>
      <Button
        label="Edit"
        variant="ghost"
        size="small"
      />
    </template>
    <p>Associate a custom domain to handle user access.</p>
    <template #footer>
      <Button
        label="Save"
        variant="primary"
        size="medium"
      />
    </template>
  </Card>
</template>
```

**Three ways in** (decision RV-K2-1, rule `azion-ui-content-channels`). Markdown writes `<Card>`, which renders `DocCard` (a docs piece). From the site's page JSON it is the `Card` scene a band draws by name (a `console-showcase-section` with `variant: "diagram"` and `texture: "none"`, so no texture sits behind it); the body is a text child, and the `header`, `header-actions` and `footer` slots stay Vue.

## Props

| Prop     | Type      | Default | Required | JSDoc                                                                                                                                 |
| -------- | --------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `title`  | `string`  | `''`    | false    | Heading rendered in the header when the `header` slot is empty.                                                                       |
| `padded` | `boolean` | `true`  | false    | Pads the content region. Set `false` for flush, edge-to-edge content such as an `ItemList` with full-width dividers.                  |
| `href`   | `string`  | `''`    | false    | When set, the whole card is one link to this URL: the root renders as an anchor. Keep other interactive content out of a linked card. |

## Events

| _none_ | — | — |

## Slots

| Slot             | Scope | Notes                                                                      |
| ---------------- | ----- | -------------------------------------------------------------------------- |
| `header`         | —     | Replaces the default header layout (title + header-actions).               |
| `header-actions` | —     | Actions aligned to the end of the default header; visible on header hover. |
| `default`        | —     | Main card body: children passed without a slot name.                       |
| `footer`         | —     | Footer actions or metadata; omitted when empty.                            |

> The body is the `default` slot (shadcn, Radix).

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- Responsive: the content region is the `@container/card`, so `KeyValueList`, `Field orientation="responsive"` and any `@sm:`/`@md:` utility inside follow the card, not the window. A card used as a shrink-to-fit flex item must get an explicit width (`flex-1`, `w-full`, a grid track): inline-size containment gives the content no intrinsic width.
- Hover-free devices: the `header-actions` slot stays visible where the pointer cannot hover (`@media (hover: none)`).
- Link: with `href` (a safe URL) the root is an `a` with `data-link`, the text stays `--text-default` with no underline, and `focus-visible` draws the `--ring-color` ring offset against `--bg-canvas`; an empty or unsafe `href` keeps the `section`.
- Header only: with `padded` off and nothing in the default slot, the empty content region collapses and the header draws no bottom rule, so the card's own frame is the only line under it.

## Motion & Animations

| Trigger              | Animation / Transition | Token  | Reduced-motion fallback         |
| -------------------- | ---------------------- | ------ | ------------------------------- |
| header action reveal | `transition-opacity`   | inline | `motion-reduce:transition-none` |

## Tokens

| Region     | Token (TOKENS.md)      |
| ---------- | ---------------------- |
| typography | .text-body-sm          |
| title      | .text-title-sm         |
| surface    | `var(--bg-surface)`    |
| text       | `var(--text-default)`  |
| spacing    | `var(--spacing-3)`     |
| shape      | `var(--shape-control)` |
| ring       | `var(--ring-color)`    |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: the root is a `section`; with `href` it is a native anchor whose name is the card's text, so the title comes first in the content.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Internationalization

- Strings: none; every text is consumer content (`title` and the slots).
- Formatting: none.

## Right-to-left

- Layout: logical utilities only; the header actions sit at the end.
- Icons: none of its own.
- Keyboard: no arrow-key navigation of its own.
- User data: the title and the slots are consumer content.

## Responsive

- Container queries: the content region is `@container/card`, so content inside follows the card's width.
- Narrow (≤ 640 px or a narrow container): the header keeps the title and the actions on one row; the content reflows.
- Touch: the `header-actions` slot stays visible on hover-free devices.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: `./card` in `.size-limit.json` (`cn` carries `tailwind-merge`).
- Runtime budget: none: static.
- Heavy parts: none.

## Examples

- Default — title header + default slot body
- Header — an action rendered in the `header` slot, aligned to the end (justified: demonstrates the full-control header path)
- Footer — `footer` region with actions (justified: the footer bar only renders when the slot is filled)
- Flush — `padded=false` edge-to-edge content (mutually-exclusive boolean state of the `padded` prop)
- Link — `href` set: the whole card is one link (justified: the anchor root is its own state, with its own focus ring)
- Page JSON — a `Card` scene with a title and a text child in a `console-showcase-section` entry with `texture: "none"`, rendered by `SitePage`, with the JSON shown. Justified: the site channel (RV-K2-1).

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
- Do not add examples beyond Default + per `variant` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
