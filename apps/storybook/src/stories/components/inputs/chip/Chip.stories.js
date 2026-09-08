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
          'A compact, pill-shaped token that labels a user-applied value, such as a filter on a data view. `kind` covers the three jobs a chip does in a filter surface: `filled` is a value that IS applied, `outlined` one the user COULD apply, and `dashed` the control that adds one. When `removable` is set, it renders a trailing button that emits `remove` — immediately, without hiding itself, so presence stays the consumer\'s call; when `clickable` is set, the chip body becomes interactive and emits `click`.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    kind: {
      control: 'inline-radio',
      options: ['filled', 'outlined', 'dashed'],
      description:
        'Visual variant. Filled is an applied value, outlined an available one, dashed the control that adds one.',
      table: {
        category: 'props',
        type: { summary: "'filled' | 'outlined' | 'dashed'" },
        defaultValue: { summary: 'filled' }
      }
    },
    label: {
      control: 'text',
      description: 'Fallback text when the default slot is empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium'],
      description: 'Size token; medium is a fixed 32px, small a fixed 24px.',
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
  args: { label: 'Label', kind: 'filled', size: 'medium', removable: false, clickable: false }
}

export default meta

const Template = (args) => ({
  components: { Chip },
  setup() {
    return { props: args }
  },
  template: '<Chip v-bind="props" />'
})

const DEFAULT_MARKUP = '<Chip label="Label" kind="filled" size="medium" />'

export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'The baseline Chip rendering its `label`.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const TYPES_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
  <Chip label="Production" kind="filled" size="medium" removable />
  <Chip label="Status" kind="outlined" size="medium" clickable />
  <Chip label="Add filter" kind="dashed" size="medium" clickable />
</div>`

export const Types = {
  render: () => ({
    components: { Chip },
    template: TYPES_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The three kinds in the order they read in a filter surface: an applied value, an available one, and the control that adds one.'
      },
      source: { code: toSfc(IMPORT, TYPES_TEMPLATE) }
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

const REMOVABLE_MARKUP = '<Chip label="Label" kind="filled" size="medium" removable />'

export const Removable = {
  args: { removable: true },
  render: Template,
  argTypes: { onRemove: { action: 'remove' } },
  parameters: {
    docs: {
      description: {
        story:
          'Removable chip; the × button emits `remove` immediately. The chip does not hide itself — the consumer decides whether it disappears, stays, or becomes an `outlined` offer.'
      },
      source: { code: toSfc(IMPORT, REMOVABLE_MARKUP) }
    }
  }
}

const CLICKABLE_MARKUP = '<Chip label="Label" kind="filled" size="medium" clickable />'

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
