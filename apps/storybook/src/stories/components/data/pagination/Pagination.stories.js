import Pagination from '@aziontech/webkit/pagination'
import { ref, watch } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Pagination from '@aziontech/webkit/pagination'"

// Compound sub-components registered under their dot-notation names so they
// resolve in Storybook's runtime-compiled string templates: Vue compiles
// `<Pagination.Button>` to `resolveComponent("Pagination.Button")`, an exact-name
// lookup (a bare `Pagination` registration does not satisfy it). In a real SFC
// the dotted tag resolves off the imported `Pagination` binding, so consumer
// code needs only `import Pagination` — these extra registrations are a
// Storybook runtime concern.
const components = {
  Pagination,
  'Pagination.Button': Pagination.Button,
  'Pagination.Info': Pagination.Info,
  'Pagination.PageSize': Pagination.PageSize
}

/** @type {import('@storybook/vue3').Meta<typeof Pagination>} */
const meta = {
  title: 'Components/Primitives/Data/Pagination',
  component: Pagination,
  subcomponents: {
    PaginationButton: Pagination.Button,
    PaginationInfo: Pagination.Info,
    PaginationPageSize: Pagination.PageSize
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
          'Pagination controls in two modes: composition — a three-region landmark (page-info text, navigation buttons, rows-per-page selector) wired by hand through slots — and data-driven, where `total` makes the Pagination render its own windowed controls and emit `update:page` / `update:pageSize`.'
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
        'Total item count. When set, the Pagination runs in data-driven mode and renders its own controls.',
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
    info: {
      control: false,
      description:
        'Left region: page-info text (typically `Pagination.Info`). In data-driven mode, overrides the default "Showing X to Y of Z entries" text.',
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
        'Right region: rows-per-page selector (e.g. `Pagination.PageSize`). In data-driven mode, overrides the internally-rendered selector.',
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

const DEFAULT_TEMPLATE = `<Pagination>
  <template #info>
    <Pagination.Info>Showing 1 to 10 of 20 entries</Pagination.Info>
  </template>

  <Pagination.Button kind="previous" aria-label="Previous page" disabled />
  <Pagination.Button kind="number" selected>1</Pagination.Button>
  <Pagination.Button kind="number">2</Pagination.Button>
  <Pagination.Button kind="number">3</Pagination.Button>
  <Pagination.Button kind="more" />
  <Pagination.Button kind="next" aria-label="Next page" />

  <template #controls>
    <Pagination.PageSize :model-value="10" :options="[10, 25, 50, 100]" />
  </template>
</Pagination>`

/** @type {import('@storybook/vue3').StoryObj<typeof Pagination>} */
export const Default = {
  render: (args) => ({
    components,
    setup() {
      return { args }
    },
    // Renders the exact "Show code" markup, with args forwarded on the root so
    // Controls (e.g. ariaLabel) still drive the canvas — zero drift.
    template: DEFAULT_TEMPLATE.replace('<Pagination>', '<Pagination v-bind="args">')
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The compound composition form: the full pagination assembled by hand from the dot-notation sub-components — page-info text (`Pagination.Info`), Previous / numbers / overflow / Next (`Pagination.Button`), and a rows-per-page selector (`Pagination.PageSize`).'
      },
      source: { code: toSfc(IMPORT, DEFAULT_TEMPLATE) }
    }
  }
}

const BUTTONS_TEMPLATE = `<div class="flex flex-col gap-(--spacing-md)">
  <Pagination aria-label="Pagination kinds">
    <Pagination.Button kind="previous" aria-label="Previous page" />
    <Pagination.Button kind="number">1</Pagination.Button>
    <Pagination.Button kind="number" selected>2</Pagination.Button>
    <Pagination.Button kind="more" />
    <Pagination.Button kind="next" aria-label="Next page" />
  </Pagination>
  <Pagination aria-label="Pagination disabled states">
    <Pagination.Button kind="previous" aria-label="Previous page" disabled />
    <Pagination.Button kind="number" disabled>1</Pagination.Button>
    <Pagination.Button kind="next" aria-label="Next page" disabled />
  </Pagination>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof Pagination>} */
export const Buttons = {
  render: () => ({ components, template: BUTTONS_TEMPLATE }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          '`Pagination.Button` kinds (previous / next / number / more) and states: default, selected (current page), and disabled. The buttons are butted into one segmented strip — the frame, border and end radii come from the `Pagination` root, so a consumer composes the buttons and nothing else.'
      },
      source: { code: toSfc(IMPORT, BUTTONS_TEMPLATE) }
    }
  }
}

const DATA_DRIVEN_MARKUP = `<Pagination
  v-model:page="page"
  v-model:page-size="pageSize"
  :total="200"
  :page-size-options="[10, 25, 50, 100]"
  :sibling-count="1"
/>`

const DATA_DRIVEN_SCRIPT = [
  IMPORT,
  "import { ref } from 'vue'",
  '',
  'const page = ref(1)',
  'const pageSize = ref(10)'
]

/** @type {import('@storybook/vue3').StoryObj<typeof Pagination>} */
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
    // handlers, so update:page / update:pageSize log in the Actions panel
    // while the local refs keep the canvas interactive.
    template: `
      <Pagination
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
          'Data-driven mode: pass `total` and bind `v-model:page` / `v-model:page-size`. The Pagination renders its own info text, windowed page numbers, overflow ellipsis, and the rows-per-page selector, emitting `update:page` / `update:pageSize`.'
      },
      source: { code: toSfc(DATA_DRIVEN_SCRIPT, DATA_DRIVEN_MARKUP) }
    }
  }
}
