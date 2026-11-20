<script setup lang="ts">
  import Skeleton from '@aziontech/webkit/skeleton'
  import { type Component, onMounted, onScopeDispose, ref, shallowRef } from 'vue'

  import { exampleLoader } from '../lib/data'
  import { scheduleMount } from '../lib/mount-queue'

  const props = defineProps<{ dir: string; file: string }>()

  const stageEl = ref<HTMLElement | null>(null)
  const live = shallowRef<Component | null>(null)
  let observer: IntersectionObserver | null = null
  let cancel: (() => void) | null = null

  async function load() {
    const loader = exampleLoader(props.dir, props.file)
    if (loader) live.value = await loader()
  }

  onMounted(() => {
    if (!stageEl.value) return
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting) || cancel) return
        observer?.disconnect()
        observer = null
        cancel = scheduleMount(load)
      },
      { rootMargin: '400px 0px' }
    )
    observer.observe(stageEl.value)
  })

  onScopeDispose(() => {
    observer?.disconnect()
    cancel?.()
  })
</script>

<template>
  <div
    ref="stageEl"
    :data-example="`${dir}/${file}`"
    class="flex h-full w-full items-center justify-center [contain-intrinsic-size:auto_13rem] [content-visibility:auto]"
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
