import Button from '@aziontech/webkit/button'
import Dialog from '@aziontech/webkit/dialog'
import DialogClose from '@aziontech/webkit/dialog-close'
import DialogContent from '@aziontech/webkit/dialog-content'
import DialogDescription from '@aziontech/webkit/dialog-description'
import DialogOverlay from '@aziontech/webkit/dialog-overlay'
import DialogPortal from '@aziontech/webkit/dialog-portal'
import DialogTitle from '@aziontech/webkit/dialog-title'
import DialogTrigger from '@aziontech/webkit/dialog-trigger'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelFooter from '@aziontech/webkit/panel-footer'
import PanelHeader from '@aziontech/webkit/panel-header'
import { ref, watch } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import Dialog from '@aziontech/webkit/dialog'",
  "import DialogClose from '@aziontech/webkit/dialog-close'",
  "import DialogContent from '@aziontech/webkit/dialog-content'",
  "import DialogDescription from '@aziontech/webkit/dialog-description'",
  "import DialogOverlay from '@aziontech/webkit/dialog-overlay'",
  "import DialogPortal from '@aziontech/webkit/dialog-portal'",
  "import DialogTitle from '@aziontech/webkit/dialog-title'",
  "import DialogTrigger from '@aziontech/webkit/dialog-trigger'",
  "import PanelContent from '@aziontech/webkit/panel-content'",
  "import PanelFooter from '@aziontech/webkit/panel-footer'",
  "import PanelHeader from '@aziontech/webkit/panel-header'"
]

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
    layout: 'padded',
    backgrounds: {
      default: 'dark'
    },
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
          'Modal dialog built on the shared Panel shell. Compose a trigger, an overlay backdrop, and the panel regions (header, body, footer); Escape and overlay click close the dialog when `dismissible`.'
      },
      canvas: { sourceState: 'shown' }
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
      description: 'Controlled open state. Use with `v-model:open`.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'undefined' }
      }
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state when uncontrolled.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    dismissible: {
      control: 'boolean',
      description: 'When true, overlay click and Escape close the dialog.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    size: {
      control: 'select',
      options: sizes,
      description: 'Panel max-width preset passed to the inner Panel.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    'onUpdate:open': {
      action: 'update:open',
      description: 'Emitted when the open state changes (v-model:open).',
      table: { category: 'events', type: { summary: 'boolean' } }
    },
    default: {
      control: false,
      description: 'Dialog composition: trigger, portal, overlay, content, and panel regions.',
      table: { category: 'slots' }
    }
  },
  args: {
    defaultOpen: false,
    dismissible: true,
    size: 'medium'
  }
}

export default meta

const DEFAULT_RENDER_TEMPLATE = `<Dialog v-bind="args" :open="open" @update:open="onUpdate">
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
        <Button class="w-full md:w-auto" label="Cancel" kind="outlined" @click="onUpdate(false)" />
        <Button class="w-full md:w-auto" label="Save" kind="primary" />
      </PanelFooter>
    </DialogContent>
  </DialogPortal>
</Dialog>`

const Template = (args) => ({
  components: dialogStoryComponents,
  setup() {
    const open = ref(args.open ?? args.defaultOpen ?? false)
    watch(
      () => args.open,
      (next) => {
        if (next !== undefined) open.value = next
      }
    )
    const onUpdate = (next) => {
      open.value = next
      args['onUpdate:open']?.(next)
    }
    return { args, open, onUpdate }
  },
  template: DEFAULT_RENDER_TEMPLATE
})

const DEFAULT_SNIPPET = `<Dialog v-model:open="open" dismissible size="medium">
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
</Dialog>`

/** @type {import('@storybook/vue3').StoryObj<typeof Dialog>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Medium modal with a trigger, overlay backdrop, and header/body/footer panel regions.'
      },
      source: {
        code: toSfc(
          [...IMPORTS, "import { ref } from 'vue'", '', 'const open = ref(false)'],
          DEFAULT_SNIPPET
        )
      }
    }
  }
}

const LONG_ROWS = Array.from(
  { length: 18 },
  (_, index) =>
    `        <p>Setting ${index + 1} — the body is the only region that scrolls, so the title and the footer actions stay reachable.</p>`
).join('\n')

const LONG_CONTENT_TEMPLATE = `<Dialog default-open dismissible size="medium">
  <DialogTrigger>
    <Button label="Open dialog" kind="primary" />
  </DialogTrigger>
  <DialogPortal>
    <DialogOverlay />
    <DialogContent>
      <PanelHeader class="w-full">
        <DialogTitle>Domain settings</DialogTitle>
        <DialogClose />
      </PanelHeader>
      <PanelContent>
        <DialogDescription>Body taller than the sheet, so it has to scroll.</DialogDescription>
${LONG_ROWS}
      </PanelContent>
      <PanelFooter class="flex-col md:flex-row md:justify-end">
        <Button class="w-full md:w-auto" label="Cancel" kind="outlined" />
        <Button class="w-full md:w-auto" label="Save" kind="primary" />
      </PanelFooter>
    </DialogContent>
  </DialogPortal>
</Dialog>`

/** @type {import('@storybook/vue3').StoryObj<typeof Dialog>} */
export const LongContent = {
  render: () => ({ components: dialogStoryComponents, template: LONG_CONTENT_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'A body taller than the panel. The panel bounds the sheet, `PanelContent` scrolls, and the title and footer stay put.'
      },
      source: { code: toSfc(IMPORTS, LONG_CONTENT_TEMPLATE) }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Dialog>} */
export const LongContentMobile = {
  render: () => ({ components: dialogStoryComponents, template: LONG_CONTENT_TEMPLATE }),
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The same overflowing body at a 375px viewport, where the dialog is a bottom sheet capped at 80% of the visible viewport (`dvh`). This is the case reported as "the dialog does not scroll on mobile": the body must scroll to its end and the footer buttons must stay on screen.'
      },
      source: { code: toSfc(IMPORTS, LONG_CONTENT_TEMPLATE) }
    }
  }
}
