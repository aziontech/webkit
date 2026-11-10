import Button from '@aziontech/webkit/button'
import HelpPanel, {
  HelpPanelHeader,
  HelpPanelLinks,
  HelpPanelSection,
  HelpPanelTask,
  HelpPanelTutorial
} from '@aziontech/webkit/help-panel'
import Link from '@aziontech/webkit/link'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import HelpPanel from '@aziontech/webkit/help-panel'"
const LINK_IMPORT = "import Link from '@aziontech/webkit/link'"
const BUTTON_IMPORT = "import Button from '@aziontech/webkit/button'"

const components = {
  HelpPanel,
  'HelpPanel.Header': HelpPanelHeader,
  'HelpPanel.Section': HelpPanelSection,
  'HelpPanel.Links': HelpPanelLinks,
  'HelpPanel.Tutorial': HelpPanelTutorial,
  'HelpPanel.Task': HelpPanelTask,
  Link,
  Button
}

const meta = {
  title: 'Components/Primitives/Content/HelpPanel',
  component: HelpPanel,
  subcomponents: {
    HelpPanelHeader,
    HelpPanelSection,
    HelpPanelLinks,
    HelpPanelTutorial,
    HelpPanelTask
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The content of a help side region: a topic title, a few sections of short guidance, and the links that leave for the documentation, or, in tutorial mode, an ordered list of tasks with the reader progress through them. It goes inside a side region, not in place of it: the consumer places it in a Drawer or in the page side rail, and that host owns opening, closing and the close button.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the complementary landmark the panel renders.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "'Help'" } }
    },
    loading: {
      control: 'boolean',
      description:
        'Renders skeleton lines in place of the content while the help topic loads; sets aria-busy.',
      table: { category: 'props', type: { summary: 'boolean' }, defaultValue: { summary: 'false' } }
    },
    default: {
      control: false,
      description: 'The panel parts (Header, Section, Tutorial, Links) in reading order.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    }
  },
  args: { ariaLabel: 'Help: Cache settings', loading: false }
}

export default meta

const TOPIC_BODY = `
  <HelpPanel.Header
    title="Cache settings"
    description="How long content stays at the edge before it is fetched again."
  />
  <HelpPanel.Section title="What does the cache TTL control?">
    <p>The TTL sets how many seconds an object is served from the edge before the origin is asked for a fresh copy.</p>
  </HelpPanel.Section>
  <HelpPanel.Section title="When should I bypass the cache?">
    <p>Bypass it for responses that change per user, such as carts and account pages.</p>
  </HelpPanel.Section>
  <HelpPanel.Links>
    <Link label="Cache settings documentation" href="https://www.azion.com/en/documentation/" target="_blank" />
    <Link label="Purging cached content" href="https://www.azion.com/en/documentation/" target="_blank" />
  </HelpPanel.Links>`

const Template = (args) => ({
  components,
  setup: () => ({ args }),
  template: `<div class="max-w-(--container-xs)"><HelpPanel v-bind="args">${TOPIC_BODY}
</HelpPanel></div>`
})

const DEFAULT_MARKUP = `<div class="max-w-(--container-xs)">
<HelpPanel aria-label="Help: Cache settings">${TOPIC_BODY}
</HelpPanel>
</div>`

export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'A help topic: a header, two sections that each answer one question, and the Learn more links at the end.'
      },
      source: { code: toSfc([IMPORT, LINK_IMPORT], DEFAULT_MARKUP) }
    }
  }
}

const TUTORIAL_TEMPLATE = `<div class="max-w-(--container-xs)">
  <HelpPanel aria-label="Help: Get started">
    <HelpPanel.Header
      title="Get started"
      description="Put your first site online."
    />
    <HelpPanel.Tutorial
      title="Put your first site online"
      description="Three tasks, about five minutes."
    >
      <HelpPanel.Task title="Create an application" status="complete">
        Choose a template or start from an empty application.
      </HelpPanel.Task>
      <HelpPanel.Task title="Create a workload" status="current">
        Bind your domain to the application you just created.
      </HelpPanel.Task>
      <HelpPanel.Task title="Point your DNS">
        Add the CNAME record shown on the workload page.
      </HelpPanel.Task>
      <template #actions>
        <Button label="Continue" size="medium" />
      </template>
    </HelpPanel.Tutorial>
  </HelpPanel>
</div>`

export const Tutorial = {
  render: () => ({ components, template: TUTORIAL_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Tutorial mode: three tasks, one complete, one current and one not started, with the progress line derived from them and a Continue action.'
      },
      source: { code: toSfc([IMPORT, BUTTON_IMPORT], TUTORIAL_TEMPLATE) }
    }
  }
}

const LOADING_MARKUP = `<div class="max-w-(--container-xs)">
<HelpPanel aria-label="Help: Cache settings" loading>${TOPIC_BODY}
</HelpPanel>
</div>`

export const Loading = {
  render: Template,
  args: { loading: true },
  parameters: {
    docs: {
      description: {
        story:
          'While the topic loads, skeleton lines reserve the space and the landmark is marked busy.'
      },
      source: { code: toSfc([IMPORT, LINK_IMPORT], LOADING_MARKUP) }
    }
  }
}
