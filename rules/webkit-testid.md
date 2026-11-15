# Rule: `data-testid` — derived name on the root, overridable

Every webkit component root carries a **`data-testid`** that is the component's own kebab
name (`chip`, `badge`, `toast`, `data-table`); a sub-component uses its own name too
(`dialog-header`, `table-row`, `popover-trigger`). Your tests target that attribute instead
of inventing selectors, and you override it per instance by passing `data-testid` on the
tag. Components you author in this project follow the same pattern. This is a convention
enforced by review — no lint rule checks it, so apply it deliberately.

## Do

- Target components in tests via their derived `data-testid`, never via DOM structure or
  internal classes.
- Override the testid per instance when a page renders more than one of the same
  component: `<Button data-testid="signup-submit" />` — the passed value always wins over
  the derived fallback.
- In components you author, read `attrs['data-testid']` for the fallback so a
  consumer-supplied value is applied once, not twice with different values.
- Give every interactive element inside a component that a test must reach (a sort
  control, a remove control) its own testid: the root testid, two underscores, then the
  part (`chip__remove`), never a single hyphen. Name the part for its job, with no
  `-button` suffix.
- Keep the `defineOptions` PascalCase name and the kebab testid derived from the same
  canonical component name.

## Do not

- Do not omit `data-testid` on an interactive component root.
- Do not hard-code a testid literal that disagrees with the component's own name, and do
  not put the category in it (`actions-button`, `input-chip`).
- Do not ignore a consumer-supplied `data-testid` — it must win over the fallback.
- Do not apply the same testid to two elements, or leave a test-critical sub-element
  unaddressable.
- Do not select by tag position, utility classes, or generated markup in tests — those
  change between webkit versions; the testid does not.

## Correct

<!-- prettier-ignore -->
```vue
<script setup lang="ts">
  import { computed, useAttrs } from 'vue'
  defineOptions({ name: 'Chip', inheritAttrs: false })
  defineSlots<{
    /** The chip's label. */
    default(): unknown
  }>()
  const attrs = useAttrs()
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'chip')
</script>

<template>
  <div v-bind="$attrs" :data-testid="testId" class="inline-flex gap-(--spacing-xs)">
    <slot />
  </div>
</template>
```

<!-- prettier-ignore -->
```html
<!-- override per instance when the page has several of the same component -->
<Chip data-testid="plan-chip-pro" />
<Chip data-testid="plan-chip-free" />
```

## Wrong

<!-- prettier-ignore -->
```vue
<script setup lang="ts">
  defineOptions({ name: 'Chip', inheritAttrs: false })
</script>

<template>
  <!-- hard-coded literal: disagrees with the derivation, and a consumer-supplied
       data-testid can never win -->
  <div data-testid="my-chip"><slot /></div>
</template>
```

<!-- prettier-ignore -->
```js
// selecting by structure instead of the testid — breaks on any markup change
const removeButton = wrapper.find('div > span:nth-child(2) > button')
```
