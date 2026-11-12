<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import RadioCards from '@aziontech/webkit/radio-cards'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Select from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Stepper from '@aziontech/webkit/stepper'
  import Switch from '@aziontech/webkit/switch'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import type { StepperStepState } from '@aziontech/webkit/stepper-step'
  import { computed, reactive, ref } from 'vue'

  interface WizardStep {
    id: string
    label: string
    description?: string
  }
  interface StepItem {
    value: string
    title: string
    description: string
    state: StepperStepState
    disabled: boolean
  }
  interface Option {
    value: string
    label: string
    description?: string
    disabled?: boolean
  }
  type CachePolicyId = 'images' | 'files-optimization'
  interface CacheField {
    name: string
    label: string
    placeholder: string
    required: boolean
    description: string
  }
  interface CachePolicy {
    value: CachePolicyId
    label: string
    description: string
    fields: CacheField[]
  }
  type OriginType = 'http' | 'storage' | 'live-ingest'
  interface OriginTextField {
    kind: 'text'
    name: string
    label: string
    placeholder: string
    required?: boolean
    description: string
  }
  interface OriginSelectField {
    kind: 'select'
    name: string
    label: string
    options: Option[]
    required?: boolean
    description: string
  }
  type OriginField = OriginTextField | OriginSelectField
  interface PickerInitial {
    chosen?: string
    message?: string
    loading?: boolean
  }
  interface Scratch {
    cache: Record<CachePolicyId, { enabled: boolean; values: Record<string, string> }>
    origin: { enabled: boolean; type: OriginType; values: Record<string, string> }
  }

  const breadcrumb = [{ label: 'Services', href: '/services' }, { label: 'Create Service' }]
  const wizardSteps: WizardStep[] = [
    { id: 'project', label: 'Project' },
    { id: 'binding', label: 'Domain and deployment' }
  ]
  const projectModes = [
    { label: 'Existing project', value: 'existing' },
    { label: 'New project', value: 'new' }
  ]
  const projects: Option[] = [
    { value: 'web-app', label: 'web-app', description: 'Astro · acme/web-app' },
    {
      value: 'black-friday-2025',
      label: 'black-friday-2025',
      description: 'Next.js · acme/black-friday-2025'
    },
    {
      value: 'black-friday-2026',
      label: 'black-friday-2026',
      description: 'Next.js · acme/black-friday-2026'
    },
    { value: 'docs-site', label: 'docs-site', description: 'Astro · acme/docs-site' },
    { value: 'docs-next', label: 'docs-next', description: 'Next.js · acme/docs-next' },
    { value: 'vue-sample', label: 'vue-sample', description: 'Vue · jane-doe/vue-sample' },
    { value: 'hello-world', label: 'hello-world', description: 'JavaScript · ' },
    { value: 'company-site', label: 'company-site', description: 'HTML · acme/company-site' },
    { value: 'company-docs', label: 'company-docs', description: 'HTML · ' },
    { value: 'analytics-pro', label: 'analytics-pro', description: 'Next.js · acme/analytics-pro' },
    { value: 'analytics-api', label: 'analytics-api', description: 'Next.js · ' },
    {
      value: 'react-dashboard',
      label: 'react-dashboard',
      description: 'React · acme/react-dashboard'
    },
    { value: 'docs-portal', label: 'docs-portal', description: 'Vue · ' },
    { value: 'ecommerce-v2', label: 'ecommerce-v2', description: 'Nuxt · shopco/ecommerce-v2' },
    { value: 'ecommerce-storefront', label: 'ecommerce-storefront', description: 'Nuxt · ' },
    {
      value: 'marketing-site',
      label: 'marketing-site',
      description: 'Astro · acme/marketing-site'
    },
    { value: 'blog-platform', label: 'blog-platform', description: 'Astro · ' },
    { value: 'status-page', label: 'status-page', description: 'Svelte · acme/status-page' },
    { value: 'mobile-app', label: 'mobile-app', description: 'Svelte · ' }
  ]
  const cachePolicies: CachePolicy[] = [
    {
      value: 'images',
      label: 'Image caching',
      description:
        'Caches images for a long TTL and ignores the query string, so one object serves every variation of the same file.',
      fields: [
        {
          name: 'extensions',
          label: 'Extension matches',
          placeholder: 'jpg, jpeg, png, gif, webp, avif, svg, ico, bmp, tiff',
          required: true,
          description:
            'Comma-separated. The policy applies to requests whose path ends in one of them.'
        }
      ]
    },
    {
      value: 'files-optimization',
      label: 'File optimization',
      description:
        'Caches static assets and compresses them on the way out. The template carries the TTLs and the cache key.',
      fields: []
    }
  ]
  const originTypes = [
    { value: 'http', label: 'HTTP', description: 'An origin server, reached by host name.' },
    {
      value: 'storage',
      label: 'Storage',
      description: 'A storage location in this workspace, read by name and prefix.'
    },
    {
      value: 'live-ingest',
      label: 'Live Ingest',
      description: 'A region a live stream is ingested from.'
    }
  ]
  const originFieldsByType: Record<OriginType, OriginField[]> = {
    http: [
      {
        kind: 'text',
        name: 'address',
        label: 'Origin address',
        placeholder: 'origin.example.com',
        required: true,
        description: 'The host the project fetches from. No scheme.'
      },
      {
        kind: 'text',
        name: 'path',
        label: 'Path',
        placeholder: '/',
        description: 'Prefixed to the request path before it reaches the origin.'
      },
      {
        kind: 'text',
        name: 'uriPrefix',
        label: 'Apply when $uri starts with',
        placeholder: '/api',
        description: 'Leave it empty to send every request to this origin.'
      }
    ],
    storage: [
      {
        kind: 'select',
        name: 'location',
        label: 'Location',
        options: [
          { value: 'static-assets', label: 'static-assets' },
          { value: 'media-prod', label: 'media-prod' },
          { value: 'user-uploads', label: 'user-uploads' }
        ],
        required: true,
        description: 'A storage location in this workspace.'
      },
      {
        kind: 'text',
        name: 'prefix',
        label: 'Prefix',
        placeholder: 'assets/',
        description: 'The folder inside the location the origin reads from.'
      }
    ],
    'live-ingest': [
      {
        kind: 'select',
        name: 'region',
        label: 'Region',
        options: [
          { value: 'br-east-1', label: 'br-east-1, South America' },
          { value: 'us-east-1', label: 'us-east-1, North America' }
        ],
        required: true,
        description: 'Where the stream is ingested. Select the one closest to the broadcaster.'
      }
    ]
  }
  const domainTypes = [
    { label: 'Free platform domain', value: 'platform' },
    { label: 'Your own domain', value: 'own' }
  ]
  const deploymentModes = [
    { label: 'Create one', value: 'auto' },
    { label: 'Use existing', value: 'existing' }
  ]
  const environments = [
    {
      value: 'Production',
      label: 'Production',
      description: 'Live traffic. One version serves the domain, and deploying replaces it.'
    },
    {
      value: 'Preview',
      label: 'Preview',
      description:
        'Every other branch. Each version keeps its own URL, so a build can be read before it is live.'
    }
  ]
  const certificates: Option[] = [
    { value: 'lets_encrypt', label: 'Let’s Encrypt' },
    { value: 'shared_san', label: 'Shared SAN' },
    { value: 'own', label: 'A certificate you upload' }
  ]
  const tlsVersions: Option[] = [
    { value: 'tls_1_0', label: 'TLS 1.0' },
    { value: 'tls_1_1', label: 'TLS 1.1' },
    { value: 'tls_1_2', label: 'TLS 1.2' },
    { value: 'tls_1_3', label: 'TLS 1.3' }
  ]
  const errorPages: Option[] = [
    { value: 'Rate limited', label: 'Rate limited' },
    { value: 'Blocked by firewall', label: 'Blocked by firewall' },
    { value: 'Branded 404', label: 'Branded 404' },
    { value: 'Server error', label: 'Server error' },
    { value: 'Maintenance window', label: 'Maintenance window' }
  ]
  const deployments: Option[] = [
    {
      value: 'default',
      label: 'Default',
      description:
        'The platform’s own deployment. Versions keep the resource IDs they shipped with.'
    },
    { value: 's1', label: 'shop-storefront', description: 'Storefront traffic for production.' },
    { value: 's2', label: 'acme-storefront', description: 'Acme storefront, production traffic.' },
    {
      value: 's5',
      label: 'analytics-canary',
      description: 'Canary slice of the analytics project.'
    },
    { value: 's6', label: 'auth-service-prod', description: 'Authored in this workspace.' },
    { value: 's7', label: 'marketing-site-prod', description: 'Authored in this workspace.' },
    { value: 's9', label: 'internal-tools-dev', description: 'Authored in this workspace.' },
    { value: 's10', label: 'blog-platform-stage', description: 'Authored in this workspace.' },
    { value: 's11', label: 'web-app-prod', description: 'Production traffic for the web app.' },
    {
      value: 's12',
      label: 'web-app-preview',
      description: 'Per-version preview URLs for the web app.'
    },
    { value: 's13', label: 'web-app-stage', description: 'Stage rehearsals for the web app.' },
    {
      value: 's14',
      label: 'campaign-landing-prod',
      description: 'Production traffic for the seasonal campaign page.'
    },
    {
      value: 's15',
      label: 'campaign-landing-preview',
      description: 'Per-version preview URLs for the seasonal campaign page.'
    },
    {
      value: 's16',
      label: 'docs-site-prod',
      description: 'Production traffic for the documentation site.'
    },
    {
      value: 's17',
      label: 'docs-site-preview',
      description: 'Per-version preview URLs for the documentation site.'
    },
    {
      value: 'ws-1020655',
      label: 'service-01',
      description: 'Created with the service-01 service for Production.'
    },
    {
      value: 'ws-1020655-preview',
      label: 'service-01-preview',
      description: 'Created with the service-01 service for Preview.'
    },
    {
      value: 'ws-1020828',
      label: 'service-02',
      description: 'Created with the service-02 service for Production.'
    },
    {
      value: 'ws-1020828-preview',
      label: 'service-02-preview',
      description: 'Created with the service-02 service for Preview.'
    },
    {
      value: 'ws-1021001',
      label: 'service-03',
      description: 'Created with the service-03 service for Production.'
    },
    {
      value: 'ws-1021001-preview',
      label: 'service-03-preview',
      description: 'Created with the service-03 service for Preview.'
    },
    {
      value: 'ws-1021174',
      label: 'service-04',
      description: 'Created with the service-04 service for Production.'
    },
    {
      value: 'ws-1021174-preview',
      label: 'service-04-preview',
      description: 'Created with the service-04 service for Preview.'
    },
    {
      value: 'ws-1021347',
      label: 'service-05',
      description: 'Created with the service-05 service for Production.'
    },
    {
      value: 'ws-1021347-preview',
      label: 'service-05-preview',
      description: 'Created with the service-05 service for Preview.'
    },
    {
      value: 'ws-1021520',
      label: 'service-06',
      description: 'Created with the service-06 service for Production.'
    },
    {
      value: 'ws-1021520-preview',
      label: 'service-06-preview',
      description: 'Created with the service-06 service for Preview.'
    },
    {
      value: 'ws-1021693',
      label: 'service-07',
      description: 'Created with the service-07 service for Production.'
    },
    {
      value: 'ws-1021693-preview',
      label: 'service-07-preview',
      description: 'Created with the service-07 service for Preview.'
    },
    {
      value: 'ws-1021866',
      label: 'service-08',
      description: 'Created with the service-08 service for Production.'
    },
    {
      value: 'ws-1021866-preview',
      label: 'service-08-preview',
      description: 'Created with the service-08 service for Preview.'
    },
    {
      value: 'ws-1022039',
      label: 'service-09',
      description: 'Created with the service-09 service for Production.'
    },
    {
      value: 'ws-1022039-preview',
      label: 'service-09-preview',
      description: 'Created with the service-09 service for Preview.'
    },
    {
      value: 'ws-1022212',
      label: 'service-10',
      description: 'Created with the service-10 service for Production.'
    },
    {
      value: 'ws-1022212-preview',
      label: 'service-10-preview',
      description: 'Created with the service-10 service for Preview.'
    },
    {
      value: 'ws-1022385',
      label: 'service-11',
      description: 'Created with the service-11 service for Production.'
    },
    {
      value: 'ws-1022385-preview',
      label: 'service-11-preview',
      description: 'Created with the service-11 service for Preview.'
    },
    {
      value: 'ws-1022558',
      label: 'service-12',
      description: 'Created with the service-12 service for Production.'
    },
    {
      value: 'ws-1022558-preview',
      label: 'service-12-preview',
      description: 'Created with the service-12 service for Preview.'
    },
    {
      value: 'ws-1022731',
      label: 'service-13',
      description: 'Created with the service-13 service for Production.'
    },
    {
      value: 'ws-1022731-preview',
      label: 'service-13-preview',
      description: 'Created with the service-13 service for Preview.'
    },
    {
      value: 'ws-1022904',
      label: 'service-14',
      description: 'Created with the service-14 service for Production.'
    },
    {
      value: 'ws-1022904-preview',
      label: 'service-14-preview',
      description: 'Created with the service-14 service for Preview.'
    },
    {
      value: 'ws-1023077',
      label: 'service-15',
      description: 'Created with the service-15 service for Production.'
    },
    {
      value: 'ws-1023077-preview',
      label: 'service-15-preview',
      description: 'Created with the service-15 service for Preview.'
    },
    {
      value: 'ws-1023250',
      label: 'service-16',
      description: 'Created with the service-16 service for Production.'
    },
    {
      value: 'ws-1023250-preview',
      label: 'service-16-preview',
      description: 'Created with the service-16 service for Preview.'
    },
    {
      value: 'ws-1023423',
      label: 'service-17',
      description: 'Created with the service-17 service for Production.'
    },
    {
      value: 'ws-1023423-preview',
      label: 'service-17-preview',
      description: 'Created with the service-17 service for Preview.'
    },
    {
      value: 'ws-1023596',
      label: 'service-18',
      description: 'Created with the service-18 service for Production.'
    },
    {
      value: 'ws-1023596-preview',
      label: 'service-18-preview',
      description: 'Created with the service-18 service for Preview.'
    },
    {
      value: 'ws-1023769',
      label: 'service-19',
      description: 'Created with the service-19 service for Production.'
    },
    {
      value: 'ws-1023769-preview',
      label: 'service-19-preview',
      description: 'Created with the service-19 service for Preview.'
    },
    {
      value: 'ws-1023942',
      label: 'service-20',
      description: 'Created with the service-20 service for Production.'
    },
    {
      value: 'ws-1023942-preview',
      label: 'service-20-preview',
      description: 'Created with the service-20 service for Preview.'
    }
  ]
  const platformDomainSuffix = '.example.com'
  const PAGE_SIZE = 5
  const wireWidths = ['62%', '48%', '70%', '54%', '44%']
  const wireSubWidths = ['84%', '66%', '78%', '58%', '72%']

  const usePicker = (options: Option[], noun: string, initial: PickerInitial = {}) => {
    const query = ref('')
    const chosen = ref(initial.chosen ?? '')
    const message = ref(initial.message ?? '')
    const shown = ref(PAGE_SIZE)
    const loading = ref(initial.loading ?? false)

    const chosenIndex = options.findIndex((option) => option.value === chosen.value)
    if (chosenIndex >= PAGE_SIZE) shown.value = Math.ceil((chosenIndex + 1) / PAGE_SIZE) * PAGE_SIZE

    const paged = computed(() => options.length > PAGE_SIZE)
    const matches = computed(() => {
      const text = query.value.trim().toLowerCase()
      if (!text) return options
      return options.filter(
        (option) =>
          option.label.toLowerCase().includes(text) ||
          String(option.description ?? '')
            .toLowerCase()
            .includes(text)
      )
    })
    const visible = computed(() => matches.value.slice(0, shown.value))
    const remaining = computed(() => Math.max(0, matches.value.length - visible.value.length))
    const nextBatch = computed(() => Math.min(PAGE_SIZE, remaining.value))

    const summary = computed(() => {
      if (loading.value) return 'Loading ' + nextBatch.value + ' more ' + noun + 's'
      if (query.value.trim() && !matches.value.length)
        return 'No ' + noun + ' matches ' + query.value
      if (remaining.value)
        return visible.value.length + ' of ' + matches.value.length + ' ' + noun + 's'
      return query.value.trim()
        ? matches.value.length + ' of ' + options.length + ' ' + noun + 's'
        : options.length + ' ' + noun + 's'
    })

    const loadMore = () => {
      if (loading.value || !remaining.value) return
      loading.value = true
      setTimeout(() => {
        shown.value += PAGE_SIZE
        loading.value = false
      }, 420)
    }

    return reactive({
      query,
      chosen,
      message,
      loading,
      paged,
      matches,
      visible,
      remaining,
      nextBatch,
      summary,
      loadMore
    })
  }

  const stepIndex = ref(0)
  const steps = computed<StepItem[]>(() =>
    wizardSteps.map((entry, position) => ({
      value: entry.id,
      title: entry.label,
      description: entry.description ?? '',
      state: position < stepIndex.value ? 'complete' : 'upcoming',
      disabled: position > stepIndex.value
    }))
  )

  const current = computed({
    get: () => wizardSteps[stepIndex.value].id,
    set: (value: string) => {
      const position = wizardSteps.findIndex((entry) => entry.id === value)
      if (position !== -1 && position < stepIndex.value) stepIndex.value = position
    }
  })

  const goBack = () => {
    if (stepIndex.value > 0) stepIndex.value -= 1
  }

  const projectMode = ref('existing')
  const projectName = ref('')
  const projectPicker = usePicker(projects, 'project', { chosen: '' })
  const deploymentPicker = usePicker(deployments, 'deployment')
  const scratch = reactive<Scratch>({
    cache: {
      images: {
        enabled: false,
        values: { extensions: 'jpg, jpeg, png, gif, webp, avif, svg, ico, bmp, tiff' }
      },
      'files-optimization': { enabled: false, values: {} }
    },
    origin: { enabled: false, type: 'http', values: {} }
  })

  const form = reactive({
    domainType: 'platform',
    domainPrefix: '',
    domainHost: '',
    name: '',
    environment: 'Production',
    certificate: 'shared_san',
    deploymentMode: 'auto',
    minimumTlsVersion: 'tls_1_2',
    errorPage: '',
    allowPlatformDomain: true,
    active: true
  })
  const errors = reactive<Record<string, string>>({})
  const advancedOpen = ref(false)

  const slug = (value: string) =>
    String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '')

  const names = computed(() => {
    const input = slug(form.domainType === 'own' ? form.name : form.domainPrefix)
    return {
      service: input,
      deployment: input ? input + '-deployment' : '',
      domain:
        form.domainType === 'own'
          ? form.domainHost.trim().toLowerCase() || (input ? input + platformDomainSuffix : '')
          : input
            ? input + platformDomainSuffix
            : ''
    }
  })

  const boundName = computed(() =>
    projectMode.value === 'new' ? projectName.value.trim() : projectPicker.chosen
  )

  const projectSummary = computed(() => {
    if (!boundName.value) return 'Not chosen yet. Pick one, or create it with the service.'
    if (projectMode.value !== 'new') {
      return 'Serving its latest ready version. The domain answers with this.'
    }
    return 'Created with the service and built before the release is cut.'
  })

  const originFields = computed(() => originFieldsByType[scratch.origin.type])

  const labelFor = (options: Option[]) => (value: unknown) =>
    options.find((option) => option.value === value)?.label ?? ''

  const validate = () => {
    Object.keys(errors).forEach((key) => delete errors[key])
    projectPicker.message = ''
    deploymentPicker.message = ''
    if (stepIndex.value === 0) {
      if (!boundName.value) {
        projectPicker.message =
          projectMode.value === 'new'
            ? 'Name the project, or select one that already exists.'
            : 'Select the project this service serves, or create a new one.'
      }
      if (projectMode.value === 'new') {
        if (scratch.cache.images.enabled && !scratch.cache.images.values.extensions?.trim()) {
          errors['cache.images.extensions'] = 'This field is required.'
        }
        if (scratch.origin.enabled) {
          for (const field of originFields.value) {
            if (field.required && !String(scratch.origin.values[field.name] ?? '').trim()) {
              errors['origin.' + field.name] = 'This field is required.'
            }
          }
        }
      }
      return !projectPicker.message && Object.keys(errors).length === 0
    }
    if (form.domainType === 'own') {
      if (!form.domainHost.trim())
        errors.domainHost = 'Enter the hostname that points at this service.'
      if (!form.name.trim()) errors.name = 'Name the service.'
    } else if (!form.domainPrefix.trim()) {
      errors.domainPrefix = 'Enter the prefix for the platform domain.'
    }
    if (form.deploymentMode === 'existing' && !deploymentPicker.chosen) {
      deploymentPicker.message = 'Select the deployment the first release lands in.'
    }
    return Object.keys(errors).length === 0 && !deploymentPicker.message
  }

  const advance = () => {
    if (!validate()) return
    if (stepIndex.value < wizardSteps.length - 1) stepIndex.value += 1
  }

  const nextLabel = computed(() =>
    stepIndex.value === wizardSteps.length - 1 ? 'Create and deploy' : 'Next'
  )
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Left>
        <IconButton
          icon="pi pi-chevron-left"
          aria-label="Back to Services"
          kind="outlined"
          size="small"
        />
        <GlobalHeader.Brand>
          <a
            href="/home"
            aria-label="Azion home"
            class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
          >
            <Brand
              kind="default"
              size="small"
            />
          </a>
        </GlobalHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </GlobalHeader.Left>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            label="name@example.com"
            size="medium"
            kind="square"
          />
        </button>
      </GlobalHeader.Right>
    </GlobalHeader>

    <div class="flex min-h-0 flex-1">
      <aside
        class="hidden h-full w-64 shrink-0 overflow-auto border-e border-(--border-default) px-(--spacing-md) py-(--layout-section-gap) md:block"
      >
        <div class="flex h-full">
          <Stepper
            v-model="current"
            aria-label="Create Service"
            class="w-full"
          >
            <Stepper.Step
              v-for="entry in steps"
              :key="entry.value"
              :value="entry.value"
              :title="entry.title"
              :description="entry.value === current ? entry.description : ''"
              :state="entry.state"
              :disabled="entry.disabled"
            />
          </Stepper>
        </div>
      </aside>

      <main
        class="animate-page-enter motion-reduce:animate-none flex min-h-0 min-w-0 flex-1 flex-col"
      >
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-labelledby="create-service-title"
          novalidate
          @submit.prevent="advance"
        >
          <div class="min-h-0 flex-1 overflow-y-auto scrollbar-gutter-both">
            <div class="flex min-h-full flex-col pb-(--layout-section-gap)">
              <div
                class="layout-column-form layout-boundary-inline pb-(--spacing-md) pt-(--spacing-lg)"
              >
                <PageHeader
                  title="Create Service"
                  description="A service is the public entry point: what it serves, and the domain traffic arrives on. The last step provisions both."
                  size="small"
                  title-id="create-service-title"
                />
              </div>

              <p
                class="layout-column-form layout-boundary-inline pb-(--spacing-sm) text-label-sm text-(--text-muted) md:hidden"
              >
                Step {{ Math.min(stepIndex + 1, steps.length) }} of {{ steps.length }}
              </p>

              <fieldset
                class="layout-column-form layout-boundary-inline flex min-w-0 flex-col border-0 p-0 pt-(--layout-section-gap)"
              >
                <legend class="sr-only">Create Service</legend>

                <div class="relative">
                  <div
                    :key="current"
                    class="flex min-w-0 flex-col motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    <div
                      v-if="stepIndex === 0"
                      class="flex min-w-0 flex-col gap-(--layout-section-gap)"
                    >
                      <Card
                        :padded="false"
                        title="Project"
                      >
                        <template #content>
                          <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md) pb-0">
                            <p class="text-body-sm text-(--text-muted)">
                              What this service serves on each environment, so one service can serve
                              different projects on Production and Preview.
                            </p>
                            <ToggleGroup
                              v-model="projectMode"
                              :options="projectModes"
                              size="large"
                              fluid
                              aria-label="Where the project comes from"
                            />

                            <p
                              v-if="projectMode === 'existing'"
                              class="text-body-sm text-(--text-muted)"
                            >
                              The release serves the latest ready version of the selected project,
                              and an older one can be pinned from the deployment.
                            </p>

                            <div
                              v-if="projectMode === 'new'"
                              class="pb-(--spacing-md)"
                            >
                              <Field :required="!!projectPicker.message">
                                <Field.Label>Name</Field.Label>
                                <Input
                                  v-model="projectName"
                                  size="large"
                                  placeholder="my-project"
                                />
                                <Field.Description>{{
                                  projectPicker.message ||
                                  'Lowercase letters, numbers, and hyphens.'
                                }}</Field.Description>
                              </Field>
                            </div>
                          </div>

                          <div
                            v-if="projectMode === 'existing'"
                            class="min-w-0 pt-(--spacing-md)"
                          >
                            <div
                              v-if="projectPicker.paged || projectPicker.message"
                              :data-field-invalid="projectPicker.message || null"
                              class="flex flex-col gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-md)"
                            >
                              <Input
                                v-if="projectPicker.paged"
                                v-model="projectPicker.query"
                                size="large"
                                class="w-full"
                                placeholder="Search projects"
                                aria-label="Search projects"
                              >
                                <template #iconLeft>
                                  <i
                                    class="pi pi-search"
                                    aria-hidden="true"
                                  />
                                </template>
                              </Input>

                              <HelperText
                                v-if="projectPicker.message"
                                kind="required"
                                >{{ projectPicker.message }}</HelperText
                              >
                            </div>

                            <div class="border-t border-(--border-default)">
                              <Item.List>
                                <Item
                                  v-for="option in projectPicker.visible"
                                  :key="option.value"
                                  as-child
                                  size="small"
                                >
                                  <button
                                    type="button"
                                    class="w-full text-start data-[selected]:bg-(--bg-selected)"
                                    :data-selected="option.value === projectPicker.chosen || null"
                                    :aria-pressed="option.value === projectPicker.chosen"
                                    @click="projectPicker.chosen = option.value"
                                  >
                                    <Item.Media>
                                      <span
                                        class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                                      >
                                        <i
                                          class="pi pi-box text-body-md leading-none text-(--text-default)"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    </Item.Media>
                                    <Item.Content>
                                      <Item.Title>{{ option.label }}</Item.Title>
                                      <Item.Description>{{ option.description }}</Item.Description>
                                    </Item.Content>
                                    <Item.Actions>
                                      <i
                                        v-if="option.value === projectPicker.chosen"
                                        class="pi pi-check shrink-0 text-(--text-default)"
                                        aria-hidden="true"
                                      />
                                    </Item.Actions>
                                  </button>
                                </Item>

                                <template v-if="projectPicker.loading">
                                  <Item
                                    v-for="index in projectPicker.nextBatch"
                                    :key="'wire-' + index"
                                    size="small"
                                    aria-hidden="true"
                                  >
                                    <Item.Media>
                                      <Skeleton
                                        kind="shape"
                                        width="2rem"
                                        height="2rem"
                                      />
                                    </Item.Media>
                                    <Item.Content>
                                      <div class="flex flex-col gap-(--spacing-xs)">
                                        <Skeleton
                                          :width="wireWidths[(index - 1) % wireWidths.length]"
                                          height="0.875rem"
                                        />
                                        <Skeleton
                                          :width="wireSubWidths[(index - 1) % wireSubWidths.length]"
                                          height="0.75rem"
                                        />
                                      </div>
                                    </Item.Content>
                                  </Item>
                                </template>
                              </Item.List>

                              <div
                                v-if="projectPicker.remaining"
                                class="border-t border-(--border-default) p-(--spacing-xxs)"
                              >
                                <Button
                                  type="button"
                                  :label="'Load ' + projectPicker.nextBatch + ' more'"
                                  kind="transparent"
                                  size="small"
                                  class="w-full"
                                  :loading="projectPicker.loading"
                                  @click="projectPicker.loadMore"
                                />
                              </div>

                              <p
                                v-if="!projectPicker.matches.length"
                                class="px-(--spacing-md) py-(--spacing-md) text-body-sm text-(--text-muted)"
                              >
                                No project matches “{{ projectPicker.query }}”. Create one instead,
                                or clear the search.
                              </p>

                              <span
                                class="sr-only"
                                role="status"
                                >{{ projectPicker.summary }}</span
                              >
                            </div>
                          </div>
                        </template>
                      </Card>

                      <div
                        v-if="projectMode === 'new'"
                        class="flex min-w-0 flex-col gap-(--layout-section-gap)"
                      >
                        <Card
                          title="Cache Settings"
                          :padded="false"
                        >
                          <template #content>
                            <Item.List>
                              <Item
                                v-for="policy in cachePolicies"
                                :key="policy.value"
                                size="small"
                              >
                                <div class="flex w-full flex-col items-stretch">
                                  <div class="flex w-full items-center gap-(--spacing-md)">
                                    <Item.Content>
                                      <Item.Title>{{ policy.label }}</Item.Title>
                                      <Item.Description>{{ policy.description }}</Item.Description>
                                    </Item.Content>
                                    <Item.Actions>
                                      <Switch
                                        v-model="scratch.cache[policy.value].enabled"
                                        :aria-label="policy.label"
                                      />
                                    </Item.Actions>
                                  </div>

                                  <div
                                    v-if="policy.fields.length"
                                    :data-open="scratch.cache[policy.value].enabled || null"
                                    class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                                  >
                                    <div
                                      class="min-w-0 overflow-hidden"
                                      :inert="!scratch.cache[policy.value].enabled"
                                    >
                                      <div
                                        class="flex flex-col gap-(--spacing-lg) pt-(--spacing-md)"
                                      >
                                        <template
                                          v-for="field in policy.fields"
                                          :key="field.name"
                                        >
                                          <Field
                                            :required="
                                              !!errors['cache.' + policy.value + '.' + field.name]
                                            "
                                          >
                                            <Field.Label>{{ field.label }}</Field.Label>
                                            <Input
                                              v-model="
                                                scratch.cache[policy.value].values[field.name]
                                              "
                                              size="large"
                                              :placeholder="field.placeholder"
                                            />
                                            <Field.Description
                                              v-if="
                                                errors[
                                                  'cache.' + policy.value + '.' + field.name
                                                ] || field.description
                                              "
                                              >{{
                                                errors[
                                                  'cache.' + policy.value + '.' + field.name
                                                ] || field.description
                                              }}</Field.Description
                                            >
                                          </Field>
                                        </template>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Item>
                            </Item.List>
                          </template>
                        </Card>

                        <Card :padded="false">
                          <template #content>
                            <Item.List>
                              <SettingRow
                                title="Add an origin"
                                description="Where the project fetches from when the cache does not already hold the answer. Add one now, or bind one later."
                                kind="compact"
                              >
                                <Switch
                                  v-model="scratch.origin.enabled"
                                  aria-label="Add an origin"
                                />
                              </SettingRow>
                            </Item.List>

                            <div
                              :data-open="scratch.origin.enabled || null"
                              class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                            >
                              <div
                                class="min-w-0 overflow-hidden"
                                :inert="!scratch.origin.enabled"
                              >
                                <div
                                  class="flex flex-col gap-(--spacing-lg) border-t border-(--border-default) p-(--spacing-md)"
                                >
                                  <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                    <p
                                      id="origin-type-label"
                                      class="text-label-sm text-(--text-default)"
                                    >
                                      Type
                                    </p>
                                    <RadioCards
                                      v-model="scratch.origin.type"
                                      :items="originTypes"
                                      aria-labelledby="origin-type-label"
                                      aria-describedby="origin-type-help"
                                    />
                                    <HelperText
                                      id="origin-type-help"
                                      kind="helper"
                                      label="Decides what the origin is addressed by: a host, a storage location, or a region."
                                    />
                                  </div>

                                  <template
                                    v-for="field in originFields"
                                    :key="field.name"
                                  >
                                    <Field
                                      key="field-1"
                                      v-if="field.kind === 'select'"
                                      :data-field-invalid="!!errors['origin.' + field.name] || null"
                                      :required="!!errors['origin.' + field.name]"
                                    >
                                      <div
                                        class="flex min-w-0 items-center justify-between gap-(--spacing-xs)"
                                      >
                                        <Field.Label :for="'origin-' + field.name">{{
                                          field.label
                                        }}</Field.Label>
                                      </div>
                                      <Select
                                        v-model="scratch.origin.values[field.name]"
                                        size="large"
                                        class="w-full"
                                        :display-value="labelFor(field.options)"
                                        :required="!!errors['origin.' + field.name]"
                                        :placeholder="'Select a ' + field.label.toLowerCase()"
                                      >
                                        <Select.Trigger
                                          :id="'origin-' + field.name"
                                          :aria-label="field.label"
                                          :aria-describedby="'origin-' + field.name + '-helper'"
                                        />
                                        <Select.Content>
                                          <Select.Option
                                            v-for="option in field.options"
                                            :key="option.value"
                                            :value="option.value"
                                          >
                                            {{ option.label }}
                                          </Select.Option>
                                        </Select.Content>
                                      </Select>
                                      <HelperText
                                        :id="'origin-' + field.name + '-helper'"
                                        :kind="
                                          errors['origin.' + field.name] ? 'required' : 'helper'
                                        "
                                      >
                                        {{ errors['origin.' + field.name] || field.description }}
                                      </HelperText>
                                    </Field>
                                    <Field
                                      key="field-2"
                                      v-else
                                      :required="!!errors['origin.' + field.name]"
                                    >
                                      <Field.Label>{{ field.label }}</Field.Label>
                                      <Input
                                        v-model="scratch.origin.values[field.name]"
                                        size="large"
                                        :placeholder="field.placeholder"
                                      />
                                      <Field.Description
                                        v-if="errors['origin.' + field.name] || field.description"
                                        >{{
                                          errors['origin.' + field.name] || field.description
                                        }}</Field.Description
                                      >
                                    </Field>
                                  </template>
                                </div>
                              </div>
                            </div>
                          </template>
                        </Card>
                      </div>
                    </div>

                    <template v-else>
                      <div class="mb-(--layout-section-gap)">
                        <Card :padded="false">
                          <template #content>
                            <Item.List>
                              <Item size="small">
                                <Item.Media>
                                  <span
                                    class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                                  >
                                    <i
                                      class="pi pi-box text-body-md leading-none text-(--text-default)"
                                      aria-hidden="true"
                                    />
                                  </span>
                                </Item.Media>
                                <Item.Content>
                                  <Item.Title>{{ boundName || 'No project' }}</Item.Title>
                                  <Item.Description>{{ projectSummary }}</Item.Description>
                                </Item.Content>
                                <Item.Actions>
                                  <Button
                                    type="button"
                                    label="Change"
                                    kind="transparent"
                                    size="small"
                                    @click="stepIndex = 0"
                                  />
                                </Item.Actions>
                              </Item>
                            </Item.List>
                          </template>
                        </Card>
                      </div>

                      <div class="flex min-w-0 flex-col">
                        <Card
                          :padded="false"
                          title="Domain"
                        >
                          <template #content>
                            <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
                              <ToggleGroup
                                v-model="form.domainType"
                                :options="domainTypes"
                                size="large"
                                fluid
                                aria-label="Where the domain comes from"
                              />

                              <Field
                                v-if="form.domainType !== 'own'"
                                :required="!!errors.domainPrefix"
                              >
                                <Field.Label>Domain prefix</Field.Label>
                                <Input
                                  v-model="form.domainPrefix"
                                  size="large"
                                  placeholder="my-first-app"
                                >
                                  <template #iconRight>
                                    <span
                                      class="whitespace-nowrap text-label-sm text-(--text-muted)"
                                      aria-hidden="true"
                                    >
                                      {{ platformDomainSuffix }}
                                    </span>
                                  </template>
                                </Input>
                                <Field.Description>{{
                                  errors.domainPrefix ||
                                  'Lowercase letters, numbers and hyphens. Anything else is folded into a hyphen. It also names the service and its deployment.'
                                }}</Field.Description>
                              </Field>

                              <template v-else>
                                <Field :required="!!errors.domainHost">
                                  <Field.Label>Domain</Field.Label>
                                  <Input
                                    v-model="form.domainHost"
                                    size="large"
                                    placeholder="www.example.com"
                                  />
                                  <Field.Description>{{
                                    errors.domainHost ||
                                    'A full hostname, like www.example.com. Add its DNS record once the service exists. The run does not wait on it.'
                                  }}</Field.Description>
                                </Field>

                                <Field :required="!!errors.name">
                                  <Field.Label>Name</Field.Label>
                                  <Input
                                    v-model="form.name"
                                    size="large"
                                    placeholder="my-first-app"
                                  />
                                  <Field.Description>{{
                                    errors.name ||
                                    'Lowercase letters, numbers and hyphens. It also names the deployment created for it.'
                                  }}</Field.Description>
                                </Field>
                              </template>
                            </div>

                            <div
                              class="flex flex-col gap-(--spacing-xs) border-t border-(--border-default) p-(--spacing-md)"
                            >
                              <p class="text-label-sm text-(--text-default)">Traffic arrives on</p>
                              <div
                                :data-empty="!names.domain || null"
                                class="flex min-h-10 min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-sm) data-[empty]:border-dashed"
                              >
                                <i
                                  class="pi pi-globe shrink-0 text-(--text-muted)"
                                  aria-hidden="true"
                                />
                                <span
                                  v-if="names.domain"
                                  class="min-w-0 truncate text-label-sm text-(--text-default)"
                                >
                                  https://{{ names.domain }}
                                </span>
                                <span
                                  v-else
                                  class="text-label-sm text-(--text-muted)"
                                >
                                  {{
                                    form.domainType !== 'own'
                                      ? 'Type a prefix to see the domain.'
                                      : 'Type a hostname to see the address.'
                                  }}
                                </span>
                              </div>
                              <p class="text-label-sm text-(--text-muted)">
                                The service is created as
                                <span class="text-(--text-default)">{{
                                  names.service || 'unnamed'
                                }}</span
                                >. Add more domains to it once it exists.
                              </p>
                            </div>
                          </template>
                        </Card>

                        <div class="mt-(--layout-section-gap)">
                          <Card title="Environment and certificate">
                            <template #content>
                              <div class="flex flex-col gap-(--spacing-lg)">
                                <fieldset
                                  class="m-0 flex w-full min-w-0 flex-col gap-(--spacing-xs) border-0 p-0"
                                >
                                  <Field.Legend
                                    id="environment-label"
                                    kind="label"
                                  >
                                    <span class="inline-flex items-center gap-(--spacing-xxs)">
                                      Environment
                                      <Hint text="Which environment this binding lands on." />
                                    </span>
                                  </Field.Legend>
                                  <RadioCards
                                    v-model="form.environment"
                                    :items="environments"
                                    aria-labelledby="environment-label"
                                    aria-describedby="environment-helper"
                                  />
                                  <HelperText
                                    id="environment-helper"
                                    kind="helper"
                                  >
                                    The domain answers on the environment it is bound to.
                                  </HelperText>
                                </fieldset>

                                <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
                                  <Field>
                                    <div
                                      class="flex min-w-0 items-center justify-between gap-(--spacing-xs)"
                                    >
                                      <Field.Label
                                        for="certificate"
                                        hint="One certificate per service, not per domain on it."
                                        >Certificate</Field.Label
                                      >
                                    </div>
                                    <Select
                                      v-model="form.certificate"
                                      size="large"
                                      class="w-full"
                                      :display-value="labelFor(certificates)"
                                    >
                                      <Select.Trigger
                                        id="certificate"
                                        aria-label="Certificate"
                                      />
                                      <Select.Content>
                                        <Select.Option
                                          v-for="option in certificates"
                                          :key="option.value"
                                          :value="option.value"
                                        >
                                          {{ option.label }}
                                        </Select.Option>
                                      </Select.Content>
                                    </Select>
                                  </Field>
                                </div>
                              </div>
                            </template>
                          </Card>
                        </div>

                        <div class="mt-(--layout-section-gap)">
                          <Card
                            :padded="false"
                            title="Deployment"
                          >
                            <template #content>
                              <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md) pb-0">
                                <p class="text-body-sm text-(--text-muted)">
                                  The deployment settings the first release is cut against: what it
                                  binds, and how versions are promoted into it.
                                </p>

                                <ToggleGroup
                                  v-model="form.deploymentMode"
                                  :options="deploymentModes"
                                  size="large"
                                  fluid
                                  aria-label="Where the deployment comes from"
                                />
                              </div>

                              <div
                                v-if="form.deploymentMode !== 'existing'"
                                class="mt-(--spacing-md) border-t border-(--border-default) p-(--spacing-md)"
                              >
                                <Item.List>
                                  <Item size="small">
                                    <Item.Media>
                                      <span
                                        class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                                      >
                                        <i
                                          class="pi pi-cloud-upload text-body-md leading-none text-(--text-default)"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    </Item.Media>
                                    <Item.Content>
                                      <Item.Title>{{
                                        names.deployment || 'Named from the domain'
                                      }}</Item.Title>
                                      <Item.Description>
                                        Created with the service, on the default settings. Change
                                        them from Deployments once it exists.
                                      </Item.Description>
                                    </Item.Content>
                                  </Item>
                                </Item.List>
                              </div>

                              <div
                                v-else
                                class="min-w-0 pt-(--spacing-md)"
                              >
                                <div
                                  v-if="deploymentPicker.paged || deploymentPicker.message"
                                  :data-field-invalid="deploymentPicker.message || null"
                                  class="flex flex-col gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-md)"
                                >
                                  <Input
                                    v-if="deploymentPicker.paged"
                                    v-model="deploymentPicker.query"
                                    size="large"
                                    class="w-full"
                                    placeholder="Search deployments"
                                    aria-label="Search deployments"
                                  >
                                    <template #iconLeft>
                                      <i
                                        class="pi pi-search"
                                        aria-hidden="true"
                                      />
                                    </template>
                                  </Input>

                                  <HelperText
                                    v-if="deploymentPicker.message"
                                    kind="required"
                                    >{{ deploymentPicker.message }}</HelperText
                                  >
                                </div>

                                <div class="border-t border-(--border-default)">
                                  <Item.List>
                                    <Item
                                      v-for="option in deploymentPicker.visible"
                                      :key="option.value"
                                      as-child
                                      size="small"
                                    >
                                      <button
                                        type="button"
                                        class="w-full text-start data-[selected]:bg-(--bg-selected)"
                                        :data-selected="
                                          option.value === deploymentPicker.chosen || null
                                        "
                                        :aria-pressed="option.value === deploymentPicker.chosen"
                                        @click="deploymentPicker.chosen = option.value"
                                      >
                                        <Item.Media>
                                          <span
                                            class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                                          >
                                            <i
                                              class="pi pi-cloud-upload text-body-md leading-none text-(--text-default)"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        </Item.Media>
                                        <Item.Content>
                                          <Item.Title>{{ option.label }}</Item.Title>
                                          <Item.Description>{{
                                            option.description
                                          }}</Item.Description>
                                        </Item.Content>
                                        <Item.Actions>
                                          <i
                                            v-if="option.value === deploymentPicker.chosen"
                                            class="pi pi-check shrink-0 text-(--text-default)"
                                            aria-hidden="true"
                                          />
                                        </Item.Actions>
                                      </button>
                                    </Item>

                                    <template v-if="deploymentPicker.loading">
                                      <Item
                                        v-for="index in deploymentPicker.nextBatch"
                                        :key="'wire-' + index"
                                        size="small"
                                        aria-hidden="true"
                                      >
                                        <Item.Media>
                                          <Skeleton
                                            kind="shape"
                                            width="2rem"
                                            height="2rem"
                                          />
                                        </Item.Media>
                                        <Item.Content>
                                          <div class="flex flex-col gap-(--spacing-xs)">
                                            <Skeleton
                                              :width="wireWidths[(index - 1) % wireWidths.length]"
                                              height="0.875rem"
                                            />
                                            <Skeleton
                                              :width="
                                                wireSubWidths[(index - 1) % wireSubWidths.length]
                                              "
                                              height="0.75rem"
                                            />
                                          </div>
                                        </Item.Content>
                                      </Item>
                                    </template>
                                  </Item.List>

                                  <div
                                    v-if="deploymentPicker.remaining"
                                    class="border-t border-(--border-default) p-(--spacing-xxs)"
                                  >
                                    <Button
                                      type="button"
                                      :label="'Load ' + deploymentPicker.nextBatch + ' more'"
                                      kind="transparent"
                                      size="small"
                                      class="w-full"
                                      :loading="deploymentPicker.loading"
                                      @click="deploymentPicker.loadMore"
                                    />
                                  </div>

                                  <p
                                    v-if="!deploymentPicker.matches.length"
                                    class="px-(--spacing-md) py-(--spacing-md) text-body-sm text-(--text-muted)"
                                  >
                                    No deployment matches “{{ deploymentPicker.query }}”. Create one
                                    instead, or clear the search.
                                  </p>

                                  <span
                                    class="sr-only"
                                    role="status"
                                    >{{ deploymentPicker.summary }}</span
                                  >
                                </div>
                              </div>
                            </template>
                          </Card>
                        </div>

                        <SettingsSection
                          title="Advanced"
                          hint="Every field here already carries the endpoint's own default, and all of them can be changed once the service exists."
                          v-model:open="advancedOpen"
                          icon="pi pi-cog"
                          collapsible
                        >
                          <Card :padded="false">
                            <template #content>
                              <div class="p-(--spacing-md)">
                                <Field>
                                  <div
                                    class="flex min-w-0 items-center justify-between gap-(--spacing-xs)"
                                  >
                                    <Field.Label
                                      for="minimum-tls-version"
                                      hint="Connections negotiating below this version are refused."
                                      >Minimum TLS version</Field.Label
                                    >
                                  </div>
                                  <Select
                                    v-model="form.minimumTlsVersion"
                                    size="large"
                                    class="w-full"
                                    :display-value="labelFor(tlsVersions)"
                                  >
                                    <Select.Trigger
                                      id="minimum-tls-version"
                                      aria-label="Minimum TLS version"
                                    />
                                    <Select.Content>
                                      <Select.Option
                                        v-for="option in tlsVersions"
                                        :key="option.value"
                                        :value="option.value"
                                      >
                                        {{ option.label }}
                                      </Select.Option>
                                    </Select.Content>
                                  </Select>
                                </Field>
                              </div>

                              <div class="border-t border-(--border-default) p-(--spacing-md)">
                                <Field>
                                  <Field.Label>Error page</Field.Label>
                                  <Select
                                    v-model="form.errorPage"
                                    size="large"
                                    placeholder="Not bound"
                                  >
                                    <Select.Trigger />
                                    <Select.Content>
                                      <Select.Option
                                        v-for="option in errorPages"
                                        :key="String(option.value)"
                                        :value="option.value"
                                        :disabled="option.disabled"
                                      >
                                        {{ option.label }}
                                      </Select.Option>
                                    </Select.Content>
                                  </Select>
                                  <Field.Description
                                    >Optional. Without one, the service falls back to the default
                                    pages.</Field.Description
                                  >
                                </Field>
                              </div>

                              <h3
                                class="border-t border-(--border-default) px-(--spacing-md) pb-(--spacing-xs) pt-(--spacing-md) text-label-sm text-(--text-muted)"
                              >
                                Behavior
                              </h3>
                              <Item.List>
                                <SettingRow
                                  title="Allow the platform domain"
                                  kind="compact"
                                >
                                  <template #description>
                                    Serve traffic on the provisioned
                                    {{
                                      names.service
                                        ? names.service + platformDomainSuffix
                                        : 'platform domain'
                                    }}
                                    alongside your own. Turn it off once your own domain answers
                                    instead.
                                  </template>
                                  <Switch
                                    v-model="form.allowPlatformDomain"
                                    aria-label="Allow the platform domain"
                                  />
                                </SettingRow>
                                <SettingRow
                                  title="Active"
                                  description="When disabled, the service is created but does not serve traffic."
                                  kind="compact"
                                >
                                  <Switch
                                    v-model="form.active"
                                    aria-label="Active"
                                  />
                                </SettingRow>
                              </Item.List>
                            </template>
                          </Card>
                        </SettingsSection>
                      </div>
                    </template>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>

          <SaveBar
            v-if="stepIndex > 0 || nextLabel"
            kind="fade"
          >
            <template
              v-if="stepIndex > 0"
              #leading
            >
              <Button
                type="button"
                label="Back"
                kind="outlined"
                size="medium"
                @click="goBack"
              />
            </template>
            <template #actions>
              <Button
                v-if="nextLabel"
                :label="nextLabel"
                kind="primary"
                size="medium"
                type="submit"
              />
            </template>
          </SaveBar>
        </form>
      </main>
    </div>
  </div>
</template>
