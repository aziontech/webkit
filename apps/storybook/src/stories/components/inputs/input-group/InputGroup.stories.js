import InputGroup from '@aziontech/webkit/input-group'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import InputGroup from '@aziontech/webkit/input-group'"

const MIDDLE_INPUT =
  '<input placeholder="domain" class="w-full h-full bg-transparent border-0 outline-none focus:ring-0 px-[var(--spacing-md)] text-[color:var(--text-default)]" />'

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
          "Container that flanks an input primitive with optional addons on either side, joined by vertical dividers, and reflects validation state on its border. Composed as `<InputGroup>` (root) plus `<InputGroup.Addon>` sub-components on the left, right, or both — the middle input goes in the root's default slot."
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

const WITH_LEFT_ADDON_MARKUP = `<InputGroup>
  <InputGroup.Addon>https://</InputGroup.Addon>
  ${MIDDLE_INPUT}
</InputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputGroup>} */
export const WithLeftAddon = {
  render: () => ({
    components: { InputGroup },
    template: WITH_LEFT_ADDON_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'A single addon placed before the middle input.' },
      source: { code: toSfc(IMPORT, WITH_LEFT_ADDON_MARKUP) }
    }
  }
}

const WITH_RIGHT_ADDON_MARKUP = `<InputGroup>
  ${MIDDLE_INPUT}
  <InputGroup.Addon>.com</InputGroup.Addon>
</InputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputGroup>} */
export const WithRightAddon = {
  render: () => ({
    components: { InputGroup },
    template: WITH_RIGHT_ADDON_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'A single addon placed after the middle input.' },
      source: { code: toSfc(IMPORT, WITH_RIGHT_ADDON_MARKUP) }
    }
  }
}

const BOTH_ADDONS_MARKUP = `<InputGroup>
  <InputGroup.Addon>https://</InputGroup.Addon>
  ${MIDDLE_INPUT}
  <InputGroup.Addon>.com</InputGroup.Addon>
</InputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputGroup>} */
export const BothAddons = {
  render: () => ({
    components: { InputGroup },
    template: BOTH_ADDONS_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'An addon on each side of the middle input.' },
      source: { code: toSfc(IMPORT, BOTH_ADDONS_MARKUP) }
    }
  }
}

const INVALID_MARKUP = `<InputGroup :invalid="true">
  <InputGroup.Addon>https://</InputGroup.Addon>
  ${MIDDLE_INPUT}
  <InputGroup.Addon>.com</InputGroup.Addon>
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
  <InputGroup.Addon>https://</InputGroup.Addon>
  ${MIDDLE_INPUT}
  <InputGroup.Addon>.com</InputGroup.Addon>
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
