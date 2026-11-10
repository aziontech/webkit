---
name: site-footer
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: bec7eb932c25838565c15b94b8681c9eaa9ef92a2ce3214f53ed350bd8b4b7a7
---
# SiteFooter — Component Spec

## Purpose

The footer under every marketing page: the link columns, then the social row beside the status indicator and the language select. It is a page section — the site places it from a `{ _id: 'site-footer', props }` entry and binds `props` straight onto it — and it composes `footer`, `brand`, `icon-button`, `status-indicator` and `select`. From `lg` the Azion mark leads the social row; below it the mark moves to the footer's signature band, so the icons get the row to themselves. The language select keeps its own value locally; its options are the labels the reader sees.

## When to use

- As the last block of every marketing page.

## When NOT to use

- Inside the product console or the docs → compose `footer` directly.
- For a closing ask above the footer → use `closing-call-to-action`.

## Related

- `footer` — the composition footer this section fills.
- `closing-call-to-action` — the band that sits right above it.

## Best practices

- Use `kind: 'site'` under a framed marketing page, so the footer draws the page frame and closes on its bottom rule; the page above must not draw a bottom rule of its own.
- Keep four link columns so the grid fills at `md`.
- Give every social link a `label` that names the network, since the button shows only the glyph.

## Usage

```vue
<script setup>
import SiteFooter from '@aziontech/webkit/site-footer'
</script>

<template>
  <SiteFooter
    kind="site"
    home="/"
    :columns="[{ title: 'Products', links: [{ label: 'Functions', href: '/products/functions' }] }]"
    :socials="[{ icon: 'pi pi-github', label: 'Azion on GitHub', href: 'https://github.com/aziontech' }]"
    status-label="All Systems Operational"
    :languages="['EN', 'PT-BR', 'ES']"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `kind` | `SiteFooterKind` | `'site'` | false | Where the footer sits: `site` closes a framed marketing page and draws its frame, `content` runs the bands full bleed. |
| `ariaLabel` | `string` | `'Footer'` | false | Accessible name of the footer landmark. |
| `home` | `string` | `''` | false | Destination of the Azion mark; the mark is not rendered when empty. |
| `homeAriaLabel` | `string` | `'Azion home'` | false | Accessible name of the Azion mark link. |
| `columns` | `SiteFooterColumn[]` | `[]` | false | The link columns, in order; each is `{ title, links }` where every link is `{ label, href }`. |
| `socials` | `SiteFooterSocial[]` | `[]` | false | The profile icon buttons, in order; each is `{ icon, label, href }` where `label` names the button for assistive tech. They open in a new tab. |
| `statusLabel` | `string` | `''` | false | Line of the system status indicator; the indicator is not rendered when empty. |
| `languages` | `string[]` | `[]` | false | Options of the language select, as the reader sees them; the first one is selected. The select is not rendered when empty. |
| `languageAriaLabel` | `string` | `'Language'` | false | Accessible name of the language select, also its placeholder. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- `data-kind` mirrors the `kind` prop on the footer
- From `lg` the Azion mark leads the social row; below `lg` it renders in the footer's signature band
- The status indicator, the language select and the Azion mark each render only when their prop is set

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| Azion mark hover | `transition-opacity duration-fast-02 ease-productive-entrance` | semantic | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| top hairline | `var(--border-default)` |
| language glyph | `var(--text-muted)` |
| mark link shape | `var(--shape-elements)` |
| mark gap | `var(--spacing-xs)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the mark link carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`; links, icon buttons and the select own theirs.
- Keyboard map: `Tab` moves through the column links, the mark, the social buttons and the language select; the select opens with `Enter` / `Space` and moves with the arrows, owned by `select`.
- ARIA: the `footer` is the `contentinfo` landmark named by `ariaLabel`; each column is titled; the mark link is named by `homeAriaLabel`, each social button by its `label`, the select by `languageAriaLabel`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components.
- `motion-reduce:transition-none` on the mark link's opacity transition.
- Touch target ≥40×40 px — owned by `icon-button` and `select`.

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
