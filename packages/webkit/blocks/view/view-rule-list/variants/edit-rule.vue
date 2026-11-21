<script setup lang="ts">
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Combobox from '@aziontech/webkit/combobox'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Field from '@aziontech/webkit/field'
  import FieldDescription from '@aziontech/webkit/field-description'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  import { sampleApplicationRules } from '../sample'
  import ViewRuleList, { type RuleListPhase, type RuleListRule } from '../view-rule-list.vue'

  type Phase = RuleListPhase
  type Rule = RuleListRule

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

  const rules = ref<Rule[]>(sampleApplicationRules.map((item) => ({ ...item })))
  const saving = ref(false)
  const phaseLabel = (phase: Phase) => (phase === 'response' ? 'Response' : 'Request')

  const onSave = (_event: MouseEvent, next: Rule[]) => {
    if (saving.value) return
    saving.value = true
    setTimeout(() => {
      rules.value = next
      saving.value = false
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

  const byValue = Object.fromEntries(catalog.map((behavior) => [behavior.value, behavior]))
  const operatorLabel = (value: string) => OPERATORS.find((o) => o.value === value)?.label ?? ''
  const takesArgument = (operator: string) => operator !== 'exists' && operator !== 'does-not-exist'
  const behaviorLabel = (value: string) => byValue[value]?.label ?? ''
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
  const onDragstart = (scope: DragScope, index: number, event: DragEvent) => {
    dnd.scope = scope
    dnd.from = index
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', String(index))
      const row = (event.currentTarget as Element | null)?.closest?.('[data-drag-row]')
      if (row) event.dataTransfer.setDragImage(row, 12, 12)
    }
  }
  const onDragenter = (scope: DragScope, index: number) => {
    if (dnd.scope === scope) dnd.over = index
  }
  const onDragend = () => {
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
    onDragend()
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
  const addRule = (phase: Phase = 'request') => {
    newRulePhase.value = phase
    openRule(null)
  }

  let createdCount = 0
  const applyRule = () => {
    const row = editingRow.value
    if (row) {
      const updated: Rule = {
        ...row,
        name: form.name.trim(),
        description: form.description.trim(),
        active: form.active,
        modified: new Date(),
        author: 'You'
      }
      rules.value = rules.value.map((item) => (item.id === row.id ? updated : item))
      toast.success(`${updated.name} saved.`, {
        description: 'The rule runs with its new criteria and behaviors.'
      })
      return
    }
    const phase = form.phase
    const created: Rule = {
      id: `re-new-${(createdCount += 1)}`,
      name: form.name.trim(),
      description: form.description.trim(),
      phase,
      author: 'You',
      modified: new Date(),
      active: form.active,
      locked: false
    }
    rules.value = [...rules.value, created]
    toast.success(`${created.name} added.`, {
      description: `It runs last in the ${phaseLabel(phase)} phase. Move it to change when it runs.`,
      actions: [{ label: 'Edit', onClick: () => openRule(created) }]
    })
  }
</script>

<template>
  <ViewRuleList
    :rules="rules"
    :saving="saving"
    @edit="(_event, row) => openRule(row)"
    @create="(_event, phase) => addRule(phase)"
    @save="onSave"
  />

  <Drawer
    v-model:open="builderOpen"
    size="large"
    side="end"
  >
    <DrawerContent>
      <form
        ref="formEl"
        class="flex min-h-0 flex-1 flex-col"
        :aria-label="editing ? 'Edit Rule' : 'Add Rule'"
        novalidate
        @submit.prevent="submit"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>{{ editing ? 'Edit Rule' : 'Add Rule' }}</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">
              Handle the conditional execution of behaviors through logical operators.
            </p>
          </div>
        </PanelHeader>

        <PanelBody>
          <fieldset
            class="m-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">{{ editing ? 'Edit Rule' : 'Add Rule' }}</legend>
            <SettingsGroup
              label="General"
              hint="Names the rule in the list and in the deployment log."
            >
              <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                <Field
                  :disabled="submitting"
                  required
                  :invalid="nameError"
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
            </SettingsGroup>

            <SettingsGroup
              label="Phase"
              hint="When the rule runs. Request rules act on what arrives at the service; response rules act on what leaves it. The two are separate programs and never interleave."
            >
              <Card :padded="false">
                <template #default>
                  <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
                    <div class="flex flex-col gap-(--spacing-xs)">
                      <RadioGroup
                        v-model="form.phase"
                        variant="card"
                        name="rule-phase"
                        aria-label="Phase"
                        :disabled="submitting || editing"
                      >
                        <RadioGroup.Item
                          v-for="phase in BUILDER_PHASES"
                          :key="phase.value"
                          :value="phase.value"
                          :description="phase.description"
                          >{{ phase.label }}</RadioGroup.Item
                        >
                      </RadioGroup>
                      <FieldDescription v-if="editing"
                        >A rule’s phase is set when it is created. Create a rule in the other phase
                        to run these behaviors there.</FieldDescription
                      >
                    </div>
                  </div>
                </template>
              </Card>
            </SettingsGroup>

            <SettingsGroup
              label="Criteria"
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
                      :model-value="value"
                      :options="variablesForPhase"
                      size="large"
                      placeholder="${uri}"
                      empty-title="No variable matches. Type the one you need."
                      required
                      :invalid="invalid"
                      :disabled="submitting"
                      @update:model-value="update"
                    />
                  </div>
                </template>
                <template #cell-operator="{ value, update }">
                  <Select
                    :model-value="value"
                    size="large"
                    class="w-full"
                    :disabled="submitting"
                    :display-value="operatorLabel"
                    @update:model-value="update"
                  >
                    <Select.Trigger />
                    <Select.Content>
                      <Select.Item
                        v-for="op in OPERATORS"
                        :key="op.value"
                        :value="op.value"
                      >
                        {{ op.label }}
                      </Select.Item>
                    </Select.Content>
                  </Select>
                </template>
                <template #cell-argument="{ item, value, update }">
                  <Input
                    v-if="takesArgument(item.operator)"
                    key="argument"
                    :model-value="value"
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
            </SettingsGroup>

            <SettingsGroup
              label="Behaviors"
              hint="What the rule does when its criteria are met, run top to bottom in this order."
            >
              <Card :padded="false">
                <template #default>
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
                          class="relative grid grid-cols-1 items-start gap-(--spacing-xs) rounded-(--shape-card) transition-[opacity,scale,outline-color] motion-reduce:transition-none data-dragging:scale-[0.98] data-dragging:opacity-70 data-dragging:outline-2 data-dragging:outline-(--accent) data-dragging:outline-dashed data-drop:before:pointer-events-none data-drop:before:absolute data-drop:before:inset-x-0 data-drop:before:-top-(--spacing-2xs) data-drop:before:border-t-2 data-drop:before:border-(--accent) data-drop:before:content-[''] sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
                          @dragenter.prevent="onDragenter('behavior', bIdx)"
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
                              @update:model-value="setBehaviorType(bIdx, $event)"
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
                                    <template #leading>
                                      <i
                                        class="az az-search"
                                        aria-hidden="true"
                                      />
                                    </template>
                                  </Input>
                                </template>
                                <Select.Item
                                  v-for="option in behaviorMatches(behavior.id)"
                                  :key="option.value"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </Select.Item>
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
                                required
                                :invalid="
                                  argumentMissing(behavior, textArgument(behavior.type).field)
                                "
                              />
                            </template>

                            <template
                              v-else-if="behaviorArgument(behavior.type)?.kind === 'select'"
                            >
                              <div class="flex flex-col gap-(--spacing-2xs)">
                                <Select
                                  v-model="behavior[selectArgument(behavior.type).field]"
                                  size="large"
                                  class="w-full"
                                  :disabled="submitting"
                                  :placeholder="`Select a ${selectArgument(behavior.type).label.toLowerCase()}`"
                                  required
                                  :invalid="
                                    argumentMissing(behavior, selectArgument(behavior.type).field)
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
                                    <Select.Item
                                      v-for="option in optionsFor(
                                        selectArgument(behavior.type).source
                                      )"
                                      :key="option.value"
                                      :value="option.value"
                                    >
                                      {{ option.label }}
                                    </Select.Item>
                                  </Select.Content>
                                </Select>
                                <FieldDescription
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
                                </FieldDescription>
                              </div>
                            </template>

                            <template v-else-if="behaviorArgument(behavior.type)?.kind === 'group'">
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
                                  required
                                  :invalid="argumentMissing(behavior, part.field)"
                                />
                              </div>
                            </template>
                          </div>

                          <div class="flex items-center gap-(--spacing-2xs)">
                            <span
                              v-if="form.behaviors.length > 1"
                              role="button"
                              tabindex="0"
                              aria-label="Drag to reorder behavior, or use arrow keys"
                              draggable="true"
                              class="inline-flex size-10 shrink-0 cursor-grab items-center justify-center rounded-(--shape-button) text-(--text-muted) outline-none transition-colors hover:bg-(--bg-hover) hover:text-(--text-default) focus-visible:ring-2 focus-visible:ring-(--ring-color) active:cursor-grabbing motion-reduce:transition-none"
                              @dragstart="onDragstart('behavior', bIdx, $event)"
                              @dragend="onDragend"
                              @keydown.up.prevent="moveBehavior(bIdx, -1)"
                              @keydown.down.prevent="moveBehavior(bIdx, 1)"
                            >
                              <i
                                class="az az-menu"
                                aria-hidden="true"
                              />
                            </span>
                            <Tooltip content="Move behavior up">
                              <IconButton
                                icon="az az-chevron-up"
                                variant="outline"
                                size="large"
                                aria-label="Move behavior up"
                                :disabled="submitting || bIdx === 0"
                                @click="moveBehavior(bIdx, -1)"
                              />
                            </Tooltip>
                            <Tooltip content="Move behavior down">
                              <IconButton
                                icon="az az-chevron-down"
                                variant="outline"
                                size="large"
                                aria-label="Move behavior down"
                                :disabled="submitting || bIdx === form.behaviors.length - 1"
                                @click="moveBehavior(bIdx, 1)"
                              />
                            </Tooltip>
                            <Tooltip content="Remove behavior">
                              <IconButton
                                icon="az az-trash"
                                variant="outline"
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
                          variant="outline"
                          size="medium"
                          icon="az az-circle-plus"
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
            </SettingsGroup>

            <SettingsGroup
              label="Status"
              hint="An inactive rule stays in the list and in its place in the order, but is skipped at runtime."
            >
              <Card :padded="false">
                <template #default>
                  <Item.List>
                    <SettingsRow
                      title="Active"
                      description="Turn the rule on right after it is created."
                      variant="compact"
                    >
                      <Switch
                        v-model="form.active"
                        aria-label="Active"
                        :disabled="submitting"
                      />
                    </SettingsRow>
                  </Item.List>
                </template>
              </Card>
            </SettingsGroup>
          </fieldset>
        </PanelBody>

        <PanelFooter>
          <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
            <div class="flex min-w-0 items-center gap-(--spacing-sm)"></div>
            <Button
              label="Save"
              variant="primary"
              size="medium"
              :loading="submitting"
              type="submit"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
