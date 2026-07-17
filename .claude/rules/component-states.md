# Rule: component states — a declared, rendered state surface

A component is not just its happy path. Every interactive component has a **state surface** — the set of conditions it must visibly handle — and that surface is **declared in the spec** and **rendered through `data-*` + the package's own components**, never improvised per screen. This rule fixes which states are canonical and how they are expressed. It is the DS-side of "estados definidos": the component owns its states; the consuming application only supplies the trigger (a boolean, or async data).

## The canonical state surface

| State | Prop / trigger | How it renders |
|---|---|---|
| `disabled` | `disabled` prop | `data-disabled` + disabled tokens; not focusable |
| `loading` | `loading` prop | `data-loading` + `Skeleton` / spinner affordance; interaction suppressed |
| `invalid` | validation (form field) | `data-invalid` + error tokens + `HelperText` message |
| `readonly` | `readonly` prop | `data-readonly`; value visible, not editable |
| `empty` | no data (data-driven components) | the `EmptyState` component, not an ad-hoc "no results" string |
| `error` | load/action failure (data-driven) | an error slot / message, not a bare thrown error |
| `open` / `closed` | `open` (+ `v-model:open`) | `data-state="open|closed"` (overlays) |

Not every component has every state — a `Button` has `disabled` + `loading`; a data `Table` adds `empty` + `error`. The spec's **state matrix** lists exactly the ones that component owns.

## The rule

> Every state a component owns is **declared in the spec's state matrix** and **rendered by the component itself** — via a `data-*` attribute (styled by a Tailwind `data-[...]:` variant, per [`styling.md`](./styling.md)) or by composing the package's own state components (`Skeleton`, `EmptyState`, `HelperText`). A consumer supplies only the trigger; it never re-implements the loading placeholder or the empty message.

```vue
<template>
  <div :data-loading="loading || null" :data-disabled="disabled || null">
    <Skeleton v-if="loading" kind="shape" />
    <EmptyState v-else-if="isEmpty" :title="emptyTitle" />
    <slot v-else />
  </div>
</template>
```

- **States switch on `data-*`, styled inline** — no `loading ? 'opacity-80' : ''` ternary in `:class` (see [`styling.md`](./styling.md)).
- **Loading / empty reuse the package's components** — `Skeleton` for placeholders, `EmptyState` for no-data. A component never hand-rolls a spinner or a "Nothing here" string that a shipped component already provides.
- **The data that drives `loading`/`empty`/`error` comes from the consumer** (a prop, or async state the app owns). The DS ships **no** data fetching (see [`composables.md`](./composables.md) § "Out of scope"); it ships the *rendering* of each state.

## Hard prohibitions

- Do not ship an interactive component whose spec omits its state matrix.
- Do not render a state with a `:class` ternary — use `data-*` + a Tailwind variant.
- Do not hand-roll a loading placeholder or empty message when `Skeleton` / `EmptyState` exists.
- Do not fetch data or own async state inside a component to drive its states — the trigger comes from the consumer.

## Enforcement

- **[`validate-spec-compliance.mjs`](../hooks/validate-spec-compliance.mjs)** checks the props/events behind each state against the spec; the state-matrix section becomes a required part of the spec (see [`.specs/_template.md`](../../.specs/_template.md)).
- **[`validate-tokens.mjs`](../hooks/validate-tokens.mjs)** + `webkit/no-style-override` keep state styling on `data-*` + tokens.
- Storybook: each mutually-exclusive state is its own story (Loading / Disabled / Empty / Invalid) — see [`storybook-source.md`](./storybook-source.md).

## Why this rule exists

State handling was implicit: the spec's state matrix existed but did not have to be complete, and "loading" or "empty" got re-invented at each call site (a spinner here, a `v-if="!items.length"` string there) instead of routed through `Skeleton` / `EmptyState`. Declaring the state surface per component and rendering it from the package's own components is what makes a screen's loading/empty/error look identical everywhere — and keeps the data that triggers them where it belongs, in the consuming app.
