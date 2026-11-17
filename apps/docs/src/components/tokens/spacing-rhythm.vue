<script setup lang="ts">
  import CopyText from '@aziontech/webkit/copy-text'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import { useBreakpoint } from '../../composables/use-breakpoint'
  import { messages } from '../../lib/i18n'
  import { BREAKPOINT_ORDER, tailwindClass } from '../../lib/tokens'
  import type { Token } from '../../lib/types'

  const props = defineProps<{ tokens: Token[] }>()

  const t = messages
  const breakpoint = useBreakpoint()

  const columns = computed(() =>
    BREAKPOINT_ORDER.filter((name) => props.tokens.some((token) => token.responsive?.[name]))
  )

  function isLive(token: Token, column: string): boolean {
    const map = token.responsive ?? {}
    const upTo = BREAKPOINT_ORDER.slice(0, BREAKPOINT_ORDER.indexOf(breakpoint.value) + 1)
    return [...upTo].reverse().find((name) => map[name] !== undefined) === column
  }
</script>

<template>
  <Table
    bordered
    wrap-lines
  >
    <template #caption>
      <span class="sr-only">{{ t.spacingRhythm }}</span>
    </template>
    <Table.Header>
      <Table.Row>
        <Table.HeadCell principal>{{ t.token }}</Table.HeadCell>
        <Table.HeadCell :grow="2">{{ t.tailwind }}</Table.HeadCell>
        <Table.HeadCell
          v-for="column in columns"
          :key="column"
          >{{ column === '_' ? t.base : column }}</Table.HeadCell
        >
        <Table.HeadCell>{{ t.preview }}</Table.HeadCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row
        v-for="token in tokens"
        :key="token.name"
      >
        <Table.Cell principal>
          <CopyText
            :value="token.name"
            size="small"
          />
        </Table.Cell>
        <Table.Cell>
          <CopyText
            :value="tailwindClass(token.name, 'spacing')"
            size="small"
          />
        </Table.Cell>
        <Table.Cell
          v-for="column in columns"
          :key="column"
        >
          <span class="flex items-center gap-(--spacing-2xs)">
            <code
              :data-live="isLive(token, column) || null"
              class="text-label-code-sm text-(--text-muted) data-[live]:text-(--text-default)"
              >{{ token.responsive?.[column] ?? '—' }}</code
            >
            <Tag
              v-if="isLive(token, column)"
              :label="t.live"
              variant="highlight"
              size="small"
            />
          </span>
        </Table.Cell>
        <Table.Cell>
          <span
            class="inline-block h-4 rounded-(--shape-flat) bg-(--primary)"
            :style="{ width: `var(${token.name})` }"
            aria-hidden="true"
          />
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
</template>
