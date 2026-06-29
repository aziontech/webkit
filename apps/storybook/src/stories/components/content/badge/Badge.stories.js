import Badge from '@aziontech/webkit/badge'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Badge from '@aziontech/webkit/badge'"

const meta = {
  title: 'Components/Content/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Compact, non-interactive indicator that surfaces a numeric count or short status value with severity-based color coding. Commonly overlaid on icons, avatars, or buttons.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'Fallback text when the default slot is empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    severity: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'default'],
      description: 'Color style for the badge surface and label.',
      table: {
        category: 'props',
        type: { summary: "'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default'" },
        defaultValue: { summary: 'primary' }
      }
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
      description: 'Size token; small is 20px tall, medium is 24px, large is 30px.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: 'medium' }
      }
    }
  },
  args: {
    value: '99',
    severity: 'primary',
    size: 'medium'
  }
}

export default meta

const Template = (args) => ({
  components: { Badge },
  setup() {
    return { props: args }
  },
  template: '<Badge v-bind="props" />'
})

const DEFAULT_MARKUP = '<Badge value="99" severity="primary" size="medium" />'

export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'A single badge driven by the controls.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const TYPES_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
  <Badge value="99" severity="primary" />
  <Badge value="99" severity="secondary" />
  <Badge value="99" severity="success" />
  <Badge value="99" severity="warning" />
  <Badge value="99" severity="danger" />
  <Badge value="99" severity="default" />
</div>`

export const Types = {
  render: () => ({
    components: { Badge },
    template: TYPES_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All severities side by side.' },
      source: { code: toSfc(IMPORT, TYPES_TEMPLATE) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-wrap items-center gap-4">
  <Badge value="99" size="small" />
  <Badge value="99" size="medium" />
  <Badge value="99" size="large" />
</div>`

export const Sizes = {
  render: () => ({
    components: { Badge },
    template: SIZES_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: { story: 'All sizes side by side.' },
      source: { code: toSfc(IMPORT, SIZES_TEMPLATE) }
    }
  }
}
