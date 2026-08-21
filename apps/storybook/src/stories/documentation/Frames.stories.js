import DocFrame from '@aziontech/webkit-docs/doc-frame'

import { toSfc } from '../_shared/story-source'

const IMPORT = "import DocFrame from '@aziontech/webkit-docs/doc-frame'"

/*
 * A real console capture, served from this app's `static/` (see `.storybook/main.js`
 * → `staticDirs`) rather than inlined as a data URI. Two reasons, and the second is
 * the one that matters: a frame's whole job is to hold a screenshot, so a synthetic
 * grey field cannot show whether the border, radius and inset actually work against
 * a real capture's own edges; and a data URI of any real image is thousands of
 * characters, which lands verbatim in the "Show code" panel and buries the one
 * attribute the snippet exists to demonstrate. A `/docs/…` path is what an author
 * writes, so the snippet stays paste-and-run.
 */
const SHOT = '/docs/create-application-step-3.png'

/* What that capture shows, reused wherever the still appears. */
const SHOT_ALT =
  'Step 3 of Create application: the imported repository, the name, build and deploy commands, and the firewall toggle'

/*
 * Real screen recordings of the same flow, from the same `static/` root. They were
 * `/media/first-deploy.mp4` and `/media/edge-routing.mp4` — paths that never existed,
 * so both clip stories rendered an empty player and the one thing they document (that
 * a clip source becomes a `<video>`, and what autoplay strips from it) could not be
 * seen at all. The long one carries controls; the short one loops under `autoplay`,
 * which is the only honest way to show a rule whose whole point is that it repeats.
 */
const CLIP = '/media/create-application-flow.webm'
const CLIP_ALT = 'Creating an application from a Git repository, start to step 3'
const LOOP = '/media/create-application-step-3-loop.webm'
const LOOP_ALT = 'Landing on step 3 of Create application'

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
          "The bordered surface every screenshot, diagram and clip sits on — `<Frame>` in MDX — so no image floats loose on the canvas and all of them share one border, radius and inset. `caption` reads under the frame, centered, as part of the picture; `hint` reads above it, on the text's own left edge, as part of the sentence that led the reader here. Both are inline markdown, rendered through the renderer the page's paragraphs use, so a link or a bold run in a caption is the same link and the same bold as in the prose above it. Pass `src` and the frame decides from the extension whether it is holding a still or a clip; compose the default slot instead when the thing being framed is markup. A clip that plays on its own is muted, inline and looping and ships no controls — the frame applies that rule to the `autoplay` prop and to a clip written by hand in the slot alike. A STILL OPENS FULL SCREEN: the picture is the button, and it grows out of its own frame rather than fading in over the page, so the reader does not have to re-find what they just clicked. Escape, the backdrop, the close control and the picture itself all send it back, and focus returns to the thumbnail. A clip does not — it carries controls a click would fight — and neither does composed slot content, which has no source to open."
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
    alt="${SHOT_ALT}"
    caption="Console, **Create application** — step 3"
  />
  <DocFrame src="${CLIP}" alt="${CLIP_ALT}" caption="The same flow, from the method to the deploy" />
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
  <DocFrame src="${LOOP}" alt="${LOOP_ALT}" autoplay caption="Autoplay: muted, inline, looping, no controls" />
  <DocFrame caption="The same rule reaches a clip written by hand">
    <video autoplay src="${LOOP}" class="block h-auto w-full rounded-(--shape-elements)"></video>
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
    alt="${SHOT_ALT}"
    hint="Everything below starts from one screen:"
    caption="Console, **Create application** — step 3"
  />
  <DocFrame
    src="${SHOT}"
    alt="${SHOT_ALT}"
    caption="The application is live once **Create and deploy** finishes — see the [CLI reference](https://azion.com/documentation) or run \`azion deploy\`."
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
