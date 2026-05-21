import { ref } from 'vue'
import { expect, userEvent, within } from '@storybook/test'

import Button from '@aziontech/webkit/actions/button'
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
          'Modal dialog built on the shared Panel shell. Figma Webkit Panel (node 482:935). Supports overlay backdrop, closeable behavior, and theme animation tokens (`animate-fade-in` / `animate-fade-out`).'
      }
    }
  },
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

const dialogTemplate = `
  <Dialog v-bind="args" v-model:open="open">
    <DialogTrigger>
      <Button label="Open dialog" kind="primary" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <PanelHeader class="w-full">
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogClose />
        </PanelHeader>
        <PanelContent>
          <DialogDescription>
            Replace this area with your form or message content.
          </DialogDescription>
        </PanelContent>
        <PanelFooter class="justify-end">
          <Button label="Cancel" kind="text" @click="open = false" />
          <Button label="Confirm" kind="primary" />
        </PanelFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
`

export const Default = {
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
      PanelHeader,
      PanelContent,
      PanelFooter,
      Button
    },
    setup() {
      const open = ref(args.defaultOpen)
      return { args, open }
    },
    template: dialogTemplate
  })
}

export const Controlled = {
  args: { defaultOpen: true },
  render: Default.render
}

export const Uncontrolled = {
  args: { defaultOpen: true },
  render: (args) => ({
    components: {
      Dialog,
      DialogTrigger,
      DialogPortal,
      DialogOverlay,
      DialogContent,
      DialogTitle,
      DialogClose,
      PanelHeader,
      PanelContent,
      Button
    },
    setup() {
      return { args }
    },
    template: `
      <Dialog :closeable="args.closeable" :size="args.size" :default-open="true">
        <DialogTrigger>
          <Button label="Open dialog" kind="primary" />
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
            <PanelHeader class="w-full">
              <DialogTitle>Uncontrolled dialog</DialogTitle>
              <DialogClose />
            </PanelHeader>
            <PanelContent>
              <p class="text-body-sm text-[var(--text-muted)]">Opened via defaultOpen without v-model.</p>
            </PanelContent>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    `
  })
}

export const NotCloseable = {
  args: { closeable: false, defaultOpen: true },
  render: Default.render
}

export const WithComposition = Default

export const LightDark = {
  parameters: {
    backgrounds: { default: 'light' }
  },
  render: Default.render
}

export const Accessibility = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: /open dialog/i })
    await userEvent.click(trigger)
    const dialog = await within(document.body).findByRole('dialog')
    await expect(dialog).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
  }
}

export const Playground = Default
