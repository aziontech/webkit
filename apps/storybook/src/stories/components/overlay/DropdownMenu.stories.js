import Button from '@aziontech/webkit/button'
import DropdownMenu from '@aziontech/webkit/overlay/dropdown-menu'
import DropdownMenuContent from '@aziontech/webkit/overlay/dropdown-menu-content'
import {
  buildDropdownMenuSections,
  dropdownMenuGroup,
  dropdownMenuItem
} from '@aziontech/webkit/overlay/dropdown-menu-factory'
import DropdownMenuFromModel from '@aziontech/webkit/overlay/dropdown-menu-from-model'
import DropdownMenuGroup from '@aziontech/webkit/overlay/dropdown-menu-group'
import DropdownMenuItem from '@aziontech/webkit/overlay/dropdown-menu-item'
import DropdownMenuPortal from '@aziontech/webkit/overlay/dropdown-menu-portal'
import DropdownMenuSeparator from '@aziontech/webkit/overlay/dropdown-menu-separator'
import DropdownMenuTrigger from '@aziontech/webkit/overlay/dropdown-menu-trigger'
import { expect, userEvent, within } from '@storybook/test'
import { ref } from 'vue'

const menuComponents = {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuFromModel,
  Button
}

export default {
 title: 'Components/Overlay/DropdownMenu',
  component: DropdownMenu,
  subcomponents: {
    DropdownMenuTrigger,
    DropdownMenuPortal,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuFromModel
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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
          'Floating action menu (overlay). Panel position and CSS transition match `inputs/dropdown` (`getBoundingClientRect` + `webkit-dropdown-menu-panel`). Not the form select API.'
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
      description: 'When true, Escape and outside click close the menu',
      table: { defaultValue: { summary: true } }
    },
    closeOnSelect: {
      control: 'boolean',
      description: 'When true, selecting an item closes the menu',
      table: { defaultValue: { summary: true } }
    },
    side: {
      control: { type: 'select' },
      options: ['auto', 'top', 'bottom', 'left', 'right'],
      description:
        'Preferred panel placement. `auto` picks the side with the most viewport space; explicit sides flip when they overflow.',
      table: { defaultValue: { summary: 'auto' } }
    },
    sideOffset: {
      control: 'number',
      table: { defaultValue: { summary: 4 } }
    },
    alignOffset: {
      control: 'number',
      table: { defaultValue: { summary: 0 } }
    },
    'update:open': { action: 'update:open' }
  },
  args: {
    defaultOpen: false,
    closeable: true,
    closeOnSelect: true,
    sideOffset: 4,
    alignOffset: 0
  }
}

const defaultTemplate = `
  <DropdownMenu v-bind="args" v-model:open="open">
    <DropdownMenuTrigger>
      <Button label="Open menu" kind="secondary" />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent>
        <DropdownMenuItem label="Option 1" value="1" />
        <DropdownMenuItem label="Option 2" value="2" />
        <DropdownMenuItem label="Option 3" value="3" />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenu>
`

export const Default = {
  render: (args) => ({
    components: menuComponents,
    setup() {
      const open = ref(args.defaultOpen)
      return { args, open }
    },
    template: defaultTemplate
  })
}

/**
 * Figma account menu — full product example (3750:15167).
 * @see https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3750-15167
 */
const figmaAccountMenuHeaderClasses =
  'flex flex-col gap-[var(--spacing-1)] px-[var(--spacing-2)] py-[var(--spacing-2)]'

const figmaAccountMenuContentClasses = 'w-[18.625rem] min-w-[18.625rem]'

const figmaAccountMenuTemplate = `
  <DropdownMenu v-bind="args" v-model:open="open">
    <DropdownMenuTrigger>
      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--bg-surface-raised)] text-label-md text-[var(--text-default)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]"
        aria-label="Open account menu"
      >
        UN
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent :class="contentClass">
        <div :class="headerClass" role="presentation" data-testid="overlay-dropdown-menu__profile-primary">
          <span class="text-label-md text-[var(--text-default)]">User Name</span>
          <span class="text-label-sm text-[var(--text-muted)]">username@email.com</span>
        </div>
        <DropdownMenuItem label="Account Settings" value="account-settings" />
        <DropdownMenuItem label="Users Management" value="users-management" />
        <DropdownMenuItem label="Billing" value="billing" />
        <DropdownMenuItem label="Credentials" value="credentials" />
        <DropdownMenuItem label="Activity History" value="activity-history" />
        <DropdownMenuItem label="Team Permissions" value="team-permissions" />
        <DropdownMenuSeparator />
        <div :class="headerClass" role="presentation" data-testid="overlay-dropdown-menu__profile-secondary">
          <span class="text-label-md text-[var(--text-default)]">User.name</span>
          <span class="text-label-sm text-[var(--text-muted)]">username@email.com</span>
        </div>
        <DropdownMenuItem label="Your Settings" value="your-settings" />
        <DropdownMenuItem label="Personal Tokens" value="personal-tokens" />
        <DropdownMenuSeparator />
        <DropdownMenuItem label="Log out" value="logout" icon="pi pi-sign-out" />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenu>
`

export const FigmaAccountMenu = {
  name: 'Figma — Account menu (3750:15167)',
  parameters: {
    docs: {
      description: {
        story:
          'Implements [Figma DropdownMenu (3750:15167)](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3750-15167): two profile blocks, account links, personal settings, and sign-out with icon. Story-only layout markup for profile headers; all actions use existing menu primitives.'
      }
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3750-15167'
    }
  },
  args: {
    defaultOpen: true,
    closeOnSelect: true
  },
  render: (args) => ({
    components: menuComponents,
    setup() {
      const open = ref(args.defaultOpen ?? true)
      return {
        args,
        open,
        headerClass: figmaAccountMenuHeaderClasses,
        contentClass: figmaAccountMenuContentClasses
      }
    },
    template: figmaAccountMenuTemplate
  })
}

/** Figma DropdownOption — group, option states, separator in one panel. */
export const Anatomy = {
  parameters: {
    docs: {
      description: {
        story: 'Figma `DropdownOption` (3750:15346): group label, disabled option, separator, default, hover (focus), selected.'
      }
    }
  },
  render: () => ({
    components: menuComponents,
    setup() {
      const open = ref(true)
      return { open }
    },
    template: `
      <DropdownMenu v-model:open="open" :default-open="true">
        <DropdownMenuTrigger>
          <Button label="Menu trigger" kind="secondary" />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <DropdownMenuGroup label="Group" />
            <DropdownMenuItem label="Option 1" disabled />
            <DropdownMenuSeparator />
            <DropdownMenuItem label="Option 1" />
            <DropdownMenuItem label="Option 1" class="bg-[var(--bg-hover)]" />
            <DropdownMenuItem label="Option 1" selected />
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    `
  })
}

export const OptionStates = Anatomy

/** Figma DropdownGroup — one labeled section with six items. */
export const SingleGroup = {
  parameters: {
    docs: {
      description: {
        story: 'Figma `DropdownGroup` (3750:15645).'
      }
    }
  },
  render: () => ({
    components: menuComponents,
    setup() {
      const open = ref(true)
      const nodes = [
        dropdownMenuGroup('Group'),
        ...Array.from({ length: 6 }, (_, i) =>
          dropdownMenuItem(`Option ${i + 1}`, { value: String(i + 1) })
        )
      ]
      return { open, nodes }
    },
    template: `
      <DropdownMenu v-model:open="open" :default-open="true">
        <DropdownMenuTrigger>
          <Button label="Open menu" kind="secondary" />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <DropdownMenuFromModel :nodes="nodes" />
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    `
  })
}

const multiGroupNodes = buildDropdownMenuSections([
  {
    items: Array.from({ length: 6 }, (_, i) =>
      dropdownMenuItem(i < 2 ? 'Option 1' : `Option ${i}`, { value: `a-${i}` })
    )
  },
  {
    label: 'Group',
    items: Array.from({ length: 6 }, (_, i) =>
      dropdownMenuItem(`Option ${i + 1}`, { value: `b-${i}` })
    )
  },
  {
    label: 'Group',
    items: Array.from({ length: 6 }, (_, i) =>
      dropdownMenuItem(`Option ${i + 1}`, { value: `c-${i}` })
    )
  },
  {
    label: 'Group',
    items: Array.from({ length: 6 }, (_, i) =>
      dropdownMenuItem(`Option ${i + 1}`, { value: `d-${i}` })
    )
  }
])

/** Figma DropdownMenu — unlabeled block + three grouped sections. */
export const MultiGroup = {
  parameters: {
    docs: {
      description: {
        story: 'Figma `DropdownMenu` (3775:16746), built with `buildDropdownMenuSections`.'
      }
    }
  },
  render: () => ({
    components: menuComponents,
    setup() {
      const open = ref(false)
      const nodes = multiGroupNodes
      return { open, nodes }
    },
    template: `
      <DropdownMenu v-model:open="open">
        <DropdownMenuTrigger>
          <Button label="Open menu" kind="secondary" />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent class="max-h-96 overflow-y-auto">
            <DropdownMenuFromModel :nodes="nodes" />
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    `
  })
}

export const WithComposition = {
  render: (args) => ({
    components: menuComponents,
    setup() {
      const open = ref(args.defaultOpen)
      return { args, open }
    },
    template: `
      <DropdownMenu v-bind="args" v-model:open="open">
        <DropdownMenuTrigger>
          <Button label="Actions" kind="primary" />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <DropdownMenuGroup label="Account" />
            <DropdownMenuItem label="Profile" value="profile" />
            <DropdownMenuItem label="Settings" value="settings" />
            <DropdownMenuSeparator />
            <DropdownMenuItem label="Sign out" value="sign-out" />
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    `
  })
}

export const Controlled = {
  args: { defaultOpen: true },
  render: Default.render
}

export const Uncontrolled = {
  args: { defaultOpen: true },
  render: (args) => ({
    components: menuComponents,
    setup() {
      return { args }
    },
    template: `
      <DropdownMenu :default-open="true" :closeable="args.closeable" :close-on-select="args.closeOnSelect">
        <DropdownMenuTrigger>
          <Button label="Open menu" kind="secondary" />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <DropdownMenuItem label="Uncontrolled item" />
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    `
  })
}

export const Disabled = {
  render: () => ({
    components: menuComponents,
    setup() {
      const open = ref(true)
      return { open }
    },
    template: `
      <DropdownMenu v-model:open="open" :default-open="true">
        <DropdownMenuTrigger>
          <Button label="Open menu" kind="secondary" />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <DropdownMenuItem label="Available" />
            <DropdownMenuItem label="Disabled" disabled />
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    `
  })
}

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
    const trigger = canvas.getByRole('button', { name: /open menu/i })
    await userEvent.click(trigger)

    const menu = await within(document.body).findByRole('menu')
    await expect(menu).toBeInTheDocument()

    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{Escape}')

    await expect(within(document.body).queryByRole('menu')).not.toBeInTheDocument()
  }
}

export const Playground = FigmaAccountMenu
