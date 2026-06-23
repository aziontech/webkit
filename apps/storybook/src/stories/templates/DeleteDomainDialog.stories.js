import Button from '@aziontech/webkit/button'
import Message from '@aziontech/webkit/message'
import InputText from '@aziontech/webkit/inputs/input-text'
import Link from '@aziontech/webkit/link'
import Dialog from '@aziontech/webkit/overlay/dialog'
import DialogClose from '@aziontech/webkit/overlay/dialog-close'
import DialogContent from '@aziontech/webkit/overlay/dialog-content'
import DialogOverlay from '@aziontech/webkit/overlay/dialog-overlay'
import DialogPortal from '@aziontech/webkit/overlay/dialog-portal'
import DialogTitle from '@aziontech/webkit/overlay/dialog-title'
import DialogTrigger from '@aziontech/webkit/overlay/dialog-trigger'
import PanelContent from '@aziontech/webkit/overlay/panel-content'
import PanelFooter from '@aziontech/webkit/overlay/panel-footer'
import PanelHeader from '@aziontech/webkit/overlay/panel-header'
import { computed, ref } from 'vue'

const templateComponents = {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogClose,
  PanelHeader,
  PanelContent,
  PanelFooter,
  Button,
  Message,
  InputText,
  Link
}

const deleteDomainTemplate = `
  <Dialog
    v-bind="args"
    v-model:open="open"
    data-testid="template-delete-domain-dialog"
  >
    <DialogTrigger>
      <Button :label="args.triggerLabel" kind="danger" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <PanelHeader class="w-full">
          <DialogTitle>{{ args.title }}</DialogTitle>
          <DialogClose />
        </PanelHeader>
        <PanelContent class="flex flex-col gap-[var(--spacing-md)]">
          <Message
            severity="warning"
            :title="args.warningTitle"
            data-testid="template-delete-domain-dialog__warning"
          />
          <p class="m-0 text-body-sm text-[var(--text-muted)]">
            {{ args.descriptionBeforeLink }}
            <Link
              class="!inline-flex !h-auto !min-h-0 align-baseline"
              :href="args.helpCenterHref"
              :label="args.helpCenterLabel"
              :show-icon="false"
              size="medium"
              data-testid="template-delete-domain-dialog__help-link"
            />
            {{ args.descriptionAfterLink }}
          </p>
          <p
            :id="confirmLabelId"
            class="m-0 text-body-sm text-[var(--text-default)]"
            data-testid="template-delete-domain-dialog__confirm-label"
          >
            To confirm, type &quot;{{ args.confirmationPhrase }}&quot; in the box below:
          </p>
          <InputText
            v-model="confirmationInput"
            :placeholder="args.confirmationPlaceholder"
            :aria-labelledby="confirmLabelId"
            autocomplete="off"
            class="w-full"
            data-testid="template-delete-domain-dialog__confirm-input"
          />
        </PanelContent>
        <PanelFooter class="flex-col md:flex-row md:justify-end">
          <Button
            class="w-full md:w-auto"
            :label="args.cancelLabel"
            kind="outlined"
            data-testid="template-delete-domain-dialog__cancel"
            @click="open = false"
          />
          <Button
            class="w-full md:w-auto"
            :label="args.deleteLabel"
            kind="danger"
            :disabled="!canDelete"
            data-testid="template-delete-domain-dialog__delete"
            @click="handleDelete"
          />
        </PanelFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
`

const Template = (args) => ({
  components: templateComponents,
  setup() {
    const open = ref(args.defaultOpen ?? false)
    const confirmationInput = ref('')
    const confirmLabelId = 'template-delete-domain-dialog-confirm-label'

    const canDelete = computed(
      () => confirmationInput.value.trim() === String(args.confirmationPhrase ?? '').trim()
    )

    const handleDelete = () => {
      if (!canDelete.value) return
      open.value = false
      confirmationInput.value = ''
    }

    return {
      args,
      open,
      confirmationInput,
      confirmLabelId,
      canDelete,
      handleDelete
    }
  },
  template: deleteDomainTemplate
})

/** @type {import('@storybook/vue3').Meta} */
export default {
  title: 'Templates/DeleteDomainDialog',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          'Destructive confirmation dialog template. Composes Webkit Dialog with a warning Message, confirmation InputText, and Cancel / Delete actions. Delete stays disabled until the user types the exact confirmation phrase.'
      }
    }
  },
  decorators: [
    () => ({
      template: '<div class="flex min-h-screen w-full items-center justify-center"><story /></div>'
    })
  ],
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state when uncontrolled',
      table: { defaultValue: { summary: false }, category: 'Dialog' }
    },
    closeable: {
      control: 'boolean',
      description: 'When true, Escape and overlay click close the dialog',
      table: { defaultValue: { summary: true }, category: 'Dialog' }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Panel max-width preset',
      table: { defaultValue: { summary: 'medium' }, category: 'Dialog' }
    },
    triggerLabel: {
      control: 'text',
      description: 'Label on the trigger button that opens the dialog',
      table: { category: 'Content' }
    },
    title: {
      control: 'text',
      description: 'Dialog header title',
      table: { category: 'Content' }
    },
    warningTitle: {
      control: 'text',
      description: 'Warning message shown at the top of the body',
      table: { category: 'Content' }
    },
    descriptionBeforeLink: {
      control: 'text',
      description: 'Body copy before the Help Center link',
      table: { category: 'Content' }
    },
    descriptionAfterLink: {
      control: 'text',
      description: 'Body copy after the Help Center link',
      table: { category: 'Content' }
    },
    helpCenterLabel: {
      control: 'text',
      description: 'Help Center link label',
      table: { category: 'Content' }
    },
    helpCenterHref: {
      control: 'text',
      description: 'Help Center link URL',
      table: { category: 'Content' }
    },
    confirmationPhrase: {
      control: 'text',
      description: 'Exact text the user must type to enable Delete',
      table: { category: 'Content' }
    },
    confirmationPlaceholder: {
      control: 'text',
      description: 'Placeholder for the confirmation input',
      table: { category: 'Content' }
    },
    cancelLabel: {
      control: 'text',
      description: 'Cancel button label',
      table: { category: 'Content' }
    },
    deleteLabel: {
      control: 'text',
      description: 'Delete button label',
      table: { category: 'Content' }
    },
    'onUpdate:open': {
      action: 'update:open',
      description: 'Emitted when open state changes',
      table: { category: 'events' }
    }
  },
  args: {
    defaultOpen: false,
    closeable: true,
    size: 'medium',
    triggerLabel: 'Delete domain',
    title: 'Delete Domain',
    warningTitle: "Once confirmed, this action can't be reversed.",
    descriptionBeforeLink:
      'The selected Domain will be deleted, along with all associated settings or instances. Check the ',
    descriptionAfterLink: ' for more details.',
    helpCenterLabel: 'Help Center',
    helpCenterHref: '#',
    confirmationPhrase: 'teste',
    confirmationPlaceholder: '',
    cancelLabel: 'Cancel',
    deleteLabel: 'Delete'
  }
}

export const Default = {
  render: Template
}

export const Open = {
  args: {
    defaultOpen: true
  },
  render: Template
}
