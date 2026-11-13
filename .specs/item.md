---
name: item
category: content
structure: composition
status: implemented
spec_version: 2
created: 2026-05-24
last_updated: 2026-11-12
checksum: b4ac6a2919eb8b200bfb7c3786cbec374404cd0bc3b75d421b1f32410110dc29
---

# Item — Component Spec

## Purpose

Versatile flex row for title, description, media, and actions. Mirrors the shadcn-vue Item anatomy so consumers can reorder or omit regions. Compose with `ItemGroup` for gapped off-card lists, `ItemList` for divided in-card lists (inside a `Card`), and `ItemSeparator` between rows. Reference: https://www.shadcn-vue.com/docs/components/item (adapted to Webkit tokens and naming).

## When to use

- A row that pairs a title and description with leading media (icon, avatar, image) and trailing actions — settings entries, team members, next steps, notifications.
- A list of such rows: `Item.Group` for gapped rows off a card, `Item.List` for divided rows inside a `card`.
- A whole row that is one link or button — set `href` and the row renders as an anchor, or set `clickable` and bind `@click` and it renders as a native button.
- A compact option in a chooser list (a workload, a host, an application picked under a search field): `kind="option"` with `clickable`, so the row is a native button. The row is 38 px — `--spacing-xs` block padding, `--spacing-sm` inline padding and gap, the title at `text-body-md` — and paints `var(--bg-selected)` when the row is `aria-pressed="true"` or `aria-selected="true"`.

## When NOT to use

- Records that share columns and need sorting, selection or paging → use `table`.
- Hierarchical navigation rows in a sidebar → use `menu`.
- A grid of selectable option cards → use `radio-cards`.
- A single surface that frames arbitrary content → use `card`.

## Related

- `card` — the surface an `Item.List` sits in (with `:padded="false"`).
- `table` — columnar data; below `sm`, `listing-table` swaps its table rows for `item` rows.
- `menu` — navigation rows with nesting and drill levels.
- `avatar` — the usual leading media for people rows inside `Item.Media`.

## Best practices

- Use `Item.Group` off-card and `Item.List` inside a `card` with `:padded="false"`; both force their child items' `kind` (`inline` in a group, `default` in a list), so do not set `kind` on rows inside them.
- `Item.List` draws its own dividers — do not add `Item.Separator` inside it.
- With `href` or `clickable` the whole row is one focusable control with the row's hover, active and focus ring, so do not also put buttons or links inside that row.
- Set `Item.Media` `kind="icon"` for a glyph and `kind="image"` for a picture; the frame sizes and clips the content.
- Use `size="small"` for dense lists; `medium` is the default.
- For the rows of a picker under a search field use `kind="option"` (not `size="small"` plus your own padding): it sets its own density and the selected fill from `aria-pressed` / `aria-selected`, so `size` does not change it. Keep option rows in a plain column, not in `Item.List` or `Item.Group`, which force their own kind.

## Usage

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
</script>

<template>
  <Item.Group>
    <Item>
      <Item.Header>Updated 2 hours ago</Item.Header>
      <Item.Media kind="icon">
        <i
          class="ai ai-edge-firewall"
          aria-hidden="true"
        />
      </Item.Media>
      <Item.Content>
        <Item.Title>Firewall</Item.Title>
        <Item.Description>Blocks requests that match your rules.</Item.Description>
      </Item.Content>
      <Item.Actions>
        <Button
          label="Edit"
          kind="outlined"
          size="small"
        />
      </Item.Actions>
      <Item.Footer>3 rules active</Item.Footer>
    </Item>
    <Item.Separator />
    <Item>
      <Item.Content>
        <Item.Title>Cache</Item.Title>
        <Item.Description>Serves content from the edge.</Item.Description>
      </Item.Content>
    </Item>
  </Item.Group>

  <Card :padded="false">
    <template #content>
      <Item.List>
        <Item>
          <Item.Content>
            <Item.Title>Domains</Item.Title>
            <Item.Description>Link custom domains to Azion.</Item.Description>
          </Item.Content>
        </Item>
      </Item.List>
    </template>
  </Card>
</template>
```

## Sub-components

- `item.vue` — Root row container (`kind`, `size`).
- `item-group.vue` — Vertical list wrapper (`role="list"`) with a gap between rows; for off-card lists. Forces its descendant Items to render inline (no per-item surface or padding) to avoid a box-in-box effect.
- `item-list.vue` — Vertical list wrapper (`role="list"`) that draws full-width dividers between rows and no gap; for in-card lists (inside a `Card` with `padded=false`). Forces its descendant Items to the `default` kind (padded rows, transparent surface, no per-item border) to avoid a box-in-box effect.
- `item-separator.vue` — Horizontal divider between rows in a group.
- `item-media.vue` — Leading media slot (`kind` for icon/image frames).
- `item-content.vue` — Main text column (title + description).
- `item-title.vue` — Primary label line.
- `item-description.vue` — Secondary muted line.
- `item-actions.vue` — Trailing actions cluster.
- `item-header.vue` — Optional top band (e.g. cover image).
- `item-footer.vue` — Optional bottom band.

## Props

| Prop        | Type                                                         | Default     | Required | JSDoc                                                                                                                                                                                                                                                     |
| ----------- | ------------------------------------------------------------ | ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `kind`      | `'default' \| 'outlined' \| 'muted' \| 'inline' \| 'option'` | `'default'` | false    | Item root surface variant. `inline` removes the row's outer padding (transparent surface) for inline placement and divided in-card lists. `option` is a compact chooser row (38 px, title at body-md) that fills when its element is pressed or selected. |
| `size`      | `'small' \| 'medium'`                                        | `'medium'`  | false    | Item root density (padding and gap).                                                                                                                                                                                                                      |
| `href`      | `string`                                                     | `''`        | false    | When set, the whole row renders as an anchor link to this URL.                                                                                                                                                                                            |
| `clickable` | `boolean`                                                    | `false`     | false    | Renders the whole row as a button; bind the click handler on the Item. Ignored when href is set.                                                                                                                                                          |

> `ItemMedia` carries its own `kind` prop (`'default' | 'icon' | 'image'`, default `'default'`) — see the Sub-components section. It is not a root `Item` prop.

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes                                                 |
| --------- | ----- | ----------------------------------------------------- |
| `default` | —     | Every sub-component exposes `default` for its region. |

## States

- Visual states on Item shell: `default` only, **except with `href` or `clickable`**, where the root is the whole-row anchor or button and gains row-level `hover`, `active`, and `focus-visible`
- Without `href` or `clickable`, the root is a `div` and slotted controls (`Button`, `a`, etc.) own hover, active, and `focus-visible`
- `data-kind` on Item root: `default` | `outlined` | `muted` | `inline` | `option` (an Item inside `ItemGroup` is forced to `inline`; inside `ItemList` to `default`)
- `kind="option"`: `--spacing-xs` block padding, `--spacing-sm` inline padding and gap whatever the `size`, `Item.Title` at `text-body-md`, and `var(--bg-selected)` on the row while it carries `aria-pressed="true"` or `aria-selected="true"`
- `data-size` on Item root: `small` | `medium`
- `data-kind` on ItemMedia: `default` | `icon` | `image`

## Motion & Animations

- With `href` or `clickable`, the row uses the shared interactive ghost-layer hover/active treatment (opacity transition on `::before`/`::after`, motion-reduce safe). No component-local keyframes; sourced from the `interactive-states` preset.
- Without `href` or `clickable`, the shell is static.

## Tokens

| Region                 | Token (DESIGN.md)                                     |
| ---------------------- | ----------------------------------------------------- |
| title typography       | `.text-body-sm`                                       |
| title (option kind)    | `.text-body-md`                                       |
| option padding         | `var(--spacing-xs)` block, `var(--spacing-sm)` inline |
| option selected        | `var(--bg-selected)`                                  |
| description typography | `.text-body-sm`                                       |
| surface (default)      | `var(--bg-surface)`                                   |
| surface (muted kind)   | `var(--bg-mask)`                                      |
| text                   | `var(--text-default)`                                 |
| text muted             | `var(--text-muted)`                                   |
| border                 | `var(--border-default)`                               |
| spacing gap (medium)   | `var(--spacing-4)`                                    |
| spacing gap (small)    | `var(--spacing-2)`                                    |
| padding (medium)       | `var(--spacing-4)`                                    |
| padding (small)        | `var(--spacing-3)`                                    |
| ItemGroup row gap      | `var(--spacing-lg)`                                   |
| ItemList divider       | `var(--border-muted)`                                 |
| shape                  | `var(--shape-elements)`                               |
| ring                   | `var(--ring-color)`                                   |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: on slotted links and buttons. The Item shell draws no focus ring on its own, except with `href` or `clickable`, where the row itself (an anchor or a native button) receives the `focus-visible` ring (`focus-visible:ring-2 focus-visible:ring-(--ring-color)`) and hover/active feedback.
- Keyboard map: slotted links and buttons supply Tab order; with `href` the row is one link (`Enter` follows it), with `clickable` one native button (`Enter` and `Space` activate it).
- ARIA: `ItemGroup` and `ItemList` use `role="list"` and tell their direct Items, through context, that they are list members; the consumer wires nothing. A member Item renders `role="listitem"` on its root. A member Item with `href` or `clickable` renders a `role="listitem"` wrapper (`data-slot="item-listitem"`) around its anchor or button root, so a link row stays a link. An Item outside a list, or nested inside another Item, gets no list role. `ItemSeparator` uses `role="separator"`, and `role="none"` when it sits directly inside a list, where a separator is not an allowed child.
- Contrast ≥4.5:1 for title and description text.
- `motion-reduce:transition-none` on color transitions.
- Touch target ≥40×40 px on slotted actions (owned by children).

## Examples

- Default
- Outline
- Muted
- Small
- WithIconMedia — `ItemMedia` with `kind="icon"` and a leading icon (security-style row).
- WithAvatar — `ItemMedia` wrapping `Avatar` for profile list rows.
- WithImageMedia — `ItemMedia` with `kind="image"` and a thumbnail image.
- WithGroup — `ItemGroup` with multiple items, avatars, and actions; gapped off-card list.
- WithList — `ItemList` inside a `Card` (`padded=false`); rows separated by full-width dividers.
- WithListLinks — `ItemList` of `href` rows inside a `Card`; whole-row links with dividers, row-level hover, and focus-visible ring.
- Inline — `kind="inline"` items in an `ItemGroup`, placed directly on the page (no card, no outer padding).
- WithLink — `href` on `Item`; the row renders as an anchor and draws the focus ring itself.
- Option — `kind="option"` rows under a search field, one pressed; justified because `option` is a `kind` value.

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
