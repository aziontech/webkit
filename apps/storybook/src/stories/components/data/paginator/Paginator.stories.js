import Paginator from '@aziontech/webkit/paginator'
import { ref, watch } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Paginator from '@aziontech/webkit/paginator'"

// Compound sub-components registered under their dot-notation names so they
// resolve in Storybook's runtime-compiled string templates: Vue compiles
// `<Paginator.Button>` to `resolveComponent("Paginator.Button")`, an exact-name
// lookup (a bare `Paginator` registration does not satisfy it). In a real SFC
// the dotted tag resolves off the imported `Paginator` binding, so consumer
// code needs only `import Paginator` — these extra registrations are a
// Storybook runtime concern.
const components = {
  Paginator,
  'Paginator.Button': Paginator.Button,
  'Paginator.Info': Paginator.Info,
  'Paginator.PageSize': Paginator.PageSize
}

/** @type {import('@storybook/vue3').Meta<typeof Paginator>} */
const meta = {
  title: 'Components/Data/Paginator',
  component: Paginator,
  subcomponents: {
    PaginationButton: Paginator.Button,
    PaginatorInfo: Paginator.Info,
    PaginatorPageSize: Paginator.PageSize
  },
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
          'Pagination controls in two modes: composition — a three-region landmark (page-info text, navigation buttons, rows-per-page selector) wired by hand through slots — and data-driven, where `total` makes the Paginator render its own windowed controls and emit `update:page` / `update:pageSize` / `page-change`.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    page: {
      control: 'number',
      description: 'Current page, 1-based (data-driven mode). Supports `v-model:page`.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '1' } }
    },
    total: {
      control: 'number',
      description:
        'Total item count. When set, the Paginator runs in data-driven mode and renders its own controls.',
      table: {
        category: 'props',
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' }
      }
    },
    pageSize: {
      control: 'number',
      description: 'Rows per page (data-driven mode). Supports `v-model:page-size`.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '10' } }
    },
    pageSizeOptions: {
      control: 'object',
      description: 'Page-size options offered in the rows-per-page selector.',
      table: {
        category: 'props',
        type: { summary: 'number[]' },
        defaultValue: { summary: '[10, 25, 50, 100]' }
      }
    },
    siblingCount: {
      control: 'number',
      description:
        'Page numbers shown on each side of the current page before collapsing into an overflow ellipsis.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '1' } }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the navigation landmark.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Pagination'" }
      }
    },
    'onUpdate:page': {
      action: 'update:page',
      description: 'Current page changed (data-driven mode). Supports `v-model:page`.',
      table: { category: 'events', type: { summary: '(page: number) => void' } }
    },
    'onUpdate:pageSize': {
      action: 'update:pageSize',
      description: 'Rows-per-page changed via the internal selector. Supports `v-model:page-size`.',
      table: { category: 'events', type: { summary: '(pageSize: number) => void' } }
    },
    onPageChange: {
      action: 'page-change',
      description: 'Fired alongside `update:page` whenever the page changes.',
      table: { category: 'events', type: { summary: '(page: number) => void' } }
    },
    info: {
      control: false,
      description:
        'Left region: page-info text (typically `Paginator.Info`). In data-driven mode, overrides the default "Showing X to Y of Z entries" text.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    },
    default: {
      control: false,
      description:
        'Center region: pagination navigation buttons (composition mode only — ignored in data-driven mode, where the buttons are rendered internally).',
      table: { category: 'slots', type: { summary: 'VNode' } }
    },
    controls: {
      control: false,
      description:
        'Right region: rows-per-page selector (e.g. `Paginator.PageSize`). In data-driven mode, overrides the internally-rendered selector.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    }
  },
  args: {
    page: 1,
    pageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
    siblingCount: 1,
    ariaLabel: 'Pagination'
  }
}

export default meta

const DEFAULT_TEMPLATE = `<Paginator>
  <template #info>
    <Paginator.Info>Showing 1 to 10 of 20 entries</Paginator.Info>
  </template>

  <Paginator.Button kind="previous" disabled>Previous</Paginator.Button>
  <Paginator.Button kind="number" selected>1</Paginator.Button>
  <Paginator.Button kind="number">2</Paginator.Button>
  <Paginator.Button kind="number">3</Paginator.Button>
  <Paginator.Button kind="more" />
  <Paginator.Button kind="next">Next</Paginator.Button>

  <template #controls>
    <Paginator.PageSize :model-value="10" :options="[10, 25, 50, 100]" />
  </template>
</Paginator>`

/** @type {import('@storybook/vue3').StoryObj<typeof Paginator>} */
export const Default = {
  render: (args) => ({
    components,
    setup() {
      return { args }
    },
    // Renders the exact "Show code" markup, with args forwarded on the root so
    // Controls (e.g. ariaLabel) still drive the canvas — zero drift.
    template: DEFAULT_TEMPLATE.replace('<Paginator>', '<Paginator v-bind="args">')
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The compound composition form: the full paginator assembled by hand from the dot-notation sub-components — page-info text (`Paginator.Info`), Previous / numbers / overflow / Next (`Paginator.Button`), and a rows-per-page selector (`Paginator.PageSize`).'
      },
      source: { code: toSfc(IMPORT, DEFAULT_TEMPLATE) }
    }
  }
}

const BUTTONS_TEMPLATE = `<div class="flex flex-col gap-[var(--spacing-md)]">
  <div class="flex flex-wrap items-center gap-[var(--spacing-xs)]">
    <Paginator.Button kind="previous">Previous</Paginator.Button>
    <Paginator.Button kind="number">1</Paginator.Button>
    <Paginator.Button kind="number" selected>2</Paginator.Button>
    <Paginator.Button kind="more" />
    <Paginator.Button kind="next">Next</Paginator.Button>
  </div>
  <div class="flex flex-wrap items-center gap-[var(--spacing-xs)]">
    <Paginator.Button kind="previous" disabled>Previous</Paginator.Button>
    <Paginator.Button kind="number" disabled>1</Paginator.Button>
    <Paginator.Button kind="next" disabled>Next</Paginator.Button>
  </div>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Paginator>} */
export const Buttons = {
  render: () => ({ components, template: BUTTONS_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          '`Paginator.Button` kinds (previous / next / number / more) and states: default, selected (current page), and disabled.'
      },
      source: { code: toSfc(IMPORT, BUTTONS_TEMPLATE) }
    }
  }
}

const DATA_DRIVEN_MARKUP = `<Paginator
  v-model:page="page"
  v-model:page-size="pageSize"
  :total="200"
  :page-size-options="[10, 25, 50, 100]"
  :sibling-count="1"
  @page-change="loadPage"
/>`

const DATA_DRIVEN_SCRIPT = [
  IMPORT,
  "import { ref } from 'vue'",
  '',
  'const page = ref(1)',
  'const pageSize = ref(10)',
  "const loadPage = (nextPage) => console.log('page-change', nextPage)"
]

/** @type {import('@storybook/vue3').StoryObj<typeof Paginator>} */
export const DataDriven = {
  args: { total: 200 },
  render: (args) => ({
    components,
    setup() {
      const page = ref(args.page ?? 1)
      const pageSize = ref(args.pageSize ?? 10)
      // Local v-model state; re-synced when the Controls panel changes the
      // args (the refs are seeded once in setup).
      watch(
        () => args.page,
        (next) => (page.value = next ?? 1)
      )
      watch(
        () => args.pageSize,
        (next) => (pageSize.value = next ?? 10)
      )
      return { args, page, pageSize }
    },
    // `v-bind="args"` merges the Storybook action spies with the v-model
    // handlers, so update:page / update:pageSize / page-change all log in the
    // Actions panel while the local refs keep the canvas interactive.
    template: `
      <Paginator
        v-bind="args"
        v-model:page="page"
        v-model:page-size="pageSize"
      />
    `
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Data-driven mode: pass `total` and bind `v-model:page` / `v-model:page-size`. The Paginator renders its own info text, windowed page numbers, overflow ellipsis, and the rows-per-page selector, emitting `update:page` / `update:pageSize` / `page-change`.'
      },
      source: { code: toSfc(DATA_DRIVEN_SCRIPT, DATA_DRIVEN_MARKUP) }
    }
  }
}
