<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import CodeBlock from '../../code/code-block/code-block.vue'
  import MarkdownInline from '../_lib/markdown-inline'
  import { parseMarkdown } from '../_lib/parse-markdown'
  import type { AiSource } from '../sources/types'

  defineOptions({
    name: 'StreamingResponse',
    inheritAttrs: false
  })

  interface Props {
    /** The model's Markdown so far. Parsed into elements, never injected as HTML: raw tags render as text and only http(s), mailto, relative and hash links survive. */
    content?: string
    /** Tokens are still arriving: shows the caret, marks the region busy and keeps an unclosed code fence as plain text until it closes. */
    streaming?: boolean
    /** Sources the `[n]` citations in the content resolve against (title in the tooltip and the accessible name). */
    sources?: AiSource[]
    /** The `anchor` of the `Sources` list under the response; citations link to its items. Empty renders unlinked numbers. */
    anchor?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    content: '',
    streaming: false,
    sources: () => [],
    anchor: ''
  })

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'ai-streaming-response'
  )
  const blocks = computed(() => parseMarkdown(props.content))
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
    class="flex w-full min-w-0 flex-col gap-(--spacing-sm) text-body-md text-(--text-default) break-words"
  >
    <template
      v-for="(block, i) in blocks"
      :key="i"
    >
      <p
        v-if="block.type === 'paragraph'"
        class="m-0"
      >
        <MarkdownInline
          :nodes="block.children"
          :sources="sources"
          :anchor="anchor"
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
        class="m-0 text-(--text-default) data-[level='3']:text-heading-sm data-[level='4']:text-heading-xs data-[level='5']:text-heading-xxs data-[level='6']:text-label-md"
      >
        <MarkdownInline
          :nodes="block.children"
          :sources="sources"
          :anchor="anchor"
        /><span
          v-if="streaming && i === lastIndex"
          aria-hidden="true"
          :data-testid="`${testId}__caret`"
          class="ms-0.5 inline-block h-[1em] w-[0.5ch] translate-y-[0.15em] bg-(--text-default) animate-blink motion-reduce:animate-none"
        />
      </component>
      <component
        :is="block.ordered ? 'ol' : 'ul'"
        v-else-if="block.type === 'list'"
        :start="block.ordered && block.start !== 1 ? block.start : undefined"
        :data-ordered="block.ordered || null"
        class="m-0 flex list-disc flex-col gap-(--spacing-xxs) ps-(--spacing-lg) data-[ordered]:list-decimal"
      >
        <li
          v-for="(item, j) in block.items"
          :key="j"
        >
          <MarkdownInline
            :nodes="item"
            :sources="sources"
            :anchor="anchor"
          />
        </li>
      </component>
      <CodeBlock
        v-else-if="block.type === 'code' && (block.closed || !streaming)"
        :tabs="[
          { label: block.language, value: 'code', code: block.value, language: block.language }
        ]"
        :show-line-numbers="false"
        dir="ltr"
      />
      <pre
        v-else-if="block.type === 'code'"
        dir="ltr"
        :data-testid="`${testId}__pending-code`"
        class="m-0 overflow-x-auto rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-sm) text-body-code text-(--text-default)"
        >{{ block.value }}</pre>
      <blockquote
        v-else-if="block.type === 'quote'"
        class="m-0 border-s-2 border-(--border-strong) ps-(--spacing-sm) text-(--text-muted)"
      >
        <MarkdownInline
          :nodes="block.children"
          :sources="sources"
          :anchor="anchor"
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
                  :anchor="anchor"
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
                  :anchor="anchor"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr
        v-else-if="block.type === 'rule'"
        class="m-0 border-0 border-t border-(--border-default)"
      />
    </template>
    <span
      v-if="streaming && !caretInline"
      aria-hidden="true"
      :data-testid="`${testId}__caret`"
      class="inline-block h-[1em] w-[0.5ch] bg-(--text-default) animate-blink motion-reduce:animate-none"
    />
  </div>
</template>
