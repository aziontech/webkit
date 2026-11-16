<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CodeEditor from '@aziontech/webkit/code-editor'
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
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Resizable from '@aziontech/webkit/resizable'
  import SchemaForm, { type SchemaFormSchema } from '@aziontech/webkit/schema-form'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Select from '@aziontech/webkit/select'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import SplitButton from '@aziontech/webkit/split-button'
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
  const activeTab = ref('functions-instances')
  const tabLabel = computed(() => tabs.find((tab) => tab.value === activeTab.value)?.label ?? '')
  const saveAction = ref<string | undefined>('deploy')

  type FunctionOption = {
    value: string
    label: string
    schema: SchemaFormSchema | null
  }
  type FunctionInstance = {
    id: string
    name: string
    functionId: string
    args: Record<string, unknown>
    active: boolean
    author: string
    modifiedAgo: string
  }

  const CREATE_FUNCTION = '__create-function__'
  const functionOptions: FunctionOption[] = [
    {
      value: 'image-resizer',
      label: 'image-resizer',
      schema: {
        type: 'object',
        required: ['width'],
        properties: {
          width: {
            type: 'integer',
            title: 'Width',
            description: 'The width in pixels images are resized to.',
            minimum: 16,
            maximum: 4096
          },
          quality: {
            type: 'integer',
            title: 'Quality',
            description: 'JPEG and WebP quality, from 1 to 100.',
            minimum: 1,
            maximum: 100
          },
          format: {
            type: 'string',
            title: 'Format',
            description: 'The format served to browsers that accept it.',
            enum: ['webp', 'avif', 'jpeg']
          }
        }
      }
    },
    {
      value: 'maintenance-page',
      label: 'maintenance-page',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            title: 'Message',
            description: 'The text visitors read while the site is down.',
            maxLength: 120
          },
          retryAfter: {
            type: 'integer',
            title: 'Retry after in seconds',
            description: 'Sent in the Retry-After header.',
            minimum: 0
          }
        }
      }
    },
    { value: 'header-rewrite', label: 'header-rewrite', schema: null }
  ]
  const functionLabel = (value: unknown) =>
    functionOptions.find((option) => option.value === value)?.label ?? ''

  const instanceColumns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', principal: true, hideable: false, sortable: true },
    { accessorKey: 'functionId', header: 'Function', minWidth: 160 },
    { accessorKey: 'args', header: 'Arguments', grow: 2 },
    { accessorKey: 'active', header: 'Status', minWidth: 104 },
    { accessorKey: 'modifiedAgo', header: 'Last modified', minWidth: 160 }
  ]
  const instances = ref<FunctionInstance[]>([
    {
      id: '5201',
      name: 'product-images',
      functionId: 'image-resizer',
      args: { width: 640, quality: 80, format: 'webp' },
      active: true,
      author: 'Priya Patel',
      modifiedAgo: '5 hours ago'
    },
    {
      id: '5202',
      name: 'security-headers',
      functionId: 'header-rewrite',
      args: { set: { 'strict-transport-security': 'max-age=31536000' } },
      active: true,
      author: 'John Smith',
      modifiedAgo: '3 days ago'
    },
    {
      id: '5203',
      name: 'planned-maintenance',
      functionId: 'maintenance-page',
      args: { message: 'We are upgrading the store. Back soon.', retryAfter: 1800 },
      active: false,
      author: 'Alex Morgan',
      modifiedAgo: '2 weeks ago'
    }
  ])

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
  const functionSelectOpen = ref(false)
  const editingId = ref('')
  const submitting = ref(false)
  const form = reactive({
    name: '',
    functionId: '',
    args: {} as Record<string, unknown>,
    argsJson: '{}'
  })
  const errors = reactive({ name: '', functionId: '', args: '' })
  const drawerTitle = computed(() =>
    editingId.value ? 'Edit Functions Instance' : 'Add Functions Instance'
  )
  const selectedSchema = computed(
    () => functionOptions.find((option) => option.value === form.functionId)?.schema ?? null
  )

  const openInstance = (instance?: FunctionInstance) => {
    editingId.value = instance?.id ?? ''
    form.name = instance?.name ?? ''
    form.functionId = instance?.functionId ?? ''
    form.args = { ...(instance?.args ?? {}) }
    form.argsJson = JSON.stringify(instance?.args ?? {}, null, 2)
    Object.assign(errors, { name: '', functionId: '', args: '' })
    drawerOpen.value = true
  }

  const onFunction = (value: string) => {
    if (value === CREATE_FUNCTION) {
      functionSelectOpen.value = false
      toast.info('Create Function', {
        description: 'The function editor opens, then brings you back here with it selected.'
      })
      return
    }
    form.functionId = value
    form.args = {}
    form.argsJson = '{}'
    errors.functionId = ''
  }

  watch(
    () => form.name,
    () => (errors.name = '')
  )
  watch(
    () => form.argsJson,
    () => (errors.args = '')
  )

  const parsedArgs = () => {
    if (selectedSchema.value) return form.args
    try {
      return JSON.parse(form.argsJson || '{}') as Record<string, unknown>
    } catch {
      return null
    }
  }

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'Enter a name for the instance.'
    errors.functionId = form.functionId ? '' : 'Select a function.'
    errors.args = parsedArgs() ? '' : 'Write the arguments as a JSON object.'
    return !errors.name && !errors.functionId && !errors.args
  }

  let submitTimer: ReturnType<typeof setTimeout> | undefined
  const submit = () => {
    if (submitting.value || !validate()) return
    submitting.value = true
    clearTimeout(submitTimer)
    submitTimer = setTimeout(() => {
      const record = {
        name: form.name.trim(),
        functionId: form.functionId,
        args: parsedArgs() ?? {}
      }
      const existing = instances.value.find((instance) => instance.id === editingId.value)
      if (existing) Object.assign(existing, record, { modifiedAgo: 'Just now' })
      else
        instances.value = [
          ...instances.value,
          {
            id: String(5200 + instances.value.length + 1),
            ...record,
            active: true,
            author: 'John Smith',
            modifiedAgo: 'Just now'
          }
        ]
      submitting.value = false
      drawerOpen.value = false
      toast.success(
        existing ? `Instance "${record.name}" saved.` : `Instance "${record.name}" added.`,
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
              v-if="activeTab === 'functions-instances'"
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
                      title="Functions Instances"
                      description="Functions instantiated on this resource with their own arguments. A rule runs an instance."
                      size="small"
                    >
                      <template #actions>
                        <Button
                          label="Add Functions Instance"
                          variant="outline"
                          size="medium"
                          icon="ai ai-plus"
                          @click="openInstance()"
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
                            placeholder="Search functions instances"
                            aria-label="Search functions instances"
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
                                tableEl?.exportCsv({ filename: 'web-app-functions-instances.csv' })
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
                            :data="instances"
                            :columns="instanceColumns"
                            row-key="id"
                            sortable
                            paginated
                            :page-size="10"
                            :bordered="false"
                            :loading="loading"
                            aria-label="Functions instances"
                          >
                            <template #cell-name="{ row }">
                              <button
                                type="button"
                                class="truncate rounded-(--shape-button) text-start text-body-sm text-(--text-default) underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                                @click="openInstance(row)"
                              >
                                {{ row.name }}
                              </button>
                            </template>
                            <template #cell-functionId="{ value }">
                              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                                <Tooltip content="JavaScript">
                                  <i
                                    class="ai-color ai-javascript shrink-0 text-body-lg"
                                    role="img"
                                    aria-label="JavaScript"
                                  />
                                </Tooltip>
                                <Tooltip :content="`Open ${value} in Functions`">
                                  <a
                                    :href="`/functions/${value}`"
                                    class="group/link inline-flex min-w-0 items-center gap-(--spacing-2xs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                                  >
                                    <span
                                      class="truncate underline-offset-2 group-hover/link:underline"
                                      >{{ value }}</span
                                    >
                                    <i
                                      class="ai ai-external-link shrink-0 text-body-xs leading-none"
                                      aria-hidden="true"
                                    />
                                  </a>
                                </Tooltip>
                              </div>
                            </template>
                            <template #cell-args="{ value }">
                              <span class="truncate text-label-code-sm text-(--text-muted)">{{
                                JSON.stringify(value)
                              }}</span>
                            </template>
                            <template #cell-active="{ value }">
                              <Tag
                                :label="value ? 'Active' : 'Inactive'"
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
                                title="No matching functions instances"
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
                                icon="ai ai-edge-functions"
                                title="No functions instances yet"
                                description="Add the first one to this version."
                              >
                                <template #actions>
                                  <Button
                                    label="Add Functions Instance"
                                    icon="ai ai-plus"
                                    variant="secondary"
                                    size="small"
                                    @click="openInstance()"
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
                              Pick a function and the arguments it runs with on this resource.
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
                              hint="A function can run more than once with different arguments; the name tells the instances apart in the rules."
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
                                  placeholder="product-images"
                                  autocomplete="off"
                                />
                                <Field.Error v-if="errors.name">{{ errors.name }}</Field.Error>
                              </Field>
                            </SettingsSection>
                            <SettingsSection
                              title="Function"
                              hint="Select an existing function and set the arguments it runs with."
                            >
                              <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                                <Field
                                  :invalid="!!errors.functionId"
                                  :disabled="submitting"
                                >
                                  <Field.Label>Function</Field.Label>
                                  <Select
                                    v-model:open="functionSelectOpen"
                                    :model-value="form.functionId"
                                    size="large"
                                    class="w-full"
                                    placeholder="Select a function"
                                    :invalid="!!errors.functionId"
                                    :display-value="functionLabel"
                                    @update:model-value="onFunction"
                                  >
                                    <Select.Trigger />
                                    <Select.Content>
                                      <Select.Item
                                        v-for="option in functionOptions"
                                        :key="option.value"
                                        :value="option.value"
                                      >
                                        {{ option.label }}
                                      </Select.Item>
                                      <template #footer>
                                        <Select.Item
                                          :value="CREATE_FUNCTION"
                                          class="w-full"
                                        >
                                          <span class="flex items-center gap-(--spacing-xs)">
                                            <i
                                              class="ai ai-circle-plus"
                                              aria-hidden="true"
                                            />
                                            Create Function
                                          </span>
                                        </Select.Item>
                                      </template>
                                    </Select.Content>
                                  </Select>
                                  <Field.Description>
                                    Only functions written for this resource are listed.
                                  </Field.Description>
                                  <Field.Error v-if="errors.functionId">{{
                                    errors.functionId
                                  }}</Field.Error>
                                </Field>

                                <SchemaForm
                                  v-if="selectedSchema"
                                  v-model="form.args"
                                  :schema="selectedSchema"
                                  :disabled="submitting"
                                />
                                <Field
                                  v-else-if="form.functionId"
                                  :invalid="!!errors.args"
                                  :disabled="submitting"
                                >
                                  <Field.Label>Arguments</Field.Label>
                                  <CodeEditor
                                    v-model="form.argsJson"
                                    language="json"
                                    path="function-instance.args.json"
                                    height="12rem"
                                    :invalid="!!errors.args"
                                    :disabled="submitting"
                                    aria-label="Arguments"
                                  />
                                  <Field.Description>
                                    A JSON object, read in the function as event.args.
                                  </Field.Description>
                                  <Field.Error v-if="errors.args">{{ errors.args }}</Field.Error>
                                </Field>
                              </div>
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
                              :label="editingId ? 'Save' : 'Add Functions Instance'"
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
