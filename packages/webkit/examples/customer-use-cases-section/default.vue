<script setup>
  import CustomerUseCasesSection from '@aziontech/webkit/customer-use-cases-section'
</script>

<template>
  <CustomerUseCasesSection
    eyebrow="SQL Database"
    title="What teams use SQL Database for"
    description="Four ways teams put vector search and SQL to work."
    :primary-action="{ label: 'Docs', href: '/site/docs', trailing: true }"
    :items="[
      {
        icon: 'az az-comments',
        title: 'RAG Applications',
        description: 'Build topic-specific chatbots with the topic data stored in SQL Database.'
      },
      {
        icon: 'az az-search',
        title: 'Search Applications',
        description: 'Power search with vector similarity queries on stored embeddings.'
      },
      {
        icon: 'az az-sync',
        title: 'AI Context Injection',
        description: 'Give AI applications relevant context from vector embeddings.'
      },
      {
        icon: 'az az-globe',
        title: 'AI Workflows',
        description: 'Pair stored embeddings with AI Inference to run RAG applications on Azion.'
      }
    ]"
  />
</template>
