import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Divider from '@aziontech/webkit/divider'
import Drawer from '@aziontech/webkit/drawer'
import DrawerClose from '@aziontech/webkit/drawer-close'
import DrawerContent from '@aziontech/webkit/drawer-content'
import DrawerDescription from '@aziontech/webkit/drawer-description'
import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
import DrawerPortal from '@aziontech/webkit/drawer-portal'
import DrawerTitle from '@aziontech/webkit/drawer-title'
import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
import FieldSelect from '@aziontech/webkit/field-select'
import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'
import FieldText from '@aziontech/webkit/field-text'
import Hint from '@aziontech/webkit/hint'
import IconButton from '@aziontech/webkit/icon-button'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelFooter from '@aziontech/webkit/panel-footer'
import PanelHeader from '@aziontech/webkit/panel-header'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import Tooltip from '@aziontech/webkit/tooltip'
import { reactive, ref, watch } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import { declare } from './_forms-markup'

const PHASES = [
  {
    value: 'request',
    label: 'Request Phase',
    description: 'Configure the requests made to the edge.'
  },
  {
    value: 'response',
    label: 'Response Phase',
    description: 'Configure the responses delivered to end-users.'
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

const JOINS = [
  { label: 'And', value: 'and' },
  { label: 'Or', value: 'or' }
]

const BEHAVIORS = [
  {
    value: 'add-request-header',
    label: 'Add Request Header',
    argument: { label: 'Header', placeholder: 'header-name: value' }
  },
  { value: 'bypass-cache', label: 'Bypass Cache', argument: null },
  { value: 'deliver', label: 'Deliver', argument: null },
  { value: 'deny', label: 'Deny (403 Forbidden)', argument: null },
  { value: 'enable-gzip', label: 'Enable Gzip', argument: null },
  {
    value: 'filter-request-header',
    label: 'Filter Request Header',
    argument: { label: 'Header', placeholder: 'header-name' }
  },
  { value: 'forward-cookies', label: 'Forward Cookies', argument: null },
  { value: 'no-content', label: 'No Content (204)', argument: null },
  { value: 'optimize-images', label: 'Optimize Images', argument: null },
  { value: 'redirect-http-to-https', label: 'Redirect HTTP to HTTPS', argument: null },
  {
    value: 'redirect-301',
    label: 'Redirect To (301 Moved Permanently)',
    argument: { label: 'Location', placeholder: 'https://example.com${uri}' }
  },
  {
    value: 'redirect-302',
    label: 'Redirect To (302 Found)',
    argument: { label: 'Location', placeholder: 'https://example.com${uri}' }
  },
  {
    value: 'rewrite-request',
    label: 'Rewrite Request',
    argument: { label: 'Path', placeholder: 'URL-path' }
  }
]

const condition = (id, variable = '', operator = 'is-equal', argument = '', join = 'and') => ({
  id,
  join,
  variable,
  operator,
  argument
})

const DEFAULT_FORM = {
  name: '',
  description: '',
  phase: 'request',
  criteria: [{ id: 1, conditions: [condition(2)] }],
  behaviors: [{ id: 3, type: 'deliver', argument: '' }],
  active: true
}

const COMPOSED_FORM = {
  name: 'Docs rewrite',
  description: 'Rewrites the docs path and caches it as a static asset.',
  phase: 'request',
  criteria: [
    {
      id: 1,
      conditions: [
        condition(2, '${uri}', 'starts-with', '/docs'),
        condition(3, '${request_method}', 'is-equal', 'GET')
      ]
    },
    { id: 4, conditions: [condition(5, '${host}', 'matches', 'docs.*')] }
  ],
  behaviors: [
    { id: 6, type: 'rewrite-request', argument: '/documentation${uri}' },
    { id: 7, type: 'add-request-header', argument: 'x-docs-rewrite: true' },
    { id: 8, type: 'deliver', argument: '' }
  ],
  active: true
}

const ruleState = (initialForm) => {
  const open = ref(false)
  const submitted = ref(false)
  const form = reactive(structuredClone(initialForm))
  watch(open, (value) => {
    if (value) submitted.value = false
  })
  let nextId = 100
  const uid = () => (nextId += 1)
  const takesArgument = (operator) => operator !== 'exists' && operator !== 'does-not-exist'
  const argumentOf = (type) =>
    BEHAVIORS.find((behavior) => behavior.value === type)?.argument ?? null
  const addCondition = (group, join) =>
    group.conditions.push(condition(uid(), '', 'is-equal', '', join))
  const removeCondition = (groupIndex, index) => {
    const group = form.criteria[groupIndex]
    group.conditions.splice(index, 1)
    if (!group.conditions.length) form.criteria.splice(groupIndex, 1)
  }
  const addCriteria = () => form.criteria.push({ id: uid(), conditions: [condition(uid())] })
  const removeCriteria = (index) => form.criteria.splice(index, 1)
  const addBehavior = () => form.behaviors.push({ id: uid(), type: 'deliver', argument: '' })
  const removeBehavior = (index) => form.behaviors.splice(index, 1)
  const missing = (value) => submitted.value && !String(value ?? '').trim()
  const isValid = () =>
    Boolean(form.name.trim()) &&
    form.criteria.every((group) => group.conditions.every((c) => c.variable.trim())) &&
    form.behaviors.every((b) => !argumentOf(b.type) || b.argument.trim())
  const submit = () => {
    submitted.value = true
    if (isValid()) open.value = false
  }
  return {
    open,
    form,
    missing,
    submit,
    phases: PHASES,
    operators: OPERATORS,
    joins: JOINS,
    behaviors: BEHAVIORS,
    takesArgument,
    argumentOf,
    addCondition,
    removeCondition,
    addCriteria,
    removeCriteria,
    addBehavior,
    removeBehavior
  }
}

const scriptLines = (form) => [
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import Divider from '@aziontech/webkit/divider'",
  "import Drawer from '@aziontech/webkit/drawer'",
  "import DrawerClose from '@aziontech/webkit/drawer-close'",
  "import DrawerContent from '@aziontech/webkit/drawer-content'",
  "import DrawerDescription from '@aziontech/webkit/drawer-description'",
  "import DrawerOverlay from '@aziontech/webkit/drawer-overlay'",
  "import DrawerPortal from '@aziontech/webkit/drawer-portal'",
  "import DrawerTitle from '@aziontech/webkit/drawer-title'",
  "import DrawerTrigger from '@aziontech/webkit/drawer-trigger'",
  "import FieldRadioBlock from '@aziontech/webkit/field-radio-block'",
  "import FieldSelect from '@aziontech/webkit/field-select'",
  "import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'",
  "import FieldText from '@aziontech/webkit/field-text'",
  "import Hint from '@aziontech/webkit/hint'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import PanelContent from '@aziontech/webkit/panel-content'",
  "import PanelFooter from '@aziontech/webkit/panel-footer'",
  "import PanelHeader from '@aziontech/webkit/panel-header'",
  "import SegmentedButton from '@aziontech/webkit/segmented-button'",
  "import Tooltip from '@aziontech/webkit/tooltip'",
  "import { reactive, ref, watch } from 'vue'",
  '',
  'const open = ref(false)',
  'const submitted = ref(false)',
  declare('form', form, 'reactive'),
  '',
  declare('phases', PHASES),
  declare('operators', OPERATORS),
  declare('joins', JOINS),
  declare('behaviors', BEHAVIORS),
  '',
  'let nextId = 100',
  'const uid = () => (nextId += 1)',
  "const condition = (join = 'and') => ({ id: uid(), join, variable: '', operator: 'is-equal', argument: '' })",
  "const takesArgument = (operator) => operator !== 'exists' && operator !== 'does-not-exist'",
  'const argumentOf = (type) => behaviors.find((behavior) => behavior.value === type)?.argument ?? null',
  '',
  'const addCondition = (group, join) => group.conditions.push(condition(join))',
  'const removeCondition = (groupIndex, index) => {',
  '  const group = form.criteria[groupIndex]',
  '  group.conditions.splice(index, 1)',
  '  if (!group.conditions.length) form.criteria.splice(groupIndex, 1)',
  '}',
  'const addCriteria = () => form.criteria.push({ id: uid(), conditions: [condition()] })',
  'const removeCriteria = (index) => form.criteria.splice(index, 1)',
  "const addBehavior = () => form.behaviors.push({ id: uid(), type: 'deliver', argument: '' })",
  'const removeBehavior = (index) => form.behaviors.splice(index, 1)',
  '',
  "const missing = (value) => submitted.value && !String(value ?? '').trim()",
  'const isValid = () =>',
  '  Boolean(form.name.trim()) &&',
  '  form.criteria.every((group) => group.conditions.every((c) => c.variable.trim())) &&',
  '  form.behaviors.every((b) => !argumentOf(b.type) || b.argument.trim())',
  'const submit = () => {',
  '  submitted.value = true',
  '  if (isValid()) open.value = false',
  '}',
  '',
  'watch(open, (value) => {',
  '  if (value) submitted.value = false',
  '})'
]

const components = {
  Button,
  CardBox,
  Divider,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
  FieldRadioBlock,
  FieldSelect,
  FieldSwitchBlock,
  FieldText,
  Hint,
  IconButton,
  PanelContent,
  PanelFooter,
  PanelHeader,
  SegmentedButton,
  Tooltip
}

const section = (title, hint, body) => `<section class="flex min-w-0 flex-col gap-(--spacing-md)">
  <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
    <h2 class="text-heading-xxs text-(--text-default)">${title}</h2>
    <Hint text="${hint}" />
  </div>
${indent(body)}
</section>`

const GENERAL = section(
  'General',
  'Names the rule in the list and in the deployment log.',
  `<div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
  <FieldText
    v-model="form.name"
    label="Name"
    size="large"
    placeholder="My rule"
    :required="missing(form.name)"
    :helper-text="missing(form.name) ? 'Name is required.' : ''"
  />
  <FieldText v-model="form.description" label="Description" size="large" placeholder="Optional" />
</div>`
)

const PHASE = section(
  'Phase',
  'Whether the rule acts on the request that arrives or the response that leaves.',
  `<CardBox :padded="false">
  <template #content>
    <fieldset class="m-0 flex flex-col gap-(--spacing-xs) border-0 p-(--spacing-md)">
      <legend class="sr-only">Phase</legend>
      <FieldRadioBlock
        v-for="phase in phases"
        :key="phase.value"
        v-model="form.phase"
        :value="phase.value"
        name="rule-phase"
        :input-id="'rule-phase-' + phase.value"
        :label="phase.label"
        :description="phase.description"
      />
    </fieldset>
  </template>
</CardBox>`
)

const CRITERIA = section(
  'Criteria',
  'The conditions that decide whether the rule runs.',
  `<CardBox :padded="false">
  <template #content>
    <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
      <div v-for="(group, groupIndex) in form.criteria" :key="group.id" class="flex flex-col gap-(--spacing-sm)">
        <div class="flex min-h-8 items-center gap-(--spacing-xs)">
          <span class="text-overline-sm text-(--text-muted)">{{ groupIndex === 0 ? 'If' : 'Or' }}</span>
          <span class="h-px flex-1 bg-(--border-default)" />
          <Tooltip v-if="form.criteria.length > 1" text="Remove criteria">
            <IconButton icon="pi pi-trash" kind="outlined" size="small" aria-label="Remove criteria" @click="removeCriteria(groupIndex)" />
          </Tooltip>
        </div>
        <div class="ml-(--spacing-xs) flex flex-col gap-(--spacing-sm) rounded-bl-(--shape-card) border-b border-l border-(--border-muted) pb-(--spacing-md) pl-(--spacing-md)">
          <div v-for="(cond, index) in group.conditions" :key="cond.id" class="flex flex-col gap-(--spacing-xs)">
            <div v-if="index > 0" class="flex">
              <SegmentedButton v-model="cond.join" :options="joins" size="small" aria-label="Join with the previous condition" />
            </div>
            <div class="grid grid-cols-1 items-end gap-(--spacing-xs) sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
              <FieldText
                v-model="cond.variable"
                label="Variable"
                size="large"
                placeholder="\${uri}"
                :required="missing(cond.variable)"
                :helper-text="missing(cond.variable) ? 'Variable is required.' : ''"
              />
              <FieldSelect v-model="cond.operator" label="Operator" size="large" :options="operators" />
              <FieldText v-if="takesArgument(cond.operator)" v-model="cond.argument" label="Argument" size="large" placeholder="Value" />
              <span v-else />
              <Tooltip text="Remove condition">
                <IconButton
                  icon="pi pi-trash"
                  kind="outlined"
                  size="large"
                  aria-label="Remove condition"
                  :disabled="form.criteria.length === 1 && group.conditions.length === 1"
                  @click="removeCondition(groupIndex, index)"
                />
              </Tooltip>
            </div>
          </div>
          <div class="flex items-center gap-(--spacing-xs)">
            <Button type="button" label="And" kind="outlined" size="medium" icon="pi pi-plus-circle" @click="addCondition(group, 'and')" />
            <Button type="button" label="Or" kind="outlined" size="medium" icon="pi pi-plus-circle" @click="addCondition(group, 'or')" />
          </div>
        </div>
      </div>
      <Divider />
      <div>
        <Button type="button" label="Add criteria" kind="outlined" size="medium" icon="pi pi-plus-circle" @click="addCriteria" />
      </div>
    </div>
  </template>
</CardBox>`
)

const BEHAVIORS_SECTION = section(
  'Behaviors',
  'What the rule does when its criteria are met, run top to bottom in this order.',
  `<CardBox :padded="false">
  <template #content>
    <div class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
      <div class="flex items-center gap-(--spacing-xs)">
        <span class="text-overline-sm text-(--text-muted)">Then</span>
        <span class="h-px flex-1 bg-(--border-default)" />
      </div>
      <div class="flex flex-col gap-(--spacing-sm)">
        <div v-for="(behavior, index) in form.behaviors" :key="behavior.id" class="grid grid-cols-1 items-end gap-(--spacing-xs) sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
          <FieldSelect v-model="behavior.type" label="Behavior" size="large" :options="behaviors" />
          <FieldText
            v-if="argumentOf(behavior.type)"
            v-model="behavior.argument"
            :label="argumentOf(behavior.type).label"
            size="large"
            :placeholder="argumentOf(behavior.type).placeholder"
            :required="missing(behavior.argument)"
            :helper-text="missing(behavior.argument) ? argumentOf(behavior.type).label + ' is required.' : ''"
          />
          <span v-else />
          <Tooltip text="Remove behavior">
            <IconButton
              icon="pi pi-trash"
              kind="outlined"
              size="large"
              aria-label="Remove behavior"
              :disabled="form.behaviors.length === 1"
              @click="removeBehavior(index)"
            />
          </Tooltip>
        </div>
      </div>
      <div>
        <Button type="button" label="Add behavior" kind="outlined" size="medium" icon="pi pi-plus-circle" @click="addBehavior" />
      </div>
    </div>
  </template>
</CardBox>`
)

const STATUS = section(
  'Status',
  'An inactive rule stays in the list and in its place in the order, but is skipped at runtime.',
  '<FieldSwitchBlock v-model="form.active" label="Active" description="Turn the rule on right after it is created." />'
)

const TEMPLATE = `<Drawer v-model:open="open" side="right" size="large">
  <DrawerTrigger>
    <Button label="Add Rule" kind="outlined" size="large" icon="pi pi-plus" />
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
        <PanelHeader>
          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <DrawerTitle>Add Rule</DrawerTitle>
            <DrawerDescription>
              Handle the conditional execution of behaviors through logical operators.
            </DrawerDescription>
          </div>
          <DrawerClose />
        </PanelHeader>
        <PanelContent>
          <fieldset class="m-0 flex min-w-0 flex-col gap-(--layout-section-gap) border-0 p-0">
            <legend class="sr-only">Add Rule</legend>
${indent([GENERAL, PHASE, CRITERIA, BEHAVIORS_SECTION, STATUS].join('\n\n'), 6)}
          </fieldset>
        </PanelContent>
        <PanelFooter>
          <div class="ml-auto flex items-center gap-(--spacing-sm)">
            <Button type="button" label="Cancel" kind="outlined" size="medium" @click="open = false" />
            <Button label="Save" kind="primary" size="medium" @click="submit" />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </DrawerPortal>
</Drawer>`

const meta = {
  title: 'Templates/Platform/Forms/RulesEngine',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Rules Engine rule form, the console’s richest form: a large right-side drawer opened from the Add Rule action with General, Phase, Criteria, Behaviors and Status sections. Required fields show their required state only after Save is pressed with them empty, never on first render. Criteria are groups of variable, operator and argument rows joined by And or Or, read as If / Or across groups; behaviors are a Then list whose rows change their argument field with the behavior picked. The Rules Engine tab of an application and of a firewall opens it. Built from `Drawer` and its parts, `PanelHeader`, `PanelContent`, `PanelFooter`, `FieldText`, `FieldSelect`, `FieldRadioBlock`, `FieldSwitchBlock`, `SegmentedButton`, `CardBox`, `Divider`, `Hint`, `IconButton`, `Tooltip` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: () => ruleState(DEFAULT_FORM),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Closed until the Add Rule button opens it: an empty rule with one criterion and one Deliver behavior, the Request phase selected and the rule active.'
      },
      source: { code: toSfc(scriptLines(DEFAULT_FORM), TEMPLATE) }
    }
  }
}

export const Composed = {
  render: () => ({
    components,
    setup: () => ruleState(COMPOSED_FORM),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The Docs rewrite rule as the console seeds it: two criteria groups, the first holding two And-joined conditions, over three behaviors that rewrite the path, add a header and deliver.'
      },
      source: { code: toSfc(scriptLines(COMPOSED_FORM), TEMPLATE) }
    }
  }
}
