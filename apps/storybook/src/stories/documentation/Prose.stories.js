import DocMarkdown from '@aziontech/webkit-docs/doc-markdown'
import DocProse from '@aziontech/webkit-docs/doc-prose'

import { toSfc } from '../_shared/story-source'

/*
 * The snippet imports the page's markdown the way a docs site does — one `.mdx` file read
 * as a raw string — so what the panel shows is paste-and-run rather than a `source` that
 * appears from nowhere. The stories below hold that markdown inline instead, because a
 * story cannot ship a file alongside itself.
 */
const IMPORT = [
  "import DocMarkdown from '@aziontech/webkit-docs/doc-markdown'",
  "import DocProse from '@aziontech/webkit-docs/doc-prose'",
  "import source from './deploy-an-application.mdx?raw'"
]

const PROSE_IMPORT = "import DocProse from '@aziontech/webkit-docs/doc-prose'"

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
          "The typography contract every page inherits. MDX text compiles to plain semantic HTML, and this container is what gives that HTML the Azion type scale, the semantic colors and the vertical rhythm. The in-content ladder is static — 32px above a section heading, 24px above a sub-section or a block, 16px between flowing blocks — and reads the same at every width; only a section heading opens further, to 48px, on the widest screens. An author writes markdown; the tokens are applied for them. Authored content starts at `h2`: the page title is the masthead's `h1` and is chrome, not content."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {},
  args: {}
}

export default meta

/*
 * Every block element the container styles, in one page: headings h2 to h4, paragraphs,
 * both list kinds (one nested), a table, a blockquote, a rule and a fenced block — plus the
 * inline vocabulary running through them (links, code, emphasis, and a `Tooltip` gloss).
 * None of it carries a class.
 *
 * ONE LINE PER LIST ITEM. A list ends at the first line that is not an item, and there is no
 * lazy continuation: an item wrapped across two source lines loses its second line to a
 * paragraph of its own, and so does an indented paragraph under an item. A paragraph, by
 * contrast, joins its wrapped lines — which is why the copy above is wrapped and the items
 * are not.
 */
const SAMPLE = `## Deploy an application

Templates are ready-made projects (e-commerce, blogs, APIs, full-stack SSR) that go live in
a few clicks. You don't need any local tooling: the [template's guide](https://www.azion.com/en/documentation/)
lists what each one needs, and \`azion.config.js\` is written for you. Deploying builds your
project and publishes it to every <Tooltip tip="A point of presence that runs your code and answers requests close to the people making them.">edge location</Tooltip> at once.

### What you get

- A **workload** bound to its own Azion domain
- An edge application built from your \`azion.config.js\`, including:
  - the build output, uploaded as static assets
  - the runtime function, if the preset declares one
- A certificate issued and renewed for you, bound to the *workload* not to the deploy

1. Pick a template from the [marketplace](/marketplace)
2. Fill in the fields it asks for
3. Deploy, then watch the build log until the domain answers

### The fields a preset asks for

| Field | What it does | Required | Default |
| :--- | :--- | :---: | ---: |
| \`Framework preset\` | Chooses the build convention | Yes | Detected |
| \`Build command\` | Runs on every deploy | No | The preset's own |
| \`Root directory\` | Where the build starts, for a [monorepo](/build/monorepos) | No | \`/\` |

A paragraph directly after a block opens on the block's own step rather than the paragraph
step, so a table and the sentence explaining it read as one unit instead of two.

> The first request to a location is a cache miss, and warm-up is per location rather than
> global.
>
> A benchmark run from one city therefore says nothing about the second city's first
> request. Measure from where your readers are.

#### Build command

An h4 is a label inside a section rather than a new section, so it shares the base gap of
the prose around it and carries its level on weight instead. Use it for the parts of a
procedure — a flag, a field, a file — that a reader scans for but never links to.

---

\`\`\`bash title="Terminal" lineNumbers
npx azion deploy --local
npx azion logs --tail
\`\`\``

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
          'The full vocabulary in one page: `h2`–`h4`, paragraphs, internal and external links, inline code, bold and italic, a glossed term, both list kinds (one nested two levels deep), an aligned table, a paragraph that follows a block, a two-paragraph blockquote, a rule and a titled fenced block with line numbers. Every one of them is plain markdown — the author writes text, and the container applies the tokens.'
      },
      source: {
        code: toSfc(IMPORT, '<DocProse>\n  <DocMarkdown :source="source" />\n</DocProse>')
      }
    }
  }
}

/*
 * A markdown table IS a webkit Table — same surface, same rule, same cell metrics — so a
 * spec's table and a console's table are one object to the reader. The delimiter row sets
 * per-column alignment, and cells take the full inline vocabulary.
 */
const TABLE_SAMPLE = `| Rule | What it fixes | Blocking | Since |
| :--- | :--- | :---: | ---: |
| [\`prop-vocabulary\`](/rules/prop-vocabulary) | One **name**, type and default per concept | Yes | \`4.2.0\` |
| [\`styling\`](/rules/styling) | Classes on the root, variants on \`data-*\` | Yes | \`4.0.0\` |
| [\`testing\`](/rules/testing) | One \`*.test.ts\` per component, in a *real* browser | Yes | \`5.1.0\` |

Alignment is the delimiter row's: \`:---\` starts a column, \`:---:\` centres it, \`---:\` ends
it. A numeric or version column ends right so its digits line up; everything else starts.`

export const Tables = {
  name: 'Tables',
  render: () => ({
    components: { DocMarkdown, DocProse },
    setup: () => ({ source: TABLE_SAMPLE }),
    template: '<DocProse><DocMarkdown :source="source" /></DocProse>'
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The three alignments, and cells carrying links, inline code, bold and italic — the same inline renderer a paragraph uses, so a link in a cell is the link in a sentence. The table scrolls inside its own box on a narrow screen rather than widening the page, and its rules live on the cells so the last row leaves the rounded corner clean.'
      },
      source: {
        code: toSfc(IMPORT, '<DocProse>\n  <DocMarkdown :source="source" />\n</DocProse>')
      }
    }
  }
}

/*
 * The inline half: what a sentence can carry. A gloss takes two shapes — a passive
 * `role="tooltip"` when it only defines a term, and a small `role="dialog"` the reader can
 * enter when it carries a link, because a tooltip holding a link is a trap for anyone not
 * using a mouse.
 */
const INLINE_SAMPLE = `### Inline

A sentence carries **bold**, *italic*, \`inline code\` — click a code chip to copy it — and
two kinds of link: one that stays in the documentation, like [the rules index](/rules), and
one that leaves it, like [the Azion docs](https://www.azion.com/en/documentation/), which
opens in a new tab and carries \`rel="noreferrer"\` without the author asking.

A term the reader may not know is glossed where it appears, never in a footnote: a
<Tooltip tip="The set of tokens, components and rules a product's interface is built from.">design system</Tooltip>
defines it in place, a <Tooltip headline="Workload" tip="The deployable unit that binds an application to a domain, a certificate and a set of rules.">workload</Tooltip>
adds the term as a headline above the definition, and an
<Tooltip headline="Edge function" tip="JavaScript that runs on the request path, at the location that answers it." cta="Read the guide" href="https://www.azion.com/en/documentation/">edge function</Tooltip>
carries a link the reader can travel to.

A glossed term is a real \`button\`, marked with a dotted underline the way print has marked
one for a century: it opens on hover, on focus and on click, so a definition is never
mouse-only.`

export const Inline = {
  name: 'Inline and tooltips',
  render: () => ({
    components: { DocMarkdown, DocProse },
    setup: () => ({ source: INLINE_SAMPLE }),
    template: '<DocProse><DocMarkdown :source="source" /></DocProse>'
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Bold, italic, code spans, internal and external links, and the three shapes of a gloss: definition only, definition under its term, and definition plus a call to action. The first two are a `role="tooltip"` describing their trigger; the third is a small `role="dialog"` announced through `aria-expanded`, because a link the keyboard cannot reach is worse than no link. An external link gets `target="_blank"` and `rel="noreferrer"` from the renderer, not from the author.'
      },
      source: {
        code: toSfc(IMPORT, '<DocProse>\n  <DocMarkdown :source="source" />\n</DocProse>')
      }
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
      source: { code: toSfc(PROSE_IMPORT, HTML_MARKUP) }
    }
  }
}
