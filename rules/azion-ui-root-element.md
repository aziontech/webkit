# Rule: own the root element — forward attrs, switch by data, expose the minimum

A component renders **its own root element**: which element it is switches on a data prop,
consumer attributes reach it via `inheritAttrs: false` + `v-bind="$attrs"`, and the
imperative surface (`defineExpose`) stays minimal. No wrapper `<div>` that swallows attrs,
no `as`/`asChild` polymorphism helper, no leaked internal state. The
`azion-ui/no-polymorphic-as-prop` ESLint rule blocks an `as` or `asChild` prop in
`defineProps`; the rest of the pattern is convention + code review. (Token discipline
inside class strings is enforced separately by the stylelint config and the
`azion-ui/no-hardcoded-color` ESLint rule.)

## Do

- Switch the root element by **intent expressed as data**: an `href` prop, never an `as`
  string. For a link-or-button root, render Azion UI's `Button` and pass `href` on: it renders an
  anchor when there is a URL and a button otherwise, so the raw `<a>` / `<button>` stay inside
  their owners (`azion-ui/no-unowned-element`).
- Set `inheritAttrs: false` in `defineOptions` and put `v-bind="$attrs"` on the **real**
  root, so attributes (including `class`) land on the element the consumer means.
- Merge the consumer's `class` with `cn` from `@aziontech/ui/utils/cn` (the only
  class-composition helper). Keep the base classes a flat literal.
- Expose **functions only** via `defineExpose` (`focus()`, `open()`) — and only when a prop,
  event, or `v-model` cannot express the interaction. Default to exposing nothing.

## Don't

- Never switch the root with an `as`/`is` **string prop** — use a data prop like `href`.
  Blocked by lint.
- Never import or invent an `asChild`/`Slot` polymorphism helper — Azion UI does not ship one.
- Never wrap the root in a `<div>` that eats `$attrs`.
- Never declare `class` in `defineProps` — it flows through `useAttrs()` + `cn`.
- Never `defineExpose` internal reactive state (`internalValue`, raw element refs) — the
  imperative surface is a small set of named functions.

## Example

### Do

```vue
<script setup lang="ts">
  import Button from '@aziontech/ui/button'

  defineOptions({ name: 'DeployAction', inheritAttrs: false })

  interface Props {
    /** The action's text. */
    label: string
    /** When set, the action renders as an anchor link to this URL. */
    href?: string
  }
  withDefaults(defineProps<Props>(), { href: '' })
</script>

<template>
  <Button
    v-bind="$attrs"
    :label="label"
    :href="href"
    variant="secondary"
  />
</template>
```

```vue
<script setup lang="ts">
  import { useAttrs } from 'vue'
  import { cn } from '@aziontech/ui/utils/cn'

  defineOptions({ name: 'SummaryPanel', inheritAttrs: false })

  defineSlots<{
    /** The panel's content. */
    default(): unknown
  }>()

  const attrs = useAttrs()
</script>

<template>
  <section
    v-bind="$attrs"
    :class="cn('rounded-(--shape-card) bg-(--bg-surface) p-(--spacing-md)', attrs.class as string)"
  >
    <slot />
  </section>
</template>
```

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  const inputEl = ref<HTMLInputElement | null>(null)
  defineExpose({
    /** Move focus to the field. */
    focus: () => inputEl.value?.focus()
  })
</script>
```

### Don't

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  // ❌ `as` string prop; `class` declared as a prop; internal state exposed
  const props = defineProps<{ as?: string; class?: string }>()
  const internalValue = ref('')
  defineExpose({ internalValue })
</script>

<template>
  <!-- ❌ wrapper div swallows $attrs; the real root never receives the consumer's attributes -->
  <div class="wrapper">
    <component :is="props.as ?? 'button'" :class="props.class">
      <slot />
    </component>
  </div>
</template>
```
