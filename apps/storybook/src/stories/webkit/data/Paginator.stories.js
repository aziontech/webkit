import PaginationButton from '@aziontech/webkit/data/pagination-button'
import Paginator from '@aziontech/webkit/data/paginator'
import PaginatorInfo from '@aziontech/webkit/data/paginator-info'
import PaginatorPageSize from '@aziontech/webkit/data/paginator-page-size'
import { ref, watch } from 'vue'

const paginatorComponents = {
  Paginator,
  PaginationButton,
  PaginatorInfo,
  PaginatorPageSize
}

const usage = [
  '```vue',
  '<Paginator>',
  '  <template #info>',
  '    <PaginatorInfo>Showing 1 to 10 of 20 entries</PaginatorInfo>',
  '  </template>',
  '  <PaginationButton kind="previous" disabled>Previous</PaginationButton>',
  '  <PaginationButton kind="number" selected>1</PaginationButton>',
  '  <PaginationButton kind="number">2</PaginationButton>',
  '  <PaginationButton kind="more" />',
  '  <PaginationButton kind="next">Next</PaginationButton>',
  '  <template #controls>',
  '    <PaginatorPageSize :model-value="10" :options="[10, 25, 50, 100]" />',
  '  </template>',
  '</Paginator>',
  '```'
].join('\n')

/** @type {import('@storybook/vue3').Meta<typeof Paginator>} */
const meta = {
  title: 'Webkit/Data/Paginator',
  component: Paginator,
  subcomponents: { PaginationButton, PaginatorInfo },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
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
          'Pagination controls — a three-region landmark (page-info text, navigation buttons, rows-per-page selector). No data engine; wire current page and page-size through your own state.\n\n' +
          usage
      }
    }
  },
  argTypes: {
    page: {
      control: { type: 'number' },
      description: 'Current page, 1-based (data-driven mode). Supports v-model:page.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
        category: 'props'
      }
    },
    total: {
      control: { type: 'number' },
      description:
        'Total item count. When set, the Paginator runs in data-driven mode and renders its own controls.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
        category: 'props'
      }
    },
    pageSize: {
      control: { type: 'number' },
      description: 'Rows per page (data-driven mode). Supports v-model:page-size.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '10' },
        category: 'props'
      }
    },
    pageSizeOptions: {
      control: 'object',
      description: 'Page-size options offered in the rows-per-page selector.',
      table: {
        type: { summary: 'number[]' },
        defaultValue: { summary: '[10, 25, 50, 100]' },
        category: 'props'
      }
    },
    siblingCount: {
      control: { type: 'number' },
      description:
        'Page numbers shown on each side of the current page before collapsing into an overflow ellipsis.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
        category: 'props'
      }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the navigation landmark.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Pagination'" },
        category: 'props'
      }
    },
    'onUpdate:page': {
      action: 'update:page',
      description: 'Current page changed (data-driven mode). Supports v-model:page.',
      table: { type: { summary: '(page: number) => void' }, category: 'events' }
    },
    'onUpdate:pageSize': {
      action: 'update:pageSize',
      description: 'Rows-per-page changed via the internal selector. Supports v-model:page-size.',
      table: { type: { summary: '(pageSize: number) => void' }, category: 'events' }
    },
    'onPage-change': {
      action: 'page-change',
      description: 'Fired alongside update:page whenever the page changes.',
      table: { type: { summary: '(page: number) => void' }, category: 'events' }
    },
    info: {
      control: false,
      description: 'Left region: page-info text (typically PaginatorInfo).',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    },
    default: {
      control: false,
      description: 'Center region: pagination navigation buttons.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    },
    controls: {
      control: false,
      description: 'Right region: rows-per-page selector (e.g. Dropdown).',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    }
  },
  args: {
    ariaLabel: 'Pagination'
  }
}

export default meta

/** @type {import('@storybook/vue3').StoryObj<typeof Paginator>} */
export const Default = {
  render: (args) => ({
    components: paginatorComponents,
    setup() {
      return { args }
    },
    template: `
      <Paginator v-bind="args">
        <template #info>
          <PaginatorInfo>Showing 1 to 10 of 20 entries</PaginatorInfo>
        </template>
        <PaginationButton kind="previous" disabled>Previous</PaginationButton>
        <PaginationButton kind="number" selected>1</PaginationButton>
        <PaginationButton kind="number">2</PaginationButton>
        <PaginationButton kind="number">3</PaginationButton>
        <PaginationButton kind="more" />
        <PaginationButton kind="next">Next</PaginationButton>
        <template #controls>
          <PaginatorPageSize :model-value="10" :options="[10, 25, 50, 100]" />
        </template>
      </Paginator>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Full paginator: page-info text, Previous/numbers/overflow/Next, and a rows-per-page selector.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Paginator>} */
export const Buttons = {
  render: () => ({
    components: paginatorComponents,
    template: `
      <div class="flex flex-col gap-[var(--spacing-4)]">
        <div class="flex items-center gap-[var(--spacing-2)]">
          <PaginationButton kind="previous">Previous</PaginationButton>
          <PaginationButton kind="number">1</PaginationButton>
          <PaginationButton kind="number" selected>2</PaginationButton>
          <PaginationButton kind="more" />
          <PaginationButton kind="next">Next</PaginationButton>
        </div>
        <div class="flex items-center gap-[var(--spacing-2)]">
          <PaginationButton kind="previous" disabled>Previous</PaginationButton>
          <PaginationButton kind="number" disabled>1</PaginationButton>
          <PaginationButton kind="next" disabled>Next</PaginationButton>
        </div>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'PaginationButton kinds (previous / next / number / more) and states: default, selected (current page), and disabled.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Paginator>} */
export const DataDriven = {
  render: (args) => ({
    components: { Paginator },
    setup() {
      const page = ref(args.page ?? 1)
      const pageSize = ref(args.pageSize ?? 10)
      // Keep local v-model state in sync with the Controls panel (args are
      // reactive, but the refs are seeded once in setup, so watch to re-sync).
      watch(
        () => args.page,
        (value) => (page.value = value ?? 1)
      )
      watch(
        () => args.pageSize,
        (value) => (pageSize.value = value ?? 10)
      )
      return { args, page, pageSize }
    },
    template: `
      <Paginator
        v-bind="args"
        v-model:page="page"
        v-model:page-size="pageSize"
      />
    `
  }),
  args: {
    page: 1,
    total: 200,
    pageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
    siblingCount: 1
  },
  parameters: {
    docs: {
      description: {
        story:
          'Data-driven mode: pass `total` and bind `v-model:page` / `v-model:page-size`. The Paginator renders its own info text, windowed page numbers, overflow ellipsis, and the rows-per-page selector, emitting `update:page` / `update:pageSize` / `page-change`.'
      }
    }
  }
}
