<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IntegrationCard from '@aziontech/webkit/integration-card'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import { toast } from '@aziontech/webkit/toast'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'

  import IntegrationDrawer from './parts/integration-drawer.vue'
  import IntegrationTilesLoading from './parts/integration-tiles-loading.vue'
  import { sampleApplications, sampleIntegrations } from './sample'

  /** Where an integration runs. */
  export type MarketplaceContext = 'application' | 'firewall'

  /** One integration of the catalog. */
  export interface MarketplaceIntegration {
    /** Stable slug, used in the Configure link. */
    id: string
    /** The name on the tile and the drawer title. */
    name: string
    /** Who publishes it. */
    vendor: string
    /** Icon classes of its mark. */
    logo: string
    /** The category badge and filter value. */
    category: string
    /** Where it runs. */
    context: MarketplaceContext
    /** One sentence on the tile and in the drawer. */
    description: string
    /** The current version, as display text. */
    version: string
    /** When it changed last, as display text. */
    updated: string
    /** Listed in the Featured row. */
    featured: boolean
    /** The applications it already runs on. */
    installedOn: string[]
  }

  /** What an install sends. */
  export interface MarketplaceInstall {
    /** The integration to install. */
    integration: MarketplaceIntegration
    /** The application to install it on. */
    application: string
  }

  export interface MarketplaceProps {
    /** The catalog; filtered in the browser. Left out, the sample renders. */
    integrations?: MarketplaceIntegration[]
    /** The applications an integration can be installed on. Left out, the sample renders. */
    applications?: string[]
    /** The catalog is loading: the search disables and skeleton tiles hold the grid. */
    loading?: boolean
    /** The install request is in flight: Install spins, the field locks and the progress toast shows. */
    installing?: boolean
    /** Why the last install failed, shown in the danger alert and the failure toast with Reinstall. */
    error?: string
    /** The application the last install succeeded on; the drawer and a toast confirm it. */
    installedApplication?: string
    /** Search text the filter starts with, shown as a free-text token. */
    defaultText?: string
    /** Id of the integration whose drawer starts open. */
    defaultIntegration?: string
    /** Application the install field starts with. */
    defaultApplication?: string
  }

  const props = withDefaults(defineProps<MarketplaceProps>(), {
    integrations: undefined,
    applications: undefined,
    loading: false,
    installing: false,
    error: '',
    installedApplication: '',
    defaultText: '',
    defaultIntegration: '',
    defaultApplication: ''
  })

  const emit = defineEmits<{
    select: [event: MouseEvent, integration: MarketplaceIntegration]
    install: [event: Event, payload: MarketplaceInstall]
  }>()

  const CONTEXTS: Record<MarketplaceContext, string> = {
    application: 'Application',
    firewall: 'Firewall'
  }

  const source = computed<MarketplaceIntegration[]>(
    () => props.integrations ?? (props.loading ? [] : sampleIntegrations)
  )
  const catalog = ref<MarketplaceIntegration[]>([])
  watch(
    source,
    (next) => {
      catalog.value = next.map((item) => ({ ...item, installedOn: [...item.installedOn] }))
    },
    { immediate: true }
  )
  const applications = computed(() => props.applications ?? sampleApplications)

  const withStatus = (item: MarketplaceIntegration) => ({
    ...item,
    status: item.installedOn.length ? 'installed' : 'available'
  })

  const unique = (key: 'vendor' | 'category') =>
    [...new Set(catalog.value.map((item) => item[key]))].sort()

  const properties = computed(() => [
    { key: 'name', label: 'Name' },
    {
      key: 'vendor',
      label: 'Publisher',
      options: unique('vendor').map((value) => ({ value }))
    },
    {
      key: 'category',
      label: 'Category',
      options: unique('category').map((value) => ({ value }))
    },
    {
      key: 'context',
      label: 'Context',
      options: Object.entries(CONTEXTS).map(([value, label]) => ({ value, label }))
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'installed', label: 'Installed' },
        { value: 'available', label: 'Available' }
      ]
    }
  ])

  const { items, propertyFilterProps, status, filtersActive, clearFilters } = useCollection({
    items: () => catalog.value.map(withStatus),
    filtering: { fields: ['name', 'vendor', 'description'] },
    propertyFiltering: {
      properties,
      defaultQuery: {
        tokens: props.defaultText ? [{ operator: ':', value: props.defaultText }] : [],
        operation: 'and'
      }
    },
    url: true
  })

  const featured = computed(() => catalog.value.filter((item) => item.featured))

  const detailOpen = ref(props.defaultIntegration !== '')
  const selectedId = ref(props.defaultIntegration || 'request-signer')
  const selected = computed<MarketplaceIntegration | undefined>(
    () => catalog.value.find((item) => item.id === selectedId.value) ?? catalog.value[0]
  )
  const available = computed(() =>
    applications.value.filter((app) => !selected.value?.installedOn.includes(app))
  )

  const form = reactive({ application: props.defaultApplication })
  const showErrors = ref(false)
  const applicationInvalid = computed(() => showErrors.value && !form.application)

  const run = reactive({ state: 'idle', application: '', reason: '' })
  const INSTALL_TOAST = 'marketplace-install'

  const openDetail = (id: string) => {
    if (selectedId.value !== id) {
      selectedId.value = id
      form.application = ''
      showErrors.value = false
      Object.assign(run, { state: 'idle', application: '', reason: '' })
    }
    detailOpen.value = true
  }

  const onSelect = (event: MouseEvent, item: MarketplaceIntegration) => {
    openDetail(item.id)
    emit('select', event, item)
  }

  const configure = () => {
    toast.dismiss(INSTALL_TOAST)
    openDetail(selectedId.value)
  }

  const install = (event: Event) => {
    showErrors.value = true
    const integration = selected.value
    if (!integration || !form.application || props.installing) return
    emit('install', event, { integration, application: form.application })
  }

  let announced = false
  const announce = () => {
    const item = selected.value
    if (!item || detailOpen.value || run.state === 'idle') {
      toast.dismiss(INSTALL_TOAST)
      return
    }
    if (announced && run.state !== 'running') return
    announced = run.state !== 'running'
    const { application, reason } = run
    if (run.state === 'running')
      toast.loading(`Installing ${item.name} on ${application}…`, {
        description: 'It keeps running while you work elsewhere.',
        id: INSTALL_TOAST
      })
    else if (run.state === 'succeeded')
      toast.success(`${item.name} is installed on ${application}.`, {
        description: 'It runs from the next request to the application.',
        id: INSTALL_TOAST,
        closable: true,
        actions: [
          { label: 'Configure', onClick: configure },
          { label: 'Open application', onClick: () => toast.dismiss(INSTALL_TOAST) }
        ]
      })
    else
      toast.error(`${item.name} wasn't installed on ${application}.`, {
        description: reason,
        id: INSTALL_TOAST,
        duration: 0,
        closable: true,
        actions: [
          { label: 'Edit', onClick: configure },
          { label: 'Reinstall', onClick: (event: MouseEvent) => install(event) }
        ]
      })
  }

  const showRunning = () => {
    const item = selected.value
    if (!item) return
    const application = form.application
    announced = false
    Object.assign(run, { state: 'running', application, reason: '' })
    announce()
  }

  const showSucceeded = (application: string) => {
    const item = selected.value
    if (!item) return
    if (!item.installedOn.includes(application))
      item.installedOn = [...item.installedOn, application]
    form.application = ''
    showErrors.value = false
    announced = false
    Object.assign(run, { state: 'succeeded', application, reason: '' })
    announce()
  }

  const showFailed = (reason: string) => {
    const item = selected.value
    if (!item) return
    const application = run.application || form.application
    form.application = application
    announced = false
    Object.assign(run, { state: 'failed', application, reason })
    announce()
  }

  const reinstall = (event: MouseEvent) => {
    form.application = run.application
    install(event)
  }

  watch(detailOpen, announce)
  watch(
    () => props.installing,
    (next) => {
      if (next) showRunning()
      else if (props.error) showFailed(props.error)
    }
  )
  watch(
    () => props.error,
    (next) => {
      if (next) showFailed(next)
    }
  )
  watch(
    () => props.installedApplication,
    (next) => {
      if (next) showSucceeded(next)
    }
  )

  onMounted(() => {
    if (props.installing) showRunning()
    else if (props.error) showFailed(props.error)
    else if (props.installedApplication) showSucceeded(props.installedApplication)
  })

  onBeforeUnmount(() => toast.dismiss(INSTALL_TOAST))
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Marketplace"
        description="Find integrations that run on your applications."
      >
        <template #actions>
          <Button
            label="Documentation"
            aria-label="Documentation (opens in a new tab)"
            icon="az az-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/marketplace"
            target="_blank"
          />
        </template>
      </PageHeader>

      <div class="layout-section-start">
        <section
          v-if="loading"
          class="flex min-w-0 flex-col gap-(--layout-group-gap) pt-(--layout-group-gap)"
          aria-busy="true"
          aria-label="Loading integrations"
        >
          <PropertyFilter
            v-bind="propertyFilterProps"
            placeholder="Search integrations"
            aria-label="Search integrations"
            disabled
          />
          <IntegrationTilesLoading />
        </section>
        <div
          v-else
          class="flex min-w-0 flex-col gap-(--layout-section-gap) pt-(--layout-group-gap)"
        >
          <section
            v-if="!filtersActive"
            class="flex min-w-0 flex-col gap-(--layout-group-gap)"
            aria-labelledby="marketplace-featured"
          >
            <h2
              id="marketplace-featured"
              class="text-heading-2xs text-(--text-default)"
            >
              Featured
            </h2>
            <ul class="m-0 grid list-none grid-cols-1 gap-(--spacing-md) p-0 md:grid-cols-3">
              <li
                v-for="item in featured"
                :key="item.id"
                class="flex min-w-0"
              >
                <IntegrationCard
                  class="w-full"
                  featured
                  :title="item.name"
                  :vendor="item.vendor"
                  :logo="item.logo"
                  :description="item.description"
                  :badges="[{ label: CONTEXTS[item.context] }]"
                  :installed="item.installedOn.length > 0"
                  @select="(event: MouseEvent) => onSelect(event, item)"
                />
              </li>
            </ul>
          </section>

          <section
            class="flex min-w-0 flex-col gap-(--layout-group-gap)"
            aria-labelledby="marketplace-all"
          >
            <h2
              id="marketplace-all"
              class="text-heading-2xs text-(--text-default)"
            >
              All integrations
            </h2>
            <PropertyFilter
              v-bind="propertyFilterProps"
              placeholder="Search integrations"
              aria-label="Search integrations"
            />

            <EmptyState
              v-if="status === 'no-match'"
              size="medium"
              icon="az az-filter-off"
              title="No matching integrations"
              description="No integration matches this search. Remove a filter to widen the results."
            >
              <template #actions>
                <Button
                  label="Clear filters"
                  variant="outline"
                  size="small"
                  @click="clearFilters"
                />
              </template>
            </EmptyState>

            <ul
              v-else
              class="m-0 grid list-none grid-cols-1 gap-(--spacing-md) p-0 sm:grid-cols-2 xl:grid-cols-3"
            >
              <li
                v-for="item in items"
                :key="item.id"
                class="flex min-w-0"
              >
                <IntegrationCard
                  class="w-full"
                  :title="item.name"
                  :vendor="item.vendor"
                  :logo="item.logo"
                  :description="item.description"
                  :badges="[{ label: item.category, severity: 'neutral' }]"
                  :installed="item.status === 'installed'"
                  @select="(event: MouseEvent) => onSelect(event, item)"
                >
                  <template #actions>
                    <Button
                      :label="item.status === 'installed' ? 'Configure' : 'Install'"
                      :aria-label="`${item.status === 'installed' ? 'Configure' : 'Install'} ${item.name}`"
                      variant="outline"
                      size="small"
                      @click="(event: MouseEvent) => onSelect(event, item)"
                    />
                  </template>
                </IntegrationCard>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>

    <IntegrationDrawer
      v-if="selected"
      v-model:open="detailOpen"
      v-model:application="form.application"
      :integration="selected"
      :context-label="CONTEXTS[selected.context]"
      :available="available"
      :installing="installing"
      :invalid="applicationInvalid"
      :run="run"
      @submit="install"
      @reinstall="reinstall"
    />
  </div>
</template>
