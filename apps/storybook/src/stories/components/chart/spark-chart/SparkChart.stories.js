import SparkChart from '@aziontech/webkit/spark-chart'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import SparkChart from '@aziontech/webkit/spark-chart'"

const REQUESTS = [310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]

const meta = {
  title: 'Components/Primitives/Chart/SparkChart',
  component: SparkChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A word-sized chart: one series drawn as an area, a line or bars, with no axes, grid, legend or tooltip, filling the width of its container at a fixed height. It shows the shape of a recent history next to a number, in a stat tile, a table row or a ticker card, where a full chart would be too much.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    values: {
      control: 'object',
      description: 'The series, oldest first; null leaves a gap.',
      table: {
        category: 'props',
        type: { summary: '(number | null)[]' },
        defaultValue: { summary: '[]' }
      }
    },
    kind: {
      control: 'select',
      options: ['area', 'line', 'bar'],
      description: 'Mark drawn for the series.',
      table: {
        category: 'props',
        type: { summary: "'area' | 'line' | 'bar'" },
        defaultValue: { summary: "'area'" }
      }
    },
    color: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6, 'other', 'success', 'warning', 'danger', 'info'],
      description: 'Hue of the mark: a categorical slot (1–6), other, or a status.',
      table: {
        category: 'props',
        type: {
          summary: "1 | 2 | 3 | 4 | 5 | 6 | 'other' | 'success' | 'warning' | 'danger' | 'info'"
        },
        defaultValue: { summary: '1' }
      }
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Height: 32, 48 or 64 pixels. Width follows the container.',
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    fromZero: {
      control: 'boolean',
      description:
        'Starts the value range at zero instead of the lowest value; bars always start at zero.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name; when set the chart is an image, when empty it is decorative.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    }
  },
  args: {
    values: REQUESTS,
    kind: 'area',
    color: 1,
    size: 'medium',
    fromZero: false,
    ariaLabel: ''
  }
}

export default meta

const Template = (args) => ({
  components: { SparkChart },
  setup: () => ({ args }),
  template: '<div class="w-full max-w-(--container-3xs)"><SparkChart v-bind="args" /></div>'
})

const SERIES = JSON.stringify(REQUESTS)

const DEFAULT_MARKUP = `<div class="w-full max-w-(--container-3xs)">
  <SparkChart :values="${SERIES}" />
</div>`

export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'An area spark of twelve points. It fills the width of its container, so the frame sets the width.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const TYPES_TEMPLATE = `<div class="flex flex-wrap gap-(--spacing-lg)">
  <div class="w-full max-w-(--container-3xs)">
    <SparkChart kind="area" :values="${SERIES}" />
  </div>
  <div class="w-full max-w-(--container-3xs)">
    <SparkChart kind="line" :values="${SERIES}" />
  </div>
  <div class="w-full max-w-(--container-3xs)">
    <SparkChart kind="bar" :values="${SERIES}" />
  </div>
</div>`

export const Types = {
  render: () => ({ components: { SparkChart }, template: TYPES_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'The same series drawn as an area, a line and bars.' },
      source: { code: toSfc(IMPORT, TYPES_TEMPLATE) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-wrap items-end gap-(--spacing-lg)">
  <div class="w-full max-w-(--container-3xs)">
    <SparkChart size="small" :values="${SERIES}" />
  </div>
  <div class="w-full max-w-(--container-3xs)">
    <SparkChart size="medium" :values="${SERIES}" />
  </div>
  <div class="w-full max-w-(--container-3xs)">
    <SparkChart size="large" :values="${SERIES}" />
  </div>
</div>`

export const Sizes = {
  render: () => ({ components: { SparkChart }, template: SIZES_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'Small, medium and large: 32, 48 and 64 pixels tall.' },
      source: { code: toSfc(IMPORT, SIZES_TEMPLATE) }
    }
  }
}

const CARDS_TEMPLATE = `<ul class="flex w-full max-w-(--container-md) flex-col rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)">
  <li class="flex items-center gap-(--spacing-md) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)">
    <div class="flex min-w-0 flex-1 flex-col">
      <span class="truncate text-label-md text-(--text-default)">Requests</span>
      <span class="truncate text-label-sm text-(--text-muted)">Edge Application</span>
    </div>
    <div class="w-24 shrink-0">
      <SparkChart size="small" color="success" :values="[310, 290, 340, 380, 360, 420, 410, 470, 450, 520, 500, 560]" />
    </div>
    <span class="w-16 shrink-0 text-end text-label-md text-(--text-default) tabular-nums">3.4M</span>
    <span class="w-14 shrink-0 text-end text-label-sm text-(--success-contrast) tabular-nums">+8.2%</span>
  </li>
  <li class="flex items-center gap-(--spacing-md) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)">
    <div class="flex min-w-0 flex-1 flex-col">
      <span class="truncate text-label-md text-(--text-default)">Blocked threats</span>
      <span class="truncate text-label-sm text-(--text-muted)">Edge Firewall</span>
    </div>
    <div class="w-24 shrink-0">
      <SparkChart size="small" color="success" :values="[640, 610, 650, 580, 560, 590, 520, 500, 470, 480, 430, 410]" />
    </div>
    <span class="w-16 shrink-0 text-end text-label-md text-(--text-default) tabular-nums">48.2K</span>
    <span class="w-14 shrink-0 text-end text-label-sm text-(--success-contrast) tabular-nums">-12.4%</span>
  </li>
  <li class="flex items-center gap-(--spacing-md) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)">
    <div class="flex min-w-0 flex-1 flex-col">
      <span class="truncate text-label-md text-(--text-default)">Cache hit ratio</span>
      <span class="truncate text-label-sm text-(--text-muted)">Edge Cache</span>
    </div>
    <div class="w-24 shrink-0">
      <SparkChart size="small" color="success" :values="[91.2, 91.8, 92.4, 92.1, 93.0, 93.6, 94.1, 93.9, 94.8, 95.3, 95.8, 96.2]" />
    </div>
    <span class="w-16 shrink-0 text-end text-label-md text-(--text-default) tabular-nums">96.2%</span>
    <span class="w-14 shrink-0 text-end text-label-sm text-(--success-contrast) tabular-nums">+1.6%</span>
  </li>
  <li class="flex items-center gap-(--spacing-md) px-(--spacing-md) py-(--spacing-sm)">
    <div class="flex min-w-0 flex-1 flex-col">
      <span class="truncate text-label-md text-(--text-default)">Origin latency</span>
      <span class="truncate text-label-sm text-(--text-muted)">p95, origin fetch</span>
    </div>
    <div class="w-24 shrink-0">
      <SparkChart size="small" color="success" :values="[182, 176, 190, 171, 168, 160, 164, 152, 149, 141, 138, 132]" />
    </div>
    <span class="w-16 shrink-0 text-end text-label-md text-(--text-default) tabular-nums">132 ms</span>
    <span class="w-14 shrink-0 text-end text-label-sm text-(--success-contrast) tabular-nums">-4.3%</span>
  </li>
</ul>`

export const Cards = {
  render: () => ({ components: { SparkChart }, template: CARDS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A list of ticker rows: the name, a small area spark, the current value and the signed change. The spark stays decorative because the value beside it carries the number; its color says whether the change is good for that metric, so falling threats and latency read as success.'
      },
      source: { code: toSfc(IMPORT, CARDS_TEMPLATE) }
    }
  }
}
