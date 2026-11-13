import MediaSplitStack from '@aziontech/webkit/media-split-stack'

import { sectionMarkup } from '../../../../_shared/section-source'
import { withStoryAssets } from '../../../../_shared/site-assets'
import { toSfc } from '../../../../_shared/story-source'
import {
  ALTERNATING_SECTION,
  SOLUTIONS_SECTION
} from '../../../../templates/marketing/_sections/media-split-stack'

const IMPORT = "import MediaSplitStack from '@aziontech/webkit/media-split-stack'"

const markup = (props, name) => {
  const { body, script } = sectionMarkup('MediaSplitStack', props)
  const rename = (text) => text.replace(/\bbands\b/g, name)
  return { body: rename(body).replace(`:${name}=`, ':bands='), script: script.map(rename) }
}

const DEFAULT_MARKUP = markup(SOLUTIONS_SECTION.props, 'bands')

const SOLUTIONS_MARKUP = markup(SOLUTIONS_SECTION.props, 'solutionBands')
const ALTERNATING_MARKUP = markup(ALTERNATING_SECTION.props, 'networkBands')

const TYPES_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xl)">
${[SOLUTIONS_MARKUP.body, ALTERNATING_MARKUP.body]
  .map((body) => body.replace(/^/gm, '  '))
  .join('\n')}
</div>`

/** @type {import('@storybook/vue3').Meta<typeof MediaSplitStack>} */
const meta = {
  title: 'Components/Marketing/Sections/MediaSplitStack',
  component: MediaSplitStack,
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
          'A run of large media-split bands that pile up under the site header as the page scrolls, each a centered claim with an outlined "learn more" button beside its picture, the whole band linking through. An optional large centered section title opens the run. It is a page section — the site places it from a `{ _id: \'media-split-stack\', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `band-stack`, `media-split`, `illustration` and `button`. `kind` picks the layout only: `media-end` sets every picture at the closing end, `alternating` starts it at the opening end and swaps sides band by band.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['media-end', 'alternating'],
      description:
        'Layout of the run: `media-end` sets every picture at the closing end, `alternating` starts it at the opening end and swaps sides band by band.',
      table: {
        category: 'props',
        type: { summary: 'MediaSplitStackKind' },
        defaultValue: { summary: "'media-end'" }
      }
    },
    eyebrow: {
      control: 'text',
      description: 'Overline above the section title.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    title: {
      control: 'text',
      description:
        'Headline of the run, rendered by the large centered section title as its `h2`; the run renders no header when empty.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    bands: {
      control: 'object',
      description:
        'The bands, in order; each is `{ title, description, image?, imageAlt?, illustration?, illustrationLabel?, action? }` where `image` is a picture URL, `illustration` a registry name, and `action` `{ label, href }` the outlined button and the link the whole band follows.',
      table: {
        category: 'props',
        type: { summary: 'MediaSplitStackBand[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: withStoryAssets(SOLUTIONS_SECTION.props)
}

export default meta

const Template = (args) => ({
  components: { MediaSplitStack },
  setup() {
    return { args }
  },
  template: '<MediaSplitStack v-bind="args" />'
})

/** @type {import('@storybook/vue3').StoryObj<typeof MediaSplitStack>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The run as the home page places it: five solution areas, every picture at the closing end, each band linking to its solution page. Edit the props in the Controls panel — switch `kind` to `alternating`, or set a `title` to open the run with a header.'
      },
      source: { code: toSfc([IMPORT, '', ...DEFAULT_MARKUP.script], DEFAULT_MARKUP.body) }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof MediaSplitStack>} */
export const Types = {
  render: () => ({
    components: { MediaSplitStack },
    setup: () => ({
      solutionBands: withStoryAssets(SOLUTIONS_SECTION.props).bands,
      networkBands: withStoryAssets(ALTERNATING_SECTION.props).bands
    }),
    template: TYPES_TEMPLATE
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      description: {
        story:
          'Both layouts stacked: the `media-end` run of solution areas with no header, then the `alternating` run of network claims under its centered header, the pictures swapping sides band by band.'
      },
      source: {
        code: toSfc(
          [IMPORT, '', ...SOLUTIONS_MARKUP.script, '', ...ALTERNATING_MARKUP.script],
          TYPES_TEMPLATE
        )
      }
    }
  }
}
