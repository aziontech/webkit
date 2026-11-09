import Button from '@aziontech/webkit/button'
import Drawer from '@aziontech/webkit/drawer'
import DrawerClose from '@aziontech/webkit/drawer-close'
import DrawerContent from '@aziontech/webkit/drawer-content'
import DrawerDescription from '@aziontech/webkit/drawer-description'
import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
import DrawerPortal from '@aziontech/webkit/drawer-portal'
import DrawerTitle from '@aziontech/webkit/drawer-title'
import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
import FieldInputGroup from '@aziontech/webkit/field-input-group'
import FieldSelect from '@aziontech/webkit/field-select'
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
import { computed, reactive, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import { declare } from './_forms-markup'

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

const RECORD_FORM = { name: '', type: undefined, ttl: 3600, value: '', description: '' }

const POLICY_FORM = { ...RECORD_FORM, policy: undefined, weight: 100 }

const SETTINGS_HINT =
  "Which IPs are associated with the domain and how Edge DNS should handle requests. The accepted value's format varies according to the chosen record type."

const POLICY_HINT =
  'How Edge DNS should deal with requests answered by this record. SIMPLE is standard resolution; WEIGHTED distributes answers across records by weight.'

const SHELL_IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import Drawer from '@aziontech/webkit/drawer'",
  "import DrawerClose from '@aziontech/webkit/drawer-close'",
  "import DrawerContent from '@aziontech/webkit/drawer-content'",
  "import DrawerDescription from '@aziontech/webkit/drawer-description'",
  "import DrawerOverlay from '@aziontech/webkit/drawer-overlay'",
  "import DrawerPortal from '@aziontech/webkit/drawer-portal'",
  "import DrawerTitle from '@aziontech/webkit/drawer-title'",
  "import DrawerTrigger from '@aziontech/webkit/drawer-trigger'",
  "import HelperText from '@aziontech/webkit/helper-text'"
]

const FIELD_IMPORTS = [
  "import FieldInputGroup from '@aziontech/webkit/field-input-group'",
  "import FieldSelect from '@aziontech/webkit/field-select'",
  "import FieldText from '@aziontech/webkit/field-text'",
  "import FieldTextarea from '@aziontech/webkit/field-textarea'",
  "import InputNumber from '@aziontech/webkit/input-number'",
  "import Label from '@aziontech/webkit/label'",
  "import Link from '@aziontech/webkit/link'",
  "import PanelContent from '@aziontech/webkit/panel-content'",
  "import PanelFooter from '@aziontech/webkit/panel-footer'",
  "import PanelHeader from '@aziontech/webkit/panel-header'",
  "import { computed, reactive, ref } from 'vue'"
]

const RECORD_TYPE_LINES = [
  'const recordType = computed(() => recordTypes.find((type) => type.value === form.type) ?? recordTypes[0])'
]

const DEFAULT_IMPORTS = [
  ...SHELL_IMPORTS,
  ...FIELD_IMPORTS,
  '',
  'const open = ref(false)',
  declare('form', RECORD_FORM, 'reactive'),
  declare('recordTypes', RECORD_TYPES),
  ...RECORD_TYPE_LINES
]

const SECTIONED_IMPORTS = [
  ...SHELL_IMPORTS,
  "import Hint from '@aziontech/webkit/hint'",
  ...FIELD_IMPORTS,
  '',
  'const open = ref(false)',
  declare('form', POLICY_FORM, 'reactive'),
  declare('recordTypes', RECORD_TYPES),
  declare('policyTypes', POLICY_TYPES),
  ...RECORD_TYPE_LINES
]

const components = {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
  FieldInputGroup,
  FieldSelect,
  FieldText,
  FieldTextarea,
  HelperText,
  Hint,
  InputNumber,
  Label,
  Link,
  PanelContent,
  PanelFooter,
  PanelHeader
}

const NAME_FIELD = `<FieldInputGroup
  v-model="form.name"
  label="Name"
  input-id="record-name"
  name="name"
  placeholder="subdomain"
  helper-text="Use @ to create a record for the root domain."
>
  <template #right>.edgeflow.com</template>
</FieldInputGroup>`

const TYPE_FIELD = `<div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
  <FieldSelect
    v-model="form.type"
    label="Record type"
    input-id="record-type"
    size="large"
    placeholder="Select a record type"
    :options="recordTypes"
  />
  <HelperText>
    <Link
      label="Read more about record types"
      size="medium"
      href="https://www.azion.com/en/documentation/products/secure/edge-dns/"
      target="_blank"
    />
  </HelperText>
</div>`

const TTL_FIELD = `<div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
  <Label for="record-ttl">TTL (seconds)</Label>
  <InputNumber id="record-ttl" v-model="form.ttl" size="large" :min="0" aria-describedby="record-ttl-helper" />
  <HelperText
    id="record-ttl-helper"
    label="Time-to-live a response can be cached for on a resolver server."
  />
</div>`

const VALUE_FIELD = `<FieldTextarea
  v-model="form.value"
  label="Value"
  input-id="record-value"
  name="value"
  :placeholder="recordType.placeholder"
  :helper-text="recordType.valueHelper"
/>`

const DESCRIPTION_FIELD = `<FieldText
  v-model="form.description"
  label="Description"
  input-id="record-description"
  name="description"
  size="large"
  placeholder="Optional description"
  helper-text="An optional note to help identify this record."
/>`

const POLICY_FIELD = `<FieldSelect
  v-model="form.policy"
  label="Policy type"
  input-id="record-policy"
  size="large"
  placeholder="Select a policy"
  :options="policyTypes"
/>`

const WEIGHT_FIELD = `<div v-if="form.policy === 'weighted'" class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
  <Label for="record-weight">Weight</Label>
  <InputNumber
    id="record-weight"
    v-model="form.weight"
    size="large"
    :min="0"
    :max="255"
    aria-describedby="record-weight-helper"
  />
  <HelperText
    id="record-weight-helper"
    label="Relative weight (0–255) for this record within the weighted set."
  />
</div>`

const RECORD_FIELDS = [NAME_FIELD, TYPE_FIELD, TTL_FIELD, VALUE_FIELD, DESCRIPTION_FIELD]

const sectionBand = (
  title,
  hint,
  fields
) => `<section class="flex min-w-0 flex-col gap-(--spacing-md)">
  <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
    <h2 class="text-heading-xxs text-(--text-default)">${title}</h2>
    <Hint text="${hint}" />
  </div>
  <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
${indent(fields.join('\n\n'), 2)}
  </div>
</section>`

const FLAT_FIELDS = `<fieldset class="m-0 flex min-w-0 flex-col gap-(--layout-group-gap) border-0 p-0">
  <legend class="sr-only">Add Record</legend>
${indent(RECORD_FIELDS.join('\n\n'))}
</fieldset>`

const SECTIONED_FIELDS = `<fieldset class="m-0 flex min-w-0 flex-col gap-(--layout-section-gap) border-0 p-0">
  <legend class="sr-only">Add Record</legend>
${indent(sectionBand('Settings', SETTINGS_HINT, RECORD_FIELDS))}

${indent(sectionBand('Policy', POLICY_HINT, [POLICY_FIELD, WEIGHT_FIELD]))}
</fieldset>`

const drawer = (content) => `<Drawer v-model:open="open" side="right" size="large">
  <DrawerTrigger>
    <Button label="Add Record" kind="outlined" size="large" icon="pi pi-plus" />
  </DrawerTrigger>
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-label="Add Record"
        novalidate
        @submit.prevent="open = false"
      >
        <PanelHeader>
          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
            <DrawerTitle>Add Record</DrawerTitle>
            <DrawerDescription>
              A new record in edgeflow.com, and how Edge DNS should answer requests for it.
            </DrawerDescription>
          </div>
          <DrawerClose />
        </PanelHeader>
        <PanelContent>
${indent(content, 5)}
        </PanelContent>
        <PanelFooter>
          <div class="ml-auto flex items-center gap-(--spacing-sm)">
            <Button type="button" label="Cancel" kind="outlined" size="medium" @click="open = false" />
            <Button label="Save" kind="primary" size="medium" />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </DrawerPortal>
</Drawer>`

const DEFAULT_TEMPLATE = drawer(FLAT_FIELDS)

const SECTIONED_TEMPLATE = drawer(SECTIONED_FIELDS)

const setupFor = (initialForm) => () => {
  const open = ref(false)
  const form = reactive({ ...initialForm })
  const recordType = computed(
    () => RECORD_TYPES.find((type) => type.value === form.type) ?? RECORD_TYPES[0]
  )
  return {
    open,
    form,
    recordTypes: RECORD_TYPES,
    policyTypes: POLICY_TYPES,
    recordType
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
          'The right-side form drawer every resource created inside another resource opens: a panel header with the title, a one-line description and the close button, a fieldset of field stacks in the scrolling content, and a footer with Cancel beside Save. Edge DNS Add Record, Add Domain, Add Variable and Create Environment are all built on it. Built from `Drawer` and its parts, `PanelHeader`, `PanelContent`, `PanelFooter`, `FieldInputGroup`, `FieldSelect`, `FieldText`, `FieldTextarea`, `InputNumber` under its own `Label` and `HelperText`, `Link`, `Hint` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: setupFor(RECORD_FORM),
    template: DEFAULT_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Closed until the Add Record button opens it: the record form as one fieldset of field stacks, with the value placeholder and helper following the selected record type.'
      },
      source: { code: toSfc(DEFAULT_IMPORTS, DEFAULT_TEMPLATE) }
    }
  }
}

export const WithSections = {
  render: () => ({
    components,
    setup: setupFor(POLICY_FORM),
    template: SECTIONED_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The same drawer as the Edge DNS zone renders it: the fields grouped under Settings and Policy bands, each a heading with a Hint glyph, and the Weight field appearing only for the weighted policy.'
      },
      source: { code: toSfc(SECTIONED_IMPORTS, SECTIONED_TEMPLATE) }
    }
  }
}
