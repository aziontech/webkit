import DocMarkdown from '@aziontech/webkit-docs/doc-markdown'
import DocProse from '@aziontech/webkit-docs/doc-prose'
import DocTooltip from '@aziontech/webkit-docs/doc-tooltip'

import { toSfc } from '../_shared/story-source'

const IMPORT = "import DocTooltip from '@aziontech/webkit-docs/doc-tooltip'"
const PROSE_IMPORT = [
  "import DocMarkdown from '@aziontech/webkit-docs/doc-markdown'",
  "import DocProse from '@aziontech/webkit-docs/doc-prose'"
]

/** @type {import('@storybook/vue3').Meta<typeof DocTooltip>} */
const meta = {
  title: 'Documentation/Tooltip',
  component: DocTooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "The inline gloss — `<Tooltip>` in MDX. A term in running prose carries its own definition, shown on hover and on keyboard focus, so the reader learns what `API` means without leaving the sentence. It is not the webkit tooltip: that one is a one-line label with no pointer events, and a gloss may hold a call-to-action link the reader has to be able to click. So it takes the popover's raised surface and keeps its pointer events, while the placement, the scale animation and the link all come from the design system. The trigger is a `<button>` with a dotted underline — a definition only a mouse can reach is a definition half the readers never get."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    tip: { control: 'text' },
    headline: { control: 'text' },
    cta: { control: 'text' },
    href: { control: 'text' },
    placement: { control: 'inline-radio', options: ['top', 'bottom', 'auto'] },
    delay: { control: { type: 'number', min: 0, step: 50 } }
  },
  args: {
    headline: 'API',
    tip: 'Application Programming Interface: a set of protocols for software applications to communicate.',
    cta: 'Read our API guide',
    href: '/api-reference',
    placement: 'top',
    delay: 150
  }
}

export default meta

const Template = (args) => ({
  components: { DocTooltip },
  setup: () => ({ props: args }),
  template: `<p class="text-body-md text-(--text-muted)">
  <DocTooltip v-bind="props">API</DocTooltip> documentation helps developers understand how to integrate with your service.
</p>`
})

const DEFAULT_MARKUP = `<p class="text-body-md text-(--text-muted)">
  <DocTooltip
    headline="API"
    tip="Application Programming Interface: a set of protocols for software applications to communicate."
    cta="Read our API guide"
    href="/api-reference"
  >API</DocTooltip> documentation helps developers understand how to integrate with your service.
</p>`

export const Default = {
  name: 'Tooltip',
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Headline, definition and an optional call to action. Hover the term, or Tab to it and read it with the keyboard.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const ANATOMY_TEMPLATE = `<div class="flex flex-col gap-(--spacing-lg) text-body-md text-(--text-muted)">
  <p>
    A <DocTooltip tip="A ready-made project you deploy in a few clicks.">template</DocTooltip> is the shortest path to a live application.
  </p>
  <p>
    A <DocTooltip headline="Workload" tip="The binding between an application and the domain that serves it.">workload</DocTooltip> is what answers a request.
  </p>
  <p>
    Every deploy runs on the <DocTooltip headline="Edge" tip="The locations that serve your application close to its readers." cta="See the network map" href="/network">edge</DocTooltip> network.
  </p>
</div>`

export const Anatomy = {
  name: 'Anatomy',
  render: () => ({
    components: { DocTooltip },
    template: ANATOMY_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The three shapes a gloss takes. A bare definition is a passive `role="tooltip"`. Adding a headline names the term above it. Adding `cta` + `href` makes the panel enterable — it becomes a small `role="dialog"`, announced through `aria-expanded`, and stays open long enough for the pointer to reach the link.'
      },
      source: { code: toSfc(IMPORT, ANATOMY_TEMPLATE) }
    }
  }
}

const MDX_SOURCE = `## Tooltips

Use a gloss when a term needs a definition the sentence has no room for. An
<Tooltip headline="API" tip="Application Programming Interface: a set of protocols for software applications to communicate." cta="Read our API guide" href="/api-reference">API</Tooltip>
is documented once and glossed everywhere it appears, and a
<Tooltip tip="The binding between an application and the domain that serves it.">workload</Tooltip>
reads the same way in the middle of a paragraph.`

// The snippet carries the page source too, so "Show code" is paste-and-run.
const MDX_SCRIPT = ['const source = `', MDX_SOURCE, '`'].join('')

const MDX_MARKUP = `<DocProse>
  <DocMarkdown :source="source" />
</DocProse>`

export const InMdx = {
  name: 'In MDX',
  render: () => ({
    components: { DocMarkdown, DocProse },
    setup: () => ({ source: MDX_SOURCE }),
    template: MDX_MARKUP
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Written as `<Tooltip>` in an `.mdx` file. It is the one component the parser reads *inside* a paragraph rather than between them, so the rest of the sentence keeps flowing around it — and the glossed term may still carry emphasis or inline code.'
      },
      source: { code: toSfc([...PROSE_IMPORT, '', MDX_SCRIPT], MDX_MARKUP) }
    }
  }
}
