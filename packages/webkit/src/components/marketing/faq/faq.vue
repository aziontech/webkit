<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import Accordion from '../../content/accordion/accordion.vue'
  import AccordionContent from '../../content/accordion/accordion-content/accordion-content.vue'
  import AccordionItem from '../../content/accordion/accordion-item/accordion-item.vue'
  import AccordionTrigger from '../../content/accordion/accordion-trigger/accordion-trigger.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'

  defineOptions({
    name: 'Faq',
    inheritAttrs: false
  })

  /** One question and the answer that resolves it. */
  export type FaqItem = {
    /** Stable key of the item, owned by the accordion's open-state model. */
    value: string
    /** The question, written as the reader would ask it. */
    question: string
    /** The answer, rendered in the disclosure panel unless the answer slot replaces it. */
    answer: string
  }

  interface Props {
    /** Headline of the band, rendered as its h2 in the left column. */
    title?: string
    /** The questions and their answers, in order; each item is a value, a question, and an answer, where the value is the item's stable key. */
    items?: FaqItem[]
    /** Draw the band's own registration frame. Turn it off when the page already wraps the band in a frame. */
    framed?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    items: () => [],
    framed: false
  })

  defineSlots<{
    /** Replaces the rendered answer for every item, so an answer can carry a link or richer content. */
    answer(props: { item: FaqItem }): unknown
  }>()

  const attrs = useAttrs()
  const headingId = useId()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'marketing-faq')

  const hasItems = computed(() => props.items.length > 0)

  const hasHeading = computed(() => hasItems.value && props.title.length > 0)

  const frame = computed(() => (props.framed ? FrameBox : 'div'))
  const frameProps = computed(() =>
    props.framed ? { flush: true, borders: 'y', marks: 'bottom' } : {}
  )
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :aria-labelledby="hasHeading ? headingId : undefined"
  >
    <component
      :is="frame"
      v-if="hasItems"
      v-bind="frameProps"
    >
      <div
        class="grid gap-px bg-(--border-default) [--accordion-inset:var(--spacing-lg)] lg:grid-cols-3 lg:[--accordion-inset:var(--spacing-xl)]"
      >
        <div class="bg-(--bg-canvas) px-(--accordion-inset) py-(--spacing-md)">
          <h2
            v-if="hasHeading"
            :id="headingId"
            class="m-0 mt-(--spacing-md) text-balance text-heading-lg text-(--text-default)"
          >
            {{ title }}
          </h2>
        </div>

        <div class="bg-(--bg-canvas) lg:col-span-2">
          <Accordion
            type="single"
            collapsible
            size="large"
          >
            <AccordionItem
              v-for="(item, index) in items"
              :key="item.value"
              :value="item.value"
              :class="[
                'border-(--border-default) data-[state=open]:border-b',
                index === items.length - 1 && 'border-b-0 data-[state=open]:border-b-0'
              ]"
            >
              <AccordionTrigger
                class="border-b-0! py-(--spacing-md) data-[state=open]:min-h-0 data-[state=open]:pb-0"
              >
                <span class="text-body-md text-(--text-default)">{{ item.question }}</span>
              </AccordionTrigger>
              <AccordionContent>
                <p
                  class="m-0 max-w-(--container-2xl) px-(--accordion-inset) pt-(--spacing-xs) pb-(--spacing-md) text-body-sm text-(--text-muted)"
                >
                  <slot
                    name="answer"
                    :item="item"
                  >
                    {{ item.answer }}
                  </slot>
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </component>
  </section>
</template>
