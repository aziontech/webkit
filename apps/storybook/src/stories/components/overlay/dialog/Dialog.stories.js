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
import { reactive, ref, watch } from 'vue'

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

const sizeLabels = { small: 'Small', medium: 'Medium', large: 'Large' }

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

const SIZES_TEMPLATE = `<div class="flex flex-wrap items-center gap-(--spacing-md)">
  <Dialog v-for="size in sizes" :key="size" v-model:open="openBySize[size]" :size="size">
    <DialogTrigger>
      <Button :label="sizeLabels[size]" kind="outlined" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <PanelHeader class="w-full">
          <DialogTitle>{{ sizeLabels[size] }}</DialogTitle>
          <DialogClose />
        </PanelHeader>
        <PanelContent>
          <DialogDescription>
            Panel max-width preset for the {{ size }} dialog, applied from the md breakpoint up.
          </DialogDescription>
        </PanelContent>
        <PanelFooter class="flex-col md:flex-row md:justify-end">
          <Button class="w-full md:w-auto" label="Close" kind="outlined" @click="openBySize[size] = false" />
        </PanelFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</div>`

const SIZES_SETUP = [
  "import { reactive, watch } from 'vue'",
  '',
  "const sizes = ['small', 'medium', 'large']",
  "const sizeLabels = { small: 'Small', medium: 'Medium', large: 'Large' }",
  'const openBySize = reactive({ small: false, medium: false, large: false })',
  '',
  '// One dialog at a time, so the overlays never stack.',
  'watch(',
  '  openBySize,',
  '  () => {',
  '    const openKey = sizes.find((key) => openBySize[key])',
  '    if (!openKey) return',
  '    sizes.forEach((key) => {',
  '      if (key !== openKey) openBySize[key] = false',
  '    })',
  '  },',
  '  { deep: true }',
  ')'
]

/** @type {import('@storybook/vue3').StoryObj<typeof Dialog>} */
export const Sizes = {
  render: () => ({
    components: dialogStoryComponents,
    setup() {
      const openBySize = reactive({ small: false, medium: false, large: false })

      watch(
        openBySize,
        () => {
          const openKey = sizes.find((key) => openBySize[key])

          if (!openKey) return

          sizes.forEach((key) => {
            if (key !== openKey) {
              openBySize[key] = false
            }
          })
        },
        { deep: true }
      )

      return { sizes, sizeLabels, openBySize }
    },
    template: SIZES_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The three `size` presets. Each caps the panel max-width from the `md` breakpoint up; below `md` the dialog is a full-width bottom sheet regardless of `size`.'
      },
      source: { code: toSfc([...IMPORTS, '', ...SIZES_SETUP], SIZES_TEMPLATE) }
    }
  }
}

const SCROLL_ROWS = Array.from(
  { length: 18 },
  (_, index) =>
    `        <p>Setting ${index + 1} — the body is the only region that scrolls, so the title and the footer actions stay reachable.</p>`
).join('\n')

const SCROLL_CONTENT_TEMPLATE = `<Dialog v-model:open="open" dismissible size="medium">
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
        <DialogDescription>Body taller than the dialog, so it has to scroll.</DialogDescription>
${SCROLL_ROWS}
      </PanelContent>
      <PanelFooter class="flex-col md:flex-row md:justify-end">
        <Button class="w-full md:w-auto" label="Cancel" kind="outlined" @click="open = false" />
        <Button class="w-full md:w-auto" label="Save" kind="primary" />
      </PanelFooter>
    </DialogContent>
  </DialogPortal>
</Dialog>`

const scrollRender = () => ({
  components: dialogStoryComponents,
  setup() {
    const open = ref(false)

    return { open }
  },
  template: SCROLL_CONTENT_TEMPLATE
})

const SCROLL_SOURCE = toSfc(
  [...IMPORTS, "import { ref } from 'vue'", '', 'const open = ref(false)'],
  SCROLL_CONTENT_TEMPLATE
)

/** @type {import('@storybook/vue3').StoryObj<typeof Dialog>} */
export const ScrollContent = {
  render: scrollRender,
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'A body taller than the dialog, centered above the page (from `md` up). Open it from the trigger: the panel bounds the surface and `PanelContent` is the only region that scrolls, so the title and the footer actions stay put while the body moves.'
      },
      source: { code: SCROLL_SOURCE }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Dialog>} */
export const ScrollContentMobile = {
  render: scrollRender,
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The same overflowing body below `md`, where the dialog is a full-width bottom sheet capped at 80% of the visible viewport (`dvh`, so the cap follows the browser toolbars instead of the largest viewport). Open it from the trigger and check three things: the body scrolls to its last row, the title stays at the top, and the footer actions stay on screen rather than sitting under the URL bar.'
      },
      source: { code: SCROLL_SOURCE }
    }
  }
}
