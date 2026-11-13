export const SITE_SECTION = {
  _id: 'use-cases',
  props: {
    eyebrow: 'SQL Database',
    title: 'What teams use SQL Database for',
    description: 'Teams use it to:',
    primaryAction: { label: 'Docs', href: '/site/docs', trailing: true },
    items: [
      {
        icon: 'pi pi-comments',
        title: 'RAG Applications',
        description: 'Build topic-specific chatbots with the topic data stored in SQL Database.'
      },
      {
        icon: 'pi pi-search',
        title: 'Search Applications',
        description: 'Power search with vector similarity queries on stored embeddings.'
      },
      {
        icon: 'pi pi-sync',
        title: 'AI Context Injection',
        description: 'Give AI applications relevant context from vector embeddings.'
      },
      {
        icon: 'pi pi-globe',
        title: 'AI Workflows',
        description: 'Pair stored embeddings with AI Inference to run RAG applications on Azion.'
      }
    ]
  }
}
