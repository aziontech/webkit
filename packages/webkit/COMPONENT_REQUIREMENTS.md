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
  },
  class: {
    type: String
  }
})
</script>
```

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
    <Label v-if="props.label" :label="props.label" />
    <!-- Main component content -->
    <InputText v-model="inputValue" />

    <!-- Error message -->
    <small v-if="errorMessage" class="p-error">
      {{ errorMessage }}
    </small>

    <!-- Description -->
    <small v-if="description" class="text-color-secondary">
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
  "sideEffects": [
    "*.vue"
  ]
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
  "sideEffects": [
    "*.vue"
  ]
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
- ✅ **DO:** Support custom classes via `class` prop
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
    <div v-else-if="error" class="p-error">
      Error: {{ error }}
    </div>
    <div v-else-if="data">
      {{ data }}
    </div>
    <Button @click="fetchData" label="Refresh" />
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

**Last Updated:** 2026-03-18
**Version:** 1.0.0
**Maintainer:** Azion WebKit Team
