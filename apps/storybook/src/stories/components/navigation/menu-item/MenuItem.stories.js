import MenuItem from '@aziontech/webkit/menu-item'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import MenuItem from '@aziontech/webkit/menu-item'"

/** @type {import('@storybook/vue3').Meta<typeof MenuItem>} */
const meta = {
  title: 'Components/Navigation/MenuItem',
  component: MenuItem,
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
          { id: 'focus-order-semantics', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'Sidebar navigation row (`option`) or section overline (`group`). Supports an optional leading icon, link rendering when `href` is set, and an optional trailing Tag.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['option', 'group'],
      description: 'Structural variant: navigable row or section overline label.',
      table: {
        category: 'props',
        type: { summary: "'option' | 'group'" },
        defaultValue: { summary: "'option'" }
      }
    },
    label: {
      control: 'text',
      description: 'Visible label for the row or group header.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Option 1'" }
      }
    },
    selected: {
      control: 'boolean',
      description: 'When true, applies the selected surface on option rows.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction on option rows.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    icon: {
      control: 'text',
      description: 'PrimeIcons class for the leading icon (option kind only).',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'pi pi-home'" }
      }
    },
    href: {
      control: 'text',
      description: 'Destination URL; renders an anchor when set on option rows.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    target: {
      control: 'select',
      options: ['_self', '_blank'],
      description: 'Link target when `href` is set.',
      table: {
        category: 'props',
        type: { summary: "'_self' | '_blank'" },
        defaultValue: { summary: "'_self'" }
      }
    },
    tagValue: {
      control: 'text',
      description: 'Short text rendered in a trailing Tag when set.',
      table: { category: 'props', type: { summary: 'string' } }
    },
    tagSeverity: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'accent'],
      description: 'Severity token for the optional trailing Tag.',
      table: {
        category: 'props',
        type: {
          summary: "'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'accent'"
        },
        defaultValue: { summary: "'info'" }
      }
    },
    onClick: {
      action: 'click',
      description: 'Emitted when an option row is activated.',
      table: {
        category: 'events',
        type: { summary: '(event: MouseEvent, item: { label: string; href: string })' }
      }
    },
    default: {
      control: false,
      description: 'Overrides the option label text.',
      table: { category: 'slots', type: { summary: 'VNode | string' } }
    },
    tag: {
      control: false,
      description: 'Custom trailing badge content.',
      table: { category: 'slots', type: { summary: 'VNode' } }
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
  template: '<MenuItem v-bind="args" />'
})

const DEFAULT_MARKUP = `<ul class="m-0 w-[245px] list-none p-0">
  <MenuItem kind="option" label="Option 1" icon="pi pi-home" />
</ul>`

/** @type {import('@storybook/vue3').StoryObj<typeof MenuItem>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default option row.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const STATES_TEMPLATE = `<ul class="m-0 w-[245px] list-none p-0">
  <MenuItem label="Default" icon="pi pi-home" />
  <MenuItem label="Selected" icon="pi pi-home" selected />
  <MenuItem label="Disabled" icon="pi pi-home" disabled />
</ul>`

/** @type {import('@storybook/vue3').StoryObj<typeof MenuItem>} */
export const States = {
  render: () => ({ components: { MenuItem }, template: STATES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'Default, selected, and disabled option states.' },
      source: { code: toSfc(IMPORT, STATES_TEMPLATE) }
    }
  }
}

const WITH_TAG_MARKUP = `<ul class="m-0 w-[245px] list-none p-0">
  <MenuItem kind="option" label="Option 1" icon="pi pi-home" tag-value="Label" tag-severity="info" />
</ul>`

/** @type {import('@storybook/vue3').StoryObj<typeof MenuItem>} */
export const WithTag = {
  args: { tagValue: 'Label', tagSeverity: 'info' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Option row with a trailing info Tag via `tagValue` and `tagSeverity`.'
      },
      source: { code: toSfc(IMPORT, WITH_TAG_MARKUP) }
    }
  }
}

const GROUP_TEMPLATE = `<ul class="m-0 w-[245px] list-none p-0">
  <MenuItem kind="group" label="Main section" />
  <MenuItem label="Home" icon="pi pi-home" />
  <MenuItem label="Applications" icon="pi pi-th-large" />
  <MenuItem label="Domains" icon="pi pi-globe" />
  <MenuItem label="Certificates" icon="pi pi-shield" />
  <MenuItem label="Settings" icon="pi pi-cog" />
</ul>`

/** @type {import('@storybook/vue3').StoryObj<typeof MenuItem>} */
export const Group = {
  render: () => ({ components: { MenuItem }, template: GROUP_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'Group overline header followed by five option rows.' },
      source: { code: toSfc(IMPORT, GROUP_TEMPLATE) }
    }
  }
}
