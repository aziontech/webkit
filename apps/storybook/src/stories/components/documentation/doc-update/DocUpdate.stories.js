import DocProse from '@aziontech/webkit/doc-prose'
import DocUpdate from '@aziontech/webkit/doc-update'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = [
  "import DocProse from '@aziontech/webkit/doc-prose'",
  "import DocUpdate from '@aziontech/webkit/doc-update'"
]

/** @type {import('@storybook/vue3').Meta<typeof DocUpdate>} */
const meta = {
  title: 'Components/Documentation/DocUpdate',
  component: DocUpdate,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'One entry in a changelog. The identity of the release sits in the left column — the date, the version under it, the tags under that — the notes sit on the right, and a rule runs between them for the length of the entry and bridges the gap to the next one, so a set of entries reads as one timeline rather than a stack of boxes. The label is an `h2` and a link to its own id — slugified from the label, or taken from the `anchor` prop when two entries share a label — because every entry is a URL somebody sends: a support reply, a release note, an issue that says "fixed in the March release". Rendered inside a page that provides its scroller-aware heading navigation, the label jump goes through it; outside one it degrades to native hash navigation.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    label: {
      control: 'text',
      description: "The entry's name — a date, a release name. Also its anchor.",
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    description: {
      control: 'text',
      description: 'Secondary line under the label; usually the version.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    tags: {
      control: 'object',
      description: 'Short labels categorising the entry: a product, an area, a kind of change.',
      table: { type: { summary: 'string[]' }, defaultValue: { summary: '[]' } }
    },
    anchor: {
      control: 'text',
      description: 'Anchor override; wins over the slug derived from the label.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    default: {
      description: 'The release notes: prose, lists, code, or any documentation component.',
      table: { type: { summary: 'slot' } }
    }
  },
  args: {
    label: 'August 19, 2026',
    description: 'v2.4.0',
    tags: ['Console', 'Edge Functions'],
    anchor: ''
  }
}

export default meta

const DEFAULT_MARKUP = `<DocProse>
  <DocUpdate
    label="August 19, 2026"
    description="v2.4.0"
    :tags="['Console', 'Edge Functions']"
  >
    <p>Rules Engine conditions now match on request headers, so a rule can branch on anything the client sends without a function in the path.</p>
  </DocUpdate>
</DocProse>`

export const Default = {
  render: (args) => ({
    components: { DocProse, DocUpdate },
    setup: () => ({ props: args }),
    template: `<DocProse>
  <DocUpdate v-bind="props">
    <p>Rules Engine conditions now match on request headers, so a rule can branch on anything the client sends without a function in the path.</p>
  </DocUpdate>
</DocProse>`
  }),
  parameters: {
    docs: {
      description: {
        story:
          "A single entry: label, version, tags, notes. Hover the label to reveal the chain glyph — it links to the entry's own id, slugified from the label."
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const CHANGELOG_MARKUP = `<DocProse>
  <DocUpdate
    label="August 19, 2026"
    description="v2.4.0"
    :tags="['Console', 'Edge Functions']"
  >
    <h3>Header matching in Rules Engine</h3>
    <p>Conditions now match on request headers, so a rule can branch on anything the client sends without a function in the path.</p>
    <ul>
      <li>New criteria: <code>request.headers</code> and <code>response.headers</code>.</li>
      <li>Existing rules keep working — nothing to migrate.</li>
    </ul>
  </DocUpdate>
  <DocUpdate
    label="August 5, 2026"
    description="v2.3.1"
    :tags="['CLI']"
  >
    <p>Fixed a crash when <code>azion deploy --local</code> ran in a workspace whose manifest had no function bound.</p>
  </DocUpdate>
  <DocUpdate
    label="July 28, 2026"
    description="v2.3.0"
    :tags="['API', 'Storage']"
  >
    <p>Object Storage buckets can be created and listed from the API, with pagination on every collection endpoint.</p>
  </DocUpdate>
</DocProse>`

export const Changelog = {
  render: () => ({
    components: { DocProse, DocUpdate },
    template: CHANGELOG_MARKUP
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Three entries in a row, newest first. The rule between the columns runs through the 24px block gap, so consecutive entries read as one continuous timeline; the first entry does not extend upward, which is what keeps the line from starting above the changelog. Below `md` the layout stacks and the rule drops — a phone has no room for a second column.'
      },
      source: { code: toSfc(IMPORT, CHANGELOG_MARKUP) }
    }
  }
}
