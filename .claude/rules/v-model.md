# Rule: two-way state — `defineModel`, one way, controlled and uncontrolled at once

Every two-way value a component exposes goes through **`defineModel()`** (Vue 3.4+). Not a `modelValue` prop plus a hand-written `emit('update:modelValue')`; not a local `ref` mirrored into a `watch`. One macro, because it solves the two problems every stateful component has — **the controlled/uncontrolled split** and **the boilerplate** — in a single, uniform declaration.

## The rule

> A component's primary two-way value is `const model = defineModel<T>()`. A secondary two-way value is a **named** model (`const open = defineModel<boolean>('open')`). The consumer binds it with `v-model` / `v-model:open`. **Do not** declare a `modelValue` prop with a matching `update:modelValue` emit by hand when `defineModel` expresses it.

`defineModel` gives controlled **and** uncontrolled for free: when the parent binds `v-model`, the parent owns the value; when it doesn't, the returned ref holds local state. No `useControllable` dance, no `watch(() => props.modelValue)`.

## The canonical shapes

```vue
<script setup lang="ts">
  // Primary value — consumer writes v-model="x"
  const model = defineModel<string>({ default: '' })

  // Secondary value — consumer writes v-model:open="isOpen"
  const open = defineModel<boolean>('open', { default: false })

  // Transform on the boundary (normalize what leaves/enters)
  const trimmed = defineModel<string>({
    default: '',
    set: (v) => v.trim()
  })
</script>

<template>
  <input :value="model" @input="model = ($event.target as HTMLInputElement).value" />
</template>
```

- **Naming comes from [`prop-vocabulary.md`](./prop-vocabulary.md).** Primary value → default model (`modelValue` under the hood). Overlay open state → `open` (+ `v-model:open`), seeded by `defaultOpen`. Never `visible`/`show`/`isToggled`.
- **Defaults** go in the `defineModel` options object (`{ default }`), not in a separate `withDefaults`.
- **Boundary transforms** use `get` / `set` in the options — the place to trim, clamp, or coerce, so the parent and the internal value never disagree.
- The value type is explicit (`defineModel<string>()`), never inferred as `any`.

## Reshaping an existing two-way value is breaking

Moving a component from a manual `modelValue` prop + `update:modelValue` emit to `defineModel` is **not** breaking on its own — the public contract (`v-model`, the `update:modelValue` event) is identical, `defineModel` just generates it. But **renaming** the model, **adding** a required second model, or **changing** its type changes the `v-model` contract and is a major bump. Mark it `BREAKING CHANGE:` and update the spec's Props/Events tables, the story `argTypes`, and the "Show code" snippet together (see [`event-payloads.md`](./event-payloads.md) for the same discipline on events).

## Hard prohibitions

- Do not hand-write a `modelValue` prop + `emit('update:modelValue')` pair when `defineModel` expresses it.
- Do not mirror a prop into a local `ref` via `watch` to fake two-way binding — that is exactly what `defineModel` removes.
- Do not name the model off-vocabulary (`visible`, `show`, `value`, `isToggled`) — see [`prop-vocabulary.md`](./prop-vocabulary.md).
- Do not put the model's default in `withDefaults`; put it in the `defineModel` options.
- Do not leave the model untyped (`defineModel()` with no generic).

## Enforcement

- The **`webkit/prefer-define-model`** ESLint rule (in [`eslint-plugin`](../../packages/webkit/src/eslint-plugin/)) flags a `defineProps` that declares `modelValue` **and** a `defineEmits` that declares `update:modelValue` in the same `<script setup>` — the hand-rolled pattern `defineModel` replaces. `error` in `strict`, `warn` in `recommended`.
- **[`validate-spec-compliance.mjs`](../hooks/validate-spec-compliance.mjs)** already blocks off-vocabulary model names (`visible`, `isToggled`) via [`prop-vocabulary.md`](./prop-vocabulary.md).
- The scaffolder emits `defineModel` for every two-way value in the spec.

## Why this rule exists

The package had drifted to **two ways of doing one thing**: 9 components used `defineModel`, 31 still wrote `modelValue` + `update:modelValue` by hand, several with a `watch` to keep a local copy in sync. Every hand-rolled pair is a place a controlled/uncontrolled bug can hide (forget the `watch`, forget to emit, emit the stale value) and a place the consumer's mental model has to reset. `defineModel` is the one shape that is correct by construction — so it is the only shape allowed for new components, and the 31 are migrated onto it.
