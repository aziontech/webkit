<script setup>
  import Container from '@aziontech/webkit/container'
  import CustomerUseCasesSection from '@aziontech/webkit/customer-use-cases-section'
  import Spacer from '@aziontech/webkit/spacer'

  const primaryAction = {
    label: 'Docs',
    href: '/site/docs',
    trailing: true
  }

  const items = [
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
  ]
</script>

<template>
  <Container max-width="site">
    <Spacer hatch />

    <CustomerUseCasesSection
      eyebrow="SQL Database"
      title="What teams use SQL Database for"
      description="Four workloads teams run on SQL Database today."
      :primary-action="primaryAction"
      :items="items"
    />

    <Spacer hatch />
  </Container>
</template>
