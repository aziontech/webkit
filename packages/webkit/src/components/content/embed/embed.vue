<script setup lang="ts">
  import { computed, onMounted, ref, useAttrs } from 'vue'

  import { embedSandbox, embedSource } from './lib/sandbox'

  defineOptions({
    name: 'Embed',
    inheritAttrs: false
  })

  /** Aspect ratio the frame holds while it scales. */
  export type EmbedRatio = 'video' | 'square' | 'wide'

  export interface EmbedProps {
    /** URL of the document to embed. Only an absolute https URL is framed; anything else renders the title as plain text. A page of the app's own origin is framed without allow-same-origin, so it cannot lift its sandbox. */
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

  const origin = ref<string | null>(null)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'embed')

  const frameSrc = computed(() => embedSource(props.src))

  const sandbox = computed(() =>
    frameSrc.value && origin.value !== null ? embedSandbox(frameSrc.value, origin.value) : ''
  )

  onMounted(() => {
    origin.value = window.location.origin
  })
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
        v-if="frameSrc && sandbox"
        :src="frameSrc"
        :title="title"
        loading="lazy"
        :sandbox="sandbox"
        referrerpolicy="strict-origin-when-cross-origin"
        class="h-full w-full border-0"
      />
      <p
        v-else-if="!frameSrc"
        :data-testid="`${testId}__unavailable`"
        class="m-0 flex h-full w-full items-center justify-center p-(--spacing-md) text-center text-body-sm text-(--text-muted)"
      >
        {{ title }}
      </p>
    </div>
  </section>
</template>
