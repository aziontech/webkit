<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Link from '@aziontech/webkit/link'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import Table from '@aziontech/webkit/table'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, useId } from 'vue'

  const types = {
    organization: { label: 'Organization', icon: 'pi pi-building', severity: 'accent' },
    group: { label: 'Group', icon: 'pi pi-users', severity: 'info' },
    workspace: { label: 'Workspace', icon: 'pi pi-th-large', severity: 'secondary' }
  }

  const seedResources = [
    {
      id: 'org-1001',
      name: 'Northwind Holdings',
      type: 'organization',
      parentId: null,
      labels: ['primary']
    },
    { id: 'org-1002', name: 'Contoso Partners', type: 'organization', parentId: null },
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

  const uid = useId()
  const currentId = 'ws-30418'
  const resources = ref([])

  const tree = computed(() => {
    const byParent = new Map()
    for (const item of resources.value) {
      const list = byParent.get(item.parentId) ?? []
      list.push(item)
      byParent.set(item.parentId, list)
    }
    const build = (parentId) =>
      (byParent.get(parentId) ?? []).map((item) => {
        const children = build(item.id)
        return children.length ? { ...item, children } : { ...item }
      })
    return build(null)
  })

  const columns = [
    { accessorKey: 'name', header: 'Name', principal: true, grow: 3 },
    { accessorKey: 'id', header: 'ID', minWidth: 128 },
    { accessorKey: 'type', header: 'Type', minWidth: 136 },
    { accessorKey: 'lastAccessed', header: 'Last accessed', minWidth: 120 },
    { accessorKey: 'status', header: 'Status', minWidth: 112 },
    { accessorKey: 'charges', header: 'Charges', align: 'end', minWidth: 112 },
    { accessorKey: 'labels', header: 'Labels', minWidth: 120 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const expanded = ref({ 'org-1001': true, 'grp-2101': true })
  const selection = ref({})

  const selected = computed(() => resources.value.filter((item) => selection.value[item.id]))
  const selectedCount = computed(() => selected.value.length)
  const focused = computed(() => (selectedCount.value === 1 ? selected.value[0] : null))
  const clearSelection = () => {
    selection.value = {}
  }

  const descendantsOf = (id) => {
    const out = []
    const walk = (parentId) => {
      for (const item of resources.value)
        if (item.parentId === parentId) {
          out.push(item)
          walk(item.id)
        }
    }
    walk(id)
    return out
  }

  const statusSeverity = (status) =>
    ({ Active: 'success', Suspended: 'danger', Pending: 'warning' })[status] ?? 'secondary'
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
  const initials = (name) =>
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join('')
  const plural = (count, one, other) => `${count} ${count === 1 ? one : other}`

  const detailsOpen = ref(true)
  const detailsTab = ref('permissions')
  const detailsTitle = computed(() =>
    selectedCount.value === 0
      ? 'No resource selected'
      : `${plural(selectedCount.value, 'resource', 'resources')} selected`
  )
  const roleBindings = [
    { role: 'Owner', members: 2 },
    { role: 'Editor', members: 5 },
    { role: 'Viewer', members: 11 }
  ]

  const loading = ref(false)
  const loadFailed = ref(true)
  const retryLoad = () => {
    loadFailed.value = false
    loading.value = true
    setTimeout(() => {
      resources.value = seedResources
      loading.value = false
    }, 700)
  }

  const refreshing = ref(false)
  const refresh = () => {
    if (refreshing.value) return
    refreshing.value = true
    setTimeout(() => {
      refreshing.value = false
    }, 700)
  }

  const moveOpen = ref(false)
  const moving = ref([])
  const destination = ref('')
  const destinationError = ref('')
  const destinationOptions = computed(() => {
    const blocked = new Set(
      moving.value.flatMap((item) => [item.id, ...descendantsOf(item.id).map((child) => child.id)])
    )
    return resources.value
      .filter((item) => item.type !== 'workspace' && !blocked.has(item.id))
      .map((item) => ({ value: item.id, label: item.name, type: item.type }))
  })
  const openMove = (items) => {
    moving.value = items
    destination.value = ''
    destinationError.value = ''
    moveOpen.value = true
  }
  const confirmMove = () => {
    const target = resources.value.find((item) => item.id === destination.value)
    if (!target) {
      destinationError.value = 'Choose where to move the resources.'
      return
    }
    const ids = new Set(moving.value.map((item) => item.id))
    const before = resources.value
    resources.value = resources.value.map((item) =>
      ids.has(item.id) ? { ...item, parentId: target.id } : item
    )
    expanded.value = { ...expanded.value, [target.id]: true }
    moveOpen.value = false
    toast.success(`${plural(ids.size, 'resource', 'resources')} moved to ${target.name}.`, {
      description: 'Role bindings inherited from the old parent no longer apply.',
      actions: [{ label: 'Undo', onClick: () => (resources.value = before) }]
    })
  }

  const deleteOpen = ref(false)
  const deleting = ref([])
  const deletingInside = computed(() => {
    const ids = new Set(deleting.value.map((item) => item.id))
    const inside = new Set()
    for (const item of deleting.value)
      for (const child of descendantsOf(item.id)) if (!ids.has(child.id)) inside.add(child.id)
    return inside.size
  })
  const openDelete = (items) => {
    deleting.value = items
    deleteOpen.value = true
  }
  const confirmDelete = () => {
    const ids = new Set(
      deleting.value.flatMap((item) => [
        item.id,
        ...descendantsOf(item.id).map((child) => child.id)
      ])
    )
    const before = resources.value
    resources.value = resources.value.filter((item) => !ids.has(item.id))
    selection.value = {}
    deleteOpen.value = false
    toast.success(`${plural(ids.size, 'resource', 'resources')} scheduled for deletion.`, {
      description: 'They stay in Resources pending deletion for 30 days.',
      actions: [{ label: 'Undo', onClick: () => (resources.value = before) }]
    })
  }

  const labelsOpen = ref(false)
  const labelling = ref([])
  const addLabels = ref([])
  const removeLabels = ref([])
  const knownLabels = computed(() =>
    [...new Set(resources.value.flatMap((item) => item.labels ?? []))].sort()
  )
  const presentLabels = computed(() =>
    [...new Set(labelling.value.flatMap((item) => item.labels ?? []))].sort()
  )
  const openLabels = (items) => {
    labelling.value = items
    addLabels.value = []
    removeLabels.value = []
    labelsOpen.value = true
  }
  const confirmLabels = () => {
    const ids = new Set(labelling.value.map((item) => item.id))
    resources.value = resources.value.map((item) => {
      if (!ids.has(item.id)) return item
      const next = new Set(item.labels ?? [])
      addLabels.value.forEach((label) => next.add(label))
      removeLabels.value.forEach((label) => next.delete(label))
      return { ...item, labels: [...next].sort() }
    })
    labelsOpen.value = false
    toast.success(`Labels updated on ${plural(ids.size, 'resource', 'resources')}.`)
  }

  const onRowAction = (value, row) => {
    const item = resources.value.find((entry) => entry.id === row.id)
    if (!item) return
    if (value === 'details') {
      selection.value = { [item.id]: true }
      detailsOpen.value = true
    }
    if (value === 'move') openMove([item])
    if (value === 'labels') openLabels([item])
    if (value === 'delete') openDelete([item])
  }
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Manage resources"
        description="Organize workspaces into a hierarchy of organizations and groups. Role bindings set on a parent apply to everything under it."
      />

      <div
        role="group"
        aria-label="Resource actions"
        class="layout-section-start flex flex-wrap items-center gap-(--spacing-xs)"
      >
        <Button
          label="Create workspace"
          icon="pi pi-plus"
          kind="primary"
          size="medium"
          href="/account/resources/new"
        />
        <Button
          label="Create group"
          icon="pi pi-folder"
          kind="outlined"
          size="medium"
          href="/account/resources/new-group"
        />
        <span
          class="mx-(--spacing-xxs) h-(--size-5) w-px bg-(--border-muted)"
          aria-hidden="true"
        />
        <Button
          label="Move"
          icon="pi pi-arrow-right-arrow-left"
          kind="outlined"
          size="medium"
          :disabled="!selectedCount"
          @click="openMove(selected)"
        />
        <Button
          label="Labels"
          icon="pi pi-tag"
          kind="outlined"
          size="medium"
          :disabled="!selectedCount"
          @click="openLabels(selected)"
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          kind="outlined"
          size="medium"
          :disabled="!selectedCount"
          @click="openDelete(selected)"
        />
        <div class="ms-auto flex items-center gap-(--spacing-xs)">
          <Tooltip text="Refresh">
            <IconButton
              icon="pi pi-refresh"
              kind="outlined"
              size="medium"
              :loading="refreshing"
              aria-label="Refresh resources"
              @click="refresh"
            />
          </Tooltip>
          <Button
            :label="detailsOpen ? 'Hide details' : 'Show details'"
            :icon="detailsOpen ? 'pi pi-eye-slash' : 'pi pi-eye'"
            kind="transparent"
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
              kind="transparent"
              size="small"
              @click="clearSelection"
            />
          </div>

          <Alert
            v-if="loadFailed"
            severity="danger"
          >
            The resources could not be loaded. Nothing was changed; try again.
            <template #action>
              <Button
                label="Retry"
                kind="secondary"
                size="small"
                @click="retryLoad"
              />
            </template>
          </Alert>

          <Card
            v-else-if="!loading && !resources.length"
            :padded="false"
          >
            <template #content>
              <EmptyState
                size="medium"
                icon="pi pi-sitemap"
                title="No resources yet"
                description="Create a workspace, then group workspaces under organizations and groups to share role bindings."
              >
                <template #actions>
                  <Button
                    label="Create workspace"
                    icon="pi pi-plus"
                    kind="secondary"
                    size="small"
                    href="/account/resources/new"
                  />
                </template>
              </EmptyState>
            </template>
          </Card>

          <Card
            v-else
            :padded="false"
          >
            <template #content>
              <Table
                v-model:expanded="expanded"
                v-model:row-selection="selection"
                :data="tree"
                :columns="columns"
                :get-sub-rows="(row) => row.children"
                :loading="loading || refreshing"
                row-key="id"
                enable-row-selection
                :bordered="false"
                :aria-labelledby="`${uid}-resources`"
              >
                <template #cell-name="{ row }">
                  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <Avatar
                      v-if="row.type !== 'workspace'"
                      :label="initials(row.name)"
                      size="small"
                      kind="square"
                    />
                    <i
                      v-else
                      :class="types[row.type].icon"
                      class="shrink-0 text-body-sm text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="truncate text-label-sm text-(--text-default)">{{ row.name }}</span>
                    <Tooltip
                      v-if="row.id === currentId"
                      text="Current workspace"
                    >
                      <i
                        class="pi pi-check shrink-0 text-body-xs text-(--text-muted)"
                        aria-label="Current workspace"
                        role="img"
                      />
                    </Tooltip>
                  </span>
                </template>
                <template #cell-id="{ row, value }">
                  <Table.CellId
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
                    :severity="types[value].severity"
                    size="small"
                  />
                </template>
                <template #cell-lastAccessed="{ value }">
                  <span class="text-body-sm text-(--text-muted)">{{ value || '—' }}</span>
                </template>
                <template #cell-status="{ value }">
                  <Table.CellStatus
                    :label="value"
                    :severity="statusSeverity(value)"
                  />
                </template>
                <template #cell-charges="{ value }">
                  <span
                    class="tabular-nums"
                    :class="value ? 'text-(--text-default)' : 'text-(--text-muted)'"
                    >{{ value ? money.format(value) : '—' }}</span
                  >
                </template>
                <template #header-charges>
                  <span class="inline-flex items-center gap-(--spacing-xxs)">
                    Charges
                    <Tooltip text="Estimated month-to-date charges.">
                      <i
                        class="pi pi-question-circle text-body-xs text-(--text-muted)"
                        role="img"
                        aria-label="About charges"
                        tabindex="0"
                      />
                    </Tooltip>
                  </span>
                </template>
                <template #cell-labels="{ value }">
                  <Table.CellTags
                    :items="value ?? []"
                    icon="pi pi-tag"
                    :noun="{ one: 'label', other: 'labels' }"
                  />
                </template>
                <template #header-actions>
                  <span class="sr-only">Actions</span>
                </template>
                <template #cell-actions="{ row }">
                  <Table.CellActions
                    :name="row.name"
                    @select="(event, value) => onRowAction(value, row)"
                  >
                    <DropdownMenu.Group>
                      <DropdownMenu.Option
                        value="details"
                        label="View details"
                      />
                      <DropdownMenu.Option
                        value="move"
                        label="Move"
                      />
                      <DropdownMenu.Option
                        value="labels"
                        label="Edit labels"
                      />
                    </DropdownMenu.Group>
                    <DropdownMenu.Group>
                      <DropdownMenu.Option
                        value="delete"
                        label="Delete"
                      />
                    </DropdownMenu.Group>
                  </Table.CellActions>
                </template>
              </Table>
            </template>
          </Card>

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
            <template #content>
              <div class="flex flex-col gap-(--spacing-md)">
                <h2
                  :id="`${uid}-details-heading`"
                  class="text-heading-xs text-(--text-default)"
                  aria-live="polite"
                >
                  {{ detailsTitle }}
                </h2>

                <Tabs.Root v-model="detailsTab">
                  <div class="flex flex-col gap-(--spacing-md)">
                    <Tabs.List aria-label="Details">
                      <Tabs.Item
                        value="permissions"
                        label="Permissions"
                      />
                      <Tabs.Item
                        value="labels"
                        label="Labels"
                      />
                    </Tabs.List>
                    <Tabs.Content>
                      <Tabs.Panel value="permissions">
                        <Alert
                          v-if="!focused"
                          severity="info"
                        >
                          {{
                            selectedCount
                              ? 'Select a single resource to see its role bindings.'
                              : 'Select a resource to see its role bindings and labels.'
                          }}
                        </Alert>
                        <div
                          v-else
                          class="flex flex-col gap-(--spacing-sm)"
                        >
                          <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                            <Tag
                              :label="types[focused.type].label"
                              :icon="types[focused.type].icon"
                              :severity="types[focused.type].severity"
                              size="small"
                            />
                            <span class="truncate text-label-md text-(--text-default)">{{
                              focused.name
                            }}</span>
                          </div>
                          <ul
                            aria-label="Role bindings"
                            class="m-0 flex list-none flex-col gap-(--spacing-xs) p-0"
                          >
                            <li
                              v-for="binding in roleBindings"
                              :key="binding.role"
                              class="flex items-center justify-between rounded-(--shape-elements) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-xs)"
                            >
                              <span class="text-label-sm text-(--text-default)">{{
                                binding.role
                              }}</span>
                              <span class="text-body-xs text-(--text-muted)">{{
                                plural(binding.members, 'member', 'members')
                              }}</span>
                            </li>
                          </ul>
                        </div>
                      </Tabs.Panel>
                      <Tabs.Panel value="labels">
                        <Alert
                          v-if="!focused"
                          severity="info"
                        >
                          {{
                            selectedCount
                              ? 'Select a single resource to see its labels.'
                              : 'Select a resource to see its role bindings and labels.'
                          }}
                        </Alert>
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
                                severity="secondary"
                                size="medium"
                              />
                            </li>
                          </ul>
                          <p
                            v-else
                            class="text-body-sm text-(--text-muted)"
                          >
                            This resource has no labels.
                          </p>
                          <Button
                            label="Edit labels"
                            icon="pi pi-tag"
                            kind="outlined"
                            size="small"
                            class="self-start"
                            @click="openLabels([focused])"
                          />
                        </div>
                      </Tabs.Panel>
                    </Tabs.Content>
                  </div>
                </Tabs.Root>
              </div>
            </template>
          </Card>
        </aside>
      </div>
    </main>

    <Dialog
      v-model:open="moveOpen"
      size="medium"
    >
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
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
          <PanelContent>
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
                    <Select.Option
                      v-for="option in destinationOptions"
                      :key="option.value"
                      :value="option.value"
                      >{{ option.label }} · {{ types[option.type].label }}</Select.Option
                    >
                  </Select.Content>
                </Select>
                <Field.Description
                  >A resource cannot move into itself or into anything inside it.</Field.Description
                >
                <Field.Error v-if="destinationError">{{ destinationError }}</Field.Error>
              </Field>
            </form>
          </PanelContent>
          <PanelFooter>
            <div class="flex w-full justify-end gap-(--spacing-xs)">
              <Button
                label="Cancel"
                kind="outlined"
                size="medium"
                @click="moveOpen = false"
              />
              <Button
                label="Move"
                kind="primary"
                size="medium"
                @click="confirmMove"
              />
            </div>
          </PanelFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>

    <Dialog
      v-model:open="labelsOpen"
      size="medium"
    >
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
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
          <PanelContent>
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
                    <MultiSelect.Option
                      v-for="label in knownLabels"
                      :key="label"
                      :value="label"
                      >{{ label }}</MultiSelect.Option
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
                    <MultiSelect.Option
                      v-for="label in presentLabels"
                      :key="label"
                      :value="label"
                      >{{ label }}</MultiSelect.Option
                    >
                  </MultiSelect.Content>
                </MultiSelect>
              </Field>
            </form>
          </PanelContent>
          <PanelFooter>
            <div class="flex w-full justify-end gap-(--spacing-xs)">
              <Button
                label="Cancel"
                kind="outlined"
                size="medium"
                @click="labelsOpen = false"
              />
              <Button
                label="Save labels"
                kind="primary"
                size="medium"
                :disabled="!addLabels.length && !removeLabels.length"
                @click="confirmLabels"
              />
            </div>
          </PanelFooter>
        </DialogContent>
      </DialogPortal>
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
      @confirm="confirmDelete"
    />

    <Toaster position="bottom-right" />
  </div>
</template>
