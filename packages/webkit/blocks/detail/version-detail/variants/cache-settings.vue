<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import type { TableColumn, TableExposed } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import FieldError from '@aziontech/webkit/field-error'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import NumberInput from '@aziontech/webkit/number-input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Resizable from '@aziontech/webkit/resizable'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Select from '@aziontech/webkit/select'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import SplitButton from '@aziontech/webkit/split-button'
  import Switch from '@aziontech/webkit/switch'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag, { type TagSeverity, type TagVariant } from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'

  type VersionEntry = {
    id: string
    name: string
    state: string
    tag: { label: string; severity?: TagSeverity; variant?: TagVariant; icon: string }
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
      tag: { label: 'Draft', severity: 'warning', icon: 'ai ai-file-pen' },
      comment: 'Cache static assets for 30 days',
      author: 'John Smith',
      createdAgo: '14 hours ago'
    },
    {
      id: 'AEO25I38',
      name: 'AEO25I38',
      state: 'active',
      tag: { label: 'Deployed', variant: 'primary', icon: '' },
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
    tag: { label: 'Draft', severity: 'warning', icon: 'ai ai-file-pen' },
    comment: 'Cache static assets for 30 days',
    author: 'John Smith',
    createdAgo: '14 hours ago'
  }
  const earlier: VersionEntry[] = [
    {
      id: 'AEO25I38',
      name: 'AEO25I38',
      state: 'active',
      tag: { label: 'Deployed', variant: 'primary', icon: '' },
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
  const activeTab = ref('cache-settings')
  const tabLabel = computed(() => tabs.find((tab) => tab.value === activeTab.value)?.label ?? '')
  const saveAction = ref<string | undefined>('deploy')

  type CacheSetting = {
    id: string
    name: string
    browserBehavior: string
    browserMaxAge: number
    edgeBehavior: string
    edgeMaxAge: number
    staleCache: boolean
    largeFileCache: boolean
    largeFileOffset: number
    tieredCache: boolean
    tieredTopology: string
    varyByMethod: string[]
    queryStringBehavior: string
    queryStringFields: string
    cookieBehavior: string
    cookieNames: string
    deviceBehavior: string
    deviceGroups: string[]
    author: string
    modifiedAgo: string
  }

  const browserBehaviors = [
    { value: 'honor', label: 'Honor origin cache headers' },
    { value: 'override', label: 'Override cache settings' },
    { value: 'no-cache', label: 'No cache' }
  ]
  const edgeBehaviors = [
    { value: 'honor', label: 'Honor origin cache headers' },
    { value: 'override', label: 'Override cache settings' }
  ]
  const topologies = [
    { value: 'nearest-region', label: 'Nearest region' },
    { value: 'north-america', label: 'North America' },
    { value: 'europe', label: 'Europe' }
  ]
  const varyBehaviors = [
    { value: 'ignore', label: 'Ignore all, best cache rate' },
    { value: 'all', label: 'Vary by all' },
    { value: 'allowlist', label: 'Vary by some (allowlist)' },
    { value: 'denylist', label: 'Vary by all except some (denylist)' }
  ]
  const deviceBehaviors = [
    { value: 'ignore', label: 'Ignore all, best cache rate' },
    { value: 'allowlist', label: 'Vary by some device groups (allowlist)' }
  ]
  const methods = [
    { value: 'POST', label: 'POST' },
    { value: 'OPTIONS', label: 'OPTIONS' }
  ]
  const deviceGroupOptions = [
    { value: 'mobile', label: 'mobile' },
    { value: 'tablet', label: 'tablet' },
    { value: 'crawlers', label: 'crawlers' }
  ]

  const labelOf = (options: { value: string; label: string }[]) => (value: unknown) =>
    options.find((option) => option.value === value)?.label ?? String(value ?? '')
  const methodsLabel = (values: unknown[] | undefined) => (values?.length ? values.join(', ') : '')
  const deviceGroupsLabel = (values: unknown[] | undefined) =>
    values?.length ? values.join(', ') : ''

  const cacheSummary = (behavior: string, maxAge: number) => {
    if (behavior === 'honor') return 'Origin headers'
    if (behavior === 'no-cache') return 'No cache'
    if (maxAge % 86400 === 0) return `${maxAge / 86400} ${maxAge === 86400 ? 'day' : 'days'}`
    if (maxAge % 3600 === 0) return `${maxAge / 3600} ${maxAge === 3600 ? 'hour' : 'hours'}`
    return `${maxAge} seconds`
  }

  const blankSetting = (): Omit<CacheSetting, 'id' | 'author' | 'modifiedAgo'> => ({
    name: '',
    browserBehavior: 'honor',
    browserMaxAge: 0,
    edgeBehavior: 'override',
    edgeMaxAge: 60,
    staleCache: false,
    largeFileCache: false,
    largeFileOffset: 1024,
    tieredCache: false,
    tieredTopology: 'nearest-region',
    varyByMethod: [],
    queryStringBehavior: 'ignore',
    queryStringFields: '',
    cookieBehavior: 'ignore',
    cookieNames: '',
    deviceBehavior: 'ignore',
    deviceGroups: []
  })

  const cacheColumns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', principal: true, hideable: false, sortable: true },
    { accessorKey: 'browserCache', header: 'Browser cache', minWidth: 140 },
    { accessorKey: 'edgeCache', header: 'Edge cache', minWidth: 140 },
    { accessorKey: 'tieredCache', header: 'Tiered cache', minWidth: 120 },
    { accessorKey: 'modifiedAgo', header: 'Last modified', minWidth: 160 }
  ]
  const cacheSettings = ref<CacheSetting[]>([
    {
      ...blankSetting(),
      id: '7101',
      name: 'static-assets',
      browserBehavior: 'override',
      browserMaxAge: 604800,
      edgeMaxAge: 2592000,
      staleCache: true,
      tieredCache: true,
      queryStringBehavior: 'allowlist',
      queryStringFields: 'v, lang',
      author: 'Jane Doe',
      modifiedAgo: '14 hours ago'
    },
    {
      ...blankSetting(),
      id: '7102',
      name: 'product-pages',
      edgeMaxAge: 3600,
      deviceBehavior: 'allowlist',
      deviceGroups: ['mobile', 'tablet'],
      author: 'Priya Patel',
      modifiedAgo: '2 days ago'
    },
    {
      ...blankSetting(),
      id: '7103',
      name: 'api-bypass',
      browserBehavior: 'no-cache',
      edgeBehavior: 'honor',
      author: 'Sam Lee',
      modifiedAgo: '1 week ago'
    }
  ])
  const rows = computed(() =>
    cacheSettings.value.map((setting) => ({
      ...setting,
      browserCache: cacheSummary(setting.browserBehavior, setting.browserMaxAge),
      edgeCache: cacheSummary(setting.edgeBehavior, setting.edgeMaxAge)
    }))
  )

  const search = ref('')
  const tableEl = ref<TableExposed | null>(null)
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
  const form = reactive(blankSetting())
  const errors = reactive({ name: '' })
  const drawerTitle = computed(() =>
    editingId.value ? 'Edit Cache Settings' : 'Add Cache Settings'
  )

  const openSetting = (setting?: CacheSetting) => {
    editingId.value = setting?.id ?? ''
    const source = setting ?? blankSetting()
    Object.assign(form, blankSetting(), {
      ...source,
      varyByMethod: [...source.varyByMethod],
      deviceGroups: [...source.deviceGroups]
    })
    errors.name = ''
    drawerOpen.value = true
  }

  watch(
    () => form.name,
    () => (errors.name = '')
  )

  let submitTimer: ReturnType<typeof setTimeout> | undefined
  const submit = () => {
    if (submitting.value) return
    errors.name = form.name.trim() ? '' : 'Enter a name for this cache setting.'
    if (errors.name) return
    submitting.value = true
    clearTimeout(submitTimer)
    submitTimer = setTimeout(() => {
      const record = { ...form, name: form.name.trim() }
      const existing = cacheSettings.value.find((setting) => setting.id === editingId.value)
      if (existing) Object.assign(existing, record, { modifiedAgo: 'Just now' })
      else
        cacheSettings.value = [
          ...cacheSettings.value,
          {
            ...record,
            id: String(7100 + cacheSettings.value.length + 1),
            author: 'John Smith',
            modifiedAgo: 'Just now'
          }
        ]
      submitting.value = false
      drawerOpen.value = false
      toast.success(
        existing
          ? `Cache setting "${record.name}" saved.`
          : `Cache setting "${record.name}" added.`,
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

  const openHistory = (_event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue) => {
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
    <ConsoleLayout.Breadcrumb
      :items="[
        { label: 'Resources', href: '/resources' },
        { label: 'web-app', href: '/resources/1784552864' }
      ]"
    >
      <Select
        variant="ghost"
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
              <template #leading>
                <i
                  class="ai ai-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
          </template>
          <Select.Group label="Versions">
            <Select.Item
              v-for="entry in matches"
              :key="entry.id"
              :value="entry.id"
            >
              {{ entry.name }}
              <template #tag>
                <Tag
                  :label="entry.tag.label"
                  :variant="entry.tag.variant"
                  :severity="entry.tag.severity"
                  :icon="entry.tag.icon"
                  size="small"
                />
              </template>
            </Select.Item>
            <p
              v-if="!matches.length"
              class="px-(--spacing-xs) py-(--spacing-2xs) text-body-sm text-(--text-muted)"
            >
              No versions match"{{ query }}".
            </p>
          </Select.Group>
          <template #footer>
            <Select.Item
              value="__create-version__"
              class="w-full"
            >
              <span class="flex items-center gap-(--spacing-xs)">
                <i
                  class="ai ai-circle-plus"
                  aria-hidden="true"
                />
                Add Version
              </span>
            </Select.Item>
          </template>
        </Select.Content>
      </Select>
    </ConsoleLayout.Breadcrumb>
    <nav
      aria-label="Breadcrumb"
      class="flex min-w-0 items-center gap-(--spacing-xs) border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-xs) md:hidden"
    >
      <Tooltip content="Back to web-app versions">
        <IconButton
          icon="ai ai-arrow-left"
          variant="ghost"
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
                <template #leading>
                  <i
                    class="ai ai-search"
                    aria-hidden="true"
                  />
                </template>
              </Input>
            </template>
            <Select.Group label="Versions">
              <Select.Item
                v-for="entry in matches"
                :key="entry.id"
                :value="entry.id"
              >
                {{ entry.name }}
                <template #tag>
                  <Tag
                    :label="entry.tag.label"
                    :variant="entry.tag.variant"
                    :severity="entry.tag.severity"
                    :icon="entry.tag.icon"
                    size="small"
                  />
                </template>
              </Select.Item>
              <p
                v-if="!matches.length"
                class="px-(--spacing-xs) py-(--spacing-2xs) text-body-sm text-(--text-muted)"
              >
                No versions match"{{ query }}".
              </p>
            </Select.Group>
            <template #footer>
              <Select.Item
                value="__create-version__"
                class="w-full"
              >
                <span class="flex items-center gap-(--spacing-xs)">
                  <i
                    class="ai ai-circle-plus"
                    aria-hidden="true"
                  />
                  Add Version
                </span>
              </Select.Item>
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
              <Tabs.Trigger
                v-for="tab in tabs"
                :key="tab.value"
                :value="tab.value"
                :label="tab.label"
              />
              <template #actions>
                <Tag
                  label="Draft"
                  severity="warning"
                  icon="ai ai-file-pen"
                  size="medium"
                />
                <DropdownMenu
                  side="bottom"
                  align="end"
                  @select="openHistory"
                >
                  <DropdownMenu.Trigger>
                    <IconButton
                      icon="ai ai-ellipsis"
                      variant="ghost"
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
                          class="ai ai-pencil"
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
                          class="ai ai-history"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>
                </DropdownMenu>
              </template>
            </PageTabs>

            <section
              v-if="activeTab === 'cache-settings'"
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
                      title="Cache Settings"
                      description="How responses are cached at the edge and in browsers. A rule picks one with the Set cache policy behavior."
                      size="small"
                    >
                      <template #actions>
                        <Button
                          label="Add Cache Settings"
                          variant="outline"
                          size="medium"
                          icon="ai ai-plus"
                          @click="openSetting()"
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
                            placeholder="Search cache settings"
                            aria-label="Search cache settings"
                            class="w-full"
                          >
                            <template #leading>
                              <i
                                class="ai ai-search"
                                aria-hidden="true"
                              />
                            </template>
                          </Input>
                        </div>
                        <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                          <Tooltip
                            content="Refresh"
                            class="shrink-0"
                          >
                            <IconButton
                              icon="ai ai-refresh"
                              variant="outline"
                              size="medium"
                              :loading="loading"
                              aria-label="Refresh"
                              @click="refresh"
                            />
                          </Tooltip>
                          <Tooltip
                            content="Download CSV"
                            class="shrink-0"
                          >
                            <IconButton
                              icon="ai ai-download"
                              variant="outline"
                              size="medium"
                              :disabled="!tableEl"
                              aria-label="Download CSV"
                              @click="
                                tableEl?.exportCsv({ filename: 'web-app-cache-settings.csv' })
                              "
                            />
                          </Tooltip>
                          <Tooltip
                            content="Columns"
                            class="shrink-0"
                          >
                            <IconButton
                              icon="ai ai-column"
                              variant="outline"
                              size="medium"
                              aria-label="Columns"
                            />
                          </Tooltip>
                        </div>
                      </header>
                      <Card :padded="false">
                        <template #default>
                          <DataTable
                            ref="tableEl"
                            v-model:globalFilter="search"
                            :data="rows"
                            :columns="cacheColumns"
                            row-key="id"
                            sortable
                            paginated
                            :page-size="10"
                            :bordered="false"
                            :loading="loading"
                            aria-label="Cache settings"
                          >
                            <template #cell-name="{ row }">
                              <button
                                type="button"
                                class="truncate rounded-(--shape-button) text-start text-body-sm text-(--text-default) underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                                @click="openSetting(row)"
                              >
                                {{ row.name }}
                              </button>
                            </template>
                            <template #cell-tieredCache="{ value }">
                              <Tag
                                :label="value ? 'Enabled' : 'Disabled'"
                                :severity="value ? 'success' : 'neutral'"
                                size="medium"
                              />
                            </template>
                            <template #cell-modifiedAgo="{ row }">
                              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                                <Tooltip :content="row.author">
                                  <Avatar
                                    :alt="row.author"
                                    :label="row.author"
                                    size="small"
                                    variant="square"
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
                                icon="ai ai-search"
                                title="No matching cache settings"
                                :description="`Nothing matches ${search.trim()}.`"
                              >
                                <template #actions>
                                  <Button
                                    label="Clear search"
                                    variant="outline"
                                    size="small"
                                    @click="search = ''"
                                  />
                                </template>
                              </EmptyState>
                              <EmptyState
                                key="empty-state-2"
                                v-else
                                size="medium"
                                icon="ai ai-database"
                                title="No cache settings yet"
                                description="Add the first one to this version."
                              >
                                <template #actions>
                                  <Button
                                    label="Add Cache Settings"
                                    icon="ai ai-plus"
                                    variant="secondary"
                                    size="small"
                                    @click="openSetting()"
                                  />
                                </template>
                              </EmptyState>
                            </template>
                          </DataTable>
                        </template>
                      </Card>
                    </section>
                  </div>

                  <Drawer
                    v-model:open="drawerOpen"
                    size="large"
                    side="end"
                  >
                    <DrawerContent>
                      <form
                        class="flex min-h-0 flex-1 flex-col"
                        :aria-label="drawerTitle"
                        novalidate
                        @submit.prevent="submit"
                      >
                        <PanelHeader class="w-full">
                          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                            <DrawerTitle>{{ drawerTitle }}</DrawerTitle>
                            <DrawerDescription>
                              How long browsers and the edge keep a response, and what makes two
                              requests two cached objects.
                            </DrawerDescription>
                          </div>
                        </PanelHeader>
                        <PanelBody>
                          <fieldset
                            class="m-0 flex min-w-0 flex-col border-0 p-0"
                            :disabled="submitting"
                          >
                            <legend class="sr-only">{{ drawerTitle }}</legend>
                            <SettingsSection
                              title="General"
                              hint="Names the cache setting in the rules that reference it."
                            >
                              <Card :padded="false">
                                <template #default>
                                  <Item.List>
                                    <SettingsRow
                                      title="Name"
                                      description="What the Set cache policy behavior of a rule picks from its list."
                                    >
                                      <Input
                                        v-model="form.name"
                                        size="large"
                                        class="w-full"
                                        aria-label="Name"
                                        placeholder="static-assets"
                                        autocomplete="off"
                                        :required="!!errors.name"
                                        :aria-describedby="
                                          errors.name ? 'cache-setting-name-message' : undefined
                                        "
                                      />
                                      <FieldError
                                        v-if="errors.name"
                                        id="cache-setting-name-message"
                                        >{{ errors.name }}</FieldError
                                      >
                                    </SettingsRow>
                                  </Item.List>
                                </template>
                              </Card>
                            </SettingsSection>
                            <SettingsSection
                              title="Browser cache"
                              hint="How long the visitor's browser may reuse a response before asking again."
                            >
                              <Card :padded="false">
                                <template #default>
                                  <Item.List>
                                    <SettingsRow
                                      key="browserBehavior"
                                      title="Behavior"
                                      description="Honoring the origin passes its Cache-Control through. Overriding replaces it with the time set here."
                                    >
                                      <Select
                                        v-model="form.browserBehavior"
                                        size="large"
                                        class="w-full"
                                        :display-value="labelOf(browserBehaviors)"
                                      >
                                        <Select.Trigger aria-label="Browser cache behavior" />
                                        <Select.Content>
                                          <Select.Item
                                            v-for="option in browserBehaviors"
                                            :key="option.value"
                                            :value="option.value"
                                          >
                                            {{ option.label }}
                                          </Select.Item>
                                        </Select.Content>
                                      </Select>
                                    </SettingsRow>
                                    <SettingsRow
                                      v-if="form.browserBehavior === 'override'"
                                      key="browserMaxAge"
                                      title="Maximum TTL in seconds"
                                      description="Up to 31536000 seconds, one year."
                                      :depth="1"
                                    >
                                      <NumberInput
                                        v-model="form.browserMaxAge"
                                        size="large"
                                        class="w-full"
                                        :min="0"
                                        :max="31536000"
                                        aria-label="Browser maximum TTL in seconds"
                                      />
                                    </SettingsRow>
                                  </Item.List>
                                </template>
                              </Card>
                            </SettingsSection>
                            <SettingsSection
                              title="Edge cache"
                              hint="How long the edge may serve a stored response before it asks the origin again."
                            >
                              <Card :padded="false">
                                <template #default>
                                  <Item.List>
                                    <SettingsRow
                                      key="edgeBehavior"
                                      title="Behavior"
                                      description="Overriding sets the time the edge keeps each object, from 60 seconds up."
                                    >
                                      <Select
                                        v-model="form.edgeBehavior"
                                        size="large"
                                        class="w-full"
                                        :display-value="labelOf(edgeBehaviors)"
                                      >
                                        <Select.Trigger aria-label="Edge cache behavior" />
                                        <Select.Content>
                                          <Select.Item
                                            v-for="option in edgeBehaviors"
                                            :key="option.value"
                                            :value="option.value"
                                          >
                                            {{ option.label }}
                                          </Select.Item>
                                        </Select.Content>
                                      </Select>
                                    </SettingsRow>
                                    <SettingsRow
                                      v-if="form.edgeBehavior === 'override'"
                                      key="edgeMaxAge"
                                      title="Maximum TTL in seconds"
                                      description="From 60 to 31536000 seconds."
                                      :depth="1"
                                    >
                                      <NumberInput
                                        v-model="form.edgeMaxAge"
                                        size="large"
                                        class="w-full"
                                        :min="60"
                                        :max="31536000"
                                        aria-label="Edge maximum TTL in seconds"
                                      />
                                    </SettingsRow>
                                    <SettingsRow
                                      key="staleCache"
                                      title="Stale cache"
                                      description="Keep serving the expired object while the origin is unreachable, instead of answering with an error."
                                      variant="compact"
                                    >
                                      <Switch
                                        v-model="form.staleCache"
                                        aria-label="Stale cache"
                                      />
                                    </SettingsRow>
                                    <SettingsRow
                                      key="largeFileCache"
                                      title="Large file optimization"
                                      description="Fetch and cache large objects in fragments, so a partial request does not wait for the whole file."
                                      variant="compact"
                                    >
                                      <Switch
                                        v-model="form.largeFileCache"
                                        aria-label="Large file optimization"
                                      />
                                    </SettingsRow>
                                    <SettingsRow
                                      v-if="form.largeFileCache"
                                      key="largeFileOffset"
                                      title="Fragment size in kB"
                                      description="Each fragment requested from the origin. 1024 kB is the default."
                                      :depth="1"
                                    >
                                      <NumberInput
                                        v-model="form.largeFileOffset"
                                        size="large"
                                        class="w-full"
                                        :min="1"
                                        aria-label="Fragment size in kilobytes"
                                      />
                                    </SettingsRow>
                                    <SettingsRow
                                      key="tieredCache"
                                      title="Tiered cache"
                                      description="Add a second cache layer between the edge and your origin, so an edge miss can still be answered without reaching it."
                                      variant="compact"
                                    >
                                      <Switch
                                        v-model="form.tieredCache"
                                        aria-label="Tiered cache"
                                      />
                                    </SettingsRow>
                                    <SettingsRow
                                      v-if="form.tieredCache"
                                      key="tieredTopology"
                                      title="Topology"
                                      description="Where the second layer sits. Pin a region only when the origin is fixed to one."
                                      :depth="1"
                                    >
                                      <Select
                                        v-model="form.tieredTopology"
                                        size="large"
                                        class="w-full"
                                        :display-value="labelOf(topologies)"
                                      >
                                        <Select.Trigger aria-label="Tiered cache topology" />
                                        <Select.Content>
                                          <Select.Item
                                            v-for="option in topologies"
                                            :key="option.value"
                                            :value="option.value"
                                          >
                                            {{ option.label }}
                                          </Select.Item>
                                        </Select.Content>
                                      </Select>
                                    </SettingsRow>
                                  </Item.List>
                                </template>
                              </Card>
                            </SettingsSection>
                            <SettingsSection
                              title="Advanced cache key"
                              hint="Which parts of a request make two requests two different cached objects."
                              collapsible
                            >
                              <Card :padded="false">
                                <template #default>
                                  <Item.List>
                                    <SettingsRow
                                      key="varyByMethod"
                                      title="Cache by HTTP method"
                                      description="GET and HEAD are always cached. Adding POST or OPTIONS puts the request body in the cache key."
                                    >
                                      <MultiSelect
                                        v-model="form.varyByMethod"
                                        size="large"
                                        class="w-full"
                                        placeholder="GET and HEAD only"
                                        :display-value="methodsLabel"
                                      >
                                        <MultiSelect.Trigger aria-label="Cache by HTTP method" />
                                        <MultiSelect.Content>
                                          <MultiSelect.Item
                                            v-for="option in methods"
                                            :key="option.value"
                                            :value="option.value"
                                          >
                                            {{ option.label }}
                                          </MultiSelect.Item>
                                        </MultiSelect.Content>
                                      </MultiSelect>
                                    </SettingsRow>
                                    <SettingsRow
                                      key="queryStringBehavior"
                                      title="Cache by query string"
                                    >
                                      <Select
                                        v-model="form.queryStringBehavior"
                                        size="large"
                                        class="w-full"
                                        :display-value="labelOf(varyBehaviors)"
                                      >
                                        <Select.Trigger aria-label="Cache by query string" />
                                        <Select.Content>
                                          <Select.Item
                                            v-for="option in varyBehaviors"
                                            :key="option.value"
                                            :value="option.value"
                                          >
                                            {{ option.label }}
                                          </Select.Item>
                                        </Select.Content>
                                      </Select>
                                    </SettingsRow>
                                    <SettingsRow
                                      v-if="
                                        ['allowlist', 'denylist'].includes(form.queryStringBehavior)
                                      "
                                      key="queryStringFields"
                                      title="Query string fields"
                                      description="Comma separated and case sensitive: utm_source and UTM_SOURCE are two fields."
                                      :depth="1"
                                    >
                                      <Input
                                        v-model="form.queryStringFields"
                                        size="large"
                                        class="w-full"
                                        aria-label="Query string fields"
                                        placeholder="page, sort, lang"
                                        autocomplete="off"
                                      />
                                    </SettingsRow>
                                    <SettingsRow
                                      key="cookieBehavior"
                                      title="Cache by cookies"
                                    >
                                      <Select
                                        v-model="form.cookieBehavior"
                                        size="large"
                                        class="w-full"
                                        :display-value="labelOf(varyBehaviors)"
                                      >
                                        <Select.Trigger aria-label="Cache by cookies" />
                                        <Select.Content>
                                          <Select.Item
                                            v-for="option in varyBehaviors"
                                            :key="option.value"
                                            :value="option.value"
                                          >
                                            {{ option.label }}
                                          </Select.Item>
                                        </Select.Content>
                                      </Select>
                                    </SettingsRow>
                                    <SettingsRow
                                      v-if="['allowlist', 'denylist'].includes(form.cookieBehavior)"
                                      key="cookieNames"
                                      title="Cookie names"
                                      description="Comma separated. A name ending in * matches every cookie that starts with it."
                                      :depth="1"
                                    >
                                      <Input
                                        v-model="form.cookieNames"
                                        size="large"
                                        class="w-full"
                                        aria-label="Cookie names"
                                        placeholder="session_id, ab_*"
                                        autocomplete="off"
                                      />
                                    </SettingsRow>
                                    <SettingsRow
                                      key="deviceBehavior"
                                      title="Adaptive delivery"
                                      description="Vary the cached object by the device group a request belongs to, so a phone and a desktop get different content from the same URL."
                                    >
                                      <Select
                                        v-model="form.deviceBehavior"
                                        size="large"
                                        class="w-full"
                                        :display-value="labelOf(deviceBehaviors)"
                                      >
                                        <Select.Trigger aria-label="Adaptive delivery" />
                                        <Select.Content>
                                          <Select.Item
                                            v-for="option in deviceBehaviors"
                                            :key="option.value"
                                            :value="option.value"
                                          >
                                            {{ option.label }}
                                          </Select.Item>
                                        </Select.Content>
                                      </Select>
                                    </SettingsRow>
                                    <SettingsRow
                                      v-if="form.deviceBehavior === 'allowlist'"
                                      key="deviceGroups"
                                      title="Device groups"
                                      description="Groups defined on this version's Device Groups tab."
                                      :depth="1"
                                    >
                                      <MultiSelect
                                        v-model="form.deviceGroups"
                                        size="large"
                                        class="w-full"
                                        placeholder="Select device groups"
                                        :display-value="deviceGroupsLabel"
                                      >
                                        <MultiSelect.Trigger aria-label="Device groups" />
                                        <MultiSelect.Content>
                                          <MultiSelect.Item
                                            v-for="option in deviceGroupOptions"
                                            :key="option.value"
                                            :value="option.value"
                                          >
                                            {{ option.label }}
                                          </MultiSelect.Item>
                                        </MultiSelect.Content>
                                      </MultiSelect>
                                    </SettingsRow>
                                  </Item.List>
                                </template>
                              </Card>
                            </SettingsSection>
                          </fieldset>
                        </PanelBody>
                        <PanelFooter>
                          <div class="flex w-full justify-end gap-(--spacing-xs)">
                            <Button
                              type="button"
                              label="Cancel"
                              variant="outline"
                              size="medium"
                              :disabled="submitting"
                              @click="drawerOpen = false"
                            />
                            <Button
                              type="submit"
                              :label="editingId ? 'Save' : 'Add Cache Settings'"
                              variant="primary"
                              size="medium"
                              :loading="submitting"
                            />
                          </div>
                        </PanelFooter>
                      </form>
                    </DrawerContent>
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
                    icon="ai ai-external-link"
                    :title="tabLabel"
                    :description="`${tabLabel} opens on its own page.`"
                  >
                    <template #actions>
                      <Button
                        :label="`Open ${tabLabel}`"
                        variant="outline"
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
                    class="hidden size-8 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised) md:flex"
                    aria-hidden="true"
                  >
                    <i class="ai ai-file-pen text-body-sm text-(--text-default)" />
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
                      :icon="saveAction === 'deploy' ? 'ai ai-cloud-upload' : ''"
                      variant="primary"
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
          v-model:open="historyExpanded"
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
                icon="ai ai-x"
                variant="ghost"
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
                    class="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-(--accent) text-(--accent-foreground)"
                    aria-hidden="true"
                  >
                    <i class="ai ai-file-pen text-body-xs" />
                  </span>
                  <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs) pt-0.5">
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <span class="truncate text-label-md text-(--text-default)">
                        {{ version.name }}
                      </span>
                      <span class="flex shrink-0">
                        <Tag
                          :label="version.tag.label"
                          :variant="version.tag.variant"
                          :severity="version.tag.severity"
                          size="small"
                        />
                      </span>
                      <span
                        v-if="!editing"
                        class="ms-auto shrink-0"
                      >
                        <IconButton
                          icon="ai ai-pencil"
                          variant="ghost"
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
                          variant="outline"
                          size="small"
                          @click="editing = false"
                        />
                        <Button
                          label="Save"
                          variant="primary"
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
                            variant="square"
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
                      <i class="ai ai-code text-body-xs" />
                    </span>
                    <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs) pt-0.5">
                      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                        <span
                          class="truncate text-label-md text-(--text-default) group-hover:underline"
                        >
                          {{ entry.name }}
                        </span>
                        <span class="flex shrink-0">
                          <Tag
                            :label="entry.tag.label"
                            :variant="entry.tag.variant"
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
                            variant="square"
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
                  variant="ghost"
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
