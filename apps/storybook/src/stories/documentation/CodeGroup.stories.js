import DocCodeGroup from '@aziontech/webkit-docs/doc-code-group'

import { toSfc } from '../_shared/story-source'

const IMPORT = "import DocCodeGroup from '@aziontech/webkit-docs/doc-code-group'"

const SAMPLES = [
  { label: 'npm', language: 'bash', code: 'npx azion link\nnpx azion deploy --local' },
  { label: 'pnpm', language: 'bash', code: 'pnpm dlx azion link\npnpm dlx azion deploy --local' },
  { label: 'yarn', language: 'bash', code: 'yarn dlx azion link\nyarn dlx azion deploy --local' }
]

/** @type {import('@storybook/vue3').Meta<typeof DocCodeGroup>} */
const meta = {
  title: 'Documentation/CodeGroup',
  component: DocCodeGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The same instruction in several languages or package managers, rendered on the webkit CodeBlock so the docs inherit its gutter, copy control and syntax surface. In MDX it is a `<CodeGroup>` wrapping fenced blocks; a lone fence renders through the same component as a single block.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    showLineNumbers: { control: 'boolean' },
    samples: { control: false }
  },
  args: { samples: SAMPLES, showLineNumbers: false }
}

export default meta

const Template = (args) => ({
  components: { DocCodeGroup },
  setup: () => ({ props: args }),
  template: '<DocCodeGroup v-bind="props" />'
})

const GROUP_MARKUP = `<DocCodeGroup
  :samples="[
    { label: 'npm', language: 'bash', code: 'npx azion deploy --local' },
    { label: 'pnpm', language: 'bash', code: 'pnpm dlx azion deploy --local' }
  ]"
/>`

export const Default = {
  name: 'CodeGroup',
  render: Template,
  parameters: {
    docs: {
      description: { story: 'Three package managers, one instruction, one tab strip.' },
      source: { code: toSfc(IMPORT, GROUP_MARKUP) }
    }
  }
}

const SINGLE_MARKUP = `<DocCodeGroup
  :samples="[
    {
      label: 'Terminal',
      language: 'bash',
      fileName: 'Terminal',
      code: 'curl -sSI https://your-workload.map.azionedge.net | head -n 1'
    }
  ]"
  show-line-numbers
/>`

export const SingleSample = {
  name: 'Single block',
  render: () => ({
    components: { DocCodeGroup },
    setup: () => ({
      samples: [
        {
          label: 'Terminal',
          language: 'bash',
          fileName: 'Terminal',
          code: 'curl -sSI https://your-workload.map.azionedge.net | head -n 1'
        }
      ]
    }),
    template: '<DocCodeGroup :samples="samples" show-line-numbers />'
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'One sample with a file name and the line-number gutter — what a plain ```` ```bash title="Terminal" ```` fence compiles to.'
      },
      source: { code: toSfc(IMPORT, SINGLE_MARKUP) }
    }
  }
}
