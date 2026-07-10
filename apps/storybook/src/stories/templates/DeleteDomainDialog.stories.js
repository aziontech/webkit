import Button from '@aziontech/webkit/button'
import Message from '@aziontech/webkit/message'
import InputText from '@aziontech/webkit/input-text'
import Link from '@aziontech/webkit/link'
import Dialog from '@aziontech/webkit/dialog'
import DialogClose from '@aziontech/webkit/dialog-close'
import DialogContent from '@aziontech/webkit/dialog-content'
import DialogOverlay from '@aziontech/webkit/dialog-overlay'
import DialogPortal from '@aziontech/webkit/dialog-portal'
import DialogTitle from '@aziontech/webkit/dialog-title'
import DialogTrigger from '@aziontech/webkit/dialog-trigger'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelFooter from '@aziontech/webkit/panel-footer'
import PanelHeader from '@aziontech/webkit/panel-header'
import { computed, ref, watch } from 'vue'

import { toSfc } from '../_shared/story-source'

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

// Runnable "Show code" snippet — a standalone SFC that renders identically to the
// canvas. Concrete props only (no v-bind="args"); local state and handlers are the
// same shape the canvas relies on.
const SNIPPET_IMPORTS = [
  "import Dialog from '@aziontech/webkit/dialog'",
  "import DialogTrigger from '@aziontech/webkit/dialog-trigger'",
  "import DialogPortal from '@aziontech/webkit/dialog-portal'",
  "import DialogOverlay from '@aziontech/webkit/dialog-overlay'",
  "import DialogContent from '@aziontech/webkit/dialog-content'",
  "import DialogTitle from '@aziontech/webkit/dialog-title'",
  "import DialogClose from '@aziontech/webkit/dialog-close'",
  "import PanelHeader from '@aziontech/webkit/panel-header'",
  "import PanelContent from '@aziontech/webkit/panel-content'",
  "import PanelFooter from '@aziontech/webkit/panel-footer'",
  "import Button from '@aziontech/webkit/button'",
  "import Message from '@aziontech/webkit/message'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Link from '@aziontech/webkit/link'",
  "import { computed, ref } from 'vue'"
]

const snippetScript = (initialOpen) => [
  ...SNIPPET_IMPORTS,
  '',
  `const open = ref(${initialOpen})`,
  "const confirmationInput = ref('')",
  "const confirmationPhrase = 'teste'",
  "const confirmLabelId = 'delete-domain-confirm-label'",
  '',
  'const canDelete = computed(',
  '  () => confirmationInput.value.trim() === confirmationPhrase.trim()',
  ')',
  '',
  'const handleDelete = () => {',
  '  if (!canDelete.value) return',
  '  open.value = false',
  "  confirmationInput.value = ''",
  '}'
]

const SNIPPET_MARKUP = `<Dialog size="medium" v-model:open="open">
  <DialogTrigger>
    <Button label="Delete domain" kind="danger" />
  </DialogTrigger>
  <DialogPortal>
    <DialogOverlay />
    <DialogContent>
      <PanelHeader class="w-full">
        <DialogTitle>Delete Domain</DialogTitle>
        <DialogClose />
      </PanelHeader>
      <PanelContent class="flex flex-col gap-[var(--spacing-md)]">
        <Message severity="warning" title="Once confirmed, this action can't be reversed." />
        <p class="m-0 text-body-sm text-[var(--text-muted)]">
          The selected Domain will be deleted, along with all associated settings or instances. Check the
          <Link
            class="!inline-flex !h-auto !min-h-0 align-baseline"
            href="#"
            label="Help Center"
            :show-icon="false"
            size="medium"
          />
          for more details.
        </p>
        <p :id="confirmLabelId" class="m-0 text-body-sm text-[var(--text-default)]">
          To confirm, type "{{ confirmationPhrase }}" in the box below:
        </p>
        <InputText
          v-model="confirmationInput"
          :aria-labelledby="confirmLabelId"
          autocomplete="off"
          class="w-full"
        />
      </PanelContent>
      <PanelFooter class="flex-col md:flex-row md:justify-end">
        <Button class="w-full md:w-auto" label="Cancel" kind="outlined" @click="open = false" />
        <Button class="w-full md:w-auto" label="Delete" kind="danger" :disabled="!canDelete" @click="handleDelete" />
      </PanelFooter>
    </DialogContent>
  </DialogPortal>
</Dialog>`

const deleteDomainTemplate = `
  <Dialog
    :closeable="args.closeable"
    :size="args.size"
    :open="open"
    data-testid="template-delete-domain-dialog"
    @update:open="onOpenUpdate"
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
              class="inline-flex! h-auto! min-h-0! align-baseline"
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
            @click="onOpenUpdate(false)"
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

    watch(
      () => args.defaultOpen,
      (next) => {
        open.value = next ?? false
      }
    )

    const onOpenUpdate = (next) => {
      open.value = next
      args['onUpdate:open']?.(next)
    }

    const handleDelete = () => {
      if (!canDelete.value) return
      open.value = false
      args['onUpdate:open']?.(false)
      confirmationInput.value = ''
    }

    return {
      args,
      open,
      confirmationInput,
      confirmLabelId,
      canDelete,
      onOpenUpdate,
      handleDelete
    }
  },
  template: deleteDomainTemplate
})

/** @type {import('@storybook/vue3').Meta<typeof Dialog>} */
const meta = {
  title: 'Templates/DeleteDomainDialog',
  component: Dialog,
  subcomponents: {
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
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'Destructive confirmation dialog template. Composes Dialog with a warning Message, a confirmation InputText, and Cancel / Delete actions — Delete stays disabled until the user types the exact confirmation phrase.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state when the dialog is uncontrolled.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    closeable: {
      control: 'boolean',
      description: 'When true, Escape and overlay click close the dialog.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Panel max-width preset passed to the inner Panel.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    triggerLabel: {
      control: 'text',
      description: 'Label on the danger trigger button that opens the dialog.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Delete domain'" }
      }
    },
    title: {
      control: 'text',
      description: 'Dialog header title.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Delete Domain'" }
      }
    },
    warningTitle: {
      control: 'text',
      description: 'Warning message shown at the top of the body.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: '"Once confirmed, this action can\'t be reversed."' }
      }
    },
    descriptionBeforeLink: {
      control: 'text',
      description: 'Body copy rendered before the Help Center link.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'The selected Domain will be deleted…'" }
      }
    },
    descriptionAfterLink: {
      control: 'text',
      description: 'Body copy rendered after the Help Center link.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "' for more details.'" }
      }
    },
    helpCenterLabel: {
      control: 'text',
      description: 'Help Center link label.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Help Center'" }
      }
    },
    helpCenterHref: {
      control: 'text',
      description: 'Help Center link URL.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'#'" }
      }
    },
    confirmationPhrase: {
      control: 'text',
      description: 'Exact text the user must type to enable the Delete action.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'teste'" }
      }
    },
    confirmationPlaceholder: {
      control: 'text',
      description: 'Placeholder for the confirmation input.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    cancelLabel: {
      control: 'text',
      description: 'Cancel button label.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Cancel'" }
      }
    },
    deleteLabel: {
      control: 'text',
      description: 'Delete button label.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Delete'" }
      }
    },
    'onUpdate:open': {
      action: 'update:open',
      description: 'Emitted when the dialog open state changes.',
      table: { category: 'events', type: { summary: '(value: boolean) => void' } }
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

export default meta

/** @type {import('@storybook/vue3').StoryObj<typeof Dialog>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Closed by default — the danger trigger opens the confirmation dialog. Delete enables only once the confirmation phrase is typed exactly.'
      },
      source: { code: toSfc(snippetScript(false), SNIPPET_MARKUP) }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Dialog>} */
export const Open = {
  args: {
    defaultOpen: true
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Opened on load to show the full confirmation flow: warning Message, Help Center link, confirmation input, and the guarded Delete action.'
      },
      source: { code: toSfc(snippetScript(true), SNIPPET_MARKUP) }
    }
  }
}
