---
name: help-panel
category: content
structure: composition
status: implemented
checksum: 4dd1a92d1d04d7825a3b8b4727df06513e14ccddd1f6e75d8ff709906f74d643
spec_version: 6
created: 2026-11-10
last_updated: 2026-11-23
---

# HelpPanel — Component Spec

## Purpose

The content of a help side region: a topic's title, a few sections of short guidance, and the
"Learn more" links that leave for the documentation. Guided tutorials belong to `tutorial-panel`. It is the thing that goes **inside** a side region, not the
region itself: the consumer places it in a `Drawer` or in the page's side rail, and that host owns
opening, closing and the close button.

It owns no open state, so it has no `Trigger` / `Content` and no `data-state="open|closed"`. Its anatomy
is the anatomy of a help page — `Header`, `Section`, `Links` — composed by hand, so a topic can omit
the links or carry one section or five.

## When to use

- Use HelpPanel for static page help (title, guidance, Learn more links) in the app layout's tools region.
- A Console screen needs contextual help beside the work: what this page is for, what a field means, where the docs are.
- The help content is loaded asynchronously and the region must reserve its space while it arrives (`loading`).

## When NOT to use

- A one-line hint attached to a single control → use `tooltip` or `hint`, or the field's `field-description`.
- A guided tutorial with tasks, progress and hotspots on the real controls → use `tutorial-panel`.
- The region itself (overlay, slide-in, close button, focus trap) → use `drawer`; put `help-panel` inside it.
- Ordered steps the reader navigates between, with the step's form filling the column beside it → use `stepper`.
- Numbered instructions inside a documentation page, read all at once → use `doc-steps` (`DocSteps.Step`).
- A page with nothing configured yet, which needs one call to action → use `empty-state`.

## Related

- `drawer` — the host that opens, closes and traps focus around a help panel shown as an overlay.
- `tutorial-panel` — guided tutorials, drawn with these parts plus its own task list.
- `link` — the standalone link each `HelpPanel.Footer` row is composed from.
- `skeleton` — what the panel renders in place of its content while `loading`.
- `doc-prose` — long-form documentation prose; a help section is a few short paragraphs, not an article.

## Best practices

- One topic per panel. When the reader moves to another part of the page, swap the panel's content — do not stack two headers.
- Keep each `Section` to a short paragraph or a short list. If the reader has to scroll a section, the content belongs in the docs and the panel should link to it.
- Title sections with the question the reader is asking (`What is a workload?`), not with a noun (`Overview`).
- Put links to the documentation in `HelpPanel.Footer`, at the end, not inline in every section.
- Close affordances belong to the host. Do not put a close button in `HelpPanel.Header`; the `Drawer` or side rail already has one.
- How it opens in the console: the panel is the body of `ConsoleLayout`'s `tools` slot, and the page opens it with `ConsoleLayout.ToolsTrigger`, the `Info` link placed first in `PageHeader`'s `meta` slot, right after the page title. The trigger's `click` runs before the region toggles, so the page sets the topic there. Never open help from a boxed icon button, a typed `?` or a `Tooltip`.

## Usage

```vue
<script setup>
  import HelpPanel from '@aziontech/ui/help-panel'
  import Link from '@aziontech/ui/link'
</script>

<template>
  <HelpPanel aria-label="Help: Workloads">
    <HelpPanel.Header
      title="Workloads"
      description="Where your domains meet the applications that answer them."
    />

    <HelpPanel.Group label="What is a workload?">
      <p>A workload binds one or more domains to an application and a firewall.</p>
    </HelpPanel.Group>

    <HelpPanel.Footer>
      <Link
        label="Workloads documentation"
        href="https://www.azion.com/en/documentation/"
        target="_blank"
      />
      <Link
        label="Domains and certificates"
        href="https://www.azion.com/en/documentation/"
        target="_blank"
      />
    </HelpPanel.Footer>
  </HelpPanel>
</template>
```

Tree-shaking alternative — the standalone root and each sub-component from its own entry (no
`Object.assign` compound pulled in):

```vue
<script setup>
  import HelpPanel from '@aziontech/ui/help-panel-root'
  import HelpPanelHeader from '@aziontech/ui/help-panel-header'
  import HelpPanelGroup from '@aziontech/ui/help-panel-group'
  import HelpPanelFooter from '@aziontech/ui/help-panel-footer'
</script>
```

## Sub-components

The root ships a **compound API**: an `index.ts` (beside `help-panel.vue`) attaches every sub-component
to the root so `<HelpPanel.Header>`, `<HelpPanel.Group>` and `<HelpPanel.Footer>` resolve from one
import; the standalone imports remain the tree-shaking path. The panel has no open/closed state, so
there is no `Trigger` / `Content` — every member is named after a part of a help page. 6.0 removed the
tutorial mode (`HelpPanel.Tutorial`, `HelpPanel.Task`): `TutorialPanel` owns tutorials.

- `help-panel-header/help-panel-header.vue` — The topic's title and an optional one-line description. Renders a `<header>` holding an `<h2>` and, when `description` is non-empty, a `<p>`. No close affordance — the host owns closing.
  - Props: `title?: string` (default `''` — the topic's name, rendered as the panel's heading), `description?: string` (default `''` — one line under the title saying what the topic covers; not rendered when empty).
  - Slot: `default` — optional extra content under the description (a `Tag` naming the product state, for example).
  - `data-testid` fallback: `help-panel-header`.
- `help-panel-group/help-panel-group.vue` — One block of guidance with its own heading. Renders a `<section aria-labelledby>` holding an `<h3>` (only when `label` is non-empty) and the slot, in `text-body-sm`, with a fixed vertical rhythm between paragraphs and lists inside it.
  - Props: `label?: string` (default `''` — the question this section answers; the section renders no heading when empty).
  - Slot: `default` — the section's prose: paragraphs, short lists, inline `text-link` anchors.
  - `data-testid` fallback: `help-panel-group`.
- `help-panel-footer/help-panel-footer.vue` — The "Learn more" footer: a heading over a column of `Link` items the consumer composes. Renders a `<section aria-labelledby>` holding an `<h3>` and a vertical flex column of the slot, separated from the content above by a `Separator`.
  - Props: `title?: string` (default `undefined` — the heading over the links; absent uses the locale catalog, `Learn more` in English, and an empty string renders no heading).
  - Slot: `default` — `Link` items, one per destination.
  - `data-testid` fallback: `help-panel-footer`.
    Resulting layout (no per-component `package.json`; the root `packages/ui/package.json#exports`
    resolves every path, and `.d.ts` is generated at publish time):

```
packages/ui/src/components/content/help-panel/
├── help-panel.vue                         (root; aside landmark, loading state)
├── help-panel.test.ts
├── index.ts                               (compound: attaches the three parts to the root)
├── help-panel-header/
│   └── help-panel-header.vue
├── help-panel-group/
│   └── help-panel-group.vue
└── help-panel-footer/
    └── help-panel-footer.vue
```

Exports to add to `packages/ui/package.json#exports` (flat public names; category lives in the
folder only):

```jsonc
"./help-panel": "./src/components/content/help-panel/index.ts",
"./help-panel-root": "./src/components/content/help-panel/help-panel.vue",
"./help-panel-header": "./src/components/content/help-panel/help-panel-header/help-panel-header.vue",
"./help-panel-group": "./src/components/content/help-panel/help-panel-group/help-panel-group.vue",
"./help-panel-footer": "./src/components/content/help-panel/help-panel-footer/help-panel-footer.vue"
```

Composed DS components (all present in `packages/ui/package.json#exports`, imported by relative path
inside the package): `skeleton` (root, `loading`), `divider` (`Links`).
`link` is composed by the consumer through slots, never imported by the panel.

## Props

| Prop        | Type      | Default | Required | JSDoc                                                                                                     |
| ----------- | --------- | ------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `ariaLabel` | `string`  | `''`    | false    | Accessible name for the complementary landmark the panel renders. Empty uses the locale catalog (`Help`). |
| `loading`   | `boolean` | `false` | false    | Renders skeleton lines in place of the content while the help topic loads; sets aria-busy.                |

## Events

_No events — the panel is content; opening and closing belong to the host and to the controls the consumer composes._

## Slots

| Slot      | Scope | Notes                                                                                                                           |
| --------- | ----- | ------------------------------------------------------------------------------------------------------------------------------- |
| `default` | —     | The panel's parts — `HelpPanel.Header`, `HelpPanel.Group`, `HelpPanel.Footer` — in reading order. Not rendered while `loading`. |

## States

- Visual states: `default`, `loading`
- `data-loading` on the root mirrors the `loading` prop
- No `data-state` — the panel has no open/closed state (the host owns it)
- No `data-disabled` — nothing in the panel is interactive on its own; interactive content (`Link`, `Button`) is composed by the consumer and carries its own states

The root, while `loading`: the default slot is not rendered; in its place the root renders a title
line and three body lines with `Skeleton` (`variant="rectangle"`; title `width="60%"` `height="1.25rem"`, body
lines `width="100%"`, `width="100%"`, `width="75%"`, each `height="0.875rem"`), and sets
`aria-busy="true"`. The loading lines carry `aria-hidden="true"`; the landmark keeps its accessible
name.

- Responsive: the root is the `@container/help-panel`, so the content in the side panel adapts to the panel width.

## Motion & Animations

| Trigger                       | Animation / Transition                      | Token (see `contributing/docs/TOKENS.md` § Animations) | Reduced-motion fallback                                 |
| ----------------------------- | ------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------- |
| `loading` placeholder shimmer | `Skeleton` component (owns its own shimmer) | component                                              | handled by `Skeleton` (suppressed under reduced motion) |

## Tokens

| Region                               | Token (TOKENS.md)     |
| ------------------------------------ | --------------------- |
| typography (header title)            | `.text-title-md`      |
| typography (header description)      | `.text-body-sm`       |
| typography (inline anchors in prose) | `.text-link`          |
| title ink                            | `var(--text-default)` |
| description / progress / muted ink   | `var(--text-muted)`   |
| padding (root)                       | `var(--spacing-md)`   |
| gap (between panel parts)            | `var(--spacing-lg)`   |
| gap (title to body, inside a part)   | `var(--spacing-xs)`   |

## Theme gaps

| Figma variable                         | Temporary primitive                                                                                           | Follow-up                                                                                          |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| — (documentation gap, not a token gap) | `var(--radius-full)` — ships in the theme and is what `stepper` and `DocSteps.Step` already use for their dot | `TODO: document --radius-full in TOKENS.md § Shape; there is no --shape-* alias for a full circle` |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the panel itself is not focusable; focus rings belong to the composed `Link` / `Button` controls, which already carry `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- Keyboard map: `Tab` moves through the composed links and action buttons in reading order. The panel adds no key handling of its own — no roving tabindex, no arrow navigation. `Esc` and focus trap / restore are owned by the host (`Drawer`), not by the panel.
- ARIA: the root is an `<aside>` (complementary landmark) named by `aria-label` from `ariaLabel`; `aria-busy="true"` while `loading`. Headings form an outline — `HelpPanel.Header` is `<h2>`, `Section` / `Links` titles are `<h3>` — and each `<section>` is `aria-labelledby` its heading via `useId()`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons)
- Touch target ≥40×40 px — not applicable to the panel's own markup (nothing in it is interactive); the composed `Link` / `Button` controls meet it

## Examples

- Default — a help topic: `HelpPanel.Header`, two `HelpPanel.Group`s, and `HelpPanel.Footer` with two `Link`s.
- Loading — the root with `loading` set; the args delta is `loading` only.

## Open questions

- **Heading levels are fixed (`h2` header, `h3` parts).** Inside a `Drawer` whose own title is an `h2`, the panel's header should arguably be an `h3`. A heading-level prop was not added (not in the brief); revisit if a host needs it.
- **Root padding.** The root owns `p-(--spacing-md)` so it reads correctly in a bare side rail; inside a `Drawer` whose content area already pads, that doubles. Confirm against the Drawer's content padding during scaffold.
- **`HelpPanel.Footer` is a column, not a list.** Wrapping each consumer-composed `Link` in an `<li>` needs slot-vnode iteration; the draft renders a flex column under a labelled `<section>` instead. Revisit if a11y review wants list semantics.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/ui/*` path must exist in `packages/ui/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
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
