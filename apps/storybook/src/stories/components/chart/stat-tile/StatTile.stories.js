import Button from '@aziontech/webkit/button'
import StatTile from '@aziontech/webkit/stat-tile'
import { ref } from 'vue'

import { toSfc } from '../../../_shared/story-source'
import { BLOCKED_TREND } from '../_waf-data'

const IMPORT = "import StatTile from '@aziontech/webkit/stat-tile'"

const meta = {
  title: 'Components/Chart/StatTile',
  component: StatTile,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A KPI tile: a label, one figure that counts up into place, a delta against a named period, and a sparkline. The delta reads good or bad for the metric, not merely up or down; inverse flips it for metrics where a rise is bad.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Metric name, in sentence case.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    value: {
      control: 'number',
      description:
        'The current value. It counts up from the previous value on change; null renders a dash.',
      table: {
        category: 'props',
        type: { summary: 'number | null' },
        defaultValue: { summary: 'null' }
      }
    },
    formatValue: {
      control: false,
      description: 'Formats the figure.',
      table: { category: 'props', type: { summary: '(value: number) => string' } }
    },
    delta: {
      control: 'number',
      description: 'Signed change against the named period, in percent. Null hides the delta.',
      table: {
        category: 'props',
        type: { summary: 'number | null' },
        defaultValue: { summary: 'null' }
      }
    },
    deltaLabel: {
      control: 'text',
      description: 'The comparison period, read after the delta.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    inverse: {
      control: 'boolean',
      description: 'A rise is bad for this metric; flips the delta between success and danger.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    trend: {
      control: 'object',
      description: 'Sparkline values, oldest first. Empty hides the sparkline.',
      table: { category: 'props', type: { summary: 'number[]' }, defaultValue: { summary: '[]' } }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Scale of the figure.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    loading: {
      control: 'boolean',
      description: 'Renders Skeleton lines in place of the figure, delta and sparkline.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    aside: {
      control: false,
      description: 'Trailing content beside the label.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    }
  },
  args: {
    label: 'Blocked threats',
    value: 48210,
    delta: 12.4,
    deltaLabel: 'vs previous 24 hours',
    inverse: true,
    trend: BLOCKED_TREND,
    size: 'medium',
    loading: false
  }
}

export default meta

const Template = (args) => ({
  components: { StatTile },
  setup: () => ({ args }),
  template: '<div class="max-w-(--container-xs)"><StatTile v-bind="args" /></div>'
})

const TREND = JSON.stringify(BLOCKED_TREND)

const DEFAULT_MARKUP = `<StatTile
  label="Blocked threats"
  :value="48210"
  :delta="12.4"
  delta-label="vs previous 24 hours"
  inverse
  :trend="${TREND}"
/>`

export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Blocked threats rose 12.4 percent. A rise in threats is bad, so the tile sets inverse and the delta reads as a regression.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const DELTAS_TEMPLATE = `<div class="grid grid-cols-1 gap-(--spacing-md) md:grid-cols-2 lg:grid-cols-4">
  <StatTile label="Requests" :value="3400000" :delta="8.2" delta-label="vs previous 24 hours" />
  <StatTile label="Blocked threats" :value="48210" :delta="12.4" delta-label="vs previous 24 hours" inverse />
  <StatTile label="Cache hit ratio" :value="96.2" :delta="0" delta-label="vs previous 24 hours" />
  <StatTile label="Edge locations" :value="120" />
</div>`

export const Deltas = {
  render: () => ({ components: { StatTile }, template: DELTAS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'A good rise, a bad rise with inverse, a flat change, and no delta at all.'
      },
      source: { code: toSfc(IMPORT, DELTAS_TEMPLATE) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="grid grid-cols-1 gap-(--spacing-md) md:grid-cols-3">
  <StatTile label="Blocked threats" :value="48210" size="small" />
  <StatTile label="Blocked threats" :value="48210" size="medium" />
  <StatTile label="Blocked threats" :value="48210" size="large" />
</div>`

export const Sizes = {
  render: () => ({ components: { StatTile }, template: SIZES_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'The figure on the small, medium and large big-number scale.' },
      source: { code: toSfc(IMPORT, SIZES_TEMPLATE) }
    }
  }
}

const COUNT_UP_TEMPLATE = `<div class="flex max-w-(--container-xs) flex-col gap-(--spacing-sm)">
  <StatTile label="Blocked threats" :value="value" />
  <Button kind="secondary" size="medium" label="Refresh" @click="value += 4210" />
</div>`

export const CountUp = {
  render: () => ({
    components: { StatTile, Button },
    setup: () => ({ value: ref(48210) }),
    template: COUNT_UP_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    visual: false,
    docs: {
      description: {
        story:
          'Press Refresh to count the figure up from its previous value. Timer driven, so it is excluded from visual regression; Default is its static sibling. Reduced motion renders the final value at once.'
      },
      source: {
        code: toSfc(
          [
            IMPORT,
            "import Button from '@aziontech/webkit/button'",
            "import { ref } from 'vue'",
            '',
            'const value = ref(48210)'
          ],
          COUNT_UP_TEMPLATE
        )
      }
    }
  }
}

export const Loading = {
  render: Template,
  args: { loading: true },
  parameters: {
    docs: {
      description: { story: 'Skeleton lines hold the place of the figure and the delta.' },
      source: { code: toSfc(IMPORT, '<StatTile label="Blocked threats" loading />') }
    }
  }
}
