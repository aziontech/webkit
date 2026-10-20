import BentoGrid from '@aziontech/webkit/bento-grid'
import BentoGridCell from '@aziontech/webkit/bento-grid-cell'

import { toSfc } from '../../../_shared/story-source'

const components = { BentoGrid, BentoGridCell }

const IMPORT = [
  "import BentoGrid from '@aziontech/webkit/bento-grid'",
  "import BentoGridCell from '@aziontech/webkit/bento-grid-cell'"
]

/** @type {import('@storybook/vue3').Meta<typeof BentoGrid>} */
const meta = {
  title: 'Components/Marketing/BentoGrid',
  component: BentoGrid,
  subcomponents: { BentoGridCell },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          'A mosaic of unequal cells on one set of shared rules: each cell claims a number of columns and rows, and the rules between them are drawn once so the whole block reads as a single framed surface. It is the layout a marketing page uses when several claims deserve different amounts of room — the alternative to a row of identical tiles.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    ariaLabel: {
      control: 'text',
      description:
        'Accessible name for the grid, when the surrounding section does not already name it.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    columns: {
      control: 'inline-radio',
      options: [2, 3, 4],
      description: 'How many columns the mosaic lays out from the medium breakpoint up.',
      table: {
        category: 'props',
        type: { summary: '2 | 3 | 4' },
        defaultValue: { summary: '2' }
      }
    },
    mobileColumns: {
      control: 'inline-radio',
      options: [1, 2],
      description:
        'How many columns the mosaic holds below the medium breakpoint, where every cell claims one of them.',
      table: {
        category: 'props',
        type: { summary: '1 | 2' },
        defaultValue: { summary: '1' }
      }
    },
    flush: {
      control: 'boolean',
      description:
        "The surrounding frame already draws the grid's outer rules: the grid drops its own top and left ones and lays its right and bottom ones onto the frame's, so a framed column keeps one hairline per edge.",
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    default: {
      control: false,
      description: "The grid's cells, composed as `BentoGridCell` elements in reading order.",
      table: { category: 'slots' }
    }
  }
}

export default meta

const DEFAULT_TEMPLATE = `<BentoGrid aria-label="Platform capabilities">
  <BentoGridCell>
    <h3 class="m-0 text-heading-sm text-(--text-default)">Deploy in seconds</h3>
    <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">Push to a repository and the application is live at every location, with no pipeline to assemble first.</p>
  </BentoGridCell>
  <BentoGridCell>
    <h3 class="m-0 text-heading-sm text-(--text-default)">Scale without capacity planning</h3>
    <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">Traffic is absorbed where it arrives, so there is no region to size and nothing to provision ahead of a launch.</p>
  </BentoGridCell>
  <BentoGridCell>
    <h3 class="m-0 text-heading-sm text-(--text-default)">Observe every request</h3>
    <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">Real-time events and metrics land in the same console that runs the application, without a second tool to wire up.</p>
  </BentoGridCell>
  <BentoGridCell>
    <h3 class="m-0 text-heading-sm text-(--text-default)">Pay for what you use</h3>
    <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">Billing follows requests and compute time, so an idle application costs nothing to keep running.</p>
  </BentoGridCell>
</BentoGrid>`

/** @type {import('@storybook/vue3').StoryObj<typeof BentoGrid>} */
export const Default = {
  render: () => ({ components, template: DEFAULT_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Four cells at the default single-column span in the default two-column grid, so the mosaic reads as a two-by-two block. The grid draws the rules between cells once — nothing inside a cell carries a border of its own. Below the medium breakpoint every cell goes full width and the grid becomes a single column in DOM order.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_TEMPLATE) }
    }
  }
}

const SPANS_TEMPLATE = `<BentoGrid aria-label="Platform capabilities">
  <BentoGridCell span="full">
    <h3 class="m-0 text-heading-sm text-(--text-default)">Everything runs at the edge</h3>
    <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">Every request is served from the location closest to the user, so there is no origin round trip to plan around and no region to choose.</p>
  </BentoGridCell>
  <BentoGridCell>
    <h3 class="m-0 text-heading-sm text-(--text-default)">Deploy in seconds</h3>
    <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">Push to a repository and the application is live, with no pipeline to assemble first.</p>
  </BentoGridCell>
  <BentoGridCell>
    <h3 class="m-0 text-heading-sm text-(--text-default)">Scale without capacity planning</h3>
    <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">Traffic is absorbed where it arrives, so there is nothing to provision ahead of a launch.</p>
  </BentoGridCell>
  <BentoGridCell>
    <h3 class="m-0 text-heading-sm text-(--text-default)">Observe every request</h3>
    <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">Events and metrics land in the same console that runs the application.</p>
  </BentoGridCell>
  <BentoGridCell>
    <h3 class="m-0 text-heading-sm text-(--text-default)">Pay for what you use</h3>
    <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">Billing follows requests and compute time, so an idle application costs nothing.</p>
  </BentoGridCell>
</BentoGrid>`

/** @type {import('@storybook/vue3').StoryObj<typeof BentoGrid>} */
export const Spans = {
  render: () => ({ components, template: SPANS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A `full` cell leading two pairs of single-column ones — the shape the component exists for. `span` is the only thing that changes between the cells; the frame, the padding and the shared rules stay the same, so an unequal set of claims still reads as one surface.'
      },
      source: { code: toSfc(IMPORT, SPANS_TEMPLATE) }
    }
  }
}

const MOSAIC_TEMPLATE = `<BentoGrid columns="4" mobile-columns="2" aria-label="The platform, in one block">
  <BentoGridCell span="2" rows="2">
    <div class="flex h-full flex-col justify-between gap-(--spacing-xl)">
      <h3 class="m-0 text-heading-md text-(--text-default)">Everything runs at the edge</h3>
      <p class="m-0 text-body-md text-(--text-muted)">Every request is served from the location closest to the user, so there is no origin round trip to plan around and no region to choose. The cell claims two columns and two rows, which is what makes it the block's subject.</p>
    </div>
  </BentoGridCell>
  <BentoGridCell kind="canvas">
    <h3 class="m-0 text-heading-xs text-(--text-default)">Deploy in seconds</h3>
  </BentoGridCell>
  <BentoGridCell kind="canvas">
    <h3 class="m-0 text-heading-xs text-(--text-default)">No capacity planning</h3>
  </BentoGridCell>
  <BentoGridCell kind="canvas">
    <h3 class="m-0 text-heading-xs text-(--text-default)">Observe every request</h3>
  </BentoGridCell>
  <BentoGridCell rows="2" kind="none" :padded="false">
    <a href="#pricing" class="flex h-full flex-col justify-between gap-(--spacing-lg) bg-(--bg-contrast) p-(--spacing-xl) text-(--bg-canvas) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)">
      <span class="text-heading-xs">Pay for what you use</span>
      <span class="text-body-sm">An unpadded cell with no fill of its own: the link inside it paints the whole tile and carries its own padding, so the target is the cell.</span>
    </a>
  </BentoGridCell>
  <BentoGridCell kind="canvas">
    <h3 class="m-0 text-heading-xs text-(--text-default)">One console</h3>
  </BentoGridCell>
  <BentoGridCell kind="canvas">
    <h3 class="m-0 text-heading-xs text-(--text-default)">Logs in real time</h3>
  </BentoGridCell>
  <BentoGridCell kind="canvas">
    <h3 class="m-0 text-heading-xs text-(--text-default)">Rollback in one click</h3>
  </BentoGridCell>
</BentoGrid>`

/** @type {import('@storybook/vue3').StoryObj<typeof BentoGrid>} */
export const Mosaic = {
  render: () => ({ components, template: MOSAIC_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "The four-column mosaic, where the cells claim both axes: one cell takes two columns and two rows, another takes two rows in one column, and the rest take a single track each. The spans add up to the rectangle, which is what keeps the block from ending on bare canvas. `kind` picks each cell's fill — `none` on the link cell, whose content paints the tile and pads itself, so the whole cell is the target."
      },
      source: { code: toSfc(IMPORT, MOSAIC_TEMPLATE) }
    }
  }
}
