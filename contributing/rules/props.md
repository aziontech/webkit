# Rule: props — typed interface, `withDefaults`, JSDoc, exported variant unions

Props are the **data + scalar configuration** surface of a component (anatomy is elements, not props — see [`compound-api.md`](./compound-api.md)). This rule fixes how that surface is *typed and defaulted*; the **naming** of each prop is fixed separately by [`prop-vocabulary.md`](./prop-vocabulary.md), and whether a prop is allowed at all by [`no-invention.md`](./no-invention.md) (only props the spec lists).

## The rule

> Props are declared with a **named, exported `interface <Component>Props`** consumed by `defineProps<ButtonProps>()`, wrapped in **`withDefaults`**. Every public prop carries a **JSDoc** line. No `any`. Variant unions are **named, exported types**. Optional text defaults to `''` (not `undefined`); booleans default to `false`.

```vue
<script setup lang="ts">
  /** Visual variant. */
  export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
  /** Size token. */
  export type ButtonSize = 'small' | 'medium' | 'large'

  export interface ButtonProps {
    /** Visual variant. */
    variant?: ButtonVariant
    /** Size token. */
    size?: ButtonSize
    /** Disables interaction. */
    disabled?: boolean
    /** Leading icon name. */
    icon?: string
  }

  const props = withDefaults(defineProps<ButtonProps>(), {
    variant: 'primary',
    size: 'large',
    disabled: false,
    icon: ''
  })
</script>
```

### Typing

- **Named, exported `interface <Component>Props`** + `defineProps<ButtonProps>()`, on every root and public part. Not the runtime object form (`defineProps({ variant: { type: String } })`), not an inline literal, never a bare exported `Props` — a named interface is what `vue-tsc` and the consumer's tooling read, and a consumer wrapping the component imports it (see [`naming.md`](./naming.md)). A generic component (`<script setup generic>`) keeps its inline `defineProps<{ … }>()`.
- **No `any`** and no `@ts-ignore` (blocked by [`validate-tokens.mjs`](../hooks/validate-tokens.mjs)). Use generics or precise unions.
- **Never declare `class` in `defineProps`** — consumer classes flow through `useAttrs()` (see [`root-element.md`](./root-element.md) and [`styling.md`](./styling.md)).

### Defaults

- **`withDefaults`** is the single place defaults live — not scattered `??` fallbacks in the template.
- **Optional text props default to `''`, not `undefined`** — so the template never renders the string `"undefined"` and bindings stay stable.
- **Booleans default to `false`** and carry **positive polarity, no `is`/`has` prefix** (`disabled`, `loading`, `open` — see [`prop-vocabulary.md`](./prop-vocabulary.md)).
- The default in `withDefaults` must match the spec's Props "Default" column — [`validate-spec-compliance.mjs`](../hooks/validate-spec-compliance.mjs) blocks drift.
- A two-way value is **not** a prop — it is `defineModel` (see [`v-model.md`](./v-model.md)).

### Exported variant unions

Every variant axis (`variant`, `size`, `severity`) is a **named type exported** from the component, so a consumer can type a variable that holds it and the examples and the catalog can name it. Derive the union from one place; do not repeat the literal set in JSDoc and in the type.

## JSDoc

Every public prop gets a one-line JSDoc `/** ... */`. It is the source of the docs site's prop table (`catalog.json`) and the consumer's editor hover. Keep it a plain sentence — **no angle brackets in the comment** (see [`styling.md`](./styling.md) § "no HTML-like tags in `<script>` comments").

## Hard prohibitions

- Do not use the runtime object form of `defineProps` for a typed component; use `defineProps<ButtonProps>()` (the exported `<Component>Props`) + `withDefaults`.
- Do not use `any` / `@ts-ignore` in a prop type.
- Do not declare `class` (or `style`) in `defineProps`.
- Do not default an optional text prop to `undefined`; default it to `''`.
- Do not inline an unnamed variant union — name and export it.
- Do not add a prop the spec does not list (see [`no-invention.md`](./no-invention.md)) or name one off-vocabulary (see [`prop-vocabulary.md`](./prop-vocabulary.md)).
- Do not turn a slot-shaped concern into a prop (config arrays of UI — see [`compound-api.md`](./compound-api.md)).

## Enforcement

- **[`validate-spec-compliance.mjs`](../hooks/validate-spec-compliance.mjs)** blocks props not in the spec, off-vocabulary names, `is`/`has` booleans, and default drift; **[`validate-tokens.mjs`](../hooks/validate-tokens.mjs)** blocks `any` / `@ts-ignore` / `class` in `defineProps`.
- `type-coverage` (95% threshold, CI) backstops the "no `any`" rule in `.ts` files; [`check-sfc-type-coverage.mjs`](../../packages/webkit/scripts/check-sfc-type-coverage.mjs) runs the same engine over the vue-tsc virtual files and fails when the count of identifiers typed `any` in component SFC scripts and templates grows (CI and the `sfc-type-coverage` gate).
- The component-scaffolder emits the `export interface <Component>Props` + `withDefaults` + JSDoc shape from the spec's Props table.

## Why this rule exists

Prop typing was described across `COMPONENT_REQUIREMENTS.md` (§2 Props, §2.1 JSDoc, §2.8 exported variant props) as prose, so it held only where the author remembered it — some components used the runtime object form, some skipped JSDoc, some inlined variant unions the consumer then could not name. Fixing the shape (named interface + `withDefaults` + JSDoc + exported unions) makes the prop table, the type hover, and the examples all derive from one honest source.
