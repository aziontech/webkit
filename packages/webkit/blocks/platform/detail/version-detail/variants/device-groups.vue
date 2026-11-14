<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu, { type DropdownMenuOptionValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Resizable from '@aziontech/webkit/resizable'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Select from '@aziontech/webkit/select'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import SplitButton from '@aziontech/webkit/split-button'
  import type { TableColumn, TableExposed } from '@aziontech/webkit/table-root'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'

  type VersionEntry = {
    id: string
    name: string
    state: string
    tag: { label: string; severity: TagSeverity; icon: string }
    comment: string
    author: string
    createdAgo: string
  }

  const tabs = [
    { value: 'main-settings', label: 'Settings' },
    { value: 'source', label: 'Source' },
    { value: 'device-groups', label: 'Device Groups' },
    { value: 'cache-settings', label: 'Cache Settings' },
    { value: 'functions-instances', label: 'Functions Instances' },
    { value: 'rules-engine', label: 'Rules Engine' }
  ]
  const versions: VersionEntry[] = [
    {
      id: 'ADA8FMMR',
      name: 'ADA8FMMR',
      state: 'draft',
      tag: { label: 'Draft', severity: 'warning', icon: 'pi pi-file-edit' },
      comment: 'Cache static assets for 30 days',
      author: 'John Smith',
      createdAgo: '14 hours ago'
    },
    {
      id: 'AEO25I38',
      name: 'AEO25I38',
      state: 'active',
      tag: { label: 'Deployed', severity: 'primary', icon: '' },
      comment: 'Remove rule"Legacy load balancer"',
      author: 'Sam Lee',
      createdAgo: '1 day ago'
    },
    {
      id: 'AG1VVDJP',
      name: 'AG1VVDJP',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Enable image optimization',
      author: 'Priya Patel',
      createdAgo: '3 days ago'
    },
    {
      id: 'AHFPL906',
      name: 'AHFPL906',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Update function"ab-test" arguments',
      author: 'Chris Taylor',
      createdAgo: '3 days ago'
    },
    {
      id: 'AITJB4GN',
      name: 'AITJB4GN',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Add variable"API_URL"',
      author: 'Riley Carter',
      createdAgo: '4 days ago'
    },
    {
      id: 'AK7D0ZX4',
      name: 'AK7D0ZX4',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Cache static assets for 30 days',
      author: 'Ethan Brooks',
      createdAgo: '6 days ago'
    },
    {
      id: 'ALL6QVDL',
      name: 'ALL6QVDL',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Remove rule"Legacy load balancer"',
      author: 'Jordan Kim',
      createdAgo: '1 week ago'
    }
  ]
  const version: VersionEntry = {
    id: 'ADA8FMMR',
    name: 'ADA8FMMR',
    state: 'draft',
    tag: { label: 'Draft', severity: 'warning', icon: 'pi pi-file-edit' },
    comment: 'Cache static assets for 30 days',
    author: 'John Smith',
    createdAgo: '14 hours ago'
  }
  const earlier: VersionEntry[] = [
    {
      id: 'AEO25I38',
      name: 'AEO25I38',
      state: 'active',
      tag: { label: 'Deployed', severity: 'primary', icon: '' },
      comment: 'Remove rule"Legacy load balancer"',
      author: 'Sam Lee',
      createdAgo: '1 day ago'
    },
    {
      id: 'AG1VVDJP',
      name: 'AG1VVDJP',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Enable image optimization',
      author: 'Priya Patel',
      createdAgo: '3 days ago'
    },
    {
      id: 'AHFPL906',
      name: 'AHFPL906',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Update function"ab-test" arguments',
      author: 'Chris Taylor',
      createdAgo: '3 days ago'
    },
    {
      id: 'AITJB4GN',
      name: 'AITJB4GN',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Add variable"API_URL"',
      author: 'Riley Carter',
      createdAgo: '4 days ago'
    },
    {
      id: 'AK7D0ZX4',
      name: 'AK7D0ZX4',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Cache static assets for 30 days',
      author: 'Ethan Brooks',
      createdAgo: '6 days ago'
    },
    {
      id: 'ALL6QVDL',
      name: 'ALL6QVDL',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Remove rule"Legacy load balancer"',
      author: 'Jordan Kim',
      createdAgo: '1 week ago'
    }
  ]
  const saveOptions = [
    { label: 'Save and deploy', value: 'deploy' },
    { label: 'Save and build', value: 'build' },
    { label: 'Save', value: 'save' }
  ]

  const versionId = ref('ADA8FMMR')
  const query = ref('')
  const activeTab = ref('device-groups')
  const tabLabel = computed(() => tabs.find((tab) => tab.value === activeTab.value)?.label ?? '')
  const saveAction = ref<string | undefined>('deploy')

  type DeviceGroup = {
    id: string
    name: string
    userAgent: string
    author: string
    modifiedAgo: string
  }

  const groupColumns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', principal: true, hideable: false, enableSorting: true },
    { accessorKey: 'userAgent', header: 'User-Agent match', grow: 2 },
    { accessorKey: 'modifiedAgo', header: 'Last modified', minWidth: 160 }
  ]
  const groups = ref<DeviceGroup[]>([
    {
      id: '3101',
      name: 'mobile',
      userAgent: '(Mobile|iP(hone|od)|Android|IEMobile)',
      author: 'Jane Doe',
      modifiedAgo: '2 days ago'
    },
    {
      id: '3102',
      name: 'tablet',
      userAgent: '(iPad|Tablet|Kindle|Silk)',
      author: 'Alex Morgan',
      modifiedAgo: '1 week ago'
    },
    {
      id: '3103',
      name: 'crawlers',
      userAgent: '(Googlebot|Bingbot|DuckDuckBot)',
      author: 'Sam Lee',
      modifiedAgo: '3 weeks ago'
    }
  ])

  const search = ref('')
  const tableRef = ref<TableExposed | null>(null)
  const loading = ref(false)
  let refreshTimer: ReturnType<typeof setTimeout> | undefined
  const refresh = () => {
    if (loading.value) return
    loading.value = true
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      loading.value = false
    }, 700)
  }
  onBeforeUnmount(() => clearTimeout(refreshTimer))

  const drawerOpen = ref(false)
  const editingId = ref('')
  const submitting = ref(false)
  const form = reactive({ name: '', userAgent: '' })
  const errors = reactive({ name: '', userAgent: '' })
  const drawerTitle = computed(() => (editingId.value ? 'Edit Device Group' : 'Add Device Group'))

  const openGroup = (group?: DeviceGroup) => {
    editingId.value = group?.id ?? ''
    form.name = group?.name ?? ''
    form.userAgent = group?.userAgent ?? ''
    errors.name = ''
    errors.userAgent = ''
    drawerOpen.value = true
  }

  watch(
    () => form.name,
    () => (errors.name = '')
  )
  watch(
    () => form.userAgent,
    () => (errors.userAgent = '')
  )

  const validate = () => {
    const name = form.name.trim()
    if (!name) errors.name = 'Enter a name for the device group.'
    else if (!/^[a-z0-9-]+$/.test(name))
      errors.name = 'Use lowercase letters, numbers and hyphens only.'
    errors.userAgent = form.userAgent.trim() ? '' : 'Enter a regular expression.'
    return !errors.name && !errors.userAgent
  }

  let submitTimer: ReturnType<typeof setTimeout> | undefined
  const submit = () => {
    if (submitting.value || !validate()) return
    submitting.value = true
    clearTimeout(submitTimer)
    submitTimer = setTimeout(() => {
      const record = { name: form.name.trim(), userAgent: form.userAgent.trim() }
      const existing = groups.value.find((group) => group.id === editingId.value)
      if (existing) Object.assign(existing, record, { modifiedAgo: 'Just now' })
      else
        groups.value = [
          ...groups.value,
          {
            id: String(3100 + groups.value.length + 1),
            ...record,
            author: 'John Smith',
            modifiedAgo: 'Just now'
          }
        ]
      submitting.value = false
      drawerOpen.value = false
      toast.success(
        existing ? `Device group "${record.name}" saved.` : `Device group "${record.name}" added.`,
        { description: 'The change is part of this draft until you deploy it.' }
      )
    }, 700)
  }
  onBeforeUnmount(() => clearTimeout(submitTimer))
  const historyExpanded = ref(false)
  const historyBasis = ref(348)
  const description = ref('Cache static assets for 30 days')
  const draftText = ref('')
  const editing = ref(false)
  const shown = ref(5)

  const matches = computed(() =>
    versions.filter((entry) => entry.name.toLowerCase().includes(query.value.trim().toLowerCase()))
  )

  const openHistory = (_event: MouseEvent | KeyboardEvent, value: DropdownMenuOptionValue) => {
    if (value === 'history' && historyExpanded.value) {
      historyExpanded.value = false
      return
    }
    editing.value = value === 'edit'
    if (editing.value) draftText.value = description.value
    historyExpanded.value = true
  }
</script>

<template>
  <div
    data-layout-fill
    class="flex h-dvh min-h-0 flex-col"
  >
    <ConsoleLayout.Breadcrumbs
      :items="[
        { label: 'Resources', href: '/resources' },
        { label: 'web-app', href: '/resources/1784552864' }
      ]"
    >
      <Select
        kind="transparent"
        size="small"
        :model-value="versionId"
        :display-value="(id) => versions.find((entry) => entry.id === id)?.name ?? String(id ?? '')"
        @update:open="
          (open) => {
            if (!open) query = ''
          }
        "
      >
        <Select.Trigger aria-label="Switch version" />
        <Select.Content>
          <template #search>
            <Input
              v-model="query"
              size="small"
              placeholder="Search versions"
              aria-label="Search versions"
              @keydown.stop
            >
              <template #prefix>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
          </template>
          <Select.Group label="Versions">
            <Select.Option
              v-for="entry in matches"
              :key="entry.id"
              :value="entry.id"
            >
              {{ entry.name }}
              <template #tag>
                <Tag
                  :label="entry.tag.label"
                  :severity="entry.tag.severity"
                  :icon="entry.tag.icon"
                  size="small"
                />
              </template>
            </Select.Option>
            <p
              v-if="!matches.length"
              class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
            >
              No versions match"{{ query }}".
            </p>
          </Select.Group>
          <template #footer>
            <Select.Option
              value="__create-version__"
              class="w-full"
            >
              <span class="flex items-center gap-(--spacing-xs)">
                <i
                  class="pi pi-plus-circle"
                  aria-hidden="true"
                />
                Add Version
              </span>
            </Select.Option>
          </template>
        </Select.Content>
      </Select>
    </ConsoleLayout.Breadcrumbs>
    <nav
      aria-label="Breadcrumb"
      class="flex min-w-0 items-center gap-(--spacing-xs) border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-xs) md:hidden"
    >
      <Tooltip text="Back to web-app versions">
        <IconButton
          icon="pi pi-arrow-left"
          kind="transparent"
          size="medium"
          href="/resources/1784552864?tab=versions"
          aria-label="Back to web-app versions"
        />
      </Tooltip>
      <div class="min-w-0 flex-1">
        <Select
          :model-value="versionId"
          :display-value="
            (id) => versions.find((entry) => entry.id === id)?.name ?? String(id ?? '')
          "
          class="w-full"
          @update:open="
            (open) => {
              if (!open) query = ''
            }
          "
        >
          <Select.Trigger aria-label="Switch version" />
          <Select.Content>
            <template #search>
              <Input
                v-model="query"
                size="small"
                placeholder="Search versions"
                aria-label="Search versions"
                @keydown.stop
              >
                <template #prefix>
                  <i
                    class="pi pi-search"
                    aria-hidden="true"
                  />
                </template>
              </Input>
            </template>
            <Select.Group label="Versions">
              <Select.Option
                v-for="entry in matches"
                :key="entry.id"
                :value="entry.id"
              >
                {{ entry.name }}
                <template #tag>
                  <Tag
                    :label="entry.tag.label"
                    :severity="entry.tag.severity"
                    :icon="entry.tag.icon"
                    size="small"
                  />
                </template>
              </Select.Option>
              <p
                v-if="!matches.length"
                class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
              >
                No versions match"{{ query }}".
              </p>
            </Select.Group>
            <template #footer>
              <Select.Option
                value="__create-version__"
                class="w-full"
              >
                <span class="flex items-center gap-(--spacing-xs)">
                  <i
                    class="pi pi-plus-circle"
                    aria-hidden="true"
                  />
                  Add Version
                </span>
              </Select.Option>
            </template>
          </Select.Content>
        </Select>
      </div>
    </nav>
    <div class="grid min-h-0 flex-1">
      <Resizable
        orientation="horizontal"
        aria-label="Version workspace"
      >
        <Resizable.Pane aria-label="Version settings">
          <div class="flex min-h-0 min-w-0 flex-1 flex-col">
            <PageTabs v-model="activeTab">
              <Tabs.Item
                v-for="tab in tabs"
                :key="tab.value"
                :value="tab.value"
                :label="tab.label"
              />
              <template #actions>
                <Tag
                  label="Draft"
                  severity="warning"
                  icon="pi pi-file-edit"
                  size="medium"
                />
                <DropdownMenu
                  placement="bottom-end"
                  @select="openHistory"
                >
                  <DropdownMenu.Trigger>
                    <IconButton
                      icon="pi pi-ellipsis-h"
                      kind="transparent"
                      size="small"
                      aria-label="Version actions"
                    />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Group>
                    <DropdownMenu.Item
                      value="edit"
                      label="Edit version info"
                    >
                      <template #leading>
                        <i
                          class="pi pi-pencil"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      value="history"
                      :label="historyExpanded ? 'Hide version history' : 'Show version history'"
                    >
                      <template #leading>
                        <i
                          class="pi pi-history"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>
                </DropdownMenu>
              </template>
            </PageTabs>

            <section
              v-if="activeTab === 'device-groups'"
              class="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] transition-opacity duration-moderate-01 ease-productive-entrance data-processing:opacity-32 motion-reduce:transition-none"
            >
              <ScrollArea
                aria-label="Version settings"
                fade
              >
                <div class="flex min-h-full flex-col">
                  <div
                    class="layout-column layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
                  >
                    <PageHeader
                      title="Device Groups"
                      description="Group requests by their User-Agent, then vary cache and rules by group."
                      size="small"
                    >
                      <template #actions>
                        <Button
                          label="Add Device Group"
                          kind="outlined"
                          size="medium"
                          icon="pi pi-plus"
                          @click="openGroup()"
                        />
                      </template>
                    </PageHeader>

                    <section
                      class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)"
                    >
                      <header class="flex items-center gap-(--layout-group-gap)">
                        <div class="flex min-w-36 grow basis-(--container-2xs)">
                          <Input
                            v-model="search"
                            size="medium"
                            placeholder="Search device groups"
                            aria-label="Search device groups"
                            class="w-full"
                          >
                            <template #prefix>
                              <i
                                class="pi pi-search"
                                aria-hidden="true"
                              />
                            </template>
                          </Input>
                        </div>
                        <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                          <Tooltip
                            text="Refresh"
                            class="shrink-0"
                          >
                            <IconButton
                              icon="pi pi-refresh"
                              kind="outlined"
                              size="medium"
                              :loading="loading"
                              aria-label="Refresh"
                              @click="refresh"
                            />
                          </Tooltip>
                          <Tooltip
                            text="Download CSV"
                            class="shrink-0"
                          >
                            <IconButton
                              icon="pi pi-download"
                              kind="outlined"
                              size="medium"
                              :disabled="!tableRef"
                              aria-label="Download CSV"
                              @click="
                                tableRef?.exportCsv({ filename: 'web-app-device-groups.csv' })
                              "
                            />
                          </Tooltip>
                          <Tooltip
                            text="Columns"
                            class="shrink-0"
                          >
                            <IconButton
                              icon="ai ai-column"
                              kind="outlined"
                              size="medium"
                              aria-label="Columns"
                            />
                          </Tooltip>
                        </div>
                      </header>
                      <Card :padded="false">
                        <template #content>
                          <TableRoot
                            ref="tableRef"
                            v-model:globalFilter="search"
                            :data="groups"
                            :columns="groupColumns"
                            row-key="id"
                            enable-sorting
                            paginated
                            :page-size="10"
                            :bordered="false"
                            :loading="loading"
                            aria-label="Device groups"
                          >
                            <template #cell-name="{ row }">
                              <button
                                type="button"
                                class="truncate rounded-(--shape-button) text-start text-body-sm text-(--text-default) underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                                @click="openGroup(row)"
                              >
                                {{ row.name }}
                              </button>
                            </template>
                            <template #cell-userAgent="{ value }">
                              <span class="truncate text-label-code-sm text-(--text-muted)">{{
                                value
                              }}</span>
                            </template>
                            <template #cell-modifiedAgo="{ row }">
                              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                                <Tooltip :text="row.author">
                                  <Avatar
                                    :alt="row.author"
                                    :label="row.author"
                                    size="small"
                                    kind="square"
                                  />
                                </Tooltip>
                                <span class="truncate text-body-sm text-(--text-muted)">{{
                                  row.modifiedAgo
                                }}</span>
                              </div>
                            </template>
                            <template #empty>
                              <EmptyState
                                key="empty-state-1"
                                v-if="search.trim()"
                                size="medium"
                                icon="pi pi-search"
                                title="No matching device groups"
                                :description="`Nothing matches ${search.trim()}.`"
                              >
                                <template #actions>
                                  <Button
                                    label="Clear search"
                                    kind="outlined"
                                    size="small"
                                    @click="search = ''"
                                  />
                                </template>
                              </EmptyState>
                              <EmptyState
                                key="empty-state-2"
                                v-else
                                size="medium"
                                icon="pi pi-mobile"
                                title="No device groups yet"
                                description="Add the first one to this version."
                              >
                                <template #actions>
                                  <Button
                                    label="Add Device Group"
                                    icon="pi pi-plus"
                                    kind="secondary"
                                    size="small"
                                    @click="openGroup()"
                                  />
                                </template>
                              </EmptyState>
                            </template>
                          </TableRoot>
                        </template>
                      </Card>
                    </section>
                  </div>

                  <Drawer
                    v-model:open="drawerOpen"
                    size="medium"
                    side="right"
                  >
                    <DrawerPortal>
                      <DrawerOverlay />
                      <DrawerContent>
                        <form
                          class="flex min-h-0 flex-1 flex-col"
                          :aria-label="drawerTitle"
                          novalidate
                          @submit.prevent="submit"
                        >
                          <PanelHeader class="w-full">
                            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                              <DrawerTitle>{{ drawerTitle }}</DrawerTitle>
                              <DrawerDescription>
                                Requests whose User-Agent matches the expression belong to the
                                group.
                              </DrawerDescription>
                            </div>
                            <DrawerClose />
                          </PanelHeader>
                          <PanelContent>
                            <fieldset
                              class="m-0 flex min-w-0 flex-col border-0 p-0"
                              :disabled="submitting"
                            >
                              <legend class="sr-only">{{ drawerTitle }}</legend>
                              <SettingsSection
                                title="General"
                                hint="Names the group in the rules that reference it, so renaming it means revisiting those rules."
                              >
                                <Field
                                  :invalid="!!errors.name"
                                  :disabled="submitting"
                                >
                                  <Field.Label>Name</Field.Label>
                                  <Input
                                    v-model="form.name"
                                    size="large"
                                    class="w-full"
                                    placeholder="mobile"
                                    autocomplete="off"
                                    monospace
                                    :spellcheck="false"
                                  />
                                  <Field.Description
                                    >Lowercase letters, numbers and hyphens.</Field.Description
                                  >
                                  <Field.Error v-if="errors.name">{{ errors.name }}</Field.Error>
                                </Field>
                              </SettingsSection>
                              <SettingsSection
                                title="Match to User-Agent"
                                hint="Every request whose User-Agent header matches this expression belongs to the group."
                              >
                                <Field
                                  :invalid="!!errors.userAgent"
                                  :disabled="submitting"
                                >
                                  <Field.Label>Regular expression</Field.Label>
                                  <Textarea
                                    v-model="form.userAgent"
                                    class="w-full"
                                    placeholder="(Mobile|iP(hone|od)|Android)"
                                    monospace
                                    :spellcheck="false"
                                  />
                                  <Field.Description>
                                    Matched against the full header value, so anchor the pattern
                                    when you need one.
                                  </Field.Description>
                                  <Field.Error v-if="errors.userAgent">{{
                                    errors.userAgent
                                  }}</Field.Error>
                                </Field>
                              </SettingsSection>
                            </fieldset>
                          </PanelContent>
                          <PanelFooter>
                            <div class="flex w-full justify-end gap-(--spacing-xs)">
                              <Button
                                type="button"
                                label="Cancel"
                                kind="outlined"
                                size="medium"
                                :disabled="submitting"
                                @click="drawerOpen = false"
                              />
                              <Button
                                type="submit"
                                :label="editingId ? 'Save' : 'Add Device Group'"
                                kind="primary"
                                size="medium"
                                :loading="submitting"
                              />
                            </div>
                          </PanelFooter>
                        </form>
                      </DrawerContent>
                    </DrawerPortal>
                  </Drawer>
                </div>
              </ScrollArea>
            </section>
            <section
              v-else
              class="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] transition-opacity duration-moderate-01 ease-productive-entrance data-processing:opacity-32 motion-reduce:transition-none"
            >
              <div class="layout-column layout-boundary flex min-w-0 flex-col">
                <div class="layout-section-start">
                  <EmptyState
                    size="medium"
                    icon="pi pi-external-link"
                    :title="tabLabel"
                    :description="`${tabLabel} opens on its own page.`"
                  >
                    <template #actions>
                      <Button
                        :label="`Open ${tabLabel}`"
                        kind="outlined"
                        size="small"
                        :href="`/resources/web-app/${activeTab}`"
                      />
                    </template>
                  </EmptyState>
                </div>
              </div>
            </section>

            <Transition
              appear
              enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
              enter-from-class="translate-y-2 opacity-0"
            >
              <footer
                class="flex min-h-14 shrink-0 flex-col border-t border-(--border-default) bg-(--bg-surface)"
                data-testid="version-detail-bar"
              >
                <div
                  class="layout-boundary-inline flex min-w-0 flex-1 items-center gap-(--spacing-sm) py-(--spacing-xs)"
                >
                  <span
                    class="hidden size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) md:flex"
                    aria-hidden="true"
                  >
                    <i class="pi pi-file-edit text-body-sm text-(--text-default)" />
                  </span>
                  <div
                    class="flex min-w-0 flex-1 flex-col"
                    role="status"
                  >
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <span class="truncate text-body-sm text-(--text-default)">Draft</span>
                      <span class="hidden shrink-0 sm:inline-flex">
                        <Tag
                          label="Editable"
                          severity="info"
                          size="small"
                        />
                      </span>
                    </div>
                    <p
                      class="hidden truncate text-body-xs text-(--text-muted) data-dirty:text-(--text-default) md:block"
                      title="This version is open for editing. Deploy it when ready."
                    >
                      This version is open for editing. Deploy it when ready.
                    </p>
                  </div>

                  <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                    <SplitButton
                      :label="saveOptions.find((option) => option.value === saveAction)?.label"
                      :icon="saveAction === 'deploy' ? 'pi pi-cloud-upload' : ''"
                      kind="primary"
                      size="medium"
                      :items="saveOptions"
                      @item-click="(_event, item) => (saveAction = item.value)"
                    />
                  </div>
                </div>
              </footer>
            </Transition>
          </div>
        </Resizable.Pane>
        <Resizable.Handle
          v-if="historyExpanded"
          aria-label="Resize the version history"
        />
        <Resizable.Pane
          v-model:basis="historyBasis"
          v-model:expanded="historyExpanded"
          collapsible
          :min="280"
          :max="560"
          aria-label="Version history"
        >
          <aside
            :inert="!historyExpanded"
            aria-labelledby="version-history-title"
            class="flex min-h-0 min-w-0 flex-1 flex-col bg-(--bg-surface)"
            data-testid="version-detail-history"
            @keydown.esc="historyExpanded = false"
          >
            <header
              class="flex min-h-14 shrink-0 items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) py-(--spacing-xs) ps-(--spacing-lg) pe-(--spacing-sm)"
            >
              <h2
                id="version-history-title"
                class="truncate text-label-lg text-(--text-default)"
              >
                Version history
              </h2>
              <IconButton
                icon="pi pi-times"
                kind="transparent"
                size="small"
                aria-label="Close version history"
                @click="historyExpanded = false"
              />
            </header>
            <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-(--spacing-lg)">
              <ol class="flex flex-col">
                <li class="relative flex gap-(--spacing-sm) pb-(--spacing-lg)">
                  <span
                    class="absolute bottom-0 start-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
                    aria-hidden="true"
                  />
                  <span
                    class="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-(--accent) text-(--accent-contrast)"
                    aria-hidden="true"
                  >
                    <i class="pi pi-file-edit text-body-xs" />
                  </span>
                  <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs) pt-0.5">
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <span class="truncate text-label-md text-(--text-default)">
                        {{ version.name }}
                      </span>
                      <span class="flex shrink-0">
                        <Tag
                          :label="version.tag.label"
                          :severity="version.tag.severity"
                          size="small"
                        />
                      </span>
                      <span
                        v-if="!editing"
                        class="ms-auto shrink-0"
                      >
                        <IconButton
                          icon="pi pi-pencil"
                          kind="transparent"
                          size="small"
                          aria-label="Edit version info"
                          @click="
                            () => {
                              draftText = description
                              editing = true
                            }
                          "
                        />
                      </span>
                    </div>
                    <p class="text-label-sm text-(--text-muted)">Current version</p>

                    <div
                      v-if="editing"
                      class="flex flex-col gap-(--spacing-sm) pt-(--spacing-xs)"
                    >
                      <Field>
                        <Field.Label>Description</Field.Label>
                        <Textarea
                          v-model="draftText"
                          placeholder="What changed in this version?"
                        />
                        <Field.Description
                          >Shows in the version list and on the deployment.</Field.Description
                        >
                      </Field>
                      <div class="flex justify-end gap-(--spacing-xs)">
                        <Button
                          label="Cancel"
                          kind="outlined"
                          size="small"
                          @click="editing = false"
                        />
                        <Button
                          label="Save"
                          kind="primary"
                          size="small"
                          @click="
                            () => {
                              description = draftText.trim()
                              editing = false
                            }
                          "
                        />
                      </div>
                    </div>
                    <template v-else>
                      <p
                        :data-empty="!description || null"
                        class="text-body-sm text-(--text-default) data-empty:text-(--text-muted)"
                      >
                        {{ description || 'No description' }}
                      </p>
                      <span
                        class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)"
                      >
                        <span class="flex shrink-0">
                          <Avatar
                            :alt="version.author"
                            :label="version.author"
                            size="small"
                            kind="square"
                          />
                        </span>
                        <span class="truncate"
                          >{{ version.author }} · {{ version.createdAgo }}</span
                        >
                      </span>
                    </template>
                  </div>
                </li>

                <li class="relative flex flex-col pb-(--spacing-lg)">
                  <span
                    class="absolute bottom-0 start-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
                    aria-hidden="true"
                  />
                  <p class="flex gap-(--spacing-sm)">
                    <span
                      class="relative flex size-7 shrink-0 items-center justify-center"
                      aria-hidden="true"
                    >
                      <span
                        class="size-2 rounded-full border border-(--border-strong) bg-(--bg-surface)"
                      />
                    </span>
                    <span class="pt-1 text-body-sm text-(--text-muted)">
                      No changes yet. Each change you save shows up here.
                    </span>
                  </p>
                </li>

                <li
                  v-for="(entry, index) in earlier.slice(0, shown)"
                  :key="entry.id"
                  class="relative flex pb-(--spacing-lg) last:pb-0"
                >
                  <span
                    v-if="index < earlier.slice(0, shown).length - 1"
                    class="absolute bottom-0 start-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
                    aria-hidden="true"
                  />
                  <a
                    :href="`/resources/web-app/versions/${entry.name}`"
                    class="group flex w-full min-w-0 gap-(--spacing-sm) rounded-(--shape-button) text-start no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                  >
                    <span
                      class="relative flex size-7 shrink-0 items-center justify-center rounded-full border border-(--border-default) bg-(--bg-surface) text-(--text-default)"
                      aria-hidden="true"
                    >
                      <i class="pi pi-code text-body-xs" />
                    </span>
                    <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs) pt-0.5">
                      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                        <span
                          class="truncate text-label-md text-(--text-default) group-hover:underline"
                        >
                          {{ entry.name }}
                        </span>
                        <span class="flex shrink-0">
                          <Tag
                            :label="entry.tag.label"
                            :severity="entry.tag.severity"
                            size="small"
                          />
                        </span>
                      </span>
                      <span class="line-clamp-2 text-body-sm text-(--text-muted)">
                        {{ entry.comment }}
                      </span>
                      <span
                        class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)"
                      >
                        <span class="flex shrink-0">
                          <Avatar
                            :alt="entry.author"
                            :label="entry.author"
                            size="small"
                            kind="square"
                          />
                        </span>
                        <span class="truncate">{{ entry.author }} · {{ entry.createdAgo }}</span>
                      </span>
                    </span>
                  </a>
                </li>
              </ol>

              <div
                v-if="earlier.length > shown"
                class="pt-(--spacing-sm)"
              >
                <Button
                  label="Show older"
                  kind="transparent"
                  size="small"
                  @click="shown += 5"
                />
              </div>
            </div>
          </aside>
        </Resizable.Pane>
      </Resizable>
    </div>
  </div>
</template>
