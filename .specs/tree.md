---
name: tree
category: data
structure: monolithic
status: implemented
checksum: 39cbb788c938d0b91b3997d992e8ccec237291a8495166baa845b90433da06af
spec_version: 12
template: 2
created: 2026-11-10
last_updated: 2026-11-16
---

# Tree — Component Spec

## Purpose

A hierarchical list of nodes, each row a name with an optional glyph and one line of detail, where a parent row folds its children open and closed under a chevron. It renders a nested `items` data structure on its own (recursively, through one internal row template) and follows the WAI-ARIA tree pattern, so it fits file and object browsers: the objects of a bucket, the source files of a deployment, the routes of an application. Unlike `sidebar-menu` it navigates data, not the app, and unlike `accordion` its nodes are rows of the same kind at any depth, not panels of free content.

## When to use

- Use Tree for a nested data hierarchy (files, resources) the person expands and selects in, not for app navigation; for the navigation tree of the app use SidebarMenu inside Sidebar.
- Browsing a hierarchy whose depth is not fixed: bucket objects under folders, the source tree of a deployment, functions grouped by application.
- Picking one node out of a hierarchy (`selectable`) to show its detail beside the tree, or several (`selectable="multiple"`) to act on them together (move, delete, download).
- A hierarchy too large to send at once: mark unloaded parents `lazy` and fetch their children when they open.
- A file browser where people rename nodes where they are (`editable`) and open a node with a double-click (`item-double-click`).
- A hierarchy the user expands piece by piece, where showing every level at once would bury the node they are after.

## When NOT to use

- Navigation between views of the app → use `sidebar-menu` inside `sidebar`.
- Flat records with several attributes each → use `table`.
- A few sections of free content that open and close → use `accordion`.
- A two- or three-level directory of destinations on a marketing page → use `link-directory`.

## Related

- `table` — the flat, multi-column view of the same records; switch to it when columns matter more than nesting.
- `sidebar-menu` — the hierarchical list for app navigation, with routes and active state instead of selection.
- `accordion` — disclosure of free content panels rather than rows of one kind.
- `empty-state` — what the tree renders when `items` is empty.
- `skeleton` — the rows the tree renders while `loading`.

## Best practices

- Give every node an `id` that is unique across the whole tree, not only among its siblings; `v-model:open-keys`, `v-model:selected-key` and focus are keyed by it.
- Seed `v-model:open-keys` with the path to the node the user is most likely after (the open folder, the selected file), not with every parent.
- Keep labels short and put secondary detail (size, count, modified date) in `description` so rows scan as names first.
- Use `selectable` only when the selection drives something on the screen (a detail pane, a preview); for a tree whose rows only lead somewhere, listen to `item-click` instead.
- Put per-row controls in the `actions` slot (an `IconButton` that opens a `dropdown`), never inside the `item` slot, so they do not take over the row's activation.
- For children loaded on demand, mark the node `lazy`, listen to `update:openKeys`, set `loading` on the node while the request runs, then patch `children` in (an empty array when it has none) and clear `loading`.
- With `editable`, apply the new label from the `rename` event yourself (the tree does not mutate `items`); offer a `Rename` entry in the row actions that calls the exposed `startRename(id)` so the feature is discoverable beyond F2.
- Use `item-double-click` for a secondary "open" action only; single click and Enter stay `item-click`, so nothing requires a double-click.

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
      icon: 'ai ai-folder',
      children: [
        { id: 'assets/logo.svg', label: 'logo.svg', icon: 'ai ai-image', description: '4.2 KB' },
        { id: 'assets/hero.webp', label: 'hero.webp', icon: 'ai ai-image', description: '182 KB' }
      ]
    },
    {
      id: 'src',
      label: 'src',
      icon: 'ai ai-folder',
      children: [
        { id: 'src/index.js', label: 'index.js', icon: 'ai ai-file', description: '1.1 KB' }
      ]
    },
    { id: 'azion.config.js', label: 'azion.config.js', icon: 'ai ai-file', description: '612 B' }
  ]
</script>

<template>
  <Tree
    v-model:open-keys="expanded"
    aria-label="Bucket objects"
    :items="items"
  />
</template>
```

## Props

| Prop               | Type                        | Default | Required | JSDoc                                                                                                                                                                                           |
| ------------------ | --------------------------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`            | `TreeItem[]`                | `[]`    | false    | Nodes to render; each is `{ id: string; label: string; icon?: string; description?: string; disabled?: boolean; children?: TreeItem[] }`. A node with a non-empty `children` array is a parent. |
| `selectable`       | `boolean \| TreeSelectable` | `false` | false    | Enables selection: `true` or `'single'` writes one id to `v-model:selected`; `'multiple'` writes ids to `v-model:selected-keys`. Every treeitem then carries `aria-selected`.                   |
| `editable`         | `boolean`                   | `false` | false    | Lets the user rename a node in place with F2, or through the exposed `startRename(id)`; the result arrives as the `rename` event.                                                               |
| `loading`          | `boolean`                   | `false` | false    | Renders Skeleton rows in place of the tree and sets `aria-busy`.                                                                                                                                |
| `emptyTitle`       | `string`                    | `''`    | false    | Title of the default empty state shown when `items` is empty. Empty uses the locale catalog (`No items`).                                                                                       |
| `emptyDescription` | `string`                    | `''`    | false    | Supporting line under the empty title.                                                                                                                                                          |
| `ariaLabel`        | `string`                    | `''`    | false    | Accessible name of the tree. Empty uses the locale catalog (`tree.label`, `Tree`), so the `tree` role always has a name.                                                                        |

Exported types (declared in `tree.vue` with `export type`): `TreeItem` = `{ id: string; label: string; icon?: string; description?: string; disabled?: boolean; children?: TreeItem[]; lazy?: boolean; loading?: boolean }` — `lazy` makes a node a parent before its `children` exist, `loading` renders a loading row in place of the children while the node is expanded; `TreeSelectable` = `'single' | 'multiple'`; `TreeRenamePayload` = `{ item: TreeItem; label: string }`. `icon` is an icon class string (`ai ai-folder`, `ai ai-…`), the same convention `empty-state` uses.

## v-model

| Model                   | Type       | Default | Emits                 | Notes                                                                                                                                                                                                                                                                                                                                  |
| ----------------------- | ---------- | ------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:open-keys`     | `string[]` | `[]`    | `update:openKeys`     | Ids of the open parents, via `defineModel<string[]>('openKeys', { default: () => [] })`. Uncontrolled when unbound. Ids of leaves or of unknown nodes are ignored. Collapsing a parent removes only its own id: descendants keep theirs, so re-expanding restores the subtree as it was. Always emits a new array.                     |
| `v-model:selected-keys` | `string[]` | `[]`    | `update:selectedKeys` | Ids of the selected nodes while `selectable="multiple"`, via `defineModel<string[]>('selectedKeys', { default: () => [] })`. Ordered by selection (range and select-all in visible order), without duplicates; emits only when the set changes. Disabled nodes are never added.                                                        |
| `v-model:selectedKey`   | `string`   | `''`    | `update:selectedKey`  | Id of the selected node, via `defineModel<string>('selectedKey', { default: '' })`. Written only while `selectable`; read only while `selectable` (otherwise no node is marked selected). `''` means nothing is selected. Emits only when the id changes. Single selection only; activating the selected node again does not clear it. |

## Events

| Event               | Payload                                                            | Notes                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `item-click`        | `(event: MouseEvent \| KeyboardEvent, item: TreeItem)`             | A node activated: click on its row, or Enter / Space on the focused node. `item` is the consumer's own node object. Fires after `update:selectedKey` when `selectable`. Not fired for a `disabled` node, nor for a click on the chevron, inside the `actions` region or in the rename field. With `selectable="multiple"`, Space toggles selection without firing it. |
| `item-double-click` | `(event: MouseEvent, item: TreeItem)`                              | A row was double-clicked, to open or preview the node. Not fired for a `disabled` node, the chevron, the `actions` region or the rename field. The two clicks before it still fire `item-click`.                                                                                                                                                                      |
| `rename`            | `(event: KeyboardEvent \| FocusEvent, payload: TreeRenamePayload)` | An in-place rename was submitted (Enter, or the field losing focus) with a trimmed label that is non-empty and differs from `item.label`. `payload.item` is the consumer's node. Escape, an empty label or an unchanged one closes the field without emitting.                                                                                                        |

## Slots

| Slot      | Scope                                                  | Notes                                                                                                                                                                                                                                                                                                                |
| --------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `item`    | `{ item: TreeItem; level: number; expanded: boolean }` | Replaces the label region of every row (glyph + label + description). The fallback inside the slot renders `item.icon`, `item.label` and `item.description`. `level` is 1 for top-level nodes; `expanded` is false for leaves. The chevron, indentation, row states and the `actions` region stay owned by the tree. |
| `actions` | `{ item: TreeItem; level: number }`                    | Trailing per-row controls, end-aligned in the row (e.g. an `IconButton` that opens a `dropdown`). Clicks and keys inside it do not activate the row nor move tree focus. No fallback; when unused, the region is not rendered.                                                                                       |
| `empty`   | —                                                      | Replaces the default empty state. The fallback inside the slot is `EmptyState` titled by `emptyTitle` with `emptyDescription`.                                                                                                                                                                                       |

## Exposed

| Method            | Notes                                                                                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `startRename(id)` | Opens the rename field on the node with this id when `editable` and the node is not disabled; for a `Rename` entry in the row actions. Needs no visible node. |

## States

- Visual states: `default`; row `hover`, `focus-visible`, `selected`, `disabled`; parent `expanded` / `collapsed`; `loading` (Skeleton rows); `empty` (`EmptyState`).
- Precedence: `loading` → Skeleton rows, else `items` empty → `empty` slot, else the tree.
- `data-loading` on the root mirrors `loading`; `data-empty` on the root when `items` is empty and not loading.
- `data-selectable` on the root while selection is on; `data-multiple` while `selectable="multiple"`.
- Lazy loading: a `lazy` node is a parent (chevron, `aria-expanded`) even with no `children`; while it is expanded and `loading`, its group renders one loading row — a Skeleton bar plus a visually hidden `role="status"` reading the locale's `tree.loadingChildren` (`Loading`) — instead of the children, and carries `aria-busy="true"`. The loading row is not a treeitem and is not part of keyboard navigation (`<testId>__loading`).
- Renaming: the label region of the node being renamed is a text field (`<testId>__rename`, `data-slot="tree-rename"`), focused with its text selected; the chevron, glyph slot and `actions` stay. One field at a time.
- `data-state="open|closed"` on each parent row and its chevron (drives the rotation); absent on leaves. The tree is not an overlay, so this is disclosure state only.
- `data-selected` on the selected row (only while `selectable`); `data-disabled` on a disabled row.
- Collapsed children are not rendered (`v-if`), so they cost nothing and are out of the accessibility tree.
- A disabled node can still be focused (arrow keys) and, if it is a parent, expanded and collapsed; it cannot be selected, renamed, or emit `item-click` / `item-double-click`.
- `data-testid`: the root falls back to `data-tree` (a consumer `data-testid` wins); parts derive from the resolved root id — `<testId>__item` on every treeitem, `<testId>__toggle` on every chevron. Each treeitem also carries `data-item-id="<item.id>"` so a test reaches one node without depending on DOM order.
- Loading renders five Skeleton rows (`variant="rectangle"`, row height, descending widths) at top level.

## Motion & Animations

| Trigger                            | Animation / Transition                                                                                                       | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------- |
| parent expand / collapse (chevron) | `transition-[rotate] duration-fast-02 ease-productive-entrance` + `data-[state=open]:rotate-90` on the chevron glyph         | `fast-02` · `productive-entrance`                 | `motion-reduce:transition-none`        |
| row hover                          | ghost layer `before:transition-opacity before:duration-fast-02 before:ease-productive-entrance` + `hover:before:opacity-100` | `fast-02` · `productive-entrance`                 | `motion-reduce:before:transition-none` |
| row selected change                | `transition-colors duration-fast-02 ease-productive-entrance`                                                                | `fast-02` · `productive-entrance`                 | `motion-reduce:transition-none`        |

The chevron transition names `rotate`, not `transform`: Tailwind v4 compiles `rotate-90` to the standalone `rotate` property (see `.claude/rules/styling.md` § Transitioning a transform). The children group appears and disappears instantly; no height reveal in v1 (see Open questions). The loading shimmer belongs to the composed `Skeleton`, which already suppresses it under reduced motion; Tree adds no animation for it.

## Tokens

| Region                                             | Token (DESIGN.md)                        |
| -------------------------------------------------- | ---------------------------------------- |
| label                                              | `.text-label-md`, `var(--text-default)`  |
| description                                        | `.text-label-sm`, `var(--text-muted)`    |
| glyph (item icon) and chevron                      | `var(--text-muted)`                      |
| disabled label, description, glyph                 | `var(--text-disabled)`                   |
| row hover (ghost layer)                            | `var(--bg-hover)`                        |
| row active (ghost layer)                           | `var(--bg-active)`                       |
| row selected                                       | `var(--bg-selected)`                     |
| row shape                                          | `var(--shape-control)`                   |
| row padding-x, gap between chevron / glyph / label | `var(--spacing-xs)`                      |
| gap between label and description                  | `var(--spacing-2xs)`                     |
| indentation per level (nested group margin-start)  | `var(--spacing-md)`                      |
| indent guide line (nested group border-start)      | `var(--border-muted)`                    |
| focus ring / ring offset                           | `var(--ring-color)` / `var(--bg-canvas)` |

Layout: each row is `min-h-8` (32px), full width of its group. The chevron and the glyph each sit in a 1rem box; a leaf reserves the chevron box empty so labels align across siblings. Each nested `role="group"` is indented by `ms-(--spacing-md)` (the row's `--spacing-xs` inset plus half the 1rem chevron box), which puts its hairline guide (`border-s`, `var(--border-muted)`) under the center of the parent's chevron and steps every level by 1rem plus the guide's hairline; the guide sits in the gutter before the nested rows' box edge, never under their hover or selected surface; indentation accumulates through nesting, so no per-level arithmetic or inline style is needed. Label and description truncate with an ellipsis on one line.

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Structure (WAI-ARIA tree pattern): the tree is a `<ul role="tree">` named by `ariaLabel` (or `tree.label` when it is empty), inside the root wrapper that carries `data-testid` and `$attrs`. Each node is an `<li role="treeitem">` with `aria-level` (1-based), `aria-setsize` and `aria-posinset` (among its siblings), and `aria-labelledby` pointing at its label region (ids from `useId()`), so the name excludes the children and the actions. A parent carries `aria-expanded="true|false"` and, when expanded, renders its children in a nested `<ul role="group">` inside its `<li>`. Leaves carry no `aria-expanded`.
- Selection: while `selectable`, every treeitem carries `aria-selected="true|false"`; otherwise none does. With `selectable="multiple"` the tree carries `aria-multiselectable="true"`.
- Disabled: a disabled node carries `aria-disabled="true"`.
- Roving tabindex: exactly one treeitem has `tabindex="0"`, every other `-1`. The tab stop is the selected node when it is visible, else the last focused node when visible, else the first node. When the tab-stop node is hidden by a collapse (from the keyboard or from a `v-model:open-keys` change), the tab stop moves to its nearest visible ancestor. Clicking a row moves the tab stop and focus to it.
- Keyboard map (required, on the focused treeitem):
  - `ArrowDown` / `ArrowUp` — focus the next / previous visible node, without wrapping.
  - `ArrowRight` — on a collapsed parent, expand it (focus stays); on an expanded parent, focus its first child; on a leaf, nothing.
  - `ArrowLeft` — on an expanded parent, collapse it (focus stays); otherwise focus the parent node; on a top-level collapsed parent or leaf, nothing.
  - `Home` / `End` — focus the first / last visible node.
  - `Enter` / `Space` — activate the node: select it when `selectable`, then emit `item-click`; nothing on a disabled node. `Space` does not scroll the page. With `selectable="multiple"`, `Enter` selects only the node and `Space` toggles it in the selection (no `item-click`).
  - `Shift+ArrowDown` / `Shift+ArrowUp` (multiple only) — move focus and add the node reached to the selection.
  - `Ctrl+A` / `Cmd+A` (multiple only) — select every visible, enabled node.
  - `F2` (`editable` only) — open the rename field on the focused node. In the field `Enter` submits, `Escape` cancels and both return focus to the node; leaving the field submits. Tree keys are not handled inside the field.
  - Pointer, multiple only: click selects only the node, `Ctrl`/`Cmd`+click toggles it, `Shift`+click selects the visible range from the last clicked node (adding to the selection with `Ctrl`/`Cmd`).
  - `Tab` / `Shift+Tab` — leave the tree from the tab stop; the tree is one tab stop.
  - Type-ahead — a printable character focuses the next visible node whose label starts with it; characters typed within 500 ms add up to a prefix. Tests: `tree.test.ts` › moves focus to the next visible node whose label starts with the typed text.
  - `*` (expand siblings) is not part of v1.
- Row actions (WAI-ARIA treegrid pattern): when the `actions` slot is used, the tree renders as a `<div role="treegrid">` so screen readers reach each row's controls. Each node's row is the focusable `role="row"` (carrying `aria-level`, `aria-setsize`, `aria-posinset`, `aria-expanded`, `aria-selected`, `aria-disabled`, `aria-labelledby` and the roving `tabindex`); it holds two `role="gridcell"`s: the label cell (chevron, glyph and label, `tabindex="-1"`) and the actions cell. The nesting wrappers (`li`, the children `ul`) are `role="none"`, so rows stay owned by the treegrid while the indent guide and the nested layout stay the same; the lazy loading row is a `role="row"` with `aria-busy`. Every `actions` control is parked at `tabindex="-1"` so the treegrid stays one tab stop. Keyboard map on top of the tree map:
  - On a row, `ArrowRight` expands a collapsed parent; on an expanded parent or a leaf it moves focus into the row's first cell (the label cell). `ArrowLeft` on a row behaves as in the tree.
  - In a row, `ArrowRight` / `ArrowLeft` move between the label cell and each `actions` control; `ArrowLeft` on the label cell, or `Escape` anywhere in the row, returns focus to the row. `ArrowDown` / `ArrowUp` move to the same cell of the next / previous visible row. `Enter` on the label cell activates the row; `Enter` / `Space` on a control are the control's own.
  - Without the `actions` slot the tree keeps the `tree` / `treeitem` / `group` structure above.
- Chevron: a `<button type="button" tabindex="-1" aria-hidden="true">` that toggles the parent on click (pointer affordance; keyboard expansion is ArrowRight / ArrowLeft on the treeitem). It never receives focus and is not announced.
- Visible focus: the ring is drawn on the focused node's own row (in the treegrid, on the focused row or cell), not around its whole subtree — `focus-visible:outline-none` on the treeitem and `ring-2 ring-(--ring-color) ring-offset-1 ring-offset-(--bg-canvas)` on its direct row child (an arbitrary variant scoped to `:focus-visible > row`).
- Loading: the root carries `aria-busy="true"`; the Skeleton rows are `aria-hidden`, and no `role="tree"` is rendered without treeitems.
- Glyphs (`item.icon`), the chevron and the indent guide are decorative (`aria-hidden="true"`).
- The rename field is named `Rename <label>` (`tree.renameLabel`); the loading row announces `Loading` once through its polite status.
- Double-click is never the only way: `item-double-click` duplicates an action the app also offers through `item-click`, `Enter` or the row actions.
- Contrast ≥4.5:1 for label and description on the canvas, the hover fill and `var(--bg-selected)` in both themes; disabled text follows the disabled-token exemption.
- `motion-reduce:transition-none` on the chevron and selection transitions; `motion-reduce:before:transition-none` on the hover layer.
- Touch target: rows are 32px tall and full width (the same deviation as `bar-list`), justified by row density in file trees; the whole row is the activation target and the chevron box extends to the row height.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the expand caret mirrors (`rtl:-scale-x-100`) and rotates the other way when open (`rtl:data-[state=open]:-rotate-90`).
- Keyboard: `ArrowRight` expands a node or moves to its first child and `ArrowLeft` collapses it or moves to the parent, swapped under `dir="rtl"` (`logicalArrowKey`).
- User data: node labels are text; file names and IDs in another script keep their own direction.

## Examples

- Default — a bucket-like file tree (folders with nested files three levels deep, glyphs and size descriptions) with one folder seeded in `v-model:open-keys`.
- Selectable — `selectable` with `v-model:selected-key` bound and the selected id shown beside the tree; justified because selection changes the row state, the ARIA (`aria-selected`) and the activation behavior.
- Custom Item — the `item` slot rendering the label with a `Tag` (status) and the `actions` slot rendering an `IconButton` per row; justified because the two scoped slots are the component's only customization surface and need a worked, copy-paste example.
- Loading — `loading`.
- Empty — `items` empty, showing the default `EmptyState` with `emptyTitle` / `emptyDescription`; justified because the empty state is a distinct presentation owned by the component.
- Lazy Children — `lazy` folders whose listings load on expand behind the loading row; justified because the loading row and the `update:openKeys` → patch flow are a distinct state and a copy-paste pattern.
- Rename — `editable` with F2, a per-row `Rename` `IconButton` calling `startRename`, and `item-double-click` opening a file; justified because the field, its keys and the exposed method need a worked example.
- Multi Select — `selectable="multiple"` with `v-model:selected-keys` and the count beside the tree; justified because multi-selection changes the ARIA, the keyboard map and the model.

## Open questions

Decisions taken in this draft that a reviewer should confirm before approval:

1. **Row click on a parent does not toggle it.** Activation (click, Enter, Space) selects and emits `item-click`; expansion is the chevron and ArrowRight / ArrowLeft. File-explorer trees (VS Code) toggle folders on row click — confirm the Cloudscape-style split is wanted, or add a toggle-on-activate rule for parents when not `selectable`.
2. **No children reveal animation in v1.** The group appears instantly; a height reveal would need the JS-driven `<Transition>` pattern `accordion` uses. Confirm instant is acceptable.
3. **Indent guide lines are on**, as a `var(--border-muted)` hairline per nested group. Drop them if the design wants a cleaner Vercel-style tree.
4. **Row actions use the `treegrid` pattern** (resolved in 6.0): with the `actions` slot the tree is a treegrid, the controls are reached with the arrow keys inside the row, and they stay always visible (no hover reveal, so touch users see them).
5. **Disabled parents still expand and collapse**, so enabled descendants stay reachable. Confirm, or make `disabled` freeze expansion too.
6. **Lazy children (load on expand)** — resolved in spec v2: `TreeItem.lazy` + `TreeItem.loading`; the app still owns the fetch (no data loading in the DS) and patches `items` from `update:openKeys`.
7. **Multi-select range anchor** is the last node clicked, toggled or Enter-activated; `Shift+Arrow` extends without moving it. Confirm against the console's file browser.
8. **Rename commits on blur** (the VS Code behavior). Confirm, or make blur cancel.
9. **`emptyTitle` default** is `'No items'` (bar-list and donut-chart use `'No data available'`); align with the console microcopy standard if it differs.
10. **`item` slot scope** carries `{ item, level, expanded }` per the brief; a `selected` key may be wanted for custom selected styling.

## Internationalization

- Strings come from the locale catalog: `tree.emptyTitle` (`No items`), `tree.loadingChildren` (`Loading`), `tree.renameLabel` (`Rename {label}`), in `en`, `pt-BR` and `es`. Node labels and descriptions are the consumer's data.
- Labels and descriptions truncate on one line; the rename field takes the full label width.

## Responsive

- The tree fills its container's width; rows stay 32 px tall at every width and long labels truncate.
- Row actions stay visible on touch (no hover reveal); on narrow containers prefer a single `IconButton` that opens a `dropdown`.

## Performance

- Collapsed children are not rendered, so the cost is the visible rows: the `tree-5k` budget (5k nodes, two folders expanded) and `tree-5k-multi-select` (1k visible rows, select all 5k ids) in `perf-budgets.json`.
- Multi-selection is a `Set` lookup per row; range selection walks the visible list once. A Shift+click across 1.2k visible nodes is covered by the component test.
- The loading row and the rename field render only for the node that needs them.

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
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
