<script setup>
  import ScrollArea from '@aziontech/webkit/scroll-area'
</script>

<template>
  <div class="flex flex-wrap items-start gap-(--spacing-6)">
    <ScrollArea
      orientation="vertical"
      aria-label="Vertical scroll"
      class="h-[160px] w-[240px] rounded-(--shape-elements) border border-(--border-default) p-(--spacing-3) text-body-sm text-(--text-default)"
    >
      <div class="h-[320px]">Tall content that scrolls along the vertical axis.</div>
    </ScrollArea>
    <ScrollArea
      orientation="horizontal"
      aria-label="Horizontal scroll"
      class="w-[240px] rounded-(--shape-elements) border border-(--border-default) p-(--spacing-3) text-body-sm text-(--text-default)"
    >
      <p class="m-0 w-max whitespace-nowrap">
        This line is intentionally wider than the container so horizontal scrolling is required.
      </p>
    </ScrollArea>
    <ScrollArea
      orientation="both"
      aria-label="Two-axis scroll"
      class="h-[160px] w-[240px] rounded-(--shape-elements) border border-(--border-default) p-(--spacing-3) text-body-sm text-(--text-default)"
    >
      <div class="h-[320px] w-[480px]">Tall and wide content for two-axis scrolling.</div>
    </ScrollArea>
  </div>
</template>
