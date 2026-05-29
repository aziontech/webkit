import { ref } from 'vue'

import Button from '@aziontech/webkit/button'
import Dialog from '@aziontech/webkit/overlay/dialog'
import DialogClose from '@aziontech/webkit/overlay/dialog-close'
import DialogContent from '@aziontech/webkit/overlay/dialog-content'
import DialogDescription from '@aziontech/webkit/overlay/dialog-description'
import DialogOverlay from '@aziontech/webkit/overlay/dialog-overlay'
import DialogPortal from '@aziontech/webkit/overlay/dialog-portal'
import DialogTitle from '@aziontech/webkit/overlay/dialog-title'
import DialogTrigger from '@aziontech/webkit/overlay/dialog-trigger'
import PanelContent from '@aziontech/webkit/overlay/panel-content'
import PanelFooter from '@aziontech/webkit/overlay/panel-footer'
import PanelHeader from '@aziontech/webkit/overlay/panel-header'

const sizes = ['small', 'medium', 'large']

export default {
  title: 'Webkit/Overlay/Dialog',
  component: Dialog,
  subcomponents: {
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
    PanelHeader,
    PanelContent,
    PanelFooter
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    actions: { argTypesRegex: '^on[A-Z].*' },
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          'Modal dialog built on the shared Panel shell. Figma Webkit Panel (node 482:935). Supports overlay backdrop, closeable behavior, and theme motion tokens (panel scale 0.98 → 1 + opacity fade, overlay fade).'
      }
    }
  },
  decorators: [
    () => ({
      template: '<div class="flex min-h-screen w-full items-center justify-center"><story /></div>'
    })
  ],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controlled open state. Use with v-model:open',
      table: { defaultValue: { summary: undefined } }
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state when uncontrolled',
      table: { defaultValue: { summary: false } }
    },
    closeable: {
      control: 'boolean',
      description: 'When true, Escape and overlay click close the dialog',
      table: { defaultValue: { summary: true } }
    },
    size: {
      control: 'select',
      options: sizes,
      description: 'Panel max-width preset',
      table: { defaultValue: { summary: 'medium' } }
    },
    'update:open': { action: 'update:open' }
  },
  args: {
    defaultOpen: false,
    closeable: true,
    size: 'medium'
  }
}

const alertDialogTemplate = `
  <Dialog v-bind="args" v-model:open="open">
    <DialogTrigger>
      <Button label="Open alert" kind="primary" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <PanelContent class="p-0">
          <div class="flex w-full flex-col">
            <div
              class="flex items-start gap-[var(--spacing-4)] px-[var(--spacing-6)] py-[var(--spacing-6)]"
            >
              <div class="flex min-w-0 flex-1 flex-col gap-[var(--spacing-2)]">
                <DialogTitle>Cancel Scheduled Downgrade</DialogTitle>
                <DialogDescription>
                  Confirm to remove the scheduled downgrade. Your current plan will continue without changes.
                </DialogDescription>
              </div>
              <DialogClose class="shrink-0" />
            </div>
            <div
              class="flex flex-col gap-[var(--spacing-3)] border-t border-[length:var(--border-width-default)] border-[var(--border-muted)] px-[var(--spacing-6)] py-[var(--spacing-4)] md:flex-row md:justify-end"
            >
              <Button class="w-full md:w-auto" label="Cancel" size="medium" kind="outlined" @click="open = false" />
              <Button class="w-full md:w-auto" kind="secondary" size="medium" label="Keep current plan" @click="open = false" />
            </div>
          </div>
        </PanelContent>
      </DialogContent>
    </DialogPortal>
  </Dialog>
`

export const Default = {
  args: {
    defaultOpen: false,
    closeable: true,
    size: 'small'
  },
  render: (args) => ({
    components: {
      Dialog,
      DialogTrigger,
      DialogPortal,
      DialogOverlay,
      DialogContent,
      DialogTitle,
      DialogDescription,
      DialogClose,
      PanelContent,
      Button
    },
    setup() {
      const open = ref(args.defaultOpen)
      return { args, open }
    },
    template: alertDialogTemplate
  })
}
