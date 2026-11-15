# Tree

> A hierarchical list of nodes, each row a name with an optional glyph and one line of detail, where a parent row folds its children open and closed under a chevron. It renders a nested `items` data structure on its own (recursively, through one internal row template) and follows the WAI-ARIA tree pattern, so it fits file and object browsers: the objects of a bucket, the source files of a deployment, the routes of an application. Unlike `sidebar-menu` it navigates data, not the app, and unlike `accordion` its nodes are rows of the same kind at any depth, not panels of free content.

- Import: `import Tree from '@aziontech/webkit/tree'`
- Category: data · Surface: product · Structure: monolithic
- API as JSON: [tree.json](https://github.com/aziontech/webkit/blob/main/.specs/tree.json)

## When to use

- Use Tree for a nested data hierarchy (files, resources) the person expands and selects in, not for app navigation; for the navigation tree of the app use SidebarMenu inside Sidebar.
- Browsing a hierarchy whose depth is not fixed: bucket objects under folders, the source tree of a deployment, functions grouped by application.
- Picking one node out of a hierarchy (`selectable`) to show its detail beside the tree, or several (`selectable="multiple"`) to act on them together (move, delete, download).
- A hierarchy too large to send at once: mark unloaded parents `lazy` and fetch their children when they open.
- A file browser where people rename nodes where they are (`editable`) and open a node with a double-click (`item-dblclick`).
- A hierarchy the user expands piece by piece, where showing every level at once would bury the node they are after.

## Do

- Give every node an `id` that is unique across the whole tree, not only among its siblings; `v-model:expanded`, `v-model:selected` and focus are keyed by it.
- Seed `v-model:expanded` with the path to the node the user is most likely after (the open folder, the selected file), not with every parent.
- Keep labels short and put secondary detail (size, count, modified date) in `description` so rows scan as names first.
- Use `selectable` only when the selection drives something on the screen (a detail pane, a preview); for a tree whose rows only lead somewhere, listen to `item-click` instead.
- Put per-row controls in the `actions` slot (an `IconButton` that opens a `dropdown`), never inside the `item` slot, so they do not take over the row's activation.
- For children loaded on demand, mark the node `lazy`, listen to `update:expanded`, set `loading` on the node while the request runs, then patch `children` in (an empty array when it has none) and clear `loading`.
- With `editable`, apply the new label from the `rename` event yourself (the tree does not mutate `items`); offer a `Rename` entry in the row actions that calls the exposed `startRename(id)` so the feature is discoverable beyond F2.
- Use `item-dblclick` for a secondary "open" action only; single click and Enter stay `item-click`, so nothing requires a double-click.

## Don’t

- Navigation between views of the app → use `sidebar-menu` inside `sidebar`.
- Flat records with several attributes each → use `table`.
- A few sections of free content that open and close → use `accordion`.
- A two- or three-level directory of destinations on a marketing page → use `column-navigation`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [table](table.md) — the flat, multi-column view of the same records; switch to it when columns matter more than nesting.
- [sidebar-menu](sidebar-menu.md) — the hierarchical list for app navigation, with routes and active state instead of selection.
- [accordion](accordion.md) — disclosure of free content panels rather than rows of one kind.
- [empty-state](empty-state.md) — what the tree renders when `items` is empty.
- [skeleton](skeleton.md) — the rows the tree renders while `loading`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `TreeItem[]` | `[]` | false | Nodes to render; each is `{ id: string; label: string; icon?: string; description?: string; disabled?: boolean; children?: TreeItem[] }`. A node with a non-empty `children` array is a parent. |
| `selectable` | `boolean \| TreeSelectable` | `false` | false | Enables selection: `true` or `'single'` writes one id to `v-model:selected`; `'multiple'` writes ids to `v-model:selected-ids`. Every treeitem then carries `aria-selected`. |
| `editable` | `boolean` | `false` | false | Lets the user rename a node in place with F2, or through the exposed `startRename(id)`; the result arrives as the `rename` event. |
| `loading` | `boolean` | `false` | false | Renders Skeleton rows in place of the tree and sets `aria-busy`. |
| `emptyTitle` | `string` | `''` | false | Title of the default empty state shown when `items` is empty. Empty uses the locale catalog (`No items`). |
| `emptyDescription` | `string` | `''` | false | Supporting line under the empty title. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the tree. Empty uses the locale catalog (`tree.label`, `Tree`), so the `tree` role always has a name. |
| `expanded` | `string[]` | `() => []` | false | Two-way value (`v-model:expanded`). |
| `selected` | `string` | `''` | false | Two-way value (`v-model:selected`). |
| `selectedIds` | `string[]` | `() => []` | false | Two-way value (`v-model:selectedIds`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `item-click` | `(event: MouseEvent \| KeyboardEvent, item: TreeItem)` | A node activated: click on its row, or Enter / Space on the focused node. `item` is the consumer's own node object. Fires after `update:selected` when `selectable`. Not fired for a `disabled` node, nor for a click on the chevron, inside the `actions` region or in the rename field. With `selectable="multiple"`, Space toggles selection without firing it. |
| `item-dblclick` | `(event: MouseEvent, item: TreeItem)` | A row was double-clicked, to open or preview the node. Not fired for a `disabled` node, the chevron, the `actions` region or the rename field. The two clicks before it still fire `item-click`. |
| `rename` | `(event: KeyboardEvent \| FocusEvent, payload: TreeRenamePayload)` | An in-place rename was submitted (Enter, or the field losing focus) with a trimmed label that is non-empty and differs from `item.label`. `payload.item` is the consumer's node. Escape, an empty label or an unchanged one closes the field without emitting. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `item` | { item: TreeItem; level: number; expanded: boolean } | Replaces the label region of every row (glyph + label + description). The fallback inside the slot renders `item.icon`, `item.label` and `item.description`. `level` is 1 for top-level nodes; `expanded` is false for leaves. The chevron, indentation, row states and the `actions` region stay owned by the tree. |
| `actions` | { item: TreeItem; level: number } | Trailing per-row controls, end-aligned in the row (e.g. an `IconButton` that opens a `dropdown`). Clicks and keys inside it do not activate the row nor move tree focus. No fallback; when unused, the region is not rendered. |
| `empty` | — | Replaces the default empty state. The fallback inside the slot is `EmptyState` titled by `emptyTitle` with `emptyDescription`. |

## v-model

| Model                  | Type       | Default | Emits                | Notes                                                                                                                                                                                                                                                                                                                               |
| ---------------------- | ---------- | ------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:expanded`     | `string[]` | `[]`    | `update:expanded`    | Ids of the expanded parents, via `defineModel<string[]>('expanded', { default: () => [] })`. Uncontrolled when unbound. Ids of leaves or of unknown nodes are ignored. Collapsing a parent removes only its own id: descendants keep theirs, so re-expanding restores the subtree as it was. Always emits a new array.              |
| `v-model:selected-ids` | `string[]` | `[]`    | `update:selectedIds` | Ids of the selected nodes while `selectable="multiple"`, via `defineModel<string[]>('selectedIds', { default: () => [] })`. Ordered by selection (range and select-all in visible order), without duplicates; emits only when the set changes. Disabled nodes are never added.                                                      |
| `v-model:selected`     | `string`   | `''`    | `update:selected`    | Id of the selected node, via `defineModel<string>('selected', { default: '' })`. Written only while `selectable`; read only while `selectable` (otherwise no node is marked selected). `''` means nothing is selected. Emits only when the id changes. Single selection only; activating the selected node again does not clear it. |

## States

- Visual states: `default`; row `hover`, `focus-visible`, `selected`, `disabled`; parent `expanded` / `collapsed`; `loading` (Skeleton rows); `empty` (`EmptyState`).
- Precedence: `loading` → Skeleton rows, else `items` empty → `empty` slot, else the tree.
- `data-loading` on the root mirrors `loading`; `data-empty` on the root when `items` is empty and not loading.
- `data-selectable` on the root while selection is on; `data-multiple` while `selectable="multiple"`.
- Lazy loading: a `lazy` node is a parent (chevron, `aria-expanded`) even with no `children`; while it is expanded and `loading`, its group renders one loading row — a Skeleton bar plus a visually hidden `role="status"` reading the locale's `tree.loadingChildren` (`Loading`) — instead of the children, and carries `aria-busy="true"`. The loading row is not a treeitem and is not part of keyboard navigation (`<testId>__loading`).
- Renaming: the label region of the node being renamed is a text field (`<testId>__rename`, `data-tree-rename`), focused with its text selected; the chevron, glyph slot and `actions` stay. One field at a time.
- `data-state="open|closed"` on each parent row and its chevron (drives the rotation); absent on leaves. The tree is not an overlay, so this is disclosure state only.
- `data-selected` on the selected row (only while `selectable`); `data-disabled` on a disabled row.
- Collapsed children are not rendered (`v-if`), so they cost nothing and are out of the accessibility tree.
- A disabled node can still be focused (arrow keys) and, if it is a parent, expanded and collapsed; it cannot be selected, renamed, or emit `item-click` / `item-dblclick`.
- `data-testid`: the root falls back to `data-tree` (a consumer `data-testid` wins); parts derive from the resolved root id — `<testId>__item` on every treeitem, `<testId>__toggle` on every chevron. Each treeitem also carries `data-item-id="<item.id>"` so a test reaches one node without depending on DOM order.
- Loading renders five Skeleton rows (`kind="rectangle"`, row height, descending widths) at top level.

## Accessibility

- Structure (WAI-ARIA tree pattern): the tree is a `<ul role="tree">` named by `ariaLabel` (or `tree.label` when it is empty), inside the root wrapper that carries `data-testid` and `$attrs`. Each node is an `<li role="treeitem">` with `aria-level` (1-based), `aria-setsize` and `aria-posinset` (among its siblings), and `aria-labelledby` pointing at its label region (ids from `useId()`), so the name excludes the children and the actions. A parent carries `aria-expanded="true|false"` and, when expanded, renders its children in a nested `<ul role="group">` inside its `<li>`. Leaves carry no `aria-expanded`.
- Selection: while `selectable`, every treeitem carries `aria-selected="true|false"`; otherwise none does. With `selectable="multiple"` the tree carries `aria-multiselectable="true"`.
- Disabled: a disabled node carries `aria-disabled="true"`.
- Roving tabindex: exactly one treeitem has `tabindex="0"`, every other `-1`. The tab stop is the selected node when it is visible, else the last focused node when visible, else the first node. When the tab-stop node is hidden by a collapse (from the keyboard or from a `v-model:expanded` change), the tab stop moves to its nearest visible ancestor. Clicking a row moves the tab stop and focus to it.
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
- Double-click is never the only way: `item-dblclick` duplicates an action the app also offers through `item-click`, `Enter` or the row actions.
- Contrast ≥4.5:1 for label and description on the canvas, the hover fill and `var(--bg-selected)` in both themes; disabled text follows the disabled-token exemption.
- `motion-reduce:transition-none` on the chevron and selection transitions; `motion-reduce:before:transition-none` on the hover layer.
- Touch target: rows are 32px tall and full width (the same deviation as `bar-list`), justified by row density in file trees; the whole row is the activation target and the chevron box extends to the row height.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the expand caret mirrors (`rtl:-scale-x-100`) and rotates the other way when open (`rtl:data-[state=open]:-rotate-90`).
- Keyboard: `ArrowRight` expands a node or moves to its first child and `ArrowLeft` collapses it or moves to the parent, swapped under `dir="rtl"` (`logicalArrowKey`).
- User data: node labels are text; file names and IDs in another script keep their own direction.

## Internationalization

- Strings come from the locale catalog: `tree.emptyTitle` (`No items`), `tree.loadingChildren` (`Loading`), `tree.renameLabel` (`Rename {label}`), in `en`, `pt-BR` and `es`. Node labels and descriptions are the consumer's data.
- Labels and descriptions truncate on one line; the rename field takes the full label width.

## Responsive

- The tree fills its container's width; rows stay 32 px tall at every width and long labels truncate.
- Row actions stay visible on touch (no hover reveal); on narrow containers prefer a single `IconButton` that opens a `dropdown`.

## Examples

### Default

```vue
<script setup>
  import Tree from '@aziontech/webkit/tree'
  import { ref } from 'vue'

  const items = [
    {
      id: 'assets',
      label: 'assets',
      icon: 'ai ai-folder',
      children: [
        {
          id: 'assets/images',
          label: 'images',
          icon: 'ai ai-folder',
          children: [
            {
              id: 'assets/images/hero.webp',
              label: 'hero.webp',
              icon: 'ai ai-file',
              description: '248 KB'
            },
            {
              id: 'assets/images/logo.svg',
              label: 'logo.svg',
              icon: 'ai ai-file',
              description: '12 KB'
            }
          ]
        },
        {
          id: 'assets/fonts',
          label: 'fonts',
          icon: 'ai ai-folder',
          children: [
            {
              id: 'assets/fonts/rubik.woff2',
              label: 'rubik.woff2',
              icon: 'ai ai-file',
              description: '64 KB'
            }
          ]
        },
        {
          id: 'assets/styles.css',
          label: 'styles.css',
          icon: 'ai ai-file',
          description: '18 KB'
        }
      ]
    },
    {
      id: 'reports',
      label: 'reports',
      icon: 'ai ai-folder',
      children: [
        {
          id: 'reports/2026-10.csv',
          label: '2026-10.csv',
          icon: 'ai ai-file',
          description: '1.2 MB'
        },
        {
          id: 'reports/2026-11.csv',
          label: '2026-11.csv',
          icon: 'ai ai-file',
          description: '840 KB'
        }
      ]
    },
    {
      id: 'index.html',
      label: 'index.html',
      icon: 'ai ai-file',
      description: '4 KB'
    },
    {
      id: 'robots.txt',
      label: 'robots.txt',
      icon: 'ai ai-file',
      description: '1 KB'
    }
  ]

  const expanded = ref(['assets', 'assets/images'])
</script>

<template>
  <div class="max-w-(--container-sm)">
    <Tree
      v-model:expanded="expanded"
      :items="items"
      aria-label="Bucket objects"
    />
  </div>
</template>
```

### Selectable

```vue
<script setup>
  import Tree from '@aziontech/webkit/tree'
  import { ref } from 'vue'

  const items = [
    {
      id: 'assets',
      label: 'assets',
      icon: 'ai ai-folder',
      children: [
        {
          id: 'assets/images',
          label: 'images',
          icon: 'ai ai-folder',
          children: [
            {
              id: 'assets/images/hero.webp',
              label: 'hero.webp',
              icon: 'ai ai-file',
              description: '248 KB'
            },
            {
              id: 'assets/images/logo.svg',
              label: 'logo.svg',
              icon: 'ai ai-file',
              description: '12 KB'
            }
          ]
        },
        {
          id: 'assets/fonts',
          label: 'fonts',
          icon: 'ai ai-folder',
          children: [
            {
              id: 'assets/fonts/rubik.woff2',
              label: 'rubik.woff2',
              icon: 'ai ai-file',
              description: '64 KB'
            }
          ]
        },
        {
          id: 'assets/styles.css',
          label: 'styles.css',
          icon: 'ai ai-file',
          description: '18 KB'
        }
      ]
    },
    {
      id: 'reports',
      label: 'reports',
      icon: 'ai ai-folder',
      children: [
        {
          id: 'reports/2026-10.csv',
          label: '2026-10.csv',
          icon: 'ai ai-file',
          description: '1.2 MB'
        },
        {
          id: 'reports/2026-11.csv',
          label: '2026-11.csv',
          icon: 'ai ai-file',
          description: '840 KB'
        }
      ]
    },
    {
      id: 'index.html',
      label: 'index.html',
      icon: 'ai ai-file',
      description: '4 KB'
    },
    {
      id: 'robots.txt',
      label: 'robots.txt',
      icon: 'ai ai-file',
      description: '1 KB'
    }
  ]

  const expanded = ref(['assets', 'assets/images'])
  const selected = ref('assets/images/hero.webp')
</script>

<template>
  <div class="flex max-w-(--container-sm) flex-col gap-(--spacing-md)">
    <Tree
      v-model:expanded="expanded"
      v-model:selected="selected"
      :items="items"
      selectable
      aria-label="Bucket objects"
    />
    <p class="text-body-sm text-(--text-muted)">Selected: {{ selected || 'none' }}</p>
  </div>
</template>
```

### CustomItem

```vue
<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
  import Tag from '@aziontech/webkit/tag'
  import Tree from '@aziontech/webkit/tree'
  import { ref } from 'vue'

  const items = [
    {
      id: 'assets',
      label: 'assets',
      icon: 'ai ai-folder',
      children: [
        {
          id: 'assets/images',
          label: 'images',
          icon: 'ai ai-folder',
          children: [
            {
              id: 'assets/images/hero.webp',
              label: 'hero.webp',
              icon: 'ai ai-file',
              description: '248 KB'
            },
            {
              id: 'assets/images/logo.svg',
              label: 'logo.svg',
              icon: 'ai ai-file',
              description: '12 KB'
            }
          ]
        },
        {
          id: 'assets/fonts',
          label: 'fonts',
          icon: 'ai ai-folder',
          children: [
            {
              id: 'assets/fonts/rubik.woff2',
              label: 'rubik.woff2',
              icon: 'ai ai-file',
              description: '64 KB'
            }
          ]
        },
        {
          id: 'assets/styles.css',
          label: 'styles.css',
          icon: 'ai ai-file',
          description: '18 KB'
        }
      ]
    },
    {
      id: 'reports',
      label: 'reports',
      icon: 'ai ai-folder',
      children: [
        {
          id: 'reports/2026-10.csv',
          label: '2026-10.csv',
          icon: 'ai ai-file',
          description: '1.2 MB'
        },
        {
          id: 'reports/2026-11.csv',
          label: '2026-11.csv',
          icon: 'ai ai-file',
          description: '840 KB'
        }
      ]
    },
    {
      id: 'index.html',
      label: 'index.html',
      icon: 'ai ai-file',
      description: '4 KB'
    },
    {
      id: 'robots.txt',
      label: 'robots.txt',
      icon: 'ai ai-file',
      description: '1 KB'
    }
  ]

  const expanded = ref(['assets', 'assets/images'])

  const statuses = {
    'assets/styles.css': {
      label: 'Modified',
      severity: 'warning'
    },
    'index.html': {
      label: 'Published',
      severity: 'success'
    },
    'robots.txt': {
      label: 'Draft',
      severity: 'neutral'
    }
  }
</script>

<template>
  <div class="max-w-(--container-sm)">
    <Tree
      v-model:expanded="expanded"
      :items="items"
      aria-label="Bucket objects"
    >
      <template #item="{ item }">
        <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xs)">
          <i
            :class="item.icon"
            aria-hidden="true"
          />
          <span class="min-w-0 truncate text-label-md text-(--text-default)">{{ item.label }}</span>
          <Tag
            v-if="statuses[item.id]"
            :label="statuses[item.id].label"
            :severity="statuses[item.id].severity"
            size="small"
          />
        </span>
      </template>
      <template #actions="{ item }">
        <IconButton
          icon="ai ai-ellipsis-h"
          kind="transparent"
          size="small"
          :aria-label="'More actions for ' + item.label"
        />
      </template>
    </Tree>
  </div>
</template>
```
