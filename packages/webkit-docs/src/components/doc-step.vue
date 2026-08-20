<script setup lang="ts">
  /**
   * One numbered step: the circled index, the rail that continues to the next
   * step, the step heading, and any content the author nests underneath.
   *
   * `index` and `last` are set by `DocSteps`, which numbers its children — an
   * author writes `<Step title="…">` and never a number, so reordering the MDX
   * renumbers the page.
   */
  defineOptions({ name: 'DocStep' })

  interface Props {
    /** The step heading. */
    title?: string
    /** 1-based position, assigned by the parent `DocSteps`. */
    index?: number
    /** True for the final step, which drops its connector and trailing space. */
    last?: boolean
  }

  withDefaults(defineProps<Props>(), {
    title: '',
    index: 1,
    last: false
  })

  defineSlots<{
    /** Optional body under the step heading: prose, code, or another component. */
    default(): unknown
  }>()
</script>

<template>
  <div
    data-testid="doc-step"
    :data-last="last || null"
    class="flex w-full items-stretch gap-(--spacing-md)"
  >
    <div class="flex w-8 shrink-0 flex-col items-center">
      <span
        class="flex size-8 shrink-0 items-center justify-center rounded-(--radius-full) border border-(--border-default) bg-(--bg-surface) text-label-md text-(--text-default)"
        aria-hidden="true"
      >
        {{ index }}
      </span>
      <span
        v-if="!last"
        data-step-connector
        class="w-px flex-1 bg-(--border-default)"
        aria-hidden="true"
      />
    </div>
    <div
      :data-last="last || null"
      class="min-w-0 flex-1 pt-(--spacing-xxs) pb-(--spacing-lg) data-[last]:pb-0"
    >
      <span
        data-doc-chrome
        class="block text-heading-xs text-(--text-default)"
        >{{ title }}</span
      >
      <div
        v-if="$slots.default"
        class="pt-(--spacing-sm) [&>*:first-child]:pt-0!"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
