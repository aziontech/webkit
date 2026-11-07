import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import HelperText from '@aziontech/webkit/helper-text'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import Select from '@aziontech/webkit/select'
import Switch from '@aziontech/webkit/switch'
import Textarea from '@aziontech/webkit/textarea'
import { reactive } from 'vue'

import { toSfc } from '../../_shared/story-source'
import { card, compactRow, declare, fieldRow, wideRow } from './_forms-markup'

const IMPORT_LINES = {
  Button: "import Button from '@aziontech/webkit/button'",
  CardBox: "import CardBox from '@aziontech/webkit/card-box'",
  HelperText: "import HelperText from '@aziontech/webkit/helper-text'",
  InputText: "import InputText from '@aziontech/webkit/input-text'",
  Item: "import Item from '@aziontech/webkit/item'",
  Select: "import Select from '@aziontech/webkit/select'",
  Switch: "import Switch from '@aziontech/webkit/switch'",
  Textarea: "import Textarea from '@aziontech/webkit/textarea'"
}

const importsFor = (names, vue, script) => [
  ...names.map((name) => IMPORT_LINES[name]),
  `import { ${vue.join(', ')} } from 'vue'`,
  '',
  ...script
]

const components = {
  Button,
  CardBox,
  HelperText,
  InputText,
  Item,
  'Item.List': Item.List,
  'Item.Content': Item.Content,
  'Item.Title': Item.Title,
  'Item.Description': Item.Description,
  'Item.Actions': Item.Actions,
  Select,
  'Select.Trigger': Select.Trigger,
  'Select.Content': Select.Content,
  'Select.Option': Select.Option,
  Switch,
  Textarea
}

const COMPANY_FORM = { companyName: '', companyId: '', billingEmails: 'jane.doe@acme.com' }

const COMPANY_TEMPLATE = card([
  fieldRow(
    'Company Name',
    'The legal entity that owns this account.',
    '<InputText v-model="form.companyName" size="large" class="w-full" aria-label="Company Name" placeholder="Company S.A." />'
  ),
  fieldRow(
    'Company ID',
    'Personal or company ID number that identifies account ownership.',
    '<InputText v-model="form.companyId" size="large" class="w-full" aria-label="Company ID" placeholder="00.000.000/0001-00" />'
  ),
  wideRow(
    'Billing emails',
    'Billing is forwarded to every address listed here. Separate each one with a semicolon ( ; ).',
    '<Textarea v-model="form.billingEmails" class="w-full" :rows="3" aria-label="Billing emails" />'
  )
])

const LOGIN_FORM = { allowSocialLogin: true, enforceMfa: false }

const LOGIN_TEMPLATE = card([
  compactRow(
    'Allow social login',
    'Users linked to the account can log in with their social network credentials.',
    '<Switch v-model="form.allowSocialLogin" aria-label="Allow social login" />'
  ),
  compactRow(
    'Enforce multi-factor authentication',
    'MFA is required on login for every user linked to this account.',
    '<Switch v-model="form.enforceMfa" aria-label="Enforce multi-factor authentication" />'
  ),
  compactRow(
    'Authenticator devices',
    'Manage the devices and recovery codes registered for this account.',
    '<Button type="button" label="Manage" kind="outlined" size="medium" />'
  )
])

const MESSAGE_FORM = { name: '' }

const MESSAGE_TEMPLATE = card([
  fieldRow(
    'Name',
    'Give a unique and descriptive name to identify the network list.',
    `<InputText
  v-model="form.name"
  size="large"
  class="w-full"
  aria-label="Name"
  placeholder="office-ranges"
  autocomplete="off"
  required
  aria-describedby="network-lists-name-message"
/>`,
    {
      message: 'This field is required.',
      messageKind: 'required',
      messageId: 'network-lists-name-message'
    }
  )
])

const TLS_VERSIONS = [
  { value: 'tls_1_3', label: 'TLS 1.3' },
  { value: 'tls_1_2', label: 'TLS 1.2' },
  { value: 'tls_1_1', label: 'TLS 1.1, deprecated' },
  { value: 'tls_1_0', label: 'TLS 1.0, deprecated' }
]

const CIPHER_SUITES = [
  { value: '7', label: 'Modern v2025Q1' },
  { value: '6', label: 'Compatible v2025Q1' },
  { value: '5', label: 'Legacy v2025Q1' },
  { value: '4', label: 'Modern v2022Q1, migration to TLS 1.3' },
  { value: '3', label: 'Modern v2022Q1, TLS 1.2' },
  { value: '2', label: 'Compatible v2018Q1, TLS 1.2' },
  { value: '1', label: 'Legacy v2018Q1, TLS 1.2' },
  { value: '8', label: 'Legacy v2017Q1, all ciphers' }
]

const PROTOCOL_FORM = {
  httpPorts: '80',
  useHttps: true,
  httpsPorts: '443',
  minimumTlsVersion: 'tls_1_3',
  cipherSuite: '7',
  useHttp3: true,
  quicPorts: '443'
}

const portList = (model, label) =>
  `<Textarea v-model="form.${model}" class="w-full" :rows="5" aria-label="${label}" />`

const optionSelect = (model, label, options) => `<Select
  v-model="form.${model}"
  size="large"
  placeholder="Select an option"
  :display-value="labelFor(${options})"
>
  <Select.Trigger class="w-full" aria-label="${label}" />
  <Select.Content>
    <Select.Option v-for="option in ${options}" :key="option.value" :value="option.value">
      {{ option.label }}
    </Select.Option>
  </Select.Content>
</Select>`

const NESTED_TEMPLATE = card([
  wideRow('HTTP ports', 'One port per line. 80 is the default.', portList('httpPorts', 'HTTP ports')),
  compactRow(
    'HTTPS support',
    'Serve HTTPS as well as HTTP, on the HTTPS ports you choose.',
    '<Switch v-model="form.useHttps" aria-label="HTTPS support" />'
  ),
  wideRow(
    'HTTPS ports',
    'One port per line. 443 is the default.',
    portList('httpsPorts', 'HTTPS ports'),
    { level: 1, attrs: ' v-if="form.useHttps"' }
  ),
  fieldRow(
    'Minimum TLS version',
    'Clients negotiating below this version are refused.',
    optionSelect('minimumTlsVersion', 'Minimum TLS version', 'tlsVersions'),
    { level: 1, attrs: ' v-if="form.useHttps"' }
  ),
  fieldRow(
    'Cipher suite',
    'The cipher suite the workload supports. The documentation lists the ciphers in each suite.',
    optionSelect('cipherSuite', 'Cipher suite', 'cipherSuites'),
    { level: 1, attrs: ' v-if="form.useHttps"' }
  ),
  compactRow(
    'HTTP/3 support',
    'Serve HTTP/3 over QUIC. It runs on top of HTTPS.',
    '<Switch v-model="form.useHttp3" aria-label="HTTP/3 support" />',
    { level: 1, attrs: ' v-if="form.useHttps"' }
  ),
  wideRow(
    'HTTP/3 ports',
    'One port per line. 443 is the default.',
    portList('quicPorts', 'HTTP/3 ports'),
    { level: 2, attrs: ' v-if="form.useHttps && form.useHttp3"' }
  )
])

const LABEL_FOR_LINE =
  "const labelFor = (options) => (value) => options.find((option) => option.value === value)?.label ?? ''"

const labelFor = (options) => (value) =>
  options.find((option) => option.value === value)?.label ?? ''

const meta = {
  title: 'Templates/Platform/Forms/FieldRow',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The settings row, one field inside a flush `CardBox`: an `Item` whose content carries the title and description, where the title is the label and the control takes it as `aria-label`. Its kind follows what the control needs: a typed or picked field sits right in a cell capped at the 3xs container so every field on the card ends at the same edge; a switch or a button sits hard right at its natural width; a textarea, list, radio group or editor drops under the copy at the full measure. A message under a field or wide control, amber for required and red for invalid, appears only after Save. A child field indents one or two levels under a rule. Account Settings, Build & Deployment, the Workload, Firewall, function and Edge DNS settings, every create page and the generic resource settings page are built from it. Built from `CardBox`, `Item`, `InputText`, `Select`, `Switch`, `Textarea`, `Button` and `HelperText`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const SettingsCard = {
  render: () => ({
    components,
    setup: () => ({ form: reactive({ ...COMPANY_FORM }) }),
    template: COMPANY_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The Company information card of Account Settings: two field rows capped to the control measure, then Billing emails as a wide row with the textarea under its copy.'
      },
      source: {
        code: toSfc(
          importsFor(
            ['CardBox', 'InputText', 'Item', 'Textarea'],
            ['reactive'],
            [declare('form', COMPANY_FORM, 'reactive')]
          ),
          COMPANY_TEMPLATE
        )
      }
    }
  }
}

export const CompactRows = {
  render: () => ({
    components,
    setup: () => ({ form: reactive({ ...LOGIN_FORM }) }),
    template: LOGIN_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The Login Settings card of Account Settings: two switches and a Manage button, each at its natural width against the right edge.'
      },
      source: {
        code: toSfc(
          importsFor(
            ['Button', 'CardBox', 'Item', 'Switch'],
            ['reactive'],
            [declare('form', LOGIN_FORM, 'reactive')]
          ),
          LOGIN_TEMPLATE
        )
      }
    }
  }
}

export const WithMessage = {
  render: () => ({
    components,
    setup: () => ({ form: reactive({ ...MESSAGE_FORM }) }),
    template: MESSAGE_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A Name row after Save was pressed with it empty, as the resource settings and create pages render it: the input carries its required state and the amber message sits under it inside the control column.'
      },
      source: {
        code: toSfc(
          importsFor(
            ['CardBox', 'HelperText', 'InputText', 'Item'],
            ['reactive'],
            [declare('form', MESSAGE_FORM, 'reactive')]
          ),
          MESSAGE_TEMPLATE
        )
      }
    }
  }
}

export const Nested = {
  render: () => ({
    components,
    setup: () => ({
      form: reactive({ ...PROTOCOL_FORM }),
      tlsVersions: TLS_VERSIONS,
      cipherSuites: CIPHER_SUITES,
      labelFor
    }),
    template: NESTED_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The protocol rows of a domain’s Advanced section: the HTTPS rows indent one level under HTTPS support and HTTP/3 ports a second level under HTTP/3 support, each behind a rule, and they leave when the switch above them turns off.'
      },
      source: {
        code: toSfc(
          importsFor(
            ['CardBox', 'Item', 'Select', 'Switch', 'Textarea'],
            ['reactive'],
            [
              declare('tlsVersions', TLS_VERSIONS),
              '',
              declare('cipherSuites', CIPHER_SUITES),
              '',
              declare('form', PROTOCOL_FORM, 'reactive'),
              '',
              LABEL_FOR_LINE
            ]
          ),
          NESTED_TEMPLATE
        )
      }
    }
  }
}
