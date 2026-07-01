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
          "Monolithic container that flanks an input primitive with optional `#left` and `#right` named slots, joined by vertical seams, and reflects validation state on its border. The middle input goes in the root's `default` slot."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    invalid: {
      control: 'boolean',
      description: 'Renders the error border and sets `aria-invalid="true"` on the root.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    required: {
      control: 'boolean',
      description: 'Renders the required (warning) border and sets `aria-required="true"` on the root.',
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
      description: { story: 'Root with only a raw `<input>` in the middle slot and no side slots.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const WITH_SLOT_LEFT_MARKUP = `<InputGroup>
  <template #left>https://</template>
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
      description: { story: 'The `#left` named slot filled with static text before the middle input.' },
      source: { code: toSfc(IMPORT, WITH_SLOT_LEFT_MARKUP) }
    }
  }
}

const WITH_SLOT_RIGHT_MARKUP = `<InputGroup>
  ${MIDDLE_INPUT}
  <template #right>.com</template>
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
      description: { story: 'The `#right` named slot filled with static text after the middle input.' },
      source: { code: toSfc(IMPORT, WITH_SLOT_RIGHT_MARKUP) }
    }
  }
}

const BOTH_SLOTS_MARKUP = `<InputGroup>
  <template #left>https://</template>
  ${MIDDLE_INPUT}
  <template #right>.com</template>
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
      description: { story: 'Both `#left` and `#right` slots filled, flanking the middle input.' },
      source: { code: toSfc(IMPORT, BOTH_SLOTS_MARKUP) }
    }
  }
}

const INVALID_MARKUP = `<InputGroup :invalid="true">
  <template #left>https://</template>
  ${MIDDLE_INPUT}
  <template #right>.com</template>
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

const REQUIRED_MARKUP = `<InputGroup :required="true">
  <template #left>https://</template>
  ${MIDDLE_INPUT}
  <template #right>.com</template>
</InputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputGroup>} */
export const Required = {
  render: () => ({
    components: { InputGroup },
    template: REQUIRED_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'Required state — root shows the warning border.' },
      source: { code: toSfc(IMPORT, REQUIRED_MARKUP) }
    }
  }
}
