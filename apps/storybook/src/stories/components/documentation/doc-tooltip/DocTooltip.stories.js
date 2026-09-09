import DocProse from '@aziontech/webkit/doc-prose'
import DocTooltip from '@aziontech/webkit/doc-tooltip'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = [
  "import DocProse from '@aziontech/webkit/doc-prose'",
  "import DocTooltip from '@aziontech/webkit/doc-tooltip'"
]

/** @type {import('@storybook/vue3').Meta<typeof DocTooltip>} */
const meta = {
  title: 'Components/Documentation/DocTooltip',
  component: DocTooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The inline gloss: a term in running prose that carries its own definition, shown when the reader hovers or focuses it. The trigger is a real button marked with a dotted underline, so the definition is reachable by keyboard and not only by pointer. It is not the webkit Tooltip — that is a one-line hover hint on a control, with pointer events off, and it cannot hold a link. A call to action is what splits the contract: without one the panel is a real tooltip describing its trigger; with one it is a small dialog the reader can enter, because a tooltip holding a link is a trap for anyone not using a mouse.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    tip: {
      control: 'text',
      description: 'The definition shown inside the panel.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    headline: {
      control: 'text',
      description: 'Bold lead-in above the definition — usually the term itself.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    cta: {
      control: 'text',
      description: "Label for the panel's call-to-action link. Needs href.",
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    href: {
      control: 'text',
      description: 'Destination for the call-to-action link.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    placement: {
      control: 'inline-radio',
      options: ['top', 'bottom', 'auto'],
      description: "Where the panel opens; 'auto' picks the side with the most room.",
      table: { type: { summary: "'top' | 'bottom' | 'auto'" }, defaultValue: { summary: 'top' } }
    },
    delay: {
      control: 'number',
      description: 'Hover-open delay in milliseconds.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '150' } }
    },
    label: {
      control: 'text',
      description: 'Fallback trigger text when the default slot is empty.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    default: {
      description: 'The glossed term, rendered inline in the sentence.',
      table: { type: { summary: 'slot' } }
    }
  },
  args: {
    tip: 'The build that runs at the edge, close to the people using it.',
    headline: 'Edge Application',
    cta: '',
    href: '',
    placement: 'top',
    delay: 150,
    label: ''
  }
}

export default meta

const DEFAULT_MARKUP = `<DocProse>
  <p>
    Every deploy produces an
    <DocTooltip
      headline="Edge Application"
      tip="The build that runs at the edge, close to the people using it."
    >
      edge application
    </DocTooltip>
    built from your <code>azion.config.js</code>.
  </p>
</DocProse>`

export const Default = {
  render: (args) => ({
    components: { DocProse, DocTooltip },
    setup: () => ({ props: args }),
    template: `<DocProse><p>Every deploy produces an <DocTooltip v-bind="props">edge application</DocTooltip> built from your <code>azion.config.js</code>.</p></DocProse>`
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Hover or Tab to the dotted term to open it. The panel is closed until the reader asks for it — a gloss never opens on its own.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const KINDS_TEMPLATE = `<DocProse>
  <p>
    A passive gloss just defines the term: a
    <DocTooltip
      headline="workload"
      tip="The binding between a domain and the application that answers on it."
    >
      workload
    </DocTooltip>
    is the pairing the deploy creates. Its panel is a real tooltip describing the term.
  </p>
  <p>
    An interactive gloss closes on somewhere to go, so it is a small dialog instead: an
    <DocTooltip
      headline="Edge Application"
      tip="The build that runs at the edge, close to the people using it."
      cta="Read the guide"
      href="/docs/edge-application"
    >
      edge application
    </DocTooltip>
    can be read about at length.
  </p>
</DocProse>`

export const Kinds = {
  render: () => ({ components: { DocProse, DocTooltip }, template: KINDS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The two a11y contracts side by side. The first panel is a `role="tooltip"` and its trigger takes `aria-describedby`; the second carries a link, so it is a `role="dialog"` announced through `aria-expanded`, named by its headline, and enterable with Tab. Tab again from inside it and focus returns to the term.'
      },
      source: { code: toSfc(IMPORT, KINDS_TEMPLATE) }
    }
  }
}
