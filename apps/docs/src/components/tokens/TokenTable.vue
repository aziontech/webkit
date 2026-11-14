<script setup lang="ts">
  import Table from '@aziontech/webkit/table'
  import { computed } from 'vue'

  import { messages } from '../../lib/i18n'
  import { tailwindClass, type TokenKind } from '../../lib/tokens'
  import type { Token } from '../../lib/types'
  import CopyChip from './CopyChip.vue'
  import InlineCode from './InlineCode.vue'
  import TokenSample from './TokenSample.vue'

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
</script>

<template>
  <Table
    bordered
    wrap-lines
    :stackable="false"
  >
    <template #caption>
      <span class="sr-only">{{ caption }}</span>
    </template>
    <Table.Header>
      <Table.Row>
        <Table.HeadCell principal>{{ t.token }}</Table.HeadCell>
        <Table.HeadCell v-if="withClass">{{ t.tailwind }}</Table.HeadCell>
        <Table.HeadCell
          key="usage-head"
          v-if="withUsage"
          >{{ t.usage }}</Table.HeadCell
        >
        <template v-if="paired">
          <Table.HeadCell>{{ t.light }}</Table.HeadCell>
          <Table.HeadCell>{{ t.dark }}</Table.HeadCell>
        </template>
        <Table.HeadCell
          key="value-head"
          v-else
          >{{ t.value }}</Table.HeadCell
        >
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row
        v-for="token in tokens"
        :key="token.name"
      >
        <Table.Cell principal>
          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
            <TokenSample
              v-if="!paired"
              :name="token.name"
              :sample="sample"
            />
            <CopyChip :value="token.name" />
          </span>
        </Table.Cell>
        <Table.Cell v-if="withClass">
          <CopyChip
            v-if="tailwindClass(token.name, kind)"
            :value="tailwindClass(token.name, kind)"
          />
          <span
            v-else
            class="text-body-sm text-(--text-muted)"
            >—</span
          >
        </Table.Cell>
        <Table.Cell
          key="usage-cell"
          v-if="withUsage"
        >
          <span
            v-if="token.usage"
            class="flex min-w-0 flex-col gap-(--spacing-xxs)"
          >
            <span class="text-body-sm text-(--text-default)">{{ token.usage.job }}</span>
            <span class="text-body-xs text-(--text-muted)">
              {{ t.usedBy }}: <InlineCode :text="token.usage.usedBy" />
            </span>
          </span>
          <span
            v-else
            class="text-body-sm text-(--text-muted)"
            >—</span
          >
        </Table.Cell>
        <template v-if="paired">
          <Table.Cell
            v-for="mode in ['light', 'dark'] as const"
            :key="mode"
          >
            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
              <TokenSample
                :name="token.name"
                :sample="sample"
                :theme="mode"
              />
              <code class="min-w-0 break-all text-label-code-sm text-(--text-muted)">{{
                (mode === 'light' ? token.value : token.dark) ?? token.value
              }}</code>
            </span>
          </Table.Cell>
        </template>
        <Table.Cell
          key="value-cell"
          v-else
        >
          <code class="min-w-0 break-all text-label-code-sm text-(--text-muted)">{{
            token.value
          }}</code>
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
</template>
