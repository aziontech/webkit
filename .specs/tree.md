---
name: tree
category: data
structure: monolithic
status: implemented
checksum: 17f16c92164e74bbcc1a43f62257d47dc6f8738d09e9cd11c9c581c7f0737ffd
spec_version: 1
created: 2026-11-10
last_updated: 2026-11-11
---

# Tree — Component Spec

## Purpose

A hierarchical list of nodes, each row a name with an optional glyph and one line of detail, where a parent row folds its children open and closed under a chevron. It renders a nested `items` data structure on its own (recursively, through one internal row template) and follows the WAI-ARIA tree pattern, so it fits file and object browsers: the objects of a bucket, the source files of a deployment, the routes of an application. Unlike `menu` it navigates data, not the app, and unlike `accordion` its nodes are rows of the same kind at any depth, not panels of free content.

## When to use

- Browsing a hierarchy whose depth is not fixed: bucket objects under folders, the source tree of a deployment, functions grouped by application.
- Picking one node out of a hierarchy (`selectable`) to show its detail beside the tree.
- A hierarchy the user expands piece by piece, where showing every level at once would bury the node they are after.

## When NOT to use

- Navigation between views of the app → use `menu` inside `sidebar`.
- Flat records with several attributes each → use `table`.
- A few sections of free content that open and close → use `accordion`.
- A two- or three-level directory of destinations on a marketing page → use `column-navigation`.

## Related

- `table` — the flat, multi-column view of the same records; switch to it when columns matter more than nesting.
- `menu` — the hierarchical list for app navigation, with routes and active state instead of selection.
- `accordion` — disclosure of free content panels rather than rows of one kind.
- `empty-state` — what the tree renders when `items` is empty.
- `skeleton` — the rows the tree renders while `loading`.

## Best practices

- Give every node an `id` that is unique across the whole tree, not only among its siblings; `v-model:expanded`, `v-model:selected` and focus are keyed by it.
- Seed `v-model:expanded` with the path to the node the user is most likely after (the open folder, the selected file), not with every parent.
- Keep labels short and put secondary detail (size, count, modified date) in `description` so rows scan as names first.
- Use `selectable` only when the selection drives something on the screen (a detail pane, a preview); for a tree whose rows only lead somewhere, listen to `item-click` instead.
- Put per-row controls in the `actions` slot (an `IconButton` that opens a `dropdown`), never inside the `item` slot, so they do not take over the row's activation.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import Tree from '@aziontech/webkit/tree'

  const expanded = ref(['assets'])
  const items = [
    {
      id: 'assets',
      label: 'assets',
      icon: 'pi pi-folder',
      children: [
        { id: 'assets/logo.svg', label: 'logo.svg', icon: 'pi pi-image', description: '4.2 KB' },
        { id: 'assets/hero.webp', label: 'hero.webp', icon: 'pi pi-image', description: '182 KB' }
      ]
    },
    {
      id: 'src',
      label: 'src',
      icon: 'pi pi-folder',
      children: [
        { id: 'src/index.js', label: 'index.js', icon: 'pi pi-file', description: '1.1 KB' }
      ]
    },
    { id: 'azion.config.js', label: 'azion.config.js', icon: 'pi pi-file', description: '612 B' }
  ]
</script>

<template>
  <Tree
    v-model:expanded="expanded"
    aria-label="Bucket objects"
    :items="items"
  />
</template>
```

## Props

| Prop               | Type         | Default | Required | JSDoc                                                                                                                                                                                           |
| ------------------ | ------------ | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`            | `TreeItem[]` | `[]`    | false    | Nodes to render; each is `{ id: string; label: string; icon?: string; description?: string; disabled?: boolean; children?: TreeItem[] }`. A node with a non-empty `children` array is a parent. |
| `selectable`       | `boolean`    | `false` | false    | Enables single selection: activating a node writes its id to `v-model:selected` and marks it `aria-selected`.                                                                                   |
| `loading`          | `boolean`    | `false` | false    | Renders Skeleton rows in place of the tree and sets `aria-busy`.                                                                                                                                |
| `emptyTitle`       | `string`     | `''`    | false    | Title of the default empty state shown when `items` is empty. Empty uses the locale catalog (`No items`).                                                                                       |
| `emptyDescription` | `string`     | `''`    | false    | Supporting line under the empty title.                                                                                                                                                          |
| `ariaLabel`        | `string`     | `''`    | false    | Accessible name of the tree.                                                                                                                                                                    |

Exported types (declared in `tree.vue` with `export type`): `TreeItem` = `{ id: string; label: string; icon?: string; description?: string; disabled?: boolean; children?: TreeItem[] }`. `icon` is an icon class string (`pi pi-folder`, `ai ai-…`), the same convention `empty-state` uses.

## v-model

| Model              | Type       | Default | Emits             | Notes                                                                                                                                                                                                                                                                                                                               |
| ------------------ | ---------- | ------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:expanded` | `string[]` | `[]`    | `update:expanded` | Ids of the expanded parents, via `defineModel<string[]>('expanded', { default: () => [] })`. Uncontrolled when unbound. Ids of leaves or of unknown nodes are ignored. Collapsing a parent removes only its own id: descendants keep theirs, so re-expanding restores the subtree as it was. Always emits a new array.              |
| `v-model:selected` | `string`   | `''`    | `update:selected` | Id of the selected node, via `defineModel<string>('selected', { default: '' })`. Written only while `selectable`; read only while `selectable` (otherwise no node is marked selected). `''` means nothing is selected. Emits only when the id changes. Single selection only; activating the selected node again does not clear it. |

## Events

| Event        | Payload                                                | Notes                                                                                                                                                                                                                                                                |
| ------------ | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `item-click` | `(event: MouseEvent \| KeyboardEvent, item: TreeItem)` | A node activated: click on its row, or Enter / Space on the focused node. `item` is the consumer's own node object. Fires after `update:selected` when `selectable`. Not fired for a `disabled` node, nor for a click on the chevron or inside the `actions` region. |

## Slots

| Slot      | Scope                                                  | Notes                                                                                                                                                                                                                                                                                                                |
| --------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `item`    | `{ item: TreeItem; level: number; expanded: boolean }` | Replaces the label region of every row (glyph + label + description). The fallback inside the slot renders `item.icon`, `item.label` and `item.description`. `level` is 1 for top-level nodes; `expanded` is false for leaves. The chevron, indentation, row states and the `actions` region stay owned by the tree. |
| `actions` | `{ item: TreeItem; level: number }`                    | Trailing per-row controls, end-aligned in the row (e.g. an `IconButton` that opens a `dropdown`). Clicks and keys inside it do not activate the row nor move tree focus. No fallback; when unused, the region is not rendered.                                                                                       |
| `empty`   | —                                                      | Replaces the default empty state. The fallback inside the slot is `EmptyState` titled by `emptyTitle` with `emptyDescription`.                                                                                                                                                                                       |

## States

- Visual states: `default`; row `hover`, `focus-visible`, `selected`, `disabled`; parent `expanded` / `collapsed`; `loading` (Skeleton rows); `empty` (`EmptyState`).
- Precedence: `loading` → Skeleton rows, else `items` empty → `empty` slot, else the tree.
- `data-loading` on the root mirrors `loading`; `data-empty` on the root when `items` is empty and not loading.
- `data-selectable` on the root mirrors `selectable`.
- `data-state="open|closed"` on each parent row and its chevron (drives the rotation); absent on leaves. The tree is not an overlay, so this is disclosure state only.
- `data-selected` on the selected row (only while `selectable`); `data-disabled` on a disabled row.
- Collapsed children are not rendered (`v-if`), so they cost nothing and are out of the accessibility tree.
- A disabled node can still be focused (arrow keys) and, if it is a parent, expanded and collapsed; it cannot be selected and does not emit `item-click`.
- `data-testid`: the root falls back to `data-tree` (a consumer `data-testid` wins); parts derive from the resolved root id — `<testId>-item` on every treeitem, `<testId>-toggle` on every chevron. Each treeitem also carries `data-item-id="<item.id>"` so a test reaches one node without depending on DOM order.
- Loading renders five Skeleton rows (`kind="shape"`, row height, descending widths) at top level.

## Motion & Animations

| Trigger                            | Animation / Transition                                                                                                       | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------- |
| parent expand / collapse (chevron) | `transition-[rotate] duration-fast-02 ease-productive-entrance` + `data-[state=open]:rotate-90` on the chevron glyph         | `fast-02` · `productive-entrance`                 | `motion-reduce:transition-none`        |
| row hover                          | ghost layer `before:transition-opacity before:duration-fast-02 before:ease-productive-entrance` + `hover:before:opacity-100` | `fast-02` · `productive-entrance`                 | `motion-reduce:before:transition-none` |
| row selected change                | `transition-colors duration-fast-02 ease-productive-entrance`                                                                | `fast-02` · `productive-entrance`                 | `motion-reduce:transition-none`        |

The chevron transition names `rotate`, not `transform`: Tailwind v4 compiles `rotate-90` to the standalone `rotate` property (see `.claude/rules/styling.md` § Transitioning a transform). The children group appears and disappears instantly; no height reveal in v1 (see Open questions). The loading shimmer belongs to the composed `Skeleton`, which already suppresses it under reduced motion; Tree adds no animation for it.

## Tokens

| Region                                                            | Token (DESIGN.md)                          |
| ----------------------------------------------------------------- | ------------------------------------------ |
| label                                                             | `.text-label-md`, `var(--text-default)`    |
| description                                                       | `.text-label-sm`, `var(--text-muted)`      |
| glyph (item icon) and chevron                                     | `var(--text-muted)`                        |
| disabled label, description, glyph                                | `var(--text-disabled)`                     |
| row hover (ghost layer)                                           | `var(--bg-hover)`                          |
| row active (ghost layer)                                          | `var(--bg-active)`                         |
| row selected                                                      | `var(--bg-selected)`                       |
| row shape                                                         | `var(--shape-elements)`                    |
| row padding-x, gap between chevron / glyph / label                | `var(--spacing-xs)`                        |
| gap between label and description                                 | `var(--spacing-xxs)`                       |
| indentation per level (nested group margin-start + padding-start) | `var(--spacing-sm)` + `var(--spacing-xxs)` |
| indent guide line (nested group border-start)                     | `var(--border-muted)`                      |
| focus ring / ring offset                                          | `var(--ring-color)` / `var(--bg-canvas)`   |

Layout: each row is `min-h-8` (32px), full width of its group. The chevron and the glyph each sit in a 1rem box; a leaf reserves the chevron box empty so labels align across siblings. Each nested `role="group"` is indented by `ms-(--spacing-sm)` + `ps-(--spacing-xxs)`, which puts its hairline guide (`border-s`, `var(--border-muted)`) under the center of the parent's chevron and steps every level by 1rem; indentation accumulates through nesting, so no per-level arithmetic or inline style is needed. Label and description truncate with an ellipsis on one line.

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Structure (WAI-ARIA tree pattern): the tree is a `<ul role="tree">` named by `ariaLabel`, inside the root wrapper that carries `data-testid` and `$attrs`. Each node is an `<li role="treeitem">` with `aria-level` (1-based), `aria-setsize` and `aria-posinset` (among its siblings), and `aria-labelledby` pointing at its label region (ids from `useId()`), so the name excludes the children and the actions. A parent carries `aria-expanded="true|false"` and, when expanded, renders its children in a nested `<ul role="group">` inside its `<li>`. Leaves carry no `aria-expanded`.
- Selection: while `selectable`, every treeitem carries `aria-selected="true|false"`; otherwise none does. `aria-multiselectable` is not set (single selection).
- Disabled: a disabled node carries `aria-disabled="true"`.
- Roving tabindex: exactly one treeitem has `tabindex="0"`, every other `-1`. The tab stop is the selected node when it is visible, else the last focused node when visible, else the first node. When the tab-stop node is hidden by a collapse (from the keyboard or from a `v-model:expanded` change), the tab stop moves to its nearest visible ancestor. Clicking a row moves the tab stop and focus to it.
- Keyboard map (required, on the focused treeitem):
  - `ArrowDown` / `ArrowUp` — focus the next / previous visible node, without wrapping.
  - `ArrowRight` — on a collapsed parent, expand it (focus stays); on an expanded parent, focus its first child; on a leaf, nothing.
  - `ArrowLeft` — on an expanded parent, collapse it (focus stays); otherwise focus the parent node; on a top-level collapsed parent or leaf, nothing.
  - `Home` / `End` — focus the first / last visible node.
  - `Enter` / `Space` — activate the node: select it when `selectable`, then emit `item-click`; nothing on a disabled node. `Space` does not scroll the page.
  - `Tab` / `Shift+Tab` — leave the tree from the tab stop, passing through the focused row's `actions` controls (their natural tab order).
  - Arrow keys, `*` and type-ahead are not handled inside the `actions` region; `*` (expand siblings) and type-ahead are not part of v1.
- Chevron: a `<button type="button" tabindex="-1" aria-hidden="true">` that toggles the parent on click (pointer affordance; keyboard expansion is ArrowRight / ArrowLeft on the treeitem). It never receives focus and is not announced.
- Visible focus: the ring is drawn on the focused node's own row, not around its whole subtree — `focus-visible:outline-none` on the treeitem and `ring-2 ring-(--ring-color) ring-offset-1 ring-offset-(--bg-canvas)` on its direct row child (an arbitrary variant scoped to `:focus-visible > row`).
- Loading: the root carries `aria-busy="true"`; the Skeleton rows are `aria-hidden`, and no `role="tree"` is rendered without treeitems.
- Glyphs (`item.icon`), the chevron and the indent guide are decorative (`aria-hidden="true"`).
- Contrast ≥4.5:1 for label and description on the canvas, the hover fill and `var(--bg-selected)` in both themes; disabled text follows the disabled-token exemption.
- `motion-reduce:transition-none` on the chevron and selection transitions; `motion-reduce:before:transition-none` on the hover layer.
- Touch target: rows are 32px tall and full width (the same deviation as `bar-list`), justified by row density in file trees; the whole row is the activation target and the chevron box extends to the row height.

## Stories (Storybook)

- Default — a bucket-like file tree (folders with nested files three levels deep, glyphs and size descriptions) with one folder seeded in `v-model:expanded`.
- Selectable — `selectable` with `v-model:selected` bound and the selected id shown beside the tree; justified because selection changes the row state, the ARIA (`aria-selected`) and the activation behavior.
- Custom Item — the `item` slot rendering the label with a `Tag` (status) and the `actions` slot rendering an `IconButton` per row; justified because the two scoped slots are the component's only customization surface and need a worked, copy-paste example.
- Loading — `loading`.
- Empty — `items` empty, showing the default `EmptyState` with `emptyTitle` / `emptyDescription`; justified because the empty state is a distinct presentation owned by the component.

## Open questions

Decisions taken in this draft that a reviewer should confirm before approval:

1. **Row click on a parent does not toggle it.** Activation (click, Enter, Space) selects and emits `item-click`; expansion is the chevron and ArrowRight / ArrowLeft. File-explorer trees (VS Code) toggle folders on row click — confirm the Cloudscape-style split is wanted, or add a toggle-on-activate rule for parents when not `selectable`.
2. **No children reveal animation in v1.** The group appears instantly; a height reveal would need the JS-driven `<Transition>` pattern `accordion` uses. Confirm instant is acceptable.
3. **Indent guide lines are on**, as a `var(--border-muted)` hairline per nested group. Drop them if the design wants a cleaner Vercel-style tree.
4. **`actions` controls stay in the natural Tab order**, always visible (no hover reveal, so touch users see them). In a large tree, Tab walks every visible row's actions; the formal fix is the `treegrid` pattern, out of scope for v1.
5. **Disabled parents still expand and collapse**, so enabled descendants stay reachable. Confirm, or make `disabled` freeze expansion too.
6. **Lazy children (load on expand)** are out of scope: the tree renders the `items` it is given; an app that loads children on demand listens to `update:expanded` and patches `items`. A per-node loading state would need a new `TreeItem` field.
7. **`emptyTitle` default** is `'No items'` (bar-list and donut-chart use `'No data available'`); align with the console microcopy standard if it differs.
8. **`item` slot scope** carries `{ item, level, expanded }` per the brief; a `selected` key may be wanted for custom selected styling.

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
