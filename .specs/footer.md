---
name: footer
category: layout
structure: composition
status: approved
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=5467-1638
  node_id: 5467:1638
checksum: e718d75c87096dcbbe52d0f7b1cfc25df1c38a4363822d80902540bd8143c53f
created: 2026-08-10
last_updated: 2026-08-11
---
# Footer — Component Spec

## Purpose

Page footer for marketing and product surfaces: the bottom-of-page counterpart to `GlobalHeader`. A canvas-colored shell with a centered content measure holding link columns and a social bar separated by a hairline top border. Matches the Webkit Footer component set (Figma node 5467:1638, `Type=Default` / `Type=Mobile`): the two presentations are one component switching by CSS at the `md` (768px) breakpoint. Content (links, labels, languages, status) always comes from the consumer; the component owns anatomy, tokens, and responsiveness.

## When to use

- The page-level footer of a site or application, paired with `GlobalHeader`.
- Grouped navigation links at the bottom of the page plus a brand/social/status bar.

## When NOT to use

- The bottom area of a panel, table, sidebar, or overlay → use that component's own footer part (`panel-footer`, `table-footer`, `sidebar-footer`, `popover-footer`).
- A single standalone link inside body content → use `link` instead of `Footer.Link`.

## Related

- `global-header` — the top-of-page chrome counterpart; same shell philosophy (regions composed by the consumer).
- `brand`, `icon-button`, `status-indicator`, `select` — the components consumers compose inside the social bar; the footer reimplements none of them.

## Best practices

- Compose the social bar from existing DS components (`Brand`, `IconButton kind="transparent"`, `StatusIndicator`, `Select`); never rebuild them inside the slots.
- Keep column titles short (one or two words) — they are group labels, not headings for prose.
- Give every social `IconButton` an `ariaLabel`; the footer cannot name them for you.
- Provide four columns for the canonical desktop presentation; the grid folds to two columns below `md` on its own.

## Usage

```vue
<script setup>
import Footer from '@aziontech/webkit/footer'
</script>

<template>
  <Footer aria-label="Footer">
    <Footer.Column title="Products">
      <Footer.Link href="/products/edge-application">Edge Application</Footer.Link>
      <Footer.Link href="/products/edge-firewall">Edge Firewall</Footer.Link>
    </Footer.Column>
    <Footer.Column title="Company">
      <Footer.Link href="/about">About us</Footer.Link>
      <Footer.Link href="/careers">Careers</Footer.Link>
    </Footer.Column>
    <template #social-start>
      <a href="/" aria-label="Azion home">Azion</a>
    </template>
    <template #social-end>
      <a href="https://status.azion.com/">All Systems Operational</a>
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

- `footer-column/footer-column.vue` — one navigation column: a muted title labelling a stacked group of `Footer.Link` items. Renders a `nav` labelled by its title so each group is a navigable landmark. Props: `title: string` (required) — column group label, rendered above the links and used as the accessible name of the column landmark. Slot: `default` — its `Footer.Link` items.
- `footer-link/footer-link.vue` — one text link inside a column; the root is the anchor itself, so consumer attributes (`target`, `rel`) land on the `a`. Props: `href: string` (required) — destination URL of the link. Slot: `default` — the link label.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `ariaLabel` | `string` | `'Footer'` | false | Accessible name for the contentinfo landmark. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Root: the `Footer.Column` items; laid out as a 2-column grid that becomes 4 columns at `md`. |
| `default` | — | `footer-column`: its `Footer.Link` items. |
| `default` | — | `footer-link`: the link label. |

> The root also exposes the `social-start` named slot (leading cluster of the social bar: brand + social icon buttons) and the `social-end` named slot (trailing cluster: status indicator + language select; rendered above `social-start` below `md`, per the Mobile variant). They are kept out of the table above because the compliance parser cannot read hyphenated (quoted) slot keys from `defineSlots`. The social bar renders only when `social-start` or `social-end` is provided.

## States

- Visual states: `default` on the shell and columns; `default`, `hover`, `focus-visible`, `active`, `visited` on `footer-link`.
- No `data-state`; the shell has no interactive states — slotted children own their own.

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| link hover/focus color change | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| shell surface | `var(--bg-canvas)` |
| content max-width | `max-w-(--container-5xl)` |
| columns grid gap / padding | `var(--spacing-lg)` |
| column internal gap (title → links) | `var(--spacing-md)` |
| link stack gap | `var(--spacing-xs)` |
| social bar border (top) | `var(--border-width-default)` / `var(--border-muted)` |
| social bar padding-y | `var(--spacing-md)` |
| social bar padding-x / cluster gap | `var(--spacing-lg)` / `var(--spacing-md)` |
| column title typography / color | `.text-label-sm` / `var(--text-muted)` |
| link typography / color | `.text-label-sm` / `var(--text-default)` |
| link hover color | `var(--text-muted)` |
| ring (link focus) | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `--container-max-width` (1280px content measure) | `max-w-(--container-5xl)` (1192px, nearest container primitive) | `TODO: tokenizar` |

## Accessibility (WCAG 2.1 AA)

- Root renders as `<footer>` — the implicit `contentinfo` landmark — with `aria-label` from `ariaLabel`.
- Each `footer-column` renders a `<nav>` labelled via `aria-labelledby` pointing at its title (`useId`), so link groups are unique, navigable landmarks.
- Keyboard map: none on the shell; `Tab` moves through links in DOM order; `Enter` activates.
- Visible focus on links: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- Contrast ≥4.5:1 for column titles and links on `--bg-canvas`.
- `motion-reduce:transition-none` on the link color transition.
- Touch target: text links follow the platform convention for footer link lists (<40px height); justified deviation — targets are full-width-of-text with `--spacing-xs` separation.

## Stories (Storybook)

- Default

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
