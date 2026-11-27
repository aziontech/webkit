<script setup lang="ts">
  import type { Slot } from 'vue'

  import SlotOutlet from './slot-outlet'

  defineOptions({ name: 'TableToolbarBand' })

  withDefaults(
    defineProps<{
      testId: string
      title?: Slot
      toolbar?: Slot
      scope?: Record<string, unknown>
    }>(),
    { title: undefined, toolbar: undefined, scope: () => ({}) }
  )
</script>

<template>
  <div
    v-if="title || toolbar"
    role="presentation"
    :data-testid="`${testId}__toolbar`"
    class="flex flex-wrap items-center gap-(--spacing-xs) border-b-(length:--border-width-default) border-solid border-(--border-default) p-(--spacing-sm)"
  >
    <div
      v-if="title"
      class="text-label-md text-(--text-default)"
    >
      <SlotOutlet
        :slots="{ title }"
        name="title"
      />
    </div>
    <div
      v-if="toolbar"
      class="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-(--spacing-xs) @max-md/table:basis-full @max-md/table:justify-start"
    >
      <SlotOutlet
        :slots="{ toolbar }"
        name="toolbar"
        :scope="scope"
      />
    </div>
  </div>
</template>
