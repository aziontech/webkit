import DocOnThisPage from '@aziontech/webkit/doc-on-this-page'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import DocOnThisPage from '@aziontech/webkit/doc-on-this-page'"

const ITEMS = [
  { id: 'deploy', text: 'Deploy an application', depth: 2 },
  { id: 'what-you-get', text: 'What you get', depth: 3 },
  { id: 'build-command', text: 'Build command', depth: 3 },
  { id: 'bind-a-domain', text: 'Bind a domain', depth: 2 }
]

const GROUPS = [
  {
    label: 'Repository',
    links: [{ label: 'View source', href: 'https://github.com/aziontech', icon: 'pi pi-github' }]
  }
]

/** @type {import('@storybook/vue3').Meta<typeof DocOnThisPage>} */
const meta = {
  title: 'Components/Documentation/DocOnThisPage',
  component: DocOnThisPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The "On this page" rail: the page\'s own headings, the active one lit, nested headings indented under their parent. The rail is a single path that bends inward as the outline nests, and the active marker is a dash cut from that same path — so moving between headings slides the marker along the line, through the bends, instead of jumping a separate bar between two positions. Because both come from one geometry, the marker cannot drift out of register with the rail. It is presentation only: `activeId` is a prop, because the page owns the scroll container and therefore owns which heading is active.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    items: {
      control: 'object',
      description: 'The headings, in document order.',
      table: { type: { summary: 'DocTocItem[]' }, defaultValue: { summary: '[]' } }
    },
    activeId: {
      control: 'text',
      description: 'The id of the heading currently in view.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    title: {
      control: 'text',
      description: "The rail's own heading.",
      table: { type: { summary: 'string' }, defaultValue: { summary: 'On this page' } }
    },
    groups: {
      control: 'object',
      description: 'Complementary groups rendered below the outline, in order.',
      table: { type: { summary: 'DocTocGroup[]' }, defaultValue: { summary: '[]' } }
    },
    onSelect: {
      action: 'select',
      description: 'Fired when a rail entry is activated.',
      table: { type: { summary: '(event: MouseEvent, item: DocTocItem)' } }
    }
  },
  args: { items: ITEMS, activeId: 'what-you-get', title: 'On this page', groups: GROUPS }
}

export default meta

const DEFAULT_MARKUP = `<DocOnThisPage
  :items="[
    { id: 'deploy', text: 'Deploy an application', depth: 2 },
    { id: 'what-you-get', text: 'What you get', depth: 3 },
    { id: 'build-command', text: 'Build command', depth: 3 },
    { id: 'bind-a-domain', text: 'Bind a domain', depth: 2 }
  ]"
  active-id="what-you-get"
  :groups="[
    {
      label: 'Repository',
      links: [{ label: 'View source', href: 'https://github.com/aziontech', icon: 'pi pi-github' }]
    }
  ]"
  @select="(event, item) => scrollToHeading(item.id)"
/>`

export const Default = {
  render: (args) => ({
    components: { DocOnThisPage },
    setup: () => ({ props: args }),
    template: '<div class="max-w-64"><DocOnThisPage v-bind="props" /></div>'
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Change `activeId` in the controls and watch the marker travel along the rail rather than jump — it is a dash cut from the same path the rail draws.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const NESTING_TEMPLATE = `<div class="max-w-64">
  <DocOnThisPage
    :items="[
      { id: 'overview', text: 'Overview', depth: 2 },
      { id: 'templates', text: 'Templates', depth: 3 },
      { id: 'presets', text: 'Framework presets', depth: 3 },
      { id: 'domains', text: 'Domains', depth: 2 },
      { id: 'certificates', text: 'Certificates', depth: 3 }
    ]"
    active-id="presets"
    :groups="[
      {
        label: 'Repository',
        links: [{ label: 'View source', href: 'https://github.com/aziontech', icon: 'pi pi-github' }]
      },
      {
        label: 'Community',
        links: [
          { label: 'Discord', href: 'https://discord.gg', icon: 'pi pi-comments' },
          { label: 'Forum', href: 'https://forum.example', icon: 'pi pi-users' }
        ]
      }
    ]"
  />
</div>`

export const Nesting = {
  name: 'Nesting and groups',
  render: () => ({ components: { DocOnThisPage }, template: NESTING_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The rail bends between levels as the outline nests, and each level change is split into two half-curves meeting exactly on the boundary — which is what makes the marker measurable to the pixel. The complementary groups below are drawn as peers of the outline, not entries in it: no rail, no indent, no marker, and each its own named landmark, so a reader never reads "Discord" as a section of the page.'
      },
      source: { code: toSfc(IMPORT, NESTING_TEMPLATE) }
    }
  }
}
