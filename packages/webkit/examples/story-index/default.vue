<script setup>
  import axurExtendedReversed from '@aziontech/webkit/assets/axur-extended-reversed.svg'
  import exameExtendedReversed from '@aziontech/webkit/assets/exame-extended-reversed.svg'
  import gpaExtendedReversed from '@aziontech/webkit/assets/gpa-extended-reversed.svg'
  import StoryIndex from '@aziontech/webkit/story-index'
</script>

<template>
  <StoryIndex
    anchor="cases"
    title="Companies building with Azion"
    aria-label="Success stories"
    link-label="Read story"
    more-label="Load more"
    :items="[
      {
        id: 'case-gpa',
        href: '/site/success-cases/gpa',
        client: { name: 'GPA', logo: gpaExtendedReversed },
        category: 'Retail',
        description:
          'Grupo Pão de Açúcar (GPA) solved a targeted DNS attack, secured 100+ critical applications in 15 days, and reduced costs by 30%.',
        facets: { industry: ['Retail'], solution: ['Secure'] }
      },
      {
        id: 'case-axur',
        href: '/site/success-cases/axur',
        client: { name: 'Axur', logo: axurExtendedReversed },
        category: 'Tech',
        description:
          'See how moving AI inference off managed infrastructure unlocked the fastest automatic takedown in the market.',
        facets: { industry: ['Tech'], solution: ['Build', 'Secure'] }
      },
      {
        id: 'case-exame',
        href: '/site/success-cases/exame',
        client: { name: 'Exame', logo: exameExtendedReversed },
        category: 'Media',
        description:
          'Faster content delivery and resilient infrastructure enabled Exame to handle large traffic spikes during major news events.',
        facets: { industry: ['Media'], solution: ['Build', 'Deploy'] }
      }
    ]"
    :facets="[
      {
        id: 'industry',
        label: 'Industry',
        allLabel: 'All industries',
        options: [
          { value: 'Media', label: 'Media' },
          { value: 'Retail', label: 'Retail' },
          { value: 'Tech', label: 'Tech' }
        ]
      },
      {
        id: 'solution',
        label: 'Solution',
        allLabel: 'All solutions',
        options: [
          { value: 'Build', label: 'Build' },
          { value: 'Deploy', label: 'Deploy' },
          { value: 'Secure', label: 'Secure' }
        ]
      }
    ]"
    search-placeholder="Search by company or story"
    search-aria-label="Search success stories"
    empty-title="No stories match these filters."
    empty-action-label="View all success stories"
  />
</template>
