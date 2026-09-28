import DocFrame from '@aziontech/webkit/doc-frame'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import DocFrame from '@aziontech/webkit/doc-frame'"

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
 * Real screen recordings of the same flow, from the same `static/` root. The two
 * clip stories exist to show that a clip source becomes a video element, and what
 * autoplay strips from it — which only reads with a recording that actually plays.
 * The long one carries controls; the short one loops under `autoplay`, which is
 * the only honest way to show a rule whose whole point is that it repeats.
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
  title: 'Components/Documentation/DocFrame',
  component: DocFrame,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "The bordered surface every screenshot, diagram and clip in a documentation page sits on, so no media floats loose on the canvas and all of it shares one border, radius and inset. Pass `src` and the frame decides from the extension whether it holds a still or a clip; compose the default slot instead when the thing being framed is markup. The caption reads under the frame, centered, as part of the picture; the hint reads above it, on the text's own left edge, as part of the sentence that led the reader here — each is a string prop for the plain case, with a slot of the same name for a caption that carries a link, a bold run or a code chip. A clip that plays on its own is muted, inline and looping and ships no controls — the frame applies that rule to the `autoplay` prop and to a clip written by hand in the slot alike. A STILL OPENS FULL SCREEN: the picture is the button, and it grows out of its own frame rather than fading in over the page, so the reader does not have to re-find what they just clicked. Escape, the backdrop, the close control and the picture itself all send it back, and focus returns to the thumbnail. A clip does not — it carries controls a click would fight — and neither does composed slot content, which has no source to open."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    caption: {
      control: 'text',
      description: 'Caption under the frame, centered; plain-text fallback for the caption slot.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    hint: {
      control: 'text',
      description: 'Lead-in above the frame, left aligned; plain-text fallback for the hint slot.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    src: {
      control: 'text',
      description: 'Media source; omit to frame slot content instead.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    alt: {
      control: 'text',
      description: 'Alternative text for the framed media.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    autoplay: {
      control: 'boolean',
      description: 'Plays the clip on its own, muted, inline and looping, with no controls.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    default: {
      description: 'Framed content when no `src` is given.',
      table: { type: { summary: 'slot' } }
    }
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
  <DocFrame src="${SHOT}" alt="${SHOT_ALT}">
    <template #caption>Console, <strong>Create application</strong> — step 3</template>
  </DocFrame>
  <DocFrame src="${CLIP}" alt="${CLIP_ALT}" caption="The same flow, from the method to the deploy" />
</div>`

export const Media = {
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
  render: () => ({ components: { DocFrame }, template: AUTOPLAY_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    /*
     * No visual snapshot: this clip plays on its own and loops, so the frame on screen
     * when the screenshot is taken is whatever the video happened to reach. There is no
     * stable baseline to compare against — successive runs differed by 85KB of image —
     * and a snapshot that cannot agree with itself fails the gate at random rather than
     * catching a regression. The other three Frames stories cover the chrome; what is
     * unique here is the autoplay attribute set, which the browser test asserts.
     */
    visual: false,
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
  <DocFrame src="${SHOT}" alt="${SHOT_ALT}" hint="Everything below starts from one screen:">
    <template #caption>Console, <strong>Create application</strong> — step 3</template>
  </DocFrame>
  <DocFrame src="${SHOT}" alt="${SHOT_ALT}">
    <template #caption>
      The application is live once <strong>Create and deploy</strong> finishes — see the
      <a href="https://azion.com/documentation">CLI reference</a> or run <code>azion deploy</code>.
    </template>
  </DocFrame>
</div>`

export const Prose = {
  render: () => ({ components: { DocFrame }, template: PROSE_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The hint precedes the frame and stays on the left edge of the text, because it is read in the flow of the sentence above it. The caption belongs to the picture, so it centers under it. The plain case is the string prop; a caption that carries a bold run, a link or a code chip fills the slot of the same name, and the prop stays as its fallback.'
      },
      source: { code: toSfc(IMPORT, PROSE_TEMPLATE) }
    }
  }
}
