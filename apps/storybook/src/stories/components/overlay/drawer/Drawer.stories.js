import Button from '@aziontech/webkit/button'
import Drawer from '@aziontech/webkit/drawer'
import DrawerClose from '@aziontech/webkit/drawer-close'
import DrawerContent from '@aziontech/webkit/drawer-content'
import DrawerDescription from '@aziontech/webkit/drawer-description'
import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
import DrawerPortal from '@aziontech/webkit/drawer-portal'
import DrawerTitle from '@aziontech/webkit/drawer-title'
import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
import PanelContent from '@aziontech/webkit/panel-content'
import PanelFooter from '@aziontech/webkit/panel-footer'
import PanelHeader from '@aziontech/webkit/panel-header'
import { reactive, ref, watch } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import Drawer from '@aziontech/webkit/drawer'",
  "import DrawerClose from '@aziontech/webkit/drawer-close'",
  "import DrawerContent from '@aziontech/webkit/drawer-content'",
  "import DrawerDescription from '@aziontech/webkit/drawer-description'",
  "import DrawerOverlay from '@aziontech/webkit/drawer-overlay'",
  "import DrawerPortal from '@aziontech/webkit/drawer-portal'",
  "import DrawerTitle from '@aziontech/webkit/drawer-title'",
  "import DrawerTrigger from '@aziontech/webkit/drawer-trigger'",
  "import PanelContent from '@aziontech/webkit/panel-content'",
  "import PanelFooter from '@aziontech/webkit/panel-footer'",
  "import PanelHeader from '@aziontech/webkit/panel-header'"
]

const sizes = ['small', 'medium', 'large']

const sizeLabels = {
  small: 'Small (384px)',
  medium: 'Medium (672px)',
  large: 'Large (1024px)'
}

const scrollSections = Array.from({ length: 12 }, (_, index) => ({
  title: `Section ${index + 1}`,
  body: `Scrollable drawer body copy for section ${index + 1}. Only PanelContent scrolls; header and footer stay in the panel layout.`
}))

const drawerStoryComponents = {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerOverlay,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  PanelHeader,
  PanelContent,
  PanelFooter,
  Button
}

/** @type {import('@storybook/vue3').Meta<typeof Drawer>} */
const meta = {
  title: 'Components/Overlay/Drawer',
  component: Drawer,
  subcomponents: {
    DrawerTrigger,
    DrawerPortal,
    DrawerOverlay,
    DrawerContent,
    DrawerTitle,
    DrawerDescription,
    DrawerClose,
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
          'Edge panel built on the shared Panel shell that slides in from the left or right. Compose a trigger, an overlay, and the panel regions (header, scrollable body, footer); long body content scrolls inside `PanelContent` while the header and footer stay fixed in the panel layout.'
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
    closeable: {
      control: 'boolean',
      description: 'When true, overlay click and Escape close the drawer.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    side: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Edge the drawer panel slides from.',
      table: {
        category: 'props',
        type: { summary: "'left' | 'right'" },
        defaultValue: { summary: "'right'" }
      }
    },
    size: {
      control: 'select',
      options: sizes,
      description:
        'Panel max-width preset (`small` 384px, `medium` 672px, `large` 1024px). Height is always 100% viewport.',
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
      description: 'Drawer composition: trigger, portal, overlay, content, and panel regions.',
      table: { category: 'slots' }
    }
  },
  args: {
    defaultOpen: false,
    closeable: true,
    side: 'right',
    size: 'medium'
  }
}

export default meta

const DEFAULT_RENDER_TEMPLATE = `<Drawer v-bind="args" :open="open" @update:open="onUpdate">
  <DrawerTrigger>
    <Button label="Open drawer" kind="primary" />
  </DrawerTrigger>
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent>
      <PanelHeader class="w-full">
        <DrawerTitle>Drawer Title</DrawerTitle>
        <DrawerClose />
      </PanelHeader>
      <PanelContent>
        <DrawerDescription>
          Side panel content. Uses the same Panel header, body, and footer regions as Dialog.
        </DrawerDescription>
      </PanelContent>
      <PanelFooter class="flex-col md:flex-row md:justify-end">
        <Button class="w-full md:w-auto" label="Cancel" kind="outlined" @click="onUpdate(false)" />
        <Button class="w-full md:w-auto" label="Save" kind="primary" />
      </PanelFooter>
    </DrawerContent>
  </DrawerPortal>
</Drawer>`

const Template = (args) => ({
  components: drawerStoryComponents,
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

const DEFAULT_SNIPPET = `<Drawer v-model:open="open" closeable side="right" size="medium">
  <DrawerTrigger>
    <Button label="Open drawer" kind="primary" />
  </DrawerTrigger>
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent>
      <PanelHeader class="w-full">
        <DrawerTitle>Drawer Title</DrawerTitle>
        <DrawerClose />
      </PanelHeader>
      <PanelContent>
        <DrawerDescription>
          Side panel content. Uses the same Panel header, body, and footer regions as Dialog.
        </DrawerDescription>
      </PanelContent>
      <PanelFooter class="flex-col md:flex-row md:justify-end">
        <Button class="w-full md:w-auto" label="Cancel" kind="outlined" @click="open = false" />
        <Button class="w-full md:w-auto" label="Save" kind="primary" />
      </PanelFooter>
    </DrawerContent>
  </DrawerPortal>
</Drawer>`

/** @type {import('@storybook/vue3').StoryObj<typeof Drawer>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Right-side medium drawer with a trigger, overlay, and header/body/footer panel regions.'
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

const SIZES_TEMPLATE = `<div class="flex flex-wrap items-center justify-center gap-[var(--spacing-4)]">
  <Drawer
    v-for="size in sizes"
    :key="size"
    :size="size"
    v-model:open="openBySize[size]"
    closeable
    side="right"
  >
    <DrawerTrigger>
      <Button :label="sizeLabels[size]" kind="primary" />
    </DrawerTrigger>
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <PanelHeader class="w-full">
          <DrawerTitle>{{ sizeLabels[size] }}</DrawerTitle>
          <DrawerClose />
        </PanelHeader>
        <PanelContent>
          <DrawerDescription>
            Panel max-width preset for the {{ size }} drawer. Height is always 100% viewport.
          </DrawerDescription>
        </PanelContent>
        <PanelFooter class="flex-col md:flex-row md:justify-end">
          <Button class="w-full md:w-auto" label="Cancel" kind="outlined" @click="openBySize[size] = false" />
          <Button class="w-full md:w-auto" label="Save" kind="primary" />
        </PanelFooter>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</div>`

const SIZES_SETUP = [
  "import { reactive, watch } from 'vue'",
  '',
  "const sizes = ['small', 'medium', 'large']",
  'const sizeLabels = {',
  "  small: 'Small (384px)',",
  "  medium: 'Medium (672px)',",
  "  large: 'Large (1024px)'",
  '}',
  'const openBySize = reactive({ small: false, medium: false, large: false })',
  '',
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

/** @type {import('@storybook/vue3').StoryObj<typeof Drawer>} */
export const Sizes = {
  render: () => ({
    components: drawerStoryComponents,
    setup() {
      const openBySize = reactive({
        small: false,
        medium: false,
        large: false
      })

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
        story: 'Small (384px), medium (672px), and large (1024px) max-width presets side by side.'
      },
      source: { code: toSfc([...IMPORTS, ...SIZES_SETUP], SIZES_TEMPLATE) }
    }
  }
}

const SCROLL_TEMPLATE = `<Drawer v-model:open="open" closeable side="right" size="medium">
  <DrawerTrigger>
    <Button label="Open scrollable drawer" kind="primary" />
  </DrawerTrigger>
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent>
      <PanelHeader class="w-full">
        <DrawerTitle>Scrollable drawer</DrawerTitle>
        <DrawerClose />
      </PanelHeader>
      <PanelContent class="flex flex-col gap-[var(--spacing-4)]">
        <DrawerDescription>
          Place long forms, lists, or settings inside PanelContent. Only the body scrolls inside
          ScrollArea while header and footer stay in the panel layout.
        </DrawerDescription>
        <section
          v-for="section in scrollSections"
          :key="section.title"
          class="flex flex-col gap-[var(--spacing-2)] rounded-[var(--shape-elements)] border border-[length:var(--border-width-default)] border-[var(--border-muted)] p-[var(--spacing-4)]"
        >
          <h3 class="m-0 text-body-md text-[var(--text-default)]">{{ section.title }}</h3>
          <p class="m-0 text-body-sm text-[var(--text-muted)]">{{ section.body }}</p>
        </section>
      </PanelContent>
      <PanelFooter class="flex-col md:flex-row md:justify-end">
        <Button class="w-full md:w-auto" label="Cancel" kind="outlined" @click="open = false" />
        <Button class="w-full md:w-auto" label="Save" kind="primary" />
      </PanelFooter>
    </DrawerContent>
  </DrawerPortal>
</Drawer>`

const SCROLL_SETUP = [
  "import { ref } from 'vue'",
  '',
  'const open = ref(false)',
  'const scrollSections = Array.from({ length: 12 }, (_, index) => ({',
  '  title: `Section ${index + 1}`,',
  '  body: `Scrollable drawer body copy for section ${index + 1}. Only PanelContent scrolls; header and footer stay in the panel layout.`',
  '}))'
]

/** @type {import('@storybook/vue3').StoryObj<typeof Drawer>} */
export const ScrollContent = {
  render: () => ({
    components: drawerStoryComponents,
    setup() {
      const open = ref(false)

      return { open, scrollSections }
    },
    template: SCROLL_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Long content in `PanelContent` scrolls inside `ScrollArea`. The header and footer stay in the panel flex layout at the top and bottom; only the body scrolls.'
      },
      source: { code: toSfc([...IMPORTS, ...SCROLL_SETUP], SCROLL_TEMPLATE) }
    }
  }
}
