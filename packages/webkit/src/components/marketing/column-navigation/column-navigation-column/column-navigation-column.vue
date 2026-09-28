<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  defineOptions({
    name: 'ColumnNavigationColumn',
    inheritAttrs: false
  })

  interface Props {
    /** The column's overline heading, which also names its list of rows. */
    title?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    title: ''
  })

  defineSlots<{
    /** The column's rows, composed as `ColumnNavigation.Item` elements. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-column-navigation-column'
  )

  const headingId = useId()
  // An untitled column has no heading to name its list with.
  const listLabelledBy = computed(() => (props.title ? headingId : undefined))
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex min-w-0 flex-col bg-(--bg-canvas)"
  >
    <div
      v-if="title"
      class="flex items-center border-b border-(--border-default) p-(--spacing-lg)"
    >
      <span
        :id="headingId"
        :data-testid="`${testId}__title`"
        class="text-overline-md font-medium uppercase text-(--primary)"
        >{{ title }}</span
      >
    </div>

    <!-- The reset strips the bullets, which also strips list semantics in Safari;
         the explicit role is what keeps the group and its length announced. -->
    <ul
      role="list"
      :aria-labelledby="listLabelledBy"
      :data-testid="`${testId}__list`"
      class="flex flex-col gap-(--spacing-lg) p-(--spacing-lg)"
    >
      <slot />
    </ul>
  </div>
</template>
