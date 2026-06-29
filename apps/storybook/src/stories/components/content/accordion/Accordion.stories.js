import Accordion from '@aziontech/webkit/accordion'

const components = {
  Accordion,
  AccordionItem: Accordion.Item,
  AccordionTrigger: Accordion.Trigger,
  AccordionContent: Accordion.Content
}

const ITEMS = [
  {
    value: 'overview',
    title: 'What is Azion?',
    body: 'Azion runs your code at the edge, close to users.'
  },
  {
    value: 'pricing',
    title: 'How does pricing work?',
    body: 'Pay only for what you use, with no upfront cost.'
  },
  {
    value: 'support',
    title: 'Enterprise support',
    body: 'Available on Business and Enterprise plans.'
  }
]

/** @type {import('@storybook/vue3').Meta<typeof Accordion>} */
const meta = {
  title: 'Components/Content/Accordion',
  component: Accordion,
  subcomponents: {
    'Accordion.Item': Accordion.Item,
    'Accordion.Trigger': Accordion.Trigger,
    'Accordion.Content': Accordion.Content
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'aria-required-attr', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component: [
          'A vertically stacked set of disclosure items: each item has a clickable header that expands or collapses its content panel. Use it to condense long content into scannable sections. Unlike `tab-view` (mutually-exclusive panels shown in place), an accordion can keep one item open at a time (`type="single"`) or several at once (`type="multiple"`), and its content expands inline below each header.',
          '',
          '## Usage',
          '',
          '```vue',
          '<script setup>',
          "import Accordion from '@aziontech/webkit/accordion'",
          '</script>',
          '',
          '<template>',
          '  <Accordion',
          '    type="single"',
          '    collapsible',
          '    default-value="overview"',
          '    size="medium"',
          '    arrow-position="right"',
          '  >',
          '    <Accordion.Item value="overview">',
          '      <Accordion.Trigger>What is Azion?</Accordion.Trigger>',
          '      <Accordion.Content>Azion runs your code at the edge, close to users.</Accordion.Content>',
          '    </Accordion.Item>',
          '    <Accordion.Item value="pricing">',
          '      <Accordion.Trigger>How does pricing work?</Accordion.Trigger>',
          '      <Accordion.Content>Pay only for what you use, with no upfront cost.</Accordion.Content>',
          '    </Accordion.Item>',
          '    <Accordion.Item value="support" disabled>',
          '      <Accordion.Trigger>Enterprise support</Accordion.Trigger>',
          '      <Accordion.Content>Available on Business and Enterprise plans.</Accordion.Content>',
          '    </Accordion.Item>',
          '  </Accordion>',
          '</template>',
          '```'
        ].join('\n')
      },
      source: {
        type: 'dynamic',
        excludeDecorators: true
      },
      canvas: {
        sourceState: 'shown'
      }
    }
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'Whether one or multiple items can be open at the same time.',
      table: {
        category: 'props',
        type: { summary: "'single' | 'multiple'" },
        defaultValue: { summary: "'single'" }
      }
    },
    value: {
      control: 'text',
      description:
        'Controlled open item(s): a single `value` string in single mode, an array of values in multiple mode. Use with `v-model:value`.',
      table: { category: 'props', type: { summary: 'string | string[] | null' } }
    },
    defaultValue: {
      control: 'text',
      description: 'Initial open item(s) when uncontrolled.',
      table: {
        category: 'props',
        type: { summary: 'string | string[] | null' },
        defaultValue: { summary: 'null' }
      }
    },
    collapsible: {
      control: 'boolean',
      description: 'In single mode, lets the open item collapse so that no item is open.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    size: {
      control: 'select',
      options: ['medium', 'large'],
      description: 'Size token; affects header height, padding, and typography.',
      table: {
        category: 'props',
        type: { summary: "'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    arrowPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Side of the header the chevron sits on.',
      table: {
        category: 'props',
        type: { summary: "'left' | 'right'" },
        defaultValue: { summary: "'right'" }
      }
    },
    onUpdateValue: {
      action: 'update:value',
      description: '`v-model:value`. Fires when the open item(s) change.',
      table: { category: 'events' }
    },
    onValueChange: {
      action: 'value-change',
      description: 'Convenience event mirroring `update:value`.',
      table: { category: 'events' }
    },
    default: {
      control: false,
      description: 'The `Accordion.Item` children.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    }
  },
  args: {
    type: 'single',
    collapsible: true,
    size: 'medium',
    arrowPosition: 'right'
  }
}

export default meta

const Template = (args) => ({
  components,
  setup() {
    const { onUpdateValue, onValueChange, ...props } = args
    return { props, items: ITEMS, onUpdateValue, onValueChange }
  },
  template: `
    <Accordion
      v-bind="props"
      class="w-full max-w-[40rem]"
      @update:value="onUpdateValue"
      @value-change="onValueChange"
    >
      <AccordionItem v-for="item in items" :key="item.value" :value="item.value">
        <AccordionTrigger>{{ item.title }}</AccordionTrigger>
        <AccordionContent>{{ item.body }}</AccordionContent>
      </AccordionItem>
    </Accordion>
  `
})

/** @type {import('@storybook/vue3').StoryObj<typeof Accordion>} */
export const Default = {
  args: { defaultValue: 'overview' },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Single-mode accordion with one item open via `default-value`.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Accordion>} */
export const Sizes = {
  render: () => ({
    components,
    setup() {
      return { items: ITEMS }
    },
    template: `
      <div class="flex flex-col gap-8 w-full max-w-[40rem]">
        <Accordion type="single" collapsible default-value="overview" size="medium">
          <AccordionItem v-for="item in items" :key="item.value" :value="item.value">
            <AccordionTrigger>{{ item.title }}</AccordionTrigger>
            <AccordionContent>{{ item.body }}</AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible default-value="overview" size="large">
          <AccordionItem v-for="item in items" :key="item.value" :value="item.value">
            <AccordionTrigger>{{ item.title }}</AccordionTrigger>
            <AccordionContent>{{ item.body }}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: { story: '`medium` and `large` sizes side by side.' }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Accordion>} */
export const ArrowPosition = {
  render: () => ({
    components,
    setup() {
      return { items: ITEMS }
    },
    template: `
      <div class="flex flex-col gap-8 w-full max-w-[40rem]">
        <Accordion type="single" collapsible default-value="overview" arrow-position="right">
          <AccordionItem v-for="item in items" :key="item.value" :value="item.value">
            <AccordionTrigger>{{ item.title }}</AccordionTrigger>
            <AccordionContent>{{ item.body }}</AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible default-value="overview" arrow-position="left">
          <AccordionItem v-for="item in items" :key="item.value" :value="item.value">
            <AccordionTrigger>{{ item.title }}</AccordionTrigger>
            <AccordionContent>{{ item.body }}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: { story: '`right` and `left` chevron placement side by side.' }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Accordion>} */
export const Disabled = {
  render: () => ({
    components,
    setup() {
      return { items: ITEMS }
    },
    template: `
      <Accordion type="single" collapsible default-value="overview" class="w-full max-w-[40rem]">
        <AccordionItem
          v-for="item in items"
          :key="item.value"
          :value="item.value"
          :disabled="item.value === 'pricing'"
        >
          <AccordionTrigger>{{ item.title }}</AccordionTrigger>
          <AccordionContent>{{ item.body }}</AccordionContent>
        </AccordionItem>
      </Accordion>
    `
  }),
  parameters: {
    docs: {
      description: { story: 'The middle item carries the per-item `disabled` prop and cannot toggle.' }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Accordion>} */
export const Multiple = {
  render: () => ({
    components,
    setup() {
      return { items: ITEMS, openValues: ['overview', 'pricing'] }
    },
    template: `
      <Accordion type="multiple" :default-value="openValues" class="w-full max-w-[40rem]">
        <AccordionItem v-for="item in items" :key="item.value" :value="item.value">
          <AccordionTrigger>{{ item.title }}</AccordionTrigger>
          <AccordionContent>{{ item.body }}</AccordionContent>
        </AccordionItem>
      </Accordion>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: '`type="multiple"` with two items open at once via an array `default-value`.'
      }
    }
  }
}
