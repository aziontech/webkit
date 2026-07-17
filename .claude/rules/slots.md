# Rule: slots — typed `defineSlots`, kebab names, fallback inside the slot

Slots are the **anatomy** surface of a component (where the consumer puts content), the counterpart to props (data + scalar config). This rule fixes how slots are *declared and typed*; **which** parts of a component are slots vs. sub-components vs. props is decided by [`compound-api.md`](./compound-api.md).

## The rule

> Slots are declared with **`defineSlots<{ ... }>()`**, typed. Named slots are **kebab-case**. A **scoped slot** declares its payload type. Fallback content lives **inside** the `<slot>` in the template, never as a prop that substitutes for a slot.

```vue
<script setup lang="ts">
  defineSlots<{
    /** Default content. */
    default(): unknown
    /** Rendered per row; receives the row record. */
    row(props: { item: TableRow; index: number }): unknown
    /** Leading adornment. */
    prefix(): unknown
  }>()
</script>

<template>
  <div>
    <span class="prefix"><slot name="prefix" /></span>
    <slot name="row" :item="row" :index="i">
      <!-- fallback: shown when the consumer passes no row slot -->
      {{ row.label }}
    </slot>
  </div>
</template>
```

- **`defineSlots` is typed**, so the consumer's editor knows a slot exists and what a scoped slot yields. An untyped slot is invisible to tooling and to the spec check.
- **Named slots are kebab-case** (`prefix`, `header-actions`), matching how the consumer writes `<template #header-actions>`.
- **Scoped-slot payload is an object** with named keys (`{ item, index }`) — never positional. It follows the same "smallest thing that identifies the subject" logic as [`event-payloads.md`](./event-payloads.md).
- **Fallback content goes inside the `<slot>`**. Do not add a `label`/`text` prop *as a substitute* for a default slot; the slot with fallback content covers both cases. (A prop whose only role is slot-fallback display text uses `label` — see [`prop-vocabulary.md`](./prop-vocabulary.md) — but the slot is still the primary path.)
- **Only slots the spec lists.** No extra slots (see [`no-invention.md`](./no-invention.md)); the count is top-level `defineSlots` entries (scoped-slot props do not count as slots).

## Hard prohibitions

- Do not leave slots undeclared or untyped — use `defineSlots<{…}>()`.
- Do not name a slot in camelCase (`headerActions`) — kebab (`header-actions`).
- Do not pass scoped-slot payload positionally — use a named-key object.
- Do not add a prop to stand in for a slot's content (config-array / text-prop anti-pattern — see [`compound-api.md`](./compound-api.md)).
- Do not add a slot the spec's Slots table does not list.

## Enforcement

- **[`validate-spec-compliance.mjs`](../hooks/validate-spec-compliance.mjs)** counts top-level `defineSlots` entries and blocks slots not in the spec's Slots table (scoped-slot props are correctly skipped).
- The scaffolder emits `defineSlots` from the spec's Slots table with the declared scoped payloads.

## Why this rule exists

Slots were the one part of the component surface with no typing discipline — several components rendered `<slot />` with no `defineSlots`, so the consumer's editor and the spec check were both blind to them, and scoped slots passed payloads positionally that the consumer had to reverse-engineer. Typing every slot (and putting fallback where it belongs, inside the slot) makes the anatomy legible to tooling the same way props already are.
