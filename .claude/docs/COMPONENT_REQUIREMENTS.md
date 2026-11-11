# Component Development Requirements for @aziontech/webkit

This document outlines the requirements and best practices for building components in the webkit package (v6). Use it when creating new components or changing existing ones. The binding, hook-enforced versions of these rules live in [`.claude/rules/`](../rules/README.md); where this document and a rule disagree, the rule wins.

## Table of Contents

- [Names (v6)](#names-v6)
- [Directory Structure](#directory-structure)
- [Component Implementation Requirements](#component-implementation-requirements)
- [Package Configuration](#package-configuration)
- [TypeScript Declarations](#typescript-declarations)
- [Testing Requirements](#testing-requirements)
- [Export Configuration](#export-configuration)
- [Vue Router Components](#vue-router-components)
- [Best Practices](#best-practices)

---

## Names (v6)

v6 uses the names of shadcn/ui and Radix. Never write a retired name in new code, docs or stories; `npx @aziontech/webkit migrate v6` rewrites them in consumer code ([`src/cli/migrations/v6.json`](../../packages/webkit/src/cli/migrations/v6.json)).

| Retired (v5)                                            | v6                                                                       |
| ------------------------------------------------------- | ------------------------------------------------------------------------ |
| `paginator` / `Paginator`                               | `pagination` / `Pagination`                                              |
| `tab-view` / `TabView`                                  | `tabs` / `Tabs`                                                          |
| `card-box` / `CardBox`                                  | `card` / `Card`                                                          |
| `message` / `Message`                                   | `alert` / `Alert`                                                        |
| `divider` / `Divider`                                   | `separator` / `Separator`                                                |
| `progress-bar` / `ProgressBar`                          | `progress` / `Progress`                                                  |
| `command-menu` / `CommandMenu`                          | `command` / `Command`                                                    |
| `dropdown` / `Dropdown`                                 | `dropdown-menu` / `DropdownMenu`                                         |
| `input-text` / `InputText`                              | `input` / `Input`                                                        |
| `input-number` / `InputNumber`                          | `number-input` / `NumberInput`                                           |
| `input-password` / `InputPassword`                      | `password-input` / `PasswordInput`                                       |
| `box-grid-selection` / `BoxGridSelection`               | `radio-cards` / `RadioCards`                                             |
| `resizable-panel` / `ResizablePanel`                    | `resizable` / `Resizable`                                                |
| `segmented-button` / `SegmentedButton`                  | `toggle-group` / `ToggleGroup`                                           |
| every `field-*` wrapper (`FieldText`, `FieldSelect`, …) | one `Field` around the plain control (see [Form fields](#4-form-fields)) |

Exported types follow the component: `SeverityTagSeverity` (not `SeverityTagLevel`), `DocCardGroupMobileColumns` (not `DocCardGroupMobileCols`), `ToggleGroupOption`, `AlertSeverity`, `TabsValue`, … (the `types` map of `v6.json`).

Prop vocabulary ([`rules/prop-vocabulary.md`](../rules/prop-vocabulary.md)):

- the primary value is `modelValue`, bound with `v-model` — never `v-model:value`;
- a frame is `bordered`, never `border`; a copy affordance is `copyable`, never `showCopy`;
- self-advancing media is `autoplay` / `autoplayInterval`; a column count below `md` is `mobileColumns`;
- `Button` kinds are `primary`, `secondary`, `outlined`, `transparent` and `danger` (`kind="transparent"`, never `kind="text"`); `Item` uses `kind="outlined"`;
- severities are `info`, `success`, `warning` and `danger` (`severity="danger"`, never `error`); `SeverityTag` takes `severity`, not `level`.

Page fragments are components, not copied markup: `PageHeader`, `SectionHeader`, `PageTabs`, `SettingsSection`, `SettingRow`, `SaveBar` and `ConfirmDialog`. Use them instead of hand-building the h1 row, a section heading, the tab strip under a resource header, a settings band or row, the save / discard bar or a confirm dialog.

---

## Directory Structure

Every component lives in one folder under its category:

```
packages/webkit/src/components/<category>/<name>/
├── <name>.vue        # root component (or <name>-root.vue for a compound root)
├── index.ts          # compound components: attaches the parts (Tabs.List, Field.Label, …)
├── <part>/<part>.vue # compound parts, or <name>-<part>.vue next to the root
├── injection-key.ts  # compound context, when the parts share state
└── <name>.test.ts    # browser test (rules/testing.md)
```

Categories: `actions`, `chart`, `code`, `content`, `data`, `documentation`, `feedback`, `inputs`, `layout`, `marketing`, `navigation`, `overlay`, `sections`, `utils`. The spec is `.specs/<name>.md`, the story is `apps/storybook/src/stories/components/<category>/<name>/`, and runnable examples are `packages/webkit/examples/<export>/` (folder named after the export it documents). The full layout and script order are [`rules/component-structure.md`](../rules/component-structure.md).

**Example:**

```
packages/webkit/src/components/inputs/field/
├── field.vue
├── index.ts
├── field-label/field-label.vue
├── field-description/field-description.vue
├── field-error/field-error.vue
├── injection-key.ts
└── field.test.ts
```

---

## Component Implementation Requirements

### 1. Component Structure Order (Required)

All components MUST follow this structure:

1. `<script setup lang="ts">` tag first
2. `<template>` tag second

**CRITICAL:** Always place `<script setup>` BEFORE `<template>` in Vue Single File Components.

**✅ CORRECT:**

```vue
<script setup lang="ts">
  import { computed } from 'vue'
</script>

<template>
  <!-- Component template -->
</template>
```

**❌ INCORRECT:**

```vue
<template>
  <!-- Component template -->
</template>

<script setup lang="ts">
  import { computed } from 'vue'
</script>
```

### 2. Props Definition

Props are typed with `defineProps<Props>()` and `withDefaults`, each with a one-line JSDoc ([`rules/props.md`](../rules/props.md)). The primary value is a `defineModel` (`v-model`, [`rules/v-model.md`](../rules/v-model.md)):

```vue
<script setup lang="ts">
  export type ExampleSize = 'small' | 'medium' | 'large'

  interface Props {
    /** Visible label text. */
    label?: string
    /** Size token; affects height, padding and typography. */
    size?: ExampleSize
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    size: 'medium',
    disabled: false
  })

  const model = defineModel<string>({ default: '' })
</script>
```

Webkit components merge consumer classes from fallthrough attributes, not from a `class` prop:

```vue
<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'Example',
    inheritAttrs: false
  })

  const attrs = useAttrs()

  const rootClass = computed(() => ['base-classes', attrs.class])
</script>
```

- Set `inheritAttrs: false` in `defineOptions`
- Call `useAttrs()` and append `attrs.class` to the root element class list
- Do **not** declare `class` in `defineProps()`

### 3. Events Definition

Define typed events with `defineEmits` ([`rules/emits.md`](../rules/emits.md), [`rules/event-payloads.md`](../rules/event-payloads.md)):

```vue
<script setup lang="ts">
  const emit = defineEmits<{
    change: [value: string]
    blur: [event: FocusEvent]
  }>()
</script>
```

### 4. Form fields

There are no `field-*` wrappers in v6. A labelled control is `Field` around the plain control, the shadcn/ui anatomy; the control picks up its id, `aria-describedby`, `aria-invalid` and `disabled` from the `Field`. Validation libraries (VeeValidate, …) stay in the app: pass their error to `Field` `invalid` and `Field.Error`.

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'

  const name = ref('')
</script>

<template>
  <Field required>
    <Field.Label>Name</Field.Label>
    <Input v-model="name" />
    <Field.Description>Shown on invoices.</Field.Description>
  </Field>
</template>
```

`Field` carries `orientation` (`vertical`, `horizontal`, `responsive`), `invalid`, `disabled` and `required`. A checkbox, radio or switch row is `Field orientation="horizontal"` with the control and a `Field.Content` (`Field.Label` + `Field.Description`); a group of them is `Field.Set` with a `Field.Legend`.

### 5. Data-testid Attributes (Required)

The root reads `data-testid` from its attributes and falls back to `<category>-<name>` of the v6 name (`actions-button`, `feedback-alert`, `layout-separator`); parts derive BEM-style ids from it ([`rules/testid.md`](../rules/testid.md)):

```vue
<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'feedback-alert')
</script>

<template>
  <div :data-testid="testId">
    <p :data-testid="`${testId}__title`" />
  </div>
</template>
```

### 6. Component File Naming

- Use kebab-case English names that match the export: `password-input.vue`, `toggle-group.vue` ([`rules/naming.md`](../rules/naming.md))
- Directory name MUST match the component filename; `defineOptions.name` is its PascalCase (`PasswordInput`)

### 7. Template Structure

Organize the template logically and compose existing components instead of re-drawing them:

```vue
<template>
  <section :data-testid="testId">
    <SectionHeader
      title="Domains"
      description="Where this application answers."
    />
    <Field>
      <Field.Label>Domain</Field.Label>
      <Input v-model="domain" />
      <Field.Error v-if="error">{{ error }}</Field.Error>
    </Field>
    <Separator />
    <Button
      kind="transparent"
      label="Cancel"
    />
  </section>
</template>
```

---

## Package Configuration

Components do **not** have a per-folder `package.json`. Module resolution goes through the root [`packages/webkit/package.json#exports`](../../packages/webkit/package.json) map, which points every public path directly at a source file (`.vue`/`.ts`/`.js`). The root `package.json` also declares `"sideEffects": ["**/*.vue", "**/*.css"]` once for the whole package. To publish a component, add its export entry (see [Export Configuration](#export-configuration) below).

---

## TypeScript Declarations

TypeScript declaration files (`.d.ts`) are **auto-generated** using Vue TSC. They are emitted at publish time by the publish workflow (`.github/workflows/package-webkit.yml` runs `vue-tsc --declaration --emitDeclarationOnly` right before `npm publish`, on release-please's `release: published`) and ship to npm consumers; declaration-emit is validated in CI by `type-check` (`vue-tsc --noEmit`).

**DO NOT manually edit `.d.ts` or `.d.ts.map` files.**

Exported type names start with the component's v6 binding (`ToggleGroupSize`, `AlertSeverity`) and use the v6 prop name (`DocCardGroupMobileColumns`). Renaming one is a breaking change: add it to the `types` map of `src/cli/migrations/v6.json` so `migrate` rewrites consumer imports.

---

## Testing Requirements

### Test IDs

All components MUST support `data-testid` for testing (see [Data-testid Attributes](#5-data-testid-attributes-required)).

### Testable Elements

Ensure these elements have test IDs:

- Labels
- Inputs/Interactive elements
- Error messages
- Description text
- Buttons/Actions

Every component has its browser test next to it ([`rules/testing.md`](../rules/testing.md)); the `test-gate` gate fails without it.

---

## Export Configuration

After creating a component, add it to the package exports:

### Location: `/packages/webkit/package.json`

```json
{
  "exports": {
    "./<name>": "./src/components/<category>/<name>/<name>.vue"
  }
}
```

**Compound component:**

```json
{
  "exports": {
    "./field": "./src/components/inputs/field/index.ts",
    "./field-label": "./src/components/inputs/field/field-label/field-label.vue"
  }
}
```

Removing or renaming an export, a prop or a prop value of an existing component is a breaking change: add the matching entry to `src/cli/migrations/` (`v6.json`, `v6-props.json`, `v6-blocks.json`). The `migrations` gate (`node scripts/check-migrations.mjs`) compares the public API of `catalog.json` with `scripts/api-snapshot.json` and fails without it.

---

## Vue Router Components

Some components may require Vue Router for navigation or routing features.

### When to Use Vue Router

- Components with internal navigation
- Components that render links/routes
- Components that need route awareness (active state, params)

### Usage in Components

```vue
<script setup lang="ts">
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const navigate = () => {
    router.push('/path')
  }
</script>

<template>
  <button @click="navigate">Navigate</button>
</template>
```

### Requirements for Router Components

1. **Import Vue Router composables:**

   ```vue
   import { useRouter, useRoute } from 'vue-router'
   ```

2. **Handle cases where router is not available:**

   ```vue
   <script setup lang="ts">
     import { getCurrentInstance } from 'vue'

     const instance = getCurrentInstance()
     const router = instance?.appContext.config.globalProperties.$router
   </script>
   ```

3. **Document the router dependency** in the spec

4. **Add vue-router to peerDependencies** (if strictly required):
   ```json
   {
     "peerDependencies": {
       "vue-router": "^4.0.0"
     }
   }
   ```

---

## Best Practices

### 1. Component Design

- ✅ **DO:** Create focused, single-responsibility components
- ✅ **DO:** Use composition over inheritance
- ✅ **DO:** Provide sensible defaults
- ❌ **DON'T:** Add business logic to components; it belongs to the app or a block
- ❌ **DON'T:** Create deeply nested component hierarchies

### 2. Props and Events

- ✅ **DO:** Type every prop and give optional props a default
- ✅ **DO:** Use the shared vocabulary (`modelValue`, `bordered`, `copyable`, `autoplay`, `kind`, `severity`, `size`)
- ✅ **DO:** Use descriptive event names
- ❌ **DON'T:** Use overly generic prop names
- ❌ **DON'T:** Mutate props directly

### 3. Styling

- ✅ **DO:** Use the webkit token + `data-*` styling conventions
- ✅ **DO:** Support custom classes via `attrs.class` (`useAttrs()` with `inheritAttrs: false`; do not declare `class` as a prop)
- ✅ **DO:** Use Tailwind CSS utility classes with logical directions (`ms-`, `pe-`, `start-`, `text-end`)
- ❌ **DON'T:** Hardcode colors or spacing
- ❌ **DON'T:** Use inline styles

### 4. Accessibility

- ✅ **DO:** Include proper ARIA attributes
- ✅ **DO:** Support keyboard navigation
- ✅ **DO:** Provide labels for interactive elements
- ❌ **DON'T:** Rely solely on color to convey information

### 5. Performance

- ✅ **DO:** Use `computed` for derived state
- ✅ **DO:** Lazy load heavy dependencies
- ✅ **DO:** Use `v-show` instead of `v-if` for frequent toggles
- ❌ **DON'T:** Create unnecessary reactive state
- ❌ **DON'T:** Watch deeply nested objects unnecessarily

### 6. Error Handling

- ✅ **DO:** Show user-friendly error messages
- ✅ **DO:** Take every user-facing string from a prop or the message catalog (`useLocale()`)
- ❌ **DON'T:** Let errors crash the component
- ❌ **DON'T:** Expose internal errors to users

### 7. Documentation

- ✅ **DO:** Document every public prop with a one-line JSDoc
- ✅ **DO:** Provide runnable examples in `examples/<export>/`
- ❌ **DON'T:** Write prose comments in implementation code ([`rules/comments.md`](../rules/comments.md))

---

## Component Creation Checklist

- [ ] Spec approved: `.specs/<name>.md`
- [ ] Create directory: `src/components/<category>/<name>/`
- [ ] Create Vue component: `<name>.vue` with `<script setup lang="ts">`
- [ ] Type props (with JSDoc) and events; primary value through `defineModel`
- [ ] Add the `data-testid` fallback `<category>-<name>`
- [ ] Add the export to `package.json`
- [ ] Add the browser test `<name>.test.ts`
- [ ] Add the story and `examples/<name>/`
- [ ] Rebuild the catalog: `node scripts/build-catalog.mjs`

### Vue Router Components (Additional)

- [ ] Import and use Vue Router composables
- [ ] Handle router unavailability gracefully
- [ ] Add vue-router to peerDependencies (if required)
- [ ] Test with and without router context

---

## Examples

### Example: Form screen with `Field`

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import Button from '@aziontech/webkit/button'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import Switch from '@aziontech/webkit/switch'

  const name = ref('')
  const active = ref(true)
  const error = ref('')
</script>

<template>
  <PageHeader
    title="Edit application"
    description="Changes apply to every domain."
  />
  <Field
    required
    :invalid="Boolean(error)"
  >
    <Field.Label>Name</Field.Label>
    <Input v-model="name" />
    <Field.Error>{{ error }}</Field.Error>
  </Field>
  <Field orientation="horizontal">
    <Switch v-model="active" />
    <Field.Content>
      <Field.Label>Active</Field.Label>
      <Field.Description>Inactive applications answer 503.</Field.Description>
    </Field.Content>
  </Field>
  <Button label="Save" />
</template>
```

### Example: Component with Vue Router

```vue
<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import Button from '@aziontech/webkit/button'

  const props = defineProps<{
    /** Route to open. */
    to: string
    /** Visible label text. */
    label: string
  }>()

  const router = useRouter()

  const navigate = () => {
    router.push(props.to)
  }
</script>

<template>
  <Button
    kind="outlined"
    :label="label"
    @click="navigate"
  />
</template>
```

---

## Troubleshooting

### TypeScript Declaration Issues

**Problem:** `.d.ts` files are missing or outdated

**Solution:** Declarations are generated at publish time by the publish workflow (`.github/workflows/package-webkit.yml`, `vue-tsc --declaration --emitDeclarationOnly`); declaration-emit is validated locally and in CI by `type-check` (`vue-tsc --noEmit`). Run `pnpm webkit:type-check` to surface declaration errors.

### Export Not Found

**Problem:** Component cannot be imported

**Solution:**

1. Check the v6 name: a retired name (`paginator`, `input-text`, `field-text`, …) is not exported any more
2. Verify the component exists in its category folder
3. Check the `package.json` export

### Vue Router Not Available

**Problem:** Component fails when router is not installed

**Solution:**

```vue
<script setup lang="ts">
  import { getCurrentInstance } from 'vue'

  const instance = getCurrentInstance()
  const router = instance?.appContext.config.globalProperties.$router

  const handleClick = () => {
    if (router) {
      router.push('/path')
    } else {
      window.location.href = '/path'
    }
  }
</script>
```

---

## Additional Resources

- [Vue 3 Composition API](https://vuejs.org/api/composition-api-setup.html)
- [Vue Router Documentation](https://router.vuejs.org/)
- [shadcn/ui Field](https://ui.shadcn.com/docs/components/field)
- [`MIGRATION-v6.md`](../../packages/webkit/MIGRATION-v6.md)

---

## Webkit Layer Pattern (in-depth)

This section describes the canonical pattern enforced for components living under `packages/webkit/src/components/<category>/<name>/`. It complements the structure rules above with the visual, behavioral, and quality requirements derived from the canonical implementations: [button.vue](../../packages/webkit/src/components/actions/button/button.vue), [icon-button.vue](../../packages/webkit/src/components/actions/icon-button/icon-button.vue), [card-pricing.vue](../../packages/webkit/src/components/content/card-pricing/card-pricing.vue).

> **No hallucination — only reference things that exist.** Before importing any module, calling any function, mentioning any file path, or referencing any package/export in generated code, verify it exists: `@aziontech/webkit/<subpath>` must appear in [`package.json#exports`](../../packages/webkit/package.json); relative imports must resolve on disk; npm packages must be installed; workspaces must have a `package.json`. If a needed module is missing, install it, create the file, or annotate the gap as a pending item in the report — never invent imports. The `validate-references.mjs` hook physically blocks Writes whose new imports do not resolve. Sub-sections marked `— pending` below describe patterns that depend on dependencies not yet installed; do not emulate them with phantom paths.

### 1. Source of truth: `DESIGN.md`

All visual rules (typography classes, spacing, max-width, shape, semantic colors) come from [DESIGN.md](./DESIGN.md). In any conflict, **DESIGN.md wins**.

- **Typography** is always applied via the generated class from `texts.data.js` — `text-heading-md`, `text-body-sm`, `text-label-md`, `text-button-lg`, `text-overline-md`, `text-big-number-lg`, etc. Never use `text-(length:--text-*)` raw, never `leading-*`/`tracking-*`/`font-family` directly. Full catalog in [DESIGN.md "Available text styles"](./DESIGN.md).
- **Semantic colors:** `var(--primary)`, `var(--primary-contrast)`, `var(--secondary)`, `var(--secondary-contrast)`, `var(--bg-hover)`, `var(--bg-active)`, `var(--bg-disabled)`, `var(--bg-surface)`, `var(--bg-canvas)`, `var(--bg-mask)`, `var(--border-default)`, `var(--border-muted)`, `var(--border-strong)`, `var(--text-default)`, `var(--text-muted)`, `var(--text-disabled)`, `var(--ring-color)`, and feedback variants (`--success`/`--warning`/`--danger`/`--info` + `-contrast`/`-border`).
- **Shape:** `var(--shape-button)`, `var(--shape-elements)`, `var(--shape-card)`, `var(--shape-flat)`. For pseudo-element inheritance use `rounded-[inherit]`.
- **Spacing:** `var(--spacing-1)..(--spacing-N)` applied via `px-[...]` / `py-[...]` / `gap-[...]` / `m-[...]`. For section-level responsive spacing use the semantic utilities (`gap-spacing-elements-md`, `p-spacing-elements-lg`).
- **Max width:** `var(--container-max-width)` for layout containers, `var(--container-3xs..--container-7xl)` for fixed content (cards, modals). Utility helper: `.max-container-width`.
- **Forbidden:** hex/rgb/hsl hardcoded; Tailwind palette names (`bg-gray-*`, `text-violet-*`); external/legacy color utilities (`text-color`, `surface-*`); raw typography (`text-xs`/`text-sm`/`text-base`/`text-lg`).

### 2. TypeScript tipado obrigatório

Every new component in the webkit layer uses `<script setup lang="ts">` with:

- `defineProps<{...}>()` or `withDefaults(defineProps<{...}>(), {...})`.
- `defineEmits<{...}>()`.
- `defineSlots<{...}>()` when the component exposes named/scoped slots.
- `defineModel<T>('propName')` for the principal controllable prop.
- Explicit types for variants (`type Kind = 'primary' | ...`).
- Typed maps (`Record<Kind, string>`).
- Zero `any`, zero `// @ts-ignore`.

### 2.1. JSDoc/TSDoc em cada prop pública

Every public prop must have a one-line JSDoc/TSDoc above its type — it surfaces as autocomplete and hover docs in the consumer's IDE.

```ts
interface Props {
  /** Visible label rendered inside the component. */
  label?: string
  /** Visual variant. Use `primary` for primary actions, `text` for tertiary. */
  kind?: Kind
  /** Controlled open state. Use with `v-model:open` or `@update:open`. */
  open?: boolean
}
```

### 2.2. Naming conventions

- **Visual variants** are always exposed as `kind` (`'primary' | 'secondary' | 'outlined' | 'text' | 'transparent'`). Never `variant`, `color`, or `appearance`.
- **Sizes** are always exposed as `size` with values `'small' | 'medium' | 'large'`.
- **Boolean states** are exposed without `is`/`has` prefix on the prop (`disabled`, `loading`, `open`, `selected`, `expanded`, `readonly`). Internal computeds may use `isInactive` etc.
- **Events** are emitted in kebab-case (`update:open`, `before-close`) and typed via `defineEmits<{ 'update:open': [value: boolean] }>()`.
- **v-model** follows Vue 3 standard via `defineModel<T>('propName')`.
- **Refs / composables** use descriptive prefixes (`triggerRef`, `panelRef`, `useFocusTrap`).

### 2.3. Estados controlados vs não-controlados

When the component owns relevant internal state (open/value/selected/expanded), expose **both** APIs:

- **Controlled:** prop `open` (`boolean | undefined`) + emit `update:open` + `v-model:open` via `defineModel<boolean>('open')`.
- **Uncontrolled:** prop `defaultOpen` (initial value), internally managed when `open === undefined`.
- A computed `isOpen` decides between `openModel.value` (controlled) and `internalOpen.value` (uncontrolled).
- Storybook stories `Controlled` and `Uncontrolled` document both usages.

### 2.4. Slots tipados

Use `defineSlots<{...}>()` when the component delegates content rendering to the consumer. Document each slot in the JSDoc of the component.

```ts
defineSlots<{
  default(): unknown
  icon(): unknown
  description(props: { error: string }): unknown
}>()
```

### 2.5. `as-child` / Slot pattern — _pending_

> **Status: not yet available.** A Slot helper composable does not exist in this repository today. Do **not** import a phantom path; the `validate-references.mjs` hook will block it. When a real component needs this pattern, propose adding the helper under `packages/webkit/src/composables/` in a dedicated PR, then revisit this section.

When the helper ships, the pattern looks like: a component exposes `asChild?: boolean`. When `asChild` is `true`, it clones the single default-slot child and forwards classes/attrs/refs/listeners into it (same idea used by overlay trigger components in this codebase).

```ts
interface Props {
  /** Render as the child element instead of a default `<button>`. */
  asChild?: boolean
}
```

Use cases (when available): triggers of overlay components, link-or-button wrappers, any sub-component that primarily forwards behavior to a user-supplied element.

### 2.6. `data-state` / `data-disabled` / `data-orientation` attributes

Expose reactive state via `data-*` attributes on the root so consumers can style with Tailwind state variants (`data-[state=open]:bg-...`).

```vue
<template>
  <div
    :data-state="isOpen ? 'open' : 'closed'"
    :data-disabled="disabled || undefined"
    :data-orientation="orientation"
    :data-testid="testId"
  >
    ...
  </div>
</template>
```

Common state values: `open`/`closed`, `on`/`off`, `active`/`inactive`, `checked`/`unchecked`/`indeterminate`, `visible`/`hidden`. Always set the attribute even when default; omit (`|| undefined`) only for binary flags like `data-disabled`.

This unlocks state-driven styling without computed class strings:

```vue
<DialogContent class="data-[state=open]:animate-in data-[state=closed]:animate-out" />
```

### 2.7. `cn` helper (tailwind-merge)

> **Status: available today.** `clsx` and `tailwind-merge` are installed in [`packages/webkit/package.json`](../../packages/webkit/package.json). The helper lives at [`src/utils/cn.js`](../../packages/webkit/src/utils/cn.js) and is exported as `@aziontech/webkit/utils/cn`.

The naive `[base, attrs.class]` array works for additive cases but fails when consumer classes need to **override** internal ones (e.g. consumer passes `px-6` while the component sets `px-4` — both end up applied; the later one wins by source order, not intent). `cn(...)` (built on `clsx` + `tailwind-merge`) makes consumer classes win predictably.

Usage:

```ts
import { cn } from '@aziontech/webkit/utils/cn'

const rootClasses = computed(() =>
  cn(sharedClasses, kindClasses[props.kind], sizeClasses[props.size], attrs.class)
)
```

Use `cn` whenever consumer-supplied classes may conflict with internal ones. Plain arrays are still acceptable for purely additive cases.

### 2.8. `VariantProps` exportados

Export the variant unions so consumers can type their own wrappers without re-declaring strings.

```ts
// button.vue
export type ButtonKind = 'primary' | 'secondary' | 'outlined' | 'text'
export type ButtonSize = 'small' | 'medium' | 'large'
```

Consumer usage:

```ts
import type { ButtonKind } from '@aziontech/webkit/button'

interface MyCardActionProps {
  kind: ButtonKind
}
```

Naming pattern: `<ComponentName><PropName>` — `ButtonKind`, `ButtonSize`, `DialogSize`, `TabsOrientation`. Each public type is re-exported through the component's entry in `package.json#exports` (Vue SFC default export covers the runtime; named exports cover the types).

### 2.9. Anatomy completa em Composition Pattern

When the component justifies Composition Pattern, ship the **complete anatomy** — each meaningful part is its own public sub-component. Reference anatomies:

- **Dialog:** `Dialog` (root) + `DialogTrigger` (as-child) + `DialogPortal` (teleport) + `DialogOverlay` (backdrop) + `DialogContent` (panel) + `DialogTitle` + `DialogDescription` + `DialogClose` (as-child).
- **Tabs:** `Tabs` + `Tabs.List` + `Tabs.Item` + `Tabs.Panel`.
- **Accordion:** `Accordion` + `AccordionItem` + `AccordionTrigger` + `AccordionContent`.
- **DropdownMenu:** `DropdownMenu` + `DropdownMenuTrigger` + `DropdownMenuContent` + `DropdownMenuItem` + `DropdownMenuSeparator` + `DropdownMenuLabel`.
- **Card:** `Card` + `CardHeader` + `CardTitle` + `CardDescription` + `CardContent` + `CardFooter`.

#### Folder layout — canonical (applies to every new composition component)

One folder per sub-component, file name preserves the full prefix, and the shared `injection-key.ts` lives at the root of the component (sibling of the root `.vue`).

```
packages/webkit/src/components/overlay/dialog/
├── dialog.vue
├── injection-key.ts
├── dialog-trigger/
│   └── dialog-trigger.vue
├── dialog-portal/
│   └── dialog-portal.vue
├── dialog-overlay/
│   └── dialog-overlay.vue
├── dialog-content/
│   └── dialog-content.vue
├── dialog-title/
│   └── dialog-title.vue
├── dialog-description/
│   └── dialog-description.vue
└── dialog-close/
    └── dialog-close.vue
```

> Existing composition components (`dialog`, `drawer`, `navigation-menu`, `dropdown-menu`, `breadcrumb`) still use the legacy **flat** layout, where every sub-component `.vue` sits directly under the component root. They are not migrated as part of new-component work — migration would require moving files and updating every `packages/webkit/package.json#exports` right-hand path, plus every consumer import path in console-kit, which is out of scope. The new layout above applies only to components scaffolded going forward.

Conventions:

- **Folder per sub-component, file keeps the full prefix** (`dialog-trigger/dialog-trigger.vue`, never `dialog-trigger/index.vue`). Reasons: (a) unambiguous error traces — stack frames show `dialog-trigger.vue`, not 27 different `index.vue` lines; (b) easier grep by file name; (c) editor breadcrumbs stay legible.
- **Public export path stays flat.** `packages/webkit/package.json#exports` keeps `./dialog-trigger` as the consumer-facing path; only the right-hand value reflects the folder nesting (`./src/components/overlay/dialog/dialog-trigger/dialog-trigger.vue`). Consumers see no churn.
- **Shared `InjectionKey<T>` and TypeScript types in a sibling `injection-key.ts`** at the root level (sibling of `<name>.vue`, **not** inside any sub-component folder). Root imports `./injection-key`; sub-components import `../injection-key`.
- **`as-child`** enabled on `Trigger` and `Close` variants.
- **`data-state`** exposed on Root + Content for state-driven styling.
- Each public sub-component receives an entry in `package.json#exports` (`./dialog`, `./dialog-trigger`, …). The Storybook story for the root component covers the composition anatomy through the spec's `## Usage` block (which renders the full tree) — there is no separate `WithComposition` story by default.

### 3. Composition Pattern — só quando faz sentido

- **Composition Pattern (YES):** the consumer needs to swap order, omit, or replace parts. Examples: `Dialog` + `DialogTrigger` + `DialogPortal` + `DialogOverlay` + `DialogContent` + `DialogTitle` + `DialogDescription` + `DialogClose`; `Card` + `CardHeader` + `CardTitle` + `CardDescription` + `CardContent` + `CardFooter`; `Tabs` + `Tabs.List` + `Tabs.Item` + `Tabs.Panel`; Accordion; DropdownMenu; Sheet/Drawer; Form fields. Ship the complete anatomy (see § 2.9). **Each sub-component lives in its own folder** under the root component (`<root>/<root>-<part>/<root>-<part>.vue`); the shared `InjectionKey<T>` is a sibling of the root `.vue` (`./injection-key`, imported as `../injection-key` from each sub-component); each public sub-component has its own entry in `packages/webkit/package.json#exports`.
- **Monolithic with props + slots (NOT Composition):** fixed layout with variations driven by configuration and limited inversion via slots. Real example: [card-pricing.vue](../../packages/webkit/src/components/content/card-pricing/card-pricing.vue) — props `slotPosition`/`cardStyle`/`showTag`/`showPricingDetails` plus a `default` and a named `actions` slot. The internal structure is fixed.
- **Atomic** (Button, IconButton, Tag, Spinner, Badge, Currency) — always monolithic, no slots.
- **Decision rule:** "does the consumer need to change the ORDER or OMIT parts exposed by the root?" If yes, use Composition Pattern. If no, stay monolithic. When in doubt, **start monolithic** and refactor only when a real use case appears.

### 3.1. `data-testid` hierárquico (BEM-style)

Convention established by [card-pricing.vue](../../packages/webkit/src/components/content/card-pricing/card-pricing.vue):

- **Root:** fallback derived from the component name — `const testId = computed(() => attrs['data-testid'] ?? '<category>-<name>')`. Examples: `'action-button'`, `'content-card-pricing'`, `'overlay-dialog'`.
- **Children:** `${testId}__<part>` with **two underscores**. Common parts: `__header`, `__title`, `__description`, `__content`, `__footer`, `__actions`, `__action`, `__close`, `__loading`, `__icon`, `__panel`, `__backdrop`, `__error-message`.
- The consumer can override the root via `data-testid="custom-id"`; all children inherit the new prefix automatically.
- Composition Pattern sub-components inject the parent's `testId` through the context.

### 4. Class structure (sharedClasses/kindClasses/sizeClasses/disabledClasses/rootClasses)

For interactive components with variants (button-like), follow [button.vue](../../packages/webkit/src/components/actions/button/button.vue) with typed maps:

- `sharedClasses` (array) with base layout, transitions, focus-visible, pseudo-element setup.
- `kindClasses: Record<Kind, string>` mapping each variant to its token combination.
- `sizeClasses: Record<Size, string>` mapping each size to spacing + typography class.
- `disabledClasses` (string) overriding interactive state.
- `rootClasses` computed merges all of the above with `attrs.class`.

For monolithic components with variable layout (card-like), inline class arrays in the template are acceptable when the conditional is short and local — see [card-pricing.vue](../../packages/webkit/src/components/content/card-pricing/card-pricing.vue). The root element still uses a computed `rootClass` that includes `attrs.class`.

### 5. Estados via pseudo-elements `before:`

Hover/active overlays should be implemented via a pseudo-element so the base background never repaints during transitions:

```
before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]
before:opacity-0 before:transition-opacity before:content-['']
hover:before:opacity-100 active:before:opacity-100
```

And `kindClasses` sets `before:bg-(--bg-hover)` / `active:before:bg-(--bg-active)`. See [button.vue:65-69](../../packages/webkit/src/components/actions/button/button.vue#L65-L69).

### 6. Polimorfismo `<a>` / `<button>`

When the component is interactive and accepts `href`, derive `isAnchor` and render `<a>` or `<button>`. Always set `rel="noopener noreferrer"` when `target="_blank"`. Example: [button.vue:111-161](../../packages/webkit/src/components/actions/button/button.vue#L111-L161).

### 7. Capturando tokens do Figma

Before creating or updating a component, invoke the `/component-create` skill which automates the discovery via MCP `plugin:figma:figma` (`get_variable_defs`, `get_design_context`). Map each Figma variable to its DESIGN.md equivalent (generated class for typography, `var(--*)` for everything else). When no equivalent exists, register a **theme gap** in the PR and use the closest primitive temporarily with `TODO: tokenizar`. Never commit hardcoded hex to close the gap.

### 8. Anti-duplicação / DRY

Reusable utilities never live inline:

- **Logic:** composables in [packages/webkit/src/composables/](../../packages/webkit/src/composables/) (`use-controllable`, `use-locale`, `use-direction`).
- **Utility sub-components:** [packages/webkit/src/components/utils/](../../packages/webkit/src/components/utils/) (`spinner`, reused in button and icon-button).
- **Global CSS / animations:** `packages/theme/src/`.

Sweep these locations before implementing. Create a new utility only when nothing existing fits, and always in a shared location.

### 9. Acessibilidade (WCAG 2.1 AA)

- **Semantics first:** prefer native `<button>` / `<a>` / `<input>` / `<dialog>` over `role=...`.
- **Visible focus mandatory:** `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`. Never strip outline without a substitute.
- **Keyboard navigation:** Tab/Shift+Tab; Enter/Space on buttons; Esc closes overlays; arrows on menus/lists/radio groups; focus trap in modals; focus returns to the trigger when closing.
- **ARIA minimum:** `aria-label`, `aria-labelledby`/`aria-describedby`, `aria-busy`, `aria-disabled`, `aria-hidden="true"` on decorative icons, `aria-current`/`aria-selected`/`aria-expanded` as appropriate, `aria-live="polite"` for dynamic feedback.
- **Contrast:** >=4.5:1 (text) / >=3:1 (large/icons). Verify disabled, which often fails.
- **`prefers-reduced-motion`:** components that animate must apply `motion-reduce:transition-none motion-reduce:transform-none`.
- **Touch targets:** >=40x40px; smaller require justification.
- **Forms:** `<label>` associated, `aria-describedby` for hint/error, `aria-invalid="true"` on error, message announced via `aria-live`.

### 10. Usabilidade

- States must be visually distinguishable without relying solely on color (use border, shadow, icon, pattern).
- Feedback under 100ms on interactions; loading on operations >300ms; progress on >2s.
- Loading is non-blocking (`cursor-loading` + `aria-busy`); the component stays visible.
- Errors are actionable with a clear message; preserve state when possible.
- Hit area generous (padding >=`var(--spacing-2)` around interactive content).
- i18n-ready (texts via props, support long strings without breaking layout).
- Consistency with sibling components in the same category.
- Clear affordance (buttons look clickable; links are visually distinct).

### 11. Light/dark obrigatório

Every token used must work in both modes of `@aziontech/theme`. The Storybook story `LightDark` renders the component side by side in light and dark and is mandatory.

### 12. Figma Code Connect

> **Status: available today.** `@figma/code-connect` is installed in [`packages/webkit/package.json`](../../packages/webkit/package.json) and the project config lives at [`packages/webkit/figma.config.json`](../../packages/webkit/figma.config.json) (`parser: "html"`, `include: ["src/**/*.figma.ts"]`).

For every new component, generate `<name>.figma.ts` next to the `.vue` mapping Figma variants (`kind`, `size`, `state`) → Vue props, Figma slots → Vue children, and the code snippet shown in the Dev Mode inspection panel. Use the `/figma-code-connect` skill as a prerequisite to call `add_code_connect_map`.

CLI scripts (in `packages/webkit/package.json`):

- `pnpm --filter webkit run figma:parse` — verify all `.figma.ts` files parse.
- `pnpm --filter webkit run figma:publish` — publish mappings to Figma. **Requires `FIGMA_ACCESS_TOKEN`** in the environment.
- `pnpm --filter webkit run figma:unpublish` — remove published mappings.

Authoring the `.figma.ts` file works without the token; only publishing needs it.

**Where to put `FIGMA_ACCESS_TOKEN`:**

- **Locally:** copy [`packages/webkit/.env.example`](../.env.example) to `packages/webkit/.env` (gitignored) and fill `FIGMA_ACCESS_TOKEN=...`. Alternatively, `export FIGMA_ACCESS_TOKEN=...` in your shell or pass it inline: `FIGMA_ACCESS_TOKEN=... pnpm --filter webkit run figma:publish`. Generate the token at <https://www.figma.com/developers/api#access-tokens> (requires a Dev Mode seat with Code Connect enabled on the Figma org).
- **CI (GitHub Actions):** add `FIGMA_ACCESS_TOKEN` as a repository secret (`Settings → Secrets and variables → Actions`) and reference it via `env: { FIGMA_ACCESS_TOKEN: ${{ secrets.FIGMA_ACCESS_TOKEN }} }` in the workflow step that calls `figma:publish`.
- **Never** commit the token. `.env` and `.env.*` are gitignored at the repo root; only [`.env.example`](../.env.example) is versioned.

### 13. Storybook story — canonical pattern (Vue 3 + Storybook 8)

> **"Show code" is governed by [`.claude/rules/storybook-source.md`](../rules/storybook-source.md).** The Docs panel must emit a **single runnable SFC with PascalCase tags** that match the import. Keep `parameters.docs` a plain object literal and give every story an explicit `source.code: toSfc(IMPORT, TEMPLATE)` (from `apps/storybook/src/stories/_shared/story-source.js`); never use `docs.source.transform` / `source.type: 'dynamic'`, and never set `docs` to a function call. `parameters.docs.description.component` is a **short prose lead** from `## Purpose` — the `## Usage` block is NOT appended into it (older guidance below is superseded on this point). Enforced by `validate-story-source.mjs`.

Stories follow the **market-standard CSF3 pattern for Vue 3** — concretely, the existing [`apps/storybook/src/stories/webkit/actions/button/Button.stories.js`](../../apps/storybook/src/stories/webkit/actions/button/Button.stories.js). The two distinguishing traits versus a generic CSF3 file:

1. **Composite stories `Types` and `Sizes`** render every variant side-by-side in a single frame — replacing one-story-per-variant (`Primary`, `Secondary`, `Outlined`, …).
2. **`parameters.docs.description.component` is the short Purpose prose lead** (see the rule callout above); the runnable usage is surfaced by the "Show code" panel via an explicit `source.code: toSfc(IMPORT, TEMPLATE)`, not by pasting the `## Usage` block into the description.

````js
// <Name>.stories.js — canonical shape (matches Button.stories.js)
import Component from '@aziontech/webkit/<category>/<name>'

/** @type {import('@storybook/vue3').Meta<typeof Component>} */
const meta = {
  title: 'Webkit/<Category>/<Name>',
  component: Component,
  // subcomponents: { ComponentTrigger, ComponentContent } // when Composition Pattern
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        // <Purpose paragraph from .specs/<name>.md>
        //
        // ## Usage
        //
        // ```vue
        // <script setup>
        // import Component from '@aziontech/webkit/<category>/<name>'
        // </script>
        //
        // <template>
        //   <Component label="Click me" />
        // </template>
        // ```
        component: /* the multi-line markdown built from the spec — see .claude/skills/storybook-write/SKILL.md step 3 */
      }
    }
  },
  argTypes: {
    // --- PROPS ---
    kind: {
      control: 'select',
      options: ['primary', 'secondary', 'outlined', 'text'],
      description: 'Visual variant.',
      table: {
        category: 'props',
        type: { summary: "'primary' | 'secondary' | 'outlined' | 'text'" },
        defaultValue: { summary: "'primary'" }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies the disabled token set.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },

    // --- EVENTS ---
    // CRITICAL: keys must be `on<EventName>` in camelCase. Vue 3 + `v-bind="args"`
    // only recognizes listeners declared in that form. Kebab-case keys
    // (e.g. `'action-click'`) silently fail — the Actions panel stays empty.
    onClick: {
      action: 'click',
      description: 'Emitted when the button is activated.',
      table: { category: 'events', type: { summary: 'MouseEvent' } }
    }
  },
  args: {
    kind: 'primary',
    disabled: false
  }
}
export default meta

// Reusable Template — destructure event handlers off args and forward via @event.
const Template = (args) => ({
  components: { Component },
  setup() {
    const { onClick, ...props } = args
    return { props, onClick }
  },
  template: '<Component v-bind="props" @click="onClick" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof Component>} */
export const Default = {
  render: Template,
  parameters: { docs: { description: { story: 'Default primary button at large size.' } } }
}

export const Types = {
  render: () => ({
    components: { Component },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <Component kind="primary" label="Button" />
        <Component kind="secondary" label="Button" />
        <Component kind="outlined" label="Button" />
        <Component kind="transparent" label="Button" />
      </div>
    `
  }),
  parameters: { docs: { description: { story: 'All kind variants side by side.' } } }
}

export const Sizes = {
  render: () => ({
    components: { Component },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <Component size="small" label="Button" />
        <Component size="medium" label="Button" />
        <Component size="large" label="Button" />
      </div>
    `
  }),
  parameters: { docs: { description: { story: 'All size variants side by side.' } } }
}

export const Loading = {
  args: { loading: true, label: 'Button' },
  render: Template,
  parameters: { docs: { description: { story: 'Loading state with spinner replacing the icon.' } } }
}

export const Disabled = {
  args: { disabled: true, label: 'Button' },
  render: Template,
  parameters: { docs: { description: { story: 'Disabled state.' } } }
}
````

**Hard rules:**

- **`layout: 'centered'`** by default. Override to `'padded'` only when the component is full-width (header, sidebar, drawer).
- **`parameters.docs.description.component` is a short prose lead** — the `## Purpose` paragraph only (one or two sentences). Do **not** paste the spec's `## Usage` fenced block (or any static code snippet) into the description; the runnable usage is surfaced by the Docs **"Show code"** panel via an explicit `source.code: toSfc(IMPORT, TEMPLATE)` on every story. Governed by [`.claude/rules/storybook-source.md`](../rules/storybook-source.md); enforced by `validate-story-source.mjs`. (This supersedes the older "Purpose + verbatim Usage block" guidance.)
- **Composite `Types` / `Sizes` stories** are the canonical replacement for one-story-per-variant. Do not split them into `Primary`, `Secondary`, `Small`, `Medium`, etc.
- **Events as `on<EventName>` camelCase** in `argTypes`, with `action: '<emitted-name>'`. Vue 3's `v-bind` ignores kebab-case keys, so `'action-click': { action: '...' }` silently breaks the Actions panel. Use `onActionClick: { action: 'action-click' }`. For v-model events, the key keeps the colon: `'onUpdate:open': { action: 'update:open' }`.
- **Reusable `Template` forwards `args` reactively** — `setup() { return { args } }` + `v-bind="args"`, exactly like `Button.stories.js`. **Never destructure or spread `args`** (`const { onClick, ...props } = args`): it freezes the reactive proxy and silently breaks the Controls panel — `validate-story-source.mjs` blocks it. For **stateless** components, events declared in `argTypes` with `{ action }` auto-wire through `v-bind="args"` (no manual `@event` listeners). For **v-model** components, hold a local `ref` synced from `args.modelValue` (via `watch`), bind `:model-value="value"` + `@update:model-value="onUpdate"`, and have `onUpdate` call `args['onUpdate:modelValue']?.(next)` so the Actions panel still logs.
- **Do NOT use** `parameters.actions.argTypesRegex` (deprecated in Storybook 8).
- **Do NOT use** `parameters.actions.handles` (legacy Web Components addon, not Vue 3 emits).
- **Use `table.category`** to group controls: `'props'`, `'events'`, `'slots'`.
- **`control: false`** for slots and any non-controllable item.
- **CSF3 object shape** (`export const Name = { args, render, parameters }`). Never CSF2 (`Name.args = {...}`).
- **Slot demos** use a story-specific `template` with real markup inside the component — slots are not passed via `v-bind`.
- **`tags: ['autodocs']`** on the meta.
- **`subcomponents`** on the meta when Composition Pattern — Storybook generates Docs tabs per sub-component.

**Mandatory stories — minimal by default:**

- `Default`
- `Types` (when the component has more than one `kind`)
- `Sizes` (when the component has more than one `size`)
- `Loading` (only if the component has a `loading` prop)
- `Disabled` (only if the component has a `disabled` prop)

**Forbidden by default** (do **not** add unless the spec explicitly lists and justifies them): `LightDark`, `Accessibility` with `play`, `Playground`, `WithSlots`, `WithComposition`, `Controlled`, `Uncontrolled`, one-story-per-variant (`Primary`, `Secondary`, `Small`, …). Storybook's `autodocs` + `a11y` addon + `backgrounds` already cover dark/light, axe checks, and consumer-driven exploration via Controls — adding bespoke stories duplicates work and rots over time.

### 13.w Styling discipline (mandatory for new components)

The webkit layer applies styles **inline on the template root element's `class` attribute**, switches variants via `data-*` attributes, and reads them with Tailwind's `data-[attr=value]:` prefix. This supersedes any older example in this document that still shows the `kindClasses` / `sizeClasses` / `sharedClasses` Record-of-strings pattern. Legacy components on the whitelist still use the old pattern; **every new component starts here**.

#### Forbidden

- `const sharedClasses = [...]`, `const kindClasses = {...}`, `const sizeClasses = {...}`, `const rootClasses = computed(...)` whose only job is to compose classes.
- `<style>` blocks (scoped or unscoped).
- `.css` / `.scss` files inside a component directory.
- CSS-in-JS, `styled()` helpers, `css\`\`` tagged templates.
- Per-component Tailwind plugins for one-off utilities. Reusable utilities live in `@aziontech/theme`.
- `:class="[a, b, c]"` arrays when a flat string + `data-*` variants would do.

#### Required

- `defineOptions({ name, inheritAttrs: false })` + `useAttrs()` on the script.
- Root element binds `v-bind="$attrs"` so consumer-passed `class` merges into the root's `class` automatically.
- Variants are mirrored as `data-*` attributes on the root (`data-kind`, `data-size`, `data-disabled`, `data-state`, `data-orientation`).
- Static utility classes are listed inline on the root's `class` attribute, with Tailwind `data-[attr=value]:utility` prefixes switching styles by variant.
- When the consumer must override an internal token choice, wrap the static class string with `cn` from `@aziontech/webkit/utils/cn`:

  ```vue
  :class="cn('rounded-(--shape-card) bg-(--bg-surface)', attrs.class)"
  ```

#### Canonical example

```vue
<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({ name: 'Button', inheritAttrs: false })

  export type ButtonKind = 'primary' | 'secondary' | 'outlined' | 'text'
  export type ButtonSize = 'small' | 'medium' | 'large'

  interface Props {
    /** Visual variant. */
    kind?: ButtonKind
    /** Size token. */
    size?: ButtonSize
    /** Disables interaction. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'primary',
    size: 'large',
    disabled: false
  })

  const attrs = useAttrs()
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'actions-button')
</script>

<template>
  <button
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    :data-size="size"
    :data-disabled="disabled || null"
    :disabled="disabled"
    class="
      relative inline-flex items-center justify-center whitespace-nowrap
      transition-colors duration-150 ease-out motion-reduce:transition-none
      rounded-(--shape-button)
      focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)
      data-[kind=primary]:bg-(--primary) data-[kind=primary]:text-(--primary-contrast)
      data-[kind=secondary]:bg-(--secondary) data-[kind=secondary]:text-(--secondary-contrast)
      data-[kind=outlined]:border data-[kind=outlined]:border-(--border-default) data-[kind=outlined]:bg-transparent
      data-[kind=text]:bg-transparent
      data-[size=small]:h-7 data-[size=small]:px-(--spacing-2) data-[size=small]:text-button-md
      data-[size=medium]:h-8 data-[size=medium]:px-(--spacing-3) data-[size=medium]:text-button-md
      data-[size=large]:h-10 data-[size=large]:px-(--spacing-4) data-[size=large]:text-button-lg
      data-[disabled]:bg-(--bg-disabled) data-[disabled]:text-(--text-disabled) data-[disabled]:cursor-not-allowed
    "
  >
    <slot />
  </button>
</template>
```

#### Conditional styles

Use `data-*` + Tailwind variant — never `:class="cond ? ... : ..."`:

```vue
<!-- ✅ -->
<button
  :data-loading="loading || null"
  class="data-[loading]:cursor-wait data-[loading]:opacity-80"
/>
<div
  :data-state="open ? 'open' : 'closed'"
  class="data-[state=open]:animate-popup-scale-in data-[state=closed]:animate-popup-scale-out"
/>

<!-- ❌ -->
<button :class="loading ? 'cursor-wait opacity-80' : ''" />
```

#### Sub-components (Composition Pattern)

The same rule applies. Each sub-component renders its own root with its own inline `class`. No shared `*Classes` import between siblings.

---

### 13.x Story discipline (mandatory)

The rules below apply to **every** `.stories.js` produced for the webkit layer. The `storybook-write` skill, the `storybook-writer` sub-agent, and `echo-reporter` all enforce them.

#### Forbidden Storybook patterns

A `.stories.js` must NEVER contain any of these. The rule is mandatory for every webkit-layer story; `echo-reporter` flags violations and `spec-validator` rejects specs whose Constraints block doesn't carry the corresponding "Do not" line.

- **`parameters.actions.argTypesRegex`** — deprecated in Storybook 8 and silently misroutes Vue 3 emits. Declare every event explicitly in `argTypes` with key `on<EventName>` (camelCase, e.g. `onClick`, `'onUpdate:open'`) and value `{ action: '<emitted-name>', table: { category: 'events' } }`. Never the legacy `argTypesRegex` shortcut.
- **`parameters.actions.handles`** — Web Components / addon-actions DOM mode, not Vue.
- **`Name.args = {...}`** — legacy CSF2 form. Use the CSF3 object shape (`export const Name = { args, render, parameters }`).
- **`parameters.design`**, **`parameters.figma`**, or any other `addon-designs` slot.
- **Figma URLs in `docs.description.component` or `docs.description.story`**, in JSDoc comments at the top of the file, or anywhere else in the story.
- **Imports from `@storybook/addon-designs` / `storybook-addon-designs`** — the addon must not be installed; if it is, do not consume it.
- **Hardcoded Figma node IDs** as strings (e.g. `'3750:15167'`) referenced from the story for documentation purposes.

The Figma ↔ code link is owned by `<name>.figma.ts` (Code Connect). Hardcoded Figma URLs in stories rot silently when the design file is renamed or restructured.

#### Components with open/close state must default to **closed**

For any component that exposes an open/close state (Dialog, Drawer, Sheet, Popover, Tooltip, DropdownMenu, NavigationMenu, ContextMenu, Accordion, Combobox, …):

- The `Default` story renders the component in its **closed** state — the trigger is visible; the overlay is not.
- The viewer activates the overlay by interacting with the trigger (click, hover, keyboard) inside the Storybook canvas — exactly as a real consumer would.
- Per-variant stories (one per `kind`, one per `size`) also default to closed unless the variant cannot exist closed.

```js
// Dialog.stories.js
export const Default = {
  args: { open: false /* or omit when uncontrolled and defaultOpen is false */ },
  render: Template,
  parameters: { docs: { description: { story: 'Trigger renders the dialog. Click to open.' } } }
}
```

**Why:** consumers ship the component in its dormant state. The accessible name comes from the trigger; the focus path starts at the trigger; the keyboard shortcut targets the trigger. Defaulting to open hides those details and skews axe and keyboard checks.

#### Variants: only basic ones

The spec lists which `kind` / `size` stories exist. Do **not** add visual permutations the spec did not list. A "WithIcon", "WithLongLabel", "WithBadge" story belongs in the spec or it doesn't belong in the file.

### 14. Checklist atualizado (apêndice à checklist existente)

#### Structure / TS

- [ ] `<script setup lang="ts">`.
- [ ] `defineProps<{...}>()` + `defineEmits<{...}>()` typed.
- [ ] `defineSlots<{...}>()` when there are named/scoped slots.
- [ ] `defineModel<T>('propName')` for the principal prop when applicable.
- [ ] **JSDoc/TSDoc on every public prop.**
- [ ] `defineOptions({ name, inheritAttrs: false })`.
- [ ] `useAttrs()` and `rootClasses` includes `attrs.class`.
- [ ] `testId = computed<string>(() => ...)`.
- [ ] Types for variants (`type Kind = ...`) and typed maps (`Record<Kind, string>`).
- [ ] Zero `any`, zero `// @ts-ignore`.
- [ ] **Naming conventions** applied (`kind`/`size`/booleans without prefix, events kebab-case).
- [ ] **Controlled / uncontrolled** states implemented when applicable.
- [ ] Composition Pattern only when justified (sibling sub-components + typed `provide`/`inject`).
- [ ] When Composition Pattern: complete anatomy shipped (Trigger/Portal/Overlay/Content/Title/Description/Close as applicable — see § 2.9), with the canonical folder-per-sub-component layout (`<root>/<root>-<part>/<root>-<part>.vue`; shared `injection-key.ts` at the root level).
- [ ] **`asChild`** exposed on trigger-like sub-components (Trigger/Close/etc.) — § 2.5.
- [ ] **`data-state`/`data-disabled`/`data-orientation`** exposed on the root and on stateful sub-components — § 2.6.
- [ ] **`VariantProps`** (e.g. `ButtonKind`, `ButtonSize`) exported as named exports — § 2.8.
- [ ] **`cn` helper** used for class merging when consumer classes may override defaults (once `clsx` + `tailwind-merge` are installed — § 2.7).
- [ ] `<a>`/`<button>` polymorphism when applicable, with `rel="noopener noreferrer"` on `_blank`.

#### Tokens

- [ ] Zero hardcoded hex; everything via `var(--*)` or generated typography class.
- [ ] CSS vars identical to the canonicals.
- [ ] `before:` pseudo for hover/active overlays.
- [ ] Figma tokens -> DESIGN.md classes / CSS vars mapped; gaps registered.

#### DRY

- [ ] Reusable utilities extracted to `composables/`, `components/webkit/utils/`, or `packages/theme/`.
- [ ] No inline custom animation/class when a shared alternative exists.

#### Acessibilidade

- [ ] Visible focus with `focus-visible:ring-*` plus `ring-offset` based on `--bg-canvas`.
- [ ] Keyboard navigation validated.
- [ ] ARIA applied per component type.
- [ ] Contrast >=4.5:1 / >=3:1, including disabled.
- [ ] `motion-reduce:*` on animated components.
- [ ] Touch target >=40x40px or justified.
- [ ] Tested in a screen reader.

#### Usabilidade

- [ ] States visually distinct without relying solely on color.
- [ ] Loading with `cursor-loading` + `aria-busy`, non-blocking.
- [ ] Texts via props (i18n-ready).
- [ ] Consistency with neighbours in the category.

#### Storybook (uso completo)

- [ ] Meta: `title`, `component`, `subcomponents` (when composition), `tags: ['autodocs']`.
- [ ] `argTypes` for every prop with appropriate `control`, `description`, `table.defaultValue`.
- [ ] `argTypes` for every event with key `on<EventName>` (camelCase, e.g. `onClick`, `'onUpdate:open'`) — never kebab-case — and value `{ action: '<emitted-name>', table: { category: 'events' } }`. No `argTypesRegex`, no `actions.handles`.
- [ ] `args` with sensible defaults.
- [ ] `parameters.actions`, `parameters.a11y`, `parameters.docs.description.*`, `parameters.backgrounds`, `parameters.layout`.
- [ ] `decorators` when needed.
- [ ] Stories: `Default` + `Types` (composite, when more than one `kind`) + `Sizes` (composite, when more than one `size`) + `Loading` (only when the component has a `loading` prop) + `Disabled` (only when the component has a `disabled` prop). Nothing else by default — see § 13 for the forbidden list.
- [ ] `parameters.docs.description.component` is the short `## Purpose` prose lead only (no embedded `## Usage` block); every story sets an explicit `parameters.docs.source.code: toSfc(IMPORT, TEMPLATE)`, `parameters.docs` stays a plain object literal, and `canvas.sourceState: 'shown'` is set at meta level. Same convention as `Button.stories.js`. Governed by [`.claude/rules/storybook-source.md`](../rules/storybook-source.md).
- [ ] Reusable `Template` at module scope forwarding `args` reactively (`setup() { return { args } }` + `v-bind="args"`) — never destructuring/spreading `args`. Stateless events auto-wire through `v-bind`; v-model components sync a local `ref` and call `args['onUpdate:modelValue']` so the Actions panel works.

#### Validação

- [ ] `<name>.figma.ts` created next to the `.vue` (Code Connect available — see § 12).
- [ ] `pnpm webkit:lint && webkit:type-check && webkit:type-coverage && storybook:build` all pass.

---

**Last Updated:** 2026-03-18
**Version:** 1.0.0
**Maintainer:** Azion WebKit Team
