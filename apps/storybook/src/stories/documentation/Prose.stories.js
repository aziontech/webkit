import DocMarkdown from '@aziontech/webkit-docs/doc-markdown'
import DocProse from '@aziontech/webkit-docs/doc-prose'

import { toSfc } from '../_shared/story-source'

const IMPORT = [
  "import DocMarkdown from '@aziontech/webkit-docs/doc-markdown'",
  "import DocProse from '@aziontech/webkit-docs/doc-prose'"
]

/** @type {import('@storybook/vue3').Meta<typeof DocProse>} */
const meta = {
  title: 'Documentation/Prose',
  component: DocProse,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The typography contract every page inherits. MDX text compiles to plain semantic HTML, and this container is what gives that HTML the Azion type scale, the semantic colors and the vertical rhythm. The in-content ladder is static — 32px above a section heading, 24px above a sub-section or a block, 16px between flowing blocks — and reads the same at every width; only a section heading opens further, to 48px, on the widest screens. An author writes markdown; the tokens are applied for them.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {},
  args: {}
}

export default meta

const SAMPLE = `## Deploy an application

Templates are ready-made projects (e-commerce, blogs, APIs, full-stack SSR) that go live in
a few clicks. You don't need any local tooling, and the [template's guide](https://www.azion.com/en/documentation/)
lists what each one needs.

### What you get

- A **workload** bound to its own Azion domain
- An edge application built from your \`azion.config.js\`
- A certificate issued and renewed for you

1. Pick a template
2. Fill in the fields it asks for
3. Deploy

| Field | What it does | Default |
| --- | --- | --- |
| \`Framework preset\` | Chooses the build convention | Detected |
| \`Build command\` | Runs on every deploy | Preset's own |

> The first request to a location is a cache miss. Warm-up is per location, not global.

#### Build command

An h4 is a label inside a section rather than a new section, so it shares the base gap of the
prose around it and carries its level on weight instead.

---

\`\`\`bash title="Terminal"
npx azion deploy --local
\`\`\``

const PROSE_MARKUP = `<DocProse>
  <DocMarkdown :source="source" />
</DocProse>`

export const Default = {
  name: 'Prose',
  render: () => ({
    components: { DocMarkdown, DocProse },
    setup: () => ({ source: SAMPLE }),
    template: '<DocProse><DocMarkdown :source="source" /></DocProse>'
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Headings, paragraphs, links, inline code, both list kinds, a table, a blockquote and a fenced block — all of it plain markdown, none of it carrying a class.'
      },
      source: { code: toSfc(IMPORT, PROSE_MARKUP) }
    }
  }
}

const HTML_MARKUP = `<DocProse>
  <h2>Rendered from raw HTML</h2>
  <p>The container styles its descendants, so any pipeline that emits semantic HTML —
  markdown, MDX, or a CMS — lands on the same type scale.</p>
  <ul>
    <li>No wrapper classes on the elements</li>
    <li>No per-page overrides</li>
  </ul>
</DocProse>`

export const RawHtml = {
  name: 'Over raw HTML',
  render: () => ({
    components: { DocProse },
    template: HTML_MARKUP
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The same contract over hand-written markup: `DocProse` styles descendants rather than itself, so it is not tied to the MDX renderer.'
      },
      source: {
        code: toSfc("import DocProse from '@aziontech/webkit-docs/doc-prose'", HTML_MARKUP)
      }
    }
  }
}
