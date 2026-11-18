<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import DocProse from '@aziontech/webkit/doc-prose'
  import { computed } from 'vue'

  import { messages } from '../lib/i18n'
  import type { PairType } from '../lib/types'
  import RawHtml from './raw-html.vue'

  defineOptions({ name: 'DoDont' })

  const props = withDefaults(
    defineProps<{
      type?: PairType
      level?: number
      doHtml?: string
      dontHtml?: string
      doItems?: string[]
      dontItems?: string[]
    }>(),
    {
      type: 'guidance',
      level: 2,
      doHtml: '',
      dontHtml: '',
      doItems: () => [],
      dontItems: () => []
    }
  )

  const t = messages

  const heading = computed(() => `h${Math.min(Math.max(props.level, 2), 6)}`)
  const labels = computed(() => {
    if (props.type === 'usage') return { do: t.value.whenToUse, dont: t.value.whenNotToUse }
    if (props.type === 'example') return { do: t.value.correct, dont: t.value.wrong }
    return { do: t.value.bestPractices, dont: t.value.constraints }
  })
  const columns = computed(() =>
    [
      {
        side: 'do',
        label: labels.value.do,
        icon: 'az az-circle-check text-(--success)',
        html: props.doHtml,
        items: props.doItems
      },
      {
        side: 'dont',
        label: labels.value.dont,
        icon: 'az az-circle-x text-(--danger)',
        html: props.dontHtml,
        items: props.dontItems
      }
    ].filter((column) => column.html || column.items.length)
  )
</script>

<template>
  <div
    v-if="columns.length"
    data-slot="do-dont"
    :data-type="type"
    class="grid grid-cols-1 gap-(--spacing-md) md:grid-cols-2"
  >
    <Card
      v-for="column in columns"
      :key="column.side"
      :data-slot="column.side"
    >
      <template #header>
        <component
          :is="heading"
          class="flex items-center gap-(--spacing-xs) text-label-md text-(--text-default)"
        >
          <i
            v-if="type !== 'usage'"
            :class="column.icon"
            aria-hidden="true"
          />
          {{ column.label }}
        </component>
      </template>
      <DocProse v-if="column.html">
        <ul v-if="column.items.length">
          <RawHtml
            v-for="line in column.items"
            :key="line"
            tag="li"
            :html="line"
          />
        </ul>
        <RawHtml :html="column.html" />
      </DocProse>
      <ul
        v-else
        class="flex list-disc flex-col gap-(--spacing-xs) ps-(--spacing-md) text-body-sm"
      >
        <RawHtml
          v-for="line in column.items"
          :key="line"
          tag="li"
          :html="line"
        />
      </ul>
    </Card>
  </div>
</template>
