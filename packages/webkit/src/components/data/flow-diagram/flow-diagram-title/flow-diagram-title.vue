<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { safeHref } from '../../../../utils/safe-href'

  defineOptions({
    name: 'FlowDiagramTitle',
    inheritAttrs: false
  })

  export interface FlowDiagramTitleProps {
    /** Links the title to the resource page; an open glyph follows it. */
    href?: string
  }

  withDefaults(defineProps<FlowDiagramTitleProps>(), {
    href: ''
  })

  defineSlots<{
    /** The title text. */
    default(): unknown
    /** Controls at the end of the title row, such as an add or bind button. */
    actions(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'flow-diagram-title'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    data-slot="flow-diagram-title"
    :data-testid="testId"
    class="flex min-h-11 min-w-0 items-center gap-(--spacing-xs) px-(--spacing-md) pt-(--spacing-2xs) pb-(--spacing-sm)"
  >
    <a
      v-if="safeHref(href)"
      :href="safeHref(href) ?? undefined"
      :data-testid="`${testId}__link`"
      class="group/link inline-flex min-w-0 items-center gap-(--spacing-2xs) rounded-(--shape-control) text-label-md text-(--text-default) outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
    >
      <span
        dir="auto"
        class="min-w-0 truncate underline-offset-2 group-hover/link:underline"
        ><slot
      /></span>
      <i
        class="az az-external-link shrink-0 text-body-xs leading-none"
        aria-hidden="true"
      />
    </a>
    <span
      v-else
      dir="auto"
      class="min-w-0 truncate text-label-md text-(--text-default)"
      ><slot
    /></span>
    <span
      v-if="$slots['actions']"
      data-slot="flow-diagram-title-actions"
      :data-testid="`${testId}__actions`"
      class="ms-auto flex empty:hidden shrink-0 items-center gap-(--spacing-2xs)"
    >
      <slot name="actions" />
    </span>
  </div>
</template>
