import DocMarkdown from '@aziontech/webkit-docs/doc-markdown'
import DocProse from '@aziontech/webkit-docs/doc-prose'
import DocUpdate from '@aziontech/webkit-docs/doc-update'

import { toSfc } from '../_shared/story-source'

const IMPORT = [
  "import DocProse from '@aziontech/webkit-docs/doc-prose'",
  "import DocUpdate from '@aziontech/webkit-docs/doc-update'"
]
const MDX_IMPORT = [
  "import DocMarkdown from '@aziontech/webkit-docs/doc-markdown'",
  "import DocProse from '@aziontech/webkit-docs/doc-prose'"
]

/** @type {import('@storybook/vue3').Meta<typeof DocUpdate>} */
const meta = {
  title: 'Documentation/Update',
  component: DocUpdate,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'One entry in a changelog — `<Update>` in MDX. The identity of the release sits in the left column (the date, the version under it, the tags under that), the notes sit on the right, and a rule runs between them for the length of the entry and bridges the gap to the next one, so a set of entries reads as one timeline rather than as a stack of boxes. The label is an `h2` and a link to its own id, because every entry is a URL somebody sends: a support reply, a release note, an issue that says "fixed in the March release". It also joins the "On this page" rail, so a changelog navigates by date the way a guide navigates by heading. Mintlify\'s `rss` prop is deliberately absent — this layer renders pages and generates no feed, so the prop would do nothing.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    tags: { control: 'object' },
    anchor: { control: 'text' }
  },
  args: {
    label: 'August 19, 2026',
    description: 'v2.4.0',
    tags: ['Console', 'Edge Functions'],
    anchor: ''
  }
}

export default meta

const Template = (args) => ({
  components: { DocProse, DocUpdate },
  setup: () => ({ props: args }),
  template: `<DocProse>
  <DocUpdate v-bind="props">
    <p>Rules Engine conditions now match on request headers, so a rule can branch on anything the client sends without a function in the path.</p>
  </DocUpdate>
</DocProse>`
})

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
  name: 'Update',
  render: Template,
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
  name: 'A changelog',
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

const SOURCE = `<Update label="August 19, 2026" description="v2.4.0" tags={["Console", "Edge Functions"]}>
  ### Header matching in Rules Engine

  Conditions now match on request headers, so a rule can branch on anything the
  client sends without a function in the path.

  <Note>Existing rules keep working — nothing to migrate.</Note>
</Update>

<Update label="August 5, 2026" description="v2.3.1" tags={["CLI"]}>
  Fixed a crash when \`azion deploy --local\` ran in a workspace whose manifest had
  no function bound.
</Update>
`

const MDX_MARKUP = `<DocProse>
  <DocMarkdown :source="source" />
</DocProse>`

export const FromMdx = {
  name: 'Written as MDX',
  render: () => ({
    components: { DocMarkdown, DocProse },
    setup: () => ({ source: SOURCE }),
    template: MDX_MARKUP
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'How an author writes it. `tags={["Console", "CLI"]}` is the one JSX-shaped value the parser reads — a list of strings, split rather than evaluated. Headings, callouts and code inside an entry are ordinary page content, and a heading there is written one level below the label it sits under. Two entries sharing a label get numbered ids the way two identical headings do.'
      },
      source: { code: toSfc(MDX_IMPORT, MDX_MARKUP) }
    }
  }
}
