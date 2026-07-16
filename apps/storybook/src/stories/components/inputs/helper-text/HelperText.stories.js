import HelperText from '@aziontech/webkit/helper-text'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import HelperText from '@aziontech/webkit/helper-text'"

/** @type {import('@storybook/vue3').Meta<typeof HelperText>} */
const meta = {
  title: 'Components/Inputs/HelperText',
  component: HelperText,
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
          'Auxiliary text rendered below a form input to communicate guidance (`helper`), validation errors (`invalid`), required-field reminders (`required`), or a locked/disabled state (`disabled`). Each variant changes only color (and, for `disabled`, prepends a lock icon) so the visual weight stays consistent with the field above it.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Fallback text when the default slot is empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    kind: {
      control: 'select',
      options: ['helper', 'invalid', 'required', 'disabled'],
      description: 'Visual variant; `disabled` also prepends a `pi pi-lock` icon.',
      table: {
        category: 'props',
        type: { summary: "'helper' | 'invalid' | 'required' | 'disabled'" },
        defaultValue: { summary: "'helper'" }
      }
    },
    default: {
      control: false,
      description: 'Helper text content; falls back to the `label` prop when empty.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    }
  },
  args: {
    label: 'Helper Text',
    kind: 'helper'
  }
}

export default meta

const Template = (args) => ({
  components: { HelperText },
  setup() {
    return { args }
  },
  template: '<HelperText v-bind="args" />'
})

const DEFAULT_MARKUP = '<HelperText kind="helper" label="Helper Text" />'

/** @type {import('@storybook/vue3').StoryObj<typeof HelperText>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Default helper variant with muted text color.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const TYPES_TEMPLATE = `<div class="flex flex-col gap-2">
  <HelperText kind="helper" label="Helper Text" />
  <HelperText kind="invalid" label="Text Error" />
  <HelperText kind="required" label="Text Error" />
  <HelperText kind="disabled" label="Helper Text" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof HelperText>} */
export const Types = {
  render: () => ({ components: { HelperText }, template: TYPES_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All kind variants side by side.' },
      source: { code: toSfc(IMPORT, TYPES_TEMPLATE) }
    }
  }
}
