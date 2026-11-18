<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  defineOptions({
    name: 'LinkDirectoryColumn',
    inheritAttrs: false
  })

  export interface LinkDirectoryColumnProps {
    /** The column's overline heading, which also names its list of rows. */
    title?: string
  }

  const props = withDefaults(defineProps<LinkDirectoryColumnProps>(), {
    title: ''
  })

  defineSlots<{
    /** The column's rows, composed as `LinkDirectory.Item` elements. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'link-directory-column'
  )

  const headingId = useId()
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
        class="text-overline-md font-medium uppercase text-(--text-brand)"
        >{{ title }}</span
      >
    </div>

    <ul
      role="list"
      :aria-labelledby="listLabelledBy"
      :data-testid="`${testId}__list`"
      class="flex flex-col p-(--spacing-lg)"
    >
      <slot />
    </ul>
  </div>
</template>
