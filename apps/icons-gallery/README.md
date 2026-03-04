# Icons Gallery

> Visual showcase and documentation for **@aziontech/icons** — Azion's icon font library featuring azionicons (`ai`) and primeicons (`pi`).

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)

---

## Overview

The Icons Gallery is a Vue 3 single-page application that provides an interactive visual reference for all icons available in the `@aziontech/icons` package. It allows developers to:

- **Search** icons by name or keywords
- **Preview** icons at different sizes (8px–320px)
- **Customize** icon colors using a color picker
- **Copy** icon HTML code to clipboard
- **Download** icons as PNG or SVG files
- **Toggle** between light and dark themes

The application is deployed on **Azion's Edge Platform** for low-latency global delivery.

---

## Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Vue 3 (Composition API) | Reactive UI components |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Icons** | @aziontech/icons | Icon font package (workspace dependency) |
| **Color Picker** | vue3-colorpicker | Color selection widget |
| **Build** | Vue CLI | Development server and bundling |
| **Testing** | Jest + Vue Test Utils | Unit testing |
| **Deployment** | Azion Edge Platform | Global edge deployment |

### Application Flow

```mermaid
flowchart TD
    A[User visits gallery] --> B[Load icons.json]
    B --> C[Render icon grid]
    C --> D{User interaction}
    D -->|Search| E[Filter icons by name/keywords]
    D -->|Color change| F[Update icon colors]
    D -->|Size change| G[Adjust font-size]
    D -->|Copy code| H[Copy HTML to clipboard]
    D -->|Download| I[Generate PNG or SVG]
    D -->|Theme toggle| J[Switch light/dark mode]
    E --> C
    F --> C
    G --> C
    H --> K[Show confirmation]
    I --> L[Download file]
    J --> M[Update CSS variables]
```

### Component Architecture

```mermaid
flowchart TB
    subgraph App.vue
        A[SearchBar.vue] --> B[Filter icons]
        C[IconCard.vue] --> D[Display icon]
        D --> E[Copy/Download actions]
        F[ColorPicker] --> G[Update color state]
        H[Size Slider] --> I[Update size state]
        J[Theme Toggle] --> K[Dark/Light mode]
    end
    L[icons.json] --> M[Icon metadata]
    M --> App.vue
    N[@aziontech/icons] --> O[Icon fonts CSS]
    O --> App.vue
```

---

## Project Structure

```
apps/icons-gallery/
├── public/
│   ├── favicon.ico          # Site favicon
│   └── index.html           # HTML template
├── src/
│   ├── components/
│   │   ├── IconCard.vue     # Individual icon display card
│   │   └── SearchBar.vue    # Search input with filtering
│   ├── App.vue              # Main application component
│   ├── icons.json           # Icon metadata (name, class, keywords)
│   ├── main.css             # Global styles and Tailwind imports
│   ├── main.js              # Application entry point
│   └── theme.js             # Dark/light theme management
├── tests/
│   └── unit/
│       ├── iconDownload.spec.js  # Download functionality tests
│       └── jest.setup.js         # Jest configuration
├── azion/                    # Azion deployment config
│   ├── args.json            # Build arguments
│   └── azion.json           # Edge application manifest
├── azion.config.cjs         # Azion project configuration
├── babel.config.js          # Babel configuration
├── jest.config.js           # Jest test configuration
├── jsconfig.json            # JavaScript/IDE configuration
├── package.json             # Dependencies and scripts
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── vue.config.js            # Vue CLI configuration
```

### Key Files Explained

| File | Purpose |
|------|---------|
| [`src/App.vue`](src/App.vue) | Main component containing icon grid, controls, and state management |
| [`src/components/IconCard.vue`](src/components/IconCard.vue) | Renders individual icon with hover actions (copy code, copy image, download) |
| [`src/components/SearchBar.vue`](src/components/SearchBar.vue) | Search input with real-time filtering |
| [`src/icons.json`](src/icons.json) | Metadata for all icons including name, class, and searchable keywords |
| [`src/theme.js`](src/theme.js) | Theme initialization and toggle functionality |
| [`azion.config.cjs`](azion.config.cjs) | Edge deployment configuration with caching rules |

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (workspace package manager)

### Installation

This app is part of a pnpm monorepo. From the workspace root:

```bash
# Install all workspace dependencies
pnpm install

# Or install only for this app
cd apps/icons-gallery
pnpm install
```

### Development Server

```bash
# Start development server on port 3333
pnpm serve

# Or from workspace root
pnpm --filter icons-gallery serve
```

The app will be available at `http://localhost:3333` with hot module replacement enabled.

### Build for Production

```bash
# Build for Vue CLI output
pnpm build

# Build for Azion Edge deployment
pnpm build:azion
```

The production build outputs to `dist/` directory.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm serve` | Start development server with HMR on port 3333 |
| `pnpm build` | Build production bundle via Vue CLI |
| `pnpm build:azion` | Build optimized for Azion Edge Platform |
| `pnpm test:unit` | Run Jest unit tests |
| `pnpm lint` | Run ESLint on source files |
| `pnpm format` | Format code with Prettier |
| `pnpm preview` | Preview production build with Vite |
| `pnpm publish` | Deploy to Azion Edge Platform (local mode) |

---

## Configuration

### Vue CLI (`vue.config.js`)

```javascript
module.exports = {
  publicPath: '/',
  devServer: {
    port: 3333,           // Development server port
    historyApiFallback: true,  // SPA routing support
    hot: true,            // Hot module replacement
    open: true            // Auto-open browser
  }
}
```

### Tailwind CSS (`tailwind.config.js`)

Extends the root workspace Tailwind configuration:

```javascript
module.exports = {
  content: ['./src/**/*.{vue,js,ts}'],
  // Uses workspace-level theme extensions
}
```

### Azion Edge (`azion.config.cjs`)

Configures edge deployment with:

- **Storage connector** for static assets
- **Cache policies** (2-hour browser/edge TTL)
- **SPA routing** via rewrite to `index.html`
- **Static asset delivery** directly from edge storage

---

## Icon Showcase

The gallery displays icons from two font families:

### Azionicons (`ai`) — 87 Icons

Azion-specific product and platform icons organized by category:

#### Platform Pillars

| Icon | Class | Usage |
|------|-------|-------|
| AI Pillar | `ai ai-ai-pillar` | AI/ML capabilities |
| Build Pillar | `ai ai-build-pillar` | Build processes |
| Deploy Pillar | `ai ai-deploy-pillar` | Deployment services |
| Secure Pillar | `ai ai-secure-pillar` | Security features |
| Observe Pillar | `ai ai-observe-pillar` | Observability tools |

#### Edge Products

| Icon | Class | Usage |
|------|-------|-------|
| Edge Application | `ai ai-edge-application` | Edge applications |
| Edge Functions | `ai ai-edge-functions` | Serverless functions |
| Edge Firewall | `ai ai-edge-firewall` | Web application firewall |
| Edge DNS | `ai ai-edge-dns` | DNS services |
| Edge KV | `ai ai-edge-kv` | Key-value storage |
| Edge SQL | `ai ai-edge-sql` | SQL database |
| Edge Storage | `ai ai-edge-storage` | Object storage |
| Edge Orchestrator | `ai ai-edge-orchestrator` | Workflow orchestration |

#### Framework Integrations

| Icon | Class | Usage |
|------|-------|-------|
| Angular | `ai ai-angular` | Angular framework |
| React | `ai ai-react` | React framework |
| Vue | `ai ai-vue` | Vue framework |
| Next.js | `ai ai-next` | Next.js framework |
| Nuxt | `ai ai-nuxt` | Nuxt framework |
| Astro | `ai ai-astro` | Astro framework |
| Vite | `ai ai-vite` | Vite build tool |

#### Tools & Services

| Icon | Class | Usage |
|------|-------|-------|
| Azion CLI | `ai ai-azion-cli` | Command-line tool |
| Azion API | `ai ai-azion-api` | API services |
| Ask Azion | `ai ai-ask-azion` | AI assistant |
| Marketplace | `ai ai-marketplace` | Marketplace services |

### PrimeIcons (`pi`) — 315+ Icons

General-purpose UI icons from the PrimeIcons library. Some commonly used icons:

#### Navigation & Arrows

| Icon | Class | Usage |
|------|-------|-------|
| Home | `pi pi-home` | Home navigation |
| Arrow Right | `pi pi-arrow-right` | Right direction |
| Arrow Left | `pi pi-arrow-left` | Left direction |
| Arrow Up | `pi pi-arrow-up` | Up direction |
| Arrow Down | `pi pi-arrow-down` | Down direction |
| Angle Right | `pi pi-angle-right` | Chevron right |
| Angle Left | `pi pi-angle-left` | Chevron left |

#### Actions

| Icon | Class | Usage |
|------|-------|-------|
| Search | `pi pi-search` | Search action |
| Plus | `pi pi-plus` | Add/create |
| Times | `pi pi-times` | Close/cancel |
| Check | `pi pi-check` | Confirm/success |
| Edit | `pi pi-pencil` | Edit action |
| Delete | `pi pi-trash` | Delete action |
| Download | `pi pi-download` | Download action |
| Copy | `pi pi-copy` | Copy action |
| Cog | `pi pi-cog` | Settings |

#### Status & Feedback

| Icon | Class | Usage |
|------|-------|-------|
| Info Circle | `pi pi-info-circle` | Information |
| Exclamation Triangle | `pi pi-exclamation-triangle` | Warning |
| Ban | `pi pi-ban` | Forbidden/blocked |
| Bell | `pi pi-bell` | Notifications |
| Spinner | `pi pi-spinner` | Loading state |

---

## Adding New Icons

When new icons are added to `@aziontech/icons`, update the gallery:

1. **Rebuild the icons package**:
   ```bash
   cd packages/icons
   pnpm build
   ```

2. **Update `src/icons.json`** with the new icon entry:
   ```json
   {
     "icon": "ai ai-new-icon",
     "keywords": "new, icon, keywords",
     "name": "ai-new-icon"
   }
   ```

3. **Verify** the icon displays correctly in the gallery.

---

## Deployment

### Azion Edge Platform

The gallery is designed for deployment on Azion's Edge Platform:

```bash
# Build for edge deployment
pnpm build:azion

# Deploy (requires Azion CLI authentication)
pnpm publish
```

#### Deployment Architecture

```mermaid
flowchart LR
    A[User Request] --> B[Edge Node]
    B --> C{Cache Hit?}
    C -->|Yes| D[Return Cached Asset]
    C -->|No| E[Fetch from Storage Connector]
    E --> F[Cache Response]
    F --> G[Return to User]
    D --> G
```

The deployment configuration includes:

- **Storage Connector**: Serves static assets from edge storage
- **Cache Policy**: 2-hour TTL for browser and edge cache
- **SPA Routing**: All routes rewrite to `index.html` for client-side routing

---

## Testing

### Unit Tests

```bash
# Run all unit tests
pnpm test:unit

# Run with coverage
pnpm test:unit -- --coverage
```

Tests are located in `tests/unit/` and use Jest with Vue Test Utils.

### Test Coverage

| Module | Tests |
|--------|-------|
| Icon Download | PNG/SVG download functionality |
| Components | Vue component rendering |

---

## Contributing

### Development Workflow

1. **Create a feature branch** from `main`
2. **Make changes** following the existing code style
3. **Run linting and formatting**:
   ```bash
   pnpm lint
   pnpm format
   ```
4. **Run tests**:
   ```bash
   pnpm test:unit
   ```
5. **Submit a pull request** with a clear description

### Code Style

- Vue 3 Composition API with `<script setup>`
- Tailwind CSS utility classes for styling
- ESLint + Prettier for code formatting

---

## Related Packages

| Package | Description |
|---------|-------------|
| [@aziontech/icons](../../packages/icons/README.md) | Icon font library (azionicons + primeicons) |

---

## License

[MIT](LICENSE) © 2026 Azion Technologies
