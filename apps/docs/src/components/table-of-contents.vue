<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import DocTableOfContents from '@aziontech/webkit/doc-table-of-contents'
  import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

  import { messages } from '../lib/i18n'

  const props = withDefaults(
    defineProps<{ items: { id: string; text: string; depth: number }[]; compact?: boolean }>(),
    { compact: false }
  )

  const t = messages
  const active = ref('')
  let observer: IntersectionObserver | null = null

  function observe() {
    if (props.compact) return
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
  <Accordion
    v-if="compact && items.length > 1"
    type="single"
    collapsible
    size="medium"
    icon-position="trailing"
    class="w-full rounded-(--shape-card) border border-(--border-default) px-(--spacing-sm) 2xl:hidden"
    data-docs-toc-compact
  >
    <Accordion.Item value="toc">
      <Accordion.Trigger :heading-level="2">{{ t.onThisPage }}</Accordion.Trigger>
      <Accordion.Content>
        <nav :aria-label="t.onThisPage">
          <ul class="flex flex-col gap-(--spacing-2xs)">
            <li
              v-for="item in items"
              :key="item.id"
              :data-depth="item.depth"
              class="data-[depth=3]:ps-(--spacing-md) data-[depth=4]:ps-(--spacing-md)"
            >
              <a
                :href="`#${item.id}`"
                class="text-body-sm text-(--text-muted) hover:text-(--text-default) focus-visible:outline-2 focus-visible:outline-(--ring-color)"
                @click="onSelect($event, item)"
                >{{ item.text }}</a
              >
            </li>
          </ul>
        </nav>
      </Accordion.Content>
    </Accordion.Item>
  </Accordion>
  <div
    v-else-if="!compact && items.length"
    class="sticky top-20 hidden max-h-[calc(100vh-6rem)] w-(--container-3xs) shrink-0 self-start overflow-y-auto 2xl:block"
    data-docs-toc
  >
    <DocTableOfContents
      :items="items"
      :active-id="active"
      :title="t.onThisPage"
      @select="onSelect"
    />
  </div>
</template>
