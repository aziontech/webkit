<script setup lang="ts">
  import SitePage, { type SitePageSection } from '@aziontech/webkit/site-page'

  const hero: SitePageSection[] = [
    {
      _id: 'hero-band',
      props: {
        kind: 'title-band',
        size: 'large',
        eyebrow: 'SQL Database',
        title: 'Relational data, next to every user',
        description:
          'Query a distributed SQL database from your functions, with reads served from the nearest location.',
        primaryAction: { label: 'Start for free', href: '/signup' },
        secondaryAction: { label: 'Docs', href: '/docs', trailing: true }
      }
    }
  ]

  const sections: SitePageSection[] = [
    {
      _id: 'use-cases',
      props: {
        eyebrow: 'SQL Database',
        title: 'What teams use SQL Database for',
        description: 'Teams use it to:',
        primaryAction: { label: 'Docs', href: '/docs', trailing: true },
        items: [
          {
            icon: 'pi pi-comments',
            title: 'RAG applications',
            description: 'Build topic-specific chatbots on data stored in SQL Database.'
          },
          {
            icon: 'pi pi-search',
            title: 'Search applications',
            description: 'Power search with vector similarity queries on stored embeddings.'
          },
          {
            icon: 'pi pi-sync',
            title: 'AI context injection',
            description: 'Give AI applications relevant context from vector embeddings.'
          },
          {
            icon: 'pi pi-globe',
            title: 'AI workflows',
            description: 'Pair stored embeddings with AI Inference to run RAG on Azion.'
          }
        ]
      }
    },
    {
      _id: 'faq-section',
      props: {
        anchor: 'faq',
        title: 'Frequently asked questions',
        items: [
          {
            question: 'Which SQL dialect does it speak?',
            answer: 'SQLite-compatible SQL, so existing queries and tools work unchanged.'
          },
          {
            question: 'Where are reads served from?',
            answer: 'From the replica closest to the request; writes go to the primary.'
          }
        ]
      }
    },
    {
      _id: 'closing-call-to-action',
      props: {
        kind: 'primary',
        anchor: 'contact',
        title: 'Build, run, and protect applications everywhere.',
        description: 'Get faster launches, lower latency, and less infrastructure overhead.',
        primaryAction: { label: 'Start for free', href: '/signup' },
        secondaryAction: { label: 'Docs', href: '/docs', trailing: true }
      }
    }
  ]
</script>

<template>
  <SitePage
    :hero="hero"
    :sections="sections"
  />
</template>
