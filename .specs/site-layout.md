---
name: site-layout
category: layout
structure: monolithic
status: implemented
spec_version: 6
template: 2
checksum: fc90d113fc0640472ee8fd7a9d29e9d8deb9eae9bfda74a91d4c925a652f5c04
created: 2026-11-12
last_updated: 2026-11-19
---

# SiteLayout — Component Spec

## Purpose

The marketing site's chrome, composed once in the app: `SiteHeaderSection` on top, the page's sections in the layout's `<main>`, `SiteFooterSection` at the foot, and the `Command` search palette wired to the bar's search button and to ⌘K / Ctrl K. The navigation and the footer are data (the `SiteHeaderSection` and `SiteFooterSection` props), the canvas is painted with the theme tokens so a dark site never shows an unpainted page below the fold, and the palette lists every destination of the navigation by default. Site pages are only their sections, rendered through the default slot; they never repeat the bar or the footer.

## When to use

- Use SiteLayout once in the marketing app for the site chrome.
- Every public marketing page (home, product, solution, company, legal): put one `SiteLayout` in the app's root (around `RouterView`) and render each page's sections as its default slot.
- A site that needs the Azion navigation, footer and search palette without hand-composing `AppHeader`, `NavigationMenu`, `Footer`, `SearchTrigger` and `Command`.

## When NOT to use

- The signed-in console → `ConsoleLayout`. Documentation → `DocLayout`.
- A one-off landing page with no site navigation (a campaign form) → render the sections on their own.

## Related

- `SiteHeaderSection` — the bar and its mega-menus; `navigation` is bound onto it.
- `SiteFooterSection` — the footer; `footer` is bound onto it. In `variant="site"` it spans the full width like the bar, with no side rules, and opens on a plain full-width rule, the same clean line as the bar's, with no corner marks.
- `Container`, `Spacer` — the frame the page's sections stack in, inside the slot.
- `Command` — the search palette the bar's search button opens.
- `shell/shell-site` — the block that shows this layout with the azion.com navigation and footer.

## Best practices

- Compose the layout once, in the app's root; each route renders only its sections. Never add `SiteHeaderSection`, `SiteFooterSection`, `AppHeader` or `Footer` to a page.
- The site is dark: set `data-theme="dark"` on `<html>` (in `index.html`), so the layout, the teleported menus and the palette all resolve the dark tokens.
- Bind the real navigation and footer data once (`navigation`, `footer`); give every navigation item an `href` so it also appears in the search palette.
- Add extra palette groups (articles, docs results) in the `search` slot; listen to `search-select` for them.
- The page renders no `<main>` of its own: the layout owns the landmark.

## Usage

```vue
<script setup lang="ts">
  import SiteLayout from '@aziontech/webkit/site-layout'

  import { footer, navigation } from './site-chrome'
</script>

<template>
  <SiteLayout
    :navigation="navigation"
    :footer="footer"
  >
    <RouterView />
  </SiteLayout>
</template>
```

## Props

| Prop                | Type                   | Default     | Required | JSDoc                                                                                                                                                                 |
| ------------------- | ---------------------- | ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `navigation`        | `SiteLayoutNavigation` | `—`         | true     | The bar, bound onto `SiteHeaderSection`: `{ menus, home?, links?, contact?, primaryAction?, secondaryAction?, secondaryActionOnPhones? }`.                            |
| `footer`            | `SiteLayoutFooter`     | `undefined` | false    | The footer, bound onto `SiteFooterSection`: `{ variant?, home?, columns?, socials?, statusLabel?, languages? }`; `variant` defaults to `site`. No footer when absent. |
| `searchPlaceholder` | `string`               | `''`        | false    | Placeholder of the palette's input. Empty uses the locale catalog (`Search the site`).                                                                                |
| `navOverlay`        | `boolean`              | `false`     | false    | Floats the bar over the page's first band instead of stacking it above; the bar stays sticky over the whole page.                                                     |

## v-model

| Model                 | Type      | Default | Emits               | Notes                                                                               |
| --------------------- | --------- | ------- | ------------------- | ----------------------------------------------------------------------------------- |
| `v-model:search-open` | `boolean` | `false` | `update:searchOpen` | Whether the search palette is open; the bar's search button and ⌘K / Ctrl K set it. |

## Events

| Event           | Payload                                                         | Notes                                                                                                                                                                  |
| --------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `navigate`      | `(event: MouseEvent \| KeyboardEvent, page: SiteLayoutPage)`    | Fired when a navigation destination is chosen in the palette (`{ label, href }`); the layout then follows it (with the app's router for an in-site path). Event first. |
| `search-select` | `(event: MouseEvent \| KeyboardEvent, value: string \| number)` | Fired when a palette item from the `search` slot is chosen. Event first.                                                                                               |

## Slots

| Slot      | Scope               | Notes                                                             |
| --------- | ------------------- | ----------------------------------------------------------------- |
| `default` | —                   | The page's sections, rendered inside the layout's `<main>`.       |
| `search`  | `{ query: string }` | Extra `Command.Group`s listed before the navigation destinations. |

## States

- Visual states: `default`; the palette `open` / `closed`; the bar's sheet and mega-menus own their states (`SiteHeaderSection`).
- `navOverlay` (mirrored on `data-nav-overlay`): the root becomes a one-column grid where the bar and the main landmark share the first row, so the first band runs under the bar (a home page whose hero art fills the top); the bar stays sticky to the end of the page and the footer takes the second row.
- Unsafe `href` on a navigation row, crumb, section or palette page (`javascript:`, `data:`, any non-web scheme, `//host`): the row renders with no link and choosing it, by pointer or keyboard, follows nothing; `navigate` still fires, so the handler decides.
- Not applicable: `loading`, `empty`, `error`, `disabled`, `readonly`, `invalid` (the sections own their states).

## Motion & Animations

| Trigger            | Animation / Transition         | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback     |
| ------------------ | ------------------------------ | ------------------------------------------------- | --------------------------- |
| palette, mega-menu | `Command`, `SiteHeaderSection` | component                                         | handled by those components |

## Tokens

| Region | Token (DESIGN.md)                         |
| ------ | ----------------------------------------- |
| canvas | `var(--bg-canvas)`, `var(--text-default)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Landmarks: the bar is the `SiteHeaderSection` banner named "Azion"; the sections are inside the layout's single `<main>`; the footer is the `SiteFooterSection` `contentinfo`. A page must not render a second `<main>`.
- Skip link: the first `Tab` stop is a `SkipLink` (`Skip to content`, visible on focus); it moves focus to the `<main>` (given a generated `id`), past the bar.
- Keyboard map: `Tab` runs skip link → bar → page → footer; `⌘K` / `Ctrl K` opens the palette (owned by `Command`); in the palette `ArrowUp` / `ArrowDown` move, `Enter` chooses, `Escape` closes and returns focus. The bar's menus and sheet own their keyboard models.
- Visible focus and contrast: owned by the composed components; the canvas tokens keep text ≥ 4.5:1 in light and dark.

## Internationalization

| Key                            | English source                 | Override prop       |
| ------------------------------ | ------------------------------ | ------------------- |
| `siteLayout.searchPlaceholder` | `Search the site`              | `searchPlaceholder` |
| `siteLayout.noMatch`           | `No page matches your search.` | —                   |
| `siteLayout.pages`             | `Pages`                        | —                   |

- Formatting: none. Navigation and footer text is consumer data.

## Right-to-left

- Layout: logical utilities only; `SiteHeaderSection` and `SiteFooterSection` mirror their own rows.
- Icons: none of its own.
- Keyboard: arrow handling is `Command`'s and `SiteHeaderSection`'s, both direction-aware.
- User data: destination labels render inside `Command.Item` with `dir="auto"`.

## Responsive

- Container queries: none of its own; `SiteHeaderSection` switches to its sheet below `xl` and `SiteFooterSection` reflows its rows.
- Narrow: the main column is full width; the sections own their measure (`Container`).
- Touch: owned by the composed components.
- Reflow: no horizontal scroll at 320 px; the page scrolls the document (no inner scroll area), so a full-page capture shows the whole page.

## Performance

- Bundle budget: 71.1 KB gzip for `./site-layout` in `.size-limit.json` (71.08 KB measured; it pulls `SiteHeaderSection`, `SiteFooterSection` and `Command`; raised from 71 KB for the `navOverlay` grid placement).
- Runtime budget: the palette destinations are a computed list over the menus.
- Heavy parts: none beyond the composed components; the palette content renders only while open.

## Examples

- Default — the layout with the azion.com navigation and footer and a framed page of sections.
- Nav overlay — justification: `navOverlay` changes the layout (the bar floats over the first band), which no other example shows.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: draft`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
