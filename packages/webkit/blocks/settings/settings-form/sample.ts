import type { SettingsFormProfile } from './settings-form.vue'

export const sampleProfile: SettingsFormProfile = {
  fullName: 'Alex Morgan',
  email: '',
  timezone: 'utc',
  language: 'en-US',
  productUpdates: true
}

/** One address select of the Profile variant. */
export interface ProfilePlace {
  /** The form field the select writes. */
  key: 'country' | 'state' | 'city'
  /** The row title and the select's accessible name. */
  label: string
  /** The choices. */
  options: { label: string; value: string }[]
}

export const profilePlaces: ProfilePlace[] = [
  {
    key: 'country',
    label: 'Country',
    options: [
      { label: 'Brazil', value: 'br' },
      { label: 'Canada', value: 'ca' },
      { label: 'Germany', value: 'de' },
      { label: 'Japan', value: 'jp' },
      { label: 'United Kingdom', value: 'gb' },
      { label: 'United States', value: 'us' }
    ]
  },
  {
    key: 'state',
    label: 'State or region',
    options: [
      { label: 'California', value: 'ca' },
      { label: 'New York', value: 'ny' },
      { label: 'Texas', value: 'tx' },
      { label: 'Washington', value: 'wa' }
    ]
  },
  {
    key: 'city',
    label: 'City',
    options: [
      { label: 'Los Angeles', value: 'la' },
      { label: 'San Diego', value: 'sd' },
      { label: 'San Francisco', value: 'sf' }
    ]
  }
]
export const profileSourceControls = [
  {
    key: 'github',
    name: 'GitHub',
    href: 'https://github.com/settings/installations',
    icon: 'az az-github',
    connected: true,
    tag: 'Active',
    description:
      'Connected as jane-doe, with access to the acme and jane-doe-personal organizations.',
    action: 'Manage'
  },
  {
    key: 'gitlab',
    name: 'GitLab',
    href: '/account/integrations/gitlab',
    icon: 'az-color az-gitlab',
    connected: false,
    tag: '',
    description: 'Connect GitLab to build and deploy from its repositories.',
    action: 'Connect'
  },
  {
    key: 'bitbucket',
    name: 'Bitbucket',
    href: '/account/integrations/bitbucket',
    icon: 'az-color az-bitbucket',
    connected: false,
    tag: '',
    description: 'Connect Bitbucket to build and deploy from its repositories.',
    action: 'Connect'
  }
]
export const profileFonts = [
  { value: 'rubik', label: 'Rubik' },
  { value: 'inter', label: 'Inter' },
  { value: 'ibm-plex-sans', label: 'IBM Plex Sans' },
  { value: 'geist', label: 'Geist' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'work-sans', label: 'Work Sans' },
  { value: 'instrument-sans', label: 'Instrument Sans' },
  { value: 'hedvig-letters-sans', label: 'Hedvig Letters Sans' }
]
export const profileAppearances = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' }
]

/** The values of the Profile variant's form. */
export interface ProfileAccountForm {
  /** What the account is called across the console. */
  accountName: string
  /** The read-only client ID. */
  clientId: string
  /** The legal entity that owns the account. */
  companyName: string
  /** The owner's tax ID. */
  taxId: string
  /** Invoice recipients, separated by semicolons. */
  billingEmails: string
  /** Postal code of the registered address. */
  postalCode: string
  /** Country option value. */
  country: string
  /** State option value. */
  state: string
  /** City option value. */
  city: string
  /** First address line. */
  address: string
  /** Second address line. */
  apartment: string
  /** Users may sign in with social credentials. */
  allowSocialLogin: boolean
}

/** The validation messages of the Profile variant's required fields. */
export interface ProfileAccountErrors {
  /** Message under Account name. */
  accountName: string
  /** Message under Billing emails. */
  billingEmails: string
}

export const sampleProfileAccount: ProfileAccountForm = {
  accountName: 'Acme',
  clientId: '9757a',
  companyName: '',
  taxId: '',
  billingEmails: '',
  postalCode: '94105',
  country: 'us',
  state: 'ca',
  city: 'sf',
  address: '100 Market Street',
  apartment: 'Suite 400',
  allowSocialLogin: true
}
