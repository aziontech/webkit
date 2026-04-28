<script setup>
  import { computed, useSlots } from 'vue'

  defineOptions({ name: 'CardBox' })

  defineProps({
    title: {
      type: String,
      required: true
    }
  })

  const slots = useSlots()
  const hasFooterSlot = computed(() => !!slots.footer)
  const hasHeaderActionSlot = computed(() => !!slots['header-action'])
</script>

<template>
  <div class="border border-default rounded-md flex flex-col">
    <div
      class="rounded-t-md group bg-[var(--table-header-cell-bg)] dark:bg-surface-700 border-b border-default px-4 py-1.5 h-11 flex items-center justify-between overflow-visible"
    >
      <h2 class="text-body-md font-semibold text-default">{{ title }}</h2>
      <div
        v-if="hasHeaderActionSlot"
        class="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <slot name="header-action" />
      </div>
    </div>

    <div class="flex-1 bg-[var(--card-content-bg)]">
      <slot name="content" />
    </div>

    <div
      v-if="hasFooterSlot"
      class="border-t border-default bg-[var(--table-header-cell-bg)] flex items-center justify-center px-4 py-3 rounded-b-md"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
