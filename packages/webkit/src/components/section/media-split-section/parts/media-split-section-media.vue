<script setup lang="ts">
  import { computed, defineAsyncComponent } from 'vue'

  import Illustration from '../../../content/illustration/illustration.vue'
  import { type MediaSplitMediaSource, resolveMedia } from '../lib/media-split-media'

  defineOptions({ name: 'MediaSplitSectionMedia' })

  interface Props {
    /** The pictures the cell may draw; the first one set wins. */
    source: MediaSplitMediaSource
    /** Accessible name of the illustration; empty keeps it decorative. */
    illustrationAriaLabel?: string
    /** Whether the pointer is over the band, handed to the console widget. */
    hovered?: boolean
    /** Axis the band splits on; a vertical band keeps a console picture tall at every width. */
    orientation?: 'horizontal' | 'vertical'
  }

  const props = withDefaults(defineProps<Props>(), {
    illustrationAriaLabel: '',
    hovered: false,
    orientation: undefined
  })

  const ConsoleMockup = defineAsyncComponent(
    () => import('../../../content/console-mockup/console-mockup.vue')
  )

  const media = computed(() => resolveMedia(props.source))
</script>

<template>
  <div
    v-if="media.mockup"
    :data-orientation="orientation"
    class="flex w-full self-stretch max-lg:min-h-(--size-80) data-[orientation=vertical]:mx-auto data-[orientation=vertical]:min-h-(--size-80) data-[orientation=vertical]:max-w-(--container-3xl)"
  >
    <component
      :is="media.scene"
      v-if="media.kind === 'scene'"
      v-bind="source.scene?.props ?? {}"
    />
    <ConsoleMockup
      v-else-if="source.widget"
      :name="source.widget"
      :hovered="hovered"
      :cursor="false"
    />
  </div>
  <component
    :is="media.scene"
    v-else-if="media.kind === 'scene'"
    v-bind="source.scene?.props ?? {}"
  />
  <Illustration
    v-else-if="media.kind === 'illustration' && source.illustration"
    :name="source.illustration"
    :aria-label="illustrationAriaLabel"
  />
</template>
