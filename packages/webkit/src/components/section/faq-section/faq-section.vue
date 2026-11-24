<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { safeHref } from '../../../utils/safe-href'
  import Module from '../../layout/module/module.vue'
  import Faq from '../../marketing/faq/faq.vue'

  defineOptions({
    name: 'FaqSection',
    inheritAttrs: false
  })

  /** One question and the answer that resolves it. */
  export type FaqSectionItem = {
    /** The question, written as the reader would ask it. */
    question: string
    /** The answer as markdown: paragraphs split by a blank line, `- ` bullet lists, and inline `[label](href)` links, `**bold**` and `*italic*` text. */
    answer: string
  }

  export interface FaqSectionProps {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Headline of the band, rendered by the FAQ as its `h2` in the left column. */
    title?: string
    /** The questions in display order; each is `{ question, answer }` where `answer` is markdown carrying paragraphs, bullet lists, links, bold and italic text. */
    items?: FaqSectionItem[]
  }

  const props = withDefaults(defineProps<FaqSectionProps>(), {
    anchor: '',
    title: '',
    items: () => []
  })

  type AnswerRun = {
    text: string
    href?: string
    external?: boolean
    strong?: boolean
    emphasis?: boolean
  }

  type AnswerBlock = {
    list: boolean
    entries: AnswerRun[][]
  }

  const INLINE_MARKDOWN = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g

  const EXTERNAL_HREF = /^https?:\/\//

  const BLOCK_BREAK = /\n[ \t]*\n/

  const LIST_ITEM = /^[ \t]*- (.*)$/

  const attrs = useAttrs()

  const { t } = useTranslate({ common: en.common })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'faq-section')

  const runsOf = (answer: string): AnswerRun[] => {
    const runs: AnswerRun[] = []
    let cursor = 0
    for (const match of answer.matchAll(INLINE_MARKDOWN)) {
      const start = match.index ?? 0
      if (start > cursor) runs.push({ text: answer.slice(cursor, start) })
      const [whole, label, href, strong, emphasis] = match
      const linkHref = href === undefined ? null : safeHref(href)
      if (label !== undefined && linkHref !== null) {
        runs.push({ text: label, href: linkHref, external: EXTERNAL_HREF.test(linkHref) })
      } else if (label !== undefined) {
        runs.push({ text: label })
      } else if (strong !== undefined) {
        runs.push({ text: strong, strong: true })
      } else {
        runs.push({ text: emphasis ?? whole, emphasis: true })
      }
      cursor = start + whole.length
    }
    if (cursor < answer.length) runs.push({ text: answer.slice(cursor) })
    return runs
  }

  const blocksOf = (answer: string): AnswerBlock[] => {
    const blocks: AnswerBlock[] = []
    for (const chunk of answer.split(BLOCK_BREAK)) {
      let paragraph: string[] = []
      let list: AnswerBlock | null = null
      const flush = () => {
        const text = paragraph.join('\n').trim()
        if (text) blocks.push({ list: false, entries: [runsOf(text)] })
        paragraph = []
      }
      for (const line of chunk.split('\n')) {
        const entry = LIST_ITEM.exec(line)
        if (entry) {
          flush()
          if (!list) {
            list = { list: true, entries: [] }
            blocks.push(list)
          }
          list.entries.push(runsOf(entry[1]!.trim()))
        } else {
          list = null
          paragraph.push(line)
        }
      }
      flush()
    }
    return blocks
  }

  const faqItems = computed(() =>
    props.items.map((item, index) => ({
      value: `faq-${index + 1}`,
      question: item.question,
      answer: item.answer
    }))
  )

  const answersByValue = computed(
    () =>
      new Map(
        faqItems.value.map((item) => {
          const blocks = blocksOf(item.answer)
          const flat = blocks.length === 0 || (blocks.length === 1 && !blocks[0]!.list)
          return [item.value, { flat, runs: flat ? (blocks[0]?.entries[0] ?? []) : [], blocks }]
        })
      )
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    class="scroll-mt-(--spacing-2xl)"
  >
    <Module
      v-if="items.length > 0"
      :divided="false"
      :padded="false"
    >
      <Faq
        framed
        :title="title"
        :items="faqItems"
      >
        <template #answer="{ item }">
          <p v-if="answersByValue.get(item.value)?.flat ?? true">
            <template
              v-for="(run, runIndex) in answersByValue.get(item.value)?.runs ?? []"
              :key="runIndex"
            >
              <a
                v-if="run.href"
                :href="run.href"
                :target="run.external ? '_blank' : undefined"
                :rel="run.external ? 'noopener noreferrer' : undefined"
                class="text-link"
                >{{ run.text
                }}<span
                  v-if="run.external"
                  class="sr-only"
                  >{{ ' ' + t('common.newTab') }}</span
                ></a
              >
              <strong v-else-if="run.strong">{{ run.text }}</strong>
              <em v-else-if="run.emphasis">{{ run.text }}</em>
              <template v-else>{{ run.text }}</template>
            </template>
          </p>
          <span
            v-else
            class="flex flex-col gap-(--spacing-sm)"
          >
            <span
              v-for="(block, blockIndex) in answersByValue.get(item.value)?.blocks ?? []"
              :key="blockIndex"
              :role="block.list ? 'list' : undefined"
              :data-list="block.list || null"
              class="block data-[list]:space-y-(--spacing-2xs) data-[list]:ps-(--spacing-lg)"
            >
              <span
                v-for="(entry, entryIndex) in block.entries"
                :key="entryIndex"
                :role="block.list ? 'listitem' : undefined"
                :data-list="block.list || null"
                class="block data-[list]:list-item data-[list]:list-disc"
              >
                <template
                  v-for="(run, runIndex) in entry"
                  :key="runIndex"
                >
                  <a
                    v-if="run.href"
                    :href="run.href"
                    :target="run.external ? '_blank' : undefined"
                    :rel="run.external ? 'noopener noreferrer' : undefined"
                    class="text-link"
                    >{{ run.text
                    }}<span
                      v-if="run.external"
                      class="sr-only"
                      >{{ ' ' + t('common.newTab') }}</span
                    ></a
                  >
                  <strong v-else-if="run.strong">{{ run.text }}</strong>
                  <em v-else-if="run.emphasis">{{ run.text }}</em>
                  <template v-else>{{ run.text }}</template>
                </template>
              </span>
            </span>
          </span>
        </template>
      </Faq>
    </Module>
  </div>
</template>
