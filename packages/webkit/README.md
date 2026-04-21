# @aziontech/webkit

Reusable UI components and design system utilities for building Azion web interfaces.

## Installation

```bash
npm install @aziontech/webkit
```

## Quick Start

Register the plugin in your Vue app:

```js
import { createApp } from 'vue'
import { WebkitPlugin } from '@aziontech/webkit/plugin'

const app = createApp(App)
app.use(WebkitPlugin)
```

Import individual components:

```js
import FieldText from '@aziontech/webkit/field-text'
import Button from '@aziontech/webkit/button'
import ListDataTable from '@aziontech/webkit/list-data-table'
```

## Features

- **Form Components**: Comprehensive form fields with validation (powered by VeeValidate)
- **PrimeVue Wrappers**: Styled PrimeVue components with Azion design system
- **List Data Table**: Advanced data table with filtering, sorting, and pagination
- **Utilities**: Composables for toast notifications, dialogs, and more

## Dependencies

- Vue 3.x
- PrimeVue 3.35.0
- VeeValidate 4.x
- @vueuse/core
- motion-v

## License

MIT
