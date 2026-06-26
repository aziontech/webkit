import Dropdown from '@aziontech/webkit/dropdown'
import Button from '@aziontech/webkit/button'

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
  components: { Dropdown, Button },
  setup() {
    const { onUpdateOpen, onSelect, ...props } = args
    return { props, onUpdateOpen, onSelect }
  },
  template: `
    <Dropdown v-bind="props" @update:open="onUpdateOpen" @select="onSelect">
      <Dropdown.Trigger>
        <Button kind="secondary">Open menu</Button>
      </Dropdown.Trigger>
      <Dropdown.Group>
        <Dropdown.Option value="profile" label="Profile" />
        <Dropdown.Option value="settings" label="Settings" />
        <Dropdown.Option value="billing" label="Billing" />
        <Dropdown.Option value="invite" label="Invite members" />
        <Dropdown.Option value="logs" label="Audit log" />
        <Dropdown.Option value="signout" label="Sign out" />
      </Dropdown.Group>
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
    components: { Dropdown, Button },
    setup() {
      const { onUpdateOpen, onSelect, ...props } = args
      return { props, onUpdateOpen, onSelect }
    },
    template: `
      <Dropdown v-bind="props" @update:open="onUpdateOpen" @select="onSelect">
        <Dropdown.Trigger>
          <Button kind="secondary">Open menu</Button>
        </Dropdown.Trigger>
        <Dropdown.Group label="Account">
          <Dropdown.Option value="profile" label="Profile" command="⌘P" />
          <Dropdown.Option value="settings" label="Settings" />
        </Dropdown.Group>
        <Dropdown.Group label="Workspace">
          <Dropdown.Option value="invite" label="Invite members" />
          <Dropdown.Option value="logs" label="Audit log" selected />
        </Dropdown.Group>
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
    components: { Dropdown, Button },
    setup() {
      const { onUpdateOpen, onSelect, ...props } = args
      return { props, onUpdateOpen, onSelect }
    },
    template: `
      <Dropdown v-bind="props" :open="true" @update:open="onUpdateOpen" @select="onSelect">
        <Dropdown.Trigger>
          <Button kind="secondary">Open menu</Button>
        </Dropdown.Trigger>
        <Dropdown.Group label="Option states">
          <Dropdown.Option value="default" label="Default" />
          <Dropdown.Option value="selected" label="Selected" selected />
          <Dropdown.Option value="disabled" label="Disabled" disabled />
        </Dropdown.Group>
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
