import { computed, ref, watch } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  consoleComponents,
  consolePage,
  consoleScript,
  consoleSetup,
  pageHeading,
  PANEL_FOOTER_CLASS
} from './_form-patterns'
import { declare } from './_forms-markup'

const BREADCRUMB = [{ label: 'Forms', href: '/forms' }, { label: 'Dialog form' }]

const APPLICATION = { name: 'webkit-storybook-dev' }

const NAMES = [
  'Button',
  'Dialog',
  'DialogClose',
  'DialogContent',
  'DialogOverlay',
  'DialogPortal',
  'DialogTitle',
  'DialogTrigger',
  'FieldText',
  'Item',
  'Message',
  'PanelContent',
  'PanelFooter',
  'PanelHeader'
]

const DIALOG = `<Dialog
  v-model:open="open"
  size="medium"
>
  <DialogTrigger>
    <Button
      label="Delete Application"
      kind="danger"
      size="medium"
      icon="pi pi-trash"
    />
  </DialogTrigger>
  <DialogPortal>
    <DialogOverlay />
    <DialogContent>
      <PanelHeader class="w-full">
        <DialogTitle>Delete Application</DialogTitle>
        <DialogClose />
      </PanelHeader>

      <PanelContent class="flex flex-col gap-(--spacing-md)">
        <Message
          severity="warning"
          label="Once confirmed, this action can't be reversed. The selected Application will be deleted, along with all associated settings or instances. Check the Help Center for more details."
        />
        <FieldText
          v-model="confirmation"
          input-id="confirm-delete"
          :label="confirmLabel"
          :disabled="submitting"
        />
      </PanelContent>

      <PanelFooter class="${PANEL_FOOTER_CLASS}">
        <Button
          class="w-full md:w-auto"
          type="button"
          label="Cancel"
          kind="outlined"
          size="medium"
          :disabled="submitting"
          @click="open = false"
        />
        <Button
          class="w-full md:w-auto"
          label="Delete"
          kind="danger"
          size="medium"
          :disabled="!canDelete"
          :loading="submitting"
          @click="remove"
        />
      </PanelFooter>
    </DialogContent>
  </DialogPortal>
</Dialog>`

const TEMPLATE = consolePage({
  main: `<main class="flex h-full flex-col">
${indent(
  pageHeading({
    title: 'Dialog form',
    description:
      'A short, blocking decision in a modal. This destructive delete stays disabled until the exact application name is typed.'
  })
)}

  <Item
    kind="outline"
    class="layout-section-start"
  >
    <Item.Content>
      <Item.Title>Delete this Application</Item.Title>
      <Item.Description>
        Permanently removes
        <span class="text-label-code-sm">{{ application.name }}</span> and all associated
        settings. This cannot be undone.
      </Item.Description>
    </Item.Content>

    <Item.Actions class="justify-end">
${indent(DIALOG, 3)}
    </Item.Actions>
  </Item>
</main>`
})

const setup = () => {
  const open = ref(false)
  const confirmation = ref('')
  const submitting = ref(false)
  const canDelete = computed(() => confirmation.value.trim() === APPLICATION.name)
  const confirmLabel = computed(() => `To confirm, type "${APPLICATION.name}" in the box below:`)
  watch(open, (isOpen) => {
    if (isOpen) confirmation.value = ''
  })
  const remove = () => {
    if (!canDelete.value || submitting.value) return
    open.value = false
  }
  return consoleSetup({
    breadcrumb: BREADCRUMB,
    state: {
      application: APPLICATION,
      open,
      confirmation,
      submitting,
      canDelete,
      confirmLabel,
      remove
    }
  })
}

const SCRIPT = consoleScript({
  breadcrumb: BREADCRUMB,
  names: NAMES,
  vue: ['computed', 'ref', 'watch'],
  body: [
    declare('application', APPLICATION),
    '',
    ...`const open = ref(false)
const confirmation = ref('')
const submitting = ref(false)

const canDelete = computed(() => confirmation.value.trim() === application.name)
const confirmLabel = computed(() => \`To confirm, type "\${application.name}" in the box below:\`)

watch(open, (isOpen) => {
  if (isOpen) confirmation.value = ''
})

const remove = () => {
  if (!canDelete.value || submitting.value) return
  open.value = false
}`.split('\n')
  ]
})

const meta = {
  title: 'Templates/Platform/Forms/DialogForm',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A short, blocking decision in a modal, Approach B of the forms lab (Dialog form, `/forms/dialog`): an outlined `Item` row on the page names what the delete removes and holds the danger trigger, and the medium dialog it opens stacks a warning `Message` over a labelled `FieldText` asking for the exact application name, with Delete disabled until the typed name matches. The field clears every time the dialog opens, so its content stays in place while it closes. It is the forms-lab counterpart of the Delete dialog on the resource lists (Templates/Platform/Overlays/DeleteDialog), which renders the name as a copy chip with a bare input instead of a labelled field. Built from the platform shell, `Item`, `Dialog` with its trigger, portal, overlay, content, title and close parts, `PanelHeader`, `PanelContent`, `PanelFooter`, `Message`, `FieldText` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components: consoleComponents(NAMES), setup, template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'Closed behind the Delete Application trigger: typing webkit-storybook-dev into the field enables Delete, and Cancel or Delete closes the dialog.'
      },
      source: { code: toSfc(SCRIPT, TEMPLATE) }
    }
  }
}
