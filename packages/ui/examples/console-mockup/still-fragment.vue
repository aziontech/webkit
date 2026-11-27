<script setup>
  import ConsoleMockup from '@aziontech/ui/console-mockup'
</script>

<template>
  <div class="grid w-full grid-cols-1 gap-(--spacing-lg) md:grid-cols-2">
    <div class="h-80 w-full p-(--spacing-xl)">
      <ConsoleMockup name="data-stream-source" />
    </div>
    <div class="h-80 w-full p-(--spacing-xl)">
      <ConsoleMockup
        name="data-stream-source"
        :cursor="false"
      />
    </div>
  </div>
</template>
