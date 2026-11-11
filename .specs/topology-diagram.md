---
name: topology-diagram
category: data
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: f691c8a8b21c3e9128a6df4b809b55d77a940e9bf7efe910e234cff4ef783029
created: 2026-11-11
last_updated: 2026-11-11
---

# TopologyDiagram — Component Spec

## Purpose

The deployment topology of a resource as a left-to-right diagram: each column is a depth (domains, project, policy, service, cache rules, integration, storage), each node a collapsible card with the resource kind, its status tag, its name and, when opened, a message and labelled fields; dashed connectors join every node of a column to the next. A node without a name is an unbound slot (dashed, Not bound) and a `bindable` node carries the bind control (bind an existing resource, change it, create one, remove it). Taken from the design sample's workload topology (`TopologyNode`, `TopologyNodeCard`, `TopologyBindNode`, `TopologyBindControl`, the empty node). It reuses `Flow`'s connector engine and anchors and draws its own list semantics, with no node-graph dependency.

## When to use

- The topology tab of a project, service or workload: what serves its traffic, in order, and what is still unbound.
- A review before a deploy where binding or removing a resource is staged on the diagram.

## When NOT to use

- A sequence of steps or a pipeline without data cards → use `flow`.
- A nested list of items with no flow between them → use `tree`.
- A marketing architecture picture → use `diagram`.

## Related

- `flow` — the connector engine and anchors this component reuses.
- `tree` — hierarchical data without connectors.
- `dropdown-menu` — the bind control's menu.
- `platform/detail/details-page` — the page whose topology tab holds it.

## Best practices

- Keep a column per depth and put the nodes that serve in parallel in the same column.
- Mark a staged change `dashed` with a warning status and a message that says the deploy applies it.
- Mark the last node of each branch `terminal` so no connector leaves it.
- Give every unbound slot a message that says what happens without it.

## Usage

```vue
<script setup>
  import TopologyDiagram from '@aziontech/webkit/topology-diagram'
  import { ref } from 'vue'

  const levels = [
    { key: 'project', nodes: [{ key: 'project', kind: 'Project', name: 'web-app', status: 'Live', severity: 'success' }] },
    { key: 'policy', nodes: [{ key: 'policy', kind: 'Policy', bindable: true, bindOptions: [{ value: 'edge-guard', label: 'edge-guard' }], terminal: true }] }
  ]
  const expanded = ref([])
</script>

<template>
  <TopologyDiagram
    v-model:expanded="expanded"
    :levels="levels"
    @bind="(key, value) => {}"
  />
</template>
```

## Props

| Prop        | Type              | Default | Required | JSDoc                                                                                  |
| ----------- | ----------------- | ------- | -------- | -------------------------------------------------------------------------------------- |
| `levels`    | `TopologyLevel[]` | `[]`    | false    | Columns of the diagram, from the entry point to the last dependency.                    |
| `loading`   | `boolean`         | `false` | false    | Shows placeholder cards while the topology loads.                                       |
| `ariaLabel` | `string`          | `''`    | false    | Accessible name of the diagram. Empty uses the locale catalog (`Deployment topology`). |

Types: `TopologyLevel = { key: string; label?: string; nodes: TopologyNode[] }`; `TopologyNode = { key: string; kind: string; icon?: string; name?: string; status?: string; severity?: TopologyNodeSeverity; dashed?: boolean; message?: string; fields?: TopologyNodeField[]; href?: string; terminal?: boolean; bindable?: boolean; bindOptions?: TopologyBindOption[]; boundValue?: string; removable?: boolean }`; `TopologyNodeField = { label: string; value: string; href?: string; copyable?: boolean }`; `TopologyBindOption = { value: string; label: string }`; `TopologyNodeSeverity = 'success' | 'info' | 'warning' | 'danger' | 'neutral'`.

## v-model

- **`v-model:expanded`** — `string[]`, default `[]`. Keys of the open node cards; a header click toggles its key.

## Events

| Event             | Payload                       | Notes                                               |
| ----------------- | ----------------------------- | --------------------------------------------------- |
| `update:expanded` | `string[]`                    | A node card opened or closed.                       |
| `bind`            | `[key: string, value: string]` | An existing option was picked in the bind control.  |
| `remove`          | `[key: string]`               | Remove was activated on a bound, removable node.    |
| `create`          | `[key: string]`               | Create was picked in the bind control.              |

## Slots

| Slot      | Scope                  | Notes                                                             |
| --------- | ---------------------- | ----------------------------------------------------------------- |
| `actions` | `{ node: TopologyNode }` | Extra controls in a node's identity row, before the bind control. |
| `empty`   | —                      | Replaces the line shown when there are no levels.                 |

## States

- Root: `data-loading` and `aria-busy` while `loading`; empty when `levels` is empty.
- Node card: `data-state` `open` | `closed`; `data-dashed` for a staged or unbound node.
- Connectors: dashed, flowing; faded never (no disabled nodes).

## Motion & Animations

| Trigger                    | Animation / Transition                                                 | Token                                     | Reduced-motion fallback          |
| -------------------------- | ---------------------------------------------------------------------- | ----------------------------------------- | -------------------------------- |
| connectors                 | `animate-flow-dash`                                                    | semantic `flow-dash`                       | `motion-reduce:animate-none`     |
| card open / close          | `transition-[grid-template-rows] duration-moderate-01 ease-productive-entrance` | duration `moderate-01`, curve `productive-entrance` | `motion-reduce:transition-none`  |
| chevron, hover, border     | `transition-transform` / `transition-colors` `duration-moderate-01` | duration `moderate-01`                      | `motion-reduce:transition-none`  |

## Tokens

| Region          | Token                                       |
| --------------- | ------------------------------------------- |
| card surface    | `var(--bg-surface)`, `var(--shape-card)`    |
| card border     | `var(--border-default)`, hover `var(--border-strong)` |
| body divider    | `var(--border-muted)`                       |
| connector       | `var(--accent)`                             |
| muted text      | `var(--text-muted)`                         |
| column gap      | `var(--spacing-xl)`; node gap `var(--spacing-md)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: header buttons `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset`; the scroll area when it scrolls.
- Keyboard map: `Tab` moves through header buttons, links, copy, bind and remove controls in reading order; `Enter`/`Space` on a header toggles its card; the bind menu follows `dropdown-menu` (arrows, `Enter`, `Esc`). The scroll area is focusable (`tabindex="0"`) only when it overflows, so arrow keys scroll it.
- ARIA: the root is a `section` named by `ariaLabel`; columns are an `ol` of `li`, each with an optional visually hidden label; each header is a `button` with `aria-expanded` and `aria-controls`; the collapsed body is `inert`; connectors are `aria-hidden`; icon-only controls are named (`Bind Policy`, `Remove Policy`, `Copy Domains Custom domain`) and carry a `Tooltip`; loading announces once through a `role="status"` line.
- The unbound dash is `aria-hidden`; the status tag says Not bound in words.
- Contrast ≥4.5:1 from the semantic text tokens.

## Internationalization

| Key                          | English source              | Override prop |
| ---------------------------- | --------------------------- | ------------- |
| `topologyDiagram.label`     | Deployment topology         | `ariaLabel`   |
| `topologyDiagram.notBound`  | Not bound                   | node `status` |
| `topologyDiagram.bind` / `change` / `remove` / `create` | Bind {kind} / Change {kind} / Remove {kind} / Create {kind} | — |
| `topologyDiagram.existing`  | Existing                    | —             |
| `topologyDiagram.noOptions` | No options yet.             | —             |
| `topologyDiagram.copy`      | Copy {field}                | —             |
| `topologyDiagram.empty`     | Nothing is connected yet.   | `empty` slot  |
| `topologyDiagram.loading`   | Loading the topology        | —             |

- Formatting: none; kinds, names, statuses and fields are data.

## Right-to-left

- Layout: logical utilities only (`ms-auto`, `text-start`); the columns run from the inline start.
- Connectors: the engine reads `direction` and mirrors the elbows; ports swap sides.
- Icons: the chevron rotates vertically and is not mirrored; kind icons are not mirrored.
- User data: field values carry `dir="auto"`.

## Responsive

- Container queries: none; each column keeps `min-w-(--size-56)` and grows to share the width.
- Narrow (≤ 640 px or a narrow container): the diagram scrolls inline in its own focusable area; the page does not.
- Touch: header buttons are full-width rows; bind, remove and copy are small icon buttons with tooltips that also work on focus.
- Reflow: the diagram is a two-dimensional figure, an accepted exception to 1.4.10 inside its own scroll area.

## Performance

- Bundle budget: 32 KB gzip for `./topology-diagram` (it carries `dropdown-menu`, `tooltip` and `copy-button`) in `.size-limit.json`.
- Runtime budget: connectors re-measure on resize and DOM mutations; a 7-column, 10-node topology measures in one frame.
- Heavy parts: none; no node-graph library.

## Stories (Storybook)

- Default — a full topology with a bound and an unbound bindable node and the `actions` slot.
- Binding — justified: staging bind, remove and create needs state across interactions.
- Loading — the `loading` prop.
- Empty — the empty line and the `empty` slot.

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
