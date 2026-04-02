# PrimeVue Abstraction Layer

Webkit provides a complete abstraction layer over PrimeVue, allowing consumer applications (e.g., console-kit) to use PrimeVue components, services, and composables without a direct dependency on the `primevue` package.

## Plugin

Register all PrimeVue services in a single call:

```js
// main.js
import { WebkitPlugin } from '@aziontech/webkit/plugin'

app.use(WebkitPlugin)
```

This registers:
- PrimeVue core configuration
- ToastService (`$toast` global property)
- DialogService (`$dialog` global property)
- Tooltip directive (`v-tooltip`)

Options can be passed through to PrimeVue:

```js
app.use(WebkitPlugin, { ripple: true })
```

## Composables

### useToast

```js
import { useToast } from '@aziontech/webkit/use-toast'

const toast = useToast()

// Original PrimeVue API (fully compatible)
toast.add({ severity: 'success', summary: 'Done', detail: 'Item saved', life: 5000 })
toast.remove(message)
toast.removeAllGroups()

// Shortcut methods
toast.success('Item saved')
toast.error('Something went wrong')
toast.warn('Check your input')
toast.info('New version available')
```

Shortcut defaults:
| Method | Severity | Life |
|--------|----------|------|
| `success(detail, life?)` | success | 5000ms |
| `error(detail)` | error | 0 (manual close) |
| `warn(detail, life?)` | warn | 5000ms |
| `info(detail, life?)` | info | 5000ms |

### useDialog

```js
import { useDialog } from '@aziontech/webkit/use-dialog'

const dialog = useDialog()

dialog.open(MyDialogComponent, {
  props: { header: 'Confirm', modal: true },
  data: { id: 123 },
  onClose: () => { /* ... */ }
})
```

## Utilities

### FilterMatchMode

```js
import { FilterMatchMode } from '@aziontech/webkit/api'

const filters = ref({
  global: { value: '', matchMode: FilterMatchMode.CONTAINS }
})
```

## Components

### DynamicDialog

Mount once at app root level (e.g., `App.vue`):

```vue
<script setup>
import DynamicDialog from '@aziontech/webkit/dynamic-dialog'
</script>

<template>
  <DynamicDialog />
</template>
```

### ConfirmDialog

```vue
<script setup>
import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
</script>

<template>
  <ConfirmDialog />
</template>
```

### Tooltip Directive

Already registered by `WebkitPlugin`. For standalone use:

```js
import { Tooltip } from '@aziontech/webkit/tooltip'

app.directive('tooltip', Tooltip)
```

## All Exports

| Export path | Type | Description |
|-------------|------|-------------|
| `@aziontech/webkit/plugin` | Plugin | WebkitPlugin |
| `@aziontech/webkit/use-toast` | Composable | useToast with shortcuts |
| `@aziontech/webkit/use-dialog` | Composable | useDialog |
| `@aziontech/webkit/api` | Utility | FilterMatchMode |
| `@aziontech/webkit/dynamic-dialog` | Component | DynamicDialog wrapper |
| `@aziontech/webkit/confirm-dialog` | Component | ConfirmDialog wrapper |
| `@aziontech/webkit/tooltip` | Directive | Tooltip re-export |

## Migration from direct PrimeVue imports

| Before | After |
|--------|-------|
| `import { useToast } from 'primevue/usetoast'` | `import { useToast } from '@aziontech/webkit/use-toast'` |
| `import { useDialog } from 'primevue/usedialog'` | `import { useDialog } from '@aziontech/webkit/use-dialog'` |
| `import { FilterMatchMode } from 'primevue/api'` | `import { FilterMatchMode } from '@aziontech/webkit/api'` |
| `import DynamicDialog from 'primevue/dynamicdialog'` | `import DynamicDialog from '@aziontech/webkit/dynamic-dialog'` |
| `import ConfirmDialog from 'primevue/confirmdialog'` | `import ConfirmDialog from '@aziontech/webkit/confirm-dialog'` |
| `import Toast from 'primevue/toast'` | `import Toast from '@aziontech/webkit/toast'` |
| `import Dialog from 'primevue/dialog'` | `import Dialog from '@aziontech/webkit/dialog'` |
| `import PrimeVue from 'primevue/config'` + `app.use(PrimeVue)` | `import { WebkitPlugin } from '@aziontech/webkit/plugin'` + `app.use(WebkitPlugin)` |
