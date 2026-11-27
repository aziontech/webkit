<script setup lang="ts">
  import CopyText from '@aziontech/ui/copy-text'
  import Table from '@aziontech/ui/table'
  import Tag from '@aziontech/ui/tag'
  import { computed } from 'vue'

  import { useBreakpoint } from '../../composables/use-breakpoint'
  import { messages } from '../../lib/i18n'
  import {
    BREAKPOINT_ORDER,
    tailwindClass,
    type TokenKind,
    type TokenSampleKind,
    usageGroups
  } from '../../lib/tokens'
  import type { Token, TokenUsage } from '../../lib/types'
  import InlineCode from './inline-code.vue'
  import MotionSample from './motion-sample.vue'
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
  const MOTION: TokenSampleKind[] = ['ease', 'animation']

  const paired = computed(() => props.tokens.some((token) => token.dark))
  const groups = computed(() => usageGroups(props.tokens))
  const withUsage = computed(() =>
    groups.value.some((group) => !group.usage && group.tokens.some((token) => token.usage))
  )
  const withClass = computed(() =>
    props.tokens.some((token) => tailwindClass(token.name, props.kind))
  )
  const wide = computed(() => WIDE.includes(props.sample))

  type Column = { id: string; header: string; grow?: 1 | 2 | 3; width?: string }

  const sampleColumn = computed<Column>(() => ({
    id: 'sample',
    header:
      paired.value || props.sample === 'shadow'
        ? `${t.value.light} · ${t.value.dark}`
        : t.value.sample,
    ...(props.sample === 'bar'
      ? { width: 'flex-[0_0_26.5rem]! @max-xl/table:basis-full!' }
      : wide.value
        ? { grow: 3 as const, width: '@max-xl/table:basis-full!' }
        : MOTION.includes(props.sample)
          ? { width: 'flex-[0_0_15rem]! @max-xl/table:basis-full!' }
          : { width: 'flex-[0_0_6.5rem]!' })
  }))

  const valueColumn = computed<Column>(() => ({
    id: 'value',
    header: t.value.value,
    ...(paired.value
      ? { width: 'flex-[0_0_14.5rem]! @max-xl/table:basis-full!' }
      : { grow: 2 as const, width: '@max-xl/table:basis-full!' })
  }))

  const columns = computed<Column[]>(() => [
    ...(props.sample === 'none' ? [] : [sampleColumn.value]),
    {
      id: 'name',
      header: withClass.value ? `${t.value.token} · ${t.value.tailwind}` : t.value.token,
      width: 'min-w-52!'
    },
    valueColumn.value,
    ...(withUsage.value ? [{ id: 'usage', header: t.value.usage, grow: 3 as const }] : [])
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
  <section
    :style="{ '--token-table-row-count': tokens.length + groups.length }"
    class="flex min-w-0 flex-col gap-(--spacing-sm) [content-visibility:auto] [contain-intrinsic-block-size:auto_calc(var(--token-table-row-count)*8.5rem)] md:[contain-intrinsic-block-size:auto_calc(var(--token-table-row-count)*5.25rem)]"
  >
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
    <Table
      bordered
      wrap-lines
      :aria-label="caption"
      class="@max-xl/table:[&_div:has(>[role=table])]:w-full"
    >
      <Table.Header class="@max-xl/table:sr-only">
        <Table.Row>
          <Table.HeadCell
            v-for="column in columns"
            :key="column.id"
            :principal="column.id === 'name'"
            :grow="column.grow"
            :class="column.width"
            >{{ column.header }}</Table.HeadCell
          >
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <template
          v-for="(group, at) in groups"
          :key="at"
        >
          <Table.Row
            v-if="group.usage"
            data-group
          >
            <Table.Cell
              :grow="3"
              :aria-colspan="columns.length"
              class="bg-(--bg-canvas) @max-xl/table:basis-full!"
            >
              <span class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                <span class="text-label-md text-(--text-default)">{{ group.usage.job }}</span>
                <span
                  v-if="group.usage.usedBy"
                  class="text-body-xs text-(--text-muted)"
                >
                  {{ t.usedBy }}: <InlineCode :text="group.usage.usedBy" />
                </span>
              </span>
            </Table.Cell>
          </Table.Row>
          <Table.Row
            v-for="row in group.tokens"
            :key="row.name"
            class="@max-xl/table:flex-wrap"
          >
            <Table.Cell
              v-if="sample !== 'none'"
              :grow="sampleColumn.grow"
              :class="sampleColumn.width"
            >
              <span
                :data-fill="wide || null"
                class="flex min-w-0 items-center gap-(--spacing-xs) data-[fill]:w-0 data-[fill]:grow"
              >
                <TokenSample
                  :name="row.name"
                  :value="row.value"
                  :sample="sample"
                  :text="sampleText"
                  :paired="paired"
                />
                <MotionSample
                  v-if="sample === 'ease' || sample === 'animation'"
                  :name="row.name"
                  :value="row.value"
                  :sample="sample"
                />
              </span>
            </Table.Cell>
            <Table.Cell
              principal
              class="min-w-52!"
            >
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
            </Table.Cell>
            <Table.Cell
              :grow="valueColumn.grow"
              :class="valueColumn.width"
            >
              <span class="flex w-0 min-w-0 grow">
                <span
                  v-if="row.dark"
                  class="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-(--spacing-xs) gap-y-(--spacing-2xs)"
                >
                  <span class="text-body-xs text-(--text-muted)">{{ t.light }}</span>
                  <code
                    :title="row.value"
                    class="min-w-0 truncate py-px text-label-code-sm text-(--text-default)"
                    >{{ row.value }}</code
                  >
                  <span class="text-body-xs text-(--text-muted)">{{ t.dark }}</span>
                  <code
                    :title="row.dark"
                    class="min-w-0 truncate py-px text-label-code-sm text-(--text-default)"
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
                      variant="primary"
                      size="small"
                    />
                  </span>
                </span>
                <code
                  v-else
                  :title="row.value"
                  class="min-w-0 truncate py-px text-label-code-sm text-(--text-default)"
                  >{{ row.value }}</code
                >
              </span>
            </Table.Cell>
            <Table.Cell
              key="usage"
              v-if="withUsage"
              :grow="3"
              class="@max-xl/table:basis-full!"
            >
              <span
                v-if="row.usage"
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
            </Table.Cell>
          </Table.Row>
        </template>
      </Table.Body>
    </Table>
  </section>
</template>
