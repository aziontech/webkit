# Rule: `data-testid` — the component's own name, overridable

Every component root carries a **`data-testid`** that is the component's own kebab name, so tests (and the consuming app's tests) can target it without the consumer inventing selectors. This rule fixes the derivation and the override path. The name is one of the six naming surfaces governed by [`naming.md`](./naming.md).

## The rule

> The root element sets `:data-testid`, defaulting to **the component's own kebab name** (`button`, `dialog`, `data-table`). A sub-component's root uses **its own** name too (`dialog-header`, `table-row`, `popover-trigger`), never its parent's id. An element inside one component that a test must reach gets `${testId}__<part>`. The consumer overrides any of them by passing `data-testid` as an attribute.

```vue
<script setup lang="ts">
  import { computed, useAttrs } from 'vue'
  defineOptions({ name: 'Chip', inheritAttrs: false })
  const attrs = useAttrs()
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'chip')
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
  >
    <button
      :data-testid="`${testId}__remove`"
      type="button"
    />
  </div>
</template>
```

- **Fallback**: the file's own name, the same kebab name as the export (`chip.vue` → `chip`, `dialog-header.vue` → `dialog-header`). No category: moving a component to another folder never changes its test id.
- **Sub-components**: a part that is its own component (`Dialog.Header`, `Table.Row`, `Popover.Trigger`) is addressed by its own name (`dialog-header`, `table-row`, `popover-trigger`). Two instances on a page share it; scope the query to the instance (`within(getByTestId('signup-dialog'))`) or override it.
- **Inner parts**: an element inside one component that a test must click (a remove `×`, a loading slot, a close button) is `` `${testId}__<part>` `` — two underscores, never one hyphen — so a consumer override of the root carries to its inner parts.
- **Part words**: one word per concept — `close` (not `dismiss`), `remove` (not `remove-icon`), `loading` (not `skeleton` or `spinner`), `previous` / `next` (not `back`), `chevron` (not `arrow`); a part is named for its job, with no `-button` suffix (`__refresh`, `__sort`, `__expand`).
- **Override**: the consumer passes `data-testid="…"`; because the root reads `attrs['data-testid']` for its fallback and also spreads `v-bind="$attrs"`, the passed value wins. Read it from `attrs` for the computed fallback so it is not applied twice with different values.
- **Drawings**: an exported SFC under `src/assets/` or `src/svg/` that takes no props is a static drawing and carries no `data-testid`; one that takes props (a scene, the globe) follows this rule and [`props.md`](./props.md) (`export interface <Name>Props`), checked by `packages/ui/test/standards/asset-sfcs.test.mjs`.
- **PascalCase name** in `defineOptions` and **kebab** in the testid come from the same canonical name (see [`naming.md`](./naming.md)).

## Hard prohibitions

- Do not omit `data-testid` on an interactive component root.
- Do not put the category in a test id (`actions-button`, `input-chip`); the fallback is the component's own name.
- Do not derive a sub-component's root id from its parent's (`${ctx.testId}__trigger`); it uses its own name.
- Do not ignore a consumer-supplied `data-testid` (it must win over the fallback).
- Do not leave a test-critical inner element unaddressable.
- Do not join an inner part to its root with a single hyphen (`button-loading`); the part separator is `__` (`button__loading`).

## Enforcement

- **[`validate-spec-compliance.mjs`](../hooks/validate-spec-compliance.mjs)** blocks a root `.vue` whose `data-testid` fallback ≠ its own name — the same hook that ties the six naming surfaces together (see [`naming.md`](./naming.md)).
- **`check:naming`** (`testid` rule in [`naming-rules.mjs`](../../packages/ui/scripts/lib/naming-rules.mjs)) checks every `.vue` under `src/components`, sub-components included: the fallback must equal the file's name, and an inner id must join with `__`.

## Why this rule exists

Test ids used to carry the category (`actions-button`, `input-chip`), so a folder move renamed every id, and 30 sub-components reused or derived from their parent's id, so `getByTestId('content-item')` matched nine elements. Using the component's own name makes an id unique by construction and as easy to guess as the import path.
