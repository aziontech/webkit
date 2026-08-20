import DocOnThisPage from '@aziontech/webkit-docs/doc-on-this-page'
import DocPageHeader from '@aziontech/webkit-docs/doc-page-header'
import DocPagination from '@aziontech/webkit-docs/doc-pagination'

import { toSfc } from '../_shared/story-source'

const TOC_IMPORT = "import DocOnThisPage from '@aziontech/webkit-docs/doc-on-this-page'"
const PAGINATION_IMPORT = "import DocPagination from '@aziontech/webkit-docs/doc-pagination'"
const HEADER_IMPORT = "import DocPageHeader from '@aziontech/webkit-docs/doc-page-header'"

const TOC_ITEMS = [
  { id: 'overview', text: 'Overview', depth: 2 },
  { id: 'before-you-start', text: 'Before you start', depth: 2 },
  { id: 'deploy-a-template-via-console', text: 'Deploy a template via Console', depth: 3 },
  { id: 'test-it', text: 'Test it', depth: 3 },
  { id: 'import-a-project-from-github', text: 'Import a project from GitHub', depth: 3 },
  { id: 'test-it-2', text: 'Test it', depth: 3 },
  { id: 'deploy-with-azion-cli', text: 'Deploy with Azion CLI', depth: 2 },
  { id: 'install-the-azion-cli', text: 'Install the Azion CLI', depth: 3 },
  { id: 'link-and-deploy', text: 'Link and deploy', depth: 3 },
  { id: 'test-it-3', text: 'Test it', depth: 3 },
  { id: 'what-you-built', text: 'What you built', depth: 2 },
  { id: 'next-steps', text: 'Next steps', depth: 2 }
]

// The rail's other half: what a reader reaches for once they are done with the page.
// Flush under their own overlines, never indented among the headings — they are peers
// of the outline, not sections of the page.
const TOC_GROUPS = [
  {
    label: 'GitHub',
    links: [
      {
        label: 'Azion Docs',
        href: 'https://github.com/aziontech/azion-docs',
        icon: 'pi pi-github'
      },
      {
        label: 'Contribute to this page',
        href: 'https://github.com/aziontech/azion-docs',
        icon: 'pi pi-pencil'
      }
    ]
  },
  {
    label: 'Community',
    links: [
      { label: 'Join us on Discord', href: 'https://discord.gg/azion', icon: 'pi pi-discord' },
      {
        label: 'Read our blog posts',
        href: 'https://www.azion.com/en/blog/',
        icon: 'pi pi-comment'
      },
      { label: 'Follow us on X', href: 'https://x.com/aziontech', icon: 'ai ai-x' }
    ]
  }
]

/** @type {import('@storybook/vue3').Meta<typeof DocOnThisPage>} */
const meta = {
  title: 'Documentation/Navigation',
  component: DocOnThisPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The three parts that tell a reader where they are and where they can go: the masthead, the "On this page" rail, and the previous/next pair. All three are fed from the page itself — the rail is built from the same headings the body renders, so it can never list a section the page does not have.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    items: { control: false },
    groups: { control: false },
    activeId: { control: 'text' }
  },
  args: { items: TOC_ITEMS, activeId: 'overview', title: 'On this page', groups: TOC_GROUPS }
}

export default meta

const Template = (args) => ({
  components: { DocOnThisPage },
  setup: () => ({ props: args }),
  template: '<div class="w-[225px]"><DocOnThisPage v-bind="props" /></div>'
})

export const OnThisPage = {
  name: 'On this page',
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          "The rail with Overview in view. Level-3 headings indent under the level-2 above them, and the active entry lights its rail segment and its label. Below the outline sit the rail's complementary groups — the repository and the community — flush at its left edge under their own overlines, because they are peers of the outline rather than entries in it."
      },
      source: {
        code: toSfc(
          TOC_IMPORT,
          '<DocOnThisPage\n  :items="headings"\n  :groups="railGroups"\n  active-id="overview"\n/>'
        )
      }
    }
  }
}

const PAGINATION_MARKUP = `<DocPagination
  :previous="{ title: 'Create an account', href: '/start/create-an-account' }"
  :next="{ title: 'Configure a domain', href: '/build/configure-a-domain' }"
/>`

export const Pagination = {
  name: 'Previous and next',
  render: () => ({
    components: { DocPagination },
    setup: () => ({
      previous: { title: 'Create an account', href: '#' },
      next: { title: 'Configure a domain', href: '#' }
    }),
    template: '<DocPagination :previous="previous" :next="next" />'
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The pair that closes a page. A missing neighbour leaves its half empty rather than collapsing the row, so the remaining link stays on its own edge.'
      },
      source: { code: toSfc(PAGINATION_IMPORT, PAGINATION_MARKUP) }
    }
  }
}

const HEADER_MARKUP = `<DocPageHeader
  title="Deploy an application"
  description="By the end of this tutorial, an application will be live on the Azion Web Platform, answering HTTP 200 on its own Azion domain. It takes a few minutes."
  :breadcrumb="[{ label: 'Start', href: '/start' }, { label: 'Deploy an application' }]"
/>`

export const PageHeader = {
  name: 'Page header',
  render: () => ({
    components: { DocPageHeader },
    setup: () => ({
      breadcrumb: [{ label: 'Start', href: '#' }, { label: 'Deploy an application' }]
    }),
    template:
      '<DocPageHeader title="Deploy an application" description="By the end of this tutorial, an application will be live on the Azion Web Platform, answering HTTP 200 on its own Azion domain. It takes a few minutes." :breadcrumb="breadcrumb" />'
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Breadcrumb, title, deck, and the Copy Page split button — whose attached menu hands the page to an assistant as Markdown.'
      },
      source: { code: toSfc(HEADER_IMPORT, HEADER_MARKUP) }
    }
  }
}
