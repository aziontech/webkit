# Tree

> A hierarchical list of nodes, each row a name with an optional glyph and one line of detail, where a parent row folds its children open and closed under a chevron. It renders a nested `items` data structure on its own (recursively, through one internal row template) and follows the WAI-ARIA tree pattern, so it fits file and object browsers: the objects of a bucket, the source files of a deployment, the routes of an application. Unlike `menu` it navigates data, not the app, and unlike `accordion` its nodes are rows of the same kind at any depth, not panels of free content.

- Import: `import Tree from '@aziontech/webkit/tree'`
- Category: data · Surface: product · Structure: monolithic
- API as JSON: [tree.json](https://github.com/aziontech/webkit/blob/main/.specs/tree.json)

## When to use

- Browsing a hierarchy whose depth is not fixed: bucket objects under folders, the source tree of a deployment, functions grouped by application.
- Picking one node out of a hierarchy (`selectable`) to show its detail beside the tree.
- A hierarchy the user expands piece by piece, where showing every level at once would bury the node they are after.

## Do

- Give every node an `id` that is unique across the whole tree, not only among its siblings; `v-model:expanded`, `v-model:selected` and focus are keyed by it.
- Seed `v-model:expanded` with the path to the node the user is most likely after (the open folder, the selected file), not with every parent.
- Keep labels short and put secondary detail (size, count, modified date) in `description` so rows scan as names first.
- Use `selectable` only when the selection drives something on the screen (a detail pane, a preview); for a tree whose rows only lead somewhere, listen to `item-click` instead.
- Put per-row controls in the `actions` slot (an `IconButton` that opens a `dropdown`), never inside the `item` slot, so they do not take over the row's activation.

## Don’t

- Navigation between views of the app → use `menu` inside `sidebar`.
- Flat records with several attributes each → use `table`.
- A few sections of free content that open and close → use `accordion`.
- A two- or three-level directory of destinations on a marketing page → use `column-navigation`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [table](table.md) — the flat, multi-column view of the same records; switch to it when columns matter more than nesting.
- [menu](menu.md) — the hierarchical list for app navigation, with routes and active state instead of selection.
- [accordion](accordion.md) — disclosure of free content panels rather than rows of one kind.
- [empty-state](empty-state.md) — what the tree renders when `items` is empty.
- [skeleton](skeleton.md) — the rows the tree renders while `loading`.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `TreeItem[]` | `[]` | false | Nodes to render; each is `{ id: string; label: string; icon?: string; description?: string; disabled?: boolean; children?: TreeItem[] }`. A node with a non-empty `children` array is a parent. |
| `selectable` | `boolean` | `false` | false | Enables single selection: activating a node writes its id to `v-model:selected` and marks it `aria-selected`. |
| `loading` | `boolean` | `false` | false | Renders Skeleton rows in place of the tree and sets `aria-busy`. |
| `emptyTitle` | `string` | `''` | false | Title of the default empty state shown when `items` is empty. Empty uses the locale catalog (`No items`). |
| `emptyDescription` | `string` | `''` | false | Supporting line under the empty title. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the tree. |
| `expanded` | `string[]` | `() => []` | false | Two-way value (`v-model:expanded`). |
| `selected` | `string` | `''` | false | Two-way value (`v-model:selected`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `item-click` | `(event: MouseEvent \| KeyboardEvent, item: TreeItem)` | A node activated: click on its row, or Enter / Space on the focused node. `item` is the consumer's own node object. Fires after `update:selected` when `selectable`. Not fired for a `disabled` node, nor for a click on the chevron or inside the `actions` region. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `item` | { item: TreeItem; level: number; expanded: boolean } | Replaces the label region of every row (glyph + label + description). The fallback inside the slot renders `item.icon`, `item.label` and `item.description`. `level` is 1 for top-level nodes; `expanded` is false for leaves. The chevron, indentation, row states and the `actions` region stay owned by the tree. |
| `actions` | { item: TreeItem; level: number } | Trailing per-row controls, end-aligned in the row (e.g. an `IconButton` that opens a `dropdown`). Clicks and keys inside it do not activate the row nor move tree focus. No fallback; when unused, the region is not rendered. |
| `empty` | — | Replaces the default empty state. The fallback inside the slot is `EmptyState` titled by `emptyTitle` with `emptyDescription`. |

## v-model

| Model              | Type       | Default | Emits             | Notes                                                                                                                                                                                                                                                                                                                               |
| ------------------ | ---------- | ------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:expanded` | `string[]` | `[]`    | `update:expanded` | Ids of the expanded parents, via `defineModel<string[]>('expanded', { default: () => [] })`. Uncontrolled when unbound. Ids of leaves or of unknown nodes are ignored. Collapsing a parent removes only its own id: descendants keep theirs, so re-expanding restores the subtree as it was. Always emits a new array.              |
| `v-model:selected` | `string`   | `''`    | `update:selected` | Id of the selected node, via `defineModel<string>('selected', { default: '' })`. Written only while `selectable`; read only while `selectable` (otherwise no node is marked selected). `''` means nothing is selected. Emits only when the id changes. Single selection only; activating the selected node again does not clear it. |

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

## Accessibility

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

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the expand caret mirrors (`rtl:-scale-x-100`) and rotates the other way when open (`rtl:data-[state=open]:-rotate-90`).
- Keyboard: `ArrowRight` expands a node or moves to its first child and `ArrowLeft` collapses it or moves to the parent, swapped under `dir="rtl"` (`logicalArrowKey`).
- User data: node labels are text; file names and IDs in another script keep their own direction.

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
      icon: 'pi pi-folder',
      children: [
        {
          id: 'assets/images',
          label: 'images',
          icon: 'pi pi-folder',
          children: [
            {
              id: 'assets/images/hero.webp',
              label: 'hero.webp',
              icon: 'pi pi-file',
              description: '248 KB'
            },
            {
              id: 'assets/images/logo.svg',
              label: 'logo.svg',
              icon: 'pi pi-file',
              description: '12 KB'
            }
          ]
        },
        {
          id: 'assets/fonts',
          label: 'fonts',
          icon: 'pi pi-folder',
          children: [
            {
              id: 'assets/fonts/rubik.woff2',
              label: 'rubik.woff2',
              icon: 'pi pi-file',
              description: '64 KB'
            }
          ]
        },
        {
          id: 'assets/styles.css',
          label: 'styles.css',
          icon: 'pi pi-file',
          description: '18 KB'
        }
      ]
    },
    {
      id: 'reports',
      label: 'reports',
      icon: 'pi pi-folder',
      children: [
        {
          id: 'reports/2026-10.csv',
          label: '2026-10.csv',
          icon: 'pi pi-file',
          description: '1.2 MB'
        },
        {
          id: 'reports/2026-11.csv',
          label: '2026-11.csv',
          icon: 'pi pi-file',
          description: '840 KB'
        }
      ]
    },
    {
      id: 'index.html',
      label: 'index.html',
      icon: 'pi pi-file',
      description: '4 KB'
    },
    {
      id: 'robots.txt',
      label: 'robots.txt',
      icon: 'pi pi-file',
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
      icon: 'pi pi-folder',
      children: [
        {
          id: 'assets/images',
          label: 'images',
          icon: 'pi pi-folder',
          children: [
            {
              id: 'assets/images/hero.webp',
              label: 'hero.webp',
              icon: 'pi pi-file',
              description: '248 KB'
            },
            {
              id: 'assets/images/logo.svg',
              label: 'logo.svg',
              icon: 'pi pi-file',
              description: '12 KB'
            }
          ]
        },
        {
          id: 'assets/fonts',
          label: 'fonts',
          icon: 'pi pi-folder',
          children: [
            {
              id: 'assets/fonts/rubik.woff2',
              label: 'rubik.woff2',
              icon: 'pi pi-file',
              description: '64 KB'
            }
          ]
        },
        {
          id: 'assets/styles.css',
          label: 'styles.css',
          icon: 'pi pi-file',
          description: '18 KB'
        }
      ]
    },
    {
      id: 'reports',
      label: 'reports',
      icon: 'pi pi-folder',
      children: [
        {
          id: 'reports/2026-10.csv',
          label: '2026-10.csv',
          icon: 'pi pi-file',
          description: '1.2 MB'
        },
        {
          id: 'reports/2026-11.csv',
          label: '2026-11.csv',
          icon: 'pi pi-file',
          description: '840 KB'
        }
      ]
    },
    {
      id: 'index.html',
      label: 'index.html',
      icon: 'pi pi-file',
      description: '4 KB'
    },
    {
      id: 'robots.txt',
      label: 'robots.txt',
      icon: 'pi pi-file',
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
  import Tree from '@aziontech/webkit/tree'
  import Tag from '@aziontech/webkit/tag'
  import IconButton from '@aziontech/webkit/icon-button'
  import { ref } from 'vue'

  const items = [
    {
      id: 'assets',
      label: 'assets',
      icon: 'pi pi-folder',
      children: [
        {
          id: 'assets/images',
          label: 'images',
          icon: 'pi pi-folder',
          children: [
            {
              id: 'assets/images/hero.webp',
              label: 'hero.webp',
              icon: 'pi pi-file',
              description: '248 KB'
            },
            {
              id: 'assets/images/logo.svg',
              label: 'logo.svg',
              icon: 'pi pi-file',
              description: '12 KB'
            }
          ]
        },
        {
          id: 'assets/fonts',
          label: 'fonts',
          icon: 'pi pi-folder',
          children: [
            {
              id: 'assets/fonts/rubik.woff2',
              label: 'rubik.woff2',
              icon: 'pi pi-file',
              description: '64 KB'
            }
          ]
        },
        {
          id: 'assets/styles.css',
          label: 'styles.css',
          icon: 'pi pi-file',
          description: '18 KB'
        }
      ]
    },
    {
      id: 'reports',
      label: 'reports',
      icon: 'pi pi-folder',
      children: [
        {
          id: 'reports/2026-10.csv',
          label: '2026-10.csv',
          icon: 'pi pi-file',
          description: '1.2 MB'
        },
        {
          id: 'reports/2026-11.csv',
          label: '2026-11.csv',
          icon: 'pi pi-file',
          description: '840 KB'
        }
      ]
    },
    {
      id: 'index.html',
      label: 'index.html',
      icon: 'pi pi-file',
      description: '4 KB'
    },
    {
      id: 'robots.txt',
      label: 'robots.txt',
      icon: 'pi pi-file',
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
      severity: 'secondary'
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
          icon="pi pi-ellipsis-h"
          kind="transparent"
          size="small"
          :aria-label="'More actions for ' + item.label"
        />
      </template>
    </Tree>
  </div>
</template>
```
