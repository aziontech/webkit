# Rule: component structure — fixed folder layout, fixed `<script setup>` order

Two components should differ only in what they *do*, never in how their files are arranged or in what order their `<script setup>` reads. A consumer (or an agent) opening any component finds the parts in the same places. This rule fixes the **folder layout** of a component and the **section order** inside `<script setup>`.

## Folder layout

A component named `<name>` in category `<category>` lives at `packages/webkit/src/components/<category>/<name>/` and contains, as needed:

```
<category>/<name>/
  <name>.vue              # the root component
  index.ts                # compound API (composition only — see compound-api.md)
  injection-key.ts        # provide/inject key (composition only)
  composables/            # composables specific to this component (see composables.md)
    use-<name>-context.ts
  <name>-<part>/          # each public sub-component in its own folder (composition)
    <name>-<part>.vue
```

- **One component per `.vue` file**, named in kebab; the file name is the canonical name (see [`naming.md`](./naming.md)).
- **Category lives in the folder, never in the public import** (`@aziontech/webkit/<name>`, flat — see [`imports.md`](./imports.md)).
- **Co-locate** what only this component uses (its composables, its `injection-key.ts`, its sub-components). Promote to [`src/composables/`](../../packages/webkit/src/composables/) only when a second component needs it.
- **No per-component `package.json`** — exports are declared once in the root `packages/webkit/package.json#exports` (see [`compound-api.md`](./compound-api.md)).

## `<script setup>` section order

Every `<script setup lang="ts">` reads top-to-bottom in this fixed order. Omit a section that does not apply; never reorder.

```vue
<script setup lang="ts">
  // 1. imports
  import { computed, useAttrs } from 'vue'
  import { cn } from '@aziontech/webkit/utils/cn'

  // 2. defineOptions — name (PascalCase) + inheritAttrs
  defineOptions({ name: 'Chip', inheritAttrs: false })

  // 3. types (props/emits/slots interfaces, exported variant unions)
  export type ChipKind = 'primary' | 'secondary'
  interface Props { kind?: ChipKind; disabled?: boolean }

  // 4. props
  const props = withDefaults(defineProps<Props>(), { kind: 'primary', disabled: false })

  // 5. emits
  const emit = defineEmits<{ click: [event: MouseEvent, label: string] }>()

  // 6. models (defineModel)
  const model = defineModel<string>({ default: '' })

  // 7. slots
  defineSlots<{ default(): unknown }>()

  // 8. inject / composables
  const attrs = useAttrs()

  // 9. local state
  // 10. computed
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'input-chip')

  // 11. watchers / lifecycle
  // 12. functions
  // 13. defineExpose (minimal, intentional — see root-element.md)
</script>
```

`defineOptions` sets `name` in **PascalCase** (drives the six naming surfaces — [`naming.md`](./naming.md)) and `inheritAttrs: false` so attributes flow explicitly to the root (see [`root-element.md`](./root-element.md)).

## Hard prohibitions

- Do not put more than one component in a `.vue` file.
- Do not place a component outside `src/components/<category>/<name>/`.
- Do not leak the category into the public import path or the export key (see [`imports.md`](./imports.md)).
- Do not hoist a component-specific composable / `injection-key.ts` to `src/` before a second consumer exists.
- Do not reorder the `<script setup>` sections or omit `defineOptions({ name, inheritAttrs: false })`.
- Do not add a per-component `package.json`.

## Enforcement

- **[`validate-spec-compliance.mjs`](../hooks/validate-spec-compliance.mjs)** already enforces `defineOptions.name` = PascalCase(spec name) and the folder/testid derivation; a `.vue` off-layout is blocked at write.
- **`vue/component-tags-order`** (ESLint) keeps SFC blocks ordered; the `<script setup>` internal order is checked by the scaffolder skeleton and `echo-reporter`.
- The scaffolder writes the layout and the section order verbatim from the skeleton in [`component-scaffold`](../skills/component-scaffold/SKILL.md); this rule is the human-readable form of that skeleton. See also [`COMPONENT_REQUIREMENTS.md`](../docs/COMPONENT_REQUIREMENTS.md) § "Component Structure Order".

## Why this rule exists

`COMPONENT_REQUIREMENTS.md` described the structure order as prose in a long document; it bound nothing, so new components arranged their scripts however the author happened to. A fixed layout + fixed order is what lets a reader — or `validate-spec-compliance` — find `defineModel` or the `data-testid` fallback in the same place in every file, and what lets the scaffolder emit a skeleton that never has to be rearranged in review.
