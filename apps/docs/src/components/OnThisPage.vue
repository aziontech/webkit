<script setup lang="ts">
  import DocOnThisPage from '@aziontech/webkit/doc-on-this-page'
  import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

  const props = defineProps<{ items: { id: string; text: string; depth: number }[] }>()

  const active = ref('')
  let observer: IntersectionObserver | null = null

  function observe() {
    observer?.disconnect()
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) active.value = visible.target.id
      },
      { rootMargin: '0px 0px -70% 0px' }
    )
    for (const item of props.items) {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    }
  }

  function onSelect(event: MouseEvent, item: { id: string }) {
    event.preventDefault()
    document.getElementById(item.id)?.scrollIntoView({ block: 'start' })
    history.replaceState(history.state, '', `#${item.id}`)
    active.value = item.id
  }

  onMounted(observe)
  watch(() => props.items, observe, { flush: 'post' })
  onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <aside
    v-if="items.length"
    class="sticky top-20 hidden max-h-[calc(100vh-6rem)] w-(--container-3xs) shrink-0 self-start overflow-y-auto xl:block"
  >
    <DocOnThisPage
      :items="items"
      :active-id="active"
      @select="onSelect"
    />
  </aside>
</template>
