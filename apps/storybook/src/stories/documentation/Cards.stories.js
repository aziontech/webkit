import DocCard from '@aziontech/webkit-docs/doc-card'
import DocCardGroup from '@aziontech/webkit-docs/doc-card-group'

import { toSfc } from '../_shared/story-source'

const IMPORT = [
  "import DocCard from '@aziontech/webkit-docs/doc-card'",
  "import DocCardGroup from '@aziontech/webkit-docs/doc-card-group'"
]

/** @type {import('@storybook/vue3').Meta<typeof DocCardGroup>} */
const meta = {
  title: 'Documentation/Cards',
  component: DocCardGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The tiles that fan a landing page out into its sections. A card renders as a link when `href` is set and as a plain surface otherwise, so it is never a fake button. The group collapses to one column on a phone whatever `cols` says, unless a set of mark-plus-a-word cells opts into two-up with `mobileCols`.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    cols: { control: { type: 'inline-radio' }, options: [1, 2, 3, 4] },
    mobileCols: { control: { type: 'inline-radio' }, options: [1, 2] }
  },
  args: { cols: 3, mobileCols: 1 }
}

export default meta

const CARDS = `<DocCard
    title="Start from a template"
    icon="pi pi-th-large"
    href="#templates"
  >
    Ready-made projects that go live in a few clicks. No local tooling.
  </DocCard>
  <DocCard
    title="Import from GitHub"
    icon="pi pi-github"
    href="#github"
  >
    Connect a repository and let Azion build it on every push.
  </DocCard>
  <DocCard
    title="Deploy with the CLI"
    icon="pi pi-desktop"
    href="#cli"
  >
    Ship the project already open in your editor.
  </DocCard>`

const Template = (args) => ({
  components: { DocCard, DocCardGroup },
  setup: () => ({ props: args }),
  template: `<DocCardGroup v-bind="props">${CARDS}</DocCardGroup>`
})

export const Default = {
  name: 'Cards',
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Three linked cards — the fan-out at the top of a section index.' },
      source: { code: toSfc(IMPORT, `<DocCardGroup :cols="3">\n  ${CARDS}\n</DocCardGroup>`) }
    }
  }
}

const STATIC_TEMPLATE = `<DocCardGroup :cols="2">
  <DocCard
    title="Workload"
    icon="pi pi-server"
  >
    The unit of deployment: a domain, an edge application, and the locations that serve it.
  </DocCard>
  <DocCard
    title="Edge application"
    icon="pi pi-bolt"
  >
    The build output plus the rules that decide what the edge does with each request.
  </DocCard>
</DocCardGroup>`

export const WithoutLinks = {
  name: 'As definitions',
  render: () => ({
    components: { DocCard, DocCardGroup },
    template: STATIC_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Without `href` a card is a plain surface — useful for defining the terms a page is about to use, where nothing is clickable.'
      },
      source: { code: toSfc(IMPORT, STATIC_TEMPLATE) }
    }
  }
}
