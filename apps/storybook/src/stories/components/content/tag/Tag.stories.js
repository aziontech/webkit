import Tag from '@aziontech/webkit/tag'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Tag from '@aziontech/webkit/tag'"

/** @type {import('@storybook/vue3').Meta<typeof Tag>} */
const meta = {
  title: 'Components/Content/Tag',
  component: Tag,
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
          'Compact status or category label with severity-based color coding. Supports an optional leading icon, pill shape via `rounded`, and two sizes.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Fallback text when the default slot is empty.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    severity: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'success',
        'info',
        'warning',
        'danger',
        'accent',
        'contrast'
      ],
      description:
        'Color style for the tag surface and label; `contrast` uses contrast surface tokens.',
      table: {
        category: 'props',
        type: {
          summary:
            "'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'accent' | 'contrast'"
        },
        defaultValue: { summary: "'primary'" }
      }
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description:
        'Size token. `medium`: 24px height, 8px horizontal padding and icon gap (`--spacing-xs`), 12px type (`text-tag-md`). `small`: 20px height, 4px padding and gap (`--spacing-xxs`), 11px type (`text-tag-sm`).',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    rounded: {
      control: 'boolean',
      description: 'Pill shape when true.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    icon: {
      control: 'text',
      description: 'PrimeIcons class for the leading icon.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
      }
    },
    default: {
      control: false,
      description: 'Main content.',
      table: {
        category: 'slots',
        type: { summary: 'VNode' }
      }
    }
  },
  args: {
    label: 'Label',
    severity: 'primary',
    size: 'medium',
    rounded: false,
    icon: ''
  }
}

export default meta

const Template = (args) => ({
  components: { Tag },
  setup() {
    return { args }
  },
  template: '<Tag v-bind="args" />'
})

const DEFAULT_MARKUP = '<Tag label="Label" severity="primary" size="medium" />'

/** @type {import('@storybook/vue3').StoryObj<typeof Tag>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default primary tag at medium size.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const TYPES_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
  <Tag label="Label" severity="primary" />
  <Tag label="Label" severity="secondary" />
  <Tag label="Label" severity="accent" />
  <Tag label="Label" severity="success" />
  <Tag label="Label" severity="warning" />
  <Tag label="Label" severity="danger" />
  <Tag label="Label" severity="info" />
  <Tag label="Label" severity="contrast" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Tag>} */
export const Types = {
  render: () => ({ components: { Tag }, template: TYPES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All severity variants side by side.' },
      source: { code: toSfc(IMPORT, TYPES_TEMPLATE) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-col gap-4">
  <div class="flex flex-wrap items-center gap-4">
    <Tag label="Label" severity="primary" size="medium" />
    <Tag label="Label" severity="primary" size="medium" rounded />
    <Tag label="Label" severity="primary" size="medium" icon="pi pi-box" />
    <Tag label="Label" severity="primary" size="medium" icon="pi pi-box" rounded />
  </div>
  <div class="flex flex-wrap items-center gap-4">
    <Tag label="Label" severity="primary" size="small" />
    <Tag label="Label" severity="primary" size="small" rounded />
    <Tag label="Label" severity="primary" size="small" icon="pi pi-box" />
    <Tag label="Label" severity="primary" size="small" icon="pi pi-box" rounded />
  </div>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Tag>} */
export const Sizes = {
  render: () => ({ components: { Tag }, template: SIZES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Medium row (24px, `--spacing-xs` padding and gap) and small row (20px, `--spacing-xxs` padding and gap), each with default shape, pill, icon, and icon + pill.'
      },
      source: { code: toSfc(IMPORT, SIZES_TEMPLATE) }
    }
  }
}

const WITH_ICON_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
  <Tag label="Label" severity="primary" icon="pi pi-box" />
  <Tag label="Label" severity="secondary" icon="pi pi-box" />
  <Tag label="Label" severity="accent" icon="pi pi-box" />
  <Tag label="Label" severity="success" icon="pi pi-box" />
  <Tag label="Label" severity="warning" icon="pi pi-box" />
  <Tag label="Label" severity="danger" icon="pi pi-box" />
  <Tag label="Label" severity="info" icon="pi pi-box" />
  <Tag label="Label" severity="contrast" icon="pi pi-box" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Tag>} */
export const WithIcon = {
  render: () => ({ components: { Tag }, template: WITH_ICON_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story: 'Leading icon via the `icon` prop (PrimeIcons class) across severity variants.'
      },
      source: { code: toSfc(IMPORT, WITH_ICON_TEMPLATE) }
    }
  }
}
