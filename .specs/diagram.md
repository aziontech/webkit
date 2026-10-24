---
name: diagram
category: marketing
structure: monolithic
status: approved
spec_version: 1
checksum: 8135dee436b0b53046ed830603f28d798e217af5735b7a4008e5fe8e41c428ea
created: 2026-10-21
last_updated: 2026-10-21
---

# Diagram — Component Spec

## Purpose

A node-and-connector diagram for marketing pages: the request path of an architecture, a routing policy, a product's place in the platform. The consumer names one of the official diagrams with `name` — the closed library of 28 drawings in webkit's assets, one starter architecture per Azion product plus the page diagrams the product pages tab through — or passes a one-off `spec`: the nodes, how they are arranged, and the edges between them. The component lays the nodes out with real CSS (rows, branches, grids and framed groups), then measures the laid-out nodes and draws every connector, port and edge label on top. Nothing is drawn on a fixed canvas: the layout reflows below its container breakpoint into a stacked, indented tree and the connectors are re-measured, so a diagram stays legible from a phone to a wide band.

## When to use

- Showing how a request travels through Azion — client, application, the product the page is about, and its outcomes.
- Showing a routing or failover policy as nodes and labelled edges, with the path a request takes highlighted.
- Filling the media cell of a marketing band (`media-tabs`, `media-split`) with an architecture instead of a picture.

## When NOT to use

- For decorative product art → use `illustration`.
- For a world map of points of presence → use `network-map`.
- For a sequence of steps the reader follows in order → use `stepper` or an ordered list.
- For live data or anything the reader operates — a diagram is a figure, not a control.

## Related

- `illustration` — the drawn scene library; a diagram is generated from data, an illustration is authored art. Both pick an official drawing by `name`.
- `media-tabs` — hosts one diagram per tab in its media column; key each `Diagram` by its tab so it re-measures.
- `frame-box` — the registration frame a diagram's groups and tiles are drawn in.
- `tag` — the status chip a card or item node carries.

## Best practices

- Keep a diagram to about four columns in the wide layout so it fits a band's media cell; split a larger story into several diagrams.
- Light exactly one node with `lit` — the product the diagram is about — and mark the request path with `active` on its nodes and edges.
- Use `gap: 'wide'` on a row whose edges carry labels, so the chips have room between the nodes.
- Name an official diagram instead of rebuilding its `spec`, so the same architecture is the same drawing on every page. Reach for `spec` only for a diagram the library does not have.
- Every named diagram carries its own one-sentence description. Give a `spec` diagram an `ariaLabel` (in the prop or in the spec) that states what it shows; the drawing itself is hidden from assistive technology.
- Reach for `card` for platform pieces, `item` for models and providers, `pill` for a client, `tile` for an icon-only grid cell, and `app` for the consumer's own application.

## Usage

```vue
<script setup>
  import Diagram from '@aziontech/webkit/diagram'

  const spec = {
    nodes: [
      { key: 'client', kind: 'pill', title: 'Client', icon: 'pi pi-user', active: true },
      {
        key: 'app',
        kind: 'card',
        title: 'Application',
        eyebrow: 'Workload',
        icon: 'pi pi-globe',
        active: true
      },
      {
        key: 'firewall',
        kind: 'card',
        title: 'Firewall',
        eyebrow: 'Product',
        icon: 'pi pi-shield',
        lit: true,
        active: true
      },
      { key: 'origin', kind: 'card', title: 'Origin', eyebrow: 'Backend', icon: 'pi pi-server' }
    ],
    layout: {
      row: [{ node: 'client' }, { node: 'app' }, { node: 'firewall' }, { node: 'origin' }],
      gap: 'wide'
    },
    edges: [
      { from: 'client', to: 'app', active: true },
      { from: 'app', to: 'firewall', label: 'inspect', active: true },
      { from: 'firewall', to: 'origin', label: 'allow' }
    ]
  }
</script>

<template>
  <Diagram name="ai-gateway-model-routing" />

  <Diagram
    :spec="spec"
    aria-label="A request from the client reaches the application, is inspected by the firewall and allowed through to the origin."
  />
</template>
```

## Props

| Prop        | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Default     | Required | JSDoc                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------- | -------------------------------------------------------------------------------------------- |
| `name`      | `'ai-gateway' \| 'ai-gateway-latency-routing' \| 'ai-gateway-model-routing' \| 'ai-gateway-provider-failover' \| 'ai-gateway-response-cache' \| 'ai-inference' \| 'application-accelerator' \| 'applications' \| 'bot-manager' \| 'cache' \| 'data-stream' \| 'ddos-protection' \| 'edge-dns' \| 'firewall' \| 'functions' \| 'image-processor' \| 'kv-store' \| 'load-balancer' \| 'network-shield' \| 'object-storage' \| 'real-time-events' \| 'real-time-metrics' \| 'sql-database' \| 'web-application-firewall' \| 'workloads' \| 'workloads-gradual-rollout' \| 'workloads-isolate-per-request' \| 'workloads-security'` | `undefined` | false    | Name of an official diagram in the asset library; ignored when spec is set.                  |
| `spec`      | `DiagramSpec`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `undefined` | false    | The nodes, their layout and the edges between them, for a diagram the library does not have. |
| `ariaLabel` | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `''`        | false    | Accessible description of the whole diagram; empty uses the description the spec carries.    |

`name` and `spec` default to `undefined` because absence is meaningful: a diagram draws from `spec` when one is passed and from the named library entry otherwise. `DiagramName` and `DiagramSpec` and its parts are exported types:

- `DiagramName` — the union of library names above.
- `DiagramSpec` — `{ ariaLabel?: string; nodes: DiagramNode[]; layout: DiagramLayoutItem; edges: DiagramEdge[] }`.
- `DiagramNode` — `key`, `kind` (`DiagramNodeKind`: `'card' | 'pill' | 'tile' | 'app' | 'item'`), `title`, and optional `eyebrow`, `status` (`DiagramNodeStatus`: `{ label, severity }` with a `tag` severity), `icon` (icon class), `logo` (full-colour mark URL), `mark` (single-ink mark URL, drawn in the current text colour), `active`, `lit`.
- `DiagramLayoutItem` — one of `{ node }`, `{ row, align?, gap? }` (`DiagramRowAlign`: `'start' | 'center'`; `DiagramRowGap`: `'default' | 'wide'`), `{ branches }`, `{ grid, columns? }` (`2 | 3`), `{ group, label, kind?, fill?, content }` (`DiagramGroupKind`: `'solid' | 'dashed'`; `DiagramGroupFill`: `'none' | 'primary' | 'secondary'`).
- `DiagramEdge` — `from`, `to` (a node or group key), optional `label`, `active`.

## Events

_None — the diagram is a figure._

## Slots

_None — every node is drawn from `spec`._

## States

- **Layout.** The root is an inline-size container. At the `6xl` container width and up, `row` lays its items side by side and `branches` stacks its items beside the node before it; below that width every row stacks and `branches` indents under the node it leaves, so the tree reads top to bottom. `grid` keeps its 2 or 3 columns at every width.
- **Connectors.** After layout, the component measures every node and group (each carries `data-diagram-node` with its key) and draws each edge whose two ends exist: a curve when the target sits to the right of the source, an elbow from the source's bottom edge into the target's left edge when the target sits below and to the right, and a straight drop otherwise. Each end gets a port; ports at the same point merge. Edges whose ends are missing are skipped. The drawing is re-measured on every resize of the canvas or of any node, when the web fonts settle, and when the edges change.
- **Named.** A `name` loads its spec on demand from the library; the root keeps its width and draws nothing until the spec arrives, and a `name` change clears the current drawing at once. A `name` outside the library (from untyped code), or a spec that fails to load, warns in development only and leaves the root empty; it never throws. With neither `name` nor `spec` the root is empty.
- **Label.** The root is announced as one image named by `ariaLabel`, or, when that is empty, by the description the spec carries; with neither it is a plain figure.
- **Ready.** The canvas sets `data-ready` once the first measure lands and fades in from transparent, so a diagram never shows unconnected nodes.
- **Active.** An `active` edge, its ports and its label chip are drawn in the accent colour and painted above the rest; an `active` node is part of the highlighted path.
- **Lit.** A `lit` card, item or pill gets a primary edge and a primary-and-accent glow; a `lit` tile gets a primary edge.
- **Groups.** A `group` draws its content inside a registration frame with a small label above it; `kind: 'dashed'` dashes its edge and `fill` tints it with the primary or secondary mask.
- **Node kinds.** `card` — header row (mark, logo or icon, eyebrow, status tag) over the title, clamped to two lines. `item` — a leading mark, logo or icon, the title with the eyebrow in a mono line under it, and an optional trailing status tag. `pill` — a rounded chip with an optional icon. `tile` — an icon-only cell inside a registration frame, its title shown in a tooltip. `app` — a quiet window placeholder (three dots, the title, placeholder bars) that fades out at the bottom.
- **Test ids.** Root fallback `marketing-diagram` (consumer override wins); `${testId}__canvas` on the measured canvas.

## Motion & Animations

| Trigger                            | Animation / Transition                                             | Token (see `.claude/docs/DESIGN.md` § Animations)     | Reduced-motion fallback         |
| ---------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------- | ------------------------------- |
| first measure lands (`data-ready`) | `transition-opacity duration-moderate-02 ease-productive-entrance` | duration `moderate-02` · easing `productive-entrance` | `motion-reduce:transition-none` |

## Tokens

| Region                          | Token (DESIGN.md)                                                                                                                                            |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| root padding                    | `var(--spacing-md)`, `var(--spacing-xl)` at the `3xl` container width                                                                                        |
| layout gap                      | `var(--spacing-xl)`, `var(--spacing-xxl)` for a wide row                                                                                                     |
| branch indent (stacked)         | `var(--spacing-12)`                                                                                                                                          |
| grid gap                        | `var(--spacing-xs)`                                                                                                                                          |
| connector stroke                | `var(--border-default)` at `var(--border-width-default)`                                                                                                     |
| active connector, port and chip | `var(--accent)`                                                                                                                                              |
| port                            | `var(--border-default)` fill, `var(--border-muted)` edge, `var(--radius-sm)`                                                                                 |
| edge label chip                 | `var(--bg-surface)`, `var(--border-default)`, `.text-label-code-sm`, `var(--text-muted)` / `var(--text-default)` when active                                 |
| node surface                    | `var(--bg-surface)`                                                                                                                                          |
| node edge                       | `var(--border-default)`                                                                                                                                      |
| node shadow                     | `var(--shadow-xs)`                                                                                                                                           |
| node shape                      | `var(--shape-card)`; `var(--shape-flat)` for groups and tiles; `var(--shape-elements)` inside the app window                                                 |
| node typography                 | `.text-label-sm`; `.text-label-code-sm` for an item's eyebrow; `.text-heading-sm` for the app title and an item's icon                                       |
| node text                       | `var(--text-default)`, `var(--text-muted)`                                                                                                                   |
| lit edge and glow               | `var(--primary)`, `var(--accent)`                                                                                                                            |
| group fill                      | `var(--primary-mask)`, `var(--secondary-mask)`                                                                                                               |
| app placeholder bars            | `var(--bg-placeholder)`                                                                                                                                      |
| node sizes                      | `var(--size-2)`, `var(--size-3)`, `var(--size-6)`, `var(--size-7)`, `var(--size-14)`, `var(--size-20)`, `var(--size-44)`, `var(--size-60)`, `var(--size-72)` |

## Theme gaps

| Figma variable                                                                                       | Temporary primitive                                                                                                                                      | Follow-up                                                                       |
| ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| — (documentation gap, not a token gap): active connector, port and chip, lit glow                    | `var(--accent)` — ships in the theme, used by `network-map`                                                                                              | `TODO: list --accent in DESIGN.md § Colors`                                     |
| — (documentation gap): connector and node edge width                                                 | `var(--border-width-default)` — ships in the theme                                                                                                       | `TODO: list --border-width-* in DESIGN.md`                                      |
| — (documentation gap): group tints                                                                   | `var(--primary-mask)`, `var(--secondary-mask)` — ship in the theme                                                                                       | `TODO: list the --*-mask surfaces in DESIGN.md § Colors`                        |
| — (documentation gap): port corner                                                                   | `var(--radius-sm)` — ships in the theme                                                                                                                  | `TODO: list --radius-* in DESIGN.md § Shape`                                    |
| — (documentation gap): node, port and placeholder sizes                                              | `var(--size-2)` … `var(--size-72)` — the theme size scale                                                                                                | `TODO: list the --size-* scale in DESIGN.md`                                    |
| — (documentation gap): stacked branch indent                                                         | `var(--spacing-12)` — the numeric spacing scale                                                                                                          | `TODO: list the numeric --spacing-* steps in DESIGN.md § Spacing`               |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the diagram has no focusable parts.
- Keyboard map: none — the diagram is a figure and takes no input.
- ARIA: the root is a `figure`; with `ariaLabel` set it is `role="img"` named by it. The canvas is `aria-hidden="true"`, so the nodes, connectors and chips are never read one by one — the label carries the meaning.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): node and chip text use `var(--text-default)` / `var(--text-muted)` on `var(--bg-surface)`; connectors meet 3:1 as non-text graphics against `var(--bg-canvas)`.
- `motion-reduce:transition-none` on the canvas fade; nothing else moves.
- Touch target: not applicable — nothing in the diagram is interactive.

## Stories (Storybook)

- Default — a named diagram from the library (`name`), with Controls to switch between every registered name.
- Spec — a one-off request path passed as `spec`, from a client through an application to the lit product and its outcomes, with labelled, active edges. Justified addition: `spec` is the second way in, for a diagram the library does not have, and Default shows only `name`.
- NodeKinds — composite story drawing one node of each kind (`pill`, `card`, `item`, `tile`, `app`) in one diagram. Justified addition: the node kind is the component's one visual axis, carried in the data rather than a `kind` prop, so no Types story covers it.
- Groups — a framed group with a grid of tiles and a dashed, tinted group, connected to the nodes beside them. Justified addition: groups and grids are the layout primitives a Default row does not show.

<!-- Types/Sizes omitted: Diagram has no `kind` or `size` prop. Loading/Disabled omitted: it declares neither prop. -->

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
