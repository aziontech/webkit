<script setup lang="ts">
  import Skeleton from '@aziontech/webkit/skeleton'
  import { type Component, onMounted, onScopeDispose, ref, shallowRef } from 'vue'

  import { exampleLoader } from '../lib/data'

  const props = defineProps<{ dir: string; file: string }>()

  const stage = ref<HTMLElement | null>(null)
  const live = shallowRef<Component | null>(null)
  let observer: IntersectionObserver | null = null

  async function load() {
    observer?.disconnect()
    observer = null
    const loader = exampleLoader(props.dir, props.file)
    if (loader) live.value = await loader()
  }

  onMounted(() => {
    if (!stage.value) return
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) load()
      },
      { rootMargin: '400px 0px' }
    )
    observer.observe(stage.value)
  })

  onScopeDispose(() => observer?.disconnect())
</script>

<template>
  <div
    ref="stage"
    :data-example="`${dir}/${file}`"
    class="flex h-full w-full items-center justify-center"
  >
    <div
      v-if="live"
      class="w-full min-w-0"
    >
      <component :is="live" />
    </div>
    <div
      v-else
      class="flex w-full max-w-60 flex-col gap-(--spacing-xs)"
      aria-hidden="true"
    >
      <Skeleton height="2rem" />
      <Skeleton
        width="70%"
        height="1rem"
      />
    </div>
  </div>
</template>
