<script setup lang="ts">
  import CopyText from '@aziontech/webkit/copy-text'
  import DataTable from '@aziontech/webkit/data-table'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import { useBreakpoint } from '../../composables/use-breakpoint'
  import { messages } from '../../lib/i18n'
  import { BREAKPOINT_ORDER, tailwindClass } from '../../lib/tokens'
  import type { Token } from '../../lib/types'

  const props = defineProps<{ tokens: Token[] }>()

  const t = messages
  const breakpoint = useBreakpoint()

  const breakpoints = computed(() =>
    BREAKPOINT_ORDER.filter((name) => props.tokens.some((token) => token.responsive?.[name]))
  )

  const columns = computed(() => [
    {
      id: 'name',
      accessorKey: 'name',
      header: t.value.token,
      principal: true,
      sortable: false,
      minWidth: 176
    },
    { id: 'tailwind', header: t.value.tailwind, sortable: false, minWidth: 200 },
    ...breakpoints.value.map((name) => ({
      id: `bp-${name}`,
      header: name === '_' ? t.value.base : name,
      sortable: false,
      minWidth: 112
    })),
    { id: 'preview', header: t.value.preview, sortable: false, grow: 2 as const }
  ])

  function isLive(token: Token, column: string): boolean {
    const map = token.responsive ?? {}
    const upTo = BREAKPOINT_ORDER.slice(0, BREAKPOINT_ORDER.indexOf(breakpoint.value) + 1)
    return [...upTo].reverse().find((name) => map[name] !== undefined) === column
  }
</script>

<template>
  <DataTable
    :data="tokens"
    :columns="columns"
    row-key="name"
    bordered
    stackable
    :aria-label="t.spacingRhythm"
  >
    <template #cell-name="{ row }">
      <CopyText
        :value="row.name"
        size="small"
      />
    </template>
    <template #cell-tailwind="{ row }">
      <CopyText
        :value="tailwindClass(row.name, 'spacing')"
        size="small"
      />
    </template>
    <template
      v-for="name in breakpoints"
      :key="name"
      #[`cell-bp-${name}`]="{ row }"
    >
      <span class="flex items-center gap-(--spacing-2xs)">
        <code
          :data-live="isLive(row, name) || null"
          class="text-label-code-sm text-(--text-muted) data-[live]:text-(--text-default)"
          >{{ row.responsive?.[name] ?? '—' }}</code
        >
        <Tag
          v-if="isLive(row, name)"
          :label="t.live"
          variant="highlight"
          size="small"
        />
      </span>
    </template>
    <template #cell-preview="{ row }">
      <span
        class="inline-block h-4 rounded-(--shape-flat) bg-(--primary)"
        :style="{ width: `var(${row.name})` }"
        aria-hidden="true"
      />
    </template>
  </DataTable>
</template>
