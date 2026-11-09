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
  CardBox: "import CardBox from '@aziontech/webkit/card-box'",
  HelperText: "import HelperText from '@aziontech/webkit/helper-text'",
  InputText: "import InputText from '@aziontech/webkit/input-text'",
  Item: "import Item from '@aziontech/webkit/item'",
  Select: "import Select from '@aziontech/webkit/select'",
  Switch: "import Switch from '@aziontech/webkit/switch'",
  Textarea: "import Textarea from '@aziontech/webkit/textarea'"
}

const importsFor = (names, script) => [
  ...names.map((name) => IMPORT_LINES[name]),
  "import { reactive } from 'vue'",
  '',
  ...script
]

const COUNTRIES = [
  { label: 'Brazil', value: 'br' },
  { label: 'United States', value: 'us' },
  { label: 'Portugal', value: 'pt' }
]

const SETTINGS_FORM = {
  accountName: 'Acme',
  clientId: '9757a',
  country: 'br',
  allowSocialLogin: true,
  billingEmails: 'billing@acme.com'
}

const WIDE_FORM = { billingEmails: 'billing@acme.com' }

const MESSAGE_FORM = { email: 'jane.doe@acme' }

const countryLabel = (value) => COUNTRIES.find((option) => option.value === value)?.label ?? ''

const COUNTRY_LABEL_LINE =
  "const countryLabel = (value) => countries.find((option) => option.value === value)?.label ?? ''"

const components = {
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

const COUNTRY_SELECT = `<Select v-model="form.country" size="large" :display-value="countryLabel">
  <Select.Trigger aria-label="Country" />
  <Select.Content>
    <Select.Option v-for="option in countries" :key="option.value" :value="option.value">
      {{ option.label }}
    </Select.Option>
  </Select.Content>
</Select>`

const BILLING_EMAILS_ROW = wideRow(
  'Billing emails',
  'Billing is forwarded to every address listed here. Separate each one with a semicolon ( ; ).',
  '<Textarea v-model="form.billingEmails" rows="3" aria-label="Billing emails" />'
)

const SETTINGS_CARD_TEMPLATE = card([
  fieldRow(
    'Account Name',
    'What this account is called across the console.',
    '<InputText v-model="form.accountName" size="large" aria-label="Account Name" />'
  ),
  fieldRow(
    'Client ID',
    "Can't be changed. Quote it when opening a support ticket about this account.",
    '<InputText v-model="form.clientId" size="large" aria-label="Client ID" readonly />'
  ),
  fieldRow('Country', '', COUNTRY_SELECT),
  compactRow(
    'Allow social login',
    'Users linked to the account can log in with their social network credentials.',
    '<Switch v-model="form.allowSocialLogin" aria-label="Allow social login" />'
  ),
  BILLING_EMAILS_ROW
])

const WIDE_TEMPLATE = card([BILLING_EMAILS_ROW])

const WITH_MESSAGE_TEMPLATE = card([
  fieldRow(
    'Email',
    'Used for sign-in and notifications.',
    `<div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
  <InputText
    v-model="form.email"
    type="email"
    size="large"
    invalid
    aria-label="Email"
    aria-describedby="email-message"
  />
  <HelperText id="email-message" kind="invalid" label="Enter a valid email address." />
</div>`
  )
])

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
          'The settings row: an `Item` whose content carries the title and description and whose actions slot holds the control, capped to the control measure, or a switch at its natural width, or a wide control stacked under the copy. Account Settings, Application Settings and the Firewall settings tabs list these rows inside a flush `CardBox`. Built from `CardBox`, `Item`, `InputText`, `Select`, `Switch`, `Textarea` and `HelperText`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const SettingsCard = {
  render: () => ({
    components,
    setup: () => ({ form: reactive({ ...SETTINGS_FORM }), countries: COUNTRIES, countryLabel }),
    template: SETTINGS_CARD_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Five Account Settings rows in one flush card: two text inputs, a select, a compact switch row, and a wide textarea row stacked under its copy.'
      },
      source: {
        code: toSfc(
          importsFor(
            ['CardBox', 'InputText', 'Item', 'Select', 'Switch', 'Textarea'],
            [
              declare('countries', COUNTRIES),
              declare('form', SETTINGS_FORM, 'reactive'),
              COUNTRY_LABEL_LINE
            ]
          ),
          SETTINGS_CARD_TEMPLATE
        )
      }
    }
  }
}

export const WideControl = {
  render: () => ({
    components,
    setup: () => ({ form: reactive({ ...WIDE_FORM }) }),
    template: WIDE_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The wide variant: the textarea drops under the title and description and takes the full row width.'
      },
      source: {
        code: toSfc(
          importsFor(['CardBox', 'Item', 'Textarea'], [declare('form', WIDE_FORM, 'reactive')]),
          WIDE_TEMPLATE
        )
      }
    }
  }
}

export const WithMessage = {
  render: () => ({
    components,
    setup: () => ({ form: reactive({ ...MESSAGE_FORM }) }),
    template: WITH_MESSAGE_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A row whose control failed validation: the input is marked invalid and the message sits under it inside the control column.'
      },
      source: {
        code: toSfc(
          importsFor(
            ['CardBox', 'HelperText', 'InputText', 'Item'],
            [declare('form', MESSAGE_FORM, 'reactive')]
          ),
          WITH_MESSAGE_TEMPLATE
        )
      }
    }
  }
}
