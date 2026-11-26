<script setup>
  import SearchTrigger from '@aziontech/webkit/search-trigger'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <div
      class="@container w-(--container-3xs) rounded-(--shape-control) border border-(--border-default) p-(--spacing-sm)"
    >
      <SearchTrigger collapsible />
    </div>
    <div
      class="@container w-full max-w-(--container-3xl) rounded-(--shape-control) border border-(--border-default) p-(--spacing-sm)"
    >
      <SearchTrigger
        collapsible
        label="Search docs"
      />
    </div>
  </div>
</template>
