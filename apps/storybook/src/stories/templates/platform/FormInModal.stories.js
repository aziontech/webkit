import { computed, ref, watch } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  consoleComponents,
  consolePage,
  consoleScript,
  consoleSetup,
  pageHeading,
  PANEL_FOOTER_LAYOUT
} from './_form-patterns'
import { declare } from './_forms-markup'

const BREADCRUMB = [{ label: 'Forms', href: '/forms' }, { label: 'Dialog form' }]

const RESOURCE = { name: 'resource-01' }

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
      label="Delete Resource"
      kind="danger"
      size="medium"
      icon="pi pi-trash"
    />
  </DialogTrigger>
  <DialogPortal>
    <DialogOverlay />
    <DialogContent>
      <PanelHeader class="w-full">
        <DialogTitle>Delete Resource</DialogTitle>
        <DialogClose />
      </PanelHeader>

      <PanelContent>
        <div class="flex flex-col gap-(--spacing-md)">
          <Message
            severity="warning"
            label="Once confirmed, this action can't be reversed. The selected resource will be deleted, along with all associated settings or instances. Check the Help Center for more details."
          />
          <FieldText
            v-model="confirmation"
            input-id="confirm-delete"
            :label="confirmLabel"
            :disabled="submitting"
          />
        </div>
      </PanelContent>

      <PanelFooter>
        <div class="${PANEL_FOOTER_LAYOUT}">
          <div class="w-full md:w-fit">
            <Button
              class="w-full"
              type="button"
              label="Cancel"
              kind="outlined"
              size="medium"
              :disabled="submitting"
              @click="open = false"
            />
          </div>
          <div class="w-full md:w-fit">
            <Button
              class="w-full"
              label="Delete"
              kind="danger"
              size="medium"
              :disabled="!canDelete"
              :loading="submitting"
              @click="remove"
            />
          </div>
        </div>
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
      'A short, blocking decision in a modal. This destructive delete stays disabled until the exact resource name is typed.'
  })
)}

  <Item
    kind="outline"
  >
    <Item.Content>
      <Item.Title>Delete this resource</Item.Title>
      <Item.Description>
        Permanently removes
        <span class="text-label-code-sm">{{ resource.name }}</span> and all associated
        settings. This cannot be undone.
      </Item.Description>
    </Item.Content>

    <Item.Actions>
${indent(DIALOG, 3)}
    </Item.Actions>
  </Item>
</main>`
})

const setup = () => {
  const open = ref(false)
  const confirmation = ref('')
  const submitting = ref(false)
  const canDelete = computed(() => confirmation.value.trim() === RESOURCE.name)
  const confirmLabel = computed(() => `To confirm, type "${RESOURCE.name}" in the box below:`)
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
      resource: RESOURCE,
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
    declare('resource', RESOURCE),
    '',
    ...`const open = ref(false)
const confirmation = ref('')
const submitting = ref(false)

const canDelete = computed(() => confirmation.value.trim() === resource.name)
const confirmLabel = computed(() => \`To confirm, type "\${resource.name}" in the box below:\`)

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
  title: 'Templates/Platform/Forms/FormInModal',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A short, blocking decision in a modal: an outlined `Item` row on the page names what the delete removes and holds the danger trigger, and the medium dialog it opens stacks a warning `Message` over a labelled `FieldText` asking for the exact resource name, with Delete disabled until the typed name matches. The field clears every time the dialog opens, so its content stays in place while it closes. It is the form counterpart of the Delete dialog on the resource lists (Templates/Platform/Overlays/DeleteWithConfirmation), which renders the name as a copy chip with a bare input instead of a labelled field. Built from the platform shell, `Item`, `Dialog` with its trigger, portal, overlay, content, title and close parts, `PanelHeader`, `PanelContent`, `PanelFooter`, `Message`, `FieldText` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    },
    webkit: {
      intents: [
        'form in modal',
        'dialog form',
        'modal form',
        'blocking decision',
        'type name to delete',
        'confirm in dialog',
        'formulário em modal',
        'formulário no diálogo',
        'modal com formulário'
      ],
      skills: ['webkit-form', 'webkit-errors', 'webkit-ux-heuristics']
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
          'Closed behind the Delete Resource trigger: typing resource-01 into the field enables Delete, and Cancel or Delete closes the dialog.'
      },
      source: { code: toSfc(SCRIPT, TEMPLATE) }
    }
  }
}
