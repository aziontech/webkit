# Component Development Requirements for @aziontech/webkit

This document outlines the requirements and best practices for building components in the webkit package. Use this guide when creating new components or modifying existing ones.

## Table of Contents

- [Component Categories](#component-categories)
- [Directory Structure](#directory-structure)
- [Component Implementation Requirements](#component-implementation-requirements)
- [Package.json Requirements](#packagejson-requirements)
- [TypeScript Declarations](#typescript-declarations)
- [Testing Requirements](#testing-requirements)
- [Export Configuration](#export-configuration)
- [Vue Router Components](#vue-router-components)
- [Best Practices](#best-practices)

---

## Component Categories

### Core Components (`src/core/`)

Core components are low-level, reusable building blocks used across applications.

**Characteristics:**

- Located in `src/core/form/` for form-related components or `src/core/<category>/` for others
- Highly reusable and generic
- Minimal business logic
- Focus on presentation and interaction patterns
- Examples: `field-text`, `field-dropdown`, `label`, `selector-block`

**When to use:**

- Building form inputs, buttons, labels
- Creating reusable UI primitives
- Components that will be composed into larger components

### Regular Components (`src/components/`)

Regular components are higher-level, more complex components that may include business logic.

**Characteristics:**

- Located in `src/components/<component-name>/`
- May include API calls, complex state management
- Often composed of multiple core components
- May have specific business requirements
- Examples: `azion-system-status`, `client-testimonials-block`

**When to use:**

- Complex UI features (status indicators, dashboards, etc.)
- Components with business logic or API integration
- Domain-specific functionality

---

## Directory Structure

### Core Component Structure

```
src/core/<category>/<component-name>/
├── <component-name>.vue          # Main component file
├── <component-name>.vue.d.ts     # Generated TypeScript declarations
├── <component-name>.vue.d.ts.map # Generated source map
└── package.json                  # Package configuration
```

**Example:**

```
src/core/form/field-text/
├── field-text.vue
├── field-text.vue.d.ts
├── field-text.vue.d.ts.map
└── package.json
```

### Regular Component Structure

```
src/components/<component-name>/
├── <component-name>.vue          # Main component file
├── <component-name>.vue.d.ts     # Generated TypeScript declarations
├── <component-name>.vue.d.ts.map # Generated source map
└── package.json                  # Package configuration
```

**Example:**

```
src/components/azion-system-status/
├── azion-system-status.vue
├── azion-system-status.vue.d.ts
├── azion-system-status.vue.d.ts.map
└── package.json
```

---

## Component Implementation Requirements

### 1. Component Structure Order (Required)

All components MUST follow this structure:

1. `<script setup>` tag first
2. `<template>` tag second

**CRITICAL:** Always place `<script setup>` BEFORE `<template>` in Vue Single File Components.
Never use `<template>` before `<script setup>`.

**✅ CORRECT:**

```vue
<script setup>
  import { ref, computed, onMounted } from 'vue'
  // ... imports and logic
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

<script setup>
  import { ref, computed, onMounted } from 'vue'
  // ... imports and logic
</script>
```

### 2. Props Definition

Define props with `defineProps()` with proper TypeScript types and defaults:

```vue
<script setup>
  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  })
</script>
```

#### Webkit layer (`src/components/webkit/`)

Webkit components merge consumer classes from fallthrough attributes, not from a `class` prop:

```vue
<script setup>
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

Define events with `defineEmits()`:

```vue
<script setup>
  const emit = defineEmits(['blur', 'input', 'change'])
</script>
```

### 4. Form Components (Core Only)

For form components in `src/core/form/`, MUST integrate with VeeValidate:

```vue
<script setup>
  import { useField } from 'vee-validate'
  import { toRef } from 'vue'

  const props = defineProps({
    name: {
      type: String,
      required: true
    }
  })

  const name = toRef(props, 'name')

  const {
    value: inputValue,
    errorMessage: veeValidateErrorMessage,
    handleBlur,
    handleChange
  } = useField(name, undefined, {
    initialValue: props.value
  })
</script>
```

### 5. Data-testid Attributes (Required)

All interactive elements MUST have `data-testid` attributes for testing:

```vue
<script setup>
  import { computed, useAttrs } from 'vue'

  const attrs = useAttrs()

  const customTestId = computed(() => {
    const id = attrs['data-testid'] || 'component-name'

    return {
      label: `${id}__label`,
      input: `${id}__input`,
      description: `${id}__description`,
      error: `${id}__error-message`
    }
  })
</script>

<template>
  <input :data-testid="customTestId.input" />
</template>
```

### 6. Component File Naming

- Use kebab-case for component names: `field-text.vue`, `azion-system-status.vue`
- Directory name MUST match component filename

### 7. PrimeVue Integration (Recommended)

Leverage PrimeVue components as building blocks:

```vue
<script setup>
  import InputText from 'primevue/inputtext'
  import Button from 'primevue/button'
  // ... component logic
</script>

<template>
  <!-- Component template using PrimeVue -->
</template>
```

### 8. Template Structure

Organize template logically:

```vue
<template>
  <div class="component-wrapper">
    <Label
      v-if="props.label"
      :label="props.label"
    />
    <!-- Main component content -->
    <InputText v-model="inputValue" />

    <!-- Error message -->
    <small
      v-if="errorMessage"
      class="p-error"
    >
      {{ errorMessage }}
    </small>

    <!-- Description -->
    <small
      v-if="description"
      class="text-color-secondary"
    >
      <slot name="description">
        {{ description }}
      </slot>
    </small>
  </div>
</template>
```

---

## Package.json Requirements

Each component directory MUST have a `package.json` file with the following structure:

```json
{
  "main": "./<component-name>.vue",
  "module": "./<component-name>.vue",
  "types": "./<component-name>.vue.d.ts",
  "browser": {
    "./sfc": "./<component-name>.vue"
  },
  "sideEffects": ["*.vue"]
}
```

**Example for `field-text`:**

```json
{
  "main": "./field-text.vue",
  "module": "./field-text.vue",
  "types": "./field-text.vue.d.ts",
  "browser": {
    "./sfc": "./field-text.vue"
  },
  "sideEffects": ["*.vue"]
}
```

---

## TypeScript Declarations

TypeScript declaration files (`.d.ts`) are **auto-generated** using Vue TSC.

### Generation Commands

Run from the webkit package root:

```bash
# Clean existing declarations
npm run clean:dts

# Generate new declarations
npm run build:dts
```

**DO NOT manually edit `.d.ts` or `.d.ts.map` files.**

---

## Testing Requirements

### Test IDs

All components MUST support `data-testid` prop for testing:

```vue
<script setup>
  const attrs = useAttrs()

  const customTestId = computed(() => {
    const id = attrs['data-testid'] || 'component-name'
    return {
      // ... test id variants
    }
  })
</script>
```

### Testable Elements

Ensure these elements have test IDs:

- Labels
- Inputs/Interactive elements
- Error messages
- Description text
- Buttons/Actions

---

## Export Configuration

After creating a component, you MUST add it to the main package.json exports:

### Location: `/packages/webkit/package.json`

Add to the `exports` field:

```json
{
  "exports": {
    // ... existing exports
    "./<component-name>": "./src/<category>/<component-name>/<component-name>.vue"
  }
}
```

**For Core Components:**

```json
{
  "exports": {
    "./field-new-input": "./src/core/form/field-new-input/field-new-input.vue"
  }
}
```

**For Regular Components:**

```json
{
  "exports": {
    "./new-feature": "./src/components/new-feature/new-feature.vue"
  }
}
```

---

## Vue Router Components

Some components may require Vue Router for navigation or routing features.

### When to Use Vue Router

- Components with internal navigation
- Components that render links/routes
- Components that need route awareness (active state, params)

### Installation

If your component needs Vue Router:

1. **Check if already installed:**

   ```bash
   grep "vue-router" /Users/robson.junior/dev/webkit/packages/webkit/package.json
   ```

2. **If not installed, add it:**
   ```bash
   npm install vue-router@4
   ```

### Usage in Components

```vue
<script setup>
  import { useRouter, useRoute } from 'vue-router'

  const router = useRouter()
  const route = useRoute()

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
   <script setup>
     import { getCurrentInstance } from 'vue'

     const instance = getCurrentInstance()
     const router = instance?.appContext.config.globalProperties.$router
   </script>
   ```

3. **Document router dependency** in component comments

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
- ❌ **DON'T:** Add unnecessary business logic to core components
- ❌ **DON'T:** Create deeply nested component hierarchies

### 2. Props and Events

- ✅ **DO:** Validate prop types
- ✅ **DO:** Provide default values for optional props
- ✅ **DO:** Use descriptive event names
- ❌ **DON'T:** Use overly generic prop names
- ❌ **DON'T:** Mutate props directly

### 3. Styling

- ✅ **DO:** Use PrimeVue styling conventions
- ✅ **DO:** Support custom classes via `attrs.class` (`useAttrs()` with `inheritAttrs: false`; do not declare `class` as a prop)
- ✅ **DO:** Use Tailwind CSS utility classes
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

- ✅ **DO:** Handle API errors gracefully
- ✅ **DO:** Show user-friendly error messages
- ✅ **DO:** Log errors to console in development
- ❌ **DON'T:** Let errors crash the component
- ❌ **DON'T:** Expose internal errors to users

### 7. Documentation

- ✅ **DO:** Add JSDoc comments for complex logic
- ✅ **DO:** Document component props and events
- ✅ **DO:** Provide usage examples
- ❌ **DON'T:** Over-comment obvious code
- ❌ **DON'T:** Leave outdated comments

---

## Component Creation Checklist

When creating a new component, ensure you've completed all requirements:

### Core Components

- [ ] Create directory: `src/core/<category>/<component-name>/`
- [ ] Create Vue component: `<component-name>.vue`
- [ ] Use `<script setup>` syntax
- [ ] Define props with types and defaults
- [ ] Define events with `defineEmits()`
- [ ] Integrate VeeValidate (for form components)
- [ ] Add `data-testid` attributes
- [ ] Create `package.json` in component directory
- [ ] Add export to main `package.json`
- [ ] Run `npm run build:dts` to generate TypeScript declarations
- [ ] Test component in consuming application

### Regular Components

- [ ] Create directory: `src/components/<component-name>/`
- [ ] Create Vue component: `<component-name>.vue`
- [ ] Use `<script setup>` syntax
- [ ] Define props with types and defaults
- [ ] Define events with `defineEmits()`
- [ ] Add `data-testid` attributes
- [ ] Create `package.json` in component directory
- [ ] Add export to main `package.json`
- [ ] Run `npm run build:dts` to generate TypeScript declarations
- [ ] Test component in consuming application

### Vue Router Components (Additional)

- [ ] Import and use Vue Router composables
- [ ] Handle router unavailability gracefully
- [ ] Add vue-router to peerDependencies (if required)
- [ ] Document router dependency
- [ ] Test with and without router context

---

## Examples

### Example: Simple Core Form Component

```vue
<script setup>
  import { computed, ref, toRef, useAttrs } from 'vue'
  import { useField } from 'vee-validate'
  import InputText from 'primevue/inputtext'
  import Label from '../label/label.vue'

  const emit = defineEmits(['blur', 'input'])
  const props = defineProps({
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  })

  const inputRef = ref(null)
  const name = toRef(props, 'name')
  const attrs = useAttrs()

  const customTestId = computed(() => {
    const id = attrs['data-testid'] || 'field-simple'

    return {
      label: `${id}__label`,
      input: `${id}__input`,
      error: `${id}__error-message`
    }
  })

  const {
    value: inputValue,
    errorMessage,
    handleBlur,
    handleChange
  } = useField(name, undefined, {
    initialValue: props.value
  })

  defineExpose({ inputRef })
</script>

<template>
  <div>
    <Label
      v-if="props.label"
      :for="props.name"
      :data-testid="customTestId.label"
      :label="props.label"
    />
    <InputText
      v-model="inputValue"
      ref="inputRef"
      :data-testid="customTestId.input"
      :id="name"
      :name="name"
      :disabled="disabled"
      :placeholder="props.placeholder"
      :class="{ 'p-invalid': errorMessage }"
      @input="handleChange"
      @blur="handleBlur"
    />
    <small
      v-if="errorMessage"
      class="p-error"
      :data-testid="customTestId.error"
    >
      {{ errorMessage }}
    </small>
  </div>
</template>
```

### Example: Regular Component with API Integration

```vue
<script setup>
  import { ref, onMounted } from 'vue'
  import Button from 'primevue/button'

  const props = defineProps({
    apiUrl: {
      type: String,
      required: true
    }
  })

  const emit = defineEmits(['data-loaded', 'error'])

  const loading = ref(false)
  const data = ref(null)
  const error = ref(null)

  async function fetchData() {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(props.apiUrl)
      const result = await response.json()
      data.value = result
      emit('data-loaded', result)
    } catch (err) {
      error.value = err.message
      emit('error', err)
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchData()
  })
</script>

<template>
  <div class="data-component">
    <div v-if="loading">Loading...</div>
    <div
      v-else-if="error"
      class="p-error"
    >
      Error: {{ error }}
    </div>
    <div v-else-if="data">
      {{ data }}
    </div>
    <Button
      @click="fetchData"
      label="Refresh"
    />
  </div>
</template>
```

### Example: Component with Vue Router

```vue
<script setup>
  import { useRouter } from 'vue-router'
  import Button from 'primevue/button'

  const props = defineProps({
    to: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  })

  const router = useRouter()

  const navigate = () => {
    router.push(props.to)
  }
</script>

<template>
  <Button
    :label="label"
    @click="navigate"
    outlined
  />
</template>
```

---

## Troubleshooting

### TypeScript Declaration Issues

**Problem:** `.d.ts` files are missing or outdated

**Solution:**

```bash
npm run clean:dts
npm run build:dts
```

### Export Not Found

**Problem:** Component cannot be imported

**Solution:**

1. Verify component exists in correct directory
2. Check `package.json` export in main package.json
3. Ensure component `package.json` has correct paths
4. Rebuild declarations

### Vue Router Not Available

**Problem:** Component fails when router is not installed

**Solution:**

```vue
<script setup>
  import { getCurrentInstance } from 'vue'

  const instance = getCurrentInstance()
  const router = instance?.appContext.config.globalProperties.$router

  // Provide fallback behavior
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
- [VeeValidate Documentation](https://vee-validate.logaretm.com/v4/)
- [PrimeVue Components](https://primevue.org/)
- [Vue Router Documentation](https://router.vuejs.org/)

---

## Webkit Layer Pattern (in-depth)

This section describes the canonical pattern enforced for components living under `packages/webkit/src/components/webkit/<category>/<name>/`. It complements the structure rules above with the visual, behavioral, and quality requirements derived from the canonical implementations: [button.vue](../src/components/webkit/actions/button/button.vue), [icon-button.vue](../src/components/webkit/actions/icon-button/icon-button.vue), [card-pricing.vue](../src/components/webkit/content/card-pricing/card-pricing.vue). Reference for compositional decisions: [shadcn-vue.com/docs/components](https://www.shadcn-vue.com/docs/components).

> **No hallucination — only reference things that exist.** Before importing any module, calling any function, mentioning any file path, or referencing any package/export in generated code, verify it exists: `@aziontech/webkit/<subpath>` must appear in [`package.json#exports`](../package.json); relative imports must resolve on disk; npm packages must be installed; workspaces must have a `package.json`. If a needed module is missing, install it, create the file, or annotate the gap as a pending item in the report — never invent imports. The `validate-references.mjs` hook physically blocks Writes whose new imports do not resolve. Sub-sections marked `— pending` below describe patterns that depend on dependencies not yet installed; do not emulate them with phantom paths.

### 1. Source of truth: `Design.md`

All visual rules (typography classes, spacing, max-width, shape, semantic colors) come from [Design.md](./Design.md). In any conflict, **Design.md wins**.

- **Typography** is always applied via the generated class from `texts.data.js` — `text-heading-md`, `text-body-sm`, `text-label-md`, `text-button-lg`, `text-overline-md`, `text-big-number-lg`, etc. Never use `text-[length:var(--text-*)]` raw, never `leading-*`/`tracking-*`/`font-family` directly. Full catalog in [Design.md "Available text styles"](./Design.md).
- **Semantic colors:** `var(--primary)`, `var(--primary-contrast)`, `var(--secondary)`, `var(--secondary-contrast)`, `var(--bg-hover)`, `var(--bg-active)`, `var(--bg-disabled)`, `var(--bg-surface)`, `var(--bg-canvas)`, `var(--bg-mask)`, `var(--border-default)`, `var(--border-muted)`, `var(--border-strong)`, `var(--text-default)`, `var(--text-muted)`, `var(--text-disabled)`, `var(--ring-color)`, and feedback variants (`--success`/`--warning`/`--danger`/`--info` + `-contrast`/`-border`).
- **Shape:** `var(--shape-button)`, `var(--shape-elements)`, `var(--shape-card)`, `var(--shape-flat)`. For pseudo-element inheritance use `rounded-[inherit]`.
- **Spacing:** `var(--spacing-1)..(--spacing-N)` applied via `px-[...]` / `py-[...]` / `gap-[...]` / `m-[...]`. For section-level responsive spacing use the semantic utilities (`gap-spacing-elements-md`, `p-spacing-elements-lg`).
- **Max width:** `var(--container-max-width)` for layout containers, `var(--container-3xs..--container-7xl)` for fixed content (cards, modals). Utility helper: `.max-container-width`.
- **Forbidden:** hex/rgb/hsl hardcoded; Tailwind palette names (`bg-gray-*`, `text-violet-*`); PrimeVue color utilities (`text-color`, `surface-*`); raw typography (`text-xs`/`text-sm`/`text-base`/`text-lg`).

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

### 2.3. Estados controlados vs não-controlados (padrão shadcn)

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

### 2.5. `as-child` / Slot pattern (shadcn-vue) — _pending_

> **Status: not yet available.** A Slot helper composable does not exist in this repository today. Do **not** import a phantom path; the `validate-references.mjs` hook will block it. When a real component needs this pattern, propose adding the helper under `packages/webkit/src/composables/` in a dedicated PR (with TypeScript Slot polyfill or via `reka-ui`), then revisit this section.

When the helper ships, the pattern looks like: a component exposes `asChild?: boolean`. When `asChild` is `true`, it clones the single default-slot child and forwards classes/attrs/refs/listeners into it (same as `DialogTrigger`/`TooltipTrigger`/`AccordionTrigger` in shadcn-vue).

```ts
interface Props {
  /** Render as the child element instead of a default `<button>`. */
  asChild?: boolean
}
```

Use cases (when available): triggers of overlay components, link-or-button wrappers, any sub-component that primarily forwards behavior to a user-supplied element.

### 2.6. `data-state` / `data-disabled` / `data-orientation` attributes

Expose reactive state via `data-*` attributes on the root so consumers can style with Tailwind state variants (`data-[state=open]:bg-...`). Same approach as shadcn-vue / Reka UI.

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

> **Status: available today.** `clsx` and `tailwind-merge` are installed in [`packages/webkit/package.json`](../package.json). The helper lives at [`src/utils/cn.ts`](../src/utils/cn.ts) and is exported as `@aziontech/webkit/utils/cn`.

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
import type { ButtonKind } from '@aziontech/webkit/actions/button'

interface MyCardActionProps {
  kind: ButtonKind
}
```

Naming pattern: `<ComponentName><PropName>` — `ButtonKind`, `ButtonSize`, `DialogSize`, `TabsOrientation`. Each public type is re-exported through the component's entry in `package.json#exports` (Vue SFC default export covers the runtime; named exports cover the types).

### 2.9. Anatomy completa em Composition Pattern (shadcn-vue style)

When the component justifies Composition Pattern, ship the **complete anatomy** following the shadcn-vue/Reka UI convention. Reference anatomies:

- **Dialog:** `Dialog` (root) + `DialogTrigger` (as-child) + `DialogPortal` (teleport) + `DialogOverlay` (backdrop) + `DialogContent` (panel) + `DialogTitle` + `DialogDescription` + `DialogClose` (as-child).
- **Tabs:** `Tabs` + `TabsList` + `TabsTrigger` + `TabsContent`.
- **Accordion:** `Accordion` + `AccordionItem` + `AccordionTrigger` + `AccordionContent`.
- **DropdownMenu:** `DropdownMenu` + `DropdownMenuTrigger` + `DropdownMenuContent` + `DropdownMenuItem` + `DropdownMenuSeparator` + `DropdownMenuLabel`.
- **Card:** `Card` + `CardHeader` + `CardTitle` + `CardDescription` + `CardContent` + `CardFooter`.

Conventions:

- Sibling files in the same directory: `dialog.vue`, `dialog-trigger.vue`, `dialog-portal.vue`, `dialog-overlay.vue`, `dialog-content.vue`, `dialog-title.vue`, `dialog-description.vue`, `dialog-close.vue`.
- Shared `InjectionKey<T>` and TypeScript types in a sibling `injection-key.ts` or `types.ts` to avoid circular imports.
- Each public sub-component receives an entry in `package.json#exports` (`./overlay/dialog`, `./overlay/dialog-trigger`, …) and a Storybook story (the `WithComposition` story shows the full anatomy).
- `as-child` enabled on `Trigger` and `Close` variants.
- `data-state` exposed on Root + Content for state-driven styling.

### 3. Composition Pattern — só quando faz sentido

Reference: [shadcn-vue.com/docs/components](https://www.shadcn-vue.com/docs/components).

- **Composition Pattern (YES):** the consumer needs to swap order, omit, or replace parts. Examples: `Dialog` + `DialogTrigger` + `DialogPortal` + `DialogOverlay` + `DialogContent` + `DialogTitle` + `DialogDescription` + `DialogClose`; `Card` + `CardHeader` + `CardTitle` + `CardDescription` + `CardContent` + `CardFooter`; `Tabs` + `TabsList` + `TabsTrigger` + `TabsContent`; Accordion; DropdownMenu; Sheet/Drawer; Form fields. Ship the complete anatomy (see § 2.9). Sibling sub-components live in the same directory; shared state goes through `provide`/`inject` typed with `InjectionKey<T>`; each public sub-component has its own entry in `packages/webkit/package.json#exports`.
- **Monolithic with props + slots (NOT Composition):** fixed layout with variations driven by configuration and limited inversion via slots. Real example: [card-pricing.vue](../src/components/webkit/content/card-pricing/card-pricing.vue) — props `slotPosition`/`cardStyle`/`showTag`/`showPricingDetails` plus a `default` and a named `actions` slot. The internal structure is fixed.
- **Atomic** (Button, IconButton, Tag, Spinner, Badge, Currency) — always monolithic, no slots.
- **Decision rule:** "does the consumer need to change the ORDER or OMIT parts exposed by the root?" If yes, use Composition Pattern. If no, stay monolithic. When in doubt, **start monolithic** and refactor only when a real use case appears.

### 3.1. `data-testid` hierárquico (BEM-style)

Convention established by [card-pricing.vue](../src/components/webkit/content/card-pricing/card-pricing.vue):

- **Root:** fallback derived from the component name — `const testId = computed(() => attrs['data-testid'] ?? '<category>-<name>')`. Examples: `'action-button'`, `'content-card-pricing'`, `'overlay-dialog'`.
- **Children:** `${testId}__<part>` with **two underscores**. Common parts: `__header`, `__title`, `__description`, `__content`, `__footer`, `__actions`, `__action`, `__close`, `__loading`, `__icon`, `__panel`, `__backdrop`, `__error-message`.
- The consumer can override the root via `data-testid="custom-id"`; all children inherit the new prefix automatically.
- Composition Pattern sub-components inject the parent's `testId` through the context.

### 4. Class structure (sharedClasses/kindClasses/sizeClasses/disabledClasses/rootClasses)

For interactive components with variants (button-like), follow [button.vue](../src/components/webkit/actions/button/button.vue) with typed maps:

- `sharedClasses` (array) with base layout, transitions, focus-visible, pseudo-element setup.
- `kindClasses: Record<Kind, string>` mapping each variant to its token combination.
- `sizeClasses: Record<Size, string>` mapping each size to spacing + typography class.
- `disabledClasses` (string) overriding interactive state.
- `rootClasses` computed merges all of the above with `attrs.class`.

For monolithic components with variable layout (card-like), inline class arrays in the template are acceptable when the conditional is short and local — see [card-pricing.vue](../src/components/webkit/content/card-pricing/card-pricing.vue). The root element still uses a computed `rootClass` that includes `attrs.class`.

### 5. Estados via pseudo-elements `before:`

Hover/active overlays should be implemented via a pseudo-element so the base background never repaints during transitions:

```
before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]
before:opacity-0 before:transition-opacity before:content-['']
hover:before:opacity-100 active:before:opacity-100
```

And `kindClasses` sets `before:bg-[var(--bg-hover)]` / `active:before:bg-[var(--bg-active)]`. See [button.vue:65-69](../src/components/webkit/actions/button/button.vue#L65-L69).

### 6. Polimorfismo `<a>` / `<button>`

When the component is interactive and accepts `href`, derive `isAnchor` and render `<a>` or `<button>`. Always set `rel="noopener noreferrer"` when `target="_blank"`. Example: [button.vue:111-161](../src/components/webkit/actions/button/button.vue#L111-L161).

### 7. Capturando tokens do Figma

Before creating or updating a component, invoke the `/component-create` skill which automates the discovery via MCP `plugin:figma:figma` (`get_variable_defs`, `get_design_context`). Map each Figma variable to its Design.md equivalent (generated class for typography, `var(--*)` for everything else). When no equivalent exists, register a **theme gap** in the PR and use the closest primitive temporarily with `TODO: tokenizar`. Never commit hardcoded hex to close the gap.

### 8. Anti-duplicação / DRY

Reusable utilities never live inline:

- **Logic:** composables in [packages/webkit/src/composables/](../src/composables/) (`use-toast`, `use-dialog`).
- **Utility sub-components:** [packages/webkit/src/components/webkit/utils/](../src/components/webkit/utils/) (`spinner`, reused in button and icon-button).
- **Global CSS / animations:** `packages/theme/src/`.

Sweep these locations before implementing. Create a new utility only when nothing existing fits, and always in a shared location.

### 9. Acessibilidade (WCAG 2.1 AA)

- **Semantics first:** prefer native `<button>` / `<a>` / `<input>` / `<dialog>` over `role=...`.
- **Visible focus mandatory:** `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]`. Never strip outline without a substitute.
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

> **Status: available today.** `@figma/code-connect` is installed in [`packages/webkit/package.json`](../package.json) and the project config lives at [`packages/webkit/figma.config.json`](../figma.config.json) (`parser: "html"`, `include: ["src/**/*.figma.ts"]`).

For every new component, generate `<name>.figma.ts` next to the `.vue` mapping Figma variants (`kind`, `size`, `state`) → Vue props, Figma slots → Vue children, and the code snippet shown in the Dev Mode inspection panel. Use the `/figma-code-connect` skill as a prerequisite to call `add_code_connect_map`.

CLI scripts (in `packages/webkit/package.json`):

- `pnpm --filter webkit run figma:parse` — verify all `.figma.ts` files parse.
- `pnpm --filter webkit run figma:publish` — publish mappings to Figma. **Requires `FIGMA_ACCESS_TOKEN`** in the environment.
- `pnpm --filter webkit run figma:unpublish` — remove published mappings.

Authoring the `.figma.ts` file works without the token; only publishing needs it.

### 13. Storybook (uso completo de recursos)

Stories must consume all relevant Storybook features:

- **Meta:** `title: 'Webkit/<Category>/<Name>'`, `component`, `subcomponents` when Composition Pattern is in play, `tags: ['autodocs']`.
- **`argTypes`** for every public prop, with appropriate `control` (`select`/`radio` + `options`, `boolean`, `text`, `number`, `color`), `description` (derived from JSDoc), `table.defaultValue`.
- **`argTypes`** for every event with `{ action: '<event-name>' }`.
- **`args`** with sensible defaults for the Default story.
- **`parameters`:**
  - `parameters.actions = { argTypesRegex: '^on[A-Z].*', handles: [...] }`.
  - `parameters.a11y` with WCAG rules enabled (when the addon is present).
  - `parameters.docs.description.component` plus `parameters.docs.description.story` for EACH story.
  - `parameters.backgrounds` defining theme light/dark backgrounds.
  - `parameters.layout` (`'centered'` / `'fullscreen'`) chosen per component.
- **`decorators`** when needed (theme provider, mount root, router).
- **Mandatory stories:** Default + one per `kind` + one per `size` + Disabled + Loading (if applicable) + WithSlots / WithComposition (if applicable) + Controlled + Uncontrolled (if applicable) + **LightDark** + Accessibility (with a `play` function via `@storybook/test`) + **Playground**.
- `render: (args) => ({ ..., setup() { return { args } }, template: '<Comp v-bind="args" />' })` so controls actually drive the rendered component.

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
- [ ] When Composition Pattern: complete anatomy shipped (Trigger/Portal/Overlay/Content/Title/Description/Close as applicable — see § 2.9).
- [ ] **`asChild`** exposed on trigger-like sub-components (Trigger/Close/etc.) — § 2.5.
- [ ] **`data-state`/`data-disabled`/`data-orientation`** exposed on the root and on stateful sub-components — § 2.6.
- [ ] **`VariantProps`** (e.g. `ButtonKind`, `ButtonSize`) exported as named exports — § 2.8.
- [ ] **`cn` helper** used for class merging when consumer classes may override defaults (once `clsx` + `tailwind-merge` are installed — § 2.7).
- [ ] `<a>`/`<button>` polymorphism when applicable, with `rel="noopener noreferrer"` on `_blank`.

#### Tokens

- [ ] Zero hardcoded hex; everything via `var(--*)` or generated typography class.
- [ ] CSS vars identical to the canonicals.
- [ ] `before:` pseudo for hover/active overlays.
- [ ] Figma tokens -> Design.md classes / CSS vars mapped; gaps registered.

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
- [ ] `argTypes` for every event with `{ action: '...' }`.
- [ ] `args` with sensible defaults.
- [ ] `parameters.actions`, `parameters.a11y`, `parameters.docs.description.*`, `parameters.backgrounds`, `parameters.layout`.
- [ ] `decorators` when needed.
- [ ] Stories: Default + per `kind` + per `size` + Disabled + Loading + WithSlots/WithComposition + Controlled + Uncontrolled + **LightDark** + Accessibility + **Playground**.
- [ ] `play` function in Accessibility (or Playground) using `@storybook/test` (installed in `apps/storybook/package.json`). Import `userEvent`, `expect`, `within` from `@storybook/test`.
- [ ] `render: (args) => ({ ..., setup() { return { args } }, template: '<Comp v-bind="args" />' })`.

#### Validação

- [ ] `<name>.figma.ts` created next to the `.vue` (Code Connect available — see § 12).
- [ ] `pnpm webkit:lint && webkit:type-check && webkit:type-coverage && webkit:build:dts && storybook:build` all pass.

---

**Last Updated:** 2026-03-18
**Version:** 1.0.0
**Maintainer:** Azion WebKit Team
