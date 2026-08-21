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
          "The admonition an author reaches for when a sentence has to interrupt the reading order — `<Note>`, `<Tip>`, `<Check>`, `<Warning>`, `<Danger>`, `<Info>` in MDX. It renders on the webkit Message surface, so the severity color, border, icon and radius are the design system's. The anatomy is a glyph and one row of prose — there is no title row and no `title` prop: a callout interrupts the reading order, so the sentence the reader came for is the first thing in the box. `tip` is the one kind that claims nothing about stakes: it takes the page's own surface and rule and spends its emphasis on the glyph, in Azion orange. A callout body is inline prose; a block that needs its own box belongs outside it."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['note', 'info', 'tip', 'check', 'warning', 'danger']
    }
  },
  args: {
    kind: 'note',
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
  <DocCallout kind="info">Every deploy is atomic: the old version serves every request until the new one is ready.</DocCallout>
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
          'Each kind carries its own severity and icon, so an author picks meaning and never a color. `tip` carries no severity — it keeps the page surface and puts the emphasis in the glyph, in Azion orange, while its copy stays the page ink every other kind speaks in.'
      },
      source: { code: toSfc(IMPORT, KINDS_TEMPLATE) }
    }
  }
}
