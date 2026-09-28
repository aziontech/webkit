---
name: footer
category: layout
structure: composition
status: approved
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=5467-1638
  node_id: 5467:1638
checksum: 797eb1b1567a34b098a92e933f16ed0fe1f3a23a85aeb1c300cfcdbb09af4778
created: 2026-08-10
last_updated: 2026-08-28
---
# Footer — Component Spec

## Purpose

Page footer for marketing and product surfaces: the bottom-of-page counterpart to `GlobalHeader`. A canvas-colored shell divided into bands by hairline rules. Matches the Webkit Footer component set (Figma node 5467:1638, `Type=Default` / `Type=Mobile`).

**Four bands.** Top to bottom: the link columns, a row carrying the social icons and the status/language pair, and the signature band (the brand beside its tagline, in its own `FrameBox` with corner marks).

**Two placements, chosen with `kind` — the same two `GlobalHeader` has, and the bands are identical in both.** `content` is the default: the bands run full bleed across whatever zone holds the footer, and the footer adds no inset of its own because every band already carries `--spacing-lg` inside it — the value `--layout-boundary-inline` resolves to — so the first column title opens on the page boundary by construction. `site` closes a framed marketing page: the bands take the site column (`layout-column-site`: capped at `--layout-measure-site`, inset by `--layout-boundary-inline` once the window is narrower than that), side rules run down both edges, two hatched `FrameBox` gutters flank them from `2xl`, and a hatched band closes the frame below. Those three hold no content and stay out of the a11y tree. The hero band, the framed sections and this footer resolve to that one measure, which is the only reason the border-x running down the page is continuous; the top bar is deliberately one rung wider (`--layout-measure-site-header`).

The frame apparatus belongs to `site` alone, and not as a matter of taste: on a full-bleed footer the side rules land on the zone's own edges, where a hairline reads as a seam against the bezel rather than as a frame, and the `flex-1` gutters — with no slack to grow into — collapse to zero width while still painting their borders and corner marks onto the bands' own edges.

**The two Figma variants are one component switching by CSS**, and the switch is not one breakpoint:

- The **column grid** folds from four columns to the 2×2 mobile grid below `md` (768px).
- The **bands recombine at `md`**: stacked, their order is links → status/language → signature → social icons (the Mobile variant's order); from `md` the social icons and the status pair share one row above the signature. All four bands are cells of **one** grid, so each is a single element in a single place in the DOM at every width — the order is `order-*` when stacked and explicit row/column placement from `md`. A wrapper row that existed only on desktop would mean two copies of the markup, so two copies of the consumer's slot content.
- The **gutters appear at `2xl`** (1536px) in the `site` placement, not with the rest of the desktop presentation, because that is the first breakpoint past the measure itself (1388px). Gated any earlier they resolve to zero width and still paint their borders and corner marks on the measure's own edges — the gate moves with the measure, and was `xl` while the measure was 1192px.
- Between the measure and that breakpoint the row therefore holds **one** child, so it carries `justify-center`: a capped item in an unjustified flex row is left-aligned, which would put the footer's frame up to 148px left of the centred frame it closes. With it the footer's column lands on the page column's own vertical wherever the cap is active — measured equal at 1440, 1536, 1920 and 2560.
- Within the status pair, **`language` and `status` swap order** between the two variants (the phone leads with the select, the row ends with it), which is why they are two slots the row reverses rather than one cluster the consumer orders.

Content (links, labels, languages, status, brand, tagline) always comes from the consumer; the component owns anatomy, tokens, and responsiveness.

## When to use

- The page-level footer of a site or application, paired with `GlobalHeader`.
- Grouped navigation links at the bottom of the page plus a brand/social/status bar.

## When NOT to use

- The bottom area of a panel, table, sidebar, or overlay → use that component's own footer part (`panel-footer`, `table-footer`, `sidebar-footer`, `popover-footer`).
- A single standalone link inside body content → use `link` instead of `Footer.Link`.

## Related

- `global-header` — the top-of-page chrome counterpart; same shell philosophy (regions composed by the consumer).
- `brand`, `icon-button`, `status-indicator`, `select` — the components consumers compose inside the bands; the footer reimplements none of them.
- `frame-box` — the footer's own frame: the hatched gutters, the closing band and the signature box are `FrameBox` instances (`borders` / `marks` / `hatch`).

## Best practices

- Compose every band from existing DS components (`Brand`, `IconButton kind="transparent"`, `StatusIndicator`, `Select`); never rebuild them inside the slots.
- Keep column titles short (one or two words) — they are group labels, not headings for prose.
- Give every social `IconButton` an `ariaLabel`; the footer cannot name them for you.
- Provide four columns for the canonical desktop presentation; the grid folds to two columns below `md` on its own.
- Keep each band close to the canonical content (up to ~7 social icons; one status indicator; one language select; one brand lockup; a one-line tagline). Every band grows past its `min-h-14` floor rather than clipping, so a longer status string or an extra icon wraps safely — but a much heavier cluster belongs in the columns, not in a band.
- Give the `tagline` slot plain text, not a heading element: the footer already wraps it in the `.text-heading-xl` measure, and a real `h*` in a `contentinfo` landmark competes with the page's own outline.
- Pick the placement from the page, not from the look: `site` on a page that is a framed marketing column (its hero, sections and this footer share one measure), `content` — the default — anywhere the footer closes an app or docs zone. A `site` footer under an unframed page draws a frame nothing above it continues.
- Leave the gutters and the closing band alone — they are the `site` frame's own page material, and the placement decides them. A page that needs more air below the footer adds a `SectionGap`, and one that needs none is not this design.

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
  <!-- `kind="site"` closes a framed marketing page; omit it for the default `content`
       placement, which runs the bands full bleed across the zone that holds them. -->
  <Footer
    kind="site"
    aria-label="Footer"
  >
    <Footer.Column title="Products">
      <Footer.Link href="/products/edge-application">Edge Application</Footer.Link>
      <Footer.Link href="/products/edge-firewall">Edge Firewall</Footer.Link>
    </Footer.Column>
    <Footer.Column title="Company">
      <Footer.Link href="/about">About us</Footer.Link>
      <Footer.Link href="/careers">Careers</Footer.Link>
    </Footer.Column>
    <template #social>
      <IconButton kind="transparent" icon="pi pi-github" ariaLabel="Azion on GitHub" href="https://github.com/aziontech" />
    </template>
    <template #status>
      <StatusIndicator severity="success" label="All Systems Operational" />
    </template>
    <template #language>
      <Select v-model="language" placeholder="Language">
        <Select.Trigger ariaLabel="Language" />
      </Select>
    </template>
    <template #brand>
      <a href="/" aria-label="Azion home"><Brand size="large" /></a>
    </template>
    <template #tagline>The web platform for modern workloads</template>
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

- `footer-column/footer-column.vue` — one navigation column: a muted title labelling a stacked group of `Footer.Link` items. Renders a `nav` labelled by its title so each group is a navigable landmark. Props: `title: string` (required) — column group label, rendered above the links and used as the accessible name of the column landmark. Slot: `default` — its `Footer.Link` items.
- `footer-link/footer-link.vue` — one text link inside a column; the root is the anchor itself, so consumer attributes (`target`, `rel`) land on the `a`. Props: `href: string` (required) — destination URL of the link. Slot: `default` — the link label.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `ariaLabel` | `string` | `'Footer'` | false | Accessible name for the contentinfo landmark. |
| `kind` | `'content' \| 'site'` | `'content'` | false | Where the footer sits: `content` is the default — the bands run full bleed across whatever zone holds the footer, opening on the page boundary; `site` closes a framed marketing page instead, capping the bands at the site measure and drawing the frame that page carries: the side rules, the hatched gutters and the closing band. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Root: the `Footer.Column` items; laid out as a 2-column grid that becomes 4 columns at `md`. |
| `social` | — | Root: the social icon buttons. Renders its own band; centered stacked, at the row's start from `md`. |
| `status` | — | Root: the system status indicator. Shares the status band with `language`. |
| `language` | — | Root: the language select. Rendered *before* `status` when stacked and *after* it from `md`, per the two Figma variants. |
| `brand` | — | Root: the brand lockup of the signature band. |
| `tagline` | — | Root: the one-line tagline; the footer wraps it in the `.text-heading-xl` measure. |
| `default` | — | `footer-column`: its `Footer.Link` items. |
| `default` | — | `footer-link`: the link label. |

> Every named slot is a single word, so the compliance parser reads all of them from `defineSlots` — the previous `social-start` / `social-end` pair needed a prose note here because hyphenated (quoted) keys are invisible to it. Each band renders only when at least one of its slots is filled: the status band on `status` or `language`, the signature band on `brand` or `tagline`, the social band on `social`.

## States

- Visual states: `default` on the shell and columns; `default`, `hover`, `focus-visible`, `active`, `visited` on `footer-link`.
- Placement: `data-kind="content" | "site"` on the root (from `kind`); the bands read it through `group-data-[kind=site]:` for the cap and the side rules, and the gutters and closing band render only in `site`.
- No `data-state`; the shell has no interactive states — slotted children own their own.

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| link hover/focus color change | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| shell surface | `var(--bg-canvas)` |
| content column (`kind="site"`) | `layout-column-site` — caps at `--layout-measure-site`, insets by `--layout-boundary-inline` below it |
| content max-width (`kind="content"`) | _none_ — full bleed across the zone |
| band inset (`kind="content"`) | `var(--spacing-lg)`, carried inside each band — equal to `var(--layout-boundary-inline)` |
| columns row gap (mobile 2-row wrap) | `var(--spacing-lg)` |
| column padding | `var(--spacing-lg)` |
| column divider (border-right, `md`+) | `var(--border-width-default)` / `var(--border-default)` |
| column internal gap (title → links) | `var(--spacing-md)` |
| link stack gap | `var(--spacing-xs)` |
| measure side rules | `var(--border-width-default)` / `var(--border-default)` |
| band border (top, every band) | `var(--border-width-default)` / `var(--border-default)` |
| band height floor (`md`+) | `min-h-14` (56px) |
| band padding-y (stacked) | `var(--spacing-md)` |
| band padding-x | `var(--spacing-lg)` |
| social icon gap | `var(--spacing-xxs)` |
| status ↔ language gap | `var(--spacing-lg)` |
| signature box padding | `var(--spacing-sm)` inline / `var(--spacing-xl)` block |
| signature inner padding | `var(--spacing-lg)` |
| signature brand ↔ tagline gap | `var(--spacing-md)` stacked / `var(--spacing-lg)` from `md` |
| tagline typography / color | `.text-heading-xl` / `var(--text-default)` |
| gutter + closing band texture | `FrameBox hatch` (pitch `var(--spacing-lg)`, `var(--border-default)`) |
| closing band height | `calc(var(--spacing-xxl) * 2)` |
| column title typography / color | `.text-label-sm` / `var(--text-muted)` |
| link typography / color | `.text-label-sm` / `var(--text-default)` |
| link hover color | `var(--text-muted)` |
| ring (link focus) | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `--container-max-width` (1280px content measure) | `max-w-(--layout-measure-site)` (1388px) in the `site` placement | Closed. The footer no longer picks a rung to approximate the Figma number: it takes the marketing site's own measure, because the hero, the sections and this footer have to resolve to one width or the frame's side rules do not meet. The measure is the decision; 1280 was one band's reading of it |
| Brand lockup at 44px (Default) / 16px (Mobile) | `Brand size="large"` (32px) at every width — `size` has no 44px step and is a prop, so it cannot be responsive | `TODO`: add a 44px step to `Brand`, or a responsive `size`. The consumer could pass two `Brand`s behind `hidden`/`md:block`, which the spec deliberately does not ask for |
| closing band 200px (Default) / 120px (Mobile) | `calc(var(--spacing-xxl) * 2)` → 64px / 192px, the nearest single expression on the responsive step | `TODO`: no token pair matches both ends (the ratio is not constant); revisit if the design fixes one |
| social icon pitch 6px (Default) / 4px (Mobile) | `var(--spacing-xxs)` (4px) | `TODO`: 2px under Figma at desktop; no semantic step sits between 4 and 8 |
| tagline weight 400 (`--font-weight-normal`) | `.text-heading-xl`, which renders 300 since #876 lightened the heading scale | None — the theme is the authority on weight; the Figma variable predates that change |

## Accessibility (WCAG 2.1 AA)

- Root renders as `<footer>` — the implicit `contentinfo` landmark — with `aria-label` from `ariaLabel`.
- The two hatched gutters and the closing band carry `aria-hidden="true"`: they hold no content, so without it a screen reader announces three empty groups at the end of every page.
- Each `footer-column` renders a `<nav>` labelled via `aria-labelledby` pointing at its title (`useId`), so link groups are unique, navigable landmarks.
- Keyboard map: none on the shell; `Tab` moves through links in DOM order; `Enter` activates.
- Visible focus on links: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- Contrast ≥4.5:1 for column titles and links on `--bg-canvas`.
- `motion-reduce:transition-none` on the link color transition.
- Touch target: text links follow the platform convention for footer link lists (<40px height); justified deviation — targets are full-width-of-text with `--spacing-xs` separation.

## Stories (Storybook)

- Default — the `content` placement: the bands full bleed, opening on the page boundary.
- SitePlacement — the `site` placement: the same bands capped at the site measure, with the side rules, the hatched gutters and the closing band that finish a marketing page's frame.

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
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
