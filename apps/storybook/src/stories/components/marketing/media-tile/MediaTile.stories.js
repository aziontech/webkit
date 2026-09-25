import CardGrid from '@aziontech/webkit/card-grid'
import Illustration from '@aziontech/webkit/illustration'
import MediaTile from '@aziontech/webkit/media-tile'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = [
  "import Illustration from '@aziontech/webkit/illustration'",
  "import MediaTile from '@aziontech/webkit/media-tile'"
]

const BAND_IMPORT = [
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import Illustration from '@aziontech/webkit/illustration'",
  "import MediaTile from '@aziontech/webkit/media-tile'"
]

const TITLE = 'AI workloads.'
const DESCRIPTION =
  'Run tasks with reduced latency and higher concurrency, delivering faster, scalable results for all users.'
const SCENE = 'ai-applications'

/** @type {import('@storybook/vue3').Meta<typeof MediaTile>} */
const meta = {
  title: 'Components/Marketing/MediaTile',
  component: MediaTile,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "One cell of a media band: a scene above, and under it a run-in caption whose lead names what the scene shows and whose sentence continues on the same line. It comes in two registers — `frame` draws the page's frame around the media alone, `plain` draws no rules and makes the tile itself the cell a `divider` grid separates."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    kind: {
      control: 'inline-radio',
      options: ['frame', 'plain'],
      description:
        "Register of the tile: `frame` draws the page's frame around the media alone, `plain` draws no rules and makes the tile itself the cell a `divider` grid separates.",
      table: {
        category: 'props',
        type: { summary: "'frame' | 'plain'" },
        defaultValue: { summary: "'frame'" }
      }
    },
    title: {
      control: 'text',
      description:
        "The caption's run-in lead, naming what the panel above it shows. End it with a full stop — it runs into the sentence that follows, so the stop is what separates them.",
      table: {
        category: 'props',
        type: { summary: 'string', required: true }
      }
    },
    description: {
      control: 'text',
      description:
        'The sentence continuing the caption after the lead; overridden by the default slot.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    src: {
      control: 'text',
      description: "URL of the tile's media image; ignored when the `media` slot is filled.",
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    alt: {
      control: 'text',
      description: 'Alternative text describing what the image shows; empty keeps it decorative.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    padded: {
      control: 'boolean',
      description:
        "Inset the media — inside the frame in the `frame` register, from the cell's edges in `plain`. Turn it off for an asset that should run to the cell's edges; the caption keeps its own inset either way.",
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    default: {
      control: false,
      description: 'The caption body after the lead; replaces the `description` prop.',
      table: { category: 'slots' }
    },
    media: {
      control: false,
      description: 'The scene the frame holds; replaces the `src` image.',
      table: { category: 'slots' }
    }
  },
  args: {
    kind: 'frame',
    title: TITLE,
    description: DESCRIPTION,
    src: '',
    alt: '',
    padded: true
  }
}

export default meta

const Template = (args) => ({
  components: { Illustration, MediaTile },
  setup() {
    return { args }
  },
  template: `<MediaTile v-bind="args">
    <template v-if="!args.src" #media><Illustration name="${SCENE}" /></template>
  </MediaTile>`
})

const DEFAULT_MARKUP = `<MediaTile
  title="${TITLE}"
  description="${DESCRIPTION}"
>
  <template #media>
    <Illustration name="${SCENE}" />
  </template>
</MediaTile>`

/** @type {import('@storybook/vue3').StoryObj<typeof MediaTile>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          "A framed panel with its caption under it: the lead in the page's ink, the sentence in the muted one, both on the same line. The scene is an official `Illustration`, inset from the frame by the `padded` default. Type a URL into `src` in the Controls panel and the tile swaps the scene for a plain image; clear `description` and the caption is the lead alone, with the frame holding its height either way."
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const KINDS_TEMPLATE = `<div class="flex flex-col gap-8">
  <CardGrid kind="gap" :columns="2">
    <MediaTile
      kind="frame"
      title="Framed."
      description="The frame wraps the media alone, and the caption sits under it on the page column."
    >
      <template #media>
        <Illustration name="ai-applications" />
      </template>
    </MediaTile>
    <MediaTile
      kind="frame"
      title="One frame per tile."
      description="The gutters of the gap register keep every frame its own, marks included."
    >
      <template #media>
        <Illustration name="distributed-apis" />
      </template>
    </MediaTile>
  </CardGrid>
  <CardGrid kind="divider" :columns="2">
    <MediaTile
      kind="plain"
      title="Plain."
      description="No rules of its own: the tile is the cell, filled and inset, and the grid draws the seam."
    >
      <template #media>
        <Illustration name="modern-frontends" />
      </template>
    </MediaTile>
    <MediaTile
      kind="plain"
      title="One rule per seam."
      description="The divider register rules every column, so a frame here would double each line."
    >
      <template #media>
        <Illustration name="runtime" />
      </template>
    </MediaTile>
  </CardGrid>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof MediaTile>} */
export const Kinds = {
  render: () => ({
    components: { CardGrid, Illustration, MediaTile },
    template: KINDS_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          "The two registers, each in the grid it belongs to. `frame` sits in `card-grid`'s `gap` register, where gutters keep every frame its own. `plain` sits in the `divider` register, where the grid draws every rule and the tile only has to fill its own background — a framed tile there would put a frame rule and a grid hairline a padding apart."
      },
      source: { code: toSfc(BAND_IMPORT, KINDS_TEMPLATE) }
    }
  }
}

const UNPADDED_MARKUP = `<MediaTile
  title="${TITLE}"
  description="${DESCRIPTION}"
  :padded="false"
>
  <template #media>
    <Illustration name="${SCENE}" />
  </template>
</MediaTile>`

/** @type {import('@storybook/vue3').StoryObj<typeof MediaTile>} */
export const Unpadded = {
  render: Template,
  args: {
    padded: false
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same tile with the inset off: the media runs to the frame's rules instead of sitting inside them. Reach for it only when the asset already carries its own air — a composed scene wants the inset, and a band mixing the two reads as a mistake."
      },
      source: { code: toSfc(IMPORT, UNPADDED_MARKUP) }
    }
  }
}

const BAND_TEMPLATE = `<CardGrid kind="gap" :columns="4" :mobile-columns="1">
  <MediaTile
    title="AI workloads."
    description="Run tasks with reduced latency and higher concurrency, delivering faster, scalable results for all users."
  >
    <template #media>
      <Illustration name="ai-applications" />
    </template>
  </MediaTile>
  <MediaTile
    title="Business-critical APIs."
    description="Ensure fast, resilient API responses under heavy traffic, keeping experiences smooth and consistent."
  >
    <template #media>
      <Illustration name="distributed-apis" />
    </template>
  </MediaTile>
  <MediaTile
    title="Server-side and partial pre-rendering."
    description="Render the page closer to the request, so the first view arrives without waiting on a round trip to origin."
  >
    <template #media>
      <Illustration name="modern-frontends" />
    </template>
  </MediaTile>
  <MediaTile
    title="Middleware."
    description="Run auth, redirects and rewrites on the way in, before the request reaches the application behind them."
  >
    <template #media>
      <Illustration name="runtime" />
    </template>
  </MediaTile>
</CardGrid>`

/** @type {import('@storybook/vue3').StoryObj<typeof MediaTile>} */
export const Band = {
  render: () => ({
    components: { CardGrid, Illustration, MediaTile },
    template: BAND_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      controls: { disable: true },
      description: {
        story:
          'The row the tile exists for, laid out by `card-grid` in its `gap` register: the gutters keep every frame its own, the grid row equalises the panels so the captions start on one line, and the claims read down the band as one paragraph. The `divider` register would rule the captions as well as the panels — which is the seam this component keeps out of the copy.'
      },
      source: { code: toSfc(BAND_IMPORT, BAND_TEMPLATE) }
    }
  }
}
