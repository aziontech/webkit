# AccountHierarchy (`account/account-hierarchy`)

> The account hierarchy: organizations, groups and workspaces in one `DataTable` with tree rows (`get-sub-rows`, `v-model:open-keys`, a treegrid with the row-focus keyboard map) and row selection. A `PageHeader` with Create Workspace, a search `Input` over name, ID, type and labels that keeps the ancestors of each match (a small `EmptyState` with Clear search when nothing matches), the paginated tree, an action row with Create Group, the bulk Move, Labels and Delete that act on the selection, Refresh and Hide details, and a details panel with Permissions (role bindings of the one selected resource as `KeyValueList`) and Labels tabs. Move picks a new parent in a `Dialog` (never the resource itself or anything inside it); Labels adds and removes labels on every selected resource; Delete counts what is inside in a `ConfirmDialog` and keeps it in Resources pending deletion for 30 days; each ends in a toast, Move and Delete with Undo. A page body for ConsoleLayout, rendered in its default slot.

- Surface: app
- Source: `blocks/account/account-hierarchy/account-hierarchy.vue` in `@aziontech/webkit`
- MCP: `get_block("account/account-hierarchy")`
- Components: [Alert](../../components/alert.md), [Avatar](../../components/avatar.md), [Button](../../components/button.md), [Card](../../components/card.md), [ConfirmDialog](../../components/confirm-dialog.md), [DataTable](../../components/data-table.md), `DialogContent`, `DialogDescription`, [Dialog](../../components/dialog.md), `DialogTitle`, [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [Field](../../components/field.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [KeyValueList](../../components/key-value-list.md), [Link](../../components/link.md), [MultiSelect](../../components/multi-select.md), [PageHeader](../../components/page-header.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [Select](../../components/select.md), [Table](../../components/table.md), `TableCellActions`, `TableCellId`, `TableCellStatus`, `TableCellTags`, [Tabs](../../components/tabs.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md), `use-locale`
- Skills: `webkit-lists`, `webkit-tables`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

manage resources; resource hierarchy; account hierarchy; organizations and workspaces; resource tree; tree table; move resources; bulk actions on a tree; gerenciar recursos; hierarquia de contas; organizações e workspaces; árvore de recursos; mover recursos

Where an account admin arranges the account's hierarchy. Workspaces sit under groups, groups under organizations, and a role binding set on a parent applies to everything under it, so where a workspace lives decides who can reach it. The page shows the whole hierarchy as one tree table, lets the admin select across levels and act on the selection (move, label, delete), and shows the role bindings and labels of the one resource selected. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- Any parent and child structure of billable or permission-bearing resources: organizations, groups, folders, projects, workspaces.
- Bulk changes where the position in the hierarchy matters (moving under a new parent, deleting a branch).

## When not to use

- A flat list of one resource type: use `view/view-table`.
- Switching the current account: use the account switcher in `shell/shell-console`.
- Editing who belongs to a team: use `account/account-team-permissions`.
- A read-only file or folder browser: use `view/view-file-browser`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

Title `Manage resources` and one sentence on what the hierarchy decides. The page's primary, `Create Workspace` at `size="large"`, sits in the heading's actions as on every sibling list page. Refresh and the details toggle stay at the end of the toolbar, so the heading holds one action that stretches cleanly on phones.

### B. Toolbar — `Button`, `Tooltip`, `IconButton` (required)

A `role="group"` row named `Resource actions`: Create Group (outlined), a divider, then Move, Labels and Delete. The three bulk actions are disabled until something is selected and act on every selected row, at any depth. At the end, Refresh (spins while the table reloads) and a transparent `Hide details` / `Show details` that toggles the details panel (`aria-expanded`, `aria-controls`). The row wraps on narrow screens.

### C. Resource tree — `Input`, `Card`, `DataTable`, `TableCellActions`, `TableCellId`, `TableCellStatus`, `TableCellTags`, `Avatar`, `Tag`, `DropdownMenu`, `Link` (required)

A search `Input` named `Search resources` over name, ID, type and labels sits above the tree. A match keeps its ancestors (so a workspace shows under its group and organization) and opens every branch while the search is on; clearing it restores the branches the person had open. No match shows a small `EmptyState` (`No matching resources`) with Clear search in the card. Then a flush `Card` holding `DataTable` (tree rows), `paginated` at 25 rows a page, with `:get-sub-rows="(row) => row.children"`, `v-model:open-keys` (the first organization and its first group open) and `v-model:selected-keys`. The table turns into a treegrid: chevrons in the Name column, one indent step per level, and `aria-level` and `aria-expanded` on rows. Name: a square `Avatar` for organizations and groups, the type glyph for workspaces, and a check for the current workspace. ID as `TableCellId` with copy for workspaces. Type as a `Tag` with icon and severity (Organization accent, Group info, Workspace neutral). Last accessed, Status (`TableCellStatus`: Active, Pending, Suspended), Charges right-aligned in tabular figures with a help tooltip on the header (an empty charge is a muted dash through `data-empty`, never a class ternary), Labels as `TableCellTags` with `+N`, and `TableCellActions` (View details, Move, Edit labels, then Delete on its own). A dash stands in for any empty value. Below the card, a `Link` to Resources pending deletion.

The data stays flat (`parentId`) and the page builds the tree for the table, so a move only changes one field.

### D. Details panel — `Card`, `Tabs`, `KeyValueList`, `EmptyState`, `Tag` (required)

An `aside` beside the table from `2xl` and under it below that: next to the panel, the nine columns of the tree do not fit under 1536 px. Its heading says what is selected (`No resource selected`, `1 resource selected`, `3 resources selected`) and is polite live. Tabs: Permissions lists the role bindings of the one selected resource as split `KeyValueList` (role, member count); Labels shows its labels and an Edit labels button, or a small `No labels` `EmptyState`. With none or several selected, a small `EmptyState` (`Select a resource`, `Several resources selected`) says what to do.

### E. Move — `Dialog`, `DialogContent`, `DialogTitle`, `DialogDescription`, `PanelHeader`, `PanelBody`, `PanelFooter`, `Field`, `Select` (required)

Title `Move <name>` or `Move 3 resources`. The description says that everything inside moves too and that inherited bindings stop applying. One `Select` of organizations and groups, excluding the moving resources and everything inside them. Move without a choice shows `Choose where to move the resources.` under the field. The new parent opens after the move.

### F. Labels — `Dialog`, `Field`, `MultiSelect` (required)

The same dialog frame as Move.

Add labels (every label in use in the account) and Remove labels (only those on the selection). Save labels is disabled until one of them has a value.

### G. Delete — `ConfirmDialog` (required)

Title `Delete <name>` or `Delete 3 resources`. The description counts what is inside the selection and says it stays recoverable for 30 days. Confirming clears the selection.

### H. Empty and failure — `EmptyState`, `Alert` (conditional)

No resource: a flush `EmptyState` with Create Workspace replaces the table. Load failure: a danger `Alert` with Retry takes the table's place; the heading and toolbar stay.

### Outcomes — through `toast`

Every action ends in a success toast. Move and Delete carry Undo. Hierarchy changes are not deploys, so no toast offers Edit or Redeploy. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so the page never renders a `Toaster`.

## Data

The block takes its records through props and emits every action; it fetches nothing. `AccountHierarchyResource`, `AccountHierarchyRoleBinding` and `AccountHierarchyProps` are exported from `account-hierarchy.vue`, and `sample.ts` holds the sample hierarchy the block renders when `resources` is left out (and never while `loading` or `error` is set).

| Prop           | Type                                 | What it does                                                                                                          |
| -------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `resources`    | `AccountHierarchyResource[]`         | Every organization, group and workspace, flat; the tree is built from `parentId`. Pass `[]` for an account with none. |
| `currentId`    | `string`                             | The workspace the person is in, marked with a check.                                                                  |
| `roleBindings` | `AccountHierarchyRoleBinding[]`      | The role bindings of the one selected resource, in the Permissions tab.                                               |
| `selectedKeys` | `string[]` (`v-model:selected-keys`) | The ids of the selected rows; load the role bindings when it holds one id.                                            |
| `loading`      | `boolean`                            | A request is in flight. With no resources it is the first load (loading rows); with resources a refresh.              |
| `error`        | `string`                             | Why the load failed, shown in the danger `Alert` with Retry.                                                          |

| Event     | Payload                               | When                                                                                  |
| --------- | ------------------------------------- | ------------------------------------------------------------------------------------- |
| `refresh` | `(event)`                             | Refresh.                                                                              |
| `retry`   | `(event)`                             | Retry in the error alert.                                                             |
| `move`    | `(event, { resources, destination })` | Move was confirmed; the rows already sit under the new parent.                        |
| `labels`  | `(event, { resources, add, remove })` | Save labels was confirmed; the rows already show the new labels.                      |
| `delete`  | `(event, resources)`                  | Delete was confirmed; `resources` holds everything removed, what was inside included. |
| `undo`    | `(event, { action, resources })`      | Undo in the toast after a move or a delete; the rows are already back.                |

To go live, render the block from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import AccountHierarchy from './account-hierarchy.vue'

  const { data, pending, error, refresh } = useResources()
  const selectedKeys = ref<string[]>([])
  const { data: bindings } = useRoleBindings(selectedKeys)
  const loadError = 'The resources could not be loaded. Nothing was changed; try again.'
</script>

<template>
  <AccountHierarchy
    v-model:selected-keys="selectedKeys"
    :resources="data ?? []"
    :current-id="currentWorkspaceId"
    :role-bindings="bindings ?? []"
    :loading="pending"
    :error="error ? loadError : ''"
    @refresh="refresh"
    @retry="refresh"
    @move="(event, { resources, destination }) => moveResources(resources, destination)"
    @delete="(event, resources) => deleteResources(resources)"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Keep selection per row: selecting a group does not select its workspaces; Delete then says how many are inside.
- Open the destination after a move so the moved rows are visible.
- Say what moves with a resource, and what happens to its inherited bindings, before the move.
- Keep deleted resources recoverable and link to where they wait.

## Don't

- Don't offer a resource, or anything inside it, as its own new parent.
- Don't hide the chevron behind hover; leaves keep a blank space of the same width so names align.
- Don't put a separate expand button in the tab order; the row is the tab stop and Arrow Right and Arrow Left open and close it.
- Don't delete a branch without counting what is inside it.

## Copy

- **Title:** `Manage resources`. **Create:** `Create Workspace`, `Create Group` (the entity keeps its capital, as in `Create Team`).
- **Search:** `Search resources`; no match `No matching resources`, `No resource matches “…”.`, `Clear search`.
- **Bulk:** `Move`, `Labels`, `Delete`; row menu `View details`, `Move`, `Edit labels`, `Delete`.
- **Panel:** `No resource selected`, `1 resource selected`; empty states `Select a resource`, `Several resources selected`, `No labels`; `Select a resource to see its role bindings and labels.`; `Select a single resource to see its role bindings.`; `This resource has no labels.`
- **Toasts:** `2 resources moved to Digital services.`; `3 resources scheduled for deletion.` with `They stay in Resources pending deletion for 30 days.`; `Labels updated on 1 resource.`
- Follow `skills/webkit-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- The table is a `treegrid` labelled by the Resources heading. Rows carry `aria-level`, `aria-setsize`, `aria-posinset`, `aria-expanded` when they have children, and `aria-selected` when selected.
- One row is in the tab order. Arrow Up and Arrow Down move between rows, Home and End go to the first and last, Arrow Right opens a row or moves into it, Arrow Left closes it or goes to its parent (mirrored right to left), Enter toggles it and Space selects it. Tab reaches the checkbox, ID copy and row menu of the focused row.
- The chevron is pointer-only and hidden from assistive technology; the row's `aria-expanded` is the state.
- The action row is a `role="group"` named `Resource actions` (plain Tab order, no arrow-key toolbar); disabled bulk buttons stay visible so the actions are discoverable.
- The details heading is a polite live region, so a change of selection is announced.
- Dialogs trap focus and return it to the button that opened them.

## States

- Default: two organizations, three groups and six workspaces (`resources`); the first organization and its first group open, nothing selected, and every action wired.
- Selected: one workspace selected (`selectedKeys`); bulk actions enabled and the details panel filled.
- Empty: no resource (`resources` is `[]`); an empty state with Create Workspace.
- Loading: the first load (`loading` with no `resources`); the table's loading rows.
- Error: the hierarchy did not load (`error` is set); a danger Alert with the message and Retry.

## Related

- `account/account-team-permissions` — what a role binding grants.
- `account/account-users` — who the members of a binding are.
- `view/view-table` — the flat list page this one extends with tree rows.
- `view/view-file-browser` — moving objects between folders with the same Move dialog pattern.

## Variants

- `Default` — primary (the code below)
- `Selected` — One workspace selected: the bulk actions are enabled, Clear selection shows, and the details panel lists its role bindings and labels.
- `Empty` — No resource yet: a flush EmptyState with Create workspace replaces the table; the toolbar stays with the bulk actions disabled.
- `Loading` — The first load: the table's loading rows under its headers.
- `Error` — The hierarchy did not load: a danger Alert with Retry replaces the table; Retry loads it.

Each variant is the same screen in another state: `get_block("account/account-hierarchy", { variant })`, or the file under `blocks/account/account-hierarchy/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import DataTable from '@aziontech/webkit/data-table'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import Link from '@aziontech/webkit/link'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import { type TableColumn } from '@aziontech/webkit/table'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellId from '@aziontech/webkit/table-cell-id'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import TableCellTags from '@aziontech/webkit/table-cell-tags'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag, { type TagSeverity, type TagVariant } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref, useId, watch } from 'vue'

  import { sampleCurrentId, sampleResources, sampleRoleBindings } from './sample'

  /** The level of a resource in the hierarchy. */
  export type AccountHierarchyResourceType = 'organization' | 'group' | 'workspace'
  /** The state of a workspace. */
  export type AccountHierarchyResourceStatus = 'Active' | 'Suspended' | 'Pending'

  interface ResourceTypeMeta {
    label: string
    icon: string
    severity?: TagSeverity
    variant?: TagVariant
  }

  /** One organization, group or workspace; the tree is built from parentId. */
  export interface AccountHierarchyResource {
    /** Stable key, shown in the ID column. */
    id: string
    /** Display name. */
    name: string
    /** Organization, group or workspace. */
    type: AccountHierarchyResourceType
    /** The id of the parent, or null at the top level. */
    parentId: string | null
    /** Labels used for search, billing reports and policies. */
    labels?: string[]
    /** When it was last accessed, as display text. */
    lastAccessed?: string
    /** Workspace state. */
    status?: AccountHierarchyResourceStatus
    /** Estimated month-to-date charges in USD. */
    charges?: number
  }

  /** One role and how many members hold it on the selected resource. */
  export interface AccountHierarchyRoleBinding {
    /** Role name. */
    role: string
    /** Members bound to the role. */
    members: number
  }

  export interface AccountHierarchyProps {
    /** Every resource of the account, flat. Left out, the sample renders. */
    resources?: AccountHierarchyResource[]
    /** The id of the workspace the person is in, marked with a check. */
    currentId?: string
    /** Role bindings of the single selected resource, shown in the details panel. */
    roleBindings?: AccountHierarchyRoleBinding[]
    /** A request is in flight: with no resources it is the first load, with resources a refresh. */
    loading?: boolean
    /** Why the resources could not load; a danger alert with Retry replaces the table. */
    error?: string
  }

  interface ResourceNode extends AccountHierarchyResource {
    children?: ResourceNode[]
  }
  type Resource = AccountHierarchyResource
  type ResourceStatus = AccountHierarchyResourceStatus
  type ResourceType = AccountHierarchyResourceType

  const props = withDefaults(defineProps<AccountHierarchyProps>(), {
    resources: undefined,
    currentId: undefined,
    roleBindings: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
    move: [event: Event, payload: { resources: Resource[]; destination: Resource }]
    labels: [event: Event, payload: { resources: Resource[]; add: string[]; remove: string[] }]
    delete: [event: MouseEvent, resources: Resource[]]
    undo: [event: MouseEvent, payload: { action: 'move' | 'delete'; resources: Resource[] }]
  }>()

  const selectedKeys = defineModel<string[]>('selectedKeys', { default: () => [] })

  const types: Record<ResourceType, ResourceTypeMeta> = {
    organization: { label: 'Organization', icon: 'az az-building', variant: 'accent' },
    group: { label: 'Group', icon: 'az az-users', severity: 'info' },
    workspace: { label: 'Workspace', icon: 'az az-layout-grid', severity: 'neutral' }
  }

  const uid = useId()
  const blank = computed(() => props.loading || props.error !== '')
  const source = computed<Resource[]>(() => props.resources ?? (blank.value ? [] : sampleResources))
  const items = ref<Resource[]>([])
  watch(
    source,
    (next) => {
      items.value = [...next]
    },
    { immediate: true }
  )
  const currentId = computed(() => props.currentId ?? (props.resources ? '' : sampleCurrentId))
  const roleBindings = computed(
    () => props.roleBindings ?? (props.resources ? [] : sampleRoleBindings)
  )
  const refreshing = computed(() => props.loading && items.value.length > 0)

  const tree = computed<ResourceNode[]>(() => {
    const byParent = new Map<string | null, Resource[]>()
    for (const item of items.value) {
      const list = byParent.get(item.parentId) ?? []
      list.push(item)
      byParent.set(item.parentId, list)
    }
    const build = (parentId: string | null): ResourceNode[] =>
      (byParent.get(parentId) ?? []).map((item) => {
        const children = build(item.id)
        return children.length ? { ...item, children } : { ...item }
      })
    return build(null)
  })

  const query = ref('')
  const needle = computed(() => query.value.trim().toLowerCase())
  const matchesQuery = (item: Resource) =>
    [item.name, item.id, types[item.type].label, ...(item.labels ?? [])].some((value) =>
      value.toLowerCase().includes(needle.value)
    )
  const visibleTree = computed<ResourceNode[]>(() => {
    if (!needle.value) return tree.value
    const prune = (nodes: ResourceNode[]): ResourceNode[] =>
      nodes.flatMap((node) => {
        if (matchesQuery(node)) return [node]
        const children = prune(node.children ?? [])
        return children.length ? [{ ...node, children }] : []
      })
    return prune(tree.value)
  })
  const clearQuery = () => {
    query.value = ''
  }

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', principal: true, grow: 3 },
    { accessorKey: 'id', header: 'ID', minWidth: 128 },
    { accessorKey: 'type', header: 'Type', minWidth: 136 },
    { accessorKey: 'lastAccessed', header: 'Last accessed', minWidth: 120 },
    { accessorKey: 'status', header: 'Status', minWidth: 112 },
    { accessorKey: 'charges', header: 'Charges', align: 'end', minWidth: 112 },
    { accessorKey: 'labels', header: 'Labels', minWidth: 120 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const expanded = ref<string[]>(['org-1001', 'grp-2101'])
  const parentIds = computed(() => [
    ...new Set(items.value.map((item) => item.parentId).filter((id) => id !== null))
  ])
  const tableExpanded = computed<string[]>({
    get: () => (needle.value ? parentIds.value : expanded.value),
    set: (value) => {
      if (!needle.value) expanded.value = value
    }
  })

  const selectedResources = computed(() =>
    items.value.filter((item) => selectedKeys.value.includes(item.id))
  )
  const selectedCount = computed(() => selectedResources.value.length)
  const focused = computed(() => (selectedCount.value === 1 ? selectedResources.value[0] : null))
  const clearSelection = () => {
    selectedKeys.value = []
  }

  const descendantsOf = (id: string): Resource[] => {
    const out: Resource[] = []
    const walk = (parentId: string) => {
      for (const item of items.value)
        if (item.parentId === parentId) {
          out.push(item)
          walk(item.id)
        }
    }
    walk(id)
    return out
  }

  const statusSeverities: Record<ResourceStatus, TagSeverity> = {
    Active: 'success',
    Suspended: 'danger',
    Pending: 'warning'
  }
  const statusSeverity = (status?: ResourceStatus): TagSeverity =>
    status ? statusSeverities[status] : 'neutral'
  const { formatNumber } = useLocale()

  const money = (value: number) => formatNumber(value, { style: 'currency', currency: 'USD' })
  const initials = (name: string) =>
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join('')
  const plural = (count: number, one: string, other: string) =>
    `${count} ${count === 1 ? one : other}`

  const detailsOpen = ref(true)
  const detailsTab = ref('permissions')
  const detailsTitle = computed(() =>
    selectedCount.value === 0
      ? 'No resource selected'
      : `${plural(selectedCount.value, 'resource', 'resources')} selected`
  )
  const moveOpen = ref(false)
  const moving = ref<Resource[]>([])
  const destination = ref('')
  const destinationError = ref('')
  const destinationOptions = computed(() => {
    const blocked = new Set(
      moving.value.flatMap((item) => [item.id, ...descendantsOf(item.id).map((child) => child.id)])
    )
    return items.value
      .filter((item) => item.type !== 'workspace' && !blocked.has(item.id))
      .map((item) => ({ value: item.id, label: item.name, type: item.type }))
  })
  const openMove = (items: Resource[]) => {
    moving.value = items
    destination.value = ''
    destinationError.value = ''
    moveOpen.value = true
  }
  const confirmMove = (event: Event) => {
    const target = items.value.find((item) => item.id === destination.value)
    if (!target) {
      destinationError.value = 'Choose where to move the resources.'
      return
    }
    const ids = new Set(moving.value.map((item) => item.id))
    const before = items.value
    const moved = moving.value
    items.value = items.value.map((item) =>
      ids.has(item.id) ? { ...item, parentId: target.id } : item
    )
    expanded.value = [...new Set([...expanded.value, target.id])]
    moveOpen.value = false
    emit('move', event, { resources: moved, destination: target })
    toast.success(`${plural(ids.size, 'resource', 'resources')} moved to ${target.name}.`, {
      description: 'Role bindings inherited from the old parent no longer apply.',
      actions: [
        {
          label: 'Undo',
          onClick: (undoEvent) => {
            items.value = before
            emit('undo', undoEvent, { action: 'move', resources: moved })
          }
        }
      ]
    })
  }

  const deleteOpen = ref(false)
  const deleting = ref<Resource[]>([])
  const deletingInside = computed(() => {
    const ids = new Set(deleting.value.map((item) => item.id))
    const inside = new Set<string>()
    for (const item of deleting.value)
      for (const child of descendantsOf(item.id)) if (!ids.has(child.id)) inside.add(child.id)
    return inside.size
  })
  const openDelete = (items: Resource[]) => {
    deleting.value = items
    deleteOpen.value = true
  }
  const confirmDelete = (event: MouseEvent) => {
    const removed = items.value.filter((item) =>
      deleting.value.some(
        (target) =>
          target.id === item.id || descendantsOf(target.id).some((child) => child.id === item.id)
      )
    )
    const ids = new Set(
      deleting.value.flatMap((item) => [
        item.id,
        ...descendantsOf(item.id).map((child) => child.id)
      ])
    )
    const before = items.value
    items.value = items.value.filter((item) => !ids.has(item.id))
    selectedKeys.value = []
    deleteOpen.value = false
    emit('delete', event, removed)
    toast.success(`${plural(ids.size, 'resource', 'resources')} scheduled for deletion.`, {
      description: 'They stay in Resources pending deletion for 30 days.',
      actions: [
        {
          label: 'Undo',
          onClick: (undoEvent) => {
            items.value = before
            emit('undo', undoEvent, { action: 'delete', resources: removed })
          }
        }
      ]
    })
  }

  const labelsOpen = ref(false)
  const labelling = ref<Resource[]>([])
  const addLabels = ref<string[]>([])
  const removeLabels = ref<string[]>([])
  const knownLabels = computed(() =>
    [...new Set(items.value.flatMap((item) => item.labels ?? []))].sort()
  )
  const presentLabels = computed(() =>
    [...new Set(labelling.value.flatMap((item) => item.labels ?? []))].sort()
  )
  const openLabels = (items: Resource[]) => {
    labelling.value = items
    addLabels.value = []
    removeLabels.value = []
    labelsOpen.value = true
  }
  const confirmLabels = (event: Event) => {
    const ids = new Set(labelling.value.map((item) => item.id))
    emit('labels', event, {
      resources: labelling.value,
      add: [...addLabels.value],
      remove: [...removeLabels.value]
    })
    items.value = items.value.map((item) => {
      if (!ids.has(item.id)) return item
      const next = new Set(item.labels ?? [])
      addLabels.value.forEach((label) => next.add(label))
      removeLabels.value.forEach((label) => next.delete(label))
      return { ...item, labels: [...next].sort() }
    })
    labelsOpen.value = false
    toast.success(`Labels updated on ${plural(ids.size, 'resource', 'resources')}.`)
  }

  const onRowAction = (value: DropdownMenuItemValue, row: Resource) => {
    const item = items.value.find((entry) => entry.id === row.id)
    if (!item) return
    if (value === 'details') {
      selectedKeys.value = [item.id]
      detailsOpen.value = true
    }
    if (value === 'move') openMove([item])
    if (value === 'labels') openLabels([item])
    if (value === 'delete') openDelete([item])
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col">
      <PageHeader
        title="Manage resources"
        description="Organize workspaces into a hierarchy of organizations and groups. Role bindings set on a parent apply to everything under it."
      >
        <template #actions>
          <Button
            label="Create Workspace"
            icon="az az-plus"
            variant="primary"
            size="large"
            href="/account/resources/new"
          />
        </template>
      </PageHeader>

      <div
        role="group"
        aria-label="Resource actions"
        class="layout-section-start flex flex-wrap items-center gap-(--spacing-xs)"
      >
        <Button
          label="Create Group"
          icon="az az-folder"
          variant="outline"
          size="medium"
          href="/account/resources/new-group"
        />
        <span
          class="mx-(--spacing-2xs) h-(--size-5) w-px bg-(--border-muted)"
          aria-hidden="true"
        />
        <Button
          label="Move"
          icon="az az-arrow-right-left"
          variant="outline"
          size="medium"
          :disabled="!selectedCount"
          @click="openMove(selectedResources)"
        />
        <Button
          label="Labels"
          icon="az az-tag"
          variant="outline"
          size="medium"
          :disabled="!selectedCount"
          @click="openLabels(selectedResources)"
        />
        <Button
          label="Delete"
          icon="az az-trash"
          variant="outline"
          size="medium"
          :disabled="!selectedCount"
          @click="openDelete(selectedResources)"
        />
        <div class="ms-auto flex items-center gap-(--spacing-xs)">
          <Tooltip content="Refresh">
            <IconButton
              icon="az az-refresh"
              variant="outline"
              size="medium"
              :loading="refreshing"
              aria-label="Refresh resources"
              @click="emit('refresh', $event)"
            />
          </Tooltip>
          <Button
            :label="detailsOpen ? 'Hide details' : 'Show details'"
            :icon="detailsOpen ? 'az az-eye-off' : 'az az-eye'"
            variant="ghost"
            size="medium"
            :aria-expanded="detailsOpen"
            :aria-controls="`${uid}-details`"
            @click="detailsOpen = !detailsOpen"
          />
        </div>
      </div>

      <div class="layout-group-start flex min-w-0 flex-col gap-(--spacing-lg) 2xl:flex-row">
        <section
          :aria-labelledby="`${uid}-resources`"
          class="flex min-w-0 flex-1 flex-col gap-(--spacing-sm)"
        >
          <div class="flex min-h-8 items-center justify-between gap-(--spacing-xs)">
            <h2
              :id="`${uid}-resources`"
              class="text-heading-xs text-(--text-default)"
            >
              Resources
            </h2>
            <Button
              v-if="selectedCount"
              label="Clear selection"
              variant="ghost"
              size="small"
              @click="clearSelection"
            />
          </div>

          <Alert
            v-if="error"
            severity="danger"
          >
            {{ error }}
            <template #actions>
              <Button
                label="Retry"
                variant="secondary"
                size="small"
                @click="emit('retry', $event)"
              />
            </template>
          </Alert>

          <Card
            key="card-1"
            v-else-if="!loading && !items.length"
            :padded="false"
          >
            <template #default>
              <EmptyState
                size="medium"
                icon="az az-sitemap"
                title="No resources yet"
                description="Create a workspace, then group workspaces under organizations and groups to share role bindings."
              >
                <template #actions>
                  <Button
                    label="Create Workspace"
                    icon="az az-plus"
                    variant="secondary"
                    size="small"
                    href="/account/resources/new"
                  />
                </template>
              </EmptyState>
            </template>
          </Card>

          <template v-else>
            <Input
              v-model="query"
              placeholder="Search by name, ID, type or label"
              aria-label="Search resources"
              class="w-full"
            >
              <template #leading>
                <i
                  class="az az-search"
                  aria-hidden="true"
                />
              </template>
            </Input>

            <Card
              key="card-3"
              v-if="needle && !visibleTree.length"
              :padded="false"
            >
              <template #default>
                <EmptyState
                  size="small"
                  icon="az az-search"
                  title="No matching resources"
                  :description="`No resource matches “${query.trim()}”.`"
                >
                  <template #actions>
                    <Button
                      label="Clear search"
                      variant="outline"
                      size="small"
                      @click="clearQuery"
                    />
                  </template>
                </EmptyState>
              </template>
            </Card>

            <Card
              key="card-2"
              v-else
              :padded="false"
            >
              <template #default>
                <DataTable
                  v-model:open-keys="tableExpanded"
                  v-model:selected-keys="selectedKeys"
                  :data="visibleTree"
                  paginated
                  :page-size="25"
                  :columns="columns"
                  :get-sub-rows="(row) => row.children"
                  :loading="loading"
                  row-key="id"
                  selectable
                  :bordered="false"
                  :aria-labelledby="`${uid}-resources`"
                >
                  <template #cell-name="{ row }">
                    <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <Avatar
                        v-if="row.type !== 'workspace'"
                        :label="initials(row.name)"
                        size="small"
                        variant="square"
                      />
                      <i
                        v-else
                        :class="types[row.type].icon"
                        class="shrink-0 text-body-sm text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <span class="truncate text-label-sm text-(--text-default)">{{
                        row.name
                      }}</span>
                      <Tooltip
                        v-if="row.id === currentId"
                        content="Current workspace"
                      >
                        <i
                          class="az az-check shrink-0 text-body-xs text-(--text-muted)"
                          aria-label="Current workspace"
                          role="img"
                        />
                      </Tooltip>
                    </span>
                  </template>
                  <template #cell-id="{ row, value }">
                    <TableCellId
                      v-if="row.type === 'workspace'"
                      :value="value"
                      resource="workspace"
                    />
                    <span
                      v-else
                      class="text-body-sm text-(--text-muted)"
                      >{{ value }}</span
                    >
                  </template>
                  <template #cell-type="{ value }">
                    <Tag
                      :label="types[value].label"
                      :icon="types[value].icon"
                      :variant="types[value].variant"
                      :severity="types[value].severity"
                      size="small"
                    />
                  </template>
                  <template #cell-lastAccessed="{ value }">
                    <span class="text-body-sm text-(--text-muted)">{{ value || '—' }}</span>
                  </template>
                  <template #cell-status="{ value }">
                    <TableCellStatus
                      :label="value"
                      :severity="statusSeverity(value)"
                    />
                  </template>
                  <template #cell-charges="{ value }">
                    <span
                      class="tabular-nums text-(--text-default) data-[empty]:text-(--text-muted)"
                      :data-empty="!value || null"
                      >{{ value ? money(value) : '—' }}</span
                    >
                  </template>
                  <template #header-charges>
                    <span class="inline-flex items-center gap-(--spacing-2xs)">
                      Charges
                      <Tooltip content="Estimated month-to-date charges.">
                        <i
                          class="az az-circle-help text-body-xs text-(--text-muted)"
                          role="img"
                          aria-label="About charges"
                          tabindex="0"
                        />
                      </Tooltip>
                    </span>
                  </template>
                  <template #cell-labels="{ value }">
                    <TableCellTags
                      :items="value ?? []"
                      icon="az az-tag"
                      :noun="{ one: 'label', other: 'labels' }"
                    />
                  </template>
                  <template #header-actions>
                    <span class="sr-only">Actions</span>
                  </template>
                  <template #cell-actions="{ row }">
                    <TableCellActions
                      :name="row.name"
                      @select="(_event, value) => onRowAction(value, row)"
                    >
                      <DropdownMenu.Group>
                        <DropdownMenu.Item
                          value="details"
                          label="View details"
                        />
                        <DropdownMenu.Item
                          value="move"
                          label="Move"
                        />
                        <DropdownMenu.Item
                          value="labels"
                          label="Edit labels"
                        />
                      </DropdownMenu.Group>
                      <DropdownMenu.Group>
                        <DropdownMenu.Item
                          value="delete"
                          label="Delete"
                        />
                      </DropdownMenu.Group>
                    </TableCellActions>
                  </template>
                </DataTable>
              </template>
            </Card>
          </template>

          <Link
            label="Resources pending deletion"
            size="medium"
            href="/account/resources/pending-deletion"
            class="self-start"
          />
        </section>

        <aside
          v-show="detailsOpen"
          :id="`${uid}-details`"
          :aria-labelledby="`${uid}-details-heading`"
          class="w-full shrink-0 2xl:w-(--container-xs)"
        >
          <Card>
            <template #default>
              <div class="flex flex-col gap-(--spacing-md)">
                <h2
                  :id="`${uid}-details-heading`"
                  class="text-heading-xs text-(--text-default)"
                  aria-live="polite"
                >
                  {{ detailsTitle }}
                </h2>

                <Tabs v-model="detailsTab">
                  <div class="flex w-full flex-col gap-(--spacing-md)">
                    <Tabs.List aria-label="Details">
                      <Tabs.Trigger
                        value="permissions"
                        label="Permissions"
                      />
                      <Tabs.Trigger
                        value="labels"
                        label="Labels"
                      />
                    </Tabs.List>
                    <div class="relative isolate w-full">
                      <Tabs.Content value="permissions">
                        <EmptyState
                          v-if="!focused"
                          size="small"
                          icon="az az-sitemap"
                          :title="
                            selectedCount ? 'Several resources selected' : 'Select a resource'
                          "
                          :description="
                            selectedCount
                              ? 'Select a single resource to see its role bindings.'
                              : 'Select a resource to see its role bindings and labels.'
                          "
                        />
                        <div
                          v-else
                          class="flex flex-col gap-(--spacing-sm)"
                        >
                          <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                            <Tag
                              :label="types[focused.type].label"
                              :icon="types[focused.type].icon"
                              :variant="types[focused.type].variant"
                              :severity="types[focused.type].severity"
                              size="small"
                            />
                            <span class="truncate text-label-md text-(--text-default)">{{
                              focused.name
                            }}</span>
                          </div>
                          <KeyValueList
                            variant="split"
                            aria-label="Role bindings"
                          >
                            <KeyValueList.Item
                              v-for="binding in roleBindings"
                              :key="binding.role"
                              :label="binding.role"
                              >{{ plural(binding.members, 'member', 'members') }}</KeyValueList.Item
                            >
                          </KeyValueList>
                        </div>
                      </Tabs.Content>
                      <Tabs.Content value="labels">
                        <EmptyState
                          v-if="!focused"
                          size="small"
                          icon="az az-tag"
                          :title="
                            selectedCount ? 'Several resources selected' : 'Select a resource'
                          "
                          :description="
                            selectedCount
                              ? 'Select a single resource to see its labels.'
                              : 'Select a resource to see its role bindings and labels.'
                          "
                        />
                        <div
                          v-else
                          class="flex flex-col gap-(--spacing-sm)"
                        >
                          <ul
                            v-if="focused.labels?.length"
                            aria-label="Labels"
                            class="m-0 flex list-none flex-wrap gap-(--spacing-xs) p-0"
                          >
                            <li
                              v-for="label in focused.labels"
                              :key="label"
                            >
                              <Tag
                                :label="label"
                                severity="neutral"
                                size="medium"
                              />
                            </li>
                          </ul>
                          <EmptyState
                            v-else
                            size="small"
                            icon="az az-tag"
                            title="No labels"
                            description="This resource has no labels."
                          />
                          <Button
                            label="Edit labels"
                            icon="az az-tag"
                            variant="outline"
                            size="small"
                            class="self-start"
                            @click="openLabels([focused])"
                          />
                        </div>
                      </Tabs.Content>
                    </div>
                  </div>
                </Tabs>
              </div>
            </template>
          </Card>
        </aside>
      </div>
    </div>

    <Dialog
      v-model:open="moveOpen"
      size="medium"
    >
      <DialogContent>
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DialogTitle>{{
              moving.length === 1
                ? `Move ${moving[0].name}`
                : `Move ${plural(moving.length, 'resource', 'resources')}`
            }}</DialogTitle>
            <DialogDescription>
              Everything inside moves with it. Role bindings inherited from the old parent stop
              applying; bindings set on the resource itself stay.
            </DialogDescription>
          </div>
        </PanelHeader>
        <PanelBody>
          <form
            class="flex flex-col gap-(--spacing-md)"
            novalidate
            @submit.prevent="confirmMove"
          >
            <Field :invalid="!!destinationError">
              <Field.Label>New parent</Field.Label>
              <Select
                v-model="destination"
                size="large"
                placeholder="Choose an organization or group"
                @update:model-value="destinationError = ''"
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item
                    v-for="option in destinationOptions"
                    :key="option.value"
                    :value="option.value"
                    >{{ option.label }} · {{ types[option.type].label }}</Select.Item
                  >
                </Select.Content>
              </Select>
              <Field.Description
                >A resource cannot move into itself or into anything inside it.</Field.Description
              >
              <Field.Error v-if="destinationError">{{ destinationError }}</Field.Error>
            </Field>
          </form>
        </PanelBody>
        <PanelFooter>
          <div class="flex w-full justify-end gap-(--spacing-xs)">
            <Button
              label="Cancel"
              variant="outline"
              size="medium"
              @click="moveOpen = false"
            />
            <Button
              label="Move"
              variant="primary"
              size="medium"
              @click="confirmMove"
            />
          </div>
        </PanelFooter>
      </DialogContent>
    </Dialog>

    <Dialog
      v-model:open="labelsOpen"
      size="medium"
    >
      <DialogContent>
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DialogTitle>{{
              labelling.length === 1
                ? `Labels of ${labelling[0].name}`
                : `Labels of ${plural(labelling.length, 'resource', 'resources')}`
            }}</DialogTitle>
            <DialogDescription>
              Labels group resources for search, billing reports and policies. Changes apply to
              every selected resource.
            </DialogDescription>
          </div>
        </PanelHeader>
        <PanelBody>
          <form
            class="flex flex-col gap-(--spacing-md)"
            novalidate
            @submit.prevent="confirmLabels"
          >
            <Field>
              <Field.Label>Add labels</Field.Label>
              <MultiSelect
                v-model="addLabels"
                placeholder="Choose labels"
              >
                <MultiSelect.Trigger />
                <MultiSelect.Content>
                  <MultiSelect.Item
                    v-for="label in knownLabels"
                    :key="label"
                    :value="label"
                    >{{ label }}</MultiSelect.Item
                  >
                </MultiSelect.Content>
              </MultiSelect>
            </Field>
            <Field v-if="presentLabels.length">
              <Field.Label>Remove labels</Field.Label>
              <MultiSelect
                v-model="removeLabels"
                placeholder="Choose labels"
              >
                <MultiSelect.Trigger />
                <MultiSelect.Content>
                  <MultiSelect.Item
                    v-for="label in presentLabels"
                    :key="label"
                    :value="label"
                    >{{ label }}</MultiSelect.Item
                  >
                </MultiSelect.Content>
              </MultiSelect>
            </Field>
          </form>
        </PanelBody>
        <PanelFooter>
          <div class="flex w-full justify-end gap-(--spacing-xs)">
            <Button
              label="Cancel"
              variant="outline"
              size="medium"
              @click="labelsOpen = false"
            />
            <Button
              label="Save labels"
              variant="primary"
              size="medium"
              :disabled="!addLabels.length && !removeLabels.length"
              @click="confirmLabels"
            />
          </div>
        </PanelFooter>
      </DialogContent>
    </Dialog>

    <ConfirmDialog
      v-model:open="deleteOpen"
      :title="
        deleting.length === 1
          ? `Delete ${deleting[0].name}`
          : `Delete ${plural(deleting.length, 'resource', 'resources')}`
      "
      :description="
        deletingInside
          ? `This also deletes the ${plural(deletingInside, 'resource', 'resources')} inside. Everything stays in Resources pending deletion for 30 days, then is removed with its data.`
          : 'It stays in Resources pending deletion for 30 days, then is removed with its data.'
      "
      confirm-label="Delete"
      size="small"
      @confirm="confirmDelete"
    />
  </div>
</template>
```

## `sample.ts`

```ts
import type { AccountHierarchyResource, AccountHierarchyRoleBinding } from './account-hierarchy.vue'

export const sampleResources: AccountHierarchyResource[] = [
  {
    id: 'org-1001',
    name: 'Acme Inc.',
    type: 'organization',
    parentId: null,
    labels: ['primary']
  },
  { id: 'org-1002', name: 'Acme Partners', type: 'organization', parentId: null },
  { id: 'grp-2101', name: 'Retail and marketplace', type: 'group', parentId: 'org-1001' },
  { id: 'grp-2102', name: 'Digital services', type: 'group', parentId: 'org-1001' },
  { id: 'grp-2201', name: 'Resellers', type: 'group', parentId: 'org-1002' },
  {
    id: 'ws-30418',
    name: 'Storefront',
    type: 'workspace',
    parentId: 'grp-2101',
    lastAccessed: '2 hours ago',
    status: 'Active',
    charges: 1284,
    labels: ['retail', 'production']
  },
  {
    id: 'ws-30422',
    name: 'Checkout',
    type: 'workspace',
    parentId: 'grp-2101',
    lastAccessed: 'Yesterday',
    status: 'Active',
    charges: 612.4,
    labels: ['production']
  },
  {
    id: 'ws-30437',
    name: 'Loyalty program',
    type: 'workspace',
    parentId: 'grp-2101',
    lastAccessed: '3 days ago',
    status: 'Pending',
    charges: 42.1
  },
  {
    id: 'ws-30455',
    name: 'Media library',
    type: 'workspace',
    parentId: 'grp-2102',
    lastAccessed: '1 week ago',
    status: 'Active',
    charges: 3910.75,
    labels: ['media']
  },
  {
    id: 'ws-30461',
    name: 'Status page',
    type: 'workspace',
    parentId: 'grp-2102',
    status: 'Suspended',
    labels: ['staging']
  },
  {
    id: 'ws-30470',
    name: 'Partner portal',
    type: 'workspace',
    parentId: 'grp-2201',
    lastAccessed: '1 month ago',
    status: 'Active',
    charges: 220
  }
]

export const sampleCurrentId = 'ws-30418'

export const sampleRoleBindings: AccountHierarchyRoleBinding[] = [
  { role: 'Owner', members: 2 },
  { role: 'Editor', members: 5 },
  { role: 'Viewer', members: 11 }
]
```
