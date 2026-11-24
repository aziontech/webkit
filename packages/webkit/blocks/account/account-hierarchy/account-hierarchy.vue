<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import PageHeader from '@aziontech/webkit/page-header'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref, useId, watch } from 'vue'

  import {
    buildTree,
    descendantsIn,
    plural,
    pruneTree,
    type ResourceNode,
    types
  } from './hierarchy-model'
  import HierarchyDetails from './parts/hierarchy-details.vue'
  import HierarchyLabelsDialog from './parts/hierarchy-labels-dialog.vue'
  import HierarchyMoveDialog from './parts/hierarchy-move-dialog.vue'
  import HierarchyResources from './parts/hierarchy-resources.vue'
  import HierarchyToolbar from './parts/hierarchy-toolbar.vue'
  import { sampleCurrentId, sampleResources, sampleRoleBindings } from './sample'

  /** The level of a resource in the hierarchy. */
  export type AccountHierarchyResourceType = 'organization' | 'group' | 'workspace'
  /** The state of a workspace. */
  export type AccountHierarchyResourceStatus = 'Active' | 'Suspended' | 'Pending'

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
    /** When it was last accessed: a Date or an ISO 8601 string. */
    lastAccessed?: Date | string
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

  type Resource = AccountHierarchyResource

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

  const tree = computed<ResourceNode[]>(() => buildTree(items.value))

  const query = ref('')
  const needle = computed(() => query.value.trim().toLowerCase())
  const matchesQuery = (item: Resource) =>
    [item.name, item.id, types[item.type].label, ...(item.labels ?? [])].some((value) =>
      value.toLowerCase().includes(needle.value)
    )
  const visibleTree = computed<ResourceNode[]>(() =>
    needle.value ? pruneTree(tree.value, matchesQuery) : tree.value
  )

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

  const descendantsOf = (id: string): Resource[] => descendantsIn(items.value, id)

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

      <HierarchyToolbar
        v-model:details-open="detailsOpen"
        :uid="uid"
        :selected-count="selectedCount"
        :refreshing="refreshing"
        @move="openMove(selectedResources)"
        @labels="openLabels(selectedResources)"
        @delete="openDelete(selectedResources)"
        @refresh="(event) => emit('refresh', event)"
      />

      <div class="layout-group-start flex min-w-0 flex-col gap-(--spacing-lg) 2xl:flex-row">
        <HierarchyResources
          v-model:query="query"
          v-model:open-keys="tableExpanded"
          v-model:selected-keys="selectedKeys"
          :uid="uid"
          :error="error"
          :loading="loading"
          :item-count="items.length"
          :selected-count="selectedCount"
          :needle="needle"
          :visible-tree="visibleTree"
          :current-id="currentId"
          @retry="(event) => emit('retry', event)"
          @row-action="onRowAction"
        />

        <HierarchyDetails
          v-show="detailsOpen"
          v-model:tab="detailsTab"
          :uid="uid"
          :details-title="detailsTitle"
          :selected-count="selectedCount"
          :focused="focused"
          :role-bindings="roleBindings"
          @edit-labels="(resource) => openLabels([resource])"
        />
      </div>
    </div>

    <HierarchyMoveDialog
      v-model:open="moveOpen"
      v-model:destination="destination"
      v-model:error="destinationError"
      :moving="moving"
      :destination-options="destinationOptions"
      @confirm="confirmMove"
    />

    <HierarchyLabelsDialog
      v-model:open="labelsOpen"
      v-model:add="addLabels"
      v-model:remove="removeLabels"
      :labelling="labelling"
      :known-labels="knownLabels"
      :present-labels="presentLabels"
      @confirm="confirmLabels"
    />

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
