import Sections from '@aziontech/webkit/sections'

import { toSfc } from '../../../_shared/story-source'
import { SITE_SECTION as USE_CASES } from '../../../templates/marketing/_sections/use-cases'

const IMPORT = "import Sections from '@aziontech/webkit/sections'"

const PAGE = [
  USE_CASES,
  {
    ...USE_CASES,
    props: { ...USE_CASES.props, eyebrow: 'Edge SQL', title: 'What teams use Edge SQL for' }
  }
]

/** @type {import('@storybook/vue3').Meta<typeof Sections>} */
const meta = {
  title: 'Components/Sections/Sections',
  component: Sections,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          "The one import that assembles a marketing page: `Sections` takes the page's `sections[]` JSON — a list of `{ _id, props }` entries — and renders each entry's page-section component with its props bound, in order. It is a registry compound: the root is a dispatcher, every block (`Sections.UseCases`) is a complete, props-only component of its own, and the typed `registry` maps each site `_id` to its block."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    sections: {
      control: 'object',
      description:
        "The page's section entries, in render order; each is `{ _id, props }` where `_id` is a registry key and `props` is bound onto that block. Unknown ids are skipped.",
      table: {
        category: 'props',
        type: { summary: 'SectionEntry[]' },
        defaultValue: { summary: '[]' }
      }
    }
  },
  args: {
    sections: PAGE
  }
}

export default meta

const Template = (args) => ({
  components: { Sections },
  setup() {
    return { args }
  },
  template: '<Sections v-bind="args" />'
})

const DEFAULT_MARKUP = `<Sections
  :sections="[
    {
      _id: 'use-cases',
      props: {
        eyebrow: 'SQL Database',
        title: 'What teams use SQL Database for',
        description: 'Teams use it to:',
        primaryAction: { label: 'Docs', href: '/site/docs', trailing: true },
        items: [
          { icon: 'pi pi-comments', title: 'RAG Applications', description: 'Build topic-specific chatbots with the topic data stored in SQL Database.' },
          { icon: 'pi pi-search', title: 'Search Applications', description: 'Power search with vector similarity queries on stored embeddings.' },
          { icon: 'pi pi-sync', title: 'AI Context Injection', description: 'Give AI applications relevant context from vector embeddings.' },
          { icon: 'pi pi-globe', title: 'AI Workflows', description: 'Pair stored embeddings with AI Inference to run RAG applications on Azion.' }
        ]
      }
    },
    {
      _id: 'use-cases',
      props: {
        eyebrow: 'Edge SQL',
        title: 'What teams use Edge SQL for',
        description: 'Teams use it to:',
        primaryAction: { label: 'Docs', href: '/site/docs', trailing: true },
        items: [
          { icon: 'pi pi-comments', title: 'RAG Applications', description: 'Build topic-specific chatbots with the topic data stored in SQL Database.' },
          { icon: 'pi pi-search', title: 'Search Applications', description: 'Power search with vector similarity queries on stored embeddings.' },
          { icon: 'pi pi-sync', title: 'AI Context Injection', description: 'Give AI applications relevant context from vector embeddings.' },
          { icon: 'pi pi-globe', title: 'AI Workflows', description: 'Pair stored embeddings with AI Inference to run RAG applications on Azion.' }
        ]
      }
    }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof Sections>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'A page described as two `use-cases` entries. Edit `sections` in the Controls panel: change an `_id` to one the registry does not know and that entry disappears; reorder the array and the page reorders with it.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
