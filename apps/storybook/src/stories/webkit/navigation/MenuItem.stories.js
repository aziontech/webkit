import MenuItem from '@aziontech/webkit/navigation/menu-item'
import { expect, userEvent, within } from '@storybook/test'

/** @type {import('@storybook/vue3').Meta<typeof MenuItem>} */
const meta = {
  title: 'Webkit/Navigation/MenuItem',
  component: MenuItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
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
          'Sidebar navigation row (option) or section overline (group). Maps to Figma Webkit MenuItem (node 3601:2693). Use inside `SidebarGroup` lists or standalone for compact nav patterns.'
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
        defaultValue: { summary: 'option' },
        category: 'props'
      }
    },
    label: {
      control: 'text',
      description: 'Visible label for the row or group header.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Option 1' },
        category: 'props'
      }
    },
    selected: {
      control: 'boolean',
      description: 'When true, applies the selected surface on option rows.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'props'
      }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction on option rows.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
        category: 'props'
      }
    },
    icon: {
      control: 'text',
      description: 'PrimeIcons class for the leading icon (option kind only).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'pi pi-home' },
        category: 'props'
      }
    },
    href: {
      control: 'text',
      description: 'Destination URL; renders an anchor when set on option rows.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
        category: 'props'
      }
    },
    target: {
      control: { type: 'select' },
      options: ['_self', '_blank'],
      description: 'Link target when `href` is set.',
      table: {
        type: { summary: "'_self' | '_blank'" },
        defaultValue: { summary: '_self' },
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
        defaultValue: { summary: 'info' },
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
      template:
        '<ul class="m-0 w-[245px] list-none p-0"><story /></ul>'
    })
  ]
}

export default meta

const Template = (args) => ({
  components: { MenuItem },
  setup() {
    return { args }
  },
  template: '<MenuItem v-bind="args" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof MenuItem>} */
export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Default option row (Figma Type=Option, State=Default).' } }
  }
}

export const Selected = {
  args: { selected: true },
  render: Template,
  parameters: {
    docs: { description: { story: 'Selected option with raised surface (Figma Selected=true).' } }
  }
}

export const WithTag = {
  args: { tagValue: 'Label', tagSeverity: 'info' },
  render: Template,
  parameters: {
    docs: { description: { story: 'Option row with trailing info Tag.' } }
  }
}

export const Group = {
  args: { kind: 'group', label: 'Label Group' },
  decorators: [
    () => ({
      template: '<div class="w-[245px]"><story /></div>'
    })
  ],
  render: Template,
  parameters: {
    docs: { description: { story: 'Section overline label (Figma Type=Group).' } }
  }
}

export const Disabled = {
  args: { disabled: true },
  render: Template,
  parameters: {
    docs: { description: { story: 'Disabled option — no interaction, muted tokens.' } }
  }
}

export const LightDark = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'MenuItem option and group on light and dark canvas backgrounds.'
      }
    }
  },
  render: () => ({
    components: { MenuItem },
    template: `
      <div class="flex flex-col gap-0">
        <section class="azion azion-light flex min-h-[14rem] items-start justify-center bg-[var(--bg-canvas)] p-8">
          <ul class="m-0 w-[245px] list-none p-0">
            <MenuItem kind="group" label="Section" />
            <MenuItem label="Home" icon="pi pi-home" selected />
            <MenuItem label="Domains" icon="pi pi-globe" />
          </ul>
        </section>
        <section class="azion azion-dark flex min-h-[14rem] items-start justify-center bg-[var(--bg-canvas)] p-8">
          <ul class="m-0 w-[245px] list-none p-0">
            <MenuItem kind="group" label="Section" />
            <MenuItem label="Home" icon="pi pi-home" selected />
            <MenuItem label="Domains" icon="pi pi-globe" />
          </ul>
        </section>
      </div>
    `
  })
}

export const Accessibility = {
  args: { href: '#home' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Keyboard: Tab focuses the link; Enter activates. Screen reader: current page announced when selected.'
      }
    }
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)
    await step('Tab focuses the menu link', async () => {
      await userEvent.tab()
      expect(canvas.getByRole('link')).toHaveFocus()
    })
    await step('Enter triggers click', async () => {
      await userEvent.keyboard('{Enter}')
      expect(args.onClick).toHaveBeenCalled()
    })
  }
}

export const Playground = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Drive every prop from the Controls panel.'
      }
    }
  }
}
