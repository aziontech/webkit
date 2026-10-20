import Button from '@aziontech/webkit/button'
import Illustration from '@aziontech/webkit/illustration'
import MediaSplit from '@aziontech/webkit/media-split'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = [
  "import Illustration from '@aziontech/webkit/illustration'",
  "import MediaSplit from '@aziontech/webkit/media-split'"
]

const EYEBROW = 'Deployment'
const TITLE = 'Go from repository to running application in three steps.'
const DESCRIPTION =
  'Pick a method, point at a repository, then name the application and deploy it. There is no pipeline to assemble first and nothing to size — the last step ships it.'
const SCENE = 'quick-start-with-templates'

/** @type {import('@storybook/vue3').Meta<typeof MediaSplit>} */
const meta = {
  title: 'Components/Marketing/MediaSplit',
  component: MediaSplit,
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
          'A two-column band pairing a block of copy with a piece of media — a screenshot, diagram or short video — each holding half the frame. It is the workhorse section of a product page: one claim, one picture of the claim, repeated down the page with the sides alternating.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description:
        'Headline of the band, rendered as its `h2`. It is also the accessible name of the section, so it has to say what the band claims.',
      table: {
        category: 'props',
        type: { summary: 'string' }
      }
    },
    description: {
      control: 'text',
      description:
        'Supporting paragraph under the headline; overridden by the default slot when one is provided.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    eyebrow: {
      control: 'text',
      description: 'Short uppercase overline rendered above the headline.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    src: {
      control: 'text',
      description:
        "URL of the band's image; ignored when the `media` slot is filled. With neither, the copy column spans the whole frame. Fill it here and the band swaps the scene for a plain image.",
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    alt: {
      control: 'text',
      description:
        'Alternative text describing what the image shows. Leave it empty only for a decorative picture — the image is then hidden from assistive technology rather than announced unnamed.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    kind: {
      control: 'select',
      options: ['media-end', 'media-start'],
      description:
        'Which end the media sits on — the closing cell from `lg` up, or the lower one when the band is vertical. `media-end` puts the copy first. A horizontal band below `lg` renders as one column, copy first, whichever `kind` it carries.',
      table: {
        category: 'props',
        type: { summary: "'media-end' | 'media-start'" },
        defaultValue: { summary: "'media-end'" }
      }
    },
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
      description:
        'Axis the band splits on. `horizontal` sets the cells side by side from `lg` up; `vertical` holds them stacked at every width, and `kind` then decides which cell is on top.',
      table: {
        category: 'props',
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: "'horizontal'" }
      }
    },
    fill: {
      control: 'inline-radio',
      options: ['canvas', 'surface'],
      description:
        "The cells' fill. `canvas` lets the band sit in the page column; `surface` lifts it onto its own plate.",
      table: {
        category: 'props',
        type: { summary: "'canvas' | 'surface'" },
        defaultValue: { summary: "'canvas'" }
      }
    },
    framed: {
      control: 'boolean',
      description:
        "Draw the band's own registration frame. Turn it off when the page already wraps the band in a frame.",
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    divided: {
      control: 'boolean',
      description:
        "Draw the seam between the copy and the media — the grid's own gap over a rule fill. Turn it off for a band whose two halves should read as one plate.",
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    headingLevel: {
      control: 'inline-radio',
      options: [2, 3],
      description:
        'Level of the headline element. Drop it to `3` when the band is a sub-band of a section a `section-title` has already opened with its `h2`.',
      table: {
        category: 'props',
        type: { summary: '2 | 3' },
        defaultValue: { summary: '2' }
      }
    },
    texture: {
      control: 'select',
      options: ['grid', 'dots', 'dither', 'pixelate', 'none'],
      description:
        'Texture the media half is grounded with; `none` leaves the cell bare. The band paints the layer itself, so a page composes nothing — quiet it further with `--texture-ink`.',
      table: {
        category: 'props',
        type: { summary: "'grid' | 'dots' | 'dither' | 'pixelate' | 'none'" },
        defaultValue: { summary: "'grid'" }
      }
    },
    textureSize: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
      description:
        "Pitch of the ground's tiling — how far apart its cells sit. `small` is the tightest lattice, for a cell a busy panel already fills.",
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    textureFade: {
      control: 'select',
      options: ['none', 'top', 'bottom', 'edges', 'vignette'],
      description:
        "How the ground fades out before the cell's edges, so it meets the seam without a hard line.",
      table: {
        category: 'props',
        type: { summary: "'none' | 'top' | 'bottom' | 'edges' | 'vignette'" },
        defaultValue: { summary: "'vignette'" }
      }
    },
    mediaPadded: {
      control: 'boolean',
      description:
        "Inset the media from the cell's edges. An exported asset carries its own air and runs flush; a screenshot or a composed panel wants the inset.",
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    mediaHref: {
      control: 'text',
      description:
        "URL the band links to. With it set the media cell is one link named by the band's `title`, a click anywhere else on the band follows it, and hovering the band reveals the chevron affordance and the hover state of its link actions.",
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    mediaFill: {
      control: 'inline-radio',
      options: ['surface', 'canvas'],
      description:
        "The media cell's fill. `surface` sets the asset on its own plate, one step off the page; `canvas` lets the whole band sit on the page.",
      table: {
        category: 'props',
        type: { summary: "'canvas' | 'surface'" },
        defaultValue: { summary: "'surface'" }
      }
    },
    size: {
      control: 'inline-radio',
      options: ['medium', 'large'],
      description:
        'Type scale and air of the copy. `medium` sets the headline at heading-md for a band beside other content; `large` sets it at heading-xl with a larger description and pads the copy cell a step wider, for a band that carries only its headline and actions.',
      table: {
        category: 'props',
        type: { summary: "'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    align: {
      control: 'inline-radio',
      options: ['top', 'center'],
      description:
        "Where the copy sits down its cell. `top` holds the copy at the cell's top and floors the actions so consecutive bands align on them; `center` gathers the copy and its actions into one block on the cell's vertical middle.",
      table: {
        category: 'props',
        type: { summary: "'top' | 'center'" },
        defaultValue: { summary: "'top'" }
      }
    },
    default: {
      control: false,
      description: 'Description body; replaces the `description` prop when provided.',
      table: { category: 'slots' }
    },
    content: {
      control: false,
      description:
        "Further copy-column content under the description — an inventory, a list of surfaces — inside the paragraph's own measure.",
      table: { category: 'slots' }
    },
    media: {
      control: false,
      description: "The band's media; replaces the image built from `src`.",
      table: { category: 'slots' }
    },
    actions: {
      control: false,
      description:
        'Optional controls under the copy, floored so consecutive bands align on them. The band\'s action pattern is small buttons: `kind="secondary"` for the action itself, and `kind="outlined"` for a second one beside it. A control that leaves the page for another one carries `icon="pi pi-chevron-right"` with `icon-position="trailing"`.',
      table: { category: 'slots' }
    }
  },
  args: {
    eyebrow: EYEBROW,
    title: TITLE,
    description: DESCRIPTION,
    src: '',
    alt: '',
    kind: 'media-end',
    orientation: 'horizontal',
    fill: 'canvas',
    framed: false,
    divided: true,
    headingLevel: 2,
    texture: 'grid',
    textureSize: 'medium',
    textureFade: 'vignette',
    mediaPadded: false,
    mediaHref: '',
    align: 'top',
    mediaFill: 'surface',
    size: 'medium'
  }
}

export default meta

const Template = (args) => ({
  components: { Illustration, MediaSplit },
  setup() {
    return { args }
  },
  template: `<MediaSplit v-bind="args">
    <template v-if="!args.src" #media><Illustration name="${SCENE}" /></template>
  </MediaSplit>`
})

const DEFAULT_MARKUP = `<MediaSplit
  eyebrow="${EYEBROW}"
  title="${TITLE}"
  description="${DESCRIPTION}"
>
  <template #media>
    <Illustration name="${SCENE}" />
  </template>
</MediaSplit>`

/** @type {import('@storybook/vue3').StoryObj<typeof MediaSplit>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          "One claim and one picture of that claim, copy leading and media closing — the `media-end` default. The picture is an official `Illustration` scene: vector, drawn on the system's own canvas, and transparent, so it sits on the band's ground — a grid lattice that fades radially to nothing before the cell's edges. Type a URL into `src` in the Controls panel and the band swaps the scene for a plain image, which covers the ground instead; clear both and the copy column takes the full frame rather than leaving an empty half."
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const KINDS_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xxl)">
  <MediaSplit
    kind="media-end"
    eyebrow="${EYEBROW}"
    title="${TITLE}"
    description="${DESCRIPTION}"
  >
    <template #media>
      <Illustration name="${SCENE}" />
    </template>
  </MediaSplit>
  <MediaSplit
    kind="media-start"
    eyebrow="${EYEBROW}"
    title="${TITLE}"
    description="${DESCRIPTION}"
  >
    <template #media>
      <Illustration name="${SCENE}" />
    </template>
  </MediaSplit>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof MediaSplit>} */
export const Kinds = {
  render: () => ({ components: { Illustration, MediaSplit }, template: KINDS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Both `kind` values, one band under the other, with the copy and the scene held identical so the only thing that moves is the side the media sits on: `media-end` first, then `media-start`. Down a real product page these alternate band after band, each carrying its own claim — the mirroring is what keeps consecutive bands from reading as one long column. The flip is an `md`-and-up affair: narrow the canvas and both collapse to the same single column with the copy first, so reading order follows the argument rather than the layout.'
      },
      source: { code: toSfc(IMPORT, KINDS_TEMPLATE) }
    }
  }
}

const ORIENTATIONS_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xxl)">
  <MediaSplit
    orientation="horizontal"
    eyebrow="${EYEBROW}"
    title="Horizontal: two cells from lg up."
    description="The band proper. It stacks below lg and splits above it, so a full-width page reads as a column of alternating halves."
  >
    <template #media>
      <Illustration name="${SCENE}" />
    </template>
  </MediaSplit>
  <div class="max-w-(--container-lg)">
    <MediaSplit
      orientation="vertical"
      kind="media-start"
      eyebrow="${EYEBROW}"
      title="Vertical: stacked at every width."
      description="The shape a band takes in a column too narrow to carry two halves. kind picks which cell is on top — media-start leads with the picture."
    >
      <template #media>
        <Illustration name="${SCENE}" />
      </template>
    </MediaSplit>
  </div>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof MediaSplit>} */
export const Orientations = {
  render: () => ({ components: { Illustration, MediaSplit }, template: ORIENTATIONS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Both axes: the horizontal band across the full canvas, then the vertical one held in a narrow column. `horizontal` is the band proper — one column below `lg`, two cells above it. `vertical` keeps the stacked form at every width, which is what a page aside or a grid cell wants, and `kind` changes meaning with it: `media-start` puts the media above the copy rather than to its left. The copy cell stays first in the DOM either way, so tab order and screen-reader order follow the argument rather than the picture.'
      },
      source: { code: toSfc(IMPORT, ORIENTATIONS_TEMPLATE) }
    }
  }
}

const UNDIVIDED_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xxl)">
  <MediaSplit
    fill="surface"
    eyebrow="${EYEBROW}"
    title="With the seam."
    description="The default: a one-pixel gap over a rule fill, so the two cells read as two."
  >
    <template #media>
      <Illustration name="${SCENE}" />
    </template>
  </MediaSplit>
  <MediaSplit
    fill="surface"
    :divided="false"
    eyebrow="${EYEBROW}"
    title="Without it."
    description="The grid closes the gap and the halves meet on their own fill, so the band reads as one plate with a picture in it."
  >
    <template #media>
      <Illustration name="${SCENE}" />
    </template>
  </MediaSplit>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof MediaSplit>} */
export const Undivided = {
  render: () => ({ components: { Illustration, MediaSplit }, template: UNDIVIDED_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "The same band with its seam and without it, both on a `surface` fill so the difference is the only thing that moves. The seam is not a border either cell draws — it is the grid's own gap over a rule fill, which is why it lands in the same place whichever side the media is on. `divided` off closes the gap: on `surface` that gives one plate with a picture in it, and on the `canvas` fill it gives two cells that merely touch."
      },
      source: { code: toSfc(IMPORT, UNDIVIDED_TEMPLATE) }
    }
  }
}

const TEXTURES_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xxl)">
  <MediaSplit
    eyebrow="grid"
    title="The default: a drafting lattice."
    description="Square rules faded radially to nothing before the cell's edges, so a scene has a ground and the seam stays the only hard line."
    texture="grid"
  >
    <template #media>
      <Illustration name="quick-start-with-templates" />
    </template>
  </MediaSplit>
  <MediaSplit
    eyebrow="dots"
    title="The quiet one."
    description="A dot lattice, the calmest of the four — reach for it when the scene above it is already busy. This one is at the tightest pitch."
    texture="dots"
    texture-size="small"
  >
    <template #media>
      <Illustration name="quick-start-with-templates" />
    </template>
  </MediaSplit>
  <MediaSplit
    eyebrow="dither"
    title="A density ramp."
    description="Ordered dithering that thins out along an axis, so the ground reads as a gradient made of ink rather than of light."
    texture="dither"
    texture-fade="edges"
  >
    <template #media>
      <Illustration name="quick-start-with-templates" />
    </template>
  </MediaSplit>
  <MediaSplit
    eyebrow="pixelate"
    title="Light pooling under the media."
    description="The loudest ground: a pixelated wash in the brand accent, with two crests travelling under it."
    texture="pixelate"
  >
    <template #media>
      <Illustration name="quick-start-with-templates" />
    </template>
  </MediaSplit>
  <MediaSplit
    eyebrow="none"
    title="The bare cell."
    description="No ground at all, for a band whose media already fills its half with something opaque."
    texture="none"
  >
    <template #media>
      <Illustration name="quick-start-with-templates" />
    </template>
  </MediaSplit>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof MediaSplit>} */
export const Textures = {
  render: () => ({ components: { Illustration, MediaSplit }, template: TEXTURES_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Every material the band can ground its media on, one under the other with the same scene on each, so the only thing that changes is the step off the cell. `texture` picks the material, `textureSize` its pitch — the `dots` band is at `small` — and `textureFade` decides how it reaches zero before the cell's edges — `vignette` by default, which hugs a centred scene; `edges` suits a ramp that should die at the sides instead. The band paints the layer itself, so a page names the material it wants rather than composing one, and `none` leaves the cell bare."
      },
      source: { code: toSfc(IMPORT, TEXTURES_TEMPLATE) }
    }
  }
}

const ACTIONS_IMPORT = [
  "import Button from '@aziontech/webkit/button'",
  "import Illustration from '@aziontech/webkit/illustration'",
  "import MediaSplit from '@aziontech/webkit/media-split'"
]

const MEDIA_LINK_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xxl)">
  <MediaSplit
    eyebrow="${EYEBROW}"
    title="The media is inert."
    description="Without mediaHref the picture is a picture: the cell has no link, no affordance and nothing to reach by keyboard."
  >
    <template #media>
      <Illustration name="${SCENE}" />
    </template>
  </MediaSplit>
  <MediaSplit
    eyebrow="${EYEBROW}"
    title="The band is the link."
    description="With mediaHref a click anywhere on the band follows it. Hover the band and the chevron fades in while the action lights up; Tab reaches the media cell's own link."
    media-href="/site/docs"
  >
    <template #media>
      <Illustration name="${SCENE}" />
    </template>
    <template #actions>
      <Button
        label="Read the guide"
        kind="outlined"
        size="small"
        icon="pi pi-chevron-right"
        icon-position="trailing"
        animated
        href="/site/docs"
      />
    </template>
  </MediaSplit>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof MediaSplit>} */
export const MediaLink = {
  render: () => ({
    components: { Button, Illustration, MediaSplit },
    template: MEDIA_LINK_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "`mediaHref` turns the whole band into one target. The media cell is the anchor — one control, named by the band's `title` — and a click anywhere else on the band follows the same URL (`Cmd`/`Ctrl` opens a new tab; selecting text or clicking a control inside does not navigate). Hovering the band fades in the chevron at the media's closing corner and lights the hover state of every link in `actions`, so the band and its action read as one. The chevron is `aria-hidden` decoration, never a nested button, and it also answers to the cell's own `focus-visible`, so a keyboard sees what a pointer sees; under `prefers-reduced-motion` it appears without travelling."
      },
      source: { code: toSfc(ACTIONS_IMPORT, MEDIA_LINK_TEMPLATE) }
    }
  }
}

const ACTIONS_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xxl)">
  <MediaSplit
    eyebrow="${EYEBROW}"
    title="One action closes the band."
    description="A band that ends on a single next step carries one small secondary button, floored under the copy so consecutive bands line up on it."
  >
    <template #media>
      <Illustration name="${SCENE}" />
    </template>
    <template #actions>
      <Button
        label="Read the guide"
        kind="secondary"
        size="small"
        icon="pi pi-chevron-right"
        icon-position="trailing"
        animated
        href="/site/docs"
      />
    </template>
  </MediaSplit>
  <MediaSplit
    kind="media-start"
    eyebrow="${EYEBROW}"
    title="Two actions keep the same weight order."
    description="When a band offers a second route, it goes beside the first as an outlined button — same size, lower fill, so the band still has one obvious next step."
  >
    <template #media>
      <Illustration name="${SCENE}" />
    </template>
    <template #actions>
      <Button
        label="Read the guide"
        kind="secondary"
        size="small"
        href="/site/docs"
      />
      <Button
        label="See GitHub"
        kind="outlined"
        size="small"
        icon="pi pi-github"
        href="https://github.com/aziontech"
        target="_blank"
      />
    </template>
  </MediaSplit>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof MediaSplit>} */
export const Actions = {
  render: () => ({ components: { Button, Illustration, MediaSplit }, template: ACTIONS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "The band's action pattern, which is fixed rather than per-page: the action itself is a `small` `secondary` button, and a band that carries a second one puts it beside the first as `outlined` at the same size. The size is deliberate — these bands repeat down a page, so a full-height action on each one would compete with the section's own call to action. The slot takes the controls bare; the band floors them under the copy so consecutive bands align on the same line."
      },
      source: { code: toSfc(ACTIONS_IMPORT, ACTIONS_TEMPLATE) }
    }
  }
}
