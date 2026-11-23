<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import CodeBlock from '../../code/code-block/code-block.vue'
  import { languageName } from '../../code/code-block/lib/language-name'
  import Separator from '../../layout/separator/separator.vue'
  import MarkdownInline from '../lib/markdown-inline-cited'
  import MarkdownList from '../lib/markdown-list'
  import {
    type MarkdownBlock,
    type MarkdownParse,
    parseMarkdownIncremental
  } from '../lib/parse-markdown'
  import type { SourcesItem } from '../sources/types'

  defineOptions({
    name: 'StreamingResponse',
    inheritAttrs: false
  })

  export interface StreamingResponseProps {
    /** The model's Markdown so far. Parsed into elements, never injected as HTML: raw tags render as text and only http(s), mailto, relative and hash links survive. */
    content?: string
    /** Tokens are still arriving: shows the caret, marks the region busy and keeps an unclosed code fence as plain text until it closes. */
    streaming?: boolean
    /** Sources the `[n]`, `[n][m]` and `[n, m]` citations in the content resolve against: each becomes a chip with the site's favicon and name that opens a card of the sources it cites. */
    sources?: SourcesItem[]
  }

  const props = withDefaults(defineProps<StreamingResponseProps>(), {
    content: '',
    streaming: false,
    sources: () => []
  })

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'streaming-response'
  )
  let parsed: MarkdownParse | undefined

  const blocks = computed<MarkdownBlock[]>(() => {
    parsed = parseMarkdownIncremental(props.content, parsed)
    return parsed.blocks
  })
  const lastIndex = computed<number>(() => blocks.value.length - 1)
  const caretInline = computed<boolean>(() => {
    const last = blocks.value[lastIndex.value]
    return Boolean(last && (last.type === 'paragraph' || last.type === 'heading'))
  })
</script>

<template>
  <div
    v-bind="$attrs"
    :aria-busy="streaming || undefined"
    :data-testid="testId"
    :data-streaming="streaming || null"
    data-slot="streaming-response"
    class="flex w-full min-w-0 flex-col gap-(--spacing-md) text-body-lg text-(--text-default) break-words"
  >
    <template
      v-for="(block, i) in blocks"
      :key="i"
      v-memo="[block, streaming, i === lastIndex, sources, testId]"
    >
      <p
        v-if="block.type === 'paragraph'"
        class="m-0"
      >
        <MarkdownInline
          :nodes="block.children"
          :sources="sources"
        /><span
          v-if="streaming && i === lastIndex"
          aria-hidden="true"
          :data-testid="`${testId}__caret`"
          class="ms-0.5 inline-block h-[1em] w-[0.5ch] translate-y-[0.15em] bg-(--text-default) animate-blink motion-reduce:animate-none"
        />
      </p>
      <component
        :is="`h${block.level}`"
        v-else-if="block.type === 'heading'"
        :data-level="block.level"
        class="m-0 mt-(--spacing-sm) text-body-lg text-(--text-default) first:mt-0 data-[level]:font-semibold data-[level='3']:text-heading-md"
      >
        <MarkdownInline
          :nodes="block.children"
          :sources="sources"
        /><span
          v-if="streaming && i === lastIndex"
          aria-hidden="true"
          :data-testid="`${testId}__caret`"
          class="ms-0.5 inline-block h-[1em] w-[0.5ch] translate-y-[0.15em] bg-(--text-default) animate-blink motion-reduce:animate-none"
        />
      </component>
      <MarkdownList
        v-else-if="block.type === 'list'"
        :list="block"
        :sources="sources"
      />
      <CodeBlock
        v-else-if="block.type === 'code' && (block.closed || !streaming)"
        :code="block.value"
        :language="block.language"
        :show-line-numbers="false"
        :bordered="false"
        show-label
        dir="ltr"
        class="rounded-(--shape-card) bg-(--bg-surface-raised) [--code-block-max-height:none]"
      />
      <div
        v-else-if="block.type === 'code'"
        dir="ltr"
        :data-testid="`${testId}__pending-code`"
        class="flex flex-col overflow-clip rounded-(--shape-card) bg-(--bg-surface-raised)"
      >
        <div
          class="flex h-10 shrink-0 items-center gap-(--spacing-xs) ps-(--spacing-lg) pe-(--spacing-sm) text-(--text-muted)"
        >
          <i
            class="az az-code text-label-code-sm shrink-0"
            aria-hidden="true"
          />
          <span class="text-label-code-sm min-w-0 flex-1 truncate">{{
            languageName(block.language)
          }}</span>
        </div>
        <pre
          class="m-0 overflow-x-auto px-(--spacing-lg) pb-(--spacing-sm) text-label-code-sm text-(--text-default)"
          >{{ block.value }}</pre>
      </div>
      <blockquote
        v-else-if="block.type === 'quote'"
        class="m-0 border-s-2 border-(--border-strong) ps-(--spacing-sm) text-(--text-muted)"
      >
        <MarkdownInline
          :nodes="block.children"
          :sources="sources"
        />
      </blockquote>
      <div
        v-else-if="block.type === 'table'"
        tabindex="0"
        class="w-full overflow-x-auto rounded-(--shape-card) border border-(--border-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
      >
        <table class="w-full border-collapse text-body-sm">
          <thead class="bg-(--bg-surface-raised)">
            <tr>
              <th
                v-for="(cell, j) in block.header"
                :key="j"
                scope="col"
                class="border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs) text-start text-label-sm text-(--text-default)"
              >
                <MarkdownInline
                  :nodes="cell"
                  :sources="sources"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, r) in block.rows"
              :key="r"
              class="border-b border-(--border-muted) last:border-b-0"
            >
              <td
                v-for="(cell, j) in row"
                :key="j"
                class="px-(--spacing-sm) py-(--spacing-xs) text-(--text-default)"
              >
                <MarkdownInline
                  :nodes="cell"
                  :sources="sources"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Separator v-else-if="block.type === 'rule'" />
    </template>
    <span
      v-if="streaming && !caretInline"
      aria-hidden="true"
      :data-testid="`${testId}__caret`"
      class="inline-block h-[1em] w-[0.5ch] bg-(--text-default) animate-blink motion-reduce:animate-none"
    />
  </div>
</template>
