<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Combobox from '@aziontech/webkit/combobox'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import Field from '@aziontech/webkit/field'
  import FieldDescription from '@aziontech/webkit/field-description'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

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
  type Condition = { variable: string; id: string; operator: string; argument: string }
  type RuleBehavior = { type: string; id: string; [field: string]: string }

  /** One condition: a variable compared with an argument. */
  export interface RuleBuilderCondition {
    /** The variable to compare, such as the request URI. */
    variable: string
    /** The comparison, such as is-equal or matches. */
    operator: string
    /** The value compared with; empty for exists and does-not-exist. */
    argument: string
  }

  /** One behavior: its type and the argument fields that type takes. */
  export interface RuleBuilderBehavior {
    /** The behavior, such as rewrite-request or set-cache-policy. */
    type: string
    /** The argument fields, such as target or cacheId. */
    [field: string]: string
  }

  /** A rule as the drawer opens on it, and the values Save sends. */
  export interface RuleBuilderRule {
    /** Names the rule in the list. */
    name: string
    /** A note for whoever reads the rule next. */
    description: string
    /** request or response. */
    phase: string
    /** Groups of conditions: every condition in a group must match, any one group is enough. */
    criteria: RuleBuilderCondition[][]
    /** What the rule does, top to bottom. */
    behaviors: RuleBuilderBehavior[]
    /** Whether the rule runs. */
    active: boolean
  }

  export interface RuleBuilderProps {
    /** The rule to edit: the drawer becomes Edit Rule with the phase locked. Left out, it adds a new rule. */
    rule?: RuleBuilderRule | null
    /** The save is in flight: the form locks and Save spins; when it ends with no error the drawer closes. */
    loading?: boolean
    /** Why the save failed, shown in the danger alert at the top of the drawer; the form is kept. */
    error?: string
    /** The drawer starts open. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<RuleBuilderProps>(), {
    rule: null,
    loading: false,
    error: '',
    defaultOpen: false
  })

  const emit = defineEmits<{
    submit: [event: Event, values: RuleBuilderRule]
  }>()
  type RuleForm = {
    name: string
    description: string
    phase: string
    criteria: Condition[][]
    behaviors: RuleBehavior[]
    active: boolean
  }

  const open = ref(props.defaultOpen)
  const editing = computed(() => props.rule !== null)

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
  const sources: Record<string, SelectOptionItem[]> = {
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
  const behaviorsFor = (phase: string) =>
    catalog.filter((behavior) => behavior.phases.includes(phase))
  const behaviorAllowedIn = (value: string, phase: string) =>
    Boolean(byValue[value]?.phases.includes(phase))
  const isTerminalBehavior = (value: string | undefined) =>
    ['deliver', 'deny', 'no-content', 'redirect-301', 'redirect-302'].includes(value ?? '')
  const behaviorOptions = (source: string, phase: string): SelectOptionItem[] => {
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
    variable: '',
    id: uid(),
    operator: 'is-equal',
    argument: ''
  })
  const criteriaColumns = [
    { key: 'variable', label: 'Variable', required: true },
    { key: 'operator', label: 'Operator' },
    { key: 'argument', label: 'Argument' }
  ]
  const newBehavior = (): RuleBehavior => ({ type: 'deliver', id: uid() })
  const blankForm = (): RuleForm => ({
    name: '',
    description: '',
    phase: PHASES[0].value,
    criteria: [[newCondition()]],
    behaviors: [newBehavior()],
    active: true
  })
  const formFor = (seed: RuleBuilderRule | null): RuleForm =>
    !seed
      ? blankForm()
      : {
          name: seed.name,
          description: seed.description,
          phase: seed.phase,
          criteria: seed.criteria.map((group) =>
            group.map((condition) => ({ ...condition, id: uid() }))
          ),
          behaviors: seed.behaviors.map((behavior) => ({ ...behavior, id: uid() })),
          active: seed.active
        }
  const valuesOf = (): RuleBuilderRule => ({
    name: form.name.trim(),
    description: form.description,
    phase: form.phase,
    criteria: form.criteria.map((group) =>
      group.map(({ variable, operator, argument }) => ({ variable, operator, argument }))
    ),
    behaviors: form.behaviors.map(({ id: _id, ...behavior }) => behavior),
    active: form.active
  })

  const form = reactive(blankForm())
  const submitted = ref(false)
  const submitting = computed(() => props.loading)
  const pending = ref(false)
  const saveError = ref('')
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
      Object.assign(form, formFor(props.rule))
      submitted.value = false
      pending.value = false
      saveError.value = ''
    },
    { immediate: true }
  )

  const title = computed(() => (editing.value ? 'Edit Rule' : 'Add Rule'))

  const behaviorsForPhase = computed(() =>
    behaviorsFor(form.phase).map(({ value, label }) => ({ value, label }))
  )
  const variablesForPhase = computed(() => variablesFor(form.phase))
  const behaviorColumns = [
    { key: 'type', label: 'Behavior', required: true },
    { key: 'argument', label: 'Argument' }
  ]

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

  const setBehaviorType = (index: number, type: string) => {
    if (form.behaviors[index].type === type) return
    form.behaviors[index] = { type, id: form.behaviors[index].id }
  }
  const argumentMissing = (behavior: RuleBehavior, field: string) =>
    submitted.value && !String(behavior[field] ?? '').trim()
  const lastBehaviorEnds = computed(() =>
    isTerminalBehavior(form.behaviors[form.behaviors.length - 1]?.type)
  )

  watch(
    () => form.phase,
    (phase) => {
      form.behaviors.forEach((behavior, index) => {
        if (!behaviorAllowedIn(behavior.type, phase)) {
          form.behaviors[index] = { type: 'deliver', id: behavior.id }
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

  watch(
    () => props.error,
    (message) => {
      if (open.value) saveError.value = message
    }
  )

  watch(
    () => props.loading,
    (now, was) => {
      if (!was || now || !pending.value) return
      pending.value = false
      if (props.error) {
        saveError.value = props.error
        return
      }
      open.value = false
    }
  )

  const submit = async (event: Event) => {
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
    saveError.value = ''
    emit('submit', event, valuesOf())
    await nextTick()
    if (props.loading) {
      pending.value = true
      return
    }
    if (props.error) {
      saveError.value = props.error
      return
    }
    open.value = false
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="end"
  >
    <DrawerTrigger>
      <Button
        v-if="editing"
        label="Edit Rule"
        icon="ai ai-pencil"
        variant="outline"
        size="medium"
      />
      <div
        v-else
        class="w-full md:w-fit"
      >
        <Button
          label="Add Rule"
          icon="ai ai-plus"
          variant="outline"
          size="medium"
          class="w-full"
        />
      </div>
    </DrawerTrigger>
    <DrawerContent>
      <form
        ref="formEl"
        class="flex min-h-0 flex-1 flex-col"
        :aria-label="title"
        novalidate
        @submit.prevent="submit"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>{{ title }}</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">
              Handle the conditional execution of behaviors through logical operators.
            </p>
          </div>
        </PanelHeader>

        <PanelBody>
          <div
            v-if="saveError"
            class="mb-(--spacing-md)"
          >
            <Alert
              severity="danger"
              :label="saveError"
              data-testid="rule-builder-save-error"
            />
          </div>
          <fieldset
            class="m-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">{{ title }}</legend>
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
                          v-for="phase in PHASES"
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
                reorderable
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
            </SettingsSection>

            <SettingsSection
              title="Behaviors"
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

                      <AttributeEditor
                        v-model:items="form.behaviors"
                        :definition="behaviorColumns"
                        :new-item="newBehavior"
                        :limit="10"
                        :min-items="1"
                        :add-disabled="lastBehaviorEnds"
                        :disabled="submitting"
                        reorderable
                        size="large"
                        add-button-label="Add behavior"
                        remove-button-label="Remove behavior"
                        aria-label="Behaviors"
                      >
                        <template #cell-type="{ item, index }">
                          <Select
                            :model-value="item.type"
                            size="large"
                            class="w-full"
                            :disabled="submitting"
                            :display-value="behaviorLabel"
                            @update:model-value="setBehaviorType(index, $event)"
                            @update:open="onBehaviorPanel(item.id, $event)"
                          >
                            <Select.Trigger />
                            <Select.Content>
                              <template #search>
                                <Input
                                  v-model="behaviorQuery[item.id]"
                                  size="medium"
                                  class="w-full"
                                  placeholder="Search behaviors"
                                  aria-label="Search behaviors"
                                  @keydown.stop
                                >
                                  <template #leading>
                                    <i
                                      class="ai ai-search"
                                      aria-hidden="true"
                                    />
                                  </template>
                                </Input>
                              </template>
                              <Select.Item
                                v-for="option in behaviorMatches(item.id)"
                                :key="option.value"
                                :value="option.value"
                              >
                                {{ option.label }}
                              </Select.Item>
                              <p
                                v-if="!behaviorMatches(item.id).length"
                                class="px-(--spacing-sm) py-(--spacing-xs) text-body-sm text-(--text-muted)"
                              >
                                No behavior matches “{{ behaviorQuery[item.id] }}”.
                              </p>
                            </Select.Content>
                          </Select>
                        </template>
                        <template #cell-argument="{ item, index }">
                          <template
                            v-for="argument in [behaviorArgument(item.type)]"
                            :key="item.type"
                          >
                            <Input
                              key="input-1"
                              v-if="argument?.kind === 'text'"
                              v-model="form.behaviors[index][argument.field]"
                              size="large"
                              class="w-full"
                              :aria-label="argument.label"
                              :placeholder="argument.placeholder"
                              :disabled="submitting"
                              :required="argumentMissing(item, argument.field)"
                            />
                            <div
                              v-else-if="argument?.kind === 'select'"
                              class="flex w-full flex-col gap-(--spacing-2xs)"
                            >
                              <Select
                                v-model="form.behaviors[index][argument.field]"
                                size="large"
                                class="w-full"
                                :disabled="submitting"
                                :placeholder="`Select a ${argument.label.toLowerCase()}`"
                                :required="argumentMissing(item, argument.field)"
                                :display-value="(value) => optionLabelIn(argument.source, value)"
                              >
                                <Select.Trigger :aria-label="argument.label" />
                                <Select.Content>
                                  <Select.Item
                                    v-for="option in optionsFor(argument.source)"
                                    :key="option.value"
                                    :value="option.value"
                                  >
                                    {{ option.label }}
                                  </Select.Item>
                                </Select.Content>
                              </Select>
                              <FieldDescription
                                v-if="behaviorArgumentNote(argument.source, form.phase)"
                              >
                                {{ behaviorArgumentNote(argument.source, form.phase) }}
                              </FieldDescription>
                            </div>
                            <div
                              v-else-if="argument?.kind === 'group'"
                              class="flex w-full flex-col gap-(--spacing-xs)"
                            >
                              <Input
                                v-for="part in argument.fields"
                                :key="part.field"
                                v-model="form.behaviors[index][part.field]"
                                size="large"
                                class="w-full"
                                :aria-label="part.label"
                                :placeholder="part.placeholder"
                                :disabled="submitting"
                                :required="argumentMissing(item, part.field)"
                              />
                            </div>
                            <Input
                              key="input-2"
                              v-else
                              model-value=""
                              size="large"
                              class="w-full"
                              placeholder="No argument"
                              disabled
                            />
                          </template>
                        </template>
                        <template
                          v-if="lastBehaviorEnds"
                          #info
                        >
                          {{ behaviorLabel(form.behaviors[form.behaviors.length - 1].type) }} ends
                          the rule. Nothing after it runs.
                        </template>
                      </AttributeEditor>
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
            </SettingsSection>
          </fieldset>
        </PanelBody>

        <PanelFooter>
          <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
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
