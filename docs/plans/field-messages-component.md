# FieldMessages Component Plan

## Overview

Create a reusable `FieldMessages` component that combines error and description display logic used across all form field components in `packages/webkit/src/core/form`.

## Current Pattern Analysis

### Error Display Pattern
```vue
<small
  v-if="additionalError || veeValidateErrorMessage"
  class="p-error text-xs font-normal leading-tight"
  :data-testid="customTestId.error"
>
  {{ additionalError || veeValidateErrorMessage }}
</small>
```

### Description Display Pattern
```vue
<small
  v-if="props.description || hasDescriptionSlot"
  class="text-xs text-color-secondary font-normal leading-5"
  :data-testid="customTestId.description"
>
  <slot name="description">
    {{ props.description }}
  </slot>
</small>
```

### Variations Found Across Components

| Component | Error Source | Description | Slot Support |
|-----------|--------------|-------------|--------------|
| field-text | additionalError + veeValidateErrorMessage | ✓ | ✓ |
| field-text-area | additionalError + veeValidateErrorMessage | ✓ | ✓ |
| field-number | additionalError + errorMessage | ✓ | ✗ |
| field-dropdown | additionalError + errorMessage | ✓ | ✓ |
| field-auto-complete | errorMessage only | ✓ | ✗ |
| field-multi-select | errorMessage only | ✓ | ✓ |
| field-text-icon | errorMessage only | ✓ | ✗ |
| field-text-password | additionalError + veeValidateErrorMessage | ✓ | ✓ |
| field-text-privacy | additionalError + veeValidateErrorMessage | ✓ | ✓ |
| field-input-group | errorMessage only | ✓ | ✗ |

## Component Design

### File Location
```
packages/webkit/src/core/form/slots/field-messages/field-messages.vue
```

### Props Interface

```typescript
interface FieldMessagesProps {
  error?: string
  description?: string
  testId?: string
}
```

### Slots

| Slot Name | Description |
|-----------|-------------|
| description | Custom description content |

### Component Implementation

```vue
<script setup>
import { computed, useSlots } from 'vue'

const props = defineProps({
  error: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  testId: {
    type: String,
    default: 'field'
  }
})

const slots = useSlots()
const hasDescriptionSlot = !!slots.description

// Computed error message - additionalError takes priority
const errorMessage = computed(() => {
  return props.error
})

const hasError = computed(() => {
  return !!errorMessage.value
})

const hasDescription = computed(() => {
  return !!props.description || hasDescriptionSlot
})

const testIds = computed(() => ({
  error: `${props.testId}__error-message`,
  description: `${props.testId}__description`
}))
</script>

<template>
  <small
    v-if="hasError"
    class="p-error text-xs font-normal leading-tight"
    :data-testid="testIds.error"
  >
    {{ errorMessage }}
  </small>
  <small
    v-if="hasDescription"
    class="text-xs text-color-secondary font-normal leading-5"
    :data-testid="testIds.description"
  >
    <slot name="description">
      {{ props.description }}
    </slot>
  </small>
</template>
```

## Usage Example

### Before (field-text.vue)
```vue
<small
  v-if="additionalError || veeValidateErrorMessage"
  class="p-error text-xs font-normal leading-tight"
  :data-testid="customTestId.error"
>
  {{ additionalError || veeValidateErrorMessage }}
</small>
<small
  v-if="props.description || hasDescriptionSlot"
  class="text-xs text-color-secondary font-normal leading-5"
  :data-testid="customTestId.description"
>
  <slot name="description">
    {{ props.description }}
  </slot>
</small>
```

### After (field-text.vue)
```vue
<FieldMessages
  :error="(props.additionalError || veeValidateErrorMessage)"
  :description="props.description"
  :testId="customTestId.input"
>
  <template #description>
    <slot name="description" />
  </template>
</FieldMessages>
```

## Files to Update

The following components need to be updated to use `FieldMessages`:

1. [`field-text.vue`](packages/webkit/src/core/form/field-text/field-text.vue) - lines 114-129
2. [`field-text-area.vue`](packages/webkit/src/core/form/field-text-area/field-text-area.vue) - lines 164-179
3. [`field-number.vue`](packages/webkit/src/core/form/field-number/field-number.vue) - lines 132-145
4. [`field-dropdown.vue`](packages/webkit/src/core/form/field-dropdown/field-dropdown.vue) - lines 226-241
5. [`field-auto-complete.vue`](packages/webkit/src/core/form/field-auto-complete/field-auto-complete.vue) - lines 111-122
6. [`field-multi-select.vue`](packages/webkit/src/core/form/field-multi-select/field-multi-select.vue) - lines 151-166
7. [`field-text-icon.vue`](packages/webkit/src/core/form/field-text-icon/field-text-icon.vue) - lines 120-131
8. [`field-text-password.vue`](packages/webkit/src/core/form/field-text-password/field-text-password.vue) - lines 113-128
9. [`field-text-privacy.vue`](packages/webkit/src/core/form/field-text-privacy/field-text-privacy.vue) - lines 262-278
10. [`field-input-group.vue`](packages/webkit/src/core/form/field-input-group/field-input-group.vue) - lines 101-112

## Implementation Order

1. Create `packages/webkit/src/core/form/slots/field-messages/field-messages.vue`
2. Create `packages/webkit/src/core/form/slots/field-messages/index.js` for exports
3. Update field components starting with `field-text.vue` as reference
4. Update remaining field components
5. Test all components in Storybook

## Notes

- Keep the `hasDescriptionSlot` check inside FieldMessages using `useSlots()`
- The `additionalError` prop naming should remain consistent with existing convention (note: it's intentionally spelled `additionalError` in existing code - we should maintain consistency or fix spelling across all components)
- Test ID pattern: `${baseId}__error-message` and `${baseId}__description`

## Decision Points

1. **Prop Naming**: Should we keep `additionalError` (typo) or fix to `additionalError`?
   - Recommendation: Keep existing naming for backwards compatibility, or create alias

2. **Component Location**: Should this be in `slots/` directory or a new `messages/` directory?
   - Recommendation: `slots/field-messages/` follows existing pattern for shared components

3. **Export Strategy**: Should we also create an index.ts barrel file?
   - Recommendation: Yes, following existing patterns in the codebase
