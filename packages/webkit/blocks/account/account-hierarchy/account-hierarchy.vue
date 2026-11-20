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
            size="medium"
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
                  @row-remove="(_event, row) => onRowAction('delete', row)"
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
                  <div class="flex w-full flex-col">
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
