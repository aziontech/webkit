<script setup>
  import StoryIndex from '@aziontech/webkit/story-index'
</script>

<template>
  <StoryIndex
    anchor="cases"
    title="Companies building with Azion"
    aria-label="Success stories"
    :items="[]"
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
