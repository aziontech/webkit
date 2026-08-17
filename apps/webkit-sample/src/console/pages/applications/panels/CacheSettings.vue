<script setup>
  // Application → Cache Settings. How content is cached at the edge and in browsers.
  //
  // An INTERNAL page on the DATA measure — see DeviceGroups.vue for the page shape
  // (one band: the controls row over the table it narrows, carrying the band step).
  //
  // Creation is the console's second-level pattern: a Drawer of `Section` bands
  // committed by ONE scoped save (ResourceDrawer owns that shell), with FIELDS
  // SEPARATED — a real `<Label for>` over a full-width control (../../components/
  // form/FieldStack.vue, the shape ../../build/AddVariableDrawer.vue set). The band's
  // guidance is said once, in the `Section` hint, rather than under every row.
  //
  // ── THE DRAWER ASKS FOR THE WHOLE REQUEST BODY ──
  //
  // It used to ask for the name alone, on the reasoning that a cache setting is
  // "created by name and tuned afterwards". That was wrong about the resource: the
  // TTLs are not a refinement of a cache setting, they ARE the cache setting, and a
  // name-only create commits an object that caches at whatever the API defaults to —
  // then makes the reader find it in the list and open it again to say the one thing
  // they opened the drawer to say. So the drawer now carries the full v4 body
  // (../../lib/data/cache-settings.js documents it), split the way the endpoint
  // splits:
  //
  //   General            `name`
  //   Browser Cache      `browser_cache` — behavior, and the TTL when it overrides
  //   Edge Cache         `modules.cache` — behavior + TTL, stale cache, large file
  //                      optimization, tiered cache
  //   Advanced cache key `modules.application_accelerator` — what makes two requests
  //                      two objects. COLLAPSED and last: every field in it is
  //                      optional, and none of it is honoured unless the Application
  //                      Accelerator module is active on the application.
  //
  // A dependent field is rendered only while it applies — no Maximum TTL under
  // "Honor origin cache headers", no allowlist under "Ignore all". The band eases its
  // own height when that happens (Section owns the move), so answering a select never
  // jumps the fields below it.
  //
  // The "Cache Settings" button itself is on the page's tab row, not in this heading
  // (ApplicationDetail owns that row). The flow stays here: the shell calls the
  // `openCreate` this view exposes.
  import CardBox from '@aziontech/webkit/card-box'
  import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'
  import InputNumber from '@aziontech/webkit/input-number'
  import InputText from '@aziontech/webkit/input-text'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import Select from '@aziontech/webkit/select'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref, watch } from 'vue'

  import FieldStack from '../../../components/form/FieldStack.vue'
  import ResourceDrawer from '../../../components/form/ResourceDrawer.vue'
  import LastModifiedCell from '../../../components/list/LastModifiedCell.vue'
  import ControlsHeader from '../../../components/page/ControlsHeader.vue'
  import PageHeading from '../../../components/page/PageHeading.vue'
  import Section from '../../../components/page/Section.vue'
  import { sleep } from '../../../lib/behavior/forms'
  import {
    addCacheSetting,
    BROWSER_CACHE_BEHAVIORS,
    CACHEABLE_METHODS,
    cacheSummary,
    DEVICE_VARY_BEHAVIORS,
    EDGE_CACHE_BEHAVIORS,
    optionLabel,
    optionsLabel,
    TIERED_CACHE_TOPOLOGIES,
    toList,
    useCacheSettings,
    VARY_BEHAVIORS
  } from '../../../lib/data/cache-settings'
  import { deviceGroupOptions } from '../../../lib/data/device-groups'

  // Browser and edge cache are one column each: the behavior decides whether the TTL
  // beside it is even in effect, so they are summarised together rather than split
  // into a "behavior" and a "TTL" column where half the TTLs mean nothing.
  const columns = [
    { accessorKey: 'name', header: 'Name', principal: true, enableSorting: true },
    { accessorKey: 'browserCacheLabel', header: 'Browser cache' },
    { accessorKey: 'edgeCacheLabel', header: 'Edge cache' },
    { accessorKey: 'tieredCache', header: 'Tiered cache' },
    { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, grow: 2 }
  ]

  // Free-text search, hoisted into the ControlsHeader above the card.
  const search = ref('')

  const cacheSettings = useCacheSettings()

  // The summaries are derived for the table rather than stored, so a setting edited
  // anywhere cannot leave a stale label behind.
  const rows = computed(() =>
    cacheSettings.value.map((setting) => ({
      ...setting,
      browserCacheLabel: cacheSummary(setting.browserCache),
      edgeCacheLabel: cacheSummary(setting.edgeCache)
    }))
  )

  // ── Create ────────────────────────────────────────────────────────────────
  const createOpen = ref(false)
  // Opened from the page's tab row (ApplicationDetail).
  defineExpose({ openCreate: () => (createOpen.value = true) })

  // Defaults are the endpoint's own: honor the origin in the browser, override at the
  // edge at 60s — the TTL floor for an application without Application Accelerator.
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

  const form = reactive(blankForm())
  const errors = reactive({ name: '' })
  const submitting = ref(false)

  // Which dependent fields apply. Each one is the condition the API itself puts on
  // the field: `max_age` is only read when the behavior overrides, `fields` only when
  // the variation is a list.
  const browserOverrides = computed(() => form.browserBehavior === 'override')
  const edgeOverrides = computed(() => form.edgeBehavior === 'override')
  const queryStringListed = computed(() =>
    ['allowlist', 'denylist'].includes(form.queryStringBehavior)
  )
  const cookiesListed = computed(() => ['allowlist', 'denylist'].includes(form.cookiesBehavior))
  const devicesListed = computed(() => form.devicesBehavior === 'allowlist')

  // Read at open time, not at setup: a group created on the Device Groups tab has to
  // be selectable here in the same session.
  const deviceGroups = computed(() => deviceGroupOptions())

  const behaviorLabel = (options) => (value) => optionLabel(options, value)
  const topologyLabel = behaviorLabel(TIERED_CACHE_TOPOLOGIES)
  const methodsLabel = (values) => optionsLabel(CACHEABLE_METHODS, values)
  const deviceGroupsLabel = (values) => optionsLabel(deviceGroups.value, values)

  watch(createOpen, (open) => {
    if (open) return
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
      // Built the way the endpoint reads it — a field that does not apply is not sent,
      // so a setting that honors the origin never carries a TTL nobody set.
      addCacheSetting({
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
      })
      toast.success(`Cache Settings "${name}" created.`)
      createOpen.value = false
    } catch (error) {
      toast.error('Could not create the cache settings.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
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
    />

    <!-- The page's parent section. It holds one section here — the controls row
         over the table it narrows, at the GROUP step — and spaces whatever sits
         inside it at --layout-section-gap. -->
    <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
      <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <!-- The band's CONTROLS: narrowing on the left, the band's own action on the
             right, above the card — the same row every list in the console opens with. -->
        <ControlsHeader>
          <!-- Search drives the table's global filter from outside the card, so the field is
               a plain InputText (`Table.Search` is context-aware and only works inside
               `<Table>`). One horizontal band: it grows into the row's slack and compresses
               rather than wrapping (see ui/ControlsHeader.vue). -->
          <InputText
            v-model="search"
            size="large"
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
        </ControlsHeader>

        <CardBox :padded="false">
          <template #content>
            <Table
              v-model:globalFilter="search"
              :data="rows"
              :columns="columns"
              row-key="id"
              enable-sorting
              :border="false"
            >
              <!-- A second cache layer is on or it is not, so the cell is a state and
                   not a value: a Tag when it is in play, muted text when it is not. -->
              <template #cell-tieredCache="{ row }">
                <Tag
                  v-if="row.tieredCache"
                  label="Enabled"
                  severity="success"
                  size="small"
                />
                <span
                  v-else
                  class="text-body-sm text-(--text-muted)"
                  >Disabled</span
                >
              </template>

              <!-- WHO changed the setting and WHEN, in one column: the modifier's avatar
                   (name on its tooltip) over the relative time — the same cell every
                   console list ends on (ui/LastModifiedCell.vue), which is why there is
                   no separate author column. -->
              <template #cell-lastModified="{ row }">
                <LastModifiedCell
                  :author="row.author"
                  :avatar-src="row.authorAvatar"
                  :date="row.modifiedAt"
                />
              </template>
            </Table>
          </template>
        </CardBox>
      </section>
    </section>

    <ResourceDrawer
      v-model:open="createOpen"
      title="Add Cache Settings"
      :submitting="submitting"
      @submit="submit"
    >
      <Section
        stacked
        :divided="false"
        title="General"
        hint="Names the cache setting in the rules that reference it. A rule's Set Cache Policy behavior points at a cache setting by name, so this is what the reader picks from that list."
      >
        <FieldStack
          label="Name"
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
        hint="How long the visitor's own browser may reuse a response before asking again. Honoring the origin passes its Cache-Control through untouched; overriding replaces it with the TTL set here."
      >
        <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <FieldStack label="Behavior">
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

          <!-- Only an overriding behavior reads a TTL. -->
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
        hint="How long Azion's edge may serve a stored response before revalidating with the origin. This is the layer that decides your cache hit rate, and 60 seconds is the floor unless Application Accelerator is active on the application."
      >
        <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <FieldStack label="Behavior">
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

          <!-- The three switches of `modules.cache`. Each one is a card block rather
               than a row of the form because each is a capability being turned on,
               not a value being typed — and two of them reveal a field when they are. -->
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

      <!-- `modules.application_accelerator`. Every field is optional and none of it is
           honoured while the module is off, which is exactly what the collapsed
           Advanced band is for (see ResourceDrawer). -->
      <Section
        collapsible
        stacked
        :divided="false"
        title="Advanced cache key"
        hint="Which parts of a request make two requests two different cached objects. Varying by more fields serves more precise content and stores more copies, so each option says what it costs. Requires the Application Accelerator module on this application."
      >
        <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <FieldStack
            label="Cache by HTTP method"
            description="GET and HEAD are always cached. Selecting POST or OPTIONS puts the request body in the cache key."
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
