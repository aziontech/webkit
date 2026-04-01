# WebKit Repository Overview

> Central Front-End repository for Azion, containing shared components, styles, and utilities used across multiple projects.

## Repository Structure

```
webkit/
├── packages/           # Published npm packages
│   ├── webkit/        # Vue 3 UI component library
│   ├── icons/         # Icon font library (azionicons + primeicons)
│   └── theme/         # Design tokens and theming system
├── apps/              # Internal applications
│   ├── icons-gallery/ # Interactive icon gallery
│   └── storybook/     # Component documentation
└── docs/              # Documentation and plans
    └── plans/         # Development plans and analysis
```

---

## Packages

### 1. @aziontech/webkit

**Description**: Reusable UI components and design system utilities for building Azion web interfaces.

**Version**: 1.3.0

**Key Technologies**:
- Vue 3
- PrimeVue 3.35.0
- VeeValidate 4.x (form validation)
- @vueuse/core (Vue composition utilities)

**Component Categories**:

| Category | Components |
|----------|------------|
| **Form Fields** | field-text, field-text-area, field-text-icon, field-text-password, field-text-privacy, field-number, field-phone-number, field-phone-number-country |
| **Selection** | field-dropdown, field-dropdown-icon, field-dropdown-lazy-loader, field-dropdown-lazy-loader-dynamic, field-dropdown-lazy-loader-with-filter, field-dropdown-multi-select-lazy-loader, field-multi-select, field-pick-list |
| **Checkboxes & Radios** | field-checkbox-block, field-radio-block, field-switch-block, field-group-checkbox, field-group-radio, field-group-switch, field-switch |
| **Autocomplete** | field-auto-complete |
| **Other** | label, azion-system-status, selector-block |

**Component Architecture**:
- Located in `packages/webkit/src/core/form/`
- Each component is self-contained with its own `package.json`
- Uses VeeValidate for form validation integration
- Built on top of PrimeVue components with Azion-specific styling

---

### 2. @aziontech/icons

**Description**: Icon font library for Azion — azionicons (ai) + primeicons (pi) delivered as CSS + woff2.

**Version**: 1.3.0

**Icon Sets**:

| Font | Prefix | Count | Description |
|------|--------|-------|-------------|
| azionicons | `ai` | 87 | Azion product and ecosystem icons |
| primeicons | `pi` | 315 | General-purpose UI icons |

**Icon Categories (azionicons)**:
- **Platform Pillars**: ai-pillar, build-pillar, deploy-pillar, secure-pillar, observe-pillar
- **Products**: edge-application, edge-functions, edge-firewall, edge-dns, gateway, etc.
- **Storage & Data**: edge-kv, edge-sql, edge-storage, data-stream
- **Observability**: real-time-metrics, real-time-events, real-time-purge
- **Security**: edge-firewall, waf-rules, network-lists, digital-certificates
- **Frameworks**: angular, astro, react, vue, next, nuxt, vite, etc.
- **Integrations**: terraform, graphql, redis, turso

**Build Process**:
- Uses [fantasticon](https://github.com/tancredi/fantasticon) for font generation
- SVG source files in `src/svg-raw/`
- Outputs woff2 fonts + CSS to `dist/`
- Includes SVG validation step

**Usage**:
```html
<!-- Azion icons -->
<i class="ai ai-azion"></i>
<i class="ai ai-edge-application"></i>

<!-- PrimeIcons -->
<i class="pi pi-home"></i>
<i class="pi pi-search"></i>
```

---

### 3. @aziontech/theme

**Description**: Comprehensive design token system and theming solution for Azion's web applications.

**Version**: 1.0.4

**Features**:
- Design tokens generated from Figma
- Brand colors (primary orange, accent violet)
- Light and dark mode support
- Tailwind CSS integration (preset + plugin)
- CSS Variables generation
- Widget theme variant

**Token Structure**:

```
src/tokens/
├── primitives/
│   ├── colors.js     # Base color palettes (orange, violet, neutral, etc.)
│   └── brand.js      # Azion brand colors (primary, accent, surface)
├── semantic/
│   ├── text.js       # Text colors for light/dark themes
│   ├── backgrounds.js # Background colors for light/dark themes
│   └── borders.js    # Border colors for light/dark themes
└── build/
    ├── preset.js         # Tailwind preset
    ├── tailwind-plugin # Static utility classes plugin
    ├── css-vars.js       # CSS variable generation
    └── refs.js           # Token reference system
```

**Color Primitives**:
- `orange`: Primary brand color (11 shades: 50-950)
- `violet`: Accent brand color (11 shades)
- `neutral`: Gray scale for surfaces
- `red`, `green`, `yellow`, `blue`: Semantic colors

**Usage Options**:

```javascript
// 1. CSS Import
import '@aziontech/theme';

// 2. Tailwind Preset
import { preset } from '@aziontech/theme/tokens';
export default { presets: [preset] };

// 3. JavaScript Tokens
import { primitives, textSemantic } from '@aziontech/theme/tokens';
const primaryColor = primitives.orange['500']; // '#fe601f'
```

**Theming**:
```html
<div class="azion azion-light"><!-- Light mode --></div>
<div class="azion azion-dark"><!-- Dark mode --></div>
```

---

## Applications

### 1. icons-gallery

**Description**: Interactive gallery for browsing and downloading Azion icons.

**Tech Stack**:
- Vue 3
- Vite
- Tailwind CSS
- Vitest (unit testing)
- Azion CLI (deployment)

**Features**:
- Search and filter icons
- Download individual icons
- Copy icon class names
- Color customization

### 2. storybook

**Description**: Component documentation and development environment.

**Tech Stack**:
- Storybook 8.6
- Vue 3
- Vite

**Stories Location**: `apps/storybook/src/stories/`

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Vue 3.5+ |
| **UI Library** | PrimeVue 3.x |
| **Styling** | Tailwind CSS 3.x, SCSS |
| **Form Validation** | VeeValidate 4.x |
| **Build Tool** | Vite 6.x |
| **Package Manager** | pnpm (workspaces) |
| **Testing** | Vitest |
| **Documentation** | Storybook 8.6 |
| **Release** | semantic-release |

---

## Scripts

### Root Level (package.json)

| Command | Description |
|---------|-------------|
| `icons:gallery:build` | Build icons gallery app |
| `icons:gallery:serve` | Develop icons gallery |
| `icons:build` | Build icons package |
| `icons:validate` | Validate SVG icons |
| `webkit:build:dts` | Generate TypeScript declarations |
| `storybook:dev` | Start Storybook dev server |
| `storybook:build` | Build Storybook static site |

---

## Development Plans

Located in `docs/plans/`:

1. **field-messages-component.md** - Field messages component design
2. **form-inputs-migration-plan.md** - Form inputs migration strategy
3. **storybook-implementation-plan.md** - Storybook implementation guide
4. **storybook-required-props-analysis.md** - Analysis of required props

---

## Architecture Diagram

```mermaid
graph TB
    subgraph Apps
        IG[icons-gallery]
        SB[storybook]
    end

    subgraph Packages
        WEBKIT[@aziontech/webkit<br/>Vue Components]
        ICONS[@aziontech/icons<br/>Icon Fonts]
        THEME[@aziontech/theme<br/>Design Tokens]
    end

    subgraph External
        PV[PrimeVue 3]
        VEE[VeeValidate]
        TW[Tailwind CSS]
    end

    IG --> ICONS
    SB --> WEBKIT
    SB --> ICONS
    
    WEBKIT --> PV
    WEBKIT --> VEE
    WEBKIT --> THEME
    
    THEME --> TW
    ICONS --> WEBKIT
```

---

## Key Design Patterns

### Component Structure

Each form field component follows this pattern:

```vue
<script setup>
// Props: value, name, label, placeholder, disabled, etc.
// Emits: blur, input
// Uses VeeValidate's useField for validation
// Wraps PrimeVue components
</script>

<template>
  <Label />
  <InputSlot>
    <!-- PrimeVue input component -->
  </InputSlot>
</template>
```

### Token System

```
Primitives (base values)
    ↓
Brand Primitives (Azion-specific)
    ↓
Semantic Tokens (context-aware)
    ↓
CSS Variables (runtime theming)
```

---

## Publishing

All packages use semantic-release for automated versioning and publishing:

- **@aziontech/webkit**: npm publish with TypeScript declarations
- **@aziontech/icons**: Published from `dist/` directory
- **@aziontech/theme**: Includes CSS, JS tokens, and Tailwind integration

---

## Contribution

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on:
- Reporting bugs
- Suggesting enhancements
- Submitting pull requests

---

## Links

- **Repository**: https://github.com/aziontech/webkit
- **NPM**: 
  - [@aziontech/webkit](https://www.npmjs.com/package/@aziontech/webkit)
  - [@aziontech/icons](https://www.npmjs.com/package/@aziontech/icons)
  - [@aziontech/theme](https://www.npmjs.com/package/@aziontech/theme)
