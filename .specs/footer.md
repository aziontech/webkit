---
name: footer
category: layout
structure: composition
status: implemented
spec_version: 8
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=5467-1638
  node_id: 5467:1638
checksum: 40ac352d2b215061ae489ab53e60ab5c32ed9a20c3328f83868a4c04d1588d55
created: 2026-08-10
last_updated: 2026-11-21
---

# Footer — Component Spec

## Purpose

Page footer for marketing, docs and console surfaces: the bottom-of-page counterpart to `AppHeader`. A canvas-colored shell of two bands divided by a hairline rule. Matches the Webkit Footer component set (Figma node 5467:1638, `Type=Default` / `Type=Mobile`).

**Two bands.** Top to bottom: the link columns, then the bottom bar. The bottom bar is one row, as azion.com draws it: the brand at the start, the social icons after it, and the status indicator with the language select at the end. There is no separate brand band: the brand sits at the start of the bar at every width, at the 18px height `AppHeaderBrand` gives the header's mark.

**Three placements, chosen with `variant`.**

- `content` is the default: the bands run full bleed across whatever zone holds the footer and the footer draws no rule above itself. Every band carries `--spacing-lg` inside it — the value `--layout-boundary-inline` resolves to — so the first column title opens on the page boundary by construction.
- `site` closes a marketing page and mirrors the site header: it spans the full width of the page with no side rules, opens on a plain full-width top rule with no corner marks, the same clean line as the header's, and insets its content to the header's own measure (`--layout-measure-site-header`), so the first column title and the brand line up under the header's brand at every width. The inset is one custom property (`--footer-inset`, `max(0%, (100% - measure) / 2)`) set on the root and added to each band's own padding, so the band rules stay full width.
- `console` is the slim bar under a console page: one row with a top rule, the brand (and any social buttons) at the start, the links of each `Footer.Column` inline after it — the column title becomes the visually hidden name of its `nav` — and the status and language at the end. It wraps onto a second row when the zone is narrow.

**Responsive.** The column grid folds from four columns to the 2×2 mobile grid below `md` (768px). The bottom bar stacks below `md`: the brand and the social icons on the first line, the status and the language at the two ends of the second. From `md` it is one row, its two clusters at the two ends, and it wraps instead of clipping when the zone is narrower than both together. All of it is CSS, so the server HTML and the hydrated page are the same tree.

Content (links, labels, languages, status, brand) always comes from the consumer; the component owns anatomy, tokens, and responsiveness.

## When to use

- Use Footer to compose a footer in product, docs or the console.
- Rendering page JSON, or you need a whole band with no custom content → the section (`site-footer-section`). Building an SFC by hand, needing slots, or nesting inside another band → the primitive (`footer`).
- The page-level footer of a site or application, paired with `AppHeader`.
- Grouped navigation links at the bottom of the page plus a brand/social/status bar.

## When NOT to use

- The bottom area of a panel, table, sidebar, or overlay → use that component's own footer part (`panel-footer`, `table-footer`, `sidebar-footer`, `popover-footer`).
- A single standalone link inside body content → use `link` instead of `Footer.Link`.

## Related

- `app-header` — the top-of-page chrome counterpart; the `site` placement spans the page the way the site header does, and the brand takes the header brand's height.
- `brand`, `icon-button`, `status-indicator`, `select` — the components consumers compose inside the bands; the footer reimplements none of them.
- `site-footer-section` — the marketing site's data-driven footer section, the one `SiteLayout` renders. Use `site-footer-section` for a site page fed from section JSON and `Footer` when composing the bands by hand.
- `registration-frame` — draws the plain top rule in the `site` and `console` placements (no corner marks).

## Best practices

- Compose every band from existing DS components (`Brand`, `IconButton variant="ghost" size="small"`, `StatusIndicator`, `Select`); never rebuild them inside the slots.
- Put `Brand size="small"` in the `brand` slot and make it the home link with `homeHref` (`home-href="/"`) instead of wrapping it in a hand-made anchor: the footer owns the link's focus ring and hover. The footer sizes the mark to the header's 18px.
- Keep column titles short (one or two words) — they are group labels, not headings for prose.
- Give every social `IconButton` an `aria-label`; the footer cannot name them for you.
- Keep the social `IconButton`s at `size="small"`: a 28px box keeps the brand and seven icons beside the status pair on one row from `md`.
- Provide four columns for the canonical desktop presentation; the grid folds to two columns below `md` on its own.
- In `console`, give each column only a few short links (Docs, Status, Legal); the column title is still required, because it names the `nav` for assistive tech.
- Pick the placement from the page: `site` under a marketing page whose header is `SiteHeaderSection`, `console` under a console page, `content` — the default — anywhere else.

## Usage

```vue
<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Footer from '@aziontech/webkit/footer'
  import IconButton from '@aziontech/webkit/icon-button'
  import Select from '@aziontech/webkit/select'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { ref } from 'vue'

  const language = ref('en')
</script>

<template>
  <!-- `variant="site"` spans a marketing page like its header; `console` is the slim
       console bar; omit it for the default `content` placement. -->
  <Footer
    variant="site"
    aria-label="Footer"
    home-href="/"
  >
    <Footer.Column title="Products">
      <Footer.Link href="/products/edge-application">Edge Application</Footer.Link>
      <Footer.Link href="/products/edge-firewall">Edge Firewall</Footer.Link>
    </Footer.Column>
    <Footer.Column title="Company">
      <Footer.Link href="/about">About us</Footer.Link>
      <Footer.Link href="/careers">Careers</Footer.Link>
    </Footer.Column>
    <template #brand>
      <Brand size="small" />
    </template>
    <template #social>
      <IconButton
        variant="ghost"
        size="small"
        icon="az az-github"
        aria-label="Azion on GitHub"
        href="https://github.com/aziontech"
      />
    </template>
    <template #status>
      <StatusIndicator
        severity="success"
        label="All systems operational"
      />
    </template>
    <template #language>
      <Select
        v-model="language"
        placeholder="Language"
      >
        <Select.Trigger aria-label="Language" />
      </Select>
    </template>
  </Footer>
</template>
```

Tree-shaking alternative — the standalone root and each sub-component from its own entry (no `Object.assign` compound pulled in):

```vue
<script setup>
  import Footer from '@aziontech/webkit/footer-root'
  import FooterColumn from '@aziontech/webkit/footer-column'
  import FooterLink from '@aziontech/webkit/footer-link'
</script>
```

## Sub-components

- `footer-column/footer-column.vue` — one navigation column: a muted title labelling a stacked group of `Footer.Link` items. Renders a `nav` labelled by its title so each group is a navigable landmark. In the `console` placement the title is visually hidden (still the `nav`'s name) and the links run in a row. Props: `title: string` (required) — column group label, rendered above the links and used as the accessible name of the column landmark. Slot: `default` — its `Footer.Link` items.
- `footer-link/footer-link.vue` — one text link inside a column; the root is the anchor itself, so consumer attributes (`target`, `rel`) land on the `a`. Props: `href: string` (required) — destination URL of the link. Slot: `default` — the link label.

## Props

| Prop            | Type                               | Default     | Required | JSDoc                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------- | ---------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ariaLabel`     | `string`                           | `''`        | false    | Accessible name for the contentinfo landmark. Empty uses the locale catalog (`Footer`).                                                                                                                                                                                                                                                                                                                 |
| `variant`       | `'content' \| 'site' \| 'console'` | `'content'` | false    | Where the footer sits: `content` (the default) runs the bands full bleed across the zone that holds it; `site` spans the page like the site header, opening on a plain full-width rule, like the header's, and insetting its content to the header measure; `console` is one slim bar under a console page, the brand and the links of each column on one line with the status and language at its end. |
| `homeHref`      | `string`                           | `''`        | false    | When set, the brand slot renders inside one home link to this URL, with the focus ring and the hover of a link.                                                                                                                                                                                                                                                                                         |
| `homeAriaLabel` | `string`                           | `''`        | false    | Accessible name of the home link. Empty uses the locale catalog (`Azion home`).                                                                                                                                                                                                                                                                                                                         |

## Events

| _none_ | — | — |

## Slots

| Slot       | Scope | Notes                                                                                                                  |
| ---------- | ----- | ---------------------------------------------------------------------------------------------------------------------- |
| `default`  | —     | Root: the `Footer.Column` items; a 2-column grid that becomes 4 columns at `md`, or one inline row in `console`.       |
| `brand`    | —     | Root: the brand lockup that opens the bottom bar, its mark sized to 18px; inside the home link when `homeHref` is set. |
| `social`   | —     | Root: the social icon buttons, after the brand at the start of the bottom bar.                                         |
| `status`   | —     | Root: the system status indicator, at the end of the bottom bar.                                                       |
| `language` | —     | Root: the language select, after the status.                                                                           |
| `default`  | —     | `footer-column`: its `Footer.Link` items.                                                                              |
| `default`  | —     | `footer-link`: the link label.                                                                                         |

> Each band renders only when its slots are filled: the columns on `default`, the bottom bar on any of `brand`, `social`, `status` or `language` (its start cluster on `brand` or `social`, its end cluster on `status` or `language`). Slots are read at render time, so a slot behind a `v-if` that turns off takes its band with it.

## States

- Visual states: `default` on the shell and columns; `default`, `hover`, `focus-visible`, `active`, `visited` on `footer-link`.
- Placement: `data-variant="content" | "site" | "console"` on the root (from `variant`); the bands and `footer-column` read it through the named group (`group-data-[variant=…]/footer:`).
- No `data-state`; the shell has no interactive states — slotted children own their own.
- Home link (`homeHref` set to a safe URL): the brand cell holds an anchor (`${testId}__home`) with an opacity hover and the `--ring-color` focus ring offset against `--bg-canvas`; empty or unsafe renders the brand alone.

## Motion & Animations

| Trigger                       | Animation / Transition                                                               | Token (see `contributing/docs/TOKENS.md` § Animations) | Reduced-motion fallback         |
| ----------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------ | ------------------------------- |
| link hover/focus color change | `transition-colors duration-150 ease-out`                                            | inline (matches catalog)                               | `motion-reduce:transition-none` |
| home link hover               | `transition-opacity duration-fast-02 ease-productive-entrance` to `hover:opacity-80` | `duration['fast-02']` · `curve['productive-entrance']` | `motion-reduce:transition-none` |

## Tokens

| Region                               | Token (TOKENS.md)                                                                        |
| ------------------------------------ | ---------------------------------------------------------------------------------------- |
| shell surface                        | `var(--bg-canvas)`                                                                       |
| content inset (`variant="site"`)     | `--footer-inset`: `max(0%, (100% - var(--layout-measure-site-header)) / 2)`              |
| band inset                           | `var(--spacing-lg)`, carried inside each band — equal to `var(--layout-boundary-inline)` |
| top rule (`site`, `console`)         | `RegistrationFrame borders="top" marks="none"`                                           |
| columns row gap (mobile 2-row wrap)  | `var(--spacing-lg)`                                                                      |
| column padding                       | `var(--spacing-lg)` (none in `console`)                                                  |
| column divider (border-right, `md`+) | `var(--border-width-default)` / `var(--border-default)` (none in `console`)              |
| column internal gap (title → links)  | `var(--spacing-md)`                                                                      |
| link stack gap                       | `var(--spacing-xs)`; `var(--spacing-md)` between inline links in `console`               |
| bar border (top)                     | `var(--border-width-default)` / `var(--border-default)`                                  |
| bar height floor (`md`+)             | `min-h-14` (56px)                                                                        |
| bar padding-y                        | `var(--spacing-md)` stacked / `var(--spacing-sm)` from `md` and in `console`             |
| brand mark height                    | 18px, the `AppHeaderBrand` height                                                        |
| brand ↔ social gap                   | `var(--spacing-xs)` + `var(--spacing-2xs)`                                               |
| social icon gap                      | `var(--spacing-2xs)`                                                                     |
| status ↔ language gap                | `var(--spacing-lg)`                                                                      |
| console row gaps                     | `var(--spacing-lg)` inline / `var(--spacing-sm)` between wrapped rows                    |
| column title typography / color      | `.text-label-sm` / `var(--text-muted)`                                                   |
| link typography / color              | `.text-label-sm` / `var(--text-default)`                                                 |
| link hover color                     | `var(--text-muted)`                                                                      |
| ring (link focus)                    | `var(--ring-color)`                                                                      |
| home link corner / ring offset       | `var(--shape-control)` / `var(--bg-canvas)`                                              |

## Theme gaps

| Figma variable                                 | Temporary primitive                                                          | Follow-up                                                                 |
| ---------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Brand lockup at 18px                           | `[&_svg]:h-[18px]` on the brand cell, the same literal `AppHeaderBrand` uses | `TODO`: one brand-height token shared by `AppHeaderBrand` and the footer  |
| social icon pitch 6px (Default) / 4px (Mobile) | `var(--spacing-2xs)` (4px)                                                   | `TODO`: 2px under Figma at desktop; no semantic step sits between 4 and 8 |

## Internationalization

- Every string is the consumer's (links, titles, status, languages, brand label); the built-in strings come from the locale catalog: the landmark name `Footer` (`footer.label`, overridden by `ariaLabel`) and the home link name `Azion home` (`footer.home`, overridden by `homeAriaLabel`).
- Long translations wrap: the bar is `flex-wrap`, the columns grow, nothing truncates.

## Right-to-left

- Logical properties only (`me-*`, `ms-auto`, `border-e`, `start`/`end` marks), so under `dir="rtl"` the brand stays at the start edge (the right) and the status and language move to the left.

## Responsive

- Below `md`: two-column link grid; the bar stacks the brand and icons over the status and language. From `md`: four columns and a one-row bar that wraps rather than clips. `site` re-centres its content on the header measure at every width; `console` wraps its single row.

## Performance

- No script beyond the slot checks and the landmark label; no observers, no measuring, no client-only layout.

## Accessibility (WCAG 2.1 AA)

- Root renders as `<footer>` — the implicit `contentinfo` landmark — with `aria-label` from `ariaLabel`.
- Each `footer-column` renders a `<nav>` labelled via `aria-labelledby` pointing at its title (`useId`), so link groups are unique, navigable landmarks; in `console` the title is visually hidden and still names the `nav`.
- Keyboard map: none on the shell; `Tab` moves through links and controls in DOM order (columns, brand, social, status, language); `Enter` activates.
- Visible focus on links: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- The home link (`homeHref`) is a native anchor named by `homeAriaLabel` (locale fallback `footer.home`), so the logo link always has a name; the brand mark inside it is decoration of that name.
- Contrast ≥4.5:1 for column titles and links on `--bg-canvas`.
- `motion-reduce:transition-none` on the link color transition.
- Touch target: text links are drawn at their text height with `--spacing-xs` between them on a fine pointer; on a coarse pointer each link is 44 px tall (`pointer-coarse:min-h-11`) and the column drops its gap, so the links tile the column without overlapping.

## Examples

- Default — the `content` placement: four link columns, then the bottom bar with the brand, the social icons, the status and the language.
- SitePlacement — the `site` placement: the same bands spanning the page like the site header, opening on a plain full-width rule like the header's.
- Console — the `console` placement: one slim bar with the brand, inline links, the status and the language.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `contributing/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `contributing/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `contributing/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `contributing/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
