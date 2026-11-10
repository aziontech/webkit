<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Separator from '@aziontech/webkit/separator'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import FieldText from '@aziontech/webkit/field-text'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Select from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref, watch } from 'vue'

  const open = ref(false)
  const editing = false
  const rule = null

  const PHASES = [
    {
      value: 'request',
      label: 'Request Phase',
      description: 'Configure the requests the service receives.'
    },
    {
      value: 'response',
      label: 'Response Phase',
      description: 'Configure the responses sent back to clients.'
    }
  ]
  const phaseHint =
    'When the rule runs. Request rules act on what arrives at the service; response rules act on what leaves it. The two are separate programs and never interleave.'
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
  const catalog = [
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
  const phaseVariables = {
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
  const operatorLabel = (value) => OPERATORS.find((o) => o.value === value)?.label ?? ''
  const takesArgument = (operator) => operator !== 'exists' && operator !== 'does-not-exist'
  const operatorArgument = () => ({ kind: 'text' })
  const behaviorLabel = (value) => byValue[value]?.label ?? ''
  const behaviorArgument = (value) => byValue[value]?.argument ?? null
  const behaviorsFor = (phase) => catalog.filter((behavior) => behavior.phases.includes(phase))
  const behaviorAllowedIn = (value, phase) => Boolean(byValue[value]?.phases.includes(phase))
  const isTerminalBehavior = (value) =>
    ['deliver', 'deny', 'no-content', 'redirect-301', 'redirect-302'].includes(value)
  const behaviorOptions = (source, phase) => {
    if (source === 'policies') {
      return policies
        .filter((policy) => phase !== 'response' || policy.scope === 'any')
        .map(({ value, label }) => ({ value, label }))
    }
    return sources[source] ?? []
  }
  const behaviorArgumentNote = (source, phase) =>
    source === 'policies' && phase === 'response'
      ? 'Only policies scoped to any phase run in the response phase.'
      : ''
  const variablesFor = (phase) =>
    [...variables, ...phaseVariables[phase]]
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({ value }))

  let nextId = 0
  const uid = () => (nextId += 1)
  const newCondition = (join = null) => ({
    id: uid(),
    join,
    variable: '',
    operator: 'is-equal',
    argument: ''
  })
  const newGroup = () => ({ id: uid(), conditions: [newCondition()] })
  const newBehavior = () => ({ id: uid(), type: 'deliver' })
  const blankForm = () => ({
    name: '',
    description: '',
    phase: PHASES[0].value,
    criteria: [newGroup()],
    behaviors: [newBehavior()],
    active: true
  })
  const formFor = (seed) =>
    !seed
      ? blankForm()
      : {
          name: seed.name,
          description: seed.description,
          phase: seed.phase,
          criteria: seed.criteria.map((group) => ({
            id: uid(),
            conditions: group.conditions.map((condition) => ({ ...condition, id: uid() }))
          })),
          behaviors: seed.behaviors.map((behavior) => ({ ...behavior, id: uid() })),
          active: seed.status === 'Active'
        }

  const form = reactive(blankForm())
  const submitted = ref(false)
  const submitting = ref(false)
  const nameError = computed(() => submitted.value && !form.name.trim())
  const totalConditions = computed(() =>
    form.criteria.reduce((sum, group) => sum + group.conditions.length, 0)
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

  const behaviorQuery = reactive({})
  const behaviorMatches = (id) => {
    const query = (behaviorQuery[id] ?? '').trim().toLowerCase()
    if (!query) return behaviorsForPhase.value
    return behaviorsForPhase.value.filter((option) => option.label.toLowerCase().includes(query))
  }
  const onBehaviorPanel = (id, isOpen) => {
    if (!isOpen) behaviorQuery[id] = ''
  }

  const variableOpen = ref(null)
  const variableTyping = ref(false)
  const variableMatches = (condition) => {
    const query = variableTyping.value ? condition.variable.trim().toLowerCase() : ''
    if (!query) return variablesForPhase.value
    return variablesForPhase.value.filter((option) => option.value.toLowerCase().includes(query))
  }
  const openVariables = (condition) => {
    variableTyping.value = false
    variableOpen.value = condition.id
  }
  const pickVariable = (condition, option) => {
    condition.variable = option.value
    variableTyping.value = false
    variableOpen.value = null
  }

  const optionsFor = (source) => behaviorOptions(source, form.phase)
  const optionLabelIn = (source, value) =>
    optionsFor(source).find((option) => option.value === value)?.label ?? ''

  const setBehaviorType = (index, type) => {
    if (form.behaviors[index].type === type) return
    form.behaviors[index] = { id: form.behaviors[index].id, type }
  }
  const argumentMissing = (behavior, field) =>
    submitted.value && !String(behavior[field] ?? '').trim()
  const canAddBehavior = computed(() => {
    if (form.behaviors.length >= 10) return false
    return !isTerminalBehavior(form.behaviors[form.behaviors.length - 1]?.type)
  })
  const canAddCriteria = computed(() => form.criteria.length < 5)
  const canAddCondition = (group) => group.conditions.length < 10

  const setConditionOperator = (condition, operator) => {
    condition.operator = operator
  }

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

  const addCondition = (group, join) => group.conditions.push(newCondition(join))
  const addCriteria = () => form.criteria.push(newGroup())
  const move = (list, index, direction) => {
    const target = index + direction
    if (target < 0 || target >= list.length) return
    const [moved] = list.splice(index, 1)
    list.splice(target, 0, moved)
  }
  const moveCriteria = (index, direction) => move(form.criteria, index, direction)
  const removeCondition = (groupIndex, condIndex) => {
    if (totalConditions.value <= 1) return
    const group = form.criteria[groupIndex]
    group.conditions.splice(condIndex, 1)
    if (group.conditions.length === 0) form.criteria.splice(groupIndex, 1)
    else if (condIndex === 0) group.conditions[0].join = null
  }
  const moveCondition = (groupIndex, condIndex, direction) => {
    move(form.criteria[groupIndex].conditions, condIndex, direction)
    form.criteria[groupIndex].conditions[0].join = null
  }
  const addBehavior = () => form.behaviors.push(newBehavior())
  const removeBehavior = (index) => {
    if (form.behaviors.length <= 1) return
    form.behaviors.splice(index, 1)
  }
  const moveBehavior = (index, direction) => move(form.behaviors, index, direction)

  const dnd = reactive({ scope: null, from: -1, over: -1 })
  const isDragging = (scope, index) => dnd.scope === scope && dnd.from === index
  const isDropTarget = (scope, index) =>
    dnd.scope === scope && dnd.over === index && dnd.from !== index
  const onDragStart = (scope, index, event) => {
    dnd.scope = scope
    dnd.from = index
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', String(index))
      const row = event.currentTarget?.closest?.('[data-drag-row]')
      if (row) event.dataTransfer.setDragImage(row, 12, 12)
    }
  }
  const onDragEnter = (scope, index) => {
    if (dnd.scope === scope) dnd.over = index
  }
  const onDragEnd = () => {
    dnd.scope = null
    dnd.from = -1
    dnd.over = -1
  }
  const reorder = (list, from, to) => {
    if (from < 0 || to < 0 || from === to || from >= list.length || to >= list.length) return
    const [moved] = list.splice(from, 1)
    list.splice(to, 0, moved)
  }
  const dropOnCondition = (groupIndex, index) => {
    if (dnd.scope !== 'cond-' + groupIndex) return
    reorder(form.criteria[groupIndex].conditions, dnd.from, index)
    form.criteria[groupIndex].conditions[0].join = null
    onDragEnd()
  }
  const dropOnBehavior = (index) => {
    if (dnd.scope !== 'behavior') return
    reorder(form.behaviors, dnd.from, index)
    onDragEnd()
  }
  const dropOnCriteria = (index) => {
    if (dnd.scope !== 'criteria') return
    reorder(form.criteria, dnd.from, index)
    onDragEnd()
  }

  const behaviorFilled = (behavior) => {
    const argument = behaviorArgument(behavior.type)
    if (!argument) return true
    const fields = argument.kind === 'group' ? argument.fields : [argument]
    return fields.every(({ field }) => String(behavior[field] ?? '').trim())
  }
  const isValid = () =>
    Boolean(form.name.trim()) &&
    form.criteria.every((group) => group.conditions.every((c) => c.variable.trim())) &&
    form.behaviors.length > 0 &&
    form.behaviors.every(behaviorFilled)
  const submit = () => {
    submitted.value = true
    if (submitting.value || !isValid()) return
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
      <div class="w-full md:w-fit">
        <Button
          label="Add Rule"
          icon="pi pi-plus"
          kind="outlined"
          size="medium"
          class="w-full"
        />
      </div>
    </DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Add Rule"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <DrawerTitle>Add Rule</DrawerTitle>
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
              <legend class="sr-only">Add Rule</legend>
              <SettingsSection
                title="General"
                hint="Names the rule in the list and in the deployment log."
              >
                <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
                  <FieldText
                    v-model="form.name"
                    label="Name"
                    input-id="rule-name"
                    size="large"
                    placeholder="My rule"
                    :disabled="submitting"
                    :helper-text="nameError ? 'Name is required.' : ''"
                    :required="nameError"
                  />

                  <FieldText
                    v-model="form.description"
                    label="Description"
                    input-id="rule-description"
                    size="large"
                    placeholder="Optional"
                    :disabled="submitting"
                    helper-text="For whoever reads this rule next. It never affects what the rule does."
                  />
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
                        <FieldRadioBlock
                          v-for="phase in PHASES"
                          :key="phase.value"
                          v-model="form.phase"
                          :value="phase.value"
                          name="rule-phase"
                          :input-id="`rule-phase-${phase.value}`"
                          :label="phase.label"
                          :description="phase.description"
                          :disabled="submitting || editing"
                        />
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
                hint="The conditions that decide whether the rule runs."
              >
                <Card :padded="false">
                  <template #content>
                    <div>
                      <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
                        <div class="relative flex flex-col gap-(--spacing-lg)">
                          <div
                            v-for="(group, gIdx) in form.criteria"
                            :key="group.id"
                            data-drag-row
                            :data-dragging="isDragging('criteria', gIdx) || null"
                            :data-drop="isDropTarget('criteria', gIdx) || null"
                            :class="['flex flex-col gap-(--spacing-sm)', dragRowClass]"
                            @dragenter.prevent="onDragEnter('criteria', gIdx)"
                            @dragover.prevent
                            @drop="dropOnCriteria(gIdx)"
                          >
                            <div class="flex min-h-8 items-center gap-(--spacing-xs)">
                              <span
                                v-if="form.criteria.length > 1"
                                role="button"
                                tabindex="0"
                                aria-label="Drag to reorder criteria, or use arrow keys"
                                draggable="true"
                                :class="[GRIP_CLASS, 'size-8']"
                                @dragstart="onDragStart('criteria', gIdx, $event)"
                                @dragend="onDragEnd"
                                @keydown.up.prevent="moveCriteria(gIdx, -1)"
                                @keydown.down.prevent="moveCriteria(gIdx, 1)"
                              >
                                <i
                                  class="pi pi-bars"
                                  aria-hidden="true"
                                />
                              </span>
                              <span class="text-overline-sm text-(--text-muted)">
                                {{ gIdx === 0 ? 'If' : 'Or' }}
                              </span>
                              <span class="h-px flex-1 bg-(--border-default)" />
                              <div
                                v-if="form.criteria.length > 1"
                                class="flex items-center gap-(--spacing-xxs)"
                              >
                                <Tooltip text="Move criteria up">
                                  <IconButton
                                    icon="pi pi-chevron-up"
                                    kind="outlined"
                                    size="small"
                                    aria-label="Move criteria up"
                                    :disabled="submitting || gIdx === 0"
                                    @click="moveCriteria(gIdx, -1)"
                                  />
                                </Tooltip>
                                <Tooltip text="Move criteria down">
                                  <IconButton
                                    icon="pi pi-chevron-down"
                                    kind="outlined"
                                    size="small"
                                    aria-label="Move criteria down"
                                    :disabled="submitting || gIdx === form.criteria.length - 1"
                                    @click="moveCriteria(gIdx, 1)"
                                  />
                                </Tooltip>
                              </div>
                            </div>

                            <div
                              class="ml-(--spacing-xs) flex flex-col gap-(--spacing-sm) rounded-bl-(--shape-card) border-b-(length:--border-width-default) border-l-(length:--border-width-default) border-(--border-muted) pb-(--spacing-md) pl-(--spacing-md)"
                            >
                              <div class="relative flex flex-col gap-(--spacing-sm)">
                                <div
                                  v-for="(cond, cIdx) in group.conditions"
                                  :key="cond.id"
                                  data-drag-row
                                  :data-dragging="isDragging('cond-' + gIdx, cIdx) || null"
                                  :data-drop="isDropTarget('cond-' + gIdx, cIdx) || null"
                                  :class="['flex flex-col gap-(--spacing-xxs)', dragRowClass]"
                                  @dragenter.prevent="onDragEnter('cond-' + gIdx, cIdx)"
                                  @dragover.prevent
                                  @drop="dropOnCondition(gIdx, cIdx)"
                                >
                                  <span
                                    v-if="cIdx > 0"
                                    class="text-label-sm text-(--text-muted)"
                                  >
                                    {{ cond.join === 'or' ? 'Or' : 'And' }}
                                  </span>
                                  <div
                                    class="grid grid-cols-1 items-start gap-(--spacing-xs) sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
                                  >
                                    <div class="relative w-full">
                                      <div class="contents font-code">
                                        <Input
                                          v-model="cond.variable"
                                          size="large"
                                          placeholder="${uri}"
                                          :disabled="submitting"
                                          :required="submitted && !cond.variable.trim()"
                                          class="w-full"
                                          role="combobox"
                                          autocomplete="off"
                                          aria-autocomplete="list"
                                          aria-label="Variable"
                                          :aria-expanded="
                                            variableOpen === cond.id && variablesForPhase.length > 0
                                          "
                                          :aria-controls="`rule-variables-${cond.id}`"
                                          @focus="openVariables(cond)"
                                          @input="variableTyping = true"
                                          @blur="variableOpen = null"
                                        >
                                          <template #iconLeft>
                                            <i
                                              class="pi pi-search"
                                              aria-hidden="true"
                                            />
                                          </template>
                                        </Input>
                                      </div>
                                      <Transition
                                        enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
                                        leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
                                      >
                                        <div
                                          v-if="
                                            variableOpen === cond.id && variablesForPhase.length
                                          "
                                          :id="`rule-variables-${cond.id}`"
                                          role="listbox"
                                          class="absolute inset-x-0 top-full z-(--z-input-overlay) mt-1 flex max-h-(--size-80) flex-col overflow-hidden rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) shadow-(--shadow-xs)"
                                        >
                                          <div class="flex max-h-60">
                                            <ScrollArea class="w-full">
                                              <div
                                                class="flex flex-col items-stretch px-(--spacing-xxs) py-(--spacing-xs)"
                                              >
                                                <div
                                                  v-for="option in variableMatches(cond)"
                                                  :key="option.value"
                                                  role="option"
                                                  :aria-selected="cond.variable === option.value"
                                                  :data-selected="
                                                    cond.variable === option.value || null
                                                  "
                                                  class="flex h-8 cursor-pointer select-none items-center gap-(--spacing-xs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-(--bg-hover) data-active:bg-(--bg-hover) data-selected:bg-(--bg-selected)"
                                                  @mousedown.prevent="pickVariable(cond, option)"
                                                >
                                                  <span
                                                    class="min-w-0 flex-auto truncate text-left"
                                                    >{{ option.value }}</span
                                                  >
                                                </div>
                                                <p
                                                  v-if="!variableMatches(cond).length"
                                                  class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
                                                >
                                                  No variable matches — type the one you need.
                                                </p>
                                              </div>
                                            </ScrollArea>
                                          </div>
                                        </div>
                                      </Transition>
                                    </div>

                                    <Select
                                      :model-value="cond.operator"
                                      size="large"
                                      class="w-full"
                                      :disabled="submitting"
                                      :display-value="operatorLabel"
                                      @update:model-value="setConditionOperator(cond, $event)"
                                    >
                                      <Select.Trigger aria-label="Operator" />
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

                                    <Select
                                      v-if="
                                        takesArgument(cond.operator) &&
                                        operatorArgument(cond.operator).kind === 'select'
                                      "
                                      v-model="cond.argument"
                                      size="large"
                                      class="w-full"
                                      :disabled="submitting"
                                      :placeholder="`Select a ${operatorArgument(cond.operator).label.toLowerCase()}`"
                                      :display-value="
                                        (value) =>
                                          optionLabelIn(
                                            operatorArgument(cond.operator).source,
                                            value
                                          )
                                      "
                                    >
                                      <Select.Trigger
                                        :aria-label="operatorArgument(cond.operator).label"
                                      />
                                      <Select.Content>
                                        <Select.Option
                                          v-for="option in optionsFor(
                                            operatorArgument(cond.operator).source
                                          )"
                                          :key="option.value"
                                          :value="option.value"
                                        >
                                          {{ option.label }}
                                        </Select.Option>
                                      </Select.Content>
                                    </Select>
                                    <Input
                                      v-else-if="takesArgument(cond.operator)"
                                      v-model="cond.argument"
                                      size="large"
                                      class="w-full"
                                      aria-label="Argument"
                                      :disabled="submitting"
                                    />
                                    <span v-else />

                                    <div class="flex items-center gap-(--spacing-xxs)">
                                      <span
                                        v-if="group.conditions.length > 1"
                                        role="button"
                                        tabindex="0"
                                        aria-label="Drag to reorder condition, or use arrow keys"
                                        draggable="true"
                                        :class="[GRIP_CLASS, 'size-10']"
                                        @dragstart="onDragStart('cond-' + gIdx, cIdx, $event)"
                                        @dragend="onDragEnd"
                                        @keydown.up.prevent="moveCondition(gIdx, cIdx, -1)"
                                        @keydown.down.prevent="moveCondition(gIdx, cIdx, 1)"
                                      >
                                        <i
                                          class="pi pi-bars"
                                          aria-hidden="true"
                                        />
                                      </span>
                                      <Tooltip text="Move condition up">
                                        <IconButton
                                          icon="pi pi-chevron-up"
                                          kind="outlined"
                                          size="large"
                                          aria-label="Move condition up"
                                          :disabled="submitting || cIdx === 0"
                                          @click="moveCondition(gIdx, cIdx, -1)"
                                        />
                                      </Tooltip>
                                      <Tooltip text="Move condition down">
                                        <IconButton
                                          icon="pi pi-chevron-down"
                                          kind="outlined"
                                          size="large"
                                          aria-label="Move condition down"
                                          :disabled="
                                            submitting || cIdx === group.conditions.length - 1
                                          "
                                          @click="moveCondition(gIdx, cIdx, 1)"
                                        />
                                      </Tooltip>
                                      <Tooltip text="Remove condition">
                                        <IconButton
                                          icon="pi pi-trash"
                                          kind="outlined"
                                          size="large"
                                          aria-label="Remove condition"
                                          :disabled="submitting || totalConditions <= 1"
                                          @click="removeCondition(gIdx, cIdx)"
                                        />
                                      </Tooltip>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div class="flex items-center gap-(--spacing-xs)">
                                <Button
                                  type="button"
                                  label="And"
                                  kind="outlined"
                                  size="medium"
                                  icon="pi pi-plus-circle"
                                  :disabled="submitting || !canAddCondition(group)"
                                  @click="addCondition(group, 'and')"
                                />
                                <Button
                                  type="button"
                                  label="Or"
                                  kind="outlined"
                                  size="medium"
                                  icon="pi pi-plus-circle"
                                  :disabled="submitting || !canAddCondition(group)"
                                  @click="addCondition(group, 'or')"
                                />
                                <span
                                  v-if="!canAddCondition(group)"
                                  class="text-body-sm text-(--text-muted)"
                                >
                                  Each criteria holds up to 10 conditions.
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div class="flex flex-wrap items-center gap-(--spacing-sm)">
                          <Button
                            type="button"
                            label="Add criteria"
                            kind="outlined"
                            size="medium"
                            icon="pi pi-plus-circle"
                            :disabled="submitting || !canAddCriteria"
                            @click="addCriteria"
                          />
                          <span
                            v-if="!canAddCriteria"
                            class="text-body-sm text-(--text-muted)"
                          >
                            A rule holds up to 5 criteria.
                          </span>
                        </div>
                      </div>
                    </div>
                  </template>
                </Card>
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
                              <template v-if="behaviorArgument(behavior.type)?.kind === 'text'">
                                <Input
                                  v-model="behavior[behaviorArgument(behavior.type).field]"
                                  size="large"
                                  class="w-full"
                                  :aria-label="behaviorArgument(behavior.type).label"
                                  :placeholder="behaviorArgument(behavior.type).placeholder"
                                  :disabled="submitting"
                                  :required="
                                    argumentMissing(behavior, behaviorArgument(behavior.type).field)
                                  "
                                />
                              </template>

                              <template
                                v-else-if="behaviorArgument(behavior.type)?.kind === 'select'"
                              >
                                <div class="flex flex-col gap-(--spacing-xxs)">
                                  <Select
                                    v-model="behavior[behaviorArgument(behavior.type).field]"
                                    size="large"
                                    class="w-full"
                                    :disabled="submitting"
                                    :placeholder="`Select a ${behaviorArgument(behavior.type).label.toLowerCase()}`"
                                    :required="
                                      argumentMissing(
                                        behavior,
                                        behaviorArgument(behavior.type).field
                                      )
                                    "
                                    :display-value="
                                      (value) =>
                                        optionLabelIn(behaviorArgument(behavior.type).source, value)
                                    "
                                  >
                                    <Select.Trigger
                                      :aria-label="behaviorArgument(behavior.type).label"
                                    />
                                    <Select.Content>
                                      <Select.Option
                                        v-for="option in optionsFor(
                                          behaviorArgument(behavior.type).source
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
                                        behaviorArgument(behavior.type).source,
                                        form.phase
                                      )
                                    "
                                  >
                                    {{
                                      behaviorArgumentNote(
                                        behaviorArgument(behavior.type).source,
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
                                    v-for="part in behaviorArgument(behavior.type).fields"
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
