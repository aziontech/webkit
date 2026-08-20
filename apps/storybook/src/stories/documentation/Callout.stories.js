import DocCallout from '@aziontech/webkit-docs/doc-callout'

import { toSfc } from '../_shared/story-source'

const IMPORT = "import DocCallout from '@aziontech/webkit-docs/doc-callout'"

/** @type {import('@storybook/vue3').Meta<typeof DocCallout>} */
const meta = {
  title: 'Documentation/Callout',
  component: DocCallout,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "The admonition an author reaches for when a sentence has to interrupt the reading order — `<Note>`, `<Tip>`, `<Check>`, `<Warning>`, `<Danger>`, `<Info>` in MDX. It renders on the webkit Message surface, so the severity color, border, icon and radius are the design system's. The anatomy is a title row and then the copy: the kind names itself — Note, Tip, Warning — so the reader decides whether the aside is for them before reading it, and `title` replaces that name when the author has something sharper to say. `tip` and `highlight` are the kinds that claim nothing about stakes: they take the page's own surface and rule and spend their emphasis on the glyph, in Azion orange. A callout body is inline prose; a block that needs its own box belongs outside it."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['note', 'info', 'tip', 'check', 'warning', 'danger', 'highlight']
    },
    title: { control: 'text' }
  },
  args: {
    kind: 'note',
    title: '',
    label: ''
  }
}

export default meta

const Template = (args) => ({
  components: { DocCallout },
  setup: () => ({ props: args }),
  template:
    '<DocCallout v-bind="props">Some templates are integrated with third-party services, so you may need to create accounts or generate tokens before deploying.</DocCallout>'
})

export const Default = {
  name: 'Callout',
  render: Template,
  parameters: {
    docs: {
      description: { story: 'The default Note, as the docs frame specifies it.' },
      source: {
        code: toSfc(
          IMPORT,
          '<DocCallout kind="note">Some templates are integrated with third-party services, so you may need to create accounts or generate tokens before deploying.</DocCallout>'
        )
      }
    }
  }
}

const KINDS_TEMPLATE = `<div class="flex flex-col gap-(--spacing-md)">
  <DocCallout kind="note">Templates integrated with GitHub ask you to connect your account first.</DocCallout>
  <DocCallout kind="tip">Pass <code>--local</code> when your project uses workspace dependencies.</DocCallout>
  <DocCallout kind="check">The deploy is live once the domain answers <code>200</code>.</DocCallout>
  <DocCallout kind="warning">Deleting a workload releases its domain immediately.</DocCallout>
  <DocCallout kind="danger">Rotating the token invalidates every running CI job.</DocCallout>
  <DocCallout kind="highlight">Every deploy is atomic: the old version serves every request until the new one is ready.</DocCallout>
</div>`

export const Kinds = {
  name: 'Kinds',
  render: () => ({
    components: { DocCallout },
    template: KINDS_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Each kind carries its own severity, icon and name, so an author picks meaning and never a color. `tip` and `highlight` carry no severity — they keep the page surface, put the emphasis in the glyph, and speak their copy in muted ink.'
      },
      source: { code: toSfc(IMPORT, KINDS_TEMPLATE) }
    }
  }
}

const TITLE_TEMPLATE = `<div class="flex flex-col gap-(--spacing-md)">
  <DocCallout kind="warning" title="Before you delete">
    Anything pointing at that domain stops resolving as soon as the deletion completes.
  </DocCallout>
  <DocCallout kind="highlight" title="Atomic by default">
    The old version serves every request until the new one is ready, so a deploy never shows a half-built site.
  </DocCallout>
</div>`

export const WithTitle = {
  name: 'With a title',
  render: () => ({
    components: { DocCallout },
    template: TITLE_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "A passed `title` replaces the kind's own name in the same row; reach for one when it says something sharper than `Note` or `Warning`. `highlight` is the one kind with no name of its own, so it shows a title only when the author writes one."
      },
      source: { code: toSfc(IMPORT, TITLE_TEMPLATE) }
    }
  }
}
