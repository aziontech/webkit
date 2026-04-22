<template>
  <div
    class="data-table-view-all-footer flex items-center justify-center py-3"
    data-testid="data-table-view-all-footer"
  >
    <span
      class="text-xs font-normal text-[var(--text-color-link)] hover:underline cursor-pointer"
      data-testid="data-table-view-all-footer-link"
      @click.stop="emit('click')"
      @keydown.enter.stop="emit('click')"
      @keydown.space.prevent.stop="emit('click')"
      tabindex="0"
      role="button"
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

<style scoped>
  .data-table-view-all-footer {
    background: var(--surface-section);
    border-radius: 0 0 6px 6px;
    border-top: 1px solid var(--surface-border);
    margin: -1.25rem -1.25rem -0.75rem;
    padding: 0.75rem;
  }
</style>
