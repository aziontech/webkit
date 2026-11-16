---
name: integration-card
category: content
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 0fda1b316607c44f4a6f1201b126ced426d7ffcc720770b2b31c9957bb62e0d2
created: 2026-11-16
last_updated: 2026-11-16
---

# IntegrationCard — Component Spec

## Purpose

Use IntegrationCard for one tile of a catalog of integrations, extensions or plugins; for a bordered box of related content use Card, and for a collection of resource records shown as cards use CardList.

A catalog tile laid out from props: a logo mark, the item name, its vendor, a short description, badges, the installed state and one action. The name is the tile's single target: a link when `href` is set, otherwise a button that emits `select`, stretched over the whole tile. `featured` gives the centred, raised layout used for a short row of picks above the full catalog. It was the `integration` variant of `Card` until 6.0, split out because a tile shares neither the header nor the footer of a content card.

## When to use

- A catalog tile for an integration, an extension or a plugin: the logo, the name, the vendor, a short description, badges, the installed state and one action.
- A short row of highlighted integrations above the full catalog (Featured): add `featured` for the centred, raised layout with the badges in the corner.
- A starter template or next-step tile that carries a mark, a name and a short description and links somewhere.

## When NOT to use

- A bordered box of related content with a title, a body and a footer → use `card`.
- One record of a resource list shown as cards, with selection and fields → use `card-list` (with `useCollection`).
- One tier of a pricing comparison → use `pricing-card`.
- A single row of title, description, media and actions → use `item`.

## Related

- `card` — the content box this tile was split from; shares its surface tokens.
- `tag` — renders the badges and the Installed state.
- `card-list` — the resource list in card form, with selection.
- `view/marketplace` — the block that lays these tiles out in a filtered grid.

## Best practices

- The tile is laid out from props: `title`, `logo` (or the `logo` slot), `vendor`, `description`, `badges` and `installed`. The title becomes a link when `href` is set, otherwise a button that emits `select`, and it stretches over the whole tile so the tile is one target. Put a single action (Install, Configure) in the `actions` slot; it sits above the stretched target and stays reachable on its own.
- Keep the description to one or two sentences; the tile clamps it to three lines.
- Show at most two badges (category, context, plan). The installed state is a prop, not a badge, so it reads the same everywhere.
- Tiles sit under a section heading, so their title is an `h3`.
- `featured` centres the mark, the name, the vendor and the description on a raised surface with a primary glow at the top, and moves the badges to the top end corner, where a badge without `severity` is `primary`. Use it for a row of at most three or four picks above the full catalog, never for every tile; the full catalog keeps the plain tile.

## Usage

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import IntegrationCard from '@aziontech/webkit/integration-card'
</script>

<template>
  <IntegrationCard
    title="Request Signer"
    vendor="Acme Inc."
    logo="ai ai-key"
    description="Sign every request at the edge with a rotating key."
    :badges="[{ label: 'Firewall' }]"
    @select="openDetail"
  >
    <template #actions>
      <Button
        label="Install"
        variant="outline"
        size="small"
      />
    </template>
  </IntegrationCard>
</template>
```

## Props

| Prop          | Type                     | Default | Required | JSDoc                                                                                                                                                                                                                                                                                                  |
| ------------- | ------------------------ | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `title`       | `string`                 | `''`    | false    | The item name; the tile's single target.                                                                                                                                                                                                                                                               |
| `logo`        | `string`                 | `''`    | false    | Icon class for the logo mark. The `logo` slot takes an image instead.                                                                                                                                                                                                                                  |
| `vendor`      | `string`                 | `''`    | false    | Who publishes the item, shown as "by {vendor}".                                                                                                                                                                                                                                                        |
| `description` | `string`                 | `''`    | false    | One or two sentences on what the item does.                                                                                                                                                                                                                                                            |
| `badges`      | `IntegrationCardBadge[]` | `[]`    | false    | Small tags such as the category or the context (`{ label, variant?, severity? }`, `variant` a `TagVariant` and `severity` a `TagSeverity` (`IntegrationCardBadgeVariant` and `IntegrationCardBadgeSeverity`); a badge with neither is `info`, a featured badge with neither is the `primary` variant). |
| `installed`   | `boolean`                | `false` | false    | Shows the Installed tag.                                                                                                                                                                                                                                                                               |
| `href`        | `string`                 | `''`    | false    | The title links here; without it the title is a button that emits `select`.                                                                                                                                                                                                                            |
| `featured`    | `boolean`                | `false` | false    | The featured layout, centred on a raised surface with a primary glow at the top and the badges in the top end corner.                                                                                                                                                                                  |

## Events

| Event    | Payload             | Notes                                                     |
| -------- | ------------------- | --------------------------------------------------------- |
| `select` | `event: MouseEvent` | Without `href`: the title (the whole tile) was activated. |

## Slots

| Slot      | Scope | Notes                                                                |
| --------- | ----- | -------------------------------------------------------------------- |
| `default` | —     | Extra content under the description.                                 |
| `logo`    | —     | Replaces the logo mark, for an `img` with an empty `alt`.            |
| `actions` | —     | One action at the end of the tile, above the stretched title target. |

## States

- Visual states: `default`, `hover`, `focus-visible`
- `hover` shades the surface, `focus-visible` rings the whole tile (the ring sits on the stretched title target), `installed` adds the success Installed tag.
- Featured (`featured`): the surface is raised; `hover` strengthens the border and brightens the top glow instead of shading the surface; the layout is centred and the badges sit in the top end corner. `data-featured` on the root drives the styles.
- Test ids: `integration-card` on the root, with `__logo`, `__title`, `__vendor`, `__installed`, `__actions`, and `__glow` and `__badges` when featured.

## Motion & Animations

| Trigger       | Animation / Transition | Token  | Reduced-motion fallback         |
| ------------- | ---------------------- | ------ | ------------------------------- |
| tile hover    | `transition-colors`    | inline | `motion-reduce:transition-none` |
| featured glow | `transition-opacity`   | inline | `motion-reduce:transition-none` |

## Tokens

| Region     | Token (DESIGN.md)                                                    |
| ---------- | -------------------------------------------------------------------- |
| typography | .text-label-md, .text-body-sm, .text-body-xs, .text-heading-xs       |
| surface    | `var(--bg-surface)`, `var(--bg-hover)`                               |
| featured   | `var(--bg-surface-raised)`, `var(--border-strong)`, `var(--primary)` |
| text       | `var(--text-default)`, `var(--text-muted)`                           |
| spacing    | `var(--spacing-md)`                                                  |
| shape      | `var(--shape-card)`, `var(--shape-control)`                          |
| ring       | `var(--ring-color)`                                                  |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the stretched title target draws an inset `focus-visible:after:ring-2 focus-visible:after:ring-(--ring-color)` around the whole tile, so `overflow-clip` on the tile never cuts it.
- Keyboard map: `Tab` reaches the title (a link or a button) and then the action; `Enter` activates the title (`Space` too when it is a button).
- ARIA: the root is a `section`; the title is an `h3` holding the link or the button; the logo mark is `aria-hidden`; the featured glow is `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons).
- `motion-reduce:transition-none` on the hover and glow transitions.
- Touch target: the whole tile is the title's target; the action is a regular `Button`.

## Internationalization

| Key                         | English source | Override prop |
| --------------------------- | -------------- | ------------- |
| `integrationCard.byVendor`  | by {vendor}    | —             |
| `integrationCard.installed` | Installed      | —             |

- Formatting: none.

## Right-to-left

- Layout: logical utilities only; the logo sits at the start, the badges and the action at the end. Featured: the content is centred and the badges sit in the top end corner (`end-*`), so they move to the left under `dir="rtl"`.
- Icons: the logo is not mirrored.
- Keyboard: no arrow-key navigation of its own.
- User data: the vendor and the title render in `<bdi>`.

## Responsive

- The layout does not change with width; the description wraps and clamps to three lines.
- Narrow (≤ 640 px or a narrow grid track): the badges wrap under the title row; the action stays at the end of its own row. Featured: the corner badges keep their place and the centred block reserves the top inset for them.
- Touch: the whole tile is the target; the action is a regular `Button`.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: `./integration-card` in `.size-limit.json` (`cn` carries `tailwind-merge`, plus `tag` and the translate helper).
- Runtime budget: none: static.
- Heavy parts: none.

## Examples

- Default — a tile with a vendor, a badge and an Install action
- Installed — `installed` with a Configure action (justified: the installed state is the tile's second state)
- Featured — a row of three `featured` tiles (justified: `featured` is a boolean layout of the tile)

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
- Do not add examples beyond Default + per `variant` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
