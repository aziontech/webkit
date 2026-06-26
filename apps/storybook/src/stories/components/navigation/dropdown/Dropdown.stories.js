import Dropdown, {
  DropdownGroup,
  DropdownOption,
  DropdownTrigger
} from '@aziontech/webkit/dropdown'
import Button from '@aziontech/webkit/button'

const components = { Dropdown, DropdownTrigger, DropdownGroup, DropdownOption, Button }

/** @type {import('@storybook/vue3').Meta<typeof Dropdown>} */
const meta = {
  title: 'Components/Navigation/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark'
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true },
          { id: 'aria-required-children', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'Overlay menu that opens from a consumer-supplied trigger and renders a list of selectable options grouped into named sections. The root `Dropdown` owns open/closed state, positioning, focus return, and keyboard navigation; `Dropdown.Trigger` wires aria-haspopup/aria-expanded/aria-controls; `Dropdown.Group` groups options under an optional uppercase label; `Dropdown.Option` is the selectable row with leading/trailing/command affordances.'
      }
    }
  },
  argTypes: {
    open: {
      control: 'boolean',
      description:
        'Controlled open state. Use with `v-model:open` or `@update:open`. When omitted, the component is uncontrolled.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'undefined' }
      }
    },
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
      description: 'Where the panel opens relative to the trigger.',
      table: {
        category: 'props',
        type: { summary: "'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'" },
        defaultValue: { summary: "'bottom-start'" }
      }
    },
    offset: {
      control: { type: 'number', min: 0, max: 24, step: 1 },
      description: 'Pixel gap between the trigger and the panel.',
      table: {
        category: 'props',
        type: { summary: 'number' },
        defaultValue: { summary: '4' }
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Prevents the trigger from opening the panel and applies disabled tokens.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    default: { control: false, table: { category: 'slots' } },
    top: { control: false, table: { category: 'slots' } },
    bottom: { control: false, table: { category: 'slots' } },
    onUpdateOpen: {
      action: 'update:open',
      description: 'Fires on every open/closed transition; supports `v-model:open`.',
      table: { category: 'events', type: { summary: 'boolean' } }
    },
    onSelect: {
      action: 'select',
      description: 'Fires when an enabled option is activated. The panel closes automatically.',
      table: {
        category: 'events',
        type: { summary: '{ value: string | number; event: MouseEvent | KeyboardEvent }' }
      }
    }
  },
  args: {
    placement: 'bottom-start',
    offset: 4,
    disabled: false
  }
}

export default meta

const Template = (args) => ({
  components,
  setup() {
    const { onUpdateOpen, onSelect, ...props } = args
    return { props, onUpdateOpen, onSelect }
  },
  template: `
    <Dropdown v-bind="props" @update:open="onUpdateOpen" @select="onSelect">
      <DropdownTrigger>
        <Button kind="outlined" label="Open menu" />
      </DropdownTrigger>
      <DropdownGroup>
        <DropdownOption value="profile" label="Profile" />
        <DropdownOption value="settings" label="Settings" />
        <DropdownOption value="billing" label="Billing" />
        <DropdownOption value="invite" label="Invite members" />
        <DropdownOption value="logs" label="Audit log" />
        <DropdownOption value="signout" label="Sign out" />
      </DropdownGroup>
    </Dropdown>
  `
})

/** @type {import('@storybook/vue3').StoryObj<typeof Dropdown>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Default dropdown with a single unlabeled group of six options and no leading/trailing affordances.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Dropdown>} */
export const Groups = {
  render: (args) => ({
    components,
    setup() {
      const { onUpdateOpen, onSelect, ...props } = args
      return { props, onUpdateOpen, onSelect }
    },
    template: `
      <Dropdown v-bind="props" @update:open="onUpdateOpen" @select="onSelect">
        <DropdownTrigger>
          <Button kind="outlined" label="Open menu" />
        </DropdownTrigger>
        <DropdownGroup label="Account">
          <DropdownOption value="profile" label="Profile" command="⌘P" />
          <DropdownOption value="settings" label="Settings" />
        </DropdownGroup>
        <DropdownGroup label="Workspace">
          <DropdownOption value="invite" label="Invite members" />
          <DropdownOption value="logs" label="Audit log" selected />
        </DropdownGroup>
      </Dropdown>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Two labeled groups (`Account`, `Workspace`) separated by an automatic top divider on the second group. One option carries a `command` hint, another is `selected` — the central anatomy of this component.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Dropdown>} */
export const States = {
  render: (args) => ({
    components,
    setup() {
      const { onUpdateOpen, onSelect, ...props } = args
      return { props, onUpdateOpen, onSelect }
    },
    template: `
      <Dropdown v-bind="props" :open="true" @update:open="onUpdateOpen" @select="onSelect">
        <DropdownTrigger>
          <Button kind="outlined" label="Open menu" />
        </DropdownTrigger>
        <DropdownGroup label="Option states">
          <DropdownOption value="default" label="Default" />
          <DropdownOption value="selected" label="Selected" selected />
          <DropdownOption value="disabled" label="Disabled" disabled />
        </DropdownGroup>
      </Dropdown>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Panel forced open (`open="true"`) showing each spec-declared option state side-by-side: `default`, `selected`, and `disabled`. The `hover` and `focus-visible` states are interactive — focus an option with the keyboard (`Down` / `Up`) or hover with the pointer to see them.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Dropdown>} */
export const Disabled = {
  args: { disabled: true },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Root `disabled` — the trigger refuses to open the panel and applies disabled tokens.'
      }
    }
  }
}
