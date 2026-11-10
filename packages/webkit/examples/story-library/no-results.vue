<script setup>
  import StoryLibrary from '@aziontech/webkit/story-library'
</script>

<template>
  <StoryLibrary
    anchor="cases"
    title="Companies building with Azion"
    aria-label="Success stories"
    :items="[]"
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
