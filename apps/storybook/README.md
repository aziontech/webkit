# Storybook

This is the Storybook documentation application for the `@aziontech/webkit` component library. It provides an interactive documentation and development environment for all webkit components, foundations, and composed templates.

> Stories import from `@aziontech/webkit/*`, resolved from the workspace package `@aziontech/webkit`.

## Technology Stack

- **Storybook 8.6.x** — Component documentation tool;
- **Vue 3.5.x** — Frontend framework;
- **Vite 6.x** — Build tool;
- **Tailwind CSS 3.3.x** — Utility-first CSS;
- **Sass 1.86.x** — Stylesheet preprocessor;
- **PrimeVue 3.35.0 / PrimeFlex 3.3.x / VeeValidate 4.15.x** — power the legacy `Field*` / `Input*` form stories;
- **Internal workspace packages** — `@aziontech/webkit` (components), `@aziontech/icons` (icon set), `@aziontech/theme` (design tokens & theming).

Key Storybook addons: `@storybook/addon-essentials`, `@storybook/addon-links`, `@storybook/addon-themes`, `@whitespace/storybook-addon-html`.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js >= 22.18.0 (see `engines` in `package.json`)
- pnpm 10.x (the repo pins `pnpm@10.30.3` via `packageManager`)

### Installation

From the root of the monorepo:

```bash
pnpm install
```

### Running Storybook

To start the Storybook development server:

```bash
# From the root (builds @aziontech/icons first, then runs dev)
pnpm storybook:dev

# From this directory
pnpm dev
```

The Storybook will be available at `http://localhost:6006`.

### Building Storybook

To build a static version of the Storybook:

```bash
# From the root (builds @aziontech/icons first, then builds)
pnpm storybook:build

# From this directory
pnpm build
```

The static files will be generated in the `dist` directory.

### Previewing Built Storybook

To preview the built Storybook (served via `http-server`):

```bash
# From the root
pnpm storybook:preview

# From this directory
pnpm preview
```

The preview will be available at `http://localhost:6007`.

## Project Structure

```
apps/storybook/
├── .storybook/
│   ├── main.js              # Main Storybook configuration (stories glob, addons, viteFinal)
│   ├── preview.js           # Global decorators and parameters
│   ├── manager.js           # Sidebar / manager UI customization
│   └── manager-head.html    # Manager <head> injection
├── src/
│   ├── foundations/         # Support code for the Foundations stories (not stories themselves)
│   │   ├── components/      # ColorSwatch, IconGrid, TokenTable, TypographyPreview, …
│   │   ├── composables/     # e.g. useViewport
│   │   ├── data/            # colors, spacing, typography token data
│   │   └── utils/           # from-tokens helper
│   ├── stories/
│   │   ├── foundations/     # Colors, Icons, Typography
│   │   ├── components/      # Component stories, grouped by category (see below)
│   │   │   ├── actions/
│   │   │   ├── content/
│   │   │   ├── data/
│   │   │   ├── feedback/
│   │   │   ├── inputs/
│   │   │   ├── layout/
│   │   │   ├── navigation/
│   │   │   └── overlay/
│   │   ├── templates/       # Composed, page-level examples
│   │   └── utils/           # Spinner, …
│   └── styles/
│       └── preview.css      # Global styles
├── azion.config.mjs         # Azion deploy configuration
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Component Categories

The Storybook sidebar is organized into **Foundations**, **Components** (by category), **Templates**, and **Utils**.

### Foundations

- Colors
- Icons
- Typography

### Components

**Actions** — Button, Button Highlight, Icon Button, Mini Button, SegmentedButton

**Content** — Avatar, Azion Logo (Default / Full / Min), Badge, CardBox, CardPricing, Currency, Item, Overline, Tag

**Data** — DataTable

**Feedback** — EmptyState, Message, Skeleton, Status Indicator

**Inputs** — Box Grid Selection, Checkbox, Dropdown, Field Checkbox, Field Checkbox Block, Field Radio, Field Radio Block, Field Switch, FieldSwitchBlock, FieldTextarea, Input Switch, Input Text, Label, Radio Button, Select, Textarea

**Layout** — GlobalHeader, ScrollArea, Sidebar

**Navigation** — Breadcrumb, BreadcrumbItem, Link, MenuItem, NavigationMenu, TabView

**Overlay** — Dialog, Drawer, DropdownMenu, Tooltip

**Azion** — MoveToTheEdge, Technologies

### Templates

Composed, page-level examples: ChangePlanDrawer, DeleteDomainDialog, Onboarding Form, Plan Success, PlatformShell, SignUpCard.

### Utils

- Spinner

## Writing Stories

Stories are written using the Component Story Format (CSF). Here's an example:

```javascript
import Button from '@aziontech/webkit/button';

export default {
  title: 'Components/Actions/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    kind: { control: 'select', options: ['primary', 'secondary', 'outlined', 'text'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    disabled: { control: 'boolean' }
  }
};

export const Default = {
  args: {
    kind: 'primary',
    size: 'large'
  }
};
```

> Imports use the `@aziontech/webkit/*` paths. New component stories follow the canonical `Button.stories.js` shape — see [`.claude/skills/storybook-write`](../../.claude/skills/storybook-write/SKILL.md).

## Adding New Stories

1. Create a new file under the matching category in `src/stories/` — typically `src/stories/components/<category>/<component>/ComponentName.stories.js`.
2. Name the file following the pattern: `ComponentName.stories.js`.
3. Import the component from `@aziontech/webkit/<component>`.
4. Define the default export with a `title` matching the sidebar taxonomy (`Components/<Category>/<Name>`), the `component`, and `argTypes`.
5. Export named story variants.

## Testing Components

Storybook provides interactive controls for testing different prop combinations. Use the Controls panel to modify props in real-time, and the HTML addon to inspect rendered markup.

## Documentation

Each component has auto-generated documentation (via the `autodocs` tag) that shows:

- Component description
- Available props and their types
- Default values
- Usage examples

## Related Documentation

- [Storybook Documentation](https://storybook.js.org/docs)
- [Vue 3 Documentation](https://vuejs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PrimeVue Documentation](https://primevue.org/)
- [VeeValidate Documentation](https://vee-validate.logaretm.com/)

## License

MIT
