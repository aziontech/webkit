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

const sizes = ['small', 'medium', 'large']
const sides = ['left', 'right']

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

export default {
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
          'Edge drawer using the shared Panel shell. Long body content scrolls inside `PanelContent` via `ScrollArea`; header and footer stay in the panel flex layout.',
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          "import { ref } from 'vue'",
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
          "import PanelHeader from '@aziontech/webkit/panel-header'",
          '',
          'const open = ref(false)',
          '</script>',
          '',
          '<template>',
          '  <Drawer v-model:open="open" closable side="right" size="medium">',
          '    <DrawerTrigger>',
          '      <Button label="Open drawer" kind="primary" />',
          '    </DrawerTrigger>',
          '    <DrawerPortal>',
          '      <DrawerOverlay />',
          '      <DrawerContent>',
          '        <PanelHeader class="w-full">',
          '          <DrawerTitle>Drawer Title</DrawerTitle>',
          '          <DrawerClose />',
          '        </PanelHeader>',
          '        <PanelContent>',
          '          <DrawerDescription>Side panel content.</DrawerDescription>',
          '        </PanelContent>',
          '        <PanelFooter class="flex-col md:flex-row md:justify-end">',
          '          <Button class="w-full md:w-auto" label="Cancel" kind="outlined" @click="open = false" />',
          '          <Button class="w-full md:w-auto" label="Save" kind="primary" />',
          '        </PanelFooter>',
          '      </DrawerContent>',
          '    </DrawerPortal>',
          '  </Drawer>',
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
    closable: {
      control: 'boolean',
      description: 'When true, Escape and overlay click close the drawer',
      table: { defaultValue: { summary: true } }
    },
    side: {
      control: 'select',
      options: sides,
      description: 'Edge the panel slides from',
      table: { defaultValue: { summary: 'right' } }
    },
    size: {
      control: 'select',
      options: sizes,
      description:
        'Panel max-width preset. Drawer height is always 100% viewport (`small` 384px, `medium` 672px, `large` 1024px).',
      table: { defaultValue: { summary: 'medium' } }
    },
    'update:open': { action: 'update:open' }
  },
  args: {
    defaultOpen: false,
    closable: true,
    side: 'right',
    size: 'medium'
  }
}

const drawerTemplate = `
  <Drawer v-bind="args" v-model:open="open">
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
  </Drawer>
`

export const Default = {
  render: (args) => ({
    components: drawerStoryComponents,
    setup() {
      const open = ref(args.defaultOpen)
      return { args, open }
    },
    template: drawerTemplate
  })
}

export const Sizes = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop'
    },
    docs: {
      description: {
        story: 'Small (384px), medium (672px), and large (1024px) max-width presets side by side.'
      }
    }
  },
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
    template: `
      <div class="flex flex-wrap items-center justify-center gap-[var(--spacing-4)]">
        <Drawer
          v-for="size in sizes"
          :key="size"
          :size="size"
          v-model:open="openBySize[size]"
          closable
          side="right"
          :data-testid="'overlay-drawer-' + size"
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
                <Button
                  class="w-full md:w-auto"
                  label="Cancel"
                  kind="outlined"
                  @click="openBySize[size] = false"
                />
                <Button class="w-full md:w-auto" label="Save" kind="primary" />
              </PanelFooter>
            </DrawerContent>
          </DrawerPortal>
        </Drawer>
      </div>
    `
  })
}

export const ScrollContent = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop'
    },
    docs: {
      description: {
        story:
          'Long content in `PanelContent` scrolls inside `ScrollArea`. Header and footer stay in the panel flex layout at the top and bottom; only the body scrolls.'
      }
    }
  },
  render: () => ({
    components: drawerStoryComponents,
    setup() {
      const open = ref(false)

      return { open, scrollSections }
    },
    template: `
      <Drawer v-model:open="open" closable side="right" size="medium">
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
      </Drawer>
    `
  })
}
