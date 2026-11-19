<script setup lang="ts">
  import CopyText from '@aziontech/webkit/copy-text'
  import DataTable from '@aziontech/webkit/data-table'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import { useBreakpoint } from '../../composables/use-breakpoint'
  import { messages } from '../../lib/i18n'
  import {
    BREAKPOINT_ORDER,
    tailwindClass,
    type TokenKind,
    type TokenSampleKind
  } from '../../lib/tokens'
  import type { Token, TokenUsage } from '../../lib/types'
  import InlineCode from './inline-code.vue'
  import TokenSample from './token-sample.vue'

  const props = withDefaults(
    defineProps<{
      tokens: Token[]
      kind: TokenKind
      caption: string
      sample?: TokenSampleKind
      sampleText?: string
      title?: string
      description?: string
      usage?: TokenUsage
      headingLevel?: 2 | 3
    }>(),
    {
      sample: 'none',
      sampleText: '',
      title: '',
      description: '',
      usage: undefined,
      headingLevel: 3
    }
  )

  const t = messages
  const breakpoint = useBreakpoint()
  const WIDE: TokenSampleKind[] = ['bar', 'type', 'font', 'weight']

  const paired = computed(() => props.tokens.some((token) => token.dark))
  const withUsage = computed(() => props.tokens.some((token) => token.usage))
  const withClass = computed(() =>
    props.tokens.some((token) => tailwindClass(token.name, props.kind))
  )
  const wide = computed(() => WIDE.includes(props.sample))

  const columns = computed(() => [
    ...(props.sample === 'none'
      ? []
      : [
          {
            id: 'sample',
            header: paired.value ? `${t.value.light} · ${t.value.dark}` : t.value.sample,
            sortable: false,
            ...(props.sample === 'bar'
              ? { width: 424 }
              : wide.value
                ? { grow: 3 as const }
                : { width: 104 })
          }
        ]),
    {
      id: 'name',
      accessorKey: 'name',
      header: withClass.value ? `${t.value.token} · ${t.value.tailwind}` : t.value.token,
      principal: true,
      sortable: false,
      minWidth: 208
    },
    {
      id: 'value',
      header: t.value.value,
      sortable: false,
      ...(paired.value ? { width: 232 } : { grow: 2 as const })
    },
    ...(withUsage.value
      ? [{ id: 'usage', header: t.value.usage, sortable: false, grow: 3 as const }]
      : [])
  ])

  const steps = (token: Token) =>
    BREAKPOINT_ORDER.filter((name) => token.responsive?.[name] !== undefined)

  function isLive(token: Token, step: string): boolean {
    const map = token.responsive ?? {}
    const upTo = BREAKPOINT_ORDER.slice(0, BREAKPOINT_ORDER.indexOf(breakpoint.value) + 1)
    return [...upTo].reverse().find((name) => map[name] !== undefined) === step
  }
</script>

<template>
  <section class="flex min-w-0 flex-col gap-(--spacing-sm)">
    <div
      v-if="title"
      class="flex flex-col gap-(--spacing-2xs)"
    >
      <component
        :is="`h${headingLevel}`"
        :class="headingLevel === 2 ? 'text-heading-sm' : 'text-label-lg'"
        class="text-(--text-default)"
        >{{ title }}</component
      >
      <p
        v-if="description"
        class="text-body-sm text-(--text-muted)"
      >
        {{ description }}
      </p>
      <p
        v-if="usage"
        class="flex flex-col gap-(--spacing-2xs) text-body-sm text-(--text-default)"
      >
        <span>{{ usage.job }}</span>
        <span
          v-if="usage.usedBy"
          class="text-body-xs text-(--text-muted)"
          >{{ t.usedBy }}: <InlineCode :text="usage.usedBy"
        /></span>
      </p>
    </div>
    <DataTable
      :data="tokens"
      :columns="columns"
      row-key="name"
      bordered
      stackable
      wrap-lines
      :aria-label="caption"
    >
      <template #cell-sample="{ row }">
        <span
          :data-fill="wide || null"
          class="flex min-w-0 data-[fill]:w-0 data-[fill]:grow"
        >
          <TokenSample
            :name="row.name"
            :value="row.value"
            :sample="sample"
            :text="sampleText"
            :paired="paired"
          />
        </span>
      </template>
      <template #cell-name="{ row }">
        <span class="flex min-w-0 flex-col items-start gap-(--spacing-2xs)">
          <CopyText
            :value="row.name"
            size="small"
          />
          <CopyText
            v-if="tailwindClass(row.name, kind)"
            :value="tailwindClass(row.name, kind)"
            size="small"
          />
        </span>
      </template>
      <template #cell-value="{ row }">
        <span class="flex w-0 min-w-0 grow">
          <span
            v-if="row.dark"
            class="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-(--spacing-xs) gap-y-(--spacing-2xs)"
          >
            <span class="text-body-xs text-(--text-muted)">{{ t.light }}</span>
            <code
              :title="row.value"
              class="min-w-0 truncate text-label-code-sm text-(--text-default)"
              >{{ row.value }}</code
            >
            <span class="text-body-xs text-(--text-muted)">{{ t.dark }}</span>
            <code
              :title="row.dark"
              class="min-w-0 truncate text-label-code-sm text-(--text-default)"
              >{{ row.dark }}</code
            >
          </span>
          <span
            v-else-if="row.responsive"
            class="flex min-w-0 flex-wrap items-center gap-x-(--spacing-sm) gap-y-(--spacing-2xs)"
          >
            <code
              v-if="kind === 'type'"
              class="basis-full text-label-code-sm text-(--text-default)"
              >{{ row.value }}</code
            >
            <span
              v-for="step in steps(row)"
              :key="step"
              class="flex items-center gap-(--spacing-2xs)"
            >
              <span class="text-body-xs text-(--text-muted)">{{
                step === '_' ? t.base : step
              }}</span>
              <code
                :data-live="isLive(row, step) || null"
                class="text-label-code-sm text-(--text-muted) data-[live]:text-(--text-default)"
                >{{ row.responsive?.[step] }}</code
              >
              <Tag
                v-if="isLive(row, step)"
                :label="t.live"
                variant="highlight"
                size="small"
              />
            </span>
          </span>
          <code
            v-else
            :title="row.value"
            class="min-w-0 truncate text-label-code-sm text-(--text-default)"
            >{{ row.value }}</code
          >
        </span>
      </template>
      <template #cell-usage="{ row }">
        <span
          v-if="row.continued"
          class="text-body-xs text-(--text-muted)"
          >{{ t.sameUsage }}</span
        >
        <span
          v-else-if="row.usage"
          class="flex w-0 min-w-0 grow flex-col gap-(--spacing-2xs)"
        >
          <span class="text-body-sm text-(--text-default)">{{ row.usage.job }}</span>
          <span
            v-if="row.usage.usedBy"
            class="text-body-xs text-(--text-muted)"
          >
            {{ t.usedBy }}: <InlineCode :text="row.usage.usedBy" />
          </span>
        </span>
        <span
          v-else
          class="text-body-sm text-(--text-muted)"
          >—</span
        >
      </template>
    </DataTable>
  </section>
</template>
