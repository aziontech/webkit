<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import Separator from '../../../layout/separator/separator.vue'

  defineOptions({
    name: 'HelpPanelLinks',
    inheritAttrs: false
  })

  interface Props {
    /** The heading over the links. */
    title?: string
  }

  withDefaults(defineProps<Props>(), {
    title: 'Learn more'
  })

  defineSlots<{
    /** Link items, one per destination. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const headingId = useId()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-help-panel-links'
  )
</script>

<template>
  <section
    v-bind="$attrs"
    :aria-labelledby="title ? headingId : undefined"
    :data-testid="testId"
    class="flex w-full flex-col gap-(--spacing-lg)"
  >
    <Separator />
    <div class="flex w-full flex-col gap-(--spacing-xs)">
      <h3
        v-if="title"
        :id="headingId"
        class="text-heading-xxs text-(--text-default)"
      >
        {{ title }}
      </h3>
      <div class="flex flex-col items-start gap-(--spacing-xxs)">
        <slot />
      </div>
    </div>
  </section>
</template>
