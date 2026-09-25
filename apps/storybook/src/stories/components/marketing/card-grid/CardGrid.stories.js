import CardGrid from '@aziontech/webkit/card-grid'
import CardGridCell from '@aziontech/webkit/card-grid-cell'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import CardGrid from '@aziontech/webkit/card-grid'"

const CELL_IMPORTS = [
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import CardGridCell from '@aziontech/webkit/card-grid-cell'"
]

const CELL = 'bg-(--bg-canvas) p-(--spacing-xl) text-body-md text-(--text-muted)'

/** @type {import('@storybook/vue3').Meta<typeof CardGrid>} */
const meta = {
  title: 'Components/Marketing/CardGrid',
  component: CardGrid,
  subcomponents: { CardGridCell },
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component:
          'The responsive cell grid of the page language, in three registers: spaced cards separated by real gutters, a hairline box grid whose internal rules are the gaps themselves, and a framed grid whose cells are real frame-box elements. The frame register is the one that composes: each CardGridCell draws its own rules and corner marks and carries its own fill, so the grid needs no background trick and nests flush inside a column that already owns the outer edges.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    kind: {
      control: 'inline-radio',
      options: ['gap', 'divider', 'frame'],
      description:
        'Register of the grid: gutters between self-contained cards, hairline rules drawn by the gaps, or framed cells that draw their own rules and marks.',
      table: {
        category: 'props',
        type: { summary: "'gap' | 'divider' | 'frame'" },
        defaultValue: { summary: "'gap'" }
      }
    },
    columns: {
      control: 'inline-radio',
      options: [2, 3, 4],
      description: 'How many columns the grid fans out to at the large breakpoint.',
      table: { category: 'props', type: { summary: '2 | 3 | 4' }, defaultValue: { summary: '3' } }
    },
    mobileColumns: {
      control: 'inline-radio',
      options: [1, 2],
      description: 'How many columns the grid holds below the small breakpoint.',
      table: { category: 'props', type: { summary: '1 | 2' }, defaultValue: { summary: '1' } }
    },
    dividerColor: {
      control: 'inline-radio',
      options: ['default', 'muted'],
      description: 'Weight of the hairline rules in the `divider` register.',
      table: {
        category: 'props',
        type: { summary: "'default' | 'muted'" },
        defaultValue: { summary: "'default'" }
      }
    },
    flush: {
      control: 'boolean',
      description:
        "In the frame register, the surrounding frame already draws the grid's outer rules: the grid drops its own top and left ones and lays its right and bottom ones onto the frame's, so a framed column keeps one hairline per edge.",
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    }
  },
  args: { kind: 'gap', columns: 3, mobileColumns: 1, dividerColor: 'default', flush: false }
}

export default meta

const Template = (args) => ({
  components: { CardGrid },
  setup() {
    return { args, cell: CELL }
  },
  template: `
    <CardGrid v-bind="args">
      <div :class="cell">One</div>
      <div :class="cell">Two</div>
      <div :class="cell">Three</div>
    </CardGrid>
  `
})

const DEFAULT_MARKUP = `<CardGrid :columns="3">
  <div class="${CELL}">One</div>
  <div class="${CELL}">Two</div>
  <div class="${CELL}">Three</div>
</CardGrid>`

/** @type {import('@storybook/vue3').StoryObj<typeof CardGrid>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Three cells with gutters between them — the `gap` register.' },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const KINDS_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xl)">
  <CardGrid kind="gap" :columns="3">
    <div class="${CELL}">gap</div>
    <div class="${CELL}">gap</div>
    <div class="${CELL}">gap</div>
  </CardGrid>
  <CardGrid kind="divider" :columns="3">
    <div class="${CELL}">divider</div>
    <div class="${CELL}">divider</div>
    <div class="${CELL}">divider</div>
  </CardGrid>
  <CardGrid kind="frame" :columns="3">
    <CardGridCell kind="canvas">frame</CardGridCell>
    <CardGridCell kind="canvas">frame</CardGridCell>
    <CardGridCell kind="canvas">frame</CardGridCell>
  </CardGrid>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof CardGrid>} */
export const Kinds = {
  render: () => ({ components: { CardGrid, CardGridCell }, template: KINDS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The same layout drawn three ways. In `divider` the seams are the grid’s own 1px gaps, so every cell must fill its own background; in `frame` each cell is a real frame box that draws its own rules and corner marks.'
      },
      source: { code: toSfc(CELL_IMPORTS, KINDS_TEMPLATE) }
    }
  }
}

const COLUMNS_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xl)">
  <CardGrid kind="divider" :columns="2">
    <div class="${CELL}">1</div><div class="${CELL}">2</div>
  </CardGrid>
  <CardGrid kind="divider" :columns="4">
    <div class="${CELL}">1</div><div class="${CELL}">2</div><div class="${CELL}">3</div><div class="${CELL}">4</div>
  </CardGrid>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof CardGrid>} */
export const Columns = {
  render: () => ({ components: { CardGrid }, template: COLUMNS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'Two column counts in one view — a count only reads against another.' },
      source: { code: toSfc(IMPORT, COLUMNS_TEMPLATE) }
    }
  }
}

const DIVIDER_COLOR_TEMPLATE = `<CardGrid kind="divider" divider-color="muted" :columns="3">
  <div class="${CELL}">One</div>
  <div class="${CELL}">Two</div>
  <div class="${CELL}">Three</div>
</CardGrid>`

/** @type {import('@storybook/vue3').StoryObj<typeof CardGrid>} */
export const DividerColor = {
  render: () => ({ components: { CardGrid }, template: DIVIDER_COLOR_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'The muted hairline weight, for rules one step back.' },
      source: { code: toSfc(IMPORT, DIVIDER_COLOR_TEMPLATE) }
    }
  }
}

const FRAME_TEMPLATE = `<CardGrid kind="frame" :columns="3">
  <CardGridCell kind="canvas">A canvas cell, padded by default.</CardGridCell>
  <CardGridCell>A surface cell — the cell's default fill.</CardGridCell>
  <CardGridCell kind="none" :padded="false">
    <div class="flex h-full items-center justify-center bg-(--primary) text-(--primary-contrast)">
      A cell that paints itself
    </div>
  </CardGridCell>
</CardGrid>`

/** @type {import('@storybook/vue3').StoryObj<typeof CardGrid>} */
export const Frame = {
  render: () => ({ components: { CardGrid, CardGridCell }, template: FRAME_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The framed register and everything its cell carries: the two fills, and an unpadded `kind="none"` cell whose content reaches the rules. Each cell draws only its right and bottom rules — the grid draws the matching top and left ones, so every edge is one hairline.'
      },
      source: { code: toSfc(CELL_IMPORTS, FRAME_TEMPLATE) }
    }
  }
}
