---
title: Installation
description: Get started with the Azion Design System by installing the required packages.
navLabel: Installation
order: 2
type: guide
category: installation
---
## Requirements

- Node.js 18.x or higher
- Vue 3.x
- Tailwind CSS 3.x

## Package Installation

Install the core packages you need:

```bash
# Install components
npm install @aziontech/components

# Install icons
npm install @aziontech/icons

# Install theme (optional, for design tokens)
npm install @aziontech/theme
```

## Tailwind Configuration

Extend your Tailwind configuration to include Azion's design tokens:

```js
// tailwind.config.js
import azionTheme from '@aziontech/theme';

export default {
  content: [
    './src/**/*.{vue,js,ts}',
    './node_modules/@aziontech/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: azionTheme.tailwindPreset,
  },
};
```

## Vue Configuration

Import the CSS and register the components:

```js
// main.js
import { createApp } from 'vue';
import App from './App.vue';

// Import Azion CSS
import '@aziontech/theme/css';

// Import Azion components (optional)
import { Button, Input, Select } from '@aziontech/components';

const app = createApp(App);

// Register components globally
app.component('AzButton', Button);
app.component('AzInput', Input);
app.component('AzSelect', Select);

app.mount('#app');
```

## Next Steps

- [Quick Start](/get-started) - Build your first component
- [Components](/components) - Explore available components
- [Foundations](/foundations) - Learn about design principles
