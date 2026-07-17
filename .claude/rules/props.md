# Rule: props — typed interface, `withDefaults`, JSDoc, exported variant unions

Props are the **data + scalar configuration** surface of a component (anatomy is elements, not props — see [`compound-api.md`](./compound-api.md)). This rule fixes how that surface is *typed and defaulted*; the **naming** of each prop is fixed separately by [`prop-vocabulary.md`](./prop-vocabulary.md), and whether a prop is allowed at all by [`no-invention.md`](./no-invention.md) (only props the spec lists).

## The rule

> Props are declared with a **named `interface Props`** consumed by `defineProps<Props>()`, wrapped in **`withDefaults`**. Every public prop carries a **JSDoc** line. No `any`. Variant unions are **named, exported types**. Optional text defaults to `''` (not `undefined`); booleans default to `false`.

```vue
<script setup lang="ts">
  /** Visual variant. */
  export type ButtonKind = 'primary' | 'secondary' | 'outlined' | 'text'
  /** Size token. */
  export type ButtonSize = 'small' | 'medium' | 'large'

  interface Props {
    /** Visual variant. */
    kind?: ButtonKind
    /** Size token. */
    size?: ButtonSize
    /** Disables interaction. */
    disabled?: boolean
    /** Leading icon name. */
    icon?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'primary',
    size: 'large',
    disabled: false,
    icon: ''
  })
</script>
```

### Typing

- **Named `interface Props`** + `defineProps<Props>()`. Not the runtime object form (`defineProps({ kind: { type: String } })`), not an inline literal — a named interface is what `vue-tsc` and the consumer's tooling read.
- **No `any`** and no `@ts-ignore` (blocked by [`validate-tokens.mjs`](../hooks/validate-tokens.mjs)). Use generics or precise unions.
- **Never declare `class` in `defineProps`** — consumer classes flow through `useAttrs()` (see [`root-element.md`](./root-element.md) and [`styling.md`](./styling.md)).

### Defaults

- **`withDefaults`** is the single place defaults live — not scattered `??` fallbacks in the template.
- **Optional text props default to `''`, not `undefined`** — so the template never renders the string `"undefined"` and bindings stay stable.
- **Booleans default to `false`** and carry **positive polarity, no `is`/`has` prefix** (`disabled`, `loading`, `open` — see [`prop-vocabulary.md`](./prop-vocabulary.md)).
- The default in `withDefaults` must match the spec's Props "Default" column — [`validate-spec-compliance.mjs`](../hooks/validate-spec-compliance.mjs) blocks drift.
- A two-way value is **not** a prop — it is `defineModel` (see [`v-model.md`](./v-model.md)).

### Exported variant unions

Every variant axis (`kind`, `size`, `severity`) is a **named type exported** from the component, so a consumer can type a variable that holds it and the story `argTypes` can reference it. Derive the union from one place; do not repeat the literal set in JSDoc and in the type.

## JSDoc

Every public prop gets a one-line JSDoc `/** ... */`. It is the source of the Storybook prop table and the consumer's editor hover. Keep it a plain sentence — **no angle brackets in the comment** (they break the SFC compiler on Storybook's second parse — see [`styling.md`](./styling.md) § "no HTML-like tags in `<script>` comments").

## Hard prohibitions

- Do not use the runtime object form of `defineProps` for a typed component; use `defineProps<Props>()` + `withDefaults`.
- Do not use `any` / `@ts-ignore` in a prop type.
- Do not declare `class` (or `style`) in `defineProps`.
- Do not default an optional text prop to `undefined`; default it to `''`.
- Do not inline an unnamed variant union — name and export it.
- Do not add a prop the spec does not list (see [`no-invention.md`](./no-invention.md)) or name one off-vocabulary (see [`prop-vocabulary.md`](./prop-vocabulary.md)).
- Do not turn a slot-shaped concern into a prop (config arrays of UI — see [`compound-api.md`](./compound-api.md)).

## Enforcement

- **[`validate-spec-compliance.mjs`](../hooks/validate-spec-compliance.mjs)** blocks props not in the spec, off-vocabulary names, `is`/`has` booleans, and default drift; **[`validate-tokens.mjs`](../hooks/validate-tokens.mjs)** blocks `any` / `@ts-ignore` / `class` in `defineProps`.
- `type-coverage` (95% threshold, CI) backstops the "no `any`" rule.
- The scaffolder emits the `interface Props` + `withDefaults` + JSDoc shape from the spec's Props table.

## Why this rule exists

Prop typing was described across `COMPONENT_REQUIREMENTS.md` (§2 Props, §2.1 JSDoc, §2.8 exported variant props) as prose, so it held only where the author remembered it — some components used the runtime object form, some skipped JSDoc, some inlined variant unions the consumer then could not name. Fixing the shape (named interface + `withDefaults` + JSDoc + exported unions) makes the prop table, the type hover, and the story controls all derive from one honest source.
