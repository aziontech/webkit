# Rule: `data-testid` — derived name on the root, overridable

Every component root carries a **`data-testid`** with a name derived from the component's own name, so tests (and the consuming app's tests) can target it without the consumer inventing selectors. This rule fixes the derivation and the override path. The name is one of the six naming surfaces governed by [`naming.md`](./naming.md).

## The rule

> The root element sets `:data-testid`, defaulting to **`<category>-<name>`** — or **`input-<name>`** for input components. The consumer overrides it by passing `data-testid` as an attribute. Interactive sub-elements that a test needs to reach get their own derived testid.

```vue
<script setup lang="ts">
  import { computed, useAttrs } from 'vue'
  defineOptions({ name: 'Chip', inheritAttrs: false })
  const attrs = useAttrs()
  // consumer-supplied data-testid wins; otherwise the derived fallback
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'input-chip')
</script>

<template>
  <div v-bind="$attrs" :data-testid="testId"><slot /></div>
</template>
```

- **Fallback**: `input-<name>` for the `inputs` category, `<category>-<name>` for everything else (`content-badge`, `feedback-toast`, `data-table`).
- **Override**: the consumer passes `data-testid="…"`; because the root reads `attrs['data-testid']` for its fallback and also spreads `v-bind="$attrs"`, the passed value wins. Read it from `attrs` for the computed fallback so it is not applied twice with different values.
- **Sub-elements**: an interactive part a test must click (a sort button, a remove `×`) gets its own testid derived from the root (`data-table-sort-button`), so tests do not depend on DOM structure.
- **PascalCase name** in `defineOptions` and **kebab** in the testid come from the same canonical name (see [`naming.md`](./naming.md)).

## Hard prohibitions

- Do not omit `data-testid` on an interactive component root.
- Do not hard-code the testid to a literal that disagrees with `<category>-<name>` / `input-<name>`.
- Do not ignore a consumer-supplied `data-testid` (it must win over the fallback).
- Do not apply the same testid to two elements, or leave a test-critical sub-element unaddressable.

## Enforcement

- **[`validate-spec-compliance.mjs`](../hooks/validate-spec-compliance.mjs)** blocks a root `.vue` whose `data-testid` fallback ≠ `<category>-<name>` (`input-<name>` for inputs) — the same hook that ties the six naming surfaces together (see [`naming.md`](./naming.md)).
- `COMPONENT_REQUIREMENTS.md` § "Data-testid Attributes" is the long-form reference; this rule is the sharp, enforced form.

## Why this rule exists

The testid convention was enforced by `validate-spec-compliance` but documented only inside a 1000-line requirements file (referenced as a phantom `bem-testid.md` that did not exist as a rule). Pulling it into a real rule makes the enforced behaviour discoverable — and makes the derivation (`<category>-<name>`, consumer override wins) the single answer instead of something each author re-derived.
