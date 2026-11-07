import Button from '@aziontech/webkit/button'
import Drawer from '@aziontech/webkit/drawer'
import DrawerClose from '@aziontech/webkit/drawer-close'
import DrawerContent from '@aziontech/webkit/drawer-content'
import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
import DrawerPortal from '@aziontech/webkit/drawer-portal'
import DrawerTitle from '@aziontech/webkit/drawer-title'
import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
import FieldInputGroup from '@aziontech/webkit/field-input-group'
import FieldText from '@aziontech/webkit/field-text'
import FieldTextarea from '@aziontech/webkit/field-textarea'
import HelperText from '@aziontech/webkit/helper-text'
import Hint from '@aziontech/webkit/hint'
import InputNumber from '@aziontech/webkit/input-number'
import Label from '@aziontech/webkit/label'
import Link from '@aziontech/webkit/link'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelFooter from '@aziontech/webkit/panel-footer'
import PanelHeader from '@aziontech/webkit/panel-header'
import Select from '@aziontech/webkit/select'
import { computed, reactive, ref, watch } from 'vue'

import { toSfc } from '../../_shared/story-source'
import {
  declare,
  DRAWER_SHELL_IMPORTS,
  drawerShell,
  fieldStack,
  headingAction,
  section
} from './_forms-markup'

const RECORD_TYPES = [
  {
    value: 'A',
    label: 'A - IPv4 Address',
    placeholder: '192.0.2.1',
    valueHelper: 'Accepts an IPv4 address.'
  },
  {
    value: 'AAAA',
    label: 'AAAA - IPv6 Address',
    placeholder: '2001:db8::1',
    valueHelper: 'Accepts an IPv6 address.'
  },
  {
    value: 'CNAME',
    label: 'CNAME - Canonical Name',
    placeholder: 'example.com',
    valueHelper: 'Accepts a single hostname.'
  },
  {
    value: 'MX',
    label: 'MX - Mail Exchange',
    placeholder: '10 mail.example.com',
    valueHelper: 'Accepts a priority and a mail server, e.g. 10 mail.example.com.'
  },
  {
    value: 'TXT',
    label: 'TXT - Text',
    placeholder: 'v=spf1 include:example.com ~all',
    valueHelper: 'Accepts free-form text.'
  },
  {
    value: 'NS',
    label: 'NS - Nameserver',
    placeholder: 'ns1.example.com',
    valueHelper: 'Accepts a nameserver hostname.'
  }
]

const POLICY_TYPES = [
  { value: 'simple', label: 'Simple' },
  { value: 'weighted', label: 'Weighted' }
]

const BLANK_FORM = {
  name: '',
  type: 'A',
  ttl: 3600,
  value: '',
  description: '',
  policy: 'simple',
  weight: 100
}

const selectControl = ({ model, id, ariaLabel, displayValue, options, item }) => `<Select
  v-model="${model}"
  size="large"
  class="w-full"
  :disabled="submitting"
  :display-value="${displayValue}"
>
  <Select.Trigger id="${id}" aria-label="${ariaLabel}" />
  <Select.Content>
    <Select.Option v-for="${item} in ${options}" :key="${item}.value" :value="${item}.value">
      {{ ${item}.label }}
    </Select.Option>
  </Select.Content>
</Select>`

const NAME_FIELD = fieldStack({
  component: 'FieldInputGroup',
  label: 'Name',
  id: 'record-name',
  description: 'Use @ to create a record for the root domain.',
  message: 'errors.name',
  attrs: `v-model="form.name"
placeholder="subdomain"
:disabled="submitting"
@update:model-value="errors.name = ''"`,
  slots: '<template #right>.edgeflow.com</template>'
})

const TYPE_FIELD = fieldStack({
  label: 'Record type',
  id: 'record-type',
  descriptionSlot: `<Link
  label="Read more about record types"
  size="medium"
  href="https://www.azion.com/en/documentation/products/secure/edge-dns/"
  target="_blank"
/>`,
  control: selectControl({
    model: 'form.type',
    id: 'record-type',
    ariaLabel: 'Record type',
    displayValue: 'typeLabel',
    options: 'recordTypes',
    item: 'type'
  })
})

const TTL_FIELD = fieldStack({
  label: 'TTL (seconds)',
  id: 'record-ttl',
  description: 'Time-to-live a response can be cached for on a resolver server.',
  control: `<InputNumber
  id="record-ttl"
  v-model="form.ttl"
  size="large"
  class="w-full"
  :min="0"
  :disabled="submitting"
  aria-label="TTL in seconds"
/>`
})

const VALUE_FIELD = fieldStack({
  component: 'FieldTextarea',
  label: 'Value',
  id: 'record-value',
  description: '{{ selectedType.valueHelper }}',
  message: 'errors.value',
  attrs: `v-model="form.value"
:placeholder="selectedType.placeholder"
:disabled="submitting"
@update:model-value="errors.value = ''"`
})

const DESCRIPTION_FIELD = fieldStack({
  component: 'FieldText',
  label: 'Description',
  id: 'record-description',
  description: 'An optional note to help identify this record.',
  attrs: `v-model="form.description"
size="large"
placeholder="Optional description"
:disabled="submitting"`
})

const POLICY_FIELD = fieldStack({
  label: 'Policy type',
  id: 'record-policy',
  description:
    'Simple is standard resolution. Weighted distributes answers across records by weight.',
  control: selectControl({
    model: 'form.policy',
    id: 'record-policy',
    ariaLabel: 'Policy type',
    displayValue: 'policyLabelOf',
    options: 'policyTypes',
    item: 'policy'
  })
})

const WEIGHT_FIELD = fieldStack({
  label: 'Weight',
  id: 'record-weight',
  when: 'isWeighted',
  description: 'Relative weight (0–255) for this record within the weighted set.',
  control: `<InputNumber
  id="record-weight"
  v-model="form.weight"
  size="large"
  class="w-full"
  :min="0"
  :max="255"
  :disabled="submitting"
  aria-label="Weight"
/>`
})

const fieldGroup = (fields) => `<div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
${fields
  .join('\n\n')
  .split('\n')
  .map((line) => (line ? `  ${line}` : line))
  .join('\n')}
</div>`

const TEMPLATE = drawerShell({
  title: 'Add Record',
  description: 'A new record in edgeflow.com, and how Edge DNS should answer requests for it.',
  size: 'large',
  trigger: headingAction({ label: 'Add Record' }),
  body: [
    section({
      title: 'Settings',
      hint: 'Which IPs are associated with the domain and how Edge DNS should handle requests.',
      body: fieldGroup([NAME_FIELD, TYPE_FIELD, TTL_FIELD, VALUE_FIELD, DESCRIPTION_FIELD])
    }),
    section({
      title: 'Policy',
      hint: 'How Edge DNS should deal with requests answered by this record.',
      body: fieldGroup([POLICY_FIELD, WEIGHT_FIELD])
    })
  ].join('\n\n')
})

const SCRIPT = [
  ...DRAWER_SHELL_IMPORTS,
  "import FieldInputGroup from '@aziontech/webkit/field-input-group'",
  "import FieldText from '@aziontech/webkit/field-text'",
  "import FieldTextarea from '@aziontech/webkit/field-textarea'",
  "import HelperText from '@aziontech/webkit/helper-text'",
  "import Hint from '@aziontech/webkit/hint'",
  "import InputNumber from '@aziontech/webkit/input-number'",
  "import Label from '@aziontech/webkit/label'",
  "import Link from '@aziontech/webkit/link'",
  "import Select from '@aziontech/webkit/select'",
  "import { computed, reactive, ref, watch } from 'vue'",
  '',
  declare('recordTypes', RECORD_TYPES),
  '',
  declare('policyTypes', POLICY_TYPES),
  '',
  `const blankForm = () => (${declare('x', BLANK_FORM).slice('const x = '.length)})`,
  '',
  'const open = ref(false)',
  'const form = reactive(blankForm())',
  "const errors = reactive({ name: '', value: '' })",
  'const submitting = ref(false)',
  '',
  'const selectedType = computed(',
  '  () => recordTypes.find((type) => type.value === form.type) ?? recordTypes[0]',
  ')',
  "const isWeighted = computed(() => form.policy === 'weighted')",
  '',
  "const typeLabel = (value) => recordTypes.find((type) => type.value === value)?.label ?? ''",
  "const policyLabelOf = (value) => policyTypes.find((policy) => policy.value === value)?.label ?? ''",
  '',
  'watch(open, (isOpen) => {',
  '  if (!isOpen) return',
  '  Object.assign(form, blankForm())',
  "  errors.name = ''",
  "  errors.value = ''",
  '})',
  '',
  'const validate = () => {',
  "  errors.name = form.name.trim() ? '' : 'This field is required.'",
  "  errors.value = form.value.trim() ? '' : 'This field is required.'",
  '  return !errors.name && !errors.value',
  '}',
  '',
  'const submit = () => {',
  '  if (submitting.value) return',
  '  if (!validate()) return',
  '  submitting.value = true',
  '  setTimeout(() => {',
  '    submitting.value = false',
  '    open.value = false',
  '  }, 800)',
  '}'
]

const components = {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
  FieldInputGroup,
  FieldText,
  FieldTextarea,
  HelperText,
  Hint,
  InputNumber,
  Label,
  Link,
  PanelContent,
  PanelFooter,
  PanelHeader,
  Select,
  'Select.Trigger': Select.Trigger,
  'Select.Content': Select.Content,
  'Select.Option': Select.Option
}

const setup = () => {
  const blankForm = () => ({ ...BLANK_FORM })
  const open = ref(false)
  const form = reactive(blankForm())
  const errors = reactive({ name: '', value: '' })
  const submitting = ref(false)
  const selectedType = computed(
    () => RECORD_TYPES.find((type) => type.value === form.type) ?? RECORD_TYPES[0]
  )
  const isWeighted = computed(() => form.policy === 'weighted')
  const typeLabel = (value) => RECORD_TYPES.find((type) => type.value === value)?.label ?? ''
  const policyLabelOf = (value) =>
    POLICY_TYPES.find((policy) => policy.value === value)?.label ?? ''
  watch(open, (isOpen) => {
    if (!isOpen) return
    Object.assign(form, blankForm())
    errors.name = ''
    errors.value = ''
  })
  const validate = () => {
    errors.name = form.name.trim() ? '' : 'This field is required.'
    errors.value = form.value.trim() ? '' : 'This field is required.'
    return !errors.name && !errors.value
  }
  const submit = () => {
    if (submitting.value) return
    if (!validate()) return
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      open.value = false
    }, 800)
  }
  return {
    open,
    form,
    errors,
    submitting,
    recordTypes: RECORD_TYPES,
    policyTypes: POLICY_TYPES,
    selectedType,
    isWeighted,
    typeLabel,
    policyLabelOf,
    submit
  }
}

const meta = {
  title: 'Templates/Platform/Forms/ResourceDrawer',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The right-side form drawer every resource created or edited inside another resource opens: a panel header with the title, a muted one-line description and the close button; a disabled-while-saving fieldset of `Section` bands in the scrolling content, each a heading with a `Hint` glyph over its stacked fields (a `Field` component whose helper carries the guidance or, after Save, the required message); and a footer with one primary submit action that shows its loading state while the save is in flight. Its state resets each time it opens, so the content stays in place while it closes. Edge DNS Add Record, Add Domain, Create Environment, Create Variable, the Rules Engine rule, Deployment Settings, the deploy drawers, Device Groups, Functions Instances, Cache Settings, WAF Allowed Rules and the SQL table, column and row drawers are all built on it. Built from `Drawer` and its parts, `PanelHeader`, `PanelContent`, `PanelFooter`, `FieldInputGroup`, `FieldText`, `FieldTextarea`, `Label` and `HelperText` around `InputNumber` and `Select`, `Hint`, `Link` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup,
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Closed until Add Record opens it, as the Edge DNS zone renders it: Name with the zone as an addon, Record type, TTL, Value with the placeholder and helper of the selected type, and Description under Settings; Policy type under Policy, with Weight appearing only for the weighted policy. Save on an empty form flags Name and Value as required.'
      },
      source: { code: toSfc(SCRIPT, TEMPLATE) }
    }
  }
}
