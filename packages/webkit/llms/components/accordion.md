# Accordion

> A vertically stacked set of disclosure items: each item has a clickable header that expands or collapses its content panel. Use it to condense long content into scannable sections. Unlike `tabs` (mutually-exclusive panels shown in place), an accordion can keep one item open at a time (`type="single"`) or several at once (`type="multiple"`), and its content expands inline below each header.

- Import: `import AccordionRoot from '@aziontech/webkit/accordion-root'`
- Compound import (dot notation, not tree-shakeable): `import Accordion from '@aziontech/webkit/accordion'`
- Category: content · Surface: product · Structure: composition
- API as JSON: [accordion.json](https://github.com/aziontech/webkit/blob/main/.specs/accordion.json)

## When to use

- Long content splits into independent sections the reader scans by heading and opens on demand (settings groups, help topics, a details list).
- The reader may want one section open at a time (`type="single"`) or to compare several side by side (`type="multiple"`).
- Content should expand inline below its heading, pushing the rest of the page down.

## Do

- Give every `Accordion.Item` a unique `value`; the open state is keyed by it, and `default-value` / `v-model` refer to it.
- Bind `v-model` to a string in `type="single"` and to an array in `type="multiple"`; set `collapsible` to `false` only when one item must always stay open.
- Set the trigger's `level` to fit the page outline (default `3`) — each trigger is wrapped in a real heading.
- Accordion.Content` applies no padding; pad the content you put inside it.
- Set `size` and `arrow-position` on the root, not per item — they are provided to every item through context.

## Don’t

- The panels are mutually exclusive views shown in the same place → use `tabs`.
- It is the frequently-asked-questions band of a marketing page → use `faq-section` (or `faq` for the band without the page-section wiring).
- It is hierarchical navigation with expandable rows → use `menu`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [tabs](tabs.md) — switches between panels in place; one panel visible, headers in a row.
- [faq](faq.md) — the marketing FAQ band that composes `accordion` with a heading column and hairline register.
- [menu](menu.md) — expanding rows for navigation, not for revealing content.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `type` | `'single' \| 'multiple'` | `'single'` | false | Whether one or multiple items can be open at the same time. |
| `defaultValue` | `string \| string[] \| null` | `null` | false | Initial open item(s) when uncontrolled. |
| `collapsible` | `boolean` | `true` | false | In single mode, lets the open item collapse so that no item is open. |
| `size` | `'medium' \| 'large'` | `'medium'` | false | Size token; affects header height, padding, and typography. Provided to every item via context. |
| `arrowPosition` | `'left' \| 'right'` | `'right'` | false | Side of the header the chevron sits on. Provided to every item via context. |
| `modelValue` | `AccordionValue \| undefined` | `undefined` | false | Two-way value (`v-model`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The `Accordion.Item` children. Each sub-component's own `default` slot is documented in the Sub-components section. |

## Sub-component imports

- `@aziontech/webkit/accordion-item`
- `@aziontech/webkit/accordion-trigger`
- `@aziontech/webkit/accordion-content`

## Sub-components

The root ships a **compound API**: an `index.ts` (beside `accordion.vue`) attaches every sub-component to the root so `<Accordion.Item>` / `<Accordion.Trigger>` / `<Accordion.Content>` resolve from one import; the standalone imports above remain the tree-shaking path. The root is a disclosure component with `data-state="open|closed"`, so `Trigger` / `Content` are the correct anatomy names. Shared open-state flows through `provide`/`inject` (`injection-key.ts`), so the consumer wires nothing.

- `accordion-item/accordion-item.vue` — One disclosure row. Registers itself with the root by `value`, derives its own open/closed state from the injected context, and groups a `Trigger` + a `Content`.
  - Props: `value: string` (**required** — unique identifier used by the open-state model), `disabled?: boolean` (default `false` — prevents this item from toggling; from the Figma component description).
  - Slot: `default` — the item's `Accordion.Trigger` and `Accordion.Content`.
- `accordion-trigger/accordion-trigger.vue` — The clickable header row (Figma "Header"): renders the title plus the `pi pi-chevron-down` glyph, toggles the item through the injected context, and exposes `aria-expanded` / `aria-controls`. To satisfy the ARIA accordion pattern, the `<button>` is wrapped in a heading element.
  - Props: `level?: 2 | 3 | 4 | 5 | 6` (default `3` — heading level of the wrapping `<h{level}>` for correct document outline).
  - Slot: `default` — header title content.
- `accordion-content/accordion-content.vue` — The collapsible panel. Mounts only when its item is open, reads the content/trigger ids from context, and exposes `role="region"` + `aria-labelledby`. The container applies no padding — the slotted content owns its own spacing.
  - Slot: `default` — panel body content.

Resulting layout (no per-component `package.json` — dropped repo-wide; the root `packages/webkit/package.json#exports` resolves every path; `.d.ts` is generated at publish time, never committed):

```
packages/webkit/src/components/content/accordion/
├── accordion.vue                 (root; owns type/modelValue/size/arrowPosition, provides context)
├── index.ts                      (compound: attaches Item / Trigger / Content to the root)
├── injection-key.ts              (shared AccordionContext)
├── accordion-item/
│   └── accordion-item.vue
├── accordion-trigger/
│   └── accordion-trigger.vue
└── accordion-content/
    └── accordion-content.vue
```

Exports to add to `packages/webkit/package.json#exports` (flat public names; category lives in the folder only):

```jsonc
"./accordion": "./src/components/content/accordion/index.ts",
"./accordion-item": "./src/components/content/accordion/accordion-item/accordion-item.vue",
"./accordion-trigger": "./src/components/content/accordion/accordion-trigger/accordion-trigger.vue",
"./accordion-content": "./src/components/content/accordion/accordion-content/accordion-content.vue"
```

## v-model

| Model     | Type                                      | Default     | Emits               | Notes                                                                                                                                                                                                                          |
| --------- | ----------------------------------------- | ----------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `v-model` | `string \| string[] \| null \| undefined` | `undefined` | `update:modelValue` | Open item(s) via `defineModel`: a single `value` string in single mode, an array of values in multiple mode, `null` when none is open. While unbound (`undefined`) the accordion is uncontrolled and starts at `defaultValue`. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-state` values: `open` | `closed` — on the item, the trigger, and the content
- `data-disabled` mirrors the per-item `disabled` prop
- `data-orientation`: `vertical`
- Reflow: the trigger label region is `min-w-0`, so long trigger content truncates or wraps instead of overflowing a narrow box.

## Accessibility

- Visible focus (Figma has no focus variant; we own it): `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on each `Accordion.Trigger`.
- Keyboard map: `Tab` / `Shift+Tab` move between triggers and into open content; `Enter` / `Space` toggle the focused item; `Arrow Down` / `Arrow Up` move focus to the next / previous trigger; `Home` / `End` move focus to the first / last trigger.
- ARIA: each trigger is a `<button>` with `aria-expanded` reflecting open state and `aria-controls` referencing its content; the trigger button is wrapped in a heading element (`<h{level}>`, default `h3`); the content panel has `role="region"` and `aria-labelledby` referencing its trigger. A `disabled` item sets `disabled` + `aria-disabled` on its trigger.
- Contrast ≥4.5:1 for text (title `--text-default`, body `--text-muted` on the surface) / ≥3:1 for the chevron glyph, including the disabled state (`--text-disabled`).
- `motion-reduce:transition-none motion-reduce:animate-none` on the chevron rotation and content reveal.
- Touch target: the `large` header is 40px tall and the full-width header row is the hit area (≥40×40). The `medium` header is 32px tall — a justified deviation matching the Figma `medium` size token, mitigated by the full-width clickable row.

## Examples

### Default

```vue
<script setup>
  import Accordion from '@aziontech/webkit/accordion'
</script>

<template>
  <Accordion
    type="single"
    collapsible
    default-value="overview"
    size="medium"
    arrow-position="right"
    class="w-full max-w-[40rem]"
  >
    <Accordion.Item value="overview">
      <Accordion.Trigger>What is Azion?</Accordion.Trigger>
      <Accordion.Content>Azion runs your code at the edge, close to users.</Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="pricing">
      <Accordion.Trigger>How does pricing work?</Accordion.Trigger>
      <Accordion.Content>Pay only for what you use, with no upfront cost.</Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="support">
      <Accordion.Trigger>Enterprise support</Accordion.Trigger>
      <Accordion.Content>Available on Business and Enterprise plans.</Accordion.Content>
    </Accordion.Item>
  </Accordion>
</template>
```

### Sizes

```vue
<script setup>
  import Accordion from '@aziontech/webkit/accordion'
</script>

<template>
  <div class="flex flex-col gap-8 w-full max-w-[40rem]">
    <Accordion
      type="single"
      collapsible
      default-value="overview"
      size="medium"
    >
      <Accordion.Item value="overview">
        <Accordion.Trigger>What is Azion?</Accordion.Trigger>
        <Accordion.Content>Azion runs your code at the edge, close to users.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="pricing">
        <Accordion.Trigger>How does pricing work?</Accordion.Trigger>
        <Accordion.Content>Pay only for what you use, with no upfront cost.</Accordion.Content>
      </Accordion.Item>
    </Accordion>
    <Accordion
      type="single"
      collapsible
      default-value="overview"
      size="large"
    >
      <Accordion.Item value="overview">
        <Accordion.Trigger>What is Azion?</Accordion.Trigger>
        <Accordion.Content>Azion runs your code at the edge, close to users.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="pricing">
        <Accordion.Trigger>How does pricing work?</Accordion.Trigger>
        <Accordion.Content>Pay only for what you use, with no upfront cost.</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  </div>
</template>
```

### ArrowPosition

```vue
<script setup>
  import Accordion from '@aziontech/webkit/accordion'
</script>

<template>
  <div class="flex flex-col gap-8 w-full max-w-[40rem]">
    <Accordion
      type="single"
      collapsible
      default-value="overview"
      arrow-position="right"
    >
      <Accordion.Item value="overview">
        <Accordion.Trigger>What is Azion?</Accordion.Trigger>
        <Accordion.Content>Azion runs your code at the edge, close to users.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="pricing">
        <Accordion.Trigger>How does pricing work?</Accordion.Trigger>
        <Accordion.Content>Pay only for what you use, with no upfront cost.</Accordion.Content>
      </Accordion.Item>
    </Accordion>
    <Accordion
      type="single"
      collapsible
      default-value="overview"
      arrow-position="left"
    >
      <Accordion.Item value="overview">
        <Accordion.Trigger>What is Azion?</Accordion.Trigger>
        <Accordion.Content>Azion runs your code at the edge, close to users.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="pricing">
        <Accordion.Trigger>How does pricing work?</Accordion.Trigger>
        <Accordion.Content>Pay only for what you use, with no upfront cost.</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  </div>
</template>
```
