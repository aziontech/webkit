import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Hint from '@aziontech/webkit/hint'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import Select from '@aziontech/webkit/select'
import Switch from '@aziontech/webkit/switch'
import Tag from '@aziontech/webkit/tag'
import Textarea from '@aziontech/webkit/textarea'
import { ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  compactRow,
  compound,
  declare,
  fieldRow,
  flushCard,
  pageHeading,
  pageMain,
  SAVE_BAR,
  SAVED_FORM_SCRIPT,
  section,
  useSavedForm,
  VUE_IMPORT,
  webkitImport,
  wideRow
} from './_account-markup'

const FORM = {
  accountName: 'Gabriel Lisboa',
  clientId: '9757a',
  companyName: '',
  companyId: '',
  billingEmails: 'gabriel.mendonca@azion.com',
  postalCode: '00000-000',
  country: 'br',
  state: 'rs',
  city: 'poa',
  address: 'n',
  apartment: '',
  allowSocialLogin: true,
  enforceMfa: false
}

const PLACES = [
  {
    key: 'country',
    label: 'Country',
    options: [
      { label: 'Brazil', value: 'br' },
      { label: 'United States', value: 'us' },
      { label: 'Portugal', value: 'pt' }
    ]
  },
  {
    key: 'state',
    label: 'State/Region',
    options: [
      { label: 'Rio Grande do Sul', value: 'rs' },
      { label: 'São Paulo', value: 'sp' },
      { label: 'Rio de Janeiro', value: 'rj' }
    ]
  },
  {
    key: 'city',
    label: 'City',
    options: [
      { label: 'Porto Alegre', value: 'poa' },
      { label: 'São Paulo', value: 'sao' },
      { label: 'Rio de Janeiro', value: 'rio' }
    ]
  }
]

const SOURCE_CONTROLS = [
  {
    key: 'github',
    name: 'Github',
    icon: 'pi pi-github',
    connected: true,
    tag: 'Active',
    description:
      'Connected as rafael.umman: to repositories in organizations: azion-tech, rafael-personal.',
    action: 'Manage'
  },
  {
    key: 'gitlab',
    name: 'Gitlab',
    icon: 'ai-cor ai-gitlab',
    connected: false,
    tag: '',
    description: 'Connect GitLab for Cloud Agents, and enhanced codebase control.',
    action: 'Connect'
  },
  {
    key: 'bitbucket',
    name: 'Bitbucket',
    icon: 'ai-cor ai-bitbucket',
    connected: false,
    tag: '',
    description: 'Connect Bitbucket for Cloud Agents, and enhanced codebase control.',
    action: 'Connect'
  }
]

const FONTS = [
  { value: 'sora', label: 'Sora (Default)' },
  { value: 'inter', label: 'Inter' },
  { value: 'rubik', label: 'Rubik' },
  { value: 'ibm-plex-sans', label: 'IBM Plex Sans' },
  { value: 'geist', label: 'Geist' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'work-sans', label: 'Work Sans' },
  { value: 'instrument-sans', label: 'Instrument Sans' },
  { value: 'hedvig-letters-sans', label: 'Hedvig Letters Sans' }
]

const APPEARANCES = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' }
]

const input = (model, label, extra = '') =>
  `<InputText v-model="form.${model}" size="large" class="w-full" aria-label="${label}"${extra} :disabled="saving" />`

const select = ({ model, options, ariaLabel }) => `<Select
  v-model="${model}"
  size="large"
  :display-value="(value) => ${options}.find((option) => option.value === value)?.label ?? ''"
>
  <Select.Trigger class="w-full" ${ariaLabel} />
  <Select.Content>
    <Select.Option v-for="option in ${options}" :key="option.value" :value="option.value">
      {{ option.label }}
    </Select.Option>
  </Select.Content>
</Select>`

const PLACE_ROW = `<Item v-for="place in places" :key="place.key" size="small" class="items-start">
  <Item.Content>
    <Item.Title>{{ place.label }}</Item.Title>
  </Item.Content>
  <Item.Actions class="flex-1 justify-end max-w-(--container-3xs)">
    <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
${indent(select({ model: 'form[place.key]', options: 'place.options', ariaLabel: ':aria-label="place.label"' }), 3)}
    </div>
  </Item.Actions>
</Item>`

const PROVIDER_ROW = `<Item v-for="provider in sourceControls" :key="provider.key" size="small">
  <Item.Media>
    <span class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)">
      <i :class="[provider.icon, 'text-body-lg leading-none text-(--text-default)']" aria-hidden="true" />
    </span>
  </Item.Media>
  <Item.Content>
    <Item.Title>
      {{ provider.name }}
      <Tag v-if="provider.tag" :label="provider.tag" severity="success" size="small" />
    </Item.Title>
    <Item.Description>{{ provider.description }}</Item.Description>
  </Item.Content>
  <Item.Actions class="justify-end">
    <Button
      type="button"
      :label="provider.action"
      kind="outlined"
      size="medium"
      :icon="provider.connected ? undefined : 'pi pi-external-link'"
    />
  </Item.Actions>
</Item>`

const SECTIONS = [
  section({
    title: 'General',
    hint: 'How this account is identified on the platform.',
    body: flushCard([
      fieldRow(
        'Account Name',
        'What this account is called across the console.',
        input('accountName', 'Account Name')
      ),
      fieldRow(
        'Client ID',
        "Can't be changed. Quote it when opening a support ticket about this account.",
        input('clientId', 'Client ID', ' readonly')
      )
    ])
  }),
  section({
    title: 'Company information',
    hint: 'The company that owns the account, as it appears on every invoice.',
    body: flushCard([
      fieldRow(
        'Company Name',
        'The legal entity that owns this account.',
        input('companyName', 'Company Name', ' placeholder="Company S.A."')
      ),
      fieldRow(
        'Company ID',
        'Personal or company ID number that identifies account ownership.',
        input('companyId', 'Company ID', ' placeholder="00.000.000/0001-00"')
      ),
      wideRow(
        'Billing emails',
        'Billing is forwarded to every address listed here. Separate each one with a semicolon ( ; ).',
        '<Textarea v-model="form.billingEmails" class="w-full" :rows="3" aria-label="Billing emails" :disabled="saving" />'
      )
    ])
  }),
  section({
    title: 'Address information',
    hint: 'Where the account owner is registered, for invoices and tax purposes.',
    body: flushCard([
      fieldRow('Postal Code', '', input('postalCode', 'Postal Code')),
      PLACE_ROW,
      fieldRow('Address', '', input('address', 'Address')),
      fieldRow(
        'Apartment, floor, etc.',
        '',
        input('apartment', 'Apartment, floor, etc.', ' placeholder="1st floor"')
      )
    ])
  }),
  section({
    title: 'Login Settings',
    hint: 'How the users linked to this account sign in.',
    body: flushCard([
      compactRow(
        'Allow social login',
        'Users linked to the account can log in with their social network credentials.',
        '<Switch v-model="form.allowSocialLogin" aria-label="Allow social login" :disabled="saving" />'
      ),
      compactRow(
        'Enforce multi-factor authentication',
        'MFA is required on login for every user linked to this account.',
        '<Switch v-model="form.enforceMfa" aria-label="Enforce multi-factor authentication" :disabled="saving" />'
      ),
      compactRow(
        'Authenticator devices',
        'Manage the devices and recovery codes registered for this account.',
        '<Button type="button" label="Manage" kind="outlined" size="medium" />'
      )
    ])
  }),
  section({
    title: 'Source control',
    hint: 'The Git providers this account builds applications from, connected at the provider and outside Save.',
    body: flushCard([PROVIDER_ROW])
  }),
  section({
    title: 'Appearance',
    hint: 'Preferences for this browser, applied the moment you change them and not part of Save.',
    body: flushCard([
      fieldRow(
        'Font family',
        'The primary sans typeface across the console. Non-default faces load from Google Fonts.',
        select({ model: 'font', options: 'fonts', ariaLabel: 'aria-label="Font family"' })
      ),
      fieldRow(
        'System appearance',
        'Follow the operating system, or force a light or dark theme.',
        select({
          model: 'theme',
          options: 'appearances',
          ariaLabel: 'aria-label="System appearance"'
        })
      )
    ])
  }),
  section({
    title: 'Danger Zone',
    hint: 'Actions that cannot be undone.',
    body: flushCard([
      compactRow(
        'Remove personal account',
        "Permanently deletes this Personal Account and all associated data from Azion's platform. It cannot be undone.",
        '<Button type="button" label="Delete account" kind="danger" size="medium" icon="pi pi-trash" />'
      )
    ])
  })
]

const TEMPLATE =
  pageMain(`<form class="flex min-h-0 flex-1 flex-col" aria-label="Account settings" novalidate @submit.prevent="save">
  <div class="min-h-0 flex-1 overflow-auto">
    <div class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)">
${indent(
  pageHeading({
    title: 'Account Settings',
    description: "Manage your account's identity, company details, address, and login preferences."
  }),
  3
)}
      <fieldset class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0" :disabled="saving">
        <legend class="sr-only">Account settings</legend>
${indent(SECTIONS.join('\n'), 4)}
      </fieldset>
    </div>
  </div>
${indent(SAVE_BAR)}
</form>`)

const IMPORTS = [
  webkitImport('Button', 'button'),
  webkitImport('CardBox', 'card-box'),
  webkitImport('Hint', 'hint'),
  webkitImport('InputText', 'input-text'),
  webkitImport('Item', 'item'),
  webkitImport('Select', 'select'),
  webkitImport('Switch', 'switch'),
  webkitImport('Tag', 'tag'),
  webkitImport('Textarea', 'textarea'),
  VUE_IMPORT(['computed', 'reactive', 'ref']),
  '',
  declare('form', FORM, 'reactive'),
  ...SAVED_FORM_SCRIPT,
  '',
  declare('places', PLACES),
  declare('sourceControls', SOURCE_CONTROLS),
  declare('fonts', FONTS),
  declare('appearances', APPEARANCES),
  "const font = ref('sora')",
  "const theme = ref('system')"
]

const components = {
  Button,
  CardBox,
  Hint,
  InputText,
  ...compound('Item', Item, ['List', 'Media', 'Content', 'Title', 'Description', 'Actions']),
  ...compound('Select', Select, ['Trigger', 'Content', 'Option']),
  Switch,
  Tag,
  Textarea
}

const meta = {
  title: 'Templates/Platform/Account/AccountSettings/Settings',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The General panel of Account Settings (`/account`), as the console renders it inside the app shell: a small page heading over seven stacked sections, each a flush `CardBox` of field rows, in the form column, with the unsaved-changes bar that rises once a saved field changes. The panels are switched from the Settings drill-down of the console sidebar, which the Shell templates own. Built from `CardBox`, `Item`, `InputText`, `Textarea`, `Select`, `Switch`, `Tag`, `Hint` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Settings = {
  render: () => ({
    components,
    setup: () => ({
      ...useSavedForm(FORM),
      places: PLACES,
      sourceControls: SOURCE_CONTROLS,
      fonts: FONTS,
      appearances: APPEARANCES,
      font: ref('sora'),
      theme: ref('system')
    }),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'General, Company information, Address information, Login Settings, Source control, Appearance and Danger Zone; edit any saved field to raise the Discard and Save bar.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
