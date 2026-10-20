<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'
  import InputNumber from '@aziontech/webkit/input-number'
  import InputText from '@aziontech/webkit/input-text'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import Select from '@aziontech/webkit/select'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref, watch } from 'vue'

  import FieldStack from '../../../components/form/FieldStack.vue'
  import ResourceDrawer from '../../../components/form/ResourceDrawer.vue'
  import AuthorCell from '../../../components/list/AuthorCell.vue'
  import ColumnsButton from '../../../components/list/ColumnsButton.vue'
  import ExportButton from '../../../components/list/ExportButton.vue'
  import IdCell from '../../../components/list/IdCell.vue'
  import LastModifiedCell from '../../../components/list/LastModifiedCell.vue'
  import RefreshButton from '../../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../../components/page/HeadingAction.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import Section from '../../../components/page/Section.vue'
  import { sleep } from '../../../lib/behavior/forms'
  import { useListRefresh } from '../../../lib/behavior/list-state'
  import { FIT_COLUMN, TAG_COLUMN_WIDE } from '../../../lib/behavior/table-columns'
  import { useVersionChange } from '../../../lib/behavior/version-commit'
  import {
    addCacheSetting,
    BROWSER_CACHE_BEHAVIORS,
    CACHEABLE_METHODS,
    cacheSummary,
    DEVICE_VARY_BEHAVIORS,
    EDGE_CACHE_BEHAVIORS,
    fromList,
    optionLabel,
    optionsLabel,
    TIERED_CACHE_TOPOLOGIES,
    toList,
    updateCacheSetting,
    useCacheSettings,
    VARY_BEHAVIORS
  } from '../../../lib/data/cache-settings'
  import { deviceGroupOptions } from '../../../lib/data/device-groups'
  import { productFirstUse } from '../../../lib/data/product-empty-states'

  const HELP = productFirstUse('applications').learnMore.href

  const columns = [
    { accessorKey: 'name', header: 'Name', principal: true, hideable: false, enableSorting: true },
    { accessorKey: 'id', header: 'ID', minWidth: FIT_COLUMN },
    { accessorKey: 'browserCacheLabel', header: 'Browser cache', minWidth: FIT_COLUMN },
    { accessorKey: 'edgeCacheLabel', header: 'Edge cache', minWidth: FIT_COLUMN },
    { accessorKey: 'tieredCache', header: 'Tiered cache', minWidth: TAG_COLUMN_WIDE },
    { accessorKey: 'author', header: 'Last Editor', enableSorting: true, minWidth: FIT_COLUMN },
    {
      accessorKey: 'lastModified',
      header: 'Last Modified',
      enableSorting: true,
      minWidth: FIT_COLUMN
    }
  ]

  const search = ref('')

  const { loading, refresh } = useListRefresh()

  const tableRef = ref(null)

  const columnVisibility = ref({ id: false })

  const cacheSettings = useCacheSettings()

  const rows = computed(() =>
    cacheSettings.value.map((setting) => ({
      ...setting,
      browserCacheLabel: cacheSummary(setting.browserCache),
      edgeCacheLabel: cacheSummary(setting.edgeCache)
    }))
  )

  const createOpen = ref(false)

  const noteChange = useVersionChange()
  const editing = ref(null)

  const blankForm = () => ({
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
    queryStringSort: false,
    cookiesBehavior: 'ignore',
    cookieNames: '',
    devicesBehavior: 'ignore',
    deviceGroups: []
  })

  const ttlOf = (cache, fallback) =>
    cache?.behavior === 'override' ? (cache.maxAge ?? fallback) : fallback

  const formFor = (setting) => {
    const blank = blankForm()
    if (!setting) return blank

    const accelerator = setting.applicationAccelerator ?? {}
    const queryString = accelerator.queryString ?? {}
    const cookies = accelerator.cookies ?? {}
    const devices = accelerator.devices ?? {}
    const largeFile = setting.largeFileCache ?? {}

    return {
      ...blank,
      name: setting.name ?? blank.name,
      browserBehavior: setting.browserCache?.behavior ?? blank.browserBehavior,
      browserMaxAge: ttlOf(setting.browserCache, blank.browserMaxAge),
      edgeBehavior: setting.edgeCache?.behavior ?? blank.edgeBehavior,
      edgeMaxAge: ttlOf(setting.edgeCache, blank.edgeMaxAge),
      staleCache: setting.staleCache ?? blank.staleCache,
      largeFileCache: largeFile.enabled ?? blank.largeFileCache,
      largeFileOffset: largeFile.offset ?? blank.largeFileOffset,
      tieredCache: setting.tieredCache ?? blank.tieredCache,
      tieredTopology: setting.tieredTopology ?? blank.tieredTopology,
      varyByMethod: [...(accelerator.varyByMethod ?? blank.varyByMethod)],
      queryStringBehavior: queryString.behavior ?? blank.queryStringBehavior,
      queryStringFields: fromList(queryString.fields),
      queryStringSort: queryString.sortEnabled ?? blank.queryStringSort,
      cookiesBehavior: cookies.behavior ?? blank.cookiesBehavior,
      cookieNames: fromList(cookies.cookieNames),
      devicesBehavior: devices.behavior ?? blank.devicesBehavior,
      deviceGroups: [...(devices.deviceGroup ?? blank.deviceGroups)]
    }
  }

  const form = reactive(blankForm())
  const errors = reactive({ name: '' })
  const submitting = ref(false)

  const openCreate = () => {
    editing.value = null
    createOpen.value = true
  }

  const openSetting = (event, row) => {
    editing.value = row
    Object.assign(form, formFor(row))
    errors.name = ''
    createOpen.value = true
  }

  const browserOverrides = computed(() => form.browserBehavior === 'override')
  const edgeOverrides = computed(() => form.edgeBehavior === 'override')
  const queryStringListed = computed(() =>
    ['allowlist', 'denylist'].includes(form.queryStringBehavior)
  )
  const cookiesListed = computed(() => ['allowlist', 'denylist'].includes(form.cookiesBehavior))
  const devicesListed = computed(() => form.devicesBehavior === 'allowlist')

  const deviceGroups = computed(() => deviceGroupOptions())

  const behaviorLabel = (options) => (value) => optionLabel(options, value)
  const topologyLabel = behaviorLabel(TIERED_CACHE_TOPOLOGIES)
  const methodsLabel = (values) => optionsLabel(CACHEABLE_METHODS, values)
  const deviceGroupsLabel = (values) => optionsLabel(deviceGroups.value, values)

  watch(createOpen, (open) => {
    if (open) return
    editing.value = null
    Object.assign(form, blankForm())
    errors.name = ''
  })

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'Name is required.'
    return !errors.name
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) return

    submitting.value = true
    try {
      await sleep(900)
      const name = form.name.trim()
      const record = {
        name,
        browserCache: {
          behavior: form.browserBehavior,
          maxAge: browserOverrides.value ? form.browserMaxAge : 0
        },
        edgeCache: {
          behavior: form.edgeBehavior,
          maxAge: edgeOverrides.value ? form.edgeMaxAge : 0
        },
        staleCache: form.staleCache,
        largeFileCache: form.largeFileCache
          ? { enabled: true, offset: form.largeFileOffset }
          : { enabled: false },
        tieredCache: form.tieredCache,
        tieredTopology: form.tieredCache ? form.tieredTopology : null,
        applicationAccelerator: {
          varyByMethod: form.varyByMethod,
          queryString: {
            behavior: form.queryStringBehavior,
            fields: queryStringListed.value ? toList(form.queryStringFields) : [],
            sortEnabled: form.queryStringSort
          },
          cookies: {
            behavior: form.cookiesBehavior,
            cookieNames: cookiesListed.value ? toList(form.cookieNames) : []
          },
          devices: {
            behavior: form.devicesBehavior,
            deviceGroup: devicesListed.value ? form.deviceGroups : []
          }
        }
      }

      if (editing.value) {
        updateCacheSetting(editing.value.id, record)
        noteChange(`Update cache settings "${name}"`)
        toast.success(`Cache Settings "${name}" saved.`)
      } else {
        addCacheSetting(record)
        noteChange(`Add cache settings "${name}"`)
        toast.success(`Cache Settings "${name}" created.`)
      }
      createOpen.value = false
    } catch (error) {
      toast.error(
        editing.value
          ? 'Could not save the cache settings.'
          : 'Could not create the cache settings.',
        {
          description: error?.message ?? 'Check your connection and try again.',
          action: { label: 'Retry', onClick: () => submit() }
        }
      )
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <div class="layout-column layout-boundary flex min-w-0 flex-col">
    <PageHeading
      title="Cache Settings"
      description="Define how content is cached at the edge and in browsers."
      size="small"
      :documentation="HELP"
    >
      <template #actions>
        <HeadingAction
          label="Add Cache Settings"
          kind="outlined"
          icon="pi pi-plus"
          @click="openCreate"
        />
      </template>
    </PageHeading>

    <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
      <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <ControlsHeader>
          <InputText
            v-model="search"
            size="medium"
            placeholder="Search cache settings"
            aria-label="Search cache settings"
            class="min-w-36 grow basis-(--container-2xs)"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </InputText>
          <template #actions>
            <RefreshButton
              :loading="loading"
              @refresh="refresh"
            />
            <ExportButton
              :table="tableRef"
              filename="cache-settings.csv"
            />
            <ColumnsButton
              v-model="columnVisibility"
              :columns="columns"
            />
          </template>
        </ControlsHeader>

        <CardBox :padded="false">
          <template #content>
            <TableRoot
              ref="tableRef"
              v-model:globalFilter="search"
              v-model:columnVisibility="columnVisibility"
              :data="rows"
              :columns="columns"
              row-key="id"
              enable-sorting
              :border="false"
              :loading="loading"
              @row-click="openSetting"
            >
              <template #cell-name="{ value }">
                <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
              </template>

              <template #cell-id="{ value }">
                <IdCell
                  :value="value"
                  resource="cache settings"
                />
              </template>

              <template #cell-tieredCache="{ row }">
                <Tag
                  :label="row.tieredCache ? 'Enabled' : 'Disabled'"
                  :severity="row.tieredCache ? 'success' : 'secondary'"
                  size="medium"
                />
              </template>

              <template #cell-author="{ row }">
                <AuthorCell
                  :author="row.author"
                  :avatar-src="row.authorAvatar"
                />
              </template>

              <template #cell-lastModified="{ row }">
                <LastModifiedCell :date="row.modifiedAt" />
              </template>
            </TableRoot>
          </template>
        </CardBox>
      </section>
    </section>

    <ResourceDrawer
      v-model:open="createOpen"
      :title="editing ? 'Edit Cache Settings' : 'Add Cache Settings'"
      :submitting="submitting"
      @submit="submit"
    >
      <Section
        stacked
        :divided="false"
        title="General"
        hint="Names the cache setting in the rules that reference it."
      >
        <FieldStack
          label="Name"
          description="What a rule's Set Cache Policy behavior picks from its list."
          :message="errors.name"
          :message-kind="form.name.trim() ? 'invalid' : 'required'"
        >
          <template #default="{ controlId, describedBy }">
            <InputText
              :id="controlId"
              v-model="form.name"
              size="large"
              :disabled="submitting"
              class="w-full"
              placeholder="My cache setting"
              :required="!!errors.name && !form.name.trim()"
              :invalid="!!errors.name && !!form.name.trim()"
              :aria-describedby="describedBy"
              @update:model-value="errors.name = ''"
            />
          </template>
        </FieldStack>
      </Section>

      <Section
        stacked
        :divided="false"
        title="Browser Cache"
        hint="How long the visitor's own browser may reuse a response before asking again."
      >
        <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <FieldStack
            label="Behavior"
            description="Honoring the origin passes its Cache-Control through untouched. Overriding replaces it with the TTL set here."
          >
            <template #default="{ controlId }">
              <Select
                v-model="form.browserBehavior"
                size="large"
                class="w-full"
                :disabled="submitting"
                :display-value="behaviorLabel(BROWSER_CACHE_BEHAVIORS)"
              >
                <Select.Trigger
                  :id="controlId"
                  aria-label="Browser cache behavior"
                />
                <Select.Content>
                  <Select.Option
                    v-for="option in BROWSER_CACHE_BEHAVIORS"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </template>
          </FieldStack>

          <FieldStack
            v-if="browserOverrides"
            key="browser-max-age"
            label="Maximum TTL (seconds)"
            description="Up to 31536000 seconds — one year."
          >
            <template #default="{ controlId }">
              <InputNumber
                :id="controlId"
                v-model="form.browserMaxAge"
                size="large"
                class="w-full"
                :min="0"
                :max="31536000"
                :disabled="submitting"
                aria-label="Browser cache maximum TTL in seconds"
              />
            </template>
          </FieldStack>
        </div>
      </Section>

      <Section
        stacked
        :divided="false"
        title="Edge Cache"
        hint="How long Azion's edge may serve a stored response before revalidating with the origin."
      >
        <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <FieldStack
            label="Behavior"
            description="The floor is 60 seconds unless Application Accelerator is active on the application."
          >
            <template #default="{ controlId }">
              <Select
                v-model="form.edgeBehavior"
                size="large"
                class="w-full"
                :disabled="submitting"
                :display-value="behaviorLabel(EDGE_CACHE_BEHAVIORS)"
              >
                <Select.Trigger
                  :id="controlId"
                  aria-label="Edge cache behavior"
                />
                <Select.Content>
                  <Select.Option
                    v-for="option in EDGE_CACHE_BEHAVIORS"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </template>
          </FieldStack>

          <FieldStack
            v-if="edgeOverrides"
            key="edge-max-age"
            label="Maximum TTL (seconds)"
            description="Up to 31536000 seconds — one year."
          >
            <template #default="{ controlId }">
              <InputNumber
                :id="controlId"
                v-model="form.edgeMaxAge"
                size="large"
                class="w-full"
                :min="0"
                :max="31536000"
                :disabled="submitting"
                aria-label="Edge cache maximum TTL in seconds"
              />
            </template>
          </FieldStack>

          <FieldSwitchBlock
            v-model="form.staleCache"
            label="Stale cache"
            description="Keep serving the expired object while the origin is unreachable, instead of answering with an error."
            :disabled="submitting"
          />

          <FieldSwitchBlock
            v-model="form.largeFileCache"
            label="Large file optimization"
            description="Fetch and cache large objects in fragments, so a partial request does not wait on the whole file."
            :disabled="submitting"
          />

          <FieldStack
            v-if="form.largeFileCache"
            key="large-file-offset"
            label="Fragment size (kB)"
            description="Each fragment Azion requests from the origin. 1024 kB is the default."
          >
            <template #default="{ controlId }">
              <InputNumber
                :id="controlId"
                v-model="form.largeFileOffset"
                size="large"
                class="w-full"
                :min="1"
                :disabled="submitting"
                aria-label="Large file fragment size in kilobytes"
              />
            </template>
          </FieldStack>

          <FieldSwitchBlock
            v-model="form.tieredCache"
            label="Tiered cache"
            description="Add a second cache layer between the edge and your origin, so an edge miss can still be answered without reaching it."
            :disabled="submitting"
          />

          <FieldStack
            v-if="form.tieredCache"
            key="tiered-topology"
            label="Topology"
            description="Where the second layer sits. Pin a region only when the origin is fixed to one."
          >
            <template #default="{ controlId }">
              <Select
                v-model="form.tieredTopology"
                size="large"
                class="w-full"
                :disabled="submitting"
                :display-value="topologyLabel"
              >
                <Select.Trigger
                  :id="controlId"
                  aria-label="Tiered cache topology"
                />
                <Select.Content>
                  <Select.Option
                    v-for="option in TIERED_CACHE_TOPOLOGIES"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </template>
          </FieldStack>
        </div>
      </Section>

      <Section
        collapsible
        stacked
        :divided="false"
        title="Advanced cache key"
        hint="Which parts of a request make two requests two different cached objects."
      >
        <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <FieldStack
            label="Cache by HTTP method"
            description="Requires the Application Accelerator module on this application. GET and HEAD are always cached. Selecting POST or OPTIONS puts the request body in the cache key."
          >
            <template #default="{ controlId }">
              <MultiSelect
                v-model="form.varyByMethod"
                size="large"
                class="w-full"
                :disabled="submitting"
                placeholder="GET and HEAD only"
                :display-value="methodsLabel"
              >
                <MultiSelect.Trigger
                  :id="controlId"
                  aria-label="Cache by HTTP method"
                />
                <MultiSelect.Content>
                  <MultiSelect.Option
                    v-for="option in CACHEABLE_METHODS"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </MultiSelect.Option>
                </MultiSelect.Content>
              </MultiSelect>
            </template>
          </FieldStack>

          <FieldStack label="Cache by query string">
            <template #default="{ controlId }">
              <Select
                v-model="form.queryStringBehavior"
                size="large"
                class="w-full"
                :disabled="submitting"
                :display-value="behaviorLabel(VARY_BEHAVIORS)"
              >
                <Select.Trigger
                  :id="controlId"
                  aria-label="Cache by query string"
                />
                <Select.Content>
                  <Select.Option
                    v-for="option in VARY_BEHAVIORS"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </template>
          </FieldStack>

          <FieldStack
            v-if="queryStringListed"
            key="query-string-fields"
            label="Query string fields"
            description="Comma separated, and case sensitive — utm_source and UTM_SOURCE are two different fields."
          >
            <template #default="{ controlId }">
              <InputText
                :id="controlId"
                v-model="form.queryStringFields"
                size="large"
                class="w-full font-code"
                placeholder="page, sort, lang"
                :disabled="submitting"
              />
            </template>
          </FieldStack>

          <FieldSwitchBlock
            v-model="form.queryStringSort"
            label="Sort query string parameters"
            description="Treat ?a=1&b=2 and ?b=2&a=1 as the same object, instead of caching each order separately."
            :disabled="submitting"
          />

          <FieldStack label="Cache by cookies">
            <template #default="{ controlId }">
              <Select
                v-model="form.cookiesBehavior"
                size="large"
                class="w-full"
                :disabled="submitting"
                :display-value="behaviorLabel(VARY_BEHAVIORS)"
              >
                <Select.Trigger
                  :id="controlId"
                  aria-label="Cache by cookies"
                />
                <Select.Content>
                  <Select.Option
                    v-for="option in VARY_BEHAVIORS"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </template>
          </FieldStack>

          <FieldStack
            v-if="cookiesListed"
            key="cookie-names"
            label="Cookie names"
            description="Comma separated, and case sensitive."
          >
            <template #default="{ controlId }">
              <InputText
                :id="controlId"
                v-model="form.cookieNames"
                size="large"
                class="w-full font-code"
                placeholder="session_id, locale"
                :disabled="submitting"
              />
            </template>
          </FieldStack>

          <FieldStack
            label="Adaptive delivery"
            description="Vary the cached object by the device group a request belongs to, so a phone and a desktop can be served different content from the same URL."
          >
            <template #default="{ controlId }">
              <Select
                v-model="form.devicesBehavior"
                size="large"
                class="w-full"
                :disabled="submitting"
                :display-value="behaviorLabel(DEVICE_VARY_BEHAVIORS)"
              >
                <Select.Trigger
                  :id="controlId"
                  aria-label="Adaptive delivery"
                />
                <Select.Content>
                  <Select.Option
                    v-for="option in DEVICE_VARY_BEHAVIORS"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </template>
          </FieldStack>

          <FieldStack
            v-if="devicesListed"
            key="device-groups"
            label="Device groups"
            description="Groups defined on this application's Device Groups tab."
          >
            <template #default="{ controlId }">
              <MultiSelect
                v-model="form.deviceGroups"
                size="large"
                class="w-full"
                :disabled="submitting"
                placeholder="Select device groups"
                :display-value="deviceGroupsLabel"
              >
                <MultiSelect.Trigger
                  :id="controlId"
                  aria-label="Device groups"
                />
                <MultiSelect.Content>
                  <MultiSelect.Option
                    v-for="option in deviceGroups"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </MultiSelect.Option>
                </MultiSelect.Content>
              </MultiSelect>
            </template>
          </FieldStack>
        </div>
      </Section>
    </ResourceDrawer>
  </div>
</template>
