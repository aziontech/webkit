<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DocProse from '@aziontech/webkit/doc-prose'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Select from '@aziontech/webkit/select'
  import { toast } from '@aziontech/webkit/toast'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

  type IntegrationContext = 'application' | 'firewall'

  interface Integration {
    id: string
    name: string
    vendor: string
    logo: string
    category: string
    context: IntegrationContext
    description: string
    version: string
    updated: string
    featured: boolean
    installedOn: string[]
  }

  const CONTEXTS: Record<IntegrationContext, string> = {
    application: 'Application',
    firewall: 'Firewall'
  }
  const APPLICATIONS = ['storefront', 'checkout', 'docs', 'api']

  const integration = (
    id: string,
    name: string,
    vendor: string,
    logo: string,
    category: string,
    context: IntegrationContext,
    description: string,
    extra: Partial<Integration> = {}
  ): Integration => ({
    id,
    name,
    vendor,
    logo,
    category,
    context,
    description,
    version: '1.4.0',
    updated: 'Oct 30, 2026',
    featured: false,
    installedOn: [],
    ...extra
  })

  const catalog = ref([
    integration(
      'request-signer',
      'Request Signer',
      'Acme',
      'ai ai-key',
      'Access control',
      'firewall',
      'Sign every request with a rotating key, so the origin only answers traffic that passed through.',
      { featured: true }
    ),
    integration(
      'waiting-room',
      'Waiting Room',
      'Acme',
      'ai ai-hourglass',
      'Traffic management',
      'application',
      'Queue visitors during a traffic surge and let them in as capacity frees up.',
      { featured: true, installedOn: ['storefront'] }
    ),
    integration(
      'bot-score',
      'Bot Score',
      'Acme',
      'ai ai-shield',
      'Bot management',
      'firewall',
      'Score each request on known bot behaviour and block the ones above your threshold.',
      { featured: true }
    ),
    integration(
      'split-traffic',
      'Split Traffic',
      'Azion',
      'ai ai-sitemap',
      'Testing',
      'application',
      'Send a share of visitors to a second version of a page and keep each one on theirs.'
    ),
    integration(
      'geo-content',
      'Geo Content',
      'Azion',
      'ai ai-globe',
      'Personalization',
      'application',
      'Serve a regional version of a page from the visitor’s country, with a fallback.'
    ),
    integration(
      'signed-urls',
      'Signed URLs',
      'Azion',
      'ai ai-link',
      'Access control',
      'firewall',
      'Issue links that expire, so protected files can only be fetched for a limited time.',
      { installedOn: ['docs', 'api'] }
    ),
    integration(
      'rate-guard',
      'Rate Guard',
      'Acme',
      'ai ai-sliders-horizontal',
      'Access control',
      'firewall',
      'Limit how many requests one client can make in a window, per path or per key.'
    ),
    integration(
      'payload-limit',
      'Payload Limit',
      'Azion',
      'ai ai-box',
      'Traffic management',
      'firewall',
      'Refuse request bodies above a size you set, before they reach the origin.'
    ),
    integration(
      'request-id',
      'Request ID',
      'Azion',
      'ai ai-hash',
      'Observability',
      'application',
      'Add a unique identifier header to every request, to trace it across services.'
    ),
    integration(
      'phone-check',
      'Phone Check',
      'Acme',
      'ai ai-phone',
      'Fraud prevention',
      'firewall',
      'Validate phone numbers on sign-up forms and flag numbers linked to fraud.'
    ),
    integration(
      'queue-writer',
      'Queue Writer',
      'Azion',
      'ai ai-inbox',
      'Messaging',
      'application',
      'Write each request to a queue for processing later, and answer the client right away.'
    ),
    integration(
      'schedule-block',
      'Scheduled Block',
      'Azion',
      'ai ai-calendar-x',
      'Access control',
      'firewall',
      'Close an application to traffic on a schedule, such as outside business hours.'
    )
  ])

  const withStatus = (item: Integration) => ({
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
    propertyFiltering: { properties },
    url: true
  })

  const featured = computed(() => catalog.value.filter((item) => item.featured))

  const detailOpen = ref(true)
  const selectedId = ref('request-signer')
  const selected = computed(
    () => catalog.value.find((item) => item.id === selectedId.value) ?? catalog.value[0]
  )
  const available = computed(() =>
    APPLICATIONS.filter((app) => !selected.value.installedOn.includes(app))
  )

  const form = reactive({ application: '' })
  const showErrors = ref(false)
  const applicationInvalid = computed(() => showErrors.value && !form.application)

  const run = reactive({ state: 'idle', application: '', reason: '' })
  const INSTALL_TOAST = 'marketplace-install'
  let timer: ReturnType<typeof setTimeout> | undefined

  const openDetail = (id: string) => {
    if (selectedId.value !== id) {
      selectedId.value = id
      form.application = ''
      showErrors.value = false
      Object.assign(run, { state: 'idle', application: '', reason: '' })
    }
    detailOpen.value = true
  }

  const configure = () => {
    toast.dismiss(INSTALL_TOAST)
    openDetail(selectedId.value)
  }

  const succeed = (item: Integration, application: string) => {
    item.installedOn = [...item.installedOn, application]
    form.application = ''
    showErrors.value = false
    Object.assign(run, { state: 'succeeded', application, reason: '' })
    toast.success(`${item.name} is installed on ${application}.`, {
      id: INSTALL_TOAST,
      description: 'It runs from the next request to the application.',
      closable: true,
      actions: [
        { label: 'Configure', onClick: configure },
        { label: 'Open application', onClick: () => toast.dismiss(INSTALL_TOAST) }
      ]
    })
  }

  const install = () => {
    showErrors.value = true
    if (!form.application || run.state === 'running') return
    const item = selected.value
    const application = form.application
    Object.assign(run, { state: 'running', application, reason: '' })
    toast.loading(`Installing ${item.name} on ${application}…`, {
      id: INSTALL_TOAST,
      description: 'It keeps running if you close this panel.'
    })
    clearTimeout(timer)
    timer = setTimeout(() => succeed(item, application), 2400)
  }

  const fail = (item: Integration, application: string) => {
    form.application = application
    Object.assign(run, {
      state: 'failed',
      application,
      reason: 'The application already runs 10 functions, the most it can hold.'
    })
    toast.error(`${item.name} wasn't installed on ${application}.`, {
      id: INSTALL_TOAST,
      description: run.reason,
      duration: 0,
      closable: true,
      actions: [
        { label: 'Edit', onClick: configure },
        { label: 'Reinstall', onClick: install }
      ]
    })
  }

  onMounted(() => fail(selected.value, 'checkout'))

  onBeforeUnmount(() => {
    clearTimeout(timer)
    toast.dismiss(INSTALL_TOAST)
  })
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
            icon="ai ai-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/marketplace"
            target="_blank"
          />
        </template>
      </PageHeader>

      <div class="layout-section-start">
        <div class="flex min-w-0 flex-col gap-(--layout-section-gap) pt-(--layout-group-gap)">
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
                <Card
                  class="w-full"
                  variant="integration"
                  featured
                  :title="item.name"
                  :vendor="item.vendor"
                  :logo="item.logo"
                  :description="item.description"
                  :badges="[{ label: CONTEXTS[item.context] }]"
                  :installed="item.installedOn.length > 0"
                  @select="openDetail(item.id)"
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
              icon="ai ai-filter-off"
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
                <Card
                  class="w-full"
                  variant="integration"
                  :title="item.name"
                  :vendor="item.vendor"
                  :logo="item.logo"
                  :description="item.description"
                  :badges="[{ label: item.category, severity: 'neutral' }]"
                  :installed="item.status === 'installed'"
                  @select="openDetail(item.id)"
                >
                  <template #actions>
                    <Button
                      :label="item.status === 'installed' ? 'Configure' : 'Install'"
                      :aria-label="`${item.status === 'installed' ? 'Configure' : 'Install'} ${item.name}`"
                      variant="outline"
                      size="small"
                      @click="openDetail(item.id)"
                    />
                  </template>
                </Card>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>

    <Drawer
      v-model:open="detailOpen"
      size="large"
      side="end"
    >
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          :aria-label="`Install ${selected.name}`"
          novalidate
          @submit.prevent="install"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 items-center gap-(--spacing-sm)">
              <span
                class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  :class="selected.logo"
                  class="text-body-lg leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>
              <div class="flex min-w-0 flex-col">
                <DrawerTitle>{{ selected.name }}</DrawerTitle>
                <span class="text-body-xs text-(--text-muted)"
                  >by <bdi>{{ selected.vendor }}</bdi></span
                >
              </div>
            </div>
          </PanelHeader>

          <PanelBody>
            <div class="flex flex-col gap-(--layout-section-gap)">
              <Alert
                key="alert-1"
                v-if="run.state === 'succeeded'"
                severity="success"
                :label="`${selected.name} is installed on ${run.application}. It runs from the next request.`"
              />
              <Alert
                key="alert-2"
                v-else-if="run.state === 'failed'"
                severity="danger"
                :label="`${selected.name} wasn't installed on ${run.application}. ${run.reason}`"
                action-label="Reinstall"
                @action="
                  () => {
                    form.application = run.application
                    install()
                  }
                "
              />

              <p class="m-0 text-body-sm text-(--text-muted)">{{ selected.description }}</p>

              <KeyValueList
                :columns="2"
                aria-label="Integration details"
              >
                <KeyValueList.Item label="Publisher"
                  ><bdi>{{ selected.vendor }}</bdi></KeyValueList.Item
                >
                <KeyValueList.Item label="Category">{{ selected.category }}</KeyValueList.Item>
                <KeyValueList.Item label="Context">{{
                  CONTEXTS[selected.context]
                }}</KeyValueList.Item>
                <KeyValueList.Item label="Version">{{ selected.version }}</KeyValueList.Item>
                <KeyValueList.Item label="Updated">{{ selected.updated }}</KeyValueList.Item>
                <KeyValueList.Item label="Installed on">{{
                  selected.installedOn.length ? selected.installedOn.join(', ') : 'Not installed'
                }}</KeyValueList.Item>
              </KeyValueList>

              <section
                class="flex flex-col gap-(--layout-group-gap)"
                aria-labelledby="integration-overview"
              >
                <h3
                  id="integration-overview"
                  class="text-heading-2xs text-(--text-default)"
                >
                  Overview
                </h3>
                <DocProse>
                  <p>{{ selected.description }}</p>
                  <p>
                    Installing adds a function instance to the application you choose and one rule
                    that runs it. Its settings can be changed at any time from Configure.
                  </p>
                </DocProse>
              </section>

              <section
                class="flex flex-col gap-(--layout-group-gap)"
                aria-labelledby="integration-permissions"
              >
                <h3
                  id="integration-permissions"
                  class="text-heading-2xs text-(--text-default)"
                >
                  Permissions
                </h3>
                <ul class="m-0 flex list-none flex-col gap-(--spacing-sm) p-0">
                  <li
                    v-for="permission in [
                      'Read the application’s rules',
                      'Add a function instance to the application',
                      'Add one rule that runs the function'
                    ]"
                    :key="permission"
                    class="flex items-center gap-(--spacing-sm) text-body-sm text-(--text-muted)"
                  >
                    <i
                      class="ai ai-check shrink-0 text-(--success-foreground)"
                      aria-hidden="true"
                    />
                    {{ permission }}
                  </li>
                </ul>
              </section>

              <section
                class="flex flex-col gap-(--layout-group-gap)"
                aria-labelledby="integration-install"
              >
                <h3
                  id="integration-install"
                  class="text-heading-2xs text-(--text-default)"
                >
                  {{ selected.installedOn.length ? 'Install on another application' : 'Install' }}
                </h3>
                <Field
                  v-if="available.length"
                  :invalid="applicationInvalid"
                  :disabled="run.state === 'running'"
                  required
                >
                  <Field.Label>Application</Field.Label>
                  <Select
                    v-model="form.application"
                    size="medium"
                    placeholder="Select an application"
                  >
                    <Select.Trigger class="w-full" />
                    <Select.Content>
                      <Select.Item
                        v-for="app in available"
                        :key="app"
                        :value="app"
                        >{{ app }}</Select.Item
                      >
                    </Select.Content>
                  </Select>
                  <Field.Error v-if="applicationInvalid">
                    Select the application to install {{ selected.name }} on.
                  </Field.Error>
                  <Field.Description v-else>
                    The integration runs on every request to this application.
                  </Field.Description>
                </Field>
                <p
                  v-else
                  class="m-0 text-body-sm text-(--text-muted)"
                >
                  {{ selected.name }} is installed on every application.
                </p>
              </section>
            </div>
          </PanelBody>

          <PanelFooter>
            <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
              <Button
                v-if="selected.installedOn.length"
                label="Configure"
                icon="ai ai-settings"
                variant="outline"
                size="medium"
                :href="`/marketplace/${selected.id}/configure`"
              />
              <Button
                key="button-2"
                v-if="available.length"
                label="Install"
                variant="primary"
                size="medium"
                type="submit"
                :loading="run.state === 'running'"
              />
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </Drawer>
  </div>
</template>
