<script setup lang="ts">
  import MapBanner from '@shared/ui/banners/MapBanner.vue'
  import ClaimChips from '@shared/ui/brand/ClaimChips.vue'

  interface Props {
    title?: string
    tags?: unknown[]
  }

  withDefaults(defineProps<Props>(), {
    title: 'Build on the most reliable network on the planet',
    tags: () => [
      '100+ data centers',
      '100+ Tbps network capacity',
      '30 ms median latency',
      '100% availability'
    ]
  })
</script>

<template>
  <aside
    class="relative isolate flex min-h-(--container-sm) flex-col overflow-hidden border-t border-(--border-default) bg-(--bg-canvas) pt-(--spacing-xl) lg:min-h-0 lg:border-t-0 lg:pt-(--spacing-xxl)"
    aria-label="The Azion network"
  >
    <header
      class="relative z-10 flex shrink-0 flex-col items-center gap-(--spacing-lg) px-(--layout-boundary-inline) text-center lg:px-(--spacing-xl)"
    >
      <h2 class="max-w-(--container-md) text-balance text-heading-lg text-(--text-default)">
        {{ title }}
      </h2>

      <ClaimChips
        v-if="tags.length"
        :claims="tags"
        class="max-w-(--container-md) justify-center"
      />
    </header>

    <div class="relative -mt-(--spacing-lg) max-lg:min-h-(--size-72) flex-1">
      <MapBanner kind="panel" />
    </div>
  </aside>
</template>
