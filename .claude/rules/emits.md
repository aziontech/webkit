# Rule: emits — typed `defineEmits`, kebab names, model vs. activation

Events are declared with the **type-only `defineEmits`** form, named in **kebab-case**, and split into two kinds with two different payload shapes. This rule fixes the declaration and the naming; the **payload of activation events** (event-first `(event, item)`) is fixed by [`event-payloads.md`](./event-payloads.md), and it is the authority whenever the two overlap.

## The rule

> `const emit = defineEmits<{ ... }>()` with the **tuple type-literal** syntax. Event names are **kebab-case**. **Model events** (`update:<name>`) carry the new value; **activation events** carry `(event, item?)`. No runtime array form, no camelCase names, no `on`-prefixed props.

```vue
<script setup lang="ts">
  const emit = defineEmits<{
    // model — the new value (prefer defineModel; see v-model.md)
    'update:modelValue': [value: string]
    // activation — DOM event first, subject second (see event-payloads.md)
    'item-click': [event: MouseEvent, item: SplitButtonItem]
    // lone control — event only
    close: [event: MouseEvent]
  }>()
</script>
```

### Two kinds of event

| Kind | Shape | Example |
|---|---|---|
| **Model / value** | the new value only, no DOM event | `update:modelValue`, `value-change`, `sort` |
| **Activation** (click, select, remove, row-click…) | `(event: Event, item?)` — DOM event **first**, subject **second** | `item-click`, `row-click`, `remove` |

- **Prefer `defineModel`** over declaring `update:<name>` by hand — a two-way value is a model, not a manual emit (see [`v-model.md`](./v-model.md)). Declare `update:*` in `defineEmits` only for a one-way "changed" signal that is not a `v-model`.
- **No redundant echo.** When `update:<x>` (or `v-model`) exists, do **not** also emit `<x>-change` — it is blocked (see [`prop-vocabulary.md`](./prop-vocabulary.md)). A genuinely distinct commit event (commit-on-blur) is a bare `change`, never `<x>-change`.
- **Activation payloads follow [`event-payloads.md`](./event-payloads.md) exactly** — event first, subject second, never `(item, event)`, never the event buried in an object.

### Naming

- **kebab-case** (`item-click`, `row-click`, `update:modelValue`), never camelCase (`itemClick`, `onValueChange`).
- No `on`-prefixed **props** to fake events — declare the event, let the consumer bind `@item-click`.
- The event name says what happened in the component's own vocabulary (see [`event-payloads.md`](./event-payloads.md) for what counts as the `item`).

## Hard prohibitions

- Do not use the runtime array form (`defineEmits(['click'])`) — use the typed tuple-literal form.
- Do not name an event in camelCase or with an `on` prefix.
- Do not hand-declare `update:modelValue` when `defineModel` expresses the two-way value.
- Do not emit a redundant `<x>-change` alongside `update:<x>` / `v-model`.
- Do not emit an activation event without the DOM `event` first (see [`event-payloads.md`](./event-payloads.md)).
- Do not add an event the spec's Events table does not list (see [`no-invention.md`](./no-invention.md)).

## Enforcement

- **[`validate-spec-compliance.mjs`](../hooks/validate-spec-compliance.mjs)** blocks events not in the spec, camelCase event names, and redundant `<x>-change` echoes.
- [`event-payloads.md`](./event-payloads.md) governs the payload order for activation events; its enforcement covers the `(event, item)` shape.
- The scaffolder emits the typed `defineEmits` form from the spec's Events table.

## Why this rule exists

Events had drifted on two axes at once: **declaration** (some used the runtime array form, losing the payload types) and **payload** (`item-click` emitting `(item)`, `step-click` emitting `(index, event)`, `select` burying the event in `{ value, event }`). Fixing the declaration here and the payload order in [`event-payloads.md`](./event-payloads.md) makes every handler in a consumer read the same — `@item-click="(event, item) => …"` — and every payload fully typed.
