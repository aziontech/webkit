<script setup lang="ts">
  import { computed, useAttrs, useSlots } from 'vue'

  import Accordion from '../../content/accordion/accordion.vue'
  import AccordionContent from '../../content/accordion/accordion-content/accordion-content.vue'
  import AccordionItem from '../../content/accordion/accordion-item/accordion-item.vue'
  import AccordionTrigger from '../../content/accordion/accordion-trigger/accordion-trigger.vue'
  import { flattenSlot } from '../doc-frame/flatten-slot'

  defineOptions({ name: 'DocAccordionGroup', inheritAttrs: false })

  interface Props {
    /** Whether one or several entries can be open at once. */
    type?: 'single' | 'multiple'
  }

  const props = withDefaults(defineProps<Props>(), { type: 'single' })

  defineSlots<{
    /** The `DocAccordionItem` children, in order. */
    default(): unknown
  }>()

  const slots = useSlots()
  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'documentation-doc-accordion-group'
  )

  const entries = computed(() =>
    flattenSlot(slots.default?.() ?? []).map((child, position) => {
      const childProps = (child.props ?? {}) as Record<string, unknown>
      const open = childProps.defaultOpen ?? childProps['default-open']
      return {
        value: `entry-${position}`,
        title: String(childProps.title ?? ''),
        open: open === '' || open === true,
        node: child
      }
    })
  )

  const defaultValue = computed(() => {
    const open = entries.value.filter((entry) => entry.open).map((entry) => entry.value)
    if (props.type === 'multiple') return open
    return open[0] ?? ''
  })
</script>

<template>
  <div
    v-bind="$attrs"
    data-doc-block
    :data-testid="testId"
    class="w-full overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
  >
    <Accordion
      :type="type"
      :default-value="defaultValue"
      size="large"
      collapsible
    >
      <AccordionItem
        v-for="entry in entries"
        :key="entry.value"
        :value="entry.value"
        class="last:border-b-0 last:data-[state=closed]:[&_button]:border-b-0"
      >
        <div
          data-doc-chrome
          class="contents"
        >
          <AccordionTrigger
            :level="3"
            class="py-(--spacing-xs) focus-visible:ring-inset [&>span]:text-heading-xs [&>span]:[text-wrap-style:pretty]"
            >{{ entry.title }}</AccordionTrigger
          >
        </div>
        <AccordionContent>
          <div
            class="px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-md) [&>*>*:first-child]:mt-0 [&>*>*:first-child]:pt-0"
          >
            <component :is="entry.node" />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>
