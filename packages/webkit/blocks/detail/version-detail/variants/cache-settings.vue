<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import type { TableColumn, TableExposed } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import FieldError from '@aziontech/webkit/field-error'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import NumberInput from '@aziontech/webkit/number-input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Select from '@aziontech/webkit/select'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref, watch } from 'vue'

  import VersionDetail from '../version-detail.vue'

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

  const drawerOpen = ref(false)
  const editingId = ref('')
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

  const submit = () => {
    errors.name = form.name.trim() ? '' : 'Enter a name for this cache setting.'
    if (errors.name) return
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
    drawerOpen.value = false
    toast.success(
      existing ? `Cache setting "${record.name}" saved.` : `Cache setting "${record.name}" added.`,
      { description: 'The change is part of this draft until you deploy it.' }
    )
  }
</script>

<template>
  <VersionDetail tab="cache-settings">
    <template #cache-settings>
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

            <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
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
                      aria-label="Refresh"
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
                      @click="tableEl?.exportCsv({ filename: 'web-app-cache-settings.csv' })"
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
                    aria-label="Cache settings"
                  >
                    <template #cell-name="{ row }">
                      <Button
                        :label="row.name"
                        variant="link"
                        class="max-w-full"
                        @click="openSetting(row)"
                      />
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
                      How long browsers and the edge keep a response, and what makes two requests
                      two cached objects.
                    </DrawerDescription>
                  </div>
                </PanelHeader>
                <PanelBody>
                  <fieldset class="m-0 flex min-w-0 flex-col border-0 p-0">
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
                              v-if="['allowlist', 'denylist'].includes(form.queryStringBehavior)"
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
                      @click="drawerOpen = false"
                    />
                    <Button
                      type="submit"
                      :label="editingId ? 'Save' : 'Add Cache Settings'"
                      variant="primary"
                      size="medium"
                    />
                  </div>
                </PanelFooter>
              </form>
            </DrawerContent>
          </Drawer>
        </div>
      </ScrollArea>
    </template>
  </VersionDetail>
</template>
