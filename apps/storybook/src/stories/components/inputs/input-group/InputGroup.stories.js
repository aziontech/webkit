import InputGroup from '@aziontech/webkit/input-group'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import InputGroup from '@aziontech/webkit/input-group'"

const MIDDLE_INPUT =
  '<input placeholder="domain" class="w-full h-full bg-[var(--bg-surface)] border-0 outline-none focus:ring-0 px-[var(--spacing-md)] text-label-sm text-[var(--text-default)] placeholder:text-[var(--text-muted)]" />'

/** @type {import('@storybook/vue3').Meta<typeof InputGroup>} */
const meta = {
  title: 'Components/Inputs/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "Container that flanks an input primitive with optional slots on either side, joined by vertical borders, and reflects validation state on its border. Composed as `<InputGroup>` (root) plus `<InputGroup.SlotLeft>` and `<InputGroup.SlotRight>` sub-components — the middle input goes in the root's default slot."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    invalid: {
      control: 'boolean',
      description:
        'Renders the error border. When `required` is also `true`, the border uses the warning color instead of danger. Also sets `aria-invalid="true"` on the root.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    required: {
      control: 'boolean',
      description:
        'Semantic marker for a required field. Combined with `invalid=true`, switches the border color to warning. Sets `aria-required="true"` on the root.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    }
  },
  args: {
    invalid: false,
    required: false
  }
}

export default meta

const Template = (args) => ({
  components: { InputGroup },
  setup() {
    return { props: args }
  },
  template: `<InputGroup :invalid="props.invalid" :required="props.required">${MIDDLE_INPUT}</InputGroup>`
})

const DEFAULT_MARKUP = `<InputGroup>
  ${MIDDLE_INPUT}
</InputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputGroup>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Root with only a raw `<input>` in the middle slot and no addons.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const WITH_SLOT_LEFT_MARKUP = `<InputGroup>
  <InputGroup.SlotLeft>https://</InputGroup.SlotLeft>
  ${MIDDLE_INPUT}
</InputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputGroup>} */
export const WithSlotLeft = {
  render: () => ({
    components: { InputGroup },
    template: WITH_SLOT_LEFT_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'A single `<InputGroup.SlotLeft>` before the middle input.' },
      source: { code: toSfc(IMPORT, WITH_SLOT_LEFT_MARKUP) }
    }
  }
}

const WITH_SLOT_RIGHT_MARKUP = `<InputGroup>
  ${MIDDLE_INPUT}
  <InputGroup.SlotRight>.com</InputGroup.SlotRight>
</InputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputGroup>} */
export const WithSlotRight = {
  render: () => ({
    components: { InputGroup },
    template: WITH_SLOT_RIGHT_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'A single `<InputGroup.SlotRight>` after the middle input.' },
      source: { code: toSfc(IMPORT, WITH_SLOT_RIGHT_MARKUP) }
    }
  }
}

const BOTH_SLOTS_MARKUP = `<InputGroup>
  <InputGroup.SlotLeft>https://</InputGroup.SlotLeft>
  ${MIDDLE_INPUT}
  <InputGroup.SlotRight>.com</InputGroup.SlotRight>
</InputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputGroup>} */
export const BothSlots = {
  render: () => ({
    components: { InputGroup },
    template: BOTH_SLOTS_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'A `SlotLeft` and a `SlotRight` flanking the middle input.' },
      source: { code: toSfc(IMPORT, BOTH_SLOTS_MARKUP) }
    }
  }
}

const INVALID_MARKUP = `<InputGroup :invalid="true">
  <InputGroup.SlotLeft>https://</InputGroup.SlotLeft>
  ${MIDDLE_INPUT}
  <InputGroup.SlotRight>.com</InputGroup.SlotRight>
</InputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputGroup>} */
export const Invalid = {
  render: () => ({
    components: { InputGroup },
    template: INVALID_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'Invalid state — root shows the danger border.' },
      source: { code: toSfc(IMPORT, INVALID_MARKUP) }
    }
  }
}

const INVALID_REQUIRED_MARKUP = `<InputGroup :invalid="true" :required="true">
  <InputGroup.SlotLeft>https://</InputGroup.SlotLeft>
  ${MIDDLE_INPUT}
  <InputGroup.SlotRight>.com</InputGroup.SlotRight>
</InputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputGroup>} */
export const InvalidRequired = {
  render: () => ({
    components: { InputGroup },
    template: INVALID_REQUIRED_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'Invalid + required — root shows the warning border instead of danger.' },
      source: { code: toSfc(IMPORT, INVALID_REQUIRED_MARKUP) }
    }
  }
}
