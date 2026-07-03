import CardBox from '@aziontech/webkit/card-box'

/** @type {import('@storybook/vue3').Meta<typeof CardBox>} */
const meta = {
 title: 'Components/Content/CardBox',
  component: CardBox,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component:
          'Structured surface with optional header, body, and footer regions. Figma Webkit CardBox (node 562:6473). Use `title` and `header-action` for the default header layout, or the `header` slot for full control.'
      }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Heading in the default header when the `header` slot is empty.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "''" },
        category: 'props'
      }
    },
    header: {
      description: 'Custom header content; replaces the default title + header-action layout.',
      control: false,
      table: { type: { summary: 'VNode' }, category: 'slots' }
    },
    'header-action': {
      description: 'Actions at the end of the default header; revealed on header hover/focus.',
      control: false,
      table: { type: { summary: 'VNode' }, category: 'slots' }
    },
    content: {
      description: 'Main card body.',
      control: false,
      table: { type: { summary: 'VNode' }, category: 'slots' }
    },
    footer: {
      description: 'Footer region; the footer bar is omitted when this slot is empty.',
      control: false,
      table: { type: { summary: 'VNode' }, category: 'slots' }
    }
  },
  args: {
    title: 'Card Title'
  }
}

export default meta

const Template = (args) => ({
  components: { CardBox },
  setup() {
    return { args }
  },
  template: `
    <CardBox v-bind="args" class="w-full max-w-[512px]">
      <template #content>
        <p class="text-body-md text-[var(--text-default)]">
          Card body content. Place forms, tables, or any markup in the content slot.
        </p>
      </template>
    </CardBox>
  `
})

/** @type {import('@storybook/vue3').StoryObj<typeof CardBox>} */
export const Default = {
  render: Template
}

/** @type {import('@storybook/vue3').StoryObj<typeof CardBox>} */
export const Flush = {
  render: (args) => ({
    components: { CardBox },
    setup() {
      return { args }
    },
    template: `
      <CardBox v-bind="args" :padded="false" class="w-full max-w-[512px]">
        <template #content>
          <p class="text-body-md text-[var(--text-default)] p-[var(--spacing-4)]">
            With padded=false the content sits flush to the card edges; the content owns its own padding (or renders an ItemList with full-width dividers).
          </p>
        </template>
      </CardBox>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Set `padded=false` for edge-to-edge content such as an ItemList with full-width dividers.'
      }
    }
  }
}
