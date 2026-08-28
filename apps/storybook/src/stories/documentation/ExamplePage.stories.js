import PAGE_SOURCE from '@aziontech/webkit-docs/content/docs/deploy-an-application.mdx?raw'
import DocPage from '@aziontech/webkit-docs/doc-page'
import DocShell from '@aziontech/webkit-docs/doc-shell'

import { toSfc } from '../_shared/story-source'
import { DOC_NAV, DOC_NEXT, DOC_PREVIOUS, PAGE_BREADCRUMB } from './_fixtures/nav'

const IMPORT = [
  "import DocPage from '@aziontech/webkit-docs/doc-page'",
  "import source from './deploy-an-application.mdx?raw'"
]

// The page's action belt: one entry per thing a reader can do with the page, each with the
// sentence its two-word label has no room for. An entry with an href is a real anchor.
const PAGE_ACTIONS = [
  {
    value: 'copy',
    label: 'Copy as Markdown',
    icon: 'pi pi-copy',
    tip: 'Copy this page as Markdown, ready to paste into an assistant.'
  },
  {
    value: 'markdown',
    label: 'View as Markdown',
    icon: 'pi pi-eye',
    tip: 'Open this page as plain Markdown in a new tab.'
  },
  {
    value: 'agent-setup',
    label: 'Agent setup',
    icon: 'pi pi-microchip-ai',
    href: '/docs/agent-setup',
    tip: 'Set up your coding agent to build on Azion.'
  }
]

/** @type {import('@storybook/vue3').Meta<typeof DocPage>} */
const meta = {
  title: 'Documentation/Example Page',
  component: DocPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'One `.mdx` file rendered end to end. The masthead, the "On this page" rail, the numbered steps, the callouts, the tabbed code and the previous/next pair all come from that single file — the author wrote markdown and component tags, and never a class or a token. This is the docs.azion.com page frame, assembled from the layer.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    source: { control: false, table: { type: { summary: 'string' } } },
    showToc: { control: 'boolean' },
    metaActions: { control: false, table: { type: { summary: 'DocPageAction[]' } } }
  },
  args: {
    source: PAGE_SOURCE,
    breadcrumb: PAGE_BREADCRUMB,
    previous: DOC_PREVIOUS,
    next: DOC_NEXT,
    showToc: true,
    metaActions: PAGE_ACTIONS
  }
}

export default meta

const Template = (args) => ({
  components: { DocPage },
  setup: () => ({ props: args }),
  template: '<div class="h-screen"><DocPage v-bind="props" /></div>'
})

const PAGE_MARKUP = `<div class="h-screen">
  <DocPage
    :source="source"
    :breadcrumb="[{ label: 'Build', href: '/build' }, { label: 'Deploy an application' }]"
    :previous="{ title: 'Create an account', href: '/start/create-an-account' }"
    :next="{ title: 'Configure a domain', href: '/build/configure-a-domain' }"
    :meta-actions="[
      { value: 'copy', label: 'Copy as Markdown', icon: 'pi pi-copy', tip: 'Copy this page as Markdown, ready to paste into an assistant.' },
      { value: 'markdown', label: 'View as Markdown', icon: 'pi pi-eye', tip: 'Open this page as plain Markdown in a new tab.' },
      { value: 'agent-setup', label: 'Agent setup', icon: 'pi pi-microchip-ai', href: '/docs/agent-setup', tip: 'Set up your coding agent to build on Azion.' }
    ]"
  />
</div>`

export const Default = {
  name: 'Page',
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          "The page as a reader sees it: breadcrumb, title, the deck, the meta line with the page's own actions, the body, and the rail tracking the heading in view."
      },
      source: { code: toSfc(IMPORT, PAGE_MARKUP) }
    }
  }
}

const SHELL_MARKUP = `<DocShell
  :source="source"
  :nav="nav"
  :breadcrumb="[{ label: 'Build', href: '/build' }, { label: 'Deploy an application' }]"
  :previous="{ title: 'Create an account', href: '/start/create-an-account' }"
  :next="{ title: 'Configure a domain', href: '/build/configure-a-domain' }"
/>`

export const WithNavigation = {
  name: 'Full shell',
  render: () => ({
    components: { DocShell },
    setup: () => ({
      source: PAGE_SOURCE,
      nav: DOC_NAV,
      breadcrumb: PAGE_BREADCRUMB,
      previous: DOC_PREVIOUS,
      next: DOC_NEXT
    }),
    template:
      '<DocShell :source="source" :nav="nav" :breadcrumb="breadcrumb" :previous="previous" :next="next" />'
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The same page inside the documentation shell: the search rail, the section tree, and the theme control the site frame owns.'
      },
      source: {
        code: toSfc(
          [
            "import DocShell from '@aziontech/webkit-docs/doc-shell'",
            "import source from './deploy-an-application.mdx?raw'"
          ],
          SHELL_MARKUP
        )
      }
    }
  }
}

export const WithoutToc = {
  name: 'No rail',
  render: Template,
  args: { showToc: false, metaActions: [] },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A short page — a changelog entry, a reference stub — where a rail would list one heading and there is nothing worth handing an assistant, so the meta line carries the date alone.'
      },
      source: {
        code: toSfc(
          IMPORT,
          '<div class="h-screen">\n  <DocPage :source="source" :show-toc="false" />\n</div>'
        )
      }
    }
  }
}
