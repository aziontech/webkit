<script setup>
  // Marketplace — the Azion Console "Marketplace" landing, structured like the
  // real product (azion.com/.../products/marketplace): two top-level offerings,
  // TEMPLATES (pre-built starter projects) and INTEGRATIONS (functions that
  // improve/compose an application). The centered TabView at the top switches
  // between them. Templates shows a framework grid whose colored logo is
  // grayscale until hover, with a soft brand-color glow. Integrations are grouped
  // by execution context — Applications-based and Firewall-based. The app shell
  // (sidebar + GlobalHeader breadcrumb) comes from AppLayout.
  import EmptyState from '@aziontech/webkit/empty-state'
  import InputText from '@aziontech/webkit/input-text'
  import TabView from '@aziontech/webkit/tab-view'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'

  import FilterButton from '../../components/list/FilterButton.vue'
  import FilterChips from '../../components/list/FilterChips.vue'
  import IntegrationCard from '../../components/marketplace/IntegrationCard.vue'
  import TemplateCard from '../../components/marketplace/TemplateCard.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { applyFilters } from '../../lib/behavior/filter-bar'
  import { FRAMEWORKS } from '../../lib/data/frameworks'

  // Where `Documentation` goes. The catalog's own docs, the URL the template and integration
  // cards already link for "learn more" (lib/data/product-empty-states.js states it per
  // product's `startFast`; the module itself has no registry entry of its own).
  const HELP = 'https://www.azion.com/en/documentation/products/marketplace/'

  // ── ARRIVING ON A NAMED ENTRY (`?tab=` + `?q=`) ────────────────────────────
  // A product's first use offers four Marketplace functions by name
  // (../product-empty-states.js → `startFast`), and a row that names one thing has to
  // land on THAT thing — arriving on the Templates grid with a search box the reader
  // then has to retype the row's own title into would be the row not working.
  //
  // So the tab and the search term are readable from the URL: `?tab=integrations`
  // selects the offering, `?q=Hello World` seeds that offering's own search. Read once
  // on arrival and then owned by the controls — the reader can clear the field, and the
  // query does not follow them around as they type (the same read-once treatment
  // `?state=` gets in ../lib/sample-mode.js).
  const route = useRoute()

  // The two top-level Marketplace offerings.
  const activeTab = ref(route.query.tab === 'integrations' ? 'integrations' : 'templates')

  // Independent search per offering, seeded from `?q=` on the tab that was asked for.
  const initialQuery = typeof route.query.q === 'string' ? route.query.q : ''
  const templateQuery = ref(activeTab.value === 'templates' ? initialQuery : '')
  const integrationQuery = ref(activeTab.value === 'integrations' ? initialQuery : '')

  // ── Templates: pre-built framework starters ──
  // READ FROM THE ONE CATALOG (../../lib/data/frameworks.js), not typed again here. This
  // list used to be its own copy of ten framework starters, which is two catalogs of the
  // same thing: the create flow's template list grew to the platform's full preset set
  // (the 25 `@aziontech/presets` exports) and this grid would still have been offering the
  // same ten — three of which the platform has no preset for at all. `id`/`name` are what
  // the card below binds, so the shape is mapped once here.
  //
  // `icon` is the brand mark — `ai-cor ai-*` for a colored logo, `ai ai-*` for a font
  // glyph — grayscale until hover; `color` is the framework's brand hex for the soft hover
  // glow, and the card falls back to `--primary` for a framework whose brand colour we do
  // not carry.
  const templates = FRAMEWORKS.map((framework) => ({
    id: framework.tech,
    name: framework.title,
    description: framework.description,
    icon: framework.icon,
    color: framework.color
  }))

  // ── Integrations: functions that improve/compose an application. Azion's
  // taxonomy splits them by execution context — Application Functions and Firewall
  // Functions — and within each context by use case (the subcategories from the
  // Marketplace integrations catalog). Each card uses a logo-left / text-right
  // layout: the Azion Marketplace vendor mark, then the title with "by {vendor}"
  // and the description. Vendors vary: Azion curates most, but partners publish
  // the rest (Radware, Axur, Google, hCaptcha, Saffe, IPQualityScore, Upstash). ──
  const integrations = [
    // ── Application Functions · Testing and validation ──
    {
      id: 'ab-tests',
      name: 'A/B Tests',
      description:
        'Validate addresses, interfaces, or entire workflows by splitting traffic at the edge.',
      vendor: 'Azion',
      context: 'applications',
      group: 'Testing and validation'
    },
    {
      id: 'hello-world',
      name: 'Hello World',
      description:
        'A minimal edge function that displays a “Hello World” message to show how the edge works.',
      vendor: 'Azion',
      context: 'applications',
      group: 'Testing and validation'
    },
    {
      id: 'send-to-queue',
      name: 'Send Messages to a Queue',
      description:
        'Add messages to a queue for asynchronous processing between the components of your system.',
      vendor: 'Azion',
      context: 'applications',
      group: 'Testing and validation'
    },
    // ── Application Functions · Content segmentation and personalization ──
    {
      id: 'content-targeting',
      name: 'Content Targeting',
      description: 'Manipulate cookies and headers to build flexible content-targeting logic.',
      vendor: 'Azion',
      context: 'applications',
      group: 'Content segmentation and personalization'
    },
    {
      id: 'signed-cookies',
      name: 'Signed Cookies',
      description:
        'Implement cookies with an extra layer of security through cryptographic signing.',
      vendor: 'Azion',
      context: 'applications',
      group: 'Content segmentation and personalization'
    },
    // ── Firewall Functions · Bot management ──
    {
      id: 'bot-manager-lite',
      name: 'Azion Bot Manager Lite',
      description:
        'Analyze incoming requests and assign a score based on rules and behaviors to block bad bots.',
      vendor: 'Azion',
      context: 'firewall',
      group: 'Bot management'
    },
    {
      id: 'radware-bot-manager',
      name: 'Radware Bot Manager',
      description: 'Defend your online assets against sophisticated bot-based attacks.',
      vendor: 'Radware',
      context: 'firewall',
      group: 'Bot management'
    },
    // ── Firewall Functions · Security optimization and access control ──
    {
      id: 'axur-cardstream',
      name: 'Axur Cardstream',
      description:
        'Protect your e-commerce from fraud by detecting compromised payment cards in real time.',
      vendor: 'Axur',
      context: 'firewall',
      group: 'Security optimization and access control'
    },
    {
      id: 'axur-leakstream',
      name: 'Axur Leakstream',
      description: 'Monitor leaked credentials and protect your users from checker attacks.',
      vendor: 'Axur',
      context: 'firewall',
      group: 'Security optimization and access control'
    },
    {
      id: 'send-event-endpoint',
      name: 'Send Event to Endpoint',
      description:
        'Stream request data to a user-defined HTTP endpoint via the JavaScript fetch API.',
      vendor: 'Azion',
      context: 'firewall',
      group: 'Security optimization and access control'
    },
    {
      id: 'recaptcha',
      name: 'reCAPTCHA',
      description:
        'Protect your domains against bots and monitor traffic through the Google reCAPTCHA dashboard.',
      vendor: 'Google',
      icon: 'ai-cor ai-google',
      context: 'firewall',
      group: 'Security optimization and access control'
    },
    {
      id: 'hcaptcha',
      name: 'hCaptcha',
      description:
        'Protect your domains against bots and monitor traffic through the hCaptcha dashboard.',
      vendor: 'hCaptcha',
      context: 'firewall',
      group: 'Security optimization and access control'
    },
    {
      id: 'liveness-detection',
      name: 'Liveness Detection',
      description:
        'Biometric facial recognition that prevents spoofing with photos or videos, powered by Saffe.',
      vendor: 'Saffe',
      context: 'firewall',
      group: 'Security optimization and access control'
    },
    {
      id: 'jwt',
      name: 'JWT',
      description:
        'Grant and revoke privileges using KIDs and secrets, and set token expiration dates.',
      vendor: 'Azion',
      context: 'firewall',
      group: 'Security optimization and access control'
    },
    {
      id: 'secure-token',
      name: 'Secure Token',
      description: 'Make token-based, time-limited URLs to control access to protected content.',
      vendor: 'Azion',
      context: 'firewall',
      group: 'Security optimization and access control'
    },
    {
      id: 'scheduled-blocking',
      name: 'Scheduled Blocking',
      description:
        'Control access to your application based on a time schedule, according to your needs.',
      vendor: 'Azion',
      context: 'firewall',
      group: 'Security optimization and access control'
    },
    {
      id: 'ip-address-reputation',
      name: 'IP Address Reputation',
      description:
        'Score incoming IP addresses using a reputation database provided by IPQualityScore.',
      vendor: 'IPQualityScore',
      context: 'firewall',
      group: 'Security optimization and access control'
    },
    {
      id: 'ipqs-phone-validation',
      name: 'IPQualityScore Phone Validation',
      description:
        'Validate phone numbers at the edge and detect fraudulent activity in real time.',
      vendor: 'IPQualityScore',
      context: 'firewall',
      group: 'Security optimization and access control'
    },
    {
      id: 'ipqs-url-validation',
      name: 'IPQualityScore URL Validation',
      description:
        'Scan URLs for malware, phishing, and suspicious domains in real time at the edge.',
      vendor: 'IPQualityScore',
      context: 'firewall',
      group: 'Security optimization and access control'
    },
    {
      id: 'upstash-rate-limiting',
      name: 'Upstash Rate Limiting',
      description:
        'Control incoming traffic right at the edge to protect your applications from abuse.',
      vendor: 'Upstash',
      context: 'firewall',
      group: 'Security optimization and access control'
    },
    {
      id: 'add-request-id',
      name: 'Add Request ID',
      description: 'Add an HTTP header that assigns a unique identifier to each incoming request.',
      vendor: 'Azion',
      context: 'firewall',
      group: 'Security optimization and access control'
    },
    {
      id: 'method-route-validator',
      name: 'Method and Route Validator',
      description: 'Control access to your application based on the request method and path.',
      vendor: 'Azion',
      context: 'firewall',
      group: 'Security optimization and access control'
    },
    // ── Firewall Functions · Workloads and payloads ──
    {
      id: 'limit-payload-size',
      name: 'Limit Payload Size',
      description: 'Evaluate request data and deny payloads that exceed a predefined limit.',
      vendor: 'Azion',
      context: 'firewall',
      group: 'Workloads and payloads'
    },
    {
      id: 'massive-redirect',
      name: 'Massive Redirect',
      description:
        'Handle a massive quantity of domain redirects, such as during domain migrations.',
      vendor: 'Azion',
      context: 'firewall',
      group: 'Workloads and payloads'
    },
    {
      id: 'process-request-data-headers',
      name: 'Process Request Data Into Headers',
      description:
        'Inspect request body fields and stop a request whenever a required field is empty.',
      vendor: 'Azion',
      context: 'firewall',
      group: 'Workloads and payloads'
    },
    {
      id: 'request-variation-controller',
      name: 'Request Variation Controller',
      description:
        'Track argument variations across requests and block access once a limit is exceeded.',
      vendor: 'Azion',
      context: 'firewall',
      group: 'Workloads and payloads'
    },
    {
      id: 'upstash-waiting-room',
      name: 'Upstash Waiting Room',
      description:
        'Manage traffic surges and prevent overload on your sites with a virtual waiting room.',
      vendor: 'Upstash',
      context: 'firewall',
      group: 'Workloads and payloads'
    }
  ]

  const filteredTemplates = computed(() => {
    const term = templateQuery.value.trim().toLowerCase()
    if (!term) return templates
    return templates.filter((t) => `${t.name} ${t.description}`.toLowerCase().includes(term))
  })

  // Human labels for each execution context; also used as the card's corner Tag.
  const contextLabels = { applications: 'Application', firewall: 'Firewall' }

  // The spotlight row at the top of the panel — a curated few, rendered in the
  // featured card anatomy.
  const featuredIds = new Set(['ab-tests', 'bot-manager-lite', 'recaptcha'])
  const featuredIntegrations = integrations.filter((item) => featuredIds.has(item.id))

  // ── Filters (multiple selection, no label, no checkbox) ──
  // Each filter is a MultiSelect whose trigger reads "Publisher: All" until the
  // user narrows it. Empty = no constraint on that axis.
  // The filter catalog. A card grid narrows by the same membership rule a table does
  // — is this integration's publisher one of these — so it takes the same bar
  // (list/FilterButton.vue) rather than a row of Selects that had to be width-tuned per
  // field. The grid keeps its own search: unlike a table it has no global filter of
  // its own, so the term is matched here across name, vendor and description.
  const integrationFields = [
    {
      id: 'vendor',
      label: 'Publisher',
      kind: 'options',
      options: [...new Set(integrations.map((i) => i.vendor))]
        .sort((a, b) => a.localeCompare(b))
        .map((vendor) => ({ value: vendor, label: vendor })),
      match: (item, values) => values.includes(item.vendor)
    },
    {
      id: 'group',
      label: 'Category',
      kind: 'options',
      options: [...new Set(integrations.map((i) => i.group))].map((group) => ({
        value: group,
        label: group
      })),
      match: (item, values) => values.includes(item.group)
    },
    {
      id: 'context',
      label: 'Context',
      kind: 'options',
      options: Object.entries(contextLabels).map(([value, label]) => ({ value, label })),
      match: (item, values) => values.includes(item.context)
    }
  ]

  const integrationFilters = ref({})

  // Search across name/vendor/description, then run the catalog over what is left.
  const filteredIntegrations = computed(() => {
    const term = integrationQuery.value.trim().toLowerCase()
    const matched = term
      ? integrations.filter((item) =>
          `${item.name} ${item.vendor} ${item.description}`.toLowerCase().includes(term)
        )
      : integrations
    return applyFilters(matched, integrationFields, integrationFilters.value)
  })
  const noIntegrations = computed(() => !filteredIntegrations.value.length)

  const openTemplate = (template) =>
    toast.info(`${template.name} template`, { description: 'Opening the framework template.' })
  const openIntegration = (item) =>
    toast.info(item.name, { description: 'Opening integration details.' })
</script>

<template>
  <AppLayout
    active="marketplace"
    :breadcrumb="[{ label: 'Marketplace' }]"
  >
    <main class="layout-column flex flex-col">
      <PageHeading
        size="medium"
        title="Marketplace"
        description="Find, test, and deploy software that runs anywhere."
        :documentation="HELP"
      />

      <!-- Top-level offerings: Templates | Integrations, centered. -->
      <TabView
        v-model:value="activeTab"
        class="layout-section-start"
      >
        <TabView.List class="justify-center mb-(--spacing-lg)">
          <TabView.Item
            value="templates"
            label="Templates"
          />
          <TabView.Item
            value="integrations"
            label="Integrations"
          />
        </TabView.List>

        <TabView.Content>
          <!-- Templates: pre-built framework starters -->
          <TabView.Panel value="templates">
            <div class="flex flex-col gap-(--spacing-lg)">
              <InputText
                v-model="templateQuery"
                size="medium"
                placeholder="Search templates…"
                aria-label="Search templates"
                class="w-full"
              >
                <template #iconLeft>
                  <i
                    class="pi pi-search"
                    aria-hidden="true"
                  />
                </template>
              </InputText>

              <EmptyState
                v-if="!filteredTemplates.length"
                bordered
                title="No templates found"
                description="No templates match your search. Try a different term."
              />

              <div
                v-else
                class="grid grid-cols-2 gap-(--spacing-md) sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5"
              >
                <TemplateCard
                  v-for="template in filteredTemplates"
                  :key="template.id"
                  :icon="template.icon"
                  :title="template.name"
                  :description="template.description"
                  :color="template.color"
                  @select="openTemplate(template)"
                />
              </div>
            </div>
          </TabView.Panel>

          <!-- Integrations: a featured spotlight row, then a filterable grid -->
          <TabView.Panel value="integrations">
            <div class="flex flex-col">
              <!-- Featured row: the same card in its spotlight anatomy. -->
              <section class="flex flex-col gap-(--layout-group-gap)">
                <p class="text-heading-xxs text-(--text-default)">Featured</p>
                <div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3">
                  <IntegrationCard
                    v-for="item in featuredIntegrations"
                    :key="item.id"
                    featured
                    :title="item.name"
                    :description="item.description"
                    :vendor="item.vendor"
                    :icon="item.icon"
                    :badge="contextLabels[item.context]"
                    @select="openIntegration(item)"
                  />
                </div>
              </section>

              <!-- The Filter button then the search on one row, with the applied chips
                   on a row under them — the same shape every module list opens with.
                   No Refresh or Download CSV beside them: this is a CATALOG of cards,
                   not a table, so there is nothing to re-fetch here and nothing whose
                   columns a CSV could honour. -->
              <div
                class="layout-section-start flex flex-col gap-(--spacing-sm) md:flex-row md:items-center"
              >
                <FilterButton
                  v-model="integrationFilters"
                  :fields="integrationFields"
                />
                <InputText
                  v-model="integrationQuery"
                  size="medium"
                  placeholder="Search integrations…"
                  aria-label="Search integrations"
                  class="w-full md:flex-1"
                >
                  <template #iconLeft>
                    <i
                      class="pi pi-search"
                      aria-hidden="true"
                    />
                  </template>
                </InputText>
              </div>

              <FilterChips
                v-model="integrationFilters"
                :fields="integrationFields"
              />

              <EmptyState
                v-if="noIntegrations"
                class="layout-group-start"
                bordered
                title="No integrations found"
                description="No integrations match your search or filters. Try clearing a filter."
              />

              <div
                v-else
                class="layout-group-start grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3"
              >
                <IntegrationCard
                  v-for="item in filteredIntegrations"
                  :key="item.id"
                  :title="item.name"
                  :description="item.description"
                  :vendor="item.vendor"
                  :icon="item.icon"
                  :badge="contextLabels[item.context]"
                  @select="openIntegration(item)"
                />
              </div>
            </div>
          </TabView.Panel>
        </TabView.Content>
      </TabView>
    </main>
  </AppLayout>
</template>
