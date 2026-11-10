import BarList from '@aziontech/webkit/bar-list'
import { ref } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import BarList from '@aziontech/webkit/bar-list'"

const PATHS = [
  { name: '/home', value: 843 },
  { name: '/documentation', value: 384 },
  { name: '/blocks', value: 108 },
  { name: '/imprint', value: 46 },
  { name: '/cancellation', value: 3 }
]

const LINKED_PATHS = PATHS.map((item) => ({
  ...item,
  href: `#/analytics?path=${item.name}`
}))

const ITEMS_SCRIPT = `const items = [
  { name: '/home', value: 843 },
  { name: '/documentation', value: 384 },
  { name: '/blocks', value: 108 },
  { name: '/imprint', value: 46 },
  { name: '/cancellation', value: 3 }
]`

const meta = {
  title: 'Components/Primitives/Chart/BarList',
  component: BarList,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A ranked list of named values: each row is a tinted bar whose length is the value against the largest one, with the name inside the bar and the formatted value in a right-aligned column. It reads as a list, not a chart, so it suits top-N breakdowns inside a card.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    items: {
      control: 'object',
      description: 'Rows to rank. An item with href renders as a link.',
      table: {
        category: 'props',
        type: { summary: '{ id?: string; name: string; value: number; href?: string }[]' },
        defaultValue: { summary: '[]' }
      }
    },
    sort: {
      control: 'select',
      options: ['descending', 'ascending', 'none'],
      description: 'Row order; none keeps the order of items.',
      table: {
        category: 'props',
        type: { summary: "'descending' | 'ascending' | 'none'" },
        defaultValue: { summary: "'descending'" }
      }
    },
    color: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6, 'other', 'success', 'warning', 'danger', 'info'],
      description:
        'Hue of the bars: a categorical slot (1 to 6), other, or a status. The fill is that hue tinted over the surface.',
      table: {
        category: 'props',
        type: { summary: 'ChartColor' },
        defaultValue: { summary: '1' }
      }
    },
    clickable: {
      control: 'boolean',
      description: 'Renders rows without an href as buttons that emit item-click.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    formatValue: {
      control: false,
      description: 'Formats the value column.',
      table: {
        category: 'props',
        type: { summary: '(value: number) => string' },
        defaultValue: { summary: 'formatCompact' }
      }
    },
    loading: {
      control: 'boolean',
      description: 'Renders Skeleton rows in place of the list.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    emptyTitle: {
      control: 'text',
      description: 'Title of the empty state shown when items is empty.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'No data available'" }
      }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name of the list.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    onItemClick: {
      action: 'item-click',
      description: 'A row activated: a clickable row, or a link row (the link still navigates).',
      table: { category: 'events', type: { summary: '(event: MouseEvent, item: BarListItem)' } }
    }
  },
  args: {
    items: PATHS,
    sort: 'descending',
    color: 1,
    clickable: false,
    loading: false,
    emptyTitle: 'No data available',
    ariaLabel: 'Top paths'
  }
}

export default meta

const Template = (args) => ({
  components: { BarList },
  setup: () => ({ args }),
  template: '<div class="w-full max-w-(--container-md)"><BarList v-bind="args" /></div>'
})

const DEFAULT_MARKUP = `<div class="w-full max-w-(--container-md)">
  <BarList aria-label="Top paths" :items="items" />
</div>`

export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Five paths ranked by requests. Each bar runs against the largest value, so /home fills the row.'
      },
      source: { code: toSfc([IMPORT, '', ITEMS_SCRIPT], DEFAULT_MARKUP) }
    }
  }
}

const INTERACTIVE_TEMPLATE = `<div class="grid w-full grid-cols-1 gap-(--spacing-xl) md:grid-cols-2">
  <BarList aria-label="Top paths, linked" :items="linkedItems" />
  <div class="flex flex-col gap-(--spacing-sm)">
    <BarList aria-label="Top paths" :items="items" clickable @item-click="onItemClick" />
    <p class="text-body-sm text-(--text-muted)">Selected: {{ selected }}</p>
  </div>
</div>`

export const Interactive = {
  render: (args) => ({
    components: { BarList },
    setup: () => {
      const selected = ref('none')
      const onItemClick = (event, item) => {
        selected.value = item.name
        args.onItemClick?.(event, item)
      }
      return { items: PATHS, linkedItems: LINKED_PATHS, selected, onItemClick }
    },
    template: INTERACTIVE_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Left: items carry an href, so each row is a link to that path filtered in analytics. Right: clickable renders rows as buttons that emit item-click with the event and the item.'
      },
      source: {
        code: toSfc(
          [
            IMPORT,
            "import { ref } from 'vue'",
            '',
            ITEMS_SCRIPT,
            '',
            'const linkedItems = items.map((item) => ({',
            '  ...item,',
            '  href: `#/analytics?path=${item.name}`',
            '}))',
            '',
            "const selected = ref('none')",
            '',
            'const onItemClick = (event, item) => {',
            '  selected.value = item.name',
            '}'
          ],
          INTERACTIVE_TEMPLATE
        )
      }
    }
  }
}

const LOADING_MARKUP = `<div class="w-full max-w-(--container-md)">
  <BarList aria-label="Top paths" loading />
</div>`

export const Loading = {
  render: Template,
  args: { loading: true },
  parameters: {
    docs: {
      description: { story: 'Skeleton rows of falling length hold the place of the list.' },
      source: { code: toSfc(IMPORT, LOADING_MARKUP) }
    }
  }
}

const EMPTY_MARKUP = `<div class="w-full max-w-(--container-md)">
  <BarList aria-label="Top paths" :items="[]" />
</div>`

export const Empty = {
  render: Template,
  args: { items: [] },
  parameters: {
    docs: {
      description: { story: 'No items for the range: the list shows an EmptyState instead.' },
      source: { code: toSfc(IMPORT, EMPTY_MARKUP) }
    }
  }
}
