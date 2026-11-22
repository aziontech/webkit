<script setup lang="ts">
  import Button from '@aziontech/webkit/button'

  export interface SummaryStateBandProps {
    /** The documentation the band links to. */
    docs: string
  }

  defineProps<SummaryStateBandProps>()

  defineSlots<{ default(): unknown }>()

  const STATE_BAND_CLASS =
    '@container/band flex min-h-(--size-12) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) border-t border-(--border-muted) bg-(--bg-canvas) px-(--spacing-md) ' +
    'py-(--spacing-xs)'
</script>

<template>
  <div :class="STATE_BAND_CLASS">
    <slot />

    <div class="w-full shrink-0 @lg/band:ms-auto @lg/band:w-fit">
      <Button
        class="w-full"
        label="Documentation"
        variant="outline"
        size="medium"
        icon="az az-book"
        :href="docs"
        target="_blank"
      />
    </div>
  </div>
</template>
