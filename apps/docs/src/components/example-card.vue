<script setup lang="ts">
  import DocProse from '@aziontech/ui/doc-prose'
  import { type Component, computed, onMounted, onScopeDispose, ref } from 'vue'

  import { scheduleMount } from '../lib/mount-queue'
  import { cached, keys } from '../lib/route-data'
  import type { Highlighted } from '../lib/types'
  import { spacedTitle } from '../lib/words'
  import CodeView from './code-view.vue'
  import RawHtml from './raw-html.vue'

  const props = withDefaults(
    defineProps<{
      dir: string
      example: { name: string; summary: string; file: string; json?: string }
      anchor: string
      headingLevel?: 2 | 3
    }>(),
    { headingLevel: 3 }
  )

  const live = computed(() => cached<Component>(keys.example(props.dir, props.example.file)))
  const source = computed(() =>
    cached<Highlighted>(keys.exampleSource(props.dir, props.example.file))
  )
  const data = computed(() =>
    props.example.json
      ? cached<Highlighted>(keys.exampleSource(props.dir, props.example.json))
      : undefined
  )
  const stageEl = ref<HTMLElement | null>(null)
  const shown = ref(false)
  let observer: IntersectionObserver | null = null
  let cancel: (() => void) | null = null

  onMounted(() => {
    if (!stageEl.value || typeof IntersectionObserver !== 'function') {
      shown.value = true
      return
    }
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting) || cancel) return
        observer?.disconnect()
        observer = null
        cancel = scheduleMount(() => {
          shown.value = true
        })
      },
      { rootMargin: '800px 0px' }
    )
    observer.observe(stageEl.value)
  })

  onScopeDispose(() => {
    observer?.disconnect()
    cancel?.()
  })

  const title = computed(() => spacedTitle(props.example.name))
</script>

<template>
  <section
    :id="anchor"
    class="flex scroll-mt-20 flex-col gap-(--spacing-sm)"
    :aria-labelledby="`${anchor}-title`"
  >
    <div class="flex flex-col gap-(--spacing-2xs)">
      <component
        :is="`h${headingLevel}`"
        :id="`${anchor}-title`"
        :data-level="headingLevel"
        class="text-heading-sm data-[level=2]:text-heading-md"
        data-docs-example-title
      >
        {{ title }}
      </component>
      <DocProse
        v-if="example.summary"
        class="[&_p]:text-body-sm!"
        data-docs-example-summary
      >
        <RawHtml
          tag="p"
          :html="example.summary"
        />
      </DocProse>
    </div>
    <div class="flex flex-col gap-(--spacing-sm)">
      <div
        ref="stageEl"
        class="flex min-h-40 min-w-0 items-center justify-center overflow-auto rounded-(--shape-card) [--layout-sticky-top:0] border border-(--border-default) bg-(--bg-canvas) p-(--spacing-lg) [contain-intrinsic-size:auto_10rem] [content-visibility:auto]"
        :data-example="`${dir}/${example.file}`"
      >
        <div class="w-full min-w-0">
          <component
            :is="live"
            v-if="live && shown"
          />
        </div>
      </div>
      <CodeView
        v-if="source"
        :source="source"
        :label="`examples/${dir}/${example.file}`"
      />
      <CodeView
        key="code-view-2"
        v-if="data && example.json"
        :source="data"
        :label="`examples/${dir}/${example.json}`"
      />
    </div>
  </section>
</template>
