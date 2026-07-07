import { ref } from 'vue'

import BoxGridSelection from '@aziontech/webkit/box-grid-selection'
import Tag from '@aziontech/webkit/tag'

/** @type {import('@storybook/vue3').Meta<typeof BoxGridSelection>} */
const meta = {
 title: 'Components/Inputs/Box Grid Selection',
  component: BoxGridSelection,
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
          'Horizontal grid of selectable cards for mutually exclusive choices (plans, roles, feature tiers). Supports default and tag slots per option.'
      }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Currently selected item value (v-model).',
      table: { type: { summary: 'string | number' }, category: 'props' }
    },
    items: {
      control: 'object',
      description: 'Options rendered as selectable cards; each entry must include value and label.',
      table: { type: { summary: 'BoxGridSelectionItem[]' }, category: 'props' }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all options and applies disabled tokens.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the user selects an option.',
      table: { type: { summary: 'string | number' }, category: 'events' }
    },
    default: {
      control: false,
      description: 'Overrides the entire card body for an option.',
      table: { type: { summary: '{ item, selected }' }, category: 'slots' }
    },
    tag: {
      control: false,
      description: 'Trailing content below label/description (e.g. plan badge).',
      table: { type: { summary: '{ item, selected }' }, category: 'slots' }
    }
  }
}

export default meta

const basicItems = [
  {
    value: 'option1',
    icon: 'pi pi-check',
    label: 'Option One',
    description: 'First option description'
  },
  {
    value: 'option2',
    icon: 'pi pi-times',
    label: 'Option Two',
    description: 'Second option description'
  },
  {
    value: 'option3',
    icon: 'pi pi-star',
    label: 'Option Three',
    description: 'Third option description'
  }
]

const planItems = [
  {
    value: 'hobby',
    icon: 'pi pi-sparkles',
    label: 'Hobby',
    description: 'For learning and small personal projects.',
    ariaLabel: 'Hobby plan',
    tag: 'Hobby Plan'
  },
  {
    value: 'pro',
    icon: 'pi pi-chart-line',
    label: 'Pro',
    description: 'For professional or commercial applications.',
    ariaLabel: 'Pro plan',
    tag: 'Pro Plan'
  },
  {
    value: 'scale',
    icon: 'pi pi-file-check',
    label: 'Scale',
    description: 'For businesses requiring advanced security and compliance.',
    ariaLabel: 'Scale plan',
    tag: 'Scale Plan'
  }
]

const Template = (args) => ({
  components: { BoxGridSelection },
  setup() {
    const value = ref(args.modelValue)
    return { args, value }
  },
  template: '<BoxGridSelection v-bind="args" v-model="value" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof BoxGridSelection>} */
export const Default = {
  args: {
    modelValue: 'option1',
    items: basicItems
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'Basic three-option grid with icons and descriptions.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof BoxGridSelection>} */
export const Disabled = {
  args: {
    modelValue: 'option1',
    items: basicItems,
    disabled: true
  },
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'All options are non-interactive with disabled tokens applied.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof BoxGridSelection>} */
export const WithTag = {
  args: {
    modelValue: 'hobby',
    items: planItems
  },
  render: (args) => ({
    components: { BoxGridSelection, Tag },
    setup() {
      const value = ref(args.modelValue)
      return { args, value }
    },
    template: `
      <BoxGridSelection v-bind="args" v-model="value">
        <template #tag="{ item }">
          <Tag
            :label="item.tag"
            severity="info"
          />
        </template>
      </BoxGridSelection>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Plan selection with Tag components in the tag slot.'
      }
    }
  }
}
