---
name: card
category: content
structure: monolithic
status: implemented
spec_version: 2
template: 2
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=562-6473
  node_id: 562:6473
checksum: c3ba957e93e1171881d38cc160a0925dc7e67a4fc8afe8ca8bd27fe6ffe4b6a7
created: 2026-05-22
last_updated: 2026-11-11
---

# Card Box — Component Spec

## Purpose

Displays content or metadata in the UI. Lives at `packages/webkit/src/components/content/card/`.

## When to use

- Group related console content into one bordered surface with a title header, a body and an optional footer, such as a settings block, a summary or a form section.
- Host a divided list edge to edge: set `:padded="false"` and put an `Item` list in the `content` slot.
- A centered single-card screen (sign-up, onboarding, a success page) that needs header, body and footer regions.
- A catalog tile for an integration, an extension or a plugin: set `kind="integration"` for the logo, the name, the vendor, a short description, badges, the installed state and one action.

## When NOT to use

- The surface sits above the page as a modal or a side sheet → use `dialog` or `drawer`.
- It is one tier of a pricing comparison → use `card-pricing`.
- It is a framed cell or band of a marketing page → use `frame-box` or `card-grid`.
- It is a single row of title, description, media and actions → use `item`.
- It is one record of a resource list shown as cards, with selection and fields → use `cards` (with `useCollection`).
- It is a template tile in a gallery with no vendor, badge or install state → keep `kind="default"` with a `content` slot (see `platform/view/template-browser`).

## Related

- `item` — rows inside the card; with `padded` set to false, an `Item` list runs its dividers to the card edges.
- `card-pricing` — pricing tier card with its own price hierarchy and action.
- `card-grid` — responsive grid of cells for marketing pages.
- `panel` — the layered shell behind overlays, not an in-page card.
- `empty-state` — goes in the `content` slot when the card has no data yet.

## Best practices

- Put the body in the `content` slot. There is no `default` slot, so children passed without `#content` don't render.
- Use `title` for a plain heading (rendered as an `h2`). Use the `header` slot only when the header needs another layout: it replaces both the title and `header-action`.
- `header-action` content stays hidden until the header is hovered or focused, so keep it to secondary actions and never make it the only way to reach a control.
- Set `:padded="false"` only when the content draws its own inset or needs flush dividers.
- The footer renders only when the `footer` slot has content; don't pass an empty template to reserve space.
- `kind="integration"` lays the card out from props: `title`, `logo` (or the `logo` slot), `vendor`, `description`, `badges` and `installed`. The title becomes a link when `href` is set, otherwise a button that emits `select`, and it stretches over the whole card so the tile is one target. Put a single action (Install, Configure) in the `action` slot; it sits above the stretched target and stays reachable on its own.
- Keep the description to one or two sentences; the card clamps it to three lines.
- Show at most two badges (category, context, plan). The installed state is a prop, not a badge, so it reads the same everywhere.
- Integration cards sit under a section heading, so their title is an `h3`.

## Usage

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
</script>

<template>
  <Card title="Domains">
    <template #header-action>
      <Button
        label="Edit"
        kind="transparent"
        size="small"
      />
    </template>
    <template #content>
      <p>Associate a custom domain to handle user access.</p>
    </template>
    <template #footer>
      <Button
        label="Save"
        kind="primary"
        size="medium"
      />
    </template>
  </Card>
</template>
```

### Integration kind

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
</script>

<template>
  <Card
    kind="integration"
    title="Request Signer"
    vendor="Acme Inc."
    logo="pi pi-key"
    description="Sign every request at the edge with a rotating key."
    :badges="[{ label: 'Firewall' }]"
    @select="openDetail"
  >
    <template #action>
      <Button
        label="Install"
        kind="outlined"
        size="small"
      />
    </template>
  </Card>
</template>
```

## Props

| Prop          | Type                         | Default     | Required | JSDoc                                                                                                                                         |
| ------------- | ---------------------------- | ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | `string`                     | `''`        | false    | Heading rendered in the header when the `header` slot is empty; with `kind="integration"`, the item name.                                     |
| `padded`      | `boolean`                    | `true`      | false    | Pads the content region. Set `false` for flush, edge-to-edge content such as an `ItemList` with full-width dividers.                          |
| `kind`        | `'default' \| 'integration'` | `'default'` | false    | `integration` lays the card out as a catalog tile from `title`, `logo`, `vendor`, `description`, `badges`, `installed` and the `action` slot. |
| `logo`        | `string`                     | `''`        | false    | Integration kind: icon class for the logo mark. The `logo` slot takes an image instead.                                                       |
| `vendor`      | `string`                     | `''`        | false    | Integration kind: who publishes the item, shown as "by {vendor}".                                                                             |
| `description` | `string`                     | `''`        | false    | Integration kind: one or two sentences on what the item does.                                                                                 |
| `badges`      | `CardBadge[]`                | `[]`        | false    | Integration kind: small tags such as the category or the context (`{ label, severity? }`, severity defaults to `info`).                       |
| `installed`   | `boolean`                    | `false`     | false    | Integration kind: shows the Installed tag.                                                                                                    |
| `href`        | `string`                     | `''`        | false    | Integration kind: the title links here; without it the title is a button that emits `select`.                                                 |

## Events

| Event    | Payload             | Notes                                                                      |
| -------- | ------------------- | -------------------------------------------------------------------------- |
| `select` | `event: MouseEvent` | Integration kind without `href`: the title (the whole tile) was activated. |

## Slots

| Slot            | Scope | Notes                                                                                  |
| --------------- | ----- | -------------------------------------------------------------------------------------- |
| `header`        | —     | Replaces the default header layout (title + header-action).                            |
| `header-action` | —     | Actions aligned to the end of the default header; visible on header hover.             |
| `content`       | —     | Main card body; with `kind="integration"` it renders under the description.            |
| `footer`        | —     | Footer actions or metadata; omitted when empty.                                        |
| `logo`          | —     | Integration kind: replaces the logo mark, for an `img` with an empty `alt`.            |
| `action`        | —     | Integration kind: one action at the end of the tile, above the stretched title target. |

> There is no `default` slot — content goes through `content`.

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- Responsive: the content region is the `@container/card`, so `KeyValuePairs`, `Field orientation="responsive"` and any `@sm:`/`@md:` utility inside follow the card, not the window. A card used as a shrink-to-fit flex item must get an explicit width (`flex-1`, `w-full`, a grid track): inline-size containment gives the content no intrinsic width.
- Hover-free devices: the `header-action` slot stays visible where the pointer cannot hover (`@media (hover: none)`).
- Integration kind: `hover` shades the surface, `focus-visible` rings the whole tile (the ring sits on the stretched title target), `installed` adds the success Installed tag.

## Motion & Animations

| Trigger              | Animation / Transition | Token  | Reduced-motion fallback         |
| -------------------- | ---------------------- | ------ | ------------------------------- |
| header action reveal | `transition-opacity`   | inline | `motion-reduce:transition-none` |
| integration hover    | `transition-colors`    | inline | `motion-reduce:transition-none` |

## Tokens

| Region     | Token (DESIGN.md)       |
| ---------- | ----------------------- |
| typography | .text-body-sm           |
| surface    | `var(--bg-surface)`     |
| text       | `var(--text-default)`   |
| spacing    | `var(--spacing-3)`      |
| shape      | `var(--shape-elements)` |
| ring       | `var(--ring-color)`     |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Internationalization

| Key              | English source | Override prop |
| ---------------- | -------------- | ------------- |
| `card.byVendor`  | by {vendor}    | —             |
| `card.installed` | Installed      | —             |

- Formatting: none.

## Right-to-left

- Layout: logical utilities only; the logo sits at the start, the badges and the action at the end.
- Icons: the logo is not mirrored.
- Keyboard: no arrow-key navigation of its own.
- User data: the vendor and the title render in `<bdi>`.

## Responsive

- Container queries: the content region is `@container/card`; the integration layout does not change with width, the description wraps and clamps to three lines.
- Narrow (≤ 640 px or a narrow container): the badges wrap under the title row; the action stays at the end of its own row.
- Touch: the whole tile is the target; the action is a regular `Button`.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: 13.5 KB gzip for `./card` in `.size-limit.json`: 11.1 KB before the integration kind (`cn` carries `tailwind-merge`), plus `tag` and the translate helper.
- Runtime budget: none: static.
- Heavy parts: none.

## Examples

- Default — title header + `content`
- Header — an action rendered in the `header` slot, aligned to the end (justified: demonstrates the full-control header path)
- Footer — `footer` region with actions (justified: the footer bar only renders when the slot is filled)
- Flush — `padded=false` edge-to-edge content (mutually-exclusive boolean state of the `padded` prop)
- Integration — `kind="integration"` with a vendor, a badge and an Install action (per `kind`)
- Installed — `kind="integration"` with `installed` and a Configure action (justified: the installed state is the tile's second state)

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
- Do not add examples beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
