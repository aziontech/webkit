import SubjectLibrary from '@aziontech/webkit/subject-library'

import { toSfc } from '../../../../_shared/story-source'
import { SITE_SECTION } from '../../../../templates/marketing/_sections/subject-library'

const IMPORT = "import SubjectLibrary from '@aziontech/webkit/subject-library'"

/** @type {import('@storybook/vue3').Meta<typeof SubjectLibrary>} */
const meta = {
  title: 'Components/Marketing/Sections/SubjectLibrary',
  component: SubjectLibrary,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          "A library of learning subjects in a divider grid: each subject is one framed card with its name, what it covers and a list of its article links, and an optional closing call to action spans the grid's last two cells so the grid ends without an empty cell. It is a page section — the site places it from a `{ _id: 'subject-library', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `section-module`, `frame-box`, `card-grid`, `call-to-action` and `button` rather than owning any anatomy of its own."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    anchor: {
      control: 'text',
      description: 'In-page `id` of the band, the target of a `#hash` link.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    subjects: {
      control: 'object',
      description:
        'The subject cards, in order; each is `{ slug, title, description, articles }` where every article is `{ label, href }`. Subjects without a title or a linked article are skipped.',
      table: {
        category: 'props',
        type: { summary: 'SubjectLibrarySubject[]' },
        defaultValue: { summary: '[]' }
      }
    },
    closing: {
      control: 'object',
      description:
        "Call to action across the grid's last two cells; `{ eyebrow, title, titleMuted, description, primaryAction, secondaryAction }` where each action is `{ label, href, trailing?, target? }`. Omitted when absent.",
      table: {
        category: 'props',
        type: { summary: 'SubjectLibraryClosing' },
        defaultValue: { summary: 'undefined' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { SubjectLibrary },
  setup() {
    return { args }
  },
  template: '<SubjectLibrary v-bind="args" />'
})

const DEFAULT_MARKUP = `<SubjectLibrary
  anchor="subjects"
  :subjects="[
    {
      slug: 'bots',
      title: 'Bots',
      description: 'Bots are automated software programs that perform repetitive tasks on websites and applications.',
      articles: [
        { label: 'What is a Bot?', href: 'https://www.azion.com/en/learning/bots/what-is-a-bot/' },
        { label: 'What is Bot Management?', href: 'https://www.azion.com/en/learning/bots/what-is-bot-management/' }
      ]
    },
    {
      slug: 'cdn',
      title: 'CDN',
      description: 'Reduce latency by caching static content on servers close to the user.',
      articles: [
        { label: 'What is a CDN?', href: 'https://www.azion.com/en/learning/cdn/what-is-a-cdn/' },
        { label: 'What is Caching?', href: 'https://www.azion.com/en/learning/cdn/what-is-caching/' }
      ]
    }
  ]"
  :closing="{
    eyebrow: 'Next step',
    title: 'Put what you learned to work.',
    titleMuted: 'On Azion.',
    description: 'Deploy your first application in minutes, or talk to an expert about your architecture.',
    primaryAction: { label: 'Start for free', href: '/signup' },
    secondaryAction: { label: 'Talk to a specialist', href: '/contact', trailing: true }
  }"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof SubjectLibrary>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The library as the Learning Center places it: four subject cards with their articles and the closing call to action across the last two cells. Edit the props in the Controls panel — remove `closing` and the grid ends on the last subject; a band with no subjects renders nothing at all.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
