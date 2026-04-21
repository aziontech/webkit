# PrimeVue Abstraction Layer for @aziontech/webkit

Webkit provides a complete abstraction layer over PrimeVue, allowing consumer applications to use PrimeVue components, services, and composables without a direct dependency on the `primevue` package.

## Table of Contents

- [Overview](#overview)
- [Plugin Setup](#plugin-setup)
- [Composables](#composables)
- [Utilities](#utilities)
- [Components](#components)
- [Exports Reference](#exports-reference)
- [Migration Guide](#migration-guide)
- [Architecture](#architecture)
- [Troubleshooting](#troubleshooting)

---

## Overview

The abstraction layer consists of:

- **WebkitPlugin**: Unified Vue plugin that registers PrimeVue core, services, and directives
- **Composable wrappers**: `useToast` (with semantic shortcuts) and `useDialog`
- **Utility re-exports**: `FilterMatchMode` and other PrimeVue API constants
- **Component wrappers**: `DynamicDialog`, `ConfirmDialog`, and all existing PrimeVue wrappers
- **Directive re-exports**: `Tooltip`

**Why this exists:**

- Consumer apps (e.g., console-kit) can remove `primevue` from their direct dependencies
- Webkit controls the PrimeVue version and can upgrade/swap without breaking consumers
- Composable wrappers allow adding convenience methods (e.g., `toast.success()`)

---

## Plugin Setup

Register all PrimeVue services in a single call:

```js
// main.js
import { WebkitPlugin } from '@aziontech/webkit/plugin'

const app = createApp(App)
app.use(WebkitPlugin)
```

### What the plugin registers

| Registration    | What it does                                        |
| --------------- | --------------------------------------------------- |
| `PrimeVue`      | Core configuration (locale, ripple, zIndex, etc.)   |
| `ToastService`  | Enables `useToast()` and `$toast` global property   |
| `DialogService` | Enables `useDialog()` and `$dialog` global property |
| `v-tooltip`     | Tooltip directive available in all templates        |

### Passing options to PrimeVue

```js
app.use(WebkitPlugin, { ripple: true })
```

Options are forwarded directly to `PrimeVue` config.

---

## Composables

### useToast

```js
import { useToast } from '@aziontech/webkit/use-toast'
```

#### Original API (fully compatible)

```js
const toast = useToast()

toast.add({
  severity: 'success',
  summary: 'Done',
  detail: 'Item saved',
  life: 5000
})

toast.remove(message)
toast.removeAllGroups()
```

#### Shortcut methods

```js
const toast = useToast()

toast.success('Item saved') // severity: success, life: 5000ms
toast.error('Something went wrong') // severity: error, life: 0 (manual close)
toast.warn('Check your input') // severity: warn, life: 5000ms
toast.info('New version available') // severity: info, life: 5000ms
```

| Method                   | Severity |   Default Life   | Customizable |
| ------------------------ | -------- | :--------------: | :----------: |
| `success(detail, life?)` | success  |      5000ms      |     Yes      |
| `error(detail)`          | error    | 0 (manual close) |      No      |
| `warn(detail, life?)`    | warn     |      5000ms      |     Yes      |
| `info(detail, life?)`    | info     |      5000ms      |     Yes      |

Shortcuts are additive. The original `toast.add()` API works unchanged.

---

### useDialog

```js
import { useDialog } from '@aziontech/webkit/use-dialog'
```

#### Usage

```js
const dialog = useDialog()

dialog.open(MyDialogComponent, {
  props: {
    header: 'Confirm Action',
    modal: true,
    blockScroll: true,
    style: { width: '32rem' }
  },
  data: {
    id: 123
  },
  onClose: () => {
    // handle close
  }
})
```

This is a direct wrapper around PrimeVue's `useDialog`. The API is identical.

---

## Utilities

### FilterMatchMode

```js
import { FilterMatchMode } from '@aziontech/webkit/api'

const filters = ref({
  global: { value: '', matchMode: FilterMatchMode.CONTAINS }
})
```

All `FilterMatchMode` constants are available: `STARTS_WITH`, `CONTAINS`, `NOT_CONTAINS`, `ENDS_WITH`, `EQUALS`, `NOT_EQUALS`, `IN`, `LESS_THAN`, `LESS_THAN_OR_EQUAL_TO`, `GREATER_THAN`, `GREATER_THAN_OR_EQUAL_TO`, `BETWEEN`, `DATE_IS`, `DATE_IS_NOT`, `DATE_BEFORE`, `DATE_AFTER`.

---

## Components

### DynamicDialog

Required at app root level for `useDialog()` to work:

```vue
<script setup>
  import DynamicDialog from '@aziontech/webkit/dynamic-dialog'
</script>

<template>
  <DynamicDialog />
  <router-view />
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

**Props:**

- `group` (String) - Optional group name
- `breakpoints` (Object) - Responsive breakpoints

### Tooltip Directive

Already registered globally by `WebkitPlugin`. For standalone use:

```js
import { Tooltip } from '@aziontech/webkit/tooltip'

app.directive('tooltip', Tooltip)
```

---

## Exports Reference

| Export Path                        | Type       | Description                             |
| ---------------------------------- | ---------- | --------------------------------------- |
| `@aziontech/webkit/plugin`         | Plugin     | `WebkitPlugin` - unified PrimeVue setup |
| `@aziontech/webkit/use-toast`      | Composable | `useToast` with shortcut methods        |
| `@aziontech/webkit/use-dialog`     | Composable | `useDialog` wrapper                     |
| `@aziontech/webkit/api`            | Utility    | `FilterMatchMode` constants             |
| `@aziontech/webkit/dynamic-dialog` | Component  | DynamicDialog wrapper                   |
| `@aziontech/webkit/confirm-dialog` | Component  | ConfirmDialog wrapper                   |
| `@aziontech/webkit/tooltip`        | Directive  | Tooltip re-export                       |

---

## Migration Guide

### Step 1: Replace plugin setup in main.js

**Before:**

```js
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import ToastService from 'primevue/toastservice'
import DialogService from 'primevue/dialogservice'

app.use(PrimeVue)
app.directive('tooltip', Tooltip)
app.use(ToastService)
app.use(DialogService)
```

**After:**

```js
import { WebkitPlugin } from '@aziontech/webkit/plugin'

app.use(WebkitPlugin)
```

### Step 2: Replace imports across codebase

| Before                                               | After                                                          |
| ---------------------------------------------------- | -------------------------------------------------------------- |
| `import { useToast } from 'primevue/usetoast'`       | `import { useToast } from '@aziontech/webkit/use-toast'`       |
| `import { useDialog } from 'primevue/usedialog'`     | `import { useDialog } from '@aziontech/webkit/use-dialog'`     |
| `import { FilterMatchMode } from 'primevue/api'`     | `import { FilterMatchMode } from '@aziontech/webkit/api'`      |
| `import DynamicDialog from 'primevue/dynamicdialog'` | `import DynamicDialog from '@aziontech/webkit/dynamic-dialog'` |
| `import ConfirmDialog from 'primevue/confirmdialog'` | `import ConfirmDialog from '@aziontech/webkit/confirm-dialog'` |
| `import Toast from 'primevue/toast'`                 | `import Toast from '@aziontech/webkit/toast'`                  |
| `import Dialog from 'primevue/dialog'`               | `import Dialog from '@aziontech/webkit/dialog'`                |
| `import Button from 'primevue/button'`               | `import Button from '@aziontech/webkit/button'`                |

### Step 3: Remove primevue from package.json

After all imports point to `@aziontech/webkit/*`, remove `primevue` from `dependencies`. It becomes a transitive dependency through webkit.

---

## Architecture

```
Consumer App (console-kit)
    │
    ├── import { WebkitPlugin } from '@aziontech/webkit/plugin'
    ├── import { useToast } from '@aziontech/webkit/use-toast'
    ├── import { useDialog } from '@aziontech/webkit/use-dialog'
    └── import Button from '@aziontech/webkit/button'
                │
                ▼
        @aziontech/webkit
            │
            ├── src/plugins/primevue/index.js     → WebkitPlugin
            ├── src/composables/use-toast/index.js → useToast wrapper
            ├── src/composables/use-dialog/index.js → useDialog wrapper
            ├── src/services/primevue-api/index.js → FilterMatchMode
            ├── src/directives/tooltip/index.js    → Tooltip
            └── src/core/primevue/*/               → Component wrappers
                        │
                        ▼
                    primevue (transitive dependency)
```

### How PrimeVue services work internally

```
WebkitPlugin                    useToast()                    <Toast> component
    │                              │                              │
    ▼                              ▼                              ▼
app.provide(Symbol, svc)    inject(Symbol) → svc         ToastEventBus.on('add')
    │                              │                              │
    └──────────────────────────────┘                              │
                 │                                                │
                 ▼                                                │
           svc.add(msg) ──→ ToastEventBus.emit('add') ───────────┘
```

The webkit wrappers use the **same PrimeVue Symbols** internally, so components and composables communicate seamlessly.

---

## Troubleshooting

### useToast/useDialog throws "not provided" error

**Problem:** `No PrimeVue Toast provided!` or similar error.

**Solution:** Ensure `WebkitPlugin` is registered before the component mounts:

```js
app.use(WebkitPlugin) // Must come before app.mount()
app.mount('#app')
```

### DynamicDialog doesn't open

**Problem:** `dialog.open()` is called but nothing appears.

**Solution:** Ensure `<DynamicDialog />` is mounted at root level (e.g., `App.vue`):

```vue
<template>
  <DynamicDialog />
  <router-view />
</template>
```

### Toast styles not applied

**Problem:** Toast appears but without custom styling via `pt` prop.

**Solution:** The webkit Toast wrapper explicitly forwards the `pt` prop. Ensure you're passing it correctly:

```vue
<Toast :pt="{ root: { class: 'my-class' } }">
  <template #message="{ message }">
    <!-- custom template -->
  </template>
</Toast>
```

### PrimeVue version mismatch

**Problem:** Unexpected behavior after updating webkit.

**Solution:** Check which PrimeVue version webkit uses:

```bash
cat node_modules/@aziontech/webkit/package.json | grep primevue
```

Consumer apps should not have `primevue` in their own `package.json` to avoid version conflicts.

---

**Last Updated:** 2026-04-02
**Version:** 1.0.0
**Maintainer:** Azion WebKit Team
