# Rule: the root element — own it, forward attrs, expose the minimum

A component renders **its own root element**. It does not delegate the root to a polymorphism helper it does not own, and it does not hide the root behind a wrapper `<div>` that swallows the consumer's attributes. This rule fixes three things about that root: **which element it is** (polymorphism), **how the consumer's attributes reach it** (forwarding), and **what the component exposes imperatively** (`defineExpose`).

## 1. Polymorphism — the root switches element by intent, via a prop

When a component is sometimes a link and sometimes a button, it switches its **own** root element on a data prop — not on an `as`/`is` string, and not through a foreign `Slot`/`asChild` helper.

```vue
<script setup lang="ts">
  interface Props {
    /** When set, the control renders as an anchor link to this URL. */
    href?: string
  }
  const props = withDefaults(defineProps<Props>(), { href: '' })
  const isLink = computed(() => props.href.length > 0)
</script>

<template>
  <component :is="isLink ? 'a' : 'button'" :href="isLink ? href : undefined">
    <slot />
  </component>
</template>
```

- Anchor vs. button is driven by **`href`** (data), following [`prop-vocabulary.md`](./prop-vocabulary.md) — never an `as="a"` string prop.
- **`asChild` / a `Slot` helper is pending and does not exist** in this package. Do not import one; [`validate-references.mjs`](../hooks/validate-references.mjs) blocks the phantom path. See [`migration.md`](./migration.md) for why Base UI / Reka UI polymorphism is rewritten, not inherited.

## 2. Attribute forwarding — `inheritAttrs: false` + `$attrs` on the root

The consumer's attributes (including `class`) reach the **real** root element, explicitly.

```vue
<script setup lang="ts">
  import { cn } from '@aziontech/webkit/utils/cn'
  defineOptions({ name: 'Card', inheritAttrs: false })
  const attrs = useAttrs()
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :class="cn('rounded-[var(--shape-card)] bg-[var(--bg-surface)]', attrs.class as string)"
  >
    <slot />
  </div>
</template>
```

- **`inheritAttrs: false`** in `defineOptions` + **`v-bind="$attrs"`** on the root — so attributes land on the element the consumer means, not on an implicit wrapper.
- Consumer **`class`** is merged with **`cn`** (clsx + tailwind-merge — the only allowed class-composition helper) so the consumer can override token choices. The base classes are a **flat literal**, never a JS class preset (see [`styling.md`](./styling.md)).
- **Never declare `class` in `defineProps`** — it flows through `useAttrs()`, not the prop surface (see [`props.md`](./props.md)).

## 3. `defineExpose` — the minimum, intentional imperative API

A component exposes an imperative method only when the DOM genuinely requires it (focus management, opening an overlay). It never leaks internal reactive state.

```vue
<script setup lang="ts">
  const inputRef = ref<HTMLInputElement | null>(null)
  defineExpose({
    /** Move focus to the field. */
    focus: () => inputRef.value?.focus()
  })
</script>
```

- Expose **functions**, not refs to internal state — the imperative surface is `focus()` / `open()`, not `internalValue`.
- The exposed surface is **documented in the spec** like any other public contract (see [`no-invention.md`](./no-invention.md)); do not expose something the spec does not list.
- Default to exposing **nothing**. Reach for `defineExpose` only when a `v-model` / event / prop cannot express the interaction.

## Hard prohibitions

- Do not switch the root element with an `as`/`is` string prop — use a data prop (`href`) with `<component :is>`.
- Do not import or invent an `asChild` / `Slot` polymorphism helper (it does not exist — blocked).
- Do not wrap the root in a `<div>` that swallows `$attrs`; set `inheritAttrs: false` and put `v-bind="$attrs"` on the real root.
- Do not declare `class` in `defineProps`; forward it via `useAttrs()` + `cn`.
- Do not `defineExpose` internal reactive state; expose intentional functions only, and only what the spec lists.

## Enforcement

- **[`validate-references.mjs`](../hooks/validate-references.mjs)** blocks a phantom `asChild`/`Slot` import.
- **[`validate-tokens.mjs`](../hooks/validate-tokens.mjs)** blocks `class` in `defineProps`.
- **[`validate-spec-compliance.mjs`](../hooks/validate-spec-compliance.mjs)** enforces the `data-testid` root derivation and the props/events/exposed surface against the spec.
- **`webkit/no-style-override`** (ESLint) guards consumer-side token overrides; `cn` is the only class-composition path.

## Why this rule exists

`COMPONENT_REQUIREMENTS.md` covered these as three separate prose notes (§2.5 as-child pending, §2.6 `data-*`, §2.7 `cn`), so a component could render an implicit wrapper that ate the consumer's `class`, or expose its whole internal state through `defineExpose`, without anything catching it. The root element is the component's contact surface with the consumer — fixing which element it is, that attributes reach it, and that the imperative API is minimal keeps that surface honest.
