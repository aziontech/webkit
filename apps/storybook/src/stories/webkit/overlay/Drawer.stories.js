import { ref } from 'vue'
import { expect, userEvent, within } from '@storybook/test'

import Button from '@aziontech/webkit/actions/button'
import Drawer from '@aziontech/webkit/overlay/drawer'
import DrawerClose from '@aziontech/webkit/overlay/drawer-close'
import DrawerContent from '@aziontech/webkit/overlay/drawer-content'
import DrawerDescription from '@aziontech/webkit/overlay/drawer-description'
import DrawerOverlay from '@aziontech/webkit/overlay/drawer-overlay'
import DrawerPortal from '@aziontech/webkit/overlay/drawer-portal'
import DrawerTitle from '@aziontech/webkit/overlay/drawer-title'
import DrawerTrigger from '@aziontech/webkit/overlay/drawer-trigger'
import PanelContent from '@aziontech/webkit/overlay/panel-content'
import PanelFooter from '@aziontech/webkit/overlay/panel-footer'
import PanelHeader from '@aziontech/webkit/overlay/panel-header'

const sizes = ['small', 'medium', 'large']
const sides = ['left', 'right']

export default {
  title: 'Webkit/Overlay/Drawer',
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
    actions: { argTypesRegex: '^on[A-Z].*' },
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          'Edge drawer using the shared Panel shell. Slides in with 220ms transform (aligned with theme animation timing) and fade backdrop via `animate-fade-in`.'
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
      description: 'Panel max-width preset',
      table: { defaultValue: { summary: 'medium' } }
    },
    'update:open': { action: 'update:open' }
  },
  args: {
    defaultOpen: false,
    closeable: true,
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
        <PanelFooter class="justify-end">
          <Button label="Cancel" kind="text" @click="open = false" />
          <Button label="Save" kind="primary" />
        </PanelFooter>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
`

export const Default = {
  render: (args) => ({
    components: {
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
    },
    setup() {
      const open = ref(args.defaultOpen)
      return { args, open }
    },
    template: drawerTemplate
  })
}

export const LeftSide = {
  args: { side: 'left', defaultOpen: true },
  render: Default.render
}

export const Controlled = {
  args: { defaultOpen: true },
  render: Default.render
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
    const trigger = canvas.getByRole('button', { name: /open drawer/i })
    await userEvent.click(trigger)
    const dialog = await within(document.body).findByRole('dialog')
    await expect(dialog).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
  }
}

export const Playground = Default
