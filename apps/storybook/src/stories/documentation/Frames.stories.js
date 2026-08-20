import DocFrame from '@aziontech/webkit-docs/doc-frame'

import { toSfc } from '../_shared/story-source'

const IMPORT = "import DocFrame from '@aziontech/webkit-docs/doc-frame'"

/*
 * A stand-in screenshot, inline so the story carries its own asset: a flat
 * field with a header band, at the 16:9 a console capture lands on. The frame
 * is what the story is about — this is only something for it to hold.
 */
const SHOT =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 960 540'%3E%3Crect width='960' height='540' fill='gainsboro'/%3E%3Crect width='960' height='64' fill='silver'/%3E%3Crect x='40' y='140' width='420' height='28' rx='6' fill='silver'/%3E%3Crect x='40' y='196' width='880' height='16' rx='6' fill='white'/%3E%3Crect x='40' y='228' width='620' height='16' rx='6' fill='white'/%3E%3C/svg%3E"

/* The content a frame holds when the author composes it instead of passing a source. */
const PANEL = `<div class="w-full rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)">
    <p class="text-heading-xs text-(--text-default)">Create a workload</p>
    <p class="pt-(--spacing-xxs) text-body-sm text-(--text-muted)">Pick a template, or start from an empty project.</p>
  </div>`

/** @type {import('@storybook/vue3').Meta<typeof DocFrame>} */
const meta = {
  title: 'Documentation/Frames',
  component: DocFrame,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "The bordered surface every screenshot, diagram and clip sits on — `<Frame>` in MDX — so no image floats loose on the canvas and all of them share one border, radius and inset. `caption` reads under the frame, centered, as part of the picture; `hint` reads above it, on the text's own left edge, as part of the sentence that led the reader here. Both are inline markdown, rendered through the renderer the page's paragraphs use, so a link or a bold run in a caption is the same link and the same bold as in the prose above it. Pass `src` and the frame decides from the extension whether it is holding a still or a clip; compose the default slot instead when the thing being framed is markup. A clip that plays on its own is muted, inline and looping and ships no controls — the frame applies that rule to the `autoplay` prop and to a clip written by hand in the slot alike."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    caption: { control: 'text' },
    hint: { control: 'text' },
    src: { control: 'text' },
    alt: { control: 'text' },
    autoplay: { control: 'boolean' }
  },
  args: {
    caption: 'Console, + Create',
    hint: '',
    src: '',
    alt: '',
    autoplay: false
  }
}

export default meta

const Template = (args) => ({
  components: { DocFrame },
  setup: () => ({ props: args }),
  template: `<DocFrame v-bind="props">\n  ${PANEL}\n</DocFrame>`
})

export const Default = {
  name: 'Frame',
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'A frame around composed markup, with a caption under it. The default slot is what an author reaches for when the thing being framed is not a file.'
      },
      source: {
        code: toSfc(IMPORT, `<DocFrame caption="Console, + Create">\n  ${PANEL}\n</DocFrame>`)
      }
    }
  }
}

const MEDIA_TEMPLATE = `<div class="flex flex-col gap-(--spacing-lg)">
  <DocFrame
    src="${SHOT}"
    alt="The Create dialog, with a template picker"
    caption="Console, + Create"
  />
  <DocFrame src="/media/first-deploy.mp4" alt="A first deploy, start to finish" caption="One deploy, from build to live edge" />
</div>`

export const Media = {
  name: 'Stills and clips',
  render: () => ({ components: { DocFrame }, template: MEDIA_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'One `src` covers both: a still renders as an image with its `alt`, and a source ending in a clip extension (`.mp4`, `.webm`, `.mov`, …) renders as a player, labelled from the same `alt`. A clip the reader chooses to play ships controls.'
      },
      source: { code: toSfc(IMPORT, MEDIA_TEMPLATE) }
    }
  }
}

const AUTOPLAY_TEMPLATE = `<div class="flex flex-col gap-(--spacing-lg)">
  <DocFrame src="/media/edge-routing.mp4" alt="Requests routing to the nearest edge" autoplay caption="Autoplay: muted, inline, looping, no controls" />
  <DocFrame caption="The same rule reaches a clip written by hand">
    <video autoplay src="/media/edge-routing.mp4" class="block h-auto w-full rounded-(--shape-elements)"></video>
  </DocFrame>
</div>`

export const Autoplay = {
  name: 'Autoplay',
  render: () => ({ components: { DocFrame }, template: AUTOPLAY_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "A clip that plays on its own is decoration, so it must not seize the reader's speakers or take over an iOS viewport, and — with nobody there to replay it — it loops. `autoplay` therefore implies muted, inline and looping, and drops the controls. The frame applies the rule on both authoring paths: to the `autoplay` prop, and to a clip written by hand in the slot."
      },
      source: { code: toSfc(IMPORT, AUTOPLAY_TEMPLATE) }
    }
  }
}

const PROSE_TEMPLATE = `<div class="flex flex-col gap-(--spacing-lg)">
  <DocFrame
    src="${SHOT}"
    alt="The Create dialog"
    hint="Everything below starts from one screen:"
    caption="Console, + Create"
  />
  <DocFrame
    src="${SHOT}"
    alt="The workload list, after the first deploy"
    caption="The workload is live once **Status** reads *Ready* — see the [CLI reference](https://azion.com/documentation) or run \`azion deploy\`."
  />
</div>`

export const Prose = {
  name: 'Hint and caption',
  render: () => ({ components: { DocFrame }, template: PROSE_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The hint precedes the frame and stays on the left edge of the text, because it is read in the flow of the sentence above it. The caption belongs to the picture, so it centers under it. Both take inline markdown — links, bold, emphasis, code — and render it as the same elements a paragraph would, which `DocProse` then styles from the page.'
      },
      source: { code: toSfc(IMPORT, PROSE_TEMPLATE) }
    }
  }
}
