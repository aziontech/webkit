<script setup lang="ts">
  import { type Component, computed } from 'vue'

  import { cached, keys } from '../lib/data'
  import type { Highlighted } from '../lib/types'
  import CodeView from './CodeView.vue'
  import RawHtml from './RawHtml.vue'

  const props = defineProps<{
    dir: string
    example: { name: string; summary: string; file: string }
    anchor: string
  }>()

  const live = computed(() => cached<Component>(keys.example(props.dir, props.example.file)))
  const source = computed(() =>
    cached<Highlighted>(keys.exampleSource(props.dir, props.example.file))
  )
  const title = computed(() => props.example.name.replace(/([a-z0-9])([A-Z])/g, '$1 $2'))
</script>

<template>
  <section
    :id="anchor"
    class="flex scroll-mt-20 flex-col gap-(--spacing-sm)"
    :aria-labelledby="`${anchor}-title`"
  >
    <div class="flex flex-col gap-(--spacing-xxs)">
      <h3
        :id="`${anchor}-title`"
        class="text-heading-sm"
      >
        {{ title }}
      </h3>
      <RawHtml
        v-if="example.summary"
        tag="p"
        :html="example.summary"
        class="text-body-sm text-(--text-muted)"
      />
    </div>
    <div class="flex flex-col gap-(--spacing-sm)">
      <div
        class="flex min-h-40 min-w-0 items-center justify-center overflow-auto rounded-(--shape-card) border border-(--border-default) bg-(--bg-canvas) p-(--spacing-lg)"
        :data-example="`${dir}/${example.file}`"
      >
        <div class="w-full min-w-0">
          <component
            :is="live"
            v-if="live"
          />
        </div>
      </div>
      <CodeView
        v-if="source"
        :source="source"
        :label="`examples/${dir}/${example.file}`"
      />
    </div>
  </section>
</template>
