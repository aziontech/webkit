<script setup lang="ts">
  import CopyText from '@aziontech/webkit/copy-text'
  import DataTable from '@aziontech/webkit/data-table'
  import { computed } from 'vue'

  import { messages } from '../../lib/i18n'
  import { tailwindClass, type TokenKind } from '../../lib/tokens'
  import type { Token } from '../../lib/types'
  import InlineCode from './inline-code.vue'
  import TokenSample from './token-sample.vue'

  const props = defineProps<{
    tokens: Token[]
    kind: TokenKind
    caption: string
    sample: 'swatch' | 'bar' | 'radius' | 'shadow' | 'none'
  }>()

  const t = messages
  const paired = computed(() => props.tokens.some((token) => token.dark))
  const withUsage = computed(() => props.tokens.some((token) => token.usage))
  const withClass = computed(() =>
    props.tokens.some((token) => tailwindClass(token.name, props.kind))
  )

  const columns = computed(() => [
    {
      id: 'name',
      accessorKey: 'name',
      header: t.value.token,
      principal: true,
      sortable: false,
      minWidth: props.sample === 'none' || paired.value ? 176 : 216
    },
    ...(withClass.value
      ? [{ id: 'tailwind', header: t.value.tailwind, sortable: false, minWidth: 200 }]
      : []),
    ...(withUsage.value
      ? [{ id: 'usage', header: t.value.usage, sortable: false, grow: 3 as const }]
      : []),
    ...(paired.value
      ? [
          { id: 'light', header: t.value.light, sortable: false, grow: 2 as const },
          { id: 'dark', header: t.value.dark, sortable: false, grow: 2 as const }
        ]
      : [{ id: 'value', header: t.value.value, sortable: false, grow: 2 as const }])
  ])

  function modeValue(token: Token, mode: 'light' | 'dark'): string {
    return (mode === 'light' ? token.value : token.dark) ?? token.value
  }
</script>

<template>
  <DataTable
    :data="tokens"
    :columns="columns"
    row-key="name"
    bordered
    stackable
    wrap-lines
    :aria-label="caption"
  >
    <template #cell-name="{ row }">
      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
        <TokenSample
          v-if="!paired"
          :name="row.name"
          :sample="sample"
        />
        <CopyText
          :value="row.name"
          size="small"
        />
      </span>
    </template>
    <template #cell-tailwind="{ row }">
      <CopyText
        v-if="tailwindClass(row.name, kind)"
        :value="tailwindClass(row.name, kind)"
        size="small"
      />
      <span
        v-else
        class="text-body-sm text-(--text-muted)"
        >—</span
      >
    </template>
    <template #cell-usage="{ row }">
      <span
        v-if="row.usage"
        class="flex min-w-0 flex-col gap-(--spacing-2xs)"
      >
        <span class="text-body-sm text-(--text-default)">{{ row.usage.job }}</span>
        <span class="text-body-xs text-(--text-muted)">
          {{ t.usedBy }}: <InlineCode :text="row.usage.usedBy" />
        </span>
      </span>
      <span
        v-else
        class="text-body-sm text-(--text-muted)"
        >—</span
      >
    </template>
    <template
      v-for="mode in ['light', 'dark'] as const"
      :key="mode"
      #[`cell-${mode}`]="{ row }"
    >
      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
        <TokenSample
          :name="row.name"
          :sample="sample"
          :theme="mode"
        />
        <code
          :title="modeValue(row, mode)"
          class="min-w-0 truncate text-label-code-sm text-(--text-muted)"
          >{{ modeValue(row, mode) }}</code
        >
      </span>
    </template>
    <template #cell-value="{ row }">
      <code
        :title="row.value"
        class="min-w-0 truncate text-label-code-sm text-(--text-muted)"
        >{{ row.value }}</code
      >
    </template>
  </DataTable>
</template>
