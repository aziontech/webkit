<script setup lang="ts">
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Combobox from '@aziontech/webkit/combobox'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import Field from '@aziontech/webkit/field'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import RadioButton from '@aziontech/webkit/radio-button'
  import Select from '@aziontech/webkit/select'
  import type { SelectValue } from '@aziontech/webkit/select-root'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  type Option = { value: string; label: string }
  type ArgumentInput = { field: string; placeholder: string; label: string }
  type BehaviorArgument =
    | ({ kind: 'text' } & ArgumentInput)
    | { kind: 'select'; field: string; source: string; label: string }
    | { kind: 'group'; fields: ArgumentInput[] }
  type BehaviorDefinition = {
    value: string
    label: string
    phases: string[]
    argument: BehaviorArgument | null
  }
  type Condition = { id: string; variable: string; operator: string; argument: string }
  type RuleBehavior = { id: string; type: string; [field: string]: string }
  type RuleSeed = {
    name: string
    description: string
    phase: string
    criteria: {
      conditions: { join: string | null; variable: string; operator: string; argument: string }[]
    }[]
    behaviors: { type: string; [field: string]: string }[]
    status: string
  }
  type RuleForm = {
    name: string
    description: string
    phase: string
    criteria: Condition[][]
    behaviors: RuleBehavior[]
    active: boolean
  }

  const open = ref(false)
  const editing = true
  const rule: RuleSeed = {
    name: 'Docs rewrite',
    description: 'Rewrites the docs path and caches it as a static asset.',
    phase: 'request',
    criteria: [
      {
        conditions: [{ join: null, variable: '${uri}', operator: 'matches', argument: '/docs/*' }]
      }
    ],
    behaviors: [
      { type: 'rewrite-request', target: '/documentation${uri}' },
      { type: 'set-cache-policy', cacheId: 'cs-static' }
    ],
    status: 'Active'
  }

  const PHASES = [
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
  const phaseVariables: Record<string, string[]> = {
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
  const sources: Record<string, Option[]> = {
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
  const behaviorsFor = (phase: string) =>
    catalog.filter((behavior) => behavior.phases.includes(phase))
  const behaviorAllowedIn = (value: string, phase: string) =>
    Boolean(byValue[value]?.phases.includes(phase))
  const isTerminalBehavior = (value: string | undefined) =>
    ['deliver', 'deny', 'no-content', 'redirect-301', 'redirect-302'].includes(value ?? '')
  const behaviorOptions = (source: string, phase: string): Option[] => {
    if (source === 'policies') {
      return policies
        .filter((policy) => phase !== 'response' || policy.scope === 'any')
        .map(({ value, label }) => ({ value, label }))
    }
    return sources[source] ?? []
  }
  const behaviorArgumentNote = (source: string, phase: string) =>
    source === 'policies' && phase === 'response'
      ? 'Only policies scoped to any phase run in the response phase.'
      : ''
  const variablesFor = (phase: string) =>
    [...variables, ...phaseVariables[phase]]
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({ value }))

  let nextId = 0
  const uid = () => String((nextId += 1))
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
  const newBehavior = (): RuleBehavior => ({ id: uid(), type: 'deliver' })
  const blankForm = (): RuleForm => ({
    name: '',
    description: '',
    phase: PHASES[0].value,
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
    open,
    (isOpen) => {
      if (!isOpen) return
      Object.assign(form, formFor(rule))
      submitted.value = false
    },
    { immediate: true }
  )

  const behaviorsForPhase = computed(() =>
    behaviorsFor(form.phase).map(({ value, label }) => ({ value, label }))
  )
  const variablesForPhase = computed(() => variablesFor(form.phase))
  const behaviorRows = computed(() =>
    form.behaviors.map((behavior) => ({ behavior, argument: behaviorArgument(behavior.type) }))
  )

  const behaviorQuery = reactive<Record<string, string>>({})
  const behaviorMatches = (id: string) => {
    const query = (behaviorQuery[id] ?? '').trim().toLowerCase()
    if (!query) return behaviorsForPhase.value
    return behaviorsForPhase.value.filter((option) => option.label.toLowerCase().includes(query))
  }
  const onBehaviorPanel = (id: string, isOpen: boolean) => {
    if (!isOpen) behaviorQuery[id] = ''
  }

  const optionsFor = (source: string) => behaviorOptions(source, form.phase)
  const optionLabelIn = (source: string, value: unknown) =>
    optionsFor(source).find((option) => option.value === value)?.label ?? ''

  const setBehaviorType = (index: number, type: SelectValue) => {
    if (form.behaviors[index].type === type) return
    form.behaviors[index] = { id: form.behaviors[index].id, type: String(type) }
  }
  const argumentMissing = (behavior: RuleBehavior, field: string) =>
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

  const dnd = reactive<{ scope: string | null; from: number; over: number }>({
    scope: null,
    from: -1,
    over: -1
  })
  const isDragging = (scope: string, index: number) => dnd.scope === scope && dnd.from === index
  const isDropTarget = (scope: string, index: number) =>
    dnd.scope === scope && dnd.over === index && dnd.from !== index
  const onDragStart = (scope: string, index: number, event: DragEvent) => {
    dnd.scope = scope
    dnd.from = index
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', String(index))
      const row = (event.currentTarget as HTMLElement | null)?.closest?.('[data-drag-row]')
      if (row) event.dataTransfer.setDragImage(row, 12, 12)
    }
  }
  const onDragEnter = (scope: string, index: number) => {
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

  const behaviorFilled = (behavior: RuleBehavior) => {
    const argument = behaviorArgument(behavior.type)
    if (!argument) return true
    const fields = argument.kind === 'group' ? argument.fields : [argument]
    return fields.every(({ field }) => String(behavior[field] ?? '').trim())
  }
  const isValid = () =>
    Boolean(form.name.trim()) &&
    form.criteria.every((group) => group.every((condition) => condition.variable.trim())) &&
    form.behaviors.length > 0 &&
    form.behaviors.every(behaviorFilled)
  const formEl = ref<HTMLFormElement | null>(null)
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
      open.value = false
    }, 900)
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="right"
  >
    <DrawerTrigger>
      <Button
        label="Edit Rule"
        icon="pi pi-pencil"
        kind="outlined"
        size="medium"
      />
    </DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          ref="formEl"
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Edit Rule"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <DrawerTitle>Edit Rule</DrawerTitle>
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
              <legend class="sr-only">Edit Rule</legend>
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
                          v-for="phase in PHASES"
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
                      :model-value="value as SelectValue"
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
                            v-for="({ behavior, argument }, bIdx) in behaviorRows"
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
                              <template v-if="argument?.kind === 'text'">
                                <Input
                                  v-model="behavior[argument.field]"
                                  size="large"
                                  class="w-full"
                                  :aria-label="argument.label"
                                  :placeholder="argument.placeholder"
                                  :disabled="submitting"
                                  :required="argumentMissing(behavior, argument.field)"
                                />
                              </template>

                              <template v-else-if="argument?.kind === 'select'">
                                <div class="flex flex-col gap-(--spacing-xxs)">
                                  <Select
                                    v-model="behavior[argument.field]"
                                    size="large"
                                    class="w-full"
                                    :disabled="submitting"
                                    :placeholder="`Select a ${argument.label.toLowerCase()}`"
                                    :required="argumentMissing(behavior, argument.field)"
                                    :display-value="
                                      (value) => optionLabelIn(argument.source, value)
                                    "
                                  >
                                    <Select.Trigger :aria-label="argument.label" />
                                    <Select.Content>
                                      <Select.Option
                                        v-for="option in optionsFor(argument.source)"
                                        :key="option.value"
                                        :value="option.value"
                                      >
                                        {{ option.label }}
                                      </Select.Option>
                                    </Select.Content>
                                  </Select>
                                  <HelperText
                                    v-if="behaviorArgumentNote(argument.source, form.phase)"
                                  >
                                    {{ behaviorArgumentNote(argument.source, form.phase) }}
                                  </HelperText>
                                </div>
                              </template>

                              <template v-else-if="argument?.kind === 'group'">
                                <div class="flex flex-col gap-(--spacing-xs)">
                                  <Input
                                    v-for="part in argument.fields"
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
</template>
