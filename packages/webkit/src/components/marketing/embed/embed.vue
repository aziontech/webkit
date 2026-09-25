<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'Embed',
    inheritAttrs: false
  })

  /** Aspect ratio the frame holds while it scales. */
  export type EmbedRatio = 'video' | 'square' | 'wide'

  interface Props {
    /** URL of the document to embed. */
    src: string
    /** Accessible name for the embedded document, announced before its content. */
    title: string
    /** Aspect ratio the frame holds while it scales. */
    ratio?: EmbedRatio
  }

  withDefaults(defineProps<Props>(), {
    ratio: 'video'
  })

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'marketing-embed')
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :data-ratio="ratio"
    class="group"
  >
    <div
      class="w-full bg-(--bg-surface) group-data-[ratio=square]:aspect-square group-data-[ratio=video]:aspect-video group-data-[ratio=wide]:aspect-[21/9]"
    >
      <iframe
        :src="src"
        :title="title"
        loading="lazy"
        class="h-full w-full border-0"
      />
    </div>
  </section>
</template>
