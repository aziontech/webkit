# @aziontech/theme

A comprehensive design token system and theming solution for Azion's web applications. This package provides primitive colors, semantic tokens, brand colors, and seamless integration with Tailwind CSS.

## Features

- **Design Tokens**: Primitive and semantic color tokens generated from Figma
- **Brand Colors**: Azion's official color palette with primary (orange), accent (violet), and surface colors
- **Theme Support**: Built-in light and dark mode theming
- **Tailwind Integration**: Plugin and preset for seamless Tailwind CSS integration
- **CSS Variables**: Automatic CSS variable generation for dynamic theming
- **Widget Support**: Separate theme variant for embedded widgets

## Installation

```bash
npm install @aziontech/theme
# or
pnpm add @aziontech/theme
# or
yarn add @aziontech/theme
```

## Quick Start

### Option 1: CSS Import (Recommended for web applications)

Import the main theme stylesheet:

```javascript
// Default theme (includes light/dark mode support)
import '@aziontech/theme';
```

Add the theme class to your root element:

```html
<div class="azion">
  <!-- Your application content -->
</div>

<!-- For dark mode -->
<div class="azion azion-dark">
  <!-- Your application content -->
</div>
```

### Option 2: Tailwind CSS Integration

#### Using the Preset

Add the preset to your `tailwind.config.js`:

```javascript
import { preset } from '@aziontech/theme/tokens';

export default {
  presets: [preset],
  // your config
};
```

#### Using the Plugin

For static utility classes with light/dark mode support:

```javascript
import { tokenUtilities } from '@aziontech/theme/tokens';

export default {
  plugins: [
    tokenUtilities({
      darkSelector: '.dark',
      extraDarkSelectors: ['.azion.azion-dark']
    })
  ]
};
```

### Option 3: JavaScript Token Access

Access tokens programmatically:

```javascript
// Import all tokens
import {
  primitives,
  brandPrimitives,
  surfacePrimitives,
  textSemantic,
  backgroundSemantic,
  borderSemantic
} from '@aziontech/theme/tokens';

// Use primitive colors
const primaryColor = primitives.orange['500']; // '#fe601f'
const accentColor = primitives.violet['500']; // '#8a84ec'

// Use semantic tokens (returns token references)
const textColor = textSemantic.light.textColorBase; // tokenRef('primitives.neutral.900')
```

### Option 4: CSS Variables Injection

Inject CSS variables dynamically at runtime:

```javascript
import { injectCssVars } from '@aziontech/theme/tokens';

// Injects <style data-azion-tokens> into document.head
const styleElement = injectCssVars();
```

## Token Structure

### Primitive Colors

Base color palettes with numeric scales (50-950):

```javascript
import { primitives } from '@aziontech/theme/tokens';

primitives.orange['500'];  // Primary brand color
primitives.violet['500'];  // Accent brand color
primitives.neutral['900']; // Dark surfaces
primitives.neutral['50'];  // Light surfaces
```

Available primitives:
- `base`: White and black
- `orange`: Primary brand color (11 shades)
- `violet`: Accent brand color (11 shades)
- `neutral`: Gray scale for surfaces (11 shades)
- `gray`, `slate`: Additional gray variants
- `red`: Semantic danger color
- `green`: Semantic success color
- `yellow`: Semantic warning color
- `blue`: Link colors

### Brand Primitives

Azion-specific brand colors:

```javascript
import { brandPrimitives } from '@aziontech/theme/tokens';

brandPrimitives.primary['500'];  // Orange brand color
brandPrimitives.accent['500'];   // Violet accent color
brandPrimitives.absolute.white;  // Pure white
brandPrimitives.absolute.black;  // Pure black
```

### Surface Primitives

Surface color scales for backgrounds:

```javascript
import { surfacePrimitives } from '@aziontech/theme/tokens';

surfacePrimitives.surface['0'];   // White
surfacePrimitives.surface['50'];  // Lightest gray
surfacePrimitives.surface['900']; // Very dark gray
surfacePrimitives.surface['950']; // Almost black
```

### Semantic Tokens

Context-aware tokens that automatically adapt to light/dark themes:

#### Background Tokens

```javascript
import { backgroundSemantic } from '@aziontech/theme/tokens';

// Light mode
backgroundSemantic.light.bgLayer1;     // Surface 0 (white)
backgroundSemantic.light.bgLayer2;     // Surface 50
backgroundSemantic.light.bgCanvas;     // Surface 100

// Dark mode
backgroundSemantic.dark.bgLayer1;      // Surface 800
backgroundSemantic.dark.bgCanvas;      // Surface 950
```

#### Text Tokens

```javascript
import { textSemantic } from '@aziontech/theme/tokens';

// Light mode
textSemantic.light.textColorBase;      // neutral.900
textSemantic.light.textColorMuted;     // neutral.600
textSemantic.light.textColorLink;      // blue.600

// Dark mode
textSemantic.dark.textColorBase;       // neutral.50
textSemantic.dark.textColorMuted;      // neutral.400
textSemantic.dark.textColorLink;       // blue.300
```

#### Border Tokens

```javascript
import { borderSemantic } from '@aziontech/theme/tokens';

borderSemantic.light.borderBase;       // surface.200
borderSemantic.light.borderPrimary;    // primary.500
borderSemantic.light.borderDanger;     // red.600

borderSemantic.dark.borderBase;        // surface.700
borderSemantic.dark.borderDanger;      // red.400
```

## Theming

### Light Mode (Default)

```html
<div class="azion azion-light">
  <!-- Light theme content -->
</div>
```

### Dark Mode

```html
<div class="azion azion-dark">
  <!-- Dark theme content -->
</div>
```

Or use the standard Tailwind dark mode class:

```html
<div class="azion dark">
  <!-- Dark theme content -->
</div>
```

### Dynamic Theme Switching

```javascript
// Toggle dark mode
const root = document.querySelector('.azion');
root.classList.toggle('azion-dark');
root.classList.toggle('azion-light');
```

## Tailwind CSS Usage

### With Preset (Dynamic CSS Variables)

```html
<!-- Background colors -->
<div class="bg-layer1">Layer 1 background</div>
<div class="bg-canvas">Canvas background</div>
<div class="bg-base">Base background</div>

<!-- Text colors -->
<p class="text-base">Base text</p>
<p class="text-muted">Muted text</p>
<a class="text-link">Link text</a>

<!-- Border colors -->
<div class="border border-base">Default border</div>
<div class="border border-primary">Primary border</div>
```

### With Plugin (Static Utilities)

When using the `tokenUtilities` plugin:

```html
<!-- These generate static values for both light and dark -->
<div class="bg-layer1">Light: white / Dark: surface-800</div>
<div class="text-base">Light: neutral-900 / Dark: neutral-50</div>
```

### Complete Tailwind Config Example

```javascript
import { preset, tokenUtilities } from '@aziontech/theme/tokens';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  presets: [preset],
  darkMode: 'class',
  plugins: [
    tokenUtilities({
      darkSelector: '.dark',
      extraDarkSelectors: ['.azion.azion-dark']
    })
  ]
};
```

## CSS Variables

All semantic tokens are available as CSS variables:

```css
/* Automatically generated */
:root, [data-theme=light], .azion.azion-light {
  --text-textColorBase: #171717;
  --background-bgLayer1: #ffffff;
  --border-borderBase: #e5e5e5;
}

[data-theme=dark], .dark, .azion.azion-dark {
  --text-textColorBase: #fafafa;
  --background-bgLayer1: #262626;
  --border-borderBase: #404040;
}
```

Use in your CSS:

```css
.custom-component {
  color: var(--text-textColorBase);
  background-color: var(--background-bgLayer1);
  border-color: var(--border-borderBase);
}
```

## Widget Theme

For embedded widgets and iframes, use the widget theme variant:

```javascript
import '@aziontech/theme/widget';
```

The widget theme includes:
- Compact variable definitions
- Optimized for isolated contexts
- Same token structure as main theme

## API Reference

### Exports

#### Default Export
- `@aziontech/theme` - Main CSS theme (default.js)
- `@aziontech/theme/widget` - Widget CSS theme (widget.js)
- `@aziontech/theme/tokens` - JavaScript token system (src/tokens/index.js)

#### Token Exports

```javascript
// Primitive tokens
export { primitives } from './primitives/colors.js';
export { brandPrimitives, surfacePrimitives } from './primitives/brand.js';

// Semantic tokens
export { textSemantic } from './semantic/text.js';
export { backgroundSemantic } from './semantic/backgrounds.js';
export { borderSemantic } from './semantic/borders.js';

// Build utilities
export { tokenRef } from './build/refs.js';
export { resolveRefsToCssVars } from './build/resolve.js';
export { createCssVars, cssVarsString, injectCssVars } from './build/css-vars.js';
export { preset } from './build/preset.js';
export { tokenUtilities } from './build/tailwind-plugin.js';
```

## Token Resolution

Tokens use a reference system for maintainability:

```javascript
// Define token reference
const textColor = tokenRef('primitives.neutral.900');

// Resolve to actual value
resolveRefsToCssVars({
  primitives,
  textSemantic
});
// Output: { '--text-textColorBase': '#171717' }
```

## Development

### Prerequisites

- Node.js (LTS version)
- pnpm (v9+)

### Scripts

```bash
# Format code
pnpm format

# Dry-run package
pnpm pack:dry

# Publish (requires dist build)
pnpm publish
```

### Project Structure

```
packages/theme/
├── default.js              # Main entry point
├── widget.js               # Widget entry point
├── src/
│   ├── azion/             # CSS theme files
│   │   ├── theme.scss     # Main theme
│   │   ├── theme-widget.scss
│   │   ├── _variables.scss
│   │   ├── _fonts.scss
│   │   ├── theme-base/    # Base components
│   │   ├── extended-components/
│   │   └── custom/
│   └── tokens/            # JavaScript tokens
│       ├── index.js       # Public API
│       ├── primitives/    # Base colors
│       ├── semantic/      # Context-aware tokens
│       └── build/         # Build utilities
│           ├── preset.js
│           ├── css-vars.js
│           └── tailwind-plugin.js
└── package.json
```

## Browser Support

- Modern browsers with CSS Variables support
- Chrome, Firefox, Safari, Edge (latest versions)

## Versioning

This package follows [Semantic Versioning](https://semver.org/). Version numbers are automatically managed via semantic-release.

## Contributing

This package is part of the Azion WebKit monorepo. Please see the main repository for contribution guidelines.

## License

MIT © Azion Technologies

## Links

- [GitHub Repository](https://github.com/aziontech/webkit)
- [NPM Package](https://www.npmjs.com/package/@aziontech/theme)
- [Issue Tracker](https://github.com/aziontech/webkit/issues)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.
