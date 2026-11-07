import { reactive, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  consoleComponents,
  consolePage,
  consoleScript,
  consoleSetup,
  optionSelect,
  pageHeading
} from './_form-patterns'
import { declare } from './_forms-markup'

const BREADCRUMB = [{ label: 'Forms', href: '/forms' }, { label: 'CardBox with independent saves' }]

const TOOLBAR_OPTIONS = [
  { label: 'Default (controlled at the team level)', value: 'default' },
  { label: 'Enabled', value: 'enabled' },
  { label: 'Disabled', value: 'disabled' }
]

const PROTECTION_OPTIONS = [
  { label: 'Standard Protection', value: 'standard' },
  { label: 'Only Preview Deployments', value: 'preview' },
  { label: 'All Deployments', value: 'all' }
]

const TOOLBAR_FORM = { preprod: 'default', prod: 'default' }
const PROTECTION_FORM = { level: 'standard', shareableLinks: true }

const NAMES = ['Button', 'CardBox', 'Label', 'Link', 'Message', 'Select', 'Switch']

const labelIn = (list) => (value) => list.find((option) => option.value === value)?.label ?? ''

const toolbarSelect = (id, model) => `<div class="flex flex-col gap-(--spacing-xs)">
  <Label for="${id}">${id === 'tb-preprod' ? 'Pre-Production Deployments' : 'Production Deployments'}</Label>
${indent(
  optionSelect({
    model,
    options: 'toolbarOptions',
    display: 'toolbarLabel',
    attrs: [':disabled="savingToolbar"'],
    trigger: [`id="${id}"`]
  })
)}
</div>`

const TOOLBAR_CARD = `<CardBox
  title="Azion Toolbar"
  class="layout-section-start w-full"
>
  <template #content>
    <fieldset
      class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
      :disabled="savingToolbar"
    >
      <legend class="sr-only">Azion Toolbar</legend>

      <Message
        severity="info"
        label="Enable the Azion Toolbar on your Deployments. To use the toolbar in production your team members need the Chrome extension or to enable the toolbar for that domain in the toolbar menu."
      />

      <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
${indent(toolbarSelect('tb-preprod', 'toolbar.preprod'), 4)}
${indent(toolbarSelect('tb-prod', 'toolbar.prod'), 4)}
      </div>
    </fieldset>
  </template>
  <template #footer>
    <div class="flex w-full items-center justify-between gap-(--spacing-sm)">
      <Link
        href="#"
        label="Learn more about the Azion Toolbar"
        size="medium"
      />
      <Button
        label="Save"
        kind="secondary"
        size="medium"
        :loading="savingToolbar"
        @click="saveToolbar"
      />
    </div>
  </template>
</CardBox>`

const PROTECTION_CARD = `<CardBox
  title="Deployment Protection"
  class="layout-section-start w-full"
>
  <template #content>
    <fieldset
      class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
      :disabled="savingProtection"
    >
      <legend class="sr-only">Deployment Protection</legend>

      <Message
        severity="info"
        label="Control who can access your Deployments. Standard Protection challenges every visitor before a Deployment loads; shareable links let you grant bypass access with a generated URL."
      />

      <div class="flex flex-col gap-(--spacing-xs)">
        <Label for="dp-level">Azion Authentication</Label>
${indent(
  optionSelect({
    model: 'protection.level',
    options: 'protectionOptions',
    display: 'protectionLabel',
    attrs: [':disabled="savingProtection"', 'class="sm:max-w-(--container-sm)"'],
    trigger: ['id="dp-level"']
  }),
  4
)}
      </div>

      <div class="flex items-center justify-between gap-(--spacing-md)">
        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
          <Label id="dp-links-label">Shareable Links</Label>
          <p class="text-body-sm text-(--text-muted)">
            Allow bypassing protection with a generated link.
          </p>
        </div>
        <Switch
          v-model="protection.shareableLinks"
          aria-labelledby="dp-links-label"
          :disabled="savingProtection"
        />
      </div>
    </fieldset>
  </template>
  <template #footer>
    <div class="flex w-full items-center justify-end gap-(--spacing-sm)">
      <Button
        label="Save"
        kind="secondary"
        size="medium"
        :loading="savingProtection"
        @click="saveProtection"
      />
    </div>
  </template>
</CardBox>`

const TEMPLATE = consolePage({
  main: `<main class="flex w-full flex-col">
${indent(
  pageHeading({
    title: 'Project Settings',
    description:
      'A long configuration page split into cards. Each card owns its own save, so changes commit in parts.'
  })
)}

${indent(TOOLBAR_CARD)}

${indent(PROTECTION_CARD)}
</main>`
})

const setupFor = (savingCard) => () => {
  const savingToolbar = ref(savingCard === 'toolbar')
  const savingProtection = ref(false)
  const saveCard = (flag) => {
    if (flag.value) return
    flag.value = true
    setTimeout(() => {
      flag.value = false
    }, 900)
  }
  return consoleSetup({
    breadcrumb: BREADCRUMB,
    state: {
      toolbarOptions: TOOLBAR_OPTIONS,
      toolbarLabel: labelIn(TOOLBAR_OPTIONS),
      toolbar: reactive({ ...TOOLBAR_FORM }),
      savingToolbar,
      protectionOptions: PROTECTION_OPTIONS,
      protectionLabel: labelIn(PROTECTION_OPTIONS),
      protection: reactive({ ...PROTECTION_FORM }),
      savingProtection,
      saveToolbar: () => saveCard(savingToolbar),
      saveProtection: () => saveCard(savingProtection)
    }
  })
}

const scriptFor = (savingCard) =>
  consoleScript({
    breadcrumb: BREADCRUMB,
    names: NAMES,
    vue: ['reactive', 'ref'],
    body: [
      declare('toolbarOptions', TOOLBAR_OPTIONS),
      'const toolbarLabel = (value) =>',
      "  toolbarOptions.find((option) => option.value === value)?.label ?? ''",
      declare('toolbar', TOOLBAR_FORM, 'reactive'),
      `const savingToolbar = ref(${savingCard === 'toolbar'})`,
      '',
      declare('protectionOptions', PROTECTION_OPTIONS),
      'const protectionLabel = (value) =>',
      "  protectionOptions.find((option) => option.value === value)?.label ?? ''",
      declare('protection', PROTECTION_FORM, 'reactive'),
      'const savingProtection = ref(false)',
      '',
      'const saveCard = (flag) => {',
      '  if (flag.value) return',
      '  flag.value = true',
      '  setTimeout(() => {',
      '    flag.value = false',
      '  }, 900)',
      '}',
      '',
      'const saveToolbar = () => saveCard(savingToolbar)',
      'const saveProtection = () => saveCard(savingProtection)'
    ]
  })

const components = consoleComponents(NAMES)

const meta = {
  title: 'Templates/Platform/Forms/CardBoxSaves',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A long configuration page split into titled cards that each own their save, from the forms lab (CardBox with independent saves, `/forms/cardbox`): the console shell, a page heading, then one `CardBox` per topic with an info `Message`, stacked label-and-control fields inside a fieldset, and a footer whose secondary Save commits that card alone, beside an optional docs `Link`. Project Settings is the example, with Azion Toolbar and Deployment Protection. Built from the platform shell, `CardBox`, `Message`, `Label`, `Select`, `Switch`, `Link` and `Button`.'
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
        story:
          'Both cards at rest: Azion Toolbar with its two deployment selects and the docs link beside Save, Deployment Protection with the authentication select and the Shareable Links switch.'
      },
      source: { code: toSfc(scriptFor(''), TEMPLATE) }
    }
  }
}

export const SavingOneCard = {
  render: () => ({ components, setup: setupFor('toolbar'), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'Azion Toolbar is saving: its Save shows the loading state and its selects are disabled, while Deployment Protection stays editable.'
      },
      source: { code: toSfc(scriptFor('toolbar'), TEMPLATE) }
    }
  }
}
