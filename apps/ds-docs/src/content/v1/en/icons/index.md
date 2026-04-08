---
title: Icons
description: Icon library with Azion Icons and PrimeIcons for use in your applications.
navLabel: Icons
order: 1
type: icon
---

# Icons

> **Icon Gallery** — Browse all available icons with a visual gallery, search, and copy-to-clipboard. <a href="https://icons-gallery.azion.app" target="_blank" rel="noopener noreferrer">Open Icon Gallery</a>

The Azion Design System includes two icon libraries:

- **Azion Icons** - Custom icons designed for Azion products
- **PrimeIcons** - General purpose icon library from PrimeVue

## Installation

Icons are included in the `@aziontech/icons` package:

```bash
npm install @aziontech/icons
```

## Usage

### Font Icons

Use icons as font icons with the appropriate class:

```html
<!-- Azion Icon -->
<i class="ai ai-azion"></i>

<!-- PrimeIcon -->
<i class="pi pi-home"></i>
```

### SVG Icons

Import SVG icons directly for more control:

```js
import { aiAzion, piHome } from '@aziontech/icons/svg';
```

## Icon Categories

### Azion Icons

Azion Icons are organized into categories:

- **Product Icons** - Azion product and service icons
- **Action Icons** - Common action icons
- **Status Icons** - Status and notification icons

### PrimeIcons

PrimeIcons provide a comprehensive set of general-purpose icons suitable for most UI needs.

## Sizing

Icons inherit their size from the font size of their container:

```html
<!-- Small -->
<i class="ai ai-azion text-sm"></i>

<!-- Medium (default) -->
<i class="ai ai-azion text-base"></i>

<!-- Large -->
<i class="ai ai-azion text-2xl"></i>
```

## Accessibility

When using icons alone, provide accessible labels:

```html
<!-- Icon button with label -->
<button aria-label="Settings">
  <i class="pi pi-cog"></i>
</button>

<!-- Decorative icon (hidden from screen readers) -->
<i class="pi pi-star" aria-hidden="true"></i>
```

## Related

- [Button](/components/button) - Button component with icon support
