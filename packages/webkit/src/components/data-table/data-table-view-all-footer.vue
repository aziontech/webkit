<template>
  <div
    class="data-table-view-all-footer flex items-center justify-center py-3 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors"
    data-testid="data-table-view-all-footer"
    @click="emit('click')"
  >
    <span
      class="text-xs font-normal text-[var(--text-color-link)] hover:underline"
      data-testid="data-table-view-all-footer-link"
    >
      {{ label }}
    </span>
  </div>
</template>

<script setup>
  defineOptions({ name: 'DataTableViewAllFooter' })

  defineProps({
    link: {
      type: [String, Object],
      default: ''
    },
    label: {
      type: String,
      default: 'View all...'
    }
  })

  const emit = defineEmits(['click'])
</script>
