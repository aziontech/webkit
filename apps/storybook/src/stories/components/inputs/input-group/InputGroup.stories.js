import Button from '@aziontech/webkit/button'
import InputGroup, { InputGroupAddon } from '@aziontech/webkit/input-group'
import Select, {
  SelectContent,
  SelectOption,
  SelectTrigger
} from '@aziontech/webkit/select'
import { ref } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORTS = [
  "import InputGroup from '@aziontech/webkit/input-group'",
  "import Button from '@aziontech/webkit/button'",
  "import Select from '@aziontech/webkit/select'"
]

const MIDDLE_INPUT =
  '<input placeholder="domain" class="flex-1 min-w-0 h-full bg-[var(--bg-surface)] border-0 outline-none focus:ring-0 px-[var(--spacing-md)] text-label-sm text-[var(--text-default)] placeholder:text-[var(--text-muted)]" />'

// Runtime templates must use the FLAT sub-component name (<InputGroupAddon>) because
// Vue's runtime template compiler can't reliably resolve dot-notation. The "Show code"
// panel still shows the compound (<InputGroup.Addon>) — swapped by this helper.
const toSource = (markup) =>
  markup.replace(/<(\/?)InputGroupAddon\b/g, '<$1InputGroup.Addon')

const components = {
  InputGroup,
  InputGroupAddon,
  Button,
  Select,
  SelectTrigger,
  SelectContent,
  SelectOption
}

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
          "Composition container that joins an input primitive with any number of adjacent controls (buttons, selects, static addons) into a single visual field — the webkit analogue of PrimeVue's `InputGroup`. The root only orchestrates: outer border, `focus-within` ring, and inline Tailwind child-selectors that round only the outer edges and collapse borders between siblings. Everything else is a **child**: the middle input goes in the root's `default` slot; sibling controls (`<Button>`, `<Select>`, `<InputText>`, `<InputGroupAddon>`) are dropped in directly."
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
    },
    disabled: {
      control: 'boolean',
      description:
        'Renders the disabled visual (muted fill, not-allowed cursor, no focus ring) and sets `aria-disabled="true"` on the root.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    }
  },
  args: {
    invalid: false,
    required: false,
    disabled: false
  }
}

export default meta

const Template = (args) => ({
  components,
  setup() {
    return { props: args }
  },
  template: `<InputGroup :invalid="props.invalid" :required="props.required" :disabled="props.disabled">${MIDDLE_INPUT}</InputGroup>`
})

const DEFAULT_MARKUP = `<InputGroup>
  ${MIDDLE_INPUT}
</InputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputGroup>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Root with only a raw `<input>` as its single child.' },
      source: { code: toSfc(IMPORTS, DEFAULT_MARKUP) }
    }
  }
}

const WITH_ADDON_LEFT_MARKUP = `<InputGroup>
  <InputGroupAddon>https://</InputGroupAddon>
  ${MIDDLE_INPUT}
</InputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputGroup>} */
export const WithAddonLeft = {
  render: () => ({
    components,
    template: WITH_ADDON_LEFT_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: '`<InputGroupAddon>` before the middle input — static-text island on the left.' },
      source: { code: toSfc(IMPORTS, toSource(WITH_ADDON_LEFT_MARKUP)) }
    }
  }
}

const WITH_ADDON_RIGHT_MARKUP = `<InputGroup>
  ${MIDDLE_INPUT}
  <InputGroupAddon>.com</InputGroupAddon>
</InputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputGroup>} */
export const WithAddonRight = {
  render: () => ({
    components,
    template: WITH_ADDON_RIGHT_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: '`<InputGroupAddon>` after the middle input — static-text island on the right.' },
      source: { code: toSfc(IMPORTS, toSource(WITH_ADDON_RIGHT_MARKUP)) }
    }
  }
}

const BOTH_ADDONS_MARKUP = `<InputGroup>
  <InputGroupAddon>https://</InputGroupAddon>
  ${MIDDLE_INPUT}
  <InputGroupAddon>.com</InputGroupAddon>
</InputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputGroup>} */
export const BothAddons = {
  render: () => ({
    components,
    template: BOTH_ADDONS_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'Addons on both sides flanking the input — `https://…​.com` composition.' },
      source: { code: toSfc(IMPORTS, toSource(BOTH_ADDONS_MARKUP)) }
    }
  }
}

const WITH_BUTTON_MARKUP = `<InputGroup>
  ${MIDDLE_INPUT}
  <Button label="Search" kind="primary" />
</InputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputGroup>} */
export const WithButton = {
  render: () => ({
    components,
    template: WITH_BUTTON_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          '`<Button>` as a direct child on the right. The Button keeps its own API (`label`, `kind`, `size`, `@click`) — the group only joins the border/seam.'
      },
      source: { code: toSfc(IMPORTS, WITH_BUTTON_MARKUP) }
    }
  }
}

const WITH_SELECT_RENDER = `<InputGroup>
  <Select v-model="currency" placeholder="BRL">
    <SelectTrigger />
    <SelectContent>
      <SelectOption value="BRL">BRL</SelectOption>
      <SelectOption value="USD">USD</SelectOption>
      <SelectOption value="EUR">EUR</SelectOption>
    </SelectContent>
  </Select>
  ${MIDDLE_INPUT.replace('placeholder="domain"', 'placeholder="0.00"')}
</InputGroup>`

const WITH_SELECT_SOURCE = `<InputGroup>
  <Select v-model="currency" placeholder="BRL">
    <Select.Trigger />
    <Select.Content>
      <Select.Option value="BRL">BRL</Select.Option>
      <Select.Option value="USD">USD</Select.Option>
      <Select.Option value="EUR">EUR</Select.Option>
    </Select.Content>
  </Select>
  ${MIDDLE_INPUT.replace('placeholder="domain"', 'placeholder="0.00"')}
</InputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputGroup>} */
export const WithSelect = {
  render: () => ({
    components,
    setup() {
      const currency = ref('BRL')
      return { currency }
    },
    template: WITH_SELECT_RENDER
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          '`<Select>` as a direct child on the left. The Select composition (`Trigger` + `Content` + `Option`) is unchanged — the group only joins the border/seam.'
      },
      source: { code: toSfc(IMPORTS, WITH_SELECT_SOURCE) }
    }
  }
}

const WITH_ALL_MARKUP = `<InputGroup>
  <InputGroupAddon>R$</InputGroupAddon>
  ${MIDDLE_INPUT.replace('placeholder="domain"', 'placeholder="0.00"')}
  <Button label="Send" kind="primary" />
</InputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputGroup>} */
export const WithAll = {
  render: () => ({
    components,
    template: WITH_ALL_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Addon + input + Button in a single row. Seams are drawn between adjacent children; only the outer edges are rounded.'
      },
      source: { code: toSfc(IMPORTS, toSource(WITH_ALL_MARKUP)) }
    }
  }
}

const INVALID_MARKUP = `<InputGroup :invalid="true">
  <InputGroupAddon>https://</InputGroupAddon>
  ${MIDDLE_INPUT}
  <InputGroupAddon>.com</InputGroupAddon>
</InputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputGroup>} */
export const Invalid = {
  render: () => ({
    components,
    template: INVALID_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'Invalid state — root shows the danger border.' },
      source: { code: toSfc(IMPORTS, toSource(INVALID_MARKUP)) }
    }
  }
}

const REQUIRED_MARKUP = `<InputGroup :required="true">
  <InputGroupAddon>https://</InputGroupAddon>
  ${MIDDLE_INPUT}
  <InputGroupAddon>.com</InputGroupAddon>
</InputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputGroup>} */
export const Required = {
  render: () => ({
    components,
    template: REQUIRED_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'Required state — root shows the warning border.' },
      source: { code: toSfc(IMPORTS, toSource(REQUIRED_MARKUP)) }
    }
  }
}

const DISABLED_MARKUP = `<InputGroup :disabled="true">
  <InputGroupAddon>https://</InputGroupAddon>
  ${MIDDLE_INPUT}
  <InputGroupAddon>.com</InputGroupAddon>
</InputGroup>`

/** @type {import('@storybook/vue3').StoryObj<typeof InputGroup>} */
export const Disabled = {
  render: () => ({
    components,
    template: DISABLED_MARKUP
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Disabled state — muted fill, not-allowed cursor, focus-within ring suppressed. Note: the consumer must also set `disabled` on their middle `<input>` and on each child control; InputGroup does not propagate it.'
      },
      source: { code: toSfc(IMPORTS, toSource(DISABLED_MARKUP)) }
    }
  }
}
