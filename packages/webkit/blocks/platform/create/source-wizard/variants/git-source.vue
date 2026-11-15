<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import InputGroup from '@aziontech/webkit/input-group'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Select from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Stepper, { type StepperStepState } from '@aziontech/webkit/stepper'
  import Switch from '@aziontech/webkit/switch'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'

  type MethodId = 'git' | 'cli' | 'template'
  type StepId = 'where' | 'method' | 'source' | 'repository' | 'configure' | 'install'

  interface ServiceOption {
    value: string
    label: string
    description: string
  }

  interface Option {
    value: string
    label: string
    description?: string
  }

  interface Repository {
    name: string
    age: string
    icon: string
  }

  interface TemplateSetting {
    name: string
    label: string
    placeholder: string
    description: string
    required?: boolean
  }

  interface Template {
    value: string
    title: string
    description: string
    icon: string
    group: string
    kind: string
    useCase: string
    featured?: boolean
    build?: boolean
    settings?: TemplateSetting[]
  }

  interface WizardStepEntry {
    id: StepId
    label: string
    description?: string
  }

  interface WizardStep {
    value: string
    title: string
    description: string
    state: StepperStepState
    disabled: boolean
  }

  interface Command {
    field: 'buildCommand' | 'deployCommand'
    label: string
    fallback: string
    empty: string
    description: string
  }

  const initial = {
    step: 2,
    service: 'service-01',
    method: 'git' as MethodId | '',
    gitConnected: true,
    repository: '',
    template: '',
    connectFailed: false,
    reposFailed: false
  }

  const breadcrumb = [{ label: 'Projects', href: '/projects' }, { label: 'Create Project' }]
  const whereStep: WizardStepEntry = {
    id: 'where',
    label: 'Where it runs',
    description: 'Select or create a Service.'
  }
  const methodStep: WizardStepEntry = { id: 'method', label: 'Select a method' }
  const services: ServiceOption[] = [
    { value: 'service-01', label: 'service-01', description: 'service-01.example.com' },
    { value: 'service-02', label: 'service-02', description: 'service-02.example.com' },
    { value: 'service-03', label: 'service-03', description: 'service-03.example.com' },
    { value: 'service-04', label: 'service-04', description: 'service-04.example.com' },
    { value: 'service-05', label: 'service-05', description: 'service-05.example.com' },
    { value: 'service-06', label: 'service-06', description: 'service-06.example.com' },
    { value: 'service-07', label: 'service-07', description: 'service-07.example.com' },
    { value: 'service-08', label: 'service-08', description: 'service-08.example.com' },
    { value: 'service-09', label: 'service-09', description: 'service-09.example.com' },
    { value: 'service-10', label: 'service-10', description: 'service-10.example.com' },
    { value: 'service-11', label: 'service-11', description: 'service-11.example.com' },
    { value: 'service-12', label: 'service-12', description: 'service-12.example.com' },
    { value: 'service-13', label: 'service-13', description: 'service-13.example.com' },
    { value: 'service-14', label: 'service-14', description: 'service-14.example.com' },
    { value: 'service-15', label: 'service-15', description: 'service-15.example.com' },
    { value: 'service-16', label: 'service-16', description: 'service-16.example.com' },
    { value: 'service-17', label: 'service-17', description: 'service-17.example.com' },
    { value: 'service-18', label: 'service-18', description: 'service-18.example.com' },
    { value: 'service-19', label: 'service-19', description: 'service-19.example.com' },
    { value: 'service-20', label: 'service-20', description: 'service-20.example.com' },
    { value: 'web-prod', label: 'web-prod', description: 'www.example.com' },
    { value: 'web-eu-prod', label: 'web-eu-prod', description: 'eu.example.com' },
    { value: 'stage-preview', label: 'stage-preview', description: '*-preview.example.com' },
    { value: 'campaign-landing', label: 'campaign-landing', description: 'campaign.example.com' },
    { value: 'docs-prod', label: 'docs-prod', description: 'docs.example.com' }
  ]
  const methods: { id: MethodId; icon: string; title: string; description: string }[] = [
    {
      id: 'git',
      icon: 'ai ai-github',
      title: 'Import from Git',
      description:
        'Deploy from a repository you already have. Connect the Git account that owns it and select the repository to import.'
    },
    {
      id: 'cli',
      icon: 'pi pi-code',
      title: 'Sync with the CLI',
      description:
        'Create the project now and push to it from your own terminal. The CLI links the local folder, builds it with your framework preset, and keeps its config file in sync. No repository required.'
    },
    {
      id: 'template',
      icon: 'pi pi-objects-column',
      title: 'Start from a template',
      description:
        'Clone a framework starter already wired to build and deploy. Next, Astro, Vue, Nuxt, and more.'
    }
  ]
  const ADD_ACCOUNT = 'add-account'
  const repositories: Repository[] = [
    { name: 'next-js-boilerplate', age: '2 hours ago', icon: 'ai-cor ai-next' },
    { name: 'docs-site', age: '5 hours ago', icon: 'ai-cor ai-astro' },
    { name: 'functions-playground', age: 'yesterday', icon: 'ai-cor ai-vue' },
    { name: 'storefront-checkout', age: '3 days ago', icon: 'ai-cor ai-react' },
    { name: 'observability-dashboard', age: '6 days ago', icon: 'ai-cor ai-svelte' },
    { name: 'marketing-landing', age: '2 weeks ago', icon: 'ai-cor ai-nuxt' },
    { name: 'internal-admin', age: 'last month', icon: 'ai-cor ai-angular' }
  ]
  const originSettings: TemplateSetting[] = [
    {
      name: 'originAddress',
      label: 'Origin address',
      placeholder: 'origin.example.com',
      description: 'The host requests are forwarded to. A hostname or an IP address.',
      required: true
    },
    {
      name: 'hostHeader',
      label: 'Host header',
      placeholder: '${host}',
      description: 'Sent to the origin on every request. Leave the default to pass yours through.'
    }
  ]
  const templates: Template[] = [
    {
      value: 'origin-proxy',
      title: 'Origin Proxy',
      description:
        'Front an origin you already run. The service receives the traffic and passes it on.',
      icon: 'pi pi-arrow-right-arrow-left',
      group: 'Official',
      kind: 'Integration',
      useCase: 'Content delivery',
      settings: originSettings
    },
    {
      value: 'static-cache',
      title: 'Static Cache',
      description: 'Cache what an origin returns and serve it close to your visitors.',
      icon: 'pi pi-bolt',
      group: 'Official',
      kind: 'Integration',
      useCase: 'Content delivery',
      settings: [originSettings[0]]
    },
    {
      value: 'functions-starter',
      title: 'Functions Starter',
      description: 'A function that answers requests, with a local dev server and tests.',
      icon: 'pi pi-code',
      group: 'Official',
      kind: 'Framework',
      useCase: 'Content delivery',
      build: true
    },
    {
      value: 'ai-chatbot',
      title: 'AI Chatbot',
      description: 'A streaming chat interface backed by the model you configure.',
      icon: 'ai-cor ai-next',
      group: 'Official',
      kind: 'Framework',
      useCase: 'AI and agents',
      build: true
    },
    {
      value: 'nextjs-commerce',
      title: 'Next.js Commerce',
      description: 'A storefront with product pages, a cart and checkout.',
      icon: 'ai-cor ai-next',
      group: 'Official',
      kind: 'Framework',
      useCase: 'Ecommerce',
      build: true
    },
    {
      value: 'astro-blog',
      title: 'Astro Blog',
      description: 'A blog with Markdown posts, tags and an RSS feed.',
      icon: 'ai-cor ai-astro',
      group: 'Community',
      kind: 'Framework',
      useCase: 'Blog',
      build: true
    },
    {
      value: 'eleventy-landing',
      title: 'Eleventy Landing Page',
      description: 'A one-page marketing site with a signup form.',
      icon: 'ai ai-eleventy',
      group: 'Community',
      kind: 'Framework',
      useCase: 'Marketing sites',
      build: true
    },
    {
      value: 'next',
      title: 'Next.js',
      description: 'A React framework with server rendering and static export.',
      icon: 'ai-cor ai-next',
      group: 'Frameworks',
      kind: 'Framework',
      useCase: 'Marketing sites',
      featured: true,
      build: true
    },
    {
      value: 'astro',
      title: 'Astro',
      description: 'Content sites that ship little JavaScript.',
      icon: 'ai-cor ai-astro',
      group: 'Frameworks',
      kind: 'Framework',
      useCase: 'Blog',
      featured: true,
      build: true
    },
    {
      value: 'vue',
      title: 'Vue',
      description: 'A Vite app with Vue 3 and the router.',
      icon: 'ai-cor ai-vue',
      group: 'Frameworks',
      kind: 'Framework',
      useCase: 'Marketing sites',
      featured: true,
      build: true
    },
    {
      value: 'nuxt',
      title: 'Nuxt',
      description: 'A Vue framework with file routing and server rendering.',
      icon: 'ai-cor ai-nuxt',
      group: 'Frameworks',
      kind: 'Framework',
      useCase: 'Ecommerce',
      build: true
    },
    {
      value: 'svelte',
      title: 'SvelteKit',
      description: 'A Svelte app with routing, loaders and form actions.',
      icon: 'ai-cor ai-svelte',
      group: 'Frameworks',
      kind: 'Framework',
      useCase: 'Marketing sites',
      build: true
    },
    {
      value: 'html',
      title: 'HTML',
      description: 'Plain HTML, CSS and JavaScript with no build step.',
      icon: 'ai-cor ai-html',
      group: 'Frameworks',
      kind: 'Framework',
      useCase: 'Marketing sites'
    }
  ]
  const templateGroups = ['Official', 'Community', 'Frameworks']
  const templateProperties = [
    {
      key: 'kind',
      label: 'Type',
      options: [{ value: 'Integration' }, { value: 'Framework' }]
    },
    {
      key: 'useCase',
      label: 'Use case',
      options: [
        { value: 'AI and agents' },
        { value: 'Blog' },
        { value: 'Content delivery' },
        { value: 'Ecommerce' },
        { value: 'Marketing sites' }
      ]
    }
  ]
  const repoModes = [
    { label: 'New repository', value: 'new' },
    { label: 'Existing repository', value: 'existing' }
  ]
  const environments: Option[] = [
    {
      value: 'Production',
      label: 'Production',
      description: 'Production publishes each ready version as it lands.'
    },
    {
      value: 'Preview',
      label: 'Preview',
      description: 'Preview publishes every version for review before it reaches Production.'
    }
  ]
  const certificates: Option[] = [
    { value: '', label: 'Platform certificate' },
    { value: 'wildcard-example', label: '*.example.com' },
    { value: 'own', label: 'A certificate you upload' }
  ]
  const commands: Command[] = [
    {
      field: 'buildCommand',
      label: 'Build command',
      fallback: 'npm run build',
      empty: 'No build step',
      description: 'Produces the bundle. Leave it empty for a site that needs no build.'
    },
    {
      field: 'deployCommand',
      label: 'Deploy command',
      fallback: 'npx deploy',
      empty: 'Not set',
      description: 'Runs after the build to deploy the bundle.'
    }
  ]
  const firewallModes = [
    { label: 'Existing firewall', value: 'existing' },
    { label: 'New firewall', value: 'new' }
  ]
  const firewalls: Option[] = [
    { value: 'production-firewall', label: 'production-firewall', description: '12 rules · WAF' },
    { value: 'api-firewall', label: 'api-firewall', description: '4 rules · Rate limiting' },
    { value: 'docs-firewall', label: 'docs-firewall', description: '1 rule · Bot Manager' }
  ]
  const firewallModules = [
    {
      key: 'ddos',
      title: 'DDoS Protection',
      description: 'Absorbs volumetric attacks at the network layer. Always on.',
      locked: true
    },
    {
      key: 'waf',
      title: 'WAF',
      description: 'Inspects each request and blocks the OWASP Top 10 attack classes.'
    },
    {
      key: 'networkShield',
      title: 'Network Shield',
      description: 'Blocks traffic by country, ASN or IP range using network lists.'
    },
    {
      key: 'botManager',
      title: 'Bot Manager',
      description: 'Scores automated traffic and challenges the requests that fail.'
    }
  ]
  const projectModules = [
    {
      key: 'accelerator',
      title: 'Application Accelerator',
      description: 'Optimize protocols and manage dynamic content delivery.'
    },
    { key: 'cache', title: 'Cache', description: 'Customize advanced cache settings.' },
    {
      key: 'functions',
      title: 'Functions',
      description: 'Run functions next to the project, before the origin.'
    },
    {
      key: 'imageProcessor',
      title: 'Image Processor',
      description: 'Enable dynamic image editing options.'
    }
  ]
  const behaviors = [
    {
      key: 'active',
      title: 'Active',
      description: 'When disabled, the project is created but does not serve traffic.'
    },
    { key: 'debug', title: 'Debug', description: 'Expose the executed rules in the response.' }
  ] as const
  const VISIBLE = 6
  const repoWireWidths = ['42%', '56%', '36%', '50%', '46%']

  const stepIndex = ref(initial.step)
  const method = ref<MethodId | ''>(initial.method)
  const templateValue = ref(initial.template)
  const template = computed(() => templates.find((entry) => entry.value === templateValue.value))
  const isIntegration = computed(() => template.value?.kind === 'Integration')

  const wizardSteps = computed<WizardStepEntry[]>(() => {
    if (method.value === 'git') {
      return [
        whereStep,
        methodStep,
        { id: 'source', label: 'Select a repository' },
        { id: 'configure', label: 'Create and deploy' }
      ]
    }
    if (method.value === 'cli') {
      return [whereStep, methodStep, { id: 'configure', label: 'Configure and create' }]
    }
    if (method.value === 'template') {
      const rest: WizardStepEntry[] = isIntegration.value
        ? [{ id: 'install', label: 'Review and add' }]
        : [
            { id: 'repository', label: 'Connect a repository' },
            { id: 'configure', label: 'Create and deploy' }
          ]
      return [whereStep, methodStep, { id: 'source', label: 'Select a template' }, ...rest]
    }
    return [
      whereStep,
      methodStep,
      { id: 'source', label: 'Select a source' },
      { id: 'configure', label: 'Create and deploy' }
    ]
  })
  const step = computed<StepId>(() => wizardSteps.value[stepIndex.value]?.id ?? 'where')
  const isLastStep = computed(() => stepIndex.value === wizardSteps.value.length - 1)

  const steps = computed(() =>
    wizardSteps.value.map((entry, position): WizardStep => ({
      value: entry.id,
      title: entry.label,
      description: entry.description ?? '',
      state: position < stepIndex.value ? 'complete' : 'upcoming',
      disabled: position > stepIndex.value
    }))
  )

  const current = computed({
    get: () => step.value as string,
    set: (value: string) => {
      const position = wizardSteps.value.findIndex((entry) => entry.id === value)
      if (position !== -1 && position < stepIndex.value) stepIndex.value = position
    }
  })

  const errors = reactive<Record<string, string>>({})
  const clearErrors = () => Object.keys(errors).forEach((key) => delete errors[key])

  const goBack = () => {
    clearErrors()
    if (stepIndex.value > 0) stepIndex.value -= 1
  }

  const goTo = (id: StepId) => {
    const position = wizardSteps.value.findIndex((entry) => entry.id === id)
    if (position !== -1) {
      clearErrors()
      stepIndex.value = position
    }
  }

  const service = ref(initial.service)
  const whereAnswered = ref(initial.step > 0)
  const query = ref('')
  const creating = ref(false)
  const newName = ref('')
  const nameField = ref<InstanceType<typeof Input> | null>(null)

  const matches = computed(() => {
    const term = query.value.trim().toLowerCase()
    if (!term) return services
    return services.filter((option) =>
      [option.label, option.description].some((field) => field.toLowerCase().includes(term))
    )
  })
  const visible = computed(() => {
    const head = matches.value.slice(0, VISIBLE)
    if (!service.value || head.some((option) => option.value === service.value)) return head
    const picked = matches.value.find((option) => option.value === service.value)
    return picked ? [picked, ...head.slice(0, VISIBLE - 1)] : head
  })
  const hidden = computed(() => Math.max(0, matches.value.length - visible.value.length))

  const answerWhere = () => {
    whereAnswered.value = true
    stepIndex.value = 1
  }

  const choose = (option: ServiceOption) => {
    service.value = option.value
    answerWhere()
  }

  const skip = () => {
    service.value = ''
    answerWhere()
  }

  const startCreating = () => {
    newName.value = query.value.trim()
    creating.value = true
    nextTick(() => nameField.value?.focus())
  }

  const cancelCreating = () => {
    creating.value = false
    newName.value = ''
  }

  const confirmCreating = () => {
    const name = newName.value.trim()
    if (!name) return
    creating.value = false
    service.value = name
    answerWhere()
  }

  const onSearchEnter = () => {
    if (matches.value.length) {
      choose(matches.value[0])
      return
    }
    startCreating()
  }

  const chooseMethod = (id: MethodId) => {
    method.value = id
    clearErrors()
    stepIndex.value = 2
  }

  const gitConnected = ref(initial.gitConnected)
  const connecting = ref(false)
  const reposLoading = ref(false)
  const accounts = ref<Option[]>([{ value: 'acme', label: 'acme' }])
  const connectFailed = ref(initial.connectFailed)
  const reposFailed = ref(initial.reposFailed)
  const REPO_PAGE = 5
  const repoLimit = ref(REPO_PAGE)
  const account = ref('acme')
  const repoQuery = ref('')
  const chosenRepo = ref(initial.repository)
  let connectTimer: ReturnType<typeof setTimeout> | undefined
  let reposTimer: ReturnType<typeof setTimeout> | undefined

  const loadRepos = () => {
    reposLoading.value = true
    reposFailed.value = false
    repoLimit.value = REPO_PAGE
    clearTimeout(reposTimer)
    reposTimer = setTimeout(() => {
      reposLoading.value = false
    }, 900)
  }

  const connect = () => {
    if (connecting.value) return
    connecting.value = true
    connectFailed.value = false
    connectTimer = setTimeout(() => {
      connecting.value = false
      gitConnected.value = true
      loadRepos()
    }, 1200)
  }

  const selectAccount = (value: string) => {
    if (value === ADD_ACCOUNT) {
      const next = 'github-account-' + accounts.value.length
      accounts.value = [...accounts.value, { value: next, label: next }]
      account.value = next
    } else {
      if (value === account.value) return
      account.value = value
    }
    existingRepo.value = ''
    loadRepos()
  }

  const accountLabel = (value: string) =>
    accounts.value.find((option) => option.value === value)?.label ?? ''

  const accountRepositories = computed(() => (account.value === 'acme' ? repositories : []))

  const repoMatches = computed(() => {
    const term = repoQuery.value.trim().toLowerCase()
    if (!term) return accountRepositories.value
    return accountRepositories.value.filter((repo) => repo.name.toLowerCase().includes(term))
  })

  const shownRepos = computed(() => repoMatches.value.slice(0, repoLimit.value))
  const hiddenRepoCount = computed(() => repoMatches.value.length - shownRepos.value.length)

  const showMoreRepos = () => {
    repoLimit.value += REPO_PAGE
  }

  const startFromTemplate = () => {
    chooseMethod('template')
  }

  const repoSummary = computed(() => {
    if (reposLoading.value) return 'Loading repositories'
    if (reposFailed.value) return 'Repositories did not load'
    if (!accountRepositories.value.length)
      return 'No repositories in ' + accountLabel(account.value)
    if (!repoMatches.value.length) return 'No repository matches ' + repoQuery.value.trim()
    return repoMatches.value.length + ' repositories'
  })

  const chooseRepo = (repo: Repository) => {
    chosenRepo.value = repo.name
    goTo('configure')
  }

  const {
    items: templateMatches,
    propertyFilterProps,
    status: templateStatus,
    clearFilters
  } = useCollection({
    items: templates,
    filtering: { fields: ['title', 'description'] },
    propertyFiltering: { properties: templateProperties }
  })

  const groupedTemplates = computed(() =>
    templateGroups
      .map((group) => ({
        group,
        rows: templateMatches.value.filter((entry) => entry.group === group)
      }))
      .filter((entry) => entry.rows.length)
  )

  const chooseTemplate = (entry: Template) => {
    templateValue.value = entry.value
    if (!repoName.value || repoName.value === previousDefault) repoName.value = entry.value
    previousDefault = entry.value
    stepIndex.value = 3
  }

  const repoMode = ref('new')
  const repoName = ref(initial.template)
  let previousDefault = initial.template
  const repoPublic = ref(true)
  const existingRepo = ref('')

  const form = reactive({
    name: initial.repository || initial.template,
    domainHost: '',
    domainEnvironment: '',
    domainCertificate: '',
    buildCommand: commands[0].fallback,
    deployCommand: commands[1].fallback,
    settings: {} as Record<string, string>,
    modules: { accelerator: false, cache: true, functions: true, imageProcessor: false } as Record<
      string,
      boolean
    >,
    active: true,
    debug: false
  })
  const advancedOpen = ref(false)

  watch(chosenRepo, (next) => {
    if (next) form.name = next
  })
  watch(templateValue, (next) => {
    if (next) form.name = next
  })

  const host = computed(() => form.domainHost.trim().toLowerCase())
  const environmentLabel = (value: string) =>
    environments.find((option) => option.value === value)?.label ?? ''
  const certificateLabel = (value: string) =>
    certificates.find((option) => option.value === value)?.label ?? ''
  const environmentHint = computed(
    () =>
      environments.find((option) => option.value === form.domainEnvironment)?.description ??
      'Where this domain answers. An environment decides which version serves it.'
  )

  const needsBuild = computed(() =>
    method.value === 'template' ? Boolean(template.value?.build) : method.value === 'git'
  )
  const isEdited = (command: Command) => form[command.field].trim() !== command.fallback
  const resetCommand = (command: Command) => {
    form[command.field] = command.fallback
  }

  const protection = reactive({
    enabled: false,
    mode: 'existing',
    firewall: '',
    name: '',
    modules: { waf: true, networkShield: false, botManager: false } as Record<string, boolean>
  })

  watch(
    () => [protection.enabled, protection.mode],
    () => {
      if (protection.enabled && protection.mode === 'new' && !protection.name && form.name) {
        protection.name = form.name + '-firewall'
      }
    }
  )

  const sourceSummary = computed(() => {
    if (method.value === 'git') {
      return {
        icon: repositories.find((repo) => repo.name === chosenRepo.value)?.icon ?? 'ai ai-github',
        title: chosenRepo.value,
        description: 'Imported from ' + account.value + '/' + chosenRepo.value + '.',
        change: 'source' as StepId
      }
    }
    if (method.value === 'cli') {
      return {
        icon: 'pi pi-code',
        title: 'Local project',
        description: 'Linked by the CLI on your first deploy. No repository required.',
        change: 'method' as StepId
      }
    }
    return {
      icon: template.value?.icon ?? 'pi pi-objects-column',
      title: template.value?.title ?? '',
      description: template.value?.description ?? '',
      change: 'source' as StepId
    }
  })

  const serviceName = computed(() => service.value || 'the service')

  const preview = computed(() => {
    const origin = (form.settings['originAddress'] ?? '').trim()
    const header = (form.settings['hostHeader'] ?? '').trim()
    const prefix = service.value || 'project'
    const behaviorsAdded = ['Set origin', ...(header ? ['Add request header'] : []), 'Deliver']
    if (templateValue.value === 'static-cache') {
      behaviorsAdded.splice(1, 0, 'Set cache policy')
    }
    return {
      origin: { name: prefix + '-origin', address: origin || 'not set yet' },
      cachePolicy: templateValue.value === 'static-cache' ? prefix + ' cache' : '',
      rule: {
        name: templateValue.value === 'static-cache' ? 'Cache every path' : 'Proxy every path',
        description: 'Fetches every request through the ' + prefix + '-origin origin.'
      },
      behaviors: behaviorsAdded
    }
  })

  const validate = () => {
    clearErrors()
    if (step.value === 'repository') {
      const name = repoMode.value === 'new' ? repoName.value.trim() : existingRepo.value
      if (!name) {
        errors['repository'] =
          repoMode.value === 'existing'
            ? 'Select a repository, or create a new one.'
            : 'This field is required.'
      }
    }
    if (step.value === 'configure') {
      if (!form.name.trim()) errors['name'] = 'This field is required.'
      if (host.value && !form.domainEnvironment) {
        errors['domainEnvironment'] = 'Select the environment this domain answers in.'
      }
      if (protection.enabled) {
        if (protection.mode === 'new' && !protection.name.trim()) {
          errors['firewall'] = 'Name the firewall, or bind one that already exists.'
        }
        if (protection.mode === 'existing' && !protection.firewall) {
          errors['firewall'] = 'Select the firewall to bind, or create a new one.'
        }
      }
    }
    if (step.value === 'install') {
      for (const setting of template.value?.settings ?? []) {
        if (setting.required && !(form.settings[setting.name] ?? '').trim()) {
          errors[setting.name] = 'This field is required.'
        }
      }
    }
    return Object.keys(errors).length === 0
  }

  const nextLabel = computed(() => {
    if (step.value === 'where') return whereAnswered.value ? 'Next' : ''
    if (step.value === 'method' || step.value === 'source') return ''
    if (step.value === 'install') return service.value ? 'Add to ' + service.value : 'Add template'
    if (!isLastStep.value) return 'Next'
    return method.value === 'cli' ? 'Create Project' : 'Create and deploy'
  })

  const advance = () => {
    if (step.value === 'where') {
      if (whereAnswered.value) stepIndex.value = 1
      return
    }
    if (!validate()) return
    if (!isLastStep.value) stepIndex.value += 1
  }

  onBeforeUnmount(() => {
    clearTimeout(connectTimer)
    clearTimeout(reposTimer)
  })
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Start>
        <IconButton
          icon="pi pi-chevron-left"
          aria-label="Back to Projects"
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
      </GlobalHeader.Start>
      <GlobalHeader.Center />
      <GlobalHeader.End>
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
      </GlobalHeader.End>
    </GlobalHeader>

    <div class="flex min-h-0 flex-1">
      <aside
        class="hidden h-full w-64 shrink-0 overflow-auto border-e border-(--border-default) px-(--spacing-md) py-(--layout-section-gap) md:block"
      >
        <div class="flex h-full">
          <Stepper
            v-model="current"
            aria-label="Create Project"
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
          aria-labelledby="create-project-title"
          novalidate
          @submit.prevent="advance"
        >
          <div class="min-h-0 flex-1 overflow-y-auto scrollbar-gutter-both">
            <div class="flex min-h-full flex-col pb-(--layout-section-gap)">
              <div
                v-if="step !== 'where'"
                class="layout-column-form layout-boundary-inline pb-(--spacing-md) pt-(--spacing-lg)"
              >
                <PageHeader
                  title="Create Project"
                  description="A project is the code the platform runs, and the configuration it runs with. Select where the code comes from and name it. The last step creates it and deploys it to the service you selected."
                  size="small"
                  title-id="create-project-title"
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
                <legend class="sr-only">Create Project</legend>

                <div class="relative">
                  <div
                    :key="current"
                    class="flex min-w-0 flex-col motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    <section
                      v-if="step === 'where'"
                      class="mx-auto flex w-full max-w-(--container-md) flex-col items-center gap-(--spacing-lg)"
                      aria-labelledby="create-project-host-title"
                    >
                      <header class="flex flex-col items-center gap-(--spacing-xs) text-center">
                        <span
                          class="flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                        >
                          <i
                            class="pi pi-box text-body-lg leading-none text-(--text-default)"
                            aria-hidden="true"
                          />
                        </span>
                        <h1
                          id="create-project-host-title"
                          class="text-heading-xs text-(--text-default)"
                        >
                          Create Project
                        </h1>
                        <p class="text-body-sm text-(--text-muted)">Select a service to continue</p>
                      </header>

                      <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                        <Input
                          v-model="query"
                          size="large"
                          class="w-full"
                          placeholder="Search services"
                          aria-label="Search services"
                          autocomplete="off"
                          @keydown.enter.prevent="onSearchEnter"
                        />

                        <div
                          v-if="creating"
                          class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
                        >
                          <Field>
                            <Field.Label>New service</Field.Label>
                            <Input
                              ref="nameField"
                              v-model="newName"
                              size="large"
                              placeholder="my-service"
                              @keydown.enter.prevent="confirmCreating"
                            />
                          </Field>
                          <div class="flex items-center justify-end gap-(--spacing-sm)">
                            <Button
                              type="button"
                              label="Back"
                              kind="transparent"
                              size="medium"
                              @click="cancelCreating"
                            />
                            <Button
                              type="button"
                              label="Continue"
                              kind="primary"
                              size="medium"
                              :disabled="!newName.trim()"
                              @click="confirmCreating"
                            />
                          </div>
                        </div>

                        <div
                          v-else
                          class="flex flex-col"
                        >
                          <Item
                            v-for="option in visible"
                            :key="option.value"
                            size="small"
                            clickable
                            :aria-pressed="service === option.value"
                            @click="choose(option)"
                          >
                            <Item.Media>
                              <i
                                class="pi pi-server text-body-md leading-none text-(--text-muted)"
                                aria-hidden="true"
                              />
                            </Item.Media>
                            <Item.Content>
                              <Item.Title>{{ option.label }}</Item.Title>
                            </Item.Content>
                            <Item.Actions>
                              <i
                                v-if="service === option.value"
                                class="pi pi-check text-body-sm leading-none text-(--text-default)"
                                aria-hidden="true"
                              />
                            </Item.Actions>
                          </Item>

                          <p
                            v-if="hidden"
                            class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
                          >
                            {{ hidden }} more. Type to narrow the list.
                          </p>
                          <p
                            v-else-if="!matches.length"
                            class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
                          >
                            No service matches “{{ query.trim() }}”.
                          </p>

                          <Item
                            size="small"
                            clickable
                            @click="startCreating"
                          >
                            <Item.Media>
                              <i
                                class="pi pi-plus text-body-sm leading-none text-(--text-muted)"
                                aria-hidden="true"
                              />
                            </Item.Media>
                            <Item.Content>
                              <Item.Title>Create Service</Item.Title>
                            </Item.Content>
                          </Item>
                        </div>
                      </div>

                      <div class="flex flex-col items-center gap-(--spacing-xxs)">
                        <Button
                          type="button"
                          label="Continue without a service"
                          kind="transparent"
                          size="small"
                          @click="skip"
                        />
                      </div>
                    </section>

                    <Card
                      key="card-1"
                      v-else-if="step === 'method'"
                      :padded="false"
                      title="How do you want to start?"
                    >
                      <template #content>
                        <Item.List>
                          <Item
                            v-for="entry in methods"
                            :key="entry.id"
                            size="small"
                            clickable
                            :aria-pressed="method === entry.id"
                            @click="chooseMethod(entry.id)"
                          >
                            <Item.Media>
                              <span
                                class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                              >
                                <i
                                  :class="entry.icon"
                                  class="text-body-md leading-none text-(--text-default)"
                                  aria-hidden="true"
                                />
                              </span>
                            </Item.Media>
                            <Item.Content>
                              <Item.Title>{{ entry.title }}</Item.Title>
                              <Item.Description>{{ entry.description }}</Item.Description>
                            </Item.Content>
                            <Item.Actions>
                              <i
                                class="pi pi-chevron-right text-(--text-muted)"
                                aria-hidden="true"
                              />
                            </Item.Actions>
                          </Item>
                        </Item.List>
                      </template>
                    </Card>

                    <Card
                      key="card-2"
                      v-else-if="step === 'source' && method === 'git' && !gitConnected"
                      title="Repository"
                    >
                      <template #content>
                        <EmptyState
                          icon="ai ai-github"
                          size="medium"
                          title="Connect a Git account"
                          description="The platform imports the repository you select and deploys every push to it. Authorize once. The account stays available for the projects you create later."
                          bordered
                        >
                          <template #actions>
                            <Button
                              type="button"
                              label="Connect GitHub"
                              icon="ai ai-github"
                              kind="secondary"
                              size="large"
                              :loading="connecting"
                              @click="connect"
                            />
                            <Alert
                              v-if="connectFailed"
                              severity="danger"
                              size="small"
                              label="GitHub didn't connect. The authorization window closed before GitHub answered."
                              class="w-full"
                            />
                          </template>
                        </EmptyState>
                      </template>
                    </Card>

                    <Card
                      key="card-3"
                      v-else-if="step === 'source' && method === 'git'"
                      :padded="false"
                      title="Repository"
                    >
                      <template #content>
                        <div
                          class="flex flex-col gap-(--spacing-sm) border-b border-(--border-default) p-(--spacing-md) sm:flex-row"
                        >
                          <div class="shrink-0 sm:w-(--container-3xs)">
                            <Select
                              :model-value="account"
                              size="large"
                              class="w-full"
                              :display-value="accountLabel"
                              @update:model-value="selectAccount"
                            >
                              <Select.Trigger aria-label="Git account">
                                <template #prefix>
                                  <i
                                    class="ai ai-github shrink-0 text-body-md leading-none text-(--text-default)"
                                    aria-hidden="true"
                                  />
                                </template>
                              </Select.Trigger>
                              <Select.Content>
                                <Select.Option
                                  v-for="option in accounts"
                                  :key="option.value"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </Select.Option>
                                <Select.Option
                                  :value="ADD_ACCOUNT"
                                  icon="pi pi-plus-circle"
                                >
                                  Add GitHub account
                                </Select.Option>
                              </Select.Content>
                            </Select>
                          </div>

                          <Input
                            v-model="repoQuery"
                            size="large"
                            class="w-full flex-1"
                            placeholder="Search repositories"
                            aria-label="Search repositories"
                            autocomplete="off"
                          >
                            <template #prefix>
                              <i
                                class="pi pi-search"
                                aria-hidden="true"
                              />
                            </template>
                          </Input>
                        </div>

                        <div class="max-h-(--size-80) overflow-y-auto overscroll-contain">
                          <div
                            v-if="reposFailed"
                            class="p-(--spacing-md)"
                          >
                            <Alert
                              severity="danger"
                              :label="`The repositories in ${accountLabel(account)} didn't load. GitHub didn't answer in time.`"
                              action-label="Retry"
                              @action="loadRepos"
                            />
                          </div>
                          <Item.List
                            key="item.list-1"
                            v-else-if="reposLoading"
                            aria-busy="true"
                          >
                            <Item
                              v-for="index in 5"
                              :key="'repo-wire-' + index"
                              size="small"
                              aria-hidden="true"
                            >
                              <Item.Media>
                                <Skeleton
                                  kind="rectangle"
                                  width="2rem"
                                  height="2rem"
                                />
                              </Item.Media>
                              <Item.Content>
                                <div class="flex flex-col gap-(--spacing-xs)">
                                  <Skeleton
                                    :width="repoWireWidths[index - 1]"
                                    height="0.875rem"
                                  />
                                  <Skeleton
                                    width="25%"
                                    height="0.75rem"
                                  />
                                </div>
                              </Item.Content>
                            </Item>
                          </Item.List>

                          <div v-else-if="repoMatches.length">
                            <Item.List key="item.list-2">
                              <Item
                                v-for="repo in shownRepos"
                                :key="repo.name"
                                size="small"
                                clickable
                                :aria-pressed="repo.name === chosenRepo"
                                @click="chooseRepo(repo)"
                              >
                                <Item.Media>
                                  <span
                                    class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                                  >
                                    <i
                                      :class="repo.icon"
                                      class="text-body-md leading-none text-(--text-default)"
                                      aria-hidden="true"
                                    />
                                  </span>
                                </Item.Media>
                                <Item.Content>
                                  <Item.Title>{{ repo.name }}</Item.Title>
                                  <Item.Description>Updated {{ repo.age }}</Item.Description>
                                </Item.Content>
                                <Item.Actions>
                                  <i
                                    v-if="repo.name === chosenRepo"
                                    class="pi pi-check shrink-0 text-(--text-default)"
                                    aria-hidden="true"
                                  />
                                  <i
                                    v-else
                                    class="pi pi-chevron-right text-(--text-muted)"
                                    aria-hidden="true"
                                  />
                                </Item.Actions>
                              </Item>
                            </Item.List>
                            <div
                              v-if="hiddenRepoCount > 0"
                              class="flex justify-center border-t border-(--border-muted) p-(--spacing-sm)"
                            >
                              <Button
                                type="button"
                                :label="`Load more (${hiddenRepoCount})`"
                                kind="transparent"
                                size="small"
                                @click="showMoreRepos"
                              />
                            </div>
                          </div>

                          <EmptyState
                            v-else-if="!accountRepositories.length"
                            key="repos-empty"
                            size="small"
                            icon="ai ai-github"
                            :title="`No repositories in ${accountLabel(account)}`"
                            description="Push a repository to this account, select another account, or start from a template."
                          >
                            <template #actions>
                              <Button
                                type="button"
                                label="Start from a template"
                                kind="outlined"
                                size="small"
                                @click="startFromTemplate"
                              />
                            </template>
                          </EmptyState>
                          <EmptyState
                            v-else
                            key="repos-no-match"
                            size="small"
                            icon="pi pi-search"
                            title="No repositories match"
                            :description="`Nothing in ${accountLabel(account)} is named like “${repoQuery.trim()}”.`"
                          >
                            <template #actions>
                              <Button
                                type="button"
                                label="Clear search"
                                kind="outlined"
                                size="small"
                                @click="repoQuery = ''"
                              />
                            </template>
                          </EmptyState>
                        </div>

                        <span
                          class="sr-only"
                          role="status"
                          >{{ repoSummary }}</span
                        >
                      </template>
                    </Card>

                    <Card
                      key="card-4"
                      v-else-if="step === 'source'"
                      :padded="false"
                      title="Select a template"
                    >
                      <template #content>
                        <div class="border-b border-(--border-default) p-(--spacing-md)">
                          <PropertyFilter
                            v-bind="propertyFilterProps"
                            placeholder="Search templates"
                            aria-label="Search templates"
                          />
                        </div>

                        <div class="max-h-(--container-sm) overflow-y-auto overscroll-contain">
                          <template v-if="templateStatus !== 'no-match'">
                            <section
                              v-for="entry in groupedTemplates"
                              :key="entry.group"
                              :aria-labelledby="'template-group-' + entry.group"
                            >
                              <h3
                                :id="'template-group-' + entry.group"
                                class="sticky top-0 z-1 border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-sm) text-label-sm text-(--text-muted)"
                              >
                                {{ entry.group }}
                              </h3>

                              <Item.List>
                                <Item
                                  v-for="row in entry.rows"
                                  :key="row.value"
                                  size="small"
                                  clickable
                                  :aria-pressed="row.value === templateValue"
                                  @click="chooseTemplate(row)"
                                >
                                  <Item.Media>
                                    <span
                                      class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                                    >
                                      <i
                                        :class="row.icon"
                                        class="text-body-md leading-none text-(--text-default)"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  </Item.Media>
                                  <Item.Content>
                                    <Item.Title>{{ row.title }}</Item.Title>
                                    <Item.Description>{{ row.description }}</Item.Description>
                                  </Item.Content>
                                  <Item.Actions>
                                    <Tag
                                      v-if="row.featured"
                                      label="Featured"
                                      severity="info"
                                      size="small"
                                    />
                                    <i
                                      v-if="row.value === templateValue"
                                      class="pi pi-check shrink-0 text-(--text-default)"
                                      aria-hidden="true"
                                    />
                                    <i
                                      v-else
                                      class="pi pi-chevron-right text-(--text-muted)"
                                      aria-hidden="true"
                                    />
                                  </Item.Actions>
                                </Item>
                              </Item.List>
                            </section>
                          </template>

                          <EmptyState
                            v-else
                            size="small"
                            icon="pi pi-search"
                            title="No templates match"
                            description="Nothing matches this search and these filters."
                          >
                            <template #actions>
                              <Button
                                type="button"
                                label="Clear filters"
                                kind="outlined"
                                size="small"
                                @click="clearFilters"
                              />
                            </template>
                          </EmptyState>
                        </div>
                      </template>
                    </Card>

                    <Card
                      key="card-5"
                      v-else-if="step === 'repository' && !gitConnected"
                      title="Repository"
                    >
                      <template #content>
                        <EmptyState
                          icon="ai ai-github"
                          size="medium"
                          title="Connect a Git account"
                          :description="
                            'The platform copies ' +
                            (template?.title ?? 'the template') +
                            ' into a repository you own and deploys every push to it. Authorize once. The account stays available for the projects you create later.'
                          "
                          bordered
                        >
                          <template #actions>
                            <Button
                              type="button"
                              label="Connect GitHub"
                              icon="ai ai-github"
                              kind="secondary"
                              size="large"
                              :loading="connecting"
                              @click="connect"
                            />
                            <Alert
                              v-if="connectFailed"
                              severity="danger"
                              size="small"
                              label="GitHub didn't connect. The authorization window closed before GitHub answered."
                              class="w-full"
                            />
                          </template>
                        </EmptyState>
                      </template>
                    </Card>

                    <Card
                      key="card-6"
                      v-else-if="step === 'repository'"
                      :padded="false"
                      title="Repository"
                    >
                      <template #content>
                        <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
                          <ToggleGroup
                            v-model="repoMode"
                            :options="repoModes"
                            size="large"
                            fluid
                            aria-label="Where the template is cloned"
                          />

                          <Field>
                            <Field.Label
                              for="repository-account"
                              hint="The GitHub account or organization the platform works in."
                              >Account</Field.Label
                            >
                            <Select
                              :model-value="account"
                              size="large"
                              class="w-full"
                              :display-value="accountLabel"
                              @update:model-value="selectAccount"
                            >
                              <Select.Trigger
                                id="repository-account"
                                aria-label="Account"
                              >
                                <template #prefix>
                                  <i
                                    class="ai ai-github shrink-0 text-body-md leading-none text-(--text-default)"
                                    aria-hidden="true"
                                  />
                                </template>
                              </Select.Trigger>
                              <Select.Content>
                                <Select.Option
                                  v-for="option in accounts"
                                  :key="option.value"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </Select.Option>
                                <Select.Option
                                  :value="ADD_ACCOUNT"
                                  icon="pi pi-plus-circle"
                                >
                                  Add GitHub account
                                </Select.Option>
                              </Select.Content>
                            </Select>
                            <Field.Description
                              >Adding one authorizes it and switches to it.</Field.Description
                            >
                          </Field>

                          <Field
                            v-if="repoMode === 'new'"
                            :required="!!errors['repository']"
                          >
                            <Field.Label for="repository-name">Repository name</Field.Label>
                            <InputGroup size="large">
                              <InputGroup.Input
                                id="repository-name"
                                v-model="repoName"
                                placeholder="my-repository"
                                :required="!!errors['repository']"
                              />
                              <InputGroup.Addon>
                                <Tooltip text="Make the repository public or private.">
                                  <Switch
                                    v-model="repoPublic"
                                    kind="privacy"
                                    :aria-label="
                                      repoPublic
                                        ? 'Repository is public. Make it private.'
                                        : 'Repository is private. Make it public.'
                                    "
                                  />
                                </Tooltip>
                              </InputGroup.Addon>
                            </InputGroup>
                            <Field.Description>{{
                              errors['repository'] ||
                              'Created in the account you select. Lowercase letters, numbers, and hyphens.'
                            }}</Field.Description>
                          </Field>

                          <div
                            v-else
                            :data-field-invalid="errors['repository'] || null"
                            class="flex flex-col gap-(--spacing-xs)"
                          >
                            <Input
                              v-model="repoQuery"
                              size="large"
                              class="w-full"
                              placeholder="Search repositories"
                              aria-label="Search repositories"
                              autocomplete="off"
                            >
                              <template #prefix>
                                <i
                                  class="pi pi-search"
                                  aria-hidden="true"
                                />
                              </template>
                            </Input>
                            <HelperText
                              v-if="errors['repository']"
                              kind="required"
                              >{{ errors['repository'] }}</HelperText
                            >
                          </div>
                        </div>

                        <div
                          v-if="repoMode === 'existing'"
                          class="max-h-(--size-80) overflow-y-auto overscroll-contain border-t border-(--border-default)"
                        >
                          <div
                            v-if="reposFailed"
                            class="p-(--spacing-md)"
                          >
                            <Alert
                              severity="danger"
                              :label="`The repositories in ${accountLabel(account)} didn't load. GitHub didn't answer in time.`"
                              action-label="Retry"
                              @action="loadRepos"
                            />
                          </div>
                          <Item.List
                            key="item.list-1"
                            v-else-if="reposLoading"
                            aria-busy="true"
                          >
                            <Item
                              v-for="index in 4"
                              :key="'existing-wire-' + index"
                              size="small"
                              aria-hidden="true"
                            >
                              <Item.Media>
                                <Skeleton
                                  kind="rectangle"
                                  width="2rem"
                                  height="2rem"
                                />
                              </Item.Media>
                              <Item.Content>
                                <div class="flex flex-col gap-(--spacing-xs)">
                                  <Skeleton
                                    :width="repoWireWidths[index - 1]"
                                    height="0.875rem"
                                  />
                                  <Skeleton
                                    width="25%"
                                    height="0.75rem"
                                  />
                                </div>
                              </Item.Content>
                            </Item>
                          </Item.List>

                          <div v-else-if="repoMatches.length">
                            <Item.List key="item.list-2">
                              <Item
                                v-for="repo in shownRepos"
                                :key="repo.name"
                                size="small"
                                clickable
                                :aria-pressed="repo.name === existingRepo"
                                @click="existingRepo = repo.name"
                              >
                                <Item.Media>
                                  <span
                                    class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                                  >
                                    <i
                                      :class="repo.icon"
                                      class="text-body-md leading-none text-(--text-default)"
                                      aria-hidden="true"
                                    />
                                  </span>
                                </Item.Media>
                                <Item.Content>
                                  <Item.Title>{{ repo.name }}</Item.Title>
                                  <Item.Description>Updated {{ repo.age }}</Item.Description>
                                </Item.Content>
                                <Item.Actions>
                                  <i
                                    v-if="repo.name === existingRepo"
                                    class="pi pi-check shrink-0 text-(--text-default)"
                                    aria-hidden="true"
                                  />
                                </Item.Actions>
                              </Item>
                            </Item.List>
                            <div
                              v-if="hiddenRepoCount > 0"
                              class="flex justify-center border-t border-(--border-muted) p-(--spacing-sm)"
                            >
                              <Button
                                type="button"
                                :label="`Load more (${hiddenRepoCount})`"
                                kind="transparent"
                                size="small"
                                @click="showMoreRepos"
                              />
                            </div>
                          </div>

                          <EmptyState
                            v-else-if="!accountRepositories.length"
                            key="repos-empty"
                            size="small"
                            icon="ai ai-github"
                            :title="`No repositories in ${accountLabel(account)}`"
                            description="Push a repository to this account, select another account, or start from a template."
                          >
                            <template #actions>
                              <Button
                                type="button"
                                label="Start from a template"
                                kind="outlined"
                                size="small"
                                @click="startFromTemplate"
                              />
                            </template>
                          </EmptyState>
                          <EmptyState
                            v-else
                            key="repos-no-match"
                            size="small"
                            icon="pi pi-search"
                            title="No repositories match"
                            :description="`Nothing in ${accountLabel(account)} is named like “${repoQuery.trim()}”.`"
                          >
                            <template #actions>
                              <Button
                                type="button"
                                label="Clear search"
                                kind="outlined"
                                size="small"
                                @click="repoQuery = ''"
                              />
                            </template>
                          </EmptyState>
                        </div>
                      </template>
                    </Card>

                    <div
                      v-else
                      class="flex min-w-0 flex-col gap-(--layout-section-gap)"
                    >
                      <Card :padded="false">
                        <template #content>
                          <Item.List>
                            <Item size="small">
                              <Item.Media>
                                <span
                                  class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                                >
                                  <i
                                    :class="sourceSummary.icon"
                                    class="text-body-md leading-none text-(--text-default)"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Item.Media>
                              <Item.Content>
                                <Item.Title>{{ sourceSummary.title }}</Item.Title>
                                <Item.Description>{{ sourceSummary.description }}</Item.Description>
                              </Item.Content>
                              <Item.Actions>
                                <Button
                                  type="button"
                                  label="Change"
                                  kind="transparent"
                                  size="small"
                                  @click="goTo(sourceSummary.change)"
                                />
                              </Item.Actions>
                            </Item>
                            <Item
                              v-if="method === 'template' && !isIntegration"
                              size="small"
                            >
                              <Item.Media>
                                <span
                                  class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                                >
                                  <i
                                    class="ai ai-github text-body-md leading-none text-(--text-default)"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Item.Media>
                              <Item.Content>
                                <Item.Title
                                  >{{ account }}/{{
                                    repoMode === 'new' ? repoName : existingRepo
                                  }}</Item.Title
                                >
                                <Item.Description>{{
                                  repoMode === 'new'
                                    ? 'A new ' +
                                      (repoPublic ? 'public' : 'private') +
                                      ' repository, created from the template.'
                                    : 'An existing repository of yours, deployed as it is.'
                                }}</Item.Description>
                              </Item.Content>
                              <Item.Actions>
                                <Button
                                  type="button"
                                  label="Change"
                                  kind="transparent"
                                  size="small"
                                  @click="goTo('repository')"
                                />
                              </Item.Actions>
                            </Item>
                          </Item.List>
                        </template>
                      </Card>

                      <template v-if="step === 'install'">
                        <Card
                          :padded="false"
                          :title="'Configure ' + (template?.title ?? 'the template')"
                        >
                          <template #content>
                            <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
                              <Field
                                v-for="setting in template?.settings ?? []"
                                :key="setting.name"
                                :required="!!errors[setting.name]"
                              >
                                <Field.Label :for="'setting-' + setting.name">{{
                                  setting.label
                                }}</Field.Label>
                                <Input
                                  :id="'setting-' + setting.name"
                                  v-model="form.settings[setting.name]"
                                  size="large"
                                  :placeholder="setting.placeholder"
                                />
                                <Field.Description>{{
                                  errors[setting.name] || setting.description
                                }}</Field.Description>
                              </Field>
                            </div>
                          </template>
                        </Card>

                        <Card
                          :padded="false"
                          title="What gets added"
                        >
                          <template #content>
                            <p
                              class="border-b border-(--border-default) p-(--spacing-md) text-body-sm text-(--text-muted)"
                            >
                              These land on {{ serviceName }}. The rule opens in its rules for you
                              to save.
                            </p>

                            <div
                              class="flex flex-col gap-(--spacing-sm) border-b border-(--border-default) p-(--spacing-md)"
                            >
                              <p class="text-label-sm text-(--text-default)">Records</p>
                              <div class="flex flex-col gap-(--spacing-xxs)">
                                <p class="text-body-sm text-(--text-muted)">
                                  Origin
                                  <span class="text-(--text-default)">{{
                                    preview.origin.name
                                  }}</span>
                                  →
                                  {{ preview.origin.address }}
                                </p>
                                <p
                                  v-if="preview.cachePolicy"
                                  class="text-body-sm text-(--text-muted)"
                                >
                                  Cache policy
                                  <span class="text-(--text-default)">{{
                                    preview.cachePolicy
                                  }}</span>
                                </p>
                              </div>
                            </div>

                            <Item.List>
                              <Item size="small">
                                <Item.Media>
                                  <span
                                    class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                                  >
                                    <i
                                      class="pi pi-sliders-h text-body-md leading-none text-(--text-default)"
                                      aria-hidden="true"
                                    />
                                  </span>
                                </Item.Media>
                                <Item.Content>
                                  <Item.Title>{{ preview.rule.name }}</Item.Title>
                                  <Item.Description>{{
                                    preview.rule.description
                                  }}</Item.Description>
                                </Item.Content>
                                <Item.Actions>
                                  <Tag
                                    label="Request phase"
                                    severity="neutral"
                                    size="small"
                                  />
                                </Item.Actions>
                              </Item>
                            </Item.List>

                            <ul
                              class="m-0 flex list-none flex-wrap gap-(--spacing-xxs) p-(--spacing-md) pt-0"
                              aria-label="Behaviors"
                            >
                              <li
                                v-for="behavior in preview.behaviors"
                                :key="behavior"
                              >
                                <Tag
                                  :label="behavior"
                                  severity="neutral"
                                  size="small"
                                />
                              </li>
                            </ul>
                          </template>
                        </Card>
                      </template>

                      <template v-else>
                        <Card
                          :padded="false"
                          title="Configure your project"
                        >
                          <template #content>
                            <div class="p-(--spacing-md)">
                              <Field :required="!!errors['name']">
                                <Field.Label
                                  for="project-name"
                                  hint="Names the project, and every resource created alongside it."
                                  >Name</Field.Label
                                >
                                <Input
                                  id="project-name"
                                  v-model="form.name"
                                  size="large"
                                  placeholder="my-project"
                                />
                                <Field.Description>{{
                                  errors['name'] ||
                                  'Lowercase letters, numbers, and hyphens. It becomes part of the deployed URL.'
                                }}</Field.Description>
                              </Field>
                            </div>
                          </template>
                        </Card>

                        <Card
                          :padded="false"
                          title="Domain"
                        >
                          <template #content>
                            <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
                              <Alert
                                severity="info"
                                size="small"
                                label="A free platform domain is created with this project and always answers on it. Add one of your own to have visitors reach it at a name you own."
                              />

                              <Field>
                                <Field.Label
                                  for="custom-domain"
                                  hint="The hostname that points at this project."
                                  >Custom domain</Field.Label
                                >
                                <Input
                                  id="custom-domain"
                                  v-model="form.domainHost"
                                  size="large"
                                  placeholder="www.example.com"
                                  autocomplete="off"
                                />
                                <Field.Description
                                  >A full hostname. Leave it empty to bind one later; the deploy
                                  does not wait on its DNS record.</Field.Description
                                >
                              </Field>

                              <template v-if="host">
                                <Field :required="!!errors['domainEnvironment']">
                                  <Field.Label for="domain-environment">Environment</Field.Label>
                                  <Select
                                    v-model="form.domainEnvironment"
                                    size="large"
                                    class="w-full"
                                    placeholder="Select an environment"
                                    :required="!!errors['domainEnvironment']"
                                    :display-value="environmentLabel"
                                  >
                                    <Select.Trigger
                                      id="domain-environment"
                                      aria-label="Environment"
                                    />
                                    <Select.Content>
                                      <Select.Option
                                        v-for="option in environments"
                                        :key="option.value"
                                        :value="option.value"
                                      >
                                        {{ option.label }}
                                      </Select.Option>
                                    </Select.Content>
                                  </Select>
                                  <Field.Description>{{
                                    errors['domainEnvironment'] || environmentHint
                                  }}</Field.Description>
                                </Field>

                                <Field>
                                  <Field.Label for="domain-certificate">Certificate</Field.Label>
                                  <Select
                                    v-model="form.domainCertificate"
                                    size="large"
                                    class="w-full"
                                    :display-value="certificateLabel"
                                  >
                                    <Select.Trigger
                                      id="domain-certificate"
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
                                  <Field.Description
                                    >Served by the platform certificate, issued and renewed for you,
                                    unless you select another.</Field.Description
                                  >
                                </Field>
                              </template>
                            </div>
                          </template>
                        </Card>

                        <Card
                          v-if="needsBuild"
                          :padded="false"
                          title="Build and deploy commands"
                        >
                          <template #content>
                            <div>
                              <Accordion type="multiple">
                                <Accordion.Item
                                  v-for="command in commands"
                                  :key="command.field"
                                  :value="command.field"
                                >
                                  <Accordion.Trigger :level="3">
                                    <span class="flex min-w-0 items-center gap-(--spacing-sm)">
                                      <span class="shrink-0 text-label-md text-(--text-default)">
                                        {{ command.label }}
                                      </span>
                                      <span
                                        class="min-w-0 flex-1 truncate text-label-code-sm text-(--text-muted)"
                                      >
                                        {{ form[command.field].trim() || command.empty }}
                                      </span>
                                      <Tag
                                        v-if="isEdited(command)"
                                        label="Edited"
                                        severity="info"
                                        size="small"
                                        class="shrink-0"
                                      />
                                    </span>
                                  </Accordion.Trigger>
                                  <Accordion.Content>
                                    <div
                                      class="flex min-w-0 flex-col gap-(--spacing-sm) px-(--spacing-md) pb-(--spacing-md) pt-(--spacing-sm)"
                                    >
                                      <Input
                                        v-model="form[command.field]"
                                        size="large"
                                        monospace
                                        class="w-full"
                                        :aria-label="command.label"
                                        :placeholder="command.fallback"
                                      />
                                      <div
                                        class="flex min-w-0 items-center justify-between gap-(--spacing-sm)"
                                      >
                                        <p class="min-w-0 text-body-sm text-(--text-muted)">
                                          {{ command.description }}
                                        </p>
                                        <Button
                                          v-if="isEdited(command)"
                                          type="button"
                                          label="Use the default"
                                          kind="transparent"
                                          size="small"
                                          @click="resetCommand(command)"
                                        />
                                      </div>
                                    </div>
                                  </Accordion.Content>
                                </Accordion.Item>
                              </Accordion>
                            </div>
                          </template>
                        </Card>

                        <Card :padded="false">
                          <template #content>
                            <Item.List>
                              <SettingRow
                                title="Protect with a firewall"
                                description="Filters requests before they reach your code. Off by default. Turn it on to bind an existing firewall, or create one with the project."
                                kind="compact"
                              >
                                <Switch
                                  v-model="protection.enabled"
                                  aria-label="Protect with a firewall"
                                />
                              </SettingRow>
                            </Item.List>

                            <div
                              :data-open="protection.enabled || null"
                              class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                            >
                              <div
                                class="min-w-0 overflow-hidden"
                                :inert="!protection.enabled"
                              >
                                <div class="border-t border-(--border-default)">
                                  <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
                                    <ToggleGroup
                                      v-model="protection.mode"
                                      :options="firewallModes"
                                      size="large"
                                      fluid
                                      aria-label="Where the firewall comes from"
                                    />

                                    <Field
                                      v-if="protection.mode === 'new'"
                                      :required="!!errors['firewall']"
                                    >
                                      <Field.Label
                                        for="firewall-name"
                                        hint="Created alongside the project."
                                        >Firewall name</Field.Label
                                      >
                                      <Input
                                        id="firewall-name"
                                        v-model="protection.name"
                                        size="large"
                                        placeholder="my-firewall"
                                      />
                                      <Field.Description>{{
                                        errors['firewall'] ||
                                        'Lowercase letters, numbers, and hyphens.'
                                      }}</Field.Description>
                                    </Field>

                                    <HelperText
                                      v-else-if="errors['firewall']"
                                      kind="required"
                                      >{{ errors['firewall'] }}</HelperText
                                    >
                                  </div>

                                  <div
                                    v-if="protection.mode === 'existing'"
                                    class="border-t border-(--border-default)"
                                  >
                                    <Item.List>
                                      <Item
                                        v-for="option in firewalls"
                                        :key="option.value"
                                        size="small"
                                        clickable
                                        :aria-pressed="option.value === protection.firewall"
                                        @click="protection.firewall = option.value"
                                      >
                                        <Item.Media>
                                          <span
                                            class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                                          >
                                            <i
                                              class="ai ai-edge-firewall text-body-md leading-none text-(--text-default)"
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
                                            v-if="option.value === protection.firewall"
                                            class="pi pi-check shrink-0 text-(--text-default)"
                                            aria-hidden="true"
                                          />
                                        </Item.Actions>
                                      </Item>
                                    </Item.List>
                                  </div>

                                  <div
                                    v-else
                                    class="border-t border-(--border-default)"
                                  >
                                    <h3
                                      class="px-(--spacing-md) pb-(--spacing-xs) pt-(--spacing-md) text-label-sm text-(--text-muted)"
                                    >
                                      Firewall modules
                                    </h3>
                                    <Item.List>
                                      <SettingRow
                                        v-for="module in firewallModules"
                                        :key="module.key"
                                        :title="module.title"
                                        :description="module.description"
                                        kind="compact"
                                      >
                                        <Switch
                                          v-if="module.locked"
                                          key="locked"
                                          :model-value="true"
                                          disabled
                                          :aria-label="module.title"
                                        />
                                        <Switch
                                          v-else
                                          key="editable"
                                          v-model="protection.modules[module.key]"
                                          :aria-label="module.title"
                                        />
                                      </SettingRow>
                                    </Item.List>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </template>
                        </Card>

                        <SettingsSection
                          v-model:open="advancedOpen"
                          title="Advanced"
                          hint="The modules the project runs with and two project-level flags, each at its default and changeable later in its settings."
                          icon="pi pi-cog"
                          collapsible
                        >
                          <Card :padded="false">
                            <template #content>
                              <h3
                                class="px-(--spacing-md) pb-(--spacing-xs) pt-(--spacing-md) text-label-sm text-(--text-muted)"
                              >
                                Modules
                              </h3>
                              <Item.List>
                                <SettingRow
                                  v-for="module in projectModules"
                                  :key="module.key"
                                  :title="module.title"
                                  :description="module.description"
                                  kind="compact"
                                >
                                  <Switch
                                    v-model="form.modules[module.key]"
                                    :aria-label="module.title"
                                  />
                                </SettingRow>
                              </Item.List>

                              <h3
                                class="border-t border-(--border-default) px-(--spacing-md) pb-(--spacing-xs) pt-(--spacing-md) text-label-sm text-(--text-muted)"
                              >
                                Behavior
                              </h3>
                              <Item.List>
                                <SettingRow
                                  v-for="behavior in behaviors"
                                  :key="behavior.key"
                                  :title="behavior.title"
                                  :description="behavior.description"
                                  kind="compact"
                                >
                                  <Switch
                                    v-model="form[behavior.key]"
                                    :aria-label="behavior.title"
                                  />
                                </SettingRow>
                              </Item.List>
                            </template>
                          </Card>
                        </SettingsSection>
                      </template>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>

          <SaveBar kind="fade">
            <template #leading>
              <Button
                type="button"
                label="Cancel"
                kind="transparent"
                size="medium"
                href="/projects"
              />
            </template>
            <template #actions>
              <Button
                v-if="stepIndex > 0"
                key="back"
                type="button"
                label="Back"
                kind="outlined"
                size="medium"
                @click="goBack"
              />
              <Button
                v-if="nextLabel"
                key="next"
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
