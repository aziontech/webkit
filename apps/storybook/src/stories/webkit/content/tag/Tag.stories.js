import Tag from '@aziontech/webkit/tag'

const severities = [
  'primary',
  'secondary',
  'accent',
  'success',
  'warning',
  'danger',
  'info',
  'contrast'
]

/** @type {import('@storybook/vue3').Meta<typeof Tag>} */
const meta = {
  title: 'Webkit/Content/Tag',
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
        component: [
          'Compact status or category label with severity-based color coding. Supports optional icon, pill shape via `rounded`, and two sizes aligned with the Webkit Figma Tag component set.',
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          "import Tag from '@aziontech/webkit/tag'",
          '</script>',
          '',
          '<template>',
          '  <Tag value="Label" severity="primary" size="medium" />',
          '</template>',
          '```'
        ].join('\n')
      }
    }
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Fallback text when the default slot is empty.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' }
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
        'Size token. `medium`: 24px height (`--h-6`), 8px horizontal padding and icon gap (`--spacing-xs`), 12px type (`text-tag-md`). `small`: 20px height (`--h-5`), 4px padding and gap (`--spacing-xxs`), 11px type (`text-tag-sm`).',
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
    value: 'Label',
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
    return { props: args }
  },
  template: '<Tag v-bind="props" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof Tag>} */
export const Default = {
  render: Template,
  parameters: {
    docs: { description: { story: 'Default primary tag at medium size.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Tag>} */
export const Types = {
  render: (args) => ({
    components: { Tag },
    setup() {
      return { args, severities }
    },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <Tag
          v-for="severity in severities"
          :key="severity"
          value="Label"
          :severity="severity"
          :size="args.size"
          :rounded="args.rounded"
          :icon="args.icon"
        />
      </div>
    `
  }),
  parameters: {
    docs: { description: { story: 'All severity variants side by side.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Tag>} */
export const Sizes = {
  render: () => ({
    components: { Tag },
    template: `
      <div class="flex flex-col gap-4">
        <div class="flex flex-wrap items-center gap-4">
          <Tag value="Label" severity="primary" size="medium" />
          <Tag value="Label" severity="primary" size="medium" rounded />
          <Tag value="Label" severity="primary" size="medium" icon="pi pi-box" />
          <Tag value="Label" severity="primary" size="medium" icon="pi pi-box" rounded />
        </div>
        <div class="flex flex-wrap items-center gap-4">
          <Tag value="Label" severity="primary" size="small" />
          <Tag value="Label" severity="primary" size="small" rounded />
          <Tag value="Label" severity="primary" size="small" icon="pi pi-box" />
          <Tag value="Label" severity="primary" size="small" icon="pi pi-box" rounded />
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Medium row (24px, `--spacing-xs` padding and gap) and small row (20px, `--spacing-xxs` padding and gap), each with default shape, pill, icon, and icon + pill.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Tag>} */
export const WithIcon = {
  render: (args) => ({
    components: { Tag },
    setup() {
      return { args, severities }
    },
    template: `
      <div class="flex flex-wrap items-center gap-4">
        <Tag
          v-for="severity in severities"
          :key="severity"
          value="Label"
          :severity="severity"
          icon="pi pi-box"
          :size="args.size"
          :rounded="args.rounded"
        />
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Leading icon via the `icon` prop (PrimeIcons class) across severity variants.'
      }
    }
  }
}
