import DocProse from '@aziontech/webkit/doc-prose'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import DocProse from '@aziontech/webkit/doc-prose'"

/** @type {import('@storybook/vue3').Meta<typeof DocProse>} */
const meta = {
  title: 'Components/Documentation/DocProse',
  component: DocProse,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The typography contract every documentation page inherits. A markdown or MDX pipeline compiles text to plain semantic HTML, and this container is what gives that HTML the Azion type scale, the semantic colors and the vertical rhythm. The in-content ladder is static — 32px above a section heading, 24px above a sub-section or a block, 16px between flowing blocks — and reads the same at every width; only a section heading opens further, to 48px, on the widest screens. An author writes markdown; the tokens are applied for them. It has no measure of its own: the consumer caps the reading column with `.layout-column-docs`.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {},
  args: {}
}

export default meta

const LADDER_MARKUP = `<DocProse>
  <h2>Deploy an application</h2>
  <p>
    Templates are ready-made projects that go live in a few clicks. You don't need any local
    tooling, and the <a href="https://www.azion.com/en/documentation/">template's guide</a> lists
    what each one needs.
  </p>
  <h3>What you get</h3>
  <ul>
    <li>A <strong>workload</strong> bound to its own Azion domain</li>
    <li>An edge application built from your <code>azion.config.js</code></li>
    <li>A certificate issued and renewed for you</li>
  </ul>
  <ol>
    <li>Pick a template</li>
    <li>Fill in the fields it asks for</li>
    <li>Deploy</li>
  </ol>
  <blockquote>
    <p>The first request to a location is a cache miss. Warm-up is per location, not global.</p>
  </blockquote>
  <h4>Build command</h4>
  <p>
    An h4 is a label inside a section rather than a new section, so it shares the base gap of the
    prose around it and carries its level on weight instead.
  </p>
  <hr />
  <p>A section break above resets the reader before the next part of the page.</p>
</DocProse>`

export const Default = {
  name: 'DocProse',
  render: () => ({ components: { DocProse }, template: LADDER_MARKUP }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Headings, paragraphs, links, inline code, both list kinds, a blockquote and a section rule — all of it plain semantic HTML, none of it carrying a class. The markup is hand-written here, which is also the proof that the contract is not tied to any renderer.'
      },
      source: { code: toSfc(IMPORT, LADDER_MARKUP) }
    }
  }
}

const CHROME_MARKUP = `<DocProse>
  <h2>The contract stops at a component's edge</h2>
  <p>This paragraph is authored prose, so it takes the prose rung and the prose ink.</p>
  <div data-doc-chrome>
    <h2>A component's own heading</h2>
    <p>A component's own copy keeps whatever that component gives it.</p>
  </div>
  <p>And prose after the component picks the ladder back up.</p>
</DocProse>`

export const ChromeBoundary = {
  name: 'Chrome boundary',
  render: () => ({ components: { DocProse }, template: CHROME_MARKUP }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`DocProse` styles descendants, so without a guard it would restyle the internals of every documentation component sitting in the prose — a callout body, a code block’s lines, an accordion trigger’s heading. Every prose rule carries `:not([data-doc-chrome],[data-doc-chrome]_*)`, so a subtree marked `data-doc-chrome` is left alone while the prose around it is not.'
      },
      source: { code: toSfc(IMPORT, CHROME_MARKUP) }
    }
  }
}
