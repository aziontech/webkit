
<h1 align="center">azion-theme</h1>

![production](https://github.com/aziontech/azion-theme/actions/workflows/release.yml/badge.svg)

<p align="center">
    <img
        src="./doc/cover-image.png"
        width="1200px"
    />
</p>

The Azion Theme repository is focused on sharing our style kit across interfaces and should be used in all company projects, including Azion Console Kit, Azion Site, Landing Pages, and all user interactions with Azion.

## 📋 Table of Contents

- [Installation](#-installation)
- [Usage](#-usage)
- [Development](#-development)
- [Design Tokens](#-design-tokens)
- [Links](#-links)

## 🚀 Installation

To install the `azion-theme` project, you need to follow the command. Choose one of your preferences: npm or yarn:

```bash
npm install azion-theme --save
# or
yarn add azion-theme
```

Alternatively, you can configure the `package.json` file by adding the dependency:

```json
{
  "dependencies": {
    "azion-theme": "^1.4.0"
  }
}
```

After updating the `package.json` file, run `npm install` in the root of your project to install the Azion Theme.

### 🔗 Integration with Front-End Project

To integrate the Azion Theme into your front-end project, you need to import the theme files in your project's entry point file (App.vue, main.js, index.js, etc.):

```javascript
import 'azion-theme/dark';
import 'azion-theme/light';
```

Make sure to include these imports at the top of your entry point file to ensure the styles are applied correctly throughout your application.

## 💻 Development

To work locally, you should clone both the `azion-theme` repository and the other repository where the theme will be used.

### Example:

In this example, we will use the [azion-webkit](https://github.com/aziontech/azion-webkit) repository:

1. Clone the `azion-webkit` and `azion-theme` repositories:
  
  ```bash
  git clone https://github.com/aziontech/azion-webkit.git
  git clone https://github.com/aziontech/azion-theme.git
  ```

2. Install dependencies and create the link point:
  
  ```bash
  cd ./azion-theme && npm i && npm link
  ```

3. Link the `azion-theme` to the `azion-webkit` project:
  
  ```bash
  cd ../azion-webkit && npm i && npm link azion-theme
  ```

Any modifications made to `azion-theme` will be reflected on this development server with hot reload.

## 🎨 Design Tokens

This project includes **primitive color tokens** extracted directly from Figma, ready to be consumed via Tailwind CSS.

### 🚀 How to Use the Tokens

```javascript
// tailwind.config.js
import typography from '@tailwindcss/typography';
import { tokenUtilities } from 'azion-theme/tokens/build/tailwind-plugin';
import colors from 'azion-theme/tokens';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
  darkMode: ['class', '.dark', '.azion.azion-dark'],
  theme: {
    extend: {
      colors: {
        ...colors,
      },
    },
  },
  plugins: [tokenUtilities(), typography],
};
```

#### Token structure overview

**Global/Primitive tokens** (direct values, use with `dark:` variant):
```javascript
// Primitive palettes (all with 50-950 shades)
colors.orange[500];           // #fe601f
colors.violet[500];           // #8a84ec
colors.neutral[900];          // #171717

// Brand colors
colors.brand.black;           // #0a0a0a
colors.brand.white;           // #fafafa
colors.brand.orange;          // #fe601f

// Brand primitives (aliases)
colors.primary[500];          // orange palette
colors.accent[500];           // violet palette

// Surface primitives (neutral-based)
colors.surface[950];          // #0a0a0a
```

**Semantic tokens** (theme-aware, no `dark:` variant needed):
```javascript
// Text colors - automatically switches between light/dark
colors.text.base;             // neutral-900 (light) / neutral-50 (dark)
colors.text.muted;            // neutral-600 (light) / neutral-400 (dark)
colors.text.accent;           // accent-500 (both modes)

// Background colors - theme-aware layers
colors.background.layer1;     // surface-0 (light) / surface-800 (dark)
colors.background.layer2;     // surface-50 (light) / surface-700 (dark)
colors.background.canvas;     // surface-100 (light) / surface-950 (dark)

// Border colors - theme-aware borders
colors.border.base;           // surface-200 (light) / surface-700 (dark)
colors.border.primary;        // primary-500 (both modes)
colors.border.accent;         // accent-500 (both modes)
```

#### Usage in HTML/Tailwind Classes

**Using semantic tokens** (theme-aware, no `dark:` variant needed):
```html
<!-- Semantic background - automatically switches theme -->
<div class="bg-layer1">
  Layer 1 background (white in light, dark in dark mode)
</div>

<!-- Semantic text colors -->
<p class="text-base">
  Base text color (auto-adapts to theme)
</p>

<!-- Semantic borders -->
<div class="border border-base">
  Border adapts to current theme
</div>

<!-- Semantic interactive states -->
<button class="bg-layer1 hover:bg-layer1-hover border border-primary text-primary">
  Themed button
</button>
```

**Using global tokens** (can use `dark:` in this cases):
```html
<!-- Background with dark variant -->
<div class="bg-neutral-50 dark:bg-neutral-950">
  Adaptive background
</div>

<!-- Text colors with dark variant -->
<p class="text-neutral-900 dark:text-neutral-100">
  Primary text color
</p>

<!-- Border colors with dark variant -->
<div class="border border-neutral-200 dark:border-neutral-800">
  Card with adaptive border
</div>

<!-- Using brand colors (no dark variant needed) -->
<button class="bg-orange-500 text-white hover:bg-orange-600">
  Action Button
</button>
```

**Available token classes:**

*Global tokens* (use with `dark:` variant):
- **Neutrals:** `neutral-50` → `neutral-950` (surface backgrounds, text, borders)
- **Brand:** `orange-50` → `orange-950` (primary actions)
- **Accent:** `violet-50` → `violet-950` (secondary highlights)
- **Status:** `red-*`, `green-*`, `yellow-*`, `blue-*` (semantic status colors)

*Semantic tokens* (theme-aware, no `dark:` needed):
- **Text:** `text-base`, `text-muted`, `text-accent`, `text-primary`, `text-link`
- **Background:** `bg-layer1`, `bg-layer2`, `bg-canvas`, `bg-base`
- **Border:** `border-base`, `border-primary`, `border-accent`, `border-warning`, `border-success`, `border-danger`

### Theme Switch Compatibility

The CSS variable initializer targets both the Tailwind `.dark` class and the existing theme classes used by the SCSS theme:

```css
:root, [data-theme=light], .azion.azion-light { /* light vars */ }
[data-theme=dark], .dark, .azion.azion-dark { /* dark vars */ }
```

### Granular Imports (Advanced)

```javascript
// Named exports for specific token types
import { 
  primitives, 
  brandColors, 
  brandPrimitives,
  surfacePrimitives,
  preset,
  createTailwindConfig,
  tokenUtilities 
} from 'azion-theme/tokens';
```

### 🛠️ Sync & Maintenance (With Script)

#### How to feed new and changed tokens from Figma

1) **Update Figma Variables**
   - Ensure **Global** and **Semantic** variables are updated and organized correctly (naming, groups, modes, and values).

2) **Open the Tokens Studio for Figma plugin**

3) **Import Figma Variables into Tokens Studio**
   - Use Tokens Studio’s import-from-variables flow to bring the current Variables state into the token sets.

4) **Export to file/folder**
   - Export using **Multiple files**.

5) **Copy the exported files into this repo**
   - Place them under [`src/tokens/figma-reference-tokens-studio/`](src/tokens/figma-reference-tokens-studio:1) (replace existing contents).

6) **Regenerate the code tokens**
   - Run:

```bash
node ./scripts/figma-sync.js
```

7) **Review and commit**
   - Inspect the diff in the generated files and validate light/dark semantics before committing.

Files affected by the script:
- [`src/tokens/primitives/colors.js`](src/tokens/primitives/colors.js)
- [`src/tokens/primitives/brand.js`](src/tokens/primitives/brand.js)
- [`src/tokens/semantic/text.js`](src/tokens/semantic/text.js)
- [`src/tokens/semantic/backgrounds.js`](src/tokens/semantic/backgrounds.js)
- [`src/tokens/semantic/borders.js`](src/tokens/semantic/borders.js)

### 🧰 Manual Maintenance (Without Script)

When updating or adding tokens manually, edit the files below depending on the token type:

- **Primitive palettes:** [`src/tokens/primitives/colors.js`](src/tokens/primitives/colors.js)
- **Brand + surface primitives:** [`src/tokens/primitives/brand.js`](src/tokens/primitives/brand.js)
- **Semantic text (light/dark):** [`src/tokens/semantic/text.js`](src/tokens/semantic/text.js)
- **Semantic backgrounds (light/dark):** [`src/tokens/semantic/backgrounds.js`](src/tokens/semantic/backgrounds.js)
- **Semantic borders (light/dark):** [`src/tokens/semantic/borders.js`](src/tokens/semantic/borders.js)
- **Brand aliases:** [`src/tokens/colors-brand.js`](src/tokens/colors-brand.js)
- **Tailwind mappings (class names):** [`src/tokens/build/preset.js`](src/tokens/build/preset.js)
- **CSS vars output/selectors:** [`src/tokens/build/css-vars.js`](src/tokens/build/css-vars.js)

Checklist when adding a new token manually:
1) Add/update the primitive or surface scale value (if needed).
2) Add matching semantic entries for both `light` and `dark`.
3) Update Tailwind mappings if you want a class for the token.
4) Regenerate or verify CSS vars output for both themes.

### 🎨 Available Colors

#### Main Palette (Orange)
- `orange-50` → `orange-950`
- **Primary**: `orange-500` (#fe601f)

#### Brand Palette
- `brand-black` (#0a0a0a)
- `brand-white` (#fafafa)
- `brand-dark-gray` (#171717)
- `brand-medium-gray` (#737373)

#### Other Complete Palettes
- **Violet, Slate, Gray, Neutral, Blue, Red, Yellow, Green**
- All with 11 shades (50 → 950)

#### Semantic Colors
- `primary` (orange-500)
- `success` (green-500)
- `warning` (yellow-500)
- `error` (red-500)
- `info` (blue-500)

### ⚠️ Troubleshooting

#### If you get import errors:

**ES Modules (recommended)**
```javascript
import colors from 'azion-theme/tokens';
```

**Named exports**
```javascript
import { primitives, brandColors, brandPrimitives, surfacePrimitives } from 'azion-theme/tokens';
```

**Direct file imports**
```javascript
import { primitives } from 'azion-theme/tokens/primitives/colors.js';
import { brandColors } from 'azion-theme/tokens/colors-brand.js';
```

**Configure Vite (if using Vite)**
Add to your `vite.config.js`:
```javascript
export default {
  resolve: {
    conditions: ['import', 'module', 'browser', 'default']
  }
}
```

## 🔗 Links

- [Figma Global Tokens](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Global-Tokens?node-id=0-1)
