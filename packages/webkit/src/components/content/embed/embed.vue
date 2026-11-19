<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { safeWebUrl } from '../../../utils/safe-href'

  defineOptions({
    name: 'Embed',
    inheritAttrs: false
  })

  /** Aspect ratio the frame holds while it scales. */
  export type EmbedRatio = 'video' | 'square' | 'wide'

  export interface EmbedProps {
    /** URL of the document to embed. Only an absolute http or https URL is framed; anything else renders the title as plain text. */
    src: string
    /** Accessible name for the embedded document, announced before its content. */
    title: string
    /** Aspect ratio the frame holds while it scales. */
    ratio?: EmbedRatio
  }

  const props = withDefaults(defineProps<EmbedProps>(), {
    ratio: 'video'
  })

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'embed')

  const frameSrc = computed(() => safeWebUrl(props.src))
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
        v-if="frameSrc"
        :src="frameSrc"
        :title="title"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
        referrerpolicy="strict-origin-when-cross-origin"
        class="h-full w-full border-0"
      />
      <p
        v-else
        :data-testid="`${testId}__unavailable`"
        class="m-0 flex h-full w-full items-center justify-center p-(--spacing-md) text-center text-body-sm text-(--text-muted)"
      >
        {{ title }}
      </p>
    </div>
  </section>
</template>
