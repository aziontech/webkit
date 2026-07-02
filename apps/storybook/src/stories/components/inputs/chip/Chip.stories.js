import Chip from '@aziontech/webkit/chip'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Chip from '@aziontech/webkit/chip'"

const meta = {
  title: 'Components/Inputs/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A compact, dismissible token that labels a user-applied value, such as a removable filter on a data view. When `removable` is set, it renders a trailing button that emits the `remove` event; when `clickable` is set, the chip body becomes interactive and emits the `click` event.'
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
    size: {
      control: 'inline-radio',
      options: ['small', 'medium'],
      description: 'Size token; medium is 24px tall, small is 20px.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium'" },
        defaultValue: { summary: 'medium' }
      }
    },
    removable: {
      control: 'boolean',
      description: 'When true, renders a trailing remove button that emits remove.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    clickable: {
      control: 'boolean',
      description:
        'When true, the chip body becomes interactive (role=button, focusable) and emits click on activation (click / Enter / Space).',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    }
  },
  args: { label: 'Label', size: 'medium', removable: false, clickable: false }
}

export default meta

const Template = (args) => ({
  components: { Chip },
  setup() {
    return { props: args }
  },
  template: '<Chip v-bind="props" />'
})

const DEFAULT_MARKUP = '<Chip label="Label" size="medium" />'

export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'The baseline Chip rendering its `label`.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
  <Chip label="Small" size="small" />
  <Chip label="Medium" size="medium" />
</div>`

export const Sizes = {
  render: () => ({
    components: { Chip },
    template: SIZES_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'Both sizes side by side.' },
      source: { code: toSfc(IMPORT, SIZES_TEMPLATE) }
    }
  }
}

const REMOVABLE_MARKUP = '<Chip label="Label" size="medium" removable />'

export const Removable = {
  args: { removable: true },
  render: Template,
  argTypes: { onRemove: { action: 'remove' } },
  parameters: {
    docs: {
      description: { story: 'Removable chip; the × button emits `remove`.' },
      source: { code: toSfc(IMPORT, REMOVABLE_MARKUP) }
    }
  }
}

const CLICKABLE_MARKUP = '<Chip label="Label" size="medium" clickable />'

export const Clickable = {
  args: { clickable: true },
  render: Template,
  argTypes: { onClick: { action: 'click' } },
  parameters: {
    docs: {
      description: {
        story:
          'Clickable chip; the interactive body emits `click` on pointer or keyboard (Enter / Space).'
      },
      source: { code: toSfc(IMPORT, CLICKABLE_MARKUP) }
    }
  }
}
