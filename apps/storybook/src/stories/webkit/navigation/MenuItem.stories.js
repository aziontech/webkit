import MenuItem from '@aziontech/webkit/navigation/menu-item'

/** @type {import('@storybook/vue3').Meta<typeof MenuItem>} */
const meta = {
  title: 'Webkit/Navigation/MenuItem',
  component: MenuItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
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
          'Sidebar navigation row (`option`) or section overline (`group`). Supports optional icon, optional link rendering when `href` is set, and optional trailing tag.'
      }
    }
  },
  argTypes: {
    kind: {
      control: { type: 'select' },
      options: ['option', 'group'],
      description: 'Structural variant: navigable row or section overline label.',
      table: {
        type: { summary: 'MenuItemKind' },
        defaultValue: { summary: "'option'" },
        category: 'props'
      }
    },
    label: {
      control: 'text',
      description: 'Visible label for the row or group header.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Option 1'" },
        category: 'props'
      }
    },
    selected: {
      control: 'boolean',
      description: 'When true, applies the selected surface on option rows.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'props'
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction on option rows.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'props'
      }
    },
    icon: {
      control: 'text',
      description: 'PrimeIcons class for the leading icon (option kind only).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'pi pi-home'" },
        category: 'props'
      }
    },
    href: {
      control: 'text',
      description: 'Destination URL; renders an anchor when set on option rows.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "''" },
        category: 'props'
      }
    },
    target: {
      control: { type: 'select' },
      options: ['_self', '_blank'],
      description: 'Link target when `href` is set.',
      table: {
        type: { summary: "'_self' | '_blank'" },
        defaultValue: { summary: "'_self'" },
        category: 'props'
      }
    },
    tagValue: {
      control: 'text',
      description: 'Short text rendered in a trailing Tag when set.',
      table: {
        type: { summary: 'string' },
        category: 'props'
      }
    },
    tagSeverity: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'accent'],
      description: 'Severity token for the optional trailing Tag.',
      table: {
        type: { summary: 'MenuItemTagSeverity' },
        defaultValue: { summary: "'info'" },
        category: 'props'
      }
    },
    onClick: {
      action: 'click',
      description: 'Emitted when an option row is activated.',
      table: {
        type: { summary: '(event: MouseEvent) => void' },
        category: 'events'
      }
    },
    default: {
      description: 'Overrides the option label text.',
      control: false,
      table: { type: { summary: 'VNode | string' }, category: 'slots' }
    },
    tag: {
      description: 'Custom trailing badge content.',
      control: false,
      table: { type: { summary: 'VNode' }, category: 'slots' }
    }
  },
  args: {
    kind: 'option',
    label: 'Option 1',
    selected: false,
    disabled: false,
    icon: 'pi pi-home',
    href: '',
    target: '_self',
    tagValue: undefined,
    tagSeverity: 'info'
  },
  decorators: [
    () => ({
      template: '<ul class="m-0 w-[245px] list-none p-0"><story /></ul>'
    })
  ]
}

export default meta

const Template = (args) => ({
  components: { MenuItem },
  setup() {
    return { args }
  },
  template: '<MenuItem v-bind="args" @click="args.onClick" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof MenuItem>} */
export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Default option row.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof MenuItem>} */
export const States = {
  render: () => ({
    components: { MenuItem },
    template: `
      <ul class="m-0 w-[245px] list-none p-0">
        <MenuItem label="Default" icon="pi pi-home" />
        <MenuItem label="Selected" icon="pi pi-home" selected />
        <MenuItem label="Disabled" icon="pi pi-home" disabled />
      </ul>
    `
  }),
  parameters: {
    docs: { description: { story: 'Default, selected, and disabled option states.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof MenuItem>} */
export const WithTag = {
  args: { tagValue: 'Label', tagSeverity: 'info' },
  render: Template,
  parameters: {
    docs: { description: { story: 'Option row with trailing info Tag.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof MenuItem>} */
export const Group = {
  render: () => ({
    components: { MenuItem },
    template: `
      <ul class="m-0 w-[245px] list-none p-0">
        <MenuItem kind="group" label="Main section" />
        <MenuItem label="Home" icon="pi pi-home" />
        <MenuItem label="Applications" icon="pi pi-th-large" />
        <MenuItem label="Domains" icon="pi pi-globe" />
        <MenuItem label="Certificates" icon="pi pi-shield" />
        <MenuItem label="Settings" icon="pi pi-cog" />
      </ul>
    `
  }),
  parameters: {
    docs: { description: { story: 'Group header with five option rows.' } }
  }
}
