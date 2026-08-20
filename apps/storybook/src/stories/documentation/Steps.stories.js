import DocStep from '@aziontech/webkit-docs/doc-step'
import DocSteps from '@aziontech/webkit-docs/doc-steps'

import { toSfc } from '../_shared/story-source'

const IMPORT = [
  "import DocStep from '@aziontech/webkit-docs/doc-step'",
  "import DocSteps from '@aziontech/webkit-docs/doc-steps'"
]

/** @type {import('@storybook/vue3').Meta<typeof DocSteps>} */
const meta = {
  title: 'Documentation/Steps',
  component: DocSteps,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The ordered walkthrough from the docs frame: circled indices joined by a rail. `DocSteps` reads its own children to number them and to drop the connector on the last one, so an author writes `<Step title="…">` and reordering the MDX renumbers the page.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {},
  args: {}
}

export default meta

const STEPS_TEMPLATE = `<DocSteps>
  <DocStep title="Access Azion Console." />
  <DocStep title="Click + Create on the homepage." />
  <DocStep title="Select your preferred template to start your project." />
  <DocStep title="Fill in the fields the template asks for." />
  <DocStep title="Customize the elements using the sidebar tools." />
</DocSteps>`

export const Default = {
  name: 'Steps',
  render: () => ({
    components: { DocStep, DocSteps },
    template: STEPS_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: { story: 'Five titled steps — the shape the docs frame specifies.' },
      source: { code: toSfc(IMPORT, STEPS_TEMPLATE) }
    }
  }
}

const BODY_TEMPLATE = `<DocSteps>
  <DocStep title="Install the Azion CLI">
    <p>Homebrew is the shortest path on macOS; every other platform is documented in the CLI reference.</p>
  </DocStep>
  <DocStep title="Link the project">
    <p>Reads your project, picks a preset, and writes the <code>azion/</code> folder that describes the workload.</p>
  </DocStep>
  <DocStep title="Deploy" />
</DocSteps>`

export const WithBody = {
  name: 'With step content',
  render: () => ({
    components: { DocStep, DocSteps },
    template: BODY_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A step can carry anything under its heading — prose, a code block, another component — and the rail stretches to cover it.'
      },
      source: { code: toSfc(IMPORT, BODY_TEMPLATE) }
    }
  }
}
