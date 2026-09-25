<h1 align="center">Azion Webkit Monorepo</h1>

Central front-end repository for Azion, containing reusable UI components, design tokens, icons, and documentation apps used across multiple products.

## What is in this repository

- `@aziontech/webkit`: Vue component library and UI building blocks.
- `@aziontech/theme`: design token system, CSS variables, and Tailwind integration.
- `@aziontech/icons`: Azion + Prime icon fonts as CSS/woff2 assets.
- Storybook app for documentation and visual validation.
- Icons Gallery app for icon exploration and QA.

## Workspace structure

```text
webkit/
|- apps/
|  |- storybook/      # Component docs and development playground
|  \- icons-gallery/  # Interactive icon browser
|- packages/
|  |- webkit/         # Reusable Vue components
|  |- theme/          # Tokens and theme styles
|  \- icons/          # Icon generation and distribution
|- package.json       # Root workspace scripts
\- pnpm-workspace.yaml
```

## Packages

| Package                                                              | Description                                                    | CI                                                                                                                                                                                                                | Version                                                                                                               |
| -------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [@aziontech/icons](https://www.npmjs.com/package/@aziontech/icons)   | Azion and Prime icon fonts used across products.               | [![Package Icons](https://github.com/aziontech/webkit/actions/workflows/package-icons.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/package-icons.yml?query=branch%3Amain)    | [![npm version](https://img.shields.io/npm/v/@aziontech/icons.svg)](https://www.npmjs.com/package/@aziontech/icons)   |
| [@aziontech/theme](https://www.npmjs.com/package/@aziontech/theme)   | Theme configuration, semantic tokens, and styling foundations. | [![Package Theme](https://github.com/aziontech/webkit/actions/workflows/package-theme.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/package-theme.yml?query=branch%3Amain)    | [![npm version](https://img.shields.io/npm/v/@aziontech/theme.svg)](https://www.npmjs.com/package/@aziontech/theme)   |
| [@aziontech/webkit](https://www.npmjs.com/package/@aziontech/webkit) | Reusable UI components and design system utilities.            | [![Package Webkit](https://github.com/aziontech/webkit/actions/workflows/package-webkit.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/package-webkit.yml?query=branch%3Amain) | [![npm version](https://img.shields.io/npm/v/@aziontech/webkit.svg)](https://www.npmjs.com/package/@aziontech/webkit) |

## Apps

| App                                   | Description                                      | CI                                                                                                                                                                                                                         |
| ------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [storybook](./apps/storybook)         | Storybook documentation for `@aziontech/webkit`. | -                                                                                                                                                                                                                          |
| [icons-gallery](./apps/icons-gallery) | Interactive gallery for Azion and Prime icons.   | [![App Icons Gallery](https://github.com/aziontech/webkit/actions/workflows/app-icons-gallery.yml/badge.svg?branch=main)](https://github.com/aziontech/webkit/actions/workflows/app-icons-gallery.yml?query=branch%3Amain) |

## Getting started

### Prerequisites

- Node.js `>= 22.18.0`
- pnpm `10.x`

### Install dependencies

From the repository root:

```bash
pnpm install
```

### Most used commands

```bash
# Start Storybook (builds icons first)
pnpm storybook:dev

# Build Storybook static output
pnpm storybook:build

# Preview Storybook build
pnpm storybook:preview

# Build icon package artifacts
pnpm icons:build

# Generate declaration files for @aziontech/webkit
pnpm webkit:build:dts
```

## Development flow

1. Create or update code in the proper package under `packages/*`.
2. Add or adjust stories under `apps/storybook/src/stories`.
3. Validate changes locally with `pnpm storybook:dev`.
4. Commit using conventional commits.
5. Push your branch and open a pull request.

## Storybook

- Local docs app: `apps/storybook`
- The project includes a `Foundations/Get Started` documentation page with onboarding details.
- Use Storybook as the source of truth for component API and expected visual behavior.

## Related docs

- Root Storybook app guide: `apps/storybook/README.md`
- Theme package guide: `packages/theme/README.md`
- Icons package guide: `packages/icons/README.md`
- Webkit package guide: `packages/webkit/README.md`

## License

MIT © Azion Technologies
