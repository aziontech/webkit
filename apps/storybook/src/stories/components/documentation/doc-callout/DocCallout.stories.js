import DocCallout from '@aziontech/webkit/doc-callout'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import DocCallout from '@aziontech/webkit/doc-callout'"

/** @type {import('@storybook/vue3').Meta<typeof DocCallout>} */
const meta = {
  title: 'Components/Documentation/DocCallout',
  component: DocCallout,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "The admonition a documentation page interrupts itself with, rendered on the webkit Message surface so the severity colour, border, icon and radius come from the design system. The anatomy is a glyph and a column of prose — a sentence, or a few short paragraphs and a list — and there is no title row and no `title` prop, because the name repeated what the glyph and the tint already say and pushed the sentence the reader came for further down the box. One kind carries no severity: `tip` takes the page's own surface and rule and spends its whole emphasis on the glyph, in `--primary`."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['note', 'info', 'tip', 'check', 'warning', 'danger'],
      description: 'Which admonition this is; drives the severity color and the icon.',
      table: {
        type: { summary: "'note' | 'info' | 'tip' | 'check' | 'warning' | 'danger'" },
        defaultValue: { summary: 'note' }
      }
    },
    label: {
      control: 'text',
      description: 'Fallback copy when the default slot is empty.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    default: {
      description:
        'The callout copy: prose with links and inline code, or paragraphs and a list, laid out by the callout since DocProse stops at its edge.',
      table: { type: { summary: 'slot' } }
    }
  },
  args: { kind: 'note', label: '' }
}

export default meta

const DEFAULT_MARKUP = `<DocCallout kind="note">
  The first request to a location is a cache miss. Warm-up is per location, not global.
</DocCallout>`

export const Default = {
  render: (args) => ({
    components: { DocCallout },
    setup: () => ({ props: args }),
    template: `<DocCallout v-bind="props">The first request to a location is a cache miss. Warm-up is per location, not global.</DocCallout>`
  }),
  parameters: {
    docs: {
      description: {
        story: 'One row of prose beside the glyph — the whole component, for every kind.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const KINDS_TEMPLATE = `<div class="flex flex-col gap-(--spacing-md)">
  <DocCallout kind="note">A neutral aside the reader should not skip.</DocCallout>
  <DocCallout kind="info">Background that explains why the step exists.</DocCallout>
  <DocCallout kind="tip">Run <code>azion deploy --local</code> to skip the remote install.</DocCallout>
  <DocCallout kind="check">The certificate is issued and renews on its own.</DocCallout>
  <DocCallout kind="warning">Changing the preset rebuilds every function in the workload.</DocCallout>
  <DocCallout kind="danger">Deleting a workload releases its domain and cannot be undone.</DocCallout>
</div>`

const PROSE_MARKUP = `<DocCallout kind="warning">
  <p>Certificates cross-signed by the retired root stop validating on older devices. It will be necessary to take the following actions:</p>
  <ul>
    <li><strong>Certificates on the retired chain</strong>: migrate to the new chain or to an Azion certificate.</li>
    <li><strong>Other certificates</strong>: no action needed; they are unaffected.</li>
  </ul>
</DocCallout>`

export const Prose = {
  render: () => ({ components: { DocCallout }, template: PROSE_MARKUP }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A paragraph followed by a list. The copy region is a flow container, so block markup arriving from a server render stays inside the box instead of being pushed beside it, and the callout lays out the rhythm itself because DocProse stops at its edge.'
      },
      source: { code: toSfc(IMPORT, PROSE_MARKUP) }
    }
  }
}

export const Kinds = {
  render: () => ({ components: { DocCallout }, template: KINDS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "The six kinds together. Five carry a severity — they say something about the copy's stakes — and `tip` carries none: it takes the page's own surface and rule so a friendly shortcut is not painted the same green as a confirmed success."
      },
      source: { code: toSfc(IMPORT, KINDS_TEMPLATE) }
    }
  }
}
