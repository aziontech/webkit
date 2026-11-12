<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Alert from '@aziontech/webkit/alert'
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Combobox from '@aziontech/webkit/combobox'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import RadioButton from '@aziontech/webkit/radio-button'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Select from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import TableRoot, { type TableColumn } from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  const SUBJECT: string = 'application'
  const PAGE_DESCRIPTION =
    'Rules run top to bottom within each phase, so their order is their behavior. Turn a rule off to skip it without losing its place.'
  const PHASES = [
    { value: 'request', label: 'Request' },
    { value: 'response', label: 'Response' }
  ] as const

  type Phase = (typeof PHASES)[number]['value']
  type Control = 'up' | 'down'

  interface Rule {
    id: string
    name: string
    description: string
    phase: Phase
    author: string
    modified: string
    active: boolean
    locked: boolean
  }

  interface RuleOptions {
    active?: boolean
    locked?: boolean
  }

  interface RuleEdit {
    phase: Phase
    id: string
    to?: number
    active?: boolean
  }

  interface Snapshot {
    order: Record<string, string[]>
    active: Record<string, boolean>
  }

  interface ChangeLine {
    key: string
    name: string
    text: string
  }

  type OptionSource = 'policies' | 'cache-settings' | 'services'
  type ArgumentField =
    'target' | 'policyId' | 'serviceId' | 'cacheId' | 'capturedArray' | 'subject' | 'regex'
  type DragScope = 'behavior'

  interface BuilderPhase {
    value: Phase
    label: string
    description: string
  }

  interface TextArgument {
    kind: 'text'
    field: ArgumentField
    placeholder: string
    label: string
  }

  interface SelectArgument {
    kind: 'select'
    field: ArgumentField
    source: OptionSource
    label: string
  }

  interface GroupField {
    field: ArgumentField
    placeholder: string
    label: string
  }

  interface GroupArgument {
    kind: 'group'
    fields: GroupField[]
  }

  type BehaviorArgument = TextArgument | SelectArgument | GroupArgument

  interface BehaviorDefinition {
    value: string
    label: string
    phases: Phase[]
    argument: BehaviorArgument | null
  }

  type BehaviorFields = Partial<Record<ArgumentField, string>>

  interface BehaviorSeed extends BehaviorFields {
    type: string
  }

  interface Behavior extends BehaviorSeed {
    id: number
  }

  type Condition = {
    id: number
    variable: string
    operator: string
    argument: string
  }

  interface SeedCondition {
    join: string | null
    variable: string
    operator: string
    argument: string
  }

  interface RuleDetails {
    criteria: { conditions: SeedCondition[] }[]
    behaviors: BehaviorSeed[]
  }

  interface RuleSeed extends RuleDetails {
    name: string
    description: string
    phase: Phase
    status: string
  }

  interface RuleForm {
    name: string
    description: string
    phase: Phase
    criteria: Condition[][]
    behaviors: Behavior[]
    active: boolean
  }

  interface DragState {
    scope: DragScope | null
    from: number
    over: number
  }

  const rule = (
    id: string,
    name: string,
    description: string,
    phase: Phase,
    author: string,
    modified: string,
    options: RuleOptions = {}
  ): Rule => ({
    id,
    name,
    description,
    phase,
    author,
    modified,
    active: options.active ?? true,
    locked: options.locked ?? false
  })

  const seed = (): Record<Phase, Rule[]> => ({
    request: [
      rule(
        're-default',
        'Default rule',
        'Sends every request to the origin when no other rule matches first.',
        'request',
        'Maya Chen',
        '3 months ago',
        { locked: true }
      ),
      rule(
        're-maintenance',
        'Maintenance page',
        'Serves the maintenance page while the maintenance header is set.',
        'request',
        'Leo Park',
        '1 month ago',
        { active: false }
      ),
      rule(
        're-www',
        'Redirect www',
        'Sends the www host to the apex domain.',
        'request',
        'Ana Ruiz',
        '12 days ago'
      ),
      rule(
        're-gateway',
        'API gateway',
        'Sends API traffic to the gateway service, through the auth check.',
        'request',
        'Maya Chen',
        '2 days ago'
      ),
      rule(
        're-docs',
        'Docs rewrite',
        'Rewrites the docs path and caches it as a static asset.',
        'request',
        'Sam Okafor',
        '3 weeks ago'
      )
    ],
    response: [
      rule(
        're-cache-bypass',
        'Cache bypass',
        'Keeps API responses out of the cache.',
        'response',
        'Leo Park',
        '5 days ago'
      ),
      rule(
        're-security-headers',
        'Security headers',
        'Adds the security header set to successful responses.',
        'response',
        'Ana Ruiz',
        '9 days ago'
      ),
      rule(
        're-compress',
        'Compress assets',
        'Compresses script bundles on the way out.',
        'response',
        'Sam Okafor',
        '7 weeks ago',
        { active: false }
      )
    ]
  })

  const INITIAL_EDITS: RuleEdit[] = []
  const INITIAL_SEARCH = ''
  const INITIAL_LOADING = false
  const REVIEW_ON_START = false
  const FAILED_ON_START = false
  const SAVE_FAILURES = 0

  const rules = reactive(seed())
  const phaseLabel = (phase: Phase) => PHASES.find((item) => item.value === phase)?.label ?? phase

  const snapshot = (): Snapshot => ({
    order: Object.fromEntries(PHASES.map(({ value }) => [value, rules[value].map((r) => r.id)])),
    active: Object.fromEntries(
      PHASES.flatMap(({ value }) => rules[value].map((r) => [r.id, r.active]))
    )
  })
  const saved = ref(snapshot())

  for (const edit of INITIAL_EDITS) {
    const list = rules[edit.phase]
    const from = list.findIndex((item) => item.id === edit.id)
    if (from < 0) continue
    if (edit.to !== undefined) list.splice(edit.to, 0, ...list.splice(from, 1))
    if (edit.active !== undefined)
      list[list.findIndex((item) => item.id === edit.id)].active = edit.active
  }

  const loading = ref(INITIAL_LOADING)
  const search = ref(INITIAL_SEARCH)
  const searching = computed(() => search.value.trim().length > 0)
  const matches = (item: Rule) => {
    const term = search.value.trim().toLowerCase()
    if (!term) return true
    return [item.name, item.description, item.author].some((field) =>
      field.toLowerCase().includes(term)
    )
  }

  const openPhases = ref<string[]>(PHASES.map((item) => item.value))
  watch(search, () => {
    if (!searching.value) return
    const hits = PHASES.filter(({ value }) => rules[value].some(matches)).map(({ value }) => value)
    openPhases.value = [...new Set([...openPhases.value, ...hits])]
  })

  const groups = computed(() =>
    PHASES.map((phase) => {
      const list = rules[phase.value]
      return {
        ...phase,
        total: list.length,
        items: list.filter(matches)
      }
    })
  )

  const saving = ref(false)
  const pinned = (phase: Phase) => {
    const list = rules[phase]
    let count = 0
    while (count < list.length && list[count].locked) count += 1
    return count
  }
  const canReorder = (phase: Phase) =>
    !searching.value && !saving.value && rules[phase].length - pinned(phase) > 1
  const canMove = (phase: Phase, index: number, direction: number) => {
    if (!canReorder(phase) || index < pinned(phase)) return false
    const to = index + direction
    return to >= pinned(phase) && to < rules[phase].length
  }
  const lockReason = (phase: Phase, item: Rule) => {
    if (item.locked) return 'The default rule runs first and stays first.'
    if (searching.value) return 'Clear the search to change the order rules run in.'
    if (saving.value) return 'Wait for the save to finish.'
    if (!canReorder(phase)) return 'There is no other rule in this phase to move it past.'
    return ''
  }

  const announcement = ref('')
  const announce = (text: string) => {
    announcement.value = ''
    nextTick(() => {
      announcement.value = text
    })
  }

  const listEl = ref<HTMLElement | null>(null)
  const focusControl = (id: string, control: Control) =>
    nextTick(() => {
      const row = listEl.value?.querySelector(`[data-rule-id="${id}"]`)
      const target = row?.querySelector<HTMLButtonElement>(`[data-control="${control}"]`)
      const usable =
        target && !target.disabled
          ? target
          : (row?.querySelector<HTMLElement>('[data-control]:not(:disabled)') ??
            row?.closest('[data-reorder-row]')?.querySelector<HTMLElement>('[data-reorder-handle]'))
      usable?.focus({ preventScroll: false })
    })

  const moveTo = (phase: Phase, from: number, to: number, control?: Control) => {
    const list = rules[phase]
    const head = pinned(phase)
    const target = Math.min(Math.max(to, head), list.length - 1)
    if (from < head || target === from || !canReorder(phase)) return
    const [moved] = list.splice(from, 1)
    list.splice(target, 0, moved)
    announce(
      `${moved.name} moved to position ${target + 1} of ${list.length} in the ${phaseLabel(phase)} phase.`
    )
    if (control) focusControl(moved.id, control)
  }
  const step = (phase: Phase, index: number, direction: number, control?: Control) => {
    if (!canMove(phase, index, direction)) return
    moveTo(phase, index, index + direction, control)
  }

  const position = (phase: Phase, item: Rule) => rules[phase].indexOf(item)
  const reorderRows = (phase: Phase, next: Rule[]) => {
    if (searching.value) return
    rules[phase] = next
  }
  const reorderable = (phase: Phase) => (row: Rule) => !lockReason(phase, row)

  const columns: TableColumn[] = [
    { id: 'move', header: 'Move', width: 96, hideable: false },
    { accessorKey: 'name', header: 'Name', principal: true, hideable: false },
    { accessorKey: 'description', header: 'Description', grow: 3 },
    { id: 'status', header: 'Status', width: 152 },
    { accessorKey: 'modified', header: 'Last modified', grow: 2 }
  ]

  const setActive = (item: Rule, value: boolean) => {
    item.active = value
  }

  const dirty = computed(() => JSON.stringify(snapshot()) !== JSON.stringify(saved.value))
  const changes = computed(() =>
    PHASES.map((phase) => ({
      ...phase,
      items: rules[phase.value].flatMap((item, index) => {
        const lines: ChangeLine[] = []
        const before = saved.value.order[phase.value].indexOf(item.id)
        if (before !== index) {
          lines.push({
            key: `${item.id}-order`,
            name: item.name,
            text: `moves from position ${before + 1} to ${index + 1}`
          })
        }
        if (saved.value.active[item.id] !== item.active) {
          lines.push({
            key: `${item.id}-status`,
            name: item.name,
            text: item.active ? 'is turned on' : 'is turned off'
          })
        }
        return lines
      })
    })).filter((phase) => phase.items.length)
  )
  const changeCount = computed(() =>
    changes.value.reduce((sum, phase) => sum + phase.items.length, 0)
  )

  const discard = () => {
    for (const { value } of PHASES) {
      const byId = Object.fromEntries(rules[value].map((item) => [item.id, item]))
      rules[value] = saved.value.order[value].map((id) => byId[id]).filter(Boolean)
      for (const item of rules[value]) item.active = saved.value.active[item.id]
    }
    announce('Changes discarded. The rules are back in their saved order.')
  }

  const reviewOpen = ref(REVIEW_ON_START)
  const saveFailed = ref(FAILED_ON_START)
  let failuresLeft = SAVE_FAILURES
  const openReview = () => {
    saveFailed.value = false
    reviewOpen.value = true
  }
  const save = () => {
    if (saving.value) return
    saving.value = true
    saveFailed.value = false
    setTimeout(() => {
      saving.value = false
      if (failuresLeft > 0) {
        failuresLeft -= 1
        saveFailed.value = true
        return
      }
      saved.value = snapshot()
      reviewOpen.value = false
      setTimeout(() => listEl.value?.focus(), 0)
      toast.success('Rule order saved.', {
        description: `The ${SUBJECT} runs its rules in the new order.`
      })
    }, 900)
  }

  const builderOpen = ref(false)
  const editingRule = ref<RuleSeed | null>(null)
  const editingRow = ref<Rule | null>(null)
  const newRulePhase = ref<Phase>('request')
  const editing = computed(() => Boolean(editingRule.value))

  const BUILDER_PHASES: BuilderPhase[] = [
    {
      value: 'request',
      label: 'Request phase',
      description: 'Configure the requests the service receives.'
    },
    {
      value: 'response',
      label: 'Response phase',
      description: 'Configure the responses sent back to clients.'
    }
  ]
  const OPERATORS = [
    { value: 'is-equal', label: 'is equal' },
    { value: 'is-not-equal', label: 'is not equal' },
    { value: 'starts-with', label: 'starts with' },
    { value: 'does-not-start-with', label: 'does not start with' },
    { value: 'matches', label: 'matches' },
    { value: 'does-not-match', label: 'does not match' },
    { value: 'exists', label: 'exists' },
    { value: 'does-not-exist', label: 'does not exist' }
  ]
  const catalog: BehaviorDefinition[] = [
    {
      value: 'add-request-cookie',
      label: 'Add Request Cookie',
      phases: ['request'],
      argument: { kind: 'text', field: 'target', placeholder: 'cookie-name=value', label: 'Cookie' }
    },
    {
      value: 'add-request-header',
      label: 'Add Request Header',
      phases: ['request'],
      argument: {
        kind: 'text',
        field: 'target',
        placeholder: 'header-name: value',
        label: 'Header'
      }
    },
    {
      value: 'add-response-cookie',
      label: 'Add Response Cookie',
      phases: ['response'],
      argument: { kind: 'text', field: 'target', placeholder: 'cookie-name=value', label: 'Cookie' }
    },
    {
      value: 'add-response-header',
      label: 'Add Response Header',
      phases: ['response'],
      argument: {
        kind: 'text',
        field: 'target',
        placeholder: 'header-name: value',
        label: 'Header'
      }
    },
    {
      value: 'apply-policy',
      label: 'Apply Policy',
      phases: ['request', 'response'],
      argument: { kind: 'select', field: 'policyId', source: 'policies', label: 'Policy' }
    },
    {
      value: 'bypass-cache',
      label: 'Bypass Cache',
      phases: ['request'],
      argument: null
    },
    {
      value: 'capture-match-groups',
      label: 'Capture Match Groups',
      phases: ['request', 'response'],
      argument: {
        kind: 'group',
        fields: [
          {
            field: 'capturedArray',
            placeholder: 'Captured array name',
            label: 'Captured array'
          },
          { field: 'subject', placeholder: 'Subject', label: 'Subject' },
          { field: 'regex', placeholder: 'Regex', label: 'Regex' }
        ]
      }
    },
    {
      value: 'deliver',
      label: 'Deliver',
      phases: ['request', 'response'],
      argument: null
    },
    {
      value: 'deny',
      label: 'Deny (403 Forbidden)',
      phases: ['request'],
      argument: null
    },
    {
      value: 'enable-gzip',
      label: 'Enable Gzip',
      phases: ['request', 'response'],
      argument: null
    },
    {
      value: 'filter-request-cookie',
      label: 'Filter Request Cookie',
      phases: ['request'],
      argument: {
        kind: 'text',
        field: 'target',
        placeholder: 'cookie-name or cookie-name=cookie-value',
        label: 'Cookie'
      }
    },
    {
      value: 'filter-request-header',
      label: 'Filter Request Header',
      phases: ['request'],
      argument: { kind: 'text', field: 'target', placeholder: 'header-name', label: 'Header' }
    },
    {
      value: 'filter-response-cookie',
      label: 'Filter Response Cookie',
      phases: ['response'],
      argument: {
        kind: 'text',
        field: 'target',
        placeholder: 'cookie-name or cookie-name=cookie-value',
        label: 'Cookie'
      }
    },
    {
      value: 'filter-response-header',
      label: 'Filter Response Header',
      phases: ['response'],
      argument: { kind: 'text', field: 'target', placeholder: 'header-name', label: 'Header' }
    },
    {
      value: 'forward-cookies',
      label: 'Forward Cookies',
      phases: ['request'],
      argument: null
    },
    {
      value: 'no-content',
      label: 'No Content (204)',
      phases: ['request'],
      argument: null
    },
    {
      value: 'optimize-images',
      label: 'Optimize Images',
      phases: ['request'],
      argument: null
    },
    {
      value: 'redirect-http-to-https',
      label: 'Redirect HTTP to HTTPS',
      phases: ['request'],
      argument: null
    },
    {
      value: 'redirect-301',
      label: 'Redirect To (301 Moved Permanently)',
      phases: ['request', 'response'],
      argument: {
        kind: 'text',
        field: 'target',
        placeholder: 'https://example.com${uri}',
        label: 'Location'
      }
    },
    {
      value: 'redirect-302',
      label: 'Redirect To (302 Found)',
      phases: ['request', 'response'],
      argument: {
        kind: 'text',
        field: 'target',
        placeholder: 'https://example.com${uri}',
        label: 'Location'
      }
    },
    {
      value: 'rewrite-request',
      label: 'Rewrite Request',
      phases: ['request'],
      argument: { kind: 'text', field: 'target', placeholder: 'URL-path', label: 'Path' }
    },
    {
      value: 'route-to-service',
      label: 'Route to Service',
      phases: ['request'],
      argument: { kind: 'select', field: 'serviceId', source: 'services', label: 'Service' }
    },
    {
      value: 'set-cache-policy',
      label: 'Set Cache Policy',
      phases: ['request'],
      argument: {
        kind: 'select',
        field: 'cacheId',
        source: 'cache-settings',
        label: 'Cache policy'
      }
    }
  ]
  const variables = [
    '${arg_}',
    '${args}',
    '${cookie_}',
    '${domain}',
    '${geoip_city}',
    '${geoip_city_continent_code}',
    '${geoip_city_country_code}',
    '${geoip_city_country_name}',
    '${geoip_continent_code}',
    '${geoip_country_code}',
    '${geoip_country_name}',
    '${geoip_region}',
    '${geoip_region_name}',
    '${host}',
    '${http_}',
    '${remote_addr}',
    '${remote_port}',
    '${remote_user}',
    '${request}',
    '${request_body}',
    '${request_method}',
    '${request_uri}',
    '${scheme}',
    '${uri}'
  ]
  const phaseVariables: Record<Phase, string[]> = {
    request: ['${server_addr}', '${server_port}'],
    response: [
      '${sent_http_name}',
      '${status}',
      '${tcpinfo_rtt}',
      '${upstream_addr}',
      '${upstream_cookie_}',
      '${upstream_http_}',
      '${upstream_status}'
    ]
  }
  const policies = [
    { value: '4021884', label: 'auth-check', scope: 'request' },
    { value: '4021885', label: 'rate-limit', scope: 'request' },
    { value: '4021886', label: 'geo-routing', scope: 'request' },
    { value: '4021887', label: 'ab-test-split', scope: 'request' },
    { value: '4021890', label: 'security-headers', scope: 'any' }
  ]
  const sources = {
    'cache-settings': [
      { value: 'cs-default', label: 'Default Cache' },
      { value: 'cs-static', label: 'Static Assets' }
    ],
    services: [
      { value: '7710021', label: 'api-primary' },
      { value: '7710022', label: 'static-assets' },
      { value: '7710023', label: 'api-failover' },
      { value: '7710024', label: 'uploads' },
      { value: '7710025', label: 'live-events' },
      { value: '7710026', label: 'legacy-cms' },
      { value: '7710027', label: 'docs-static' }
    ]
  }

  const GRIP_CLASS =
    'inline-flex shrink-0 cursor-grab items-center justify-center rounded-(--shape-button) text-(--text-muted) outline-none transition-colors hover:bg-(--bg-hover) hover:text-(--text-default) focus-visible:ring-2 focus-visible:ring-(--ring-color) active:cursor-grabbing motion-reduce:transition-none'
  const dragRowClass =
    "relative rounded-(--shape-card) transition-[opacity,transform,outline-color] data-dragging:opacity-70 data-dragging:scale-[0.98] data-dragging:outline-dashed data-dragging:outline-2 data-dragging:outline-(--accent) data-drop:before:pointer-events-none data-drop:before:absolute data-drop:before:inset-x-0 data-drop:before:-top-(--spacing-xxs) data-drop:before:border-t-2 data-drop:before:border-(--accent) data-drop:before:content-['']"

  const byValue = Object.fromEntries(catalog.map((behavior) => [behavior.value, behavior]))
  const operatorLabel = (value: unknown) => OPERATORS.find((o) => o.value === value)?.label ?? ''
  const takesArgument = (operator: unknown) =>
    operator !== 'exists' && operator !== 'does-not-exist'
  const behaviorLabel = (value: unknown) => byValue[String(value)]?.label ?? ''
  const behaviorArgument = (value: string) => byValue[value]?.argument ?? null
  const textArgument = (value: string) => behaviorArgument(value) as TextArgument
  const selectArgument = (value: string) => behaviorArgument(value) as SelectArgument
  const groupArgument = (value: string) => behaviorArgument(value) as GroupArgument
  const behaviorsFor = (phase: Phase) =>
    catalog.filter((behavior) => behavior.phases.includes(phase))
  const behaviorAllowedIn = (value: string, phase: Phase) =>
    Boolean(byValue[value]?.phases.includes(phase))
  const isTerminalBehavior = (value: string) =>
    ['deliver', 'deny', 'no-content', 'redirect-301', 'redirect-302'].includes(value)
  const behaviorOptions = (source: OptionSource, phase: Phase) => {
    if (source === 'policies') {
      return policies
        .filter((policy) => phase !== 'response' || policy.scope === 'any')
        .map(({ value, label }) => ({ value, label }))
    }
    return sources[source] ?? []
  }
  const behaviorArgumentNote = (source: OptionSource, phase: Phase) =>
    source === 'policies' && phase === 'response'
      ? 'Only policies scoped to any phase run in the response phase.'
      : ''
  const variablesFor = (phase: Phase) =>
    [...variables, ...phaseVariables[phase]]
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({ value }))

  let nextId = 0
  const uid = () => (nextId += 1)
  const newCondition = (): Condition => ({
    id: uid(),
    variable: '',
    operator: 'is-equal',
    argument: ''
  })
  const criteriaColumns = [
    { key: 'variable', label: 'Variable', required: true },
    { key: 'operator', label: 'Operator' },
    { key: 'argument', label: 'Argument' }
  ]
  const newBehavior = (): Behavior => ({ id: uid(), type: 'deliver' })
  const blankForm = (): RuleForm => ({
    name: '',
    description: '',
    phase: BUILDER_PHASES[0].value,
    criteria: [[newCondition()]],
    behaviors: [newBehavior()],
    active: true
  })
  const formFor = (seed: RuleSeed | null): RuleForm =>
    !seed
      ? blankForm()
      : {
          name: seed.name,
          description: seed.description,
          phase: seed.phase,
          criteria: seed.criteria.map((group) =>
            group.conditions.map(({ variable, operator, argument }) => ({
              id: uid(),
              variable,
              operator,
              argument
            }))
          ),
          behaviors: seed.behaviors.map((behavior) => ({ ...behavior, id: uid() })),
          active: seed.status === 'Active'
        }

  const form = reactive(blankForm())
  const submitted = ref(false)
  const submitting = ref(false)
  const nameError = computed(() => submitted.value && !form.name.trim())
  const criteriaErrors = computed(() =>
    submitted.value
      ? form.criteria.map((group) =>
          group.map((condition) =>
            condition.variable.trim() ? {} : { variable: 'Enter the variable to compare.' }
          )
        )
      : []
  )

  watch(
    builderOpen,
    (isOpen) => {
      if (!isOpen) return
      Object.assign(form, formFor(editingRule.value))
      if (!editingRule.value) form.phase = newRulePhase.value
      submitted.value = false
    },
    { immediate: true }
  )

  const behaviorsForPhase = computed(() =>
    behaviorsFor(form.phase).map(({ value, label }) => ({ value, label }))
  )
  const variablesForPhase = computed(() => variablesFor(form.phase))

  const behaviorQuery = reactive<Record<number, string>>({})
  const behaviorMatches = (id: number) => {
    const query = (behaviorQuery[id] ?? '').trim().toLowerCase()
    if (!query) return behaviorsForPhase.value
    return behaviorsForPhase.value.filter((option) => option.label.toLowerCase().includes(query))
  }
  const onBehaviorPanel = (id: number, isOpen: boolean) => {
    if (!isOpen) behaviorQuery[id] = ''
  }

  const optionsFor = (source: OptionSource) => behaviorOptions(source, form.phase)
  const optionLabelIn = (source: OptionSource, value: unknown) =>
    optionsFor(source).find((option) => option.value === value)?.label ?? ''

  const setBehaviorType = (index: number, type: string) => {
    if (form.behaviors[index].type === type) return
    form.behaviors[index] = { id: form.behaviors[index].id, type }
  }
  const argumentMissing = (behavior: Behavior, field: ArgumentField) =>
    submitted.value && !String(behavior[field] ?? '').trim()
  const canAddBehavior = computed(() => {
    if (form.behaviors.length >= 10) return false
    return !isTerminalBehavior(form.behaviors[form.behaviors.length - 1]?.type)
  })

  watch(
    () => form.phase,
    (phase) => {
      form.behaviors.forEach((behavior, index) => {
        if (!behaviorAllowedIn(behavior.type, phase)) {
          form.behaviors[index] = { id: behavior.id, type: 'deliver' }
          return
        }
        const argument = behaviorArgument(behavior.type)
        if (argument?.kind !== 'select') return
        const stillOffered = behaviorOptions(argument.source, phase).some(
          (option) => option.value === behavior[argument.field]
        )
        if (!stillOffered) behavior[argument.field] = ''
      })
    }
  )

  const move = <T,>(list: T[], index: number, direction: number) => {
    const target = index + direction
    if (target < 0 || target >= list.length) return
    const [moved] = list.splice(index, 1)
    list.splice(target, 0, moved)
  }
  const addBehavior = () => form.behaviors.push(newBehavior())
  const removeBehavior = (index: number) => {
    if (form.behaviors.length <= 1) return
    form.behaviors.splice(index, 1)
  }
  const moveBehavior = (index: number, direction: number) => move(form.behaviors, index, direction)

  const dnd = reactive<DragState>({ scope: null, from: -1, over: -1 })
  const isDragging = (scope: DragScope, index: number) => dnd.scope === scope && dnd.from === index
  const isDropTarget = (scope: DragScope, index: number) =>
    dnd.scope === scope && dnd.over === index && dnd.from !== index
  const onDragStart = (scope: DragScope, index: number, event: DragEvent) => {
    dnd.scope = scope
    dnd.from = index
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', String(index))
      const row = (event.currentTarget as Element | null)?.closest?.('[data-drag-row]')
      if (row) event.dataTransfer.setDragImage(row, 12, 12)
    }
  }
  const onDragEnter = (scope: DragScope, index: number) => {
    if (dnd.scope === scope) dnd.over = index
  }
  const onDragEnd = () => {
    dnd.scope = null
    dnd.from = -1
    dnd.over = -1
  }
  const reorder = <T,>(list: T[], from: number, to: number) => {
    if (from < 0 || to < 0 || from === to || from >= list.length || to >= list.length) return
    const [moved] = list.splice(from, 1)
    list.splice(to, 0, moved)
  }
  const dropOnBehavior = (index: number) => {
    if (dnd.scope !== 'behavior') return
    reorder(form.behaviors, dnd.from, index)
    onDragEnd()
  }

  const behaviorFilled = (behavior: Behavior) => {
    const argument = behaviorArgument(behavior.type)
    if (!argument) return true
    const fields: { field: ArgumentField }[] =
      argument.kind === 'group' ? argument.fields : [argument]
    return fields.every(({ field }) => String(behavior[field] ?? '').trim())
  }
  const isValid = () =>
    Boolean(form.name.trim()) &&
    form.criteria.every((group) => group.every((condition) => condition.variable.trim())) &&
    form.behaviors.length > 0 &&
    form.behaviors.every(behaviorFilled)
  const formEl = ref<HTMLElement | null>(null)
  const submit = () => {
    submitted.value = true
    if (submitting.value) return
    if (!isValid()) {
      nextTick(() =>
        formEl.value
          ?.querySelector<HTMLElement>(
            ':is(input, textarea, button)[aria-invalid="true"], :is(input, textarea, button)[aria-required="true"]'
          )
          ?.focus()
      )
      return
    }
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      builderOpen.value = false
      applyRule()
    }, 900)
  }

  const RULE_DETAILS: Partial<Record<string, RuleDetails>> = {
    're-docs': {
      criteria: [
        {
          conditions: [{ join: null, variable: '${uri}', operator: 'matches', argument: '/docs/*' }]
        }
      ],
      behaviors: [
        { type: 'rewrite-request', target: '/documentation${uri}' },
        { type: 'set-cache-policy', cacheId: 'cs-static' }
      ]
    },
    're-www': {
      criteria: [
        {
          conditions: [
            { join: null, variable: '${host}', operator: 'is-equal', argument: 'www.example.com' }
          ]
        }
      ],
      behaviors: [{ type: 'redirect-301', target: 'https://example.com${uri}' }]
    },
    're-cache-bypass': {
      criteria: [
        {
          conditions: [
            { join: null, variable: '${uri}', operator: 'starts-with', argument: '/api/' }
          ]
        }
      ],
      behaviors: [{ type: 'bypass-cache' }]
    }
  }
  const fallbackDetails = (row: Rule): RuleDetails => ({
    criteria: [
      {
        conditions: [{ join: null, variable: '${uri}', operator: 'starts-with', argument: '/' }]
      }
    ],
    behaviors: [{ type: row.phase === 'response' ? 'enable-gzip' : 'deliver' }]
  })
  const seedFor = (row: Rule): RuleSeed => ({
    name: row.name,
    description: row.description,
    phase: row.phase,
    ...(RULE_DETAILS[row.id] ?? fallbackDetails(row)),
    status: row.active ? 'Active' : 'Inactive'
  })

  const openRule = (row: Rule | null) => {
    editingRow.value = row
    editingRule.value = row ? seedFor(row) : null
    builderOpen.value = true
  }
  const addRule = (phase: Phase = PHASES[0].value) => {
    newRulePhase.value = phase
    openRule(null)
  }

  let createdCount = 0
  const applyRule = () => {
    const row = editingRow.value
    if (row) {
      row.name = form.name.trim()
      row.description = form.description.trim()
      row.active = form.active
      saved.value.active[row.id] = form.active
      row.modified = 'just now'
      row.author = 'You'
      toast.success(`${row.name} saved.`, {
        description: 'The rule runs with its new criteria and behaviors.'
      })
      return
    }
    const phase = form.phase
    const created = rule(
      `re-new-${(createdCount += 1)}`,
      form.name.trim(),
      form.description.trim(),
      phase,
      'You',
      'just now',
      { active: form.active }
    )
    rules[phase].push(created)
    saved.value.order[phase].push(created.id)
    saved.value.active[created.id] = created.active
    if (!openPhases.value.includes(phase)) openPhases.value = [...openPhases.value, phase]
    toast.success(`${created.name} added.`, {
      description: `It runs last in the ${phaseLabel(phase)} phase. Move it to change when it runs.`,
      actions: [{ label: 'Edit', onClick: () => openRule(created) }]
    })
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Rules"
        :description="PAGE_DESCRIPTION"
        size="small"
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="pi pi-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/rules"
            target="_blank"
          />
          <Button
            label="Add Rule"
            icon="pi pi-plus"
            kind="outlined"
            size="medium"
            @click="addRule()"
          />
        </template>
      </PageHeader>

      <section
        ref="listEl"
        tabindex="-1"
        class="layout-section-start flex min-w-0 flex-1 flex-col gap-(--layout-group-gap) pb-(--layout-boundary-end) outline-none"
        aria-label="Rules by phase"
      >
        <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-sm)">
          <div class="min-w-36 grow basis-(--container-2xs)">
            <Input
              v-model="search"
              size="medium"
              placeholder="Search rules"
              aria-label="Search rules"
              class="w-full"
              :disabled="loading"
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
          </div>
        </div>

        <Alert
          v-if="searching"
          severity="info"
          label="Reordering is off while a search narrows the list. Clear the search to change the order rules run in."
        />

        <Card :padded="false">
          <template #content>
            <Accordion
              v-model="openPhases"
              type="multiple"
              size="large"
              arrow-position="left"
            >
              <Accordion.Item
                v-for="group in groups"
                :key="group.value"
                :value="group.value"
              >
                <Accordion.Trigger :level="2">
                  <span class="flex min-w-0 items-center gap-(--spacing-sm)">
                    <span class="truncate">{{ group.label }} phase</span>
                    <span
                      class="shrink-0 text-body-xs tabular-nums text-(--text-muted)"
                      :data-testid="`rules-list__count-${group.value}`"
                    >
                      {{
                        loading
                          ? 'Loading'
                          : searching
                            ? `${group.items.length} of ${group.total}`
                            : `${group.total} ${group.total === 1 ? 'rule' : 'rules'}`
                      }}
                    </span>
                  </span>
                </Accordion.Trigger>
                <Accordion.Content>
                  <div>
                    <TableRoot
                      v-if="loading || group.total"
                      :data="loading ? [] : group.items"
                      :columns="columns"
                      row-key="id"
                      :bordered="false"
                      :loading="loading"
                      reorderable
                      :row-reorderable="reorderable(group.value)"
                      :aria-label="`${group.label} phase rules, in the order they run`"
                      @update:data="reorderRows(group.value, $event)"
                    >
                      <template #cell-move="{ row }">
                        <div
                          :data-rule-id="row.id"
                          class="flex items-center gap-(--spacing-xxs)"
                        >
                          <Tooltip :text="lockReason(group.value, row) || 'Move up'">
                            <IconButton
                              icon="pi pi-chevron-up"
                              kind="outlined"
                              size="small"
                              data-control="up"
                              :aria-label="
                                lockReason(group.value, row)
                                  ? `Move ${row.name} up. ${lockReason(group.value, row)}`
                                  : `Move ${row.name} up`
                              "
                              :disabled="!canMove(group.value, position(group.value, row), -1)"
                              @click="step(group.value, position(group.value, row), -1, 'up')"
                            />
                          </Tooltip>
                          <Tooltip :text="lockReason(group.value, row) || 'Move down'">
                            <IconButton
                              icon="pi pi-chevron-down"
                              kind="outlined"
                              size="small"
                              data-control="down"
                              :aria-label="
                                lockReason(group.value, row)
                                  ? `Move ${row.name} down. ${lockReason(group.value, row)}`
                                  : `Move ${row.name} down`
                              "
                              :disabled="!canMove(group.value, position(group.value, row), 1)"
                              @click="step(group.value, position(group.value, row), 1, 'down')"
                            />
                          </Tooltip>
                        </div>
                      </template>
                      <template #cell-name="{ row }">
                        <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
                          <button
                            type="button"
                            data-rule-name
                            :aria-label="`Edit ${row.name}`"
                            class="min-w-0 cursor-pointer truncate rounded-(--shape-button) border-0 bg-transparent p-0 text-start text-body-sm text-(--text-default) underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                            @click="openRule(row)"
                          >
                            {{ row.name }}
                          </button>
                          <Tag
                            v-if="row.locked"
                            label="Default"
                            severity="secondary"
                            size="small"
                          />
                        </div>
                      </template>
                      <template #cell-description="{ row }">
                        <span class="min-w-0 truncate text-(--text-muted)">{{
                          row.description
                        }}</span>
                      </template>
                      <template #cell-status="{ row }">
                        <div class="flex min-h-10 min-w-0 items-center">
                          <Field orientation="horizontal">
                            <Switch
                              :model-value="row.active"
                              :disabled="row.locked || saving"
                              :aria-label="`Run ${row.name}`"
                              @update:model-value="setActive(row, $event)"
                            />
                            <Field.Label>
                              <span
                                class="text-body-sm"
                                aria-hidden="true"
                                >{{ row.active ? 'Active' : 'Inactive' }}</span
                              >
                            </Field.Label>
                          </Field>
                        </div>
                      </template>
                      <template #cell-modified="{ row }">
                        <span class="min-w-0 truncate text-body-sm text-(--text-muted)"
                          >{{ row.modified }} by {{ row.author }}</span
                        >
                      </template>
                      <template #empty>
                        <p
                          class="m-0 px-(--spacing-md) py-(--spacing-lg) text-center text-body-sm text-(--text-muted)"
                        >
                          No {{ group.label.toLowerCase() }} rule matches “{{ search.trim() }}”.
                        </p>
                      </template>
                    </TableRoot>
                    <EmptyState
                      v-else
                      size="small"
                      :title="`No ${group.label.toLowerCase()} rules yet`"
                      :description="`Add a rule to act on every ${group.label.toLowerCase()} this ${SUBJECT} handles.`"
                    >
                      <template #actions>
                        <Button
                          label="Add Rule"
                          icon="pi pi-plus"
                          kind="outlined"
                          size="medium"
                          @click="addRule(group.value)"
                        />
                      </template>
                    </EmptyState>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </template>
        </Card>

        <p
          role="status"
          aria-live="polite"
          class="sr-only"
          data-testid="rules-list__announcer"
        >
          {{ announcement }}
        </p>
      </section>

      <SaveBar v-if="dirty">
        {{ changeCount }} {{ changeCount === 1 ? 'change' : 'changes' }} to the rules, not saved
        yet.
        <template #actions>
          <Button
            type="button"
            label="Discard"
            kind="outlined"
            size="medium"
            :disabled="saving"
            @click="discard"
          />
          <Button
            type="button"
            label="Review changes"
            kind="primary"
            size="medium"
            :disabled="saving"
            @click="openReview"
          />
        </template>
      </SaveBar>
    </div>

    <Dialog
      v-model:open="reviewOpen"
      :dismissible="!saving"
      size="medium"
    >
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <PanelHeader class="w-full">
            <DialogTitle>Review changes</DialogTitle>
            <DialogClose />
          </PanelHeader>
          <PanelContent>
            <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
              <Alert
                v-if="saveFailed"
                severity="danger"
                label="The new order wasn't saved. The rules still run in the saved order; save again to apply it."
              />
              <DialogDescription>
                Rules run top to bottom within each phase. Saving applies this order to every
                {{ SUBJECT === 'firewall' ? 'request' : 'request and response' }} the
                {{ SUBJECT }} handles.
              </DialogDescription>
              <section
                v-for="phase in changes"
                :key="phase.value"
                class="flex min-w-0 flex-col gap-(--spacing-xs)"
                :aria-labelledby="`rules-review-${phase.value}`"
              >
                <h3
                  :id="`rules-review-${phase.value}`"
                  class="m-0 text-label-sm text-(--text-muted)"
                >
                  {{ phase.label }} phase
                </h3>
                <ul class="m-0 flex list-none flex-col gap-(--spacing-xxs) p-0">
                  <li
                    v-for="line in phase.items"
                    :key="line.key"
                    class="text-body-sm text-(--text-muted)"
                  >
                    <span class="font-medium text-(--text-default)">{{ line.name }}</span>
                    {{ line.text }}.
                  </li>
                </ul>
              </section>
            </div>
          </PanelContent>
          <PanelFooter>
            <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
              <div class="w-full md:w-fit">
                <Button
                  class="w-full"
                  type="button"
                  label="Cancel"
                  kind="outlined"
                  :disabled="saving"
                  @click="reviewOpen = false"
                />
              </div>
              <div class="w-full md:w-fit">
                <Button
                  class="w-full"
                  type="button"
                  :label="saveFailed ? 'Save again' : 'Save'"
                  kind="primary"
                  :loading="saving"
                  @click="save"
                />
              </div>
            </div>
          </PanelFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>

    <Drawer
      v-model:open="builderOpen"
      size="large"
      side="right"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <form
            ref="formEl"
            class="flex min-h-0 flex-1 flex-col"
            :aria-label="editing ? 'Edit Rule' : 'Add Rule'"
            novalidate
            @submit.prevent="submit"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                <DrawerTitle>{{ editing ? 'Edit Rule' : 'Add Rule' }}</DrawerTitle>
                <p class="text-body-sm text-(--text-muted)">
                  Handle the conditional execution of behaviors through logical operators.
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
              <fieldset
                class="m-0 flex min-w-0 flex-col border-0 p-0"
                :disabled="submitting"
              >
                <legend class="sr-only">{{ editing ? 'Edit Rule' : 'Add Rule' }}</legend>
                <SettingsSection
                  title="General"
                  hint="Names the rule in the list and in the deployment log."
                >
                  <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                    <Field
                      :disabled="submitting"
                      :required="nameError"
                    >
                      <Field.Label for="rule-name">Name</Field.Label>
                      <Input
                        id="rule-name"
                        v-model="form.name"
                        size="large"
                        placeholder="My rule"
                      />
                      <Field.Description v-if="nameError">Name is required.</Field.Description>
                    </Field>

                    <Field :disabled="submitting">
                      <Field.Label for="rule-description">Description</Field.Label>
                      <Input
                        id="rule-description"
                        v-model="form.description"
                        size="large"
                        placeholder="Optional"
                      />
                      <Field.Description
                        >For whoever reads this rule next. It never affects what the rule
                        does.</Field.Description
                      >
                    </Field>
                  </div>
                </SettingsSection>

                <SettingsSection
                  title="Phase"
                  hint="When the rule runs. Request rules act on what arrives at the service; response rules act on what leaves it. The two are separate programs and never interleave."
                >
                  <Card :padded="false">
                    <template #content>
                      <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
                        <div class="flex flex-col gap-(--spacing-xs)">
                          <Field.Label
                            v-for="phase in BUILDER_PHASES"
                            :key="phase.value"
                          >
                            <Field
                              orientation="horizontal"
                              :disabled="submitting || editing"
                            >
                              <RadioButton
                                v-model="form.phase"
                                :value="phase.value"
                                name="rule-phase"
                                :input-id="`rule-phase-${phase.value}`"
                              />
                              <Field.Content>
                                <Field.Title>{{ phase.label }}</Field.Title>
                                <Field.Description>{{ phase.description }}</Field.Description>
                              </Field.Content>
                            </Field>
                          </Field.Label>
                          <HelperText
                            v-if="editing"
                            kind="disabled"
                            label="A rule’s phase is set when it is created. Create a rule in the other phase to run these behaviors there."
                          />
                        </div>
                      </div>
                    </template>
                  </Card>
                </SettingsSection>

                <SettingsSection
                  title="Criteria"
                  hint="The conditions that decide whether the rule runs. Every condition in a group must match, and any one group is enough."
                >
                  <AttributeEditor
                    v-model:groups="form.criteria"
                    :definition="criteriaColumns"
                    :new-item="newCondition"
                    :errors="criteriaErrors"
                    :limit="10"
                    :group-limit="5"
                    :min-items="1"
                    :disabled="submitting"
                    size="large"
                    add-button-label="Add condition"
                    add-group-label="Add OR group"
                    remove-button-label="Remove condition"
                    aria-label="Criteria"
                  >
                    <template #cell-variable="{ value, update, invalid }">
                      <div class="contents font-code">
                        <Combobox
                          :model-value="value as string"
                          :options="variablesForPhase"
                          size="large"
                          placeholder="${uri}"
                          empty-text="No variable matches. Type the one you need."
                          required
                          :invalid="invalid"
                          :disabled="submitting"
                          @update:model-value="update"
                        />
                      </div>
                    </template>
                    <template #cell-operator="{ value, update }">
                      <Select
                        :model-value="value as string"
                        size="large"
                        class="w-full"
                        :disabled="submitting"
                        :display-value="operatorLabel"
                        @update:model-value="update"
                      >
                        <Select.Trigger />
                        <Select.Content>
                          <Select.Option
                            v-for="op in OPERATORS"
                            :key="op.value"
                            :value="op.value"
                          >
                            {{ op.label }}
                          </Select.Option>
                        </Select.Content>
                      </Select>
                    </template>
                    <template #cell-argument="{ item, value, update }">
                      <Input
                        v-if="takesArgument(item.operator)"
                        key="argument"
                        :model-value="value as string"
                        size="large"
                        class="w-full"
                        autocomplete="off"
                        :spellcheck="false"
                        :disabled="submitting"
                        @update:model-value="update"
                      />
                      <Input
                        v-else
                        key="no-argument"
                        model-value=""
                        size="large"
                        class="w-full"
                        placeholder="No argument"
                        disabled
                      />
                    </template>
                  </AttributeEditor>
                </SettingsSection>

                <SettingsSection
                  title="Behaviors"
                  hint="What the rule does when its criteria are met, run top to bottom in this order."
                >
                  <Card :padded="false">
                    <template #content>
                      <div
                        class="transition-[height] duration-moderate-02 ease-productive-entrance data-resizing:overflow-hidden motion-reduce:transition-none"
                      >
                        <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
                          <div class="flex items-center gap-(--spacing-xs)">
                            <span class="text-overline-sm text-(--text-muted)">Then</span>
                            <span class="h-px flex-1 bg-(--border-default)" />
                          </div>

                          <div class="relative flex flex-col gap-(--spacing-sm)">
                            <div
                              v-for="(behavior, bIdx) in form.behaviors"
                              :key="behavior.id"
                              data-drag-row
                              :data-dragging="isDragging('behavior', bIdx) || null"
                              :data-drop="isDropTarget('behavior', bIdx) || null"
                              :class="[
                                'grid grid-cols-1 items-start gap-(--spacing-xs) sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]',
                                dragRowClass
                              ]"
                              @dragenter.prevent="onDragEnter('behavior', bIdx)"
                              @dragover.prevent
                              @drop="dropOnBehavior(bIdx)"
                            >
                              <div class="w-full min-w-0">
                                <Select
                                  :model-value="behavior.type"
                                  size="large"
                                  class="w-full"
                                  :disabled="submitting"
                                  :display-value="behaviorLabel"
                                  @update:model-value="setBehaviorType(bIdx, $event as string)"
                                  @update:open="onBehaviorPanel(behavior.id, $event)"
                                >
                                  <Select.Trigger aria-label="Behavior" />
                                  <Select.Content>
                                    <template #search>
                                      <Input
                                        v-model="behaviorQuery[behavior.id]"
                                        size="medium"
                                        class="w-full"
                                        placeholder="Search behaviors"
                                        aria-label="Search behaviors"
                                        @keydown.stop
                                      >
                                        <template #iconLeft>
                                          <i
                                            class="pi pi-search"
                                            aria-hidden="true"
                                          />
                                        </template>
                                      </Input>
                                    </template>
                                    <Select.Option
                                      v-for="option in behaviorMatches(behavior.id)"
                                      :key="option.value"
                                      :value="option.value"
                                    >
                                      {{ option.label }}
                                    </Select.Option>
                                    <p
                                      v-if="!behaviorMatches(behavior.id).length"
                                      class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
                                    >
                                      No behavior matches “{{ behaviorQuery[behavior.id] }}”.
                                    </p>
                                  </Select.Content>
                                </Select>
                              </div>

                              <div class="min-w-0">
                                <template v-if="behaviorArgument(behavior.type)?.kind === 'text'">
                                  <Input
                                    v-model="behavior[textArgument(behavior.type).field]"
                                    size="large"
                                    class="w-full"
                                    :aria-label="textArgument(behavior.type).label"
                                    :placeholder="textArgument(behavior.type).placeholder"
                                    :disabled="submitting"
                                    :required="
                                      argumentMissing(behavior, textArgument(behavior.type).field)
                                    "
                                  />
                                </template>

                                <template
                                  v-else-if="behaviorArgument(behavior.type)?.kind === 'select'"
                                >
                                  <div class="flex flex-col gap-(--spacing-xxs)">
                                    <Select
                                      v-model="behavior[selectArgument(behavior.type).field]"
                                      size="large"
                                      class="w-full"
                                      :disabled="submitting"
                                      :placeholder="`Select a ${selectArgument(behavior.type).label.toLowerCase()}`"
                                      :required="
                                        argumentMissing(
                                          behavior,
                                          selectArgument(behavior.type).field
                                        )
                                      "
                                      :display-value="
                                        (value) =>
                                          optionLabelIn(selectArgument(behavior.type).source, value)
                                      "
                                    >
                                      <Select.Trigger
                                        :aria-label="selectArgument(behavior.type).label"
                                      />
                                      <Select.Content>
                                        <Select.Option
                                          v-for="option in optionsFor(
                                            selectArgument(behavior.type).source
                                          )"
                                          :key="option.value"
                                          :value="option.value"
                                        >
                                          {{ option.label }}
                                        </Select.Option>
                                      </Select.Content>
                                    </Select>
                                    <HelperText
                                      v-if="
                                        behaviorArgumentNote(
                                          selectArgument(behavior.type).source,
                                          form.phase
                                        )
                                      "
                                    >
                                      {{
                                        behaviorArgumentNote(
                                          selectArgument(behavior.type).source,
                                          form.phase
                                        )
                                      }}
                                    </HelperText>
                                  </div>
                                </template>

                                <template
                                  v-else-if="behaviorArgument(behavior.type)?.kind === 'group'"
                                >
                                  <div class="flex flex-col gap-(--spacing-xs)">
                                    <Input
                                      v-for="part in groupArgument(behavior.type).fields"
                                      :key="part.field"
                                      v-model="behavior[part.field]"
                                      size="large"
                                      class="w-full"
                                      :aria-label="part.label"
                                      :placeholder="part.placeholder"
                                      :disabled="submitting"
                                      :required="argumentMissing(behavior, part.field)"
                                    />
                                  </div>
                                </template>
                              </div>

                              <div class="flex items-center gap-(--spacing-xxs)">
                                <span
                                  v-if="form.behaviors.length > 1"
                                  role="button"
                                  tabindex="0"
                                  aria-label="Drag to reorder behavior, or use arrow keys"
                                  draggable="true"
                                  :class="[GRIP_CLASS, 'size-10']"
                                  @dragstart="onDragStart('behavior', bIdx, $event)"
                                  @dragend="onDragEnd"
                                  @keydown.up.prevent="moveBehavior(bIdx, -1)"
                                  @keydown.down.prevent="moveBehavior(bIdx, 1)"
                                >
                                  <i
                                    class="pi pi-bars"
                                    aria-hidden="true"
                                  />
                                </span>
                                <Tooltip text="Move behavior up">
                                  <IconButton
                                    icon="pi pi-chevron-up"
                                    kind="outlined"
                                    size="large"
                                    aria-label="Move behavior up"
                                    :disabled="submitting || bIdx === 0"
                                    @click="moveBehavior(bIdx, -1)"
                                  />
                                </Tooltip>
                                <Tooltip text="Move behavior down">
                                  <IconButton
                                    icon="pi pi-chevron-down"
                                    kind="outlined"
                                    size="large"
                                    aria-label="Move behavior down"
                                    :disabled="submitting || bIdx === form.behaviors.length - 1"
                                    @click="moveBehavior(bIdx, 1)"
                                  />
                                </Tooltip>
                                <Tooltip text="Remove behavior">
                                  <IconButton
                                    icon="pi pi-trash"
                                    kind="outlined"
                                    size="large"
                                    aria-label="Remove behavior"
                                    :disabled="submitting || form.behaviors.length <= 1"
                                    @click="removeBehavior(bIdx)"
                                  />
                                </Tooltip>
                              </div>
                            </div>
                          </div>

                          <div class="flex flex-wrap items-center gap-(--spacing-sm)">
                            <Button
                              type="button"
                              label="Add behavior"
                              kind="outlined"
                              size="medium"
                              icon="pi pi-plus-circle"
                              :disabled="submitting || !canAddBehavior"
                              @click="addBehavior"
                            />
                            <span
                              v-if="!canAddBehavior"
                              class="text-body-sm text-(--text-muted)"
                            >
                              {{
                                form.behaviors.length >= 10
                                  ? 'A rule holds up to 10 behaviors.'
                                  : `${behaviorLabel(form.behaviors[form.behaviors.length - 1].type)} ends the rule. Nothing after it runs.`
                              }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </template>
                  </Card>
                </SettingsSection>

                <SettingsSection
                  title="Status"
                  hint="An inactive rule stays in the list and in its place in the order, but is skipped at runtime."
                >
                  <Card :padded="false">
                    <template #content>
                      <Item.List>
                        <SettingRow
                          title="Active"
                          description="Turn the rule on right after it is created."
                          kind="compact"
                        >
                          <Switch
                            v-model="form.active"
                            aria-label="Active"
                            :disabled="submitting"
                          />
                        </SettingRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsSection>
              </fieldset>
            </PanelContent>

            <PanelFooter>
              <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
                <div class="flex min-w-0 items-center gap-(--spacing-sm)"></div>
                <Button
                  label="Save"
                  kind="primary"
                  size="medium"
                  :loading="submitting"
                  type="submit"
                />
              </div>
            </PanelFooter>
          </form>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>

    <Toaster position="bottom-right" />
  </div>
</template>
