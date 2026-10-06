import NetworkMap from '@aziontech/webkit/network-map'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import NetworkMap from '@aziontech/webkit/network-map'"

/** @type {import('@storybook/vue3').Meta<typeof NetworkMap>} */
const meta = {
  title: 'Components/Content/NetworkMap',
  component: NetworkMap,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component:
          'A decorative, full-bleed layer that paints the dotted world map with Azion’s PoPs lit in the brand accent. It takes no content and claims no space, but the consumer tunes it — region, PoP density, landmass opacity, static or animated — to sit behind a band’s copy.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    region: {
      control: 'select',
      options: [
        'world',
        'atlantic',
        'americas',
        'north-america',
        'south-america',
        'europe',
        'africa',
        'asia',
        'oceania'
      ],
      description:
        'Which part of the world has its PoPs lit; the map always frames the whole world.',
      table: {
        category: 'props',
        type: {
          summary:
            "'world' | 'atlantic' | 'americas' | 'north-america' | 'south-america' | 'europe' | 'africa' | 'asia' | 'oceania'"
        },
        defaultValue: { summary: "'world'" }
      }
    },
    density: {
      control: 'select',
      options: ['none', 'low', 'medium', 'high'],
      description: 'How many PoPs are lit, from `none` to `high`.',
      table: {
        category: 'props',
        type: { summary: "'none' | 'low' | 'medium' | 'high'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    animated: {
      control: 'boolean',
      description: 'Pulses the PoPs in three staggered waves; static when false.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'Opacity of the landmass dots, from 0 to 1; the PoPs stay at full strength.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '0.4' } }
    },
    position: {
      control: 'select',
      options: [
        'center',
        'top',
        'bottom',
        'left',
        'right',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right'
      ],
      description: 'Where the map parks in the space the box leaves over.',
      table: {
        category: 'props',
        type: {
          summary:
            "'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'"
        },
        defaultValue: { summary: "'center'" }
      }
    },
    scale: {
      control: { type: 'range', min: 0.25, max: 2, step: 0.05 },
      description:
        'Size of the map relative to the box; 1 fits it, below 1 shrinks it toward its position, above 1 enlarges it.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '0.85' } }
    },
    offsetX: {
      control: { type: 'range', min: -0.5, max: 0.5, step: 0.05 },
      description:
        'Horizontal shift as a fraction of the map width; negative moves it left, positive right, past the box edge if large enough.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '0' } }
    },
    offsetY: {
      control: { type: 'range', min: -0.5, max: 0.5, step: 0.05 },
      description:
        'Vertical shift as a fraction of the map height; negative moves it up, positive down, past the box edge if large enough.',
      table: { category: 'props', type: { summary: 'number' }, defaultValue: { summary: '0' } }
    },
    fade: {
      control: 'select',
      options: ['none', 'top', 'bottom', 'left', 'right', 'edges', 'vignette'],
      description: 'Fades the map out along an axis so it meets content without a hard edge.',
      table: {
        category: 'props',
        type: { summary: "'none' | 'top' | 'bottom' | 'left' | 'right' | 'edges' | 'vignette'" },
        defaultValue: { summary: "'none'" }
      }
    }
  },
  args: {
    region: 'world',
    density: 'medium',
    animated: false,
    opacity: 0.4,
    position: 'center',
    scale: 0.85,
    offsetX: 0,
    offsetY: 0,
    fade: 'none'
  }
}

export default meta

const Template = (args) => ({
  components: { NetworkMap },
  setup() {
    return { args }
  },
  template: `
    <div class="relative h-80 w-full overflow-hidden bg-(--bg-canvas)">
      <NetworkMap v-bind="args" />
    </div>
  `
})

const DEFAULT_MARKUP = `<div class="relative h-80 w-full overflow-hidden bg-(--bg-canvas)">
  <NetworkMap region="world" density="medium" :opacity="0.4" position="center" :scale="0.85" fade="none" />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof NetworkMap>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The whole world at medium density. The layer fills its nearest positioned ancestor, so the box it sits in is what gives it a size; `position` parks the map in the room `scale` leaves, and `offsetX` / `offsetY` shift it from there, past the box edge when large enough.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const REGIONS_TEMPLATE = `<div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3">
  <div class="flex flex-col gap-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">world</span>
    <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
      <NetworkMap region="world" />
    </div>
  </div>
  <div class="flex flex-col gap-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">atlantic</span>
    <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
      <NetworkMap region="atlantic" />
    </div>
  </div>
  <div class="flex flex-col gap-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">americas</span>
    <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
      <NetworkMap region="americas" />
    </div>
  </div>
  <div class="flex flex-col gap-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">north-america</span>
    <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
      <NetworkMap region="north-america" />
    </div>
  </div>
  <div class="flex flex-col gap-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">south-america</span>
    <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
      <NetworkMap region="south-america" />
    </div>
  </div>
  <div class="flex flex-col gap-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">europe</span>
    <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
      <NetworkMap region="europe" />
    </div>
  </div>
  <div class="flex flex-col gap-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">africa</span>
    <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
      <NetworkMap region="africa" />
    </div>
  </div>
  <div class="flex flex-col gap-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">asia</span>
    <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
      <NetworkMap region="asia" />
    </div>
  </div>
  <div class="flex flex-col gap-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">oceania</span>
    <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
      <NetworkMap region="oceania" />
    </div>
  </div>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof NetworkMap>} */
export const Regions = {
  render: () => ({ components: { NetworkMap }, template: REGIONS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Every region, each lighting only its own PoPs over the same whole-world map. `asia` and `oceania` hold no PoPs, so they read as landmass alone.'
      },
      source: { code: toSfc(IMPORT, REGIONS_TEMPLATE) }
    }
  }
}

const DENSITIES_TEMPLATE = `<div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
  <div class="flex flex-col gap-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">none</span>
    <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
      <NetworkMap density="none" />
    </div>
  </div>
  <div class="flex flex-col gap-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">low</span>
    <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
      <NetworkMap density="low" />
    </div>
  </div>
  <div class="flex flex-col gap-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">medium</span>
    <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
      <NetworkMap density="medium" />
    </div>
  </div>
  <div class="flex flex-col gap-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">high</span>
    <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
      <NetworkMap density="high" />
    </div>
  </div>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof NetworkMap>} */
export const Densities = {
  render: () => ({ components: { NetworkMap }, template: DENSITIES_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Levels are cumulative: `low` lights 65 PoPs, `medium` 186 and `high` 275. `none` draws the landmass alone.'
      },
      source: { code: toSfc(IMPORT, DENSITIES_TEMPLATE) }
    }
  }
}

const FADES_TEMPLATE = `<div class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2">
  <div class="flex flex-col gap-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">none</span>
    <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
      <NetworkMap fade="none" />
    </div>
  </div>
  <div class="flex flex-col gap-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">top</span>
    <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
      <NetworkMap fade="top" />
    </div>
  </div>
  <div class="flex flex-col gap-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">bottom</span>
    <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
      <NetworkMap fade="bottom" />
    </div>
  </div>
  <div class="flex flex-col gap-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">left</span>
    <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
      <NetworkMap fade="left" />
    </div>
  </div>
  <div class="flex flex-col gap-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">right</span>
    <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
      <NetworkMap fade="right" />
    </div>
  </div>
  <div class="flex flex-col gap-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">edges</span>
    <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
      <NetworkMap fade="edges" />
    </div>
  </div>
  <div class="flex flex-col gap-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">vignette</span>
    <div class="relative h-64 w-full overflow-hidden bg-(--bg-canvas)">
      <NetworkMap fade="vignette" />
    </div>
  </div>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof NetworkMap>} */
export const Fades = {
  render: () => ({ components: { NetworkMap }, template: FADES_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The layer masks itself so it meets copy without a hard edge. `--network-map-fade-start` is where the fade still holds full ink and `--network-map-fade-end` is where it reaches zero, both set from the consumer’s class.'
      },
      source: { code: toSfc(IMPORT, FADES_TEMPLATE) }
    }
  }
}

const ANIMATED_MARKUP = `<div class="relative h-80 w-full overflow-hidden bg-(--bg-canvas)">
  <NetworkMap region="world" density="medium" :opacity="0.4" position="center" fade="none" animated />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof NetworkMap>} */
export const Animated = {
  args: { animated: true },
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The PoPs pulse in three staggered waves. The pulse stops under reduced motion, leaving the PoPs static.'
      },
      source: { code: toSfc(IMPORT, ANIMATED_MARKUP) }
    }
  }
}
