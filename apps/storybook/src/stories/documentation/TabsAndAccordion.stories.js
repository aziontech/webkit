import DocAccordionGroup from '@aziontech/webkit-docs/doc-accordion-group'
import DocAccordionItem from '@aziontech/webkit-docs/doc-accordion-item'
import DocTab from '@aziontech/webkit-docs/doc-tab'
import DocTabs from '@aziontech/webkit-docs/doc-tabs'

import { toSfc } from '../_shared/story-source'

const TABS_IMPORT = [
  "import DocTab from '@aziontech/webkit-docs/doc-tab'",
  "import DocTabs from '@aziontech/webkit-docs/doc-tabs'"
]
const ACCORDION_IMPORT = [
  "import DocAccordionGroup from '@aziontech/webkit-docs/doc-accordion-group'",
  "import DocAccordionItem from '@aziontech/webkit-docs/doc-accordion-item'"
]

/** @type {import('@storybook/vue3').Meta<typeof DocTabs>} */
const meta = {
  title: 'Documentation/Tabs and Accordion',
  component: DocTabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "Two ways to fold a page down. Tabs hold alternative paths through the same instruction — pick your platform, and the rest of the page still reads in order. An accordion holds answers a reader may not need — the questions stay visible, the prose stays out of the way. Both are built on webkit (TabView, Accordion), so the strip, the chevron and the keyboard model are the design system's."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {},
  args: {}
}

export default meta

const TABS_TEMPLATE = `<DocTabs>
  <DocTab title="macOS">
    <p>Install with Homebrew: <code>brew install azion</code>.</p>
  </DocTab>
  <DocTab title="Linux">
    <p>Download the binary into <code>/usr/local/bin</code> and mark it executable.</p>
  </DocTab>
  <DocTab title="Windows">
    <p>Install with winget: <code>winget install azion</code>.</p>
  </DocTab>
</DocTabs>`

export const Tabs = {
  name: 'Tabs',
  render: () => ({
    components: { DocTab, DocTabs },
    template: TABS_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Three platforms, one instruction. `DocTabs` reads the `title` off each child to build the strip, so the panels and the tabs cannot drift apart.'
      },
      source: { code: toSfc(TABS_IMPORT, TABS_TEMPLATE) }
    }
  }
}

const ACCORDION_TEMPLATE = `<DocAccordionGroup>
  <DocAccordionItem title="Why is the first request slower than the rest?">
    <p>The first request to a location is a cache miss. Warm-up is per location, not global.</p>
  </DocAccordionItem>
  <DocAccordionItem title="Can I point my own domain at this?">
    <p>Yes — add the domain to the workload and create the CNAME your DNS provider asks for.</p>
  </DocAccordionItem>
  <DocAccordionItem title="What happens to the old version when I deploy again?">
    <p>The workload updates in place. There is no second domain and no cutover.</p>
  </DocAccordionItem>
</DocAccordionGroup>`

export const Accordion = {
  name: 'Accordion',
  render: () => ({
    components: { DocAccordionGroup, DocAccordionItem },
    template: ACCORDION_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The FAQ block. Questions stay scannable; only the answer the reader asked for takes up space.'
      },
      source: { code: toSfc(ACCORDION_IMPORT, ACCORDION_TEMPLATE) }
    }
  }
}
