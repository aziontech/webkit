<script setup>
  import OverflowCount from '@aziontech/webkit/overflow-count'

  const regions = ['north', 'south', 'east', 'west']
  const tiers = ['edge', 'core', 'cache', 'origin', 'shield', 'relay', 'gateway', 'store', 'queue']
  const tags = regions.flatMap((region) => tiers.map((tier) => `${region}-${tier}`)).slice(0, 34)
</script>

<template>
  <div class="flex items-center gap-(--spacing-xs)">
    <span class="text-body-sm text-(--text-default)">{{ tags[0] }}</span>
    <OverflowCount
      :items="tags.slice(1)"
      :noun="{ one: 'tag', other: 'tags' }"
    />
  </div>
</template>
