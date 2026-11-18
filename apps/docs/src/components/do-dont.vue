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

  const CODE_ONLY = /^<pre[\s>][\s\S]*<\/pre>$/

  function codeOnly(html: string): boolean {
    const trimmed = html.trim()
    return CODE_ONLY.test(trimmed) && trimmed.indexOf('<pre', 1) === -1
  }

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
        icon: 'az az-circle-check text-(--success-foreground)',
        html: props.doHtml,
        items: props.doItems,
        code: codeOnly(props.doHtml) && !props.doItems.length
      },
      {
        side: 'dont',
        label: labels.value.dont,
        icon: 'az az-circle-x text-(--danger-foreground)',
        html: props.dontHtml,
        items: props.dontItems,
        code: codeOnly(props.dontHtml) && !props.dontItems.length
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
      :data-code="column.code || null"
      :padded="!column.code"
      class="not-data-[type=usage]:border-t-2 not-data-[type=usage]:data-[slot=do]:border-t-(--success-mark) not-data-[type=usage]:data-[slot=dont]:border-t-(--danger-mark)"
      :data-type="type"
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
      <DocProse
        v-if="column.html"
        :class="column.code ? 'docs-pair-code' : undefined"
      >
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
