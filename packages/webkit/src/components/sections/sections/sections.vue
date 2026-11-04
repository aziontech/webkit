<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { registry, type SectionId } from './registry'

  defineOptions({
    name: 'Sections',
    inheritAttrs: false
  })

  /** One entry of a page's sections list: the block to render and the props bound onto it. */
  export type SectionEntry = {
    /** Registry key of the block; an id the registry does not know renders nothing. */
    _id: SectionId | (string & {})
    /** Props bound straight onto the block. */
    props: Record<string, unknown>
  }

  interface Props {
    /** The page's section entries, in render order; each is `{ _id, props }` where `_id` is a registry key and `props` is bound onto that block. Unknown ids are skipped. */
    sections?: SectionEntry[]
  }

  const props = withDefaults(defineProps<Props>(), {
    sections: () => []
  })

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'sections-sections')

  const entries = computed(() =>
    props.sections
      .map((entry, index) => ({ ...entry, index, block: registry[entry._id as SectionId] }))
      .filter((entry) => entry.block !== undefined)
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="bg-(--bg-canvas)"
  >
    <component
      :is="entry.block"
      v-for="entry in entries"
      :key="`${entry._id}-${entry.index}`"
      v-bind="entry.props"
    />
  </div>
</template>
