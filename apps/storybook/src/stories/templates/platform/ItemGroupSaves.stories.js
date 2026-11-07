import { reactive, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  consoleComponents,
  consolePage,
  consoleScript,
  consoleSetup,
  itemRow,
  optionSelect,
  pageHeading,
  sectionLabel
} from './_form-patterns'
import { declare } from './_forms-markup'

const BREADCRUMB = [
  { label: 'Forms', href: '/forms' },
  { label: 'ItemGroup with independent saves' }
]

const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'Português', value: 'pt' },
  { label: 'Español', value: 'es' }
]

const NAMES = ['Button', 'CardBox', 'InputText', 'Item', 'Select', 'Switch']

const languageLabel = (value) => LANGUAGES.find((option) => option.value === value)?.label ?? ''

const group = ({
  title,
  flag,
  rows,
  save
}) => `<section class="layout-section-start flex flex-col gap-(--layout-group-gap)">
${indent(sectionLabel(title))}
  <CardBox :padded="false">
    <template #content>
      <fieldset
        class="m-0 flex min-w-0 flex-col border-0 p-0"
        :disabled="${flag}"
      >
        <legend class="sr-only">${title}</legend>
        <Item.List>
${indent(rows.join('\n\n'), 5)}
        </Item.List>
      </fieldset>
    </template>
    <template #footer>
      <div class="flex w-full items-center justify-end gap-(--spacing-sm)">
        <Button
          label="Save"
          kind="secondary"
          size="medium"
          :loading="${flag}"
          @click="${save}"
        />
      </div>
    </template>
  </CardBox>
</section>`

const notificationRow = (title, description, model) =>
  itemRow({
    title,
    description,
    compact: true,
    control: `<Switch
  v-model="notifications.${model}"
  aria-label="${title}"
  :disabled="savingNotifications"
/>`
  })

const GENERAL = group({
  title: 'General',
  flag: 'savingGeneral',
  save: 'saveGeneral',
  rows: [
    itemRow({
      title: 'Full Name',
      description: 'The name shown across the console.',
      control: `<InputText
  v-model="general.fullName"
  size="large"
  :disabled="savingGeneral"
  class="w-full"
  aria-label="Full Name"
/>`
    }),
    itemRow({
      title: 'Language',
      description: 'The console interface language.',
      control: optionSelect({
        model: 'general.language',
        options: 'languages',
        display: 'languageLabel',
        attrs: [':disabled="savingGeneral"', 'class="w-full"'],
        trigger: ['id="preferences-language"', 'aria-label="Language"']
      })
    })
  ]
})

const NOTIFICATIONS = group({
  title: 'Notifications',
  flag: 'savingNotifications',
  save: 'saveNotifications',
  rows: [
    notificationRow(
      'Product updates',
      'Occasional emails about new features and changes.',
      'productUpdates'
    ),
    notificationRow(
      'Security alerts',
      'Emails when a sign-in or key change is detected.',
      'securityAlerts'
    )
  ]
})

const TEMPLATE = consolePage({
  main: `<main class="flex w-full flex-col">
${indent(
  pageHeading({
    title: 'Preferences',
    description:
      'The same partitioned-save idea as CardBox, on the ItemGroup surface: Item rows in a flush card, each topic group owning its own save, so changes commit in parts.'
  })
)}

${indent(GENERAL)}

${indent(NOTIFICATIONS)}
</main>`
})

const GENERAL_FORM = { fullName: 'Gabriel Lisboa', language: 'en' }
const NOTIFICATIONS_FORM = { productUpdates: true, securityAlerts: true }

const setupFor = (savingGroup) => () => {
  const savingGeneral = ref(savingGroup === 'general')
  const savingNotifications = ref(false)
  const saveGroup = (flag) => {
    if (flag.value) return
    flag.value = true
    setTimeout(() => {
      flag.value = false
    }, 900)
  }
  return consoleSetup({
    breadcrumb: BREADCRUMB,
    state: {
      languages: LANGUAGES,
      languageLabel,
      general: reactive({ ...GENERAL_FORM }),
      savingGeneral,
      notifications: reactive({ ...NOTIFICATIONS_FORM }),
      savingNotifications,
      saveGeneral: () => saveGroup(savingGeneral),
      saveNotifications: () => saveGroup(savingNotifications)
    }
  })
}

const scriptFor = (savingGroup) =>
  consoleScript({
    breadcrumb: BREADCRUMB,
    names: NAMES,
    vue: ['reactive', 'ref'],
    body: [
      declare('languages', LANGUAGES),
      "const languageLabel = (value) => languages.find((option) => option.value === value)?.label ?? ''",
      '',
      declare('general', GENERAL_FORM, 'reactive'),
      `const savingGeneral = ref(${savingGroup === 'general'})`,
      '',
      declare('notifications', NOTIFICATIONS_FORM, 'reactive'),
      'const savingNotifications = ref(false)',
      '',
      'const saveGroup = (flag) => {',
      '  if (flag.value) return',
      '  flag.value = true',
      '  setTimeout(() => {',
      '    flag.value = false',
      '  }, 900)',
      '}',
      '',
      'const saveGeneral = () => saveGroup(savingGeneral)',
      'const saveNotifications = () => saveGroup(savingNotifications)'
    ]
  })

const components = consoleComponents(NAMES)

const meta = {
  title: 'Templates/Platform/Forms/ItemGroupSaves',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A settings page split into topic groups that each save on their own, from the forms lab (ItemGroup with independent saves, `/forms/itemgroup-saves`): the console shell, a page heading, then one section per topic, each a small heading over a flush `CardBox` of `Item` rows whose footer carries a secondary Save for that group only. Saving one group disables just its own fieldset; the other stays editable. Preferences is the example, with General (Full Name, Language) and Notifications (Product updates, Security alerts). Built from the platform shell, `CardBox`, `Item`, `InputText`, `Select`, `Switch` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, setup: setupFor(''), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story: 'Both groups at rest, each with its own Save in the card footer.'
      },
      source: { code: toSfc(scriptFor(''), TEMPLATE) }
    }
  }
}

export const SavingOneGroup = {
  render: () => ({ components, setup: setupFor('general'), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'General is saving: its Save shows the loading state and its rows are disabled, while Notifications stays editable and can be saved on its own.'
      },
      source: { code: toSfc(scriptFor('general'), TEMPLATE) }
    }
  }
}
