<script setup>
  import SearchTrigger from '@aziontech/webkit/search-trigger'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <div
      class="@container w-64 rounded-(--shape-elements) border border-(--border-default) p-(--spacing-sm)"
    >
      <SearchTrigger collapsible />
    </div>
    <div
      class="@container w-full max-w-3xl rounded-(--shape-elements) border border-(--border-default) p-(--spacing-sm)"
    >
      <SearchTrigger
        collapsible
        label="Search docs"
      />
    </div>
  </div>
</template>
