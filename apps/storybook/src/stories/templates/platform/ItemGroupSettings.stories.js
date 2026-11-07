import { computed, reactive, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  consoleComponents,
  consolePage,
  consoleScript,
  consoleSetup,
  itemRow,
  itemSection,
  optionSelect,
  pageHeading,
  sectionLabel,
  stickyFooter,
  withHelper
} from './_form-patterns'
import { declare } from './_forms-markup'

const BREADCRUMB = [{ label: 'Forms', href: '/forms' }, { label: 'ItemGroup settings' }]

const TIMEZONES = [
  { label: '(UTC-03:00) São Paulo', value: 'america-sao_paulo' },
  { label: '(UTC+00:00) London', value: 'europe-london' },
  { label: '(UTC-05:00) New York', value: 'america-new_york' }
]

const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'Português', value: 'pt' },
  { label: 'Español', value: 'es' }
]

const FORM = {
  fullName: 'Gabriel Lisboa',
  email: 'myemail@azion.com',
  timezone: 'america-sao_paulo',
  language: 'en',
  productUpdates: true
}

const NAMES = ['Button', 'CardBox', 'HelperText', 'InputText', 'Item', 'Select', 'Switch']

const labelOf = (list) => (value) => list.find((option) => option.value === value)?.label ?? ''

const FULL_NAME = withHelper(
  `<InputText
  v-model="form.fullName"
  size="large"
  :disabled="submitting"
  class="w-full"
  aria-label="Full Name"
  :required="submitted && nameEmpty"
  :aria-describedby="submitted && nameEmpty ? 'full-name-error' : undefined"
/>`,
  `<HelperText
  v-if="submitted && nameEmpty"
  id="full-name-error"
  kind="required"
  label="This field is required."
/>`
)

const EMAIL = withHelper(
  `<InputText
  v-model="form.email"
  type="email"
  size="large"
  :disabled="submitting"
  class="w-full"
  aria-label="Email"
  :required="submitted && emailEmpty"
  :invalid="submitted && !emailEmpty && emailInvalid"
  :aria-describedby="submitted && emailInvalid ? 'email-error' : undefined"
/>`,
  `<HelperText
  v-if="submitted && emailInvalid"
  id="email-error"
  :kind="emailEmpty ? 'required' : 'invalid'"
  :label="emailEmpty ? 'This field is required.' : 'Enter a valid email address.'"
/>`
)

const preferenceSelect = (model, list, id, label) =>
  optionSelect({
    model,
    options: list,
    display: `labelOf(${list})`,
    attrs: [':disabled="submitting"', 'class="w-full"'],
    trigger: [`id="${id}"`, `aria-label="${label}"`]
  })

const SECTIONS = [
  itemSection({
    heading: sectionLabel('General'),
    start: false,
    rows: [
      itemRow({
        title: 'Full Name',
        description: 'The name shown across the console.',
        control: FULL_NAME
      }),
      itemRow({
        title: 'Email',
        description: 'Used for sign-in and notifications.',
        control: EMAIL
      })
    ]
  }),
  itemSection({
    heading: sectionLabel('Preferences'),
    rows: [
      itemRow({
        title: 'Timezone',
        description: 'Times across the console are shown in this zone.',
        control: preferenceSelect('form.timezone', 'timezones', 'profile-timezone', 'Timezone')
      }),
      itemRow({
        title: 'Language',
        description: 'The console interface language.',
        control: preferenceSelect('form.language', 'languages', 'profile-language', 'Language')
      })
    ]
  }),
  itemSection({
    heading: sectionLabel('Notifications'),
    rows: [
      itemRow({
        title: 'Product updates',
        description: 'Occasional emails about new features and changes.',
        compact: true,
        control: `<Switch
  v-model="form.productUpdates"
  aria-label="Product updates"
  :disabled="submitting"
/>`
      })
    ]
  })
]

const TEMPLATE = consolePage({
  padded: false,
  main: `<form
  class="flex min-h-full flex-col"
  aria-labelledby="profile-title"
  novalidate
  @submit.prevent="submit"
>
  <div class="layout-column-form layout-boundary flex flex-1 flex-col">
${indent(
  pageHeading({
    title: 'Profile',
    titleId: 'profile-title',
    description:
      'Define and manage personal account preferences and profile config. Topic sections of Item rows, each titled by a section heading, saved as a single unit.'
  }),
  2
)}

    <fieldset
      class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
      :disabled="submitting"
    >
      <legend class="sr-only">Profile settings</legend>

${indent(SECTIONS.join('\n\n'), 3)}
    </fieldset>
  </div>

${indent(stickyFooter({ cancelDisabled: 'submitting', loading: 'submitting', submit: '@click="submit"' }))}
</form>`
})

const setupFor = (saving) => () => {
  const form = reactive({ ...FORM })
  const submitted = ref(false)
  const submitting = ref(saving)
  const nameEmpty = computed(() => !form.fullName.trim())
  const emailEmpty = computed(() => !form.email.trim())
  const emailInvalid = computed(() => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim()))
  const isValid = computed(() => !nameEmpty.value && !emailInvalid.value)
  const submit = () => {
    if (submitting.value) return
    submitted.value = true
    if (!isValid.value) return
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
    }, 900)
  }
  return consoleSetup({
    breadcrumb: BREADCRUMB,
    state: {
      timezones: TIMEZONES,
      languages: LANGUAGES,
      labelOf,
      form,
      submitted,
      submitting,
      nameEmpty,
      emailEmpty,
      emailInvalid,
      submit
    }
  })
}

const scriptFor = (saving) =>
  consoleScript({
    breadcrumb: BREADCRUMB,
    names: NAMES,
    vue: ['computed', 'reactive', 'ref'],
    body: [
      declare('timezones', TIMEZONES),
      declare('languages', LANGUAGES),
      "const labelOf = (list) => (value) => list.find((option) => option.value === value)?.label ?? ''",
      '',
      declare('form', FORM, 'reactive'),
      'const submitted = ref(false)',
      `const submitting = ref(${saving})`,
      '',
      'const nameEmpty = computed(() => !form.fullName.trim())',
      'const emailEmpty = computed(() => !form.email.trim())',
      'const emailInvalid = computed(() => !/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(form.email.trim()))',
      'const isValid = computed(() => !nameEmpty.value && !emailInvalid.value)',
      '',
      'const submit = () => {',
      '  if (submitting.value) return',
      '  submitted.value = true',
      '  if (!isValid.value) return',
      '  submitting.value = true',
      '  setTimeout(() => {',
      '    submitting.value = false',
      '  }, 900)',
      '}'
    ]
  })

const components = consoleComponents(NAMES)

const meta = {
  title: 'Templates/Platform/Forms/ItemGroupSettings',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Account-level settings as `Item` rows saved as one unit, Approach A of the forms lab (ItemGroup settings, `/forms/itemgroup`): the console shell with an unpadded scroll region, the form column opening with a small page heading, topic sections each a small heading over a flush `CardBox` of rows, and one full-bleed sticky footer with Cancel and Save. Profile is the example, with General (Full Name, Email), Preferences (Timezone, Language) and Notifications (Product updates). Full Name and Email flag only after Save is pressed. Built from the platform shell, `CardBox`, `Item`, `InputText`, `Select`, `Switch`, `HelperText` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, setup: setupFor(false), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Profile page filled in, with the footer pinned to the bottom of the scroll region.'
      },
      source: { code: toSfc(scriptFor(false), TEMPLATE) }
    }
  }
}

export const Saving = {
  render: () => ({ components, setup: setupFor(true), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'While the save is in flight: the whole fieldset is disabled, Cancel is disabled and Save shows its loading state.'
      },
      source: { code: toSfc(scriptFor(true), TEMPLATE) }
    }
  }
}
