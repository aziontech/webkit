<script setup>
  import StoryLibrary from '@aziontech/webkit/story-library'
</script>

<template>
  <StoryLibrary
    anchor="cases"
    title="Companies building with Azion"
    aria-label="Success stories"
    link-label="Read story"
    more-label="Load more"
    :items="[
      {
        key: 'case-gpa',
        href: '/site/success-cases/gpa',
        client: { name: 'GPA', logo: '/marketing-components/logos/gpa-extended-reversed.svg' },
        category: 'Retail',
        description:
          'Grupo Pão de Açúcar (GPA) solved a targeted DNS attack, secured 100+ critical applications in 15 days, and reduced costs by 30%.',
        facets: { industry: ['Retail'], solution: ['Secure'] }
      },
      {
        key: 'case-axur',
        href: '/site/success-cases/axur',
        client: { name: 'Axur', logo: '/marketing-components/logos/axur-extended-reversed.svg' },
        category: 'Tech',
        description:
          'See how moving AI inference off managed infrastructure unlocked the fastest automatic takedown in the market.',
        facets: { industry: ['Tech'], solution: ['Build', 'Secure'] }
      },
      {
        key: 'case-exame',
        href: '/site/success-cases/exame',
        client: { name: 'Exame', logo: '/marketing-components/logos/exame-extended-reversed.svg' },
        category: 'Media',
        description:
          'Faster content delivery and resilient infrastructure enabled Exame to handle large traffic spikes during major news events.',
        facets: { industry: ['Media'], solution: ['Build', 'Deploy'] }
      }
    ]"
    :facets="[
      {
        key: 'industry',
        label: 'Industry',
        allLabel: 'All industries',
        options: [
          { value: 'Media', label: 'Media' },
          { value: 'Retail', label: 'Retail' },
          { value: 'Tech', label: 'Tech' }
        ]
      },
      {
        key: 'solution',
        label: 'Solution',
        allLabel: 'All solutions',
        options: [
          { value: 'Build', label: 'Build' },
          { value: 'Deploy', label: 'Deploy' },
          { value: 'Secure', label: 'Secure' }
        ]
      }
    ]"
    :search="{ placeholder: 'Search by company or story', label: 'Search success stories' }"
    :empty="{ title: 'No stories match these filters.', action: 'View all success stories' }"
  />
</template>
