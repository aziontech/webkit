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
import { ref } from 'vue'

const sizes = ['small', 'medium', 'large']

const dialogStoryComponents = {
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
}

/** @type {import('@storybook/vue3').Meta<typeof Dialog>} */
const meta = {
 title: 'Components/Overlay/Dialog',
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
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component: [
          'Modal dialog built on the shared Panel shell. Supports overlay backdrop, closeable behavior, and theme motion tokens (panel scale + opacity fade, overlay fade).',
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          "import { ref } from 'vue'",
          "import Button from '@aziontech/webkit/button'",
          "import Dialog from '@aziontech/webkit/overlay/dialog'",
          "import DialogClose from '@aziontech/webkit/overlay/dialog-close'",
          "import DialogContent from '@aziontech/webkit/overlay/dialog-content'",
          "import DialogDescription from '@aziontech/webkit/overlay/dialog-description'",
          "import DialogOverlay from '@aziontech/webkit/overlay/dialog-overlay'",
          "import DialogPortal from '@aziontech/webkit/overlay/dialog-portal'",
          "import DialogTitle from '@aziontech/webkit/overlay/dialog-title'",
          "import DialogTrigger from '@aziontech/webkit/overlay/dialog-trigger'",
          "import PanelContent from '@aziontech/webkit/overlay/panel-content'",
          "import PanelFooter from '@aziontech/webkit/overlay/panel-footer'",
          "import PanelHeader from '@aziontech/webkit/overlay/panel-header'",
          '',
          'const open = ref(false)',
          '</script>',
          '',
          '<template>',
          '  <Dialog v-model:open="open" closeable size="medium">',
          '    <DialogTrigger>',
          '      <Button label="Open dialog" kind="primary" />',
          '    </DialogTrigger>',
          '    <DialogPortal>',
          '      <DialogOverlay />',
          '      <DialogContent>',
          '        <PanelHeader class="w-full">',
          '          <DialogTitle>Dialog Title</DialogTitle>',
          '          <DialogClose />',
          '        </PanelHeader>',
          '        <PanelContent>',
          '          <DialogDescription>Modal content.</DialogDescription>',
          '        </PanelContent>',
          '        <PanelFooter class="flex-col md:flex-row md:justify-end">',
          '          <Button class="w-full md:w-auto" label="Cancel" kind="outlined" @click="open = false" />',
          '          <Button class="w-full md:w-auto" label="Save" kind="primary" />',
          '        </PanelFooter>',
          '      </DialogContent>',
          '    </DialogPortal>',
          '  </Dialog>',
          '</template>',
          '```'
        ].join('\n')
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

export default meta

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
            Modal content. Uses the shared Panel header, body, and footer regions.
          </DialogDescription>
        </PanelContent>
        <PanelFooter class="flex-col md:flex-row md:justify-end">
          <Button class="w-full md:w-auto" label="Cancel" kind="outlined" @click="open = false" />
          <Button class="w-full md:w-auto" label="Save" kind="primary" />
        </PanelFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
`

/** @type {import('@storybook/vue3').StoryObj<typeof Dialog>} */
export const Default = {
  render: (args) => ({
    components: dialogStoryComponents,
    setup() {
      const open = ref(args.defaultOpen)

      return { args, open }
    },
    template: dialogTemplate
  })
}
