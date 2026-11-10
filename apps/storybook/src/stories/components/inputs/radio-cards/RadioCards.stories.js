import RadioCards from '@aziontech/webkit/radio-cards'
import Tag from '@aziontech/webkit/tag'
import { ref, watch } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import RadioCards from '@aziontech/webkit/radio-cards'"
const TAG_IMPORT = "import Tag from '@aziontech/webkit/tag'"

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

/** @type {import('@storybook/vue3').Meta<typeof RadioCards>} */
const meta = {
  title: 'Components/Primitives/Inputs/RadioCards',
  component: RadioCards,
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
          'Horizontal grid of selectable cards for mutually exclusive choices (plans, roles, feature tiers). Each option shows a label, optional icon and description, with optional trailing content via the `tag` slot.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Currently selected item value (v-model).',
      table: { category: 'props', type: { summary: 'string | number' } }
    },
    items: {
      control: 'object',
      description: 'Options rendered as selectable cards; each entry must include value and label.',
      table: { category: 'props', type: { summary: 'RadioCardsItem[]' } }
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all options and applies disabled tokens.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    'onUpdate:modelValue': {
      action: 'update:modelValue',
      description: 'Emitted when the user selects an option.',
      table: { category: 'events', type: { summary: 'string | number' } }
    },
    default: {
      control: false,
      description: 'Overrides the entire card body for an option.',
      table: { category: 'slots', type: { summary: '{ item, selected }' } }
    },
    tag: {
      control: false,
      description: 'Trailing content below label/description (e.g. plan badge).',
      table: { category: 'slots', type: { summary: '{ item, selected }' } }
    }
  },
  args: {
    modelValue: 'option1',
    items: basicItems,
    disabled: false
  }
}

export default meta

const Template = (args) => ({
  components: { RadioCards },
  setup() {
    const value = ref(args.modelValue)
    watch(
      () => args.modelValue,
      (next) => {
        value.value = next
      }
    )
    const onUpdate = (next) => {
      value.value = next
      args['onUpdate:modelValue']?.(next)
    }
    return { args, value, onUpdate }
  },
  template: '<RadioCards v-bind="args" :model-value="value" @update:model-value="onUpdate" />'
})

const BASIC_ITEMS_SOURCE = `const items = [
  { value: 'option1', icon: 'pi pi-check', label: 'Option One', description: 'First option description' },
  { value: 'option2', icon: 'pi pi-times', label: 'Option Two', description: 'Second option description' },
  { value: 'option3', icon: 'pi pi-star', label: 'Option Three', description: 'Third option description' }
]`

const DEFAULT_SCRIPT = [
  IMPORT,
  "import { ref } from 'vue'",
  '',
  BASIC_ITEMS_SOURCE,
  "const selected = ref('option1')"
]

const DEFAULT_MARKUP = '<RadioCards v-model="selected" :items="items" />'

/** @type {import('@storybook/vue3').StoryObj<typeof RadioCards>} */
export const Default = {
  args: { modelValue: 'option1', items: basicItems },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Basic three-option grid with icons and descriptions.' },
      source: { code: toSfc(DEFAULT_SCRIPT, DEFAULT_MARKUP) }
    }
  }
}

const DISABLED_MARKUP = '<RadioCards v-model="selected" :items="items" disabled />'

/** @type {import('@storybook/vue3').StoryObj<typeof RadioCards>} */
export const Disabled = {
  args: { modelValue: 'option1', items: basicItems, disabled: true },
  render: Template,
  parameters: {
    docs: {
      description: { story: 'All options are non-interactive with disabled tokens applied.' },
      source: { code: toSfc(DEFAULT_SCRIPT, DISABLED_MARKUP) }
    }
  }
}

const PLAN_ITEMS_SOURCE = `const items = [
  { value: 'hobby', icon: 'pi pi-sparkles', label: 'Hobby', description: 'For learning and small personal projects.', ariaLabel: 'Hobby plan', tag: 'Hobby Plan' },
  { value: 'pro', icon: 'pi pi-chart-line', label: 'Pro', description: 'For professional or commercial applications.', ariaLabel: 'Pro plan', tag: 'Pro Plan' },
  { value: 'scale', icon: 'pi pi-file-check', label: 'Scale', description: 'For businesses requiring advanced security and compliance.', ariaLabel: 'Scale plan', tag: 'Scale Plan' }
]`

const WITH_TAG_SCRIPT = [
  IMPORT,
  TAG_IMPORT,
  "import { ref } from 'vue'",
  '',
  PLAN_ITEMS_SOURCE,
  "const selected = ref('hobby')"
]

const WITH_TAG_MARKUP = `<RadioCards v-model="selected" :items="items">
  <template #tag="{ item }">
    <Tag :label="item.tag" severity="info" />
  </template>
</RadioCards>`

/** @type {import('@storybook/vue3').StoryObj<typeof RadioCards>} */
export const WithTag = {
  args: { modelValue: 'hobby', items: planItems },
  render: (args) => ({
    components: { RadioCards, Tag },
    setup() {
      const value = ref(args.modelValue)
      watch(
        () => args.modelValue,
        (next) => {
          value.value = next
        }
      )
      const onUpdate = (next) => {
        value.value = next
        args['onUpdate:modelValue']?.(next)
      }
      return { args, value, onUpdate }
    },
    template: `
      <RadioCards v-bind="args" :model-value="value" @update:model-value="onUpdate">
        <template #tag="{ item }">
          <Tag :label="item.tag" severity="info" />
        </template>
      </RadioCards>
    `
  }),
  parameters: {
    docs: {
      description: { story: 'Plan selection with Tag components in the tag slot.' },
      source: { code: toSfc(WITH_TAG_SCRIPT, WITH_TAG_MARKUP) }
    }
  }
}
