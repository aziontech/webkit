<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DocProse from '@aziontech/webkit/doc-prose'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import KeyValuePairs from '@aziontech/webkit/key-value-pairs'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Select from '@aziontech/webkit/select'
  import Tabs from '@aziontech/webkit/tabs'
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
      'pi pi-key',
      'Access control',
      'firewall',
      'Sign every request with a rotating key, so the origin only answers traffic that passed through.',
      { featured: true }
    ),
    integration(
      'waiting-room',
      'Waiting Room',
      'Acme',
      'pi pi-hourglass',
      'Traffic management',
      'application',
      'Queue visitors during a traffic surge and let them in as capacity frees up.',
      { featured: true, installedOn: ['storefront'] }
    ),
    integration(
      'bot-score',
      'Bot Score',
      'Acme',
      'pi pi-shield',
      'Bot management',
      'firewall',
      'Score each request on known bot behaviour and block the ones above your threshold.',
      { featured: true }
    ),
    integration(
      'split-traffic',
      'Split Traffic',
      'Azion',
      'pi pi-sitemap',
      'Testing',
      'application',
      'Send a share of visitors to a second version of a page and keep each one on theirs.'
    ),
    integration(
      'geo-content',
      'Geo Content',
      'Azion',
      'pi pi-globe',
      'Personalization',
      'application',
      'Serve a regional version of a page from the visitor’s country, with a fallback.'
    ),
    integration(
      'signed-urls',
      'Signed URLs',
      'Azion',
      'pi pi-link',
      'Access control',
      'firewall',
      'Issue links that expire, so protected files can only be fetched for a limited time.',
      { installedOn: ['docs', 'api'] }
    ),
    integration(
      'rate-guard',
      'Rate Guard',
      'Acme',
      'pi pi-sliders-h',
      'Access control',
      'firewall',
      'Limit how many requests one client can make in a window, per path or per key.'
    ),
    integration(
      'payload-limit',
      'Payload Limit',
      'Azion',
      'pi pi-box',
      'Traffic management',
      'firewall',
      'Refuse request bodies above a size you set, before they reach the origin.'
    ),
    integration(
      'request-id',
      'Request ID',
      'Azion',
      'pi pi-hashtag',
      'Observability',
      'application',
      'Add a unique identifier header to every request, to trace it across services.'
    ),
    integration(
      'phone-check',
      'Phone Check',
      'Acme',
      'pi pi-phone',
      'Fraud prevention',
      'firewall',
      'Validate phone numbers on sign-up forms and flag numbers linked to fraud.'
    ),
    integration(
      'queue-writer',
      'Queue Writer',
      'Azion',
      'pi pi-inbox',
      'Messaging',
      'application',
      'Write each request to a queue for processing later, and answer the client right away.'
    ),
    integration(
      'schedule-block',
      'Scheduled Block',
      'Azion',
      'pi pi-calendar-times',
      'Access control',
      'firewall',
      'Close an application to traffic on a schedule, such as outside business hours.'
    )
  ])

  interface Template {
    id: string
    title: string
    framework: string
    icon: string
    description: string
    markClass: string
  }

  const template = (
    id: string,
    title: string,
    framework: string,
    icon: string,
    description: string,
    markClass = ''
  ): Template => ({ id, title, framework, icon, description, markClass })

  const INVERT_IN_DARK = '[[data-theme=dark]_&]:invert'

  const templates: Template[] = [
    template(
      'next-starter',
      'Next.js Starter',
      'Next.js',
      'ai-cor ai-next',
      'A Next.js app with server rendering and static pages, ready to deploy.',
      INVERT_IN_DARK
    ),
    template(
      'react-starter',
      'React Starter',
      'React',
      'ai-cor ai-react',
      'A single-page React app built with Vite, every route served from the edge.'
    ),
    template(
      'vue-starter',
      'Vue Starter',
      'Vue',
      'ai-cor ai-vue',
      'A lightweight Vue app with routing, built with Vite.'
    ),
    template(
      'nuxt-store',
      'Nuxt Storefront',
      'Nuxt',
      'ai-cor ai-nuxt',
      'A product catalog with a cart, rendered on the server and cached close to buyers.'
    ),
    template(
      'astro-blog',
      'Astro Blog',
      'Astro',
      'ai-cor ai-astro',
      'A content-first blog with Markdown posts, an RSS feed and a sitemap.'
    ),
    template(
      'angular-dashboard',
      'Angular Dashboard',
      'Angular',
      'ai-cor ai-angular',
      'A single-page admin dashboard with routing and lazy-loaded modules.'
    ),
    template(
      'svelte-starter',
      'Svelte Starter',
      'SvelteKit',
      'ai-cor ai-svelte',
      'A SvelteKit app with server routes and prerendered pages.'
    ),
    template(
      'solid-starter',
      'Solid Starter',
      'SolidStart',
      'ai-cor ai-solidjs',
      'A SolidStart app with fine-grained updates and streaming server rendering.'
    ),
    template(
      'qwik-starter',
      'Qwik Starter',
      'Qwik',
      'ai ai-qwik',
      'A resumable Qwik app that loads only the code a visitor touches.'
    ),
    template(
      'gatsby-site',
      'Gatsby Site',
      'Gatsby',
      'ai ai-gatsby',
      'A marketing site built at deploy time from Markdown and images.'
    ),
    template(
      'docusaurus-docs',
      'Docusaurus Docs',
      'Docusaurus',
      'ai ai-docusaurus',
      'A documentation site with versioned sections, search and a blog.'
    ),
    template(
      'vitepress-docs',
      'VitePress Docs',
      'VitePress',
      'ai ai-vitepress',
      'A fast documentation site written in Markdown, with a sidebar and search.'
    ),
    template(
      'hugo-docs',
      'Hugo Docs',
      'Hugo',
      'ai ai-hugo',
      'A documentation site with search, versioned sections and dark mode.'
    ),
    template(
      'static-site',
      'Static Site',
      'Static files',
      'ai ai-edge-storage',
      'Publish a folder of built files and serve it from the closest location.'
    ),
    template(
      'reverse-proxy',
      'Reverse Proxy',
      'JavaScript',
      'ai ai-edge-connectors',
      'Front an origin you already run and pass every request on to it.'
    ),
    template(
      'rest-api',
      'REST API',
      'Hono',
      'ai ai-hono',
      'A small Hono API with typed routes, running at the edge.'
    )
  ]

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

  const {
    items: templateItems,
    propertyFilterProps: templateFilterProps,
    status: templateStatus,
    clearFilters: clearTemplateFilters
  } = useCollection({
    items: templates,
    filtering: { fields: ['title', 'framework', 'description'] },
    propertyFiltering: {
      properties: [
        { key: 'title', label: 'Name' },
        {
          key: 'framework',
          label: 'Framework',
          options: [...new Set(templates.map((item) => item.framework))]
            .sort()
            .map((value) => ({ value }))
        }
      ]
    },
    url: { prefix: 'templates' }
  })

  const activeTab = ref('integrations')

  const detailOpen = ref(true)
  const selectedId = ref('request-signer')
  const selected = computed(
    () => catalog.value.find((item) => item.id === selectedId.value) ?? catalog.value[0]
  )
  const available = computed(() =>
    APPLICATIONS.filter((app) => !selected.value.installedOn.includes(app))
  )

  const form = reactive({ application: 'storefront' })
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
  }

  onMounted(install)

  onBeforeUnmount(() => toast.dismiss(INSTALL_TOAST))
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Marketplace"
        description="Find integrations and templates that run on your applications."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="pi pi-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/marketplace"
            target="_blank"
          />
        </template>
      </PageHeader>

      <div class="layout-section-start">
        <Tabs.Root v-model="activeTab">
          <Tabs.List align="center">
            <Tabs.Item
              value="templates"
              label="Templates"
            />
            <Tabs.Item
              value="integrations"
              label="Integrations"
            />
          </Tabs.List>
          <div class="relative isolate w-full">
            <Tabs.Panel value="templates">
              <section
                class="flex min-w-0 flex-col gap-(--layout-group-gap) pt-(--layout-group-gap)"
                aria-label="Templates"
              >
                <PropertyFilter
                  v-bind="templateFilterProps"
                  placeholder="Search templates"
                  aria-label="Search templates"
                />

                <EmptyState
                  v-if="templateStatus === 'no-match'"
                  bordered
                  size="medium"
                  icon="pi pi-search"
                  title="No matching templates"
                  description="No template matches these filters. Try another name or framework."
                >
                  <template #actions>
                    <Button
                      label="Clear filters"
                      kind="outlined"
                      size="small"
                      @click="clearTemplateFilters"
                    />
                  </template>
                </EmptyState>

                <ul
                  v-else
                  class="m-0 grid list-none grid-cols-2 gap-(--spacing-md) p-0 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5"
                >
                  <li
                    v-for="item in templateItems"
                    :key="item.id"
                    class="flex min-w-0"
                  >
                    <Card
                      kind="integration"
                      class="w-full"
                      :title="item.title"
                      :logo="[item.icon, item.markClass].filter(Boolean).join(' ')"
                      :description="item.description"
                      :badges="[{ label: item.framework, severity: 'neutral' }]"
                      :href="`/marketplace/templates/${item.id}`"
                    />
                  </li>
                </ul>
              </section>
            </Tabs.Panel>

            <Tabs.Panel value="integrations">
              <div class="flex min-w-0 flex-col gap-(--layout-section-gap) pt-(--layout-group-gap)">
                <section
                  v-if="!filtersActive"
                  class="flex min-w-0 flex-col gap-(--layout-group-gap)"
                  aria-labelledby="marketplace-featured"
                >
                  <h2
                    id="marketplace-featured"
                    class="text-heading-xxs text-(--text-default)"
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
                        kind="integration"
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
                    class="text-heading-xxs text-(--text-default)"
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
                    icon="pi pi-filter-slash"
                    title="No matching integrations"
                    description="No integration matches this search. Remove a filter to widen the results."
                  >
                    <template #actions>
                      <Button
                        label="Clear filters"
                        kind="outlined"
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
                        kind="integration"
                        :title="item.name"
                        :vendor="item.vendor"
                        :logo="item.logo"
                        :description="item.description"
                        :badges="[{ label: item.category, severity: 'neutral' }]"
                        :installed="item.status === 'installed'"
                        @select="openDetail(item.id)"
                      >
                        <template #action>
                          <Button
                            :label="item.status === 'installed' ? 'Configure' : 'Install'"
                            :aria-label="`${item.status === 'installed' ? 'Configure' : 'Install'} ${item.name}`"
                            kind="outlined"
                            size="small"
                            @click="openDetail(item.id)"
                          />
                        </template>
                      </Card>
                    </li>
                  </ul>
                </section>
              </div>
            </Tabs.Panel>
          </div>
        </Tabs.Root>
      </div>
    </div>

    <Drawer
      v-model:open="detailOpen"
      size="medium"
      side="right"
    >
      <DrawerPortal>
        <DrawerOverlay />
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
                  class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
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
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
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

                <KeyValuePairs
                  :columns="2"
                  aria-label="Integration details"
                >
                  <KeyValuePairs.Item label="Publisher"
                    ><bdi>{{ selected.vendor }}</bdi></KeyValuePairs.Item
                  >
                  <KeyValuePairs.Item label="Category">{{ selected.category }}</KeyValuePairs.Item>
                  <KeyValuePairs.Item label="Context">{{
                    CONTEXTS[selected.context]
                  }}</KeyValuePairs.Item>
                  <KeyValuePairs.Item label="Version">{{ selected.version }}</KeyValuePairs.Item>
                  <KeyValuePairs.Item label="Updated">{{ selected.updated }}</KeyValuePairs.Item>
                  <KeyValuePairs.Item label="Installed on">{{
                    selected.installedOn.length ? selected.installedOn.join(', ') : 'Not installed'
                  }}</KeyValuePairs.Item>
                </KeyValuePairs>

                <section
                  class="flex flex-col gap-(--layout-group-gap)"
                  aria-labelledby="integration-overview"
                >
                  <h3
                    id="integration-overview"
                    class="text-heading-xxs text-(--text-default)"
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
                    class="text-heading-xxs text-(--text-default)"
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
                        class="pi pi-check shrink-0 text-(--success-contrast)"
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
                    class="text-heading-xxs text-(--text-default)"
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
                        <Select.Option
                          v-for="app in available"
                          :key="app"
                          :value="app"
                          >{{ app }}</Select.Option
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
            </PanelContent>

            <PanelFooter>
              <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
                <Button
                  v-if="selected.installedOn.length"
                  label="Configure"
                  icon="pi pi-cog"
                  kind="outlined"
                  size="medium"
                  :href="`/marketplace/${selected.id}/configure`"
                />
                <Button
                  key="button-2"
                  v-if="available.length"
                  label="Install"
                  kind="primary"
                  size="medium"
                  type="submit"
                  :loading="run.state === 'running'"
                />
              </div>
            </PanelFooter>
          </form>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </div>
</template>
